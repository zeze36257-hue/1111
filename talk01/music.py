"""新系列 · 讲课 ①《为什么越长大，朋友越少？》 — original score (F major, 75 BPM).

    python3 music.py        -> bgm.wav (153.6 s, never silent, -14 LUFS)

A warm, nostalgic underscore for a talk: piano broken chords in the middle register, soft strings underneath, and a
small music-box theme (high piano + harp) that opens the film on "小时候" and comes back on violins at the end, when
the answer lands. Bars of 4 beats = 3.2 s; every section starts on a bar line:
  beats   0– 40  (  0.0– 32.0 s)  问题   the music-box theme; the chart rises to its peak (C) and falls (Dm); the title on B-flat
  beats  40– 88  ( 32.0– 70.4 s)  时间   a steady 8th-note pulse; the dormitory glows (F, A minor); work turns it cool: Dm, Gm, A
  beats  88–124  ( 70.4– 99.2 s)  环境   three lanterns, one bell each; then they go out one by one: the harmony sinks to D minor
  beats 124–160  ( 99.2–128.0 s)  筛选   the turn ("不全是坏事") on B-flat; Aristotle; the close friends stay: strings come in
  beats 160–192  (128.0–153.6 s)  答案   the theme on violins over the full progression; "什么值得" at the top; a message is sent,
                                         and the last F major chord rings out
"""
import os, sys
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
BPM = 75.0
B = 60.0 / BPM
TOTAL_BEATS = 192
rng = np.random.default_rng(1001)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'F': [5, 9, 0], 'C': [0, 4, 7], 'Csus4': [0, 5, 7], 'Dm': [2, 5, 9], 'Bb': [10, 2, 5], 'Gm': [7, 10, 2], 'Am': [9, 0, 4], 'A': [9, 1, 4]}
PROG = [  # (start beat, length, chord, bass)
    # 问题
    (0, 4, 'F', 'F2'), (4, 4, 'C', 'E2'), (8, 4, 'Dm', 'D2'), (12, 4, 'Bb', 'Bb1'),
    (16, 4, 'F', 'A1'), (20, 4, 'Gm', 'G1'), (24, 4, 'C', 'C2'), (28, 2, 'Dm', 'D2'), (30, 2, 'Bb', 'Bb1'),
    (32, 4, 'F', 'A1'), (36, 2, 'Csus4', 'C2'), (38, 2, 'C', 'C2'),
    # 时间
    (40, 4, 'F', 'F2'), (44, 4, 'Dm', 'D2'), (48, 4, 'Bb', 'Bb1'), (52, 4, 'C', 'C2'),
    (56, 4, 'F', 'A1'), (60, 4, 'Bb', 'Bb1'), (64, 4, 'F', 'F2'), (68, 4, 'Am', 'A1'), (72, 4, 'Bb', 'Bb1'), (76, 4, 'C', 'C2'),
    (80, 4, 'Dm', 'D2'), (84, 2, 'Gm', 'G1'), (86, 2, 'A', 'A1'),
    # 环境
    (88, 4, 'Dm', 'D2'), (92, 4, 'Bb', 'Bb1'), (96, 4, 'F', 'F2'), (100, 4, 'F', 'A1'),
    (104, 4, 'Dm', 'D2'), (108, 4, 'Bb', 'Bb1'), (112, 4, 'Gm', 'G1'), (116, 4, 'A', 'A1'), (120, 4, 'Dm', 'D2'),
    # 筛选
    (124, 4, 'Bb', 'Bb1'), (128, 4, 'F', 'F2'), (132, 4, 'C', 'E2'), (136, 4, 'Dm', 'D2'),
    (140, 4, 'Bb', 'Bb1'), (144, 4, 'F', 'A1'), (148, 4, 'Gm', 'G1'), (152, 4, 'C', 'C2'), (156, 2, 'Csus4', 'C2'), (158, 2, 'C', 'C2'),
    # 答案
    (160, 4, 'F', 'F2'), (164, 4, 'C', 'E2'), (168, 4, 'Dm', 'D2'), (172, 4, 'Bb', 'Bb1'),
    (176, 4, 'F', 'A1'), (180, 4, 'Gm', 'G1'), (184, 2, 'Csus4', 'C2'), (186, 2, 'C', 'C2'), (188, 4, 'F', 'F2'),
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


# ------------------------------------------------------------------ clean chord changes
def foreign(n, beat):
    s, l, c, b = chord_at(beat); pc = int(round(midi(n))) % 12
    return pc not in PCS[c] and pc != midi(b) % 12


def fit(n, beat, beats, rel=.35, over=.05, piano=False):
    """(dur, release) for a note written `beats` long: it may ring on a little, unless that tail would sound over a chord
    that lacks it -- then it stops cleanly at the bar line."""
    end = beat + beats; tail = end + (over + rel * .5) / B
    for s, l, c, b in PROG:
        if end - 1e-6 <= s < tail and foreign(n, s):
            return beats * B - .03, (.26 if piano else .2)
    return beats * B + over, rel


def phrase(notes, rel=.35, last_rel=None):
    """[(beat, note, beats)] of one melodic line -> [(beat, note, beats, dur, release)]: legato inside the phrase."""
    out = []
    for k, (bt, n, d) in enumerate(notes):
        nxt = notes[k + 1] if k + 1 < len(notes) else None
        if nxt and nxt[0] <= bt + d + 1e-6 and midi(nxt[1]) != midi(n): dur, r = d * B - .02, .15
        elif nxt and nxt[0] <= bt + d + 1e-6: dur, r = d * B + .05, rel
        else: dur, r = fit(n, bt, d, rel=last_rel if (last_rel and not nxt) else rel)
        out.append((bt, n, d, dur, r))
    return out


def held(parts):
    """[(start, end, notes, opts)] -> [(note, start, end, opts)]: a note shared by consecutive chords is held across the
    bar line (no re-attack); every other note stops at its bar line."""
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


# 取样器里的竖琴只有一层录音、又不是持续音，力度参数不起作用：按力度换一个音量不同的同一把竖琴。
_HARPS = {}
def harp(n, start, dur, vel, bus='harp', pan=0.0, release=.9):
    k = round(float(vel), 2)
    if k not in _HARPS: _HARPS[k] = Instrument('harp', HARP.layers, sustain=False, attack=.002, release=1.2, gain=.55 * (k / .5) ** 1.2)
    song.add(_HARPS[k], n, start, dur, vel, bus=bus, pan=pan, release=release)


song = Song(T(TOTAL_BEATS), tail=4.0)
song.bus('piano', gain=1.00, reverb=.26)
song.bus('piano_soft', gain=.85, reverb=.34)
song.bus('box', gain=1.05, reverb=.42, highpass=700)                 # the music-box theme (high piano)
song.bus('harp', gain=1.00, reverb=.38)
song.bus('lead_vln', gain=2.40, reverb=.36)
song.bus('str_hi', gain=.40, reverb=.40, highpass=200)
song.bus('str_mid', gain=.62, reverb=.34, highpass=70)
song.bus('str_lo', gain=.78, reverb=.22, lowpass=2400)
song.bus('pulse', gain=.50, reverb=.04, lowpass=800)
song.bus('pad', gain=.55, reverb=.30, lowpass=2000)

# ------------------------------------------------------------------ piano: broken chords
PAT = [0, 1, 2, 1, 3, 1, 2, 1]
ACC = [1.0, .80, .90, .80, .95, .80, .90, .84]
PIANO_ENV = [(0, .40), (16, .44), (24, .50), (32, .46), (40, .48), (64, .54), (76, .52), (80, .46), (88, .42), (104, .40),
             (120, .34), (124, .42), (144, .50), (160, .52), (172, .58), (184, .54), (188, .42), (192, .36)]
QUIET = [(120, 124)]                                                 # all three lanterns out: the piano drops to one note a beat


def ost(e, beat, step, vel_scale=1.0):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[PAT[e % 8]]
    vel = env(beat, PIANO_ENV) * ACC[e % 8] * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .15, .9)), bus='piano_soft' if beat < 40 or beat >= 88 else 'piano', pan=-.12, release=rel)


