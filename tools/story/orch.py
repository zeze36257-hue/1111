"""用真乐器采样配乐：VSCO 2 Community Edition（Versilian Studios）。

- 许可：可以用于任何用途（包括商用），只要求不要直接卖采样，并请注明出处：
  “Samples: VSCO 2 CE by Versilian Studios”。
- 采样不进仓库。第一次用时这样下载（只取用到的几个乐器，约 560 MB）：
    git clone --depth 1 --filter=blob:none --no-checkout https://github.com/sgossner/VSCO-2-CE $VSCO_DIR
    cd $VSCO_DIR && git sparse-checkout init --no-cone && 把 INST 里的目录写进 .git/info/sparse-checkout && git checkout HEAD
  再把目录写进环境变量 VSCO_DIR（默认是会话临时目录里的 vsco）。

用法：
    o = Orch(秒数)
    o.note('vc', 'A2', t=3.0, dur=10, vel=0.5)          # 大提琴组长音，比采样长就自动接上
    o.chord('vn', ['A4', 'C5', 'E5'], 12, 8, vel=0.3)
    o.arp('harp', ['A2', 'E3', 'A3', 'C4'], 45, 75, step=0.45)
    o.roll(17.5, 3.1); o.hit(20.6, vel=1.0); o.bdrum(85.5)
    st = o.render(reverb=0.3)                             # (N, 2) 立体声
"""
import glob, os, re
import numpy as np
import scipy.signal as ss
import soundfile as sf

SR = 48000
LIB = os.environ.get('VSCO_DIR', '/tmp/claude-0/-home-user-1111/1241d7d4-95e7-5361-a983-3f8317d8eee4/scratchpad/vsco')
INST = {
    'vc': 'Strings/Cello Section/susvib', 'vc_trem': 'Strings/Cello Section/trem', 'vc_spic': 'Strings/Cello Section/spic',
    'vn': 'Strings/Violin Section/susVib', 'vn_trem': 'Strings/Violin Section/Trem', 'vn_pizz': 'Strings/Violin Section/Pizz',
    'va': 'Strings/Viola Section/susvib', 'svn': 'Strings/Solo Violin/Arco Vib', 'cb': 'Strings/Solo Contrabass/SusVib',
    'hn': 'Brass/F Horn/sus', 'harp': 'Strings/Harp',
}
PAN = {'vn': -0.35, 'vn_trem': -0.35, 'vn_pizz': -0.35, 'svn': -0.15, 'va': 0.1, 'vc': 0.3, 'vc_trem': 0.3, 'vc_spic': 0.3,
       'cb': 0.4, 'hn': 0.2, 'harp': -0.2}
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def midi(n):
    m = re.fullmatch(r'([A-G])([#b]?)(-?\d)', n)
    return 12 * (int(m.group(3)) + 1) + NAMES[m.group(1)] + {'#': 1, 'b': -1, '': 0}[m.group(2)]


_cache = {}


def load(path):
    if path not in _cache:
        x, sr = sf.read(path, always_2d=True)
        if x.shape[1] == 1: x = np.repeat(x, 2, 1)
        if sr != SR: x = ss.resample_poly(x, SR, sr, axis=0)
        _cache[path] = x.astype(np.float32)
    return _cache[path]


_index = {}


def samples(inst):
    """(midi, 力度层, 路径) 的列表。"""
    if inst not in _index:
        out = []
        for p in glob.glob(os.path.join(LIB, INST[inst], '*.wav')):
            m = re.search(r'_([A-G][#b]?-?\d)(?:_|\.wav)', os.path.basename(p))
            if not m: continue
            lay = re.search(r'_(v\d|p|f|mf)(?:_|\.wav)', os.path.basename(p))
            lay = {'p': 1, 'mf': 2, 'f': 3}.get(lay.group(1), None) if lay and not lay.group(1).startswith('v') else (int(lay.group(1)[1:]) if lay else 2)
            out.append((midi(m.group(1)), lay, p))
        if not out: raise FileNotFoundError(f'没有 {inst} 的采样：{os.path.join(LIB, INST[inst])}')
        _index[inst] = out
    return _index[inst]


def pick(inst, m, vel):
    ss_ = samples(inst)
    best = min(abs(s[0] - m) for s in ss_)
    cands = [s for s in ss_ if abs(s[0] - m) == best]
    lays = sorted({s[1] for s in cands})
    want = lays[min(len(lays) - 1, int(vel * len(lays)))]
    s = next(s for s in cands if s[1] == want)
    return s[0], s[2]


