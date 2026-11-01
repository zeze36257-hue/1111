"""读文案 01 — 背景音乐：频道主选的 TRA$H《Memories》（他从抖音发来的 30 秒，存在 ../music/memories_trash_30s.m4a）。

    python3 music.py        -> bgm.wav（和正片一样长）

30 秒不够长时往后接：这首歌每 6.4 秒重复一个乐句（量过，前后相差 6.4 秒的和声几乎一样），
所以在快放完的地方跳回早 6.4 秒（或它的倍数）的同一个位置接着放，中间 0.3 秒交叉淡化，听不出接口。
音量交给 tools/cine/audio.py：有配音时自动压低。
"""
import json, os, subprocess
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'music', 'memories_trash_30s.m4a')
SR, PHRASE, XF = 48000, 6.4, .3
TOTAL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))['total']

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
need = int((TOTAL + 1) * SR)
out = x.copy()
while len(out) < need:                                     # 输出的结尾总是原曲的结尾：在倒数第 4 秒，跳回早两个乐句（12.8 秒）的同一个位置
    cut = len(out) - int(4 * SR)
    src = len(x) - int(4 * SR) - int(2 * PHRASE * SR)
    n = int(XF * SR); fo = np.cos(np.linspace(0, np.pi / 2, n))[:, None]; fi = np.sin(np.linspace(0, np.pi / 2, n))[:, None]
    out = np.concatenate([out[:cut], out[cut:cut + n] * fo + x[src:src + n] * fi, x[src + n:]])
out = out[:need]
out *= 10 ** (-23 / 20) / (np.sqrt((out ** 2).mean()) + 1e-9)   # 整首的响度定在 -23 dB（RMS），跟原来的配乐差不多
import wave
with wave.open(os.path.join(HERE, 'bgm.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
print(f'wrote bgm.wav ({len(out) / SR:.1f} s from a {len(x) / SR:.1f} s clip)')
