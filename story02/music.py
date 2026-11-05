"""第 2 集《冰雕连》的配乐和音效。

    python3 music.py      -> bgm.wav（48 kHz 立体声，跟成片一样长）

- 配乐：真乐器采样（VSCO 2 CE，Versilian Studios，可商用，见 tools/story/orch.py）。D 小调，沉重但不吓人：
  开头只有风声、呼吸和远处的炮 → 片名一声定音鼓 → 行军（大提琴跳弓）→ “江南的冬装”竖琴和独奏小提琴（暖一下）
  → 风雪（弦乐颤音）→ 进攻（定音鼓、圆号）→ 埋伏、等待（几乎安静）→ 天亮（转到 F 大调）
  → 打退突围 → 枪声一下子停住，只剩风 → 战友上山，独奏小提琴的主题 → “他们是被冻死的”几乎没有音乐
  → 纸条：主题升起来，到“高傲地耸立在我的阵地上”最高 → 结尾：竖琴、弦乐，最后“致敬”停在 D 大调。
- 时间都是按第一版旁白写的，用 timewarp.W 换到现在的旁白上（第二版旁白语速正常，短了 11 秒）。
- 音效：tools/story/sfx.py 合成的风雪、呼吸、心跳、远处的炮声、照明弹、枪声、发动机、脚步、刨雪、布和纸的窸窣、电影院放映机。
"""
import os, sys
import numpy as np
import scipy.io.wavfile as wf
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'story'))
import sfx
from orch import Orch, SR
from shots import END

from timewarp import W

N = int(END * SR)


class _Orch(Orch):
    """下面的时间都是按第一版旁白写的，放进去的时候换到现在的旁白上（见 timewarp.py）。"""
    def note(self, inst, note, t, dur, **kw):
        t0, t1 = W(t), W(t + dur); super().note(inst, note, t0, max(0.05, t1 - t0), **kw)

    def hit(self, t, **kw): super().hit(W(t), **kw)

    def bdrum(self, t, **kw): super().bdrum(W(t), **kw)

    def roll(self, t, dur, **kw): super().roll(W(t), max(0.2, W(t + dur) - W(t)), **kw)


o = _Orch(END)
fx = np.zeros((N, 2), np.float32)


def put(sig, t0, gain=1.0, pan=0.0):
    a = int(W(t0) * SR)
    if a >= N: return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2), np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        sig = np.stack([sig * l, sig * r], 1)
    k = min(len(sig), N - a)
    fx[a:a + k] += sig[:k] * gain


CH = {'Dm': ['D2', 'A2', 'D3', 'F3', 'A3'], 'Bb': ['Bb1', 'F2', 'Bb2', 'D3', 'F3'], 'F': ['F2', 'C3', 'F3', 'A3', 'C4'],
      'C': ['C3', 'G3', 'C4', 'E4', 'G4'], 'A': ['A2', 'E3', 'A3', 'C#4', 'E4'], 'Gm': ['G2', 'D3', 'G3', 'Bb3', 'D4']}


def harp(t0, t1, prog, bpm=60, vel=0.36, pattern=(0, 2, 1, 3, 2, 4, 3, 2)):
    bar = 4 * 60 / bpm; step = bar / len(pattern); t, i = t0, 0
    while t < t1 - 0.3:
        ch = CH[prog[i % len(prog)]]
        o.arp('harp', ch, t, min(t + bar, t1) - 0.05, step=step, dur=2.5, vel=vel, pattern=list(pattern))
        t += bar; i += 1


def melody(inst, t, notes, vel=0.4):
    for nt, d in notes:
        if nt: o.note(inst, nt, t, d, vel=vel, att=0.25, rel=1.0)
        t += d


def pulse(inst, note, t0, t1, step, vel0, vel1=None, alt=None):
    t, k = t0, 0
    while t < t1:
        v = vel0 + ((vel1 if vel1 is not None else vel0) - vel0) * (t - t0) / max(1e-6, t1 - t0)
        o.note(inst, alt if alt and k % 2 else note, t, step * 0.8, vel=v, att=0.005, rel=0.25)
        t += step; k += 1


