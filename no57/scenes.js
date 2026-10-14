// ======================================================================== No.57 精英主义：越强调凭本事，越公平吗？
// 第七季·人和人之间的主义 ④。开头是一道选择题：一家把“凭本事说话”写进核心价值的公司，业绩一样的一男一女，经理会怎么发奖金？（Castilla & Benard, 2010）
// 音乐：原创配乐（music.py，升 C 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一段楼梯：四级台阶，再被风推上去一大步。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 顺风逆风（每拍一个鼓点） · 53.33 配得上（紧张） · 64.0 数顺风（只剩钢琴） · 80.0 高潮：起点 · 96.0 升 C 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), WIND = BT(56), DESERVE = BT(80), COUNT = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['奖金', 0, LIFT], ['写在墙上', LIFT, WIND], ['顺风逆风', WIND, DESERVE], ['配得上', DESERVE, COUNT], ['数顺风', COUNT, CLIMAX], ['起点', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.57';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '一家公司，把“凭本事说话”写进了核心价值。'],
  [4.1, 7.6, '业绩一样的一男一女，经理会怎么发奖金？先猜一个。'],
  [8.2, 10.4, '答案是 C：男员工平均多拿约 46 美元。'],
  [10.8, 13.3, '换一家没强调“凭本事”的公司，'],
  [13.6, 15.7, '这个差距，反而倒了过来。'],
  [16.3, 19.6, '研究者的解释是：'],
  [19.9, 23.7, '越相信“我们这里最公平”，越不去检查自己。'],
  [24.0, 27.4, '公平写在墙上，不等于做在了手上。'],
  [27.7, 31.3, '“凭本事”是个好理想，可它容易让人以为，已经做到了。'],
  [31.6, 35.3, '这就是「精英主义」的悖论：越信它，越难做到它。'],
  [37.6, 40.6, '还有一个偏差，让“凭本事”更难看清：'],
  [40.9, 44.6, '我们清楚记得，自己顶过的每一阵逆风；'],
  [44.9, 48.6, '却很少注意，一路推着自己走的顺风。'],
  [48.9, 52.9, '于是成功了，就容易觉得：全靠我自己。'],
  [53.6, 57.6, '哲学家桑德尔担心，这样下去：'],
  [57.9, 60.6, '赢的人，觉得自己配得上一切；'],
  [60.8, 63.4, '没赢的人，觉得自己活该。'],
  [64.3, 67.6, '所以，努力当然值得骄傲，'],
  [67.9, 71.9, '但也可以数一数：一路上，帮过你的那些顺风。'],
  [72.2, 75.9, '看见运气，人也许会更谦虚，也更宽厚一点。'],
  [76.3, 79.6, '哲学家罗尔斯写过：'],
  [84.9, 88.6, '天赋和起点，很多时候是抽到的；'],
  [88.9, 92.6, '能决定的，是拿到之后，怎么对待别人。'],
  [98.4, 103.0, '评论区：你觉得自己现在拥有的，有几成是运气？'],
];
const BIGLINES = [
  [80.2, 92.6, '「没有人应得他更高的天赋，也没有人配得上一个更有利的起点。」—— 罗尔斯（大意）'],
  [93.4, 98.0, '努力值得骄傲，运气值得感谢。'],
];

// ======================================================================== 共用
function space() {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, '#12141c'); g.addColorStop(.55, '#08090f'); g.addColorStop(1, '#020305');
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [WIND - .5, .2], [WIND, .06], [COUNT, .06],
  [COUNT + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
function warmth(a, x = 540, y = 980, r = 900, rgb = '255,170,90') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${.16 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
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
function drawOn(build, len, k, col, lw, a = 1, glowCol) {
  if (k <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 14; }
  ctx.setLineDash([len * clamp(k), len + 10]); ctx.beginPath(); build(); ctx.stroke(); ctx.restore();
}
function you(x, y, t, a = 1, r = 9) {
  if (a <= 0) return;
  const pulse = (t * .75) % 1;
  ctx.save(); ctx.globalAlpha = a * (1 - pulse) * .45; ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, r + 4 + pulse * 44, 0, TAU); ctx.stroke(); ctx.restore();
  glow(x, y, r, O_RGB, a, 6);
}
function pill(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 30; font(size, o.weight || 500, SANS); const w = Math.max(o.minW || 0, ctx.measureText(s).width + 64);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 28; }
  ctx.fillStyle = o.fill || 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 1.1, w, size * 2.2, size * 1.1); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.6; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 500, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
