"""Soft background score + sound effects for the spotlight-effect short, locked to index.html's timeline.

    node export.cjs --cues cues.json     (cue sheet + section/line timings from the page)
    python music.py                      -> music.wav

Quiet by design: it sits under a voiceover that is added later, so it stays sparse and is mixed to about -20 LUFS.
"""
import json, os, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

here = os.path.dirname(os.path.abspath(__file__))
CUE = json.load(open(os.path.join(here, 'cues.json'), encoding='utf-8'))
SR = 44100
TOTAL = CUE['total']
N = int((TOTAL + 2) * SR)
rng = np.random.default_rng(5)
mus = np.zeros((2, N), np.float32)
sfx = np.zeros((2, N), np.float32)
SEC = {s['name']: s for s in CUE['sections']}


def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def tv(d): return np.arange(int(d * SR)) / SR
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)


def put(bus, sig, t0, gain=1.0, pan=0.0):
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    i = int(t0 * SR)
    if i < 0: sig, i = sig[-i:], 0
    n = min(len(sig), N - i)
    if n <= 0: return
    bus[0, i:i + n] += (sig[:n] * np.cos(a) * 1.414 * gain).astype(np.float32)
    bus[1, i:i + n] += (sig[:n] * np.sin(a) * 1.414 * gain).astype(np.float32)


def pad(t0, notes, dur, gain=.05):
    t = tv(dur + 2.5)
    env = np.clip(t / 1.2, 0, 1) * np.clip((dur + 2.5 - t) / 2.5, 0, 1)
    for j, m in enumerate(notes):
        f = midi(m)
        x = sum(np.sin(2 * np.pi * f * (1 + d) * t + j) for d in (-.003, 0, .003)) / 3
        x += .3 * np.sin(2 * np.pi * 2 * f * t) + .12 * np.sin(2 * np.pi * 3 * f * t)
        put(mus, lp(x * env, 1800), t0, gain / len(notes) * 2.2, pan=(j - len(notes) / 2) * .25)


def piano(t0, m, gain=.06, pan=0.0):
    t = tv(3.5); f = midi(m)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.6 + k * .9)) for k, a in ((1, 1), (2, .45), (3, .2), (4, .08)))
    x *= np.clip(t / .004, 0, 1)
    put(mus, x, t0, gain, pan)


def sub(t0, m, dur, gain=.07):
    t = tv(dur); x = np.sin(2 * np.pi * midi(m) * t) * np.clip(t / .3, 0, 1) * np.clip((dur - t) / .8, 0, 1)
    put(mus, x, t0, gain)


# ---- score: C major, Am – F – C – G, one chord per 2.6 s; sparse arpeggios, fuller in the middle, warm at the end
CH = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]
STEP = 2.6
ARP = [0, 2, 1, 2]
t, k = 0.0, 0
s_hook, s_exp, s_soc, s_end = SEC['钩子'], SEC['实验'], SEC['社会现象'], SEC['金句']
while t < TOTAL - 1:
    root, ch = CH[k % 4]
    pad(t, [n + 12 for n in ch], STEP, gain=.045 if t > s_hook['t1'] else .025)
    if t > s_hook['t1'] - .2:
        sub(t, root - 12, STEP + .3)
    if t > s_hook['t1'] - .2:                                      # arpeggio from the second section on
        dens = 4 if s_exp['t0'] <= t < s_soc['t1'] else 2
        for i in range(dens):
            n = ch[ARP[i % 4]] + 24
            piano(t + i * STEP / dens, n, gain=.05 if dens == 2 else .04, pan=(-.3, .3)[i % 2])
    else:
        piano(t + .2, ch[2] + 24, gain=.035)
    t += STEP; k += 1
# soft heartbeat under the experiment's reveal
for tt in np.arange(s_exp['t0'] + 2, s_exp['t1'] - .5, 60 / 66):
    for d, g in ((0, 1), (.18, .6)):
        x = np.sin(2 * np.pi * 52 * tv(.25)) * np.exp(-tv(.25) * 18)
        put(mus, x, tt + d, .16 * g)
# a final resolving chord on C major
pad(TOTAL - 4.5, [60, 64, 67, 72], 3.5, gain=.06)
for i, n in enumerate([72, 76, 79, 84]):
    piano(TOTAL - 4.4 + i * .18, n, gain=.045, pan=(-.3, .3)[i % 2])