THEME_A = [('A4', 1.5), ('D5', 1.0), ('C5', 1.0), ('A4', 2.0), ('G4', 1.0), ('A4', 1.0), ('F4', 1.0), ('E4', 1.0), ('D4', 3.0)]
THEME_B = [('F4', 1.0), ('A4', 1.0), ('D5', 1.5), ('E5', 1.0), ('F5', 2.0), ('E5', 1.0), ('D5', 1.0), ('C5', 1.0), ('A4', 3.0)]

# ================= 配乐 =================
# 开头：几乎只有低音，远处的炮响时定音鼓轻轻跟一下
o.note('cb', 'D1', 1.5, 21.0, vel=0.32, att=4, rel=3)
o.chord('vc_trem', ['D2', 'A2'], 2.0, 8.5, vel=0.18, att=3, rel=1.5)
o.hit(6.6, vel=0.35, drum=1, gain=0.6); o.hit(9.5, vel=0.3, drum=1, gain=0.5)
o.chord('vc', ['D2', 'A2'], 10.0, 12.4, vel=0.28, att=3, rel=2)
o.chord('va', ['F3', 'A3'], 10.6, 11.8, vel=0.2, att=3, rel=2)
o.chord('vn', ['D4', 'F4', 'A4'], 14.3, 8.0, vel=0.16, att=3, rel=2.5)
o.note('svn', 'A5', 22.8, 7.6, vel=0.14, att=3, rel=2.5)                        # 天亮了，没有枪声：一根很细的高音
o.note('cb', 'D1', 30.6, 7.0, vel=0.3, att=2, rel=1.5)
melody('vc', 31.0, [('A3', 1.6), ('D4', 1.4), ('C4', 1.0), ('A3', 2.6)], vel=0.34)  # “不是他们撤了……”
o.chord('vn', ['F4', 'A4'], 34.4, 3.0, vel=0.2, att=2, rel=0.8)
o.roll(35.8, 1.6, drum=1, gain=0.55)
# 片名：一下定音鼓，弦乐和圆号的 D 小调
o.hit(37.4, vel=0.95, drum=1, gain=1.1); o.bdrum(37.4, vel=0.8, gain=0.7)
o.chord('vc', ['D2', 'A2', 'D3'], 37.4, 3.0, vel=0.5, att=0.05, rel=2.5); o.chord('va', ['F3', 'A3'], 37.4, 3.0, vel=0.45, att=0.05, rel=2.5)
o.chord('vn', ['D4', 'F4', 'A4', 'D5'], 37.45, 3.0, vel=0.42, att=0.05, rel=2.5); o.chord('hn', ['D3', 'A3'], 37.4, 3.0, vel=0.45, att=0.1, rel=2.5)
o.note('cb', 'D1', 37.4, 3.2, vel=0.5, att=0.05, rel=2.5)

# 一、南方来的兵：行军的跳弓 → 江南（竖琴、独奏小提琴）→ 大衣不够 → 风雪 → 冻伤
pulse('vc_spic', 'D2', 40.6, 51.2, 0.5, 0.22, 0.32, alt='A1')
o.note('cb', 'D1', 40.4, 11.0, vel=0.28, att=2, rel=1.5)
o.chord('va', ['D3', 'A3'], 41.0, 4.6, vel=0.18, att=2, rel=1.0)
o.note('hn', 'A2', 45.7, 5.5, vel=0.32, att=1.2, rel=1.2); o.chord('vn_trem', ['A4', 'Bb4'], 45.8, 5.4, vel=0.2, att=2.5, rel=0.8)
harp(51.4, 58.0, ['F', 'C', 'F', 'C'], bpm=70, vel=0.32)
o.chord('vn', ['A4', 'C5'], 51.6, 6.2, vel=0.16, att=2.5, rel=1.5)
melody('svn', 52.6, [('C5', 1.4), ('A4', 0.9), ('F5', 1.6), ('E5', 0.9), ('C5', 1.8)], vel=0.3)
o.chord('vc', ['Bb2', 'F3'], 58.2, 3.4, vel=0.28, att=1.5, rel=1.2); o.chord('vc', ['G2', 'D3'], 61.6, 3.4, vel=0.28, att=1.0, rel=1.2)
melody('svn', 58.8, [('D5', 1.6), ('C5', 1.2), ('Bb4', 1.6), ('A4', 2.4)], vel=0.26)
o.chord('vc_trem', ['D2', 'A2'], 65.0, 6.0, vel=0.25, att=1.0, rel=1.0); o.chord('vn_trem', ['D5', 'F5'], 65.4, 5.6, vel=0.2, att=3.5, rel=0.8)
o.roll(69.4, 1.6, drum=2, gain=0.6)
o.note('va', 'A3', 71.0, 8.6, vel=0.16, att=2, rel=1.5); o.note('svn', 'D6', 71.4, 4.4, vel=0.1, att=2, rel=1.5)
melody('vc', 75.6, [('D3', 1.4), ('C3', 1.2), ('Bb2', 1.2), ('A2', 1.6)], vel=0.28)

