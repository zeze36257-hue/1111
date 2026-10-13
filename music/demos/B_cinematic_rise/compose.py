"""B_cinematic_rise -- original cinematic build in D minor, 90 BPM, 60 s, never silent.

Run:  python3 compose.py      -> demo.wav (Song.render: hall reverb, soft limit; its loudnorm is run two-pass/linear to -14 LUFS, see bottom)

Form (beats @ 90 BPM, 1 beat = 0.667 s; mixed 4/4 + two 2/4 pickup bars so sections land on the video cuts):
  beats  0-16  (0.0-10.7 s)  intro: piano 8th-note ostinato + high piano hook (theme head) over a D pedal, heartbeat
  beats 16-18  (10.7-12 s)   2/4 pickup: Asus4 -> A, string swell
  beats 18-54  (12.0-36 s)   LIFT + development: full strings, cello then violins sing the theme, pulse every beat
  beats 54-66  (36.0-44 s)   breath: solo piano melody, soft cello pad, single heartbeats (thin but continuous)
  beats 66-68  (44.0-45.3 s) 2/4 pickup: swell, accelerating pulse, horn swell
  beats 68-84  (45.3-56 s)   climax: piano 16ths, violins + horns carry the theme, full section
  beats 84-90  (56.0-60 s)   resolution: D minor chord rings into the render fade
"""
import os, sys
import numpy as np

sys.path.insert(0, '/home/user/1111/tools/cine')
from sampler import *  # noqa: F401,F403  (Song, PIANO, HORN, STRINGS_*, sub_pulse, pad, midi, hz, SR)

HERE = os.path.dirname(os.path.abspath(__file__))
BPM = 90.0
B = 60.0 / BPM                       # one beat in seconds
rng = np.random.default_rng(2026)    # my own humanisation (the sampler adds a little more)


def T(beat):                         # beat -> seconds
    return beat * B


# ------------------------------------------------------------------ harmony (explicit chord progression)
PCS = {'Dm': [2, 5, 9], 'Bb': [10, 2, 5], 'Gm': [7, 10, 2], 'F': [5, 9, 0], 'C': [0, 4, 7], 'Eb': [3, 7, 10],
       'A': [9, 1, 4], 'Asus4': [9, 2, 4], 'Bbmaj7': [10, 2, 5, 9]}

# (start_beat, length_beats, chord, bass note)
PROG = [
    # intro: Dm | Bb/D | Gm/D | Dm | (2/4) Asus4 A          -- D pedal underneath
    (0, 4, 'Dm', 'D2'), (4, 4, 'Bb', 'D2'), (8, 4, 'Gm', 'D2'), (12, 4, 'Dm', 'D2'),
    (16, 1, 'Asus4', 'A1'), (17, 1, 'A', 'A1'),
    # development: Dm | Bb | F/A | C | Gm | Eb (Neapolitan) | Asus4 A | Dm | Bb
    (18, 4, 'Dm', 'D2'), (22, 4, 'Bb', 'Bb1'), (26, 4, 'F', 'A1'), (30, 4, 'C', 'C2'),
    (34, 4, 'Gm', 'G1'), (38, 4, 'Eb', 'Eb2'), (42, 2, 'Asus4', 'A1'), (44, 2, 'A', 'A1'),
    (46, 4, 'Dm', 'D2'), (50, 4, 'Bb', 'Bb1'),
    # breath: Gm | Dm/F | Bbmaj7 | (2/4) Asus4 A
    (54, 4, 'Gm', 'G1'), (58, 4, 'Dm', 'F2'), (62, 4, 'Bbmaj7', 'Bb1'), (66, 1, 'Asus4', 'A1'), (67, 1, 'A', 'A1'),
    # climax: Dm | Bb | Gm Eb | Asus4 A || Dm
    (68, 4, 'Dm', 'D2'), (72, 4, 'Bb', 'Bb1'), (76, 2, 'Gm', 'G1'), (78, 2, 'Eb', 'Eb2'),
    (80, 2, 'Asus4', 'A1'), (82, 2, 'A', 'A1'),
    (84, 6, 'Dm', 'D2'),
]


