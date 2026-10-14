"""No.57 精英主义 — original score (C-sharp minor, 90 BPM), written to the episode's cuts.

    python3 music.py        -> bgm.wav (104 s, never silent, -14 LUFS)

Same cinematic language as No.17–56 but its own material (No.38 and No.48 were also in C-sharp minor; nothing else is shared).
The episode is about merit, so the motif is a staircase: four steps up and then a leap that the steps alone could
not have made, the push of a tailwind. At the climax the stairs come back in long notes and land on E-sharp, the
major third of C-sharp. Bars of 4 beats = 2.667 s:
  beats   0– 24  ( 0.0–16.0 s)  奖金       intro: 8ths over a C-sharp pedal + the staircase
  beats  24– 56  (16.0–37.3 s)  写在墙上   LIFT on the title; cellos then violins sing the theme: i-VI-iv-V-i-iv6-V-i
  beats  56– 80  (37.3–53.3 s)  顺风逆风   driving: piano 16ths, a beat on every beat, the bass climbs A-B-C#-E-F#-G#
  beats  80– 96  (53.3–64.0 s)  配得上     tension: F-sharp minor, the Neapolitan D, suspended G-sharp
  beats  96–120  (64.0–80.0 s)  数顺风     breath: solo piano in E major, the bass walks down the scale, one heartbeat a bar
  beats 120–144  (80.0–96.0 s)  起点       climax: violins + horns over a long dominant ...
  beats 144–156  (96.0–104 s)             ... that resolves to C-sharp major
"""
import os, sys
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
BPM = 90.0
B = 60.0 / BPM
TOTAL_BEATS = 156
rng = np.random.default_rng(57)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'C#m': [1, 4, 8], 'C#': [1, 5, 8], 'A': [9, 1, 4], 'E': [4, 8, 11], 'B': [11, 3, 6], 'F#m': [6, 9, 1],
       'G#': [8, 0, 3], 'G#sus4': [8, 1, 3], 'D': [2, 6, 9], 'G#m': [8, 11, 3]}
