"""Build an episode's soundtrack: the edited background music plus synthesized sound effects.

    python tools/cine/audio.py <episode-dir>

Reads <episode-dir>/meta.json ("music": {"src", "segments": [[from, to], ...], "fadeOut"}) and
<episode-dir>/cues.json (written by `node export.cjs --cues cues.json`), and writes <episode-dir>/audio.wav.

Music: the listed segments of the source track are joined back to back (a short fade at each join, so a cut
into a quiet passage lands as a deliberate drop-out), trimmed to the episode length, faded out at the end.
Sound effects are synthesized here (no samples), run through a small synthetic room, and mixed under the music.
"""
import json, os, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
ep = os.path.abspath(sys.argv[1])
meta = json.load(open(os.path.join(ep, 'meta.json'), encoding='utf-8'))
cues = json.load(open(os.path.join(ep, 'cues.json'), encoding='utf-8'))
TOTAL = cues['total']
N = int(TOTAL * SR)
rng = np.random.default_rng(7)


# ------------------------------------------------------------------ music
def decode(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)


src = decode(os.path.join(ep, meta['music']['src']))
parts = []
for i, (a, b) in enumerate(meta['music']['segments']):
    seg = src[int(a * SR):int(b * SR)].copy()
    fi, fo = int(.03 * SR), int(.06 * SR)
    if i > 0: seg[:fi] *= np.linspace(0, 1, fi)[:, None]
    if i < len(meta['music']['segments']) - 1: seg[-fo:] *= np.linspace(1, 0, fo)[:, None]
    parts.append(seg)
lead = int(meta['music'].get('lead', 0) * SR)                      # 音乐前面留空（开头只有音效）
music = np.concatenate([np.zeros((lead, 2))] + parts)[:N]
if len(music) < N: music = np.pad(music, ((0, N - len(music)), (0, 0)))
fo = int(meta['music'].get('fadeOut', 3) * SR)
music[-fo:] *= (np.linspace(1, 0, fo) ** 1.6)[:, None]


