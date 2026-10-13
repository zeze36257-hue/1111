"""深空氛围 (C_deep_space) - original 60 s ambient cue for 黑猫不说话.

F minor -> A-flat major, 60 BPM (1 beat = 1 s, so every time below is also a beat number), 4/4.
Run:  python3 compose.py   -> demo.wav  (add --stats to print per-bus levels before rendering)

Arc:  0-12 hook | 12 lift | 12-36 development | 36-46 breath | 46-56 climax (Ab major) | 56-60 ending chord.

Review pass (fixes): pad crossfades no longer smear two chords for ~1.8 s; legato lines (piano, cello,
violins, tenor strings, horn, bass) use short releases so suspensions/leading tones do not ring over
their resolutions; violin pedal follows Ab-G-Ab (was Ab over Eb/G against the melody's G5); harp varies
its contour and no longer leaves the leading tone ringing into the lift; loudness is normalised with one
static gain instead of Song.render's single-pass (dynamic, AGC-like) loudnorm, which flattened the arc.
"""
import os, sys, json, subprocess, re
import numpy as np
sys.path.insert(0, '/home/user/1111/tools/cine')
from sampler import *                                              # noqa: F401,F403
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(2026)


class ArcSong(Song):
    """Song.render with ONE static gain to the target loudness.
    sampler.Song.render uses single-pass ffmpeg loudnorm, i.e. dynamic mode, which rides the gain every
    few seconds toward the target: it lifted the hook and pulled down the lift/climax (dev-vs-hook went
    from +2.5 dB to +0.6 dB). Mixing, reverb, fade and soft limiter below are identical to Song.render."""

    def render(self, path, lufs=-14.0, fade_out=3.0, max_tp=-1.2):
        import sampler as S
        ir = S._hall_ir()
        master = np.zeros((self.N, 2)); wet = np.zeros((self.N, 2))
        for name, x in self.buses.items():
            c = self.bus_conf.get(name, dict(gain=1.0, reverb=.3, pan=0.0, lowpass=None, highpass=None))
            y = x * c['gain']
            if c['lowpass']: y = sosfilt(butter(2, c['lowpass'], 'lowpass', fs=SR, output='sos'), y, axis=0)
            if c['highpass']: y = sosfilt(butter(2, c['highpass'], 'highpass', fs=SR, output='sos'), y, axis=0)
            if c['pan']: y = S.pan(y, c['pan'])
            master += y; wet += y * c['reverb']
        wet = np.stack([S.fftconvolve(wet[:, k], ir[:, k])[:self.N] for k in range(2)], 1)
        mix = master + wet
        end = int(self.seconds * SR); f = int(fade_out * SR)
        mix[end - f:end] *= (np.linspace(1, 0, f) ** 1.5)[:, None]
        mix = S._soft_limit(peak_limit(mix[:end]))           # tame the stacked climax downbeats first
        tmp = path + '.raw.wav'; S._write(tmp, mix)
        i_in, tp_in = measure(tmp)
        gain = min(lufs - i_in, max_tp - tp_in)              # static gain; never push true peak above max_tp
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', f'volume={gain:.2f}dB',
                        '-ar', str(SR), '-c:a', 'pcm_s16le', path], check=True)
        os.remove(tmp)
        return path


def peak_limit(x, reduce_db=2.0, look=.004, rel=.15):
    """Gentle look-ahead peak limiter: pulls only the top `reduce_db` of peaks down (4 ms look-ahead,
    150 ms release) so the climax downbeats do not dictate the whole file's level."""
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    a = np.abs(x).max(1); thr = a.max() * 10 ** (-reduce_db / 20)
    g = np.minimum(1.0, thr / np.maximum(a, 1e-9))
    W = int(look * SR); gm = minimum_filter1d(g, 2 * W + 1)
    B = SR // 1000; nb = int(np.ceil(len(g) / B))
    gb = np.pad(gm, (0, nb * B - len(gm)), constant_values=1).reshape(nb, B).min(1)
    c = np.exp(-1 / (rel * 1000)); r = gb.copy()
    for i in range(1, nb): r[i] = min(gb[i], 1 - (1 - r[i - 1]) * c)
    gain = uniform_filter1d(np.minimum(np.repeat(r, B)[:len(g)], gm), W)
    return x * gain[:, None]


