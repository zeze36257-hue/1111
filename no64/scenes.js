// ======================================================================== No.64 你的眼睛在骗你（真人出镜 · 试播）
// 新格式：上半屏（y 360–1170）是动画舞台，下半屏（y 1250 以下）留给主持人出镜（画中画 / 智能抠像）。
// 字幕由剪辑软件按主持人自己的声音自动识别，所以底版不压旁白字幕，舞台上只放关键词。
// ?prompter=1 导出“提词版”：前面多 3 秒倒数，下半屏显示当前台词（逐字走色）、动作提示和下一句；静音导出。
// 三关：① 艾宾浩斯错觉（大小） ② Adelson 棋盘阴影错觉（明暗，1995） ③ 负后像（颜色：盯住一张反色图，再看黑白图）。
// 错觉画面不加泛光、暗角和颗粒（这一期自己的 render 覆盖了引擎的 render）：A、B 两格必须是同一个像素值。
// 音乐：原创配乐（music.py，D 大调 80 BPM，1 小节 = 3 秒），音量垫在人声底下；揭晓、换关都落在拍点上：
//   3.0 第1关 · 10.5 一样大 · 12.0 第2关 · 21.0 一样灰 · 27.0 第3关 · 48.0 换成黑白 · 54.0 原理 · 60.0 结尾 · 69.0 片尾
const PROMPTER = /[?&]prompter=1/.test(location.search);
const BODY = 72, LEAD = PROMPTER ? 3 : 0, TOTAL = BODY + LEAD;
const SECTIONS = [['开场', 0, 3], ['第1关', 3, 12], ['第2关', 12, 27], ['第3关', 27, 54], ['原理', 54, 60], ['结尾', 60, BODY]];
const L1 = 3, REV1 = 10.5, L2 = 12, BARS0 = 19.5, REV2 = 21, L3 = 27, SWITCH = 48, WHY = 54, END = 60, CARD = 67.6;

// 主持人台词：[开始, 结束, 台词, 动作提示]。时间就是底版的时间；提词版按这个走字。
const LINES = [
  [0.2, 2.9, '三关测试，我赌你至少被骗一关。', '（看镜头，自信一点）'],
  [3.2, 5.9, '第一关：这两个橙色的圆，哪个大？', '（手指一下上面）'],
  [6.9, 8.3, '右边大，对吧？', '（指右边）'],
  [8.6, 10.2, '我把旁边的拿掉——', '（手一挥）'],
  [10.6, 11.9, '一模一样大。', ''],
  [12.2, 15.6, '第二关，难一点。A格和B格，哪个颜色深？', ''],
  [16.2, 18.4, 'A是黑格，B是白格，对吧？', ''],
  [18.9, 20.8, '来，我把它俩连起来——', '（手从上往下比一条线）'],
  [21.2, 22.8, '一模一样的灰。', ''],
  [23.6, 26.4, '你的大脑，自动把影子“扣掉”了。', ''],
  [27.2, 30.8, '最后一关，最难。盯住中间这个小点，别眨眼。', '（指向上面的点）'],
  [32.4, 35.0, '别看我，看点。我知道你想看我。', '（忍住笑）'],
  [37.8, 39.8, '还有十秒，坚持住。', ''],
  [41.6, 43.6, '马上就好，千万别动……', '（声音放轻）'],
  [44.25, 47.8, '五、四、三、二、一——', '（跟着屏幕上的数字数）'],
  [48.2, 50.4, '好，现在别动！看到颜色了吗？', '（小声、惊讶）'],
  [51.0, 53.2, '可这张图……是黑白的。', ''],
  [54.1, 59.4, '盯久了，管颜色的细胞会“累”，大脑就自己补上了相反的颜色。', ''],
  [60.1, 64.0, '所以，你看到的不全是真的，是大脑帮你“猜”的。', ''],
  [64.3, 67.3, '三关你第几关被骗了？评论区告诉我。', '（看镜头）'],
  [67.6, 70.4, '关注我，带你看更多大脑的bug。', '（笑一下）'],
];
const COUNT = [44.25, 45.0, 45.75, 46.5, 47.25];                                     // 五、四、三、二、一（每拍一个）

// ======================================================================== 共用
const BLUEGREY = '#9aa3b2', GOLD = '#ffd2a0';
const gray = v => `rgb(${v},${v},${v})`;
function circ(x, y, r, col, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
function poly(pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
function chip(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 34; font(size, o.weight || 700, SANS); const w = ctx.measureText(s).width + size * 1.8;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 26; }
  ctx.fillStyle = o.fill || 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 1.05, w, size * 2.1, size * 1.05); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 700, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
const BIG = { align: 'center', spread: 3, blur: 14, rise: 18 };
const pop = (t, t0) => { const k = prog(t, t0, t0 + .45); return k <= 0 ? 0 : 1 + .18 * Math.sin(PI * Math.min(1, k * 1.25)) * (1 - k); };

function bgGrad() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0e1119'); g.addColorStop(.62, '#0a0c12'); g.addColorStop(1, '#07080b');
  return g;
}
function background() {
  ctx.fillStyle = bgGrad(); ctx.fillRect(0, 0, W, H);
  // 主持人区：一盏暖色的顶光（抠像后人站在这里，像在演播室里）
  const s = ctx.createRadialGradient(540, 1330, 30, 540, 1520, 760);
  s.addColorStop(0, 'rgba(242,161,74,.11)'); s.addColorStop(.6, 'rgba(242,161,74,.03)'); s.addColorStop(1, 'rgba(242,161,74,0)');
  ctx.fillStyle = s; ctx.fillRect(0, 1180, W, H - 1180);
}

