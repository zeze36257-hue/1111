"""No.50《高敏感人群》 — original score (B minor → D major, 75 BPM).

    python3 music.py        -> bgm.wav (150.4 s, never silent, -14 LUFS)

Quiet under the dialogue; the story is in the bubbles. Bars of 4 beats = 3.2 s; sections start on bar lines (timeline.json):
  beats   0– 20  早上     the street: the same note repeated fast and restless (too much at once)
  beats  20– 40  公司     sparse; after the boss's "先这样吧" almost nothing
  beats  40– 52  晚上     a music box alone in the dark
  beats  52–112  是什么   D major: 学姐 comes in, warm broken chords
  beats 112–140  怎么来的 the same warmth, a little brighter
  beats 140–164  怎么办   G – A – F#m – Bm – G – A
  beats 164–188  第二天   the morning park: the music-box tune comes back on violins, rising; it ends on D
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
assert TOTAL_BEATS == 188, TOTAL_BEATS                               # the arrangement below is written for 188 beats
rng = np.random.default_rng(5002)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'Bm': [11, 2, 6], 'G': [7, 11, 2], 'D': [2, 6, 9], 'A': [9, 1, 4], 'Em': [4, 7, 11], 'F#': [6, 10, 1], 'F#m': [6, 9, 1]}
PROG = [  # (start beat, length, chord, bass)
    # 早上
    (0, 4, 'Bm', 'B1'), (4, 4, 'G', 'G1'), (8, 4, 'D', 'D2'), (12, 4, 'A', 'A1'), (16, 4, 'Bm', 'B1'),
    # 公司
    (20, 4, 'Bm', 'B1'), (24, 4, 'G', 'G1'), (28, 4, 'Em', 'E2'), (32, 4, 'F#', 'F#1'), (36, 4, 'Bm', 'B1'),
    # 晚上
    (40, 4, 'G', 'G1'), (44, 4, 'Em', 'E2'), (48, 4, 'F#', 'F#1'),
    # 是什么
    (52, 4, 'D', 'D2'), (56, 4, 'A', 'A1'), (60, 4, 'Bm', 'B1'), (64, 4, 'G', 'G1'), (68, 4, 'D', 'D2'), (72, 4, 'A', 'A1'), (76, 4, 'Bm', 'B1'),
    (80, 4, 'G', 'G1'), (84, 4, 'Em', 'E2'), (88, 4, 'A', 'A1'), (92, 4, 'D', 'D2'), (96, 4, 'Bm', 'B1'), (100, 4, 'G', 'G1'), (104, 4, 'A', 'A1'), (108, 4, 'D', 'D2'),
    # 怎么来的
    (112, 4, 'G', 'G1'), (116, 4, 'D', 'D2'), (120, 4, 'Em', 'E2'), (124, 4, 'A', 'A1'), (128, 4, 'G', 'G1'), (132, 4, 'D', 'D2'), (136, 4, 'A', 'A1'),
    # 怎么办
    (140, 4, 'G', 'G1'), (144, 4, 'A', 'A1'), (148, 4, 'F#m', 'F#1'), (152, 4, 'Bm', 'B1'), (156, 4, 'G', 'G1'), (160, 4, 'A', 'A1'),
    # 第二天
    (164, 4, 'D', 'D2'), (168, 4, 'A', 'A1'), (172, 4, 'Bm', 'B1'), (176, 4, 'G', 'G1'), (180, 4, 'D', 'D2'), (184, 4, 'D', 'D2'),
]
assert sum(l for _, l, _, _ in PROG) == 188


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

# ------------------------------------------------------------------ piano: broken chords; restless on the street; almost nothing after the boss's line
PAT = [0, 1, 2, 1, 3, 1, 2, 1]
ACC = [1.0, .80, .90, .80, .95, .80, .90, .84]
PIANO_ENV = [(0, .26), (16, .28), (20, .24), (21, .16), (40, .2), (52, .3), (112, .34), (140, .34), (164, .38), (180, .42), (188, .3)]
REST = (21, 28)                                                      # 老板说“先这样吧”之后


def ost(e, beat, step, vel_scale=1.0):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[PAT[e % 8]]
    vel = env(beat, PIANO_ENV) * ACC[e % 8] * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .12, .9)), bus='piano_soft', pan=-.12, release=rel)


for e in range(0, TOTAL_BEATS * 4):
    bt = e / 4
    if bt >= 180: break
    if bt < 18:                                                      # 街上：同一个音飞快地反复，越来越挤
        s, l, c, bs = chord_at(bt); n = PIANO_V[s][0] + 12 * ((e // 2) % 2)
        song.add(PIANO, n, T(bt), B * .2, float(.12 + .1 * bt / 18), bus='piano', pan=-.1, release=.08); continue
    if e % 2 or REST[0] <= bt < REST[1]: continue
    if 40 <= bt < 52 and e % 4: continue                             # 晚上：只弹四分音符
    ost(e // 2, bt, .5, vel_scale=.9)
for k, q in enumerate(range(180, 184)):                              # ending: a slow D major arpeggio, let it ring
    n = ['D2', 'A2', 'F#3', 'D4'][k]
    song.add(PIANO, n, T(q), (188 - q) * B + 1.0, .42 - .03 * k, bus='piano_soft', pan=-.05)
song.add(PIANO, 'A4', T(184), 4 * B + 1.0, .3, bus='piano_soft', pan=.1)

for s, l, c, b in PROG:                                              # left hand
    bm = midi(b)
    if s >= 180: continue
    v = env(s, PIANO_ENV) + .06
    if REST[0] <= s < REST[1]: song.add(PIANO, bm, T(s), 4 * B, .26, bus='piano_soft', release=1.0); continue
    for off in range(0, int(l), 2):
        dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
        song.add(PIANO, bm + 12, T(s + off), dur, float(v - (.06 if off else 0)), bus='piano_soft', release=rel)
        if off == 0: song.add(PIANO, bm, T(s), dur, float(v - .08), bus='piano_soft', release=rel)
song.add(PIANO, 'D1', T(180), 6.0, .45, bus='piano')

# ------------------------------------------------------------------ the tune: music box at night; violins in the morning park
TUNE = [(0, 'D5', 1.5), (1.5, 'C#5', .5), (2, 'B4', 1), (3, 'F#4', 1),           # G / D
        (4, 'G4', 1.5), (5.5, 'B4', .5), (6, 'E5', 2),                           # Em / A
        (8, 'C#5', 1.5), (9.5, 'E5', .5), (10, 'F#5', 2)]                        # F# / Bm
for bt, n, d in TUNE:
    bt += 40
    dur, rel = fit(n, bt, min(d + .5, chord_end(bt) - bt), rel=.6, over=0, piano=True)
    song.add(PIANO, midi(n) + 12, T(bt), dur, .26 + .04 * (bt % 2 == 0), bus='box', pan=.2, release=rel)
    if bt % 4 == 0: harp(n, T(bt), dur, .2, pan=-.15, release=rel)
WARM = [(164, 'F#5', 1.5), (165.5, 'E5', .5), (166, 'D5', 1), (167, 'A4', 1),     # D
        (168, 'C#5', 1.5), (169.5, 'E5', .5), (170, 'A5', 2),                    # A
        (172, 'B5', 1.5), (173.5, 'A5', .5), (174, 'F#5', 2),                    # Bm
        (176, 'G5', 1.5), (177.5, 'B5', .5), (178, 'D6', 2),                     # G：不是你太敏感
        (180, 'C#6', 2), (182, 'A5', 2), (184, 'D6', 4)]                         # D：是你感受得更多
for bt, n, d, dur, rel in phrase([(bt, midi(n) - 12, d) for bt, n, d in WARM], last_rel=2.4):
    song.add(STRINGS_HI, n, T(bt), dur, .48 + .05 * (bt >= 180), bus='lead_vln', pan=.05, attack=.25 if d < 1 else .4, release=rel)

# ------------------------------------------------------------------ moments
for k in range(8):                                                   # 学姐来了
    n, st = MID_V[52][k % 3] + 12 * (1 + k // 3), T(52.4) + k * .06
    harp(n, st, 1.4, .18 + .01 * k, pan=.3 - .06 * k, release=.7)
for k in range(10):                                                  # 第二天早上
    n, st = MID_V[164][k % 3] + 12 * (1 + k // 3), T(163.6) + k * .045
    harp(n, st, T(164) - st + .8, .2 + .012 * k, pan=-.3 + .06 * k, release=.5)

# ------------------------------------------------------------------ strings underneath, never silent
STR_ENV = [(0, .2), (16, .26), (20, .22), (21, .12), (28, .18), (40, .2), (52, .28), (112, .32), (140, .32), (164, .38), (176, .46), (188, .38)]
LO, MID, HI = [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    LO.append((s, e, [b], dict(vel=v, attack=.3)))
    MID.append((s, e, MID_V[s], dict(vel=v * .85, attack=.5)))
    if s >= 168: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .7, attack=.6)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    st = T(s) - .15 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=.09, attack=.3 if s else .05, release=.3 if s < 184 else 3.0, bright=.12 if s < 164 else .2), st)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=3.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
