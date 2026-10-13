"""A small offline sampler for composing the channel's own background music.

    from sampler import Song, PIANO, CELLO, ...
    song = Song(seconds=60)
    song.add(PIANO, 'A3', start=0.0, dur=1.5, vel=.6)
    song.add(STRINGS, 'A2', start=0.0, dur=8, vel=.5, attack=1.2)
    song.render('demo.wav')            # reverb, gentle limiting, -14 LUFS

Instruments are real recordings from npm packages (see ASSETS below):
  - Salamander Grand Piano V3 (Alexander Holm, CC BY 3.0) via @audio-samples/piano-mp3-velocity{4,8,12,16} and -release
  - tonejs-instruments (Nicholaus Brosowsky, CC BY 3.0) cello, violin, contrabass, harp, french horn, flute
Each note uses the nearest recorded pitch, resampled to the target pitch; sustained instruments loop a
cross-faded middle section when a note outlasts its recording. "STRINGS" layers detuned cello/violin/bass copies
into a small section. Everything is mixed at 48 kHz stereo.
"""
import os, re, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
ASSETS = os.environ.get('MUSIC_ASSETS', '/tmp/claude-0/-home-user-1111/c3bad8af-dec0-566b-8616-30322588827e/scratchpad/music_assets')
_rng = np.random.default_rng(11)
NOTE_IDX = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def midi(n):
    """'C4' / 'D#4' / 'Eb4' / 'As2' / 60 -> MIDI number (C4 = 60)."""
    if isinstance(n, (int, np.integer)): return int(n)
    if isinstance(n, (float, np.floating)): return float(n)                  # 允许微分音（合奏的轻微失谐）
    m = re.match(r'^([A-Ga-g])(#|s|b)?(-?\d)', n.strip())
    if not m: raise ValueError(n)
    v = NOTE_IDX[m.group(1).upper()] + {'#': 1, 's': 1, 'b': -1, None: 0}[m.group(2)]
    return v + 12 * (int(m.group(3)) + 1)


def hz(n): return 440.0 * 2 ** ((midi(n) - 69) / 12)


_cache = {}
def _decode(path):
    if path in _cache: return _cache[path]
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
    i = np.argmax(np.abs(x).max(1) > 1e-3)                                     # trim leading silence
    x = x[max(0, i - int(.002 * SR)):]
    _cache[path] = x
    return x


class Instrument:
    """Sampled instrument. layers: list of (velocity 0..1, {midi: path}). sustain=True loops long notes."""

    def __init__(self, name, layers, sustain, attack=.005, release=.35, gain=1.0, loop=(.35, .85), release_samples=None):
        self.name, self.layers, self.sustain = name, layers, sustain
        self.attack, self.release, self.gain, self.loop = attack, release, gain, loop
        self.release_samples = release_samples or {}

    def _sample(self, layer, m):
        notes = sorted(layer)
        near = min(notes, key=lambda k: (abs(k - m), k < m))
        return _decode(layer[near]), m - near

    def voice(self, note, dur, vel=.7, attack=None, release=None):
        """Return a stereo array for one note held for `dur` seconds (plus release tail)."""
        m = midi(note)
        vel = float(np.clip(vel, 0, 1))
        atk = self.attack if attack is None else attack
        rel = self.release if release is None else release
        # pick the two layers around the velocity and blend
        vs = [v for v, _ in self.layers]
        j = int(np.searchsorted(vs, vel))
        pair = [(self.layers[min(j, len(vs) - 1)], 1.0)] if j in (0, len(vs)) else \
            [(self.layers[j - 1], (vs[j] - vel) / (vs[j] - vs[j - 1])), (self.layers[j], (vel - vs[j - 1]) / (vs[j] - vs[j - 1]))]
        n_hold, n_rel = int(dur * SR), int(rel * SR)
        out = np.zeros((n_hold + n_rel, 2))
        for (lv, layer), w in pair:
            if w <= 1e-3: continue
            x, semis = self._sample(layer, m)
            ratio = 2 ** (semis / 12)
            need = n_hold + n_rel
            if self.sustain:
                L = len(x) / ratio
                if need > L * self.loop[1]:                                      # loop the steady middle, cross-faded
                    a, b = int(len(x) * self.loop[0]), int(len(x) * self.loop[1]); xf = int(min(.25 * SR, (b - a) / 3))
                    fo, fi = np.linspace(1, 0, xf)[:, None], np.linspace(0, 1, xf)[:, None]
                    block = np.concatenate([x[b - xf:b] * fo + x[a:a + xf] * fi, x[a + xf:b - xf]])   # 尾巴淡出、开头淡入，接缝连续
                    reps = int(np.ceil((need * ratio) / len(block))) + 1
                    x = np.concatenate([x[:b - xf]] + [block] * reps)
            pos = np.arange(need) * ratio
            pos = pos[pos < len(x) - 1]
            i0 = pos.astype(int); fr = (pos - i0)[:, None]
            y = x[i0] * (1 - fr) + x[i0 + 1] * fr
            out[:len(y)] += y * w
        env = np.ones(len(out))
        na = max(1, int(atk * SR)); env[:na] = np.linspace(0, 1, na) ** (1.5 if atk > .05 else 1)
        if n_rel > 0: env[n_hold:] = np.linspace(1, 0, len(env) - n_hold) ** 2
        vel_gain = (.25 + .75 * vel) if self.sustain else 1.0                   # piano dynamics come from the layers
        return out * env[:, None] * self.gain * vel_gain