PROG = [  # (start beat, length, chord, bass)
    # intro over a C-sharp pedal
    (0, 4, 'C#m', 'C#2'), (4, 4, 'A', 'C#2'), (8, 4, 'E', 'C#2'), (12, 4, 'B', 'C#2'), (16, 4, 'A', 'C#2'),
    (20, 2, 'G#sus4', 'G#1'), (22, 2, 'G#', 'G#1'),
    # development, cellos then violins
    (24, 4, 'C#m', 'C#2'), (28, 4, 'A', 'A1'), (32, 4, 'F#m', 'F#1'), (36, 4, 'G#', 'G#1'),
    (40, 4, 'C#m', 'C#2'), (44, 4, 'F#m', 'A1'), (48, 2, 'G#sus4', 'G#1'), (50, 2, 'G#', 'G#1'), (52, 4, 'C#m', 'C#2'),
    # headwinds and tailwinds: the bass climbs
    (56, 4, 'A', 'A1'), (60, 4, 'B', 'B1'), (64, 4, 'C#m', 'C#2'), (68, 4, 'E', 'E2'), (72, 4, 'F#m', 'F#2'), (76, 4, 'G#', 'G#2'),
    # deserving: tension
    (80, 4, 'F#m', 'F#1'), (84, 4, 'D', 'D2'), (88, 4, 'G#sus4', 'G#1'), (92, 4, 'G#', 'G#1'),
    # breath, in E, the bass walking down the scale
    (96, 4, 'E', 'E2'), (100, 4, 'B', 'D#2'), (104, 4, 'C#m', 'C#2'), (108, 4, 'G#m', 'B1'), (112, 4, 'A', 'A1'),
    (116, 2, 'G#sus4', 'G#1'), (118, 2, 'G#', 'G#1'),
    # climax: ... a long dominant ...
    (120, 4, 'C#m', 'C#2'), (124, 4, 'A', 'A1'), (128, 4, 'E', 'E2'), (132, 4, 'B', 'B1'),
    (136, 4, 'G#sus4', 'G#1'), (140, 4, 'G#', 'G#1'),
    # ... resolves to C-sharp major
    (144, 12, 'C#', 'C#2'),
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
    pv = voicing(PCS[c], pv, midi('C4'), midi('G4')); PIANO_V[s] = pv
    mv = voicing(PCS[c], mv, midi('C3'), midi('G3')); MID_V[s] = mv


def env(beat, pts):
    xs, ys = zip(*pts); return float(np.interp(beat, xs, ys))


# ------------------------------------------------------------------ clean chord changes
# 和弦一换，上一个和弦里不属于新和弦的音就要在小节线上收干净，不能拖着尾巴糊进下一个和弦。
def foreign(n, beat):
    s, l, c, b = chord_at(beat); pc = int(round(midi(n))) % 12
    return pc not in PCS[c] and pc != midi(b) % 12


def fit(n, beat, beats, rel=.35, over=.05, piano=False):
    """(dur, release) in seconds for a note written `beats` long: it may ring on a little (legato), unless that tail
    would sound over a chord that lacks it -- then it stops cleanly at the bar line."""
    end = beat + beats; tail = end + (over + rel * .5) / B
    for s, l, c, b in PROG:
        if end - 1e-6 <= s < tail and foreign(n, s):
            return beats * B - .03, (.26 if piano else .2)
    return beats * B + over, rel


def phrase(notes, rel=.35, last_rel=None):
    """[(beat, note, beats)] of one melodic line -> [(beat, note, beats, dur, release)]. One player plays one note at a
    time: a note that runs straight into a different one hands over with a short cross-fade; a phrase end rings on."""
    out = []
    for k, (bt, n, d) in enumerate(notes):
        nxt = notes[k + 1] if k + 1 < len(notes) else None
        if nxt and nxt[0] <= bt + d + 1e-6 and midi(nxt[1]) != midi(n): dur, r = d * B - .02, .15
        elif nxt and nxt[0] <= bt + d + 1e-6: dur, r = d * B + .05, rel            # same pitch again: re-bow over it
        else: dur, r = fit(n, bt, d, rel=last_rel if (last_rel and not nxt) else rel)
        out.append((bt, n, d, dur, r))
    return out


def held(parts):
    """[(start, end, notes, opts)] -> [(note, start, end, opts)]: a note shared by consecutive chords is held across the
    bar line in one bow (no re-attack); every other note stops at its bar line."""
    out, live = [], {}
    for s, e, notes, opts in parts:
        notes = [int(round(midi(n))) for n in notes]
        for n in list(live):
            if n not in notes or abs(live[n][1] - s) > 1e-6: out.append((n, *live.pop(n)))
        for n in notes:
            if n in live: live[n][1] = e
            else: live[n] = [s, e, opts]
    return sorted(out + [(n, *v) for n, v in live.items()], key=lambda x: (x[1], x[0]))


def bowed(inst, parts, bus, release=.22, final_release=1.6):
    for n, s, e, o in held(parts):
        last = e >= TOTAL_BEATS - 1e-6
        song.add(inst, n, T(s), (e - s) * B - (0 if last else .04), o['vel'], bus=bus, attack=o['attack'],
                 release=final_release if last else release)


song = Song(T(TOTAL_BEATS), tail=4.0)
song.bus('piano', gain=1.00, reverb=.24)
song.bus('piano_hi', gain=1.40, reverb=.38)
song.bus('piano_soft', gain=.85, reverb=.34)
song.bus('lead', gain=1.45, reverb=.32)
song.bus('lead_vln', gain=2.70, reverb=.34)
song.bus('str_hi', gain=.42, reverb=.40, highpass=180)
song.bus('str_mid', gain=.62, reverb=.34, highpass=70)
song.bus('str_lo', gain=.80, reverb=.22, lowpass=2500)
song.bus('horn', gain=1.15, reverb=.40)
song.bus('pulse', gain=.60, reverb=.04, lowpass=900)
song.bus('pad', gain=.55, reverb=.30, lowpass=2200)
song.bus('click', gain=.50, reverb=.10, highpass=2500)

# ------------------------------------------------------------------ piano ostinato
PAT = [0, 1, 2, 1, 3, 1, 2, 1]
PAT_UP = [0, 1, 2, 3, 1, 2, 3, 2]
ACC8 = [1.0, .80, .90, .80, .95, .80, .90, .84]
ACC16 = [1.0, .78, .86, .80, .94, .78, .88, .82]
PIANO_ENV = [(0, .50), (16, .56), (20, .60), (24, .56), (40, .62), (52, .64), (56, .58), (72, .68), (80, .64), (92, .52),
             (96, .40), (118, .62), (120, .70), (136, .82), (140, .78), (144, .60), (156, .40)]


def ost_note(e, beat, step, vel_scale=1.0, accents=ACC8, pat=PAT):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[pat[e % 8]]
    vel = env(beat, PIANO_ENV) * accents[e % 8] * (1 + .05 * np.sin(np.pi * ((beat % 4) / 4))) * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .2, .95)), bus='piano', pan=-.12, release=rel)


