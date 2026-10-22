"""No.47《焦虑型依恋》 — original score (A minor → C major, 75 BPM).

    python3 music.py        -> bgm.wav (144 s, never silent, -14 LUFS)

Restless at first, settled at the end. Bars of 4 beats = 3.2 s; sections start on bar lines (timeline.json):
  beats   0– 28  问题      a small A-minor theme on high piano; a quiet tick on every beat (waiting for a reply);
                           the night (A minor, D minor); the title rises on D minor and stops on E
  beats  28– 52  是什么    broken chords; the dot runs along the first ruler (D minor → E)
  beats  52– 96  警报器    a heartbeat under the alarm, quicker when the smoke alarm goes off; the face, the phone
  beats  96–128  怎么来的  rewind; the mother leaves and comes back (F, C); the light flickers (G); the cry nobody answers
                           builds on a repeated note, then G pulls toward C
  beats 128–180  怎么办    C major: a direct sentence, a sure reply; the theme comes back on violins, rising;
                           "只是太怕失去" at the top; the last C major chord rings
"""
import json, os, sys
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
BPM = 75.0
B = 60.0 / BPM
TOTAL_BEATS = int(round(TL['total'] / B))
assert TOTAL_BEATS == 180, TOTAL_BEATS                               # the arrangement below is written for 180 beats
rng = np.random.default_rng(4702)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'Am': [9, 0, 4], 'C': [0, 4, 7], 'Dm': [2, 5, 9], 'E': [4, 8, 11], 'Esus4': [4, 9, 11], 'F': [5, 9, 0], 'G': [7, 11, 2]}
PROG = [  # (start beat, length, chord, bass)
    # 问题
    (0, 4, 'Am', 'A1'), (4, 4, 'F', 'F1'), (8, 4, 'C', 'C2'), (12, 4, 'G', 'G1'), (16, 4, 'Am', 'A1'), (20, 4, 'Dm', 'D2'), (24, 2, 'Esus4', 'E2'), (26, 2, 'E', 'E2'),
    # 是什么
    (28, 4, 'Am', 'A1'), (32, 4, 'F', 'F1'), (36, 4, 'Dm', 'D2'), (40, 4, 'E', 'E2'), (44, 4, 'Am', 'A1'), (48, 4, 'E', 'E2'),
    # 警报器
    (52, 4, 'Am', 'A1'), (56, 4, 'Dm', 'D2'), (60, 4, 'F', 'F1'), (64, 4, 'E', 'E2'), (68, 4, 'Am', 'A1'), (72, 4, 'Dm', 'D2'),
    (76, 4, 'F', 'F1'), (80, 4, 'E', 'E2'), (84, 4, 'Am', 'A1'), (88, 4, 'Dm', 'D2'), (92, 4, 'E', 'E2'),
    # 怎么来的
    (96, 4, 'Am', 'A1'), (100, 4, 'F', 'F1'), (104, 4, 'C', 'C2'), (108, 4, 'G', 'G1'), (112, 4, 'Am', 'A1'), (116, 4, 'Dm', 'D2'),
    (120, 4, 'E', 'E2'), (124, 4, 'G', 'G1'),
    # 怎么办
    (128, 4, 'C', 'C2'), (132, 4, 'G', 'G1'), (136, 4, 'Am', 'A1'), (140, 4, 'F', 'F1'), (144, 4, 'C', 'C2'), (148, 4, 'G', 'G1'),
    (152, 4, 'Am', 'A1'), (156, 4, 'F', 'F1'), (160, 4, 'C', 'C2'), (164, 4, 'F', 'F1'), (168, 4, 'G', 'G1'), (172, 4, 'C', 'C2'), (176, 4, 'C', 'C2'),
]
assert sum(l for _, l, _, _ in PROG) == 180


def chord_at(beat):
    for s, l, c, b in PROG:
        if s <= beat + 1e-6 < s + l: return s, l, c, b
    return PROG[-1]


def chord_end(beat):
    s, l, c, b = chord_at(beat); return s + l


