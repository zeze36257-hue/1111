// ======================================================================== No.46 回避型依恋：不是不会爱，只是爱得很小心（讲课格式第二期）
// 一个人在讲课（AI 配音，不出镜）。结构：问题 → 是什么（两把尺子）→ 一层壳 → 怎么来的 → 怎么办。
// 一镜到底：每一段都从上一段的画面里长出来，不用章节卡——
//   门缝里的光 → 题目；题目下面那一笔 → 尺子的横轴；尺子上的点 → 四个人 → 走到镜头前的那一个；
//   大人缩回一岁的宝宝；心电图那条线一直走，宝宝在线上长回大人；倒带回小时候，看壳一层层长出来；
//   被压下去的那团光反弹起来，回到胸口，变成一条消息。
// 颜色：回避型 = 冷蓝，爱着他的人 = 暖橙；最后冷蓝慢慢变暖。
// 时间：画面里的时间都写成 L(i) + 秒数（第 i 句开始之后），时间轴由 layout.py 按配音的真实长度排出来。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 153.6;
const SECTIONS = [['问题', 0.0, 19.2], ['是什么', 19.2, 41.6], ['一层壳', 41.6, 76.8], ['怎么来的', 76.8, 112.0], ['怎么办', 112.0, 153.6]];
const LINES = [
  [0.15, 3.37, '你是不是这样：越喜欢一个人，越想躲？'],
  [3.82, 5.93, '对方一靠近，你就想往后退；'],
  [6.28, 9.79, '一吵架，你不想说话，只想一个人待着。'],
  [10.34, 12.60, '或者，你正在爱着这样一个人。'],
  [13.05, 15.54, '今天，我们一起来聊聊「回避型依恋」。'],
  [19.50, 23.06, '心理学家用两把尺子，量一个人怎么谈感情：'],
  [23.41, 26.50, '一把是「怕被抛弃」，一把是「怕太亲近」。'],
  [26.95, 29.06, '回避型，是第二把尺子特别高：'],
  [29.31, 34.58, '离得越近，越不自在；其中有一种，还不太担心被丢下。'],
  [35.03, 39.60, '在两项大型调查里，都有大约四分之一的人这样形容自己。'],
  [41.90, 45.73, '很多人以为，回避型就是冷，不在乎。'],
  [46.08, 48.29, '可研究看到的，没那么简单。'],
  [48.99, 53.22, '心理学家观察过一岁的宝宝：妈妈离开房间，再回来。'],
  [53.57, 57.39, '有的宝宝不哭不闹，像什么都没发生，继续玩玩具。'],
  [57.84, 61.98, '可仪器显示，他们的心跳一直很快，迟迟降不下来。'],
  [62.98, 64.31, '长大以后也一样。'],
  [64.61, 69.02, '越习惯回避的人，回忆起被父母拒绝、分开的往事，'],
  [69.22, 72.76, '嘴上说「没什么」，皮肤电反应却明显升高。'],
  [73.46, 75.23, '不在乎，是一层壳。'],
  [77.10, 79.40, '这层壳，是怎么长出来的？'],
  [79.85, 83.59, '心理学家发现，回避型的宝宝，常有这样的经历：'],
  [83.84, 87.98, '难过的时候想要抱抱，却常常被推开、被嫌烦。'],
  [88.43, 90.87, '次数多了，孩子可能就学会了：'],
  [91.12, 93.87, '把需要藏起来，就不会被推开。'],
  [94.67, 101.28, '心理学家管这叫「去激活」：把想靠近的需要压下去，再悄悄拉开距离。'],
  [101.73, 103.99, '可压得住，不代表它不在。'],
  [104.34, 110.14, '实验发现：回避型的人一分心，被压下去的分手念头，就会反弹回来。'],
  [112.30, 113.68, '如果你是回避型：'],
  [113.93, 116.12, '想退的时候，别直接消失。'],
  [116.47, 119.84, '说一句：「我需要一点时间，晚上找你。」'],
  [120.19, 123.54, '给对方一个时间点，也给自己留一条回来的路。'],
  [124.24, 125.97, '如果你爱着一个回避型：'],
  [126.22, 127.96, '越追，对方越跑。'],
  [128.41, 130.63, '给空间，不等于被冷落。'],
  [131.33, 134.24, '依恋类型挺稳定，但不是一辈子的标签。'],
  [134.59, 140.27, '研究发现，在稳定、被好好回应的关系里，有些人会慢慢变得更安心。'],
];
const BIGLINES = [
  [140.87, 144.88, '回避型的人，不是不会爱，只是爱得很小心。'],
  [145.68, 149.71, '评论区说说：你是回避型，还是正在爱着一个回避型？'],
];
// 第 i 句（按时间排，含大字）开始的时间：L(i)；结束：LE(i)
const ALL_LINES = [...LINES, ...BIGLINES].sort((a, b) => a[0] - b[0]);
const L = i => ALL_LINES[i][0], LE = i => ALL_LINES[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const SERIES = '黑猫不说话 · 心理学 No.46';
const S2 = S['是什么'], S3 = S['一层壳'], S4 = S['怎么来的'], S5 = S['怎么办'];

// ======================================================================== 共用
function space() {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, '#11141d'); g.addColorStop(.55, '#08090f'); g.addColorStop(1, '#020305');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
let STARS = [];
function starfield(t, A) {
  if (A <= 0) return;
  ctx.save();
  for (const s of STARS) {
    let x = s.x - t * 3 * s.z; x = ((x + 20) % (W + 40) + W + 40) % (W + 40) - 20;
    const y = s.y - t * 1.2 * s.z, al = A * s.b * (.72 + .28 * Math.sin(t * s.tw + s.ph));
    if (al <= .012 || y < -6 || y > H + 6) continue;
    ctx.globalAlpha = Math.min(1, al); ctx.fillStyle = s.warm ? '#ffdcae' : '#e2eaff'; ctx.fillRect(x - s.s / 2, y - s.s / 2, s.s, s.s);
  }
  ctx.restore();
}
function warmth(a, x = 540, y = 980, r = 900, rgb = '255,170,90') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${.16 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
const chill = (a, x, y, r) => warmth(a, x, y, r, '120,170,255');
function seriesTag(y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  font(30, 500); ctx.letterSpacing = '6px'; const w = ctx.measureText(SERIES).width; ctx.letterSpacing = '0px';
  text(SERIES, W / 2, y, { size: 30, weight: 500, align: 'center', color: ORANGE, ls: 6 });
  ctx.strokeStyle = `rgba(${O_RGB},.5)`; ctx.lineWidth = 1.5;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(W / 2 + k * (w / 2 + 24), y); ctx.lineTo(W / 2 + k * (w / 2 + 84), y); ctx.stroke(); }
  ctx.restore();
}
function pill(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 30; font(size, o.weight || 700, SANS); const w = ctx.measureText(s).width + 56;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 24; }
  ctx.fillStyle = o.fill || 'rgba(20,24,34,.9)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 1.05, w, size * 2.1, size * 1.05); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 700, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
const big = { align: 'center', spread: 3, blur: 14, rise: 18 };
function circ(x, y, r, col, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
const GOLD = '#ffd2a0', WARMC = '#ffb36b', COOL = '#7f9cc4', ICE = '#bfe0ff', TEALC = '#7fe3d3', RED = '#e5484d';
const C_RGB2 = '127,156,196', ICE_RGB = '190,225,255', W_RGB = '255,214,160';
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}
function say(s, x, y, a, col = CREAM, size = 28) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 44, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(26,28,38,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, y + h / 2 - 1); ctx.lineTo(x, y + h / 2 + 14); ctx.lineTo(x + 10, y + h / 2 - 1); ctx.fill(); ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}
function thread(x1, y1, x2, y2, a, col = W_RGB, sag = 30, w = 3) {                                       // 两个人之间的一根线
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${col},.9)`; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + sag, x2, y2); ctx.stroke(); ctx.restore();
}
function pop(t, t0) { const k = prog(t, t0, t0 + .45); return k <= 0 ? 0 : 1 + .18 * Math.sin(PI * Math.min(1, k * 1.25)) * (1 - k); }
function floor(y, x0, x1, a) { seg(x0, y, x1, y, 'rgba(236,230,218,.28)', 2, a); }

// 一个人。o.baby：0 大人 → 1 一岁宝宝的比例；o.arm：伸手（o.dir 朝向）；o.heart：胸口的光（o.beat 跳一下时变大）；
// o.lift / o.reach：手抬到多高、伸多远；o.gone：从脚往上消失；o.sq：横向压扁（转身）。胸口在 (x, y + s * (top + 30))。
function figDims(k) { return { hr: lerp(22, 29, k), hy: lerp(-84, -60, k), top: lerp(-54, -30, k), hw: lerp(40, 33, k), bot: 30 }; }
function chestY(y, s, k = 0) { return y + s * (figDims(k).top + 30); }
function fig(x, y, s, a, col, o = {}) {
  if (a <= 0 || s <= 0) return;
  const { hr, hy, top, hw, bot } = figDims(o.baby || 0), gone = o.gone || 0, lw = 3 / Math.max(.5, s);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * (o.sq ?? 1), s);
  if (gone > 0) { ctx.beginPath(); ctx.rect(-300, -500, 600, 500 + lerp(bot + 4, hy - hr - 4, gone)); ctx.clip(); }
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.fillStyle = 'rgba(16,17,23,.96)'; ctx.shadowColor = col; ctx.shadowBlur = 8;
  if (o.arm > 0) {                                                                                       // 伸出去的手
    const d = o.dir || 1, ax = d * (hw - 8), ay = top + 20, ex = ax + d * (o.reach || 50) * o.arm, ey = ay + lerp(34, o.lift ?? -22, o.arm);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 9 / Math.max(.5, s); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
  }
  ctx.beginPath(); ctx.arc(0, hy, hr, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-hw, bot); ctx.lineTo(-hw, top + 32); ctx.quadraticCurveTo(-hw, top + 2, -hw + 28, top); ctx.lineTo(hw - 28, top);
  ctx.quadraticCurveTo(hw, top + 2, hw, top + 32); ctx.lineTo(hw, bot); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (o.tear > 0) { ctx.save(); ctx.globalAlpha *= o.tear * (1 - sstep(.75, 1, o.tearY)); ctx.fillStyle = ICE; ctx.shadowColor = ICE; ctx.shadowBlur = 8; ctx.translate(hr * .42, hy + 2 + 10 * o.tearY); ctx.scale(1.7, 1.7);
    ctx.beginPath(); ctx.moveTo(0, -7); ctx.quadraticCurveTo(5.5, 2, 0, 4.5); ctx.quadraticCurveTo(-5.5, 2, 0, -7); ctx.fill(); ctx.restore(); }
  ctx.restore();
  if (o.heart > 0) {
    const cy = y + s * (top + 30), r = s * (4 + 3 * (o.beat || 0));
    glow(x, cy, r, o.heartRgb || '255,170,110', a * o.heart, 5 + 3 * (o.beat || 0));
  }
}
// 从脚往上消失时飘起来的碎光
function dust(x, y, s, gone, col, a, seed = 1) {
  if (gone <= 0 || a <= 0) return;
  const { hy, hr, hw, bot } = figDims(0);
  for (let i = 0; i < 46; i++) {
    const r = mulberry(seed * 97 + i), th = r() * .95; if (gone < th) continue;
    const age = (gone - th) * 2.6; if (age > 1) continue;
    const px = x + s * ((r() - .5) * 2 * hw + age * (40 + 70 * r())), py = y + s * (lerp(bot, hy - hr, th) - age * (60 + 90 * r()));
    circ(px, py, s * (1.6 + 2 * r()) * (1 - age), col, a * (1 - age) * .9);
  }
}
// 结霜的壳：一圈多边形的冰面，k 0 → 1 沿着轮廓长出来；layers 层；burst：碎开、往外飞
function shell(x, y, s, a, k, layers = 1, seed = 3, burst = 0) {
  if (a <= 0 || k <= 0) return;
  for (let Lr = 0; Lr < layers; Lr++) {
    const r = mulberry(seed + Lr * 17), n = 15, sc = (1 + Lr * .15) * (1 + .5 * burst), pts = [];
    for (let i = 0; i < n; i++) { const th = i / n * TAU - PI / 2, j = .86 + .22 * r(); pts.push([Math.cos(th) * 84 * sc * j, -34 + Math.sin(th) * 148 * sc * j]); }
    let per = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % n]; per += Math.hypot(q[0] - p[0], q[1] - p[1]); });
    ctx.save(); ctx.globalAlpha *= a * (1 - burst) * (1 - .25 * Lr / Math.max(1, layers)); ctx.translate(x, y); ctx.scale(s, s);
    ctx.lineWidth = 2.6 / s; ctx.lineJoin = 'round'; ctx.strokeStyle = `rgba(${ICE_RGB},.75)`; ctx.shadowColor = `rgba(${ICE_RGB},.9)`; ctx.shadowBlur = 14;
    ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath();
    const f = Math.pow(sstep(.75, 1, k), 2);
    if (f > 0) { ctx.fillStyle = `rgba(150,200,255,${.09 * f})`; ctx.fill(); }
    ctx.setLineDash([per * clamp(k / .8), per + 10]); ctx.stroke(); ctx.setLineDash([]);
    if (f > 0) {                                                                                         // 冰面的棱
      ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(${ICE_RGB},${.28 * f})`; ctx.lineWidth = 1.4 / s; ctx.beginPath();
      for (let i = 0; i < n; i += 2) { const [px, py] = pts[i], [qx, qy] = pts[(i + 5) % n]; ctx.moveTo(px, py); ctx.lineTo(lerp(px, qx, .42), lerp(py, qy, .42)); }
      ctx.stroke();
    }
    ctx.restore();
    if (k >= .99 && burst < .5) for (let g = 0; g < 3; g++) {                                            // 冰面上闪过的光
      const i = (Math.floor(x + g * 5) + g * 5) % n, [px, py] = pts[i];
      glow(x + px * s, y + py * s, 2.2 * s, ICE_RGB, a * (.5 + .5 * Math.sin(y * .01 + g * 2.1 + x * .003 + Lr)) * .7 * (1 - 2 * burst), 4);
    }
  }
}
// 冷：身边飘着的小冰晶
function frost(cx, cy, R, a, t, seed = 5) {
  if (a <= 0) return;
  for (let i = 0; i < 36; i++) {
    const r = mulberry(seed * 31 + i), ang = r() * TAU + t * (.08 + .1 * r()) * (r() < .5 ? -1 : 1), d = R * (.55 + .6 * r());
    const x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d * 1.25, s = 3 + 5 * r(), tw = .5 + .5 * Math.sin(t * (1.5 + 2 * r()) + i);
    ctx.save(); ctx.globalAlpha = a * (.35 + .5 * tw); ctx.strokeStyle = ICE; ctx.lineWidth = 1.4; ctx.translate(x, y); ctx.rotate(r() * PI);
    ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.rotate(PI / 3); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); } ctx.stroke(); ctx.restore();
  }
}

