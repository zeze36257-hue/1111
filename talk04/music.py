"""No.48《焦虑型配回避型》 — original score (E minor loop → G major cadence, 75 BPM).

    python3 music.py        -> bgm.wav (108.8 s, never silent, -14 LUFS)

The idea is a circle: the same four chords (Em – C – G – D) go round and round and never come home, the way the two cats
keep chasing each other. Only at the end does the music break out of the loop and cadence (D → G).
Bars of 4 beats = 3.2 s; sections start on bar lines (timeline.json):
  beats   0– 24  问题      a small theme on high piano that ends where it began; a quiet tick while the messages go unanswered;
                           the title rises on A minor and stops on B
  beats  24– 52  为什么在一起  the loop again, broken chords; a harp when "0 对" lands; it stops on B
  beats  52– 84  一个圈    the loop, driving: a heartbeat under it; from beat 76 the same note repeats faster (越转越快)
  beats  84–104  分不开    still the loop; three quick years; a held E minor chord for "却意外地稳定"
  beats 104–136  怎么办    C – D, the loop stops; the theme on violins in G major, rising; D → G under the last big words
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
assert TOTAL_BEATS == 136, TOTAL_BEATS                               # the arrangement below is written for 136 beats
rng = np.random.default_rng(4802)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'Em': [4, 7, 11], 'C': [0, 4, 7], 'G': [7, 11, 2], 'D': [2, 6, 9], 'Am': [9, 0, 4], 'B': [11, 3, 6], 'Bsus4': [11, 4, 6]}
LOOP = [('Em', 'E2'), ('C', 'C2'), ('G', 'G1'), ('D', 'D2')]
PROG = [  # (start beat, length, chord, bass)
    # 问题：圈（两遍半）；题目在 A 小调上抬起来，停在 B
    *[(b, 4, *LOOP[(b // 4) % 4]) for b in range(0, 16, 4)], (16, 4, 'Am', 'A1'), (20, 2, 'Bsus4', 'B1'), (22, 2, 'B', 'B1'),
    # 为什么在一起
    *[(b, 4, *LOOP[(b // 4 - 6) % 4]) for b in range(24, 48, 4)], (48, 4, 'B', 'B1'),
    # 一个圈、分不开：一直绕
    *[(b, 4, *LOOP[(b // 4 - 13) % 4]) for b in range(52, 104, 4)],
    # 怎么办：C – D，绕不下去了；G 大调的旋律；最后 D → G
    (104, 4, 'C', 'C2'), (108, 4, 'D', 'D2'), (112, 4, 'G', 'G1'), (116, 4, 'Em', 'E2'), (120, 4, 'C', 'C2'), (124, 4, 'D', 'D2'),
    (128, 4, 'G', 'G1'), (132, 4, 'G', 'G1'),
]
assert sum(l for _, l, _, _ in PROG) == 136 and [s for s, *_ in PROG] == sorted(s for s, *_ in PROG)


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
PIANO_ENV = [(0, .34), (12, .38), (16, .36), (22, .44), (24, .40), (44, .44), (52, .40), (68, .46), (76, .50), (84, .44), (96, .40),
             (100, .36), (104, .38), (112, .44), (124, .52), (128, .50), (136, .36)]
TENSE = [(76, 84), (89, 92)]                                         # 圈越转越快 / 三年一晃：同一个音反复


def ost(e, beat, step, vel_scale=1.0):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[PAT[e % 8]]
    vel = env(beat, PIANO_ENV) * ACC[e % 8] * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .15, .9)), bus='piano_soft' if beat < 24 or beat >= 104 else 'piano', pan=-.12, release=rel)


for e in range(0, TOTAL_BEATS * 4):
    bt = e / 4
    if bt >= 128: break
    hit = [(a, b) for a, b in TENSE if a <= bt < b]
    if hit:                                                          # 十六分音符：同一个音，越来越重
        a, b = hit[0]; k = (bt - a) / (b - a)
        s, l, c, bs = chord_at(bt); n = PIANO_V[s][0] + 12 * ((e // 2) % 2)
        song.add(PIANO, n, T(bt), B * .22, float(.2 + .26 * k), bus='piano', pan=-.1, release=.1)
        continue
    if e % 2: continue                                               # 其余地方：八分音符分解和弦
    ost(e // 2, bt, .5, vel_scale=.8 if bt < 24 else 1.0)
for k, q in enumerate(range(128, 132)):                              # ending: a slow G major arpeggio, let it ring
    n = ['G1', 'D2', 'B2', 'G3'][k]
    song.add(PIANO, n, T(q), (136 - q) * B + 1.0, .42 - .03 * k, bus='piano_soft', pan=-.05)
song.add(PIANO, 'D4', T(132), 4 * B + 1.0, .3, bus='piano_soft', pan=.1)

for s, l, c, b in PROG:                                              # left hand
    bm = midi(b)
    if s >= 128: continue
    v = env(s, PIANO_ENV) + .06
    for off in range(0, int(l), 2):
        dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
        song.add(PIANO, bm + 12, T(s + off), dur, float(v - (.06 if off else 0)), bus='piano', release=rel)
        if off == 0: song.add(PIANO, bm, T(s), dur, float(v - .08), bus='piano', release=rel)
song.add(PIANO, 'G1', T(128), 6.0, .5, bus='piano')

# ------------------------------------------------------------------ three messages, no reply: a quiet tick on every beat (high B)
for bt in range(0, 8):
    song.add(PIANO, 'B6', T(bt), .12, .16 + .02 * (bt % 2 == 0), bus='box', pan=.35, release=.1)

# ------------------------------------------------------------------ the theme: goes round and ends where it began (opening); in G major on violins, rising (ending)
THEME = [(0, 'B4', 1.5), (1.5, 'A4', .5), (2, 'G4', 1), (3, 'E4', 1),               # Em
         (4, 'E4', 1.5), (5.5, 'G4', .5), (6, 'C5', 2),                            # C
         (8, 'B4', 1.5), (9.5, 'A4', .5), (10, 'G4', 1), (11, 'D5', 1),            # G
         (12, 'F#5', 2), (14, 'E5', 1), (15, 'D5', 1)]                             # D → (back to B)
for b0 in (0, 52):                                                   # 开头；圈又转起来的时候再来一遍
    for bt, n, d in THEME:
        bt += b0
        dur, rel = fit(n, bt, min(d + .5, chord_end(bt) - bt), rel=.6, over=0, piano=True)
        song.add(PIANO, midi(n) + 12, T(bt), dur, (.3 if b0 == 0 else .26) + .04 * (bt % 2 == 0), bus='box', pan=.2, release=rel)
        if bt % 2 == 0: harp(n, T(bt), dur, .24, pan=-.15, release=rel)
for bt, n, d in [(16, 'C5', 2), (18, 'E5', 2), (20, 'F#5', 2), (22, 'D#5', 2)]:   # 题目：A 小调上抬起来，停在 B
    dur, rel = fit(n, bt, min(d + .4, chord_end(bt) - bt), rel=.5, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, .34, bus='box', pan=.2, release=rel)

WARM = [(0, 'B4', 1.5), (1.5, 'D5', .5), (2, 'G5', 1), (3, 'D5', 1),               # G
        (4, 'E5', 1.5), (5.5, 'G5', .5), (6, 'B5', 2),                             # Em
        (8, 'C6', 1.5), (9.5, 'B5', .5), (10, 'A5', 1), (11, 'G5', 1),             # C
        (12, 'F#5', 2), (14, 'A5', 1), (15, 'D6', 1)]                              # D
for bt, n, d, dur, rel in phrase([(112 + b0, midi(n) - 12, d) for b0, n, d in WARM], last_rel=.6):
    v = .54 + .05 * (bt >= 120) + rng.normal(0, .02)
    song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=.25 if d < 1 else .4, release=rel)
CODA = [(128, 'B5', 2), (130, 'D6', 2), (132, 'G5', 4)]              # 一个怕被丢下，一个怕被困住
for bt, n, d, dur, rel in phrase([(bt, midi(n) - 12, d) for bt, n, d in CODA], last_rel=2.4):
    song.add(STRINGS_HI, n, T(bt), dur, .56 if bt < 132 else .46, bus='lead_vln', pan=.05, attack=.4, release=rel)

# ------------------------------------------------------------------ moments
for k in range(8):                                                   # 题目
    n, st = MID_V[16][k % 3] + 12 * (1 + k // 3), T(17.4) + k * .05
    harp(n, st, 1.4, .2 + .01 * k, pan=.3 - .06 * k, release=.7)
for bt, n in [(30.6, 'E5'), (31.0, 'B4')]:                           # 0 对
    harp(n, T(bt), 1.2, .26, pan=-.1, release=.9)
for k in range(10):                                                  # 我们又在转圈了（D）
    n, st = MID_V[108][k % 3] + 12 * (1 + k // 3), T(109.5) + k * .045
    harp(n, st, T(112) - st - .03, .22 + .012 * k, pan=-.3 + .06 * k, release=.3)
for k in range(12):                                                  # 圈碎成光（往下落的竖琴）
    n, st = MID_V[124][(2 - k) % 3] + 12 * (3 - k // 3), T(123.4) + k * .06
    harp(n, st, 1.0, .24 - .008 * k, pan=.3 - .05 * k, release=.6)

# ------------------------------------------------------------------ strings underneath, never silent
STR_ENV = [(0, .22), (16, .30), (22, .36), (24, .28), (48, .36), (52, .30), (68, .38), (76, .44), (84, .36), (96, .34), (100, .30),
           (104, .30), (112, .42), (124, .54), (128, .56), (136, .40)]
LO, MID, HI = [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    LO.append((s, e, [b], dict(vel=v, attack=.3)))
    MID.append((s, e, MID_V[s], dict(vel=v * .85, attack=.5)))
    if 116 <= s: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .7, attack=.6)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    st = T(s) - .15 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=.10, attack=.3 if s else .05, release=.3 if s < 132 else 3.0, bright=.12 if s < 104 else .2), st)


# ------------------------------------------------------------------ a heartbeat under the chase (quicker as the circle speeds up); a calm pulse at the end
def kick(beat, g):
    y = sub_pulse(.7, freq=44.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(56, 76, 2): kick(bt, .15)
for bt in range(76, 84): kick(bt, .14 + .01 * (bt - 76))
for bt in range(84, 100, 2): kick(bt, .14)
for bt in range(112, 128, 2): kick(bt, .14 + .004 * (bt - 112))
kick(128, .26)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=3.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