for e in range(0, TOTAL_BEATS * 2):
    bt = e / 2
    if bt >= 188: break
    if any(a <= bt < b for a, b in QUIET):
        if bt % 1 == 0:
            s, l, c, b = chord_at(bt); n = PIANO_V[s][int(bt) % 3]
            dur, rel = fit(n, bt, .9, rel=.45, over=0, piano=True)
            song.add(PIANO, n, T(bt), dur, .26, bus='piano_soft', pan=-.1, release=rel)
        continue
    ost(e, bt, .5, vel_scale=.85 if bt < 40 else 1.0)
for k, q in enumerate(range(188, 192)):                              # ending: a slow F major arpeggio, let it ring
    n = ['F2', 'C3', 'A3', 'F4'][k]
    song.add(PIANO, n, T(q), (192 - q) * B + 1.0, .42 - .03 * k, bus='piano_soft', pan=-.05)

# left hand: the bass on each chord (an octave, softer in the quiet places)
for s, l, c, b in PROG:
    bm = midi(b)
    if s >= 188: continue
    v = env(s, PIANO_ENV) + .06
    for off in range(0, int(l), 2):
        dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
        song.add(PIANO, bm + 12, T(s + off), dur, float(v - (.06 if off else 0)), bus='piano', release=rel)
        if off == 0: song.add(PIANO, bm, T(s), dur, float(v - .08), bus='piano', release=rel)
