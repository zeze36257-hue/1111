// ======================================================================== No.35 相对主义：银牌，为什么没有铜牌开心？
// 第五季·看不见的主义 ②。开头是一道选择题：奥运领奖台上，银牌和铜牌，谁看起来更开心？（Medvec, Madey & Gilovich, 1995）
// 音乐：原创配乐（music.py，B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是对同一个问题的两种回答：一句往下落，一句往上爬。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 相对主义（每拍一个鼓点） · 53.33 工资单（紧张） · 64.0 尺子（只剩钢琴） · 80.0 高潮 · 96.0 B 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), REL = BT(56), PAY = BT(80), RULER = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['领奖台', 0, LIFT], ['差一点', LIFT, REL], ['相对主义', REL, PAY], ['工资单', PAY, RULER], ['尺子', RULER, CLIMAX], ['万物的尺度', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.35';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '奥运领奖台上，拿银牌和拿铜牌的人，'],
  [4.1, 7.6, '谁看起来更开心？先猜一个。'],
  [8.2, 10.4, '答案是：铜牌。'],
  [10.8, 13.3, '研究者给选手的表情打分，满分 10 分：'],
  [13.6, 15.7, '银牌 4.8，铜牌 7.1。'],
  [16.3, 19.6, '这是 1992 年，巴塞罗那奥运会的录像研究。'],
  [19.9, 23.7, '银牌想的是：「差一点就是金牌」；'],
  [24.0, 27.4, '铜牌想的是：「差一点就没牌了」。'],
  [27.7, 31.3, '同样是差一点，比的对象不一样。'],
  [31.6, 35.3, '2021 年，有人用表情识别软件，重做了一遍，结果一样。'],
  [37.6, 40.6, '这就是「相对主义」：好坏，都是比出来的。'],
  [40.9, 44.6, '一项调查问：你挣 5 万、别人挣 2.5 万；'],
  [44.9, 48.6, '还是你挣 10 万、别人挣 20 万？'],
  [48.9, 52.9, '约一半的人，宁愿少挣一半，也要比别人多。'],
  [53.6, 57.6, '后来，一家报纸把加州大学员工的工资，全放上了网。'],
  [57.9, 63.4, '发现自己比同事低的人，满意度下降；比同事高的人，并没有更开心。'],
  [64.3, 67.6, '比较，是人改不掉的习惯。'],
  [67.9, 71.9, '但比什么、跟谁比，是你可以选的。'],
  [72.2, 75.9, '「相对主义」最早的一句话，'],
  [76.3, 79.6, '来自古希腊的普罗泰戈拉：'],
  [84.9, 88.6, '尺子在你手里，'],
  [88.9, 92.6, '别总拿最高的那一格，量自己。'],
  [98.4, 103.0, '评论区：你最常拿自己跟谁比？'],
];
const BIGLINES = [
  [80.2, 92.6, '「人是万物的尺度。」—— 普罗泰戈拉'],
  [93.4, 98.0, '换个参照物，你没那么差。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [REL - .5, .2], [REL, .06], [RULER, .06],
  [RULER + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人（带表情）、奖牌、领奖台
function person(x, y, s, a, col = CREAM, mood = null) {                                       // mood：-1 撇嘴 … 0 平 … 1 笑
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  if (mood !== null) { ctx.shadowBlur = 0; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(-9, -74); ctx.quadraticCurveTo(0, -74 + 9 * mood, 9, -74); ctx.stroke(); }
  ctx.restore();
}
const MEDAL = { 1: ['#f2c76a', '242,199,106'], 2: ['#c9d1dc', '201,209,220'], 3: ['#c98a5a', '201,138,90'] };
function medal(x, y, r, rank, a, dashed = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (dashed) { ctx.strokeStyle = 'rgba(154,163,178,.7)'; ctx.lineWidth = 2.5; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); return; }
  const [col, rgb] = MEDAL[rank]; ctx.fillStyle = col; ctx.shadowColor = `rgba(${rgb},.7)`; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(40,30,20,.45)'; ctx.lineWidth = Math.max(1.5, r * .08); ctx.beginPath(); ctx.arc(x, y, r * .72, 0, TAU); ctx.stroke();
  ctx.restore();
  if (r > 24) text(String(rank), x, y + 2, { font: LAT, size: r * .9, weight: 700, align: 'center', color: 'rgba(40,30,20,.75)', alpha: a });
}
const POD = [[2, 300, 1010], [1, 540, 940], [3, 780, 1050]];                                    // 名次, x, 台面高度
function podium(a, moods) {
  if (a <= 0) return;
  POD.forEach(([rank, x, top], i) => {
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,34,44,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.rect(x - 110, top, 220, 1130 - top); ctx.fill(); ctx.stroke(); ctx.restore();
    text(String(rank), x, top + (1130 - top) / 2 + 4, { font: LAT, size: 44, weight: 700, align: 'center', color: 'rgba(236,230,218,.5)', alpha: a });
    person(x, top - 34, 1.15, a, rank === 1 ? '#f2c76a' : CREAM, moods ? moods[rank] : 0);
    medal(x, top - 60, 16, rank, a);
  });
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
function arrow(x0, y0, x1, y1, col, a, k = 1) {
  if (a <= 0 || k <= 0) return;
  const x = lerp(x0, x1, k), y = lerp(y0, y1, k), an = Math.atan2(y1 - y0, x1 - x0);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * 6, y + Math.sin(an) * 6); ctx.lineTo(x - Math.cos(an - .5) * 22, y - Math.sin(an - .5) * 22); ctx.lineTo(x - Math.cos(an + .5) * 22, y - Math.sin(an + .5) * 22); ctx.closePath(); ctx.fill(); ctx.restore();
}
function ebbing(cx, cy, r, ring, rr, dist, a, hot = 0) {                                        // 艾宾浩斯错觉：周围的圆决定中间的圆看起来多大
  if (a <= 0) return;
  for (let i = 0; i < ring; i++) { const an = i / ring * TAU - PI / 2; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(154,163,178,.55)'; ctx.beginPath(); ctx.arc(cx + Math.cos(an) * dist, cy + Math.sin(an) * dist, rr, 0, TAU); ctx.fill(); ctx.restore(); }
  if (hot > 0) glow(cx, cy, r * .6, O_RGB, a * hot, 4);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = ORANGE; ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.restore();
}

// ======================================================================== ① 领奖台（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('银牌和铜牌：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('谁看起来更开心？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const m = E.io(prog(t, Q.REVEAL, Q.REVEAL + .8));
  podium(1 - sstep(10.5, 11.0, t), { 1: 1, 2: -.8 * m, 3: .9 * m });
  const ca = sstep(10.8, 11.3, t);                                                               // 开心程度：4.8 vs 7.1
  if (ca > 0) {
    const base = 1240, g1 = E.out(prog(t, 11.0, 12.0)), g2 = E.out(prog(t, 13.7, 14.7));
    text('开心程度（满分 10）', 540, 540, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: ca });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, ca);
    bar(380, base, 150, 60 * 4.8 * g1, MEDAL[2][1], ca); bar(700, base, 150, 60 * 7.1 * g2, MEDAL[3][1], ca);
    text('4.8', 380, base - 60 * 4.8 * g1 - 40, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#dfe5ee', alpha: ca * sstep(11.6, 12.0, t) });
    text('7.1', 700, base - 60 * 7.1 * g2 - 40, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#f0c49a', alpha: ca * sstep(14.2, 14.6, t) });
    medal(380, base + 44, 14, 2, ca); text('银牌', 412, base + 46, { font: SANS, size: 28, color: '#c9d1dc', alpha: ca });
    medal(700, base + 44, 14, 3, ca * sstep(13.6, 14.0, t)); text('铜牌', 732, base + 46, { font: SANS, size: 28, color: '#d9a27a', alpha: ca * sstep(13.6, 14.0, t) });
  }
  text('B · 铜牌', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 银牌', 220], ['B · 铜牌', 540], ['C · 差不多', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 差一点 · 2021 年重做
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('相对主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('RELATIVISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ②', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneAlmost(t) {
  if (t < 19.7 || t > REL + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(REL - .6, REL - .05, t));
  if (A <= 0) return;
  const C = A * (1 - sstep(31.0, 31.5, t));
  if (C > 0) {
    const L = C * sstep(19.9, 20.4, t), R = C * sstep(24.0, 24.5, t);
    medal(300, 740, 40, 1, L); arrow(300, 950, 300, 800, 'rgba(240,160,160,.85)', L, E.out(prog(t, 20.2, 21.0)));
    medal(300, 1010, 50, 2, L); text('差一点就是金牌', 300, 1140, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#f0a0a0', alpha: L * sstep(20.6, 21.0, t) });
    medal(780, 800, 50, 3, R); arrow(780, 870, 780, 1010, 'rgba(127,227,211,.85)', R, E.out(prog(t, 24.3, 25.1)));
    medal(780, 1070, 40, 3, R, 1); text('第 4 名', 780, 1072, { font: SERIF, size: 26, weight: 900, align: 'center', color: '#9aa3b2', alpha: R });
    text('差一点就没牌了', 780, 1200, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#7fe3d3', alpha: R * sstep(24.7, 25.1, t) });
    text('比的对象不一样', 540, 620, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: C * sstep(27.7, 28.2, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  }
  const F = A * sstep(31.6, 32.1, t);                                                             // 2021 年：表情识别软件
  if (F > 0) {
    typeText('2021 · 413 位奖牌得主', 540, 640, { ...big, size: 48, weight: 900 }, prog(t, 31.7, 32.5), F);
    [[1, 300, .9], [2, 540, -.4], [3, 780, .6]].forEach(([rank, x, mood], i) => {
      const a = F * sstep(32.2 + i * .25, 32.6 + i * .25, t), [col] = MEDAL[rank];
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(16,17,23,.9)';
      ctx.beginPath(); ctx.arc(x, 960, 80, 0, TAU); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x - 26, 940, 6, 0, TAU); ctx.arc(x + 26, 940, 6, 0, TAU); ctx.fill();
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 32, 990); ctx.quadraticCurveTo(x, 990 + 34 * mood, x + 32, 990); ctx.stroke(); ctx.restore();
      medal(x, 1090, 16, rank, a);
    });
    text('笑得最多：金 > 铜 > 银', 540, 1200, { font: SERIF, size: 40, weight: 900, align: 'center', color: CREAM, alpha: F * sstep(33.4, 33.9, t) });
  }
}

// ======================================================================== ③ 相对主义：一样大的圆 · 你选哪个
function sceneRel(t) {
  if (t < REL - .3 || t > PAY + .2) return;
  const A = sstep(REL - .1, REL + .5, t) * (1 - sstep(PAY - .6, PAY - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - REL) / BEAT) % 1);
  const D = A * (1 - sstep(40.5, 40.9, t));
  if (D > 0) {
    typeText('相对主义', 540, 640, { ...big, size: 64, weight: 900 }, prog(t, 37.7, 38.4), D);
    typeText('好坏，都是比出来的', 540, 730, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 38.3, 39.1), D);
    ebbing(310, 1010, 36, 6, 66, 128, D * sstep(38.0, 38.5, t));
    ebbing(770, 1010, 36, 8, 14, 64, D * sstep(38.3, 38.8, t));
    text('两个橙色的圆，一样大', 540, 1240, { font: SERIF, size: 38, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(39.2, 39.6, t) });
  }
  const K = A * sstep(40.9, 41.3, t);
  if (K > 0) {
    typeText('你选哪个？', 540, 640, { ...big, size: 60, weight: 900 }, prog(t, 41.0, 41.6), K);
    text('一项小调查 · 约 250 人', 540, 730, { font: SANS, size: 26, align: 'center', color: '#6f7786', alpha: K });
    const pick = sstep(48.9, 49.4, t);
    [['A', 300, 5, 2.5, 40.9], ['B', 780, 10, 20, 44.9]].forEach(([lab, cx, me, them, t0], i) => {
      const a = K * sstep(t0, t0 + .4, t), hot = i === 0 ? pick : 0, sc = 1 + (hot ? .04 * bk : 0);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, 1000); ctx.scale(sc, sc);
      ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.strokeStyle = hot ? ORANGE : 'rgba(236,230,218,.35)'; ctx.lineWidth = hot ? 3.5 : 2; if (hot) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 24 * hot; }
      ctx.beginPath(); ctx.roundRect(-200, -170, 400, 340, 22); ctx.fill(); ctx.stroke(); ctx.restore();
      text(lab, cx, 870, { font: LAT, size: 54, weight: 700, align: 'center', color: hot ? '#ffd2a0' : CREAM, alpha: a });
      [['你', me, O_RGB, '#ffd2a0', 960], ['别人', them, '154,163,178', '#c3cad6', 1060]].forEach(([who, v, rgb, col, y]) => {
        const w = 12 * v * E.out(prog(t, t0 + .2, t0 + 1.0));
        text(who, cx - 170, y, { font: SANS, size: 26, color: col, alpha: a });
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.fillRect(cx - 110, y - 16, w, 32); ctx.restore();
        text(`${v} 万`, cx - 100 + w, y, { font: SERIF, size: 26, weight: 900, color: col, alpha: a });
      });
    });
    pill('约一半的人选 A', 540, 1260, K * pick, { size: 34, stroke: `rgba(${O_RGB},.7)`, color: '#ffd2a0', glow: `rgba(${O_RGB},.4)` });
  }
}

// ======================================================================== ④ 工资单：比同事低，满意度下降；比同事高，没有更开心
function scenePay(t) {
  if (t < PAY - .3 || t > RULER + .2) return;
  const A = sstep(PAY - .1, PAY + .5, t) * (1 - sstep(RULER - .7, RULER - .1, t));
  if (A <= 0) return;
  text('工资，全部公开', 540, 620, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) });
  const LEN = [420, 520, 360, 470, 300, 250, 390, 330], ME = 5, HI = 1, MED = 360, down = sstep(57.9, 58.4, t), flat = sstep(60.6, 61.1, t);
  LEN.forEach((L, i) => {
    const y = 720 + i * 64, a = A * sstep(53.8 + i * .2, 54.1 + i * .2, t), me = i === ME, hi = i === HI;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = me ? 'rgba(242,161,74,.9)' : 'rgba(154,163,178,.35)'; ctx.beginPath(); ctx.roundRect(120, y - 12, 110, 24, 12); ctx.fill();
    const rgb = me && down > 0 ? '229,72,77' : me ? O_RGB : '154,163,178';
    ctx.fillStyle = `rgba(${rgb},${me || (hi && flat) ? .9 : .5})`; ctx.fillRect(250, y - 16, L * E.out(prog(t, 53.9 + i * .2, 54.6 + i * .2)), 32); ctx.restore();
    if (me) text('你', 175, y + 1, { font: SERIF, size: 24, weight: 900, align: 'center', color: '#1a120a', alpha: a });
  });
  const mx = 250 + MED;
  ctx.save(); ctx.globalAlpha = A * sstep(55.4, 55.9, t); ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(mx, 690); ctx.lineTo(mx, 1200); ctx.stroke(); ctx.restore();
  text('中位数', mx, 676, { font: SANS, size: 24, align: 'center', color: '#c3cad6', alpha: A * sstep(55.4, 55.9, t) });
  const yMe = 720 + ME * 64, yHi = 720 + HI * 64;
  if (down > 0) { arrow(930, yMe - 40, 930, yMe + 40, '#e5484d', A * down, E.out(prog(t, 58.0, 58.6))); text('满意度', 890, yMe, { font: SANS, size: 26, align: 'right', color: '#f0a0a0', alpha: A * down }); }
  if (flat > 0) { arrow(870, yHi, 960, yHi, 'rgba(154,163,178,.9)', A * flat, E.out(prog(t, 60.7, 61.3))); text('没有更开心', 960, yHi - 40, { font: SANS, size: 26, align: 'right', color: '#c3cad6', alpha: A * flat }); }
}