// ======================================================================== 黑猫（和片头同一只：异色瞳，橙 / 青）
function catParts(sway) {
  const head = new Path2D(); head.ellipse(0, -150, 108, 94, 0, 0, TAU);
  const earL = new Path2D(); earL.moveTo(-100, -190); earL.lineTo(-84, -292); earL.lineTo(-30, -232); earL.closePath();
  const earR = new Path2D(); earR.moveTo(100, -190); earR.lineTo(84, -292); earR.lineTo(30, -232); earR.closePath();
  const p = new Path2D();
  p.moveTo(-62, -80); p.bezierCurveTo(-120, -20, -168, 110, -150, 210);
  p.quadraticCurveTo(-140, 248, -96, 250); p.lineTo(96, 250); p.quadraticCurveTo(140, 248, 150, 210);
  p.bezierCurveTo(168, 110, 120, -20, 62, -80); p.closePath();
  const tail = new Path2D();
  tail.moveTo(120, 236); tail.bezierCurveTo(220, 250, 262 + sway * 10, 170, 238 + sway * 14, 96);
  tail.quadraticCurveTo(226 + sway * 16, 62, 200 + sway * 18, 70);
  return { parts: [head, earL, earR, p], tail };
}
function catEye(x, y, col, rgb, open, glw) {
  if (open <= .02) return;
  ctx.save(); ctx.translate(x, y);
  if (glw > 0) { ctx.shadowColor = `rgba(${rgb},${.9 * glw})`; ctx.shadowBlur = 40 * glw; }
  ctx.beginPath(); ctx.moveTo(-24, 0); ctx.quadraticCurveTo(0, -20 * open, 24, 0); ctx.quadraticCurveTo(0, 20 * open, -24, 0); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
  ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 15 * open, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(-7, -5 * open, 3, 0, TAU); ctx.fill();
  ctx.restore();
}
// rim：轮廓光强度（0 = 纯剪影）；eyeL / eyeR：眼睛颜色（反色图里要跟着换）
function drawCat(x, y, s, t, rim, open, eyeL = ORANGE, eyeR = TEAL, body = '#07080b') {
  const { parts, tail } = catParts(Math.sin(t * 2.2));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  if (rim > 0) for (const [x0, rgb] of [[-400, O_RGB], [0, T_RGB]]) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -400, 400, 800); ctx.clip();
    ctx.shadowColor = `rgba(${rgb},${.9 * rim})`; ctx.shadowBlur = 24; ctx.strokeStyle = `rgba(${rgb},${.8 * rim})`;
    ctx.lineWidth = 36; ctx.stroke(tail); ctx.restore();
  }
  ctx.strokeStyle = body; ctx.lineWidth = 30; ctx.stroke(tail);
  if (rim > 0) for (const [x0, rgb] of [[-400, O_RGB], [0, T_RGB]]) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -400, 400, 800); ctx.clip();
    ctx.shadowColor = `rgba(${rgb},${.9 * rim})`; ctx.shadowBlur = 24; ctx.strokeStyle = `rgba(${rgb},${.8 * rim})`;
    ctx.lineWidth = 6; parts.forEach(q => ctx.stroke(q)); ctx.restore();
  }
  ctx.fillStyle = body; parts.forEach(q => ctx.fill(q));
  if (rim > 0) {
    ctx.save(); ctx.globalAlpha *= .35 * rim; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.5;
    for (const k of [-1, 1]) for (const dy of [-6, 6]) { ctx.beginPath(); ctx.moveTo(k * 50, -118 + dy * .5); ctx.lineTo(k * 140, -126 + dy * 2); ctx.stroke(); }
    ctx.restore();
  }
  catEye(-42, -152, eyeL, O_RGB, open, rim);
  catEye(42, -152, eyeR, T_RGB, open, rim);
  ctx.restore();
}