def measure(path):
    """(integrated LUFS, true peak dBTP) via ffmpeg ebur128."""
    err = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    summ = err[err.rfind('Summary:'):]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1)), float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))


song = ArcSong(60)

# ------------------------------------------------------------------ mix buses
song.bus('piano',   gain=1.15, reverb=.32)                  # lead (+1.2 dB in review: clearer over the bed)
song.bus('stars',   gain=1.60,  reverb=.70, highpass=300)    # high piano "distant stars"
song.bus('harp',    gain=.42,  reverb=.55, pan=.15)
song.bus('pad',     gain=.42, reverb=.45, lowpass=3200, highpass=100)   # hp 100: leave the lows to bass/sub
song.bus('cello',   gain=.62,  reverb=.38, pan=-.18)        # solo cello countermelody
song.bus('str_lo',  gain=.30,  reverb=.35, lowpass=1500)
song.bus('str_mid', gain=.48,  reverb=.42)
song.bus('str_hi',  gain=.95,  reverb=.50, highpass=180)
song.bus('horn',    gain=.60,  reverb=.50, pan=-.1)
song.bus('sub',     gain=.45, reverb=.0,  lowpass=140)     # 'very soft' pulse (was as loud as the piano lead)
song.bus('air',     gain=1.00, reverb=.6,  highpass=900, lowpass=7000)

# ------------------------------------------------------------------ harmony (explicit)
# (start, dur, name, bass root, pad voicing).  Pad voicings move by common tone / step.
PROG = [
    # intro / hook
    (0,  4, 'Fm(add9)', 'F1',  ['F3', 'Ab3', 'C4']),
    (4,  4, 'Dbmaj7',   'Db2', ['F3', 'Ab3', 'C4']),          # Fm triad over Db = Dbmaj7
    (8,  2, 'Bbm7',     'Bb1', ['F3', 'Ab3', 'Db4']),
    (10, 1, 'Csus4',    'C2',  ['F3', 'G3', 'C4']),
    (11, 1, 'C',        'C2',  ['E3', 'G3', 'C4']),           # dominant -> lift
    # development (lift at 12)
    (12, 4, 'Fm(add9)', 'F1',  ['F3', 'Ab3', 'C4']),
    (16, 4, 'Dbmaj7',   'Db2', ['F3', 'Ab3', 'C4']),
    (20, 4, 'Ab/C',     'C2',  ['Eb3', 'Ab3', 'C4']),
    (24, 4, 'Bbm7',     'Bb1', ['F3', 'Ab3', 'Db4']),
    (28, 4, 'Dbmaj7',   'Db2', ['F3', 'Ab3', 'C4']),
    (32, 2, 'Ebsus4',   'Eb2', ['Eb3', 'Ab3', 'Bb3']),
    (34, 2, 'Eb',       'Eb2', ['Eb3', 'G3', 'Bb3']),
    # breath
    (36, 4, 'Fm(add9)', 'F1',  ['F3', 'Ab3', 'C4']),
    (40, 4, 'Dbmaj7',   'Db2', ['F3', 'Ab3', 'C4']),
    (44, 1, 'Ebsus4',   'Eb2', ['Eb3', 'Ab3', 'Bb3']),
    (45, 1, 'Eb',       'Eb2', ['Eb3', 'G3', 'Bb3']),
    # climax in A-flat major (harmonic rhythm doubles)
    (46, 2, 'Ab',       'Ab1', ['Eb3', 'Ab3', 'C4']),
    (48, 2, 'Eb/G',     'G1',  ['Eb3', 'G3', 'Bb3']),
    (50, 2, 'Fm',       'F1',  ['F3', 'Ab3', 'C4']),
    (52, 2, 'Db',       'Db2', ['F3', 'Ab3', 'Db4']),
    (54, 2, 'Dbm (iv)', 'Db2', ['Fb3', 'Ab3', 'Db4']),        # borrowed minor iv -> plagal close
    (56, 6, 'Ab(add9)', 'Ab1', ['Eb3', 'Ab3', 'C4', 'Bb4']),
]