def chord_at(beat):
    for s, l, c, b in PROG:
        if s <= beat + 1e-6 < s + l: return s, l, c, b
    return PROG[-1]


def voicing(pcs, prev, lo, hi):
    """Close-position triad (3 notes) with lowest note in [lo, hi], voice-led from `prev`."""
    pcs = pcs[:3]
    best, score = None, 1e9
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


# precompute voice-led voicings for piano (around D4) and cello pad (octave 3)
PIANO_V, MID_V = {}, {}
pv = mv = None
for s, l, c, b in PROG:
    pv = voicing(PCS[c], pv, midi('C4'), midi('G4')); PIANO_V[s] = pv
    mv = voicing(PCS[c], mv, midi('C3'), midi('G3')); MID_V[s] = mv


def chord_end(beat):
    s, l, c, b = chord_at(beat)
    return s + l


def env(beat, pts):
    """Piecewise-linear phrase envelope: pts = [(beat, value), ...]."""
    xs, ys = zip(*pts)
    return float(np.interp(beat, xs, ys))


song = Song(60)
# ------------------------------------------------------------------ buses (mix)
song.bus('piano', gain=1.00, reverb=.24)
song.bus('piano_hi', gain=1.45, reverb=.38)                 # intro hook, high register (review: was buried ~6 dB under the ostinato)
song.bus('piano_soft', gain=.85, reverb=.34)                # breath: piano layers can't go below v4, so a quieter bus
song.bus('lead', gain=1.45, reverb=.32)                     # cello theme (review: +1.7 dB, sat under the piano)
song.bus('lead_vln', gain=2.80, reverb=.34)                 # violin theme (violin samples are quieter; review: +1.7 dB)
song.bus('str_hi', gain=.42, reverb=.40, highpass=180)
song.bus('str_mid', gain=.62, reverb=.34, highpass=70)
song.bus('str_lo', gain=.80, reverb=.22, lowpass=2500)
song.bus('horn', gain=1.15, reverb=.40)
song.bus('pulse', gain=.62, reverb=.04, lowpass=900)      # review: sub kick set the limiter's peaks and ate headroom
song.bus('pad', gain=.55, reverb=.30, lowpass=2200)

# ------------------------------------------------------------------ piano ostinato
PAT = [0, 1, 2, 1, 3, 1, 2, 1]                             # indices into voicing (3 = lowest note +12)
PAT_B = [0, 1, 2, 3, 1, 2, 3, 2]                           # dev part 2 (beats 34-54): rising variant, more forward motion
ACC8 = [1.0, .80, .90, .80, .95, .80, .90, .84]            # metric accents for 8ths
# phrase envelope for the ostinato (velocity)
PIANO_ENV = [(0, .50), (12, .55), (16, .58), (18, .54), (30, .61), (34, .64), (46, .69), (50, .60), (54, .52),
             (68, .66), (80, .80), (84, .78)]


def ost_note(e8, beat, step_beats, vel_scale=1.0, accents=ACC8):
    s, l, c, b = chord_at(beat)
    v = PIANO_V[s]; v4 = v + [v[0] + 12]
    n = v4[(PAT_B if 34 <= beat < 54 else PAT)[e8 % 8]]
    base = env(beat, PIANO_ENV)
    bar_arch = 1 + .05 * np.sin(np.pi * ((beat % 4) / 4))    # tiny swell inside each bar
    vel = base * accents[e8 % 8] * bar_arch * vel_scale * (1 + rng.normal(0, .035))
    dur = min(step_beats * 1.7, chord_end(beat) - beat + .05) * B          # no smear into the next chord
    song.add(PIANO, n, T(beat), dur, float(np.clip(vel, .2, .95)), bus='piano', pan=-.12)


