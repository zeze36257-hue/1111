// ======================================================================== No.48 焦虑型配回避型：为什么越追，越跑（讲课格式第四期）
// 恋爱心理系列第三期：No.46 讲回避型（躲起来的那只），No.47 讲焦虑型（一直去敲门的那只），这一期讲它们俩在一起。
// 结构：问题 → 为什么在一起（三百多对恋人；对方的样子印证了自己的担心）→ 一个圈（要求—退缩）→ 分不开（三年后还在一起）→ 怎么办。
// 一镜到底，主角是一个“圈”：地面卷成一个圈，两只猫一个追一个跑 → 镜头升上去，圈中间是题目 → 圈缩成三百多对恋人里的一对 →
//   放大回那一对，摊平成地面 → 地面又卷成圈，越转越快、越磨越深 → 停下来看见这个圈，走出来，圈碎成光。
// 角色都是黑猫：焦虑型 = 暖橙（No.47 那只），回避型 = 冷蓝（No.46 那只）——品牌黑猫那双异色瞳的两种颜色。
// 没有片头（meta.json "intro": false）：第一帧就是封面“越追，越跑”。
// 时间：画面里的时间都写成 L(i) + 秒数（第 i 句开始之后），时间轴由 layout.py 按配音的真实长度排出来。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 108.8;
const SECTIONS = [['问题', 0.0, 19.2], ['为什么在一起', 19.2, 41.6], ['一个圈', 41.6, 67.2], ['分不开', 67.2, 83.2], ['怎么办', 83.2, 108.8]];
const LINES = [
  [0.15, 3.14, '你发了三条消息，他一条也没回；'],
  [3.44, 5.91, '你越问「你怎么了」，他越不想说话；'],
  [6.21, 10.02, '他只是想静一静，你却觉得：他要走了。'],
  [10.47, 12.47, '一个越追，一个越跑。'],
  [12.97, 16.80, '今天，我们一起来聊聊：焦虑型配回避型。'],
  [19.50, 22.17, '有一项研究，调查了三百多对恋人：'],
  [22.37, 26.04, '两个都焦虑、两个都回避的，一对也没有。'],
  [26.44, 30.04, '一种解释是：对方的样子，正好印证了自己的担心。'],
  [30.34, 33.96, '焦虑型想：「你看，他果然会走。」'],
  [34.16, 38.05, '回避型想：「你看，靠太近，就会被缠住。」'],
  [41.90, 43.74, '于是，就有了这个圈：'],
  [43.94, 50.29, '焦虑型心里的警报一响，就去追：发消息、追问、要一个答案；'],
  [50.54, 56.55, '回避型被追得喘不过气，就往后退：不回、沉默、冷下来。'],
  [56.90, 60.14, '心理学家把它叫作「要求—退缩」。'],
  [60.44, 64.71, '研究发现：这样的圈转得越多，两个人都越不满意。'],
  [67.50, 71.24, '可奇怪的是，这样的两个人，常常分不开。'],
  [71.54, 73.36, '那项研究三年后又回访：'],
  [73.46, 80.37, '回避型男生、焦虑型女生的恋爱，两个人打分都不高，却意外地稳定。'],
  [83.50, 85.83, '想走出这个圈，先要看见它。'],
  [86.08, 89.88, '下次又绕起来，说一句：「我们又在转圈了。」'],
  [90.23, 93.59, '焦虑型，先别追问，直接说你需要什么；'],
  [93.79, 97.33, '回避型，想退的时候，说好什么时候回来。'],
  [97.68, 100.51, '要对付的，是这个圈，不是对方。'],
];
const BIGLINES = [
  [101.11, 103.27, '一个怕被丢下，一个怕被困住。'],
  [103.97, 107.30, '评论区说说：你是追的那个，还是跑的那个？'],
];
// 第 i 句（按时间排，含大字）开始的时间：L(i)；结束：LE(i)
const ALL_LINES = [...LINES, ...BIGLINES].sort((a, b) => a[0] - b[0]);
const L = i => ALL_LINES[i][0], LE = i => ALL_LINES[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const SERIES = '黑猫不说话 · 心理学 No.48';
const S2 = S['为什么在一起'], S3 = S['一个圈'], S4 = S['分不开'], S5 = S['怎么办'];

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
const FLOOR = 1100;
// 圈：同一条线，一会儿是地面（直线），一会儿卷成一个圈（椭圆：侧着看，或者从上往下看）。
// 地面上的位置用 u 表示（x = 60 + 960u）；地面上 1.5 个单位卷起来正好一整圈，uRef 那一点卷到圈的正前方。
// 在圈上往前跑 = 角度 θ 变小（在正前方是从左往右跑）。
const V1 = { cx: 540, cy: 960, rx: 330, ry: 120 }, VT = { cx: 540, cy: 900, rx: 340, ry: 340 };
const V3 = { cx: 540, cy: 975, rx: 360, ry: 150 }, V5 = { cx: 540, cy: 790, rx: 320, ry: 100 };
const lerpV = (a, b, k) => ({ cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), rx: lerp(a.rx, b.rx, k), ry: lerp(a.ry, b.ry, k) });
const ringPt = (th, V) => [V.cx + V.rx * Math.cos(th), V.cy + V.ry * Math.sin(th)];
const KU = 4 * PI / 3, uOf = x => (x - 60) / 960, thOf = (u, uRef) => PI / 2 - KU * (u - uRef);
const depthS = th => lerp(.74, 1.1, (Math.sin(th) + 1) / 2);                                          // 圈后面的小一点，前面的大一点
function curvePt(u, uRef, m, V) { const [rx, ry] = ringPt(thOf(u, uRef), V); return [lerp(60 + 960 * u, rx, m), lerp(FLOOR, ry, m)]; }
function ring(V, a, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = o.col || 'rgba(236,230,218,.32)'; ctx.lineWidth = o.lw || 2;
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur || 18; }
  if (o.dash) { ctx.setLineDash(o.dash); ctx.lineDashOffset = o.off || 0; }
  ctx.beginPath(); ctx.ellipse(V.cx, V.cy, V.rx, V.ry, 0, 0, TAU); ctx.stroke(); ctx.restore();
}
function curve(uRef, m, V, a, o = {}) {                                                               // 地面 ↔ 圈
  if (a <= 0) return;
  if (m >= .999) return ring(V, a, o);
  const k = sstep(0, .25, m), u0 = lerp(0, uRef - .75, k), u1 = lerp(1, uRef + .75, k), n = 180;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = o.col || 'rgba(236,230,218,.3)'; ctx.lineWidth = o.lw || 2; ctx.lineJoin = 'round';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur || 18; }
  ctx.beginPath();
  for (let i = 0; i <= n; i++) { const [x, y] = curvePt(lerp(u0, u1, i / n), uRef, m, V); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
}
function comet(th, V, rgb, a, r = 9) {                                                                 // 从上往下看：一颗拖着尾巴的光
  if (a <= 0) return;
  for (let i = 14; i >= 0; i--) { const [x, y] = ringPt(th + i * .07, V); glow(x, y, r * (1 - i / 17), rgb, a * (1 - i / 15) * (i ? .5 : 1), i ? 2 : 5); }
}
function ringArrow(th, V, a, col) {                                                                    // 圈上的箭头（跑的方向）
  if (a <= 0) return;
  const [x, y] = ringPt(th, V), dx = V.rx * Math.sin(th), dy = -V.ry * Math.cos(th), l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, z = 20 * depthS(th);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(x - ux * z - uy * z * .7, y - uy * z + ux * z * .7); ctx.lineTo(x, y); ctx.lineTo(x - ux * z + uy * z * .7, y - uy * z - ux * z * .7); ctx.stroke(); ctx.restore();
}
// 两只猫在圈上跑：每只猫的速度（弧度/秒）是一条关键帧轨道，INIT 里积分成“跑过的角度”
let PHA = null, PHV = null; const PH_DT = 1 / 120;
function phaseTable(sp) { const n = Math.ceil((TOTAL + 1) / PH_DT) + 2, a = new Float64Array(n); for (let i = 1; i < n; i++) a[i] = a[i - 1] + sp((i - .5) * PH_DT) * PH_DT; return a; }
function phaseAt(a, t) { const f = clamp(t, 0, TOTAL) / PH_DT, i = Math.floor(f); return lerp(a[i], a[Math.min(a.length - 1, i + 1)], f - i); }
const speedOf = (a, t) => (phaseAt(a, t + .02) - phaseAt(a, t - .02)) / .04;
function SPEEDS() {
  const common = () => [[S4 + .3, 2.2], [L(16), 2.2], [L(16) + .4, 5.5], [L(17) - .4, 5.5], [L(17) + .4, .9], [L(17) + 4.6, .9], [S5, 1.6], [L(18) + .8, 0],
    [L(19) + .1, 0], [L(19) + .6, 1.2], [L(19) + 1.5, 1.2], [L(19) + 2.2, 0]];
  const open = [[0, 0], [L(3) + .2, 0], [L(3) + 1.3, 1.6], [S2 + 1.2, 1.6], [S2 + 1.8, 0]];
  return {
    A: track([...open, [L(11) + .6, 0], [L(11) + 1.8, .35], [L(12) + .3, .35], [L(12) + 1.3, 1.5], [L(14) + .2, 1.5], [L(14) + 3.2, 2.8], ...common()]),
    V: track([...open, [L(11) + .8, 0], [L(11) + 2.0, .5], [L(12) + .2, .5], [L(12) + .9, 1.9], [L(12) + 2.6, 1.5], [L(14) + .2, 1.5], [L(14) + 3.2, 2.8], ...common()]),
  };
}
// 跑起来的时候一颠一颠的
const bob = (ph, sp, s) => -Math.abs(Math.sin(ph * 3.2)) * 9 * s * clamp(sp / 1.4);
function catOn(x, feet, s, a, col, o = {}) { fig(x, feet - 30 * s, s, a, col, o); }
function heartShape(x, y, r) {
  ctx.beginPath(); ctx.moveTo(x, y + .9 * r);
  ctx.bezierCurveTo(x - .1 * r, y + .8 * r, x - r, y + .3 * r, x - r, y - .25 * r); ctx.bezierCurveTo(x - r, y - .75 * r, x - .45 * r, y - r, x, y - .55 * r);
  ctx.bezierCurveTo(x + .45 * r, y - r, x + r, y - .75 * r, x + r, y - .25 * r); ctx.bezierCurveTo(x + r, y + .3 * r, x + .1 * r, y + .8 * r, x, y + .9 * r); ctx.closePath();
}
function meter(x, y, r, fill, col, rgb, a) {                                                          // 满意度：一颗心，里面的光越来越少
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; heartShape(x, y, r); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.stroke();
  ctx.clip(); ctx.shadowBlur = 0; const top = y + .9 * r - fill * 1.8 * r;
  ctx.fillStyle = `rgba(${rgb},.75)`; ctx.fillRect(x - r, top, 2 * r, y + r - top); ctx.restore();
}
function seal(x, y, k, a, col = '#ff9a7a') {                                                         // 盖章：印证
  const al = a * sstep(0, .25, k); if (al <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.2); const sc = lerp(1.9, 1, E.outQuint(k)); ctx.scale(sc, sc); ctx.globalAlpha *= al;
  ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 41, 0, TAU); ctx.stroke();
  text('印证', 0, 2, { font: SERIF, size: 32, weight: 900, align: 'center', color: col });
  ctx.restore();
}
function coil(x, y, s, k, a, front) {                                                                 // 线一圈一圈缠在身上（front：只画前面那半圈）
  if (a <= 0 || k <= 0) return;
  ctx.save(); ctx.globalAlpha *= a * (front ? 1 : .45); ctx.strokeStyle = `rgb(${W_RGB})`; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${W_RGB},.9)`; ctx.shadowBlur = 8;
  for (let i = 0; i < 3; i++) {
    const kk = clamp(k * 3 - i); if (kk <= 0) continue;
    const cy = y + s * (14 - i * 22), rx = s * (44 - i * 3), ry = s * 8;
    ctx.beginPath(); front ? ctx.ellipse(x, cy, rx, ry, -.08, 0, PI * kk) : ctx.ellipse(x, cy, rx, ry, -.08, PI, PI + PI * kk); ctx.stroke();
  }
  ctx.restore();
}
function titleText(parts, x, y, size, a, blur = 0) {                                                  // 几种颜色拼成一行
  if (a <= 0) return;
  font(size, 900, SERIF); const ws = parts.map(([s]) => ctx.measureText(s).width); let cx = x - ws.reduce((p, q) => p + q, 0) / 2;
  parts.forEach(([s, col, gl], i) => { text(s, cx, y, { size, weight: 900, color: col, alpha: a, glow: gl, blur: 34, filter: blur > .3 ? `blur(${blur.toFixed(1)}px)` : undefined }); cx += ws[i]; });
}
function badge(n, x, y, a) {                                                                          // 未读消息的小红点
  if (a <= 0 || n <= 0) return;
  circ(x, y, 22, RED, a); text(String(n), x, y + 1, { font: SANS, size: 26, weight: 900, align: 'center', color: '#fff', alpha: a });
}
function myBubble(s, x, y, a, size = 30) {                                                            // 自己发出去的消息（橙色，靠右）
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 40, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(242,161,74,.92)'; ctx.beginPath(); ctx.roundRect(x - w, y - h / 2, w, h, 18); ctx.fill(); ctx.restore();
  text(s, x - w / 2, y + 1, { font: SANS, size, weight: 700, align: 'center', color: '#1a1208', alpha: a });
}

// ======================================================================== ① 问题（0 – S2）：三条消息，一条也没回；一个越追，一个越跑 → 地面卷成一个圈 → 题目
const CELL = { x: 140 + 13 * 800 / 21, y: 800 + 6 * 440 / 15, r: 8 };                                  // ② 里那一格（这一对就是开头那两只）
const MSGS = [[L(0) + .4, '在吗？'], [L(0) + 1.0, '怎么不回我'], [L(0) + 1.6, '？？'], [L(1) + .5, '你怎么了？']];
function sceneOpen(t) {
  if (t > S2 + 1.0) return;
  const s0 = 1.6;
  const ax = track([[0, 330], [L(1) + .2, 330], [L(1) + 1.2, 420]])(t), vx = track([[0, 760], [L(1) + .7, 760], [L(1) + 1.7, 840]])(t);
  const uRef = (uOf(420) + uOf(840)) / 2, m = E.io(prog(t, L(3) + .1, L(3) + 1.3)), tilt = E.io(prog(t, L(4) + .2, L(4) + 1.6));
  const V = lerpV(V1, VT, tilt), catK = 1 - E.io(prog(t, L(4) + .3, L(4) + 1.2));
  const phA = phaseAt(PHA, t), phV = phaseAt(PHV, t), spd = speedOf(PHA, t);
  const shrink = E.io(prog(t, S2 - .3, S2 + .9));
  ctx.save();
  if (shrink > 0) { const sc = lerp(1, CELL.r / VT.rx, shrink); ctx.translate(lerp(VT.cx, CELL.x, shrink), lerp(VT.cy, CELL.y, shrink)); ctx.scale(sc, sc); ctx.translate(-VT.cx, -VT.cy); }
  // 夜里一个人等消息；他退后时身边冷下来
  chill(.35 * sstep(L(1) + .7, L(1) + 1.7, t) * (1 - m), vx, 900, 360);
  const ringA = 1 - sstep(S2 + .5, S2 + .9, t);
  curve(uRef, m, V, ringA, { col: `rgba(236,230,218,${lerp(.3, .45, tilt)})`, lw: lerp(2, 3, tilt), glow: tilt > 0 ? `rgba(${O_RGB},${.5 * tilt})` : undefined });
  // 两只猫：先站在地上；跑起来以后沿着地面 / 圈往前跑；镜头升上去时缩成两颗光
  const cats = [[uOf(ax) + phA / KU, A_COL, A_RGB, phA, 0], [uOf(vx) + phV / KU, V_COL, V_RGB, phV, 1]].map(([u, col, rgb, ph, id]) => {
    const [x, feet] = curvePt(u, uRef, m, V), th = thOf(u, uRef), s = s0 * lerp(1, depthS(th), m) * lerp(1, .7, tilt);
    return { x, feet: feet + bob(ph, spd, s), s, col, rgb, th, id, depth: m > .5 ? Math.sin(th) : id };
  }).sort((p, q) => p.depth - q.depth);
  const worry = sstep(L(2) + 2.2, L(2) + 2.8, t);
  for (const c of cats) {
    if (catK > 0) {
      if (c.id === 1) frost(c.x, c.feet - 80 * c.s, 110 * c.s, .5 * sstep(L(1) + .8, L(1) + 1.8, t) * catK * (1 - m), t, 3);
      catOn(c.x, c.feet, c.s * lerp(.15, 1, catK), catK, c.col, { heart: c.id ? .35 : .9, beat: c.id ? 0 : .3 + .5 * worry * Math.max(0, Math.sin(t * TAU * 2.2)) });
      if (c.id === 0) alarm(c.x, chestY(c.feet - 30 * c.s, c.s), c.s, .55 * worry * catK, t, 1);
    }
    comet(c.th, V, c.rgb, (1 - catK) * ringA, 10);
  }
  ctx.restore();
  // 封面（第一帧）
  const hook = 1 - sstep(L(1) + 1.2, L(1) + 1.7, t);
  if (hook > 0) {
    text('越追，', 540, 440, { size: 120, weight: 900, align: 'center', color: WARMC, alpha: hook, glow: `rgba(${O_RGB},.5)`, blur: 34 });
    text('越跑', 540, 590, { size: 150, weight: 900, align: 'center', color: V_LT, alpha: hook, glow: 'rgba(120,170,255,.45)', blur: 40 });
  }
  // 三条消息，一条也没回；又问了一句“你怎么了？”
  const msgA = 1 - sstep(L(2) + .1, L(2) + .6, t);
  let unread = 0;
  MSGS.forEach(([t0, s], i) => {
    if (t < t0) return; unread++;
    const later = MSGS.slice(i + 1).reduce((k, [t1]) => k + E.out(prog(t, t1, t1 + .3)), 0), k = E.out(prog(t, t0, t0 + .3));
    myBubble(s, 680, 960 - 80 * later + 20 * (1 - k), msgA * k, 30);
  });
  badge(unread, vx + 44, 880, msgA);
  // 他：想静一静；你：他要走了
  thought('……', 860, 770, win(t, L(1) + 1.6, L(2) + .4, .25, .3), 30, V_LT);
  thought('想静一静', 850, 760, win(t, L(2) + .4, L(3) + .4, .3, .3), 32, V_LT);
  thought('他要走了…', 380, 760, win(t, L(2) + 2.3, L(3) + .4, .25, .3), 32, WARMC);
  // 题目：在圈中间
  const t0 = L(4) + 1.0, e = E.outExpo(prog(t, t0, t0 + 1.2)), ta = sstep(t0, t0 + .3, t) * (1 - sstep(S2 - .5, S2 - .1, t));
  if (ta > 0) {
    warmth(.5 * ta, 540, 900, 520);
    seriesTag(770, ta * sstep(t0 + .4, t0 + 1.0, t));
    ctx.save(); ctx.translate(540, 885); const sc = 1.2 - .2 * e; ctx.scale(sc, sc);
    titleText([['焦虑型', WARMC, `rgba(${O_RGB},.6)`], ['配', CREAM, 'rgba(255,225,190,.3)'], ['回避型', V_LT, 'rgba(120,170,255,.55)']], 0, 0, 86, ta, (1 - e) * 14);
    ctx.restore();
    typeText('为什么越追，越跑', 540, 1010, { size: 46, weight: 700, font: SERIF, color: GOLD, align: 'center', spread: 4, glow: `rgba(${O_RGB},.35)`, glowBlur: 14 }, prog(t, t0 + .9, t0 + 2.0), ta);
  }
}

// ======================================================================== ② 为什么在一起（S2 – S3）：三百多对恋人；两个都焦虑、两个都回避的一对也没有
const GRID = { cols: 22, rows: 16, x0: 140, x1: 940, y0: 800, y1: 1240 };
let PAIRS = [];
const TYPE_RGB = ['200,196,188', A_RGB, V_RGB];
function pairRing(x, y, r, th, ta, tb, a, dot = 4.2, ringA = .25, thB = th + PI) {                                   // 一对恋人：一个小圈，两颗光
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a * ringA; ctx.strokeStyle = CREAM; ctx.lineWidth = Math.min(3, Math.max(1, r * .12)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
  glow(x + r * Math.cos(th), y + r * Math.sin(th), dot, TYPE_RGB[ta], a, 3);
  glow(x + r * Math.cos(thB), y + r * Math.sin(thB), dot, TYPE_RGB[tb], a, 3);
}
// 那一对：圈越转越慢，停在 .8π / .2π（正好是地面上两只猫的位置）
function specialTh(t, T1) { const w = 1.6, D = 1.2, tau = T1 - t; return .8 * PI + (tau >= D ? w * D / 3 + w * (tau - D) : tau > 0 ? (w * D / 3) * (1 - E.out(1 - tau / D)) : 0); }
function sceneWhy(t) {
  if (t < S2 + .5 || t > S3 + 1.6) return;
  const z0 = L(7) - .1, zk = E.io(prog(t, z0, z0 + 1.1)), z = Math.exp(Math.log(VT.rx / CELL.r) * zk);
  // 网格：每一格是一对恋人
  const gA = 1 - sstep(z0 + .3, z0 + .9, t);
  if (gA > 0) {
    ctx.save(); ctx.translate(lerp(CELL.x, VT.cx, zk), lerp(CELL.y, VT.cy, zk)); ctx.scale(z, z); ctx.translate(-CELL.x, -CELL.y);
    const scan = prog(t, L(6) + .4, L(6) + 2.0), scanY = lerp(GRID.y0 - 20, GRID.y1 + 20, scan);
    for (const p of PAIRS) {
      if (p.special) continue;
      const a = sstep(p.t0, p.t0 + .35, t) * gA, lit = scan > 0 && scan < 1 ? Math.exp(-(((p.y - scanY) / 26) ** 2)) : 0;
      pairRing(p.x, p.y, CELL.r, p.ph + t * p.w, p.a, p.b, a * (.75 + .5 * lit), 4.2, .2 + .3 * lit);
    }
    ctx.restore();
    if (scan > 0 && scan < 1) seg(GRID.x0 - 40, scanY, GRID.x1 + 40, scanY, `rgba(${W_RGB},.8)`, 3, gA * Math.sin(PI * scan));
  }
  // 那一对：放大成开头的那个圈，再侧过来，摊平成地面；两颗光变回两只猫
  const tilt = E.io(prog(t, z0 + 1.0, z0 + 2.0)), unroll = E.io(prog(t, z0 + 2.0, z0 + 3.0)), uRef = (uOf(330) + uOf(760)) / 2;
  const th = specialTh(t, z0 + 1.0), thB = th - lerp(PI, .6 * PI, E.io(prog(t, z0 + .6, z0 + 1.6))), catK = E.io(prog(t, z0 + 1.0, z0 + 1.9));
  if (zk < 1) {
    const cx = lerp(CELL.x, VT.cx, zk), cy = lerp(CELL.y, VT.cy, zk), r = CELL.r * z;
    pairRing(cx, cy, r, th, 1, 2, sstep(S2 + .3, S2 + .8, t), lerp(4.2, 10, zk), lerp(.6, .45, zk), thB);
  } else {
    const V = lerpV(VT, V1, tilt), m = 1 - unroll;
    curve(uRef, m, V, 1, { col: 'rgba(236,230,218,.3)', lw: lerp(3, 2, tilt) });
    if (catK < 1) { comet(th, V, A_RGB, 1 - catK, 10); comet(thB, V, V_RGB, 1 - catK, 10); }
  }
  // 人数，两个空格子
  const n = Math.round(354 * E.out(prog(t, S2 + .6, S2 + 2.2))), hd = sstep(S2 + .5, S2 + .9, t) * (1 - sstep(L(6) - .2, L(6) + .2, t));
  text(String(n), 540, 560, { font: SERIF, size: 120, weight: 900, align: 'center', color: GOLD, alpha: hd, glow: `rgba(${O_RGB},.4)`, blur: 24 });
  text('对恋人', 540, 670, { font: SANS, size: 40, weight: 700, align: 'center', color: CREAM, alpha: hd });
  const sl = win(t, L(6) + .1, L(7) + .4, .35, .4);
  [[250, 1, A_COL, '两个都焦虑'], [730, 2, V_LT, '两个都回避']].forEach(([x, ty, col, lab]) => {
    pairRing(x, 590, 34, t * 1.4 + (ty === 1 ? 0 : 1), ty, ty, sl, 11, .45);
    text(lab, x, 680, { font: SANS, size: 36, weight: 900, align: 'center', color: col, alpha: sl });
    const ps = pop(t, L(6) + 2.2); ctx.save(); ctx.translate(x + 150, 594); if (ps) ctx.scale(ps, ps);
    text('0 对', 0, 0, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ff9a7a', alpha: sl * sstep(L(6) + 2.2, L(6) + 2.4, t), glow: 'rgba(255,120,90,.5)', blur: 16 }); ctx.restore();
  });
  // 地面上的两只猫：他退后一步（果然会走）；你靠过去，线缠了上来（果然会被缠住）
  if (catK > 0) {
    const s0 = 1.6, exitM = E.io(prog(t, S3, S3 + 1.2));
    if (exitM > 0) return;                                                                              // S3 起交给 sceneRing
    const ax = track([[0, 330], [L(9) + .2, 330], [L(9) + 1.3, 640]])(t), vx = track([[0, 760], [L(8) + .4, 760], [L(8) + 1.4, 880]])(t);
    const place = (x0, th2) => {                                                                       // 圈上 → 摊平的地面上（两只猫停在 .8π / .2π，正好对上地面上的位置）
      if (unroll >= 1) return [x0, FLOOR, s0];
      const V = lerpV(VT, V1, tilt), [x, y] = unroll > 0 ? curvePt(uOf(x0), uRef, 1 - unroll, V) : ringPt(th2, V);
      return [x, y, s0 * lerp(depthS(th2) * lerp(.7, 1, tilt), 1, unroll)];
    };
    const [axp, af, as] = place(ax, th), [vxp, vf, vs] = place(vx, thB);
    const coilK = E.io(prog(t, L(9) + 1.2, L(9) + 2.4)) * (1 - sstep(S3 - .7, S3 - .1, t));
    chill(.4 * sstep(L(8) + .4, L(8) + 1.4, t), vxp, 900, 300);
    frost(vxp, vf - 80 * vs, 100 * vs, .55 * sstep(L(8) + .5, L(8) + 1.5, t), t, 5);
    coil(vxp, vf - 30 * vs, vs, coilK, catK, false);
    catOn(vxp, vf, vs * lerp(.2, 1, catK), catK, V_COL, { heart: .35 });
    coil(vxp, vf - 30 * vs, vs, coilK, catK, true);
    const alarmK = .6 * win(t, L(8) + .6, L(9) + 1.0, .4, .6);
    catOn(axp, af, as * lerp(.2, 1, catK), catK, A_COL, { heart: .9, beat: .3 });
    alarm(axp, chestY(af - 30 * as, as), as, alarmK, t, catK);
    // 两只猫心里想的
    const ta = win(t, L(8) + .3, L(9) + .3, .3, .35);
    thought('你看，他果然会走。', 380, 760, ta, 32, WARMC);
    seal(600, 690, prog(t, L(8) + 2.3, L(8) + 2.7), ta);
    const tb = win(t, L(9) + .4, S3 - .2, .3, .4);
    thought('你看，靠太近，就会被缠住。', 690, 760, tb, 32, V_LT);
    seal(880, 660, prog(t, L(9) + 2.8, L(9) + 3.2), tb);
  }
}

// ======================================================================== ③④⑤（S3 – 结束）：圈
const SPOTS = [420, 660];
function sceneRing(t) {
  if (t < S3) return;
  const s0 = 1.3, uRef = (uOf(640) + uOf(880)) / 2, m = E.io(prog(t, S3, S3 + 1.2));
  const off = E.io(prog(t, L(19) + 2.4, L(20) + .4));                                                    // 走出这个圈
  const V = lerpV(V3, V5, off), shatter = prog(t, L(22) + 1.0, L(22) + 2.6);
  const phA = phaseAt(PHA, t) - phaseAt(PHA, S3), phV = phaseAt(PHV, t) - phaseAt(PHV, S3);
  const spA = speedOf(PHA, t), spV = speedOf(PHV, t);
  // 圈：越转越深（像一条磨出来的沟）；④ 末尾最亮；⑤ 先被“看见”，最后碎掉
  const laps = Math.max(0, phA / TAU), rut = clamp(laps / 8), seen = win(t, L(18) + .8, L(19) + 2.6, .4, .6), deep = win(t, L(17) + 5.0, S5 + .6, .4, .6);
  const ringCol = seen > 0 ? mixc('#ece6da', '#ffd2a0', seen) : '#ece6da';
  if (shatter <= 0) {
    curve(uRef, m, V, (1 - .5 * off) * (1 - .3 * sstep(L(20), L(20) + .6, t)), { col: m < 1 ? 'rgba(236,230,218,.3)' : `rgba(${ringCol === '#ece6da' ? C_RGB : W_RGB},${.3 + .25 * rut + .35 * deep + .4 * seen})`,
      lw: 2 + 5 * rut + 4 * deep, glow: m >= 1 ? `rgba(${O_RGB},${.25 * rut + .5 * deep + .6 * seen})` : undefined, blur: 22 });
    if (seen > 0) ring(V, seen, { col: `rgba(${W_RGB},.9)`, lw: 3, dash: [26, 22], off: -t * 60, glow: `rgba(${O_RGB},.8)` });
    const arr = win(t, L(10) + .5, S5 + .5, .4, .5) * m * (1 - off);
    for (const th of [0, PI]) ringArrow(th - (t - S3) * .15, V, arr * .9, 'rgba(236,230,218,.8)');
  } else {
    for (let i = 0; i < 120; i++) {                                                                      // 圈碎成光，往外飘
      const r = mulberry(4800 + i), th = r() * TAU, [x, y] = ringPt(th, V), d = E.out(shatter) * (60 + 160 * r());
      glow(x + Math.cos(th) * d, y + Math.sin(th) * d * .6 - 120 * E.in(shatter) * r(), 2 + 2.5 * r(), r() < .5 ? W_RGB : '236,230,218', (1 - shatter) * (.5 + .5 * r()), 3);
    }
  }
  // 圈中间：第几圈；三年
  text(`第 ${Math.floor(laps) + 1} 圈`, 540, V3.cy - 10, { font: SANS, size: 40, weight: 900, align: 'center', color: DIM, alpha: win(t, L(14) + .4, S4 + .4, .4, .4) });
  // 两只猫的位置
  // 他想跑出去：圈被拉大，又一下子弹回来
  const pullK = t < L(15) + 1.45 ? .5 * Math.sin(PI * .5 * E.io(prog(t, L(15) + .7, L(15) + 1.45))) : .5 * (1 - E.outQuint(prog(t, L(15) + 1.45, L(15) + 1.85)));
  const cats = [[uOf(640), phA, spA, A_COL, 0], [uOf(880), phV, spV, V_COL, 1]].map(([u0, ph, sp, col, id]) => {
    const th = thOf(u0, uRef) - ph, Vc = id === 1 && pullK > .001 ? lerpV(V, { cx: V.cx, cy: V.cy, rx: V.rx * 1.42, ry: V.ry * 1.42 }, pullK) : V;
    let [x, feet] = m < 1 ? curvePt(u0 + ph / KU, uRef, m, V) : ringPt(th, Vc), s = s0 * lerp(1, depthS(th), m);
    feet += bob(ph, sp, s);
    return { x, feet, s, th, col, id, sp };
  });
  // 走出圈：按左右顺序走到前面并排坐好
  if (off > 0) {
    const order = t >= L(19) + 2.4 ? cats.slice().sort((p, q) => p.x - q.x) : cats;
    const together = E.io(prog(t, L(22) + .2, L(22) + 1.2));
    order.forEach((c, i) => { const sx = SPOTS[i] + (i ? -1 : 1) * 30 * together; c.x = lerp(c.x, sx, off); c.feet = lerp(c.feet, FLOOR, off); c.s = lerp(c.s, 1.5, off); });
  }
  const A = cats[0], B = cats[1];
  // 一根线：④ 他想跑出去，被拉回来；⑤ 并排坐下以后，线松下来、变暖
  const thrA = win(t, L(15) + .5, L(15) + 3.2, .3, .6), warmT = sstep(L(22) + .4, L(22) + 1.6, t);
  if (thrA > 0) thread(A.x, chestY(A.feet - 30 * A.s, A.s), B.x, chestY(B.feet - 30 * B.s, B.s), thrA, W_RGB, 4 - 4 * pullK, 2.5 + 3 * pullK);
  const [LC, RC] = A.x < B.x ? [A, B] : [B, A];
  if (warmT > 0) thread(LC.x + 30 * LC.s, chestY(LC.feet - 30 * LC.s, LC.s), RC.x - 30 * RC.s, chestY(RC.feet - 30 * RC.s, RC.s), warmT, W_RGB, 26, 3);
  // 警报（追的那只）、冰晶（退的那只）
  const alarmK = sstep(L(11) + .3, L(11) + 1.2, t) * (1 - sstep(L(19) + 2.4, L(20) + 2.0, t)) * (.6 + .4 * clamp((A.sp - .5) / 2));
  const coldK = Math.max(1 - sstep(S3, S3 + 1.2, t), sstep(L(12) + .3, L(12) + 1.4, t)) * (1 - sstep(L(19) + 2.4, L(21) + 2.0, t));
  for (const c of cats.slice().sort((p, q) => (off > .5 ? 0 : Math.sin(p.th) - Math.sin(q.th)))) {
    if (c.id === 1) { frost(c.x, c.feet - 80 * c.s, 100 * c.s, .55 * coldK, t, 5); chill(.4 * coldK * (1 - m) + .25 * coldK * m, c.x, c.feet - 150, 300); }
    catOn(c.x, c.feet, c.s, 1, c.id ? V_COL : A_COL, { heart: c.id ? .35 + .5 * warmT : .9, beat: c.id ? 0 : .2 + .3 * alarmK });
    if (c.id === 0) alarm(c.x, chestY(c.feet - 30 * c.s, c.s), c.s, alarmK, t, 1);
  }
  // 追：发消息、追问、要一个答案；退：不回、沉默、冷下来（从猫身上冒出来，往上飘）
  const word = (s, t0, c, col, stroke) => {
    const k = prog(t, t0, t0 + 2.4); if (k <= 0 || k >= 1) return;
    const r = mulberry(Math.floor(t0 * 100)), x0 = clamp(c.x, 170, 910);
    pill(s, x0 + (r() - .5) * 60, c.feet - 230 * c.s - 110 * E.out(k), Math.sin(PI * Math.min(1, k * 2.2)) * (k < .5 ? 1 : 1 - sstep(.6, 1, k)), { color: col, stroke, size: 30 });
  };
  [['发消息', L(11) + 2.7], ['追问', L(11) + 3.5], ['要一个答案', L(11) + 4.3]].forEach(([s, t0]) => word(s, t0, A, WARMC, `rgba(${O_RGB},.6)`));
  [['不回', L(12) + 3.2], ['沉默', L(12) + 4.0], ['冷下来', L(12) + 4.8]].forEach(([s, t0]) => word(s, t0, B, V_LT, `rgba(${V_RGB},.7)`));
  // 要求 — 退缩
  const dw = win(t, L(13) + .2, L(14) + .2, .3, .4);
  titleText([['要求', WARMC, `rgba(${O_RGB},.6)`], [' — ', CREAM], ['退缩', V_LT, 'rgba(120,170,255,.5)']], 540, 540, 84, dw, (1 - E.out(prog(t, L(13) + .2, L(13) + .9))) * 10);
  text('demand – withdraw', 540, 625, { font: LAT, style: 'italic', weight: 500, size: 36, align: 'center', color: DIM, alpha: dw });
  // 两个人都越不满意：两颗心里的光越来越少
  const mt = win(t, L(14) + .3, S4 + .3, .4, .4), drain = E.io(prog(t, L(14) + 1.0, L(14) + 4.0));
  meter(300, 580, 52, lerp(.85, .18, drain), WARMC, A_RGB, mt);
  meter(780, 580, 52, lerp(.85, .14, drain), V_LT, V_RGB, mt);
  text('满意度', 540, 584, { font: SANS, size: 34, weight: 700, align: 'center', color: DIM, alpha: mt });
  // ④ 分不开；三年；打分不高，却意外地稳定
  text('分不开', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: GOLD, alpha: win(t, L(15) + 2.1, L(16) + .1, .25, .3), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const yr = Math.min(3, 1 + Math.floor(Math.max(0, t - (L(16) + .2)) / .6)), yA = win(t, L(16) + .1, L(17) + .4, .25, .3), flip = (t - (L(16) + .2)) % .6;
  ctx.save(); ctx.translate(540, 560); ctx.scale(1, t > L(16) + .2 && t < L(16) + 1.4 ? Math.min(1, flip / .12) : 1);
  text(`第 ${yr} 年`, 0, 0, { font: SERIF, size: 92, weight: 900, align: 'center', color: CREAM, alpha: yA, glow: 'rgba(255,225,190,.3)', blur: 18 }); ctx.restore();
  const lab = win(t, L(17) + .2, L(17) + 3.2, .3, .4);
  for (const [c, s, col, st] of [[A, '焦虑型女生', WARMC, `rgba(${O_RGB},.6)`], [B, '回避型男生', V_LT, `rgba(${V_RGB},.7)`]])
    pill(s, clamp(c.x, 170, 910), c.feet - 200 * c.s, lab, { color: col, stroke: st, size: 30 });
  const sc = win(t, L(17) + 3.2, L(17) + 5.0, .3, .3);
  text('两个人打分', 540, 505, { font: SANS, size: 36, weight: 700, align: 'center', color: DIM, alpha: sc });
  text('★★☆☆☆', 540, 585, { font: SANS, size: 64, weight: 900, align: 'center', color: GOLD, alpha: sc, ls: 6 });
  const st = win(t, L(17) + 5.0, S5 + .2, .3, .4);
  text('却意外地稳定', 540, 520, { font: SERIF, size: 76, weight: 900, align: 'center', color: GOLD, alpha: st, glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('三年后：还在一起', 540, 610, { font: SANS, size: 36, weight: 700, align: 'center', color: CREAM, alpha: st });
  // ⑤ 看见这个圈；“我们又在转圈了。”；各自说一句
  pill('这个圈', 540, 600, win(t, L(18) + 1.0, L(19) + 1.5, .3, .4), { color: GOLD, stroke: `rgba(${O_RGB},.7)`, glow: `rgba(${O_RGB},.5)`, size: 36 });
  const we = win(t, L(19) + 1.6, L(20) + .3, .25, .35);
  if (we > 0) { const k = E.out(prog(t, L(19) + 1.6, L(19) + 2.0)); ctx.save(); ctx.translate(540, 600); ctx.scale(lerp(.6, 1, k), lerp(.6, 1, k)); say('我们又在转圈了。', 0, 0, we, CREAM, 42); ctx.restore(); }
  const bx = c => clamp(c.x, 300, 780);
  const q = win(t, L(20) + .2, L(20) + 1.9, .25, .35);
  if (q > 0) { say('你怎么又不回我？', bx(A), 600, q, '#ff9f8a', 38); const k = E.out(prog(t, L(20) + 1.0, L(20) + 1.4)); if (k > 0) seg(bx(A) - 170, 600, bx(A) - 170 + 340 * k, 600, RED, 6, q); }
  const need = win(t, L(20) + 1.9, L(21) + .3, .3, .35);
  if (need > 0) { const k = E.out(prog(t, L(20) + 1.9, L(20) + 2.3)); ctx.save(); ctx.translate(bx(A), 600); ctx.scale(lerp(.5, 1, k), lerp(.5, 1, k)); say('我有点慌，陪我待一会儿好吗？', 0, 0, need, WARMC, 36); ctx.restore(); }
  const back = win(t, L(21) + .3, L(22) + .2, .3, .35);
  if (back > 0) { const k = E.out(prog(t, L(21) + .3, L(21) + .7)); ctx.save(); ctx.translate(bx(B), 600); ctx.scale(lerp(.5, 1, k), lerp(.5, 1, k)); say('我静一会儿，九点回来找你。', 0, 0, back, V_LT, 36); ctx.restore(); }
  // 最后
  if (warmT > 0) { warmth(warmT * .8, 540, 980, 600); for (let i = 0; i < 16; i++) { const r = mulberry(2900 + i), p = ((t - L(22)) * (.12 + .1 * r()) + r()) % 1;
    glow(330 + r() * 420, 1060 - p * 420, 1.5 + 2 * r(), O_RGB, warmT * (1 - p) * .8, 3); } }
  const fin = sstep(L(23) - .1, L(23) + .4, t);
  typeText('一个怕被丢下，', 540, 560, { ...big, size: 72, weight: 900, color: WARMC, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, L(23), L(23) + .9), fin);
  typeText('一个怕被困住', 540, 680, { ...big, size: 72, weight: 900, color: V_LT, glow: 'rgba(120,170,255,.5)', glowBlur: 26 }, prog(t, L(23) + 1.0, L(23) + 1.9), fin);
  const Q = sstep(L(24) - .1, L(24) + .4, t);
  typeText('评论区说说：', 540, 1230, { size: 42, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, L(24), L(24) + .5), Q);
  typeText('你是追的那个，还是跑的那个？', 540, 1310, { size: 50, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, L(24) + .4, L(24) + 1.6), Q);
}

// ======================================================================== 世界层
const STAR_A = t => .14 + .1 * sstep(L(4), L(4) + 1.5, t) * (1 - sstep(S2, S2 + 1, t)) + .25 * sstep(L(22), L(23), t);
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneOpen(t); sceneWhy(t); sceneRing(t);
}
function SAMPLES(T) {
  const many = [[S2 - .3, S2 + .9], [L(7) - .1, L(7) + 1.0]];
  const more = [[L(16) + .2, L(17) + .2]];
  const fast = [[L(3), L(4) + 1.6], [S3, S3 + 1.3], [L(15) + .8, L(15) + 2.2], [L(19) + 2.3, L(20) + .5], [L(22) + 1.0, L(22) + 2.6]];
  const in_ = r => r.some(([a, b]) => T > a && T < b);
  if (in_(many)) return 14;
  if (in_(more)) return 8;
  const sp = Math.max(Math.abs(speedOf(PHA, T)), Math.abs(speedOf(PHV, T)));
  return in_(fast) || sp > 1.2 ? 5 : sp > .2 ? 4 : 3;
}
function BLOOM_K(T) { return .4 + .12 * win(T, L(4) + .6, S2, .4, .6) + .1 * win(T, L(17) + 5, S5, .4, .5) + .16 * win(T, L(22), TOTAL, 1, 1); }
function OVER(T) {
  stamp('1994', 'Kirkpatrick & Davis', L(5), L(7) - .1, T);
  stamp('2009', 'Holmes & Johnson', L(7), S3 - .1, T);
  stamp('1990', 'Christensen & Heavey', L(13), L(14) - .1, T);
  stamp('2022', 'Bretaña 等', L(14), S4 - .1, T);
  stamp('1994', 'Kirkpatrick & Davis', L(16), S5 - .1, T);
  stamp('2004', 'Johnson · EFT', L(18), L(20) - .1, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(4801);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .3 }; });
  const sp = SPEEDS(); PHA = phaseTable(sp.A); PHV = phaseTable(sp.V);
  // 354 对（示意）：大约一半多安全型，其余是焦虑型、回避型；两个都焦虑、两个都回避的不出现
  const pick = () => { const x = r(); return x < .56 ? 0 : x < .75 ? 1 : 2; }, cw = (GRID.x1 - GRID.x0) / (GRID.cols - 1), rh = (GRID.y1 - GRID.y0) / (GRID.rows - 1);
  const cx = Math.round((CELL.x - GRID.x0) / cw), cy = Math.round((CELL.y - GRID.y0) / rh), dmax = Math.hypot(GRID.cols, GRID.rows);
  PAIRS = [];
  for (let j = 0; j < GRID.rows; j++) for (let i = 0; i < GRID.cols; i++) {
    let a, b; do { a = pick(); b = pick(); } while (a === b && a > 0);
    PAIRS.push({ x: GRID.x0 + i * cw, y: GRID.y0 + j * rh, a, b, ph: r() * TAU, w: (.6 + .6 * r()) * (r() < .5 ? 1 : -1), special: i === cx && j === cy, t0: S2 + .5 + 1.5 * Math.hypot(i - cx, j - cy) / dmax });
  }
}

// ======================================================================== 音效提示表（E 小调 → G 大调）
const NOTE = { E4: 329.63, G4: 392.0, A4: 440.0, B4: 493.88, D5: 587.33, E5: 659.26, G5: 783.99, A5: 880.0, B5: 987.77, D6: 1174.66, E6: 1318.5 };
const E_SHIM = [NOTE.B5, NOTE.E5, NOTE.G5, NOTE.E6, NOTE.B4], G_SHIM = [NOTE.G5, NOTE.D6, NOTE.B5, NOTE.E6, NOTE.D5];
const E_SWELL = [82.41, 123.47, 164.81, 196.0, 246.94], G_SWELL = [98.0, 146.83, 196.0, 246.94, 293.66];
function CUES() {
  const c = [];
  // ① 三条消息、一句“你怎么了”；念头；跑起来，地面卷成圈；镜头升上去，题目
  for (const [t0] of MSGS) c.push([t0, 'swish', { dur: .3, gain: .05 }], [t0 + .05, 'tick', { gain: .04 }]);
  c.push([L(1) + .8, 'air', { dur: 3, hum: 110, gain: .04 }]);
  c.push([L(2) + .4, 'tick', { gain: .035 }], [L(2) + 2.3, 'tick', { gain: .04 }]);
  c.push([L(3) + .1, 'whoosh', { dur: 1.2, gain: .09 }], [L(4) + .2, 'riser', { dur: 1.2, gain: .1 }]);
  c.push([L(4) + 1.0, 'swell', { dur: 1.0, f: E_SWELL, gain: .1 }], [L(4) + 1.05, 'shimmer', { f: E_SHIM, gain: .1 }]);
  // ② 缩进格子里；数到 354；扫一遍：0 对；放大回那一对；他退后，盖章；线缠上来，盖章
  c.push([S2 - .3, 'whoosh', { dur: 1.1, gain: .07 }]);
  for (let i = 0; i < 10; i++) c.push([S2 + .6 + i * .15, 'tick', { gain: .02 }]);
  c.push([L(6) + .4, 'bar', { f0: 300, f1: 700, dur: 1.6, gain: .04 }], [L(6) + 2.2, 'thud', { gain: .06 }]);
  c.push([L(7) - .1, 'whoosh', { dur: 1.1, gain: .09 }], [L(7) + 2.0, 'swish', { dur: .8, gain: .05 }]);
  c.push([L(8) + .4, 'swish', { dur: .6, gain: .04 }], [L(8) + 2.3, 'thunk', { gain: .07 }]);
  c.push([L(9) + .2, 'swish', { dur: .6, gain: .04 }], [L(9) + 1.2, 'bar', { f0: 500, f1: 260, dur: 1.2, gain: .04 }], [L(9) + 2.8, 'thunk', { gain: .07 }]);
  // ③ 卷成圈；追（消息）；退（冷）；要求—退缩；越转越快
  c.push([S3, 'whoosh', { dur: 1.2, gain: .09 }], [L(10) + .5, 'chord', { f: [NOTE.E4, NOTE.G4, NOTE.B4], gain: .05 }]);
  for (const t0 of [L(11) + 2.7, L(11) + 3.5, L(11) + 4.3]) c.push([t0, 'tick', { gain: .045 }]);
  for (const t0 of [L(12) + 3.2, L(12) + 4.0, L(12) + 4.8]) c.push([t0, 'tink', { f: NOTE.E6, gain: .03 }]);
  c.push([L(13) + .2, 'drone', { dur: 2.4, gain: .04 }], [L(14) + 1.0, 'bar', { f0: 700, f1: 240, dur: 3.0, gain: .04 }]);
  // ④ 想跑出去，被拉回来；一年、两年、三年；打分；却意外地稳定
  c.push([L(15) + .9, 'bar', { f0: 260, f1: 520, dur: .6, gain: .05 }], [L(15) + 1.45, 'thud', { gain: .07 }]);
  for (let i = 0; i < 3; i++) c.push([L(16) + .2 + i * .6, 'page', { gain: .05 }]);
  c.push([L(16) + .2, 'whoosh', { dur: 1.4, gain: .06 }], [L(17) + 3.2, 'tink', { f: NOTE.G5, gain: .04 }], [L(17) + 5.0, 'chord', { f: [NOTE.E4, NOTE.G4, NOTE.B4, NOTE.E5], gain: .05 }]);
  // ⑤ 停下，看见这个圈；“我们又在转圈了”；划掉；说出需要；说好什么时候回来；圈碎了；变暖
  c.push([L(18) + 1.0, 'shimmer', { f: G_SHIM, gain: .06 }], [L(19) + 1.6, 'ding', { f: 1318.5, gain: .06, pan: 0 }]);
  c.push([L(19) + 2.4, 'swish', { dur: 1.0, gain: .05 }], [L(20) + 1.0, 'swish', { dur: .3, gain: .06 }], [L(20) + 1.9, 'ding', { f: 1567.98, gain: .06, pan: -.3 }]);
  c.push([L(21) + .3, 'ding', { f: 1174.66, gain: .06, pan: .3 }], [L(22) + 1.0, 'dust', { dur: 1.4, gain: .08 }], [L(22) + .6, 'swell', { dur: 2.4, f: G_SWELL, gain: .07 }]);
  c.push([L(23), 'shimmer', { f: G_SHIM, gain: .12 }], [L(24), 'tink', { f: NOTE.D6, gain: .05 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
