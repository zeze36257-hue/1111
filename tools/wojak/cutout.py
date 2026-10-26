"""白底抠图：从画面四边往里找连着的白色当背景，边缘按墨色深浅给半透明。 python3 -I cutout.py in.png out.png"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32)
lum = im.min(axis=2)
cand = lum > 232
lab, n = ndimage.label(cand)
edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])); edge = edge[edge > 0]
bg = np.isin(lab, edge)
# 边缘一圈（背景往外扩 3 像素里的非背景像素）：按“墨 + 白”的混合反推不透明度
near = ndimage.binary_dilation(bg, iterations=3) & ~bg
alpha = np.ones(lum.shape, np.float32); alpha[bg] = 0
a = np.clip((255 - lum) / 180, 0, 1); alpha[near] = a[near]
rgb = im.copy()
with np.errstate(divide='ignore', invalid='ignore'):
    un = (im - (1 - alpha[..., None]) * 255) / np.maximum(alpha[..., None], 1e-3)
rgb[near] = np.clip(un[near], 0, 255)
out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
ys, xs = np.nonzero(alpha > .02); pad = 8
out = out[max(0, ys.min() - pad):ys.max() + pad, max(0, xs.min() - pad):xs.max() + pad]
Image.fromarray(out, 'RGBA').save(sys.argv[2]); print(sys.argv[2], out.shape)
