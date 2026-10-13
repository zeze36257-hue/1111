"""暗夜钢琴 (A_night_piano) -- original 60 s piece for "黑猫不说话".

E minor, 3/4, 75 BPM (beat = 0.8 s, bar = 2.4 s, so the 12 s lift lands on bar 5).
Solo piano; a soft string section joins only in the second half and falls away before the final chord.
Run:  python3 compose.py   ->  demo.wav next to this file.

Form (bar numbers are 0-based, times approximate because of small ritardandi):
  bars  0-3   0.0 s  hook: 4-bar motif A, mid register, flowing LH         Em  Cmaj7  G  D/F#
  bar   4     9.6 s  half cadence                                          B7sus4 -> B7
  bars  5-8  12.0 s  LIFT: motif A in dyads, octave bass                   Em  Cmaj7  G  D/F#
  bars  9-14 21.6 s  development: answering phrase climbing to bar 12      Am7 Em/G Cmaj7 D  Am7  B7sus4->B7
  bars 15-18 36.0 s  breath: sparse LH, motif head echoed over Cmaj7,     Cmaj7 G/B Am7 B7sus4->B7
                     cellos then violins enter pp
  bars 19-22 45.6 s  CLIMAX: motif A an octave higher in octaves, fuller  Em  Cmaj7  G  D/F# -> B7
                     LH (octave bass + wide arpeggio), strings support
  bar  23    55.2 s  resolution: one rolled Em piano chord rings into the fade; strings release
"""
import os, re, subprocess, sys
from contextlib import contextmanager
import numpy as np
sys.path.insert(0, '/home/user/1111/tools/cine')
from sampler import *  # noqa: F401,F403  (PIANO, STRINGS_MID, STRINGS_HI, Song, midi ...)

HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(7)

# ------------------------------------------------------------------ tempo map (3/4, 75 BPM, gentle ritardandi)
BEAT, BARS = 0.8, 25
stretch = np.ones(BARS * 3 + 3)
for bar, (a, b) in {4: (1.03, 1.06), 14: (1.05, 1.10), 18: (1.06, 1.12), 22: (1.08, 1.16)}.items():
    stretch[bar * 3 + 1], stretch[bar * 3 + 2] = a, b           # breathe on the last two beats before a new section
edges = np.concatenate([[0], np.cumsum(stretch * BEAT)])


def T(bar, beat=0.0):
    """Seconds at (bar, beat) -- piecewise-linear through the tempo map."""
    x = bar * 3 + beat
    i = int(np.floor(x)); f = x - i
    return edges[i] + f * (edges[i + 1] - edges[i])


# ------------------------------------------------------------------ harmony (explicit), per bar: [(beat, chord name)]
PROG = {
    0: 'Em', 1: 'Cmaj7', 2: 'G', 3: 'D/F#', 4: [(0, 'B7sus4'), (2, 'B7')],
    5: 'Em', 6: 'Cmaj7', 7: 'G', 8: 'D/F#',
    9: 'Am7', 10: 'Em/G', 11: 'Cmaj7', 12: 'D', 13: 'Am7', 14: [(0, 'B7sus4'), (2, 'B7')],
    15: 'Cmaj7', 16: 'G/B', 17: 'Am7', 18: [(0, 'B7sus4'), (2, 'B7')],
    19: 'Em', 20: 'Cmaj7', 21: 'G', 22: [(0, 'D/F#'), (2, 'B7')],
    23: 'Em',
}

# LH voicings (low -> high) used for the flowing eighth-note arpeggio  v0 v1 v2 v3 v2 v1
VOICE = {
    'Em': ['E2', 'B2', 'E3', 'G3'], 'Cmaj7': ['C2', 'G2', 'E3', 'B3'], 'G': ['G2', 'D3', 'G3', 'B3'],
    'D/F#': ['F#2', 'D3', 'A3', 'D4'], 'Am7': ['A2', 'E3', 'G3', 'C4'], 'Em/G': ['G2', 'E3', 'B3', 'E4'],
    'D': ['D2', 'A2', 'D3', 'F#3'],
}
# climax LH: octave bass on beat 1 + five-note arpeggio on the remaining eighths
CLIMAX_LH = {
    'Em': (['E1', 'E2'], ['B2', 'G3', 'B3', 'E4', 'B3']),
    'Cmaj7': (['C1', 'C2'], ['G2', 'E3', 'G3', 'B3', 'G3']),
    'G': (['G1', 'G2'], ['D3', 'B3', 'D4', 'G4', 'D4']),
}