# ------------------------------------------------------------------ sound effects
def env_exp(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def ramp(n, a): k = max(1, int(a * SR)); e = np.ones(n); e[:k] = np.linspace(0, 1, k); return e
def band(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def noise(n): return rng.standard_normal(n)
def pan(x, p):                                   # p: -1 左 … 1 右，可以是数组
    p = np.clip(p, -1, 1); return np.stack([x * np.cos((p + 1) * np.pi / 4), x * np.sin((p + 1) * np.pi / 4)], 1)
def sine_sweep(f0, f1, n, curve='exp'):
    t = np.arange(n) / SR; T = n / SR
    f = f0 * (f1 / f0) ** (t / T) if curve == 'exp' else f0 + (f1 - f0) * t / T
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def bell(f, dur=2.4):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, (m, a, tau) in enumerate([(1, 1, 1.4), (2.76, .35, .6), (5.4, .18, .25), (2.0, .12, .9)]):
        x += a * np.sin(2 * np.pi * f * m * t + k) * np.exp(-t / tau)
    return x * ramp(n, .002)
def sweep_noise(dur, f0, f1, shape):            # 带通中心频率随时间移动的噪声
    n = int(dur * SR); x = np.zeros(n); centers = np.geomspace(150, 6000, 9)
    pos = np.geomspace(f0, f1, n)
    for c in centers:
        w = np.exp(-(np.log(pos / c) ** 2) / (2 * .35 ** 2))
        x += band(noise(n), c / 1.4, min(c * 1.4, SR / 2 - 100)) * w
    return x * shape(np.linspace(0, 1, n))


def synth(kind, o):
    g = o.get('gain', .5)
    if kind == 'boom':
        deep = o.get('deep', 0); dur = 2.6 if deep else 1.8; n = int(dur * SR)
        x = sine_sweep(72 if deep else 82, 30 if deep else 40, n) * env_exp(n, .9 if deep else .55)
        x += .5 * lp(noise(n), 160) * env_exp(n, .08)
        x = np.tanh(x * 1.6) / 1.2
        return pan(x * ramp(n, .004), 0) * g
    if kind == 'whoosh':
        d = o.get('dur', .9); x = sweep_noise(d, 300, 4000, lambda p: np.sin(np.pi * p ** .7) ** 2)
        return pan(x * .35, np.linspace(-.6, .6, len(x))) * g
    if kind == 'suck':
        d = o.get('dur', 1.6); x = sweep_noise(d, 4000, 250, lambda p: p ** 2.2)
        return pan(x * .35, np.linspace(.4, 0, len(x))) * g
    if kind == 'air':
        d = o.get('dur', 6); n = int(d * SR); p = np.linspace(0, 1, n)
        x = sweep_noise(d, 1600, 180, lambda p: np.sin(np.pi * p) ** 1.3) * .5
        x += .25 * np.sin(2 * np.pi * 87.3 * np.arange(n) / SR) * np.sin(np.pi * p) ** 2      # 低音 F 的嗡鸣
        return pan(x, np.sin(p * 3) * .4) * g
    if kind == 'riser':
        d = o.get('dur', 1.2); n = int(d * SR); p = np.linspace(0, 1, n)
        x = .6 * sweep_noise(d, 400, 7000, lambda p: p ** 2.4) + .25 * sine_sweep(220, 1760, n) * p ** 3
        return pan(x, 0) * g
    if kind == 'revcym':
        d = o.get('dur', 1.6); n = int(d * SR)
        x = hp(noise(n), 3500) * env_exp(n, .45)[::-1] * .4
        return pan(x, 0) * g
    if kind == 'swell':
        d = o.get('dur', 2); n = int((d + 1.6) * SR); t = np.arange(n) / SR
        e = np.where(t < d, (t / d) ** 2, np.exp(-(t - d) / .6))
        x = sum(np.sin(2 * np.pi * f * t + i) * a for i, (f, a) in enumerate([(174.61, .5), (261.63, .35), (349.23, .3), (415.3, .22), (523.25, .12)]))
        return pan(lp(x, 2400) * e * .45, 0) * g
    if kind == 'shimmer':
        n = int(3.2 * SR); t = np.arange(n) / SR; x = np.zeros(n)
        for i, f in enumerate([1396.9, 2093.0, 1661.2, 2489.0, 2793.8]):
            x += np.sin(2 * np.pi * f * t * (1 + .002 * np.sin(2 * np.pi * (4 + i) * t)) + i) * np.exp(-t / (1.2 + .3 * i)) * (.5 if i else .7)
        x *= ramp(n, .04) * .3
        return np.stack([x, np.roll(x, 240)], 1) * g
    if kind == 'tink':
        x = bell(o['f'], 2.2) * .5; return pan(x, rng.uniform(-.5, .5)) * g
    if kind == 'chord':
        n = int(3.2 * SR); x = np.zeros(n)
        for i, f in enumerate(o['f']):
            b = bell(f, 3.0) * .45; s = int(i * .03 * SR); x[s:s + len(b)] += b[:n - s]
        return pan(x, 0) * g
    if kind == 'thud':
        n = int(.5 * SR); x = sine_sweep(120, 55, n) * env_exp(n, .13) + .3 * band(noise(n), 800, 3000) * env_exp(n, .012)
        return pan(np.tanh(x * 1.4), 0) * g
    if kind == 'crack':
        n = int(1.2 * SR); x = .7 * hp(noise(n), 1500) * env_exp(n, .02)
        imp = np.zeros(n); k = rng.integers(0, int(.35 * SR), 40); imp[k] = rng.uniform(.3, 1, 40) * np.exp(-k / (.12 * SR))
        x += hp(fftconvolve(imp, noise(400) * env_exp(400, .002))[:n], 1200) * .6
        x += .5 * sine_sweep(90, 45, n) * env_exp(n, .3)
        return pan(x, .1) * g
    if kind == 'swish':
        d = o.get('dur', .8); x = sweep_noise(d, 2500, 900, lambda p: np.sin(np.pi * p) ** 2) * .3
        return pan(x, np.linspace(0, -.3, len(x))) * g
    if kind == 'dust':
        d = o.get('dur', 1.5); n = int(d * SR); x = np.zeros(n)
        for _ in range(int(240 * d)):
            s = int(n * rng.random() ** 1.6); L = int(rng.uniform(.003, .012) * SR)
            if s + L < n: x[s:s + L] += noise(L) * np.hanning(L) * rng.uniform(.2, 1)
        x = band(x, 2500, 12000) * .35
        return pan(x, np.linspace(-.2, .7, n)) * g
    if kind == 'click':
        n = int(.08 * SR); t = np.arange(n) / SR
        x = (np.sin(2 * np.pi * 2300 * t) + .6 * np.sin(2 * np.pi * 3400 * t)) * np.exp(-t / .012) + .4 * hp(noise(n), 3000) * np.exp(-t / .004)
        return pan(x * .4, rng.uniform(-.4, .1)) * g
    if kind == 'tick':
        n = int(.06 * SR); t = np.arange(n) / SR
        x = .6 * band(noise(n), 2000, 5000) * np.exp(-t / .004) + .5 * np.sin(2 * np.pi * 1650 * t) * np.exp(-t / .015)
        return pan(x, .15) * g
    if kind == 'ding':                                                     # 手机通知：两声短促的钟音
        n = int(.9 * SR); t = np.arange(n) / SR; f = o.get('f', 1318.5)
        x = np.sin(2 * np.pi * f * t) * np.exp(-t / .16) + .6 * np.sin(2 * np.pi * f * 1.335 * t) * np.exp(-np.maximum(0, t - .09) / .2) * (t > .09)
        x += .2 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / .05)
        return pan(x * ramp(n, .002) * .5, o.get('pan', rng.uniform(-.5, .5))) * g
    if kind == 'drone':                                                    # 越来越紧的低音和噪声
        d = o.get('dur', 2.7); n = int(d * SR); p = np.linspace(0, 1, n); t = np.arange(n) / SR
        f = 55 * 2 ** (p * 1.0); x = .5 * np.sin(2 * np.pi * np.cumsum(f) / SR) + .3 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
        x += .5 * band(noise(n), 300, 2400) * p ** 2
        return pan(np.tanh(x * (.6 + 1.4 * p)) * p ** 1.5 * .7, 0) * g
    if kind == 'stop':                                                     # 所有声音戛然而止：一记短促的“磁带停转”
        n = int(.45 * SR); t = np.arange(n) / SR
        f = 220 * np.exp(-t / .12); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .15)
        return pan(x * .6, 0) * g
    if kind == 'chain':                                                    # 锁链：几声金属碰撞
        n = int(1.2 * SR); x = np.zeros(n)
        for k in range(5):
            s0 = int((k * .11 + rng.uniform(0, .04)) * SR); L = int(.5 * SR); tt = np.arange(L) / SR
            hit = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / d) for f, d in [(2350, .08), (3720, .05), (5100, .03), (1580, .12)])
            x[s0:s0 + L] += hit[:n - s0] * rng.uniform(.4, 1)
        return pan(x * .25, rng.uniform(-.3, .3)) * g
    if kind == 'page':                                                     # 翻书
        n = int(.5 * SR); p = np.linspace(0, 1, n)
        x = band(noise(n), 1200, 7000) * np.sin(np.pi * p) ** 3 * .5
        return pan(x, np.linspace(-.4, .4, n)) * g
    if kind == 'creak':                                                    # 拉弓：绷紧的低沉摩擦
        d = o.get('dur', 2.8); n = int(d * SR); p = np.linspace(0, 1, n); t = np.arange(n) / SR
        x = band(noise(n), 180, 900) * (.3 + .7 * p) * (1 + .5 * np.sin(2 * np.pi * 23 * t))
        x += .3 * np.sin(2 * np.pi * np.cumsum(90 + 140 * p) / SR) * p
        return pan(x * .35 * p ** .8, -.2) * g
    if kind == 'arrow':                                                    # 箭离弦：短促的高频呼啸 + 弦的回弹
        n = int(1.1 * SR); t = np.arange(n) / SR
        x = sweep_noise(1.1, 6000, 1500, lambda p: np.exp(-p * 4) * np.minimum(1, p * 40)) * .5
        x += .5 * np.sin(2 * np.pi * 110 * t) * np.exp(-t / .08)
        return pan(x, np.linspace(-.5, .7, n)) * g
    if kind == 'thunk':                                                    # 箭射中靶子
        n = int(.6 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * 160 * t) * np.exp(-t / .07) + .5 * band(noise(n), 400, 2500) * np.exp(-t / .02)
        x += .3 * np.sin(2 * np.pi * 47 * t * (1 + 3 * np.exp(-t / .05))) * np.exp(-t / .12)
        return pan(np.tanh(x * 1.3), .4) * g
    if kind == 'wind':                                                     # 风
        d = o.get('dur', 6); n = int(d * SR); p = np.linspace(0, 1, n); t = np.arange(n) / SR
        gust = .55 + .45 * np.sin(2 * np.pi * .35 * t + 1) * np.sin(2 * np.pi * .13 * t)
        x = sweep_noise(d, 500, 900, lambda p: np.sin(np.pi * p) ** .6) * gust * .45
        return pan(x, np.sin(2 * np.pi * .2 * t) * .6) * g
    raise ValueError(kind)


