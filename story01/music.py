"""第 1 集的配乐和环境声，全部用 numpy 合成（原创，不用别人的音乐）。

    python3 music.py      -> bgm.wav（48 kHz 立体声，跟成片一样长）

- 配乐：拨弦吉他（Karplus-Strong）弹一段慢的小调分解和弦，底下垫一层低音铺底；紧张的段落换成低沉的铺底加心跳。
- 环境声：荒原的风、篝火、河水、暴雨和雷、雪夜的风；熊扑上来那一下是一声闷响。
- 音量都压得很低，混音时还会在旁白说话的地方再压低（见 mix.py）。
"""
import numpy as np
import scipy.signal as ss
import scipy.io.wavfile as wf
from shots import END

SR = 48000
N = int(END * SR)
rng = np.random.default_rng(7)
out = np.zeros((N, 2))


def at(t): return int(t * SR)


def add(sig, t0, gain=1.0, pan=0.0):
    """把一段（单声道或立体声）加到 t0 秒；pan -1 左 … 1 右。"""
    a = at(t0)
    if a >= N: return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l, sig * r], 1) * np.sqrt(2)
    n = min(len(sig), N - a)
    out[a:a + n] += sig[:n] * gain


def env(n, att, rel):
    e = np.ones(n)
    a, r = min(n, int(att * SR)), min(n, int(rel * SR))
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[n - r:] *= np.linspace(1, 0, r)
    return e


def bandnoise(sec, lo, hi, order=2):
    x = rng.standard_normal(int(sec * SR))
    b, a = ss.butter(order, [lo, hi], 'band', fs=SR)
    return ss.lfilter(b, a, x)


def lfo_noise(sec, rate):
    """慢慢起伏的随机包络（0.3～1）。"""
    n = int(sec * SR); k = max(2, int(sec * rate))
    pts = rng.uniform(0.3, 1.0, k + 2)
    return np.interp(np.linspace(0, k, n), np.arange(k + 2), pts)


def norm(x, peak=1.0): return x / (np.abs(x).max() + 1e-9) * peak


# ---------- 乐器 ----------
def pluck(freq, sec=3.5, bright=0.5, decay=0.996):
    """Karplus-Strong 拨弦。"""
    n = int(sec * SR); p = max(2, int(round(SR / freq)))
    exc = np.zeros(n); burst = rng.uniform(-1, 1, p)
    b, a = ss.butter(1, 1500 + 5000 * bright, 'low', fs=SR); burst = ss.lfilter(b, a, burst)
    exc[:p] = burst
    den = np.zeros(p + 2); den[0] = 1; den[p] = -0.5 * decay; den[p + 1] = -0.5 * decay
    y = ss.lfilter([1.0], den, exc)
    y *= env(n, 0.002, 0.4)
    b, a = ss.butter(2, 4500, 'low', fs=SR)
    return norm(ss.lfilter(b, a, y), 0.8)


def pad(freqs, sec, att=2.0, rel=3.0, cutoff=900):
    n = int(sec * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.11):
            ph = rng.uniform(0, 1)
            y += 2 * (((f * (1 + det / 100)) * t + ph) % 1) - 1      # 锯齿波
    b, a = ss.butter(2, cutoff, 'low', fs=SR); y = ss.lfilter(b, a, y)
    y *= env(n, att, rel) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.17 * t))
    return norm(y, 0.6)


def heartbeat(bpm, sec, gain=1.0):
    n = int(sec * SR); y = np.zeros(n); t1 = np.arange(int(0.18 * SR)) / SR
    thump = np.sin(2 * np.pi * 52 * t1) * np.exp(-t1 * 28)
    step = 60 / bpm
    for k in range(int(sec / step)):
        for off, g in ((0, 1.0), (0.28, 0.6)):
            a = int((k * step + off) * SR)
            if a + len(thump) < n: y[a:a + len(thump)] += thump * g
    return y * gain


NOTE = {'A2': 110.0, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.0, 'A3': 220.0, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.0, 'A4': 440.0, 'C5': 523.25, 'E5': 659.25, 'F2': 87.31, 'G2': 98.0}
CHORDS = {'Am': ['A2', 'E3', 'A3', 'C4', 'E4'], 'F': ['F2', 'C3', 'F3', 'A3', 'C4'], 'C': ['C3', 'G3', 'C4', 'E4', 'G4'],
          'G': ['G2', 'D3', 'G3', 'B3', 'D4'], 'Dm': ['D3', 'A3', 'D4', 'F4', 'A4'], 'E': ['E3', 'B3', 'E4', 'G4', 'B3']}


def guitar(t0, t1, prog, bpm=66, gain=0.5, bright=0.45):
    """慢的分解和弦：每小节一个和弦，每拍一个音（低-高-中-高）。"""
    beat = 60 / bpm; t = t0; i = 0
    while t < t1 - 0.5:
        ch = CHORDS[prog[i % len(prog)]]
        for k, idx in enumerate((0, 3, 2, 4)):
            tt = t + k * beat
            if tt >= t1 - 0.3: break
            add(pluck(NOTE[ch[idx]], bright=bright), tt, gain * (1.0 if k == 0 else 0.7), pan=(-0.3 if k % 2 else 0.25))
        t += 4 * beat; i += 1