PIANO_RH, PIANO_LH = 'piano_rh', 'piano_lh'
song = Song(seconds=60)
song.bus(PIANO_RH, gain=1.0, reverb=.30)
song.bus(PIANO_LH, gain=.55, reverb=.30, highpass=32)    # LH ~2 dB under the melody (was .60: LH > RH)
song.bus('cellos', gain=.45, reverb=.50, pan=-.15, lowpass=5000)
song.bus('violins', gain=.42, reverb=.55, pan=.15, lowpass=6500, highpass=180)


def jit(sd=.025):
    return float(rng.normal(0, sd))


DAMP = .14   # short release: the note is damped before a semitone neighbour sounds (no E-vs-D# / D-vs-D# smear)


def p(note, bar, beat, beats, vel, bus=PIANO_RH, extra=.06, release=None):
    """Piano note held for `beats` beats (+ small legato overlap)."""
    t0 = T(bar, beat)
    song.add(PIANO, note, t0, T(bar, beat + beats) - t0 + extra, vel, bus=bus, release=release)


# ------------------------------------------------------------------ melody
MOTIF = [  # motif A (beats from phrase start; 3 beats per bar). Strong beats are chord tones; F#/E eighths are passing/neighbour.
    (0, 'B4', 1), (1, 'E5', 1), (2, 'F#5', .5), (2.5, 'G5', 2),      # Em   (G5 anticipates bar 2, common tone)
    (4.5, 'F#5', .5), (5, 'E5', 1),                                  # Cmaj7
    (6, 'D5', 2), (8, 'E5', .5), (8.5, 'D5', .5),                    # G
    (9, 'A4', 3),                                                    # D/F#
]


def up(n, k):  # transpose note by k semitones
    return midi(n) + k


def melody(bar0, notes, base, arc=.16, transpose=0):
    """Place melody notes with a phrase-shaped velocity curve (rise to ~60 % of the phrase, then relax)."""
    total = max(b + d for b, _, d in notes)
    for k, (b, n, d) in enumerate(notes):
        x = b / total
        shape = np.sin(np.pi * min(1, x / .6) * .5) if x < .6 else 1 - (x - .6) * .6
        v = base * (1 - arc + arc * shape)
        if b % 3 == 0: v += .03                        # metric accent
        if d <= .5: v -= .05                          # light passing eighths
        nxt = notes[k + 1][1] if k + 1 < len(notes) else None
        step = nxt is not None and abs(midi(nxt) - midi(n)) == 1     # semitone step -> damp, don't smear
        p(up(n, transpose), bar0, b, d, v + jit(.015), extra=.03 if step else .06, release=DAMP if step else None)


def bcad(bar, base):  # bars 4/14: B7sus4 -> B7 melodic cadence (E is the sus4, resolves to D#)
    melody(bar, [(0, 'F#5', 1), (1, 'E5', 1), (2, 'D#5', 1)], base, arc=.1)


# bars 0-3 : hook, starts at t = 0
melody(0, MOTIF, .50)
# bar 4 : pickup / half cadence into the lift
melody(4, [(0, 'F#4', .5), (.5, 'B4', .5), (1, 'E5', 1), (2, 'D#5', 1)], .46, arc=.2)
# bars 5-8 : LIFT -- motif with a lower chord-tone voice
melody(5, MOTIF[:-1] + [(9, 'A4', 1.5), (10.5, 'D5', .5), (11, 'F#5', .5), (11.5, 'D5', .5)], .60)
for bar, beat, n, d in [(5, 0, 'G4', 1), (5, 1, 'B4', 1.5), (5, 2.5, 'E5', 2), (6, 2, 'C5', 1),
                        (7, 0, 'B4', 2), (8, 0, 'F#4', 1.5)]:
    p(n, bar, beat, d, .40 + jit(.02))