def voicing(pcs, prev, lo, hi):
    pcs = pcs[:3]; best, score = None, 1e9
    for rot in range(3):
        order = pcs[rot:] + pcs[:rot]
        for base in range(lo, hi + 1):
            if base % 12 != order[0]: continue
            v = [base]
            for pc in order[1:]:
                n = v[-1] + 1
                while n % 12 != pc: n += 1
                v.append(n)
            s = sum(abs(a - b) for a, b in zip(v, prev)) if prev else abs(np.mean(v) - (lo + hi) / 2 - 4)
            if s < score: best, score = v, s
    return best


PIANO_V, MID_V = {}, {}
pv = mv = None
for s, l, c, b in PROG:
    pv = voicing(PCS[c], pv, midi('A3'), midi('E4')); PIANO_V[s] = pv
    mv = voicing(PCS[c], mv, midi('C3'), midi('G3')); MID_V[s] = mv


def env(beat, pts):
    xs, ys = zip(*pts); return float(np.interp(beat, xs, ys))


# ------------------------------------------------------------------ clean chord changes (as in talk01/music.py)
def foreign(n, beat):
    s, l, c, b = chord_at(beat); pc = int(round(midi(n))) % 12
    return pc not in PCS[c] and pc != midi(b) % 12


def fit(n, beat, beats, rel=.35, over=.05, piano=False):
    end = beat + beats; tail = end + (over + rel * .5) / B
    for s, l, c, b in PROG:
        if end - 1e-6 <= s < tail and foreign(n, s):
            return beats * B - .03, (.26 if piano else .2)
    return beats * B + over, rel


def phrase(notes, rel=.35, last_rel=None):
    out = []
    for k, (bt, n, d) in enumerate(notes):
        nxt = notes[k + 1] if k + 1 < len(notes) else None
        if nxt and nxt[0] <= bt + d + 1e-6 and midi(nxt[1]) != midi(n): dur, r = d * B - .02, .15
        elif nxt and nxt[0] <= bt + d + 1e-6: dur, r = d * B + .05, rel
        else: dur, r = fit(n, bt, d, rel=last_rel if (last_rel and not nxt) else rel)
        out.append((bt, n, d, dur, r))
    return out


def held(parts):
    out, live = [], {}
    for s, e, notes, opts in parts:
        notes = [int(round(midi(n))) for n in notes]
        for n in list(live):
            if n not in notes or abs(live[n][1] - s) > 1e-6: out.append((n, *live.pop(n)))
        for n in notes:
            if n in live: live[n][1] = e
            else: live[n] = [s, e, opts]
    return sorted(out + [(n, *v) for n, v in live.items()], key=lambda x: (x[1], x[0]))


def bowed(inst, parts, bus, release=.22, final_release=2.0):
    for n, s, e, o in held(parts):
        last = e >= TOTAL_BEATS - 1e-6
        song.add(inst, n, T(s), (e - s) * B - (0 if last else .04), o['vel'], bus=bus, attack=o['attack'],
                 release=final_release if last else release)


_HARPS = {}
def harp(n, start, dur, vel, bus='harp', pan=0.0, release=.9):
    k = round(float(vel), 2)
    if k not in _HARPS: _HARPS[k] = Instrument('harp', HARP.layers, sustain=False, attack=.002, release=1.2, gain=.55 * (k / .5) ** 1.2)
    song.add(_HARPS[k], n, start, dur, vel, bus=bus, pan=pan, release=release)


song = Song(T(TOTAL_BEATS), tail=4.0)
song.bus('piano', gain=1.00, reverb=.28)
song.bus('piano_soft', gain=.85, reverb=.38)
song.bus('box', gain=1.0, reverb=.46, highpass=700)                  # the theme and the clock tick (high piano)
song.bus('harp', gain=1.00, reverb=.40)
song.bus('lead_vln', gain=2.30, reverb=.38)
song.bus('str_hi', gain=.40, reverb=.42, highpass=200)
song.bus('str_mid', gain=.60, reverb=.36, highpass=70)
song.bus('str_lo', gain=.78, reverb=.24, lowpass=2400)
song.bus('pulse', gain=.50, reverb=.04, lowpass=800)
song.bus('pad', gain=.55, reverb=.32, lowpass=2000)

