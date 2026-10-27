"""No.54《把自己捡回来》 — 配乐：很轻的钢琴（跑步那段加一点弦乐），C 大调 / A 小调，75 BPM（一拍 0.8 秒）。

    python3 music.py        -> bgm.wav（和正片一样长）

配乐不要沉重（频道主要求）：音量放低（−21 LUFS），高音区为主；“深夜”那段不放音乐，只有钟声。
  - 路口：A 小调，Am – F – C – G，很稀的分解和弦。
  - 一天（快切）：每切一个镜头弹一个短音（跟剪辑对上），快放那一下连着弹；黑场时停。
  - 上学的时候：C 大调，暖一点；窗前的剪影：Am，更稀。
  - 身边的人：F – C – G – Am，带一条简单的旋律。
  - 深夜：没有音乐；台灯亮了，弹一个 C 大调的和弦；“那个东西是——”往上走三个音，黑场前停住。
  - 跑步：“跑步”一个明亮的 C 大调和弦；第 1、7、30 天节奏一天比一天密（C – G – Am – F）；停下来以后只留长音，然后安静。
  - 给你：C – G – Am – F，旋律往上走，最后的字卡落在 C 上。
"""
import json, os, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
B = 60.0 / TL['bpm']                                                       # 一拍 0.8 秒
SEC = dict((n, a * B) for n, a, b in TL['sections'])
L = TL['lines']
D = lambda i: L[i][0]
DE = lambda i: L[i][1]
TOTAL = TL['total']

CH = {  # 分解和弦（低 → 高）
    'Am': ['A2', 'E3', 'A3', 'C4', 'E4'], 'F': ['F2', 'C3', 'F3', 'A3', 'C4'], 'C': ['C3', 'G3', 'C4', 'E4', 'G4'],
    'G': ['G2', 'D3', 'G3', 'B3', 'D4'], 'Cadd9': ['C3', 'G3', 'D4', 'E4', 'G4'], 'G/B': ['B2', 'D3', 'G3', 'B3', 'D4'],
}
song = Song(seconds=TOTAL, tail=4.0)
song.bus('left', gain=.7, reverb=.42); song.bus('right', gain=1.0, reverb=.48); song.bus('str', gain=.55, reverb=.55)


def broken(ch, t0, beats, vel=.2, step=.5, pat=(0, 1, 2, 3, 4, 3, 2, 1), dur=1.6):
    """分解和弦：每 step 拍一个音，按 pat 的顺序"""
    notes = CH[ch]; n = int(round(beats / step))
    for j in range(n):
        song.add(PIANO, notes[pat[j % len(pat)]], t0 + j * step * B, B * dur, vel=vel * (1.12 if j % 4 == 0 else 1), bus='left')


def mel(notes, t0, vel=.3):
    """旋律：[(音, 第几拍, 几拍)]"""
    for n, b, d in notes: song.add(PIANO, n, t0 + b * B, d * B * 1.1, vel=vel, bus='right')


def roll(notes, t0, dur, vel=.28, gap=.07, bus='left'):
    for j, n in enumerate(notes): song.add(PIANO, n, t0 + j * gap, dur, vel=vel, bus=bus)


# ① 路口：从第一句开始，Am – F – C – G，很稀
t = 0.0
for ch, beats in [('Am', 8), ('F', 8), ('C', 4), ('G', 2)]:
    broken(ch, t + .2 * B * (t == 0), beats, vel=.16, step=1, pat=(0, 2, 3, 4, 3, 2))
    t += beats * B
mel([('E5', 2, 2), ('D5', 4, 1), ('C5', 5, 3)], 0, vel=.18)                 # 很轻的一句
mel([('C5', 10, 2), ('A4', 12, 1), ('G4', 13, 3)], 0, vel=.16)

# ② 一天：每切一个镜头弹一个短音（跟剪辑对上）；快放那一下连着弹；黑场时停
cuts = [SEC['一天'], D(9) - .05, D(10) - .05, D(11) - .05, D(12) - .05, D(13) - .05, D(14) - .05, D(15) - .05, D(16) - .1]
for tc, n in zip(cuts, ['A4', 'A4', 'C5', 'A4', 'E4', 'E4', 'G4', 'E4', 'A3']):
    song.add(PIANO, n, tc, .35, vel=.3, bus='right'); song.add(PIANO, n.replace('4', '3').replace('5', '4'), tc, .35, vel=.18, bus='left')
replay0 = D(16) + .95
for k, n in enumerate(['A4', 'A4', 'C5', 'A4', 'E4', 'E4']):
    song.add(PIANO, n, replay0 + k * .22, .2, vel=.3 + .03 * k, bus='right')

# ③ 上学的时候：C 大调，暖一点；窗前的剪影：Am，更稀
s = SEC['以前']
broken('Cadd9', s + .3, 4, vel=.2, step=.5); broken('G/B', s + .3 + 4 * B, 3, vel=.18, step=.5)
mel([('E5', 1, 1.5), ('D5', 2.5, .5), ('C5', 3, 1), ('D5', 4, 3)], s + .3, vel=.26)
s = SEC['办公室']
for j, n in enumerate(['A2', 'E3', 'B3', 'C4', 'E4', 'C4', 'B3', 'E3']):
    song.add(PIANO, n, s + .6 + j * B, B * 2.5, vel=.15, bus='left')

# ④ 身边的人：F – C – G – Am，带一条简单的旋律
s = SEC['身边']
for i, ch in enumerate(['F', 'C', 'G', 'Am']):
    broken(ch, s + i * 4 * B, 4, vel=.17, step=.5)
