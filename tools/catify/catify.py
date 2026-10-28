"""把照片里的人换成频道的形象：头换成画好的头，露出来的皮肤涂成形象的颜色，衣服和背景不动。
（“读文案”短视频用；频道主 10 月 28 日定了形象：他 = 猫耳毛线帽 + 白色圆脸，她 = 频道主发来的女生；用法和装法见同目录的 README.md）

    python catify.py <模型目录> <照片> <输出.png> <从左到右每个人是谁，逗号隔开> [表情，逗号隔开]

谁：him（他）、her（她）、friend（别的人）、skip（这个人不动）。
表情：calm（平静）、meh（无语，一边眉毛挑起来，默认）、smile（笑）、sad（难过）。
- 分割：MediaPipe selfie_multiclass（背景 / 头发 / 身上的皮肤 / 脸 / 衣服 / 其他）。
- 分人：MediaPipe 姿态模型给每个人一张蒙版；没认出来的人，用剩下的人身上的部分。
- 头：头发顶到下巴定头的大小和位置；鼻子相对两只耳朵的位置定朝向（转头时五官往那边挪），两只眼睛的连线定歪头。
- 皮肤：有把握的皮肤往外长到“可能是皮肤”的地方（逆光、暗的胳膊也能涂上），涂成白脸的颜色，外面一圈黑边，像画的一样；
  原来的头发涂黑（她是黑长直，别人的头发也一样黑）。
"""
import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
import mediapipe as mp
from mediapipe.tasks import python as mpt
from mediapipe.tasks.python import vision

M, src, out, looks = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(',')
moods = sys.argv[5].split(',') if len(sys.argv) > 5 else []
rgb = np.asarray(Image.open(src).convert('RGB')); H, W = rgb.shape[:2]
mimg = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=mpt.BaseOptions(model_asset_path=f'{M}/selfie_multiclass_256x256.tflite'), output_category_mask=True, output_confidence_masks=True))
r = seg.segment(mimg); cat = r.category_mask.numpy_view().reshape(H, W).copy()
conf = [c.numpy_view().reshape(H, W).astype(np.float32) for c in r.confidence_masks]

def seg_crop(x0, y0, x1, y1):
    """把一个人那块裁出来、补成正方形再分割一遍（模型只看 256×256，人小的时候整张图分不细）"""
    crop = rgb[y0:y1, x0:x1]; h, w = crop.shape[:2]; n = max(h, w)
    sq = np.zeros((n, n, 3), np.uint8); sq[:h, :w] = crop
    rr = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(sq)))
    c = rr.category_mask.numpy_view().reshape(n, n)[:h, :w]
    cf = [m.numpy_view().reshape(n, n)[:h, :w].astype(np.float32) for m in rr.confidence_masks]
    return c, cf
pl = vision.PoseLandmarker.create_from_options(vision.PoseLandmarkerOptions(
    base_options=mpt.BaseOptions(model_asset_path=f'{M}/pose_landmarker_heavy.task'), num_poses=4, output_segmentation_masks=True,
    min_pose_detection_confidence=.3, min_pose_presence_confidence=.3))
pr = pl.detect(mimg); pl.close()

SKIN, INK, HAT, HAIR = (245, 241, 234), (17, 17, 19), (21, 21, 24), (22, 20, 24)
O_EYE, T_EYE, PINK = (242, 161, 74), (79, 214, 196), (242, 160, 190)

# ---------------------------------------------------------------- 每个人一张蒙版
person = cat != 0
people = []
for lm, sm in zip(pr.pose_landmarks, pr.segmentation_masks or []):
    m = sm.numpy_view().reshape(H, W) > .5
    people.append(dict(mask=m & person, pts=np.array([(q.x * W, q.y * H) for q in lm]), vis=np.array([q.visibility or 0 for q in lm])))
left = person & ~np.any([p['mask'] for p in people], axis=0) if people else person
head = ndimage.binary_closing((cat == 1) | (cat == 3), iterations=4) & left
lab, n = ndimage.label(head)
for i in range(1, n + 1):                                                        # 姿态模型没认出来的人：剩下的头 + 跟它连着的身体
    comp = lab == i
    if comp.sum() < H * W * .004: continue
    people.append(dict(mask=ndimage.binary_propagation(comp, mask=left), pts=None, vis=None))
