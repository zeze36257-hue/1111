"""第 1 集出片：按 shots.py 把图和动画排成 16:9 的画面，加慢运镜、转场、字幕、仙人掌柜进度条，再配上声音。

    python3 render.py               # 出整片 -> 荒野猎人的真实原型_第1集.mp4
    python3 render.py --frames 5,86,210   # 只出这几秒的截图（frames/ 里），检查画面用

- 静态图：2560×1440 缩到 1920×1080，慢慢推近、拉远或平移（每秒 1.2% 左右，频道主说慢一点有沉浸感）。
- 动画：Seedance mini 的 720p 放大到 1080p，稍微锐化。
- 转场：同一段里的镜头 0.5 秒叠化；段落之间黑场淡出淡入；熊扑上来那一下是黑场加爪痕。
- 字幕：旁白每句按标点切成短句，按字数分时间；白字黑边，放在进度条上面，不挡仙人掌。
- 声音：旁白 + bgm.wav（music.py），旁白说话时配乐自动压低，最后整体响度到 -16 LUFS。
"""
import json, math, os, re, subprocess, sys
from collections import OrderedDict
import cv2
import numpy as np
import scipy.io.wavfile as wf
import scipy.signal as ss
from PIL import Image, ImageDraw, ImageFont
from shots import SHOTS, END

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(HERE, '..', 'tools', 'story'))
from progress_bar import Bar

W, H, FPS = 1920, 1080, 30
XF, FADE_IN, FADE_OUT = 0.5, 0.5, 0.6
OUT = '荒野猎人的真实原型_第1集.mp4'
NARR = '/tmp/claude-0/-home-user-1111/1241d7d4-95e7-5361-a983-3f8317d8eee4/scratchpad/narration.wav'
if not os.path.exists(NARR): NARR = 'narration.m4a'

# ---------- 素材缓存 ----------
_img, _clip = OrderedDict(), OrderedDict()


def image(name):
    if name not in _img:
        _img[name] = cv2.cvtColor(cv2.imread(f'img/{name}.jpg'), cv2.COLOR_BGR2RGB)
        if len(_img) > 6: _img.popitem(last=False)
    return _img[name]


def clip(name):
    if name not in _clip:
        cap = cv2.VideoCapture(f'clips/{name}.mp4'); fr = []
        fps = cap.get(cv2.CAP_PROP_FPS) or 24
        while True:
            ok, f = cap.read()
            if not ok: break
            fr.append(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
        _clip[name] = (fr, fps)
        if len(_clip) > 2: _clip.popitem(last=False)
    return _clip[name]


def ease(x): x = min(1.0, max(0.0, x)); return 0.5 - 0.5 * math.cos(math.pi * x)


def sepia(f):
    g = f.astype(np.float32) @ np.array([[0.393, 0.349, 0.272], [0.769, 0.686, 0.534], [0.189, 0.168, 0.131]], np.float32)
    g = np.clip(g * 0.85 + 18, 0, 255)
    yy, xx = np.mgrid[0:H, 0:W]; v = 1 - 0.45 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    return np.clip(g * v[..., None] + np.random.default_rng(0).normal(0, 6, (H, W, 1)), 0, 255)


_vign = None


def still(name, move, p, dur):
    src = image(name); sh, sw = src.shape[:2]
    s0 = max(W / sw, H / sh)
    amt = min(0.08, 0.012 * dur)
    e = ease(p)
    if move in ('in', 'sepia'): z, ox = 1 + amt * e, 0
    elif move == 'out': z, ox = 1 + amt * (1 - e), 0
    elif move in ('r', 'l'):
        z = 1 + max(amt, 0.05); room = (s0 * z * sw - W) / 2 * 0.9
        ox = room * (1 - 2 * e) if move == 'r' else -room * (1 - 2 * e)
    else: z, ox = 1, 0
    S = s0 * z
    M = np.float32([[S, 0, W / 2 - S * sw / 2 + ox], [0, S, H / 2 - S * sh / 2]])
    f = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT).astype(np.float32)
    return sepia(f) if move == 'sepia' else f


