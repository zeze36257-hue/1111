// ======================================================================== No.14 虚无主义：如果一切终将消失
// 第三季·主义 ①。一镜到底：散成沙的字 → 聚成标题 → 流行语 → 从人群一路拉远到“暗淡蓝点” →
// 那个小点变成星空里的一颗星 → 尼采 → 星星连成星座 → 仰望 → 一圈圈重来的日子 → 再来一次。
// 音乐：参考 BGM 重新剪辑（110 BPM）。0–17.41 前奏；17.41 全编制进入；63.23 抽空，接原曲安静段；87.95 重新爆发。
const BEAT = 60 / 110, BAR = BEAT * 4;
const DROP = 17.41, CUT = 63.23, REBUILD = 87.95, TOTAL = 101.9;
const SECTIONS = [['序', 0, DROP], ['人间不值得', DROP, 28.32], ['渺小', 28.32, 45.78], ['上帝死了', 45.78, CUT], ['星座', CUT, 80.5], ['再来一次', 80.5, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.14';

const LINES = [
  [0.3, 4.6, '凌晨三点，突然觉得：做什么都没意思。'],
  [4.9, 9.9, '学习、上班、恋爱……最后，不都会消失吗？'],
  [10.9, 16.6, '这种感觉，有一个名字：「虚无主义」。'],
  [17.7, 22.4, '躺平、摆烂、「人间不值得」……'],
  [22.7, 27.9, '这些流行语背后，常常是同一个念头：反正没意义。'],
  [28.6, 32.9, '这种念头，常在你意识到自己很渺小的时候出现。'],
  [33.2, 37.8, '1990 年，旅行者 1 号回头，在 60 多亿公里外拍下了地球。'],
  [38.1, 41.6, '照片里的地球，只有 0.12 个像素。'],
  [41.9, 45.6, '你爱的每一个人、听说过的每一个人，都在这个小点上。'],
  [46.1, 50.4, '1882 年，尼采写下：「上帝死了」。'],
  [50.7, 55.0, '他预言：旧的意义倒塌之后，虚无主义会到来。'],
  [55.4, 59.0, '但他在笔记里，把虚无分成了两种。'],
  [59.3, 62.9, '一种让人放弃，一种让人「创造」。'],
  [63.9, 70.4, '星星本来没有形状。是人，把它们连成了星座。'],
  [71.2, 75.1, '心理学家还发现：觉得自己渺小，不一定是坏事。'],
  [75.4, 80.2, '抬头看一分钟高大的桉树后，人们更愿意帮陌生人捡起掉落的笔。'],
  [80.8, 83.6, '尼采还问过一个问题：'],
  [83.9, 87.7, '如果这一生，要一模一样地重来无数次——'],
  [92.3, 95.6, '尼采的答案，不是放弃，而是——'],
  [96.4, 101.4, '评论区：如果能重来，你最想再过一遍哪一天？'],
];

// ======================================================================== 共用：太空背景、星空、“你”
function space(t, k = 1) {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, `rgba(16,21,33,${k})`); g.addColorStop(.55, `rgba(8,10,17,${k})`); g.addColorStop(1, `rgba(2,3,5,${k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// 两团缓慢漂移的暖光 / 冷光，给没有星空的段落一点空气感
function aurora(t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, r, rgb, al, ph] of [[220, 520, 760, O_RGB, .09, 0], [880, 1420, 820, T_RGB, .07, 2], [700, 900, 600, '120,110,200', .05, 4]]) {
    const cx = x + Math.sin(t * .13 + ph) * 90, cy = y + Math.cos(t * .11 + ph) * 70;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(${rgb},${al * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
let STARS = [];
const starPos = (s, t, dy = 0) => {
  let x = s.x - t * 3.2 * s.z, y = s.y + dy * s.z - t * 1.3 * s.z;
  x = ((x + 20) % (W + 40) + W + 40) % (W + 40) - 20;
  return [x, y];
};
// 星空的总亮度
const STAR_A = track([[0, .4], [9.8, .4], [12, .22], [16.9, .22], [17.6, 0, E.lin], [31.5, 0], [33.5, .28], [37.6, .28], [39.4, 0], [45.2, 0], [47.6, 1], [80.2, 1], [81.6, .5], [87.6, .5], [88.4, 1.15], [TOTAL, 1.15]]);
// 镜头上下摇：仰望树梢时星空上移
const TILT = track([[71.0, 0], [73.4, -560], [80.2, -560], [81.8, 0]]);
function starfield(t) {
  const A = STAR_A(t); if (A <= 0) return;
  const dy = TILT(t);
  ctx.save();
  for (const s of STARS) {
    let [x, y] = starPos(s, t, dy), al = A * s.b * (.72 + .28 * Math.sin(t * s.tw + s.ph));
    if (t > 55.6 && t < 66 && x < 540) {                         // 消极的虚无：左边的星星黯淡、坠落；抽空的一刻全部熄灭
      if (t < CUT) { const k = prog(t, 55.9 + s.ph * .25, 62.6); y += 560 * k * k * s.z; al *= 1 - .88 * k; }
      else al *= sstep(63.9, 65.8, t);
    }
    if (al <= .012 || y < -6 || y > H + 6) continue;
    ctx.globalAlpha = Math.min(1, al); ctx.fillStyle = s.warm ? '#ffdcae' : '#e2eaff';
    const r = s.s;
    if (r < 1.4) ctx.fillRect(x - r / 2, y - r / 2, r, r); else { ctx.beginPath(); ctx.arc(x, y, r / 2 + .3, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
// “你”：一颗暖色的点，外面一圈呼吸的光环
function you(x, y, t, a = 1, r = 9) {
  if (a <= 0) return;
  const pulse = (t * .75) % 1;
  ctx.save(); ctx.globalAlpha = a * (1 - pulse) * .45; ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, r + 4 + pulse * 44, 0, TAU); ctx.stroke(); ctx.restore();
  glow(x, y, r, O_RGB, a, 6);
}
// 四芒星的闪光（眼睛亮起、重要的星）
function flare(x, y, len, rgb, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const g = ctx.createLinearGradient(x - dx * len, y - dy * len, x + dx * len, y + dy * len);
    g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(.5, `rgba(${rgb},${.8 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - dx * len, y - dy * len); ctx.lineTo(x + dx * len, y + dy * len); ctx.stroke();
  }
  ctx.restore();
}
function seriesTag(y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  font(30, 500); ctx.letterSpacing = '6px'; const w = ctx.measureText(SERIES).width;
  text(SERIES, W / 2, y, { size: 30, weight: 500, align: 'center', color: ORANGE, ls: 6 });
  ctx.strokeStyle = `rgba(${O_RGB},.5)`; ctx.lineWidth = 1.5;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(W / 2 + k * (w / 2 + 24), y); ctx.lineTo(W / 2 + k * (w / 2 + 84), y); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================== 文字变成沙
// 把一段文字栅格化成点（相对文字中心的坐标），记下每个点属于哪个字、是否高亮
function raster(s, o, step = 3, seed = 1) {
  const rs = runs(s), cw = 2200, chh = Math.ceil(o.size * 2.4), c = mk(cw, chh), g = c.getContext('2d'), save = ctx;
  ctx = g; reset(g);
  const adv = advances(rs, o), total = adv.reduce((a, b) => a + b, 0) - (o.ls || 0);
  typeRun(rs, cw / 2, chh / 2, { ...o, align: 'center', glow: null }, 1, 1);
  ctx = save;
  const im = g.getImageData(0, 0, cw, chh).data, pts = [], r = mulberry(seed), x0 = cw / 2 - total / 2;
  for (let y = 0; y < chh; y += step) for (let x = 0; x < cw; x += step) {
    if (im[(y * cw + x) * 4 + 3] < 110) continue;
    let i = 0, acc = x0; while (i < adv.length - 1 && x >= acc + adv[i]) { acc += adv[i]; i++; }
    pts.push({ x: x - cw / 2, y: y - chh / 2, hi: rs[i].hi, r: r(), r2: r(), r3: r() });
  }
  return { rs, pts, w: total, o };
}
// 从左到右被风吹散：t0 开始，dur 秒扫过整段文字；wind 是飘散的方向和距离
function sand(R, x, y, t, t0, dur, alpha = 1, wind = [280, -260]) {
  const { rs, pts, w, o } = R, left = x - w / 2;
  const front = left + (w + 6) * prog(t, t0, t0 + dur);
  if (front < left + w + 4) {
    ctx.save(); ctx.beginPath(); ctx.rect(front, y - o.size * 1.6, 3000, o.size * 3.2); ctx.clip();
    typeRun(rs, x, y, { ...o, align: 'center' }, 1, alpha); ctx.restore();
  }
  if (t <= t0) return;
  ctx.save();
  for (const p of pts) {
    const tr = t0 + dur * (p.x + w / 2) / (w + 6) + p.r * .06, u = (t - tr) / (1.4 + p.r2 * 1.1);
    if (u <= 0 || u >= 1) continue;
    const k = E.out(u), n1 = vnoise(p.x * .03 + t * .9, p.y * .03) - .5, n2 = vnoise(p.y * .03 - t * .8, p.x * .03 + 9) - .5;
    ctx.globalAlpha = alpha * Math.pow(1 - u, 1.3) * .95;
    ctx.fillStyle = p.hi ? ORANGE : (o.color || CREAM);
    ctx.fillRect(x + p.x + wind[0] * k * (.45 + p.r2) + n1 * 110 * k, y + p.y + wind[1] * k * (.45 + p.r3) + n2 * 110 * k, 2.3, 2.3);
  }
  ctx.restore();
}

// ======================================================================== ① 序：散成沙
const H1 = { size: 60, weight: 700, ls: 4, color: CREAM }, H2 = { size: 72, weight: 900, ls: 4, color: ORANGE };
const WO = { size: 40, weight: 500, ls: 6, color: '#cfd5df' };
const ORBIT = ['学习', '上班', '恋爱', '梦想', '存款', '朋友'];
let HOOK1, HOOK2, OW = [], TITLE;
function sceneHook(t) {
  if (t > 13) return;
  you(540, 1010, t, 1 - sstep(10.0, 11.2, t));
  ORBIT.forEach((s, i) => {
    const ang = -PI / 2 + i * TAU / 6 + t * .045;
    sand(OW[i], 540 + Math.cos(ang) * 330, 1010 + Math.sin(ang) * 215, t, 4.7 + i * .72, .65, .9, [240, -280]);
  });
  sand(HOOK1, 540, 572, t, 9.25, .85, 1, [200, -330]);
  sand(HOOK2, 540, 676, t, 9.5, 1.0, 1, [230, -360]);
}

// ======================================================================== ② 标题：沙聚成字，在鼓点进来时穿过去
const TITLE_O = { size: 172, weight: 900, ls: 34, color: CREAM };
function sceneTitle(t) {
  if (t < 9.4 || t > DROP + .4) return;
  const cx = 540, cy = 900;
  const push = E.inExpo(prog(t, DROP - .6, DROP + .3));
  const sc = 1 + .04 * E.ioSine(prog(t, 12.4, DROP - .6)) + 9 * push, fade = 1 - sstep(DROP - .15, DROP + .3, t);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-cx, -cy); ctx.globalAlpha = fade;
  const solid = sstep(12.25, 12.95, t);
  if (solid < 1) {
    ctx.save();
    for (const p of TITLE.pts) {
      const ts = 10.15 + p.r * .75, u = E.io(prog(t, ts, ts + 1.55));
      const sx = cx + p.sx + Math.sin(t * .6 + p.r * 9) * 30, sy = cy + p.sy + Math.cos(t * .5 + p.r2 * 9) * 30, tx = cx + p.x, ty = cy + p.y;
      const dx = tx - sx, dy = ty - sy, b = Math.sin(u * PI) * p.bend;
      ctx.globalAlpha = fade * (1 - solid) * (.28 * sstep(9.4, 10.3, t) + .72 * u);
      ctx.fillStyle = CREAM;
      ctx.fillRect(lerp(sx, tx, u) - dy * b, lerp(sy, ty, u) + dx * b, 2.6, 2.6);
    }
    ctx.restore();
  }
  typeText('虚无主义', cx, cy, { ...TITLE_O, align: 'center', glow: 'rgba(255,225,190,.22)', glowBlur: 40 }, 1, solid);
  seriesTag(700, sstep(12.7, 13.6, t));
  typeText('NIHILISM', cx, 1050, { size: 46, weight: 600, font: LAT, ls: 30, color: DIM, align: 'center', spread: 3 }, prog(t, 13.0, 14.2), 1);
  typeText('第三季 · 主义 ①', cx, 1124, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, 13.8, 14.9), 1);
  ctx.restore();
}

// ======================================================================== ③ 人间不值得：流行语踩着鼓点砸下来，再一起缩成一个点
const SLAMS = [
  ['躺平', 300, 600, { size: 118, weight: 900 }],
  ['摆烂', 770, 748, { size: 110, weight: 900 }],
  ['emo', 330, 900, { size: 150, weight: 600, font: LAT, style: 'italic' }],
  ['毁灭吧', 730, 1042, { size: 100, weight: 900 }],
  ['人间不值得', 540, 1188, { size: 112, weight: 900, color: ORANGE }],
];
const slamT = i => DROP + i * 2 * BEAT;
function sceneSlams(t) {
  if (t < DROP - .1 || t > 28.6) return;
  aurora(t, sstep(DROP - .1, DROP + .6, t) * (1 - sstep(27.4, 28.6, t)));
  let kick = 0; SLAMS.forEach((_, i) => { const d = t - slamT(i); if (d > 0) kick += .02 * Math.exp(-d * 7); });
  const col = E.inExpo(prog(t, 26.5, 28.25));                     // 收拢成一个点
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + kick, 1 + kick); ctx.translate(-540, -900);
  SLAMS.forEach(([s, x, y, o], i) => {
    const ts = slamT(i); if (t < ts) return;
    const e = E.outExpo(prog(t, ts, ts + .5)), next = i < SLAMS.length - 1 ? slamT(i + 1) : 99;
    const dim = i < SLAMS.length - 1 ? 1 - .62 * sstep(next, next + .35, t) : 1;
    const fy = Math.sin(t * .7 + i * 1.7) * 7;
    const px = lerp(x, 540, col), py = lerp(y + fy, 900, col), sc = (1.32 - .32 * e) * (1 - col);
    if (sc <= .002) return;
    ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc);
    ctx.filter = e < .98 ? `blur(${((1 - e) * 16).toFixed(1)}px)` : 'none';
    text(s, 0, 0, { size: o.size, weight: o.weight, font: o.font || SERIF, style: o.style || '', align: 'center', color: o.color || CREAM, alpha: sstep(ts, ts + .1, t) * dim, ls: 6, glow: o.color ? `rgba(${O_RGB},.35)` : null, blur: 30 });
    ctx.restore();
  });
  ctx.restore();
  if (t > 27.6) you(540, 900, t, sstep(27.75, 28.3, t));
}

