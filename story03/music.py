"""第 3 集《水门桥》的配乐和音效。

    python3 music.py      -> bgm.wav（48 kHz 立体声，跟成片一样长）

- 配乐：VSCO 2 CE 真乐器采样（Versilian Studios，可商用，见 tools/story/orch.py）。D 小调：
  第一帧一声定音鼓（钩子）→ 运输机的嗡嗡声里弦乐颤音 → 雪山、车队（低音脉动）→ 炸桥（越来越紧，一声巨响，然后只剩风）
  → 修好、再炸（敲打声和定音鼓一来一回，“一共三次”三下鼓）→ 空投（低音铜管、弦乐盘旋）→ 拼桥、过桥 → 天亮，安静
  → 这一仗（大提琴的哀歌）→ 结尾：竖琴、独奏小提琴，郭荣熙那句话时主题升起来，“致敬”停在 D 大调。
- 音效：tools/story/sfx.py 合成的风雪、炮声、爆炸、运输机、发动机、修桥的敲打、电台、降落伞、海浪、汽笛、脚步、呼吸、心跳、放映机。
"""
import os, sys
import numpy as np
import scipy.io.wavfile as wf
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'story'))
import sfx
from orch import Orch, SR
from shots import END

N = int(END * SR)
o = Orch(END)
fx = np.zeros((N, 2), np.float32)


def put(sig, t0, gain=1.0, pan=0.0):
    a = int(t0 * SR)
    if a >= N: return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2), np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        sig = np.stack([sig * l, sig * r], 1)
    k = min(len(sig), N - a)
    fx[a:a + k] += sig[:k] * gain


CH = {'Dm': ['D2', 'A2', 'D3', 'F3', 'A3'], 'Bb': ['Bb1', 'F2', 'Bb2', 'D3', 'F3'], 'F': ['F2', 'C3', 'F3', 'A3', 'C4'],
      'C': ['C3', 'G3', 'C4', 'E4', 'G4'], 'A': ['A2', 'E3', 'A3', 'C#4', 'E4'], 'Gm': ['G2', 'D3', 'G3', 'Bb3', 'D4']}


def harp(t0, t1, prog, bpm=60, vel=0.32, pattern=(0, 2, 1, 3, 2, 4, 3, 2)):
    bar = 4 * 60 / bpm; step = bar / len(pattern); t, i = t0, 0
    while t < t1 - 0.3:
        o.arp('harp', CH[prog[i % len(prog)]], t, min(t + bar, t1) - 0.05, step=step, dur=2.5, vel=vel, pattern=list(pattern))
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


def pad(t0, prog, each, vc=0.24, vn=0.14):
    for k, ch in enumerate(prog):
        a = t0 + k * each
        o.chord('vc', CH[ch][:2], a, each, vel=vc, att=1.2, rel=1.2); o.chord('vn', CH[ch][3:], a + 0.05, each, vel=vn, att=1.5, rel=1.2)


THEME = [('A4', 1.5), ('D5', 1.0), ('C5', 1.0), ('A4', 2.0), ('G4', 1.0), ('A4', 1.0), ('F4', 1.0), ('E4', 1.0), ('D4', 3.0)]

