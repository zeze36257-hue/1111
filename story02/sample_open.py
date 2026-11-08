"""第 2 集“新开头”样片（给频道主看效果，不是新的一期）。

    python3 sample_open.py          -> 样片_新开头_竖屏.mp4、样片_新开头_横屏.mp4（各 40 秒；做好的挪到 refs/讲故事/第2集_冰雕连/）
    python3 sample_open.py --full   -> 冰雕连_第2集_竖屏.mp4（整集，竖屏；11 月 8 日他选了竖屏）

为什么做：第 2 集后台数据平均只看了 8 秒，比开头 10 秒没旁白还短（前 2 秒还是黑屏）。11 月 8 日跟频道主说好，开头这样改：
- 第一帧就有画面和字，不黑屏；旁白 0.3 秒开口，第一句就是最狠的那句；
- 沉浸的空镜放到这句后面，2～3 秒；
- 上面一行全程不消失的大标题；
- 竖屏版：上面标题、中间横屏画面、下面字幕（手机上横屏画面太小）。横屏版只在画面上方加标题。

怎么拼的（全用现成的素材和录音，不花钱）：
- 0～3.6 秒是新开头：画面 s6（雪里保持射击姿势的战士），旁白是原稿第 44 句“一百二十五个人，一个都没有离开。”（从第二版旁白里截出来）。
- 3.6 秒以后接原片 7.4 秒以后的部分（照明弹、远处的炮火 → “1950 年冬天……” → 片名卡 → 第一段第一句），整体提前 3.8 秒。
- 声音：配乐和音效用 bgm.wav 同样提前 3.8 秒；旁白 = 新开头那句 + 原旁白提前 3.8 秒；混音跟 render.py 一样。
"""
import json, os, subprocess, sys
import cv2
import numpy as np
import scipy.io.wavfile as wf
import scipy.signal as ss
from PIL import Image, ImageDraw, ImageFont
import render as R                                    # 原片的画面函数（frame、still、snow、字幕图）

FULL = '--full' in sys.argv
SHIFT, HOOK = 3.8, 3.6                                # 原片时间 = 样片时间 + SHIFT；0～HOOK 是新开头
END0 = R.END if FULL else 44.0                        # 样片接到原片 44 秒为止；--full 接到原片结束
DUR = END0 - SHIFT
FPS, SR = 30, 48000
HOOK_LINE = 44                                        # 用原稿第 44 句当开头第一句
HOOK_TEXT = '一百二十五个人，一个都没有离开。'
HOOK_AT = 0.3


def ts(x):
    h, m, r = x.split(':'); s, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


SRT = [tuple(ts(v) for v in b.split('\n')[1].split(' --> ')) for b in open('narration.srt', encoding='utf-8').read().strip().split('\n\n')]
h0, h1 = SRT[HOOK_LINE - 1]
HOOK_LEN = h1 - h0


# ---------- 画面 ----------
def hook_frame(t):
    return R.snow.draw(R.still('s6', 'in', t / 4.4, 4.4), t, 0.55)


def base(t):
    """样片时间 t 的画面（1920×1080，没有字幕和进度条）。"""
    if t < HOOK - 0.25: f = hook_frame(t)
    elif t < HOOK + 0.25:
        w = R.ease((t - (HOOK - 0.25)) / 0.5); f = hook_frame(t) * (1 - w) + R.frame(t + SHIFT) * w
    else: f = R.frame(t + SHIFT)
    if DUR - t < 0.8: f = f * R.ease((DUR - t) / 0.8)
    return f


SUBS = []
for a, b, text in R.subs:                             # 原片的字幕（已经是原片时间），提前 SHIFT 秒
    if a - SHIFT >= HOOK - 0.1 and a - SHIFT < DUR: SUBS.append((a - SHIFT, b - SHIFT, text))
for k, part in enumerate(['一百二十五个人', '一个都没有离开']):
    a = HOOK_AT + HOOK_LEN * k * 7 / 15; SUBS.insert(k, (a, HOOK_AT + HOOK_LEN * (k + 1) * 7 / 15 + 0.15, part))