mel([('C5', 0, 1), ('A4', 1, 1), ('C5', 2, 2), ('G4', 4, 1), ('E4', 5, 1), ('G4', 6, 2), ('D5', 8, 1), ('B4', 9, 1), ('G4', 10, 2), ('A4', 12, 4)], s, vel=.2)
song.add(PIANO, 'A2', s + 16 * B, 2.5, vel=.14, bus='left')

# ⑤ 深夜：不放音乐；台灯亮了，一个 C 大调的和弦；“那个东西是——”往上走三个音，黑场前停住
lamp = D(31) + .55
roll(['C3', 'G3', 'D4', 'E4', 'G4', 'C5'], lamp, 4.0, vel=.24)
s = D(32)
for j, n in enumerate(['G4', 'A4', 'B4']):
    song.add(PIANO, n, s + .3 + j * .62, .8, vel=.24 + .04 * j, bus='right')
song.add(VIOLIN, 'G4', s, DE(32) - s - .1, vel=.28, bus='str', attack=1.4, release=.15)

# ⑥ 跑步：“跑步”一个明亮的大和弦；第 1、7、30 天节奏一天比一天密；停下来只留长音
s = D(33) + .02
roll(['C2', 'C3', 'G3', 'E4', 'G4', 'C5', 'E5'], s, 3.2, vel=.36, gap=.03)
for n in ['C3', 'G3', 'E4']: song.add(VIOLIN if n == 'E4' else CELLO, n, s, 2.6, vel=.3, bus='str', attack=.08)
run0, d7, d30, stop = D(34) - .05, D(36) - .05, D(37) - .05, D(38) - .05
bar = 4 * B
prog_ = ['C', 'G', 'Am', 'F', 'C']
for i in range(5):
    t0 = run0 + i * bar
    if t0 >= stop: break
    ch = prog_[i]; notes = CH[ch]
    t = t0
    while t < min(t0 + bar, stop) - .05:
        k = round((t - t0) / (B / 2))
        dense = 2 if t >= d30 else 1 if t >= d7 else 0                               # 第 1 天一拍一个；第 7 天半拍一个；第 30 天再加旋律和弦乐
        if dense or k % 2 == 0:
            song.add(PIANO, notes[[2, 3, 4, 3][k % 4]], t, B * .45, vel=.2 + .04 * dense, bus='left')
        if k % 4 == 0: song.add(PIANO, notes[0], t, B * 1.8, vel=.18 + .03 * dense, bus='left')
        t += B / 2
    if t0 + bar > d30 - .1:
        song.add(VIOLIN, {'C': 'E4', 'G': 'D4', 'Am': 'C4', 'F': 'C4'}[ch], max(t0, d30), min(t0 + bar, stop) - max(t0, d30), vel=.22, bus='str', attack=.4)
mel([('E5', 0, 1), ('G5', 1, 1), ('C6', 2, 2)], d30 + .1, vel=.26)                  # 第 30 天：往上走
song.add(PIANO, 'C5', stop, .5, vel=.2, bus='right')
roll(['F2', 'C3', 'A3', 'C4', 'F4'], stop + .1, 3.4, vel=.2)                             # 停下来：只留长音
song.add(CELLO, 'F2', stop + .1, 3.0, vel=.2, bus='str', attack=.6)
roll(['G2', 'D3', 'B3', 'D4', 'G4'], D(39) - .1, 3.6, vel=.18)
roll(['C3', 'G3', 'E4', 'G4', 'C5'], DE(39) - .3, 3.5, vel=.18)                          # 落在 C 上，然后安静

# ⑦ 给你：C – G – Am – F，旋律往上走，最后的字卡落在 C 上
s = SEC['给你'] + .4
cards = DE(len(L) - 1) + .8
seq = ['C', 'G', 'Am', 'F', 'C', 'G', 'Am', 'F']
for i, ch in enumerate(seq):
    t0 = s + i * bar
    if t0 > cards - .4: break
    broken(ch, t0, min(4, (cards - t0) / B), vel=.17, step=.5)
mel([('E5', 0, 1.5), ('D5', 1.5, .5), ('C5', 2, 2), ('D5', 4, 1.5), ('B4', 5.5, .5), ('G4', 6, 2),
     ('C5', 8, 1.5), ('B4', 9.5, .5), ('A4', 10, 2), ('F4', 12, 1), ('A4', 13, 1), ('C5', 14, 2),
     ('E5', 16, 1.5), ('D5', 17.5, .5), ('C5', 18, 2), ('D5', 20, 1.5), ('G5', 21.5, .5), ('G5', 22, 2),
     ('E5', 24, 1.5), ('D5', 25.5, .5), ('C5', 26, 2), ('A4', 28, 1), ('C5', 29, 1), ('D5', 30, 2)], s, vel=.22)
roll(['C2', 'C3', 'G3', 'E4', 'G4', 'C5', 'E5'], cards, 7.0, vel=.26, gap=.09)          # 字卡：落在 C 上
song.add(VIOLIN, 'E4', cards, 6.0, vel=.16, bus='str', attack=1.2)
song.render(os.path.join(HERE, 'bgm.wav'), lufs=-21.0, fade_out=2.0)
print(f'wrote {os.path.join(HERE, "bgm.wav")} ({TOTAL:.2f} s; running from {run0:.1f} s, cards {cards:.1f} s)')
