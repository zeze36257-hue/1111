"""第 2 集出片：按 shots.py 把图和动画排成 16:9 的画面，加慢运镜、飘雪、转场、字幕、仙人掌柜进度条，再配上声音。

    python3 render.py                       # 出整片 -> 冰雕连_第2集.mp4
    python3 render.py --frames 3,7,38,190   # 只出这几秒的截图（frames/ 里），检查画面用

跟第 1 集（story01/render.py）一样的地方：静态图慢慢推近、拉远、平移（每秒 1.2% 左右）；同一段 0.5 秒叠化，段落之间黑场；
字幕按标点切成短句，放在进度条上面；配乐在旁白说话时自动压低，整体响度 -16 LUFS。
这一集新加的：
- 开头 10 秒没有旁白：黑场 → 眨眼（眼皮睁开、闭上、再睁开，从糊到清楚）→ 照明弹和远处的炮火；旁白整体往后挪 NARR_OFF 秒。
- 飘雪：静态图上加三层远近不同的雪花（+snow）。
- 片名卡“冰雕连”、纸条上的两句话（宋体大字，跟着旁白一行一行出来）、片尾“致敬 冰雕连”。
- 进度条上的仙人掌柜不蹦，只轻轻晃（calm）。
"""
import json, math, os, re, subprocess, sys
from collections import OrderedDict
import cv2
import numpy as np
import scipy.io.wavfile as wf
import scipy.signal as ss
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from shots import SHOTS, END, NARR_OFF, QUOTE, NO_SUB

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, os.path.join(HERE, '..', 'tools', 'story'))
from progress_bar import Bar

W, H, FPS = 1920, 1080, 30
XF, FADE_IN, FADE_OUT = 0.5, 0.5, 0.6
OUT = '冰雕连_第2集.mp4'
NARR = '/tmp/claude-0/-home-user-1111/1241d7d4-95e7-5361-a983-3f8317d8eee4/scratchpad/ep2/narr/旁白.wav'
if not os.path.exists(NARR): NARR = 'narration.m4a'
BLACK = ('X', 'TITLE', 'ENDCARD')               # 这几种是黑底的：前后镜头淡出淡入到黑，不叠化

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


def parse(move):
    """'in+snow1+xf2.4' -> ('in', 雪量 0.5, 叠化 2.4, 播放速度 1.0)"""
    opts = move.split('+') if move else ['']
    base, snow, xf, rate = opts[0], 0.0, None, 1.0
    for o in opts[1:]:
        if o.startswith('snow'): snow = {'snow': 1.0, 'snow1': 0.55, 'snow2': 1.6}[o]
        elif o.startswith('xf'): xf = float(o[2:])
    if base.startswith('clip@'): base, rate = 'clip', float(base[5:])
    return base, snow, xf, rate


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


def video(name, t_in, rate=1.0):
    fr, fps = clip(name)
    f = fr[min(len(fr) - 1, int(t_in * rate * fps))]
    f = cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32)
    f = cv2.addWeighted(f, 1.35, cv2.GaussianBlur(f, (0, 0), 1.4), -0.35, 0)
    return np.clip(f + np.random.default_rng(int(t_in * 1000)).normal(0, 2.5, (H, W, 1)), 0, 255)


# ---------- 飘雪：三层，远的小、慢、清楚，近的大、快、糊 ----------
class Snow:
    def __init__(self, n=520, seed=7):
        r = np.random.default_rng(seed)
        self.x0, self.y0 = r.uniform(0, W, n), r.uniform(0, H, n)
        self.z = r.uniform(0, 1, n) ** 1.6                 # 大多数在远处
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

# ---------- 开头的眨眼 ----------
_NX = ((np.arange(W, dtype=np.float32) - W / 2) / (W / 2))[None, :]
_NY = ((np.arange(H, dtype=np.float32) - H / 2) / (H / 2))[:, None]
_R2 = _NX ** 2 + _NY ** 2


def keys(t, ks):
    for (t0, v0), (t1, v1) in zip(ks, ks[1:]):
        if t <= t1: return v0 + (v1 - v0) * ease((t - t0) / max(1e-6, t1 - t0))
    return ks[-1][1]


def blink(f, t_in):
    """眼皮：半睁（糊）→ 闭上 → 慢慢完全睁开、变清楚。边上一圈冷白的霜。"""
    a = keys(t_in, [(0, 0), (0.45, 0), (1.25, 0.32), (1.6, 0.28), (1.9, 0.0), (2.15, 0.0), (3.2, 1.0), (9, 1.0)])
    blur = keys(t_in, [(0, 16), (1.6, 13), (2.2, 9), (3.4, 1.5), (3.9, 0.0), (9, 0)])
    if blur > 0.3: f = cv2.GaussianBlur(f, (0, 0), blur)
    h = a * 1.35 * np.sqrt(np.clip(1 - (_NX / 1.35) ** 2, 0, 1))
    m = np.clip(1 - (np.abs(_NY) - h) / 0.10, 0, 1) if a > 0 else np.zeros((H, W), np.float32)
    frost = np.clip((_R2 - 0.55) * 1.2, 0, 1) * 0.35 * (1 - 0.6 * min(1, t_in / 4))
    f = f + (235 - f) * frost[..., None]
    return f * m[..., None]