# ---- sound effects from the page's cue sheet
def whoosh(o):
    d = .6; t = tv(d); x = rng.standard_normal(len(t))
    env = np.sin(np.pi * t / d) ** 2
    lo = hp(lp(x, 2600), 300 if not o.get('down') else 150)
    return lo * env * .5


def fx(name, o):
    p = o.get('pitch', 1.0)
    if name == 'spot':
        t = tv(.35); c = rng.standard_normal(int(.006 * SR)) * np.linspace(1, 0, int(.006 * SR))
        x = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) * .9; x[:len(c)] += hp(c, 2000) * .8
        return x
    if name == 'whoosh': return whoosh(o)
    if name == 'pop':
        t = tv(.12); f = 900 * p * np.exp(-t * 6)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35) * .5
    if name == 'tap':
        t = tv(.05); return hp(rng.standard_normal(len(t)), 1500) * np.exp(-t * 120) * .5
    if name == 'thud':
        t = tv(.4); return np.sin(2 * np.pi * 55 * t) * np.exp(-t * 10) * .8
    if name == 'tick':
        t = tv(.06); return np.sin(2 * np.pi * 2200 * p * t) * np.exp(-t * 90) * .35
    if name == 'clock':
        out = np.zeros(int(3.2 * SR))
        for i in range(6):
            t = tv(.04); c = np.sin(2 * np.pi * (3000 if i % 2 else 2400) * t) * np.exp(-t * 150) * .3
            j = int(i * .5 * SR); out[j:j + len(c)] += c
        return out
    if name == 'steps':
        out = np.zeros(int(1.8 * SR))
        for i in range(5):
            t = tv(.08); c = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 60) * .6
            j = int(i * .34 * SR); out[j:j + len(c)] += c
        return out
    if name == 'low':
        t = tv(1.4); return np.sin(2 * np.pi * 98 * t) * np.exp(-t * 2) * np.clip(t / .05, 0, 1) * .5
    if name == 'ding':
        t = tv(1.8); f = 1320 * p
        return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 3)) * np.exp(-t * 2.2) * .35
    if name == 'boom':
        t = tv(2.2); return lp(np.sin(2 * np.pi * 45 * t) * np.exp(-t * 2.5) + rng.standard_normal(len(t)) * .25 * np.exp(-t * 4), 600) * .8
    if name == 'glitch':
        out = np.zeros(int(.7 * SR))
        for i in range(9):
            n = int(rng.uniform(.02, .07) * SR); j = int(rng.uniform(0, .6) * SR)
            seg = np.sign(np.sin(2 * np.pi * rng.uniform(80, 900) * tv(n / SR))) * .25 + rng.standard_normal(n) * .15
            out[j:j + n] += seg[:len(out) - j]
        return hp(out, 200)
    if name == 'swell':
        t = tv(2.0); return lp(rng.standard_normal(len(t)), 1200) * (t / 2) ** 2 * np.exp(-np.clip(t - 1.8, 0, None) * 20) * .25
    if name == 'chime':
        out = np.zeros(int(3 * SR))
        for i, m in enumerate([79, 84, 88]):
            t = tv(2.5); c = np.sin(2 * np.pi * midi(m) * t) * np.exp(-t * 2) * .3
            j = int(i * .15 * SR); out[j:j + len(c)] += c
        return out
    raise ValueError(name)


for c in CUE['cues']:
    put(sfx, fx(c['name'], c), c['t'], c.get('gain', 1.0) * .55, pan=0)

# ---- mix: room reverb on music, a little on effects
def reverb(x, dur=2.4, mix=.28):
    t = tv(dur); ir = rng.standard_normal((2, len(t))) * np.exp(-t * 3.2); ir[:, :int(.01 * SR)] *= np.linspace(0, 1, int(.01 * SR))
    ir /= np.abs(ir).sum(axis=1, keepdims=True) ** .5 * 6
    wet = np.stack([fftconvolve(x[i], ir[i])[:N] for i in range(2)])
    return x * (1 - mix) + wet * mix


mix = reverb(mus, mix=.35) + reverb(sfx, dur=1.2, mix=.15)
fade = np.clip((TOTAL + .5 - np.arange(N) / SR) / 1.5, 0, 1); mix *= fade
mix = mix[:, :int((TOTAL + .3) * SR)]
mix *= .7 / np.max(np.abs(mix))
pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2').T.copy()
with wave.open(os.path.join(here, 'music.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f'wrote music.wav  ({mix.shape[1] / SR:.1f}s)')
