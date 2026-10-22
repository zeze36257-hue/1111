// ======================================================================== No.47 焦虑型依恋：不是太黏人，只是太怕失去（讲课格式第三期）
// 恋爱心理系列第二期，和 No.46《回避型依恋》是一对：上一期讲躲起来的那只猫，这一期讲一直去敲门、一直在等的那只。
// 结构：问题 → 是什么（两把尺子，这次是第一把特别高）→ 警报器（过度激活）→ 怎么来的（回应时有时无）→ 怎么办。
// 一镜到底：镜头钻进胸口那团暖光 → 题目；题目下面那一笔 → 尺子的横轴；点 → 十只猫 → 走到镜头前的那一只，胸口变成警报；
//   倒带回小奶猫，哭声越来越大，胸口长出警报；长大以后，一句直接的话、一个确定的回应，让警报慢慢停下来。
// 角色都是黑猫（片头片尾那只的缩小版）：焦虑型 = 暖橙，爱着它的那只 = 青色——品牌黑猫那双异色瞳的两种颜色。
// 没有片头（meta.json "intro": false）：第一帧就是封面“越在乎，越不安”。
// 时间：画面里的时间都写成 L(i) + 秒数（第 i 句开始之后），时间轴由 layout.py 按配音的真实长度排出来。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 144.0;
const SECTIONS = [['问题', 0.0, 22.4], ['是什么', 22.4, 41.6], ['警报器', 41.6, 76.8], ['怎么来的', 76.8, 102.4], ['怎么办', 102.4, 144.0]];
const LINES = [
  [0.15, 4.32, '你是不是这样：消息发出去，就一直盯着屏幕？'],
  [4.72, 8.58, '对方晚回一会儿，你就开始想：是不是我说错了什么？'],
  [8.93, 12.47, '他回了一个「嗯」，你能琢磨一整晚。'],
  [12.97, 15.53, '或者，你正在爱着这样一个人。'],
  [15.93, 18.60, '今天，我们一起来聊聊「焦虑型依恋」。'],
  [22.70, 26.40, '心理学家用两把尺子，量一个人怎么谈感情。'],
  [26.70, 31.21, '焦虑型，是第一把尺子特别高：特别怕被抛弃。'],
  [31.56, 35.10, '所以越在乎，越想靠近，越想确认。'],
  [35.50, 39.38, '在两项大型调查里，大约一到两成的人这样形容自己。'],
  [41.90, 45.20, '心理学家把焦虑型的做法，叫「过度激活」：'],
  [45.40, 49.62, '回避型把心里的警报关小，焦虑型把它开到最大。'],
  [50.02, 54.37, '就像一个太灵敏的烟雾报警器：烤个面包，它也响。'],
  [54.97, 58.80, '有个实验，让人看一张脸，慢慢变出表情。'],
  [59.05, 61.55, '越焦虑的人，越早觉得「表情变了」；'],
  [61.75, 64.81, '可也更容易看错，因为判断得太快。'],
  [65.31, 70.38, '另一项研究发现：越焦虑的人，越常去翻伴侣的社交软件。'],
  [70.63, 73.15, '警报一响，就忍不住要去确认。'],
  [77.10, 79.85, '这个警报，是怎么调得这么灵敏的？'],
  [80.20, 85.44, '心理学家观察过一种宝宝：妈妈一走就大哭，回来了，又很难哄好。'],
  [85.74, 89.35, '研究者认为，这可能和照顾者的回应时有时无有关：'],
  [89.55, 93.88, '有时候哭一声就有人来，有时候怎么哭都没人理。'],
  [94.28, 98.38, '孩子可能就学会了：声音要够大，才会被看见。'],
  [102.70, 104.00, '如果你是焦虑型：'],
  [104.20, 106.89, '警报响的时候，先别急着试探。'],
  [107.19, 112.24, '别问「你是不是不爱我了」，直接说：「我有点不安，能抱我一下吗？」'],
  [112.84, 114.21, '如果你爱着一个焦虑型：'],
  [114.41, 117.61, '一个确定的回应，比十句「我爱你」都管用。'],
  [117.86, 121.65, '比如：「我今天很忙，晚上十点给你打电话。」'],
  [122.05, 128.07, '研究也发现：另一半多一点包容，焦虑型的人也会慢慢缓和下来。'],
  [128.57, 131.87, '依恋类型挺稳定，但不是一辈子的标签。'],
];
const BIGLINES = [
  [132.47, 135.80, '焦虑型的人，不是太黏人，只是太怕失去。'],
  [136.60, 140.78, '评论区说说：你是焦虑型，还是正在爱着一个焦虑型？'],
];
// 第 i 句（按时间排，含大字）开始的时间：L(i)；结束：LE(i)
const ALL_LINES = [...LINES, ...BIGLINES].sort((a, b) => a[0] - b[0]);
const L = i => ALL_LINES[i][0], LE = i => ALL_LINES[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const SERIES = '黑猫不说话 · 心理学 No.47';
const S2 = S['是什么'], S3 = S['警报器'], S4 = S['怎么来的'], S5 = S['怎么办'];

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


function rewindFx(k) {                                                                                    // 倒带：横向的亮线 + 左上角的 ◀◀
  if (k <= 0) return;
  for (let i = 0; i < 26; i++) { const r = mulberry(300 + i), y = 420 + r() * 1000, x = W - ((k * 2.4 + r()) % 1) * (W + 600), len = 140 + 400 * r();
    seg(x, y, x + len, y, 'rgba(236,230,218,.5)', 1 + 2 * r(), Math.sin(PI * k) * .6); }
  text('◀◀', 96, 440, { font: SANS, size: 44, weight: 900, color: CREAM, alpha: Math.sin(PI * Math.min(1, k * 1.3)) });
}

// ======================================================================== 这一期的小道具
const A_COL = WARMC, P_COL = TEALC, P_RGB = '127,227,211', A_RGB = '255,179,107', ALARM_RGB = '255,120,90';
const STAGE = { floor: 1100, s: 1.5 }, SY = STAGE.floor - 30 * STAGE.s;
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
// 哭声：从嘴边往外扩的弧线
function cry(x, y, dir, size, t, a, rate = 2) {
  if (a <= 0 || size <= 0) return;
  for (let i = 0; i < 3; i++) {
    const p = ((t * rate + i / 3) % 1), r = 14 + size * p;
    ctx.save(); ctx.globalAlpha = a * (1 - p); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x, y, r, dir > 0 ? -PI / 3.5 : PI - PI / 3.5, dir > 0 ? PI / 3.5 : PI + PI / 3.5); ctx.stroke(); ctx.restore();
  }
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
// 手机：圆角屏幕 + 顶部的时间
function phone(x, y, w, h, a, clock) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(14,16,22,.97)'; ctx.strokeStyle = 'rgba(236,230,218,.55)'; ctx.lineWidth = 4;
  ctx.shadowColor = `rgba(${P_RGB},.25)`; ctx.shadowBlur = 40;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 40); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(236,230,218,.22)'; ctx.beginPath(); ctx.roundRect(x - 44, y - h / 2 + 16, 88, 10, 5); ctx.fill(); ctx.restore();
  if (clock) text(clock, x, y - h / 2 + 58, { font: SANS, size: 26, weight: 700, align: 'center', color: DIM, alpha: a });
}
function chatBubble(s, x, y, a, mine, size = 28) {                                                  // 聊天气泡：自己的在右（橙），对方的在左（青）
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 40, h = size * 1.9;
  const bx = mine ? x - w : x;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = mine ? 'rgba(242,161,74,.92)' : 'rgba(127,227,211,.18)'; ctx.strokeStyle = mine ? 'rgba(0,0,0,0)' : `rgba(${P_RGB},.6)`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(bx, y - h / 2, w, h, 18); ctx.fill(); ctx.stroke(); ctx.restore();
  text(s, bx + w / 2, y + 1, { font: SANS, size, weight: 700, align: 'center', color: mine ? '#1a1208' : P_COL, alpha: a });
}
function clockStr(min) { const m = ((Math.floor(min) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }

// ======================================================================== ① 问题（0 – S2）：消息发出去，就一直盯着屏幕
const PH = { x: 745, y: 965, w: 330, h: 480 };
function sceneOpen(t) {
  if (t > L(4) + 2.1) return;
  const zk = E.inExpo(prog(t, L(4) + .1, L(4) + 1.1)), A = 1 - sstep(L(4) + .9, L(4) + 1.2, t);
  const ax = 330, acy = chestY(SY, 1.6);
  ctx.save(); ctx.globalAlpha = A;
  if (zk > 0) { const z = 1 + 14 * zk; ctx.translate(ax, acy); ctx.scale(z, z); ctx.translate(-ax, -acy); }
  // 夜越来越深：一整晚
  const night = sstep(L(2) + 1.6, L(2) + 3.4, t);
  if (night > 0) { chill(.5 * night, 540, 700, 900); }
  floor(STAGE.floor, 60, 1020, 1);
  // 手机：发“在吗？”→ 已读 → “正在输入…”又没了 → 时间一直走 → 回了一个“嗯。”
  const phA = 1 - sstep(L(3), L(3) + .6, t), pan = E.io(prog(t, L(3), L(3) + 1.2));
  if (phA > 0) {
    const px = PH.x + 260 * pan;
    const minutes = 22 * 60 + 41 + 17 * sstep(L(1), L(1) + 1.2, t) + 240 * E.io(prog(t, L(2) + 1.6, L(2) + 3.4));
    phone(px, PH.y, PH.w, PH.h, phA, clockStr(minutes));
    const sent = sstep(L(0) + 1.0, L(0) + 1.3, t), lift = 30 * (1 - E.out(prog(t, L(0) + 1.0, L(0) + 1.4)));
    if (t < L(0) + 1.0) {                                                                              // 正在打字
      const msg = '在吗？', n = Math.floor(clamp(prog(t, L(0) + .1, L(0) + .8)) * msg.length);
      ctx.save(); ctx.globalAlpha = phA; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(px - 150, PH.y + PH.h / 2 - 84, 300, 56, 28); ctx.stroke(); ctx.restore();
      text(msg.slice(0, n) + ((t * 2) % 1 < .5 ? '|' : ''), px - 126, PH.y + PH.h / 2 - 56, { font: SANS, size: 28, color: CREAM, alpha: phA });
    }
    chatBubble('在吗？', px + 150, PH.y - 120 + lift, phA * sent, true, 30);
    text('已读', px + 150, PH.y - 72, { font: SANS, size: 22, align: 'right', color: DIM, alpha: phA * sstep(L(0) + 2.0, L(0) + 2.3, t) });
    const typing = win(t, L(0) + 2.7, L(0) + 3.7, .15, .2);                                              // 对方“正在输入…”，又没了
    if (typing > 0) chatBubble('· · ·', px - 150, PH.y - 10, phA * typing, false, 30);
    chatBubble('嗯。', px - 150, PH.y - 10, phA * sstep(L(2) + .9, L(2) + 1.2, t), false, 32);
  }
  // 一个个冒出来的念头
  [[L(1) + 1.9, '是不是我说错了什么？', 300, 720], [L(1) + 2.7, '他生气了？', 420, 600], [L(1) + 3.3, '是不是我太烦了…', 270, 490],
   [L(2) + 1.6, '「嗯」是什么意思？', 290, 720], [L(2) + 2.2, '为什么只回一个字', 400, 600], [L(2) + 2.8, '是不是不想理我', 270, 490]].forEach(([t0, s, x, y], i) => {
    const k = sstep(t0, t0 + .25, t) * (1 - sstep(i < 3 ? L(2) + .6 : L(3) - .2, i < 3 ? L(2) + 1.0 : L(3) + .3, t));
    thought(s, x, y - 14 * (1 - E.out(prog(t, t0, t0 + .4))), k, 30);
  });
  // 一整晚：月亮升起
  if (night > 0) { ctx.save(); ctx.globalAlpha = night * (1 - sstep(L(3), L(3) + .6, t)); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(906, 446, 30, 0, TAU); ctx.clip('evenodd');
    ctx.fillStyle = GOLD; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(890, 456 + 40 * (1 - night), 34, 0, TAU); ctx.fill(); ctx.restore(); }
  // 爱着它的那只猫：从右边走进来
  const pIn = E.io(prog(t, L(3) + .2, L(3) + 1.4)), pX = lerp(1200, 760, pIn);
  if (pIn > 0) {
    thread(ax + 30 * 1.6, STAGE.floor - 80 * 1.6, pX - 30 * 1.6, STAGE.floor - 80 * 1.6, pIn, W_RGB, 20, 3);
    fig(pX, SY, 1.6, 1, P_COL, { heart: .4 });
  }
  // 焦虑的那只猫：胸口的光跟着念头越跳越快
  const worry = sstep(L(1), L(1) + 2, t) + sstep(L(2) + 1.2, L(2) + 2.5, t);
  fig(ax, SY, 1.6, 1, A_COL, { heart: .9, beat: .3 + .5 * Math.max(0, Math.sin(t * TAU * lerp(1, 2.6, clamp(worry / 2)))) });
  ctx.restore();
  // 开头大字（第一帧就是封面）
  const hook = 1 - sstep(L(1) + 1.4, L(1) + 1.9, t);
  if (hook > 0) {
    text('越在乎，', 540, 440, { size: 112, weight: 900, align: 'center', color: CREAM, alpha: hook, glow: 'rgba(255,225,190,.25)', blur: 30 });
    text('越不安', 540, 585, { size: 142, weight: 900, align: 'center', color: WARMC, alpha: hook, glow: `rgba(${O_RGB},.55)`, blur: 40 });
  }
  // 推进胸口那团光：一片暖光
  const flash = zk * zk * (1 - sstep(L(4) + 1.1, L(4) + 1.9, t));
  if (flash > 0) { ctx.save(); const g = ctx.createLinearGradient(0, 1250, 0, 1450); g.addColorStop(0, `rgba(255,226,190,${.92 * flash})`); g.addColorStop(1, `rgba(255,226,190,${.35 * flash})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ======================================================================== 题目（L4 + 1 → S2 + 1）：光里浮出来；下面那一笔变成尺子
const TITLE_Y = 780, UNDER = { y: 900, x0: 330, x1: 750 }, AX = { ox: 200, oy: 1180, x1: 900, y1: 640 };
function sceneTitle(t) {
  const t0 = L(4) + 1.0; if (t < t0 - .2 || t > S2 + 1.6) return;
  const e = E.outExpo(prog(t, t0, t0 + 1.2)), out = E.io(prog(t, S2 - .1, S2 + .6)), A = sstep(t0, t0 + .3, t) * (1 - out);
  warmth(.8 * A, 540, 820, 700);
  if (A > 0) {
    ctx.save(); ctx.translate(540, TITLE_Y - 120 * out); const sc = (1.25 - .25 * e) * (1 + .06 * E.ioSine(prog(t, t0 + 1.0, S2 + .4))); ctx.scale(sc, sc);
    ctx.filter = e < .97 ? `blur(${((1 - e) * 16).toFixed(1)}px)` : 'none';
    text('焦虑型依恋', 0, 0, { size: 128, weight: 900, align: 'center', color: WARMC, alpha: A, glow: `rgba(${O_RGB},.6)`, blur: 40 });
    ctx.restore();
    seriesTag(TITLE_Y - 130, A * sstep(t0 + .4, t0 + 1.0, t));
    typeText('不是太黏人，只是太怕失去', 540, TITLE_Y + 190, { size: 42, weight: 700, font: SERIF, color: GOLD, align: 'center', spread: 4, glow: `rgba(${O_RGB},.35)`, glowBlur: 14 }, prog(t, t0 + 1.0, t0 + 2.2), A);
    for (let i = 0; i < 26; i++) { const r = mulberry(4800 + i), p = ((t - t0) * (.05 + .07 * r()) + r()) % 1;
      glow(120 + r() * 840, 1250 - p * 760, 1.2 + 2.2 * r(), O_RGB, A * Math.sin(PI * p) * .7, 4); }
  }
  const draw = E.io(prog(t, t0 + .6, t0 + 1.3)), fall = E.ioExpo(prog(t, S2 - .1, S2 + 1.0));
  if (draw > 0 && t < S2 + 1.6) {
    const y = lerp(UNDER.y, AX.oy, fall), x0 = lerp(UNDER.x0, AX.ox, fall), x1 = lerp(UNDER.x0 + (UNDER.x1 - UNDER.x0) * draw, AX.x1, fall);
    ctx.save(); ctx.strokeStyle = fall > .5 ? 'rgba(236,230,218,.85)' : ORANGE; ctx.lineWidth = lerp(5, 3.5, fall); ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${O_RGB},${.8 * (1 - fall)})`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
  }
}

// ======================================================================== ② 是什么（S2 – S3）：这次是第一把尺子特别高
const QUAD_X = 550, QUAD_Y = 910, DOT = { x: 800, y: 1080 };
const GRID10 = [0, 1, 2, 3, 4].flatMap(c => [0, 1].map(r => [210 + c * 165, 960 + r * 170]));
function sceneRulers(t) {
  if (t < S2 + .9 || t > S3 + 1.4) return;
  const gone = sstep(L(8) + .1, L(8) + .8, t), A = 1 - gone;
  if (A > 0) {
    seg(AX.ox, AX.oy, AX.x1, AX.oy, 'rgba(236,230,218,.85)', 3.5, A);
    const up = E.io(prog(t, S2 + .6, S2 + 1.5));
    seg(AX.ox, AX.oy, AX.ox, lerp(AX.oy, AX.y1, up), 'rgba(236,230,218,.85)', 3.5, A);
    const tick = prog(t, S2 + 1.0, S2 + 2.2);
    for (let i = 1; i <= 14; i++) { const k = sstep(i / 15 - .05, i / 15, tick), len = i % 2 ? 10 : 20;
      seg(AX.ox + i * 50, AX.oy, AX.ox + i * 50, AX.oy - len, 'rgba(236,230,218,.55)', 2, A * k);
      if (i <= 10) seg(AX.ox, AX.oy - i * 50, AX.ox + len, AX.oy - i * 50, 'rgba(236,230,218,.55)', 2, A * k); }
    const lx = win(t, S2 + 1.2, S3, .4, .1) * A, ly = win(t, S2 + 1.6, S3, .4, .1) * A;
    text('怕被抛弃  →', AX.x1, AX.oy + 60, { font: SANS, size: 42, weight: 700, align: 'right', color: WARMC, alpha: lx });
    text('↑  怕太亲近', AX.ox - 10, AX.y1 - 54, { font: SANS, size: 42, weight: 700, align: 'left', color: ICE, alpha: ly });
    typeText('两把尺子', 540, 500, { ...big, size: 64, weight: 900 }, prog(t, L(5) + .2, L(5) + 1.0), A * (1 - sstep(L(6) - .3, L(6) + .2, t)));
    const glowX = win(t, L(6) + .2, L(6) + 2.6, .3, .8) * A;
    if (glowX > .02) seg(AX.ox, AX.oy, AX.x1, AX.oy, `rgba(${O_RGB},.9)`, 7, glowX);
    const grid = sstep(L(6) + 2.0, L(6) + 2.6, t) * A;
    if (grid > 0) { ctx.save(); ctx.globalAlpha = grid * .35; ctx.strokeStyle = CREAM; ctx.setLineDash([8, 10]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(QUAD_X, AX.oy); ctx.lineTo(QUAD_X, AX.y1); ctx.moveTo(AX.ox, QUAD_Y); ctx.lineTo(AX.x1, QUAD_Y); ctx.stroke(); ctx.restore(); }
    const fill = sstep(L(6) + 2.4, L(6) + 3.2, t) * A;                                                   // 右半边（怕被抛弃高）亮起来
    if (fill > 0) { ctx.save(); ctx.globalAlpha = fill; const g = ctx.createLinearGradient(QUAD_X, 0, AX.x1, 0); g.addColorStop(0, 'rgba(255,170,90,.04)'); g.addColorStop(1, 'rgba(255,170,90,.24)');
      ctx.fillStyle = g; ctx.fillRect(QUAD_X, AX.y1, AX.x1 - QUAD_X, AX.oy - AX.y1 - 2); ctx.restore();
      pill('焦虑型', 725, 780, fill, { color: WARMC, stroke: `rgba(${O_RGB},.6)`, glow: `rgba(${O_RGB},.5)`, size: 44 }); }
    const pj = sstep(L(6) + 1.0, L(6) + 1.5, t) * A;
    if (pj > 0) { ctx.save(); ctx.globalAlpha = pj * .7; ctx.strokeStyle = WARMC; ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(DOT.x, DOT.y); ctx.lineTo(DOT.x, AX.oy + 80); ctx.stroke(); ctx.restore(); }
    text('高', DOT.x, AX.oy + 116, { font: SANS, size: 46, weight: 900, align: 'center', color: WARMC, alpha: pj });
    // 越在乎，越想靠近，越想确认
    [['想靠近', L(7) + 1.0, 690, 990], ['想确认', L(7) + 1.9, 690, 1080]].forEach(([s, t0, x, y]) =>
      text(s, x, y, { font: SANS, size: 40, weight: 900, align: 'right', color: GOLD, alpha: A * sstep(t0, t0 + .3, t) }));
  }
  // 那个点：从原点沿着横尺往右跑，停在右下；然后分成十只猫
  if (t >= L(6)) {
    const run = E.io(prog(t, L(6) + .1, L(6) + 1.0)), appear = sstep(L(6), L(6) + .3, t);
    const x = lerp(AX.ox, DOT.x, run), y = lerp(AX.oy, DOT.y, run);
    const split = E.io(prog(t, L(8) + .2, L(8) + 1.3)), become = sstep(L(8) + .9, L(8) + 1.5, t);
    const walk = E.io(prog(t, S3 - 1.4, S3 + .2)), fade = sstep(S3 - 1.6, S3 - .6, t), dimOthers = sstep(L(8) + 2.8, L(8) + 3.6, t);
    if (become < 1) {
      const pulse = win(t, L(7) + .2, L(8), .2, .3);
      if (pulse > 0) alarm(x, y, .5, .5, t, pulse * (1 - split));
    }
    GRID10.forEach(([gx, gy], i) => {
      const lit = i === 7, half = i === 2;                                                              // 一到两成：一只全亮，一只半亮
      if (!lit && split <= 0) return;
      if (lit && t > S3 + .2) return;                                                                  // 走到镜头前以后，交给 sceneAlarm
      const px = lerp(x, gx, split), py = lerp(y, gy, split), a2 = lit ? 1 : (1 - fade) * (1 - .6 * dimOthers);
      if (become < 1) glow(px, py, 8, lit || half ? O_RGB : C_RGB, appear * a2 * (1 - become), 6);
      if (become > 0) {
        const fx = lit ? lerp(px, 540, walk) : px, fy = lit ? lerp(py, 1060, walk) : py, s = lit ? lerp(.55, 1.9, walk) * become : .55 * become;
        fig(fx, fy, s, a2 * (half ? .8 : 1), lit ? A_COL : half ? mixc('#5d6472', A_COL, .55) : '#5d6472', { heart: lit ? .6 : 0 });
        if (lit) warmth(.4 * become * (1 - walk * .5), fx, fy - 40, 220);
      }
    });
    const q = sstep(L(8) + 2.0, L(8) + 2.5, t) * (1 - fade), ps = pop(t, L(8) + 2.0);
    ctx.save(); ctx.translate(540, 720); if (ps) ctx.scale(ps, ps);
    text('≈ 1～2 成', 0, 0, { font: SERIF, size: 110, weight: 900, align: 'center', color: WARMC, alpha: q, glow: `rgba(${O_RGB},.5)`, blur: 26 }); ctx.restore();
    text('这样形容自己', 540, 830, { font: SANS, size: 42, weight: 700, align: 'center', color: DIM, alpha: q });
  }
}

// ======================================================================== ③ 警报器（S3 – S4）
const BIGC = { x: 540, y: 1060, s: 1.9 };
function knob(x, y, k, label, col, a) {                                                                 // 旋钮：k 0 最小 → 1 最大
  if (a <= 0) return;
  const R = 78, a0 = PI * .75, a1 = PI * 2.25, ang = lerp(a0, a1, k);
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i <= 10; i++) { const th = lerp(a0, a1, i / 10), hot = i >= 8;
    ctx.strokeStyle = hot ? `rgba(${ALARM_RGB},.9)` : 'rgba(236,230,218,.5)'; ctx.lineWidth = hot ? 5 : 3;
    ctx.beginPath(); ctx.moveTo(x + Math.cos(th) * (R + 10), y + Math.sin(th) * (R + 10)); ctx.lineTo(x + Math.cos(th) * (R + 26), y + Math.sin(th) * (R + 26)); ctx.stroke(); }
  ctx.fillStyle = '#12141c'; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * (R - 16), y + Math.sin(ang) * (R - 16)); ctx.stroke();
  ctx.restore();
  text(label, x, y + R + 62, { font: SANS, size: 38, weight: 900, align: 'center', color: col, alpha: a });
}
function catFace(x, y, R, k, a) {                                                                      // 一张猫脸：k 0 平静 → 1 不高兴（眯眼、眉头往下压、嘴角往下）
  if (a <= 0) return;
  const sc = R / 108;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(0, 150);
  ctx.strokeStyle = P_COL; ctx.lineWidth = 6 / sc; ctx.shadowColor = P_COL; ctx.shadowBlur = 20;
  for (const p of [CAT_PATH.head, CAT_PATH.earL, CAT_PATH.earR]) ctx.stroke(p);
  ctx.shadowBlur = 0; ctx.fillStyle = '#07080b'; for (const p of [CAT_PATH.head, CAT_PATH.earL, CAT_PATH.earR]) ctx.fill(p);
  for (const ex of [-42, 42]) {
    ctx.save(); ctx.translate(ex, -152); const open = 1 - .62 * k;
    ctx.beginPath(); ctx.moveTo(-24, 0); ctx.quadraticCurveTo(0, -20 * open, 24, 0); ctx.quadraticCurveTo(0, 20 * open, -24, 0); ctx.closePath();
    ctx.fillStyle = P_COL; ctx.shadowColor = P_COL; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
    ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 15 * open, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = CREAM; ctx.globalAlpha *= k; ctx.lineWidth = 7; ctx.lineCap = 'round';           // 眉头
    ctx.beginPath(); ctx.moveTo(ex - Math.sign(ex) * 30, -192 - 6 * k); ctx.lineTo(ex + Math.sign(ex) * 18, -186 + 14 * k); ctx.stroke(); ctx.restore();
  }
  ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.globalAlpha *= .8;                       // 嘴
  ctx.beginPath(); ctx.moveTo(-26, -96); ctx.quadraticCurveTo(0, -96 + lerp(14, -12, k), 26, -96); ctx.stroke();
  ctx.restore();
}
function sceneAlarm(t) {
  if (t < S3 - .2 || t > S4 + 2.2) return;
  const rew = E.io(prog(t, L(17) + .2, L(17) + 1.7)), A = 1 - sstep(L(17) + 1.5, L(17) + 1.8, t), here = t >= S3 + .2 ? 1 : 0;
  // 那只猫：先站在镜头前；烟雾报警器那段让到右边；看脸、翻手机那段缩到下面；倒带时变回小奶猫
  const right = E.io(prog(t, L(11) - .3, L(11) + .5)) * (1 - E.io(prog(t, L(12) - .3, L(12) + .5)));
  const low = E.io(prog(t, L(12) - .3, L(12) + .6));
  let x = lerp(BIGC.x, 760, right), y = lerp(BIGC.y, 1100, right), s = lerp(BIGC.s, 1.5, right);
  if (low > 0) { x = lerp(x, 230, low); y = lerp(y, 1230, low); s = lerp(s, 1.15, low); }
  if (rew > 0) { x = lerp(x, KIT.x, rew); y = lerp(y, KIT.y, rew); s = lerp(s, KIT.s, rew); }
  const alarmK = sstep(L(9) + .3, L(9) + 1.2, t) * (1 - .5 * sstep(L(12) - .3, L(12) + .5, t)) + .5 * sstep(L(16), L(16) + .6, t);
  if (A <= 0) return;
  warmth(.35 * here * (1 - low), x, y - 100, 420);
  fig(x, y, s, A * here, A_COL, { baby: rew, heart: 1, beat: .4 });
  alarm(x, chestY(y, s, rew), s * (1 - .45 * low), clamp(alarmK) * (1 - rew), t, A * here);
  // 过度激活
  const big1 = sstep(L(9) + .2, L(9) + .8, t) * (1 - sstep(L(10) - .3, L(10) + .2, t));
  typeText('过度激活', 540, 520, { ...big, size: 92, weight: 900, color: WARMC, glow: `rgba(${O_RGB},.55)`, glowBlur: 30 }, prog(t, L(9) + .2, L(9) + 1.0), big1);
  // 两个旋钮：回避型拧到最小，焦虑型拧到最大
  const kn = sstep(L(10) - .1, L(10) + .4, t) * (1 - sstep(L(11) - .4, L(11), t));
  knob(300, 600, 1 - E.io(prog(t, L(10) + .5, L(10) + 1.6)) * .95, '回避型：关小', COOL, kn);
  knob(780, 600, E.io(prog(t, L(10) + 2.2, L(10) + 3.4)), '焦虑型：开到最大', WARMC, kn);
  // 烟雾报警器：烤个面包，它也响
  const sm = sstep(L(11) - .2, L(11) + .4, t) * (1 - sstep(L(12) - .5, L(12), t));
  if (sm > 0) {
    const beep = t > L(11) + 3.0 ? (Math.sin((t - L(11) - 3.0) * TAU * 3) > 0 ? 1 : .25) : 0;
    ctx.save(); ctx.globalAlpha = sm; ctx.fillStyle = '#e9e4da'; ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 3;      // 天花板上的报警器
    ctx.beginPath(); ctx.ellipse(540, 470, 110, 34, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#cfc9be'; ctx.beginPath(); ctx.ellipse(540, 462, 70, 18, 0, 0, TAU); ctx.fill(); ctx.restore();
    seg(380, 438, 700, 438, 'rgba(236,230,218,.25)', 2, sm);
    glow(600, 476, 7, beep ? ALARM_RGB : '120,200,140', sm * (beep ? 1 : .7), beep ? 9 : 4);
    if (beep) { for (let i = 0; i < 3; i++) { const p = ((t * 2 + i / 3) % 1); ctx.save(); ctx.globalAlpha = sm * (1 - p) * beep; ctx.strokeStyle = `rgb(${ALARM_RGB})`; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(540, 470, 120 + 120 * p, PI * .15, PI * .85); ctx.stroke(); ctx.restore(); }
      text('哔！哔！哔！', 540, 640, { font: SANS, size: 54, weight: 900, align: 'center', color: '#ff8a6a', alpha: sm * beep, glow: `rgba(${ALARM_RGB},.6)`, blur: 16 }); }
    const tx = 300, ty = 1040;                                                                            // 烤面包机
    ctx.save(); ctx.globalAlpha = sm; ctx.fillStyle = '#20232d'; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3;
    const pop2 = E.outQuint(prog(t, L(11) + 2.3, L(11) + 2.7)), by = ty - 60 - 70 * pop2;
    ctx.fillStyle = '#e8b072'; ctx.beginPath(); ctx.roundRect(tx - 48, by - 46, 96, 92, [26, 26, 8, 8]); ctx.fill();          // 面包片
    ctx.fillStyle = '#20232d'; ctx.beginPath(); ctx.roundRect(tx - 110, ty - 70, 220, 130, 26); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx - 70, ty - 70); ctx.lineTo(tx + 70, ty - 70); ctx.stroke(); ctx.beginPath(); ctx.roundRect(tx + 88, ty - 30, 30, 12, 6); ctx.stroke(); ctx.restore();
    seg(140, ty + 60, 460, ty + 60, 'rgba(236,230,218,.28)', 2, sm);
    if (pop2 > 0) for (let i = 0; i < 3; i++) { const p = ((t * .6 + i / 3) % 1); ctx.save(); ctx.globalAlpha = sm * (1 - p) * .55; ctx.strokeStyle = '#c9c2b4'; ctx.lineWidth = 3;
      ctx.beginPath(); const sx = tx - 20 + i * 20, sy = by - 60 - p * 90; ctx.moveTo(sx, sy + 40); ctx.quadraticCurveTo(sx + 16 * Math.sin(t * 3 + i), sy + 20, sx, sy); ctx.stroke(); ctx.restore(); }
    text('烤个面包', tx, ty + 110, { font: SANS, size: 36, weight: 700, align: 'center', color: GOLD, alpha: sm * sstep(L(11) + 2.3, L(11) + 2.6, t) });
  }
  // 看一张脸慢慢变出表情：焦虑的人更早按下“变了”，也更容易看错
  const fa = sstep(L(12) - .1, L(12) + .5, t) * (1 - sstep(L(15) - .4, L(15) + .1, t));
  if (fa > 0) {
    const play = prog(t, L(12) + .8, L(14) + 1.2), k = sstep(.15, 1, play);
    catFace(540, 700, 170, k, fa);
    const TL = { x0: 220, x1: 860, y: 1000 };
    seg(TL.x0, TL.y, TL.x1, TL.y, 'rgba(236,230,218,.4)', 6, fa); seg(TL.x0, TL.y, lerp(TL.x0, TL.x1, play), TL.y, `rgba(${P_RGB},.9)`, 6, fa);
    glow(lerp(TL.x0, TL.x1, play), TL.y, 7, P_RGB, fa, 5);
    text('平静', TL.x0, TL.y + 44, { font: SANS, size: 30, weight: 700, align: 'center', color: DIM, alpha: fa });
    text('不高兴', TL.x1, TL.y + 44, { font: SANS, size: 30, weight: 700, align: 'center', color: DIM, alpha: fa });
    for (const [p0, lab, col, t0] of [[.3, '越焦虑：这里就觉得变了', WARMC, L(13) + .2], [.58, '其他人', CREAM, L(13) + 1.2]]) {
      const m = fa * sstep(t0, t0 + .3, t), mx = lerp(TL.x0, TL.x1, p0);
      if (m <= 0) continue;
      if (p0 < .4) { ctx.save(); ctx.globalAlpha = m; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(mx, TL.y - 14); ctx.lineTo(mx - 14, TL.y - 40); ctx.lineTo(mx + 14, TL.y - 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
      const above = p0 < .4;
      if (!above) { ctx.save(); ctx.globalAlpha = m; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(mx, TL.y + 14); ctx.lineTo(mx - 14, TL.y + 40); ctx.lineTo(mx + 14, TL.y + 40); ctx.closePath(); ctx.fill(); ctx.restore(); }
      text(lab, mx, above ? TL.y - 66 : TL.y + 66, { font: SANS, size: 32, weight: 900, align: above ? 'left' : 'center', color: col, alpha: m });
    }
    const wrong = fa * sstep(L(14) + .4, L(14) + .8, t);
    text('✗ 更容易看错', TL.x0, TL.y + 120, { font: SANS, size: 36, weight: 900, align: 'left', color: '#ff8f8f', alpha: wrong });
    text('判断得太快', TL.x0, TL.y + 168, { font: SANS, size: 30, weight: 700, align: 'left', color: DIM, alpha: fa * sstep(L(14) + 1.4, L(14) + 1.8, t) });
  }
  // 一直去翻对方的主页
  const sa = sstep(L(15) - .2, L(15) + .4, t) * (1 - sstep(L(17) - .1, L(17) + .4, t));
  if (sa > 0) {
    const px = 600, py = 790, pw = 400, ph = 620;
    phone(px, py, pw, ph, sa, '');
    circ(px - 120, py - ph / 2 + 100, 34, '#0b0c10', sa); ctx.save(); ctx.globalAlpha = sa; ctx.strokeStyle = P_COL; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px - 120, py - ph / 2 + 100, 34, 0, TAU); ctx.stroke(); ctx.restore();
    text('TA 的主页', px - 70, py - ph / 2 + 100, { font: SANS, size: 30, weight: 900, color: P_COL, alpha: sa });
    ctx.save(); ctx.beginPath(); ctx.rect(px - pw / 2 + 16, py - ph / 2 + 150, pw - 32, ph - 180); ctx.clip();
    const scroll = (t - L(15)) * 520 * (1 - .7 * sstep(L(16) + 1.0, L(16) + 1.6, t));
    for (let i = 0; i < 30; i++) { const yy = py - ph / 2 + 170 + i * 150 - (scroll % 1500 + 1500) % 1500;
      if (yy < py - ph / 2 + 100 || yy > py + ph / 2) continue;
      ctx.globalAlpha = sa; ctx.fillStyle = 'rgba(127,227,211,.12)'; ctx.beginPath(); ctx.roundRect(px - pw / 2 + 30, yy, pw - 60, 120, 16); ctx.fill();
      ctx.fillStyle = 'rgba(236,230,218,.3)'; ctx.fillRect(px - pw / 2 + 50, yy + 20, 140, 14); ctx.fillRect(px - pw / 2 + 50, yy + 46, 220, 14); }
    ctx.restore();
    const refresh = sstep(L(16), L(16) + .3, t);                                                         // 下拉刷新，再刷新
    if (refresh > 0) { ctx.save(); ctx.globalAlpha = sa * refresh; ctx.strokeStyle = WARMC; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(px, py - ph / 2 + 170, 22, t * 9, t * 9 + PI * 1.5); ctx.stroke(); ctx.restore(); }
    text('又刷新了一遍', px, py + ph / 2 + 50, { font: SANS, size: 32, weight: 700, align: 'center', color: GOLD, alpha: sa * refresh });
  }
}

// ======================================================================== ④ 怎么来的（S4 – S5）：回应时有时无
const KIT = { x: 700, y: 1170 - 30 * 1.0, s: 1.0 }, MOM = { x: 420, s: 1.6 }, ROOM = { floor: 1170, door: [110, 290, 740] };
function sceneOrigin(t) {
  if (t < L(17) + .2 || t > S5 + 1.6) return;
  const rk = prog(t, L(17) + .2, L(17) + 1.7);
  rewindFx(rk < 1 ? rk : 0);
  const born = sstep(L(17) + 1.5, L(17) + 1.8, t);
  if (born <= 0) return;
  typeText('小时候', 540, 500, { ...big, size: 70, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.4)`, glowBlur: 20 }, prog(t, L(17) + 1.4, L(17) + 2.0), 1 - sstep(L(19) - .3, L(19) + .2, t));
  const toA = E.io(prog(t, S5 - 1.6, S5 + .2));                                                         // 最后：小奶猫长成大猫，坐到左边
  const room = born * (1 - toA);
  floor(ROOM.floor, 60, 1020, room);
  const [d0, d1, dy] = ROOM.door;
  ctx.save(); ctx.globalAlpha = room; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(d0, ROOM.floor); ctx.lineTo(d0, dy); ctx.lineTo(d1, dy); ctx.lineTo(d1, ROOM.floor); ctx.stroke(); ctx.restore();
  // 妈妈一走（L18 + 1.0），回来（L18 + 3.0）；后来她头上的灯时亮时灭
  const mx = track([[0, MOM.x], [L(18) + 1.0, MOM.x], [L(18) + 1.9, 200], [L(18) + 2.8, 200], [L(18) + 3.7, MOM.x]])(t);
  const inside = sstep(L(18) + 1.5, L(18) + 1.9, t) * (1 - sstep(L(18) + 2.8, L(18) + 3.2, t));
  // 回应时有时无：一串固定的亮/灭（伪随机，但每次出片一样）
  const FLICK = [[L(19) + .4, 1], [L(19) + 1.0, 0], [L(19) + 1.3, 1], [L(19) + 1.5, 0], [L(19) + 2.2, 1], [L(19) + 3.0, 0], [L(20) + .3, 1], [L(20) + 1.8, 0]];
  let on = 1; for (const [tt, v] of FLICK) if (t >= tt) on = v;
  const lamp = room * sstep(L(19) + .1, L(19) + .4, t) * (1 - sstep(L(21) + .2, L(21) + .8, t));
  const momLit = t < L(19) ? 1 : on;
  fig(mx, ROOM.floor - 30 * MOM.s, MOM.s, room * (1 - inside) * (.45 + .55 * momLit), mixc('#6a6f7b', '#e8d9c0', momLit), { heart: .7 * momLit, arm: E.out(prog(t, L(18) + 3.8, L(18) + 4.2)) * (1 - sstep(L(18) + 5.0, L(18) + 5.3, t)) * .8, dir: 1, lift: 8, reach: 60 });
  if (lamp > 0) { glow(mx, ROOM.floor - 30 * MOM.s - 106 * MOM.s - 46, 10, '255,214,160', lamp * (on ? 1 : .12), on ? 7 : 2);
    text(on ? '有' : '无', mx + 50, ROOM.floor - 30 * MOM.s - 106 * MOM.s - 46, { font: SANS, size: 36, weight: 900, color: on ? GOLD : DIM, alpha: lamp }); }
  text('时有时无', 300, 640, { font: SERIF, size: 64, weight: 900, align: 'center', color: GOLD, alpha: born * win(t, L(19) + 1.0, L(20) + .2, .3, .3), glow: `rgba(${O_RGB},.4)`, blur: 16 });
  text('妈妈', mx, ROOM.floor + 50, { font: SANS, size: 36, weight: 700, align: 'center', color: '#e8d9c0', alpha: room * (1 - win(t, L(18) + .9, L(18) + 3.8, .15, .15)) });
  // 小奶猫：妈妈一走就大哭；回来了还在哭（很难哄好）；后来哭一声有人来、怎么哭都没人理；哭声越来越大
  const kx = lerp(KIT.x, 380, toA), ky = lerp(KIT.y, SY, toA), ks = lerp(KIT.s, STAGE.s, toA), kk = 1 - toA;
  const wail = win(t, L(18) + 1.6, L(18) + 5.4, .2, .4) + win(t, L(20) + .2, L(20) + .8, .1, .2) * .5 + win(t, L(20) + 2.2, L(21) + 4.0, .3, .3);
  const loud = lerp(40, 160, sstep(L(20) + 2.2, L(21) + 3.0, t));
  const handoff = t < S5 + .3 ? 1 : 0;                                                                  // S5 + .3 起交给 sceneHow
  fig(kx, ky, ks, born * handoff, A_COL, { baby: kk, heart: 1, beat: .3 + .4 * clamp(wail), arm: kk * win(t, L(18) + 3.6, L(18) + 5.2, .2, .2) * (.5 + .5 * Math.abs(Math.sin(t * 9))), dir: -1 });
  cry(kx - 30 * ks, ky - 66 * ks, -1, loud, t, born * clamp(wail) * kk, 2.4);
  text('宝宝', kx, ROOM.floor + 50, { font: SANS, size: 36, weight: 700, align: 'center', color: WARMC, alpha: room * sstep(L(18) - .2, L(18) + .3, t) });
  [[L(18) + 1.7, '大哭', 860, 860], [L(18) + 3.9, '还是哄不好', 860, 860]].forEach(([t0, s, x, y], i) =>
    text(s, x, y, { font: SANS, size: 44, weight: 900, align: 'center', color: '#ffcaa0', alpha: room * win(t, t0, i ? L(19) + .2 : L(18) + 3.6, .2, .3) }));
  text('哭一声就有人来', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: born * win(t, L(20) + .3, L(20) + 2.1, .2, .3) });
  text('怎么哭都没人理', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: DIM, alpha: born * win(t, L(20) + 2.3, L(21) - .1, .2, .3) });
  // 声音要够大，才会被看见：胸口长出警报
  const al = sstep(L(21) + 1.6, L(21) + 2.6, t);
  alarm(kx, chestY(ky, ks, kk), ks, al * (.6 + .4 * (1 - toA)), t, born * handoff);
  const bigA = sstep(L(21) + .3, L(21) + .8, t) * (1 - sstep(S5 - .6, S5 - .1, t));
  typeText('声音要够大，', 540, 520, { ...big, size: 64, weight: 900, color: CREAM }, prog(t, L(21) + .2, L(21) + .9), bigA);
  typeText('才会被看见', 540, 630, { ...big, size: 88, weight: 900, color: WARMC, glow: `rgba(${O_RGB},.55)`, glowBlur: 28 }, prog(t, L(21) + 1.0, L(21) + 1.8), bigA);
}

// ======================================================================== ⑤ 怎么办（S5 – 结束）
function sceneHow(t) {
  if (t < S5 - .6) return;
  const A = sstep(S5 - .5, S5 + .6, t), FS = STAGE.s, TY = STAGE.floor - 80 * FS;
  floor(STAGE.floor, 60, 1020, A);
  const ax = track([[0, 380], [L(30) - 1.5, 380], [L(30) - .3, 420]])(t);
  const px = track([[0, 760], [L(24) + 4.2, 760], [L(24) + 4.9, 720, E.out], [L(30) - 1.5, 720], [L(30) - .3, 680]])(t);
  const calm = E.io(prog(t, L(27) + 1.4, L(27) + 3.2)), warmUp = E.io(prog(t, L(28) + .5, L(29) + 2));
  const alarmK = (1 - calm) * (.75 + .25 * sstep(L(23), L(23) + .5, t)) * (1 - .35 * win(t, L(23) + .8, L(24) + 2.2, .4, .4));
  const pIn = sstep(S5 - .4, S5 + .8, t);
  const relax = sstep(L(28) + .2, L(28) + 1.6, t);
  thread(ax + 30 * FS, TY, px - 30 * FS, TY, A * pIn, relax > .5 || calm > .5 ? W_RGB : '220,215,205', lerp(8, 60, Math.max(relax, calm * .6)), 2.5 + 1.5 * warmUp);
  fig(px, SY, FS, A * pIn, mixc(P_COL, WARMC, warmUp * .5), { heart: .5 + .5 * sstep(L(24) + 4.4, L(24) + 5.0, t), beat: .2 });
  fig(ax, SY, FS, t >= S5 + .3 ? 1 : 0, A_COL, { heart: 1, beat: .3 + .2 * (1 - calm) });
  alarm(ax, chestY(SY, FS), FS, alarmK, t, A);
  // 标签
  const tagIn = sstep(L(22), L(22) + .5, t), drop = prog(t, L(29) + .6, L(29) + 2.2);
  if (tagIn > 0 && drop < 1) {
    const fall = E.in(drop), ty = 820 + 280 * fall, rot = -.9 * fall * fall;
    if (drop <= 0) seg(ax, 842, ax, SY - 106 * FS, `rgba(${O_RGB},.6)`, 2, tagIn);
    pill('焦虑型', ax - 40 * fall, ty, tagIn * (1 - sstep(.6, 1, drop)), { color: WARMC, stroke: `rgba(${O_RGB},.6)`, rot, size: 36 });
  }
  const dk = (t - (L(29) + .6)) / 1.6; if (dk > .5 && dk < 1.6) dust(ax - 60, 1000, 1.3, (dk - .5) * 1.2, WARMC, A, 9);
  pill('爱着焦虑型的你', px, 810, win(t, L(25), L(29), .4, .4), { color: P_COL, stroke: `rgba(${P_RGB},.6)`, size: 34 });
  // 试探 → 划掉；直接说
  const test = win(t, L(24) + .2, L(24) + 2.4, .25, .4);
  if (test > 0) { say('你是不是不爱我了？', 400, 700, test, '#ff9f8a', 38);
    const strike = E.out(prog(t, L(24) + 1.6, L(24) + 2.0));
    if (strike > 0) seg(400 - 190, 700, 400 - 190 + 380 * strike, 700, RED, 6, test); }
  const msgK = E.io(prog(t, L(24) + 2.4, L(24) + 3.0)), fly = E.io(prog(t, L(24) + 3.8, L(24) + 4.6)), mA = A * msgK * (1 - sstep(L(25) - .1, L(25) + .4, t));
  if (mA > 0) { const bx = lerp(470, 640, fly), by = lerp(700, 720, fly) - 30 * Math.sin(PI * fly);
    ctx.save(); ctx.translate(bx, by); ctx.scale(lerp(.2, 1, msgK), lerp(.2, 1, msgK)); say('我有点不安，能抱我一下吗？', 0, 0, mA, WARMC, 38); ctx.restore(); }
  // 十句“我爱你” vs 一个确定的回应
  if (t > L(26) && t < L(27) + .5) for (let i = 0; i < 10; i++) {
    const r = mulberry(5100 + i), t0 = L(26) + .2 + i * .12, p = prog(t, t0, t0 + 1.4);
    if (p <= 0 || p >= 1) continue;
    const bx = lerp(px - 30, ax + 40, p) + (r() - .5) * 220, by = 900 - 300 * r() - 90 * Math.sin(PI * p);
    text('我爱你', bx, by, { font: SANS, size: 32, weight: 700, align: 'center', color: P_COL, alpha: A * Math.sin(PI * p) * (1 - sstep(L(26) + 2.2, L(26) + 2.8, t)) });
  }
  const sure = E.io(prog(t, L(27) + .3, L(27) + .9)), sureFly = E.io(prog(t, L(27) + 1.6, L(27) + 2.4)), sA = A * sure * (1 - sstep(L(28) + 1.2, L(28) + 1.8, t));
  if (sA > 0) { const bx = lerp(640, 470, sureFly), by = lerp(680, 700, sureFly);
    ctx.save(); ctx.translate(bx, by); ctx.scale(lerp(.2, 1, sure), lerp(.2, 1, sure)); say('我今天很忙，晚上十点给你打电话。', 0, 0, sA, P_COL, 36); ctx.restore(); }
  const clk = A * win(t, L(27) + 2.4, L(28) + 3.0, .3, .5);
  if (clk > 0) { ctx.save(); ctx.globalAlpha = clk; ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(560, 520, 46, 0, TAU); ctx.stroke(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(560, 520); ctx.lineTo(560, 488); ctx.moveTo(560, 520); ctx.lineTo(536, 507); ctx.stroke(); ctx.restore();
    text('22:00', 560, 600, { font: SANS, size: 36, weight: 900, align: 'center', color: GOLD, alpha: clk }); }
  text('一个确定的回应 ＞ 十句「我爱你」', 540, 520, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: A * win(t, L(26) + 1.4, L(27) + .2, .3, .3) });
  text('不是一辈子的标签', 540, 620, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(L(29) + .3, L(29) + .8, t) * (1 - sstep(L(30) - .2, L(30) + .3, t)) });
  if (warmUp > 0) { warmth(warmUp * .9, (ax + px) / 2, 980, 600); for (let i = 0; i < 16; i++) { const r = mulberry(2900 + i), p = ((t - L(28)) * (.12 + .1 * r()) + r()) % 1;
    glow(ax - 60 + r() * (px - ax + 120), 1060 - p * 420, 1.5 + 2 * r(), O_RGB, warmUp * (1 - p) * .8, 3); } }
  const fin = sstep(L(30) - .1, L(30) + .4, t);
  typeText('不是太黏人，', 540, 540, { ...big, size: 64, weight: 900, color: CREAM }, prog(t, L(30), L(30) + .8), fin);
  typeText('只是太怕失去', 540, 660, { ...big, size: 88, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.55)`, glowBlur: 34 }, prog(t, L(30) + 1.2, L(30) + 2.4), fin);
  const Q = sstep(L(31) - .1, L(31) + .4, t);
  typeText('评论区说说：', 540, 1230, { size: 42, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, L(31), L(31) + .5), Q);
  typeText('你是焦虑型，还是正在爱着一个焦虑型？', 540, 1310, { size: 48, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, L(31) + .4, L(31) + 1.6), Q);
}

// ======================================================================== 世界层
const STAR_A = t => .12 + .12 * sstep(L(2) + 1.6, L(2) + 3.4, t) * (1 - sstep(L(3), L(3) + 1, t)) + .1 * sstep(S5, S5 + 3, t) + .25 * sstep(L(28), L(30), t);
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneOpen(t); sceneTitle(t); sceneRulers(t); sceneAlarm(t); sceneOrigin(t); sceneHow(t);
}
function SAMPLES(T) {
  const many = [[L(4) + .3, L(4) + 1.25]];
  const more = [[S3 - 1.5, S3 + .3], [L(18) + .9, L(18) + 2.0], [L(18) + 2.7, L(18) + 3.8], [L(15), L(16) + 1.6]];
  const fast = [[L(4), L(4) + 1.4], [S2 - .2, S2 + 1.2], [L(6), L(6) + 1.1], [L(8), L(8) + 1.6], [L(11) - .4, L(11) + .6], [L(12) - .4, L(12) + .7], [L(17), L(17) + 1.9],
    [S5 - 1.6, S5 + 1], [L(24) + 3.7, L(24) + 4.7], [L(27) + 1.5, L(27) + 2.5], [L(29) + .5, L(29) + 2.3]];
  const in_ = r => r.some(([a, b]) => T > a && T < b);
  return in_(many) ? 14 : in_(more) ? 8 : in_(fast) ? 4 : 3;
}
function BLOOM_K(T) { return .4 + .15 * win(T, L(4) + .6, L(4) + 2.4, .3, .8) + .12 * win(T, L(9), L(12), .4, .5) + .08 * win(T, L(21) + 1.6, S5, .3, .5) + .16 * win(T, L(28), TOTAL, 1, 1); }
function OVER(T) {
  stamp('1998', 'Brennan, Clark & Shaver', L(5), L(8) - .1, T);
  stamp('1987 · 1997', 'Hazan & Shaver · Mickelson 等', L(8), S3 - .1, T);
  stamp('2003', 'Mikulincer, Shaver & Pereg', L(9), L(11) - .2, T);
  stamp('2006', 'Fraley, Niedenthal 等', L(12), L(15) - .2, T);
  stamp('2013', 'Marshall 等', L(15), L(17) - .1, T);
  stamp('1978 · 1994', 'Ainsworth 等 · Cassidy & Berlin', L(18), L(21) - .2, T);
  stamp('2014', 'Simpson & Overall', L(28), L(29) - .1, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(4701);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .3 }; });
}