# ---------- 远处炮火的闪光（开头照明弹那个镜头） ----------
FLASHES = [(6.6, 0.55), (8.2, 0.30), (9.5, 0.45)]
_GLOW = np.clip(1.15 - (_NY + 1) / 1.4, 0, 1)[..., None] * np.array([255, 160, 80], np.float32)


def flashes(f, t):
    for te, s in FLASHES:
        if te <= t < te + 1.2:
            k = s * math.exp(-(t - te) / 0.28)
            f = f + _GLOW * k * (0.6 if (t - te) < 0.06 else 1.0)
    return f


# ---------- 字卡（片名、纸条、片尾） ----------
def text_img(text, font, size, color, glow=10):
    fnt = ImageFont.truetype(font, size)
    bb = fnt.getbbox(text)
    pad = glow * 3 + 10
    im = Image.new('RGBA', (bb[2] - bb[0] + pad * 2, bb[3] - bb[1] + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im); d.text((pad - bb[0], pad - bb[1]), text, font=fnt, fill=color + (255,))
    if glow:
        g = im.split()[3].filter(ImageFilter.GaussianBlur(glow))
        base = Image.new('RGBA', im.size, (0, 0, 0, 0)); base.putalpha(g.point(lambda v: int(v * 0.55)))
        sh = Image.new('RGBA', im.size, (0, 0, 0, 255)); sh.putalpha(g.point(lambda v: int(v * 0.8)))
        im = Image.alpha_composite(sh, im)
    return np.asarray(im, np.float32)


def put(f, s, cx, cy, alpha):
    h, w = s.shape[:2]; x, y = int(cx - w / 2), int(cy - h / 2)
    x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    s = s[y0 - y:y1 - y, x0 - x:x1 - x]; al = s[..., 3:4] / 255 * alpha
    f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - al) + s[..., :3] * al
    return f


T_TITLE = text_img('冰雕连', 'fonts/title.ttf', 190, (238, 242, 248), glow=14)
T_SUB = text_img('长津湖 · 1950', 'fonts/sub.ttf', 44, (196, 206, 218), glow=6)
T_SALUTE = text_img('致敬', 'fonts/title.ttf', 84, (225, 230, 238), glow=10)
T_END = text_img('冰雕连', 'fonts/title.ttf', 170, (240, 243, 248), glow=14)
Q_IMG = [[text_img(s, 'fonts/quote.ttf', 76, (246, 238, 222), glow=8) for s in lines] for _, _, lines in QUOTE]


def title_card(t_in, dur):
    f = snow.draw(np.zeros((H, W, 3), np.float32), t_in + 37, 0.5)
    a = min(1, t_in / 0.9, (dur - t_in) / 0.7)
    f = put(f, T_TITLE, W / 2, H / 2 - 30, max(0, a))
    return put(f, T_SUB, W / 2, H / 2 + 120, max(0, min(1, (t_in - 0.6) / 0.8, (dur - t_in) / 0.7)))


def end_card(t, a, b):
    f = snow.draw(np.zeros((H, W, 3), np.float32), t, 0.6)
    out = max(0.0, min(1.0, (b - 0.4 - t) / 1.6))
    f = put(f, T_SALUTE, W / 2, H / 2 - 120, max(0, min(1, (t - 259.0) / 0.8)) * out)
    return put(f, T_END, W / 2, H / 2 + 40, max(0, min(1, (t - 259.9) / 1.0)) * out)


_qbg = None