// ======================================================================== 心跳（画面和音效共用一张表）
// 每秒跳几下：宝宝平时 1.5，“心跳加快”时升到 2.9；长大以后 1.2，说“没什么”之后升到 2.1
function rateAt(u) {
  const up1 = sstep(L(14) + 1.0, L(14) + 2.8, u), adult = sstep(L(16), L(16) + 1.0, u), up2 = sstep(L(17) + .9, L(17) + 2.4, u);
  return lerp(lerp(1.5, 2.9, up1), lerp(1.2, 2.1, up2), adult);
}
const PH_T0 = 40, PH_DT = 1 / 200;
let PHA = null;
function ph(u) {                                                                                         // 从 PH_T0 起一共跳了几下
  if (!PHA) { const n = Math.ceil((TOTAL + 2 - PH_T0) / PH_DT) + 2; PHA = new Float64Array(n); for (let i = 1; i < n; i++) PHA[i] = PHA[i - 1] + rateAt(PH_T0 + i * PH_DT) * PH_DT; }
  const f = (u - PH_T0) / PH_DT; if (f <= 0) return rateAt(PH_T0) * (u - PH_T0);
  const i = Math.min(PHA.length - 2, Math.floor(f)); return lerp(PHA[i], PHA[i + 1], f - i);
}
const gauss = (x, m, s) => Math.exp(-(((x - m) / s) ** 2));
function ecgShape(f) { return .12 * gauss(f, .12, .03) - .16 * gauss(f, .27, .012) + gauss(f, .3, .012) - .3 * gauss(f, .33, .014) + .24 * gauss(f, .56, .05); }
function beatPulse(u) { const f = ((ph(u) % 1) + 1) % 1; return gauss(f, .32, .06); }                  // 胸口的光跟着 R 波跳
function scr(u) { const t0 = L(17) + 1.3; return .12 + .02 * Math.sin(u * 2.3) + .78 * (1 - Math.exp(-Math.max(0, u - t0) / .9)); }   // 皮肤电：说完“没什么”，一下子升上去