def section_level(t):
    """Overall dynamic curve (0..1) that shapes every layer: the arc of the piece."""
    pts = [(0, .55), (11.5, .62), (12, .75), (24, .8), (35, .85), (36, .32), (44, .36), (46, .95), (54, 1.0), (56, .75), (60, .5)]
    xs, ys = zip(*pts)
    return float(np.interp(t, xs, ys))


def hvel(base, t, i=0, n=1):
    """Humanised velocity: phrase arch (rise to ~60 % of the phrase, then relax) * section level + jitter."""
    pos = i / max(1, n - 1)
    arch = .88 + .2 * np.sin(np.pi * min(1, pos / .6) * .5) - .12 * max(0, pos - .6)
    return float(np.clip(base * arch * (.6 + .5 * section_level(t)) + rng.normal(0, .025), .08, 1))


# ------------------------------------------------------------------ pads (continuous bed)
def balanced_pad(freqs, secs, **kw):
    # sampler.pad() puts 2 of its 3 detuned copies on the left channel; even the channels out.
    y = pad(freqs, secs, **kw)
    y[:, 1] *= 1.41
    return y


for k, (t0, d, name, root, voic) in enumerate(PROG):
    fade_in = .15 if t0 == 0 else .7                          # first chord speaks at once
    start = t0 if t0 == 0 else t0 - .3                        # crossfade ~t0-.3 .. t0+.6 -> no gap, no smear
    secs = (t0 + d) - start + .6 if k < len(PROG) - 1 else (t0 + d) - start + 1.4
    bright = .2 + .25 * (section_level(t0) - .45)
    g = .18 * (.5 + .6 * section_level(t0))
    freqs = [hz(n) for n in voic] + [hz(midi(root) + 12)]
    song.add_synth('pad', balanced_pad(freqs, secs, gain=g, attack=fade_in, release=.9 if k < len(PROG) - 1 else 1.3, bright=bright), start,
                   p=(-.15 if k % 2 else .15))

# ------------------------------------------------------------------ sub pulse: soft heartbeat on the root
for (t0, d, name, root, voic) in PROG:
    f = hz(root)
    while f > 60: f /= 2
    while f < 36: f *= 2
    for b in [t0]:                                             # one pulse per chord (every 2 s in the climax)
        lvl = section_level(b)
        gain = .22 + .25 * lvl if not (36 <= b < 44) else .14
        song.add_synth('sub', sub_pulse(3.0, freq=f, gain=gain), b)
        if d == 4 and not (36 <= b < 44) and b >= 12:          # second, softer beat on beat 3
            song.add_synth('sub', sub_pulse(2.0, freq=f, gain=gain * .45), b + 2)

# ------------------------------------------------------------------ bass strings (roots, long and legato)
for (t0, d, name, root, voic) in PROG:
    lvl = section_level(t0)
    if t0 < 12:   # intro: solo cello / bass speaks quietly from the first second
        song.add(BASS, midi(root) + 12, t0, d + .3, vel=.42 + .1 * lvl, bus='str_lo', attack=.12 if t0 == 0 else .35, release=.7)
    else:
        song.add(STRINGS_LO, midi(root) + 12, t0, d + .2, vel=.35 + .35 * lvl, bus='str_lo', attack=.5, release=.75)
        if t0 >= 46 or (12 <= t0 < 36):
            song.add(STRINGS_LO, root, t0, d + .2, vel=.3 + .3 * lvl, bus='str_lo', attack=.6, release=.75)

