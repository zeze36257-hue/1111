"""No.64 你的眼睛在骗你 — original score (D major, 80 BPM). The first host-on-camera episode.

    python3 music.py        -> bgm.wav (72 s, never silent, -14 LUFS; the episode mix sets the bed level under the voice)

A light "magic trick" score that sits under a talking host: harp and soft staccato piano in the low-middle and high
registers, a warm pad, almost no melody in the voice range. The Lydian G-sharp is the "trick" colour. Bars of 4 beats
= 3.0 s; every reveal lands on a beat:
  beats  0– 4  ( 0– 3 s)  开场        the trick motif (D-A-G#-A) on harp + celesta-like high piano
  beats  4–16  ( 3–12 s)  第1关       pizzicato groove; the reveal at beat 14 (10.5 s) is a bright A chord
  beats 16–36  (12–27 s)  第2关       the groove again; the reveal on the downbeat of beat 28 (21.0 s)
  beats 36–64  (27–48 s)  第3关·盯点   the groove stops: a long held pad, a clock on every beat, the bass and strings climb,
                                    F-sharp major (the dominant of B minor) for the five-second countdown ...
  beats 64–72  (48–54 s)  换成黑白     ... and it opens into D major (Lydian) at 48.0: harp glissando, high strings
  beats 72–92  (54–69 s)  原理 · 结尾  the groove returns, a little fuller
  beats 92–96  (69–72 s)  片尾        a last D major chord, let ring
"""
import os, sys
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
BPM = 80.0
B = 60.0 / BPM
TOTAL_BEATS = 96
rng = np.random.default_rng(64)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'D': [2, 6, 9], 'Dlyd': [2, 6, 9, 8, 4], 'Bm': [11, 2, 6], 'G': [7, 11, 2], 'A': [9, 1, 4], 'Asus4': [9, 2, 4],
       'Fsm': [6, 9, 1], 'Em': [4, 7, 11], 'Fs': [6, 10, 1], 'Fssus4': [6, 11, 1], 'Gmaj7': [7, 11, 2, 6]}
