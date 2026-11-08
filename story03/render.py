"""第 3 集出片（竖屏 1080×1920）：上面标题，中间 16:9 的画面，下面字幕，进度条和仙人掌柜在画面底边。

    python3 render.py                      # 出整片 -> 水门桥_第3集.mp4
    python3 render.py --frames 0,5,62,231  # 只出这几秒的截图（frames/ 里），检查画面用

- 画面（16:9 那块）跟第 2 集一样：静态图慢运镜（每秒 1.2% 左右）、飘雪、0.5 秒叠化、段落之间黑场、动画放大到 1080p。
- 竖屏的样子是 11 月 8 日频道主选的（见 story02/sample_open.py）：第一帧就有画面和标题，旁白 0.3 秒开口。
- 郭荣熙那句话用宋体大字打在画面上；最后“致敬 / 每一个去炸桥的人”。这两句不再出底下的字幕。
- 声音：旁白 + bgm.wav（music.py），旁白说话时配乐自动压低，最后整体响度 -16 LUFS。
"""
import json, math, os, re, subprocess, sys
from collections import OrderedDict
import cv2
import numpy as np
import scipy.io.wavfile as wf
import scipy.signal as ss
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from shots import SHOTS, END, NARR_OFF, QUOTE, QUOTE_BG, ENDCARD, NO_SUB, TITLE

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(HERE, '..', 'tools', 'story'))
from progress_bar import Bar

W, H, FPS = 1920, 1080, 30                    # 画面那块按 16:9 做
VW, VH, VID_Y, VID_H = 1080, 1920, 640, 608   # 竖屏：画面放在 640～1248
XF, FADE_IN, FADE_OUT = 0.5, 0.5, 0.6
OUT = '水门桥_第3集.mp4'
NARR = '/tmp/claude-0/-home-user-1111/1241d7d4-95e7-5361-a983-3f8317d8eee4/scratchpad/ep3/narr/旁白.wav'
if not os.path.exists(NARR): NARR = 'narration.m4a'
BLACK = ('X', 'ENDCARD')

# ---------- 素材 ----------
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


def parse(move):
    opts = move.split('+') if move else ['']
    snow = 0.0
    for o in opts[1:]:
        if o.startswith('snow'): snow = {'snow': 1.0, 'snow1': 0.55, 'snow2': 1.6}[o]
    return opts[0], snow


def still(name, move, p, dur):
    src = image(name); sh, sw = src.shape[:2]
    s0 = max(W / sw, H / sh)
    amt = min(0.08, 0.012 * dur)
    e = ease(p)
    if move == 'in': z, ox = 1 + amt * e, 0
    elif move == 'out': z, ox = 1 + amt * (1 - e), 0
    elif move in ('r', 'l'):
        z = 1 + max(amt, 0.05); room = (s0 * z * sw - W) / 2 * 0.9
        ox = room * (1 - 2 * e) if move == 'r' else -room * (1 - 2 * e)
    else: z, ox = 1, 0
    S = s0 * z
    M = np.float32([[S, 0, W / 2 - S * sw / 2 + ox], [0, S, H / 2 - S * sh / 2]])
    return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT).astype(np.float32)


def video(name, t_in, dur):
    fr, fps = clip(name)
    rate = min(1.0, len(fr) / fps / dur)                # 镜头比动画长就放慢一点，刚好放完
    f = fr[min(len(fr) - 1, int(t_in * rate * fps))]
    f = cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    f = cv2.addWeighted(f, 1.35, cv2.GaussianBlur(f, (0, 0), 1.4), -0.35, 0)
    return np.clip(f + np.random.default_rng(int(t_in * 1000)).normal(0, 2.5, (H, W, 1)), 0, 255)