# ------------------------------------------------------------------ piano: hook / lead melody
# (start, dur, note, base velocity).  Strong beats (t % 2 == 0) always land on chord tones.
MELODY = [
    # hook (0-12) - rising Fm arpeggio, falling answer, suspension 4-3 into the lift
    (0, 1, 'Ab4', .50), (1, 1, 'C5', .52), (2, 2, 'F5', .58),
    (4, 1.5, 'F5', .55), (5.5, .5, 'Eb5', .45), (6, 2, 'C5', .50),
    (8, 1, 'Db5', .48), (9, .5, 'C5', .42), (9.5, .5, 'Bb4', .42), (10, 1, 'F4', .45), (11, 1, 'E4', .47),
    # development (12-36)
    (12, 1, 'Ab4', .55), (13, 1, 'C5', .57), (14, 1.5, 'F5', .62), (15.5, .5, 'G5', .52),
    (16, 2, 'Ab5', .66), (18, 1, 'F5', .55), (19, 1, 'Eb5', .5),
    (20, 1.5, 'Eb5', .56), (21.5, .5, 'Db5', .47), (22, 2, 'C5', .52),
    (24, 1, 'Db5', .55), (25, 1, 'F5', .6), (26, 2, 'Ab5', .66),
    (28, 1.5, 'F5', .6), (29.5, .5, 'Eb5', .5), (30, 1, 'C5', .54), (31, 1, 'Db5', .55),
    (32, 1, 'Bb4', .55), (33, 1, 'Ab4', .52), (34, 2, 'G4', .5),
    # climax (46-56) - doubled an octave lower on piano, sung by the violins
    (46, 1.5, 'C6', .74), (47.5, .5, 'Db6', .6), (48, 1, 'Bb5', .7), (49, 1, 'G5', .64),
    (50, 1.5, 'Ab5', .72), (51.5, .5, 'G5', .6), (52, 1, 'F5', .68), (53, 1, 'Ab5', .72),
    (54, 1, 'Db6', .8), (55, 1, 'Fb5', .66), (56, 4, 'Eb5', .6),
]
phr = [(0, 12), (12, 36), (46, 60)]
for (a, b) in phr:
    notes = [m for m in MELODY if a <= m[0] < b]
    for i, (t, d, n, v) in enumerate(notes):
        vel = hvel(v, t, i, len(notes))
        last = t >= 56                                         # only the final Eb5 is left to ring
        song.add(PIANO, n, t, d + (.6 if last else .12), vel=vel, bus='piano', release=1.6 if last else .5)
        if t >= 46:                                            # octave doubling at the climax
            song.add(PIANO, midi(n) - 12, t + .012, d + (.6 if last else .1), vel=vel * .82, bus='piano', release=1.6 if last else .5)

# piano left hand: soft low roots on each chord in hook & development, chords at the climax
for (t0, d, name, root, voic) in PROG:
    if 36 <= t0 < 46 or t0 >= 56: continue
    r = midi(root) + 12 if midi(root) < 36 else midi(root)
    song.add(PIANO, r, t0 + .02, min(d, 4) + .1, vel=hvel(.42, t0), bus='piano', pan=-.2, release=.7)
    if t0 >= 46:
        for j, n in enumerate(voic[:3]):
            song.add(PIANO, n, t0 + .09 + .06 * j, d - .25, vel=hvel(.36, t0, j, 3), bus='piano', pan=-.1, release=.6)

# final piano echo of the hook, now in A-flat major (Ab C Eb), ringing into the fade
for j, (t, n) in enumerate([(57.0, 'Ab5'), (57.5, 'C6'), (58.0, 'Eb6'), (58.5, 'Bb5')]):
    song.add(PIANO, n, t, 2.5, vel=.38 - .04 * j, bus='stars', release=2.0)
song.add(PIANO, 'Ab2', 56.02, 4, vel=.5, bus='piano', release=2)
for j, n in enumerate(['Eb3', 'Ab3', 'C4']):                     # final LH chord, softly rolled
    song.add(PIANO, n, 56.12 + .07 * j, 4, vel=.34 - .02 * j, bus='piano', pan=-.1, release=2)

# ------------------------------------------------------------------ distant stars (breath + sparkles)
STARS = [  # chord tones of the chord sounding at that moment
    (.5, 'C6'), (2.5, 'G5'), (6.5, 'Ab5'), (8.5, 'F5'),
    (36.0, 'C6'), (37.0, 'G5'), (38.0, 'Ab5'), (39.5, 'C6'),
    (40.0, 'Ab5'), (41.0, 'C6'), (42.0, 'F5'), (43.0, 'Db6'),
    (44.0, 'Bb5'), (44.5, 'Eb6'), (45.0, 'G5'), (45.5, 'Bb5'),
]
for i, (t, n) in enumerate(STARS):
    song.add(PIANO, n, t, 1.4, vel=hvel(.36, t, i % 4, 4), bus='stars', release=1.5, pan=float(rng.uniform(-.5, .5)))