// ======================================================================== ⑤ 尺子：参照物可以换
function sceneRuler(t) {
  if (t < RULER - .2 || t > CLIMAX + .3) return;
  const A = sstep(RULER + .2, RULER + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const R = A * (1 - sstep(71.8, 72.3, t));
  if (R > 0) {
    const y = 1000; seg(120, y, 960, y, 'rgba(236,230,218,.6)', 3, R);
    for (let i = 0; i <= 28; i++) { const x = 120 + i * 30; seg(x, y, x, y - (i % 5 ? 14 : 28), 'rgba(236,230,218,.45)', 2, R); }
    const me = 480, ref = lerp(900, 360, E.io(prog(t, 67.9, 69.6))), sw = sstep(67.9, 68.4, t);
    glow(me, y - 60, 8, O_RGB, R, 4); person(me, y - 40, .6, R, ORANGE); text('你', me, y + 50, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: R });
    medal(ref, y - 60, 22, sw > .5 ? 3 : 1, R * (1 - sw * .0));
    text(sw > .5 ? '昨天的你' : '最厉害的那个人', ref, y + 50, { font: SERIF, size: 30, weight: 900, align: 'center', color: sw > .5 ? '#7fe3d3' : '#f2c76a', alpha: R });
    ctx.save(); ctx.globalAlpha = R * .8; ctx.strokeStyle = sw > .5 ? TEAL : 'rgba(240,160,160,.8)'; ctx.lineWidth = 3; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(me, y - 110); ctx.lineTo(ref, y - 110); ctx.stroke(); ctx.restore();
    text(`差 ${Math.round(Math.abs(ref - me) / 30)} 格`, (me + ref) / 2, y - 140, { font: SERIF, size: 32, weight: 900, align: 'center', color: sw > .5 ? '#7fe3d3' : '#f0a0a0', alpha: R });
    text('比什么、跟谁比，你可以选', 540, 640, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: R * sstep(68.6, 69.1, t) });
  }
  const Hm = A * sstep(72.3, 72.8, t);
  typeText('普罗泰戈拉', 540, 860, { ...big, size: 72, weight: 900 }, prog(t, 72.4, 73.2), Hm);
  typeText('古希腊 · 约公元前 490–420 年', 540, 960, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 73.0, 73.8), Hm);
}

