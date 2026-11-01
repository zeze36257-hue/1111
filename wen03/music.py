"""读文案第二期 — 背景音乐：TRA$H《Memories》完整版（频道主 11 月 1 日发来的，存在 ../music/memories_trash.m4a）。

    python3 music.py        -> bgm.wav（和正片一样长）

完整版有 152 秒，读文案视频只有半分钟左右，所以直接从歌的开头放，不用再接；结尾的淡出交给 tools/cine/audio.py（meta.json 的 fadeOut）。
音量也交给 audio.py：有配音时自动压低。
"""
import json, os, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'music', 'memories_trash.m4a')
SR = 48000
TOTAL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))['total']

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
need = int((TOTAL + 1) * SR)
assert len(x) >= need, '视频比歌还长：要照 wen01/music.py 那样往后接'
out = x[:need].copy()
out *= 10 ** (-23 / 20) / (np.sqrt((out ** 2).mean()) + 1e-9)   # 整首的响度定在 -23 dB（RMS），跟 wen01 一样
with wave.open(os.path.join(HERE, 'bgm.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
print(f'wrote bgm.wav ({len(out) / SR:.1f} s from the full {len(x) / SR:.1f} s track)')
