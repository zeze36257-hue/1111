"""从一张多人设定图里把每个角色抠出来（透明底 PNG）。

    python3 -I cut_sheet.py <设定图.png> <输出目录> [--bottom-only] <名字:x0:x1:y0:y1> ... [wall:x0:y0:x1:y1 ...]

每个角色是一块被切平了底边的半身像，x0–x1、y0–y1 是它所在的格子。
- 背景：从图的四边往里找连着的、颜色跟背景差不多的像素。
- 每块的底边（和左右被切平的边）先“砌墙”，免得浅色衣服顺着切口被当成背景。
- 字和小碎块按面积去掉；--bottom-only 时只留碰到底边的部分（设定图上写了字的用这个）。
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
args = sys.argv[3:]; BOTTOM_ONLY = '--bottom-only' in args; args = [a for a in args if a != '--bottom-only']
panels = [(q[0], *map(int, q[1:])) for q in (p.split(':') for p in args) if q[0] != 'wall']
extra = [tuple(map(int, q[1:])) for q in (p.split(':') for p in args) if q[0] == 'wall']   # wall:x0:y0:x1:y1 手动砌的墙（一条线段）
os.makedirs(out, exist_ok=True)
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W, _ = im.shape
border = np.concatenate([im[:4].reshape(-1, 3), im[-4:].reshape(-1, 3), im[:, :4].reshape(-1, 3), im[:, -4:].reshape(-1, 3)])
BG = np.median(border, axis=0); print('背景色', BG)
close = np.abs(im - BG).max(2) <= 6                         # 背景很均匀；放宽了浅色衣服、白皮肤会被当成背景

def flood(cand):
    lab, _ = ndimage.label(cand)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])); edge = edge[edge > 0]
    return np.isin(lab, edge)

bg0 = flood(close)
lab0, n0 = ndimage.label(~bg0, structure=np.ones((3, 3)))
size0 = ndimage.sum(~bg0, lab0, range(1, n0 + 1))
big0 = np.isin(lab0, [i + 1 for i, s in enumerate(size0) if s > 1500])
# 墙：每块底边一条 8 行宽的带子（底边常有一道浅色细线，背景会顺着它横着流进白色的手、衬衫）；左右被切平的边也砌上
cand = close.copy(); walls = np.zeros_like(close)
info = []
for name, x0, x1, gy0, gy1 in panels:
    m = big0[gy0:gy1, x0:x1]; ys = np.nonzero(m.any(1))[0]; yb = ys.max() + gy0
    cols = np.nonzero(m[yb - gy0 - 3:yb - gy0 + 1].any(0))[0] + x0; xa, xb = cols.min(), cols.max()
    walls[yb - 5:yb + 3, xa - 2:xb + 3] = True
    for xe in (xa, xb):                                       # 竖直切边：从底往上，这一列一直有图的那一段
        y = yb
        while y > gy0 and big0[y, xe]: y -= 1
        if yb - y > 20: walls[y:yb + 1, max(0, xe - 2 if xe == xa else xe + 1):xe + (0 if xe == xa else 3)] = True
    info.append((name, x0, x1, gy0, yb))
for x0_, y0_, x1_, y1_ in extra:
    for t in np.linspace(0, 1, 2 * max(abs(x1_ - x0_), abs(y1_ - y0_)) + 1):
        x, y = int(round(x0_ + (x1_ - x0_) * t)), int(round(y0_ + (y1_ - y0_) * t)); walls[y - 1:y + 2, x - 1:x + 2] = True
cand &= ~walls
bg = flood(cand)
# 墙本身：颜色像背景、旁边又是背景的，也算背景（不留一道细线）
nb = ndimage.binary_dilation(bg) & walls & close
bg |= nb
fg = ~bg
lab, n = ndimage.label(fg, structure=np.ones((3, 3)))
sizes = ndimage.sum(fg, lab, range(1, n + 1))
keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 1500])
lum = im.min(2); bgl = BG.min()
for name, x0, x1, gy0, yb in info:
    yb -= 6                                                   # 底边那条墙带子整个切掉
    k = keep[gy0:yb + 1, x0:x1]
    if BOTTOM_ONLY:                                           # 只留碰到底边的（去掉写在旁边的字）
        lb, _ = ndimage.label(k, structure=np.ones((3, 3))); k = np.isin(lb, np.unique(lb[-3:])[1:])
    ys, xs = np.nonzero(k); ya, yz, xa_, xb_ = max(0, ys.min() - 4), yb + 1 - gy0, max(0, xs.min() - 4), min(x1 - x0, xs.max() + 5)
    sl = (slice(gy0 + ya, gy0 + yz), slice(x0 + xa_, x0 + xb_))
    sub, kk, bgs, l = im[sl], k[ya:yz, xa_:xb_], bg[sl], lum[sl]
    # 边缘一圈（挨着背景的）：按“墨 + 背景色”的混合反推不透明度
    edge = kk & ndimage.binary_dilation(bgs & ~kk, iterations=2)
    alpha = kk.astype(np.float32)
    alpha[edge] = np.clip((bgl - l[edge]) / (bgl - 70), 0, 1)
    rgb = sub.copy()
    with np.errstate(divide='ignore', invalid='ignore'):
        un = (sub - (1 - alpha[..., None]) * BG) / np.maximum(alpha[..., None], 1e-3)
    rgb[edge] = np.clip(un[edge], 0, 255); rgb[alpha == 0] = 0
    Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8), 'RGBA').save(os.path.join(out, name + '.png'))
    print(name, '格子', x0, x1, gy0, '底边', yb, '大小', rgb.shape[1], 'x', rgb.shape[0])