def sub_img(text, size, cache={}):
    if (text, size) not in cache:
        fnt = ImageFont.truetype('fonts/sub.ttf', size)
        bb = fnt.getbbox(text, stroke_width=5)
        im = Image.new('RGBA', (bb[2] - bb[0] + 40, bb[3] - bb[1] + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.text((20 - bb[0], 23 - bb[1]), text, font=fnt, fill=(0, 0, 0, 120), stroke_width=7, stroke_fill=(0, 0, 0, 120))
        d.text((20 - bb[0], 20 - bb[1]), text, font=fnt, fill=(255, 255, 255, 255), stroke_width=5, stroke_fill=(20, 14, 10, 255))
        cache[(text, size)] = np.asarray(im, np.float32)
    return cache[(text, size)]


def paste(f, s, cx, cy, alpha=1.0):
    h, w = s.shape[:2]; x, y = int(cx - w / 2), int(cy - h / 2)
    H, W = f.shape[:2]
    x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    s = s[y0 - y:y1 - y, x0 - x:x1 - x]; al = s[..., 3:4] / 255 * alpha
    f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - al) + s[..., :3] * al


def subs_at(t):
    return [(text, min(1, (t - a) / 0.12, (b - t) / 0.12)) for a, b, text in SUBS if a <= t < b]


def txt(text, font, size, color, glow=8):
    return R.text_img(text, font, size, color, glow=glow)


# 竖屏：上面标题，中间画面，下面字幕
VW, VH = 1080, 1920
VID_Y = 640                                           # 画面放在 640～1248
V_TAG = txt('抗美援朝 · 长津湖', 'fonts/sub.ttf', 46, (196, 208, 224), glow=4)
V_T1 = txt('冰雕连', 'fonts/title.ttf', 168, (242, 245, 250), glow=12)
V_T2 = txt('零下40度，125人一个都没有离开', 'fonts/title.ttf', 58, (255, 212, 90), glow=8)
vbar = R.Bar(VW, 608, calm=True)
_bg = np.zeros((VH, VW, 3), np.float32)
_bg[:] = np.linspace(14, 4, VH)[:, None, None] * np.array([1.0, 1.05, 1.25])   # 很暗的冷色底，不是死黑


def vertical(f, t):
    c = _bg.copy()
    paste(c, V_TAG, VW / 2, 250); paste(c, V_T1, VW / 2, 392); paste(c, V_T2, VW / 2, 540)
    v = cv2.resize(f, (VW, 608), interpolation=cv2.INTER_AREA)
    v = vbar.draw(np.clip(v, 0, 255).astype(np.uint8), t, DUR).astype(np.float32)
    c[VID_Y:VID_Y + 608] = v
    for text, al in subs_at(t): paste(c, sub_img(text, 64), VW / 2, VID_Y + 608 + 110, al)
    return np.clip(c, 0, 255).astype(np.uint8)


# 横屏：原来的画面，上方加一条标题
H_T = txt('冰雕连', 'fonts/title.ttf', 74, (242, 245, 250), glow=8)
H_T2 = txt('零下40度，125人一个都没有离开', 'fonts/title.ttf', 52, (255, 212, 90), glow=8)
_band = (np.clip(1 - np.arange(1080) / 190, 0, 1) ** 1.4 * 0.72)[:, None, None]
hbar = R.Bar(1920, 1080, calm=True)


def horizontal(f, t):
    f = f * (1 - _band)
    paste(f, H_T, 60 + H_T.shape[1] / 2, 74); paste(f, H_T2, 60 + H_T.shape[1] + 10 + H_T2.shape[1] / 2, 80)
    for text, al in subs_at(t): paste(f, sub_img(text, 46), 960, 1080 - 150, al)
    return hbar.draw(np.clip(f, 0, 255).astype(np.uint8), t, DUR)


# ---------- 声音 ----------
def pcm(path):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.int16).astype(np.float32) / 32768