# ------------------------------------------------------------------ harp arpeggios (motion from the lift onward)
def harp_arp(t0, d, notes, step, base, release=1.0, flip=False, breathe=False):
    # flip: start from the top of the up-down pattern (down-up contour) so consecutive chords do not
    # repeat the same shape; breathe: leave out the last note before the chord change.
    if flip and len(notes) == 8: notes = notes[4:] + notes[:4]
    k, t = 0, t0
    while t < t0 + d - 1e-6:
        if not (breathe and t > t0 + d - step - 1e-6):
            n = notes[k % len(notes)]
            song.add(HARP, n, t, step * 1.6, vel=hvel(base, t, k % 8, 8), bus='harp', pan=float(.4 * np.sin(k)), release=release)
        k += 1; t += step

HARP_TONES = {  # upward chord-tone patterns per chord
    'Fm(add9)': ['F4', 'C5', 'G5', 'Ab5', 'C6', 'Ab5', 'G5', 'C5'],
    'Dbmaj7':   ['Db4', 'Ab4', 'C5', 'F5', 'Ab5', 'F5', 'C5', 'Ab4'],
    'Ab/C':     ['C4', 'Ab4', 'C5', 'Eb5', 'Ab5', 'Eb5', 'C5', 'Ab4'],
    'Bbm7':     ['Bb3', 'F4', 'Ab4', 'Db5', 'F5', 'Db5', 'Ab4', 'F4'],
    'Ebsus4':   ['Eb4', 'Bb4', 'Ab4', 'Eb5', 'Ab5', 'Bb5'],
    'Eb':       ['Eb4', 'Bb4', 'G5', 'Eb5', 'Bb5', 'G5'],
    'Ab':       ['Ab4', 'Eb5', 'C6', 'Ab5', 'Eb6', 'C6', 'Ab5', 'Eb5'],
    'Eb/G':     ['G4', 'Eb5', 'Bb5', 'G5', 'Eb6', 'Bb5', 'G5', 'Eb5'],
    'Fm':       ['F4', 'C5', 'Ab5', 'F5', 'C6', 'Ab5', 'F5', 'C5'],
    'Db':       ['Db5', 'Ab5', 'F5', 'Db6', 'Ab5', 'F5', 'Db6', 'Ab5'],
    'Dbm (iv)': ['Db5', 'Ab5', 'Fb5', 'Db6', 'Ab5', 'Fb5', 'Db6', 'Ab5'],
    'Ab(add9)': ['Ab4', 'Eb5', 'Bb5', 'C6', 'Eb6', 'Ab6'],
}
for k, (t0, d, name, root, voic) in enumerate(PROG):
    if t0 < 12 or t0 >= 56 or 36 <= t0 < 44: continue
    step = .25 if t0 >= 44 else .5
    harp_arp(t0, d, HARP_TONES[name], step, .32 if t0 < 44 else .4, release=.7 if step < .5 else 1.0,
             flip=bool(k % 2), breathe=(d == 4 and t0 >= 20))
harp_arp(56, 3, HARP_TONES['Ab(add9)'], .5, .3, release=1.6)   # final rolled chord
harp_arp(10, 1.5, ['C5', 'G5', 'C6'], .5, .26)                  # small rising gesture into the lift ...
song.add(HARP, 'E6', 11.5, .3, vel=.3, bus='harp', pan=.3, release=.45)   # ... leading tone stops before Fm

# ------------------------------------------------------------------ solo cello countermelody
CELLO_LINE = [
    (12, 4, 'C4'), (16, 2, 'Db4'), (18, 2, 'C4'), (20, 4, 'C4'), (24, 2, 'Db4'), (26, 2, 'Bb3'),
    (28, 2, 'Ab3'), (30, 2, 'C4'), (32, 4, 'Bb3'),
    (36, 4, 'C4'), (40, 4, 'C4'), (44, 2, 'Bb3'),               # breath: long, quiet held line
]
for i, (t, d, n) in enumerate(CELLO_LINE):
    v = .42 if t >= 36 else .5
    song.add(CELLO, n, t, d + .1, vel=hvel(v, t, i % 6, 6), bus='cello', attack=.4, release=.55)

