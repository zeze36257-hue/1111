"""把主人公肩上那只猫的眼睛换成品牌色：画面左边那只橙、右边那只青（跟以前的小黑一样）。

    python3 -I tools/wojak/cat_eyes.py characters/hero/ref.png characters/hero/base.png

原图的猫眼是米白色的一圈（中间是黑瞳孔，有一点白高光）。按亮度上色：米白的地方变成品牌色，
最亮的高光还是白的，黑瞳孔不变。眼睛的位置是在原图上量的（1024×1536）。
"""
import sys
import numpy as np
from PIL import Image

ORANGE, TEAL = np.array([242, 161, 74]), np.array([79, 214, 196])
EYES = [((353.5, 190.5), (11, 8), ORANGE), ((394, 178.5), (9.5, 10), TEAL)]   # 中心、半径（多留 1.5 像素）、颜色
im = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(np.float32)
H, W, _ = im.shape
yy, xx = np.mgrid[0:H, 0:W]
L = im.mean(2)
out = im.copy()
for (cx, cy), (rx, ry), col in EYES:
    m = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1
    t = np.clip(L / 205, 0, 1)[..., None]                       # 米白（约 200）→ 满色；暗的边按比例
    c = col * t
    w = np.clip((L - 228) / 25, 0, 1)[..., None]                # 高光（比米白更亮的）留白
    c = c * (1 - w) + 255 * w
    out[m] = c[m]
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(sys.argv[2])
print('写好了', sys.argv[2])