sfx = np.zeros((N + 6 * SR, 2))
for t, kind, o in cues['cues']:
    s = int(t * SR); x = synth(kind, o)
    if s < 0: x, s = x[-s:], 0                                            # 开始于第一帧之前的音效，只留下后半截
    sfx[s:s + len(x)] += x[:len(sfx) - s]
# 一个合成的小房间：衰减的噪声做脉冲响应，左右不相关
ir_n = int(2.2 * SR); ir = np.stack([noise(ir_n), noise(ir_n)], 1) * env_exp(ir_n, .55)[:, None]
ir = np.stack([lp(ir[:, 0], 5000), lp(ir[:, 1], 5000)], 1); ir /= np.sqrt((ir ** 2).sum(0))
wet = np.stack([fftconvolve(sfx[:, c], ir[:, c])[:len(sfx)] for c in range(2)], 1)
sfx = (sfx + .32 * wet)[:N]

mix = music * .9 + sfx * .55
peak = np.abs(mix).max()
if peak > .98: mix *= .98 / peak
tmp = os.path.join(ep, 'audio_raw.wav')
import wave
with wave.open(tmp, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', os.path.join(ep, 'audio.wav')], check=True)
os.remove(tmp)
m_rms = 20 * np.log10(np.sqrt((music ** 2).mean()) + 1e-9); s_rms = 20 * np.log10(np.sqrt((sfx ** 2).mean()) * .55 + 1e-9)
print(f"wrote {os.path.join(ep, 'audio.wav')}  ({TOTAL:.2f}s, music {m_rms:.1f} dB RMS, sfx {s_rms:.1f} dB RMS, {len(cues['cues'])} cues)")