def mix(out):
    n = int(DUR * SR)
    nar_file = pcm(R.NARR)                             # 旁白文件：文件里的 τ 秒 = 原片的 τ + NARR_OFF 秒
    nar = np.zeros(n, np.float32)
    k0 = int((R.NARR_OFF - SHIFT) * SR)               # 原旁白提前 SHIFT 秒放
    seg = nar_file[:max(0, n - k0)]; nar[k0:k0 + len(seg)] += seg
    a, b = int((h0 - 0.04) * SR), int((h1 + 0.08) * SR)
    hook = nar_file[a:b].copy(); hook[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    s = int(HOOK_AT * SR); nar[s:s + len(hook)] += hook
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'bgm.wav', '-af', 'acompressor=threshold=-32dB:ratio=3:attack=20:release=400:makeup=6',
                    '_bgm_c.wav'], check=True)
    _, bgm = wf.read('_bgm_c.wav'); os.remove('_bgm_c.wav')
    bgm = bgm.astype(np.float32)[int(SHIFT * SR):int(SHIFT * SR) + n] / 32768
    bgm = np.pad(bgm, ((0, n - len(bgm)), (0, 0)))
    hop = SR // 100
    e = np.sqrt(np.convolve(nar ** 2, np.ones(hop * 5) / (hop * 5), 'same'))
    bb, aa = ss.butter(1, 2.0, 'low', fs=SR); duck = 1 - 0.55 * np.clip(ss.filtfilt(bb, aa, (e > 0.01).astype(np.float32)), 0, 1)
    m = bgm * 0.85 * duck[:, None] + nar[:, None] * 0.9
    m[-int(0.8 * SR):] *= np.linspace(1, 0, int(0.8 * SR))[:, None]
    wf.write('_mix.wav', SR, (np.clip(m, -1, 1) * 32767).astype(np.int16))
    st = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', '_mix.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                        capture_output=True, text=True).stderr
    j = json.loads(st[st.rindex('{'):st.rindex('}') + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
          f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample=48000")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '_mix.wav', '-af', ln, '-c:a', 'pcm_s16le', out], check=True)
    os.remove('_mix.wav')


def encoder(path, w, h, audio):
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(FPS), '-i', '-',
                             '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '22', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                             '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', path], stdin=subprocess.PIPE)


if __name__ == '__main__':
    import sys
    if '--frames' in sys.argv:
        os.makedirs('frames', exist_ok=True)
        for x in sys.argv[sys.argv.index('--frames') + 1].split(','):
            f = base(float(x))
            Image.fromarray(vertical(f, float(x))).save(f'frames/样片竖_{float(x):05.2f}.jpg', quality=88)
            Image.fromarray(horizontal(f.copy(), float(x))).save(f'frames/样片横_{float(x):05.2f}.jpg', quality=88)
        sys.exit()
    mix('_sample_audio.wav')
    if FULL:
        ev = encoder('冰雕连_第2集_竖屏.mp4', VW, VH, '_sample_audio.wav')
        for k in range(int(DUR * FPS)):
            t = k / FPS; ev.stdin.write(vertical(base(t), t).tobytes())
            if k % 900 == 0: print(f'{t:.0f}s', flush=True)
        ev.stdin.close(); ev.wait(); os.remove('_sample_audio.wav')
        print('-> 冰雕连_第2集_竖屏.mp4'); sys.exit()
    ev, eh = encoder('样片_新开头_竖屏.mp4', VW, VH, '_sample_audio.wav'), encoder('样片_新开头_横屏.mp4', 1920, 1080, '_sample_audio.wav')
    for k in range(int(DUR * FPS)):
        t = k / FPS; f = base(t)
        ev.stdin.write(vertical(f, t).tobytes()); eh.stdin.write(horizontal(f, t).tobytes())
    for e in (ev, eh): e.stdin.close(); e.wait()
    os.remove('_sample_audio.wav')
    print('-> 样片_新开头_竖屏.mp4、样片_新开头_横屏.mp4')