// 一只“眼睛”图标：杏仁形的眼眶，虹膜从橙到青
function bigEye(x, y, s, t, open, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const shape = () => { ctx.beginPath(); ctx.moveTo(-180, 0); ctx.quadraticCurveTo(0, -150 * open, 180, 0); ctx.quadraticCurveTo(0, 150 * open, -180, 0); ctx.closePath(); };
  ctx.shadowColor = `rgba(${O_RGB},.45)`; ctx.shadowBlur = 30;
  ctx.strokeStyle = CREAM; ctx.lineWidth = 7; shape(); ctx.stroke(); ctx.shadowBlur = 0;
  if (open > .05) {
    ctx.save(); shape(); ctx.clip();
    const lx = 26 * Math.sin(t * 1.3), ly = 8 * Math.sin(t * 2.1);
    const g = ctx.createLinearGradient(-70 + lx, 0, 70 + lx, 0); g.addColorStop(0, ORANGE); g.addColorStop(1, TEAL);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lx, ly, 70, 0, TAU); ctx.fill();
    ctx.fillStyle = '#06070a'; ctx.beginPath(); ctx.arc(lx, ly, 30, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(lx - 22, ly - 22, 10, 0, TAU); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
const blink = (t, t0) => 1 - .96 * Math.max(0, 1 - Math.abs(t - t0) / .09);

// ======================================================================== 开场：封面（第一帧就是封面，不做淡入）
function sceneHook(t) {
  if (t > 3.2) return;
  const out = E.in(prog(t, 2.55, 3.05)), A = 1 - out;
  if (A <= 0) return;
  ctx.save(); ctx.globalAlpha = A;
  ctx.translate(540, 760); ctx.scale(1 + .25 * out, 1 + .25 * out); ctx.translate(-540, -760);
  text('黑猫不说话 · 眼睛测试', 540, 424, { font: SANS, size: 30, weight: 500, align: 'center', color: ORANGE, ls: 8 });
  text('你的眼睛', 540, 560, { size: 116, weight: 900, align: 'center', color: CREAM, ls: 6 });
  const sh = 1 + .03 * Math.sin(t * 5);
  ctx.save(); ctx.translate(540, 700); ctx.scale(sh, sh);
  text('在骗你', 0, 0, { size: 150, weight: 900, align: 'center', color: ORANGE, ls: 10, glow: `rgba(${O_RGB},.55)`, blur: 40 });
  ctx.restore();
  chip('三关测试 · 你能过几关？', 540, 850, 1, { size: 40, fill: 'rgba(242,161,74,.16)', stroke: 'rgba(242,161,74,.6)' });
  // 三个小图标：大小 / 明暗 / 颜色
  const iy = 1010;
  for (let i = 0; i < 6; i++) { const an = i * TAU / 6; circ(230 + 44 * Math.cos(an), iy + 44 * Math.sin(an), 17, BLUEGREY, .8); }
  circ(230, iy, 15, ORANGE);
  ctx.save(); ctx.translate(540, iy); ctx.rotate(PI / 4);
  for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) { ctx.fillStyle = (u + v) % 2 ? gray(200) : gray(110); ctx.fillRect(-45 + u * 30, -45 + v * 30, 30, 30); }
  ctx.restore();
  ['#e8423f', '#ffd23a', '#4cc25a', '#3d8fe6'].forEach((c, i) => circ(810 + (i % 2 ? 22 : -22), iy + (i < 2 ? -22 : 22), 24, c, .95));
  ['大小', '明暗', '颜色'].forEach((s, i) => text(s, 230 + i * 290, 1112, { font: SANS, size: 32, weight: 700, align: 'center', color: CREAM, alpha: .9, ls: 4 }));
  ctx.restore();
}

// ======================================================================== 第1关：艾宾浩斯错觉（大小）
function sceneSize(t) {
  if (t < 2.8 || t > 12.3) return;
  const A = sstep(2.85, 3.35, t) * (1 - sstep(11.85, 12.25, t));
  const cy = 790, r = 58;
  const fly = E.in(prog(t, 9.0, 9.75)), slide = E.io(prog(t, 9.75, REV1));
  const xl = lerp(300, 440, slide), xr = lerp(780, 640, slide);
  ctx.save(); ctx.globalAlpha = A;
  for (let i = 0; i < 6; i++) { const an = i * TAU / 6 + PI / 6, d = 168 + fly * 420; circ(300 + d * Math.cos(an), cy + d * Math.sin(an), 82, BLUEGREY, 1 - fly); }
  for (let i = 0; i < 8; i++) { const an = i * TAU / 8, d = 92 + fly * 380; circ(780 + d * Math.cos(an), cy + d * Math.sin(an), 21, BLUEGREY, 1 - fly); }
  circ(xl, cy, r, ORANGE); circ(xr, cy, r, ORANGE);
  const g = sstep(REV1 - .15, REV1 + .25, t) * (1 - sstep(11.6, 11.9, t));             // 两条虚线：上沿、下沿一样高
  if (g > 0) {
    ctx.save(); ctx.globalAlpha *= g; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.setLineDash([14, 12]);
    for (const y of [cy - r, cy + r]) { ctx.beginPath(); ctx.moveTo(330, y); ctx.lineTo(750, y); ctx.stroke(); }
    ctx.restore();
  }
  typeText('哪个「橙色的圆」更大？', 540, 450, { ...BIG, size: 60, weight: 900 }, prog(t, 3.2, 3.9), 1 - sstep(REV1 - .2, REV1 + .1, t));
  const q = sstep(6.9, 7.2, t) * (1 - sstep(8.8, 9.1, t));
  chip('右边更大？', 780, 1000, q, { size: 32 });
  const s = pop(t, REV1);
  if (s > 0) {
    ctx.save(); ctx.translate(540, 1040); ctx.scale(s, s);
    text('一模一样大！', 0, 0, { size: 84, weight: 900, align: 'center', color: GOLD, glow: `rgba(${O_RGB},.5)`, blur: 30 });
    ctx.restore();
  }
  ctx.restore();
}

// ======================================================================== 第2关：Adelson 棋盘阴影错觉（明暗）
// 棋盘在“棋盘坐标” (u, v) ∈ [0,6]² 里画，再用一个仿射变换转 45° 压扁成斜着看的样子。
// 亮格 204、暗格 120；影子是乘法 150/255：影子里的亮格 = 204 × 150 / 255 = 120 = 阳光下的暗格。
// 影子要宽、边要软，B 和它周围的格子都在影子里，A 和它周围的格子都在光里，错觉才强。
const BD = { cx: 540, y0: 560, h: 100 * Math.SQRT1_2, k: .56, n: 6 };
const LIGHT = 204, DARK = 120, SHADE = 150;
const SQ_A = [1, 1], SQ_B = [4, 3];                                                  // A：阳光下的暗格；B：影子里的亮格
const CYL = { u: 4.6, v: .7, r: .9, hgt: 225 };
const BARX = [565, 586];
function bxy(u, v, dy = 0) { return [BD.cx + (u - v) * BD.h, BD.y0 + (u + v) * BD.h * BD.k + dy]; }
function rhombus(u, v, dy) { return [bxy(u, v, dy), bxy(u + 1, v, dy), bxy(u + 1, v + 1, dy), bxy(u, v + 1, dy)]; }
function shadowPath() {                                                              // 圆柱底下往 +v 方向拖出来的影子（棋盘坐标），越远越宽
  const r0 = CYL.r, r1 = 1.3, v1 = 6.8;
  ctx.beginPath(); ctx.moveTo(CYL.u - r0, CYL.v); ctx.lineTo(CYL.u - r1, v1); ctx.lineTo(CYL.u + r1, v1); ctx.lineTo(CYL.u + r0, CYL.v);
  ctx.arc(CYL.u, CYL.v, r0, 0, PI, true); ctx.closePath();
}
function boardTransform(dy) { ctx.setTransform(BD.h, BD.h * BD.k, -BD.h, BD.h * BD.k, BD.cx, BD.y0 + dy); }
function abLabels(dy, a) {
  const [ax, ay] = bxy(SQ_A[0] + .5, SQ_A[1] + .5, dy), [bx, by] = bxy(SQ_B[0] + .5, SQ_B[1] + .5, dy);
  text('A', ax - 24, ay + 2, { font: SANS, size: 34, weight: 700, align: 'center', color: '#ededed', alpha: a });
  text('B', bx + 26, by + 2, { font: SANS, size: 34, weight: 700, align: 'center', color: '#1b1b1b', alpha: a });
}
function drawBoard(dy, a) {
  if (a <= 0) return;
  const N = BD.n;
  ctx.save(); ctx.globalAlpha = a;
  const [rx, ry] = bxy(N, 0, dy), [bx, by] = bxy(N, N, dy), [lx, ly] = bxy(0, N, dy), TH = 30;
  ctx.fillStyle = '#3a3d45'; poly([[rx, ry], [bx, by], [bx, by + TH], [rx, ry + TH]]);
  ctx.fillStyle = '#2a2c33'; poly([[lx, ly], [bx, by], [bx, by + TH], [lx, ly + TH]]);
  ctx.save(); boardTransform(dy);
  ctx.beginPath(); ctx.rect(0, 0, N, N); ctx.clip();
  for (let u = 0; u < N; u++) for (let v = 0; v < N; v++) { ctx.fillStyle = gray((u + v) % 2 ? LIGHT : DARK); ctx.fillRect(u - .004, v - .004, 1.008, 1.008); }
  ctx.globalCompositeOperation = 'multiply'; ctx.filter = 'blur(14px)'; ctx.fillStyle = gray(SHADE); shadowPath(); ctx.fill();
  ctx.restore();
  // 圆柱：右上来的光，右边亮
  const [cx, cyb] = bxy(CYL.u, CYL.v, dy), rx2 = CYL.r * BD.h * Math.SQRT2, ry2 = rx2 * BD.k, top = cyb - CYL.hgt;
  const g = ctx.createLinearGradient(cx - rx2, 0, cx + rx2, 0);
  g.addColorStop(0, '#1d4724'); g.addColorStop(.5, '#3c8a47'); g.addColorStop(.82, '#71c477'); g.addColorStop(1, '#4f9d58');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - rx2, top); ctx.lineTo(cx - rx2, cyb); ctx.ellipse(cx, cyb, rx2, ry2, 0, PI, 0, true); ctx.lineTo(cx + rx2, top); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8ed693'; ctx.beginPath(); ctx.ellipse(cx, top, rx2, ry2, 0, 0, TAU); ctx.fill();
  ctx.restore();
}
function callout(s, x, y, tx, ty, a) {                                               // 板外的小标签 + 一根指过去的线
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.75)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke(); circ(tx, ty, 4, CREAM);
  ctx.restore();
  chip(s, x, y, a, { size: 32, fill: 'rgba(14,17,25,.92)' });
}
function sceneShade(t) {
  if (t < 11.8 || t > 27.1) return;
  const ent = E.out(prog(t, 11.9, 12.6)), A = ent * (1 - sstep(26.4, 26.95, t)), dy = 70 * (1 - ent);
  drawBoard(dy, A);
  abLabels(dy, A);
  // 连起来：两根和 A、B 同一个灰度的竖条，从 A 往下长到 B
  const [ax, ay] = bxy(SQ_A[0] + .5, SQ_A[1] + .5, dy), [bx, by] = bxy(SQ_B[0] + .5, SQ_B[1] + .5, dy);
  const grow = E.io(prog(t, BARS0, REV2)), barA = A * (1 - sstep(23.8, 24.4, t));
  const bars = () => { if (grow > 0) { ctx.fillStyle = gray(DARK); for (const x of BARX) ctx.fillRect(x - 5, ay, 10, (by - ay) * grow); } };
  ctx.save(); ctx.globalAlpha = barA; bars(); ctx.restore();
  // 其余的全部淡出，只剩 A、B 和竖条
  const cover = sstep(21.8, 23.0, t) * (1 - sstep(23.8, 24.4, t));
  if (cover > 0) {
    ctx.save(); ctx.globalAlpha = cover * A; ctx.fillStyle = bgGrad(); ctx.fillRect(0, 380, W, 760); ctx.restore();
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = gray(DARK);
    poly(rhombus(SQ_A[0], SQ_A[1], dy)); poly(rhombus(SQ_B[0], SQ_B[1], dy)); bars(); ctx.restore();
    abLabels(dy, A);
  }
  typeText('「A」和「B」，哪个颜色更深？', 540, 420, { ...BIG, size: 58, weight: 900 }, prog(t, 12.3, 13.0), A * (1 - sstep(20.8, 21.1, t)));
  const q = A * sstep(16.2, 16.5, t) * (1 - sstep(19.2, 19.5, t));
  callout('黑？', 290, 590, ax - 14, ay - 8, q);
  callout('白？', 830, 1010, bx + 8, by + 10, q);
  const s = pop(t, REV2);
  if (s > 0) {
    ctx.save(); ctx.globalAlpha = A * (1 - sstep(23.4, 23.8, t)); ctx.translate(540, 420); ctx.scale(s, s);
    text('一模一样的灰！', 0, 0, { size: 80, weight: 900, align: 'center', color: GOLD, glow: `rgba(${O_RGB},.5)`, blur: 30 });
    ctx.restore();
  }
  // 原因：影子的轮廓 + 一句话
  const why = A * sstep(24.2, 24.8, t);
  if (why > 0) {
    ctx.save(); ctx.globalAlpha = why; boardTransform(dy); ctx.lineWidth = 3 / BD.h; ctx.strokeStyle = ORANGE; ctx.setLineDash([.12, .09]);
    ctx.beginPath(); ctx.rect(0, 0, BD.n, BD.n); ctx.clip(); shadowPath(); ctx.stroke(); ctx.restore();
    const [lx, ly] = bxy(4.6, 5.4, dy);
    chip('影子', lx, ly, why, { size: 30, color: ORANGE, fill: 'rgba(14,17,25,.85)', stroke: 'rgba(242,161,74,.6)' });
    typeText('大脑自动“扣掉”了影子', 540, 420, { ...BIG, size: 58, weight: 900, color: CREAM }, prog(t, 24.3, 25.0), why);
  }
}

