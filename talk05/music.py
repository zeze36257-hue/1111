"""No.49《恐惧型依恋》 — original score (G minor → B-flat major, 75 BPM).

    python3 music.py        -> bgm.wav (70.4 s, never silent, -14 LUFS)

A short drama, so the music follows the story. Bars of 4 beats = 3.2 s; sections start on bar lines (timeline.json):
  beats   0– 28  那一晚    rain at the window; slow piano and a music-box tune in G minor; "嗯" is sent and the night goes by
  beats  28– 48  第二天    a nervous heartbeat when he comes to the door; the door shuts on C minor and the music almost stops;
                           "它不是不想被爱" — the strings come back with the tune on a violin, and D pulls into the dive
  beats  48– 68  为什么    lighter: B-flat, harp arpeggios under the rulers; a pull at "身体却在往后退"
  beats  68– 88  怎么办    B-flat major: the tune on violins, rising; one step; E-flat → B-flat at the end
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
assert TOTAL_BEATS == 88, TOTAL_BEATS                                # the arrangement below is written for 88 beats
rng = np.random.default_rng(4902)


def T(beat): return beat * B


# ------------------------------------------------------------------ harmony
PCS = {'Gm': [7, 10, 2], 'Eb': [3, 7, 10], 'Bb': [10, 2, 5], 'F': [5, 9, 0], 'Cm': [0, 3, 7], 'D': [2, 6, 9]}
PROG = [  # (start beat, length, chord, bass)
    # 那一晚
    (0, 4, 'Gm', 'G1'), (4, 4, 'Eb', 'Eb2'), (8, 4, 'Bb', 'Bb1'), (12, 4, 'F', 'F1'), (16, 4, 'Gm', 'G1'), (20, 4, 'Eb', 'Eb2'), (24, 2, 'Cm', 'C2'), (26, 2, 'D', 'D2'),
    # 第二天：门关上（36，C 小调）；“它不是不想被爱”（40）
    (28, 4, 'Gm', 'G1'), (32, 4, 'Eb', 'Eb2'), (36, 4, 'Cm', 'C2'), (40, 4, 'Eb', 'Eb2'), (44, 4, 'D', 'D2'),
    # 为什么
    (48, 4, 'Bb', 'Bb1'), (52, 4, 'F', 'F1'), (56, 4, 'Gm', 'G1'), (60, 4, 'Eb', 'Eb2'), (64, 4, 'F', 'F1'),
    # 怎么办
    (68, 4, 'Eb', 'Eb2'), (72, 4, 'F', 'F1'), (76, 4, 'Bb', 'Bb1'), (80, 4, 'Eb', 'Eb2'), (84, 4, 'Bb', 'Bb1'),
]
assert sum(l for _, l, _, _ in PROG) == 88


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

# ------------------------------------------------------------------ piano: broken chords (silent while the door is shut)
PAT = [0, 1, 2, 1, 3, 1, 2, 1]
ACC = [1.0, .80, .90, .80, .95, .80, .90, .84]
PIANO_ENV = [(0, .30), (16, .32), (24, .36), (28, .36), (36, .20), (40, .30), (44, .40), (48, .38), (60, .42), (68, .40), (76, .50), (84, .44), (88, .34)]
REST = (36, 40)


def ost(e, beat, step, vel_scale=1.0):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[PAT[e % 8]]
    vel = env(beat, PIANO_ENV) * ACC[e % 8] * vel_scale * (1 + rng.normal(0, .035))
    dur, rel = fit(n, beat, min(step * 1.7, chord_end(beat) - beat), rel=.45, over=0, piano=True)
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .15, .9)), bus='piano_soft' if beat < 48 or beat >= 68 else 'piano', pan=-.12, release=rel)


for e in range(0, TOTAL_BEATS * 2):
    bt = e / 2
    if bt >= 84: break
    if REST[0] <= bt < REST[1]: continue
    if bt < 28 and e % 2: continue                                   # 夜里：只弹四分音符，慢一点
    ost(e, bt, .5 if bt >= 28 else 1, vel_scale=.85 if bt < 28 else 1.0)
for k, q in enumerate(range(84, 88)):                                # ending: a slow B-flat arpeggio, let it ring
    n = ['Bb1', 'F2', 'D3', 'Bb3'][k]
    song.add(PIANO, n, T(q), (88 - q) * B + 1.0, .42 - .03 * k, bus='piano_soft', pan=-.05)
song.add(PIANO, 'F4', T(86), 2 * B + 1.0, .3, bus='piano_soft', pan=.1)

for s, l, c, b in PROG:                                              # left hand
    bm = midi(b)
    if s >= 84: continue
    v = env(s, PIANO_ENV) + .06
    if REST[0] <= s < REST[1]:                                       # 门关上：只剩一个低音，慢慢消失
        song.add(PIANO, bm, T(s), 4 * B, .34, bus='piano_soft', release=1.2); continue
    for off in range(0, int(l), 2):
        dur, rel = fit(bm, s + off, 1.8, rel=.45, over=0, piano=True)
        song.add(PIANO, bm + 12, T(s + off), dur, float(v - (.06 if off else 0)), bus='piano', release=rel)
        if off == 0: song.add(PIANO, bm, T(s), dur, float(v - .08), bus='piano', release=rel)
song.add(PIANO, 'Bb0', T(84), 6.0, .45, bus='piano')

# ------------------------------------------------------------------ the tune: music box at night; violin under "它不是不想被爱"; violins in B-flat at the end
NIGHT = [(0, 'D5', 1.5), (1.5, 'C5', .5), (2, 'Bb4', 1), (3, 'G4', 1),             # Gm
         (4, 'G4', 1.5), (5.5, 'Bb4', .5), (6, 'Eb5', 2),                          # Eb
         (8, 'D5', 1.5), (9.5, 'C5', .5), (10, 'Bb4', 1), (11, 'F4', 1),           # Bb
         (12, 'A4', 2), (14, 'C5', 1), (15, 'A4', 1),                              # F
         (16, 'D5', 1.5), (17.5, 'C5', .5), (18, 'Bb4', 1),                        # Gm（“嗯”发出去，旋律停在这里）
         (20, 'G4', 2), (22, 'Bb4', 2)]                                            # Eb：天慢慢亮
for bt, n, d in NIGHT:
    dur, rel = fit(n, bt, min(d + .5, chord_end(bt) - bt), rel=.6, over=0, piano=True)
    song.add(PIANO, midi(n) + 12, T(bt), dur, .28 + .04 * (bt % 2 == 0), bus='box', pan=.2, release=rel)
    if bt % 4 == 0: harp(n, T(bt), dur, .22, pan=-.15, release=rel)
SAD = [(40, 'G5', 2), (42, 'F5', 1), (43, 'Eb5', 1), (44, 'F#5', 3), (47, 'D5', 1)]   # 它不是不想被爱，是太想了，又太怕了
for bt, n, d, dur, rel in phrase([(bt, midi(n) - 12, d) for bt, n, d in SAD], last_rel=.5):
    song.add(STRINGS_HI, n, T(bt), dur, .5, bus='lead_vln', pan=.05, attack=.35, release=rel)
WARM = [(68, 'G4', 1.5), (69.5, 'Bb4', .5), (70, 'Eb5', 2),                        # Eb
        (72, 'F5', 1.5), (73.5, 'Eb5', .5), (74, 'C5', 2),                         # F
        (76, 'D5', 1.5), (77.5, 'F5', .5), (78, 'Bb5', 2),                         # Bb：越想要，越推开
        (80, 'G5', 2), (82, 'Bb5', 2), (84, 'F5', 4)]                              # Eb → Bb
for bt, n, d, dur, rel in phrase([(bt, midi(n) - 12, d) for bt, n, d in WARM], last_rel=2.4):
    song.add(STRINGS_HI, n, T(bt), dur, .52 + .04 * (bt >= 76), bus='lead_vln', pan=.05, attack=.25 if d < 1 else .4, release=rel)

# ------------------------------------------------------------------ moments
for bt, n in [(2.6, 'D6'), (2.75, 'G5')]:                            # 晚安，想你了（消息到了）
    harp(n, T(bt), 1.4, .24, pan=.3, release=1.0)
for k in range(8):                                                   # 门开了，他在门外
    n, st = MID_V[28][k % 3] + 12 * (1 + k // 3), T(28.8) + k * .06
    harp(n, st, 1.2, .18 + .01 * k, pan=.3 - .06 * k, release=.6)
for k in range(8):                                                   # 题目
    n, st = MID_V[48][k % 3] + 12 * (1 + k // 3), T(49.8) + k * .05
    harp(n, st, 1.4, .2 + .01 * k, pan=-.2 + .05 * k, release=.7)
for k in range(10):                                                  # 一次一步（爪印亮起来）
    n, st = MID_V[72][k % 3] + 12 * (1 + k // 3), T(75.3) + k * .045
    harp(n, st, T(76) - st + .6, .2 + .012 * k, pan=-.3 + .06 * k, release=.4)

# ------------------------------------------------------------------ strings underneath, never silent (almost nothing while the door is shut)
STR_ENV = [(0, .2), (16, .24), (24, .3), (28, .3), (35, .34), (36, .12), (39, .16), (40, .36), (44, .44), (48, .3), (60, .36), (64, .4),
           (68, .36), (76, .5), (84, .52), (88, .4)]
LO, MID, HI = [], [], []
for s, l, c, b in PROG:
    v, e = env(s, STR_ENV), s + l
    LO.append((s, e, [b], dict(vel=v, attack=.3)))
    MID.append((s, e, MID_V[s], dict(vel=v * .85, attack=.5)))
    if s >= 72 or 40 <= s < 48: HI.append((s, e, [n + 12 for n in MID_V[s]][1:], dict(vel=v * .7, attack=.6)))
bowed(STRINGS_LO, LO, 'str_lo')
bowed(STRINGS_MID, MID, 'str_mid')
bowed(STRINGS_HI, HI, 'str_hi')
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    st = T(s) - .15 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .15 - st, gain=.10 if not (36 <= s < 40) else .05, attack=.3 if s else .05,
                              release=.3 if s < 84 else 3.0, bright=.12 if s < 68 else .2), st)


# ------------------------------------------------------------------ a nervous heartbeat when he comes to the door; a pull under "身体却在往后退"
def kick(beat, g):
    y = sub_pulse(.7, freq=44.0 * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))
    song.add_synth('pulse', y, T(beat))


for bt in range(29, 36): kick(bt, .1 + .012 * (bt - 29))
for bt in range(62, 68, 2): kick(bt, .12)

if __name__ == '__main__':
    out = os.path.join(HERE, 'bgm.wav')
    song.render(out, fade_out=3.0)
    print('wrote', out, f'({T(TOTAL_BEATS):.2f} s)')
