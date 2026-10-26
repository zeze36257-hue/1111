"""No.51《今晚聚餐，你去不去？》 — 配乐：只有“到家”那一段有，一段很轻的钢琴（F 大调，75 BPM）。

    python3 music.py        -> bgm.wav（和正片一样长；前面三段是静音，只有环境声和音效）

频道主要的：配乐不要沉重，也可以不要。所以公司、火锅店、回家路上都不放音乐，只靠环境声（键盘、一桌人在聊、夜里的街）；
被问“周末干嘛”时全场安静，只剩蛐蛐叫。关上家门以后，钢琴才慢慢进来：
  F | Am7 | B♭maj7 | F | Gm7 | C | F（停住）
左手是慢慢的分解和弦，右手一条很简单的旋律，往上走一点又落回来，最后停在 F 上。
"""
import json, os, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
B = 60.0 / TL['bpm']                                                       # 一拍 0.8 秒
HOME = dict((n, a * B) for n, a, b in TL['sections'])['到家']               # “到家”那一段从这里开始（秒）
T0 = HOME + .6                                                             # 关门声之后再进来

# 每小节：和弦、左手一小节 8 个八分音符、右手旋律 [(音, 第几拍开始, 几拍)]
BARS = [
    ('F2 C3 A3 C3 F3 C3 A3 C3', [('A4', 0, 1), ('C5', 1, 1), ('F5', 2, 2)]),
    ('A2 E3 G3 E3 C4 E3 G3 E3', [('E5', 0, 2), ('D5', 2, 1), ('C5', 3, 1)]),
    ('Bb2 F3 A3 F3 D4 F3 A3 F3', [('D5', 0, 3), ('C5', 3, 1)]),
    ('F2 C3 A3 C3 F3 C3 A3 C3', [('A4', 0, 4)]),
    ('G2 D3 F3 D3 Bb3 D3 F3 D3', [('Bb4', 0, 1), ('D5', 1, 1), ('F5', 2, 2)]),
    ('C3 G3 C4 G3 E4 G3 C4 G3', [('E5', 0, 1), ('D5', 1, 1), ('C5', 2, 2)]),
]
song = Song(seconds=TL['total'], tail=4.0)
song.bus('left', gain=.75, reverb=.35)
song.bus('right', gain=1.0, reverb=.4)
for i, (lh, rh) in enumerate(BARS):
    s = T0 + i * 4 * B
    for j, n in enumerate(lh.split()):
        song.add(PIANO, n, s + j * B / 2, B * 1.6, vel=.26 + .06 * (j % 4 == 0), bus='left')
    for n, b, d in rh:
        song.add(PIANO, n, s + b * B, d * B * 1.1, vel=.42, bus='right')
end = T0 + len(BARS) * 4 * B                                               # 最后：F 和弦慢慢滚上去，停住
for j, n in enumerate(['F2', 'C3', 'A3', 'C4', 'F4', 'A4', 'C5', 'F5']):
    song.add(PIANO, n, end + j * .09, 6.0, vel=.3 if j < 5 else .36, bus='right' if j >= 5 else 'left')
song.render(os.path.join(HERE, 'bgm.wav'), lufs=-20.0, fade_out=1.5)
print(f'wrote {os.path.join(HERE, "bgm.wav")} ({TL["total"]:.2f} s; piano from {T0:.1f} s, last chord at {end:.1f} s)')