for e in range(0, 24 * 2):                                           # intro: broken chords under the staircase
    bt = e / 2; s, l, c, b = chord_at(bt); v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[[0, 2, 1, 3, 0, 2, 3, 1][e % 8]]
    dur, rel = fit(n, bt, min(.9, chord_end(bt) - bt), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, float(np.clip(env(bt, PIANO_ENV) * (.7 if e % 8 == 0 else .55) * (1 + rng.normal(0, .03)), .15, .8)),
             bus='piano_soft', pan=-.1, release=rel)
for s, l, c, b in PROG:                                              # ... and a low octave at each bar
    if s >= 20: break
    for n in (midi(b), midi(b) + 12):
        song.add(PIANO, n, T(s), 3.5 * B, .40 + .02 * (s / 4), bus='piano')
for e in range(24 * 2, 56 * 2):                                      # development: broken-chord 8ths
    ost_note(e, e / 2, .5)
for e in range(56 * 4, 80 * 4):                                      # headwinds and tailwinds: 16ths, climbing pattern
    ost_note(e, e / 4, .25, vel_scale=.72, accents=ACC16, pat=PAT_UP)
for e in range(80 * 2, 96 * 2):                                      # tension: 8ths, thinning out
    bt = e / 2
    ost_note(e, bt, .5, vel_scale=.95 - .2 * (bt - 80) / 16)
for q in range(96, 116):                                             # breath: soft quarter-note broken chords
    s, l, c, b = chord_at(q)
    v = [n - 12 for n in PIANO_V[s]]
    n = [v[0], v[2], v[1], v[2]][q % 4]
    dur, rel = fit(n, q, min(1.6, chord_end(q) - q), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(q), dur, .32 + .05 * (q % 4 == 0) + rng.normal(0, .02), bus='piano_soft', pan=-.1, release=rel)
for k, e in enumerate(range(116 * 2, 120 * 2)):                      # rising 8ths into the climax
    ost_note(e, e / 2, .5, vel_scale=.78 + .04 * k)
for e in range(120 * 4, 144 * 4):                                    # climax 16ths
    ost_note(e, e / 4, .25, vel_scale=.86, accents=ACC16)
for k, q in enumerate(range(144, 150)):                              # ending: a slow C-sharp major arpeggio, then let it ring
    n = ['C#2', 'G#2', 'C#3', 'E#3', 'G#3', 'C#4'][k]
    song.add(PIANO, n, T(q), (156 - q) * B, .46 - .03 * k, bus='piano_soft', pan=-.05)