// ======================================================================== ① 问题（0 – S2）：越喜欢，越想躲
const FLOOR1 = 1040, DOOR = { x0: 800, x1: 940, y0: 770 };
function pX(t) { return track([[0, 330], [L(0) + 1.0, 330], [L(0) + 1.6, 410], [L(1) + .3, 410], [L(1) + .9, 480], [L(3) + .2, 480], [L(3) + 1.5, 712]])(t); }
function aX(t) { return track([[0, 640], [L(0) + 2.1, 640], [L(0) + 2.6, 715, E.out], [L(1) + 1.1, 715], [L(1) + 1.6, 790, E.out], [L(2) + 1.4, 790], [L(2) + 2.4, 870]])(t); }
function sceneOpen(t) {
  if (t > L(4) + 2.0) return;
  const zk = E.inExpo(prog(t, L(4) + .1, L(4) + 1.1)), A = 1 - sstep(L(4) + .9, L(4) + 1.2, t);
  const cx = (DOOR.x0 + 4), cy = (DOOR.y0 + FLOOR1) / 2;
  const camX = track([[0, 480], [L(1) + 1.0, 480], [L(2) + 1.4, 640]])(t);                            // 镜头跟着往右移，门在右边
  ctx.save(); ctx.globalAlpha = A;
  ctx.translate(540, 960); ctx.scale(1.35, 1.35); ctx.translate(-camX, -1000);                         // 镜头：放大 1.35 倍
  if (zk > 0) { const z = 1 + 11 * zk; ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); }
  floor(FLOOR1, 0, 1200, 1);
  const px = pX(t), ax = aX(t), cool = sstep(L(2), L(2) + 1, t);
  // 门：吵架时出现；人走进门洞，门板从右往左关上，把他挡在里面；门缝里一道冷光
  const door = sstep(L(2) + .7, L(2) + 1.2, t), close = E.io(prog(t, L(2) + 2.4, L(2) + 3.2));
  if (door > 0) {
    ctx.save(); ctx.globalAlpha *= door; ctx.fillStyle = 'rgba(120,170,255,.10)'; ctx.fillRect(DOOR.x0, DOOR.y0, DOOR.x1 - DOOR.x0, FLOOR1 - DOOR.y0);
    ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(DOOR.x0, FLOOR1); ctx.lineTo(DOOR.x0, DOOR.y0); ctx.lineTo(DOOR.x1, DOOR.y0); ctx.lineTo(DOOR.x1, FLOOR1); ctx.stroke(); ctx.restore();
  }
  // 两个人之间的线：越拉越紧；门关到一半时被夹断，两截往回弹
  const snapT = L(2) + 2.85, snap = E.out(prog(t, snapT, snapT + .7));
  const d = Math.abs(ax - px), sag = Math.max(0, 70 - d * .12), lw = Math.max(1.5, 4 - d / 200), ty = FLOOR1 - 80;
  const flick = .75 + .25 * Math.sin(t * 23) * sstep(400, 520, d), ta = flick * sstep(.05, .5, t + .5);
  if (t < snapT) thread(px + 30, ty, ax - 30, ty, ta, W_RGB, sag, lw);
  else if (snap < 1) {
    const mx = DOOR.x1 - (DOOR.x1 - DOOR.x0) * .55, k = 1 - snap;
    thread(px + 30, ty, lerp(px + 30, mx, k), ty + 30 * snap, ta * k, W_RGB, 6 * k, lw);              // 左边那截弹回去、垂下来
    glow(mx, ty, 4, W_RGB, k * k, 6);
  }
  fig(ax, FLOOR1 - 30, 1, 1, mixc('#9fb4d4', COOL, cool));
  if (close > 0) {
    const w = (DOOR.x1 - DOOR.x0) * close;
    ctx.save(); ctx.fillStyle = '#1a1d26'; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3; ctx.fillRect(DOOR.x1 - w, DOOR.y0, w, FLOOR1 - DOOR.y0); ctx.strokeRect(DOOR.x1 - w, DOOR.y0, w, FLOOR1 - DOOR.y0);
    ctx.restore(); circ(DOOR.x0 + 22, 910, 6, CREAM, sstep(.9, 1, close));
    const crack = sstep(L(2) + 3.1, L(2) + 3.5, t);                                                    // 门缝里的冷光
    if (crack > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(${ICE_RGB},${.85 * crack})`; ctx.shadowColor = `rgba(${ICE_RGB},1)`; ctx.shadowBlur = 20;
      ctx.fillRect(DOOR.x0 + 1, DOOR.y0 + 4, 5, FLOOR1 - DOOR.y0 - 4); ctx.fillRect(DOOR.x0, FLOOR1 - 4, DOOR.x1 - DOOR.x0, 3); ctx.restore(); }
  }
  // 吵架：两个人之间炸开一道火花
  const spark = win(t, L(2) + .1, L(2) + 1.0, .1, .5);
  if (spark > 0) { const mx = (px + ax) / 2, r = mulberry(77); ctx.save(); ctx.globalAlpha = spark; ctx.strokeStyle = '#ff8a5c'; ctx.lineWidth = 4; ctx.shadowColor = '#ff8a5c'; ctx.shadowBlur = 16; ctx.lineJoin = 'miter';
    ctx.beginPath(); ctx.moveTo(mx - 30, 880); for (let i = 1; i <= 5; i++) ctx.lineTo(mx - 30 + i * 12, 880 + (i % 2 ? -26 : 22) * (.6 + .4 * r())); ctx.stroke(); ctx.restore();
    say('……', ax - 50, 820, spark * sstep(L(2) + .5, L(2) + .8, t), COOL, 30); }
  // 爱着他的那个人：走到门口，抬手敲门（拳头碰到门板）
  const pw = sstep(L(3), L(3) + 1, t), KN = [L(3) + 2.0, L(3) + 2.3];
  const raise = E.out(prog(t, L(3) + 1.6, L(3) + 1.9)) * (1 - sstep(L(3) + 2.7, L(3) + 3.0, t));
  const jab = KN.reduce((m, k) => Math.max(m, Math.max(0, 1 - Math.abs(t - k) / .09)), 0);
  fig(px, FLOOR1 - 30, 1, 1, WARMC, { heart: pw * .8, arm: raise * (.82 + .18 * jab), lift: 2, reach: 64, dir: 1 });
  if (pw > 0) warmth(pw * .5 * A, px, 960, 380);
  for (const k of KN) { const p = prog(t, k, k + .6); if (p > 0 && p < 1) { ctx.save(); ctx.globalAlpha = (1 - p) * .8; ctx.strokeStyle = CREAM; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(DOOR.x0 + 30, FLOOR1 - 64, 8 + 40 * p, 0, TAU); ctx.stroke(); ctx.restore(); } }
  ctx.restore();
  // 开头大字（第一帧就是封面）
  const hook = 1 - sstep(L(2) - .2, L(2) + .3, t);
  if (hook > 0) {
    text('越喜欢，', 540, 500, { size: 118, weight: 900, align: 'center', color: CREAM, alpha: hook, glow: 'rgba(255,225,190,.25)', blur: 30 });
    text('越想躲', 540, 650, { size: 150, weight: 900, align: 'center', color: ICE, alpha: hook, glow: `rgba(${ICE_RGB},.5)`, blur: 40 });
  }
  // 门缝被推到眼前：一片冷白的光，再慢慢退成题目后面的冷光
  const flash = Math.max(0, zk * zk) * (1 - sstep(L(4) + 1.1, L(4) + 1.9, t));
  if (flash > 0) { ctx.save(); const g = ctx.createLinearGradient(0, 1250, 0, 1450); g.addColorStop(0, `rgba(225,238,255,${.9 * flash})`); g.addColorStop(1, `rgba(225,238,255,${.35 * flash})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ======================================================================== 题目（L4 + 1 → S2 + 1）：光里浮出来；下面那一笔变成尺子
const TITLE_Y = 780, UNDER = { y: 900, x0: 330, x1: 750 }, AX = { ox: 200, oy: 1180, x1: 900, y1: 640 };
function sceneTitle(t) {
  const t0 = L(4) + 1.0; if (t < t0 - .2 || t > S2 + 1.6) return;
  const e = E.outExpo(prog(t, t0, t0 + 1.2)), out = E.io(prog(t, S2 - .1, S2 + .6)), A = sstep(t0, t0 + .3, t) * (1 - out);
  chill(.7 * A, 540, 820, 700);
  if (A > 0) {
    ctx.save(); ctx.translate(540, TITLE_Y - 120 * out); const sc = (1.25 - .25 * e) * (1 + .06 * E.ioSine(prog(t, t0 + 1.0, S2 + .4))); ctx.scale(sc, sc);
    ctx.filter = e < .97 ? `blur(${((1 - e) * 16).toFixed(1)}px)` : 'none';
    text('回避型依恋', 0, 0, { size: 128, weight: 900, align: 'center', color: ICE, alpha: A, glow: `rgba(${ICE_RGB},.55)`, blur: 40 });
    ctx.restore();
    seriesTag(TITLE_Y - 130, A * sstep(t0 + .4, t0 + 1.0, t));
    for (let i = 0; i < 26; i++) { const r = mulberry(4700 + i), p = ((t - t0) * (.05 + .07 * r()) + r()) % 1;            // 慢慢往上飘的冷光点
      glow(120 + r() * 840, 1250 - p * 760, 1.2 + 2.2 * r(), ICE_RGB, A * Math.sin(PI * p) * .7, 4); }
    typeText('不是不会爱，只是爱得很小心', 540, TITLE_Y + 190, { size: 42, weight: 700, font: SERIF, color: GOLD, align: 'center', spread: 4, glow: `rgba(${O_RGB},.35)`, glowBlur: 14 }, prog(t, t0 + 1.0, t0 + 2.2), A);
  }
  // 下面那一笔：先在题目下画出来，再落下去、拉长，成了横轴
  const draw = E.io(prog(t, t0 + .6, t0 + 1.3)), fall = E.ioExpo(prog(t, S2 - .1, S2 + 1.0));
  if (draw > 0 && t < S2 + 1.6) {
    const y = lerp(UNDER.y, AX.oy, fall), x0 = lerp(UNDER.x0, AX.ox, fall), x1 = lerp(UNDER.x0 + (UNDER.x1 - UNDER.x0) * draw, AX.x1, fall);
    ctx.save(); ctx.strokeStyle = lerp(0, 1, fall) > .5 ? 'rgba(236,230,218,.85)' : ORANGE; ctx.lineWidth = lerp(5, 3.5, fall); ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${O_RGB},${.8 * (1 - fall)})`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  }
}

// ======================================================================== ② 是什么（S2 – S3）：两把尺子
const QUAD_X = 550, QUAD_Y = 910, DOT = { x: 300, y: 720 };
const dotX = t => lerp(QUAD_X, DOT.x, E.io(prog(t, L(8) + 2.4, L(8) + 3.2)));
const ROW4 = [270, 450, 630, 810], ROW_Y = 1010;
function sceneRulers(t) {
  if (t < S2 + .9 || t > S3 + 1.4) return;
  const gone = sstep(L(9) + .1, L(9) + .8, t), A = 1 - gone;
  if (A > 0) {
    // 横轴（从题目那一笔接过来）一直在；竖轴从原点往上长
    seg(AX.ox, AX.oy, AX.x1, AX.oy, 'rgba(236,230,218,.85)', 3.5, A);
    const up = E.io(prog(t, S2 + .6, S2 + 1.5));
    seg(AX.ox, AX.oy, AX.ox, lerp(AX.oy, AX.y1, up), 'rgba(236,230,218,.85)', 3.5, A);
    // 刻度：像两把尺子
    const tick = prog(t, S2 + 1.0, S2 + 2.2);
    for (let i = 1; i <= 14; i++) { const k = sstep(i / 15 - .05, i / 15, tick), len = i % 2 ? 10 : 20;
      seg(AX.ox + i * 50, AX.oy, AX.ox + i * 50, AX.oy - len, 'rgba(236,230,218,.55)', 2, A * k);
      if (i <= 10) seg(AX.ox, AX.oy - i * 50, AX.ox + len, AX.oy - i * 50, 'rgba(236,230,218,.55)', 2, A * k); }
    const lx = win(t, L(6), S3, .4, .1) * A, ly = win(t, L(6) + 1.5, S3, .4, .1) * A;
    const glowX = Math.exp(-Math.max(0, t - L(6) - .3) * 1.6) * lx, glowY = Math.exp(-Math.max(0, t - L(6) - 1.8) * 1.6) * ly;
    if (glowX > .02) seg(AX.ox, AX.oy, AX.x1, AX.oy, `rgba(${O_RGB},.9)`, 6, glowX);
    if (glowY > .02) seg(AX.ox, AX.oy, AX.ox, AX.y1, `rgba(${ICE_RGB},.9)`, 6, glowY);
    text('怕被抛弃  →', AX.x1, AX.oy + 60, { font: SANS, size: 42, weight: 700, align: 'right', color: WARMC, alpha: lx });
    text('↑  怕太亲近', AX.ox - 10, AX.y1 - 54, { font: SANS, size: 42, weight: 700, align: 'left', color: ICE, alpha: ly });
    typeText('两把尺子', 540, 500, { ...big, size: 64, weight: 900 }, prog(t, L(5) + .2, L(5) + 1.0), A * (1 - sstep(L(6) + 1.1, L(6) + 1.5, t)));
    // 四个格子（虚线），回避型在左上：不太怕被丢下、很怕太近
    const grid = sstep(L(6) + 2.4, L(6) + 3.0, t) * A;
    if (grid > 0) { ctx.save(); ctx.globalAlpha = grid * .35; ctx.strokeStyle = CREAM; ctx.setLineDash([8, 10]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(QUAD_X, AX.oy); ctx.lineTo(QUAD_X, AX.y1); ctx.moveTo(AX.ox, QUAD_Y); ctx.lineTo(AX.x1, QUAD_Y); ctx.stroke(); ctx.restore(); }
    const fill = sstep(L(7) + 1.2, L(7) + 2.0, t) * A, left = sstep(L(8) + 2.4, L(8) + 3.2, t);
    if (fill > 0) { ctx.save(); ctx.globalAlpha = fill; const g = ctx.createLinearGradient(0, AX.y1, 0, QUAD_Y); g.addColorStop(0, 'rgba(120,170,255,.24)'); g.addColorStop(1, 'rgba(120,170,255,.04)');
      ctx.fillStyle = g; ctx.fillRect(AX.ox + 2, AX.y1, AX.x1 - AX.ox - 2, QUAD_Y - AX.y1); ctx.restore();
      pill('回避型', QUAD_X, 840, fill, { color: ICE, stroke: `rgba(${ICE_RGB},.6)`, glow: `rgba(${ICE_RGB},.5)`, size: 44 }); }
    // 投影：怕太亲近“高”；其中有一种，怕被抛弃“低”
    const pj2 = sstep(L(8) + .2, L(8) + .7, t) * A, pj1 = sstep(L(8) + 3.0, L(8) + 3.5, t) * A, dx = dotX(t);
    for (const [k, x1, y1, x2, y2] of [[pj1, dx, DOT.y, dx, AX.oy], [pj2, dx, DOT.y, AX.ox, DOT.y]]) if (k > 0) {
      ctx.save(); ctx.globalAlpha = k * .7; ctx.strokeStyle = ICE; ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, k), lerp(y1, y2, k)); ctx.stroke(); ctx.restore(); }
    text('低', dx, AX.oy + 60, { font: SANS, size: 46, weight: 900, align: 'center', color: ICE, alpha: pj1 });
    text('高', AX.ox - 44, DOT.y, { font: SANS, size: 46, weight: 900, align: 'center', color: ICE, alpha: pj2 });
    text('其中一种', dx + 34, DOT.y, { font: SANS, size: 42, weight: 700, align: 'left', color: '#e3f1ff', alpha: A * left * (1 - sstep(L(9) - .2, L(9) + .2, t)) });
  }
  // 那个点：从原点沿着竖尺往上爬，停在左上；然后分成四个人
  const rise = E.io(prog(t, L(7) + .2, L(7) + 1.6));
  if (t >= L(7)) {
    const appear = sstep(L(7), L(7) + .3, t), split = E.io(prog(t, L(9) + .2, L(9) + 1.3)), become = sstep(L(9) + .9, L(9) + 1.5, t);
    let x = rise < 1 ? QUAD_X : dotX(t), y = lerp(AX.oy, DOT.y, rise);
    const walk = E.io(prog(t, S3 - 1.4, S3 + .2)), fade = sstep(S3 - 1.6, S3 - .6, t), dimOthers = sstep(L(9) + 3.0, L(9) + 4.4, t);
    ROW4.forEach((rx, i) => {
      const lit = i === 3, px = lerp(lerp(x, ROW4[3], E.io(prog(t, L(9) + .1, L(9) + .9))), rx, split), py = lerp(y, ROW_Y, E.io(prog(t, L(9) + .1, L(9) + .9)));
      if (!lit && split <= 0) return;
      if (lit && t > S3 + .2) return;                                                                     // 走到镜头前以后，交给 sceneShell
      const a2 = lit ? 1 : (1 - fade) * (1 - .6 * dimOthers);
      if (become < 1) glow(px, py, 9, lit ? ICE_RGB : C_RGB, appear * a2 * (1 - become), 6);
      if (become > 0) {
        const fx = lit ? lerp(px, 540, walk) : px, fy = lit ? lerp(py, 1010, walk) : py, s = lit ? lerp(.62, 2.0, walk) * become : .62 * become;
        fig(fx, fy, s, a2, lit ? COOL : '#5d6472', { heart: 0 });
        if (lit) { chill((.5 + .3 * dimOthers * (.5 + .5 * Math.sin(t * 3))) * become * (1 - walk * .5), fx, fy - 40, 220); }
      }
    });
    const q = sstep(L(9) + 2.0, L(9) + 2.5, t) * (1 - fade);
    const ps = pop(t, L(9) + 2.0);
    ctx.save(); ctx.translate(540, 770); if (ps) ctx.scale(ps, ps);
    text('≈ 1/4', 0, 0, { font: SERIF, size: 124, weight: 900, align: 'center', color: ICE, alpha: q, glow: `rgba(${ICE_RGB},.5)`, blur: 26 }); ctx.restore();
    text('这样形容自己', 540, 880, { font: SANS, size: 42, weight: 700, align: 'center', color: DIM, alpha: q });
  }
}

// ======================================================================== ③ 一层壳（S3 – S4）
const ROOM = { floor: 1170, door: [110, 290, 740] }, MOM = 1.6, BABY = 1.0;
function sceneShell(t) {
  if (t < S3 - .2 || t > S4 + 2.2) return;
  // 大人（冷）：S3 起站在镜头前；L12 缩回一岁的宝宝；L15 在心电图上长回大人；L18 长出一层壳；S4 倒带
  const toBaby = E.io(prog(t, L(12) - .3, L(12) + 1.0)), toAdult = E.io(prog(t, L(15) - .1, L(15) + 1.2)), center = E.io(prog(t, L(18) - .4, L(18) + .6));
  const babyK = toBaby * (1 - toAdult);
  let x = lerp(540, 690, toBaby), y = lerp(1010, ROOM.floor - 30 * BABY, toBaby), s = lerp(2.0, BABY, toBaby);
  if (toAdult > 0) { x = lerp(x, 620, toAdult); y = lerp(y, 1120, toAdult); s = lerp(s, 1.9, toAdult); }
  if (center > 0) { x = lerp(x, 540, center); y = lerp(y, 1050, center); s = lerp(s, 1.8, center); }
  const rew = E.io(prog(t, L(19) + .2, L(19) + 1.7));                                                   // 倒带：缩回小时候（交给 sceneOrigin 接着画）
  if (rew > 0) { x = lerp(x, KID.x, rew); y = lerp(y, KID.y, rew); s = lerp(s, KS, rew); }
  const A = 1 - sstep(L(19) + 1.5, L(19) + 1.8, t), here = t >= S3 + .2 ? 1 : 0;
  if (A <= 0) return;
  const coldA = sstep(L(10), L(10) + 1.2, t) * (1 - toBaby);
  chill(.6 * Math.max(coldA, .4 * (1 - toBaby)), x, y - 100, 520);
  frost(x, y - 60 * s, 170 * s, coldA * (1 - rew), t);
  if (coldA > 0) typeText('冷漠？不在乎？', 540, 560, { ...big, size: 70, weight: 900, color: ICE, glow: `rgba(${ICE_RGB},.4)`, glowBlur: 20 }, prog(t, L(10) + .7, L(10) + 1.6), coldA * (1 - sstep(L(11) + 1.2, L(11) + 1.8, t)));
  // 房间：门、妈妈、积木（宝宝那一段）
  const room = sstep(L(12) + .2, L(12) + .9, t) * (1 - sstep(L(15) + .2, L(15) + 1.0, t));
  if (room > 0) {
    floor(ROOM.floor, 60, 1020, room);
    const [d0, d1, dy] = ROOM.door;
    ctx.save(); ctx.globalAlpha = room; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(d0, ROOM.floor); ctx.lineTo(d0, dy); ctx.lineTo(d1, dy); ctx.lineTo(d1, ROOM.floor); ctx.stroke(); ctx.restore();
    const mx = track([[0, 430], [L(12) + 1.3, 430], [L(12) + 2.3, 200], [L(12) + 3.0, 200], [L(12) + 4.0, 430]])(t);
    const inside = sstep(L(12) + 1.8, L(12) + 2.3, t) * (1 - sstep(L(12) + 3.0, L(12) + 3.5, t));      // 走出门：整个人消失；回来时再出现
    const moving = win(t, L(12) + 1.2, L(12) + 4.1, .15, .15);
    fig(mx, ROOM.floor - 30 * MOM, MOM, room * (1 - inside), WARMC);
    text('妈妈', mx, ROOM.floor + 50, { font: SANS, size: 36, weight: 700, align: 'center', color: WARMC, alpha: room * (1 - moving) * sstep(L(12) + .6, L(12) + 1.0, t) });
    text('宝宝', 690, ROOM.floor + 50, { font: SANS, size: 36, weight: 700, align: 'center', color: '#9db7de', alpha: room * sstep(L(12) + .9, L(12) + 1.3, t) });
    text('离开', 200, dy - 44, { font: SANS, size: 38, weight: 700, align: 'center', color: DIM, alpha: room * win(t, L(12) + 1.8, L(12) + 3.0, .2, .3) });
    text('回来', 200, dy - 44, { font: SANS, size: 38, weight: 700, align: 'center', color: GOLD, alpha: room * win(t, L(12) + 3.1, L(12) + 4.6, .2, .3) });
    [[L(13) + .4, 0], [L(13) + 1.4, 1], [L(13) + 2.4, 2]].forEach(([t0, i]) => {                         // 继续玩积木
      const k = E.outQuint(prog(t, t0, t0 + .4)), bx = 830 + (i === 1 ? 10 : 0), by = ROOM.floor - 27 - i * 56 - 60 * (1 - k);
      if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = room * k; ctx.fillStyle = ['#8fb3e8', '#e8b38f', '#9fd6b8'][i]; ctx.beginPath(); ctx.roundRect(bx - 26, by - 26, 52, 52, 8); ctx.fill(); ctx.restore();
    });
  }
  // 那个人本身：心跳从 L14 起看得见
  const hb = sstep(L(11) + 1.2, L(11) + 1.5, t) * (1 - sstep(L(11) + 1.9, L(11) + 2.6, t)) + sstep(L(14) + .2, L(14) + .8, t);
  const beat = t > L(14) ? beatPulse(t) : Math.exp(-Math.max(0, t - L(11) - 1.3) * 5) * (t > L(11) + 1.3 ? 1 : 0);
  const col = mixc(mixc(COOL, '#9db7de', babyK), '#d8c9b4', rew);
  const shellK = E.io(prog(t, L(18) + .1, L(18) + 1.2));
  fig(x, y, s, A * here, col, { baby: babyK + rew * .6, heart: Math.min(1, hb + shellK), beat: Math.max(beat, shellK * (1.2 + .5 * Math.sin(t * 6))), arm: babyK * win(t, L(13) + .2, L(13) + 3.0, .3, .3) * .55, dir: 1 });
  shell(x, y, s, A, shellK, 1, 11, rew);
  if (shellK > 0) warmth(shellK * .35 * (1 - rew), x, chestY(y, s), 160);
  // 心电图 → 皮肤电
  monitor(t);
  // 宝宝那一段：仪器上显示“心跳 ↑”；大人：“没什么。”
  say('小时候，被父母拒绝过吗？', 330, 800, win(t, L(16) + .2, L(17) + 1.6, .3, .4), WARMC, 40);
  say('没什么。', x + 150, y - 200 * (s / 1.25), win(t, L(17) + .2, L(18) - .2, .25, .4), ICE, 46);
  const fast = sstep(L(14) + 2.0, L(14) + 2.5, t) * (1 - sstep(L(15) + 1.0, L(15) + 1.5, t));      // 大字：一直很快
  typeText('一直很快', 540, 820, { ...big, size: 72, weight: 900, color: '#ff9a7a', glow: 'rgba(255,154,122,.5)', glowBlur: 24 }, prog(t, L(14) + 2.0, L(14) + 2.6), fast);
  const bigA = sstep(L(18) + .4, L(18) + 1.0, t) * (1 - sstep(L(19) - .1, L(19) + .4, t));
  typeText('不在乎，', 540, 500, { ...big, size: 66, weight: 900, color: CREAM }, prog(t, L(18) + .3, L(18) + .9), bigA);
  typeText('是一层壳', 540, 610, { ...big, size: 92, weight: 900, color: ICE, glow: `rgba(${ICE_RGB},.55)`, glowBlur: 32 }, prog(t, L(18) + .8, L(18) + 1.5), bigA);
}
const MON = { x0: 170, x1: 910, y: 640, h: 66, pps: 230 };
function monitor(t) {
  const a = sstep(L(14) - .3, L(14) + .4, t) * (1 - sstep(L(18) - .4, L(18) + .2, t));
  if (a <= 0) return;
  const mode = sstep(L(16) + .1, L(16) + 1.2, t), hot = sstep(L(14) + 1.0, L(14) + 2.6, t) * (1 - sstep(L(16) + .1, L(16) + 1.0, t)) + sstep(L(17) + 1.2, L(17) + 2.4, t);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(8,12,18,.82)'; ctx.strokeStyle = `rgba(${C_RGB2},.45)`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(MON.x0 - 36, MON.y - 128, MON.x1 - MON.x0 + 72, 222, 24); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha = a * .25; ctx.strokeStyle = TEALC; ctx.lineWidth = 1;
  for (let gx = MON.x0; gx <= MON.x1; gx += 37) { ctx.beginPath(); ctx.moveTo(gx, MON.y - 100); ctx.lineTo(gx, MON.y + 70); ctx.stroke(); }
  ctx.restore();
  text('♥ 心跳', MON.x0, MON.y - 94, { font: SANS, size: 34, weight: 700, color: mixc(TEALC, '#ff9a7a', hot), alpha: a * (1 - mode) });
  text('皮肤电反应', MON.x0, MON.y - 94, { font: SANS, size: 34, weight: 700, color: mixc(TEALC, '#ff9a7a', hot), alpha: a * mode });
  const col = mixc('#7fe3d3', '#ff9a7a', hot);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 12;
  ctx.beginPath();
  let hx = MON.x1, hy = MON.y;
  for (let px = MON.x0; px <= MON.x1; px += 2) {
    const u = t - (MON.x1 - px) / MON.pps, v = lerp(ecgShape(((ph(u) % 1) + 1) % 1), scr(u) * 2.1 - 1.0, mode);
    const yy = MON.y - MON.h * v; px === MON.x0 ? ctx.moveTo(px, yy) : ctx.lineTo(px, yy); hx = px; hy = yy;
  }
  ctx.stroke(); ctx.restore();
  glow(hx, hy, 5, mode > .5 ? '255,154,122' : '127,227,211', a, 5);
  const up = a * Math.max(sstep(L(14) + 1.8, L(14) + 2.3, t) * (1 - sstep(L(16) + .1, L(16) + .6, t)), sstep(L(17) + 1.8, L(17) + 2.3, t));
  const ps = Math.max(pop(t, L(14) + 1.8), pop(t, L(17) + 1.8)) || 1;
  ctx.save(); ctx.translate(MON.x1 - 10, MON.y - 96); ctx.scale(ps, ps);
  text(mode > .5 ? '↑ 明显升高' : '一直很快 ↑', 0, 0, { font: SANS, size: 40, weight: 900, align: 'right', color: '#ff9a7a', alpha: up, glow: 'rgba(255,154,122,.6)', blur: 14 }); ctx.restore();
}

// ======================================================================== ④ 怎么来的（S4 – S5）：倒带回小时候；壳一层一层长出来；压下去，又弹回来
const ROOM4 = 1180, KS = 1.7, BIG_S = 2.4, KID = { x: 360, y: ROOM4 - 30 * KS }, BIGP = { x: 790, y: ROOM4 - 30 * BIG_S }, F5 = { floor: 1100, s: 1.5 };
function rewindFx(k) {                                                                                    // 倒带：横向的亮线 + 左上角的 ◀◀
  if (k <= 0) return;
  for (let i = 0; i < 26; i++) { const r = mulberry(300 + i), y = 420 + r() * 1000, x = W - ((k * 2.4 + r()) % 1) * (W + 600), len = 140 + 400 * r();
    seg(x, y, x + len, y, 'rgba(236,230,218,.5)', 1 + 2 * r(), Math.sin(PI * k) * .6); }
  text('◀◀', 96, 440, { font: SANS, size: 44, weight: 900, color: CREAM, alpha: Math.sin(PI * Math.min(1, k * 1.3)) });
}
function sceneOrigin(t) {
  if (t < L(19) + .2 || t > S5 + 1.6) return;
  const rk = prog(t, L(19) + .2, L(19) + 1.7);
  rewindFx(rk < 1 ? rk : 0);
  const born = sstep(L(19) + 1.5, L(19) + 1.8, t);
  if (born <= 0) return;
  typeText('小时候', 540, 520, { ...big, size: 70, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.4)`, glowBlur: 20 }, prog(t, L(19) + 1.4, L(19) + 2.0), 1 - sstep(L(23) - .2, L(23) + .3, t));
  // 镜头推进孩子的胸口（L24 – L26 + 6），再拉回来
  const zin = E.io(prog(t, L(24) - .1, L(24) + 1.0)), zout = E.io(prog(t, L(26) + 5.4, S5 + .6)), zk = zin * (1 - zout);
  const kid = track([[0, KID.x], [L(21) + .4, KID.x], [L(21) + 1.4, 520], [L(23), 520], [L(23) + .8, 430]])(t);
  const kcy = chestY(KID.y, KS, .6), toA = E.io(prog(t, S5 - 1.6, S5 + .2));                          // 最后：孩子长成大人，走到右边
  const fx = lerp(kid, 700, toA), fy = lerp(KID.y, F5.floor - 30 * F5.s, toA), fs = lerp(KS, F5.s, toA), fk = lerp(.6, 0, toA), fcy = chestY(fy, fs, fk);
  ctx.save();
  if (zk > 0) { const z = 1 + .6 * zk; ctx.translate(lerp(kid, 540, zk), lerp(kcy, 880, zk)); ctx.scale(z, z); ctx.translate(-kid, -kcy); }
  floor(ROOM4, 60, 1020, born * (1 - zk) * (1 - toA));
  // 大人：孩子伸手要抱，他伸手把孩子推开、往后退（被推开）；然后不耐烦（嫌烦），暗下去
  const PUSH = L(21) + 2.5, MAD = L(21) + 3.3;
  const adultA = sstep(L(20) + .2, L(20) + .9, t) * (1 - sstep(L(23) + .8, L(23) + 1.6, t)) * (1 - zk);
  const away = track([[0, BIGP.x], [PUSH + .15, BIGP.x], [PUSH + .7, 900, E.out]])(t), dimmed = sstep(MAD + .4, MAD + 1.2, t);
  const push = E.out(prog(t, PUSH - .1, PUSH + .15)) * (1 - E.io(prog(t, PUSH + .6, PUSH + 1.0)));
  fig(away, BIGP.y, BIG_S, adultA * (1 - .55 * dimmed), mixc('#c9c2b4', '#6a6f7b', dimmed), { arm: push, lift: 6, reach: 58, dir: -1 });
  const mad = adultA * win(t, MAD, MAD + 1.3, .15, .3);
  if (mad > 0) { ctx.save(); ctx.globalAlpha = mad; ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineJoin = 'miter'; ctx.beginPath(); const bx = away + 70, by = BIGP.y - 290;
    ctx.moveTo(bx, by); ctx.lineTo(bx + 18, by - 22); ctx.lineTo(bx + 30, by + 2); ctx.lineTo(bx + 48, by - 20); ctx.stroke(); ctx.restore();
    text('嫌烦', away, BIGP.y - 340, { font: SANS, size: 42, weight: 900, align: 'center', color: '#ff8f8f', alpha: mad }); }
  // 孩子：难过 → 伸手 → 被推得往后一晃、手垂下来；每一次，身上多一圈冰
  const reach = (t0, d) => E.out(prog(t, t0, t0 + d * .35)) * (1 - E.io(prog(t, t0 + d * .65, t0 + d)));
  const arm = Math.max(reach(L(21) + .5, 2.4), reach(L(22) + .1, 1.0), reach(L(22) + 1.2, 1.0));
  const knock = 26 * Math.sin(PI * prog(t, PUSH, PUSH + .5));                                          // 被推得往后一晃
  const pushedA = win(t, PUSH + .1, L(22) + .3, .2, .3) * (1 - zk);
  text('被推开', kid - 20, ROOM4 + 64, { font: SANS, size: 42, weight: 900, align: 'center', color: '#ffcaa0', alpha: pushedA });
  const RING_T = [L(21) + 3.9, L(22) + .9, L(22) + 2.0];
  const fuse = E.io(prog(t, L(23), L(23) + .9)), pressed = sstep(L(24) + 3.0, L(24) + 4.4, t), rebound = sstep(L(26) + 4.4, L(26) + 4.9, t);
  const shellA = 1 - sstep(S5 - 1.6, S5 - .6, t);
  const need = zk;
  fig(fx - knock * (1 - toA), fy, fs, born * (t < S5 + .3 ? 1 : 0), mixc('#d8c9b4', COOL, Math.max(sstep(L(23), L(23) + 1, t), toA)),
    { baby: fk, arm, dir: 1, tear: win(t, L(21) + .1, L(21) + 3.8, .3, .4), tearY: (t * .7) % 1, heart: 1 - need, beat: .3 });
  RING_T.forEach((rt, i) => { const k = E.io(prog(t, rt, rt + .6));
    if (k > 0) shell(fx, fy, fs * .8 * (1 + .15 * i * (1 - fuse)), born * shellA * (i ? 1 - fuse : 1), k, 1, 21 + i * 7); });
  // 推近之后：胸口里那团想靠近的光，被一块板压扁，又弹回来（光一直在胸口的位置，拉回来时变回那颗心）
  if (need > 0) {
    const shake = sstep(L(26) + .8, L(26) + 4.3, t), jit = (Math.sin(t * 61) + Math.sin(t * 37)) * 1.6 * shake * (1 - rebound);
    const land = Math.exp(-Math.max(0, t - L(24) - 4.4) * 9) * (t > L(24) + 4.4 ? 1 : 0);                // 压到底时轻轻一弹
    const ry = lerp(1, .32, pressed * (1 - rebound)) * (1 - .12 * land) * (1 + .25 * Math.sin(PI * prog(t, L(26) + 4.4, L(26) + 5.2)) * rebound);
    const bright = lerp(1, .5, pressed) * (1 - rebound) + rebound * (1 + .6 * Math.exp(-Math.max(0, t - L(26) - 4.5) * 2));
    const flick = pressed > .5 && rebound < 1 ? .75 + .25 * Math.sin(t * 13) * Math.sin(t * 7.3) : 1;
    ctx.save(); ctx.translate(fx + jit, fcy + 4 * fs * (1 - ry)); ctx.scale(fs, fs * ry);
    glow(0, 0, 11, '255,180,110', need * bright * flick, 7); ctx.restore();
    const fly = E.in(prog(t, L(26) + 4.4, L(26) + 4.9));
    const slabY = lerp(fcy - 28 * fs, fcy - 8 * fs + 2 * fs * land, pressed) - 120 * fs * fly;
    const slabA = need * sstep(L(24) + 2.7, L(24) + 3.0, t) * (1 - sstep(L(26) + 4.7, L(26) + 5.1, t));
    if (slabA > 0) { ctx.save(); ctx.globalAlpha = slabA; ctx.translate(fx + jit * 1.5, slabY); ctx.rotate(jit * .004 + .5 * fly); ctx.scale(fs, fs); ctx.fillStyle = '#20283a'; ctx.strokeStyle = ICE; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(-30, -5, 60, 10, 3); ctx.fill(); ctx.stroke(); ctx.restore(); }
    if (rebound > 0) for (let i = 0; i < 18; i++) { const r = mulberry(600 + i), p = prog(t, L(26) + 4.5, L(26) + 5.8 + r()), ang = r() * TAU;
      if (p > 0 && p < 1) glow(fx + Math.cos(ang) * 60 * fs * E.out(p), fcy + Math.sin(ang) * 60 * fs * E.out(p), 1.4, '255,200,140', need * (1 - p), 4); }
  }
  ctx.restore();
  // 屏幕上的字（不跟着镜头缩放）
  const bigA = sstep(L(23) + .2, L(23) + .7, t) * (1 - sstep(L(24) - .3, L(24) + .2, t));
  typeText('把需要藏起来，', 540, 520, { ...big, size: 64, weight: 900, color: CREAM }, prog(t, L(23) + .1, L(23) + .8), bigA);
  typeText('就不会被推开', 540, 630, { ...big, size: 86, weight: 900, color: ICE, glow: `rgba(${ICE_RGB},.5)`, glowBlur: 28 }, prog(t, L(23) + 1.0, L(23) + 1.8), bigA);
  const deact = zk * sstep(L(24) + .6, L(24) + 1.1, t) * (1 - sstep(L(25) - .2, L(25) + .3, t));
  typeText('去激活', 540, 440, { ...big, size: 80, weight: 900, color: ICE, glow: `rgba(${ICE_RGB},.55)`, glowBlur: 28 }, prog(t, L(24) + .6, L(24) + 1.3), deact);
  text('想靠近', 880, 880, { font: SERIF, size: 56, weight: 900, align: 'center', color: GOLD, alpha: zk * sstep(L(24) + 2.0, L(24) + 2.4, t) * (1 - sstep(L(24) + 3.4, L(24) + 3.9, t)), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  text('压下去', 880, 880, { font: SERIF, size: 56, weight: 900, align: 'center', color: ICE, alpha: zk * sstep(L(24) + 3.9, L(24) + 4.3, t) * (1 - sstep(L(25) - .2, L(25) + .2, t)), glow: `rgba(${ICE_RGB},.5)`, blur: 18 });
  text('它还在', 540, 440, { font: SERIF, size: 64, weight: 900, align: 'center', color: GOLD, alpha: zk * win(t, L(25) + .5, L(26) + .3, .3, .3), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  // 一分心：一串 7 位数字绕着转（实验里要一边记数字）
  const load = zk * win(t, L(26) + .4, L(26) + 4.6, .5, .3);
  if (load > 0) ['7', '3', '9', '1', '4', '8', '2'].forEach((d, i) => {
    const k = sstep(L(26) + .4 + i * .22, L(26) + .7 + i * .22, t), ang = i / 7 * TAU + t * .9, R = 360 + 30 * Math.sin(t * 2 + i);
    text(d, 540 + Math.cos(ang) * R * .95, 880 + Math.sin(ang) * R * .8, { font: SERIF, size: 64, weight: 700, align: 'center', color: CREAM, alpha: load * k * .75 });
  });
  text('一分心', 540, 440, { font: SERIF, size: 64, weight: 900, align: 'center', color: CREAM, alpha: load });
  text('实验里：一边记一串 7 位数', 540, 1290, { font: SANS, size: 34, weight: 500, align: 'center', color: CREAM, alpha: load * .8 });
  const back = zk * sstep(L(26) + 4.6, L(26) + 5.0, t);
  const bs = pop(t, L(26) + 4.6) || 1;
  ctx.save(); ctx.translate(540, 440); ctx.scale(bs, bs);
  text('反弹回来', 0, 0, { font: SERIF, size: 84, weight: 900, align: 'center', color: GOLD, alpha: back, glow: `rgba(${O_RGB},.6)`, blur: 26 }); ctx.restore();
}

// ======================================================================== ⑤ 怎么办（S5 – 结束）：开头那两个人回来了
function sceneHow(t) {
  if (t < S5 - .6) return;
  const A = sstep(S5 - .5, S5 + .6, t), FS = F5.s, FY = F5.floor - 30 * FS, TY = F5.floor - 80 * FS, CY = chestY(FY, FS);
  floor(F5.floor, 80, 1000, A);
  // 回避型（右）和爱着他的人（左）
  const ax = track([[0, 700], [L(28) + .1, 700], [L(28) + .6, 760, E.out], [L(32) + .2, 760], [L(32) + .6, 800, E.out], [L(32) + 1.0, 800], [L(32) + 1.4, 840, E.out], [L(33) + .9, 840], [L(33) + 1.5, 815, E.out], [L(35) + 1.5, 815], [L(35) + 4.2, 640]])(t);
  const px = track([[0, 300], [L(32) + .05, 300], [L(32) + .45, 380, E.out], [L(32) + .95, 380], [L(32) + 1.35, 440, E.out], [L(33) + .1, 440], [L(33) + .7, 400]])(t);
  const warmUp = E.io(prog(t, L(35) + .5, L(35) + 4.5));
  const acol = mixc(COOL, WARMC, warmUp);
  const vanish = E.io(prog(t, L(28) + .6, L(28) + 1.4)) * .5 * (1 - E.io(prog(t, L(28) + 1.4, L(28) + 2.3)));
  const pIn = sstep(S5 - .4, S5 + .8, t);
  // 线：一开始松松地连着；追的时候拉紧；给空间时松下来、变暖
  const d = ax - px, taut = sstep(L(32), L(32) + .5, t) * (1 - sstep(L(33) + .2, L(33) + 1.0, t));
  const sag = lerp(lerp(40, 4, taut), 70, sstep(L(33) + .2, L(33) + 1.2, t));
  thread(px + 30 * FS, TY, ax - 30 * FS, TY, A * pIn * (1 - vanish * 1.6), sstep(L(33) + .2, L(33) + 1.4, t) > .5 ? W_RGB : '200,210,230', sag, 2.5 + 1.5 * sstep(L(35), L(35) + 3, t));
  fig(px, FY, FS, A * pIn, WARMC, { heart: .5 + .5 * win(t, L(31), L(34), .3, .5), beat: 0 });
  const rise = E.io(prog(t, L(29) + .1, L(29) + .7)), msgK = E.io(prog(t, L(29) + .6, L(29) + 1.4));  // 胸口的光浮上去，再展开成一条消息
  fig(ax, FY, FS, t >= S5 + .3 ? 1 : 0, acol, { gone: vanish, heart: 1 - rise + sstep(L(30), L(30) + .6, t) + warmUp, beat: .2 + .3 * warmUp + .8 * Math.sin(PI * prog(t, L(33) + .9, L(33) + 1.6)) });
  if (rise > 0 && msgK < 1) glow(lerp(ax, ax - 70, rise), lerp(CY, 760, rise), 6, '255,180,110', A * (1 - msgK), 6);
  dust(ax, FY, FS, vanish * 2, ICE, A);
  // 标签：“回避型”挂在头顶 → L34 掉下来，散成光
  const tagIn = sstep(L(27), L(27) + .5, t), drop = prog(t, L(34) + .6, L(34) + 2.2);
  if (tagIn > 0 && drop < 1) {
    const fall = E.in(drop), ty = 820 + 280 * fall, rot = .9 * fall * fall;
    if (drop <= 0) seg(ax, 842, ax, FY - 106 * FS, `rgba(${ICE_RGB},.6)`, 2, tagIn);
    pill('回避型', ax + 40 * fall, ty, tagIn * (1 - sstep(.6, 1, drop)), { color: ICE, stroke: `rgba(${ICE_RGB},.6)`, rot, size: 36 });
  }
  const dk = (t - (L(34) + .6)) / 1.6; if (dk > .5 && dk < 1.6) dust(ax + 60, 1000, 1.3, (dk - .5) * 1.2, ICE, A, 9);
  const youA = win(t, L(31), L(34), .4, .4);
  pill('爱着回避型的你', px + 30, 810, youA, { color: GOLD, stroke: `rgba(${O_RGB},.6)`, size: 34 });
  // 消息：从回避型的胸口浮上去，沿着线飞到对方那儿
  const fly = E.io(prog(t, L(29) + 2.0, L(29) + 3.1)), mA = A * msgK * (1 - sstep(L(30) - .1, L(30) + .5, t));
  if (mA > 0) {
    const bx = lerp(lerp(ax - 70, 560, msgK), 330, fly), by = lerp(lerp(760, 680, msgK), 720, fly) - 40 * Math.sin(PI * fly), sc = lerp(.15, 1, msgK);
    ctx.save(); ctx.translate(bx, by); ctx.scale(sc, sc); say('我需要一点时间，晚上找你。', 0, 0, mA, ICE, 40); ctx.restore();
  }
  if (t > L(29) + 3.0) for (let i = 0; i < 10; i++) { const r = mulberry(1500 + i), p = prog(t, L(29) + 3.0, L(29) + 4.2 + r()); if (p > 0 && p < 1) glow(px + (r() - .5) * 160, CY - p * 200, 2 + 2 * r(), O_RGB, A * (1 - p), 3); }
  // 一个时间点（月亮）+ 一条回来的路
  const moon = A * sstep(L(30) + .2, L(30) + .7, t) * (1 - sstep(L(31) - .2, L(31) + .3, t));
  if (moon > 0) { ctx.save(); ctx.globalAlpha = moon; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(581, 628, 35, 0, TAU); ctx.clip('evenodd');
    ctx.fillStyle = GOLD; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(560, 640, 40, 0, TAU); ctx.fill(); ctx.restore();
    text('晚上', 560, 724, { font: SANS, size: 38, weight: 700, align: 'center', color: GOLD, alpha: moon }); }
  const path = E.io(prog(t, L(30) + 1.6, L(30) + 3.0)), pathA = A * (1 - sstep(L(31) - .2, L(31) + .4, t));
  if (path > 0 && pathA > 0) for (let i = 0; i < 16; i++) { const k = i / 15; if (k > path) break; const x = lerp(ax - 20, px + 20, k);
    glow(x, F5.floor + 24, 3.6, W_RGB, pathA * (.6 + .4 * Math.sin(t * 4 - i * .6)), 4); }
  text('回来的路', (ax + px) / 2, F5.floor + 84, { font: SANS, size: 38, weight: 700, align: 'center', color: GOLD, alpha: pathA * sstep(L(30) + 2.6, L(30) + 3.0, t) });
  // 大字
  const gap = A * sstep(L(33) + .3, L(33) + .8, t) * (1 - sstep(L(34) - .2, L(34) + .3, t));
  typeText('给空间 ≠ 被冷落', 540, 620, { ...big, size: 76, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 24 }, prog(t, L(33) + .2, L(33) + 1.0), gap);
  text('不是一辈子的标签', 540, 620, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(L(34) + .3, L(34) + .8, t) * (1 - sstep(L(35) - .1, L(35) + .4, t)) });
  if (warmUp > 0) { warmth(warmUp * .9, (ax + px) / 2, 980, 600); for (let i = 0; i < 16; i++) { const r = mulberry(1900 + i), p = ((t - L(35)) * (.12 + .1 * r()) + r()) % 1;
    glow(px - 60 + r() * (ax - px + 120), 1060 - p * 420, 1.5 + 2 * r(), O_RGB, warmUp * (1 - p) * .8, 3); } }
  // 最后两句：大字 + 评论区
  const fin = sstep(L(36) - .1, L(36) + .4, t);
  typeText('不是不会爱，', 540, 540, { ...big, size: 64, weight: 900, color: CREAM }, prog(t, L(36), L(36) + .8), fin);
  typeText('只是爱得很小心', 540, 660, { ...big, size: 84, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.55)`, glowBlur: 34 }, prog(t, L(36) + 1.2, L(36) + 2.4), fin);
  const Q = sstep(L(37) - .1, L(37) + .4, t);
  typeText('评论区说说：', 540, 1230, { size: 42, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, L(37), L(37) + .5), Q);
  typeText('你是回避型，还是正在爱着一个回避型？', 540, 1310, { size: 48, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, L(37) + .4, L(37) + 1.6), Q);
}

// ======================================================================== 世界层
const STAR_A = t => .12 + .1 * sstep(S5, S5 + 3, t) + .25 * sstep(L(35), L(36), t);
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneOpen(t); sceneTitle(t); sceneRulers(t); sceneShell(t); sceneOrigin(t); sceneHow(t);
}
function SAMPLES(T) {
  const many = [[L(4) + .3, L(4) + 1.25]];                                                               // 钻进门缝：放大得太快，要多采样才不出重影
  const more = [[L(2) + 2.3, L(2) + 3.4], [L(12) + 1.1, L(12) + 2.5], [L(12) + 2.9, L(12) + 4.2], [S3 - 1.5, S3 + .3], [L(21) + 2.3, L(21) + 3.3]];
  const fast = [[L(4), L(4) + 1.4], [S2 - .2, S2 + 1.2], [L(9), L(9) + 1.6], [L(12) - .4, L(12) + 1.1], [L(15) - .2, L(15) + 1.3], [L(19), L(19) + 1.9],
    [L(24) - .1, L(24) + 1.1], [L(26) + 4.3, L(26) + 5.2], [L(26) + 5.4, S5 + 1], [L(29), L(29) + 3.2], [L(34) + .5, L(34) + 2.3]];
  const in_ = r => r.some(([a, b]) => T > a && T < b);
  return in_(many) ? 14 : in_(more) ? 8 : in_(fast) ? 4 : 3;
}
function BLOOM_K(T) { return .4 + .15 * win(T, L(4) + .6, L(4) + 2.4, .3, .8) + .1 * win(T, L(18), S4, .4, .5) + .14 * win(T, L(26) + 4.4, L(26) + 6, .2, .8) + .16 * win(T, L(35), TOTAL, 1, 1); }
function OVER(T) {
  stamp('1998', 'Brennan, Clark & Shaver', L(6), L(9) - .1, T);
  stamp('1987 · 1997', 'Hazan & Shaver · Mickelson 等', L(9), S3 - .1, T);
  stamp('1977', 'Sroufe & Waters', L(12) + .4, L(15) - .1, T);
  stamp('1992', 'Dozier & Kobak', L(16), L(18) - .2, T);
  stamp('1978', 'Ainsworth 等', L(20), L(23) - .2, T);
  stamp('2004', 'Mikulincer, Dolev & Shaver', L(26), L(26) + 4.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(4601);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（D 小调 → F 大调）
const NOTE = { D4: 293.66, F4: 349.23, A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.26, F5: 698.46, G5: 783.99, A5: 880.0, C6: 1046.5, D6: 1174.7, F6: 1396.9 };
const D_SHIM = [NOTE.A5, NOTE.D6, NOTE.F5, NOTE.F6, NOTE.D5], F_SHIM = [NOTE.A5, NOTE.C6, NOTE.F5, NOTE.F6, NOTE.C5];
const D_SWELL = [73.42, 110.0, 146.83, 174.61, 220.0], F_SWELL = [87.31, 130.81, 174.61, 220.0, 261.63];
function CUES() {
  const c = [];
  // ① 一进一退：脚步；吵架；门关上；敲门；钻进门缝
  for (const tt of [L(0) + 1.0, L(1) + .3]) c.push([tt, 'tick', { gain: .05 }]);
  for (const tt of [L(0) + 2.1, L(1) + 1.1]) c.push([tt, 'swish', { dur: .4, gain: .05 }]);
  c.push([L(2) + .1, 'crack', { gain: .06 }], [L(2) + 2.85, 'tick', { gain: .06 }], [L(2) + 3.15, 'thud', { gain: .14 }], [L(2) + 3.2, 'slap', { gain: .08, pan: .4 }]);
  c.push([L(3) + 2.0, 'thunk', { gain: .07 }], [L(3) + 2.3, 'thunk', { gain: .06 }]);
  c.push([L(4) + .1, 'riser', { dur: 1.0, gain: .12 }], [L(4) + 1.05, 'swell', { dur: .9, f: D_SWELL, gain: .1 }], [L(4) + 1.1, 'shimmer', { f: D_SHIM, gain: .1 }]);
  // ② 尺子：落下来、刻度、点往上爬、分成四个人
  c.push([S2, 'whoosh', { dur: .8, gain: .1 }]);
  for (let i = 0; i < 8; i++) c.push([S2 + 1.0 + i * .15, 'tick', { gain: .025 }]);
  c.push([L(6) + .3, 'tink', { f: NOTE.F5, gain: .05 }], [L(6) + 1.8, 'tink', { f: NOTE.A5, gain: .05 }]);
  c.push([L(7) + .2, 'bar', { f0: 300, f1: 640, dur: 1.4, gain: .05 }], [L(7) + 1.6, 'tink', { f: NOTE.D6, gain: .06 }]);
  c.push([L(9) + .2, 'swish', { dur: .7, gain: .07 }]);
  [0, 1, 2, 3].forEach(i => c.push([L(9) + .9 + i * .08, 'tink', { f: [NOTE.D5, NOTE.F5, NOTE.A5, NOTE.D6][i], gain: .04 }]));
  c.push([L(9) + 2.0, 'chord', { f: [NOTE.D5, NOTE.F5, NOTE.A5], gain: .06 }]);
  // ③ 走到镜头前；冰；宝宝；心跳；长大；“没什么”；壳
  c.push([S3 - .3, 'whoosh', { dur: 1.2, gain: .1 }], [L(10) + .2, 'air', { dur: 5, hum: 73.42, gain: .06 }]);
  c.push([L(11) + 1.3, 'thud', { gain: .1 }]);
  c.push([L(12) - .3, 'suck', { dur: 1.2, gain: .07 }], [L(12) + 1.3, 'page', { gain: .05 }], [L(12) + 3.0, 'page', { gain: .05 }]);
  [0, 1, 2].forEach(i => c.push([L(13) + .4 + i + .35, 'thunk', { gain: .035 }]));
  for (let u = L(14) - .2; u < L(18) - .2; u += .005) { const a = Math.floor(ph(u)), b = Math.floor(ph(u + .005)); if (b > a) c.push([u + .3 / Math.max(1, rateAt(u)) * .3, 'thud', { gain: .035 + .03 * sstep(L(14) + 1, L(14) + 2.6, u) * (1 - sstep(L(15), L(15) + 1, u)) + .025 * sstep(L(17) + 1, L(17) + 2.4, u) }]); }
  c.push([L(14) + .1, 'tink', { f: NOTE.A5, gain: .04 }], [L(15) - .1, 'swell', { dur: 1.0, f: D_SWELL, gain: .06 }]);
  c.push([L(16) + .2, 'tick', { gain: .04 }], [L(17) + .2, 'tick', { gain: .04 }], [L(17) + 1.8, 'bar', { f0: 260, f1: 720, dur: 1.2, gain: .05 }]);
  c.push([L(18) + .1, 'shimmer', { f: D_SHIM, gain: .1 }], [L(18) + .2, 'air', { dur: 3.5, hum: 73.42, gain: .05 }]);
  // ④ 倒带；伸手、不耐烦；一层层结冰；压下去；一分心；反弹
  c.push([L(19) + .2, 'revcym', { dur: 1.5, gain: .12 }], [L(19) + 1.6, 'thud', { gain: .08 }]);
  c.push([L(21) + 1.85, 'swish', { dur: .5, gain: .06 }], [L(21) + 1.9, 'crack', { gain: .03 }]);
  for (const tt of [L(21) + 3.9, L(22) + .9, L(22) + 2.0]) c.push([tt, 'tink', { f: NOTE.D6, gain: .05 }], [tt + .05, 'tink', { f: NOTE.A5, gain: .03 }]);
  c.push([L(23), 'shimmer', { f: D_SHIM, gain: .08 }]);
  c.push([L(24) - .1, 'whoosh', { dur: 1.1, gain: .08 }], [L(24) + 1.8, 'creak', { dur: 1.7, gain: .06 }], [L(24) + 3.3, 'thud', { gain: .1 }]);
  for (let i = 0; i < 7; i++) c.push([L(26) + .4 + i * .22, 'click', { gain: .02 }]);
  c.push([L(26) + 1.0, 'drone', { dur: 3.4, gain: .05 }], [L(26) + 4.4, 'stop', { gain: .05 }], [L(26) + 4.5, 'boom', { gain: .07 }], [L(26) + 4.6, 'shimmer', { f: F_SHIM, gain: .14 }]);
  c.push([L(26) + 5.4, 'suck', { dur: 1.6, gain: .06 }]);
  // ⑤ 退一步、碎光又回来；消息；回来的路；追与跑；标签掉了；变暖
  c.push([L(28) + .6, 'dust', { dur: 1.2, gain: .08 }], [L(28) + 1.5, 'riser', { dur: .8, gain: .05 }]);
  c.push([L(29) + .3, 'bar', { f0: 400, f1: 800, dur: .8, gain: .04 }], [L(29) + 2.0, 'whoosh', { dur: 1.0, gain: .06 }], [L(29) + 3.0, 'ding', { f: 1396.9, gain: .09, pan: -.3 }]);
  c.push([L(30) + .2, 'tink', { f: NOTE.F5, gain: .05 }], [L(30) + 1.6, 'shimmer', { f: F_SHIM, gain: .08 }]);
  for (const tt of [L(32) + .05, L(32) + 1.0]) c.push([tt, 'tick', { gain: .05 }]);
  for (const tt of [L(32) + .2, L(32) + 1.0]) c.push([tt + .05, 'swish', { dur: .35, gain: .04 }]);
  c.push([L(33) + .2, 'swell', { dur: 1.0, f: F_SWELL, gain: .07 }]);
  c.push([L(34) + .6, 'tick', { gain: .05 }], [L(34) + 1.9, 'dust', { dur: 1.0, gain: .06 }]);
  c.push([L(35) + .5, 'swell', { dur: 3.0, f: F_SWELL, gain: .07 }], [L(36), 'shimmer', { f: F_SHIM, gain: .12 }], [L(37), 'tink', { f: NOTE.C6, gain: .05 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