// ======================================================================== ④ 渺小：从人群一路拉远到“暗淡蓝点”
// 世界坐标：地球中心 (0,0)，半径 1；“你”在地球夜面的 P 点。Z 是每个世界单位多少像素（取对数做关键帧）。
const P = [-0.42, 0.10];
const ZL = track([[28.3, Math.log(2.6e5)], [35.4, 5.4, E.ioSine], [39.9, -0.95], [47.5, -1.3]]);
let EARTH, CROWD = [];
function makeEarth(N = 1536) {
  const c = mk(N, N), g = c.getContext('2d'), im = g.createImageData(N, N), d = im.data, R = N / 2;
  const L = (v => { const n = Math.hypot(...v); return v.map(x => x / n); })([.92, -.14, .22]);
  const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const nx = (i + .5 - R) / R, ny = (j + .5 - R) / R, r2 = nx * nx + ny * ny, k = (j * N + i) * 4;
    if (r2 >= 1) { d[k + 3] = 0; continue; }
    const nz = Math.sqrt(1 - r2), lon = Math.atan2(nx, nz), lat = Math.asin(-ny);
    const dp2 = (nx - P[0]) ** 2 + (ny - P[1]) ** 2;
    const h = fbm(lon * 1.9 + 4.3, lat * 2.3 + 1.7, 5) + .2 * Math.exp(-dp2 / .012);
    const land = h > .555;
    let col = land ? mix([44, 60, 38], [118, 100, 70], fbm(lon * 7, lat * 7, 3)) : mix([6, 24, 52], [18, 66, 112], clamp((h - .32) * 3.2));
    if (Math.abs(lat) > 1.22) col = mix(col, [225, 232, 238], .9);
    col = mix(col, [236, 241, 246], sstep(.57, .76, fbm(lon * 3.4 + 20, lat * 5.4 - 3, 5)) * .85);
    const lit = nx * L[0] + ny * L[1] + nz * L[2], diff = clamp(lit * 1.15 + .04), limb = .55 + .45 * nz;
    let rr = col[0] * (.025 + .975 * diff) * limb, gg = col[1] * (.025 + .975 * diff) * limb, bb = col[2] * (.03 + .97 * diff) * limb;
    const haze = Math.pow(1 - nz, 2.6) * (.25 + .75 * clamp(lit + .3));          // 大气的蓝边
    rr += 70 * haze; gg += 130 * haze; bb += 255 * haze;
    const night = 1 - sstep(-.1, .08, lit);
    if (land && night > 0) {                                                       // 夜面的城市灯光
      let lights = sstep(.6, .78, fbm(lon * 46, lat * 46, 3)) * sstep(.4, .64, fbm(lon * 12, lat * 12, 2)) * .8;
      lights += Math.exp(-dp2 / .0011) * (.7 + .7 * fbm(lon * 90, lat * 90, 2));
      lights *= night;
      rr += 255 * lights; gg += 190 * lights; bb += 110 * lights;
    }
    d[k] = clamp(rr, 0, 255); d[k + 1] = clamp(gg, 0, 255); d[k + 2] = clamp(bb, 0, 255); d[k + 3] = 255;
  }
  g.putImageData(im, 0, 0); return c;
}
function bands(a) {                                                                 // 旅行者 1 号照片里那几道散射的阳光
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, w, rgb, al] of [[330, 80, '125,105,165', .10], [532, 100, '175,125,85', .17], [612, 40, '205,155,105', .10], [790, 90, '105,135,175', .09]]) {
    ctx.save(); ctx.translate(x, 960); ctx.rotate(.055);
    const g = ctx.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(.5, `rgba(${rgb},${al * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(-w, -1400, 2 * w, 2800); ctx.restore();
  }
  ctx.restore();
}
function sceneCosmos(t) {
  if (t < 27.6 || t > 47.8) return;
  const lz = ZL(t), Z = Math.exp(lz), w = sstep(5.6, 7.6, lz), C = [P[0] * w, P[1] * w];
  const S = (x, y) => [540 + (x - C[0]) * Z, 900 + (y - C[1]) * Z];
  const fin = sstep(27.6, 28.4, t);
  bands((1 - sstep(.5, 2.4, lz)) * (1 - sstep(45.0, 47.2, t)));
  // 街道的网格（离得最近的时候）
  const gA = sstep(10.6, 11.8, lz) * .07 * fin;
  if (gA > 0) {
    const sp = 4.2e-4;
    ctx.save(); ctx.strokeStyle = `rgba(170,190,230,${gA})`; ctx.lineWidth = 1.2;
    for (let k = Math.floor((C[0] - 560 / Z) / sp); k * sp < C[0] + 560 / Z; k++) { const x = S(k * sp, 0)[0]; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let k = Math.floor((C[1] - 1000 / Z) / sp); k * sp < C[1] + 1000 / Z; k++) { const y = S(0, k * sp)[1]; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.restore();
  }
  // 地球
  const eA = 1 - sstep(7.7, 8.9, lz), [ex, ey] = S(0, 0), rE = Z;
  if (eA > 0) {
    if (rE > 2.2) {
      ctx.save(); ctx.globalAlpha = eA;
      const g = ctx.createRadialGradient(ex, ey, rE * .96, ex, ey, rE * 1.14);
      g.addColorStop(0, 'rgba(110,170,255,.35)'); g.addColorStop(1, 'rgba(110,170,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, rE * 1.14, 0, TAU); ctx.fill();
      ctx.drawImage(EARTH, ex - rE, ey - rE, 2 * rE, 2 * rE); ctx.restore();
    } else glow(ex, ey, Math.max(.9, rE * .8), '165,195,255', eA, 5);
  }
  // 人群：一个个暖白色的点，拉远后汇成城市的一团灯光
  const cA = sstep(7.3, 8.5, lz) * fin;
  if (cA > 0) {
    const r = clamp(2.6e-5 * Z, .8, 4.6);
    ctx.save(); if (r < 2) ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#efe6d6';
    for (const p of CROWD) {
      const [x, y] = S(P[0] + p.dx, P[1] + p.dy); if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue;
      ctx.globalAlpha = cA * p.a * (r < 2 ? .7 : 1);
      if (r < 2) ctx.fillRect(x - r, y - r, r * 2, r * 2); else { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
  }
  // 你
  const [yx, yy] = S(P[0], P[1]);
  you(yx, yy, t, sstep(1.9, 3.4, lz) * fin, 8);
  const lab = win(t, 33.6, 38.0, .6, .6);
  if (lab > 0) { seg(yx + 12, yy - 12, yx + 70, yy - 70, 'rgba(236,230,218,.7)', 1.5, lab); text('你在这里', yx + 82, yy - 78, { font: SANS, size: 28, weight: 500, alpha: lab, ls: 2 }); }
  // 暗淡蓝点的标注
  const ca = win(t, 39.7, 45.7, .6, .8);
  if (ca > 0) {
    const k = E.outExpo(prog(t, 39.7, 40.6));
    ctx.save(); ctx.globalAlpha = ca; ctx.strokeStyle = 'rgba(236,230,218,.8)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(ex, ey, 70 - 40 * k, 0, TAU); ctx.stroke(); ctx.restore();
    seg(ex + 22, ey - 22, ex + 22 + 120 * k, ey - 22 - 120 * k, 'rgba(236,230,218,.7)', 1.5, ca);
    text('地球', ex + 160, ey - 168, { size: 40, weight: 700, alpha: ca * sstep(40.1, 40.6, t), ls: 4 });
    text('0.12 像素', ex + 160, ey - 116, { font: LAT, size: 38, weight: 600, color: ORANGE, alpha: ca * sstep(40.4, 40.9, t), ls: 2 });
  }
}

// ======================================================================== ⑤ 上帝死了 · 两种虚无
let RCON = [];                                                                    // 右半边（积极的虚无）自己连成的小星座
function sceneNietzsche(t) {
  if (t < 45.5 || t > 65.5) return;
  const st0 = 46.15, out = sstep(54.3, 55.3, t);
  if (t > st0 && t < 55.4) {
    const ls = lerp(64, 24, E.outExpo(prog(t, st0, st0 + 2.4)));
    const o = { size: 136, weight: 900, ls, color: CREAM, align: 'center', spread: 2.5, blur: 18, rise: 0, glow: 'rgba(255,230,200,.2)', glowBlur: 34 };
    const p = prog(t, st0, st0 + 1.0), A = [150, 838], B = [930, 722], yAt = x => A[1] + (B[1] - A[1]) * (x - A[0]) / (B[0] - A[0]);
    const sep = E.outExpo(prog(t, 50.95, 52.6));
    if (t < 50.95) typeText('上帝死了', 540, 780, o, p, 1 - out);
    else for (const up of [true, false]) {                                        // 沿着裂缝，字裂成上下两半
      ctx.save(); ctx.beginPath();
      if (up) { ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, yAt(W)); ctx.lineTo(0, yAt(0)); }
      else { ctx.moveTo(0, yAt(0)); ctx.lineTo(W, yAt(W)); ctx.lineTo(W, H); ctx.lineTo(0, H); }
      ctx.closePath(); ctx.clip();
      ctx.translate(540, 780); ctx.rotate((up ? -.01 : .022) * sep); ctx.translate(-540 + (up ? -6 : 12) * sep, -780 + (up ? -10 : 36) * sep);
      typeText('上帝死了', 540, 780, o, 1, (1 - out) * (up ? 1 : 1 - .25 * sep));
      ctx.restore();
    }
    const ck = prog(t, 50.72, 50.98), cf = 1 - prog(t, 51.0, 52.0);
    if (ck > 0 && cf > 0) {
      ctx.save(); ctx.shadowColor = 'rgba(255,240,220,.9)'; ctx.shadowBlur = 18;
      seg(A[0], A[1], lerp(A[0], B[0], E.out(ck)), lerp(A[1], B[1], E.out(ck)), '#fff6ea', 2.5, cf); ctx.restore();
    }
    text('Gott ist tot.', 540, 920, { font: LAT, style: 'italic', weight: 500, size: 48, align: 'center', color: DIM, alpha: sstep(47.0, 48.2, t) * (1 - out) * (1 - .7 * sep), ls: 2 });
  }
  // 分界线与两种虚无
  const dv = E.io(prog(t, 55.6, 56.6)), lA = 1 - sstep(CUT - .04, CUT + .08, t), rA = 1 - sstep(63.7, 64.6, t);
  if (dv > 0) seg(540, 470, 540, 470 + 800 * dv, 'rgba(236,230,218,.32)', 1.5, lA);
  typeText('消极的虚无', 300, 520, { size: 44, weight: 700, align: 'center', color: '#9aa2b0', ls: 6, spread: 4 }, prog(t, 56.3, 57.1), lA);
  typeText('没意义，就放弃。', 300, 588, { size: 32, weight: 500, align: 'center', color: DIM, ls: 3 }, prog(t, 56.8, 57.8), lA);
  typeText('积极的虚无', 780, 520, { size: 44, weight: 700, align: 'center', color: ORANGE, ls: 6, spread: 4, glow: `rgba(${O_RGB},.3)`, glowBlur: 20 }, prog(t, 57.7, 58.5), rA);
  typeText('没意义，就自己创造。', 780, 588, { size: 32, weight: 500, align: 'center', color: CREAM, ls: 3 }, prog(t, 58.2, 59.2), rA);
  // 右边：星星自己连起来
  if (t > 58.4) {
    ctx.save(); ctx.lineCap = 'round';
    for (const e of RCON) {
      const k = E.out(prog(t, e.t, e.t + .45)); if (k <= 0) continue;
      const [x1, y1] = starPos(e.a, t, TILT(t)), [x2, y2] = starPos(e.b, t, TILT(t));
      ctx.globalAlpha = .6 * rA; ctx.strokeStyle = `rgba(${O_RGB},.8)`; ctx.lineWidth = 1.6; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, k), lerp(y1, y2, k)); ctx.stroke();
      glow(x1, y1, 1.8, O_RGB, .8 * rA * k, 5);
    }
    ctx.restore();
  }
}

// ======================================================================== ⑥ 星座：星星连成一只猫
const CAT_C = [540, 905], CAT_K = 1.12;
const CAT_OUT = [[-84, -292], [-30, -232], [30, -232], [84, -292], [100, -190], [104, -128], [62, -80], [140, 60], [150, 210], [96, 250], [-96, 250], [-150, 210], [-140, 60], [-62, -80], [-104, -128], [-100, -190]];
const CAT_TAIL = [[150, 210], [216, 236], [252, 164], [238, 96], [202, 70]];
const CAT_EDGES = [...CAT_OUT.map((p, i) => [p, CAT_OUT[(i + 1) % CAT_OUT.length]]), ...CAT_TAIL.slice(0, -1).map((p, i) => [p, CAT_TAIL[i + 1]])];
const CAT_T0 = 64.75, catEdgeT = i => CAT_T0 + i * BEAT / 2, EYES_T = catEdgeT(CAT_EDGES.length) + .25;
const catXY = ([x, y], t) => [CAT_C[0] + x * CAT_K, CAT_C[1] + y * CAT_K + TILT(t) * .9];
function sceneCat(t) {
  if (t < 63.4 || t > 74) return;
  const A = sstep(63.6, 64.7, t) * (1 - sstep(72.0, 73.4, t));
  if (A <= 0) return;
  ctx.save(); ctx.lineCap = 'round';
  CAT_EDGES.forEach(([p, q], i) => {
    const k = E.out(prog(t, catEdgeT(i), catEdgeT(i) + .38)); if (k <= 0) return;
    const [x1, y1] = catXY(p, t), [x2, y2] = catXY(q, t);
    ctx.globalAlpha = .78 * A; ctx.strokeStyle = 'rgb(242,224,190)'; ctx.lineWidth = 2; ctx.shadowColor = 'rgba(255,220,170,.9)'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, k), lerp(y1, y2, k)); ctx.stroke();
  });
  ctx.restore();
  const seen = new Set();
  for (const p of [...CAT_OUT, ...CAT_TAIL]) {                                    // 组成猫的星星，比周围亮一点
    const key = p.join(); if (seen.has(key)) continue; seen.add(key);
    const [x, y] = catXY(p, t), tw = .75 + .25 * Math.sin(t * 2.3 + p[0] * .07);
    glow(x, y, 2.6, '255,236,205', A * tw, 5);
  }
  const eo = E.outExpo(prog(t, EYES_T, EYES_T + .7));                             // 眼睛：一只橙、一只青
  for (const [x0, rgb] of [[-42, O_RGB], [42, T_RGB]]) {
    const [x, y] = catXY([x0, -152], t);
    glow(x, y, 2.4 + 3.4 * eo, rgb, A * (.35 + .65 * eo), 7);
    flare(x, y, 18 + 46 * eo * (1 - .4 * prog(t, EYES_T + .7, EYES_T + 2.5)), rgb, A * eo);
  }
}

// ======================================================================== ⑦ 仰望：桉树与掉落的笔
let TREES = [], LEAVES = [], BRANCHES = [];
const VP = [540, 430];
function sceneAwe(t) {
  if (t < 70.8 || t > 81.8) return;
  const rise = 1150 * (1 - E.io(prog(t, 71.0, 73.5))) + 1200 * E.in(prog(t, 80.2, 81.7));
  const A = 1 - sstep(81.0, 81.7, t);
  ctx.save(); ctx.translate(0, rise);
  const g0 = ctx.createRadialGradient(VP[0], VP[1], 0, VP[0], VP[1], 700);          // 树冠中间透下来的月光
  g0.addColorStop(0, `rgba(120,140,190,${.13 * A})`); g0.addColorStop(1, 'rgba(120,140,190,0)');
  ctx.fillStyle = g0; ctx.fillRect(0, -300, W, 1500);
  for (const tr of TREES) {                                                        // 树干：从画面底部伸向天顶，朝里的一侧有一道月光的边
    const xt = lerp(tr.x, VP[0], tr.f), yt = lerp(2050, VP[1], tr.f), inner = tr.x > VP[0] ? -1 : 1;
    ctx.globalAlpha = A; ctx.fillStyle = '#040507';
    ctx.beginPath(); ctx.moveTo(tr.x - tr.w / 2, 2050); ctx.lineTo(tr.x + tr.w / 2, 2050); ctx.lineTo(xt + 4, yt); ctx.lineTo(xt - 4, yt); ctx.closePath(); ctx.fill();
    const ex = tr.x + inner * tr.w / 2, g = ctx.createLinearGradient(0, 2050, 0, yt);
    g.addColorStop(0, 'rgba(170,190,230,0)'); g.addColorStop(.6, 'rgba(170,190,230,.22)'); g.addColorStop(1, 'rgba(170,190,230,.05)');
    ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(ex, 2050); ctx.lineTo(xt + inner * 4, yt); ctx.stroke();
  }
  ctx.strokeStyle = '#040507'; ctx.lineCap = 'round';
  for (const b of BRANCHES) { ctx.globalAlpha = A; ctx.lineWidth = b.w; ctx.beginPath(); ctx.moveTo(b.x0, b.y0); ctx.quadraticCurveTo(b.cx, b.cy, b.x1, b.y1); ctx.stroke(); }
  ctx.fillStyle = '#030405';                                                       // 桉树叶：细长、下垂，随风轻轻摆
  for (const l of LEAVES) {
    ctx.globalAlpha = A * l.a; ctx.beginPath();
    ctx.ellipse(l.x, l.y, l.rx, l.ry, l.rot + Math.sin(t * .9 + l.p) * .07, 0, TAU); ctx.fill();
  }
  ctx.restore();
  you(lerp(700, 520, E.io(prog(t, 77.7, 78.8))), 1150, t, sstep(72.6, 73.6, t) * (t < 80.2 ? 1 : 0), 8);
  // 掉落的笔：陌生人（青）掉了笔，你（橙）走过去帮忙捡起来
  const pA = win(t, 76.2, 81.0, .5, .7);
  if (pA > 0) {
    const sx = 360, gy = 1205, yX = lerp(700, 520, E.io(prog(t, 77.7, 78.8)));
    glow(sx, 1150, 8, T_RGB, pA, 6);
    for (let j = 0; j < 6; j++) {
      const r = mulberry(40 + j), vx = (r() - .4) * 160, land = 77.15 + r() * .35, fx = sx + vx + (r() - .5) * 30;
      const f = prog(t, 76.85, land), fall = E.in(f);
      let x = lerp(sx + (r() - .5) * 20, fx, f), y = lerp(1140, gy - 4, fall), rot = r() * 6 + f * (4 + r() * 4);
      const pick = E.io(prog(t, 78.85 + j * .07, 79.5 + j * .07));
      x = lerp(x, yX, pick); y = lerp(y, 1150, pick); rot = lerp(rot, -PI / 2, pick);
      ctx.save(); ctx.globalAlpha = pA * (1 - sstep(.75, 1, pick)); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = j % 2 ? '#d9dee7' : '#b9c2d0'; ctx.beginPath(); ctx.roundRect(-20, -3.5, 40, 7, 3.5); ctx.fill(); ctx.restore();
    }
    const ln = E.out(prog(t, 79.7, 80.4));
    if (ln > 0) { ctx.save(); ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 12; seg(yX - 14, 1150, lerp(yX - 14, sx + 14, ln), 1150, `rgba(${O_RGB},.85)`, 2, pA); ctx.restore(); }
    seg(250, gy + 2, 830, gy + 2, 'rgba(236,230,218,.14)', 1.5, pA);
  }
}

// ======================================================================== ⑧ 永恒轮回：一圈圈重来的日子，越转越快
const RC = [540, 880], RR = 300, LA = .1245, LB = 1.1, L0 = 81.7;
const loops = t => t < L0 ? 0 : LA * (Math.exp(LB * (t - L0)) - 1);
const DAY = [['醒来', -90], ['出门', -18], ['上课 · 上班', 54], ['刷手机', 126], ['睡觉', 198]];
function sceneLoop(t) {
  if (t < 80.2 || t > 88.6) return;
  const col = E.inExpo(prog(t, 87.2, 87.95)), R = RR * (1 - col), A = sstep(80.6, 81.6, t);
  const L = loops(t), th = -PI / 2 + TAU * L;
  // “你”从树下升到圆环顶端
  const enter = E.io(prog(t, 80.5, 81.7));
  let x = lerp(520, RC[0] + R * Math.cos(th), enter), y = lerp(1150, RC[1] + R * Math.sin(th), enter);
  if (A > 0) {
    ctx.save(); ctx.globalAlpha = A * .16; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(RC[0], RC[1], Math.max(.1, R), 0, TAU); ctx.stroke(); ctx.restore();
    const speed = LA * LB * Math.exp(LB * Math.max(0, t - L0)) * TAU;           // 每秒转过的弧度
    const tail = Math.min(TAU * .985, .5 + speed * .16), n = 48;
    ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 14;
    for (let i = 0; i < n; i++) {
      const a0 = th - tail * (i + 1) / n, a1 = th - tail * i / n;
      ctx.globalAlpha = A * Math.pow(1 - i / n, 1.6) * .9; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(RC[0], RC[1], Math.max(.1, R), a0, a1); ctx.stroke();
    }
    ctx.restore();
    DAY.forEach(([s, deg]) => {
      const a = deg * PI / 180, dif = Math.abs(((th - a) % TAU + TAU) % TAU), lit = Math.exp(-dif * 2.2) + clamp((speed - 6) / 12);
      text(s, RC[0] + (R + 84) * Math.cos(a), RC[1] + (R + 84) * Math.sin(a), { size: 34, weight: 500, align: 'center', color: lit > .5 ? CREAM : DIM, alpha: A * (1 - col) * (.45 + .55 * clamp(lit)), ls: 3 });
    });
    const n0 = Math.floor(L) + 1;
    text(n0 > 99 ? '第 ∞ 遍' : `第 ${n0} 遍`, RC[0], RC[1], { size: 54, weight: 700, align: 'center', alpha: sstep(82.0, 82.6, t) * (1 - col), ls: 4 });
  }
  you(x, y, t, 1 - sstep(87.9, 88.2, t), 9);
}

// ======================================================================== ⑨ 再来一次
const SPARKS = Array.from({ length: 160 }, (_, i) => { const r = mulberry(900 + i); return { a: r() * TAU, v: 300 + r() * 900, s: 1 + r() * 2.4, l: .8 + r() * 1.4 }; });
function sceneEnd(t) {
  if (t < REBUILD - .05) return;
  const d = t - REBUILD;
  const fl = 1 - prog(t, REBUILD, REBUILD + .5);                                  // 闪光、冲击波、火花
  if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.4 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const sw = prog(t, REBUILD, REBUILD + 1.8);
  if (sw < 1) { ctx.save(); ctx.globalAlpha = 1 - sw; ctx.strokeStyle = `rgba(${O_RGB},1)`; ctx.lineWidth = 8 * (1 - sw) + 1; ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(RC[0], RC[1], 20 + 1300 * E.outExpo(sw), 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const s of SPARKS) {
    const u = d / s.l; if (u <= 0 || u >= 1) continue;
    const k = E.outExpo(u), x = RC[0] + Math.cos(s.a) * s.v * k, y = RC[1] + Math.sin(s.a) * s.v * k;
    ctx.globalAlpha = (1 - u) * .9; ctx.fillStyle = '#ffd9a6'; ctx.fillRect(x - s.s / 2, y - s.s / 2, s.s, s.s);
  }
  ctx.restore();
  // 你：落到画面下方，跟着每小节发出一圈光
  const yy = lerp(RC[1], 1140, E.io(prog(t, REBUILD + .4, REBUILD + 1.8)));
  for (let k = 0; k < 7; k++) {
    const u = prog(t, REBUILD + .4 + k * BAR, REBUILD + .4 + k * BAR + 2.2); if (u <= 0 || u >= 1) continue;
    ctx.save(); ctx.globalAlpha = (1 - u) * .55; ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(540, yy, 14 + 240 * E.out(u), 0, TAU); ctx.stroke(); ctx.restore();
  }
  you(540, yy, t, sstep(REBUILD, REBUILD + .3, t) * (1 - sstep(TOTAL - 1.2, TOTAL, t)), 11);
  // 第一句：你会绝望，还是会说：再来一次？
  const o1 = 1 - sstep(91.9, 92.6, t), up1 = -18 * E.in(prog(t, 91.9, 92.6));
  const big = { weight: 700, align: 'center', spread: 4, blur: 14, rise: 18 };
  typeText('你会绝望，', 540, 610 + up1, { ...big, size: 64 }, prog(t, 88.15, 88.9), o1);
  typeText('还是会说：', 540, 706 + up1, { ...big, size: 64 }, prog(t, 89.05, 89.8), o1);
  typeText('「再来一次」？', 540, 836 + up1, { ...big, size: 108, weight: 900, glow: `rgba(${O_RGB},.4)`, glowBlur: 34 }, prog(t, 89.85, 90.7), o1);
  // 最后一句
  typeText('让这一生，', 540, 690, { ...big, size: 70 }, prog(t, 95.75, 96.5), 1);
  typeText('「值得重来。」', 540, 812, { ...big, size: 118, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 40 }, prog(t, 96.45, 97.4), 1);
  typeText('Amor fati', 540, 948, { size: 46, weight: 500, font: LAT, style: 'italic', align: 'center', color: DIM, ls: 4, spread: 3 }, prog(t, 97.6, 98.4), 1);
  typeText('爱你的命运 · 尼采', 540, 1006, { size: 24, weight: 500, font: SANS, align: 'center', color: '#6f7786', ls: 8, spread: 4 }, prog(t, 98.1, 98.9), 1);
}

// ======================================================================== 一帧的世界层（会被动态模糊）
function WORLD(t) {
  space(t);
  aurora(t, .55 * (1 - sstep(8.5, 11, t)));
  starfield(t);
  sceneHook(t); sceneTitle(t); sceneSlams(t); sceneCosmos(t); sceneNietzsche(t); sceneCat(t); sceneAwe(t); sceneLoop(t); sceneEnd(t);
}
// 动作快的地方多取几个子帧
function SAMPLES(T) {
  if (T > DROP - .7 && T < DROP + .5) return 6;
  if ((T > 9.2 && T < 13) || (T > 26.3 && T < 41.5) || (T > 50.6 && T < 52.6) || (T > 83 && T < REBUILD + 1.4)) return 4;
  return 3;
}
function BLOOM_K(T) { return .45 + .2 * win(T, 12, 17.2, .6, .4) + .25 * win(T, 63.5, 72.5, 1, 1) + .3 * win(T, REBUILD - .2, 92, .2, 1) + .2 * sstep(95.5, 97, T); }
function OVER(T) {
  stamp('1990.02.14', 'Voyager 1', 33.2, 41.6, T);
  stamp('1994', 'Carl Sagan · Pale Blue Dot', 41.9, 45.6, T);
  stamp('1882', 'Friedrich Nietzsche', 46.1, 55.2, T);
  stamp('2015', 'Piff et al. · JPSP', 75.4, 80.3, T);
  stamp('1882', 'Die fröhliche Wissenschaft · §341', 80.8, 87.6, T);
}
function MASTER(T) { return 1; }

// ======================================================================== 预计算
function INIT() {
  const r = mulberry(14);
  STARS = Array.from({ length: 950 }, () => {
    const b = Math.pow(r(), 3);
    return { x: r() * W, y: -760 + r() * (H + 1500), z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.1 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .18 };
  });
  const rc = mulberry(21), gauss = () => { let u = 0; for (let k = 0; k < 6; k++) u += rc(); return (u - 3) / 1.2; };
  CROWD = Array.from({ length: 900 }, (_, i) => { const s = i < 260 ? 7e-4 : 3.6e-3; return { dx: gauss() * s, dy: gauss() * s, a: .35 + rc() * .45 }; });
  EARTH = makeEarth();
  HOOK1 = raster('反正最后都会消失，', H1, 3, 2); HOOK2 = raster('你做的一切，还有意义吗？', H2, 3, 3);
  OW = ORBIT.map((s, i) => raster(s, WO, 2, 10 + i));
  TITLE = raster('虚无主义', TITLE_O, 4, 5);
  const rt = mulberry(6);
  for (const p of TITLE.pts) { const a = rt() * TAU, d = 380 + rt() * 720; p.sx = Math.cos(a) * d; p.sy = Math.sin(a) * d * 1.2 - 140; p.bend = (rt() - .5) * .5; }
  // 右半边的星：挑亮一点的，按位置连成几组
  const T0 = 58.5, cand = STARS.filter(s => { const [x, y] = starPos(s, T0); return x > 600 && x < 1010 && y > 650 && y < 1240 && s.b > .3; }).slice(0, 26);
  const used = new Set(); RCON = [];
  cand.forEach(a => {
    const [ax, ay] = starPos(a, T0);
    const near = cand.filter(b => b !== a).map(b => { const [bx, by] = starPos(b, T0); return [b, Math.hypot(bx - ax, by - ay)]; }).filter(([, d]) => d < 190).sort((p, q) => p[1] - q[1]).slice(0, 2);
    for (const [b] of near) { const key = [a, b].map(s => STARS.indexOf(s)).sort().join(); if (!used.has(key)) { used.add(key); RCON.push({ a, b }); } }
  });
  RCON.sort((p, q) => starPos(p.a, T0)[1] - starPos(q.a, T0)[1]).forEach((e, i) => e.t = 58.6 + i * BEAT / 2);
  const rtr = mulberry(31);
  TREES = Array.from({ length: 9 }, (_, i) => ({ x: -170 + i * 178 + (rtr() - .5) * 60, w: 48 + rtr() * 52, f: .66 + rtr() * .1 }));
  BRANCHES = []; LEAVES = [];
  const leafAt = (x, y, n, spread) => { for (let k = 0; k < n; k++) { const a = rtr() * TAU, d = Math.pow(rtr(), .6) * spread; LEAVES.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * .8, rx: 15 + rtr() * 17, ry: 3.2 + rtr() * 3, rot: PI / 2 + (rtr() - .5) * 1.4, p: rtr() * 6, a: .8 + rtr() * .2 }); } };
  for (const tr of TREES) {
    const xt = lerp(tr.x, VP[0], tr.f), yt = lerp(2050, VP[1], tr.f);
    for (let k = 0; k < 5; k++) {
      const f = .55 + k * .1 + rtr() * .05, x0 = lerp(tr.x, xt, f / tr.f > 1 ? 1 : f / tr.f), y0 = lerp(2050, yt, f / tr.f > 1 ? 1 : f / tr.f);
      const out = (tr.x > VP[0] ? 1 : -1) * (rtr() < .25 ? -1 : 1), len = 140 + rtr() * 220;
      const x1 = x0 + out * len * (.6 + rtr() * .4), y1 = y0 - len * (.5 + rtr() * .6);
      BRANCHES.push({ x0, y0, cx: (x0 + x1) / 2 + out * 30, cy: (y0 + y1) / 2 + 40, x1, y1, w: 3 + rtr() * 5 });
      leafAt(x1, y1, 46, 120);
    }
    leafAt(xt, yt, 60, 150);
  }
  for (let k = 0; k < 520; k++) { const a = rtr() * TAU, d = 380 + Math.pow(rtr(), .8) * 700; leafAt(VP[0] + Math.cos(a) * d * 1.05, VP[1] + Math.sin(a) * d * .82, 1, 0); }
}

// ======================================================================== 音效提示表（给 tools/cine/sfx.py）
const NOTE = { F4: 349.23, Ab4: 415.3, Bb4: 466.16, C5: 523.25, Eb5: 622.25, F5: 698.46, Ab5: 830.61, Bb5: 932.33, C6: 1046.5, Eb6: 1244.5, F6: 1396.9 };
function CUES() {
  const c = [];
  ORBIT.forEach((_, i) => c.push([4.7 + i * .72, 'dust', { dur: 1.6, gain: .3 }]));
  c.push([9.25, 'dust', { dur: 2.2, gain: .5 }], [10.1, 'swell', { dur: 2.0, gain: .45 }], [12.2, 'shimmer', { gain: .45 }]);
  c.push([DROP - 1.2, 'riser', { dur: 1.2, gain: .55 }], [DROP, 'boom', { gain: .9 }], [DROP, 'whoosh', { dur: .9, gain: .5 }]);
  SLAMS.forEach((_, i) => i && c.push([slamT(i), 'thud', { gain: .55 }]));
  c.push([26.5, 'suck', { dur: 1.75, gain: .5 }], [28.3, 'tink', { f: NOTE.C6, gain: .35 }]);
  c.push([28.6, 'air', { dur: 11.5, gain: .42 }], [40.0, 'tink', { f: NOTE.F6, gain: .3 }]);
  c.push([46.15, 'boom', { gain: .55 }], [50.72, 'crack', { gain: .7 }], [55.6, 'swish', { dur: 1.0, gain: .35 }]);
  RCON.forEach((e, i) => c.push([e.t, 'tink', { f: [NOTE.C6, NOTE.Eb6, NOTE.F6, NOTE.Ab5, NOTE.Bb5][i % 5], gain: .13 }]));
  c.push([CUT - 1.7, 'revcym', { dur: 1.7, gain: .5 }], [CUT, 'boom', { gain: 1.0, deep: 1 }]);
  const arp = ['F5', 'Ab5', 'C6', 'Eb6', 'C6', 'Ab5', 'Bb5', 'C6', 'F5', 'Ab5', 'C6', 'F6', 'Eb6', 'C6', 'Bb5', 'Ab5', 'C5', 'Eb5', 'F5', 'Ab5'];
  CAT_EDGES.forEach((_, i) => c.push([catEdgeT(i), 'tink', { f: NOTE[arp[i % arp.length]], gain: .22 }]));
  c.push([EYES_T, 'shimmer', { gain: .6 }], [71.0, 'air', { dur: 2.6, gain: .25 }]);
  for (let j = 0; j < 6; j++) { const r = mulberry(40 + j); r(); r(); c.push([77.15 + r() * .35, 'click', { gain: .35 }]); }
  c.push([79.7, 'tink', { f: NOTE.Ab5, gain: .25 }]);
  for (let n = 1; ; n++) { const tn = L0 + Math.log(n / LA + 1) / LB; if (tn > 87.2) break; if (n <= 12 || n % 3 === 0) c.push([tn, 'tick', { gain: .3 }]); }
  c.push([85.5, 'riser', { dur: REBUILD - 85.5, gain: .6 }], [REBUILD, 'boom', { gain: 1.0 }], [REBUILD, 'shimmer', { gain: .7 }]);
  c.push([95.75, 'swell', { dur: 1.6, gain: .35 }], [96.45, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .32 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
