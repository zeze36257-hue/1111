"""第 1 集的配乐和音效（第二版，11 月 5 日频道主说可以多用音效和音乐，增加氛围感）。

    python3 music.py      -> bgm.wav（48 kHz 立体声，跟成片一样长）

- 配乐：真乐器采样（VSCO 2 CE，Versilian Studios，可商用，见 tools/story/orch.py）：
  大提琴组、小提琴组、中提琴组、独奏小提琴、低音提琴、圆号、竖琴、定音鼓、大鼓。A 小调，跟着故事走：
  开头悬念 → 皮毛猎人（竖琴）→ 熊（越来越紧，定音鼓）→ 丢下（独奏小提琴）→ 爬（低音脉动，到河边转亮）
  → 找人（雪夜冷、原谅时弦乐升起来、威胁时圆号压下来）→ 结尾（小提琴主题，停在 A 小调）。
- 音效：tools/story/sfx.py 合成的风、河水、篝火、蟋蟀、狼嚎、鸟叫、脚步、马蹄、雨和雷、开门、人群、转场呼啸、熊吼和闷响。
- 第一版（numpy 合成的吉他和铺底）在 git 历史里。
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


CH = {'Am': ['A2', 'E3', 'A3', 'C4', 'E4'], 'F': ['F2', 'C3', 'F3', 'A3', 'C4'], 'C': ['C3', 'G3', 'C4', 'E4', 'G4'],
      'G': ['G2', 'D3', 'G3', 'B3', 'D4'], 'Dm': ['D3', 'A3', 'D4', 'F4', 'A4'], 'E': ['E2', 'B2', 'E3', 'G#3', 'B3']}


def harp(t0, t1, prog, bpm=66, vel=0.42, pattern=(0, 2, 1, 3, 2, 4, 3, 2)):
    bar = 4 * 60 / bpm; step = bar / len(pattern); t, i = t0, 0
    while t < t1 - 0.3:
        ch = CH[prog[i % len(prog)]]
        o.arp('harp', ch, t, min(t + bar, t1) - 0.05, step=step, dur=2.5, vel=vel, pattern=list(pattern))
        t += bar; i += 1


def melody(inst, t, notes, vel=0.4):
    for nt, d in notes:
        o.note(inst, nt, t, d, vel=vel, att=0.25, rel=1.0); t += d


# ================= 配乐 =================
# 开头：低音 + 高音弦乐颤音，“他没有死”一声定音鼓
o.note('cb', 'A1', 0.0, 43.5, vel=0.4, att=3, rel=2)
o.chord('vc', ['A2', 'E3'], 0.4, 19.5, vel=0.3, att=3, rel=1.5)
o.note('vn_trem', 'E5', 0.0, 8.0, vel=0.2, att=1.5, rel=2)
o.roll(17.4, 3.2, drum=2, gain=0.7); o.hit(20.6, vel=0.9, drum=1, gain=1.1)
o.chord('vc', ['A2', 'C3'], 21.0, 22.5, vel=0.3, att=2, rel=2)
o.chord('vn', ['A4', 'C5', 'E5'], 31.4, 6.0, vel=0.22, att=2, rel=2)
o.chord('vn_trem', ['A4', 'E5'], 37.5, 6.6, vel=0.28, att=2.5, rel=0.8)
o.hit(44.2, vel=0.4, drum=1, gain=0.7)
# 一、皮毛猎人：传说那两张是独奏小提琴，拉船以后是竖琴
o.note('va', 'A3', 45.3, 10.0, vel=0.2, att=2, rel=2)
melody('svn', 47.2, [('E5', 2.4), ('D5', 1.6), ('C5', 2.0), ('B4', 2.8)], vel=0.3)
harp(55.6, 75.0, ['Am', 'F', 'C', 'G'])
for k, nt in enumerate(['A2', 'F2', 'C3', 'G2', 'A2', 'F2']):
    o.note('vc', nt, 55.6 + k * 3.64, 3.6, vel=0.28, att=0.6, rel=1.2)
o.chord('vn', ['C5', 'E5'], 61.2, 13.5, vel=0.18, att=3, rel=2.5)
# 二、熊：大提琴跳弓越来越急，颤音往上顶，定音鼓滚奏，然后一下砸下去
t, k = 75.9, 0
while t < 85.4:
    o.note('vc_spic', 'A2', t, 0.25, vel=0.25 + 0.6 * (t - 75.9) / 9.5, att=0.005, rel=0.2); t += 0.3; k += 1
o.chord('vn_trem', ['A4', 'Bb4'], 79.4, 6.0, vel=0.35, att=4, rel=0.2)
o.roll(82.5, 3.0, drum=2, gain=0.9)
o.hit(85.5, vel=1.0, drum=1, gain=1.3); o.bdrum(85.5, vel=1.0, gain=1.0)
o.note('cb', 'A1', 86.7, 14.0, vel=0.4, att=2, rel=2)
o.chord('vc', ['A2', 'E3'], 87.0, 13.5, vel=0.3, att=3, rel=2)
melody('svn', 92.6, [('E5', 2.2), ('D5', 1.5), ('C5', 2.0), ('B4', 3.0)], vel=0.32)
# 三、丢下：D 小调，独奏小提琴零零星星；盯着两个人时圆号压低；篝火时几乎安静
o.chord('vc', ['D3', 'A3'], 102.0, 7.8, vel=0.28, att=2.5, rel=1.5); o.note('cb', 'D2', 102.0, 21.0, vel=0.32, att=2.5, rel=2)
o.chord('vc', ['Bb2', 'F3'], 109.8, 6.4, vel=0.28, att=1.5, rel=1.5)
melody('svn', 104.0, [('A4', 3.0), ('F4', 2.5), ('G4', 2.0), ('E4', 3.5)], vel=0.28)
o.note('vn_trem', 'D5', 116.2, 7.2, vel=0.2, att=1.5, rel=1.5); o.note('hn', 'D3', 116.4, 7.0, vel=0.25, att=1.5, rel=1.5)
o.note('cb', 'D2', 123.6, 3.8, vel=0.2, att=1, rel=1.5)
o.chord('vc_trem', ['D3', 'A3'], 127.4, 12.0, vel=0.25, att=2, rel=1.0)
o.hit(134.5, vel=0.35, drum=2, gain=0.6)
o.note('hn', 'A2', 139.8, 6.8, vel=0.25, att=2, rel=1.5); o.chord('vc', ['D3', 'F3'], 139.8, 6.8, vel=0.25, att=2, rel=1.5)
o.hit(146.6, vel=0.3, drum=1, gain=0.6)
# 四、爬：低音颤音挣扎，跳弓脉动是“还要往前”，暴雨里定音鼓，到了河边转成大调，竖琴
o.note('cb', 'A1', 147.5, 16.0, vel=0.35, att=3, rel=2); o.chord('vc_trem', ['A2', 'E3'], 148.0, 15.6, vel=0.25, att=3, rel=1.5)
t = 163.6
while t < 174.4:
    o.note('vc_spic', 'A2', t, 0.3, vel=0.4, att=0.005, rel=0.25); t += 0.375
o.note('va', 'E3', 163.8, 10.6, vel=0.22, att=2, rel=1.5); o.note('vn', 'A4', 168.2, 6.4, vel=0.2, att=2, rel=1.2)
o.roll(174.6, 2.4, drum=2, gain=0.8); o.hit(177.0, vel=0.6, drum=1, gain=0.8)
harp(177.2, 193.0, ['C', 'G', 'Am', 'F'], bpm=60, vel=0.38)
o.chord('vn', ['C5', 'E5'], 180.0, 13.0, vel=0.2, att=3, rel=2)
o.chord('hn', ['C3', 'G3'], 187.8, 5.4, vel=0.3, att=2, rel=1.5)
# 五、找人
t = 193.9
while t < 199.6:
    o.note('vc_spic', 'A2' if int((t - 193.9) / 0.83) % 2 == 0 else 'E2', t, 0.4, vel=0.4, att=0.005, rel=0.3); t += 0.415
o.note('hn', 'A2', 194.1, 5.6, vel=0.3, att=1.5, rel=1.0)
o.chord('vn_trem', ['E5', 'A5'], 199.8, 6.4, vel=0.18, att=2, rel=1.0); o.note('cb', 'A1', 199.8, 10.0, vel=0.3, att=2, rel=1)
o.hit(206.2, vel=0.7, drum=3, gain=0.9); o.chord('vn_trem', ['A4', 'Bb4'], 206.3, 3.6, vel=0.22, att=0.5, rel=0.6)
o.chord('vc', ['C3', 'G3'], 209.9, 6.9, vel=0.33, att=2.5, rel=2); o.chord('va', ['G3', 'C4'], 210.0, 6.8, vel=0.28, att=2.5, rel=2)
o.chord('vn', ['E4', 'C5'], 210.2, 6.6, vel=0.26, att=2.5, rel=2)
melody('svn', 211.0, [('G5', 2.0), ('E5', 2.0), ('C5', 3.0)], vel=0.3)
harp(216.8, 232.0, ['C', 'F', 'G', 'C'], bpm=72, vel=0.34)
o.hit(227.5, vel=0.4, drum=2, gain=0.6)
o.note('hn', 'A2', 232.6, 13.0, vel=0.3, att=2, rel=1.5); o.note('cb', 'A1', 232.6, 13.0, vel=0.35, att=2, rel=1.5)
o.chord('vc_trem', ['A2', 'Bb2'], 237.3, 8.4, vel=0.28, att=3, rel=0.6); o.hit(245.6, vel=0.6, drum=1, gain=0.8)
# 结尾：小提琴主题，最后停在 A 小调
o.note('cb', 'A1', 246.5, 6.0, vel=0.25, att=2, rel=2); o.note('vc', 'A2', 246.6, 6.0, vel=0.25, att=2, rel=2)
for k, nt in enumerate(['A3', 'E4', 'C5']): o.note('harp', nt, 247.5 + k * 1.6, 3.0, vel=0.3, att=0.005, rel=2)
harp(252.3, 266.8, ['Am', 'F', 'C', 'G'], bpm=60, vel=0.32)
o.chord('vn', ['C5', 'E5'], 252.5, 8.5, vel=0.18, att=3, rel=2)
o.chord('vn_trem', ['A5', 'E5'], 261.0, 5.8, vel=0.15, att=1.5, rel=1)
o.chord('vc', ['A2', 'E3'], 266.8, 7.0, vel=0.28, att=2, rel=1.5); o.note('vn', 'C4', 266.9, 6.8, vel=0.18, att=2, rel=1.5)
melody('svn', 267.0, [('E5', 2.0), ('D5', 1.0), ('C5', 1.5), ('B4', 1.0), ('A4', 3.5)], vel=0.33)
harp(274.0, 279.5, ['Am'], bpm=56, vel=0.3)
o.chord('vc', ['A2', 'E3'], 276.0, 4.5, vel=0.3, att=1.5, rel=3.5); o.chord('va', ['A3'], 276.0, 4.5, vel=0.25, att=1.5, rel=3.5)
o.chord('vn', ['A4', 'C5', 'E5'], 276.1, 4.4, vel=0.22, att=1.5, rel=3.5)
music = o.render(reverb=0.32)
music = music / (np.abs(music).max() + 1e-9) * 0.42

# ================= 音效 =================
for t0, t1, g in [(0, 44.5, 0.10), (45.1, 55.8, 0.04), (75.9, 101.4, 0.05), (102, 123.6, 0.06), (127.4, 146.9, 0.06),
                  (147.5, 174.6, 0.08), (187.6, 199.8, 0.05), (246.5, END, 0.06)]:
    put(sfx.wind(t1 - t0), t0, g)
put(sfx.growl(2.6), 1.6, 0.16)                                   # 开头那头熊
put(sfx.steps(6.0, 1.7), 14.5, 0.05, pan=0.3)                    # 两个人走远
put(sfx.heartbeat(58, 21.5), 20.6, 0.35)
put(sfx.crickets(7.4), 37.1, 0.05)                               # 夜里的草丛
put(sfx.whoosh(1.0, up=False), 44.0, 0.06)
put(sfx.river(4.0), 45.1, 0.03)
put(sfx.river(5.4), 55.8, 0.06); put(sfx.rope_creaks(5.2), 55.8, 0.05, pan=0.3); put(sfx.birds(5.2, 5), 55.8, 0.05)
put(sfx.fire(9.0), 61.0, 0.05)
put(sfx.birds(5.3, 6), 70.0, 0.05)
put(sfx.whoosh(1.0, up=False), 74.8, 0.06)
put(sfx.steps(3.4, 1.6), 75.9, 0.06, pan=-0.2)                   # 灌木丛里走
put(sfx.growl(2.6), 81.0, 0.22)
put(sfx.boom(1.4), 85.5, 0.45)
put(sfx.whoosh(1.0, up=False), 100.9, 0.06)
put(sfx.hooves(7.8, 1.5), 102.0, 0.06, pan=-0.3)
put(sfx.fire(3.8), 123.6, 0.07); put(sfx.crickets(3.8, 5), 123.6, 0.06)
put(sfx.steps(5.1, 1.8), 134.5, 0.05)
put(sfx.whoosh(1.0, up=False), 146.4, 0.06)
put(sfx.birds(4.4, 4), 147.5, 0.04)
put(sfx.heartbeat(50, 26.0), 148.0, 0.25)
put(sfx.wolf_howl(3.2, 420), 170.9, 0.10, pan=-0.4); put(sfx.wolf_howl(3.0, 470), 172.4, 0.07, pan=0.5)
put(sfx.rain(2.6), 174.5, 0.07); put(sfx.thunder(3.5), 175.2, 0.18)
put(sfx.river(10.6), 177.0, 0.06); put(sfx.birds(2.8, 3), 177.0, 0.04)
put(sfx.crowd(5.6), 187.7, 0.035)
put(sfx.whoosh(1.0, up=False), 192.8, 0.06)
put(sfx.birds(5.9, 4), 193.9, 0.035); put(sfx.steps(5.6, 1.8), 194.0, 0.04)
put(sfx.snow_wind(16.8), 199.8, 0.06)
put(sfx.creak(1.6, 120), 206.0, 0.10); put(sfx.whoosh(0.8, up=True), 206.1, 0.05)
put(sfx.steps(4.5, 2.2, 'snow'), 216.6, 0.035, pan=0.3)           # 军营操练
put(sfx.whoosh(1.0, up=False), 245.4, 0.06)
put(sfx.river(5.8), 246.5, 0.04)
put(sfx.hooves(8.7, 1.2), 252.3, 0.04, pan=0.4)
fx *= 1.0

out = music + fx
out = np.tanh(out * 1.2) / 1.2
wf.write('bgm.wav', SR, (np.clip(out, -1, 1) * 32767).astype(np.int16))
print('bgm.wav', f'{N / SR:.1f}s', f'峰值 {np.abs(out).max():.2f}')