# ---------- 配乐 ----------
# 开头：低沉铺底 + 心跳
add(pad([55, 82.4, 110], 44.5, att=3, rel=2.5, cutoff=500), 0.0, 0.16)
add(heartbeat(58, 22, 0.45), 20.0, 1.0)
# 一、皮毛猎人：暖一点的吉他
guitar(45.4, 75.0, ['Am', 'F', 'C', 'G'], gain=0.30)
add(pad([110, 164.8, 220], 30, att=4, rel=4, cutoff=700), 45.2, 0.07)
# 二、熊：越来越紧，扑上来以前心跳加快，然后一下闷响、安静
add(pad([55, 58.3, 82.4], 10, att=3, rel=1.0, cutoff=420), 75.9, 0.17)
add(heartbeat(66, 4.0, 0.45), 76.0); add(heartbeat(92, 5.4, 0.55), 80.0)
add(pad([41.2, 55, 61.7], 15, att=1.0, rel=5, cutoff=300), 86.6, 0.18)
# 三、丢下：阴沉，零星的吉他单音
add(pad([73.4, 110, 146.8], 45, att=4, rel=5, cutoff=500), 102.0, 0.12)
for tt, nt in [(104.0, 'A3'), (109.5, 'F3'), (115.0, 'E3'), (121.0, 'D3'), (128.5, 'A3'), (135.0, 'C4'), (141.0, 'B3'), (144.5, 'A2')]:
    add(pluck(NOTE[nt], 5, bright=0.3, decay=0.997), tt, 0.28, pan=0.15)
# 四、爬：低音脉动慢慢往上走
add(pad([55, 82.4], 30, att=4, rel=4, cutoff=400), 147.5, 0.13)
add(heartbeat(50, 26, 0.32), 148.0)
add(pad([65.4, 98, 130.8], 16, att=5, rel=6, cutoff=600), 177.0, 0.12)
guitar(180.0, 193.0, ['Am', 'F'], bpm=60, gain=0.22, bright=0.35)
# 五、找人：雪夜冷，原谅那一下和弦升起来；夏天轻一点；威胁那句又紧起来
add(pad([73.4, 110, 146.8], 16, att=4, rel=4, cutoff=450), 194.0, 0.11)
add(pad([130.8, 196, 261.6, 329.6], 8, att=2.5, rel=4, cutoff=1100), 210.5, 0.12)
guitar(216.8, 236.5, ['C', 'G', 'Am', 'F'], bpm=70, gain=0.24)
add(pad([55, 58.3, 82.4], 9.5, att=1.5, rel=3, cutoff=420), 236.8, 0.15)
# 结尾：一把吉他，最后停在 A 小调上
guitar(246.8, 272.5, ['Am', 'F', 'C', 'E'], bpm=60, gain=0.26, bright=0.4)
add(pad([110, 164.8, 220], 36, att=6, rel=8, cutoff=700), 246.6, 0.08)
for k, nt in enumerate(['A2', 'E3', 'A3', 'C4', 'E4']):
    add(pluck(NOTE[nt], 7, bright=0.35, decay=0.998), 274.0 + k * 0.09, 0.3)

# ---------- 环境声 ----------
def wind(sec, gain): return bandnoise(sec, 180, 1400) * lfo_noise(sec, 0.4) * gain


for t0, t1, g in [(0, 44.5, 0.05), (45.1, 55.8, 0.025), (61, 75.3, 0.025), (75.9, 101.4, 0.03), (102, 123.6, 0.04),
                  (127.4, 146.9, 0.04), (147.5, 174.6, 0.05), (187.6, 199.8, 0.03), (246.5, END, 0.035)]:
    add(norm(wind(t1 - t0, 1.0), 1.0) * env(int((t1 - t0) * SR), 1.5, 1.5), t0, g, pan=0)
# 河水
for t0, t1 in [(55.8, 61.0), (177.0, 187.6)]:
    w = bandnoise(t1 - t0, 300, 2600) * lfo_noise(t1 - t0, 6)
    add(norm(w) * env(len(w), 0.8, 0.8), t0, 0.05)
# 篝火：低沉的底 + 随机的噼啪声
def fire(sec):
    n = int(sec * SR); y = bandnoise(sec, 80, 400) * 0.3
    for _ in range(int(sec * 9)):
        a = rng.integers(0, n - 2000); L = rng.integers(60, 400)
        y[a:a + L] += rng.uniform(-1, 1, L) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(0.3, 1)
    b, a = ss.butter(2, 300, 'high', fs=SR)
    return norm(ss.lfilter(b, a, y)) * env(n, 0.6, 0.8)
add(fire(3.8), 123.6, 0.06)
# 暴雨和雷
r = bandnoise(2.6, 1500, 9000) * env(int(2.6 * SR), 0.3, 0.5); add(norm(r), 174.5, 0.06)
th = bandnoise(3.5, 30, 180) * np.exp(-np.arange(int(3.5 * SR)) / SR * 1.3); add(norm(th), 175.2, 0.16)
# 雪夜的风（高一点、尖一点）
s = bandnoise(16.8, 500, 3500) * lfo_noise(16.8, 0.8); add(norm(s) * env(len(s), 1.5, 1.5), 199.8, 0.035)
# 熊：一声低吼，然后扑上来的闷响
g = bandnoise(2.6, 90, 520) * (1 + 0.7 * np.sin(2 * np.pi * 27 * np.arange(int(2.6 * SR)) / SR)) * env(int(2.6 * SR), 0.5, 1.0)
add(norm(g), 81.0, 0.22)
n = int(1.4 * SR); tt = np.arange(n) / SR
boom = np.sin(2 * np.pi * (75 - 35 * tt) * tt) * np.exp(-tt * 3.0) + bandnoise(1.4, 60, 2500) * np.exp(-tt * 9) * 0.6
add(norm(boom), 85.5, 0.5)

out = np.tanh(out * 1.2) / 1.2                 # 防止破音
wf.write('bgm.wav', SR, (np.clip(out, -1, 1) * 32767).astype(np.int16))
print('bgm.wav', f'{N / SR:.1f}s', f'峰值 {np.abs(out).max():.2f}')