people.sort(key=lambda p: ndimage.center_of_mass(p['mask'])[1])
# 脸归谁：抱在一起时两个人的蒙版会叠在一起，按鼻子离哪块脸最近来分；鼻子看不见（背对镜头）的人不分脸，画成背影
flab, fn = ndimage.label(ndimage.binary_closing(cat == 3, iterations=3))
fcent = ndimage.center_of_mass(cat == 3, flab, range(1, fn + 1)) if fn else []
fsize = ndimage.sum(cat == 3, flab, range(1, fn + 1)) if fn else []
taken = set()
for p in sorted(people, key=lambda p: -(p['vis'][0] if p['vis'] is not None else 0)):
    p['face_id'] = None
    if p['pts'] is None or p['vis'][0] < .5: continue
    nose = p['pts'][0]; reach = max(np.hypot(*(p['pts'][7] - p['pts'][8])), 40) * 2.2
    best = [(np.hypot(c[1] - nose[0], c[0] - nose[1]), i + 1) for i, c in enumerate(fcent) if i + 1 not in taken and fsize[i] > 300]
    best = [b for b in best if b[0] < reach]
    if best: p['face_id'] = min(best)[1]; taken.add(p['face_id'])

# ---------------------------------------------------------------- 画头（画在 4 倍大的画布上再缩小）
# 返回图和“脸的中心”在图里的位置。脸是白色的圆、黑边；五官随朝向（yaw：-1 朝左 … 1 朝右）挪
def face_parts(d, S, cx, cy, yaw, mood, big=1.0, blush=False):
    if mood == 'back': return                                                      # 背影没有五官
    sh = yaw * S * .1
    for side in (-1, 1):
        k = 1 - .35 * max(0, side * -yaw)                                          # 远处那只眼睛窄一点
        ex, ey, er = cx + side * S * .115 * (1 - .25 * abs(yaw)) + sh, cy + S * .03, S * .03 * big
        d.ellipse([ex - er * k, ey - er, ex + er * k, ey + er], fill=INK + (255,))
        if big > 1: d.ellipse([ex + er * .15, ey - er * .55, ex + er * .55, ey - er * .15], fill=(255, 255, 255, 255))
        bw, by = S * .055, ey - S * .075                                           # 眉毛
        lift = {'meh': (S * .03 if side == 1 else 0), 'sad': -S * .02, 'smile': S * .005, 'calm': 0}[mood]
        tilt = {'sad': side * -S * .012, 'meh': (side * S * .008 if side == 1 else 0)}.get(mood, 0)
        d.line([(ex - bw * k, by - lift + tilt), (ex + bw * k, by - lift - tilt)], fill=INK + (255,), width=int(S * .013))
        if blush: d.ellipse([ex - S * .05, ey + S * .045, ex + S * .05, ey + S * .085], fill=PINK + (150,))
    mx, my = cx + sh * 1.1, cy + S * .17
    if mood == 'smile': d.arc([mx - S * .05, my - S * .05, mx + S * .05, my + S * .025], 20, 160, fill=INK + (255,), width=int(S * .013))
    elif mood == 'sad': d.arc([mx - S * .045, my - S * .01, mx + S * .045, my + S * .05], 200, 340, fill=INK + (255,), width=int(S * .013))
    else: d.line([(mx - S * .045, my), (mx + S * .045, my)], fill=INK + (255,), width=int(S * .013))

def beanie(d, S, cx, top, w, yaw, bow=False, patch=True):
    """猫耳毛线帽：帽顶 + 两只猫耳朵 + 翻边（竖纹）+ 一块小布标（黑猫，左橙右青的眼睛）。top：翻边的上沿"""
    hat = HAT + (255,)
    for side in (-1, 1):
        bx = cx + side * w * .52 + yaw * S * .03
        d.polygon([(bx - side * w * .34, top - S * .14), (bx + side * w * .06, top - S * .4), (bx + side * w * .2, top - S * .08)], fill=hat)
    d.chord([cx - w, top - S * .3, cx + w, top + S * .3], 180, 360, fill=hat)
    d.arc([cx - w * .82, top - S * .26, cx + w * .5, top + S * .14], 205, 250, fill=(70, 70, 78, 255), width=int(S * .012))   # 帽顶的一点反光
    d.rounded_rectangle([cx - w * 1.06, top - S * .02, cx + w * 1.06, top + S * .16], radius=S * .05, fill=(30, 30, 34, 255))
    for k in range(-14, 15):
        x = cx + k * w * .075
        if abs(x - cx) < w: d.line([(x, top + S * .005), (x, top + S * .14)], fill=(50, 50, 56, 255), width=int(S * .007))
    if patch:                                                                      # 布标：小黑猫
        px, py, ps = cx + w * .55 + yaw * S * .05, top + S * .07, S * .055
        d.rounded_rectangle([px - ps, py - ps * .8, px + ps, py + ps * .8], radius=ps * .2, fill=(236, 230, 218, 255))
        d.ellipse([px - ps * .55, py - ps * .45, px + ps * .55, py + ps * .6], fill=INK + (255,))
        for s in (-1, 1): d.polygon([(px + s * ps * .5, py - ps * .1), (px + s * ps * .45, py - ps * .7), (px + s * ps * .1, py - ps * .35)], fill=INK + (255,))
        d.ellipse([px - ps * .3, py, px - ps * .1, py + ps * .2], fill=O_EYE + (255,)); d.ellipse([px + ps * .1, py, px + ps * .3, py + ps * .2], fill=T_EYE + (255,))
    if bow:                                                                        # 她：右边耳朵上一个粉色蝴蝶结
        bx, by, bs = cx + w * .62 + yaw * S * .03, top - S * .15, S * .065
        d.polygon([(bx, by), (bx - bs * 1.4, by - bs * .8), (bx - bs * 1.3, by + bs * .9)], fill=PINK + (255,))
        d.polygon([(bx, by), (bx + bs * 1.4, by - bs * .8), (bx + bs * 1.3, by + bs * .9)], fill=PINK + (255,))
        d.ellipse([bx - bs * .35, by - bs * .35, bx + bs * .35, by + bs * .35], fill=(226, 130, 165, 255))