# intro + development: 8th notes, beats 0..54
for e in range(0, 54 * 2):
    ost_note(e, e / 2, .5)
# breath: thin quarter-note broken chords in a low-mid register (soft bus)
for q in range(54, 66):
    s, l, c, b = chord_at(q)
    v = [n - 12 for n in PIANO_V[s]]
    n = [v[0], v[2], v[1], v[2]][q % 4]
    song.add(PIANO, n, T(q), min(1.6, chord_end(q) - q + .05) * B, .34 + .05 * (q % 4 == 0) + rng.normal(0, .02), bus='piano_soft', pan=-.1)
# breath pickup: rising 8ths into the climax
for k, e in enumerate(range(66 * 2, 68 * 2)):
    ost_note(e, e / 2, .5, vel_scale=.80 + .07 * k)
# climax: 16th notes
ACC16 = [1.0, .78, .86, .80, .94, .78, .88, .82]
for e in range(68 * 4, 84 * 4):
    beat = e / 4
    ost_note(e, beat, .25, vel_scale=.88, accents=ACC16)

# left hand: low octaves (start of piece, lift, development, climax)
for s, l, c, b in PROG:
    bm = midi(b)
    if s < 16:          # intro: soft low octave each bar on beat 1
        song.add(PIANO, bm, T(s), 3.5 * B, .42 + .03 * (s / 4), bus='piano')
        song.add(PIANO, bm + 12, T(s), 3.5 * B, .38 + .03 * (s / 4), bus='piano')
    elif 18 <= s < 54 or 68 <= s < 84:
        big = s >= 68
        for off in range(0, int(l), 2):
            v = (.58 if off == 0 else .48) + (.12 if big else 0) + rng.normal(0, .02)
            song.add(PIANO, bm + 12, T(s + off), 1.8 * B, v, bus='piano')
            if off == 0: song.add(PIANO, bm, T(s), 1.8 * B, v - .04, bus='piano')
song.add(PIANO, 'D1', T(18), 3.5, .70, bus='piano')        # the lift "boom" at 12.0 s

# ------------------------------------------------------------------ hook motif (theme head) high on piano, intro
HOOK = [  # (beat, note, beats, vel)   strong beats: chord tones
    (0, 'D6', 1.5, .52), (1.5, 'C6', .5, .40), (2, 'A5', 2, .46),           # over Dm
    (8, 'Bb5', 1.5, .54), (9.5, 'A5', .5, .42), (10, 'G5', 2, .48),         # over Gm/D
    (12, 'D6', 1.5, .56), (13.5, 'C6', .5, .44), (14, 'A5', 1.5, .50), (15.5, 'E5', .5, .40),  # Dm -> pickup
]
for bt, n, d, v in HOOK:
    dur = min(d * B + .4, (chord_end(bt) - bt) * B + .05)
    song.add(PIANO, n, T(bt), dur, v, bus='piano_hi', pan=.18)
    song.add(PIANO, midi(n) - 12, T(bt), dur, v - .12, bus='piano_hi', pan=.18)   # soft octave below

