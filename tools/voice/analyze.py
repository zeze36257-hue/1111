"""看一段人声录音的“硬指标”：音量、底噪、频谱、回声、音高起伏、语速、停顿。
    python3 analyze.py raw.wav [字数]
"""
import sys
import numpy as np
import scipy.io.wavfile as wf
import scipy.signal as ss

path = sys.argv[1]
nchar = int(sys.argv[2]) if len(sys.argv) > 2 else 0
sr, x = wf.read(path)
x = x.astype(np.float64) / 32768
if x.ndim > 1: x = x.mean(1)
dur = len(x) / sr
print(f'时长 {dur:.1f}s  采样率 {sr}')

# ---------- 每 10 ms 一帧的音量 ----------
hop, win = sr // 100, sr // 50
nf = (len(x) - win) // hop
fr = np.lib.stride_tricks.sliding_window_view(x, win)[::hop][:nf]
rms = np.sqrt((fr ** 2).mean(1) + 1e-12)
db = 20 * np.log10(rms)
noise = np.percentile(db, 5)
loud = np.percentile(db, 97)
print(f'底噪（安静处）{noise:.1f} dBFS   说话最响处 {loud:.1f} dBFS   信噪比约 {loud - noise:.0f} dB')

thr = noise + 12
act = db > thr
# 平滑：短于 150 ms 的空隙算在说话里，短于 80 ms 的“说话”算噪声
def runs(b):
    out, i = [], 0
    while i < len(b):
        j = i
        while j < len(b) and b[j] == b[i]: j += 1
        out.append([bool(b[i]), i, j]); i = j
    return out
r = runs(act)
for k, (v, a, b) in enumerate(r):
    if not v and b - a < 15 and 0 < k < len(r) - 1: act[a:b] = True
r = runs(act)
for v, a, b in r:
    if v and b - a < 8: act[a:b] = False
r = runs(act)
speech_t = act.sum() / 100
pauses = [(a / 100, (b - a) / 100) for v, a, b in r if not v and a > 0 and b < len(act)]
print(f'有声音的时间 {speech_t:.1f}s，停顿 {dur - speech_t:.1f}s')
if nchar:
    print(f'语速：整体 {nchar / dur * 60:.0f} 字/分钟，只算说话的时间 {nchar / speech_t * 60:.0f} 字/分钟')
lp = sorted(pauses, key=lambda p: -p[1])
print('停顿 ≥1 秒的次数', sum(1 for p in pauses if p[1] >= 1), '；≥1.8 秒', sum(1 for p in pauses if p[1] >= 1.8))
print('最长的几个停顿（开始秒, 长度）：', [(round(a, 1), round(l, 1)) for a, l in lp[:8]])