# bars 9-14 : development -- answering phrase built on the motif rhythm, peak on bar 12
melody(9, [(0, 'E5', 1), (1, 'A5', 1), (2, 'B5', .5), (2.5, 'C6', .5),   # Am7
           (3, 'B5', 1.5), (4.5, 'A5', .5), (5, 'G5', 1),                  # Em/G
           (6, 'E5', 2), (8, 'G5', .5), (8.5, 'B5', .5),                   # Cmaj7
           (9, 'A5', 2), (11, 'B5', .5), (11.5, 'A5', .5),                 # D
           (12, 'C6', 1.5), (13.5, 'B5', .5), (14, 'A5', 1)], .66, arc=.22)  # Am7
for bar, beat, n, d in [(9, 0, 'C5', 1), (10, 0, 'G5', 1.5), (11, 0, 'B4', 2), (12, 0, 'F#5', 2), (13, 0, 'E5', 1.5)]:
    p(n, bar, beat, d, .44 + jit(.02))
bcad(14, .56)
p('B4', 14, 0, 2, .40)
# bars 15-18 : breath -- motif head echoed softly over Cmaj7 (B-E-G become maj7-3-5)
melody(15, [(0, 'B4', 1), (1, 'E5', 1), (2, 'F#5', .5), (2.5, 'G5', 2),  # Cmaj7 (G5 tied into G/B)
            (4.5, 'F#5', .5), (5, 'D5', 1),                                # G/B
            (6, 'E5', 2), (8, 'C5', 1),                                    # Am7
            (9, 'E5', 2), (11, 'D#5', 1)], .40, arc=.18)                   # B7sus4 -> B7
p('B4', 18, 0, 3, .30)
# bars 19-22 : CLIMAX -- motif A an octave higher, doubled in octaves, with inner chord tones
melody(19, MOTIF, .80, arc=.14, transpose=12)
melody(19, MOTIF, .62, arc=.14)                     # lower octave doubling
for bar, beat, n, d, v in [(19, 0, 'E5', 1, .55), (19, 1, 'B5', 1, .50), (20, 0, 'C5', 3, .52),
                           (21, 0, 'B4', 2, .55), (22, 0, 'F#5', 3, .55), (22, 0, 'D5', 2, .50), (22, 2, 'D#5', 1, .48)]:
    p(n, bar, beat, d, v + jit(.02), extra=.02 if n == 'D5' else .06, release=DAMP if n == 'D5' else None)
# bar 23 : final chord -- rolled Em, A5 (7th of B7) resolves down to G5 on top.
# (No add9 F#4: under the top G5 it formed a minor 9th that rubbed against the resolution.)
for k, (n, v) in enumerate([('E1', .52), ('E2', .55), ('B2', .48), ('G3', .45), ('B3', .44), ('E4', .42),
                            ('B4', .46), ('G5', .56)]):
    song.add(PIANO, n, T(23) + k * .045, 6.0, v, bus=PIANO_LH if midi(n) < 60 else PIANO_RH)

# ------------------------------------------------------------------ left hand
EIGHTH_SHAPE = [1.0, .80, .90, .78, .88, .76]       # within-bar breathing of the arpeggio


def segments(bar):
    c = PROG[bar]
    return [(0, c)] if isinstance(c, str) else c


def lh_flow(bar, base, octave_bass=False, order=(0, 1, 2, 3, 2, 1)):
    """Flowing eighths v0 v1 v2 v3 v2 v1 (pedal held to the end of each chord segment)."""
    segs = segments(bar)
    if segs[0][1].startswith('B7'):                 # cadence bar: sus4 for beats 1-2, B7 on beat 3 (pedal change)
        pat = [(0, 'B1'), (.5, 'F#2'), (1, 'A2'), (1.5, 'E3'), (2, 'D#3'), (2.5, 'A3')]
        for i, (b, n) in enumerate(pat):
            end = 2 if b < 2 else 3
            p(n, bar, b, end - b, base * EIGHTH_SHAPE[i] + jit(), bus=PIANO_LH, extra=.02 if end == 2 else .12,
              release=DAMP if n == 'E3' else None)
        if octave_bass: p('B0', bar, 0, 3, base * .9, bus=PIANO_LH)
        return
    v = VOICE[segs[0][1]]
    for i, n in enumerate([v[k] for k in order]):
        p(n, bar, i * .5, 3 - i * .5, base * EIGHTH_SHAPE[i] + jit(), bus=PIANO_LH, extra=.12)
    if octave_bass: p(up(v[0], -12), bar, 0, 3, base * .92 + jit(), bus=PIANO_LH, extra=.12)