# ------------------------------------------------------------------ string sections (lift + climax)
for (t0, d, name, root, voic) in PROG:
    if 12 <= t0 < 36:                                           # warm mid strings under development
        for j, n in enumerate(voic[:2]):
            song.add(STRINGS_MID, n, t0, d + .2, vel=hvel(.34, t0) * .9, bus='str_mid', attack=.6, release=.6, pan=-.3 + .6 * j)
    if 44 <= t0 < 46:                                           # swell into the climax
        for n in voic:
            song.add(STRINGS_MID, n, t0, d + .1, vel=.3 + .2 * (t0 - 44), bus='str_mid', attack=.8, release=.5)

CLIMAX_TENOR = [(46, 2, 'Eb4'), (48, 2, 'Bb3'), (50, 2, 'C4'), (52, 2, 'Db4'), (54, 2, 'Db4'), (56, 5, 'C4')]
for i, (t, d, n) in enumerate(CLIMAX_TENOR):
    rel = 1.6 if t >= 56 else .6                                # short releases: C4->Db4->C4 must not rub
    song.add(STRINGS_MID, n, t, d + .1, vel=hvel(.62, t, i, 6), bus='str_mid', attack=.35, release=rel)
    song.add(HORN, midi(n) - 12 if n != 'Eb4' else 'Eb3', t, d + .1, vel=hvel(.4, t, i, 6), bus='horn', attack=.5, release=rel)

# violins sing the climax melody (legato) and add a high shimmer
for i, (t, d, n, v) in enumerate([m for m in MELODY if m[0] >= 46]):
    song.add(STRINGS_HI, n, t, d + .1, vel=hvel(v * .85, t, i, 11), bus='str_hi', attack=.25, release=1.6 if t >= 56 else .45)
# second-violin line: Ab5 - G5 - Ab5 (G5 under Eb/G; a held Ab5 there rubbed against the melody's G5 at 49 s)
for (t, d, n, v) in [(46, 2, 'Ab5', .3), (48, 2, 'G5', .3), (50, 4, 'Ab5', .32), (54, 2, 'Ab5', .34), (56, 5, 'Ab5', .3)]:
    song.add(STRINGS_HI, n, t, d + .1, vel=v, bus='str_hi', attack=.6, release=1.5 if t >= 56 else .5)
# ending: violins hold the Ab chord as it fades
for n in ['C5', 'Eb5']:
    song.add(STRINGS_HI, n, 56, 5, vel=.32, bus='str_hi', attack=.6, release=2)

# ------------------------------------------------------------------ air: filtered noise swell into the lift and the climax
def swell(secs, gain):
    n = int(secs * SR); t = np.arange(n) / SR
    x = rng.standard_normal((n, 2))
    x = sosfilt(butter(2, [1200, 5000], 'bandpass', fs=SR, output='sos'), x, axis=0)
    env = (t / secs) ** 2.2 * np.minimum(1, (secs - t) / .25)
    return x * env[:, None] * gain

song.add_synth('air', swell(2.2, .05), 9.9)
song.add_synth('air', swell(2.3, .06), 43.8)

# ------------------------------------------------------------------ render
if '--stats' in sys.argv:
    for name, x in song.buses.items():
        g = song.bus_conf[name]['gain']; y = x * g
        segs = [(0, 12), (12, 36), (36, 46), (46, 56)]
        r = ['%6.1f' % (20*np.log10(np.sqrt((y[int(a*SR):int(b*SR)]**2).mean())+1e-12)) for a, b in segs]
        print(f'{name:8s} rms by section (0-12/12-36/36-46/46-56): ' + ' '.join(r))
if '--norender' not in sys.argv:
    song.render(os.path.join(HERE, 'demo.wav'), lufs=-14.0)   # static gain -> -14 LUFS, true peak <= -1.2 dBTP
print('rendered', os.path.join(HERE, 'demo.wav'))
