"""No.53《很久没联系的老朋友》 — 配乐：很轻的钢琴，只在两处出现。

    python3 music.py        -> bgm.wav（和正片一样长）

深夜那两段只有屋里的安静和钟声（不放音乐）。
  - 回忆（六年前的篮球场）：一段很轻的钢琴，D 大调，D – Bm – G – A，左手慢慢的分解和弦，右手一条简单的旋律；黑场时淡出。
  - 阿杰发来“在吗？”以后：同一段旋律再响起来，最后落在 D 上，一直到字卡。
配乐不要沉重（频道主要求）：音量放低（−21 LUFS），只用钢琴。
"""
import json, os, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
B = 60.0 / TL['bpm']                                                       # 一拍 0.8 秒
SEC = dict((n, a * B) for n, a, b in TL['sections'])
LINES = TL['lines']

LH = {'D': 'D2 A2 D3 F#3 A3 F#3 D3 A2', 'Bm': 'B1 F#2 B2 D3 F#3 D3 B2 F#2', 'G': 'G1 D2 G2 B2 D3 B2 G2 D2', 'A': 'A1 E2 A2 C#3 E3 C#3 A2 E2'}
TUNE = [  # [和弦, 右手旋律 [(音, 第几拍, 几拍)]]：前四小节一句，后四小节一句
    ('D', [('F#4', 0, 1), ('A4', 1, 1), ('D5', 2, 2)]),
    ('Bm', [('C#5', 0, 1), ('B4', 1, 1), ('F#4', 2, 2)]),
    ('G', [('G4', 0, 1), ('B4', 1, 1), ('D5', 2, 1), ('E5', 3, 1)]),
    ('A', [('C#5', 0, 3), ('A4', 3, 1)]),
    ('D', [('F#5', 0, 2), ('E5', 2, 1), ('D5', 3, 1)]),
    ('Bm', [('D5', 0, 1), ('C#5', 1, 1), ('B4', 2, 2)]),
    ('G', [('B4', 0, 1), ('A4', 1, 1), ('G4', 2, 1), ('B4', 3, 1)]),
    ('A', [('A4', 0, 2), ('C#5', 2, 2)]),
]
song = Song(seconds=TL['total'], tail=4.0)
song.bus('left', gain=.7, reverb=.4); song.bus('right', gain=1.0, reverb=.45)

def play(t0, bars, fade_in=0.0):
    for i, (ch, mel) in enumerate(bars):
        s = t0 + i * 4 * B; v = min(1.0, (i + 1) / max(1, fade_in))
        for j, n in enumerate(LH[ch].split()): song.add(PIANO, n, s + j * B / 2, B * 1.6, vel=(.22 + .05 * (j % 4 == 0)) * (.7 + .3 * v), bus='left')
        for n, b, d in mel: song.add(PIANO, n, s + b * B, d * B * 1.15, vel=.38 * (.75 + .25 * v), bus='right')
    return t0 + len(bars) * 4 * B

# 回忆：从篮球场亮起来开始，七个小节，黑场前停
flash0 = SEC['六年前'] + 1.0
play(flash0, TUNE[:7], fade_in=2)
# 阿杰发来“在吗？”：同一段旋律再来一遍，最后落在 D 上（字卡出来时）
now0 = LINES[16][0] + .3
end = play(now0, TUNE, fade_in=2)
for j, n in enumerate(['D2', 'A2', 'D3', 'F#3', 'A3', 'D4', 'F#4', 'A4', 'D5']):
    song.add(PIANO, n, end + j * .1, 7.0, vel=.3 if j < 6 else .36, bus='left' if j < 6 else 'right')
song.render(os.path.join(HERE, 'bgm.wav'), lufs=-21.0, fade_out=2.0)
# 回忆那段在黑场里淡掉（不拖进“现在”）
import wave, numpy as np
path = os.path.join(HERE, 'bgm.wav')
with wave.open(path, 'rb') as w:
    sr, ch = w.getframerate(), w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, ch).astype(np.float64)
t = np.arange(len(x)) / sr; s2 = SEC['现在']
env = np.where((t > s2 - 1.6) & (t < now0 - .2), np.clip(1 - (t - (s2 - 1.6)) / 1.4, 0, 1), 1.0)
x *= env[:, None]
with wave.open(path, 'wb') as w:
    w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(x, -32768, 32767).astype('<i2').tobytes())
print(f'wrote {path} ({TL["total"]:.2f} s; flashback piano from {flash0:.1f} s, again from {now0:.1f} s, last chord {end:.1f} s)')
