// ======================================================================== No.49 恐惧型依恋：越想要，越推开（讲课格式第五期，第一期“短剧”风格）
// 恋爱心理系列第四期。从这一期起换成情绪短剧：先讲一只猫的一个晚上和第二天早上，最后十几秒才讲心理学。
// 结构：那一晚（晚安，想你了；打了又删；只回了一个“嗯”；等到天亮）→ 第二天（他撑着伞来；往前一步又退回去，关上门；门一关它就哭了）
//   → 为什么（恐惧型依恋：两把尺子都高；心想靠近，身体往后退）→ 怎么办（一次一步）。
// 一镜到底：房间 → 镜头横移，猫跟着走到门口 → 推进到它胸口的光里 → 尺子 → 回到门口。
// 主角的轮廓一半暖橙（怕被丢下，焦虑型的颜色）、一半冷蓝（怕靠太近，回避型的颜色），左眼橙、右眼蓝；他是奶白色，撑一把珊瑚色的伞。
// 没有片头（meta.json "intro": false）：第一帧就是封面“他说想你，我只回了一个‘嗯’”。
// 时间：画面里的时间都写成 L(i) + 秒数（第 i 句开始之后），时间轴由 layout.py 按配音的真实长度排出来。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 70.4;
const SECTIONS = [['那一晚', 0.0, 22.4], ['第二天', 22.4, 38.4], ['为什么', 38.4, 54.4], ['怎么办', 54.4, 70.4]];
const LINES = [
  [0.15, 4.97, '凌晨一点，他发来一句：晚安，想你了。'],
  [5.37, 9.13, '它打了一句「我也想你」，又删了。'],
  [9.48, 12.60, '再打一句「别对我这么好」，也删了。'],
  [13.00, 16.03, '最后，只回了一个字：「嗯」。'],
  [16.53, 19.16, '然后抱着手机，一直等到天亮。'],
  [22.70, 25.30, '第二天，他撑着伞来找它。'],
  [25.60, 29.57, '它往前走了一步，又退了回去，把门关上了。'],
  [30.07, 31.48, '门一关，它就哭了。'],
  [38.70, 42.14, '心理学家管这叫「恐惧型依恋」。'],
  [42.44, 46.70, '心理学家用两把尺子量感情，它两把都很高：'],
  [46.95, 49.56, '既怕被丢下，又怕靠太近。'],
  [49.96, 53.06, '所以心里想靠近，身体却在往后退。'],
  [54.70, 59.51, '如果你也是这样：想靠近的时候，不用一下子走完。'],
  [59.81, 61.35, '一次一步，就好。'],
];
const BIGLINES = [
  [32.28, 36.89, '它不是不想被爱。它是太想了，又太怕了。'],
  [62.15, 64.20, '越想要，越推开。'],
  [64.90, 68.94, '评论区说说：你有没有把一个很想要的人，推开过？'],
];
// 第 i 句（按时间排，含大字）开始的时间：L(i)；结束：LE(i)
const ALL_LINES = [...LINES, ...BIGLINES].sort((a, b) => a[0] - b[0]);
const L = i => ALL_LINES[i][0], LE = i => ALL_LINES[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const SERIES = '黑猫不说话 · 心理学 No.49';
const S2 = S['第二天'], S3 = S['为什么'], S4 = S['怎么办'];

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

// 一只坐着的黑猫（和片头、片尾那只同一个造型，缩小到 1/4）。局部坐标：脚底在 y = 30，耳朵尖在 y ≈ -106。
// o.baby：0 大猫 → 1 小奶猫（头大身小）；o.arm：伸出前爪（o.dir 朝向，o.lift / o.reach：抬多高、伸多远）；
// o.heart：胸口的光（o.beat 跳一下时变大）；o.gone：从脚往上消失；o.sq：横向压扁；o.tear：眼泪。
// 轮廓光和眼睛用这只猫自己的颜色（回避型冷蓝，爱着他的暖橙），身体是黑的。胸口在 (x, y + s * (top + 30))。
const CS = .251, CAT_PATH = (() => {                                                                  // 片头那只猫的形状（原尺寸）
  const head = new Path2D(); head.ellipse(0, -150, 108, 94, 0, 0, TAU);
  const earL = new Path2D(); earL.moveTo(-100, -190); earL.lineTo(-84, -292); earL.lineTo(-30, -232); earL.closePath();
  const earR = new Path2D(); earR.moveTo(100, -190); earR.lineTo(84, -292); earR.lineTo(30, -232); earR.closePath();
  const body = new Path2D(); body.moveTo(-62, -80); body.bezierCurveTo(-120, -20, -168, 110, -150, 210);
  body.quadraticCurveTo(-140, 248, -96, 250); body.lineTo(96, 250); body.quadraticCurveTo(140, 248, 150, 210);
  body.bezierCurveTo(168, 110, 120, -20, 62, -80); body.closePath();
  const tail = new Path2D(); tail.moveTo(120, 236); tail.bezierCurveTo(220, 250, 262, 170, 238, 96); tail.quadraticCurveTo(226, 62, 200, 70);
  return { head, earL, earR, body, tail };
})();
function catGeo(k) {                                                                                  // 小奶猫：身体缩小、头放大
  const bs = lerp(1, .74, k), hs = lerp(1, 1.14, k), bodyTop = 250 - 330 * bs, hc = bodyTop - 70 * hs;
  const f = yb => (yb - 250) * CS + 30;
  return { bs, hs, hc, hy: f(hc), hr: 94 * hs * CS, top: f(bodyTop) + 6, hw: 150 * bs * CS, bot: 30, earTop: f(hc - 142 * hs) };
}
function figDims(k) { const g = catGeo(k); return { hr: g.hr, hy: g.hy, top: g.top, hw: g.hw, bot: g.bot }; }
function chestY(y, s, k = 0) { return y + s * (figDims(k).top + 30); }
function fig(x, y, s, a, col, o = {}) {
  if (a <= 0 || s <= 0) return;
  const k = o.baby || 0, g = catGeo(k), gone = o.gone || 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * (o.sq ?? 1), s);
  if (gone > 0) { ctx.beginPath(); ctx.rect(-300, -500, 600, 500 + lerp(g.bot + 4, g.earTop - 4, gone)); ctx.clip(); }
  ctx.save(); ctx.translate(0, 30 - 250 * CS); ctx.scale(CS, CS);                                      // 进入片头那只猫的坐标
  const lw = 3 / (Math.max(.5, s) * CS);
  const bodyT = () => { ctx.translate(0, 250); ctx.scale(g.bs, g.bs); ctx.translate(0, -250); };
  const headT = () => { ctx.translate(0, g.hc); ctx.scale(g.hs, g.hs); ctx.translate(0, 150); };     // 片头里头的中心在 y = -150
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8 / CS;
  ctx.save(); bodyT(); ctx.strokeStyle = col; ctx.lineWidth = lw * 2 + 30; ctx.stroke(CAT_PATH.tail); ctx.shadowBlur = 0;      // 尾巴：轮廓光 + 黑色
  ctx.strokeStyle = '#07080b'; ctx.lineWidth = 30; ctx.stroke(CAT_PATH.tail); ctx.restore();
  ctx.strokeStyle = col; ctx.lineWidth = lw;
  ctx.save(); bodyT(); ctx.stroke(CAT_PATH.body); ctx.restore();
  ctx.save(); headT(); ctx.stroke(CAT_PATH.head); ctx.stroke(CAT_PATH.earL); ctx.stroke(CAT_PATH.earR); ctx.restore();
  ctx.shadowBlur = 0; ctx.fillStyle = '#07080b';
  ctx.save(); bodyT(); ctx.fill(CAT_PATH.body); ctx.restore();
  ctx.save(); headT(); ctx.fill(CAT_PATH.head); ctx.fill(CAT_PATH.earL); ctx.fill(CAT_PATH.earR);
  ctx.globalAlpha *= .3; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.2 / (Math.max(.5, s) * CS);       // 胡须
  for (const kx of [-1, 1]) for (const dy of [-6, 6]) { ctx.beginPath(); ctx.moveTo(kx * 50, -118 + dy * .5); ctx.lineTo(kx * 140, -126 + dy * 2); ctx.stroke(); }
  ctx.globalAlpha /= .3;
  for (const ex of [-42, 42]) {                                                                       // 眼睛：这只猫自己的颜色，竖瞳
    ctx.save(); ctx.translate(ex, -152); ctx.shadowColor = col; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.moveTo(-24, 0); ctx.quadraticCurveTo(0, -20, 24, 0); ctx.quadraticCurveTo(0, 20, -24, 0); ctx.closePath();
    ctx.fillStyle = o.eye || col; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
    ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 15, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(-7, -5, 3, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  // 回到猫的局部坐标（脚底 y = 30）：前爪、眼泪
  if (o.arm > .12) {                                                                                  // 爪子收回来时直接不画（不在身上留一条竖线）
    const d = o.dir || 1, ax = d * (g.hw * .55), ay = g.top + 22, ex = ax + d * (o.reach || 50) * o.arm, ey = ay + lerp(34, o.lift ?? -22, o.arm);
    ctx.save(); ctx.globalAlpha *= sstep(.12, .35, o.arm); ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8;
    ctx.strokeStyle = col; ctx.lineWidth = 11 / Math.max(.5, s); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.shadowBlur = 0; ctx.strokeStyle = '#07080b'; ctx.lineWidth = 6 / Math.max(.5, s); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
  }
  if (o.tear > 0) { ctx.save(); ctx.globalAlpha *= o.tear * (1 - sstep(.75, 1, o.tearY)); ctx.fillStyle = ICE; ctx.shadowColor = ICE; ctx.shadowBlur = 8;
    ctx.translate(-42 * CS * g.hs, g.hy + 6 + 10 * o.tearY); ctx.scale(1.5, 1.5);
    ctx.beginPath(); ctx.moveTo(0, -7); ctx.quadraticCurveTo(5.5, 2, 0, 4.5); ctx.quadraticCurveTo(-5.5, 2, 0, -7); ctx.fill(); ctx.restore(); }
  ctx.restore();
  if (o.heart > 0) {
    const cy = y + s * (g.top + 30), r = s * (4 + 3 * (o.beat || 0));
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

// 警报：从胸口一圈一圈扩散出去的光环；k 越大，圈越密、越亮、越红
function alarm(x, y, s, k, t, a = 1) {
  if (k <= 0 || a <= 0) return;
  const rate = lerp(.7, 2.6, k), n = 4;
  for (let i = 0; i < n; i++) {
    const p = ((t * rate + i / n) % 1), r = s * (12 + 150 * p);
    ctx.save(); ctx.globalAlpha = a * k * (1 - p) * .8; ctx.strokeStyle = `rgb(${k > .6 ? ALARM_RGB : A_RGB})`; ctx.lineWidth = 3 + 3 * k;
    ctx.shadowColor = `rgba(${ALARM_RGB},.9)`; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
  }
  glow(x, y, s * (5 + 4 * k * (.5 + .5 * Math.sin(t * rate * TAU))), k > .6 ? ALARM_RGB : '255,170,110', a, 6);
}

// 想法：一朵小云（没有尖角的气泡）
function thought(s, x, y, a, size = 30, col = CREAM) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 48, h = size * 2;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,32,42,.94)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  for (const [dx, dy, r] of [[-w * .3, h * .62, 7], [-w * .38, h * .95, 4.5]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}

// ======================================================================== 这一期的小道具
const A_COL = WARMC, V_COL = COOL, V_LT = '#a9c4e8', A_RGB = '255,179,107', V_RGB = '127,156,196', ALARM_RGB = '255,120,90';
const P_COL = '#e8d9c0', P_RGB = '232,217,192', UMB = '#e07a6a';
const FLOOR = 1245;
// 主角：恐惧型——两把尺子都高，所以轮廓一半暖橙（怕被丢下）、一半冷蓝（怕靠太近），左眼橙、右眼蓝
function cat2(x, y, s, a, o = {}) {
  if (a <= 0 || s <= 0) return;
  for (const [side, col, rgb] of [[-1, A_COL, A_RGB], [1, V_COL, V_RGB]]) {
    ctx.save(); ctx.beginPath(); ctx.rect(side < 0 ? x - 2000 : x, -10, 2000, H + 20); ctx.clip();
    fig(x, y, s, a, col, { ...o, heartRgb: rgb });
    ctx.restore();
  }
}
const cat2At = (x, feet, s, a, o) => cat2(x, feet - 30 * s, s, a, o);
function gradText(s, x, y, size, a, o = {}) {                                                          // 一行字从橙渐变到蓝
  if (a <= 0) return;
  font(size, 900, o.font || SERIF); const w = ctx.measureText(s).width, g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, WARMC); g.addColorStop(.5, '#e9d6c8'); g.addColorStop(1, V_LT);
  text(s, x, y, { size, weight: 900, font: o.font || SERIF, align: 'center', color: g, alpha: a, glow: o.glow || 'rgba(255,225,200,.35)', blur: o.blur ?? 30, filter: o.filter });
}
function rainIn(x0, y0, w, h, a, t, n = 70, seed = 1, stopY = null) {                                // 一片雨：斜斜的细线
  if (a <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(190,210,240,.55)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const r = mulberry(seed * 131 + i), sp = 900 + 500 * r(), len = 26 + 30 * r(), px = x0 + r() * (w + 120) - 60, ph = r();
    const yy = y0 + ((t * sp / (h + 200) + ph) % 1) * (h + 200) - 100, xx = px - (yy - y0) * .12;
    if (stopY && stopY(xx) !== null && yy > stopY(xx)) continue;                                        // 落在伞上的就不往下画了
    ctx.moveTo(xx, yy); ctx.lineTo(xx - len * .12, yy + len);
  }
  ctx.stroke(); ctx.restore();
}
function umbrella(x, y, a, open = 1) {                                                                   // 伞：(x, y) 是伞面下沿中间
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(236,230,218,.8)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y - 76 * open); ctx.lineTo(x, y + 150); ctx.arc(x - 16, y + 150, 16, 0, PI); ctx.stroke();
  const R = 120 * open; ctx.fillStyle = UMB; ctx.shadowColor = 'rgba(224,122,106,.5)'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(x - R, y); ctx.quadraticCurveTo(x - R * .9, y - 82, x, y - 84); ctx.quadraticCurveTo(x + R * .9, y - 82, x + R, y);
  for (let i = 3; i >= -3; i--) ctx.quadraticCurveTo(x + R * (i + .5) / 3.5, y - 16, x + R * i / 3.5 - (i === -3 ? 0 : 0), y);
  ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; for (const k of [-.45, .45]) { ctx.beginPath(); ctx.moveTo(x, y - 82); ctx.quadraticCurveTo(x + R * k * .7, y - 60, x + R * k * 1.1, y - 4); ctx.stroke(); }
  ctx.restore();
}
function paw(x, y, s, a, lit) {                                                                         // 一个爪印
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * .45);
  ctx.fillStyle = lit ? `rgba(${W_RGB},${.9 * lit})` : 'rgba(0,0,0,0)'; ctx.strokeStyle = lit ? GOLD : 'rgba(236,230,218,.6)'; ctx.lineWidth = 3 / s;
  if (lit) { ctx.shadowColor = `rgba(${O_RGB},${lit})`; ctx.shadowBlur = 20; }
  for (const [px, py, r] of [[0, 8, 13], [-15, -12, 6], [-5, -20, 6], [6, -20, 6], [16, -12, 6]]) { ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
// 手机：圆角屏幕；聊天气泡（他的在左，奶白；自己的在右，暖橙）
function phone(x, y, w, h, a, glowA = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(14,16,22,.97)'; ctx.strokeStyle = 'rgba(236,230,218,.55)'; ctx.lineWidth = 4;
  ctx.shadowColor = `rgba(255,214,170,${.35 * glowA})`; ctx.shadowBlur = 60;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 44); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(236,230,218,.22)'; ctx.beginPath(); ctx.roundRect(x - 48, y - h / 2 + 16, 96, 10, 5); ctx.fill(); ctx.restore();
}
function bubble(s, x, y, a, mine, size = 32) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 44, h = size * 1.9, bx = mine ? x - w : x;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mine ? 'rgba(242,161,74,.92)' : `rgba(${P_RGB},.16)`; ctx.strokeStyle = mine ? 'rgba(0,0,0,0)' : `rgba(${P_RGB},.55)`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(bx, y - h / 2, w, h, 20); ctx.fill(); ctx.stroke(); ctx.restore();
  text(s, bx + w / 2, y + 1, { font: SANS, size, weight: 700, align: 'center', color: mine ? '#1a1208' : P_COL, alpha: a });
}
function clockStr(min) { const m = ((Math.floor(min) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }
// 打字、再一个字一个字删掉：返回这一刻输入框里的字
function typed(s, t, t0, t1, d0, d1) {
  if (t < t0) return '';
  const n = s.length, up = Math.floor(clamp((t - t0) / (t1 - t0)) * n + 1e-6), down = d0 == null ? 0 : Math.floor(clamp((t - d0) / (d1 - d0)) * n + 1e-6);
  return s.slice(0, Math.max(0, up - down));
}

// ======================================================================== 镜头
// 第一场（房间）在世界坐标 0–1080，第二场（门）在 1080–2160；镜头从房间横移到门口，猫跟着走过去
const camX = t => 1080 * E.io(prog(t, L(4) + 3.0, S2 + .2));
const DOOR = { x0: 1080 + 470, x1: 1080 + 780, y0: 640, y1: FLOOR };
const ME = { x: 330, s: 3.0 };                                                                           // 主角：房间里的位置
const ME2 = { x: 1080 + 260, s: 3.0 };                                                                   // 门口的位置

// ======================================================================== ① 那一晚（0 – S2）：晚安，想你了；打了又删；只回了一个“嗯”；等到天亮
const WIN = { x: 80, y: 600, w: 480, h: 520 }, PH = { x: 790, y: 905, w: 400, h: 640 };
function skyCol(dawn) { return [mixc('#0b1326', '#5f7fa8', dawn), mixc('#141c33', '#e7b9a4', dawn)]; }
function sceneRoom(t) {
  const cx = camX(t); if (cx > 1070) return;
  ctx.save(); ctx.translate(-cx, 0);
  const dawn = E.io(prog(t, L(4) + .4, L(4) + 3.0));
  // 窗：夜里的城市，雨；天慢慢亮
  const [c0, c1] = skyCol(dawn);
  ctx.save(); const g = ctx.createLinearGradient(0, WIN.y, 0, WIN.y + WIN.h); g.addColorStop(0, c0); g.addColorStop(1, c1);
  ctx.fillStyle = g; ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
  ctx.beginPath(); ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.clip();
  for (let i = 0; i < 26; i++) { const r = mulberry(900 + i), bx = WIN.x + r() * WIN.w, by = WIN.y + WIN.h * (.55 + .45 * r());          // 远处的灯（虚焦）
    const col = r() < .5 ? '255,200,140' : '170,200,255'; ctx.globalAlpha = (.25 + .3 * r()) * (1 - .8 * dawn); ctx.fillStyle = `rgba(${col},.6)`; ctx.beginPath(); ctx.arc(bx, by, 6 + 16 * r(), 0, TAU); ctx.fill(); }
  ctx.restore();
  rainIn(WIN.x, WIN.y, WIN.w, WIN.h, .8 * (1 - .5 * dawn), t, 60, 3);
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.45)'; ctx.lineWidth = 6; ctx.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(WIN.x + WIN.w / 2, WIN.y); ctx.lineTo(WIN.x + WIN.w / 2, WIN.y + WIN.h); ctx.moveTo(WIN.x, WIN.y + WIN.h * .46); ctx.lineTo(WIN.x + WIN.w, WIN.y + WIN.h * .46); ctx.stroke();
  ctx.fillStyle = 'rgba(236,230,218,.3)'; ctx.fillRect(WIN.x - 20, WIN.y + WIN.h, WIN.w + 40, 10); ctx.restore();
  chill(.5 * (1 - dawn), WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 520);
  warmth(.45 * dawn, WIN.x + WIN.w / 2, WIN.y + WIN.h * .7, 700, '255,190,160');
  floor(FLOOR, 40, 1080, 1);
  // 手机的光照在它脸上
  warmth(.55 * (1 - .55 * sstep(L(4) + 1.0, L(4) + 3.0, t)), PH.x - 120, PH.y, 520, '255,210,160');
  ctx.restore();
}
function scenePhone(t) {                                                                                  // 手机（屏幕坐标，跟着镜头一起移走）
  const cx = camX(t); if (cx > 1070) return;
  const a = 1 - .5 * sstep(L(4) + 1.0, L(4) + 3.0, t);
  ctx.save(); ctx.translate(-cx, 0);
  phone(PH.x, PH.y, PH.w, PH.h, 1, a);
  const top = PH.y - PH.h / 2, minutes = 60 + 3 * sstep(L(3) + 2.0, L(3) + 2.4, t) + 309 * E.io(prog(t, L(4) + .4, L(4) + 3.0));
  text(clockStr(minutes), PH.x, top + 62, { font: SANS, size: 30, weight: 700, align: 'center', color: DIM, alpha: a });
  circ(PH.x - 140, top + 122, 24, 'rgba(232,217,192,.25)', a); text('他', PH.x - 140, top + 123, { font: SANS, size: 24, weight: 900, align: 'center', color: P_COL, alpha: a });
  seg(PH.x - PH.w / 2 + 20, top + 160, PH.x + PH.w / 2 - 20, top + 160, 'rgba(236,230,218,.15)', 2, a);
  const k0 = E.out(prog(t, L(0) + 1.9, L(0) + 2.2));
  bubble('晚安，想你了。', PH.x - PH.w / 2 + 26, top + 230 + 20 * (1 - k0), a * k0, false, 32);
  const k1 = E.out(prog(t, L(3) + 2.0, L(3) + 2.3));
  bubble('嗯。', PH.x + PH.w / 2 - 26, top + 330 + 20 * (1 - k1), a * k1, true, 32);
  text('已读', PH.x + PH.w / 2 - 28, top + 384, { font: SANS, size: 22, align: 'right', color: DIM, alpha: a * sstep(L(3) + 2.8, L(3) + 3.0, t) });
  // 输入框：打字，再一个字一个字删掉
  const iy = PH.y + PH.h / 2 - 70;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(PH.x - PH.w / 2 + 22, iy - 32, PH.w - 44, 64, 32); ctx.stroke(); ctx.restore();
  const cur = typed('我也想你', t, L(1) + .6, L(1) + 1.6, L(1) + 2.5, L(1) + 3.1) || typed('别对我这么好', t, L(2) + .5, L(2) + 1.7, L(2) + 2.2, L(2) + 2.9) || (t < L(3) + 2.0 ? typed('嗯', t, L(3) + 1.3, L(3) + 1.4) : '');
  const caret = t > L(1) + .3 && t < L(3) + 2.0 && (t * 2) % 1 < .55 ? '|' : '';
  text(cur + caret, PH.x - PH.w / 2 + 48, iy + 1, { font: SANS, size: 32, weight: 700, color: CREAM, alpha: a });
  ctx.restore();
}

// ======================================================================== ② 第二天（S2 – S3）：他撑着伞来；往前一步，又退回去，关上门；门一关，它就哭了
const PARTNER = { x: 1080 + 625, feet: 1222, s: 2.0 };
function doorOpen(t) {                                                                                   // 0 关着 → 1 开着
  return track([[0, 0], [L(5) + .3, 0], [L(5) + 1.3, 1], [L(6) + 2.5, 1], [L(6) + 3.2, 0, E.in], [L(13) + 2.4, 0], [L(13) + 3.4, .22], [L(14) + .2, .22], [L(14) + 1.0, .5]])(t);
}
function sceneDoor(t) {
  const cx = camX(t); if (cx < 10 || (t > S3 + .4 && t < S4 - 1.0)) return;
  const sunny = t > S3 ? 1 : 0, op = doorOpen(t), { x0, x1, y0, y1 } = DOOR;
  ctx.save(); ctx.translate(-cx, 0); if (t > S3) ctx.globalAlpha = sstep(S4 - 1.0, S4 + .2, t);
  floor(FLOOR, 1080, 2120, 1);
  // 门外：下雨的早上；④ 里雨停了，有阳光
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, mixc('#2a3650', '#f2c98f', sunny)); g.addColorStop(1, mixc('#141b28', '#c98d5c', sunny));
  ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); seg(x0, PARTNER.feet, x1, PARTNER.feet, 'rgba(236,230,218,.25)', 2, 1); ctx.restore();
  const umbA = 1 - sunny, ux = PARTNER.x + 6, uy = PARTNER.feet - 30 * PARTNER.s - 108 * PARTNER.s - 10;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, (x1 - x0) * op, y1 - y0); ctx.clip();                      // 只画门开着的那一部分（门关着就看不见他）
  rainIn(x0, y0, x1 - x0, y1 - y0, umbA, t, 46, 7, x => Math.abs(x - ux) < 120 ? uy - 70 + Math.pow((x - ux) / 120, 2) * 70 : null);
  fig(PARTNER.x, PARTNER.feet - 30 * PARTNER.s, PARTNER.s, 1, P_COL, { heart: .6 + .3 * sunny, beat: .2 });
  umbrella(ux, uy, umbA);
  ctx.restore();
  if (sunny > 0) warmth(sunny * op, (x0 + x1) / 2, 1000, 600, '255,200,140');
  // 门板（合页在右边）；门框
  const pw = (x1 - x0) * (1 - op);
  if (pw > 1) { ctx.save(); ctx.fillStyle = '#17161d'; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 3; ctx.fillRect(x1 - pw, y0, pw, y1 - y0); ctx.strokeRect(x1 - pw, y0, pw, y1 - y0);
    ctx.strokeStyle = 'rgba(236,230,218,.14)'; ctx.strokeRect(x1 - pw + pw * .12, y0 + 40, pw * .76, 220); ctx.strokeRect(x1 - pw + pw * .12, y0 + 300, pw * .76, 220);
    if (pw > 60) circ(x1 - pw + 26, y0 + 330, 7, GOLD, .9); ctx.restore(); }
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0 - 4, y1); ctx.lineTo(x0 - 4, y0 - 4); ctx.lineTo(x1 + 4, y0 - 4); ctx.lineTo(x1 + 4, y1); ctx.stroke(); ctx.restore();
  // 门关着的时候：门缝下面一道光，光里有两小块影子（他还站在门外）
  const shut = (1 - op) * sstep(L(6) + 3.0, L(6) + 3.4, t);
  if (shut > 0) { ctx.save(); ctx.globalAlpha = shut; ctx.fillStyle = `rgba(${W_RGB},.75)`; ctx.shadowColor = `rgba(${W_RGB},.9)`; ctx.shadowBlur = 16; ctx.fillRect(x0 + 6, y1 - 6, x1 - x0 - 12, 5);
    ctx.shadowBlur = 0; ctx.fillStyle = '#07080b'; for (const dx of [-28, 22]) { ctx.beginPath(); ctx.ellipse(PARTNER.x + dx, y1 - 3, 16, 4, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
  ctx.restore();
}

// 主角：房间 → 走到门口 → 往前一步、退回来、伸爪关门 → 哭 →（推进胸口）→ ③ 变成尺子上的点 → ④ 回到门口，迈出一步
function sceneMe(t) {
  if (t > S3 - .1 && t < S4 - .9) return;
  const cx = camX(t);
  let wx = track([[0, ME.x], [L(4) + 3.0, ME.x], [S2 + .2, ME2.x], [L(6) + .1, ME2.x], [L(6) + 1.2, ME2.x + 110, E.out], [L(6) + 1.5, ME2.x + 110], [L(6) + 2.4, ME2.x - 30], [S4 - .9, ME2.x - 30],
    [S4 + .4, ME2.x], [L(14) + .2, ME2.x], [L(14) + .9, ME2.x + 80, E.out]])(t);
  let s = track([[0, ME.s], [L(6) + .1, ME.s], [L(6) + 1.2, 2.82, E.out], [L(6) + 1.5, 2.82], [L(6) + 2.4, 3.05], [S4 - .9, 3.05], [S4 + .4, 3.0], [L(14) + .2, 3.0], [L(14) + .9, 2.9, E.out]])(t);
  const walking = win(t, L(4) + 3.0, S2 + .2, .3, .3) + win(t, L(6) + .1, L(6) + 1.2, .2, .2) + win(t, L(6) + 1.5, L(6) + 2.4, .2, .2) + win(t, L(14) + .2, L(14) + .9, .2, .2);
  const feet = FLOOR - Math.abs(Math.sin(t * 7)) * 10 * clamp(walking);
  // 收到“想你了”、打“我也想你”的时候，胸口的光亮起来，跳得快一点
  const hopeful = win(t, L(0) + 1.9, L(1) + 2.6, .3, .5) * .8 + win(t, L(2) + .4, L(2) + 1.8, .3, .4) * .5;
  const near = win(t, L(6) + .4, L(6) + 1.6, .4, .4) + hopeful, cry = sstep(L(7) + .3, L(7) + .8, t) * (1 - sstep(S3 - 1.2, S3 - .6, t));
  const tearY = ((t - L(7) - .3) / 1.6) % 1, close = win(t, L(6) + 2.4, L(6) + 3.4, .25, .3);
  ctx.save(); ctx.translate(-cx, 0);
  cat2At(wx, feet, s, 1, { heart: .6 + .4 * near + .3 * cry, beat: .3 * Math.max(0, Math.sin(t * TAU * (1 + near))) + .3 * near, arm: close, dir: 1, reach: 70, lift: -10,
    tear: cry, tearY: t > L(7) + .3 ? tearY : 0 });
  ctx.restore();
}

// 推进：门一关、它哭了 → 镜头慢慢推到它的脸和胸口；大字；再推进胸口的光里 → ③
function pushIn(t) { return E.io(prog(t, L(7) - .1, L(8) + 3.0)) * .4 + E.inExpo(prog(t, S3 - 1.3, S3 + .1)) * 9; }
function chestPt(t) { return [ME2.x - 30 - camX(t), chestY(FLOOR - 30 * 3.05, 3.05)]; }

// ======================================================================== ③ 为什么（S3 – S4）：恐惧型依恋；两把尺子都很高；心想靠近，身体往后退
const AX = { ox: 200, oy: 1200, x1: 900, y1: 720 }, QX = 550, QY = 960;
function sceneWhy(t) {
  if (t < S3 - .3 || t > S4 + .6) return;
  const A = sstep(S3 - .2, S3 + .4, t) * (1 - sstep(S4 - .9, S4 - .2, t));
  warmth(.6 * (1 - sstep(S3, S3 + 1.4, t)), 540, 900, 900, '255,220,200');
  // 题目
  const tk = E.outExpo(prog(t, L(9) + 1.2, L(9) + 2.2)), up = E.io(prog(t, L(10) - .2, L(10) + .6));
  ctx.save(); ctx.translate(540, lerp(700, 565, up)); const sc = lerp(1.15, 1, tk) * lerp(1, .62, up); ctx.scale(sc, sc);
  gradText('恐惧型依恋', 0, 0, 120, A * sstep(L(9) + 1.2, L(9) + 1.5, t), { filter: tk < .97 ? `blur(${((1 - tk) * 12).toFixed(1)}px)` : undefined, blur: 40 });
  ctx.restore();
  typeText('越想要，越推开', 540, 830, { size: 44, weight: 700, font: SERIF, color: GOLD, align: 'center', spread: 4, glow: `rgba(${O_RGB},.35)`, glowBlur: 14 }, prog(t, L(9) + 2.0, L(9) + 3.0), A * (1 - up));
  // 两把尺子、四种类型
  const ax = A * sstep(L(10) + .2, L(10) + .8, t) * (1 - sstep(L(12) - .2, L(12) + .5, t));
  if (ax > 0) {
    const grow = E.io(prog(t, L(10) + .2, L(10) + 1.2));
    seg(AX.ox, AX.oy, lerp(AX.ox, AX.x1, grow), AX.oy, 'rgba(236,230,218,.85)', 3.5, ax);
    seg(AX.ox, AX.oy, AX.ox, lerp(AX.oy, AX.y1, grow), 'rgba(236,230,218,.85)', 3.5, ax);
    ctx.save(); ctx.globalAlpha = ax * .35 * grow; ctx.strokeStyle = CREAM; ctx.setLineDash([8, 10]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(QX, AX.oy); ctx.lineTo(QX, AX.y1); ctx.moveTo(AX.ox, QY); ctx.lineTo(AX.x1, QY); ctx.stroke(); ctx.restore();
    const hiX = sstep(L(11) + .1, L(11) + .5, t), hiY = sstep(L(11) + 1.2, L(11) + 1.6, t);
    text('怕被丢下  →', AX.x1, AX.oy + 60, { font: SANS, size: 40, weight: 700, align: 'right', color: mixc('#8a93a3', WARMC, hiX), alpha: ax * grow });
    text('↑  怕靠太近', AX.ox - 10, AX.y1 - 50, { font: SANS, size: 40, weight: 700, align: 'left', color: mixc('#8a93a3', V_LT, hiY), alpha: ax * grow });
    const qa = ax * sstep(L(10) + 1.4, L(10) + 2.0, t);
    [['安全型', 375, 1080, CREAM], ['焦虑型', 725, 1080, WARMC], ['回避型', 375, 840, V_LT]].forEach(([s, x, y, col]) => text(s, x, y, { font: SANS, size: 36, weight: 700, align: 'center', color: col, alpha: qa * .55 }));
    const tr = sstep(L(10) + 2.6, L(10) + 3.2, t) * ax;
    if (tr > 0) { ctx.save(); ctx.globalAlpha = tr; const gg = ctx.createLinearGradient(QX, AX.oy, AX.x1, AX.y1); gg.addColorStop(0, 'rgba(255,170,90,.22)'); gg.addColorStop(1, 'rgba(127,156,196,.3)');
      ctx.fillStyle = gg; ctx.fillRect(QX, AX.y1, AX.x1 - QX, QY - AX.y1); ctx.restore();
      const ps = pop(t, L(10) + 2.6); ctx.save(); ctx.translate(725, 840); if (ps) ctx.scale(ps, ps); gradText('恐惧型', 0, 0, 46, tr, { font: SANS, blur: 20 }); ctx.restore(); }
    text('高', 800, AX.oy + 116, { font: SANS, size: 44, weight: 900, align: 'center', color: WARMC, alpha: ax * hiX });
    text('高', AX.ox - 60, 840, { font: SANS, size: 44, weight: 900, align: 'center', color: V_LT, alpha: ax * hiY });
    // 那个点：沿着对角线爬到右上角
    const run = E.io(prog(t, L(10) + 2.0, L(10) + 3.0));
    if (t > L(10) + 1.6) { glow(lerp(AX.ox, 820, run), lerp(AX.oy, 790, run), 9, A_RGB, ax, 6); glow(lerp(AX.ox, 820, run) + 6, lerp(AX.oy, 790, run), 6, V_RGB, ax * .8, 4); }
  }
  // 心想靠近，身体往后退：点变回猫；胸口的光往右飘，身体往左退，中间一根线越拉越紧
  const ca = sstep(L(12) - .1, L(12) + .5, t) * (t < S4 - .9 ? 1 : 0), la = A * ca;
  if (ca > 0) {
    const home = E.io(prog(t, S4 - 1.6, S4 - .9));
    const s = lerp(2.6, 3.05, home), body = track([[0, 540], [L(12) + 1.4, 540], [L(12) + 2.6, 400], [S4 - 1.6, 400], [S4 - .9, ME2.x - 30 - 1080]])(t), feet = lerp(1180, FLOOR, home), cy = chestY(feet - 30 * s, s);
    const hx = track([[0, 540], [L(12) + .3, 540], [L(12) + 1.5, 760, E.out], [S4 - 1.9, 760], [S4 - 1.1, body]])(t), hy = cy - 40 * sstep(L(12) + .3, L(12) + 1.5, t) * (1 - sstep(S4 - 1.9, S4 - 1.1, t));
    const pull = sstep(L(12) + 1.4, L(12) + 2.6, t);
    const apart = Math.abs(hx - body) > 6;
    if (apart) thread(body, cy, hx, hy, ca, '236,230,218', 0, 2 + 2 * pull);
    cat2At(body, feet, s, ca, { heart: apart ? .15 : 1 });
    if (apart) { glow(hx - 3, hy, 11, A_RGB, ca, 7); glow(hx + 3, hy, 9, V_RGB, ca * .7, 5); }
    text('心：想靠近 →', 760, hy - 80, { font: SANS, size: 38, weight: 900, align: 'center', color: WARMC, alpha: la * sstep(L(12) + .6, L(12) + 1.0, t) });
    text('← 身体：往后退', 400, 700, { font: SANS, size: 38, weight: 900, align: 'center', color: V_LT, alpha: la * sstep(L(12) + 1.6, L(12) + 2.0, t) });
  }
}

// ======================================================================== ④ 怎么办（S4 – 结束）：一次一步
function sceneSteps(t) {
  if (t < S4 - .9) return;
  const A = sstep(S4 - .9, S4 + .3, t), cx = camX(t);
  ctx.save(); ctx.translate(-cx, 0);
  const lit = [L(14) + .55, 1e9, 1e9, 1e9];
  for (let i = 0; i < 4; i++) {
    const x = ME2.x + 80 + i * 70, y = FLOOR + 6 - (i % 2) * 10;
    paw(x, y, 1.5, A * sstep(L(13) + 2.6 + i * .25, L(13) + 3.0 + i * .25, t), sstep(lit[i], lit[i] + .3, t));
  }
  ctx.restore();
  // 大字：越想要，越推开；评论区
  const fin = sstep(L(15) - .1, L(15) + .4, t);
  ctx.save(); ctx.translate(540, 520); const k = E.outExpo(prog(t, L(15), L(15) + 1.0)); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k));
  gradText('越想要，越推开', 0, 0, 96, fin, { filter: k < .97 ? `blur(${((1 - k) * 12).toFixed(1)}px)` : undefined, blur: 36 }); ctx.restore();
  const Q = sstep(L(16) - .1, L(16) + .4, t);
  typeText('评论区说说：', 540, 1330, { size: 42, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, L(16), L(16) + .5), Q);
  typeText('你有没有把一个很想要的人，推开过？', 540, 1410, { size: 48, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, L(16) + .4, L(16) + 1.6), Q);
}

// ======================================================================== 封面（第一帧）和中间的大字
function sceneWords(t) {
  const hook = 1 - sstep(L(1) - .2, L(1) + .4, t);
  if (hook > 0) {
    text('他说想你，', 540, 370, { size: 104, weight: 900, align: 'center', color: CREAM, alpha: hook, glow: 'rgba(255,225,190,.3)', blur: 30 });
    gradText('我只回了一个“嗯”', 540, 492, 92, hook, { blur: 40 });
  }
  // 门一关，它就哭了 → 它不是不想被爱。它是太想了，又太怕了。
  const b = sstep(L(8) - .1, L(8) + .3, t) * (1 - sstep(S3 - 1.2, S3 - .6, t));
  typeText('它不是不想被爱，', 540, 470, { ...big, size: 72, weight: 900, color: CREAM }, prog(t, L(8), L(8) + 1.2), b);
  if (b > 0) { const k = prog(t, L(8) + 1.6, L(8) + 2.6); ctx.save(); ctx.globalAlpha = sstep(0, .3, k); gradText('是太想了，又太怕了。', 540, 590, 76, b, { blur: 30 }); ctx.restore(); }
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, .1);
  const z = t < S3 + .2 ? pushIn(t) : 0;
  ctx.save();
  if (z > 0) { const [px, py] = chestPt(t), c = clamp(z / .4) * .6; ctx.translate(lerp(px, 540, c), lerp(py, 960, c)); ctx.scale(1 + z, 1 + z); ctx.translate(-px, -py); }
  sceneRoom(t); sceneDoor(t); scenePhone(t); sceneMe(t); sceneSteps(t);
  ctx.restore();
  const flash = E.inExpo(prog(t, S3 - .9, S3)) * (1 - sstep(S3, S3 + .9, t));
  if (flash > 0) { ctx.save(); const g = ctx.createRadialGradient(540, 900, 0, 540, 900, 1300); g.addColorStop(0, `rgba(255,232,210,${flash})`); g.addColorStop(1, `rgba(200,210,240,${.8 * flash})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  sceneWhy(t);
  sceneWords(t);
}
function SAMPLES(T) {
  const many = [[S3 - 1.3, S3 + .3]];
  const fast = [[L(4) + 3.0, S2 + .2], [L(6), L(6) + 3.4], [S4 - .9, S4 + .4], [L(12) + .3, L(12) + 2.6], [L(10) + 2.0, L(10) + 3.0], [L(14) + .2, L(14) + .9]];
  const in_ = r => r.some(([a, b]) => T > a && T < b);
  return in_(many) ? 12 : in_(fast) ? 5 : 3;
}
function BLOOM_K(T) { return .42 + .1 * win(T, L(8), S3, .5, .3) + .14 * win(T, L(14), TOTAL, .8, 1); }
function OVER(T) {
  stamp('1991', 'Bartholomew & Horowitz', L(9), L(10) - .1, T);
  stamp('1998', 'Brennan, Clark & Shaver', L(10), S4 - .2, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(4901);
  STARS = Array.from({ length: 500 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .3 }; });
}

// ======================================================================== 音效提示表（G 小调 → 降 B 大调）
const NOTE = { G4: 392.0, Bb4: 466.16, D5: 587.33, F5: 698.46, G5: 783.99, Bb5: 932.33, D6: 1174.66 };
const B_SHIM = [NOTE.Bb5, NOTE.F5, NOTE.D6, NOTE.D5, NOTE.Bb4], G_SWELL = [98.0, 146.83, 196.0, 233.08, 293.66], B_SWELL = [116.54, 174.61, 233.08, 293.66, 349.23];
function CUES() {
  const c = [];
  // ① 雨（隔着窗）；消息；打字、删掉；“嗯”发出去；等到天亮
  c.push([0, 'rain', { dur: S2 + 1.5, gain: .12, muffle: 1, fi: .05, fo: 1.5 }]);
  c.push([L(0) + 1.9, 'ding', { f: 1318.5, gain: .08, pan: .3 }]);
  const keys = (t0, t1, n, g = .035) => { for (let i = 0; i < n; i++) c.push([t0 + (t1 - t0) * i / n, 'click', { gain: g }]); };
  keys(L(1) + .6, L(1) + 1.6, 4); keys(L(1) + 2.5, L(1) + 3.1, 4, .025);
  keys(L(2) + .5, L(2) + 1.7, 6); keys(L(2) + 2.2, L(2) + 2.9, 6, .025);
  keys(L(3) + 1.3, L(3) + 1.4, 1); c.push([L(3) + 2.0, 'swish', { dur: .3, gain: .05 }]);
  c.push([L(4) + .4, 'air', { dur: 3.2, hum: 98, gain: .05 }]);
  // ② 走到门口；敲门；开门：雨声近了；往前一步、退回来；门关上；哭
  c.push([L(4) + 3.0, 'swish', { dur: 1.4, gain: .04 }], [S2 - .2, 'thud', { gain: .05 }], [S2 + .1, 'thud', { gain: .05 }]);
  c.push([L(5) + .3, 'creak', { gain: .04 }], [L(5) + .4, 'rain', { dur: L(6) + 3.4 - L(5) - .4, gain: .16, fi: .8, fo: .3 }]);
  c.push([L(6) + 3.2, 'thud', { gain: .12 }], [L(6) + 3.25, 'rain', { dur: S3 - L(6) - 3.2, gain: .08, muffle: 1, fi: .05, fo: 1.5 }]);
  c.push([L(8), 'swell', { dur: 3.5, f: G_SWELL, gain: .06 }]);
  // ③ 推进胸口；题目；尺子；点爬到右上角；心往前、身体往后
  c.push([S3 - 1.3, 'riser', { dur: 1.3, gain: .1 }], [S3, 'shimmer', { f: B_SHIM, gain: .08 }]);
  c.push([L(9) + 1.2, 'swell', { dur: 1.2, f: B_SWELL, gain: .08 }]);
  for (let i = 0; i < 6; i++) c.push([L(10) + .2 + i * .15, 'tick', { gain: .025 }]);
  c.push([L(10) + 2.0, 'bar', { f0: 300, f1: 800, dur: 1.0, gain: .05 }], [L(10) + 2.6, 'tink', { f: NOTE.D6, gain: .05 }]);
  c.push([L(11) + .1, 'tink', { f: NOTE.Bb5, gain: .04 }], [L(11) + 1.2, 'tink', { f: NOTE.F5, gain: .04 }]);
  c.push([L(12) + .3, 'swish', { dur: .9, gain: .05 }], [L(12) + 1.4, 'creak', { gain: .05 }]);
  // ④ 门开一条缝；爪印；迈出一步；大字
  c.push([L(13) + 2.4, 'creak', { gain: .035 }], [L(13) + 2.6, 'air', { dur: 3, hum: 116.5, gain: .04 }]);
  c.push([L(14) + .55, 'tink', { f: NOTE.Bb5, gain: .06 }], [L(14) + .3, 'swell', { dur: 2.0, f: B_SWELL, gain: .06 }]);
  c.push([L(15), 'shimmer', { f: B_SHIM, gain: .12 }], [L(16), 'tink', { f: NOTE.D6, gain: .05 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