# left hand octaves
for s, l, c, b in PROG:
    bm = midi(b)
    if s < 20:
        continue                                                     # the intro has its own low octaves
    if 24 <= s < 96 or 120 <= s < 144:
        big = s >= 120 or 56 <= s < 80
        for off in range(0, int(l), 2):
            v = (.58 if off == 0 else .48) + (.10 if big else 0) + rng.normal(0, .02)
            dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
            song.add(PIANO, bm + 12, T(s + off), dur, v, bus='piano', release=rel)
            if off == 0: song.add(PIANO, bm, T(s), dur, v - .04, bus='piano', release=rel)
song.add(PIANO, 'C#2', T(24), 3.5, .70, bus='piano')                   # the lift "boom" (title)
song.add(PIANO, 'C#2', T(120), 3.5, .74, bus='piano')                  # climax "boom"
song.add(PIANO, 'C#2', T(144), 6.0, .55, bus='piano')                 # final low C-sharp

# ------------------------------------------------------------------ the question (intro, high piano)
HOOK = [(0, 'C#5', .5, .42), (.5, 'D#5', .5, .40), (1, 'E5', .5, .42), (1.5, 'F#5', .5, .44), (2, 'G#5', 1, .48), (3, 'E5', 1, .42),   # four steps, then a leap ...
        (4, 'C#5', .5, .42), (4.5, 'D#5', .5, .40), (5, 'E5', .5, .42), (5.5, 'F#5', .5, .44), (6, 'A5', 1, .48), (7, 'E5', 1, .42),
        (8, 'B4', .5, .42), (8.5, 'C#5', .5, .40), (9, 'D#5', .5, .42), (9.5, 'E5', .5, .44), (10, 'G#5', 1, .48), (11, 'B5', 1, .46),
        (12, 'B4', .5, .42), (12.5, 'C#5', .5, .40), (13, 'D#5', .5, .42), (13.5, 'E5', .5, .44), (14, 'F#5', 1, .48), (15, 'D#5', 1, .44),
        (16, 'A4', .5, .44), (16.5, 'B4', .5, .42), (17, 'C#5', .5, .44), (17.5, 'D#5', .5, .46), (18, 'E5', 1, .50), (19, 'A5', 1, .50),
        (20, 'C#6', 2, .54), (22, 'B#5', 2, .58)]
for bt, n, d, v in HOOK:
    dur, rel = fit(n, bt, min(d + .6, chord_end(bt) - bt), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, v, bus='piano_hi', pan=.18, release=rel)
    song.add(PIANO, midi(n) - 12, T(bt), dur, v - .12, bus='piano_hi', pan=.18, release=rel)

# ------------------------------------------------------------------ theme
DEV = [(24, 'G#5', 1), (25, 'E5', 1), (26, 'C#6', 2), (28, 'C#6', 1), (29, 'E6', 1), (30, 'A5', 2),
       (32, 'A5', 1), (33, 'F#5', 1), (34, 'C#6', 1.5), (35.5, 'B5', .5), (36, 'B#5', 3), (39, 'G#5', 1),
       (40, 'G#5', 1), (41, 'C#6', 1), (42, 'E6', 2), (44, 'C#6', 1.5), (45.5, 'B5', .5), (46, 'A5', 2), (48, 'C#6', 2), (50, 'B#5', 2),
       (52, 'C#6', 2), (54, 'G#5', 2)]
LEAD_ENV = [(24, .62), (32, .70), (36, .76), (40, .70), (44, .80), (48, .84), (52, .74), (56, .62)]
for bt, n, d, dur, rel in phrase(DEV):
    v = env(bt, LEAD_ENV) * (1.0 if bt % 2 == 0 else .88) + rng.normal(0, .02)
    atk = .10 if d < 1 else .28
    if bt < 40: song.add(STRINGS_MID, midi(n) - 12, T(bt), dur, v, bus='lead', pan=-.05, attack=atk, release=rel)
    else: song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=atk, release=rel)