# ------------------------------------------------------------------ piano: broken chords
PAT = [0, 1, 2, 1, 3, 1, 2, 1]
ACC = [1.0, .80, .90, .80, .95, .80, .90, .84]
PIANO_ENV = [(0, .34), (12, .38), (16, .34), (24, .44), (28, .42), (44, .46), (52, .40), (64, .46), (68, .38), (84, .44), (92, .46),
             (96, .36), (104, .42), (112, .40), (116, .34), (124, .44), (128, .44), (140, .48), (152, .50), (164, .58), (172, .50), (180, .36)]
TENSE = [(64, 68), (116, 124)]                                       # 报警器响 / 怎么哭都没人理：同一个音反复，越来越紧


def ost(e, beat, step, vel_scale=1.0):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[PAT[e % 8]]
    vel = env(beat, PIANO_ENV) * ACC[e % 8] * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .15, .9)), bus='piano_soft' if beat < 28 or 96 <= beat < 128 else 'piano', pan=-.12, release=rel)


for e in range(0, TOTAL_BEATS * 2):
    bt = e / 2
    if bt >= 172: break
    hit = [(a, b) for a, b in TENSE if a <= bt < b]
    if hit:
        a, b = hit[0]; k = (bt - a) / (b - a)
        s, l, c, bs = chord_at(bt); n = PIANO_V[s][0] + 12 * (e % 2)
        song.add(PIANO, n, T(bt), B * .42, float(.24 + .3 * k), bus='piano', pan=-.1, release=.12)
        continue
    ost(e, bt, .5, vel_scale=.8 if bt < 28 else 1.0)
for k, q in enumerate(range(172, 176)):                              # ending: a slow C major arpeggio, let it ring
    n = ['C2', 'G2', 'E3', 'C4'][k]
    song.add(PIANO, n, T(q), (180 - q) * B + 1.0, .42 - .03 * k, bus='piano_soft', pan=-.05)
song.add(PIANO, 'G4', T(176), 4 * B + 1.0, .3, bus='piano_soft', pan=.1)

for s, l, c, b in PROG:                                              # left hand
    bm = midi(b)
    if s >= 172: continue
    v = env(s, PIANO_ENV) + .06
    for off in range(0, int(l), 2):
        dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
        song.add(PIANO, bm + 12, T(s + off), dur, float(v - (.06 if off else 0)), bus='piano', release=rel)
        if off == 0: song.add(PIANO, bm, T(s), dur, float(v - .08), bus='piano', release=rel)
song.add(PIANO, 'C1', T(172), 6.0, .5, bus='piano')

# ------------------------------------------------------------------ waiting for a reply: a quiet tick on every beat (high E)
for bt in range(0, 20):
    song.add(PIANO, 'E7', T(bt), .12, .16 + .02 * (bt % 2 == 0), bus='box', pan=.35, release=.1)

# ------------------------------------------------------------------ the theme (opening, high piano) and its return (violins, C major)
THEME = [(0, 'E5', 1.5), (1.5, 'D5', .5), (2, 'C5', 1), (3, 'A4', 1),               # Am
         (4, 'A4', 1.5), (5.5, 'C5', .5), (6, 'F5', 2),                            # F
         (8, 'E5', 1.5), (9.5, 'D5', .5), (10, 'C5', 1), (11, 'G4', 1),            # C
         (12, 'B4', 2), (14, 'D5', 1), (15, 'B4', 1)]                              # G
for bt, n, d in THEME:
    dur, rel = fit(n, bt, min(d + .5, chord_end(bt) - bt), rel=.6, over=0, piano=True)
    song.add(PIANO, midi(n) + 12, T(bt), dur, .3 + .04 * (bt % 2 == 0), bus='box', pan=.2, release=rel)
    if bt % 2 == 0: harp(n, T(bt), dur, .26, pan=-.15, release=rel)