def _layer(folder, pattern):
    d = {}
    for f in os.listdir(folder):
        mm = re.match(pattern, f)
        if mm: d[midi(mm.group(1))] = os.path.join(folder, f)
    return d


def _tonejs(name, ext):
    folder = os.path.join(ASSETS, f'tonejs-instrument-{name}-{ext}', 'package')
    return _layer(folder, r'^([A-G]s?\d)\.' + ext + '$')


def _piano():
    layers = []
    for v in (4, 8, 12, 16):
        folder = os.path.join(ASSETS, f'_audio-samples_piano-mp3-velocity{v}', 'package', 'audio')
        layers.append((v / 16, _layer(folder, r'^([A-G]#?\d)v\d+\.mp3$')))
    return Instrument('piano', layers, sustain=False, attack=.002, release=.45, gain=.9)


PIANO = _piano()
CELLO = Instrument('cello', [(1.0, _tonejs('cello', 'wav'))], sustain=True, attack=.35, release=.9, gain=.55, loop=(.3, .9))
VIOLIN = Instrument('violin', [(1.0, _tonejs('violin', 'mp3'))], sustain=True, attack=.45, release=1.0, gain=.38, loop=(.25, .8))
BASS = Instrument('contrabass', [(1.0, _tonejs('contrabass', 'mp3'))], sustain=True, attack=.3, release=1.0, gain=.6, loop=(.25, .8))
HARP = Instrument('harp', [(1.0, _tonejs('harp', 'mp3'))], sustain=False, attack=.002, release=1.2, gain=.55)
HORN = Instrument('french horn', [(1.0, _tonejs('french-horn', 'mp3'))], sustain=True, attack=.4, release=1.0, gain=.4, loop=(.25, .8))
FLUTE = Instrument('flute', [(1.0, _tonejs('flute', 'mp3'))], sustain=True, attack=.25, release=.8, gain=.35, loop=(.25, .8))


class Section:
    """A small string section: several detuned, slightly delayed, panned copies of one sustained instrument."""

    def __init__(self, inst, players=3, cents=7, spread=.6, name=None):
        self.inst, self.players, self.cents, self.spread = inst, players, cents, spread
        self.name = name or inst.name + ' section'


STRINGS_LO, STRINGS_MID, STRINGS_HI = Section(BASS, 3, 6, .5), Section(CELLO, 3, 7, .6), Section(VIOLIN, 4, 8, .8)


def pan(x, p):
    p = np.clip(p, -1, 1); return np.stack([x[:, 0] * np.cos((p + 1) * np.pi / 4) * 1.414, x[:, 1] * np.sin((p + 1) * np.pi / 4) * 1.414], 1)


