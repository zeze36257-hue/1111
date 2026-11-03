"""把一段手机录的人声修干净：降噪 → 去掉发闷的低频、提亮一点 → 压一下忽大忽小 → 响度拉到 -16 LUFS。

    python3 tools/voice/clean.py 录音.m4a 输出.wav

- 要先 pip install noisereduce（numpy、scipy 已经有）。
- 降噪用 noisereduce：拿最安静的 8% 当噪声样本，按固定噪声去掉 90%。
  - 试过 ffmpeg 的 arnndn（RNNoise），会把 2 kHz 以上削掉一截，声音更闷，不用。
- EQ 是按频道主 11 月 3 日那段录音调的（低频偏重、发闷）：150 Hz、350 Hz 各减 3 dB 多，3.2 kHz 加 3 dB，7.5 kHz 以上加 2 dB。
  换了人、换了地方录，先用 tools/voice/analyze.py 看看频谱再改。
"""
import json, os, subprocess, sys, tempfile
import numpy as np
import scipy.io.wavfile as wf
import noisereduce as nrd

src, dst = sys.argv[1], sys.argv[2]
tmp = tempfile.mkdtemp()
mono = os.path.join(tmp, 'mono.wav'); den = os.path.join(tmp, 'den.wav'); pre = os.path.join(tmp, 'pre.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', mono], check=True)

sr, x = wf.read(mono); x = x.astype(np.float32) / 32768
hop, win = sr // 100, sr // 50
fr = np.lib.stride_tricks.sliding_window_view(x, win)[::hop]
db = 10 * np.log10((fr ** 2).mean(1) + 1e-12)
noise = np.concatenate([x[i * hop:i * hop + hop] for i in np.where(db < np.percentile(db, 8))[0]])
y = nrd.reduce_noise(y=x, sr=sr, y_noise=noise, stationary=True, prop_decrease=0.9, n_fft=2048)
wf.write(den, sr, (np.clip(y, -1, 1) * 32767).astype(np.int16))

CHAIN = ('highpass=f=70:p=2,equalizer=f=150:t=q:w=1:g=-3,equalizer=f=350:t=q:w=1.2:g=-3.5,'
         'equalizer=f=3200:t=q:w=1.2:g=3,highshelf=f=7500:g=2,deesser=i=0.3,'
         'acompressor=threshold=-26dB:ratio=3:attack=8:release=160:makeup=2')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', den, '-af', CHAIN, pre], check=True)

# 响度两遍法：先量，再按量出来的数拉到 -16 LUFS
s = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', pre, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json',
                    '-f', 'null', '-'], capture_output=True, text=True).stderr
m = json.loads(s[s.rindex('{'):s.rindex('}') + 1])
ln = (f"loudnorm=I=-16:TP=-1.5:LRA=9:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
      f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', ln, '-c:a', 'pcm_s16le', dst], check=True)
print('->', dst)