# 二、死鹰岭：进攻（定音鼓、急促的跳弓、圆号）→ 任务 → 埋伏 → 等 → 天亮（F 大调）
for tt in (80.3, 81.9, 83.5, 85.1): o.hit(tt, vel=0.75, drum=1, gain=0.9)
pulse('vc_spic', 'D2', 80.4, 86.6, 0.25, 0.3, 0.55)
o.chord('hn', ['A2', 'D3'], 80.4, 1.2, vel=0.45, att=0.05, rel=0.6); o.chord('hn', ['Bb2', 'D3'], 83.5, 1.2, vel=0.45, att=0.05, rel=0.6)
o.chord('vn_trem', ['D5', 'Eb5'], 80.5, 6.2, vel=0.25, att=2, rel=0.5)
o.note('cb', 'D1', 80.3, 6.6, vel=0.45, att=0.1, rel=0.8)
pulse('vc_spic', 'D2', 87.0, 92.4, 0.6, 0.18)
o.note('harp', 'D2', 87.0, 3, vel=0.3, att=0.005, rel=2); o.note('harp', 'A2', 89.8, 3, vel=0.28, att=0.005, rel=2)
o.chord('vc', ['D2', 'A2'], 92.6, 5.0, vel=0.25, att=2, rel=1.2); o.note('va', 'F3', 92.8, 4.8, vel=0.15, att=2, rel=1.2)
o.chord('vc', ['Bb1', 'F2'], 97.6, 5.0, vel=0.25, att=1.5, rel=1.2); o.note('va', 'D3', 97.8, 5.0, vel=0.16, att=2, rel=1.2)
o.note('cb', 'D1', 102.8, 7.4, vel=0.25, att=2.5, rel=1.5); o.note('svn', 'A5', 103.4, 6.4, vel=0.1, att=3, rel=1.5)
o.chord('vc', ['F2', 'C3'], 109.6, 4.0, vel=0.3, att=2.0, rel=1.5); o.chord('va', ['F3', 'A3'], 109.8, 3.8, vel=0.25, att=2.0, rel=1.5)
o.chord('vn', ['C4', 'F4', 'A4'], 110.0, 3.6, vel=0.24, att=2.0, rel=1.5)