# ================= 配乐 =================
# 钩子：第一帧一声定音鼓，低音弦乐；空投那句弦乐颤音往上走
o.hit(0.0, vel=0.9, drum=1, gain=1.0); o.bdrum(0.0, vel=0.7, gain=0.6)
o.chord('vc', ['D2', 'A2'], 0.0, 7.4, vel=0.4, att=0.05, rel=2); o.note('cb', 'D1', 0.0, 13.0, vel=0.4, att=0.05, rel=2)
o.chord('vn_trem', ['D5', 'F5'], 3.1, 4.4, vel=0.22, att=2.5, rel=0.8); o.roll(6.0, 1.5, drum=2, gain=0.6)
o.hit(7.6, vel=0.6, drum=1, gain=0.7)
# 雪山、车队、水门桥
o.chord('va', ['F3', 'A3'], 8.0, 5.6, vel=0.18, att=2, rel=1.5)
pulse('vc_spic', 'D2', 13.6, 18.4, 0.5, 0.2, 0.28, alt='A1')
pad(18.6, ['Dm', 'Bb', 'F', 'A'], 3.4)
harp(18.8, 32.0, ['Dm', 'Bb', 'F', 'A'], bpm=70, vel=0.26)
o.chord('vn_trem', ['A4', 'Bb4'], 32.5, 5.8, vel=0.2, att=3, rel=0.5); o.note('cb', 'D1', 32.5, 5.8, vel=0.3, att=2, rel=0.5)
# 一、第一次：地图（安静的脉动）→ 出发（行军）→ 零下四十度 → 装炸药（越来越紧）→ 巨响 → 只剩风 → 受伤、抬下阵地（哀歌）
pulse('vc_spic', 'D2', 39.0, 45.8, 0.6, 0.16)
o.note('harp', 'D2', 39.2, 3, vel=0.28, att=0.005, rel=2); o.note('harp', 'A2', 42.0, 3, vel=0.26, att=0.005, rel=2)
pulse('vc_spic', 'D2', 46.0, 51.0, 0.5, 0.24, 0.3, alt='A1'); o.chord('va', ['D3', 'A3'], 46.0, 5.2, vel=0.16, att=2, rel=1)
o.note('svn', 'D6', 51.4, 4.0, vel=0.08, att=1.5, rel=1.5); o.note('cb', 'D1', 51.2, 4.4, vel=0.25, att=2, rel=1)
o.chord('vn_trem', ['D5', 'Eb5'], 55.6, 5.7, vel=0.18, att=4.5, rel=0.1); o.chord('vc_trem', ['D2', 'A2'], 55.6, 5.7, vel=0.2, att=4.5, rel=0.1)
o.roll(59.5, 1.8, drum=1, gain=0.7)
o.hit(61.4, vel=1.0, drum=1, gain=1.2); o.bdrum(61.4, vel=1.0, gain=1.0)
o.chord('vc', ['D2', 'A2'], 66.8, 5.5, vel=0.24, att=2, rel=1.5)
melody('vc', 67.2, [('A3', 1.5), ('G3', 1.0), ('F3', 1.0), ('E3', 1.0), ('D3', 2.0)], vel=0.3)
o.chord('vn', ['D4', 'F4'], 72.3, 4.3, vel=0.14, att=2, rel=1.5); melody('svn', 72.6, THEME[:4], vel=0.26)
# 二、修好，再炸：一来一回，“一共三次”三下鼓，最后一次低音重重地压下来
pulse('vc_spic', 'D2', 77.4, 82.3, 0.45, 0.2, 0.26)
o.chord('vn_trem', ['A4', 'Bb4'], 82.5, 2.4, vel=0.22, att=1.5, rel=0.2)
o.hit(85.0, vel=0.8, drum=1, gain=0.9)
pulse('vc_spic', 'D2', 87.2, 89.2, 0.4, 0.22)
for k, tt in enumerate((90.2, 91.4, 92.6)): o.hit(tt, vel=0.55 + 0.15 * k, drum=1, gain=0.7 + 0.1 * k)
o.chord('vc', ['D2', 'A2', 'D3'], 94.5, 4.3, vel=0.42, att=0.1, rel=2); o.note('cb', 'D1', 94.5, 4.3, vel=0.45, att=0.1, rel=2)
o.chord('hn', ['D3', 'A3'], 94.6, 4.2, vel=0.35, att=0.3, rel=2)
o.note('cb', 'D1', 98.8, 10.6, vel=0.25, att=2, rel=1.5); o.chord('va', ['F3', 'A3'], 99.0, 10.4, vel=0.14, att=3, rel=1.5)
# 三、从天上来的桥：低音铜管、弦乐盘旋；摔坏一声；拼桥；过桥；天亮安静下来
o.chord('vc', ['D2', 'A2'], 110.1, 7.4, vel=0.22, att=2, rel=1.2)
o.chord('vn_trem', ['D5', 'A5'], 117.6, 8.2, vel=0.14, att=3, rel=1)
o.chord('hn', ['D3', 'F3'], 125.9, 5.6, vel=0.32, att=1.5, rel=1.2); o.chord('vc', ['D2', 'A2'], 125.9, 5.6, vel=0.3, att=1.5, rel=1.2)
o.roll(129.8, 1.8, drum=2, gain=0.6)
for k, ch in enumerate(['Dm', 'Bb', 'Gm', 'A']):
    a = 136.0 + k * 1.7
    o.chord('vn', CH[ch][2:], a, 1.8, vel=0.2 + 0.03 * k, att=0.6, rel=1.0); o.chord('vc', CH[ch][:2], a, 1.8, vel=0.24 + 0.03 * k, att=0.6, rel=1.0)