phrase = lambda i, n: np.sin(np.pi * (i + .5) / n) * .08     # small arch across a 4-bar phrase
for bar in range(0, 5):  lh_flow(bar, .32 + phrase(bar, 5))
for bar in range(5, 9):  lh_flow(bar, .40 + phrase(bar - 5, 4), octave_bass=True)
for bar in range(9, 15): lh_flow(bar, .42 + phrase(bar - 9, 6) * 1.5, octave_bass=bar in (11, 12, 13),
                                 order=(0, 2, 3, 1, 3, 2) if bar % 2 else (0, 1, 2, 3, 2, 1))   # vary the figure

# breath: thin LH -- bass held through the bar, two quiet chord tones on beats 2 and 3
for bar, (bass, a, b) in {15: ('C2', 'E3', 'B3'), 16: ('B1', 'D3', 'G3'), 17: ('A1', 'E3', 'C4')}.items():
    p(bass, bar, 0, 3, .30 + jit(), bus=PIANO_LH, extra=.15)
    p(a, bar, 1, 2, .22 + jit(), bus=PIANO_LH, extra=.15)
    p(b, bar, 2, 1, .21 + jit(), bus=PIANO_LH, extra=.15)
p('B1', 18, 0, 3, .32, bus=PIANO_LH, extra=.15)
p('E3', 18, 1, 1, .23, bus=PIANO_LH, extra=.02, release=DAMP)          # sus4 ...
for n in ('D#3', 'A3'): p(n, 18, 2, 1, .25 + jit(), bus=PIANO_LH, extra=.12)   # ... resolves on beat 3

# climax: octave bass + wide arpeggio
for bar, base in zip((19, 20, 21), (.60, .62, .64)):
    bass, arp = CLIMAX_LH[PROG[bar]]
    for n in bass: p(n, bar, 0, 3, base + jit(), bus=PIANO_LH, extra=.12)
    for i, n in enumerate(arp):
        b = .5 + i * .5
        p(n, bar, b, 3 - b, base * EIGHTH_SHAPE[i + 1] + jit(), bus=PIANO_LH, extra=.12)
# bar 22: D/F# (beats 1-2) then B7 on beat 3, bass F# -> B -> (E on bar 23)
for n in ('F#1', 'F#2'): p(n, 22, 0, 2, .62 + jit(), bus=PIANO_LH, extra=.04, release=.25)
for i, n in enumerate(['D3', 'A3', 'D4']):
    p(n, 22, .5 + i * .5, 2 - (.5 + i * .5), .5 * EIGHTH_SHAPE[i + 1] + jit(), bus=PIANO_LH, extra=.02,
      release=DAMP if n.startswith('D') else None)
for n, v in [('B1', .58), ('B2', .5), ('D#3', .42), ('A3', .40)]: p(n, 22, 2, 1, v + jit(), bus=PIANO_LH, extra=.1)

# ------------------------------------------------------------------ strings (second half only)
def s(sec, bus, note, b0, beat0, b1, beat1, vel, attack=1.0, release=.45):
    t0 = T(b0, beat0)
    song.add(sec, note, t0, T(b1, beat1) - t0, vel, bus=bus, attack=attack, release=release)


# cellos: pp entry in the breath, line C - B - A - B, then counter-line G - E - D - F# under the climax
for b, n, v in [(15, 'C3', .20), (16, 'B2', .24), (17, 'A2', .29), (18, 'B2', .36)]:   # pp: under the piano
    s(STRINGS_MID, 'cellos', n, b, -.15 if b > 15 else 0, b + 1, .1, v, attack=1.6 if b == 15 else .7)