# headwinds and tailwinds: violins climb through the chords, one per bar; a bright piano note every 2 beats
CLIMB = [(56, 'C#5'), (60, 'D#5'), (64, 'E5'), (68, 'G#5'), (72, 'A5'), (76, 'B#5')]
for k, (bt, n, d, dur, rel) in enumerate(phrase([(bt, n, 4) for bt, n in CLIMB])):
    song.add(STRINGS_HI, n, T(bt), dur, .56 + .045 * k, bus='lead_vln', pan=.05, attack=.35, release=rel)
for bt in range(56, 80, 2):
    s, l, c, b = chord_at(bt)
    top = max(n for n in PIANO_V[s]) + 24                              # a chord tone two octaves up
    song.add(PIANO, top, T(bt), .9 * B, .38 + .012 * (bt - 56), bus='piano_hi', pan=.25)

# tension: violins over F-sharp minor | D (the Neapolitan) | G#sus4 | G#
TEN = [(80, 'A5', 2), (82, 'C#6', 2), (84, 'D6', 2), (86, 'F#5', 2), (88, 'C#6', 4), (92, 'B#5', 4)]
for bt, n, d, dur, rel in phrase(TEN):
    v = (.72 if bt < 88 else .62) + rng.normal(0, .02)
    song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=.3, release=rel)

# breath: solo piano melody over the falling bass (with an octave shimmer above)
BREATH = [(96, 'G#4', 1.5, .48), (97.5, 'F#4', .5, .40), (98, 'E4', 2, .46), (100, 'F#4', 1, .44), (101, 'D#4', 1, .40), (102, 'B4', 2, .44),
          (104, 'C#5', 1.5, .48), (105.5, 'B4', .5, .40), (106, 'G#4', 2, .44), (108, 'B4', 1, .44), (109, 'G#4', 1, .42), (110, 'D#4', 2, .46),
          (112, 'C#4', 1.5, .48), (113.5, 'E4', .5, .40), (114, 'A4', 2, .50), (116, 'G#4', 2, .52), (118, 'B#4', 2, .56)]
for bt, n, d, v in BREATH:
    dur, rel = fit(n, bt, min(d + .45, chord_end(bt) - bt), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(bt), dur, v, bus='piano_soft', pan=.1, release=rel)
    song.add(PIANO, midi(n) + 12, T(bt), dur, v - .14, bus='piano_soft', pan=.1, release=rel)

# climax: violins + horns (two octaves below), horn harmony; the stairs in long notes; D-sharp rises to E-sharp, the major third of C-sharp
CLX = [(120, 'E6', 1), (121, 'C#6', 1), (122, 'G#5', 2), (124, 'A5', 1), (125, 'C#6', 1), (126, 'E6', 2),
       (128, 'G#5', 1), (129, 'B5', 1), (130, 'E6', 2), (132, 'D#6', 1), (133, 'B5', 1), (134, 'F#5', 2),
       (136, 'C#6', 2), (138, 'G#5', 2), (140, 'B#5', 2), (142, 'D#6', 2), (144, 'E#6', 8)]
CLX_ENV = [(120, .80), (128, .90), (136, .96), (140, .86), (144, .70), (156, .5)]
for bt, n, d, dur, rel in phrase(CLX, last_rel=1.6):
    v = env(bt, CLX_ENV) * (1.0 if bt % 2 == 0 else .9) + rng.normal(0, .02)
    atk = .10 if d < 1 else .22
    song.add(STRINGS_HI, n, T(bt), dur, v, bus='lead_vln', pan=.05, attack=atk, release=rel)
    song.add(HORN, midi(n) - 24, T(bt), dur, v * .9, bus='horn', pan=-.2, attack=atk + .05, release=rel)
HORN2 = [(120, 'G#3', 4), (124, 'A3', 4), (128, 'G#3', 4), (132, 'F#3', 4), (136, 'G#3', 4), (140, 'G#3', 4), (144, 'G#3', 8)]
for bt, n, d, dur, rel in phrase(HORN2, rel=.45, last_rel=1.6):
    song.add(HORN, n, T(bt), dur, .70 + .08 * (bt == 136), bus='horn', pan=.25, attack=.5, release=rel)