# 三、雪：大提琴唱主题 → 敌人来了（颤音、滚奏）→ 打退突围 → 一下子停住 → 战友上山 → 独奏小提琴的主题 → 几乎安静 → 日出
o.chord('vc', ['D2', 'A2'], 113.8, 6.0, vel=0.22, att=2, rel=1.2)
melody('svn', 114.4, THEME_A[:5], vel=0.27)
o.chord('vn_trem', ['A4', 'Bb4'], 119.8, 3.0, vel=0.22, att=1.5, rel=0.3); o.roll(120.8, 2.0, drum=2, gain=0.7)
o.note('cb', 'D1', 119.8, 3.0, vel=0.35, att=1.0, rel=0.3)
for tt in (122.8, 124.0, 125.3, 126.6): o.hit(tt, vel=0.8, drum=1, gain=0.95)
pulse('vc_spic', 'D2', 122.9, 127.7, 0.22, 0.45, 0.6, alt='Eb2')
o.chord('hn', ['D3', 'A3'], 122.9, 1.0, vel=0.5, att=0.05, rel=0.4); o.chord('hn', ['Eb3', 'Bb3'], 125.3, 1.0, vel=0.5, att=0.05, rel=0.4)
o.chord('vn_trem', ['D5', 'Eb5', 'A5'], 122.9, 4.8, vel=0.3, att=0.5, rel=0.1)
o.note('cb', 'D1', 132.0, 3.6, vel=0.18, att=3, rel=1.5)
o.chord('vc', ['D2', 'A2'], 135.6, 5.8, vel=0.22, att=2.5, rel=1.5); o.note('va', 'F3', 136.0, 5.4, vel=0.16, att=2.5, rel=1.5)
for k, ch in enumerate(['Dm', 'Bb', 'F', 'A']):
    t0 = 141.4 + k * 4.75
    o.chord('vc', CH[ch][:2], t0, 4.75, vel=0.26, att=1.5, rel=1.5); o.chord('va', CH[ch][3:4], t0, 4.75, vel=0.18, att=1.5, rel=1.5)
    o.chord('vn', CH[ch][3:], t0 + 0.1, 4.65, vel=0.14, att=2.0, rel=1.5)
melody('svn', 141.8, THEME_A, vel=0.3)
melody('svn', 154.0, [('F5', 1.6), ('E5', 1.0), ('D5', 1.0), ('C5', 1.4), ('A4', 2.6)], vel=0.3)
o.note('hn', 'D3', 153.6, 6.4, vel=0.28, att=2.0, rel=1.5)
o.note('svn', 'D6', 160.6, 4.4, vel=0.08, att=1.5, rel=2.0)                         # “他们是被冻死的”：只剩一根高音
for k, ch in enumerate(['Dm', 'Bb', 'F', 'A']):
    t0 = 166.0 + k * 1.6
    o.chord('vc', CH[ch][:2], t0, 1.7 if k < 3 else 3.6, vel=0.32 + 0.04 * k, att=0.8, rel=1.2)
    o.chord('vn', CH[ch][2:], t0 + 0.05, 1.7 if k < 3 else 3.6, vel=0.24 + 0.04 * k, att=0.8, rel=1.2)
o.chord('hn', ['D3', 'A3'], 166.2, 6.0, vel=0.35, att=1.5, rel=1.5); o.roll(170.6, 1.8, drum=1, gain=0.6)

# 四、纸条：竖琴 → 主题升起来 → “高傲地耸立在我的阵地上”最高 → “冰雕连” → 传家宝（暖）
for k, nt in enumerate(['D4', 'A3', 'F4', 'D4', 'A4', 'F4']): o.note('harp', nt, 173.6 + k * 1.2, 3.0, vel=0.28, att=0.005, rel=2)
o.chord('vc', ['D2', 'A2'], 173.2, 8.8, vel=0.2, att=2.5, rel=1.5); o.note('svn', 'A4', 179.6, 2.6, vel=0.18, att=1.5, rel=1.0)
for k, ch in enumerate(['F', 'C', 'Dm', 'Bb']):
    t0 = 182.0 + k * 3.0
    o.chord('vc', CH[ch][:2], t0, 3.0, vel=0.26, att=1.2, rel=1.2); o.chord('vn', CH[ch][3:], t0 + 0.05, 3.0, vel=0.16, att=1.5, rel=1.2)
for k, ch in enumerate(['F', 'C', 'Dm', 'Bb', 'F', 'C']):
    t0 = 194.0 + k * 1.1 if k < 4 else 198.4 + (k - 4) * 2.7
    d = 1.1 if k < 4 else 2.7
    o.chord('vc', CH[ch][:2], t0, d, vel=0.34 + 0.03 * k, att=0.5, rel=1.0); o.chord('va', CH[ch][2:4], t0, d, vel=0.3 + 0.03 * k, att=0.5, rel=1.0)
    o.chord('vn', CH[ch][3:], t0 + 0.05, d, vel=0.3 + 0.03 * k, att=0.5, rel=1.0)
