"""从全身设定图里把每个角色抠出来（透明底 PNG）。

    python3 -I cut_full.py <设定图.png> <输出目录> <名字:x0:x1:y0:y1[:noholes]> ...

每个格子里站着一个人，格子要框住整个人（框进旁边的字也没关系，只留最大的一块）。
- 背景：格子四边颜色的中位数；从四边往里找连着的、跟背景差不多的像素。
- 脚下的影子：比背景暗一点的浅灰，只在格子最下面那一段，从背景往里再长一圈。
- 只留最大的一块（人）和跟它挨着的东西（手里拿的、背上背的）；字和碎点去掉。
- 被人围住的背景（胳膊和身子之间、两腿之间）：颜色几乎跟背景一样、面积够大的也挖掉。
  白衣服跟背景太像、被挖出洞的，在格子后面加 `:noholes` 不挖。
- 格子之间的竖分隔线（又细又长）不要。
- 边缘按跟背景的差别给半透明，去掉一圈背景色的毛边。
"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage

src, out = sys.argv[1], sys.argv[2]
sheet = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
os.makedirs(out, exist_ok=True)


def from_edges(mask):                                        # 跟格子四边连着的那些
    lab, _ = ndimage.label(mask)
    e = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    return np.isin(lab, e[e > 0])


for spec in sys.argv[3:]:
    name, *xy = spec.split(':'); holes = 'noholes' not in xy; x0, x1, y0, y1 = map(int, xy[:4])
    im = sheet[y0:y1, x0:x1]; h, w, _ = im.shape
    edge = np.concatenate([im[:3].reshape(-1, 3), im[-3:].reshape(-1, 3), im[:, :3].reshape(-1, 3), im[:, -3:].reshape(-1, 3)])
    BG = np.median(edge, axis=0)
    d = np.abs(im - BG).max(2); sat = im.max(2) - im.min(2)
    bg = from_edges(d <= 10)
    # 影子：最下面 15% 里，比背景暗一点、几乎没有颜色的灰，跟背景连着就算背景
    shadow = (d <= 70) & (sat <= 15) & (np.arange(h)[:, None] > h * .85)
    bg = from_edges(bg | shadow)
    fg = ~bg
    # 竖分隔线：这一行里左右都只有不到 5 像素宽、又上下连着 60 像素以上的细条，去掉（挨着人也去）
    thin = fg & ~ndimage.binary_opening(fg, structure=np.ones((1, 5)))
    tl, tn = ndimage.label(thin, structure=[[0, 1, 0], [0, 1, 0], [0, 1, 0]])
    for sl in ndimage.find_objects(tl):
        if sl[0].stop - sl[0].start >= 60: fg[sl] &= ~thin[sl]
    lab, n = ndimage.label(fg, structure=np.ones((3, 3)))
    sizes = ndimage.sum(fg, lab, range(1, n + 1))
    main = int(np.argmax(sizes)) + 1
    ys, xs = np.nonzero(lab == main); top, bot, left, right = ys.min(), ys.max(), xs.min(), xs.max()
    keep = lab == main
    for i, s in enumerate(sizes):                             # 挨着人的东西（离人 6 像素以内、够大）也留下
        if i + 1 == main or s < 150: continue
        yy, xx = np.nonzero(lab == i + 1)
        if xx.max() - xx.min() <= 6 and yy.max() - yy.min() >= 40: continue          # 竖分隔线
        if yy.min() >= top - 6 and yy.max() <= bot + 6 and xx.min() >= left - 6 and xx.max() <= right + 6 and \
           (ndimage.binary_dilation(lab == i + 1, iterations=6) & keep).any():
            keep |= lab == i + 1
    # 被人围住的背景（胳膊和身子之间、两腿之间）：颜色几乎跟背景一样、又够大的，也挖掉
    lab2, n2 = ndimage.label((d <= 3.5) & keep)
    for i in range(1, n2 + 1 if holes else 1):
        m = lab2 == i
        if m.sum() > 120: keep &= ~m
    # 边缘：离背景 2 像素以内的，按跟背景的差别给半透明，再把背景色“减掉”
    ring = keep & ndimage.binary_dilation(~keep, iterations=2)
    alpha = keep.astype(np.float32)
    a = np.clip(d / 60, 0, 1); alpha[ring] = a[ring]
    rgb = im.copy()
    with np.errstate(divide='ignore', invalid='ignore'):
        un = (im - (1 - alpha[..., None]) * BG) / np.maximum(alpha[..., None], 1e-3)
    rgb[ring] = np.clip(un[ring], 0, 255)
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    ys, xs = np.nonzero(alpha > .02); pad = 6
    rgba = rgba[max(0, ys.min() - pad):ys.max() + pad + 1, max(0, xs.min() - pad):xs.max() + pad + 1]
    Image.fromarray(rgba, 'RGBA').save(os.path.join(out, name + '.png'))
    print(f'{name}: {rgba.shape[1]}x{rgba.shape[0]}  背景 {BG.round().astype(int)}')