def shift(x, semis):
    if abs(semis) < 1e-6: return x
    r = 2 ** (semis / 12)
    n = int(len(x) / r); t = np.arange(n) * r
    return np.stack([np.interp(t, np.arange(len(x)), x[:, c]) for c in range(2)], 1).astype(np.float32)


class Orch:
    def __init__(self, sec):
        self.n = int(sec * SR)
        self.buf = np.zeros((self.n, 2), np.float32)

    def _place(self, x, t, gain, pan):
        a = int(t * SR)
        if a >= self.n: return
        l, r = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2), np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        k = min(len(x), self.n - a)
        self.buf[a:a + k, 0] += x[:k, 0] * gain * l
        self.buf[a:a + k, 1] += x[:k, 1] * gain * r

    def note(self, inst, note, t, dur, vel=0.5, att=0.15, rel=1.2, pan=None, gain=1.0):
        m = midi(note) if isinstance(note, str) else note
        sm, path = pick(inst, m, vel)
        x = shift(load(path), m - sm)
        pan = PAN.get(inst, 0) if pan is None else pan
        total = int((dur + rel) * SR)
        if len(x) >= total:
            y = x[:total].copy()
        else:                                   # 采样不够长：去掉开头 0.4 秒的起音，一段段接上，每次交叉淡化 1 秒（等功率）
            y = np.zeros((total, 2), np.float32)
            fade, body = int(1.0 * SR), x[int(0.4 * SR):]
            pos, first = 0, True
            while True:
                src = x if first else body
                L = min(len(src), total - pos)
                w = np.ones(L, np.float32); f = min(fade, L)
                if not first: w[:f] = np.sqrt(np.linspace(0, 1, f))
                more = pos + L < total
                if more: w[-f:] *= np.sqrt(np.linspace(1, 0, f))
                y[pos:pos + L] += src[:L] * w[:, None]
                if not more: break
                pos, first = pos + L - f, False
        e = np.ones(len(y), np.float32)
        a = min(len(y), int(att * SR)); e[:a] = np.linspace(0, 1, a)
        r = min(len(y), int(rel * SR)); e[-r:] *= np.linspace(1, 0, r)
        self._place(y * e[:, None], t, gain * (0.4 + 0.6 * vel), pan)

    def chord(self, inst, notes, t, dur, **kw):
        for k, nt in enumerate(notes): self.note(inst, nt, t + k * 0.015, dur, **kw)

    def arp(self, inst, notes, t0, t1, step=0.5, dur=3.0, vel=0.45, pattern=None, **kw):
        pat = pattern or list(range(len(notes)))
        t, i = t0, 0
        while t < t1:
            self.note(inst, notes[pat[i % len(pat)]], t, dur, vel=vel * (1.0 if i % len(pat) == 0 else 0.8), att=0.005, rel=1.5, **kw)
            t += step; i += 1

    def _perc(self, pattern, t, vel, gain):
        ps = sorted(glob.glob(os.path.join(LIB, pattern)))
        if not ps: return
        p = ps[min(len(ps) - 1, int(vel * len(ps)))]
        self._place(load(p), t, gain, 0.0)

    def hit(self, t, vel=0.8, drum=2, gain=1.0): self._perc(f'Percussion/Timpani/Timpani{drum}_Hit_*.wav', t, vel, gain)
    def bdrum(self, t, vel=0.9, gain=1.0): self._perc('Percussion/BDrumNewhit_*.wav', t, vel, gain)

    def roll(self, t, dur, drum=2, gain=0.8):
        ps = sorted(glob.glob(os.path.join(LIB, f'Percussion/Timpani/Rolls/Timpani{drum}_Roll_*.wav')))
        if not ps: return
        x = load(ps[-1]); n = min(len(x), int(dur * SR)); x = x[:n].copy()
        x *= np.linspace(0.15, 1.0, n)[:, None] ** 1.5                     # 渐强
        x[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))[:, None]
        self._place(x, t, gain, 0.0)

    def render(self, reverb=0.3, rt60=2.4):
        n_ir = int(rt60 * SR); t = np.arange(n_ir) / SR
        rng = np.random.default_rng(5)
        ir = rng.standard_normal((n_ir, 2)) * np.exp(-6.9 * t / rt60)[:, None]
        b, a = ss.butter(1, 5500, 'low', fs=SR); ir = ss.lfilter(b, a, ir, axis=0)
        ir[:int(0.02 * SR)] = 0; ir /= np.sqrt((ir ** 2).sum(0))
        wet = np.stack([ss.fftconvolve(self.buf[:, c], ir[:, c])[:self.n] for c in range(2)], 1)
        return self.buf * (1 - reverb) + wet * reverb * 3.0