class Snow:
    """飘雪：远的小、慢、清楚，近的大、快、糊。"""
    def __init__(self, n=520, seed=7):
        r = np.random.default_rng(seed)
        self.x0, self.y0 = r.uniform(0, W, n), r.uniform(0, H, n)
        self.z = r.uniform(0, 1, n) ** 1.6
        self.vy = 35 + 150 * self.z
        self.vx = r.uniform(-12, 12, n) - 18 * self.z
        self.ph, self.sw = r.uniform(0, 2 * np.pi, n), r.uniform(0.4, 1.3, n)
        self.rad = 1.0 + 4.0 * self.z ** 1.5
        self.a = 0.35 + 0.55 * self.z

    def draw(self, f, t, amount):
        n = int(len(self.z) * min(1.0, amount / 1.6 + 0.2)) if amount < 1.6 else len(self.z)
        x = (self.x0 + self.vx * t + 25 * np.sin(self.sw * t + self.ph)) % (W + 60) - 30
        y = (self.y0 + self.vy * t) % (H + 60) - 30
        far, near = np.zeros((H, W), np.float32), np.zeros((H, W), np.float32)
        for k in range(n):
            layer = near if self.z[k] > 0.55 else far
            cv2.circle(layer, (int(x[k]), int(y[k])), max(1, int(round(self.rad[k]))), float(self.a[k]), -1, lineType=cv2.LINE_AA)
        near = cv2.GaussianBlur(near, (0, 0), 2.2)
        m = np.clip(far + near * 1.4, 0, 1)[..., None] * min(1.0, amount)
        return f + (245 - f) * m * 0.85


snow = Snow()


