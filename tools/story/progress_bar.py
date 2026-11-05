"""给讲故事的视频加进度条：底下一条细线，仙人掌柜站在线上，跟着进度一蹦一蹦往前走。

    python3 tools/story/progress_bar.py 输入.mp4 输出.mp4 [--mascot 透明底.png]

频道主 11 月 5 日要的样子：
- 只要一条线，不要分段、不要每段讲什么的文字；
- 用仙人掌柜的形象（默认 refs/讲故事/仙人掌柜/全身_透明底.png）。

做法：用 ffmpeg 把视频一帧帧解出来，用 numpy 画线、贴仙人掌，再压回去，声音原样带上。
- 线在画面最下面，走过的部分是浅绿色，没走的是半透明白色；
- 仙人掌高约画面的 8%，脚踩在线上，每秒蹦两下，蹦的时候左右歪一点。
"""
import argparse, json, math, os, subprocess
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--mascot', default=os.path.join(ROOT, 'refs/讲故事/仙人掌柜/全身_透明底.png'))
a = ap.parse_args()

info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                                  '-show_entries', 'format=duration', '-of', 'json', a.src], capture_output=True, text=True).stdout)
W, H = info['streams'][0]['width'], info['streams'][0]['height']
num, den = map(int, info['streams'][0]['r_frame_rate'].split('/')); fps = num / den
dur = float(info['format']['duration'])
nframes = int(round(dur * fps))

# ---------- 线 ----------
y_line = H - round(H * 0.022)                  # 1080p 时离底边 24 px
th = max(3, round(H * 0.0045))                 # 1080p 时 5 px
x0, x1 = 0, W
PLAYED = np.array([139, 213, 111], np.float32)  # 浅仙人掌绿
REST = np.array([255, 255, 255], np.float32)

# ---------- 仙人掌（先转好一组角度，省得每帧都转） ----------
m = Image.open(a.mascot).convert('RGBA')
m = m.crop(m.getbbox())
mh = round(H * 0.08); mw = round(m.width * mh / m.height)
m = m.resize((mw, mh), Image.LANCZOS)
ANG = np.linspace(-6, 6, 25)
sprites = []
for ang in ANG:
    r = m.rotate(ang, resample=Image.BICUBIC, expand=True, center=(mw / 2, mh))  # 绕脚底转
    sprites.append(np.asarray(r, np.float32))


def blend(frame, sprite, x, y):
    h, w = sprite.shape[:2]
    fx0, fy0 = max(0, x), max(0, y); fx1, fy1 = min(W, x + w), min(H, y + h)
    if fx0 >= fx1 or fy0 >= fy1: return
    s = sprite[fy0 - y:fy1 - y, fx0 - x:fx1 - x]
    al = s[..., 3:4] / 255
    reg = frame[fy0:fy1, fx0:fx1].astype(np.float32)
    frame[fy0:fy1, fx0:fx1] = (reg * (1 - al) + s[..., :3] * al).astype(np.uint8)


dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', f'{num}/{den}', '-i', '-',
                        '-i', a.src, '-map', '0:v', '-map', '1:a?', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                        '-c:a', 'copy', '-shortest', a.dst], stdin=subprocess.PIPE)
size = W * H * 3
i = 0
while True:
    buf = dec.stdout.read(size)
    if len(buf) < size: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
    t = i / fps
    p = min(1.0, t / max(dur - 1 / fps, 1e-6))
    xp = round(x0 + (x1 - x0) * p)
    ya, yb = y_line - th // 2, y_line - th // 2 + th
    band = f[ya - 1:yb + 1].astype(np.float32)        # 先压暗一点，线在亮画面上也看得清
    band *= 0.75
    f[ya - 1:yb + 1] = band.astype(np.uint8)
    seg = f[ya:yb, :xp].astype(np.float32); f[ya:yb, :xp] = (seg * 0.1 + PLAYED * 0.9).astype(np.uint8)
    seg = f[ya:yb, xp:].astype(np.float32); f[ya:yb, xp:] = (seg * 0.6 + REST * 0.4).astype(np.uint8)
    hop = abs(math.sin(math.pi * 2 * t))                # 每秒蹦两下
    k = int(round((math.sin(math.pi * 2 * t) * 0.5 + 0.5) * (len(ANG) - 1)))
    sp = sprites[k]
    sx = xp - sp.shape[1] // 2
    sy = y_line - sp.shape[0] + round(th * 0.5) - round(hop * H * 0.008)
    blend(f, sp, sx, sy)
    enc.stdin.write(f.tobytes())
    i += 1
enc.stdin.close(); enc.wait(); dec.wait()
print(f'{a.dst}  {W}x{H}  {i} 帧  {dur:.1f} 秒')
