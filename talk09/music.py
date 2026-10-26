"""No.52《电梯里遇到领导》 — 配乐：只有电梯里那段“电梯音乐”。

    python3 music.py        -> bgm.wav（和正片一样长）

电梯厅不放音乐，只有环境声。门一关，天花板喇叭里放着一段很轻、有点土的爵士小曲（F 大调，Fmaj7 – Dm7 – Gm7 – C7 一直循环），
声音做窄、做闷（只留 280–2800 Hz），像从电梯喇叭里出来的，越尬越显得欢快。
领导说“下午开会你来讲讲”那一下，音乐突然停掉，只剩电梯的嗡嗡声；领导出了电梯，音乐才又接上，一直放到结尾。
"""
import json, os, subprocess, sys, wave
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools', 'cine'))
from sampler import *  # noqa: F401,F403

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))
B = 60.0 / TL['bpm']                                                       # 一拍 0.8 秒；伴奏按八分音符（0.4 秒）走
SEC = dict((n, a * B) for n, a, b in TL['sections'])
LINES = TL['lines']
T0 = SEC['电梯里'] + .7                                                     # 门关上之后
CUT0, CUT1 = LINES[24][1] + .05, LINES[28][1] + 1.3                         # “下午开会你来讲讲”说完 → 停；领导出去了 → 接上

CHORDS = [  # 和弦、低音（第 1 拍根音、第 3 拍五音）、中音区的和弦音
    ('F2', 'C3', ['A3', 'C4', 'E4', 'G4']),       # Fmaj7
    ('D2', 'A2', ['F3', 'A3', 'C4', 'E4']),       # Dm7
    ('G2', 'D3', ['F3', 'Bb3', 'D4', 'F4']),      # Gm7
    ('C3', 'G2', ['E3', 'G3', 'Bb3', 'D4']),      # C7
]
MELODY = [  # 四小节一句：[(音, 第几拍, 几拍)]，两句：第二句结尾落回 F
    [('A4', 0, 1.5), ('G4', 1.5, .5), ('A4', 2, 1), ('C5', 3, 1)],
    [('F5', 0, 2), ('E5', 2, 1), ('D5', 3, 1)],
    [('D5', 0, 1.5), ('C5', 1.5, .5), ('Bb4', 2, 1), ('A4', 3, 1)],
    [('G4', 0, 3)],
    [('A4', 0, 1.5), ('G4', 1.5, .5), ('A4', 2, 1), ('C5', 3, 1)],
    [('F5', 0, 2), ('E5', 2, 1), ('D5', 3, 1)],
    [('D5', 0, 1.5), ('E5', 1.5, .5), ('F5', 2, 1), ('D5', 3, 1)],
    [('C5', 0, 1), ('A4', 1, 1), ('G4', 2, 2)],
]
song = Song(seconds=TL['total'], tail=4.0)
for name in ('comp', 'bass', 'lead'):
    song.bus(name, gain={'comp': .7, 'bass': .8, 'lead': .55}[name], reverb=.25, lowpass=2800, highpass=280)   # 天花板喇叭：又窄又闷
bar = 4 * B
n_bars = int((TL['total'] - T0) / bar) + 1
for i in range(n_bars):
    s = T0 + i * bar
    root, fifth, notes = CHORDS[i % 4]
    song.add(PIANO, root, s, B * 1.4, vel=.34, bus='bass'); song.add(PIANO, fifth, s + 2 * B, B * 1.4, vel=.3, bus='bass')
    for slot in (0, 3, 6):                                                 # 巴萨诺瓦式的切分：第 1 拍、第 2 拍后半、第 4 拍
        for n in notes: song.add(PIANO, n, s + slot * B / 2, B * .9, vel=.24 + .04 * (slot == 0), bus='comp')
    for n, b, d in MELODY[i % 8]:
        song.add(FLUTE, n, s + b * B, d * B * .95, vel=.32, bus='lead')
path = os.path.join(HERE, 'bgm.wav')
song.render(path, lufs=-24.0, fade_out=2.0)
# 突然停掉 / 再接上：直接在成品上乘一个音量包络（停得干脆，接回来时 0.3 秒淡入）
with wave.open(path, 'rb') as w:
    sr, ch = w.getframerate(), w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, ch).astype(np.float64)
t = np.arange(len(x)) / sr
env = np.clip(1 - np.clip((t - CUT0) / .04, 0, 1) + np.clip((t - CUT1) / .3, 0, 1), 0, 1)
x *= env[:, None]
with wave.open(path, 'wb') as w:
    w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(x, -32768, 32767).astype('<i2').tobytes())
print(f'wrote {path} ({TL["total"]:.2f} s; elevator music from {T0:.1f} s, cut {CUT0:.1f}–{CUT1:.1f} s)')