def video(name, t_in):
    fr, fps = clip(name)
    f = fr[min(len(fr) - 1, int(t_in * fps))]
    f = cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    f = cv2.addWeighted(f, 1.35, cv2.GaussianBlur(f, (0, 0), 1.4), -0.35, 0)
    return np.clip(f + np.random.default_rng(int(t_in * 1000)).normal(0, 2.5, (H, W, 1)), 0, 255)


# 熊扑上来那一下的爪痕：三道两头尖、中间宽、边上有毛刺的撕痕，外面一圈暗红
def _claw():
    from PIL import ImageFilter
    rng = np.random.default_rng(3)
    glow = Image.new('L', (W, H), 0); core = Image.new('L', (W, H), 0)
    dg, dc = ImageDraw.Draw(glow), ImageDraw.Draw(core)
    for k in range(3):
        x0, y0 = 560 + k * 250, 90 + k * 40
        n = 60; pts = []
        for i in range(n + 1):
            u = i / n
            x = x0 + u * 520 + 60 * math.sin(u * 2.2); y = y0 + u * 880
            wdt = 30 * math.sin(math.pi * u) ** 0.8 + 2
            pts.append((x, y, wdt))
        left = [(x - w * 0.8 + rng.normal(0, 2.5), y + w * 0.3) for x, y, w in pts]
        right = [(x + w * 0.8 + rng.normal(0, 2.5), y - w * 0.3) for x, y, w in pts]
        dc.polygon(left + right[::-1], fill=255)
        dg.polygon([(x - w * 1.6, y) for x, y, w in pts] + [(x + w * 1.6, y) for x, y, w in pts[::-1]], fill=255)
    glow = np.asarray(glow.filter(ImageFilter.GaussianBlur(14)), np.float32) / 255
    core = np.asarray(core.filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
    rgb = np.zeros((H, W, 3), np.float32)
    rgb[...] = np.array([120, 10, 8], np.float32)
    rgb = rgb * (1 - core[..., None]) + np.array([250, 235, 225], np.float32) * core[..., None]
    alpha = np.clip(glow * 0.9 + core, 0, 1)
    return np.concatenate([rgb, alpha[..., None] * 255], 2)


claw = _claw()


def flash(t_in):
    f = np.zeros((H, W, 3), np.float32)
    if t_in < 0.12: return f + 255 * (1 - t_in / 0.12)
    a = min(1, (t_in - 0.08) / 0.1) * max(0.0, 1 - (t_in - 0.5) / 0.6)
    return f * (1 - claw[..., 3:4] / 255 * a) + claw[..., :3] * (claw[..., 3:4] / 255 * a)


def shot_frame(i, t):
    a, b, src, move = SHOTS[i]
    if src == 'X': return np.zeros((H, W, 3), np.float32)
    if src == 'FLASH': return flash(t - a)
    if src.startswith('v_'): return video(src, max(0.0, t - a))
    return still(src, move, (t - a) / (b - a), b - a)


def frame(t):
    i = next((k for k, s in enumerate(SHOTS) if s[0] <= t < s[1]), None)
    if i is None:                                   # 最后一个镜头以后：黑
        return np.zeros((H, W, 3), np.float32)
    a, b, src, _ = SHOTS[i]
    f = shot_frame(i, t)
    prev = SHOTS[i - 1][2] if i > 0 else 'X'
    nxt = SHOTS[i + 1][2] if i + 1 < len(SHOTS) else 'END'
    if src in ('X', 'FLASH'): return f
    if prev in ('X', 'FLASH') and t - a < FADE_IN: f *= ease((t - a) / FADE_IN)
    if nxt == 'X' and b - t < FADE_OUT: f *= ease((b - t) / FADE_OUT)
    if nxt == 'END' and b - t < 1.2: f *= ease((b - t) / 1.2)
    if nxt not in ('X', 'FLASH', 'END') and b - t < XF / 2:
        w = (t - (b - XF / 2)) / XF
        f = f * (1 - w) + shot_frame(i + 1, t) * w
    if prev not in ('X', 'FLASH') and i > 0 and t - a < XF / 2:
        w = 0.5 + (t - a) / XF
        f = f * w + shot_frame(i - 1, t) * (1 - w)
    return f


# ---------- 字幕 ----------
FONT = ImageFont.truetype('fonts/sub_0.ttf', 46)


def ts(x):
    h, m, r = x.split(':'); s, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


subs = []
for blk in open('narration.srt', encoding='utf-8').read().strip().split('\n\n'):
    L = blk.split('\n'); a, b = map(ts, L[1].split(' --> ')); text = L[2]
    parts = [p for p in re.split(r'(?<=[，。；：！？、])', text) if p.strip()]
    chunks = []
    for p in parts:
        if chunks and len(chunks[-1]) + len(p) <= 14: chunks[-1] += p
        else: chunks.append(p)
    tot = sum(len(c) for c in chunks); t0 = a
    for c in chunks:
        t1 = t0 + (b - a) * len(c) / tot
        subs.append((t0, t1 + 0.15, c.rstrip('，。；：、').replace('，', ' ')))
        t0 = t1


def render_sub(text):
    bbox = FONT.getbbox(text, stroke_width=4)
    im = Image.new('RGBA', (bbox[2] - bbox[0] + 40, bbox[3] - bbox[1] + 40), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.text((20 - bbox[0], 20 - bbox[1] + 3), text, font=FONT, fill=(0, 0, 0, 120), stroke_width=6, stroke_fill=(0, 0, 0, 120))
    dr.text((20 - bbox[0], 20 - bbox[1]), text, font=FONT, fill=(255, 255, 255, 255), stroke_width=4, stroke_fill=(20, 14, 10, 255))
    return np.asarray(im, np.float32)


sub_imgs = {}


def draw_subs(f, t):
    for a, b, text in subs:
        if a <= t < b:
            if text not in sub_imgs: sub_imgs[text] = render_sub(text)
            s = sub_imgs[text]; h, w = s.shape[:2]
            x, y = (W - w) // 2, H - 150 - h // 2
            al = s[..., 3:4] / 255 * min(1, (t - a) / 0.12, (b - t) / 0.12)
            f[y:y + h, x:x + w] = f[y:y + h, x:x + w] * (1 - al) + s[..., :3] * al
    return f


bar = Bar(W, H)


def final_frame(t):
    f = draw_subs(frame(t), t)
    f = np.clip(f, 0, 255).astype(np.uint8)
    return bar.draw(f, t, END)


# ---------- 声音 ----------
def mix():
    sr = 48000
    nar = subprocess.run(['ffmpeg', '-v', 'error', '-i', NARR, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    nar = np.frombuffer(nar, np.int16).astype(np.float32) / 32768
    _, bgm = wf.read('bgm.wav'); bgm = bgm.astype(np.float32) / 32768
    n = int(END * sr); nar = np.pad(nar, (0, max(0, n - len(nar))))[:n]; bgm = np.pad(bgm, ((0, max(0, n - len(bgm))), (0, 0)))[:n]
    hop = sr // 100
    e = np.sqrt(np.convolve(nar ** 2, np.ones(hop * 5) / (hop * 5), 'same'))
    talk = (e > 0.01).astype(np.float32)
    b, a = ss.butter(1, 2.0, 'low', fs=sr); duck = 1 - 0.55 * np.clip(ss.filtfilt(b, a, talk), 0, 1)
    mixed = bgm * 1.6 * duck[:, None] + nar[:, None] * 0.9          # 配乐整体抬 4 dB，留白里氛围更足
    wf.write('_mix.wav', sr, (np.clip(mixed, -1, 1) * 32767).astype(np.int16))
    s = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', '_mix.wav', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = json.loads(s[s.rindex('{'):s.rindex('}') + 1])
    ln = (f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', '_mix.wav', '-af', ln, '-c:a', 'pcm_s16le', 'final_audio.wav'], check=True)
    os.remove('_mix.wav')


if __name__ == '__main__':
    if '--frames' in sys.argv:
        os.makedirs('frames', exist_ok=True)
        for x in sys.argv[sys.argv.index('--frames') + 1].split(','):
            Image.fromarray(final_frame(float(x))).save(f'frames/{float(x):07.2f}.jpg', quality=88)
        sys.exit()
    mix()
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-i', 'final_audio.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium',
                            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', OUT], stdin=subprocess.PIPE)
    nf = int(END * FPS)
    for k in range(nf):
        enc.stdin.write(final_frame(k / FPS).tobytes())
        if k % 900 == 0: print(f'{k / FPS:.0f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('->', OUT)