melody('svn', 182.6, THEME_B, vel=0.32)
melody('svn', 196.2, [('F5', 1.0), ('G5', 1.2), ('A5', 3.0)], vel=0.4)
o.roll(197.0, 1.6, drum=1, gain=0.75); o.hit(198.6, vel=0.8, drum=1, gain=0.9)
o.chord('hn', ['F3', 'C4'], 198.6, 5.3, vel=0.42, att=0.3, rel=2.0)
melody('hn', 199.0, [('A3', 1.2), ('C4', 1.0), ('F4', 3.0)], vel=0.4)
harp(203.9, 209.4, ['F', 'Bb', 'F', 'C'], bpm=66, vel=0.28)
o.chord('vn', ['A4', 'C5'], 204.0, 5.4, vel=0.14, att=2.5, rel=1.5); o.note('vc', 'F2', 204.0, 5.4, vel=0.2, att=2.5, rel=1.5)

# 五、这一仗：圆号低低地唱 → 枪上挂着的帽子（大提琴独奏）
o.chord('vc', ['D2', 'A2'], 210.2, 6.0, vel=0.24, att=2, rel=1.2)
melody('hn', 210.8, [('D3', 1.6), ('F3', 1.2), ('A3', 1.4), ('G3', 1.8)], vel=0.3)
o.note('cb', 'D1', 216.2, 5.6, vel=0.22, att=2, rel=1.5)
melody('vc', 216.6, [('A3', 1.5), ('G3', 1.0), ('F3', 1.0), ('E3', 1.0), ('D3', 2.0)], vel=0.3)

# 结尾：现在的雪（竖琴）→ 电影院 → 一点点升起来 → 主题 + 圆号 → “致敬”：D 大调
harp(222.4, 236.0, ['Dm', 'Bb', 'F', 'C'], bpm=56, vel=0.28)
o.chord('vn', ['D5', 'F5'], 222.8, 7.6, vel=0.12, att=3, rel=2); o.note('vc', 'D2', 230.6, 5.4, vel=0.2, att=2, rel=1.5)
for k, ch in enumerate(['Dm', 'Bb', 'Gm', 'A']):
    t0 = 236.0 + k * 2.55
    o.chord('vc', CH[ch][:2], t0, 2.55, vel=0.26 + 0.03 * k, att=1.0, rel=1.2); o.chord('va', CH[ch][3:4], t0, 2.55, vel=0.18 + 0.03 * k, att=1.0, rel=1.2)
