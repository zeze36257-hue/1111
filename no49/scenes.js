// ======================================================================== No.49 节俭主义：花了钱，就一定要用完吗？
// 第六季·日常里的主义 ⑥。开头是一道选择题：100 美元和 50 美元两张滑雪票撞了日子，你更喜欢便宜那趟，会去哪趟？（Arkes & Blumer, 1985）
// 音乐：原创配乐（music.py，升 F 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一声叹气：一个长音舍不得地落到下一个音；高潮时这声叹气转身往上走。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 季票（每拍一个鼓点） · 53.33 鸽子（紧张） · 64.0 今天才开始（只剩钢琴） · 80.0 高潮：往前走 · 96.0 升 F 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), SEASON = BT(56), BIRD = BT(80), TODAY = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['两张票', 0, LIFT], ['沉没', LIFT, SEASON], ['季票', SEASON, BIRD], ['鸽子', BIRD, TODAY], ['今天才开始', TODAY, CLIMAX], ['往前走', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.49';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '你先买了一张 100 美元的滑雪票，后来又买了一张 50 美元的。'],
  [4.1, 7.6, '你更喜欢便宜那趟，可两趟撞了日子，都不能退。你会去哪趟？'],
  [8.2, 10.4, '答案是：过半的人，去了贵的那趟。'],
  [10.8, 13.3, '明明更喜欢另一趟，'],
  [13.6, 15.7, '还是选了「不去就亏了」的那一趟。'],
  [16.3, 19.6, '这是 1985 年，阿克斯和布鲁默的实验。'],
  [19.9, 23.7, '可钱已经花了，选哪趟都拿不回来。'],
  [24.0, 27.4, '经济学家把这叫「沉没成本」：'],
  [27.7, 31.3, '已经沉下去的钱，不该决定接下来的路。'],
  [31.6, 35.3, '这就是「节俭主义」的陷阱：怕浪费钱，结果浪费了更多。'],
  [37.6, 40.6, '他们还做了一个真实的实验：'],
  [40.9, 44.6, '剧院的季票，随机打折卖给观众。'],
  [44.9, 48.6, '付全价的人，接下来半年来看戏的次数更多。'],
  [48.9, 52.9, '不一定是更喜欢，是怕「白花了钱」。'],
  [53.6, 57.6, '更有意思的是：'],
  [57.9, 60.6, '有研究者认为，动物和年幼的孩子，'],
  [60.8, 63.4, '似乎反而不太犯这个错。'],
  [64.3, 67.6, '所以，下次舍不得放下的时候，问问自己：'],
  [67.9, 71.9, '如果今天才开始，我还会选它吗？'],
  [72.2, 75.9, '花掉的钱回不来，但接下来的时间，还是你的。'],
  [76.3, 79.6, '有一句老话说：'],
  [84.9, 88.6, '过去的账，已经结了；'],
  [88.9, 92.6, '往前的路，才是你的。'],
  [98.4, 103.0, '评论区：你有没有为了「不浪费」，硬撑过什么？'],
];
const BIGLINES = [
  [80.2, 92.6, '「别为打翻的牛奶哭泣。」—— 英语谚语'],
  [93.4, 98.0, '花掉的，就让它花掉。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [SEASON - .5, .2], [SEASON, .06], [TODAY, .06],
  [TODAY + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、票、硬币、水、剧院、鸽子、岔路、沙漏、牛奶
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function ticket(x, y, w, h, price, place, rgb, a, o = {}) {                                        // 一张票：左边价格，右边地点，中间一条虚线
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 28 * o.glow; }
  ctx.fillStyle = `rgba(${rgb},.14)`; ctx.strokeStyle = `rgba(${rgb},.85)`; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 14); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(-w / 2 + w * .38, -h / 2 + 10); ctx.lineTo(-w / 2 + w * .38, h / 2 - 10); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(o.sc || 1, o.sc || 1);
  text(price, -w / 2 + w * .19, 14, { font: LAT, size: 44, weight: 700, align: 'center', color: `rgb(${rgb})`, alpha: a });
  text(place, -w / 2 + w * .69, 4, { font: SERIF, size: 30, weight: 900, align: 'center', color: CREAM, alpha: a });
  if (o.sub) text(o.sub, -w / 2 + w * .69, 44, { font: SANS, size: 22, align: 'center', color: `rgb(${rgb})`, alpha: a });
  ctx.restore();
}
function coin(x, y, r, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#e8b866'; ctx.strokeStyle = '#a77d3c'; ctx.lineWidth = 2; ctx.shadowColor = `rgba(${O_RGB},.5)`; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, r * .7, 0, TAU); ctx.stroke(); ctx.restore();
}
function water(y, a, t) {                                                                            // 一条水面，下面一片深色
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, y, 0, y + 420); g.addColorStop(0, 'rgba(60,110,140,.28)'); g.addColorStop(1, 'rgba(20,40,60,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(100, y);
  for (let x = 100; x <= 980; x += 10) ctx.lineTo(x, y + 6 * Math.sin(x * .03 + t * 2)); ctx.lineTo(980, y + 420); ctx.lineTo(100, y + 420); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(150,200,230,.6)'; ctx.lineWidth = 2.5; ctx.beginPath(); for (let x = 100; x <= 980; x += 10) ctx.lineTo(x, y + 6 * Math.sin(x * .03 + t * 2)); ctx.stroke();
  ctx.restore();
}
function bird(x, y, s, a, col = CREAM) {                                                          // 一只鸽子
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.ellipse(0, 0, 60, 38, -.15, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(52, -40, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(72, -42); ctx.lineTo(90, -36); ctx.lineTo(72, -32); ctx.stroke();
  ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(58, -46, 3.5, 0, TAU); ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-58, -6); ctx.lineTo(-96, -20); ctx.lineTo(-90, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-20, -10); ctx.quadraticCurveTo(10, -30, 30, -8); ctx.stroke();
  for (const lx of [-10, 14]) { ctx.beginPath(); ctx.moveTo(lx, 36); ctx.lineTo(lx, 60); ctx.stroke(); }
  ctx.restore();
}
function hourglass(x, y, s, a, k, t) {                                                             // k：上半部分剩下多少沙
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = CREAM; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-60, -110); ctx.lineTo(60, -110); ctx.moveTo(-60, 110); ctx.lineTo(60, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-50, -100); ctx.quadraticCurveTo(-50, -20, -6, 0); ctx.quadraticCurveTo(-50, 20, -50, 100); ctx.lineTo(50, 100); ctx.quadraticCurveTo(50, 20, 6, 0); ctx.quadraticCurveTo(50, -20, 50, -100); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#e8b866';
  const top = 80 * k; ctx.beginPath(); ctx.moveTo(-40 * k, -20 - top + 10); ctx.lineTo(40 * k, -20 - top + 10); ctx.lineTo(0, -12); ctx.closePath(); if (k > .02) ctx.fill();
  const bot = 80 * (1 - k); ctx.beginPath(); ctx.moveTo(-44, 96); ctx.lineTo(44, 96); ctx.lineTo(12, 96 - bot); ctx.lineTo(-12, 96 - bot); ctx.closePath(); ctx.fill();
  if (k > .02) { ctx.strokeStyle = '#e8b866'; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 96 - bot); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================== ① 两张票（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('只能去一趟，都不能退：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('多数人去哪趟？', 540, 560, { ...big, size: 82, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t), rv = sstep(Q.REVEAL, Q.REVEAL + .5, t);
  if (P > 0) {
    ticket(540, 820, 620, 150, '$100', '甲地', O_RGB, P, { rot: -.03, glow: rv });
    ticket(540, 1020, 620, 150, '$50', '乙地', T_RGB, P, { rot: .03, sub: '♥ 你更喜欢' });
    pill('同一个周末', 540, 1170, P * sstep(.8, 1.2, t), { size: 28, stroke: 'rgba(240,160,160,.6)', color: '#f0a0a0' });
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {
    const base = 1180, k = E.out(prog(t, 11.0, 12.0));
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(200, base); ctx.lineTo(880, base); ctx.stroke();
    ctx.fillStyle = ORANGE; ctx.fillRect(280, base - 5.4 * 54 * k, 160, 5.4 * 54 * k); ctx.fillStyle = TEAL; ctx.fillRect(640, base - 5.4 * 46 * k, 160, 5.4 * 46 * k); ctx.restore();
    text('过半', 360, base - 5.4 * 54 * k - 30, { font: SERIF, size: 42, weight: 900, align: 'center', color: '#ffd2a0', alpha: C * k });
    text('约 46%', 720, base - 5.4 * 46 * k - 30, { font: SERIF, size: 38, weight: 900, align: 'center', color: '#7fe3d3', alpha: C * k });
    text('去贵的', 360, base + 42, { font: SANS, size: 28, align: 'center', color: '#ffd2a0', alpha: C });
    text('去更喜欢的', 720, base + 42, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: C });
    pill('不去就亏了……', 360, 740, sstep(13.7, 14.1, t), { size: 30, stroke: `rgba(${O_RGB},.6)`, color: '#ffd2a0' });
  }
  text('多数人：去了贵的', 540, 560, { font: SERIF, size: 62, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 更贵的那趟', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 更喜欢的那趟', 200], ['B · 更贵的那趟', 540], ['C · 都不去', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 钱沉下去了
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('节俭主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('FRUGALITY', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ⑥', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneSunk(t) {
  if (t < 19.7 || t > SEASON + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(SEASON - .6, SEASON - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('钱已经花了', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('沉没成本', 540, 640, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    text('别让它决定接下来的路', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#7fe3d3', alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${T_RGB},.4)`, blur: 14 });
    water(900, D, t);
    for (let i = 0; i < 6; i++) {                                                                   // 硬币一枚枚沉下去
      const t0 = 20.3 + i * .45, p = clamp((t - t0) / 3.2), x = 300 + i * 96;
      if (t < t0) { coin(x, 780, 26, D); continue; }
      const y = p < .15 ? lerp(780, 900, p / .15) : lerp(900, 1260, (p - .15) / .85);
      coin(x + 10 * Math.sin(t * 3 + i) * (p > .15 ? 1 : 0), y, 26, D * (1 - sstep(.7, 1, p)));
    }
    const go = E.io(prog(t, 28.0, 29.2));
    drawOn(() => { ctx.moveTo(200, 830); ctx.lineTo(860, 830); }, 660, go, 'rgba(127,227,211,.9)', 5, D, `rgba(${T_RGB},.5)`);
    if (go > .95) { ctx.save(); ctx.globalAlpha = D; ctx.strokeStyle = 'rgba(127,227,211,.9)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(834, 810); ctx.lineTo(862, 830); ctx.lineTo(834, 850); ctx.stroke(); ctx.restore(); }
    text('接下来的路', 540, 800, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: D * sstep(28.8, 29.2, t) });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('节俭主义的陷阱', 540, 860, { ...big, size: 76, weight: 900 }, prog(t, 31.7, 32.6), F);
  typeText('怕浪费钱，结果浪费了更多', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#f0a0a0', spread: 4 }, prog(t, 32.3, 33.3), F);
}

// ======================================================================== ③ 季票：全价的人来得更多
function sceneSeason(t) {
  if (t < SEASON - .3 || t > BIRD + .2) return;
  const A = sstep(SEASON - .1, SEASON + .5, t) * (1 - sstep(BIRD - .6, BIRD - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - SEASON) / BEAT) % 1);
  text('剧院季票，随机打折', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(44.6, 45.0, t)) });
  text('接下来半年，来看戏的次数', 540, 640, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(45.0, 45.5, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('怕「白花了钱」', 0, 0, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(48.9, 49.4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  const cur = A * (1 - sstep(44.6, 45.0, t));
  if (cur > 0) {                                                                                      // 幕布
    ctx.save(); ctx.globalAlpha = cur; ctx.fillStyle = 'rgba(140,30,45,.55)'; ctx.strokeStyle = 'rgba(229,72,77,.6)'; ctx.lineWidth = 2;
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(540 + sx * 420, 720); ctx.quadraticCurveTo(540 + sx * 300, 860, 540 + sx * 360, 1000); ctx.lineTo(540 + sx * 420, 1000); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = 'rgba(140,30,45,.7)'; ctx.fillRect(120, 710, 840, 30); ctx.restore();
  }
  [['$15', '全价', O_RGB, 300], ['$13', '打折', '154,163,178', 540], ['$8', '打折', '154,163,178', 780]].forEach(([p, s, rgb, x], i) => {
    const a = A * sstep(41.0 + i * .3, 41.4 + i * .3, t);
    ticket(x, cur > .5 ? 1110 : 1240, 210, 90, p, s, rgb, a * (1 - .0), { sc: .9 });
  });
  const G = A * sstep(45.0, 45.4, t);
  if (G > 0) {
    const base = 1180;
    ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, base); ctx.lineTo(900, base); ctx.stroke(); ctx.restore();
    [[300, 300, ORANGE], [540, 210, '#9aa3b2'], [780, 200, '#9aa3b2']].forEach(([x, h, col], i) => {
      const k = E.out(prog(t, 45.2 + i * .2, 46.2 + i * .2));
      ctx.save(); ctx.globalAlpha = G; ctx.fillStyle = col; ctx.fillRect(x - 60, base - h * k, 120, h * k); ctx.restore();
    });
    text('（示意）', 540, base - 340, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: G });
  }
}

// ======================================================================== ④ 鸽子：动物和小孩似乎不太犯
function sceneBird(t) {
  if (t < BIRD - .3 || t > TODAY + .2) return;
  const A = sstep(BIRD - .1, BIRD + .5, t) * (1 - sstep(TODAY - .7, TODAY - .1, t));
  if (A <= 0) return;
  text('更有意思的是', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('似乎反而不太犯', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * sstep(58.0, 58.5, t), glow: `rgba(${T_RGB},.4)`, blur: 14 });
  bird(330, 1060, 1.3, A * sstep(54.0, 54.6, t), '#c3cad6');
  person(760, 1110, .9, A * sstep(54.4, 55.0, t), '#c3cad6');
  person(860, 1130, 1.2, A * sstep(54.4, 55.0, t) * .5, '#6f7786');
  text('动物', 330, 1220, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: A * sstep(54.4, 54.8, t) });
  text('年幼的孩子', 760, 1220, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: A * sstep(54.8, 55.2, t) });
  const ck = sstep(61.0, 61.5, t);
  for (const x of [330, 760]) text('✓', x, 880, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * ck, glow: `rgba(${T_RGB},.6)`, blur: 14 });
  text('（有研究者的观点，仍有争论）', 540, 1290, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: A * sstep(61.2, 61.6, t) });
}

// ======================================================================== ⑤ 今天才开始：岔路和沙漏
function sceneToday(t) {
  if (t < TODAY - .2 || t > CLIMAX + .3) return;
  const A = sstep(TODAY + .2, TODAY + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('舍不得放下的时候', 64.5, 67.6, CREAM);
  hd('如果今天才开始？', 67.9, 71.9, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('时间，还是你的', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('有一句老话：', 76.4, 0, CREAM);
  const R = A * (1 - sstep(72.0, 72.5, t));
  if (R > 0) {
    person(540, 1290, 1.0, R, '#ffd2a0');
    const kL = E.io(prog(t, 64.8, 65.8)), kR = E.io(prog(t, 68.0, 69.0));
    drawOn(() => { ctx.moveTo(520, 1180); ctx.quadraticCurveTo(420, 1000, 300, 860); }, 380, kL, 'rgba(154,163,178,.8)', 6, R);
    drawOn(() => { ctx.moveTo(560, 1180); ctx.quadraticCurveTo(660, 1000, 780, 860); }, 380, kR, 'rgba(127,227,211,.95)', 6, R, `rgba(${T_RGB},.6)`);
    text('因为花了钱', 300, 820, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: R * sstep(65.6, 66.0, t) });
    text('今天才开始，还会选吗？', 760, 820, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: R * sstep(68.8, 69.2, t) });
  }
  const H = A * sstep(72.3, 72.8, t);
  hourglass(540, 1020, 1.3, H, 1 - prog(t, 72.4, 80.0), t);
}

// ======================================================================== ⑥ 往前走：打翻的牛奶留在身后
function sceneGo(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), walk = E.io(prog(t, CLIMAX + .8, FINAL + 2));
  warmth(A * (1 + .5 * fin), 820, 920, 700);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, 1250); ctx.lineTo(960, 1250); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha = A * (1 - .5 * walk); ctx.translate(230, 1240); ctx.rotate(-1.4);                                  // 打翻的杯子
  ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 3; ctx.strokeRect(-30, -40, 60, 80); ctx.restore();
  ctx.save(); ctx.globalAlpha = A * .85 * (1 - .5 * walk); ctx.fillStyle = 'rgba(240,238,230,.85)'; ctx.beginPath(); ctx.ellipse(330, 1250, 110, 14, 0, 0, TAU); ctx.fill(); ctx.restore();
  person(lerp(380, 760, walk), 1220 - 4 * Math.abs(Math.sin(t * 5)) * (walk < 1 ? 1 : 0), 1.1, A, '#ffd2a0');
  glow(900, 980, 30 * (1 + .5 * fin), O_RGB, A * (.4 + .6 * walk), 8);
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const r = mulberry(5000 + i), x = 600 + r() * 360, sp = 30 + r() * 40, p = ((t - FINAL) * sp / 420 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1200 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('别为打翻的', 540, 450, { ...big, size: 64, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('牛奶哭泣。', 540, 566, { ...big, size: 76, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.4, CLIMAX + 2.3), qa);
  typeText('—— 英语谚语', 540, 650, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.0), qa);
  typeText('花掉的，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('就让它花掉。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneSunk(t); sceneSeason(t); sceneBird(t); sceneToday(t); sceneGo(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 68.0, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1985', 'Arkes & Blumer · OBHDP', 8.2, 52.9, T);
  stamp('1999', 'Arkes & Ayton · Psychol Bull', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(49);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在升 F 小调里，最后一个和弦是升 F 大调）
const NOTE = { Fs3: 185.00, A3: 220.00, As3: 233.08, Cs4: 277.18, Fs4: 369.99, A4: 440.00, As4: 466.16, Cs5: 554.37, Fs5: 739.99, A5: 880.00, As5: 932.33, Cs6: 1108.73 };
const FSM_SHIM = [NOTE.A5, NOTE.Cs5, NOTE.Fs5, NOTE.Fs4, NOTE.Cs4], FSMAJ_SHIM = [NOTE.As5, NOTE.Cs5, NOTE.Fs5, NOTE.Fs4, NOTE.Cs4], FSM_SWELL = [46.25, 69.30, 92.50, 110.00, 138.59];
function CUES() {
  const c = [];
  c.push([.4, 'page', { gain: .1 }], [1.0, 'tink', { f: NOTE.Cs5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Fs3, NOTE.A3, NOTE.Cs4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Cs5, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 185, f1: 370, dur: 1.0, gain: .07 }], [13.7, 'tink', { f: NOTE.A4, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: FSM_SHIM, gain: .28 }]);
  for (let i = 0; i < 6; i++) c.push([20.3 + i * .45 + .45, 'thunk', { gain: .06 }]);
  c.push([24.1, 'drone', { dur: 3.2, gain: .04 }], [28.0, 'swish', { gain: .08 }], [29.0, 'tink', { f: NOTE.Fs5, gain: .06 }], [31.7, 'page', { gain: .18 }]);
  c.push([SEASON, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'page', { gain: .08 }], [41.3, 'page', { gain: .08 }], [41.6, 'page', { gain: .08 }], [45.2, 'bar', { f0: 185, f1: 370, dur: 1.0, gain: .07 }]);
  c.push([49.0, 'chord', { f: [NOTE.Fs3, NOTE.A3, NOTE.Cs4], gain: .1 }], [49.1, 'tink', { f: NOTE.Cs6, gain: .07 }]);
  c.push([BIRD, 'whoosh', { dur: .5, gain: .22 }], [54.0, 'tink', { f: NOTE.Fs5, gain: .05 }], [54.4, 'tink', { f: NOTE.A5, gain: .05 }], [61.0, 'chord', { f: [NOTE.A4, NOTE.Cs5, NOTE.Fs5], gain: .08 }]);
  c.push([64.8, 'swish', { gain: .06 }], [68.0, 'swish', { gain: .08 }], [68.9, 'tink', { f: NOTE.Cs5, gain: .06 }], [72.4, 'dust', { dur: 3.5, gain: .04 }]);
  c.push([76.4, 'page', { gain: .16 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: FSM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: FSM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 92.50, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: FSMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Fs3, NOTE.As3, NOTE.Cs4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