# ---------- 频谱：说话的部分、安静的部分 ----------
nfft = 4096
f, t, Z = ss.stft(x, sr, nperseg=nfft, noverlap=nfft - hop * 4)
P = np.abs(Z) ** 2
fi = np.clip((t * 100).astype(int), 0, len(act) - 1)
sp = P[:, act[fi]].mean(1)
qi = (db[fi] < noise + 3)
ns = P[:, qi].mean(1) if qi.sum() > 5 else None
def band(lo, hi, S): m = (f >= lo) & (f < hi); return 10 * np.log10(S[m].sum() + 1e-20)
bands = [(50, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]
ref = band(500, 1000, sp)
print('说话的频谱（各段能量，跟 500–1000 Hz 比）：')
print('   ' + '  '.join(f'{lo}-{hi}:{band(lo, hi, sp) - ref:+.0f}' for lo, hi in bands))
if ns is not None:
    nref = band(500, 1000, ns)
    print('安静处的频谱（跟它自己 500–1000 Hz 比）：')
    print('   ' + '  '.join(f'{lo}-{hi}:{band(lo, hi, ns) - nref:+.0f}' for lo, hi in bands))
    # 有没有电流声：50/100/150 Hz 比周围高多少
    for h in (50, 100, 150):
        k = np.argmin(abs(f - h)); nb = np.r_[ns[k - 8:k - 3], ns[k + 4:k + 9]].mean()
        print(f'   {h} Hz 比周围高 {10 * np.log10(ns[k] / nb):+.1f} dB')

# ---------- 喷麦：低频的瞬间爆音 ----------
b, a = ss.butter(4, 120, 'low', fs=sr)
lo = ss.filtfilt(b, a, x)
lo_fr = np.lib.stride_tricks.sliding_window_view(lo, win)[::hop][:nf]
lo_db = 10 * np.log10((lo_fr ** 2).mean(1) + 1e-12)
pops = np.where((lo_db > db - 3) & (db > loud - 15))[0]
pop_ev = runs(np.isin(np.arange(nf), pops))
pop_ev = [(a / 100) for v, a, b in pop_ev if v]
print(f'低频爆音（像喷麦）{len(pop_ev)} 处', [round(p, 1) for p in pop_ev[:12]])

# ---------- 回声：句子结束后声音掉 20 dB 要多久 ----------
dec = []
for v, a, b in r:
    if v or a == 0 or b >= len(act) or b - a < 40: continue
    seg = db[max(0, a - 15):a + 60]
    k0 = np.argmax(seg[:20]); L = seg[k0]
    tgt = max(L - 20, noise + 4)
    if L - tgt < 10: continue
    k = np.where(seg[k0:] <= tgt)[0]
    if len(k): dec.append((k[0] * 10, L - tgt))
if dec:
    T = np.array([d for d, _ in dec]); D = np.array([dd for _, dd in dec])
    rt = np.median(T / D * 60) / 1000
    print(f'句尾衰减：{len(dec)} 处，掉 20 dB 中位数 {np.median(T * 20 / D):.0f} ms → 估计混响 RT60 约 {rt:.2f} s（包括说话本身的收尾，偏大）')

# ---------- 音高（YIN） ----------
x16 = ss.resample_poly(x, 1, sr // 16000) if sr % 16000 == 0 else ss.resample(x, int(len(x) * 16000 / sr))
S16, W, H = 16000, 800, 160
tmin, tmax = 16000 // 400, 16000 // 60
Wi = W - tmax
F = np.lib.stride_tricks.sliding_window_view(x16, W)[::H]
f0 = np.full(len(F), np.nan)
for i, fr_ in enumerate(F):
    e = np.cumsum(fr_ ** 2)
    if e[-1] / W < 10 ** ((noise + 15) / 10): continue
    rr = np.correlate(fr_, fr_[:Wi], 'valid')
    e0 = e[Wi - 1]
    et = e[np.arange(tmax + 1) + Wi - 1] - np.r_[0, e[np.arange(1, tmax + 1) - 1]]
    d = e0 + et - 2 * rr
    cm = np.ones_like(d); cs = np.cumsum(d[1:]); cm[1:] = d[1:] * np.arange(1, len(d)) / np.maximum(cs, 1e-12)
    cand = np.where(cm[tmin:tmax] < 0.15)[0]
    if not len(cand): continue
    k = cand[0] + tmin
    while k + 1 < tmax and cm[k + 1] < cm[k]: k += 1
    if 1 <= k < len(cm) - 1:
        a_, b_, c_ = cm[k - 1], cm[k], cm[k + 1]; den = a_ - 2 * b_ + c_
        kk = k + (0.5 * (a_ - c_) / den if den else 0)
    else:
        kk = k
    f0[i] = S16 / kk
v = f0[~np.isnan(f0)]
# 去掉倍频/半频错误
med = np.median(v); v = v[(v > med / 1.8) & (v < med * 1.8)]
st = 12 * np.log2(v / np.median(v))
print(f'音高：中位数 {np.median(v):.0f} Hz（有声帧 {len(v)}），5%–95% 范围 {np.percentile(v, 5):.0f}–{np.percentile(v, 95):.0f} Hz，'
      f'跨 {np.percentile(st, 95) - np.percentile(st, 5):.1f} 个半音；标准差 {st.std():.1f} 半音')
# 每 10 秒的音高中位数，看是不是越读越平、越读越高
seg = []
ti = np.arange(len(f0)) * H / S16
for s0 in range(0, int(dur), 15):
    m = (ti >= s0) & (ti < s0 + 15) & ~np.isnan(f0)
    if m.sum() > 20:
        vv = f0[m]; vv = vv[(vv > med / 1.8) & (vv < med * 1.8)]
        ss_ = 12 * np.log2(vv / np.median(vv))
        seg.append(f'{s0:>3}s:{np.median(vv):.0f}Hz±{ss_.std():.1f}')
print('   每 15 秒：', '  '.join(seg))
np.save(path + '.f0.npy', f0)
