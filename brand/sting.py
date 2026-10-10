"""黑猫不说话 · 片头 / 片尾提示音，和 index.html 的画面对齐。

    python sting.py         -> sting.wav（片头，1.8 秒）
    python sting.py outro   -> outro.wav（片尾，2.5 秒：片头倒过来，先青后橙，最后一声很轻的“咚”）

一声低沉的“咚”（黑暗里睁眼），两声铃音（橙色、青色两只眼睛），名字出现时一阵很轻的闪光声，眨眼时一下轻响。
每期都用同一个声音，作为频道的“声音标志”。
"""
import os, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

OUTRO = len(sys.argv) > 1 and sys.argv[1] == 'outro'
SR, DUR = 44100, (2.5 if OUTRO else 1.8)
N = int(SR * DUR)
rng = np.random.default_rng(7)
out = np.zeros((2, N))
t_all = np.arange(N) / SR


def put(sig, t0, gain, pan=0.0):
    i = int(t0 * SR); n = min(len(sig), N - i)
    a = (pan + 1) * np.pi / 4
    out[0, i:i + n] += sig[:n] * np.cos(a) * gain
    out[1, i:i + n] += sig[:n] * np.sin(a) * gain


def tv(d): return np.arange(int(d * SR)) / SR


def bell(f, d=1.6):
    t = tv(d)
    mod = 1.4 * np.exp(-t * 3) * np.sin(2 * np.pi * f * 3.5 * t)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.6) * np.clip(t / .004, 0, 1)


t = tv(1.6)
bong = (np.sin(2 * np.pi * 65.4 * t) + .5 * np.sin(2 * np.pi * 130.8 * t) + .2 * np.sin(2 * np.pi * 196.2 * t)) * np.exp(-t * 2.4) * np.clip(t / .02, 0, 1)
if not OUTRO:                                                 # 片头：咚 → 橙 → 青 → 闪光 → 眨眼
    put(bong, .02, .55)
    put(bell(783.99), .10, .22, -.35)                         # G5：橙色的眼睛
    put(bell(1174.66), .26, .18, .35)                         # D6：青色的眼睛
    sh = rng.standard_normal(int(.5 * SR))                    # 名字出现时的闪光声
    sh = sosfilt(butter(2, 4000, 'high', fs=SR, output='sos'), sh) * np.sin(np.pi * np.arange(len(sh)) / len(sh)) ** 2
    put(sh, .5, .035)
    tk = tv(.05)                                              # 眨眼
    put(np.sin(2 * np.pi * 2400 * tk) * np.exp(-tk * 120), .98, .06)
else:                                                         # 片尾：倒过来，青 → 橙 → 很轻的咚（闭眼）
    put(bell(1174.66), .25, .16, .35)
    put(bell(783.99), .45, .2, -.35)
    put(bong, 1.7, .3)

ir_t = tv(1.4)                                                # 一点混响
ir = rng.standard_normal((2, len(ir_t))) * np.exp(-ir_t * 4)
ir /= np.abs(ir).sum(axis=1, keepdims=True) ** .5 * 8
wet = np.stack([fftconvolve(out[i], ir[i])[:N] for i in range(2)])
mix = out * .75 + wet * .35
mix *= np.clip((DUR - t_all) / .25, 0, 1)                     # 最后 0.25 秒收掉
mix *= 10 ** (-4 / 20) / np.max(np.abs(mix))                  # 峰值 -4 dBFS，和正片音乐的响度接得上
pcm = (mix.T * 32767).astype('<i2')
with wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'outro.wav' if OUTRO else 'sting.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('wrote', 'outro.wav' if OUTRO else 'sting.wav')