o.hit(143.0, vel=0.6, drum=2, gain=0.7)
o.note('cb', 'D1', 145.6, 4.2, vel=0.22, att=1, rel=1)
pulse('vc_spic', 'D2', 153.8, 159.5, 0.5, 0.2, 0.26, alt='F2')
o.chord('va', ['D3', 'A3'], 159.7, 7.5, vel=0.18, att=2.5, rel=1.5); o.note('cb', 'D1', 159.7, 7.5, vel=0.25, att=2.5, rel=1.5)
o.chord('vn', ['F4', 'A4'], 167.4, 6.8, vel=0.12, att=3, rel=2)
# 四、这一仗：大提琴哀歌
o.note('cb', 'D1', 175.2, 5.3, vel=0.22, att=2, rel=1.5)
pad(180.5, ['Dm', 'Bb', 'F', 'A'], 3.2)
melody('vc', 181.0, [('A3', 1.5), ('G3', 1.0), ('F3', 1.0), ('E3', 1.0), ('D3', 2.0), ('E3', 1.0), ('F3', 1.0), ('E3', 1.5), ('D3', 3.0)], vel=0.3)
# 结尾：钢桥、棉衣（冷）→ 冰雕连（弦乐升起来）→ 春天（竖琴，F 大调）→ 电影院 → 旧帽子 → 那句话（主题）→ 致敬：D 大调
o.chord('vn_trem', ['D5', 'A5'], 193.9, 4.6, vel=0.12, att=2, rel=1)
o.chord('vc', ['D2', 'A2'], 198.5, 6.1, vel=0.24, att=2, rel=1.2)
pad(204.6, ['Dm', 'Bb', 'F', 'C'], 1.65, vc=0.28, vn=0.2)
o.chord('hn', ['D3', 'A3'], 204.8, 6.2, vel=0.3, att=1.5, rel=1.5)
harp(211.2, 221.6, ['F', 'C', 'Bb', 'F'], bpm=66, vel=0.26)
o.chord('vn', ['A4', 'C5'], 211.4, 5.4, vel=0.12, att=2.5, rel=1.5)
o.note('vc', 'D2', 221.8, 5.2, vel=0.2, att=2, rel=1.5); o.note('svn', 'A5', 222.2, 4.6, vel=0.1, att=2, rel=1.5)
pad(227.0, ['Dm', 'Bb', 'F', 'A'], 2.1, vc=0.28, vn=0.18)
melody('svn', 227.4, THEME, vel=0.34)
o.roll(234.2, 1.2, drum=1, gain=0.7)
o.hit(235.4, vel=0.85, drum=1, gain=0.95); o.bdrum(235.4, vel=0.6, gain=0.5)
for inst, notes, v in [('cb', ['D1'], 0.4), ('vc', ['D2', 'A2', 'D3'], 0.38), ('va', ['F#3', 'A3'], 0.32), ('vn', ['D4', 'F#4', 'A4', 'D5'], 0.3),
                       ('hn', ['D3', 'A3', 'F#4'], 0.36)]:
    o.chord(inst, notes, 235.4, 5.6, vel=v, att=0.4, rel=2.5)
music = o.render(reverb=0.36)
music = music / (np.abs(music).max() + 1e-9) * 0.42
c0, c1 = int(61.9 * SR), int(62.3 * SR)                 # 炸药响了以后，音乐一下子停住，只剩风和回声
music[c0:c1] *= np.linspace(1, 0, c1 - c0)[:, None]; music[c1:int(66.6 * SR)] = 0