class Song:
    def __init__(self, seconds, tail=6.0):
        self.N = int((seconds + tail) * SR); self.seconds = seconds
        self.buses = {}                                                         # name -> stereo buffer
        self.bus_conf = {}

    def bus(self, name, gain=1.0, reverb=.3, pan=0.0, lowpass=None, highpass=None):
        self.bus_conf[name] = dict(gain=gain, reverb=reverb, pan=pan, lowpass=lowpass, highpass=highpass)
        self.buses.setdefault(name, np.zeros((self.N, 2)))

    def _mix_in(self, bus, y, start, p=0.0):
        if bus not in self.buses: self.bus(bus)
        s = int(start * SR)
        if s >= self.N: return
        y = pan(y, p) if p else y
        n = min(len(y), self.N - s)
        self.buses[bus][s:s + n] += y[:n]

    def add(self, inst, note, start, dur, vel=.7, bus=None, pan=0.0, attack=None, release=None, humanize=True):
        """Place one note. `inst` is an Instrument or a Section."""
        if humanize:
            start = max(0.0, start + _rng.normal(0, .006)); vel = float(np.clip(vel + _rng.normal(0, .03), .05, 1))
        if isinstance(inst, Section):
            for k in range(inst.players):
                det = (k - (inst.players - 1) / 2) * inst.cents / max(1, inst.players - 1) * 2
                y = inst.inst.voice(midi(note) + det / 100, dur, vel, attack, release) / np.sqrt(inst.players)
                p = pan + (k - (inst.players - 1) / 2) / max(1, inst.players - 1) * inst.spread * 2 * .5
                self._mix_in(bus or inst.name, y, start + k * .013, p)
        else:
            self._mix_in(bus or inst.name, inst.voice(note, dur, vel, attack, release), start, pan)

    def add_synth(self, bus, y, start, p=0.0):
        """Mix any synthesized stereo (or mono) array into a bus."""
        if y.ndim == 1: y = np.stack([y, y], 1)
        self._mix_in(bus, y, start, p)

    def render(self, path, lufs=-14.0, fade_out=3.0):
        ir = _hall_ir()
        master = np.zeros((self.N, 2)); wet = np.zeros((self.N, 2))
        for name, x in self.buses.items():
            c = self.bus_conf.get(name, dict(gain=1.0, reverb=.3, pan=0.0, lowpass=None, highpass=None))
            y = x * c['gain']
            if c['lowpass']: y = sosfilt(butter(2, c['lowpass'], 'lowpass', fs=SR, output='sos'), y, axis=0)
            if c['highpass']: y = sosfilt(butter(2, c['highpass'], 'highpass', fs=SR, output='sos'), y, axis=0)
            if c['pan']: y = pan(y, c['pan'])
            master += y; wet += y * c['reverb']
        wet = np.stack([fftconvolve(wet[:, k], ir[:, k])[:self.N] for k in range(2)], 1)
        mix = master + wet
        end = int(self.seconds * SR); f = int(fade_out * SR)
        mix[end - f:end] *= (np.linspace(1, 0, f) ** 1.5)[:, None]; mix[end:] = 0
        mix = mix[:end]
        mix = _soft_limit(mix)
        tmp = path + '.raw.wav'
        _write(tmp, mix)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', f'loudnorm=I={lufs}:TP=-1.5:LRA=11', '-ar', str(SR), path], check=True)
        os.remove(tmp)
        return path


def _hall_ir(seconds=3.2, predelay=.025):
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = np.zeros((n + int(predelay * SR), 2))
    for k in range(2):
        noise = _rng.standard_normal(n) * np.exp(-t / .75)
        noise = sosfilt(butter(1, 5200, 'lowpass', fs=SR, output='sos'), noise)
        late = sosfilt(butter(1, 1800, 'lowpass', fs=SR, output='sos'), noise) * np.clip((t - .4) / 1.2, 0, 1)
        y = noise * (1 - np.clip((t - .4) / 1.2, 0, 1)) + late
        for d, g in [(.011, .5), (.019, .38), (.027, .3), (.041, .22)]:                # a few early reflections
            j = int((d + k * .003) * SR); y[j] += g
        ir[int(predelay * SR):, k] = y
    return ir / np.sqrt((ir ** 2).sum(0))


def _soft_limit(x, ceiling=.92):
    peak = np.abs(x).max()
    if peak <= 0: return x
    x = x / peak * 1.3
    return np.tanh(x) / np.tanh(1.3) * ceiling


def _write(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


# ---------------------------------------------------------------- music helpers
def chord(root, quality='m', octave=None):
    """'A3', 'm' -> MIDI numbers. qualities: '', 'm', '7', 'm7', 'maj7', 'sus2', 'sus4', 'add9', 'madd9'."""
    r = midi(root)
    iv = {'': [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11],
          'sus2': [0, 2, 7], 'sus4': [0, 5, 7], 'add9': [0, 4, 7, 14], 'madd9': [0, 3, 7, 14], 'm9': [0, 3, 7, 10, 14]}[quality]
    return [r + i for i in iv]


def sub_pulse(seconds, freq=43.65, gain=.25):
    """A soft low sine pulse (heartbeat-like kick) of `seconds` length — for the cinematic build."""
    n = int(seconds * SR); t = np.arange(n) / SR
    f = freq * (1 + 1.5 * np.exp(-t / .03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .18) * gain


def pad(freqs, seconds, gain=.12, attack=1.5, release=2.0, bright=.25):
    """A warm synth pad: detuned saw-ish partials, low-passed, slow attack/release."""
    n = int(seconds * SR); t = np.arange(n) / SR; y = np.zeros((n, 2))
    for f in freqs:
        for k, det in enumerate((-.006, 0, .006)):
            ph = _rng.random() * 2 * np.pi
            s = sum(np.sin(2 * np.pi * f * (1 + det) * h * t + ph * h) / h ** (1.6 - bright) for h in range(1, 7))
            y[:, k % 2] += s
    y = sosfilt(butter(2, 1400, 'lowpass', fs=SR, output='sos'), y, axis=0)
    env = np.minimum(1, t / attack) * np.minimum(1, np.maximum(0, (seconds - t)) / release)
    return y * env[:, None] * gain / max(1, len(freqs))