melody('vc', 236.4, [('A3', 1.5), ('D4', 1.0), ('C4', 1.0), ('A3', 2.0), ('G3', 1.0), ('A3', 1.0), ('F3', 1.0), ('E3', 1.0), ('D3', 1.6)], vel=0.3)
for k, ch in enumerate(['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'A']):
    t0 = 246.2 + k * 1.42
    o.chord('vc', CH[ch][:2], t0, 1.42, vel=0.3 + 0.02 * k, att=0.6, rel=1.0); o.chord('va', CH[ch][2:4], t0, 1.42, vel=0.26 + 0.02 * k, att=0.6, rel=1.0)
    o.chord('vn', CH[ch][3:], t0 + 0.05, 1.42, vel=0.24 + 0.02 * k, att=0.6, rel=1.0)
melody('svn', 246.6, THEME_A, vel=0.36)
melody('hn', 251.2, [('D3', 1.5), ('F3', 1.0), ('A3', 1.5), ('G3', 1.0), ('E3', 1.4)], vel=0.36)
o.roll(256.0, 1.6, drum=1, gain=0.8)
o.hit(257.6, vel=0.9, drum=1, gain=1.0); o.bdrum(257.6, vel=0.7, gain=0.6)
for inst, notes, v in [('cb', ['D1'], 0.4), ('vc', ['D2', 'A2', 'D3'], 0.38), ('va', ['F#3', 'A3'], 0.32), ('vn', ['D4', 'F#4', 'A4', 'D5'], 0.3),
                       ('hn', ['D3', 'A3', 'F#4'], 0.36)]:
    o.chord(inst, notes, 257.6, 6.0, vel=v, att=0.4, rel=3.0)
music = o.render(reverb=0.36)
music = music / (np.abs(music).max() + 1e-9) * 0.42
c0, c1 = int(W(127.8) * SR), int(W(128.0) * SR)                                     # 枪声停的那一下，音乐也一下子停住
music[c0:c1] *= np.linspace(1, 0, c1 - c0)[:, None]; music[c1:int(W(131.0) * SR)] = 0

# ================= 音效 =================
put(sfx.snow_wind(12.0), 0.0, 0.11)
put(sfx.breath(9.0, 0.24), 0.4, 0.10)
put(sfx.heartbeat(46, 9.5), 0.6, 0.16)
for tt, g in ((6.6, 0.32), (8.2, 0.2), (9.5, 0.28)): put(sfx.artillery(4.0), tt, g)
put(sfx.flare(4.0), 6.3, 0.05, pan=0.2)
put(sfx.wind(27.0), 10.8, 0.07)
put(sfx.snow_wind(5.0), 17.6, 0.10)
put(sfx.boom(1.4), 37.4, 0.3)
put(sfx.steps(5.2, 1.8, 'snow'), 40.4, 0.06); put(sfx.steps(5.0, 1.6, 'snow'), 40.6, 0.04, pan=0.4)
put(sfx.wind(39.0), 40.4, 0.05)
put(sfx.engines(5.8), 45.6, 0.09, pan=0.3)
put(sfx.steps(6.6, 1.3, 'snow'), 51.5, 0.05)
put(sfx.crowd(6.8, 10), 58.2, 0.018)
put(sfx.snow_wind(6.6), 64.8, 0.16)
put(sfx.breath(4.4, 0.3), 71.2, 0.05)
put(sfx.fire(4.2), 75.6, 0.025); put(sfx.rustle(1.4, 20), 76.4, 0.05)
for tt, g in ((80.3, 0.3), (81.9, 0.24), (83.5, 0.3), (85.2, 0.22)): put(sfx.artillery(3.5), tt, g, pan=np.sin(tt))
put(sfx.gunfire(6.6, shots=18), 80.3, 0.11)
put(sfx.rustle(1.0, 16), 87.0, 0.06)
put(sfx.wind(16.0), 86.9, 0.06)
put(sfx.dig(5.0, 1.8), 97.8, 0.05)
put(sfx.snow_wind(10.6), 102.8, 0.07); put(sfx.heartbeat(44, 7.0), 103.0, 0.10)
put(sfx.snow_wind(6.2), 113.8, 0.13)
put(sfx.engines(3.2, approach=True), 119.6, 0.15, pan=-0.2); put(sfx.heartbeat(72, 3.0), 119.8, 0.18)
put(sfx.gunfire(5.0, shots=26, far=False), 122.8, 0.16)
for tt, g in ((123.4, 0.28), (125.0, 0.24), (126.4, 0.3)): put(sfx.artillery(1.6, far=False), tt, g, pan=0.3 * np.cos(tt))
c0, c1 = int(W(127.8) * SR), int(W(127.95) * SR)
fx[c0:c1] *= np.linspace(1, 0, c1 - c0)[:, None]; fx[c1:int(W(128.6) * SR)] = 0
put(sfx.wind(44.0), 128.6, 0.05)
put(sfx.steps(5.8, 1.5, 'snow'), 135.6, 0.05)
put(sfx.rustle(1.6, 26), 175.2, 0.06); put(sfx.rustle(1.2, 30), 179.6, 0.07)
put(sfx.wind(26.0), 173.2, 0.03)
put(sfx.engines(6.0), 210.2, 0.04, pan=0.4); put(sfx.wind(6.0), 210.2, 0.05)
put(sfx.snow_wind(5.6), 216.2, 0.06)
put(sfx.wind(8.2), 222.4, 0.04)
put(sfx.projector(5.4), 230.6, 0.03)
put(sfx.wind(30.0), 236.0, 0.045)

out = music + fx
out = np.tanh(out * 1.2) / 1.2
wf.write('bgm.wav', SR, (np.clip(out, -1, 1) * 32767).astype(np.int16))
print('bgm.wav', f'{N / SR:.1f}s', f'峰值 {np.abs(out).max():.2f}')