# ---------- 字 ----------
def text_img(text, font, size, color, glow=10):
    fnt = ImageFont.truetype(font, size)
    bb = fnt.getbbox(text)
    pad = glow * 3 + 10
    im = Image.new('RGBA', (bb[2] - bb[0] + pad * 2, bb[3] - bb[1] + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((pad - bb[0], pad - bb[1]), text, font=fnt, fill=color + (255,))
    if glow:
        g = im.split()[3].filter(ImageFilter.GaussianBlur(glow))
        sh = Image.new('RGBA', im.size, (0, 0, 0, 255)); sh.putalpha(g.point(lambda v: int(v * 0.8)))
        im = Image.alpha_composite(sh, im)
    return np.asarray(im, np.float32)


def put(f, s, cx, cy, alpha=1.0):
    h, w = s.shape[:2]; x, y = int(cx - w / 2), int(cy - h / 2)
    FH, FW = f.shape[:2]
    x0, y0, x1, y1 = max(0, x), max(0, y), min(FW, x + w), min(FH, y + h)
    if x0 >= x1 or y0 >= y1: return f
    s = s[y0 - y:y1 - y, x0 - x:x1 - x]; al = s[..., 3:4] / 255 * alpha
    f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - al) + s[..., :3] * al
    return f


Q_IMG = [[text_img(s, 'fonts/quote.ttf', 84, (246, 238, 222), glow=8) for s in lines] for _, _, lines in QUOTE]
E_IMG = [text_img(ENDCARD[0][0], 'fonts/title.ttf', 84, (225, 230, 238), glow=10),
         text_img(ENDCARD[1][0], 'fonts/title.ttf', 120, (240, 243, 248), glow=14)]
_qbg = None


def quote(t, a, b):
    global _qbg
    if _qbg is None:
        src = cv2.cvtColor(cv2.imread(f'img/{QUOTE_BG}.jpg'), cv2.COLOR_BGR2RGB)
        _qbg = cv2.GaussianBlur(cv2.resize(src, (int(W * 1.1), int(H * 1.1)), interpolation=cv2.INTER_AREA), (0, 0), 9).astype(np.float32) * 0.36
    z = 1 + 0.06 * ease((t - a) / (b - a))
    M = np.float32([[z, 0, W / 2 - z * _qbg.shape[1] / 2], [0, z, H / 2 - z * _qbg.shape[0] / 2]])
    f = snow.draw(cv2.warpAffine(_qbg, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT), t, 0.35)
    for (qa, qb, lines), imgs in zip(QUOTE, Q_IMG):
        tot = sum(len(s) for s in lines); t0 = qa; lh = 124; y0 = H / 2 - (len(lines) - 1) * lh / 2 - 10
        for k, (s, im) in enumerate(zip(lines, imgs)):
            al = max(0.0, min(1.0, (t - t0 + 0.15) / 0.6, (b - 0.3 - t) / 0.6))
            f = put(f, im, W / 2, y0 + k * lh + (1 - al) * 8, al)
            t0 += (qb - qa) * len(s) / tot
    return f


def end_card(t, a, b):
    f = snow.draw(np.zeros((H, W, 3), np.float32), t, 0.6)
    out = max(0.0, min(1.0, (b - 0.4 - t) / 1.6))
    f = put(f, E_IMG[0], W / 2, H / 2 - 110, max(0.0, min(1.0, (t - ENDCARD[0][1]) / 0.8)) * out)
    return put(f, E_IMG[1], W / 2, H / 2 + 40, max(0.0, min(1.0, (t - ENDCARD[1][1]) / 1.0)) * out)


# ---------- 画面（16:9 那块） ----------
def shot_frame(i, t):
    a, b, src, move = SHOTS[i]
    base, sn = parse(move)
    if src == 'X': return np.zeros((H, W, 3), np.float32)
    if src == 'ENDCARD': return end_card(t, a, b)
    if src == 'QUOTE': return quote(t, a, b)
    f = video(src, max(0.0, t - a), b - a) if src.startswith('v_') else still(src, base, (t - a) / (b - a), b - a)
    return snow.draw(f, t, sn) if sn else f


def frame(t):
    i = next((k for k, s in enumerate(SHOTS) if s[0] <= t < s[1]), None)
    if i is None: return np.zeros((H, W, 3), np.float32)
    a, b, src, _ = SHOTS[i]
    f = shot_frame(i, t)
    prev = SHOTS[i - 1][2] if i > 0 else None
    nxt = SHOTS[i + 1][2] if i + 1 < len(SHOTS) else 'END'
    if src in BLACK: return f
    if prev in BLACK and t - a < FADE_IN: f *= ease((t - a) / FADE_IN)
    if nxt in BLACK and b - t < FADE_OUT: f *= ease((b - t) / FADE_OUT)
    if nxt not in BLACK and nxt != 'END' and b - t < XF / 2:
        w = ease((t - (b - XF / 2)) / XF); f = f * (1 - w) + shot_frame(i + 1, t) * w
    if prev is not None and prev not in BLACK and t - a < XF / 2:
        w = ease(0.5 + (t - a) / XF); f = f * w + shot_frame(i - 1, t) * (1 - w)
    return f


# ---------- 字幕（画面下面） ----------
def ts(x):
    h, m, r = x.split(':'); s, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


subs = []
for blk in open('narration.srt', encoding='utf-8').read().strip().split('\n\n'):
    L = blk.split('\n')
    if int(L[0]) in NO_SUB: continue
    a, b = (ts(x) + NARR_OFF for x in L[1].split(' --> '))
    parts = [p for p in re.split(r'(?<=[，。；：！？、])', L[2]) if p.strip()]
    chunks = []
    for p in parts:
        if chunks and len(chunks[-1]) + len(p) <= 14: chunks[-1] += p
        else: chunks.append(p)
    fit = []
    for c in chunks:                                  # 竖屏一行最多 15 个字：太长的从中间附近的“的”后面断开（两边都至少 4 个字），没有就从中间断
        while len(c.rstrip('，。；：、')) > 15:
            mid = len(c) // 2
            cut = min((k + 1 for k, ch in enumerate(c) if ch == '的' and k + 1 >= 4 and len(c.rstrip('，。；：、')) - (k + 1) >= 4),
                      key=lambda k: abs(k - mid), default=mid)
            fit.append(c[:cut]); c = c[cut:]
        fit.append(c)
    tot = sum(len(c) for c in fit); t0 = a
    for c in fit:
        t1 = t0 + (b - a) * len(c) / tot
        subs.append((t0, t1, c.rstrip('，。；：、').replace('，', ' ')))     # 一句接一句，不重叠
        t0 = t1
_subimg = {}


def sub_img(text):
    if text not in _subimg:
        fnt = ImageFont.truetype('fonts/sub.ttf', 64)
        bb = fnt.getbbox(text, stroke_width=5)
        im = Image.new('RGBA', (bb[2] - bb[0] + 40, bb[3] - bb[1] + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.text((20 - bb[0], 23 - bb[1]), text, font=fnt, fill=(0, 0, 0, 120), stroke_width=7, stroke_fill=(0, 0, 0, 120))
        d.text((20 - bb[0], 20 - bb[1]), text, font=fnt, fill=(255, 255, 255, 255), stroke_width=5, stroke_fill=(20, 14, 10, 255))
        _subimg[text] = np.asarray(im, np.float32)
    return _subimg[text]


# ---------- 竖屏 ----------
T_TAG = text_img(TITLE[0], 'fonts/sub.ttf', 46, (196, 208, 224), glow=4)
T_BIG = text_img(TITLE[1], 'fonts/title.ttf', 168, (242, 245, 250), glow=12)
T_HOOK = text_img(TITLE[2], 'fonts/title.ttf', 58, (255, 212, 90), glow=8)
_bg = np.zeros((VH, VW, 3), np.float32)
_bg[:] = np.linspace(14, 4, VH)[:, None, None] * np.array([1.0, 1.05, 1.25])      # 很暗的冷色底
for img_, y in ((T_TAG, 250), (T_BIG, 392), (T_HOOK, 540)): put(_bg, img_, VW / 2, y)
bar = Bar(VW, VID_H, calm=True)


def final_frame(t):
    c = _bg.copy()
    v = cv2.resize(frame(t), (VW, VID_H), interpolation=cv2.INTER_AREA)
    c[VID_Y:VID_Y + VID_H] = bar.draw(np.clip(v, 0, 255).astype(np.uint8), t, END)
    for a, b, text in subs:
        if a <= t < b: put(c, sub_img(text), VW / 2, VID_Y + VID_H + 110, min(1, (t - a) / 0.1, (b - t) / 0.1))
    return np.clip(c, 0, 255).astype(np.uint8)


# ---------- 声音 ----------
def mix():
    sr = 48000
    nar = subprocess.run(['ffmpeg', '-v', 'error', '-i', NARR, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    nar = np.frombuffer(nar, np.int16).astype(np.float32) / 32768
    k = int(round(NARR_OFF * sr))
    nar = nar[-k:] if k < 0 else np.concatenate([np.zeros(k, np.float32), nar])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'bgm.wav', '-af', 'acompressor=threshold=-32dB:ratio=3:attack=20:release=400:makeup=6',
                    '_bgm_c.wav'], check=True)
    _, bgm = wf.read('_bgm_c.wav'); bgm = bgm.astype(np.float32) / 32768; os.remove('_bgm_c.wav')
    n = int(END * sr); nar = np.pad(nar, (0, max(0, n - len(nar))))[:n]; bgm = np.pad(bgm, ((0, max(0, n - len(bgm))), (0, 0)))[:n]
    hop = sr // 100
    e = np.sqrt(np.convolve(nar ** 2, np.ones(hop * 5) / (hop * 5), 'same'))
    b, a = ss.butter(1, 2.0, 'low', fs=sr); duck = 1 - 0.55 * np.clip(ss.filtfilt(b, a, (e > 0.01).astype(np.float32)), 0, 1)
    mixed = bgm * 0.85 * duck[:, None] + nar[:, None] * 0.9
    mixed[-int(1.0 * sr):] *= np.linspace(1, 0, int(1.0 * sr))[:, None]
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
    if '--audio' in sys.argv:
        mix(); sys.exit()
    mix()
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{VW}x{VH}', '-r', str(FPS), '-i', '-',
                            '-i', 'final_audio.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium',
                            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', OUT], stdin=subprocess.PIPE)
    for k in range(int(END * FPS)):
        enc.stdin.write(final_frame(k / FPS).tobytes())
        if k % 900 == 0: print(f'{k / FPS:.0f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('->', OUT)