const big = { align: 'center', spread: 3, blur: 14, rise: 18 };

// ======================================================================== 人、牌匾、员工卡、风、领奖台、跑道
const PINK = '#f0a0a0', GOLD = '#ffd2a0', TEALC = '#7fe3d3', WARMC = '#ffb36b', GREYP = '#9aa3b2';
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function plaque(x, y, s, a, label, glowK = 0) {                                                       // 墙上的牌匾
  if (a <= 0) return;
  font(36 * s, 900, SERIF); const w = ctx.measureText(label).width + 90 * s;
  ctx.save(); ctx.globalAlpha *= a; if (glowK > 0) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 26 * glowK; }
  ctx.fillStyle = '#3a2f22'; ctx.fillRect(x - w / 2, y - 44 * s, w, 88 * s); ctx.shadowBlur = 0;
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2 + 8 * s, y - 36 * s, w - 16 * s, 72 * s); ctx.restore();
  text(label, x, y + 2, { font: SERIF, size: 36 * s, weight: 900, align: 'center', color: GOLD, alpha: a });
}
function staffCard(x, y, a, who, col) {                                                               // 员工卡：业绩一样
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.6)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - 150, y - 110, 300, 220, 20); ctx.fill(); ctx.stroke(); ctx.restore();
  person(x - 80, y + 10, .62, a, col);
  text(who, x + 40, y - 40, { font: SERIF, size: 40, weight: 900, align: 'center', color: col, alpha: a });
  text('业绩', x + 40, y + 14, { font: SANS, size: 22, align: 'center', color: DIM, alpha: a });
  text('★★★★☆', x + 40, y + 56, { font: SANS, size: 28, align: 'center', color: GOLD, alpha: a });
}
function arrowWind(x, y, len, dir, a, col, w = 6) {                                                    // 一支风的箭头，dir = 1 往右
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + dir * len * .3, y - 10, x + dir * len * .6, y + 10, x + dir * len, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + dir * (len + 14), y); ctx.lineTo(x + dir * (len - 6), y - 12); ctx.lineTo(x + dir * (len - 6), y + 12); ctx.closePath(); ctx.fill(); ctx.restore();
}