song.add(HORN, 'C#4', T(116), 2 * B - .02, .55, bus='horn', attack=.6, release=.15)      # swell into the climax
song.add(HORN, 'B#3', T(118), 2 * B - .03, .65, bus='horn', attack=.3, release=.2)

# ------------------------------------------------------------------ strings underneath
STR_ENV = [(0, .30), (16, .42), (20, .55), (24, .57), (40, .60), (52, .65), (56, .60), (76, .70), (80, .62), (92, .45),
           (96, .20), (116, .36), (120, .60), (140, .66), (144, .55), (156, .40)]
LO, LO8, MID, HI = [(0, 20, ['C#2'], dict(vel=.45, attack=.08))], [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    if s >= 20: LO.append((s, e, [b], dict(vel=v, attack=.25)))
    if s >= 120: LO8.append((s, e, [midi(b) + 12], dict(vel=v * .6, attack=.25)))
    if 8 <= s < 24 or 40 <= s:
        MID.append((s, e, MID_V[s][::2] if 96 <= s < 116 else MID_V[s], dict(vel=v * (.85 if s < 24 else .9), attack=.6 if s < 24 else .35)))
    if 24 <= s < 40: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .75, attack=.5)))
    if 120 <= s < 144: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .8, attack=.3)))
    if s == 144: HI.append((s, e, ['G#4', 'C#5'], dict(vel=.5, attack=.8)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, LO8, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')

# swells into the lift and into the climax
for base in (20, 116):
    song.add(STRINGS_HI, 'C#5', T(base), 2 * B - .02, .62, bus='str_hi', attack=.8, release=.15)
    song.add(STRINGS_HI, 'B#4', T(base + 2), 2 * B - .03, .70, bus='str_hi', attack=.4, release=.2)
    song.add(STRINGS_HI, 'G#4', T(base), 4 * B + .1, .58, bus='str_hi', attack=1.2, release=.5)

# ------------------------------------------------------------------ warm pad underneath
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    g = .10 * (1.25 if 96 <= s < 120 else 1.0)
    st = T(s) - .15 if s else 0.0                                     # short cross-fade centred on the bar line
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=g, attack=.3 if s else .05, release=.3 if s < 144 else 3.0, bright=.2), st)


# ------------------------------------------------------------------ a soft tick under the headwinds section
def click(beat, g, bright=1.0):
    n = int(.03 * SR); t = np.arange(n) / SR
    y = rng.standard_normal(n) * np.exp(-t / (.004 + .002 * bright)) * g
    song.add_synth('click', np.stack([y, np.roll(y, 37)], 1), T(beat))


for e in range(56 * 2, 80 * 2):
    click(e / 2, .065 if e % 2 == 0 else .035, bright=.5)


# ------------------------------------------------------------------ heartbeat
def kick(beat, g):
    y = sub_pulse(.7, freq=46.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(0, 20, 4): kick(bt, .26 + .01 * bt)                       # one soft heartbeat a bar
for k, bt in enumerate((20, 21, 22, 22.5, 23, 23.5)): kick(bt, .40 + .04 * k)              # pickup into the lift
for bt in range(24, 56):                kick(bt, (.40 + .006 * (bt - 24)) * (1.0 if bt % 4 == 0 else .82))
for bt in range(56, 80):                kick(bt, (.48 + .008 * (bt - 56)) * (1.0 if bt % 2 == 0 else .86))   # driving
for bt in range(80, 96, 2):             kick(bt, .46 - .02 * (bt - 80) / 2)
for bt in range(96, 116, 4):            kick(bt, .24)
for k, bt in enumerate(np.arange(116, 120, .5)): kick(bt, .22 + .05 * k)
for bt in range(120, 140):              kick(bt, .62 * (1.0 if bt % 4 == 0 else .82))
for bt in (123.5, 127.5, 131.5, 135.5): kick(bt, .42)
for bt in (140, 142):                   kick(bt, .46)                                        # the long dominant
kick(144, .80)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=4.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