for b, n, v in [(19, 'G3', .55), (20, 'E3', .58), (21, 'D3', .62), (22, 'F#3', .64)]:
    s(STRINGS_MID, 'cellos', n, b, -.1, b + 1, .05, v, attack=.5, release=.3)
s(STRINGS_MID, 'cellos', 'G3', 23, 0, 23, 1, .45, attack=.3, release=2.2)      # resolves with the final chord, then falls away
# violins: E4 enters pp on bar 17 (Am7), holds as the sus4 of bar 18 and resolves to D#4 -> E4
s(STRINGS_HI, 'violins', 'E4', 17, 0, 18, 2.0, .26, attack=2.0, release=.2)
s(STRINGS_HI, 'violins', 'D#4', 18, 1.95, 19, .05, .36, attack=.35, release=.25)
for b, lo, hi, v in [(19, 'E4', 'B4', .48), (20, 'E4', 'B4', .52), (21, 'D4', 'B4', .56)]:
    s(STRINGS_HI, 'violins', lo, b, -.05, b + 1, .1, v, attack=.5)
    s(STRINGS_HI, 'violins', hi, b, -.05, b + 1, .1, v * .9, attack=.6)
s(STRINGS_HI, 'violins', 'A4', 22, -.05, 23, 0, .55, attack=.5, release=.25)   # 7th of B7 ...
s(STRINGS_HI, 'violins', 'D4', 22, -.05, 22, 2.0, .52, attack=.5, release=.2)
s(STRINGS_HI, 'violins', 'D#4', 22, 1.95, 23, .05, .5, attack=.3, release=.25)
for n in ('E4', 'G4', 'B4'): s(STRINGS_HI, 'violins', n, 23, -.05, 23, 1, .38, attack=.3, release=2.2)   # ... A4 -> G4

# ------------------------------------------------------------------ mastering workaround (sampler.py untouched)
# Song.render ends with a SINGLE-PASS ffmpeg loudnorm. In that (dynamic) mode loudnorm rides the gain every few
# seconds: it flattened the arc (raw mix: climax 3 dB above the lift, 6 dB above the breath; after loudnorm only
# 0.5 dB) and landed at -13 LUFS instead of -14. We keep Song.render (mix, reverb, soft limiter) and swap only that
# last ffmpeg call for a static master: one measured gain + a look-ahead peak limiter, iterated to -14 LUFS, <= -1.5 dBTP.
def _ebur(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    out = out[out.rfind('Summary'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', out).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', out).group(1))


@contextmanager
def static_master(target=-14.0, ceiling_db=-2.0):
    real_run = sampler.subprocess.run

    def run(cmd, *a, **k):
        if not any('loudnorm' in str(c) for c in cmd):
            return real_run(cmd, *a, **k)
        src, dst = cmd[cmd.index('-i') + 1], cmd[-1]
        gain = target - _ebur(src)[0]
        for _ in range(4):                             # limiter shaves a little loudness: re-aim until within 0.1 LU
            af = 'volume=%.2fdB,alimiter=limit=%.4f:attack=4:release=60:level=0:latency=1' % (gain, 10 ** (ceiling_db / 20))
            real_run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-af', af, '-ar', str(SR), '-c:a', 'pcm_s16le', dst], check=True)
            lufs, tp = _ebur(dst)
            if abs(lufs - target) < .1: break
            gain += target - lufs
        return subprocess.CompletedProcess(cmd, 0)
    sampler.subprocess.run = run
    try:
        yield
    finally:
        sampler.subprocess.run = real_run


import sampler  # noqa: E402  (same module object the star-import came from)

if __name__ == '__main__':
    print('lift at %.2f s, breath at %.2f s, climax at %.2f s, final chord at %.2f s' % (T(5), T(15), T(19), T(23)))
    with static_master():
        song.render(os.path.join(HERE, 'demo.wav'))
    print('wrote', os.path.join(HERE, 'demo.wav'))