# ================= 音效 =================
put(sfx.artillery(3.0, far=False), 0.0, 0.32)                                 # 第一帧：一声闷响
put(sfx.snow_wind(14.0), 0.0, 0.07)
put(sfx.planes(5.0, n=6), 2.8, 0.18)                                          # 空投那句：飞机
put(sfx.wind(31.0), 7.6, 0.06)
for tt, g in ((8.4, 0.18), (10.9, 0.12)): put(sfx.artillery(4.0), tt, g, pan=-0.3)
put(sfx.engines(5.0), 13.6, 0.1, pan=0.2)
put(sfx.engines(6.0), 32.5, 0.06, pan=-0.2)
put(sfx.fire(7.0), 38.9, 0.025)                                               # 马灯
put(sfx.rustle(1.0, 14), 39.6, 0.05)
put(sfx.steps(5.2, 1.7, 'snow'), 46.0, 0.07); put(sfx.steps(5.0, 1.5, 'snow'), 46.2, 0.04, pan=0.4)
put(sfx.snow_wind(4.6), 51.0, 0.12); put(sfx.breath(4.4, 0.35), 51.4, 0.06)
put(sfx.heartbeat(64, 5.6), 55.7, 0.18); put(sfx.dig(4.0, 1.6), 56.4, 0.04)
put(sfx.artillery(4.5, far=False), 61.4, 0.5); put(sfx.boom(1.4), 61.4, 0.35)  # 炸药响了
put(sfx.rustle(2.0, 40), 62.4, 0.05)                                          # 碎石落下来
put(sfx.wind(10.0), 64.0, 0.07)
put(sfx.steps(4.2, 1.2, 'snow'), 72.4, 0.05); put(sfx.breath(4.0, 0.3), 72.6, 0.04)
put(sfx.hammering(5.0, 1.4), 77.4, 0.06, pan=0.2); put(sfx.engines(5.0), 77.2, 0.04)
put(sfx.dig(2.2, 2.0), 82.6, 0.04)
put(sfx.artillery(3.5), 85.0, 0.34)                                           # 桥又断了
put(sfx.hammering(2.2, 2.0), 87.2, 0.05, pan=-0.2)
put(sfx.wind(20.0), 89.3, 0.05)
put(sfx.artillery(3.0, far=False), 94.6, 0.22)
put(sfx.engines(10.5), 98.8, 0.07, pan=0.3)                                   # 堵着的车
put(sfx.snow_wind(7.4), 110.1, 0.08)
put(sfx.radio(3.0), 114.7, 0.07)
put(sfx.planes(6.0, n=1), 117.4, 0.08); put(sfx.wind(4.6), 118.6, 0.05)       # 试投
put(sfx.planes(6.5, n=8), 125.6, 0.24)                                        # 八架运输机
put(sfx.wind(4.4), 131.6, 0.14)                                               # 货舱里的风
put(sfx.snow_wind(6.8), 136.0, 0.1); put(sfx.rustle(3.0, 50), 137.0, 0.05)    # 降落伞
put(sfx.clank(160, 3.0, 2.0), 143.0, 0.28); put(sfx.boom(1.4), 143.0, 0.18)   # 摔坏了
put(sfx.boom(1.4), 147.2, 0.1, pan=-0.5)                                      # 落进阵地
put(sfx.wind(4.0), 149.8, 0.05); put(sfx.engines(4.0), 149.8, 0.05)
put(sfx.hammering(6.0, 1.2), 153.7, 0.07); put(sfx.engines(6.0), 153.7, 0.05, pan=0.3)
put(sfx.engines(7.5, approach=True), 159.7, 0.12)                             # 车过桥
for k in range(5): put(sfx.clank(140 + 30 * k, 4.0, 1.5), 161.0 + k * 1.2, 0.08)
put(sfx.wind(7.4), 167.2, 0.04)
put(sfx.waves(5.6), 175.2, 0.1); put(sfx.ship_horn(3.0), 176.0, 0.08)        # 兴南港
put(sfx.wind(12.8), 180.5, 0.04)
put(sfx.wind(4.6), 193.9, 0.05)
put(sfx.snow_wind(6.1), 198.5, 0.14)
put(sfx.birds(5.0, 4), 211.6, 0.03)                                           # 春天
put(sfx.projector(4.9), 216.9, 0.03)
put(sfx.wind(8.4), 227.0, 0.03)

out = music + fx
out = np.tanh(out * 1.2) / 1.2
wf.write('bgm.wav', SR, (np.clip(out, -1, 1) * 32767).astype(np.int16))
print('bgm.wav', f'{N / SR:.1f}s', f'峰值 {np.abs(out).max():.2f}')