# ------------------------------------------------------------------ the theme (lead)
# development, bars 1-4 sung by a cello section an octave below, bars 5-9 by violins
DEV_MEL = [
    (18, 'D5', 1.5), (19.5, 'C5', .5), (20, 'A4', 2),        # Dm
    (22, 'Bb4', 2), (24, 'D5', 2),                          # Bb
    (26, 'C5', 2), (28, 'A4', 2),                           # F/A
    (30, 'E5', 3), (33, 'D5', 1),                           # C   (D5 passing, weak beat)
    (34, 'D5', 2), (36, 'Bb4', 1.5), (37.5, 'D5', .5),      # Gm  (D5 steps into Eb5)
    (38, 'Eb5', 2), (40, 'Bb4', 2),                         # Eb  (Neapolitan colour)
    (42, 'D5', 2), (44, 'Cs5', 2),                          # Asus4 -> A  (prepared suspension, resolved)
    (46, 'D5', 2), (48, 'A4', 2),                           # Dm
    (50, 'Bb4', 4),                                         # Bb  (fading into the breath)
]
LEAD_ENV = [(18, .62), (26, .70), (30, .76), (34, .70), (38, .78), (42, .82), (46, .74), (50, .52), (54, .40)]
for bt, n, d in DEV_MEL:
    v = env(bt, LEAD_ENV) * (1.0 if bt % 2 == 0 else .88) + rng.normal(0, .02)
    atk = .10 if d < 1 else .28
    if bt < 34:
        song.add(STRINGS_MID, midi(n) - 12, T(bt), d * B + .05, v, bus='lead', pan=-.05, attack=atk, release=.35)
    else:
        song.add(STRINGS_HI, n, T(bt), d * B + .05, v, bus='lead_vln', pan=.05, attack=atk, release=.35 if bt < 50 else .9)

# breath: solo piano melody (thin, intimate)
BREATH_MEL = [
    (54, 'D5', 2, .50), (56, 'Bb4', 2, .44),                # Gm
    (58, 'A4', 2, .46), (60, 'F4', 1, .40), (61, 'G4', 1, .38),   # Dm/F (G passing)
    (62, 'A4', 2, .46), (64, 'D5', 2, .52),                 # Bbmaj7 (A = maj7, in the chord)
    (66, 'D5', 1, .54), (67, 'Cs5', 1, .58),                # Asus4 -> A
]
for bt, n, d, v in BREATH_MEL:
    dur = min(d * B + .3, (chord_end(bt) - bt) * B + .05)
    song.add(PIANO, n, T(bt), dur, v, bus='piano_soft', pan=.1)
    song.add(PIANO, midi(n) + 12, T(bt), dur, v - .14, bus='piano_soft', pan=.1)  # octave shimmer

# climax: violins sing the theme, horns an octave below + a sustained horn harmony
CLX_MEL = [
    (68, 'D5', 1.5), (69.5, 'C5', .5), (70, 'A4', 2),        # Dm
    (72, 'Bb4', 2), (74, 'D5', 1), (75, 'F5', 1),            # Bb
    (76, 'G5', 1.5), (77.5, 'F5', .5), (78, 'Eb5', 2),       # Gm | Eb
    (80, 'D5', 2), (82, 'Cs5', 2),                           # Asus4 -> A
    (84, 'D5', 6),                                           # Dm (final)
]
CLX_ENV = [(68, .80), (76, .92), (80, .95), (84, .82), (90, .7)]
for bt, n, d in CLX_MEL:
    v = env(bt, CLX_ENV) * (1.0 if bt % 2 == 0 else .9) + rng.normal(0, .02)
    atk = .10 if d < 1 else .22
    rel = 1.0 if bt == 84 else .35                           # short tails, except the final note
    song.add(STRINGS_HI, n, T(bt), d * B + .05, v, bus='lead_vln', pan=.05, attack=atk, release=rel)
    song.add(HORN, midi(n) - 12, T(bt), d * B + .05, v * .95, bus='horn', pan=-.2, attack=atk + .05, release=rel)
HORN2 = [(68, 'F3', 4), (72, 'F3', 4), (76, 'G3', 4), (80, 'E3', 4), (84, 'F3', 6)]   # common-tone harmony
for bt, n, d in HORN2:
    song.add(HORN, n, T(bt), d * B + .1, .70 + .1 * (bt == 76), bus='horn', pan=.25, attack=.5, release=1.2 if bt == 84 else .45)
# horn swell into the climax (breath pickup) and into the lift
song.add(HORN, 'D4', T(66), B + .05, .55, bus='horn', attack=.6, release=.2)
song.add(HORN, 'Cs4', T(67), B + .1, .65, bus='horn', attack=.3, release=.6)