// ======================================================================== ① 奖金（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('业绩一样的一男一女：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('奖金会怎么发？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const sw = sstep(10.8, 11.3, t);
  plaque(540, 790, 1.0, 1 - sw, '凭本事说话', .5);
  plaque(540, 790, .8, sw, '没强调“凭本事”');
  const P = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t);
  staffCard(320, 1060, P, '男', TEALC); staffCard(760, 1060, P, '女', WARMC);
  text('=', 540, 1066, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: P });
  const C = sstep(Q.REVEAL + .1, Q.REVEAL + .5, t);
  if (C > 0) {
    const base = 1210, k = E.out(prog(t, Q.REVEAL + .2, Q.REVEAL + 1.2)), u = 300 / 420;
    const vM = lerp(419, 368, sw), vF = lerp(372, 420, sw);
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(220, base); ctx.lineTo(860, base); ctx.stroke();
    ctx.fillStyle = TEALC; ctx.fillRect(330, base - vM * u * k, 120, vM * u * k); ctx.fillStyle = WARMC; ctx.fillRect(630, base - vF * u * k, 120, vF * u * k); ctx.restore();
    text('$' + Math.round(vM), 390, base - vM * u * k - 28, { font: SERIF, size: 40, weight: 900, align: 'center', color: TEALC, alpha: C * k });
    text('$' + Math.round(vF), 690, base - vF * u * k - 28, { font: SERIF, size: 40, weight: 900, align: 'center', color: WARMC, alpha: C * k });
    text('男', 390, base + 44, { font: SERIF, size: 30, weight: 900, align: 'center', color: TEALC, alpha: C });
    text('女', 690, base + 44, { font: SERIF, size: 30, weight: 900, align: 'center', color: WARMC, alpha: C });
    text('平均奖金 · 业绩完全一样', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: C });
  }
  text('写着“凭本事”的公司', 540, 560, { font: SERIF, size: 46, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL + 1.4, Q.REVEAL + 1.8, t) * (1 - sstep(10.6, 11.0, t)) });
  text('C · 男的多', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(Q.REVEAL + 1.2, Q.REVEAL + 1.5, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('换一家：差距倒过来了', 540, 560, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 一样多', 200], ['B · 女的多', 540], ['C · 男的多', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
  ['3', '2', '1'].forEach((s, i) => {
    const t0 = [Q.c3, Q.c2, Q.c1][i], v = prog(t, t0, t0 + 1.28); if (v <= 0 || v >= 1) return;
    const k = 1.5 - .5 * E.outExpo(v * 2.5), al = 1 - sstep(.62, 1, v);
    const bg = ctx.createRadialGradient(540, 900, 0, 540, 900, 230); bg.addColorStop(0, `rgba(6,7,11,${.88 * al})`); bg.addColorStop(1, 'rgba(6,7,11,0)'); ctx.fillStyle = bg; ctx.fillRect(300, 660, 480, 480);
    ctx.save(); ctx.translate(540, 900); ctx.scale(k, k);
    text(s, 0, 8, { font: SERIF, size: 210, weight: 900, align: 'center', color: CREAM, alpha: al, glow: 'rgba(255,240,220,.4)', blur: 30 });
    ctx.restore();
  });
  ctx.restore();
}

// ======================================================================== ② 标题 · 写在墙上
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('精英主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('MERITOCRACY', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ④', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneWall(t) {
  if (t < 19.7 || t > WIND + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(WIND - .6, WIND - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('越信“最公平”，越不检查', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('写在墙上 ≠ 做在手上', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('以为，已经做到了', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    plaque(540, 820, 1.0, D, '我们这里最公平', .4 + .4 * Math.sin(t * 2) ** 2);
    const S1 = D * (1 - sstep(23.8, 24.2, t));                                                         // 放大镜被放到一边：不检查了
    if (S1 > 0) {
      const d = E.io(prog(t, 21.2, 22.6));
      person(540, 1130, 1.0, S1, CREAM);
      ctx.save(); ctx.globalAlpha = S1 * (1 - .6 * d); ctx.translate(lerp(640, 820, d), lerp(1000, 1180, d)); ctx.rotate(-.9 * d); ctx.strokeStyle = CREAM; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 38, 0, TAU); ctx.stroke(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(28, 28); ctx.lineTo(66, 66); ctx.stroke(); ctx.restore();
      text('检查自己', 820, 1250, { font: SANS, size: 26, align: 'center', color: DIM, alpha: S1 * d });
    }
    const S2 = D * sstep(24.1, 24.5, t) * (1 - sstep(27.4, 27.8, t));
    if (S2 > 0) {                                                                                       // 一架歪着的天平
      const cx = 540, cy = 1040, tilt = .18;
      ctx.save(); ctx.globalAlpha = S2; ctx.strokeStyle = CREAM; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, 1240); ctx.moveTo(cx - 70, 1240); ctx.lineTo(cx + 70, 1240); ctx.stroke();
      ctx.translate(cx, cy); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-220, 0); ctx.lineTo(220, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-220, 0); ctx.lineTo(-250, 60); ctx.lineTo(-190, 60); ctx.closePath(); ctx.moveTo(220, 0); ctx.lineTo(190, 60); ctx.lineTo(250, 60); ctx.closePath(); ctx.stroke(); ctx.restore();
      text('手上', 540, 1290, { font: SANS, size: 26, align: 'center', color: PINK, alpha: S2 });
    }
    const S3 = D * sstep(27.8, 28.2, t);
    if (S3 > 0) {
      ctx.save(); ctx.globalAlpha = S3; ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.strokeRect(380, 1000, 80, 80); ctx.restore();
      drawOn(() => { ctx.moveTo(392, 1040); ctx.lineTo(414, 1066); ctx.lineTo(452, 1010); }, 100, prog(t, 28.2, 28.7), GOLD, 7, S3, GOLD);
      text('公平', 560, 1050, { font: SERIF, size: 48, weight: 900, align: 'center', color: GOLD, alpha: S3 });
      text('?', 680, 1050, { font: SERIF, size: 64, weight: 900, align: 'center', color: PINK, alpha: S3 * sstep(29.4, 29.8, t) * (.6 + .4 * Math.sin(t * 6)) });
      text('自己打的勾', 540, 1150, { font: SANS, size: 26, align: 'center', color: DIM, alpha: S3 * sstep(28.8, 29.2, t) });
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('精英主义的悖论', 540, 860, { ...big, size: 76, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('越信它，越难做到它', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 顺风逆风
function sceneWind(t) {
  if (t < WIND - .3 || t > DESERVE + .2) return;
  const A = sstep(WIND - .1, WIND + .5, t) * (1 - sstep(DESERVE - .6, DESERVE - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - WIND) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('还有一个偏差', 37.7, 40.6, CREAM);
  hd('逆风：记得清清楚楚', 41.0, 44.6, PINK, 'rgba(229,72,77,.4)');
  hd('顺风：很少注意', 45.0, 48.6, TEALC);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('“全靠我自己”', 0, 0, { font: SERIF, size: 56, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(49.0, 49.5, t), glow: `rgba(${O_RGB},.4)`, blur: 16 }); ctx.restore();
  const R = A * (1 - sstep(48.7, 49.1, t));
  if (R > 0) {
    const px = 540 + 8 * bk;
    person(px, 1100, 1.1, R, CREAM);
    ctx.save(); ctx.globalAlpha = R * .5; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, 1140); ctx.lineTo(960, 1140); ctx.stroke(); ctx.restore();
    const H = R * sstep(40.9, 41.3, t), Tw = R * sstep(44.9, 45.3, t);
    for (let i = 0; i < 3; i++) {                                                                         // 逆风：迎面吹来，又粗又亮
      const x = 960 - ((t * 120 + i * 90) % 260);
      arrowWind(x, 930 + i * 70, 150, -1, H * (.6 + .4 * bk), PINK, 7);
    }
    for (let i = 0; i < 3; i++) {                                                                         // 顺风：在背后推，淡淡的
      const x = 120 + ((t * 120 + i * 90) % 260);
      arrowWind(x, 930 + i * 70, 150, 1, Tw * (.22 + .08 * Math.sin(t * 3 + i)), TEALC, 3);
    }
    text('逆风', 880, 880, { font: SERIF, size: 34, weight: 900, align: 'center', color: PINK, alpha: H });
    text('顺风', 200, 880, { font: SERIF, size: 34, weight: 900, align: 'center', color: TEALC, alpha: Tw * .7 });
  }
  const P = A * sstep(49.0, 49.4, t);
  if (P > 0) {                                                                                          // 领奖台和一束追光
    ctx.save(); ctx.globalAlpha = P * .35; const g = ctx.createLinearGradient(540, 760, 540, 1160); g.addColorStop(0, 'rgba(255,214,160,.9)'); g.addColorStop(1, 'rgba(255,214,160,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(500, 760); ctx.lineTo(580, 760); ctx.lineTo(680, 1160); ctx.lineTo(400, 1160); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = P; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.fillRect(440, 1100, 200, 130); ctx.strokeRect(440, 1100, 200, 130); ctx.restore();
    text('1', 540, 1170, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: P });
    person(540, 1070, 1.0, P, GOLD);
  }
}

// ======================================================================== ④ 配得上
function sceneDeserve(t) {
  if (t < DESERVE - .3 || t > COUNT + .2) return;
  const A = sstep(DESERVE - .1, DESERVE + .5, t) * (1 - sstep(COUNT - .7, COUNT - .1, t));
  if (A <= 0) return;
  text('桑德尔的担心', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('赢的人：配得上一切', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('没赢的人：活该', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: PINK, alpha: A * sstep(60.9, 61.4, t), glow: 'rgba(229,72,77,.4)', blur: 16 });
  const N = A * sstep(53.8, 54.3, t) * (1 - sstep(57.6, 58.0, t));
  if (N > 0) {
    person(540, 1010, 1.2, N, CREAM);
    text('迈克尔·桑德尔', 540, 1110, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: N });
    text('《精英的傲慢》 · 2020', 540, 1170, { font: SANS, size: 28, align: 'center', color: DIM, alpha: N * sstep(54.4, 54.8, t) });
  }
  const S = A * sstep(58.0, 58.4, t);
  if (S > 0) {                                                                                          // 高台上的人，和台下的人
    ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.fillRect(420, 900, 240, 330); ctx.strokeRect(420, 900, 240, 330); ctx.restore();
    person(540, 870, 1.0, S, GOLD);
    glow(540, 780, 30, O_RGB, S * .5, 8);
    const low = A * sstep(60.9, 61.3, t);
    for (let i = 0; i < 6; i++) { const x = i < 3 ? 160 + i * 80 : 760 + (i - 3) * 80; person(x, 1220, .62, Math.max(S * .5, low), mixGrey(low)); }
    text('配得上', 700, 840, { font: SANS, size: 28, align: 'left', color: GOLD, alpha: S * sstep(58.4, 58.8, t) });
    text('活该？', 240, 1280, { font: SANS, size: 28, align: 'center', color: PINK, alpha: low });
    text('活该？', 840, 1280, { font: SANS, size: 28, align: 'center', color: PINK, alpha: low });
  }
}
function mixGrey(k) { return k > .5 ? '#c99090' : GREYP; }

// ======================================================================== ⑤ 数顺风
function sceneCount(t) {
  if (t < COUNT - .2 || t > CLIMAX + .3) return;
  const A = sstep(COUNT + .2, COUNT + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('努力，值得骄傲', 64.5, 67.6, GOLD);
  hd('数一数，那些顺风', 67.9, 71.9, TEALC, `rgba(${T_RGB},.4)`);
  hd('更谦虚，也更宽厚', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('罗尔斯写过：', 76.4, 0, CREAM);
  const bow = sstep(72.4, 73.4, t);
  person(540, 1150, 1.1, A, CREAM, 1 - .08 * bow);
  const S1 = A * sstep(64.6, 65.1, t) * (1 - sstep(67.6, 68.0, t));
  if (S1 > 0) for (let i = 0; i < 5; i++) {                                                             // 一级级台阶
    ctx.save(); ctx.globalAlpha = S1 * sstep(64.8 + i * .3, 65.1 + i * .3, t); ctx.strokeStyle = GOLD; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(640 + i * 60, 1180 - i * 50); ctx.lineTo(700 + i * 60, 1180 - i * 50); ctx.lineTo(700 + i * 60, 1130 - i * 50); ctx.stroke(); ctx.restore();
  }
  const W = A * sstep(68.0, 68.4, t);
  if (W > 0) {
    const items = ['家人', '老师', '健康', '时代', '一次好运气'];
    items.forEach((s, i) => {
      const a = -PI + .25 + i * (PI - .5) / 4, x = 540 + 330 * Math.cos(a), y = 1060 + 230 * Math.sin(a);
      const k = W * sstep(68.4 + i * .5, 68.8 + i * .5, t);
      pill(s, x, y, k, { size: 28, stroke: `rgba(${T_RGB},.8)`, color: TEALC });
      drawOn(() => { ctx.moveTo(x + (540 - x) * .25, y + (1040 - y) * .25 + 20); ctx.lineTo(x + (540 - x) * .62, y + (1040 - y) * .62 + 10); }, 140, prog(t, 68.6 + i * .5, 69.2 + i * .5), TEALC, 3, k * .8, TEALC);
    });
  }
  const G = A * sstep(72.4, 73.0, t);
  if (G > 0) { glow(540, 1050, 60, O_RGB, G * .5, 10); for (let i = 0; i < 16; i++) { const r = mulberry(5700 + i), p = ((t - 72.4) * (.2 + .2 * r()) + r()) % 1; glow(360 + r() * 360, 1150 - p * 300, 2 + 2 * r(), O_RGB, G * (1 - p) * .8, 3); } }
}

// ======================================================================== ⑥ 起点
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const starts = [420, 260, 520, 330, 180], r = mulberry(5710);                                         // 五条跑道，起跑线各不一样
  starts.forEach((sx, i) => {
    const y = 860 + i * 92, a = A * sstep(CLIMAX + .2 + i * .15, CLIMAX + .6 + i * .15, t);
    ctx.save(); ctx.globalAlpha = a * .5; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, y + 30); ctx.lineTo(960, y + 30); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, y - 20); ctx.lineTo(sx, y + 30); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(236,230,218,.9)'; ctx.beginPath(); ctx.roundRect(70, y - 18, 40, 40, 8); ctx.fill(); ctx.restore();
    text(String(1 + Math.floor(r() * 6)), 90, y + 4, { font: SERIF, size: 26, weight: 900, align: 'center', color: '#1a1b22', alpha: a });
    const run = E.io(prog(t, CLIMAX + 2.5, CLIMAX + 9)) * 160;
    person(sx + 30 + run, y + 26, .5, a, mixc(GREYP, GOLD, fin));
  });
  if (fin > 0) {                                                                                        // 前面的人回头伸手：一道道暖光把跑道连起来
    for (let i = 0; i < 4; i++) {
      const y1 = 860 + i * 92, y2 = y1 + 92, x1 = starts[i] + 30 + 160, x2 = starts[i + 1] + 30 + 160;
      drawOn(() => { ctx.moveTo(x1, y1 - 10); ctx.lineTo(x2, y2 - 10); }, Math.hypot(x2 - x1, 92), prog(t, FINAL + .2 + i * .25, FINAL + .8 + i * .25), GOLD, 4, A, GOLD);
    }
    for (let i = 0; i < 20; i++) { const rr = mulberry(5400 + i), x = 300 + rr() * 480, v = 30 + rr() * 40, p = ((t - FINAL) * v / 420 + rr()) % 1; glow(x + 16 * Math.sin(t + i), 1300 - p * 480, 2 + 2 * rr(), O_RGB, fin * (1 - p) * .8, 3); }
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('没有人应得他更高的天赋，', 540, 420, { ...big, size: 50, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.5), qa);
  typeText('也没有人配得上更有利的起点。', 540, 520, { ...big, size: 52, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.7, CLIMAX + 2.9), qa);
  typeText('—— 罗尔斯《正义论》（大意）', 540, 606, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.1, CLIMAX + 3.7), qa);
  typeText('努力值得骄傲，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('运气值得感谢。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneWall(t); sceneWind(t); sceneDeserve(t); sceneCount(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2010', 'Castilla & Benard · Adm Sci Q', 8.2, 35.3, T);
  stamp('2016', 'Davidai & Gilovich · J Pers Soc Psychol', 37.6, 52.9, T);
  stamp('2020', 'Sandel · The Tyranny of Merit', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(57);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在升 C 小调里，最后一个和弦是升 C 大调）
const NOTE = { Cs3: 138.59, E3: 164.81, Es3: 174.61, Gs3: 207.65, Cs4: 277.18, E4: 329.63, Gs4: 415.30, Cs5: 554.37, E5: 659.25, Es5: 698.46, Gs5: 830.61 };
const CSM_SHIM = [NOTE.E5, NOTE.Gs4, NOTE.Cs5, NOTE.Cs4, NOTE.Gs3], CS_SHIM = [NOTE.Es5, NOTE.Gs4, NOTE.Cs5, NOTE.Cs4, NOTE.Gs3], CSM_SWELL = [51.91, 69.30, 103.83, 138.59, 164.81];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.Gs4, gain: .05 }], [1.0, 'tink', { f: NOTE.Cs5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Cs3, NOTE.E3, NOTE.Gs3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Gs5, gain: .1 }]);
  c.push([Q.REVEAL + .3, 'bar', { f0: 200, f1: 400, dur: 1.0, gain: .06 }], [10.9, 'whoosh', { dur: .8, gain: .12 }], [11.0, 'bar', { f0: 400, f1: 260, dur: 1.0, gain: .06 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: CSM_SHIM, gain: .28 }]);
  c.push([21.2, 'whoosh', { dur: 1.2, gain: .08 }], [22.6, 'thud', { gain: .05 }], [24.2, 'thud', { gain: .06 }], [28.2, 'tink', { f: NOTE.E5, gain: .06 }], [29.4, 'tick', { gain: .1 }], [31.7, 'page', { gain: .18 }]);
  c.push([WIND, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'whoosh', { dur: 3.0, gain: .1 }], [45.0, 'air', { dur: 3.4, hum: 138.59, gain: .05 }]);
  c.push([49.1, 'chord', { f: [NOTE.Cs3, NOTE.E3, NOTE.Gs3], gain: .1 }], [49.2, 'tink', { f: NOTE.Cs5, gain: .07 }]);
  c.push([DESERVE, 'whoosh', { dur: .5, gain: .22 }], [58.1, 'tink', { f: NOTE.Gs5, gain: .06 }], [61.0, 'bar', { f0: 260, f1: 160, dur: 1.2, gain: .06 }]);
  c.push([64.8, 'tick', { gain: .08 }], [65.1, 'tick', { gain: .08 }], [65.4, 'tick', { gain: .08 }], [65.7, 'tick', { gain: .08 }], [66.0, 'tick', { gain: .08 }]);
  for (let i = 0; i < 5; i++) c.push([68.4 + i * .5, 'tink', { f: [NOTE.Cs4, NOTE.E4, NOTE.Gs4, NOTE.Cs5, NOTE.E5][i], gain: .05 }]);
  c.push([72.4, 'swell', { dur: 3.0, f: CSM_SWELL, gain: .1 }], [76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: CSM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: CSM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 69.30, gain: .14 }]);
  for (let i = 0; i < 5; i++) c.push([CLIMAX + .3 + i * .15, 'tick', { gain: .1 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: CS_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Cs3, NOTE.Es3, NOTE.Gs3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