def him_head(S0, yaw, mood):
    S = S0 * 4; im = Image.new('RGBA', (S, int(S * 1.25)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cx, cy, R, lw = S * .5, S * .78, S * .34, S * .022
    d.ellipse([cx - R - lw, cy - R * 1.02 - lw, cx + R + lw, cy + R * .98 + lw], fill=INK + (255,))
    d.ellipse([cx - R, cy - R * 1.02, cx + R, cy + R * .98], fill=SKIN + (255,))
    face_parts(d, S, cx, cy, yaw, mood)
    beanie(d, S, cx, cy - S * .2, R * 1.08, yaw)
    return im.resize((S0, int(S0 * 1.25)), Image.LANCZOS), (S0 * .5, S0 * .78)

def her_head(S0, yaw, mood):
    S = S0 * 4; im = Image.new('RGBA', (S, int(S * 1.9)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cx, cy, lw = S * .5, S * .78, S * .02
    hair = HAIR + (255,)
    d.ellipse([cx - S * .4, cy - S * .42, cx + S * .4, cy + S * .3], fill=hair)              # 脸后面的头发（长头发用照片里原来的、涂黑的）
    rx, ry = S * .29, S * .33
    if mood == 'back':                                                              # 背影：后脑勺是头发
        d.ellipse([cx - rx * 1.1, cy - ry, cx + rx * 1.1, cy + ry * 1.3], fill=hair)
        beanie(d, S, cx, cy - S * .24, rx * 1.18, yaw, bow=True, patch=False)
        return im.resize((S0, int(S0 * 1.9)), Image.LANCZOS), (S0 * .5, S0 * .78)
    d.ellipse([cx - rx - lw, cy - ry - lw, cx + rx + lw, cy + ry + lw], fill=INK + (255,))
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=SKIN + (255,))
    face_parts(d, S, cx, cy, yaw, mood, big=1.15, blush=True)
    # 刘海：从帽檐下面垂下来的几缕；两边各一缕挡住脸的边
    by = cy - S * .2
    for k in range(-4, 5):
        x = cx + k * S * .065 + yaw * S * .03; L = S * (.1 if k % 2 else .15) * (1 - abs(k) * .05)
        d.polygon([(x - S * .05, by), (x + S * .05, by), (x + S * .012 * (1 if k < 0 else -1), by + L)], fill=hair)
    for side in (-1, 1):
        x0 = cx + side * S * .3
        d.polygon([(x0 - side * S * .06, by), (x0 + side * S * .05, by), (x0 + side * S * .06, cy + S * .5), (x0 - side * S * .01, cy + S * .38), (x0 - side * S * .05, cy + S * .1)], fill=hair)
    beanie(d, S, cx, cy - S * .24, rx * 1.18, yaw, bow=True, patch=False)
    return im.resize((S0, int(S0 * 1.9)), Image.LANCZOS), (S0 * .5, S0 * .78)

def friend_head(S0, yaw, mood):
    S = S0 * 4; im = Image.new('RGBA', (S, int(S * 1.25)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cx, cy, R, lw = S * .5, S * .78, S * .32, S * .022
    d.ellipse([cx - R * 1.05, cy - R * 1.25, cx + R * 1.05, cy + R * .2], fill=(58, 54, 58, 255))      # 短头发（深灰，跟他们俩的黑区分开）
    d.ellipse([cx - R - lw, cy - R - lw, cx + R + lw, cy + R + lw], fill=INK + (255,))
    d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=SKIN + (255,))
    d.chord([cx - R * 1.02, cy - R * 1.22, cx + R * 1.02, cy - R * .05], 180, 360, fill=(58, 54, 58, 255))
    face_parts(d, S, cx, cy, yaw, mood)
    return im.resize((S0, int(S0 * 1.25)), Image.LANCZOS), (S0 * .5, S0 * .78)

HEADS = {'him': him_head, 'her': her_head, 'friend': friend_head}

# ---------------------------------------------------------------- 涂
res = rgb.astype(np.float32); lum = rgb.mean(2) / 255.0
detail = lum - ndimage.gaussian_filter(lum, 5)
heads = []
for k, p in enumerate(people):
    look = looks[k] if k < len(looks) else 'skip'
    if look == 'skip': continue
    mood = moods[k] if k < len(moods) and moods[k] else ('smile' if look == 'her' else 'meh')
    mine = p['mask']
    ys_, xs_ = np.nonzero(mine); pad = int(max(np.ptp(ys_), np.ptp(xs_)) * .08)
    bx0, by0, bx1, by1 = max(0, xs_.min() - pad), max(0, ys_.min() - pad), min(W, xs_.max() + pad), min(H, ys_.max() + pad)
    ccat, cconf = seg_crop(bx0, by0, bx1, by1)
    pcat = cat.copy(); pcat[by0:by1, bx0:bx1] = ccat
    pskin = conf[2].copy(); pskin[by0:by1, bx0:bx1] = cconf[2]
    hair = (pcat == 1) & mine; body = (pcat == 2) & mine
    if p['pts'] is not None: face = (flab == p['face_id']) if p['face_id'] else np.zeros((H, W), bool)
    else: face = (cat == 3) & mine
    back = face.sum() < 300
    if back:                                                                        # 背影：头的位置用两只耳朵中间、大小用肩宽；那一带的头发当成头
        if p['pts'] is not None:
            ex, ey = (p['pts'][7] + p['pts'][8]) / 2; sw = np.hypot(*(p['pts'][11] - p['pts'][12]))
        elif hair.sum() > 50:
            ey, ex = ndimage.center_of_mass(hair); sw = np.sqrt(hair.sum()) * 2.2
        else: continue                                                              # 看不到头，不画
        fh = sw * .5; fx0, fx1, fy0, fy1 = int(ex - fh * .45), int(ex + fh * .45), int(ey - fh * .55), int(ey + fh * .45)
        face = np.zeros((H, W), bool); face[max(0, fy0):fy1, max(0, fx0):fx1] = True; face &= hair | (cat == 3)
        if face.sum() < 50: continue
        mood = 'back'
    ys, xs = np.nonzero(face); fy0, fy1, fx0, fx1 = ys.min(), ys.max(), xs.min(), xs.max()
    fcx, fw = (fx0 + fx1) / 2, fx1 - fx0
    near = (np.arange(W)[None, :] > fx0 - fw * .25) & (np.arange(W)[None, :] < fx1 + fw * .25)
    hy = np.nonzero(hair & near & (np.arange(H)[:, None] < fy0 + (fy1 - fy0) * .3))[0]
    top = min(fy0, hy.min()) if len(hy) else fy0 - (fy1 - fy0) * .2
    if back: yaw, roll = 0.0, 0.0
    elif p['pts'] is not None:
        nose, le, re_ = p['pts'][0], p['pts'][7], p['pts'][8]
        yaw = float(np.clip((nose[0] - (le[0] + re_[0]) / 2) / max(abs(le[0] - re_[0]) * .5, fw * .3), -1, 1))
        e1, e2 = p['pts'][2], p['pts'][5]
        roll = math.degrees(math.atan2(e2[1] - e1[1], e2[0] - e1[0])) if abs(yaw) < .6 else 0.0
        roll = (roll + 90) % 180 - 90; roll = float(np.clip(roll, -20, 20))
    else:
        hc = np.nonzero(hair & (np.arange(H)[:, None] < fy0 + 5))[1]
        yaw = float(np.clip((fcx - (hc.mean() if len(hc) else fcx)) / (fw * .35), -1, 1)); roll = 0.0
    top = max(top, fy0 - (fy1 - fy0) * .45)                                          # 头发顶：最多比额头高半张脸
    fh = fy1 - fy0                                                                   # 脸（额头到下巴）
    S0 = int(fh * (1.75 if look != 'her' else 1.85))                                 # 白脸比真人的脸大一点（像频道主发来的图），帽子盖住头发
    ecx, ecy = fcx + yaw * fw * .05, (fy0 + fy1) / 2 + fh * .04
    # 皮肤涂成白脸的颜色，外面一圈黑边；头发涂黑；脸整片涂白（反正会被头盖住）
    strong = (pskin > .7) & mine; weak = ((pskin > .15) | body) & mine
    reg = ndimage.binary_fill_holes(ndimage.binary_propagation(strong, mask=weak))
    reg = ndimage.binary_opening(ndimage.binary_closing(reg, iterations=3), iterations=2)    # 边缘修圆，去掉毛刺
    lab_r, nr = ndimage.label(reg)
    if nr: reg = np.isin(lab_r, 1 + np.flatnonzero(ndimage.sum(reg, lab_r, range(1, nr + 1)) > H * W * .0004))   # 去掉零碎的小块
    reg = ndimage.gaussian_filter(reg.astype(np.float32), 2.0) > .5                            # 轮廓顺一点，像画出来的
    a_body = ndimage.gaussian_filter(reg.astype(np.float32), 1.0)
    a_face = ndimage.binary_dilation(face, iterations=2).astype(np.float32)
    near_head = np.zeros((H, W), bool); hr = int(S0 * .9)                            # 头发只涂跟头连着的那片（衣服上被认错的零碎不涂）
    near_head[max(0, int(ecy) - hr):int(ecy) + hr, max(0, int(ecx) - hr):int(ecx) + hr] = True
    hair = ndimage.binary_propagation(hair & near_head, mask=ndimage.binary_closing(hair, iterations=2))
    a_hair = (ndimage.binary_dilation(hair, iterations=2) & mine).astype(np.float32)
    skin = np.array(SKIN, np.float32)
    ref = lum[reg].mean() if reg.any() else .5; sd = lum[reg].std() + 1e-3 if reg.any() else .1
    shade = np.clip((ndimage.gaussian_filter(lum, 3) - ref) / sd, -2, 1.5)             # 大的明暗：亮的地方接近白，暗的地方偏灰
    body_col = skin[None, None, :] * (1 + shade[..., None] * .1) + detail[..., None] * 255 * .6
    res = res * (1 - a_body[..., None]) + np.clip(body_col, 0, 255) * a_body[..., None]
    res = res * (1 - a_hair[..., None]) + np.clip(np.array(HAIR, np.float32)[None, None, :] + detail[..., None] * 255 * .4, 0, 255) * a_hair[..., None]
    res = res * (1 - a_face[..., None]) + skin[None, None, :] * a_face[..., None]
    m = a_body > .5; ring = ndimage.binary_dilation(m, iterations=3) & ~m & ~((cat == 3) | (cat == 1))
    res[ring] = res[ring] * .15 + np.array(INK, np.float32) * .85
    heads.append((S0, yaw, roll, look, mood, ecx, ecy))
    print(f'person {k + 1} ({look}, {mood}): face {fw}x{fy1 - fy0}, head top {top:.0f}, yaw {yaw:+.2f}, roll {roll:+.0f}, head {S0}px')
pil = Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).convert('RGBA')
for S0, yaw, roll, look, mood, ecx, ecy in sorted(heads, key=lambda h: h[0]):      # 小的（远的）先画
    g, (gx, gy) = HEADS[look](S0, yaw, mood)
    big = Image.new('RGBA', (g.size[0] * 2, g.size[1] * 2), (0, 0, 0, 0)); big.alpha_composite(g, (g.size[0] // 2, g.size[1] // 2))
    big = big.rotate(-roll, resample=Image.BICUBIC, center=(g.size[0] // 2 + gx, g.size[1] // 2 + gy))
    ox, oy = int(ecx - g.size[0] // 2 - gx), int(ecy - g.size[1] // 2 - gy)
    sh = Image.new('RGBA', big.size, (0, 0, 0, 0)); sh.putalpha(big.split()[3].filter(ImageFilter.GaussianBlur(S0 * .02)).point(lambda v: int(v * .35)))
    tmp = Image.new('RGBA', pil.size, (0, 0, 0, 0)); tmp.paste(sh, (ox + int(S0 * .012), oy + int(S0 * .02)), sh); pil = Image.alpha_composite(pil, tmp)   # 负的偏移量：贴到透明层再合成
    tmp = Image.new('RGBA', pil.size, (0, 0, 0, 0)); tmp.paste(big, (ox, oy), big); pil = Image.alpha_composite(pil, tmp)
pil.convert('RGB').save(out)
seg.close()
