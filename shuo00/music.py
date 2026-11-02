"""《她说·她想》样片的背景音乐：只是给频道主看样子时垫一下。正式发布时成片不带音乐，他在抖音曲库里加。
用 TRA$H《Memories》完整版（../music/memories_trash.m4a），从头放，结尾淡出交给 audio.py。
"""
import json, os, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'music', 'memories_trash.m4a')
SR = 48000
TOTAL = json.load(open(os.path.join(HERE, 'timeline.json'), encoding='utf-8'))['total']
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
out = x[:int((TOTAL + 1) * SR)].copy()
out *= 10 ** (-23 / 20) / (np.sqrt((out ** 2).mean()) + 1e-9)
with wave.open(os.path.join(HERE, 'bgm.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
print(f'wrote bgm.wav ({len(out) / SR:.1f} s)')