song.add(PIANO, 'F1', T(188), 5.0, .5, bus='piano')

# ------------------------------------------------------------------ the music-box theme (opening) and its return (ending)
THEME = [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'F5', 1), (3, 'C5', 1),
         (4, 'E5', 1.5), (5.5, 'D5', .5), (6, 'C5', 2),
         (8, 'D5', 1), (9, 'F5', 1), (10, 'A5', 1.5), (11.5, 'G5', .5),
         (12, 'F5', 2), (14, 'D5', 1), (15, 'Bb4', 1)]
for bt, n, d in THEME:                                                 # 小时候：music box, high piano + harp
    dur, rel = fit(n, bt, min(d + .5, chord_end(bt) - bt), rel=.6, over=0, piano=True)
    song.add(PIANO, midi(n) + 12, T(bt), dur, .34 + .04 * (bt % 2 == 0), bus='box', pan=.2, release=rel)
    harp(n, T(bt), dur, .34, pan=-.15, release=rel)
RISE = [(24, 'E5', 1), (25, 'G5', 1), (26, 'C6', 2), (28, 'A5', 2), (30, 'F5', 2)]       # the chart's peak (C) and its fall
for bt, n, d in RISE:
    dur, rel = fit(n, bt, min(d + .4, chord_end(bt) - bt), rel=.5, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, .36, bus='box', pan=.2, release=rel)

# 答案: the theme returns on violins, an octave lower, over the full progression
for bt, n, d, dur, rel in phrase([(160 + b0, midi(n) - 12, d) for b0, n, d in THEME], last_rel=.6):
    v = .58 + .06 * (bt >= 164 and bt < 172) + rng.normal(0, .02)
    song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=.25 if d < 1 else .4, release=rel)
CODA = [(176, 'C5', 2), (178, 'F5', 2), (180, 'G5', 2), (182, 'Bb5', 2), (184, 'F5', 2), (186, 'E5', 2), (188, 'F5', 4)]
for bt, n, d, dur, rel in phrase(CODA, last_rel=2.0):
    song.add(STRINGS_HI, n, T(bt), dur, .62 if bt < 188 else .5, bus='lead_vln', pan=.05, attack=.4, release=rel)

# ------------------------------------------------------------------ the turn and the message (the lantern bells are sound effects)
for bt, n in [(124.5, 'D5'), (125, 'F5'), (125.5, 'Bb5')]:          # 不全是坏事
    harp(n, T(bt), 1.5, .36, pan=-.1, release=1.2)
for k in range(10):                                                  # the message is sent: a little harp run up (C major, stops at the bar line)
    n, st = MID_V[186][k % 3] + 12 * (1 + k // 3), T(186) + k * .045
    harp(n, st, T(188) - st - .03, .26 + .01 * k, pan=-.3 + .06 * k, release=.25)

# ------------------------------------------------------------------ strings underneath, never silent
STR_ENV = [(0, .26), (16, .30), (24, .36), (40, .38), (64, .44), (80, .40), (88, .36), (104, .34), (120, .30),
           (124, .36), (144, .46), (160, .52), (172, .60), (184, .56), (192, .40)]
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
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=.10, attack=.3 if s else .05, release=.3 if s < 188 else 3.0, bright=.18), st)


# ------------------------------------------------------------------ a soft heartbeat under 时间 and 答案
def kick(beat, g):
    y = sub_pulse(.7, freq=44.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(40, 80, 4): kick(bt, .20)
for bt in range(160, 188, 2): kick(bt, .22 + .004 * (bt - 160))
kick(188, .34)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=3.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