// ======================================================================== ⑥ 万物的尺度：换一圈参照物，圆就变大了
function sceneMeasure(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const k = E.io(prog(t, 84.9, 88.4));
  ebbing(540, 1070, 54, 8, lerp(72, 20, k), lerp(190, 102, k), A * sstep(CLIMAX + .6, CLIMAX + 1.4, t), .4 + .6 * fin);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「人是万物的尺度。」', 540, 520, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + .3, CLIMAX + 2.0), qa);
  typeText('—— 普罗泰戈拉', 540, 630, { size: 30, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.0), qa);
  typeText('换个参照物，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('你没那么差。', 540, 600, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneAlmost(t); sceneRel(t); scenePay(t); sceneRuler(t); sceneMeasure(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 67.9, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1995', 'Medvec, Madey & Gilovich · JPSP', 8.2, 23.7, T);
  stamp('2021', 'Hedgcock, Luangrath & Webster · JEP: General', 31.6, 35.3, T);
  stamp('1998', 'Solnick & Hemenway · JEBO', 40.9, 52.9, T);
  stamp('2012', 'Card, Mas, Moretti & Saez · AER', 53.6, 63.4, T);
  stamp('前 5 世纪', 'Protagoras · via Plato, Theaetetus', 72.2, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(35);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 B 小调里，最后一个和弦是 B 大调）
const NOTE = { B3: 246.94, D4: 293.66, Ds4: 311.13, Fs4: 369.99, B4: 493.88, D5: 587.33, Fs5: 739.99, B5: 987.77, D6: 1174.66, Ds6: 1244.51 };
const BM_SHIM = [NOTE.D6, NOTE.Fs5, NOTE.B5, NOTE.B4, NOTE.Fs4], BMAJ_SHIM = [NOTE.Ds6, NOTE.Fs5, NOTE.B5, NOTE.B4, NOTE.Fs4], BM_SWELL = [61.74, 92.5, 123.47, 146.83, 185];
function CUES() {
  const c = [];
  [[.4, NOTE.B5], [.7, NOTE.D6], [1.0, NOTE.Fs5]].forEach(([t, f]) => c.push([t, 'tink', { f, gain: .07 }]));
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.B3, NOTE.D4, NOTE.Fs4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.B5, gain: .12 }]);
  c.push([11.0, 'bar', { f0: 247, f1: 370, dur: 1.0, gain: .14 }], [13.7, 'bar', { f0: 247, f1: 494, dur: 1.0, gain: .16 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BM_SHIM, gain: .28 }]);
  c.push([20.2, 'bar', { f0: 494, f1: 988, dur: .8, gain: .1 }], [24.3, 'bar', { f0: 494, f1: 247, dur: .8, gain: .1 }], [27.7, 'tink', { f: NOTE.D6, gain: .08 }]);
  for (let i = 0; i < 3; i++) c.push([32.2 + i * .25, 'click', { gain: .08 }]);
  c.push([REL, 'whoosh', { dur: .5, gain: .25 }], [38.0, 'tink', { f: NOTE.Fs5, gain: .07 }], [38.3, 'tink', { f: NOTE.Fs5, gain: .07 }], [39.2, 'chord', { f: [NOTE.B4, NOTE.D5, NOTE.Fs5], gain: .08 }]);
  c.push([41.1, 'bar', { f0: 247, f1: 330, dur: .8, gain: .08 }], [45.1, 'bar', { f0: 247, f1: 494, dur: .8, gain: .08 }], [48.9, 'chord', { f: [NOTE.B4, NOTE.D5, NOTE.Fs5], gain: .1 }], [49.0, 'tink', { f: NOTE.B5, gain: .1 }]);
  c.push([PAY, 'whoosh', { dur: .5, gain: .22 }]);
  for (let i = 0; i < 8; i++) c.push([53.8 + i * .2, 'click', { gain: .05 }]);
  c.push([57.9, 'bar', { f0: 494, f1: 247, dur: 1.0, gain: .12 }], [58.0, 'thud', { gain: .16 }], [60.6, 'tink', { f: NOTE.Fs5, gain: .06 }]);
  c.push([64.4, 'tink', { f: NOTE.D6, gain: .06 }], [67.9, 'swish', { gain: .14 }], [69.6, 'tink', { f: NOTE.B5, gain: .08 }], [72.4, 'page', { gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: BM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 123.47, gain: .14 }]);
  c.push([84.9, 'suck', { dur: 2.0, gain: .1 }], [88.4, 'tink', { f: NOTE.B5, gain: .1 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: BMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.B3, NOTE.Ds4, NOTE.Fs4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