for bt, n, d in [(20, 'F5', 2), (22, 'A5', 2), (24, 'B5', 2), (26, 'G#5', 2)]:    # 题目：D 小调上抬起来，停在 E
    dur, rel = fit(n, bt, min(d + .4, chord_end(bt) - bt), rel=.5, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, .34, bus='box', pan=.2, release=rel)

WARM = [(0, 'E5', 1.5), (1.5, 'G5', .5), (2, 'C6', 1), (3, 'G5', 1),               # C
        (4, 'B5', 1.5), (5.5, 'G5', .5), (6, 'D5', 2),                             # G
        (8, 'C5', 1.5), (9.5, 'E5', .5), (10, 'A5', 1), (11, 'C6', 1),             # Am
        (12, 'A5', 2), (14, 'F5', 1), (15, 'C6', 1)]                               # F
for bt, n, d, dur, rel in phrase([(144 + b0, midi(n) - 12, d) for b0, n, d in WARM], last_rel=.6):
    v = .54 + .05 * (bt >= 152) + rng.normal(0, .02)
    song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=.25 if d < 1 else .4, release=rel)
CODA = [(160, 'E5', 2), (162, 'G5', 2), (164, 'A5', 2), (166, 'C6', 2), (168, 'B5', 2), (170, 'D6', 2), (172, 'C6', 4)]   # 只是太怕失去：最高处
for bt, n, d, dur, rel in phrase(CODA, last_rel=2.4):
    song.add(STRINGS_HI, n, T(bt), dur, .6 if bt < 172 else .48, bus='lead_vln', pan=.05, attack=.4, release=rel)

# ------------------------------------------------------------------ moments
for k in range(8):                                                   # 消息送到（F）
    n, st = MID_V[136][k % 3] + 12 * (1 + k // 3), T(139.7) + k * .05
    harp(n, st, 1.2, .22 + .01 * k, pan=.3 - .06 * k, release=.6)
for k in range(10):                                                  # 确定的回应送到，警报停下（G → Am）
    n, st = MID_V[148][k % 3] + 12 * (1 + k // 3), T(150.3) + k * .045
    harp(n, st, T(152) - st - .03, .24 + .012 * k, pan=-.3 + .06 * k, release=.25)
for bt, n in [(112.4, 'C5'), (112.9, 'E5'), (113.4, 'A5')]:          # 哭一声就有人来
    harp(n, T(bt), 1.4, .28, pan=-.1, release=1.0)

# ------------------------------------------------------------------ strings underneath, never silent
STR_ENV = [(0, .22), (16, .28), (24, .34), (28, .30), (48, .36), (52, .30), (64, .40), (68, .30), (92, .40), (96, .28),
           (112, .30), (116, .36), (124, .44), (128, .38), (144, .46), (152, .52), (164, .62), (172, .54), (180, .40)]
LO, MID, HI = [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    LO.append((s, e, [b], dict(vel=v, attack=.3)))
    MID.append((s, e, MID_V[s], dict(vel=v * .85, attack=.5)))
    if 136 <= s: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .7, attack=.6)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    st = T(s) - .15 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=.10, attack=.3 if s else .05, release=.3 if s < 176 else 3.0, bright=.12 if s < 128 else .2), st)


# ------------------------------------------------------------------ a heartbeat under the alarm (quicker when the smoke alarm goes off); a calm pulse at the end
def kick(beat, g):
    y = sub_pulse(.7, freq=44.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(52, 64, 2): kick(bt, .16)
for bt in range(64, 68): kick(bt, .22)
for bt in range(68, 96, 2): kick(bt, .15)
for bt in range(116, 124): kick(bt, .10 + .015 * (bt - 116))
for bt in range(152, 172, 2): kick(bt, .16 + .004 * (bt - 152))
kick(172, .28)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=3.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