# ------------------------------------------------------------------ string pads
STR_ENV = [(0, .30), (12, .40), (16, .55), (18, .57), (34, .60), (46, .65), (50, .48), (54, .18), (66, .36),
           (68, .58), (84, .64), (90, .56)]
for s, l, c, b in PROG:
    v = env(s, STR_ENV)
    dur = l * B + .15
    # contrabass: the bass line (in the intro one long D pedal, written once)
    if s == 0:
        song.add(STRINGS_LO, 'D2', 0.0, 16 * B + .1, .45, bus='str_lo', attack=.08)
    elif s >= 16:
        song.add(STRINGS_LO, b, T(s), dur, v, bus='str_lo', attack=.25, release=1.2 if s == 84 else .5)
        if s >= 68: song.add(STRINGS_MID, midi(b) + 12, T(s), dur, v * .6, bus='str_lo', attack=.25, release=1.2 if s == 84 else .5)  # octave up
    # cello section pad (octave 3): enters softly in intro bar 3, out of the way of the cello theme in dev bars 1-4
    if 8 <= s < 18 or 34 <= s:
        for n in (MID_V[s][::2] if 54 <= s < 66 else MID_V[s]):      # breath: only 2 voices
            song.add(STRINGS_MID, n, T(s), dur, v * (.85 if s < 18 else .9), bus='str_mid', attack=.6 if s < 18 else .35,
                     release=1.2 if s == 84 else .5)
    # violin pad (high, soft) above the cello theme in dev bars 1-4
    if 18 <= s < 34:
        hv = [n + 12 for n in MID_V[s]][1:]                     # two upper chord tones, octave 4/5
        for n in hv:
            song.add(STRINGS_HI, n, T(s), dur, v * .75, bus='str_hi', attack=.5, release=.5)
    if 68 <= s < 84:   # climax: violin harmony pad (two upper chord tones, octave 4) under the theme -> fuller peak
        for n in [n + 12 for n in MID_V[s]][1:]:
            song.add(STRINGS_HI, n, T(s), dur, v * .8, bus='str_hi', attack=.3, release=.5)
    if s == 84:   # final chord, violins high
        for n in ('A5', 'F5'):
            song.add(STRINGS_HI, n, T(s), 6 * B, .55, bus='str_hi', attack=.6, release=1.5)

# swell into the lift (10.7-12 s): violins Asus4 -> A with slow attack (no gap, pure crescendo)
song.add(STRINGS_HI, 'D5', T(16), B + .05, .62, bus='str_hi', attack=.55, release=.2)
song.add(STRINGS_HI, 'Cs5', T(17), B - .05, .70, bus='str_hi', attack=.35, release=.3)
song.add(STRINGS_HI, 'A4', T(16), 2 * B + .1, .60, bus='str_hi', attack=.9, release=.5)
# same swell before the climax
song.add(STRINGS_HI, 'D5', T(66), B + .05, .62, bus='str_hi', attack=.55, release=.2)
song.add(STRINGS_HI, 'Cs5', T(67), B - .05, .72, bus='str_hi', attack=.35, release=.3)
song.add(STRINGS_HI, 'E5', T(66), 2 * B - .05, .62, bus='str_hi', attack=.9, release=.3)

# ------------------------------------------------------------------ warm synth pad underneath (glue, continuity)
for s, l, c, b in PROG:
    freqs = [hz(n) for n in MID_V[s]] + [hz(b) * 2]
    g = .10 * (1.25 if 54 <= s < 68 else 1.0)                # a bit more in the breath, where the texture is thin
    # equal crossfade centred on the bar line (old: the previous chord was still at 90% on the new downbeat)
    st = T(s) - .25 if s else 0.0
    song.add_synth('pad', pad(freqs, T(s) + l * B + .25 - st, gain=g, attack=.5 if s else .05, release=.5, bright=.2), st)

