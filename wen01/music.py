"""读文案 01《让你笑的，才叫爱》— 配乐：很轻的钢琴，C 大调 / A 小调，75 BPM（一拍 0.8 秒）。

    python3 music.py        -> bgm.wav（和正片一样长）

跟着文案走三段，音量放低（−21 LUFS），有配音时 audio.py 会再压低：
  - 年少、疤、明白（开头到“不用那么用力”）：Am – F – C – G，很稀的分解和弦；
  - 让你笑的才叫爱、慢慢走：F – G – Em – Am，亮一点；
  - 总会有一个人……一起往前走：C – G – Am – F，带一条往上走的旋律，最后落在 C 上。
"""
import json, os, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
B = 60.0 / TL['bpm']
TOTAL = TL['total']
L = TL['lines']
P2, P3 = L[4][0] - .3, L[7][0] - .3                           # 第二段从“让你笑的”，第三段从“总会有一个人”开始

CH = {'Am': ['A2', 'E3', 'A3', 'C4', 'E4'], 'F': ['F2', 'C3', 'F3', 'A3', 'C4'], 'C': ['C3', 'G3', 'C4', 'E4', 'G4'],
      'G': ['G2', 'D3', 'G3', 'B3', 'D4'], 'Em': ['E2', 'B2', 'G3', 'B3', 'E4']}
song = Song(seconds=TOTAL, tail=4.0)
song.bus('left', gain=.7, reverb=.45); song.bus('right', gain=1.0, reverb=.5); song.bus('str', gain=.45, reverb=.55)


def broken(ch, t0, t1, step, vel, pat=(0, 2, 3, 4, 3, 2)):
    notes = CH[ch]; j = 0; t = t0
    while t < t1 - .1:
        song.add(PIANO, notes[pat[j % len(pat)]], t, B * 1.8, vel=vel * (1.12 if j % 4 == 0 else 1), bus='left'); j += 1; t += step * B


def mel(notes, t0, vel):
    for n, b, d in notes: song.add(PIANO, n, t0 + b * B, d * B * 1.1, vel=vel, bus='right')


bar = 4 * B
t = .1
for ch in ['Am', 'F', 'C', 'G', 'Am']:                         # ① 很稀：一拍一个音
    if t >= P2 - .2: break
    broken(ch, t, min(t + bar, P2), 1, .15); t += bar
t = P2
for ch in ['F', 'G', 'Em', 'Am']:                              # ② 亮一点：半拍一个音
    if t >= P3 - .2: break
    broken(ch, t, min(t + bar * .75, P3), .5, .15); t += bar * .75
t = P3
for ch in ['C', 'G', 'Am', 'F']:                               # ③ 带旋律，往上走
    if t >= TOTAL - 3: break
    broken(ch, t, min(t + bar * .75, TOTAL - 3), .5, .16); t += bar * .75
mel([('E5', 0, 1), ('G5', 1, 1), ('C6', 2, 2), ('B5', 4, 1), ('G5', 5, 1), ('A5', 6, 2), ('G5', 8, 1), ('E5', 9, 1), ('F5', 10, 2)], P3 + .1, .17)
end = L[-1][1] + .1                                            # 最后一句说完：落在 C 上
for j, n in enumerate(['C3', 'G3', 'E4', 'G4', 'C5', 'E5']): song.add(PIANO, n, end + j * .08, 4.0, vel=.2, bus='left')
song.add(VIOLIN, 'E4', end, 3.5, vel=.14, bus='str', attack=1.0)
song.render(os.path.join(HERE, 'bgm.wav'), lufs=-21.0, fade_out=1.5)
print(f'wrote {os.path.join(HERE, "bgm.wav")} ({TOTAL:.2f} s; parts at 0 / {P2:.1f} / {P3:.1f} s)')