PROG = [  # (start beat, length, chord, bass)
    (0, 4, 'Dlyd', 'D2'),
    # level 1
    (4, 4, 'D', 'D2'), (8, 4, 'Bm', 'B1'), (12, 2, 'G', 'G1'), (14, 2, 'A', 'A1'),
    # level 2
    (16, 4, 'D', 'D2'), (20, 4, 'Fsm', 'Fs1'), (24, 4, 'G', 'G1'), (28, 4, 'D', 'A1'), (32, 2, 'Em', 'E2'), (34, 2, 'A', 'A1'),
    # level 3: stare
    (36, 4, 'Bm', 'B1'), (40, 4, 'G', 'G1'), (44, 4, 'Em', 'E2'), (48, 4, 'Bm', 'B1'), (52, 4, 'G', 'G1'), (56, 4, 'Em', 'E2'),
    (60, 2, 'Fssus4', 'Fs1'), (62, 2, 'Fs', 'Fs1'),
    # the switch: wonder
    (64, 4, 'Dlyd', 'D2'), (68, 4, 'Gmaj7', 'G1'),
    # why + ending
    (72, 4, 'D', 'D2'), (76, 4, 'A', 'Cs2'), (80, 4, 'Bm', 'B1'), (84, 4, 'G', 'G1'), (88, 2, 'Asus4', 'A1'), (90, 2, 'A', 'A1'),
    (92, 4, 'D', 'D2'),
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


HI_V, MID_V = {}, {}
hv = mv = None
for s, l, c, b in PROG:
    hv = voicing(PCS[c], hv, midi('D5'), midi('A5')); HI_V[s] = hv          # above the voice: harp / high piano
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


def bowed(inst, parts, bus, release=.22, final_release=1.8):
    for n, s, e, o in held(parts):
        last = e >= TOTAL_BEATS - 1e-6
        song.add(inst, n, T(s), (e - s) * B - (0 if last else .04), o['vel'], bus=bus, attack=o['attack'],
                 release=final_release if last else release)


# 取样器里的竖琴只有一层录音、又不是持续音，力度参数不起作用：这里按力度换一个音量不同的同一把竖琴。
_HARPS = {}
def harp(n, start, dur, vel, bus='harp', pan=0.0, release=.9):
    k = round(float(vel), 2)
    if k not in _HARPS: _HARPS[k] = Instrument('harp', HARP.layers, sustain=False, attack=.002, release=1.2, gain=.55 * (k / .5) ** 1.2)
    song.add(_HARPS[k], n, start, dur, vel, bus=bus, pan=pan, release=release)


song = Song(T(TOTAL_BEATS), tail=4.0)
song.bus('harp', gain=1.10, reverb=.36)
song.bus('celesta', gain=.80, reverb=.42, highpass=900)
song.bus('pizz', gain=.85, reverb=.20, lowpass=3000)
song.bus('bass', gain=1.00, reverb=.14, lowpass=900)
song.bus('str_hi', gain=.40, reverb=.42, highpass=300)
song.bus('str_mid', gain=.50, reverb=.34, highpass=80)
song.bus('str_lo', gain=.70, reverb=.22, lowpass=2000)
song.bus('pulse', gain=.55, reverb=.04, lowpass=800)
song.bus('pad', gain=.60, reverb=.30, lowpass=2000)
song.bus('click', gain=.45, reverb=.10, highpass=2500)

GROOVE = [(4, 16), (16, 36), (72, 92)]                              # beats with the pizzicato groove
in_groove = lambda bt: any(a <= bt < b for a, b in GROOVE)

# ------------------------------------------------------------------ the trick motif (D-A-G#-A) and its answers
MOTIF = [(0, 'D5', .5), (.5, 'A5', .5), (1, 'Gs5', .5), (1.5, 'A5', 1.5)]
def motif(at, transpose=0, vel=.42, bus='celesta', octave=12):
    for bt, n, d in MOTIF:
        m = midi(n) + transpose
        dur, rel = fit(m, at + bt, d + .4, rel=.6, over=0, piano=True)
        song.add(PIANO, m + octave, T(at + bt), dur, vel, bus=bus, pan=.2, release=rel)
        harp(m, T(at + bt), dur, vel - .02, bus='harp', pan=-.15, release=.9)


motif(0, vel=.36)
motif(64, vel=.36)                                                   # the switch: the trick, revealed (soft: the host whispers here)
for at, notes in [(14, ['A5', 'Cs6', 'E6']), (28, ['D5', 'Fs5', 'A5', 'D6'])]:   # the two "ta-da"s (level 1 / level 2 reveals)
    for k, n in enumerate(notes):
        d = T(chord_end(at)) - T(at) - k * .035 - .03                 # rings to the bar line, then stops (the next chord lacks C#/E)
        song.add(PIANO, n, T(at) + k * .035, d, .38, bus='celesta', pan=.15, release=.26)
        if k: harp(midi(n) - 12, T(at) + k * .035, d, .3, bus='harp', pan=-.1, release=.3)

# ------------------------------------------------------------------ harp arpeggios (hook, the switch, the end card)
def harp_arp(at, beats, step=.5, up=True, vel=.42, ring=1.0):
    s0 = chord_at(at)[0]
    for e in range(int(beats / step)):
        bt = at + e * step; s, l, c, b = chord_at(bt)
        v = MID_V[s] + [n + 12 for n in MID_V[s]] + [n + 24 for n in MID_V[s][:1]]
        n = v[e % len(v)] if up else v[-1 - e % len(v)]
        dur, rel = fit(n, bt, min(ring, chord_end(bt) - bt), rel=.6, over=0)
        harp(n, T(bt), dur, vel * (1 + rng.normal(0, .04)), bus='harp', pan=-.2 + .4 * (e % 2), release=rel)


harp_arp(1.5, 2.5, step=.5, vel=.28)
harp_arp(64, 8, step=.5, vel=.22, ring=.8)                                   # the wonder: harp ripples over D Lydian, G maj7
harp_arp(92, 3.5, step=.25, vel=.34)
for k in range(12):                                                  # a glissando right on the switch
    n = MID_V[64][k % 3] + 12 * (k // 3)
    harp(n, T(64) - .32 + k * .027, 1.0, .16 + .008 * k, bus='harp', pan=-.4 + .07 * k, release=.8)

# ------------------------------------------------------------------ the groove: pizzicato bass + offbeat harp/piano chords
PIZZ_ENV = [(4, .50), (16, .54), (28, .58), (36, .40), (72, .46), (84, .56), (92, .40)]
for bt8 in range(0, TOTAL_BEATS * 2):
    bt = bt8 / 2
    if not in_groove(bt): continue
    s, l, c, b = chord_at(bt); bm = midi(b)
    vel = env(bt, PIZZ_ENV)
    pos = bt % 4
    if pos in (0, 2):                                                # bass on 1 and 3 (root, then the fifth)
        n = bm if pos == 0 else bm + next(i for i in (7, 5, 3, 4, 12) if (bm + i) % 12 in PCS[c])   # a chord tone above the bass
        dur, rel = fit(n, bt, .9, rel=.25, over=0, piano=True)
        song.add(PIANO, n, T(bt), dur * .55, vel + .06, bus='bass', release=.18)
        song.add(PIANO, n + 12, T(bt), dur * .45, vel - .1, bus='pizz', pan=-.1, release=.14)
    if pos in (.5, 1.5, 2.5, 3.5):                                   # the "ticking" offbeats: a short high chord
        top = HI_V[s]
        for k, n in enumerate(top[:2] if pos in (.5, 2.5) else top[1:]):
            dur, rel = fit(n, bt, .4, rel=.2, over=0, piano=True)
            song.add(PIANO, n, T(bt) + k * .012, .14, vel * .62 * (1 + rng.normal(0, .05)), bus='pizz', pan=.22, release=.16)
    if pos == 3:                                                     # a harp pluck on beat 4 leading into the next bar
        n = HI_V[s][0] - 12
        dur, rel = fit(n, bt, 1.0, rel=.6, over=0)
        harp(n, T(bt), dur, vel * .8, bus='harp', pan=-.25, release=rel)

# a high answering figure every other bar in the groove (very sparse, above the voice)
ANS = [(6, ['Fs5', 'E5', 'D5']), (10, ['D5', 'Cs5', 'B4']), (18, ['A5', 'Fs5', 'Cs5']), (22, ['Cs6', 'A5', 'G5']),
       (26, ['B5', 'G5', 'D5']), (32, ['G5', 'E5', 'Cs5']), (74, ['Fs5', 'E5', 'Cs5']), (78, ['E5', 'Cs5', 'B4']),
       (82, ['Fs5', 'D5', 'B4']), (86, ['G5', 'D5', 'A4'])]
for at, notes in ANS:
    for k, n in enumerate(notes):
        bt = at + 1 + k * .5
        dur, rel = fit(n, bt, min(.6, chord_end(bt) - bt), rel=.5, over=0, piano=True)
        song.add(PIANO, midi(n) + 12, T(bt), dur, .30 + .02 * (k == 0), bus='celesta', pan=.25, release=rel)

# ------------------------------------------------------------------ the stare: held strings that climb, a clock, a heartbeat
STARE_HI = [(36, 'Fs4'), (40, 'G4'), (44, 'B4'), (48, 'B4'), (52, 'D5'), (56, 'E5'), (60, 'Fs5'), (62, 'As4')]
for k, (bt, n) in enumerate(STARE_HI):
    l = (STARE_HI[k + 1][0] if k + 1 < len(STARE_HI) else 64) - bt
    song.add(STRINGS_HI, n, T(bt), l * B - .04, .40 + .028 * k, bus='str_hi', attack=.6 if k == 0 else .25, release=.2)
for bt in range(36, 64):                                             # the clock: a soft click on every beat
    n = int(.03 * SR); tt = np.arange(n) / SR
    y = rng.standard_normal(n) * np.exp(-tt / .003) * (.07 if bt % 2 == 0 else .045)
    song.add_synth('click', np.stack([y, np.roll(y, 29)], 1), T(bt))


def kick(beat, g):
    y = sub_pulse(.7, freq=46.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(48, 64, 2): kick(bt, .20 + .012 * (bt - 48))         # a heartbeat creeps in under the stare
for bt in range(60, 64): kick(bt, .34)
for bt in range(4, 36, 4): kick(bt, .22)                             # a soft downbeat under the groove
for bt in range(72, 92, 4): kick(bt, .24)
kick(64, .36); kick(92, .36)

# ------------------------------------------------------------------ strings and pad underneath, never silent
STR_ENV = [(0, .26), (4, .30), (36, .34), (60, .50), (64, .42), (72, .32), (92, .38), (96, .3)]
LO, MID, HI = [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    LO.append((s, e, [b], dict(vel=v * (1.15 if 36 <= s < 64 else 1.0), attack=.3)))
    MID.append((s, e, MID_V[s], dict(vel=v * .8, attack=.5)))
    if 64 <= s < 72 or s >= 92: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .7, attack=.6)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    if c in ('Dlyd',): freqs += [hz('E4'), hz('Gs4')]                  # the Lydian colour only in the pad
    if c == 'Gmaj7': freqs += [hz('Fs4')]
    g = .10 * (1.3 if 36 <= s < 64 else 1.0)
    st = T(s) - .15 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=g, attack=.3 if s else .05, release=.3 if s < 92 else 3.0, bright=.18), st)
song.add(PIANO, 'D2', T(64), 4.0, .4, bus='bass')                    # the switch: a low D
song.add(PIANO, 'D2', T(92), 3.0, .44, bus='bass')

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=1.6)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
