"""把照片里的人“涂”成频道的形象：头换成画好的猫头，露出来的皮肤涂成形象的颜色，衣服和背景不动。
（“读文案”短视频的形象方案，还没定；用法和装法见同目录的 README.md）

    python catify.py <模型目录> <照片> <输出.png> <从左到右每个人的样子，逗号隔开>

样子：black（黑猫头，左橙右青的眼睛，没有嘴，露出来的皮肤涂黑，外面一圈米白细边）、blackn（同上，不要细边）、
white（白猫头，蓝眼睛、粉鼻子、ω 嘴；皮肤和长头发不动）、beanie（猫耳毛线帽 + 很简单的白脸，皮肤涂白）、skip（这个人不动）。
- 分割：MediaPipe selfie_multiclass（背景 / 头发 / 身上的皮肤 / 脸 / 衣服 / 其他）。
- 分人：MediaPipe 姿态模型给每个人一张蒙版；没认出来的人，用剩下的人身上的部分。
- 头：头发顶到下巴定猫头的大小和位置；鼻子相对两只耳朵的位置定朝向（转头时眼睛往那边挪），两只眼睛的连线定歪头。
- 皮肤：有把握的皮肤往外长到“可能是皮肤”的地方（逆光、暗的胳膊也能涂上），留一点原来的明暗（看得出手指）；脸整片涂平。
"""
import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision

M, src, out, looks = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(',')
rgb = np.asarray(Image.open(src).convert('RGB')); H, W = rgb.shape[:2]
mimg = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=mpt.BaseOptions(model_asset_path=f'{M}/selfie_multiclass_256x256.tflite'), output_category_mask=True, output_confidence_masks=True))
r = seg.segment(mimg); cat = r.category_mask.numpy_view().reshape(H, W).copy()
conf = [c.numpy_view().reshape(H, W).astype(np.float32) for c in r.confidence_masks]; seg.close()
pl = vision.PoseLandmarker.create_from_options(vision.PoseLandmarkerOptions(
    base_options=mpt.BaseOptions(model_asset_path=f'{M}/pose_landmarker_heavy.task'), num_poses=4, output_segmentation_masks=True,
    min_pose_detection_confidence=.3, min_pose_presence_confidence=.3))
pr = pl.detect(mimg); pl.close()

STYLE = {
    'black': dict(fur=(20, 20, 22), line=(236, 230, 218), lw=.012, eyes=((242, 161, 74), (79, 214, 196)), inner=(52, 52, 58), nose=None, mouth=False, paint_hair=True),
    'blackn': dict(fur=(20, 20, 22), line=(20, 20, 22), lw=0, eyes=((242, 161, 74), (79, 214, 196)), inner=(52, 52, 58), nose=None, mouth=False, paint_hair=True),
    'white': dict(fur=(250, 246, 240), line=(40, 36, 36), lw=.012, eyes=((120, 185, 240), (120, 185, 240)), inner=(244, 182, 194), nose=(240, 150, 165), mouth=True, paint_hair=False, skin=False),
    # B：猫耳毛线帽 + 很简单的白脸（接现在 Wojak 主人公的帽子），露出来的皮肤是白的
    'beanie': dict(fur=(246, 243, 236), line=(28, 28, 30), lw=.02, eyes=((28, 28, 30), (28, 28, 30)), inner=(60, 60, 66), nose=None, mouth=True, paint_hair=True, kind='beanie', hair=(22, 22, 24)),
}

# ---------------------------------------------------------------- 每个人一张蒙版
person = cat != 0
people = []
for lm, sm in zip(pr.pose_landmarks, pr.segmentation_masks or []):
    m = sm.numpy_view().reshape(H, W) > .5
    people.append(dict(mask=m & person, pts=np.array([(q.x * W, q.y * H) for q in lm])))
left = person & ~np.any([p['mask'] for p in people], axis=0) if people else person
head = ndimage.binary_closing((cat == 1) | (cat == 3), iterations=4) & left
lab, n = ndimage.label(head)
for i in range(1, n + 1):                                                        # 姿态模型没认出来的人：剩下的头 + 跟它连着的身体
    comp = lab == i
    if comp.sum() < H * W * .004: continue
    people.append(dict(mask=ndimage.binary_propagation(comp, mask=left), pts=None))
