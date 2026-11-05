"""给讲故事的视频加进度条：底下一条细线，仙人掌柜站在线上，跟着进度一蹦一蹦往前走。

    python3 tools/story/progress_bar.py 输入.mp4 输出.mp4 [--mascot 透明底.png]   # 给现成的视频加
    from progress_bar import Bar; bar = Bar(W, H); bar.draw(frame, t, total)       # 出片时直接画（story01/render.py）

频道主 11 月 5 日要的样子：
- 只要一条线，不要分段、不要每段讲什么的文字；
- 用仙人掌柜的形象（默认 refs/讲故事/仙人掌柜/全身_透明底.png）。

画法：
- 线在画面最下面，走过的部分是浅绿色，没走的是半透明白色，线下面先压暗一点，亮画面上也看得清；
- 仙人掌高约画面的 8%，脚踩在线上，每秒蹦两下，蹦的时候左右歪一点；
- 沉重的故事（第 2 集冰雕连）用 Bar(W, H, calm=True)：不蹦，只慢慢地轻轻晃。
"""
import argparse, json, math, os, subprocess
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MASCOT = os.path.join(ROOT, 'refs/讲故事/仙人掌柜/全身_透明底.png')
PLAYED = np.array([139, 213, 111], np.float32)   # 浅仙人掌绿
REST = np.array([255, 255, 255], np.float32)


class Bar:
    def __init__(self, W, H, mascot=MASCOT, calm=False):
        self.W, self.H, self.calm = W, H, calm      # calm：沉重的故事里不蹦，只是慢慢地轻轻晃（第 2 集冰雕连起）
        self.y = H - round(H * 0.022)             # 1080p 时离底边 24 px
        self.th = max(3, round(H * 0.0045))       # 1080p 时 5 px
        m = Image.open(mascot).convert('RGBA'); m = m.crop(m.getbbox())
        mh = round(H * 0.08); mw = round(m.width * mh / m.height)
        m = m.resize((mw, mh), Image.LANCZOS)
        self.angles = np.linspace(-6, 6, 25)
        self.sprites = [np.asarray(m.rotate(a, resample=Image.BICUBIC, expand=True, center=(mw / 2, mh)), np.float32) for a in self.angles]

    def _blend(self, f, s, x, y):
        h, w = s.shape[:2]
        x0, y0, x1, y1 = max(0, x), max(0, y), min(self.W, x + w), min(self.H, y + h)
        if x0 >= x1 or y0 >= y1: return
        s = s[y0 - y:y1 - y, x0 - x:x1 - x]; al = s[..., 3:4] / 255
        f[y0:y1, x0:x1] = (f[y0:y1, x0:x1].astype(np.float32) * (1 - al) + s[..., :3] * al).astype(np.uint8)

    def draw(self, f, t, total):
        """在 RGB 的 uint8 帧 f 上画进度条（原地改）。"""
        p = min(1.0, max(0.0, t / total))
        xp = round(self.W * p)
        ya, yb = self.y - self.th // 2, self.y - self.th // 2 + self.th
        f[ya - 1:yb + 1] = (f[ya - 1:yb + 1].astype(np.float32) * 0.75).astype(np.uint8)
        f[ya:yb, :xp] = (f[ya:yb, :xp].astype(np.float32) * 0.1 + PLAYED * 0.9).astype(np.uint8)
        f[ya:yb, xp:] = (f[ya:yb, xp:].astype(np.float32) * 0.6 + REST * 0.4).astype(np.uint8)
        s = math.sin(math.pi * 2 * t * (0.4 if self.calm else 1.0))
        hop = abs(s) * (0.2 if self.calm else 1.0)
        sp = self.sprites[int(round((s * (0.2 if self.calm else 0.5) + 0.5) * (len(self.angles) - 1)))]
        self._blend(f, sp, xp - sp.shape[1] // 2, self.y - sp.shape[0] + round(self.th * 0.5) - round(hop * self.H * 0.008))
        return f


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('dst'); ap.add_argument('--mascot', default=MASCOT)
    a = ap.parse_args()
    info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
                                      '-show_entries', 'format=duration', '-of', 'json', a.src], capture_output=True, text=True).stdout)
    W, H = info['streams'][0]['width'], info['streams'][0]['height']
    num, den = map(int, info['streams'][0]['r_frame_rate'].split('/')); fps = num / den
    dur = float(info['format']['duration'])
    bar = Bar(W, H, a.mascot)
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', f'{num}/{den}', '-i', '-',
                            '-i', a.src, '-map', '0:v', '-map', '1:a?', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                            '-c:a', 'copy', '-shortest', a.dst], stdin=subprocess.PIPE)
    size, i = W * H * 3, 0
    while True:
        buf = dec.stdout.read(size)
        if len(buf) < size: break
        f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
        enc.stdin.write(bar.draw(f, i / fps, dur - 1 / fps).tobytes()); i += 1
    enc.stdin.close(); enc.wait(); dec.wait()
    print(f'{a.dst}  {W}x{H}  {i} 帧  {dur:.1f} 秒')