// ======================================================================== 音效提示表（A 小调 → C 大调）
const NOTE = { E4: 329.63, A4: 440.0, C5: 523.25, D5: 587.33, E5: 659.26, G5: 783.99, A5: 880.0, B5: 987.77, C6: 1046.5, E6: 1318.5 };
const A_SHIM = [NOTE.A5, NOTE.C6, NOTE.E5, NOTE.E6, NOTE.A4], C_SHIM = [NOTE.G5, NOTE.C6, NOTE.E5, NOTE.E6, NOTE.C5];
const A_SWELL = [110.0, 164.81, 220.0, 261.63, 329.63], C_SWELL = [130.81, 196.0, 261.63, 329.63, 392.0];
function CUES() {
  const c = [];
  // ① 打字、发送、已读、正在输入；念头；“嗯。”；一整晚；它走进来；推进胸口
  for (let i = 0; i < 3; i++) c.push([L(0) + .15 + i * .22, 'click', { gain: .03 }]);
  c.push([L(0) + 1.0, 'swish', { dur: .35, gain: .05 }], [L(0) + 2.0, 'tick', { gain: .04 }]);
  for (const tt of [L(1) + 1.9, L(1) + 2.7, L(1) + 3.3, L(2) + 1.6, L(2) + 2.2, L(2) + 2.8]) c.push([tt, 'tick', { gain: .035 }]);
  c.push([L(2) + .9, 'ding', { f: 1318.5, gain: .07, pan: .3 }], [L(2) + 1.6, 'air', { dur: 4, hum: 110, gain: .05 }]);
  c.push([L(3) + .2, 'swish', { dur: .8, gain: .05 }]);
  c.push([L(4) + .1, 'riser', { dur: 1.0, gain: .12 }], [L(4) + 1.05, 'swell', { dur: .9, f: A_SWELL, gain: .1 }], [L(4) + 1.1, 'shimmer', { f: A_SHIM, gain: .1 }]);
  // ② 尺子；点往右跑；警报似的脉冲；分成十只
  c.push([S2, 'whoosh', { dur: .8, gain: .1 }]);
  for (let i = 0; i < 8; i++) c.push([S2 + 1.0 + i * .15, 'tick', { gain: .025 }]);
  c.push([L(6) + .1, 'bar', { f0: 300, f1: 700, dur: .9, gain: .05 }], [L(6) + 1.0, 'tink', { f: NOTE.E6, gain: .05 }]);
  c.push([L(7) + 1.0, 'tink', { f: NOTE.A5, gain: .04 }], [L(7) + 1.9, 'tink', { f: NOTE.C6, gain: .04 }]);
  c.push([L(8) + .2, 'swish', { dur: .7, gain: .07 }], [L(8) + 2.0, 'chord', { f: [NOTE.A4, NOTE.C5, NOTE.E5], gain: .06 }]);
  // ③ 走到镜头前；警报；旋钮；烤面包、哔哔；看脸；刷手机
  c.push([S3 - 1.3, 'whoosh', { dur: 1.2, gain: .08 }], [L(9) + .3, 'drone', { dur: 2.2, gain: .04 }]);
  c.push([L(10) + .5, 'bar', { f0: 600, f1: 260, dur: 1.0, gain: .04 }], [L(10) + 2.2, 'bar', { f0: 260, f1: 900, dur: 1.2, gain: .05 }]);
  c.push([L(11) + 2.3, 'thunk', { gain: .06 }]);
  for (let i = 0; i < 6; i++) c.push([L(11) + 3.0 + i / 3, 'ding', { f: 2093, gain: .05, pan: 0 }]);
  c.push([L(13) + .2, 'tink', { f: NOTE.E6, gain: .05 }], [L(13) + 1.2, 'tink', { f: NOTE.A5, gain: .04 }], [L(14) + .4, 'thud', { gain: .06 }]);
  for (let i = 0; i < 10; i++) c.push([L(15) + .2 + i * .4, 'swish', { dur: .25, gain: .025 }]);
  c.push([L(16), 'click', { gain: .04 }], [L(16) + 1.2, 'click', { gain: .04 }]);
  // ④ 倒带；妈妈走、回来；灯忽亮忽灭；哭声越来越大
  c.push([L(17) + .2, 'revcym', { dur: 1.5, gain: .12 }], [L(17) + 1.6, 'thud', { gain: .08 }]);
  c.push([L(18) + 1.0, 'page', { gain: .05 }], [L(18) + 2.8, 'page', { gain: .05 }]);
  for (const tt of [L(19) + .4, L(19) + 1.3, L(19) + 2.2, L(20) + .3]) c.push([tt, 'click', { gain: .04 }]);
  c.push([L(20) + .5, 'tink', { f: NOTE.C6, gain: .05 }], [L(21) + 1.6, 'riser', { dur: 1.2, gain: .06 }]);
  // ⑤ 划掉试探；消息飞过去；十句我爱你；确定的回应；警报停下；标签掉了；变暖
  c.push([L(24) + 1.6, 'swish', { dur: .3, gain: .06 }], [L(24) + 3.8, 'whoosh', { dur: .9, gain: .05 }], [L(24) + 4.6, 'ding', { f: 1567.98, gain: .07, pan: .3 }]);
  for (let i = 0; i < 10; i++) c.push([L(26) + .2 + i * .12, 'tink', { f: [NOTE.E5, NOTE.G5, NOTE.A5, NOTE.C6][i % 4], gain: .02 }]);
  c.push([L(27) + 1.6, 'whoosh', { dur: .9, gain: .05 }], [L(27) + 2.4, 'ding', { f: 1318.5, gain: .07, pan: -.3 }], [L(27) + 3.0, 'swell', { dur: 1.6, f: C_SWELL, gain: .07 }]);
  c.push([L(29) + .6, 'tick', { gain: .05 }], [L(29) + 1.9, 'dust', { dur: 1.0, gain: .06 }]);
  c.push([L(28) + .5, 'swell', { dur: 3.0, f: C_SWELL, gain: .06 }], [L(30), 'shimmer', { f: C_SHIM, gain: .12 }], [L(31), 'tink', { f: NOTE.C6, gain: .05 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