people.sort(key=lambda p: ndimage.center_of_mass(p['mask'])[1])

# ---------------------------------------------------------------- 猫头（画在 4 倍大的画布上再缩小）；返回图和“头的椭圆”在图里的位置
def cat_head(S0, yaw, st):
    S = S0 * 4; im = Image.new('RGBA', (S, int(S * 1.12)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fur, line = st['fur'] + (255,), st['line'] + (255,)
    cx, cy = S * .5, S * .66
    def ear(side, col, grow, inner=False):
        k = 1 - .2 * max(0, side * -yaw); bx = cx + side * S * .26 + yaw * S * .05
        if inner: pts = [(bx - side * S * .09 * k, cy - S * .2), (bx + side * S * .02 * k, cy - S * .47 * k), (bx + side * S * .1 * k, cy - S * .22)]
        else: pts = [(bx - side * S * .2 * k - grow * side, cy - S * .1), (bx + side * S * .02 * k, cy - S * .58 * k - grow * 1.6), (bx + side * S * .17 * k + grow * side, cy - S * .16)]
        d.polygon(pts, fill=col)
    lw = S * st['lw']
    if lw:
        for s in (-1, 1): ear(s, line, lw)
        d.ellipse([cx - S * .44 - lw, cy - S * .36 - lw, cx + S * .44 + lw, cy + S * .36 + lw], fill=line)
    for s in (-1, 1): ear(s, fur, 0)
    d.ellipse([cx - S * .44, cy - S * .36, cx + S * .44, cy + S * .36], fill=fur)
    for s in (-1, 1): ear(s, st['inner'] + (255,), 0, inner=True)
    for side, col in ((-1, st['eyes'][0]), (1, st['eyes'][1])):                      # 眼睛：竖着的瞳孔；转头时远处那只窄一点
        k = 1 - .5 * max(0, side * -yaw)
        ex, ey, ew, eh = cx + side * S * .18 * (1 - .3 * abs(yaw)) + yaw * S * .15, cy - S * .02, S * .095 * k, S * .115
        d.ellipse([ex - ew, ey - eh, ex + ew, ey + eh], fill=col + (255,))
        d.ellipse([ex - ew * .26, ey - eh * .84, ex + ew * .26, ey + eh * .84], fill=(10, 10, 12, 255))
        d.ellipse([ex + ew * .15, ey - eh * .62, ex + ew * .15 + S * .026, ey - eh * .62 + S * .026], fill=(255, 255, 255, 235))
    nx = cx + yaw * S * .2
    if st['nose']: d.polygon([(nx - S * .032, cy + S * .1), (nx + S * .032, cy + S * .1), (nx, cy + S * .135)], fill=st['nose'] + (255,))
    if st['mouth']:
        for sx in (-1, 1): d.arc([nx + (sx - 1) * S * .032, cy + S * .115, nx + (sx + 1) * S * .032, cy + S * .175], 20, 160, fill=line, width=int(S * .011))
    im = im.resize((S0, int(S0 * 1.12)), Image.LANCZOS)
    return im, (S0 * .5, S0 * .66)                                                    # 头的椭圆中心在图里的位置

def beanie_head(S0, yaw, st):
    S = S0 * 4; im = Image.new('RGBA', (S, int(S * 1.12)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    line, face, hat = st['line'] + (255,), st['fur'] + (255,), (24, 24, 27, 255)
    cx, cy, lw = S * .5, S * .66, S * st['lw']
    d.ellipse([cx - S * .36 - lw, cy - S * .4 - lw, cx + S * .36 + lw, cy + S * .38 + lw], fill=line)          # 脸
    d.ellipse([cx - S * .36, cy - S * .4, cx + S * .36, cy + S * .38], fill=face)
    for side in (-1, 1):                                                            # 帽子上的猫耳朵
        bx = cx + side * S * .22 + yaw * S * .04
        d.polygon([(bx - side * S * .14, cy - S * .42), (bx + side * S * .04, cy - S * .74), (bx + side * S * .15, cy - S * .4)], fill=hat)
    d.chord([cx - S * .4, cy - S * .62, cx + S * .4, cy + S * .36], 180, 360, fill=hat)                      # 帽顶（平的那边落在帽檐上）
    d.rounded_rectangle([cx - S * .43, cy - S * .2, cx + S * .43, cy - S * .06], radius=S * .05, fill=(34, 34, 38, 255))   # 帽檐（翻边）
    for k in range(-8, 9):                                                         # 毛线的竖纹
        x = cx + k * S * .05; d.line([(x, cy - S * .19), (x, cy - S * .07)], fill=(52, 52, 58, 255), width=int(S * .008))
    for side in (-1, 1):                                                           # 眼睛、眉毛
        ex = cx + side * S * .13 * (1 - .3 * abs(yaw)) + yaw * S * .13
        d.ellipse([ex - S * .035, cy + S * .02, ex + S * .035, cy + S * .085], fill=line)
        d.line([(ex - S * .06, cy - S * .01 - side * S * .004), (ex + S * .06, cy - S * .01 + side * S * .004)], fill=line, width=int(S * .014))
    mx = cx + yaw * S * .16; d.line([(mx - S * .07, cy + S * .21), (mx + S * .07, cy + S * .2)], fill=line, width=int(S * .014))
    im = im.resize((S0, int(S0 * 1.12)), Image.LANCZOS)
    return im, (S0 * .5, S0 * .66)

# ---------------------------------------------------------------- 涂
res = rgb.astype(np.float32); lum = rgb.mean(2) / 255.0
detail = lum - ndimage.gaussian_filter(lum, 5)
heads = []
for k, p in enumerate(people):
    look = looks[k] if k < len(looks) else 'skip'
    if look == 'skip': continue
    st = STYLE[look]; mine = p['mask']; fur = np.array(st['fur'], np.float32)
    face = (cat == 3) & mine; hair = (cat == 1) & mine; body = (cat == 2) & mine
    if face.sum() < 300: face = ndimage.binary_closing(hair, iterations=3) & mine
    ys, xs = np.nonzero(face); fy0, fy1, fx0, fx1 = ys.min(), ys.max(), xs.min(), xs.max()
    fcx, fw = (fx0 + fx1) / 2, fx1 - fx0
    near = (np.arange(W)[None, :] > fx0 - fw * .25) & (np.arange(W)[None, :] < fx1 + fw * .25)
    hy = np.nonzero(hair & near & (np.arange(H)[:, None] < fy0 + (fy1 - fy0) * .3))[0]
    top = min(fy0, hy.min()) if len(hy) else fy0 - (fy1 - fy0) * .2
    hx = np.nonzero(hair & (np.arange(H)[:, None] < fy1))[1]
    hx0, hx1 = (min(fx0, hx.min()), max(fx1, hx.max())) if len(hx) else (fx0, fx1)
    hx0, hx1 = max(hx0, fcx - fw * 1.1), min(hx1, fcx + fw * 1.1)                   # 长头发不算进头的宽度
    if p['pts'] is not None:
        nose, le, re_ = p['pts'][0], p['pts'][7], p['pts'][8]
        yaw = float(np.clip((nose[0] - (le[0] + re_[0]) / 2) / max(abs(le[0] - re_[0]) * .5, fw * .3), -1, 1))
        e1, e2 = p['pts'][2], p['pts'][5]
        roll = math.degrees(math.atan2(e2[1] - e1[1], e2[0] - e1[0])) if abs(yaw) < .6 else 0.0
        roll = (roll + 90) % 180 - 90; roll = float(np.clip(roll, -20, 20))
    else:
        hc = np.nonzero(hair & (np.arange(H)[:, None] < fy0 + 5))[1]
        yaw = float(np.clip((fcx - (hc.mean() if len(hc) else fcx)) / (fw * .35), -1, 1)); roll = 0.0
    top = max(top, fy0 - (fy1 - fy0) * .45)                                          # 头发顶：最多比额头高半张脸
    eh = (fy1 - top) * .45; ew = max(eh * 1.15, fw * .5)                             # 猫头比人头宽，按高度对齐会显得太大；下巴盖不住的地方本来就涂成了毛的颜色
    S0 = int(max(ew / .44, eh / .36)); ecx, ecy = fcx + yaw * fw * .06, (top + fy1) / 2 - (fy1 - top) * .04
    # 皮肤：身上的留一点明暗；脸整片涂平
    strong = (conf[2] > .7) & mine; weak = ((conf[2] > .3) | body) & mine            # 双阈值：有把握的皮肤往外长到“可能是皮肤”的地方（逆光、暗的胳膊也能涂上）
    reg = ndimage.binary_fill_holes(ndimage.binary_propagation(strong, mask=weak))
    a_body = ndimage.gaussian_filter(reg.astype(np.float32), 1.2) * (st.get('skin', True) is not False)
    a_face = ndimage.binary_dilation(face, iterations=2).astype(np.float32)
    a_hair = (ndimage.binary_dilation(hair, iterations=2) & mine).astype(np.float32) if st['paint_hair'] else np.zeros((H, W), np.float32)
    hair_col = np.array(st.get('hair', st['fur']), np.float32)
    gain = 1.6 if look.startswith('black') else 1.0
    body_col = fur[None, None, :] + detail[..., None] * 255 * gain + (lum[..., None] - lum[mine].mean()) * (60 if look == 'white' else 25)
    res = res * (1 - a_body[..., None]) + np.clip(body_col, 0, 255) * a_body[..., None]
    res = res * (1 - a_hair[..., None]) + np.clip(hair_col[None, None, :] + detail[..., None] * 255 * .5, 0, 255) * a_hair[..., None]
    res = res * (1 - a_face[..., None]) + np.clip(fur[None, None, :] + detail[..., None] * 255 * .5, 0, 255) * a_face[..., None]
    if st['lw']:                                                                     # 皮肤外面一圈细边
        m = a_body > .5; ring = ndimage.binary_dilation(m, iterations=2) & ~m & ~((cat == 3) | (cat == 1)) & (a_body.max() > 0)
        res[ring] = res[ring] * .45 + np.array(st['line'], np.float32) * .55
    heads.append((S0, yaw, roll, st, ecx, ecy))
    print(f'person {k + 1} ({look}): face {fw}x{fy1 - fy0}, head top {top:.0f}, yaw {yaw:+.2f}, roll {roll:+.0f}, head {S0}px')
pil = Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).convert('RGBA')
for S0, yaw, roll, st, ecx, ecy in sorted(heads, key=lambda h: h[0]):              # 小的（远的）先画
    g, (gx, gy) = (beanie_head if st.get('kind') == 'beanie' else cat_head)(S0, yaw, st)
    big = Image.new('RGBA', (g.size[0] * 2, g.size[1] * 2), (0, 0, 0, 0)); big.alpha_composite(g, (g.size[0] // 2, g.size[1] // 2))
    big = big.rotate(-roll, resample=Image.BICUBIC, center=(g.size[0] // 2 + gx, g.size[1] // 2 + gy))
    ox, oy = int(ecx - g.size[0] // 2 - gx), int(ecy - g.size[1] // 2 - gy)
    sh = Image.new('RGBA', big.size, (0, 0, 0, 0)); sh.putalpha(big.split()[3].filter(ImageFilter.GaussianBlur(S0 * .025)).point(lambda v: int(v * .4)))
    tmp = Image.new('RGBA', pil.size, (0, 0, 0, 0)); tmp.paste(sh, (ox + int(S0 * .015), oy + int(S0 * .025)), sh); pil = Image.alpha_composite(pil, tmp)
    tmp = Image.new('RGBA', pil.size, (0, 0, 0, 0)); tmp.paste(big, (ox, oy), big); pil = Image.alpha_composite(pil, tmp)
pil.convert('RGB').save(out)