// ======================================================================== 第3关：负后像（颜色）
// 同一张画画两遍：盯的时候是“反色”（亮度不变、颜色取相反），换成黑白（只剩亮度）的那一刻，眼睛自己补出原来的颜色。
const IMG = { x: 70, y: 400, w: 940, h: 730, r: 30 }, FIX = [540, 770];
let PMODE = 'true';
function hexrgb(h) { return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); }
function C(hex) {
  const [r, g, b] = hexrgb(hex), Y = .299 * r + .587 * g + .114 * b, cl = v => Math.round(clamp(v, 0, 255));
  if (PMODE === 'gray') return gray(cl(Y));
  if (PMODE === 'adapt') { const k = 1.25; return `rgb(${cl((1 + k) * Y - k * r)},${cl((1 + k) * Y - k * g)},${cl((1 + k) * Y - k * b)})`; }
  return hex;
}
function picture(mode, t, a = 1) {
  if (a <= 0) return;
  PMODE = mode;
  ctx.save(); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.roundRect(IMG.x, IMG.y, IMG.w, IMG.h, IMG.r); ctx.clip();
  const sky = ctx.createLinearGradient(0, IMG.y, 0, 900); sky.addColorStop(0, C('#2f7fe0')); sky.addColorStop(1, C('#8ccaf5'));
  ctx.fillStyle = sky; ctx.fillRect(IMG.x, IMG.y, IMG.w, IMG.h);
  ctx.fillStyle = C('#ffd23a'); ctx.beginPath(); ctx.arc(808, 536, 84, 0, TAU); ctx.fill();                       // 太阳
  ctx.fillStyle = C('#f4f4f2');                                                                                  // 云
  for (const [x, y, s] of [[420, 520, 1], [640, 610, .7]]) { ctx.beginPath(); ctx.ellipse(x, y, 90 * s, 34 * s, 0, 0, TAU); ctx.ellipse(x - 50 * s, y + 6 * s, 52 * s, 28 * s, 0, 0, TAU); ctx.ellipse(x + 40 * s, y - 18 * s, 56 * s, 36 * s, 0, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = C('#d8d8d8'); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(228, 640); ctx.quadraticCurveTo(240, 720, 220, 800); ctx.stroke();   // 气球
  ctx.fillStyle = C('#e8423f'); ctx.beginPath(); ctx.ellipse(228, 572, 54, 68, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(220, 638); ctx.lineTo(236, 638); ctx.lineTo(228, 650); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C('#3b9b56'); ctx.beginPath(); ctx.moveTo(IMG.x, 880);                                        // 远山
  ctx.bezierCurveTo(260, 760, 420, 800, 560, 850); ctx.bezierCurveTo(700, 780, 880, 760, IMG.x + IMG.w, 840); ctx.lineTo(IMG.x + IMG.w, IMG.y + IMG.h); ctx.lineTo(IMG.x, IMG.y + IMG.h); ctx.fill();
  ctx.fillStyle = C('#62c24a'); ctx.beginPath(); ctx.moveTo(IMG.x, 960);                                        // 草地
  ctx.bezierCurveTo(330, 890, 700, 900, IMG.x + IMG.w, 950); ctx.lineTo(IMG.x + IMG.w, IMG.y + IMG.h); ctx.lineTo(IMG.x, IMG.y + IMG.h); ctx.fill();
  ctx.fillStyle = C('#f1ece2'); ctx.fillRect(300, 790, 190, 140);                                                // 房子
  ctx.fillStyle = C('#e0453a'); poly([[278, 796], [395, 706], [512, 796]]);
  ctx.fillStyle = C('#8a5a3c'); ctx.fillRect(372, 856, 46, 74);
  ctx.fillStyle = C('#ffd86b'); ctx.fillRect(318, 818, 40, 36); ctx.fillRect(432, 818, 40, 36);
  ctx.fillStyle = C('#7a5232'); ctx.fillRect(782, 830, 26, 120);                                                 // 树
  ctx.fillStyle = C('#2f9e4f'); for (const [x, y, rr] of [[795, 800, 62], [748, 836, 44], [842, 836, 46]]) { ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill(); }
  ctx.fillStyle = C('#e8423f'); for (const [x, y] of [[160, 1040], [600, 1070], [910, 1030]]) { ctx.beginPath(); ctx.arc(x, y, 13, 0, TAU); ctx.fill(); }   // 花
  ctx.fillStyle = C('#ffd23a'); for (const [x, y] of [[250, 1080], [520, 1010], [840, 1090]]) { ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fill(); }
  drawCat(660, 1020, .3, 0, 0, 1, C('#f2a14a'), C('#4fd6c4'), '#0b0b0d');                                         // 草地上的黑猫
  ctx.restore();
  PMODE = 'true';
  // 注视点：小黑点 + 白圈
  ctx.save(); ctx.globalAlpha = a;
  circ(FIX[0], FIX[1], 11, '#ffffff'); circ(FIX[0], FIX[1], 6.5, '#000000');
  ctx.restore();
}
function sceneColor(t) {
  if (t < 26.8 || t > 54.2) return;
  const card = sstep(26.95, 27.25, t) * (1 - sstep(27.6, 27.95, t));
  if (card > 0) {
    text('第 3 关', 540, 680, { size: 110, weight: 900, align: 'center', color: CREAM, alpha: card, ls: 8 });
    chip('最难', 540, 820, card, { size: 40, color: ORANGE, stroke: 'rgba(242,161,74,.6)' });
  }
  const A = sstep(27.6, 28.0, t) * (1 - sstep(53.7, 54.1, t));
  if (A <= 0) return;
  if (t < SWITCH) {
    picture('adapt', t, A);
    const ring = prog(t, 30.8, SWITCH);                                                  // 注视点外的一圈：盯了多久
    if (ring > 0) { ctx.save(); ctx.globalAlpha = A * .9; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(FIX[0], FIX[1], 24, -PI / 2, -PI / 2 + TAU * ring); ctx.stroke(); ctx.restore(); }
    text('盯住中间的小黑点 · 别眨眼', 540, 370, { font: SANS, size: 30, weight: 700, align: 'center', color: CREAM, alpha: A * sstep(28.4, 28.8, t), ls: 4 });
  } else {
    picture('gray', t, A);
    text('别动，继续盯着点', 540, 370, { font: SANS, size: 30, weight: 700, align: 'center', color: CREAM, alpha: A * (1 - sstep(50.8, 51.1, t)), ls: 4 });
    chip('这是一张黑白图', 540, 1170, A * sstep(51.0, 51.4, t), { size: 32, fill: 'rgba(0,0,0,.55)' });
  }
}

// ======================================================================== 原理：盯久了，细胞会“累”
function sceneWhy(t) {
  if (t < 53.8 || t > 60.3) return;
  const A = sstep(53.9, 54.4, t) * (1 - sstep(59.7, 60.2, t));
  ctx.save(); ctx.globalAlpha = A;
  typeText('盯久了，细胞会“累”', 540, 450, { ...BIG, size: 64, weight: 900 }, prog(t, 54.1, 54.9), 1);
  const rows = [[700, '#e8963a', '#3d8fe6', '一直看橙色', '补出蓝色', 54.6], [970, '#d65fe0', '#4cc25a', '一直看紫色', '补出绿色', 56.2]];
  for (const [y, c1, c2, s1, s2, t0] of rows) {
    const k = E.out(prog(t, t0, t0 + .6)), k2 = E.out(prog(t, t0 + .9, t0 + 1.5));
    circ(250, y, 74 * k, c1);
    text(s1, 250, y + 112, { font: SANS, size: 32, weight: 700, align: 'center', alpha: k });
    // 中间：一个累了的小细胞（闭眼 + zzz）
    if (k > 0) {
      ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(255,255,255,.06)';
      ctx.beginPath(); ctx.ellipse(540, y, 62, 50, 0, 0, TAU); ctx.fill(); ctx.stroke();
      for (const dx of [-20, 20]) { ctx.beginPath(); ctx.arc(540 + dx, y - 4, 10, .15 * PI, .85 * PI); ctx.stroke(); }
      ctx.restore();
      for (let i = 0; i < 3; i++) { const p = ((t - t0) * .45 + i / 3) % 1; text('z', 590 + 26 * p + i * 6, y - 60 - 70 * p, { font: SANS, size: 24 + 10 * p, weight: 700, color: CREAM, alpha: k * (1 - p) }); }
    }
    if (k2 > 0) {
      ctx.save(); ctx.globalAlpha *= k2; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(630, y); ctx.lineTo(720, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(706, y - 12); ctx.lineTo(722, y); ctx.lineTo(706, y + 12); ctx.stroke();
      ctx.restore();
      circ(830, y, 74 * k2, c2);
      text(s2, 830, y + 112, { font: SANS, size: 32, weight: 700, align: 'center', color: GOLD, alpha: k2 });
    }
  }
  ctx.restore();
}

// ======================================================================== 结尾：你看到的，不全是真的 → 评论区 → 片尾
function sceneEnd(t) {
  if (t < 59.8) return;
  const A = sstep(59.9, 60.4, t) * (1 - sstep(63.9, 64.3, t));
  if (A > 0) {
    bigEye(540, 610, .9, t, E.out(prog(t, 60.0, 60.5)) * blink(t, 61.6), A);
    typeText('你看到的', 540, 830, { ...BIG, size: 84, weight: 900 }, prog(t, 60.2, 60.8), A);
    typeText('不全是真的', 540, 950, { ...BIG, size: 100, weight: 900, color: ORANGE, glow: `rgba(${O_RGB},.5)`, glowBlur: 34 }, prog(t, 60.9, 61.6), A);
    typeText('是大脑帮你“猜”的', 540, 1070, { size: 44, weight: 700, font: SANS, align: 'center', color: CREAM, spread: 4, blur: 10, rise: 14 }, prog(t, 62.4, 63.1), A);
  }
  const B = sstep(64.1, 64.5, t) * (1 - sstep(67.3, 67.8, t));
  if (B > 0) {
    ctx.save(); ctx.globalAlpha = B;
    typeText('你第几关被骗了？', 540, 500, { ...BIG, size: 76, weight: 900 }, prog(t, 64.3, 64.9), 1);
    ['第1关', '第2关', '第3关'].forEach((s, i) => {
      const k = E.out(prog(t, 64.7 + i * .35, 65.1 + i * .35)), x = 230 + i * 310;
      chip(s, x, 720, k, { size: 44, sc: .8 + .2 * k, fill: 'rgba(242,161,74,.14)', stroke: 'rgba(242,161,74,.65)' });
      text(['大小', '明暗', '颜色'][i], x, 820, { font: SANS, size: 32, weight: 700, align: 'center', color: DIM, alpha: k });
    });
    const c = sstep(65.8, 66.2, t), bob = 10 * Math.sin((t - 65.8) * 6);
    text('评论区告诉我', 540, 960, { size: 60, weight: 900, align: 'center', color: GOLD, alpha: c, glow: `rgba(${O_RGB},.4)`, blur: 26 });
    if (c > 0) { ctx.save(); ctx.globalAlpha *= c; ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(510, 1040 + bob); ctx.lineTo(540, 1072 + bob); ctx.lineTo(570, 1040 + bob); ctx.stroke(); ctx.restore(); }
    ctx.restore();
  }
  const Cd = sstep(CARD, CARD + .5, t);
  if (Cd > 0) {
    const open = E.out(prog(t, CARD + .2, CARD + .5)) * blink(t, 69.8) * (1 - sstep(71.0, 71.5, t));
    drawCat(540, 800, .72, t, Cd, open);
    text('关注 @黑猫不说话', 544, 1050, { size: 62, weight: 900, align: 'center', color: CREAM, ls: 6, alpha: sstep(CARD + .3, CARD + .7, t), glow: 'rgba(255,225,180,.25)', blur: 24 });
    text('带你看更多大脑的 bug', 542, 1140, { font: SANS, size: 36, weight: 500, align: 'center', color: ORANGE, ls: 6, alpha: sstep(CARD + .6, CARD + 1.0, t) });
  }
}

// ======================================================================== 顶部：第几关（三个点）+ 水印
const LEVELS = [[L1, '第 1 关', '大小'], [L2, '第 2 关', '明暗'], [L3, '第 3 关', '颜色']];
function hud(t) {
  const a = sstep(2.9, 3.3, t) * (1 - sstep(53.7, 54.1, t));
  if (a > 0) {
    let cur = 0; LEVELS.forEach(([t0], i) => { if (t >= t0) cur = i; });
    const [t0, name, sub] = LEVELS[cur], k = cur ? sstep(t0, t0 + .35, t) : 1;
    text(name, 96, 296, { font: SANS, size: 40, weight: 700, color: CREAM, alpha: a * k, ls: 2 });
    font(40, 700, SANS); ctx.letterSpacing = '2px'; const w = ctx.measureText(name).width; ctx.letterSpacing = '0px';
    text('· ' + sub, 96 + w + 16, 298, { font: SANS, size: 32, weight: 500, color: ORANGE, alpha: a * k, ls: 2 });
    for (let i = 0; i < 3; i++) {
      const x = 904 + i * 40, on = i <= cur;
      ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, 296, 9, 0, TAU);
      if (on) { ctx.fillStyle = i === cur ? ORANGE : 'rgba(236,230,218,.75)'; ctx.fill(); } else { ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.restore();
    }
  }
  text('@黑猫不说话', 96, 1152, { font: SANS, size: 24, weight: 500, color: '#ffffff', alpha: .26 * sstep(2.9, 3.3, t), ls: 2 });
}

// ======================================================================== 提词版：下半屏
const PR = { size: 58, max: 900, lh: 80 };
function prompterPanel(T) {
  const t = T - LEAD;
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.62)'; ctx.beginPath(); ctx.roundRect(40, 1262, 1000, 620, 28); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.setLineDash([12, 10]); ctx.stroke(); ctx.restore();
  text('提词版 · 静音播放 · 这里是你出镜的位置', 80, 1304, { font: SANS, size: 26, weight: 500, color: DIM });
  const tc = Math.max(0, t), mm = Math.floor(tc / 60), ss = (tc % 60).toFixed(1).padStart(4, '0');
  text(`${String(mm).padStart(2, '0')}:${ss}`, 1000, 1304, { font: SANS, size: 28, weight: 700, color: DIM, align: 'right' });
  if (t < 0) {
    const n = Math.ceil(-t), f = -t - Math.floor(-t);
    text(String(n), 540, 1540, { font: SANS, size: 220, weight: 700, align: 'center', color: ORANGE, alpha: .4 + .6 * f });
    text('准备好，看镜头', 540, 1730, { font: SANS, size: 44, weight: 700, align: 'center', color: CREAM });
    text(`第一句：${LINES[0][2]}`, 540, 1820, { font: SANS, size: 30, weight: 500, align: 'center', color: DIM });
    return;
  }
  const cur = LINES.find(([a, b]) => t >= a - .15 && t <= b + .3), next = LINES.find(([a]) => a > t + .05 && (!cur || a > cur[0]));
  if (cur) {
    const ci = COUNT.findIndex((c, i) => t >= c && t < (COUNT[i + 1] ?? 48));
    if (cur === LINES[14]) {                                                         // 倒数：只放一个大数字，跟着念
      if (ci >= 0) text('五四三二一'[ci], 540, 1470, { font: SANS, size: 210, weight: 700, align: 'center', color: GOLD, alpha: 1 - .5 * ((t - COUNT[ci]) / .75) });
      text(cur[3], 540, 1640, { font: SANS, size: 34, weight: 500, align: 'center', color: '#9fb4cf' });
      if (next) text('下一句：' + next[2], 540, 1780, { font: SANS, size: 32, weight: 500, align: 'center', color: DIM });
      return;
    }
    const [a, b, s, dir] = cur, rs = runs(s), o = { size: PR.size, weight: 700, font: SANS };
    const lines = wrapRuns(rs, o, PR.max), n = rs.length, p = prog(t, a, b) * n;
    let idx = 0;
    lines.forEach((ln, li) => {
      const adv = advances(ln, o), wsum = adv.reduce((x, y) => x + y, 0);
      let x = 540 - wsum / 2; const y = 1480 + (li - (lines.length - 1) / 2) * PR.lh;
      ln.forEach((c, i) => { const k = clamp(p - idx); text(c.ch, x, y, { font: SANS, size: PR.size, weight: 700, color: k > .5 ? ORANGE : CREAM }); x += adv[i]; idx++; });
    });
    if (dir) text(dir, 540, 1630, { font: SANS, size: 34, weight: 500, align: 'center', color: '#9fb4cf' });
  } else if (next) {
    const prev = [...LINES].reverse().find(([, b]) => b < t), t0 = prev ? prev[1] + .3 : 0, k = prog(t, t0, next[0] - .15);
    text('（停）', 540, 1480, { font: SANS, size: 44, weight: 500, align: 'center', color: DIM });
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(240, 1560, 600, 6); ctx.fillStyle = ORANGE; ctx.fillRect(240, 1560, 600 * k, 6);
  }
  if (next) {
    font(32, 500, SANS); let s = '下一句：' + next[2];
    while (ctx.measureText(s).width > 900 && s.length > 6) s = s.slice(0, -2) + '…';
    text(s, 540, 1780, { font: SANS, size: 32, weight: 500, align: 'center', color: DIM });
  }
}

// ======================================================================== 一帧（覆盖引擎的 render：这一期不加泛光、暗角、颗粒和旁白字幕）
function WORLD(t) {
  background();
  sceneHook(t); sceneSize(t); sceneShade(t); sceneColor(t); sceneWhy(t); sceneEnd(t);
}
function SAMPLES(t) {
  const moving = [[2.5, 3.5], [8.95, 10.6], [11.8, 12.7], [26.3, 28.1], [53.6, 54.5], [59.8, 60.5], [63.9, 64.6], [67.2, 68.1]];
  return moving.some(([a, b]) => t > a && t < b) ? 3 : 1;
}
function render(T) {
  T = clamp(T, 0, TOTAL - 1e-4);
  const t = Math.max(0, T - LEAD), n = Math.max(1, SAMPLES(t) | 0);
  reset(OUT);
  for (let k = 0; k < n; k++) {
    const tk = n === 1 ? t : Math.max(0, t + (k / (n - 1) - .5) * SHUTTER / FPS);
    ctx = n === 1 ? OUT : LCTX; reset(ctx); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    WORLD(tk);
    if (n > 1) { reset(OUT); OUT.globalAlpha = 1 / (k + 1); OUT.drawImage(LAYER, 0, 0); }
  }
  ctx = OUT; reset(OUT);
  hud(t); reset(OUT);
  if (PROMPTER) {
    if (T < LEAD) { OUT.fillStyle = 'rgba(0,0,0,.45)'; OUT.fillRect(0, 0, W, 1250); }
    prompterPanel(T); reset(OUT);
  }
  const dark = sstep(BODY - .7, BODY, t);
  if (dark > 0) { OUT.fillStyle = `rgba(0,0,0,${dark})`; OUT.fillRect(0, 0, W, H); }
}
function BLOOM_K() { return 0; }
function OVER() {}
function MASTER() { return 1; }
function INIT() {}

// ======================================================================== 音效提示表（音高都在 D 大调里）
const NOTE = { D3: 146.83, Fs3: 185.0, A3: 220.0, D4: 293.66, Fs4: 369.99, A4: 440.0, B4: 493.88, D5: 587.33, E5: 659.26, Fs5: 739.99, Gs5: 830.61, A5: 880.0, D6: 1174.66 };
const D_SHIM = [NOTE.A5, NOTE.D6, NOTE.Fs5, NOTE.E5 * 2, NOTE.Gs5 * 2], D_SWELL = [73.42, 110.0, 146.83, 185.0, 220.0];
function CUES() {
  const c = [];
  c.push([0.0, 'shimmer', { f: D_SHIM, gain: .16 }], [2.55, 'whoosh', { dur: .6, gain: .2 }]);
  c.push([9.0, 'whoosh', { dur: .7, gain: .18 }], [9.8, 'swish', { dur: .6, gain: .12 }]);
  c.push([REV1, 'chord', { f: [NOTE.D4, NOTE.Fs4, NOTE.A4], gain: .14 }], [REV1 + .05, 'tink', { f: NOTE.D6, gain: .1 }]);
  c.push([11.85, 'swish', { dur: .7, gain: .14 }], [16.3, 'tick', { gain: .08 }], [16.6, 'tick', { gain: .08 }]);
  c.push([BARS0, 'bar', { f0: 300, f1: 600, dur: 1.5, gain: .08 }]);
  c.push([REV2, 'chord', { f: [NOTE.D4, NOTE.Fs4, NOTE.A4], gain: .14 }], [REV2 + .05, 'tink', { f: NOTE.A5, gain: .1 }], [21.8, 'suck', { dur: 1.2, gain: .12 }]);
  c.push([24.2, 'page', { gain: .1 }], [26.4, 'whoosh', { dur: .6, gain: .2 }], [27.0, 'thud', { gain: .12 }], [27.6, 'swell', { dur: 1.2, f: D_SWELL, gain: .08 }]);
  for (let bt = 41; bt < 59; bt++) { const tt = bt * .75; if (tt >= 30.8 && tt < 44.2) c.push([tt, 'tick', { gain: .045 }]); }    // 盯点的时候：钟表走字
  COUNT.forEach((tt, i) => c.push([tt, 'tick', { gain: .16 + .02 * i }]));
  c.push([SWITCH - 1.6, 'revcym', { dur: 1.6, gain: .14 }], [SWITCH, 'shimmer', { f: D_SHIM, gain: .18 }], [SWITCH + .05, 'chord', { f: [NOTE.D4, NOTE.Fs4, NOTE.A4, NOTE.D5], gain: .1 }]);
  c.push([51.0, 'tink', { f: NOTE.Fs5, gain: .08 }], [WHY - .1, 'swish', { dur: .6, gain: .14 }], [54.6, 'tink', { f: NOTE.A5, gain: .05 }], [56.2, 'tink', { f: NOTE.Fs5, gain: .05 }]);
  c.push([END - .1, 'whoosh', { dur: .6, gain: .16 }], [61.6, 'click', { gain: .1 }]);
  [64.7, 65.05, 65.4].forEach((tt, i) => c.push([tt, 'tink', { f: [NOTE.D5, NOTE.Fs5, NOTE.A5][i], gain: .07 }]));
  c.push([CARD - .1, 'whoosh', { dur: .6, gain: .16 }], [69.0, 'chord', { f: [NOTE.D3, NOTE.Fs3, NOTE.A3, NOTE.D4], gain: .14 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
