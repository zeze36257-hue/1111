"""No.55《购物车里的游戏机》 — 配乐：很轻的钢琴，G 大调，75 BPM（一拍 0.8 秒）。

    python3 music.py        -> bgm.wav（和正片一样长）

学参考视频的配乐：很轻的钢琴，一个高音（D6）一直轻轻地重复，下面是柔和的和弦；有台词时让开，只有没台词的地方让音乐出来；
结尾换一段更亮、带旋律的。配乐不要沉重（频道主要求）：音量放低（−21 LUFS）。
  - 便利店：G – D/F#，D6 一拍一下。
  - 发工资那天：Em – C – G – D，很稀；他给妈妈下单那段没台词，旋律出来一点。
  - 几天后：G – C – G – D，暖一点；他撒了个小谎，收住。
  - 办公室：G – Em – C – D，半拍一个音，热闹一点；看账单时只剩一个高音。
  - 三年后：一个 Em9 和弦，很稀。
  - 她的生日：C – G/B – Am – D，暖，带一点旋律。
  - 他生日前一周：G – Em – C – D，每个和弦两小节，D6 两拍一下；“五年了吧”以后只剩高音；“为什么……”停。
  - 回忆快闪：弦乐的长音慢慢起来；最后彩色的购物车出来时，一个亮的 G 大调和弦。
  - 说出口：Em – C，很稀；“不配”之后安静。
  - 她：C – G/B – Am7 – D，暖；“我看着”以后弦乐悬着（Dsus4），他按下去的那一下落到 G。
  - 他生日那天：G – D – Em – C，亮一点，带旋律；最后的字卡落在 G 上。
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
M0 = DE(30) + .17                                                          # 回忆快闪（跟 scenes.js 一样）
PAY = DE(35) + .16                                                         # 付款的插入镜头
PRESS = PAY + 1.62                                                         # 按下“立即支付”
CARDS = DE(len(L) - 1) + 1.2

CH = {  # 分解和弦（低 → 高）
    'G': ['G2', 'D3', 'G3', 'B3', 'D4'], 'D/F#': ['F#2', 'D3', 'A3', 'D4', 'F#4'], 'Em': ['E2', 'B2', 'G3', 'B3', 'E4'],
    'C': ['C3', 'G3', 'C4', 'E4', 'G4'], 'D': ['D3', 'A3', 'D4', 'F#4', 'A4'], 'G/B': ['B2', 'D3', 'G3', 'B3', 'D4'],
    'Am': ['A2', 'E3', 'A3', 'C4', 'E4'], 'Am7': ['A2', 'E3', 'G3', 'C4', 'E4'], 'Em9': ['E2', 'B2', 'F#3', 'G3', 'D4'],
}
song = Song(seconds=TOTAL, tail=4.0)
song.bus('left', gain=.7, reverb=.42); song.bus('right', gain=1.0, reverb=.5); song.bus('str', gain=.5, reverb=.55)


def broken(ch, t0, beats, vel=.18, step=1, pat=(0, 2, 3, 4, 3, 2), dur=1.8, end=None):
    """分解和弦：每 step 拍一个音，按 pat 的顺序；end 之后不弹"""
    notes = CH[ch]; n = int(round(beats / step))
    for j in range(n):
        t = t0 + j * step * B
        if end is not None and t > end - .1: break
        song.add(PIANO, notes[pat[j % len(pat)]], t, B * dur, vel=vel * (1.12 if j % 4 == 0 else 1), bus='left')


def mel(notes, t0, vel=.24, end=None):
    """旋律：[(音, 第几拍, 几拍)]"""
    for n, b, d in notes:
        if end is not None and t0 + b * B > end - .1: break
        song.add(PIANO, n, t0 + b * B, d * B * 1.1, vel=vel, bus='right')


def bell(t0, t1, every=1, vel=.11, note='D6'):
    """那个一直轻轻重复的高音"""
    t = t0
    while t < t1 - .05:
        song.add(PIANO, note, t, B * 1.2, vel=vel, bus='right'); t += every * B


def roll(notes, t0, dur, vel=.24, gap=.07, bus='left'):
    for j, n in enumerate(notes): song.add(PIANO, n, t0 + j * gap, dur, vel=vel, bus=bus)


def chords(seq, t0, end, beats=4, vel=.16, step=1):
    t = t0
    for ch in seq:
        if t > end - .3: break
        broken(ch, t, beats, vel=vel, step=step, end=end); t += beats * B
    return t


# ① 便利店
s, e = .2, SEC['回家'] - .4
chords(['G', 'D/F#', 'G'], s, e, vel=.15)
bell(s, e, 1, vel=.1)

# ② 发工资那天：很稀；给妈妈下单那段（没台词）旋律出来一点
s, e = SEC['回家'] + .3, SEC['几天后'] - .4
chords(['Em', 'C', 'G', 'D', 'Em', 'C', 'G'], s, e, vel=.14)
bell(DE(6) + .1, e, 2, vel=.09)
mel([('B4', 0, 1), ('A4', 1, 1), ('G4', 2, 2), ('D5', 4, 1.5), ('B4', 5.5, 1.5)], DE(6) + .15, vel=.2)

# ③ 几天后：暖一点；“同学换下来的”收住
s, e = SEC['几天后'] + .3, D(10) + .2
chords(['G', 'C', 'G', 'D'], s, e, vel=.15)
roll(['C3', 'G3', 'E4'], DE(10) + .1, 2.6, vel=.13)

# ④ 办公室：半拍一个音，热闹一点；看账单时只剩一个高音
s = SEC['办公室'] + .2; e = DE(13) + .2
chords(['G', 'Em', 'C', 'D', 'G'], s, e, vel=.15, step=.5, beats=4)
bell(DE(13) + .3, SEC['三年后'] - .5, 2, vel=.1)
song.add(CELLO, 'E2', D(14) - .2, 4.0, vel=.18, bus='str', attack=.8)

# ⑤ 三年后：一个 Em9 和弦，很稀
s = SEC['三年后'] + .3
roll(CH['Em9'], s, 5.0, vel=.15, gap=.14)
roll(['C3', 'G3', 'D4', 'E4'], D(16) - .1, 3.5, vel=.13, gap=.12)
song.add(PIANO, 'D6', D(16) + 1.0, 1.4, vel=.1, bus='right')

# ⑥ 她的生日：C – G/B – Am – D，暖，带一点旋律
s, e = SEC['她的生日'] + .2, SEC['他的生日'] - .4
chords(['C', 'G/B', 'Am', 'D'], s, e, vel=.16)
mel([('E5', 0, 1.5), ('D5', 1.5, .5), ('C5', 2, 2), ('D5', 4, 1.5), ('B4', 5.5, .5), ('G4', 6, 2),
     ('C5', 8, 1.5), ('B4', 9.5, .5), ('A4', 10, 2)], s, vel=.17, end=D(20))
song.add(PIANO, 'C#5', D(20) + .2, 1.2, vel=.1, bus='right')                         # “也就三个月的饭钱”：一个有点别扭的音

# ⑦ 他生日前一周：每个和弦两小节，D6 两拍一下；“五年了吧”以后只剩高音；“为什么……”停
s, e = SEC['他的生日'] + .3, D(28) - .2
chords(['G', 'G', 'Em', 'Em', 'C', 'C', 'D', 'D'], s, e, vel=.13, step=2, beats=4)
bell(s, D(30) - .3, 2, vel=.09)
song.add(CELLO, 'G2', D(25) - .3, DE(25) - D(25) + 1.5, vel=.16, bus='str', attack=1.0)   # 她心里想：低音的弦乐托一下

# 回忆快闪：弦乐的长音慢慢起来；彩色的购物车出来时，一个亮的 G 大调和弦
for n in ['E3', 'B3', 'G4']:
    song.add(STRINGS_MID if n != 'G4' else STRINGS_HI, n, M0, 3.4, vel=.22, bus='str', attack=2.6, release=.3)
roll(['G3', 'D4', 'G4', 'B4', 'D5', 'G5'], M0 + 3.45, 3.0, vel=.2, gap=.05)
song.add(PIANO, 'D6', M0 + 3.5, 2.0, vel=.14, bus='right')

# ⑧ 说出口：Em – C，很稀；“不配”之后安静
s = M0 + 5.4
for k, (ch, beats) in enumerate([('Em', 4), ('C', 4), ('Em', 4)]):
    roll(CH[ch][:4], s, B * beats, vel=.12, gap=.1); s += beats * B
song.add(CELLO, 'E2', D(33), DE(33) - D(33) - .3, vel=.14, bus='str', attack=1.2)

# ⑨ 她：C – G/B – Am7 – D，暖；“我看着”以后弦乐悬着（Dsus4），按下去的那一下落到 G
s, e = D(34) - .1, PAY
chords(['C', 'G/B', 'Am7', 'D'], s, e, vel=.15)
mel([('E5', 2, 2), ('D5', 4, 1), ('B4', 5, 1), ('C5', 6, 2), ('A4', 8, 2)], s, vel=.15, end=PAY)
for sec, n in [(STRINGS_MID, 'D3'), (STRINGS_MID, 'G3'), (STRINGS_HI, 'A3'), (STRINGS_HI, 'D4')]: song.add(sec, n, PAY - .2, PRESS - PAY + .4, vel=.18, bus='str', attack=1.0, release=.5)
roll(['G2', 'D3', 'G3', 'B3', 'D4', 'G4', 'B4'], PRESS + .1, 3.5, vel=.22, gap=.05)
song.add(PIANO, 'D6', PRESS + .2, 1.6, vel=.13, bus='right')
s = PRESS + 1.3
chords(['G', 'D/F#', 'Em', 'C'], s, SEC['生日那天'] - .4, vel=.15)
mel([('B4', 0, 1), ('D5', 1, 1), ('G5', 2, 2), ('F#5', 4, 1), ('E5', 5, 1), ('D5', 6, 2), ('B4', 8, 1.5), ('C5', 9.5, .5), ('D5', 10, 2)],
    s, vel=.17, end=SEC['生日那天'] - .4)

# ⑩ 他生日那天：亮一点，带旋律（短一点的音，轻快）；最后的字卡落在 G 上
s = SEC['生日那天'] + .3
chords(['G', 'D', 'Em', 'C'], s, CARDS - .2, vel=.15, step=.5)
mel([('D5', 0, .5), ('G5', .5, .5), ('B5', 1, 1), ('A5', 2, .5), ('G5', 2.5, .5), ('E5', 3, 1),
     ('D5', 4, .5), ('F#5', 4.5, .5), ('A5', 5, 1), ('G5', 6, 2),
     ('E5', 8, .5), ('G5', 8.5, .5), ('B5', 9, 1), ('C6', 10, 1), ('B5', 11, 1)], s, vel=.17, end=CARDS - .2)
roll(['G2', 'D3', 'G3', 'B3', 'D4', 'G4', 'B4', 'D5'], CARDS, 6.5, vel=.22, gap=.08)
song.add(VIOLIN, 'B4', CARDS, 6.0, vel=.15, bus='str', attack=1.2)
song.add(PIANO, 'D6', CARDS + .8, 2.5, vel=.12, bus='right')
song.render(os.path.join(HERE, 'bgm.wav'), lufs=-21.0, fade_out=2.0)
print(f'wrote {os.path.join(HERE, "bgm.wav")} ({TOTAL:.2f} s; montage {M0:.1f} s, press {PRESS:.1f} s, cards {CARDS:.1f} s)')