# ------------------------------------------------------------------ heartbeat (sub_pulse on the beat)
KICK_HZ = 48.0


def kick(beat, g):
    y = sub_pulse(.7, freq=KICK_HZ * (1 + rng.normal(0, .01)), gain=g)
    y[-int(.06 * SR):] *= np.linspace(1, 0, int(.06 * SR))     # smooth tail (sub_pulse stops abruptly)
    song.add_synth('pulse', y, T(beat))


for bt in range(0, 16, 2):            kick(bt, .30 + .012 * bt)                  # intro: beats 1 & 3
for bt in (16, 17, 17.5):             kick(bt, .45 + .05 * (bt - 16))           # pickup
for bt in range(18, 50):              kick(bt, (.40 + .008 * (bt - 18)) * (1.0 if bt % 4 == 2 else .82))
for bt in (50, 52):                   kick(bt, .40 if bt == 50 else .32)         # thinning out
for bt in (54, 58, 62):               kick(bt, .24)                              # breath: one soft beat a bar
for k, bt in enumerate(np.arange(64, 68, .5)):  kick(bt, .22 + .045 * k)         # accelerating build
for bt in range(68, 84):              kick(bt, .62 * (1.0 if bt % 4 == 0 else .82))
for bt in (71.5, 75.5, 79.5, 83.5):   kick(bt, .42)                              # "lub-dub" pickups
kick(84, .85)                                                                     # final hit

# ------------------------------------------------------------------ final chord on piano (plain D minor, wide voicing)
for n, v in (('D2', .62), ('D3', .58), ('A3', .52), ('D4', .55), ('F4', .52), ('A4', .5), ('D6', .40)):
    song.add(PIANO, n, T(84), 4.5, v, bus='piano')

# ------------------------------------------------------------------ render with LINEAR loudness normalisation
# Workaround (sampler.py is not modified): Song.render ends with a single-pass ffmpeg loudnorm, which runs in
# dynamic/AGC mode -- it pinned the quiet intro to the target, flattened the arc (lift and climax were only
# ~1-2 LU above the rest) and missed the target (-12.5 LUFS). While Song.render runs, its loudnorm call is turned
# into the standard two-pass form (measure, then linear=true): one constant gain, so the written dynamics survive.
import json, subprocess
_run = subprocess.run


def _two_pass(cmd, *a, **k):
    if isinstance(cmd, list) and '-af' in cmd and str(cmd[cmd.index('-af') + 1]).startswith('loudnorm='):
        i = cmd.index('-af'); filt = cmd[i + 1]; src = cmd[cmd.index('-i') + 1]
        err = _run(['ffmpeg', '-hide_banner', '-nostats', '-i', src, '-af', filt + ':print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True, check=True).stderr
        m = json.loads(err[err.rfind('{'):])
        filt = (filt.replace('LRA=11', 'LRA=20') + f":measured_I={m['input_i']}:measured_TP={m['input_tp']}"
                f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
                ":linear=true:print_format=json")
        cmd = [c for c in cmd[:i + 1] if c not in ('-loglevel', 'error')] + [filt] + cmd[i + 2:]   # keep the JSON report
        r = _run(cmd, capture_output=True, text=True, check=True)
        print('loudnorm:', json.loads(r.stderr[r.stderr.rfind('{'):])['normalization_type'])
        return r
    return _run(cmd, *a, **k)


if __name__ == '__main__':
    out = os.path.join(HERE, 'demo.wav')
    if os.environ.get('BUS_STATS'):
        for k, x in song.buses.items():
            g = song.bus_conf[k]['gain']
            print(f'{k:11s} rms {20*np.log10(np.sqrt((x[:int(60*SR)]**2).mean())*g+1e-12):6.1f} dB')
    subprocess.run = _two_pass
    try:
        song.render(out)
    finally:
        subprocess.run = _run
    print('wrote', out)