def quote(t, a, b):
    global _qbg
    if _qbg is None:
        src = cv2.cvtColor(cv2.imread('img/z2.jpg'), cv2.COLOR_BGR2RGB)
        _qbg = cv2.GaussianBlur(cv2.resize(src, (int(W * 1.1), int(H * 1.1)), interpolation=cv2.INTER_AREA), (0, 0), 9).astype(np.float32) * 0.36
    p = ease((t - a) / (b - a)); z = 1 + 0.06 * p
    M = np.float32([[z, 0, W / 2 - z * _qbg.shape[1] / 2], [0, z, H / 2 - z * _qbg.shape[0] / 2]])
    f = cv2.warpAffine(_qbg, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    f = snow.draw(f, t, 0.35)
    for (qa, qb, lines), imgs in zip(QUOTE, Q_IMG):
        nxt = [q[0] for q in QUOTE if q[0] > qa]
        end = (nxt[0] - 0.7) if nxt else b - 0.3
        if not (qa - 0.2 <= t < end + 0.6): continue
        tot = sum(len(s) for s in lines); t0 = qa
        n = len(lines); lh = 112; y0 = H / 2 - (n - 1) * lh / 2 - 20
        for k, (s, im) in enumerate(zip(lines, imgs)):
            al = max(0, min(1, (t - t0 + 0.15) / 0.6, (end + 0.6 - t) / 0.6))
            f = put(f, im, W / 2, y0 + k * lh + (1 - al) * 8, al)
            t0 += (qb - qa) * len(s) / tot
    return f


def shot_frame(i, t):
    a, b, src, move = SHOTS[i]
    base, sn, _, rate = parse(move)
    if src == 'X': return np.zeros((H, W, 3), np.float32)
    if src == 'TITLE': return title_card(t - a, b - a)
    if src == 'ENDCARD': return end_card(t, a, b)
    if src == 'QUOTE': return quote(t, a, b)
    if src.startswith('v_'):
        f = video(src, max(0.0, t - a), rate)
        if src == 'v_o2': f = flashes(f, t)
    elif base == 'blink':
        f = snow.draw(still(src, 'in', (t - a) / (b - a), b - a), t, sn)
        return blink(f, t - a)
    else:
        f = still(src, base, (t - a) / (b - a), b - a)
    return snow.draw(f, t, sn) if sn else f


def xf_len(i):
    """镜头 i 和 i+1 之间叠化多久。"""
    return parse(SHOTS[i + 1][3])[2] or XF


def frame(t):
    i = next((k for k, s in enumerate(SHOTS) if s[0] <= t < s[1]), None)
    if i is None: return np.zeros((H, W, 3), np.float32)
    a, b, src, _ = SHOTS[i]
    f = shot_frame(i, t)
    prev = SHOTS[i - 1][2] if i > 0 else 'X'
    nxt = SHOTS[i + 1][2] if i + 1 < len(SHOTS) else 'END'
    if src in BLACK: return f
    if prev in BLACK and t - a < FADE_IN: f *= ease((t - a) / FADE_IN)
    if nxt in BLACK and b - t < FADE_OUT: f *= ease((b - t) / FADE_OUT)
    if nxt == 'END' and b - t < 1.2: f *= ease((b - t) / 1.2)
    if nxt not in BLACK and nxt != 'END':
        X = xf_len(i)
        if b - t < X / 2:
            w = ease((t - (b - X / 2)) / X)
            f = f * (1 - w) + shot_frame(i + 1, t) * w
    if prev not in BLACK and i > 0:
        X = xf_len(i - 1)
        if t - a < X / 2:
            w = ease(0.5 + (t - a) / X)
            f = f * w + shot_frame(i - 1, t) * (1 - w)
    return f


# ---------- 字幕 ----------
FONT = ImageFont.truetype('fonts/sub.ttf', 46)


def ts(x):
    h, m, r = x.split(':'); s, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000


subs = []
for blk in open('narration.srt', encoding='utf-8').read().strip().split('\n\n'):
    L = blk.split('\n')
    if int(L[0]) in NO_SUB: continue
    a, b = (ts(x) + NARR_OFF for x in L[1].split(' --> ')); text = L[2]
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


bar = Bar(W, H, calm=True)


def final_frame(t):
    f = draw_subs(frame(t), t)
    f = np.clip(f, 0, 255).astype(np.uint8)
    return bar.draw(f, t, END)


# ---------- 声音 ----------
def mix():
    sr = 48000
    nar = subprocess.run(['ffmpeg', '-v', 'error', '-i', NARR, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    nar = np.concatenate([np.zeros(int(NARR_OFF * sr), np.float32), np.frombuffer(nar, np.int16).astype(np.float32) / 32768])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'bgm.wav', '-af', 'acompressor=threshold=-32dB:ratio=3:attack=20:release=400:makeup=6',
                    '_bgm_c.wav'], check=True)
    _, bgm = wf.read('_bgm_c.wav'); bgm = bgm.astype(np.float32) / 32768; os.remove('_bgm_c.wav')
    n = int(END * sr); nar = np.pad(nar, (0, max(0, n - len(nar))))[:n]; bgm = np.pad(bgm, ((0, max(0, n - len(bgm))), (0, 0)))[:n]
    hop = sr // 100
    e = np.sqrt(np.convolve(nar ** 2, np.ones(hop * 5) / (hop * 5), 'same'))
    talk = (e > 0.01).astype(np.float32)
    b, a = ss.butter(1, 2.0, 'low', fs=sr); duck = 1 - 0.55 * np.clip(ss.filtfilt(b, a, talk), 0, 1)
    mixed = bgm * 0.85 * duck[:, None] + nar[:, None] * 0.9
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
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-i', 'final_audio.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium',
                            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', OUT], stdin=subprocess.PIPE)
    nf = int(END * FPS)
    for k in range(nf):
        enc.stdin.write(final_frame(k / FPS).tobytes())
        if k % 900 == 0: print(f'{k / FPS:.0f}s', flush=True)
    enc.stdin.close(); enc.wait()
    print('->', OUT)
