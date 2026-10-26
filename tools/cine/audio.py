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
        x += .25 * np.sin(2 * np.pi * o.get('hum', 87.3) * np.arange(n) / SR) * np.sin(np.pi * p) ** 2   # 低音嗡鸣（默认 F，可按这一期的调换）
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
        fs = o.get('f', [174.61, 261.63, 349.23, 415.3, 523.25])                    # 默认 F 小调；配乐换调时传 f
        x = sum(np.sin(2 * np.pi * f * t + i) * a for i, (f, a) in enumerate(zip(fs, [.5, .35, .3, .22, .12])))
        return pan(lp(x, 2400) * e * .45, 0) * g
    if kind == 'shimmer':
        n = int(3.2 * SR); t = np.arange(n) / SR; x = np.zeros(n)
        for i, f in enumerate(o.get('f', [1396.9, 2093.0, 1661.2, 2489.0, 2793.8])):
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
    if kind == 'slap':                                                     # 钱包落地：皮革拍在地上
        n = int(.5 * SR); t = np.arange(n) / SR
        x = .7 * band(noise(n), 250, 2600) * np.exp(-t / .025) + .6 * np.sin(2 * np.pi * 95 * t) * np.exp(-t / .06)
        return pan(np.tanh(x * 1.5), o.get('pan', 0)) * g
    if kind == 'rain':                                                     # 雨：沙沙的底噪 + 零星的雨滴；muffle：隔着窗户 / 门；fi / fo：淡入淡出
        d = o.get('dur', 6); n = int(d * SR); t = np.arange(n) / SR
        fade = np.clip(np.minimum(t / max(o.get('fi', 1.0), 1e-3), (d - t) / max(o.get('fo', 1.0), 1e-3)), 0, 1)
        def ch():
            x = band(noise(n), 1200, 8000) * .2 + band(noise(n), 250, 1200) * .1
            drops = np.zeros(n); k = rng.integers(0, n, int(d * 35)); drops[k] = rng.uniform(.3, 1, len(k)) * rng.choice([-1, 1], len(k))
            x += band(drops, 1800, 6000) * .9
            return lp(x, 900) * 1.8 if o.get('muffle') else x
        return np.stack([ch(), ch()], 1) * fade[:, None] * g
    if kind == 'crowd':                                                    # 街上：人声嗡嗡 + 车流的低噪；fi / fo 淡入淡出
        d = o.get('dur', 6); n = int(d * SR); t = np.arange(n) / SR
        fade = np.clip(np.minimum(t / max(o.get('fi', 1.0), 1e-3), (d - t) / max(o.get('fo', 1.0), 1e-3)), 0, 1)
        def ch():
            babble = sum(band(noise(n), 300 + 200 * j, 900 + 300 * j) * (.5 + .5 * np.sin(2 * np.pi * (.7 + .3 * j) * t + j)) for j in range(4)) * .12
            return babble + lp(noise(n), 220) * .35 + band(noise(n), 1500, 5000) * .03
        return np.stack([ch(), ch()], 1) * fade[:, None] * g
    if kind == 'honk':                                                     # 汽车喇叭：两个音的方波，短促
        n = int(.55 * SR); t = np.arange(n) / SR; env = np.minimum(1, t / .01) * np.minimum(1, (.55 - t) / .06)
        x = (np.sign(np.sin(2 * np.pi * 415 * t)) + np.sign(np.sin(2 * np.pi * 523 * t))) * .12 * env
        return pan(lp(x, 3000), o.get('pan', .3)) * g
    if kind == 'birds':                                                    # 清晨的鸟叫：零星的上下滑音
        d = o.get('dur', 6); n = int(d * SR); x = np.zeros(n)
        for _ in range(int(d * 1.6)):
            s0 = int(rng.uniform(0, max(1, d - .5)) * SR); m = int(rng.uniform(.06, .16) * SR); f0 = rng.uniform(2600, 4200)
            tt = np.arange(m) / SR; f = f0 * (1 + rng.choice([-1, 1]) * .35 * tt / tt[-1]); ph = 2 * np.pi * np.cumsum(f) / SR
            x[s0:s0 + m] += np.sin(ph) * np.sin(np.pi * tt / tt[-1]) * rng.uniform(.1, .3)
        fade = np.clip(np.minimum(np.arange(n) / SR / 1.0, (d - np.arange(n) / SR) / 1.0), 0, 1)
        return pan(x * fade, np.sin(np.arange(n) / SR * 1.3) * .6) * g
    if kind == 'bar':                                                      # 柱子升起：上滑的音
        d = o.get('dur', .9); n = int(d * SR); p = np.linspace(0, 1, n)
        x = .35 * sine_sweep(o.get('f0', 330), o.get('f1', 880), n) * np.sin(np.pi * p) ** .5 * (1 - p) ** .3
        return pan(x, o.get('pan', 0)) * g
    # ---- No.51 起（聚餐那期）：日常场景的环境声和小音效
    if kind in ('room', 'chatter', 'night'):                               # 环境声：办公室底噪 / 餐厅里的人声 / 夜里的街；fi / fo 淡入淡出
        d = o.get('dur', 6); n = int(d * SR); t = np.arange(n) / SR
        fade = np.clip(np.minimum(t / max(o.get('fi', 1.0), 1e-3), (d - t) / max(o.get('fo', 1.0), 1e-3)), 0, 1)
        def ch():
            if kind == 'room':                                             # 空调和电脑的嗡嗡声
                return lp(noise(n), 400) * .1 + .02 * np.sin(2 * np.pi * 120 * t) + band(noise(n), 2000, 6000) * .004
            if kind == 'night':                                            # 远处的车流 + 偶尔一辆车从旁边开过去
                x = lp(noise(n), 300) * .1 + band(noise(n), 1500, 6000) * .004
                for _ in range(int(d / 7) + 1):
                    c, w = rng.uniform(.5, d - .5), rng.uniform(1.2, 2.5); x += band(noise(n), 200, 1800) * np.exp(-((t - c) / w) ** 2) * .1
                return x
            # 餐厅：十来个人在说话（像元音的带通噪声 + 一个个音节的起伏，一句一句地停顿），偶尔一阵笑，碗筷碰撞，屋里的底噪
            x = np.zeros(n); k = 100; m = int(d * k) + 2
            for j in range(12):
                f1 = rng.uniform(350, 900); f2 = f1 * rng.uniform(1.8, 2.8)
                v = band(noise(n), f1 * .8, f1 * 1.25) + .6 * band(noise(n), f2 * .85, f2 * 1.15)
                gate = np.zeros(m); i = int(rng.uniform(0, 2) * k)
                while i < m: L = int(rng.uniform(1, 3.5) * k); gate[i:i + L] = 1; i += L + int(rng.uniform(.4, 2.5) * k)
                syl = (.25 + .75 * np.abs(np.sin(np.pi * rng.uniform(3, 6) * np.arange(m) / k + rng.uniform(0, 3)))) * gate
                x += v * np.interp(t, np.arange(m) / k, syl) * rng.uniform(.3, 1)
            for _ in range(int(d / 5)):                                    # 一阵笑：“哈哈哈”
                c = rng.uniform(0, d - 1.2); L = rng.uniform(.6, 1.2); e = ((t > c) & (t < c + L)) * np.abs(np.sin(np.pi * 5 * (t - c))) * np.sin(np.pi * np.clip((t - c) / L, 0, 1))
                x += band(noise(n), 700, 2200) * e * 1.2
            x = lp(x, 3500) * .05
            hits = np.zeros(n); h = rng.integers(0, n, int(d * 1.2)); hits[h] = rng.uniform(.2, .6, len(h))
            ring = np.sin(2 * np.pi * 3200 * np.arange(int(.08 * SR)) / SR) * env_exp(int(.08 * SR), .015)
            x += band(fftconvolve(hits, ring)[:n], 2000, 7000) * .2
            return x + lp(noise(n), 250) * .12
        return np.stack([ch(), ch()], 1) * fade[:, None] * g
    if kind == 'cricket':                                                  # 蛐蛐：尴尬的安静里那种“唧——唧——”，两只，一左一右
        d = o.get('dur', 2.5); n = int(d * SR); out = np.zeros((n, 2))
        for f, period, p in [(4300, .62, -.4), (4650, .81, .45)]:
            x = np.zeros(n); s0 = rng.uniform(0, .3); m = int(.16 * SR); tt = np.arange(m) / SR
            chirp = np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt * 3 / .16) ** 2 * np.sin(np.pi * tt / .16)
            while s0 < d - .2:
                a = int(s0 * SR); L = min(m, n - a); x[a:a + L] += chirp[:L] * .25; s0 += period * rng.uniform(.9, 1.1)
            out += pan(x, p)
        return out * g
    if kind == 'clink':                                                    # 碰杯
        n = int(1.2 * SR); t = np.arange(n) / SR; x = .3 * hp(noise(n), 4000) * np.exp(-t / .003)
        for f, a, tau in [(2650, .5, .25), (3720, .35, .18), (5230, .2, .1), (2810, .4, .22)]: x += a * np.sin(2 * np.pi * f * t) * np.exp(-t / tau)
        return pan(x * .25, .1) * g
    if kind == 'shutter':                                                  # 拍照：快门“咔嚓”
        n = int(.25 * SR); x = np.zeros(n)
        for s0, a in [(0, 1), (.07, .7)]:
            k = int(s0 * SR); tt = np.arange(n - k) / SR; x[k:] += a * band(noise(n - k), 1500, 8000) * np.exp(-tt / .008)
        return pan(x * .5, 0) * g
    if kind == 'pop':                                                      # 小对话框冒出来：短促的“啵”
        n = int(.09 * SR); f = o.get('f', 700); x = .4 * sine_sweep(f, f * 1.6, n) * env_exp(n, .02)
        return pan(x, o.get('pan', 0)) * g
    if kind == 'lowbat':                                                   # 手机没电：两声往下的提示音
        n = int(.7 * SR); x = np.zeros(n)
        for k, f in enumerate([880, 660]):
            s0 = int(k * .25 * SR); m = int(.18 * SR); tt = np.arange(m) / SR; x[s0:s0 + m] += np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / .005) * np.exp(-tt / .08)
        return pan(x * .35, 0) * g
    if kind == 'door':                                                     # 关门：门撞上门框的闷响 + 锁舌“咔哒”
        n = int(.9 * SR); t = np.arange(n) / SR
        x = .8 * sine_sweep(110, 60, n) * env_exp(n, .09) + .5 * lp(noise(n), 400) * env_exp(n, .05)
        x += hp(noise(n), 2500) * np.exp(-np.maximum(0, t - .09) / .006) * (t >= .09) * .5
        return pan(np.tanh(x * 1.2) * .8, .2) * g
    if kind == 'flop':                                                     # 往沙发上一倒
        n = int(.8 * SR); t = np.arange(n) / SR
        x = .7 * sine_sweep(90, 45, n) * env_exp(n, .12) + .35 * band(noise(n), 200, 2500) * env_exp(n, .08) * np.minimum(1, t / .01)
        return pan(np.tanh(x), 0) * g
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
# 配音（tools/cine/tts.py 写的 voice/*.mp3）：每句放在它开始的时间，配乐和音效在说话时让开（闪避）
vdir = os.path.join(ep, 'voice')
if meta.get('voice') and os.path.exists(os.path.join(vdir, 'index.json')):
    voice = np.zeros((N, 2))
    for name, e in json.load(open(os.path.join(vdir, 'index.json'), encoding='utf-8')).items():
        x = hp(decode(os.path.join(vdir, name))[:, 0], 70)
        k = np.flatnonzero(np.abs(x) > 10 ** (-45 / 20)); x = x[max(0, k[0] - int(.03 * SR)):] if len(k) else x   # 去掉开头的静音，对准字幕
        if meta.get('voices'):                                             # 几个角色几种声音（No.50 起）：每句先拉到一样响
            on = np.abs(x) > 10 ** (-40 / 20); x = x * (.1 / (np.sqrt((x[on] ** 2).mean()) + 1e-9) if on.any() else 1) * (.8 if e.get('kind') == 'think' else 1)
        s = int(e['start'] * SR); x = x[:N - s]; voice[s:s + len(x)] += x[:, None]
    talk = np.convolve(np.abs(voice[:, 0]) > 10 ** (-40 / 20), np.ones(int(.25 * SR)), 'same') > 0      # 说话的区间（含字间小停顿）
    duck = sosfilt(butter(1, 2.5, 'lowpass', fs=SR, output='sos'), talk.astype(float))                 # 平滑：约 0.1 秒压下、0.4 秒回来
    duck = np.clip(duck / max(duck.max(), 1e-9), 0, 1)[:, None]
    voice *= 10 ** (meta['voice'].get('db', -17) / 20) / (np.sqrt((voice[talk] ** 2).mean()) + 1e-9)    # 说话时的 RMS
    mix = music * .9 * (1 - .72 * duck) + sfx * .55 * (1 - .4 * duck) + voice
    under = 20 * np.log10(np.sqrt(((music * .9 * (1 - .72 * duck))[talk] ** 2).mean()) + 1e-9)
    print(f"voice: {meta['voice']['id']}, music under the voice {under - meta['voice'].get('db', -17):+.1f} dB")
peak = np.abs(mix).max()
if peak > .98: mix *= .98 / peak
tmp = os.path.join(ep, 'audio_raw.wav')
import wave
with wave.open(tmp, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
# 响度：先量整段的积分响度，再用一个固定增益拉到 -14 LUFS，前瞻限幅器只压峰值。
# 不用单遍 loudnorm：它是动态的，会像自动增益一样把配乐写好的起伏（安静的段落、最后的高潮）抹平。
import re
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
gain = -14.0 - float(re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1])
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.84:attack=4:release=60:level=disabled',
                '-ar', '48000', os.path.join(ep, 'audio.wav')], check=True)
os.remove(tmp)
m_rms = 20 * np.log10(np.sqrt((music ** 2).mean()) + 1e-9); s_rms = 20 * np.log10(np.sqrt((sfx ** 2).mean()) * .55 + 1e-9)
print(f"wrote {os.path.join(ep, 'audio.wav')}  ({TOTAL:.2f}s, music {m_rms:.1f} dB RMS, sfx {s_rms:.1f} dB RMS, {len(cues['cues'])} cues)")
