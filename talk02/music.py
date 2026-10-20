"""No.46《回避型依恋》 — original score (D minor → F major, 75 BPM).

    python3 music.py        -> bgm.wav (153.6 s, never silent, -14 LUFS)

Cool and restrained for most of the film, warm at the end. Bars of 4 beats = 3.2 s; sections start on bar lines
(beats from timeline.json, written by layout.py):
  beats   0– 24  问题      a small cold theme on high piano over D minor; the door closes; the title rises on G minor → A
  beats  24– 52  是什么    a steady broken-chord pulse; the dot climbs the ruler (B-flat); a quarter of people (A)
  beats  52– 96  一层壳    thin and cold; the baby (G minor); the heart that won't slow down (sound effects carry it);
                           grown up (A); "没什么"; the shell lands on A, unresolved
  beats  96–140  怎么来的  rewind; reaching out and being pushed away; pressed down: the piano drops to one note a beat;
                           distraction: the tension builds on A; the rebound lifts to B-flat and C
  beats 140–192  怎么办    F major: the theme comes back on violins, warm; the label falls away; the last F major chord rings
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
assert TOTAL_BEATS == 192, TOTAL_BEATS                               # the arrangement below is written for 192 beats
rng = np.random.default_rng(4602)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'Dm': [2, 5, 9], 'F': [5, 9, 0], 'C': [0, 4, 7], 'Csus4': [0, 5, 7], 'Bb': [10, 2, 5], 'Gm': [7, 10, 2],
       'A': [9, 1, 4], 'Asus4': [9, 2, 4], 'Am': [9, 0, 4]}
PROG = [  # (start beat, length, chord, bass)
    # 问题
    (0, 4, 'Dm', 'D2'), (4, 4, 'Bb', 'Bb1'), (8, 4, 'F', 'A1'), (12, 4, 'C', 'C2'), (16, 4, 'Gm', 'G1'), (20, 2, 'Asus4', 'A1'), (22, 2, 'A', 'A1'),
    # 是什么
    (24, 4, 'Dm', 'D2'), (28, 4, 'F', 'F2'), (32, 4, 'Bb', 'Bb1'), (36, 4, 'C', 'C2'), (40, 4, 'Dm', 'D2'), (44, 4, 'Bb', 'Bb1'), (48, 4, 'A', 'A1'),
    # 一层壳
    (52, 4, 'Dm', 'D2'), (56, 4, 'Bb', 'Bb1'), (60, 4, 'Gm', 'G1'), (64, 4, 'Dm', 'F2'), (68, 4, 'Bb', 'Bb1'), (72, 4, 'Gm', 'G1'), (76, 4, 'A', 'A1'),
    (80, 4, 'Dm', 'D2'), (84, 4, 'Bb', 'Bb1'), (88, 4, 'Gm', 'G1'), (92, 4, 'A', 'A1'),
    # 怎么来的
    (96, 4, 'Dm', 'D2'), (100, 4, 'Am', 'A1'), (104, 4, 'Bb', 'Bb1'), (108, 4, 'F', 'A1'), (112, 4, 'Gm', 'G1'), (116, 4, 'Dm', 'D2'),
    (120, 4, 'Gm', 'G1'), (124, 4, 'Gm', 'G1'), (128, 4, 'A', 'A1'), (132, 4, 'A', 'A1'), (136, 2, 'Bb', 'Bb1'), (138, 2, 'C', 'C2'),
    # 怎么办
    (140, 4, 'F', 'F2'), (144, 4, 'C', 'E2'), (148, 4, 'Dm', 'D2'), (152, 4, 'Bb', 'Bb1'), (156, 4, 'F', 'A1'), (160, 4, 'C', 'C2'),
    (164, 4, 'Dm', 'D2'), (168, 4, 'Bb', 'Bb1'), (172, 4, 'F', 'A1'), (176, 4, 'Bb', 'Bb1'), (180, 2, 'Csus4', 'C2'), (182, 2, 'C', 'C2'),
    (184, 4, 'F', 'F2'), (188, 4, 'F', 'F2'),
]


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
song.bus('box', gain=1.0, reverb=.48, highpass=700)                  # the cold theme (high piano)
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
PIANO_ENV = [(0, .34), (16, .40), (24, .44), (40, .46), (48, .44), (52, .34), (60, .32), (72, .38), (76, .36), (88, .40), (92, .42),
             (96, .36), (104, .40), (112, .42), (116, .36), (120, .28), (128, .34), (136, .50), (140, .44), (156, .50), (168, .54),
             (176, .58), (184, .46), (192, .36)]
SPARSE = [(52, 60)]                                                  # 冷：大人站在镜头前，只有每拍一个音
QUIET = [(120, 128)]                                                 # 压下去：钢琴只剩每拍一个音，很轻
TENSE = [(128, 136)]                                                 # 一分心：同一个音反复，越来越紧


def ost(e, beat, step, vel_scale=1.0):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[PAT[e % 8]]
    vel = env(beat, PIANO_ENV) * ACC[e % 8] * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .15, .9)), bus='piano_soft' if beat < 24 or 52 <= beat < 96 else 'piano', pan=-.12, release=rel)


for e in range(0, TOTAL_BEATS * 2):
    bt = e / 2
    if bt >= 184: break
    if any(a <= bt < b for a, b in SPARSE + QUIET):
        if bt % 1 == 0:
            s, l, c, b = chord_at(bt); n = PIANO_V[s][int(bt) % 3]
            dur, rel = fit(n, bt, .9, rel=.45, over=0, piano=True)
            song.add(PIANO, n, T(bt), dur, .22 if any(a <= bt < b for a, b in QUIET) else .28, bus='piano_soft', pan=-.1, release=rel)
        continue
    if any(a <= bt < b for a, b in TENSE):
        k = (bt - 128) / 8
        song.add(PIANO, 'A3' if e % 2 == 0 else 'E4', T(bt), B * .45, float(.24 + .3 * k), bus='piano', pan=-.1, release=.12)
        continue
    ost(e, bt, .5, vel_scale=.8 if bt < 24 else 1.0)
for k, q in enumerate(range(184, 188)):                              # ending: a slow F major arpeggio, let it ring
    n = ['F2', 'C3', 'A3', 'F4'][k]
    song.add(PIANO, n, T(q), (192 - q) * B + 1.0, .42 - .03 * k, bus='piano_soft', pan=-.05)
song.add(PIANO, 'C5', T(188), 4 * B + 1.0, .3, bus='piano_soft', pan=.1)

# left hand: the bass on each chord
for s, l, c, b in PROG:
    bm = midi(b)
    if s >= 184 or any(a <= s < b2 for a, b2 in QUIET): continue
    v = env(s, PIANO_ENV) + .06
    for off in range(0, int(l), 2):
        dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
        song.add(PIANO, bm + 12, T(s + off), dur, float(v - (.06 if off else 0)), bus='piano', release=rel)
        if off == 0: song.add(PIANO, bm, T(s), dur, float(v - .08), bus='piano', release=rel)
song.add(PIANO, 'F1', T(184), 6.0, .5, bus='piano')

# ------------------------------------------------------------------ the cold theme (opening, high piano) and its warm return (violins)
THEME = [(0, 'A5', 1.5), (1.5, 'F5', .5), (2, 'E5', 1), (3, 'D5', 1),              # Dm
         (4, 'D5', 1.5), (5.5, 'F5', .5), (6, 'Bb5', 2),                           # Bb
         (8, 'A5', 1.5), (9.5, 'G5', .5), (10, 'F5', 1), (11, 'C5', 1),            # F
         (12, 'E5', 2), (14, 'G5', 1), (15, 'E5', 1)]                              # C
for bt, n, d in THEME:                                                             # 问题：冷，高音钢琴，带一点竖琴
    dur, rel = fit(n, bt, min(d + .5, chord_end(bt) - bt), rel=.6, over=0, piano=True)
    song.add(PIANO, midi(n) + 12, T(bt), dur, .3 + .04 * (bt % 2 == 0), bus='box', pan=.2, release=rel)
    if bt % 2 == 0: harp(n, T(bt), dur, .28, pan=-.15, release=rel)
for bt, n, d in [(16, 'D6', 2), (18, 'Bb5', 2), (20, 'A5', 2), (22, 'C#6', 2)]:   # 题目：G 小调上抬起来，停在 A
    dur, rel = fit(n, bt, min(d + .4, chord_end(bt) - bt), rel=.5, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, .34, bus='box', pan=.2, release=rel)
for bt, n in [(60, 'D6'), (62, 'A5'), (64, 'F5'), (66, 'A5')]:                     # 宝宝：两声八音盒
    harp(n, T(bt), 1.6, .26, pan=.25, release=1.2)

# 怎么办: the theme returns in F major on violins (Dm → F: the first bar now rises instead of falling)
WARM = [(0, 'A4', 1.5), (1.5, 'C5', .5), (2, 'F5', 1), (3, 'E5', 1),               # F
        (4, 'G5', 1.5), (5.5, 'E5', .5), (6, 'C5', 2),                             # C
        (8, 'D5', 1.5), (9.5, 'E5', .5), (10, 'F5', 1), (11, 'A5', 1),             # Dm
        (12, 'Bb5', 2), (14, 'A5', 1), (15, 'F5', 1)]                              # Bb
for bt, n, d, dur, rel in phrase([(156 + b0, n, d) for b0, n, d in WARM], last_rel=.6):
    v = .54 + .05 * (bt >= 164) + rng.normal(0, .02)
    song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=.25 if d < 1 else .4, release=rel)
CODA = [(172, 'C5', 2), (174, 'F5', 2), (176, 'D6', 3), (179, 'C6', 1), (180, 'Bb5', 2), (182, 'G5', 2), (184, 'A5', 4)]   # 只是爱得很小心：最高处
for bt, n, d, dur, rel in phrase(CODA, last_rel=2.4):
    song.add(STRINGS_HI, n, T(bt), dur, .6 if bt < 184 else .48, bus='lead_vln', pan=.05, attack=.4, release=rel)

# ------------------------------------------------------------------ moments
for k in range(10):                                                  # 反弹回来：竖琴一串往上（B-flat）
    n, st = MID_V[136][k % 3] + 12 * (1 + k // 3), T(136) + k * .04
    harp(n, st, T(138) - st - .03, .26 + .012 * k, pan=-.3 + .06 * k, release=.25)
for k in range(8):                                                   # 消息送到：竖琴（D 小调和弦里的音）
    n, st = MID_V[148][k % 3] + 12 * (1 + k // 3), T(149.3) + k * .05
    harp(n, st, 1.2, .22 + .01 * k, pan=.3 - .06 * k, release=.6)
for bt, n in [(168, 'D5'), (168.5, 'F5'), (169, 'Bb5')]:            # 变暖
    harp(n, T(bt), 1.6, .3, pan=-.1, release=1.2)

# ------------------------------------------------------------------ strings underneath, never silent
STR_ENV = [(0, .22), (16, .30), (24, .30), (48, .36), (52, .26), (72, .32), (88, .38), (96, .30), (116, .30), (120, .22),
           (128, .30), (136, .48), (140, .40), (156, .48), (168, .56), (176, .62), (184, .54), (192, .40)]
LO, MID, HI = [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    LO.append((s, e, [b], dict(vel=v, attack=.3)))
    MID.append((s, e, MID_V[s], dict(vel=v * .85, attack=.5)))
    if 140 <= s: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .7, attack=.6)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    st = T(s) - .15 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=.10, attack=.3 if s else .05, release=.3 if s < 188 else 3.0, bright=.12 if s < 140 else .2), st)


# ------------------------------------------------------------------ a soft pulse while the two rulers are drawn, and under the warm ending
def kick(beat, g):
    y = sub_pulse(.7, freq=44.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(24, 48, 4): kick(bt, .16)
for bt in range(128, 136): kick(bt, .10 + .02 * (bt - 128))          # 一分心：越来越紧
for bt in range(156, 184, 2): kick(bt, .18 + .004 * (bt - 156))
kick(184, .3)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=3.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
