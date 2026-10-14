// ======================================================================== No.42 悲观主义：往坏处想，就一定不好吗？
// 第五季·看不见的主义 ⑨。开头是一道选择题：做题之前，一个说“我肯定考砸”，一个说“稳了”，谁做得更好？（Norem & Cantor, 1986）
// 音乐：原创配乐（music.py，升 G 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机总是先往下落（想到最坏），再一级级爬回来（做好准备）。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 别劝他（每拍一个鼓点） · 53.33 想到，就做（紧张） · 64.0 会累（只剩钢琴） · 80.0 高潮：撑开一把伞 · 96.0 升 G 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), DONT = BT(56), DIFF = BT(80), COST = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['两种人', 0, LIFT], ['防御性悲观', LIFT, DONT], ['别劝他', DONT, DIFF], ['想到，就做', DIFF, COST], ['会累', COST, CLIMAX], ['带伞', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.42';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '做一套题之前，一个说「我肯定考砸」，一个说「稳了」。'],
  [4.1, 7.6, '谁做得更好？先猜一个。'],
  [8.2, 10.4, '答案是：差不多。'],
  [10.8, 13.3, '预期差了一大截，成绩却没差多少。'],
  [13.6, 15.7, '那句「我肯定考砸」，到底在干什么？'],
  [16.3, 19.6, '心理学家诺伦，把这叫「防御性悲观」。'],
  [19.9, 23.7, '先把期待放低，再把可能出错的地方，一个个想一遍。'],
  [24.0, 27.4, '卡壳了怎么办？紧张了怎么办？忘词了怎么办？'],
  [27.7, 31.3, '每想到一个坏结果，就准备一个办法。'],
  [31.6, 35.3, '这是另一种「悲观主义」：往坏处想，是为了做准备。'],
  [37.6, 40.6, '所以，别急着劝他「往好处想」。'],
  [40.9, 44.6, '有研究发现：不让这种人去想坏结果，他们反而做得更差；'],
  [44.9, 48.6, '而硬让乐观的人去想，乐观的人也会变差。'],
  [48.9, 52.9, '每个人，都有自己的「热身方式」。'],
  [53.6, 57.6, '但它和「真的悲观」，不一样：'],
  [57.9, 63.4, '悲观，是想到坏结果就停下；防御性悲观，是想到坏结果就动手。'],
  [64.3, 67.6, '这条路也有代价：想得多，心就绷得紧。'],
  [67.9, 71.9, '所以，只想到「我能做什么」为止，然后去做。'],
  [72.2, 75.9, '想完了，就把它放下。'],
  [76.3, 79.6, '诺伦写过一本书，书名就是：'],
  [84.9, 88.6, '带伞的人，不是盼着下雨，'],
  [88.9, 92.6, '是下雨了，也照样出门。'],
  [98.4, 103.0, '评论区：你是「完了派」，还是「稳了派」？'],
];
const BIGLINES = [
  [80.2, 92.6, '「消极思维的积极力量」—— 诺伦（书名）'],
  [93.4, 98.0, '往坏处想，往好处做。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [DONT - .5, .2], [DONT, .06], [COST, .06],
  [COST + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、伞、雨
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const UMB = { x: 540, y: 1056 };
function umbrella(a, k, glowK) {                                                                    // k：0 收着 → 1 撑开
  if (a <= 0) return;
  const rx = lerp(34, 250, k), ry = lerp(176, 140, k), { x, y } = UMB;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(236,230,218,.75)'; ctx.lineWidth = 5;                                     // 伞柄
  ctx.beginPath(); ctx.moveTo(x, y - ry - 18); ctx.lineTo(x, y + 172); ctx.stroke();
  const n = 6, edge = i => x - rx + (2 * rx) * i / n;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, PI, TAU);
  for (let i = n; i > 0; i--) { const x0 = edge(i), x1 = edge(i - 1); ctx.quadraticCurveTo((x0 + x1) / 2, y - 26 * k, x1, y); }
  ctx.closePath();
  ctx.fillStyle = `rgba(242,161,74,${.10 + .22 * k + .12 * glowK})`; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 20 + 30 * glowK; ctx.fill();
  ctx.shadowBlur = 0; ctx.strokeStyle = k > .5 ? ORANGE : 'rgba(236,230,218,.6)'; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.strokeStyle = `rgba(255,210,160,${.35 * k})`; ctx.lineWidth = 2;                             // 伞骨
  for (let i = 1; i < n; i++) { ctx.beginPath(); ctx.moveTo(x, y - ry); ctx.quadraticCurveTo(lerp(x, edge(i), .7), y - ry * .55, edge(i), y); ctx.stroke(); }
  ctx.restore();
}
function rain(t, a, k) {                                                                            // 伞下面没有雨
  if (a <= 0) return;
  const r = mulberry(4242), y0 = 740, y1 = 1330, rx = lerp(34, 250, k), ry = lerp(176, 140, k);
  ctx.save(); ctx.strokeStyle = 'rgba(190,205,225,1)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  for (let i = 0; i < 150; i++) {
    const x = 40 + r() * 1000, sp = 1300 + r() * 500, ph = r(), L = 26 + r() * 22, al = .12 + .22 * r();
    const y = y0 + ((t * sp / (y1 - y0) + ph) % 1) * (y1 - y0), xx = x - (y - y0) * .14;
    const dx = (xx - UMB.x) / rx;
    if (Math.abs(dx) < 1 && y > UMB.y - ry * Math.sqrt(1 - dx * dx)) continue;
    ctx.globalAlpha = a * al * sstep(y0, y0 + 60, y) * (1 - sstep(y1 - 50, y1, y));
    ctx.beginPath(); ctx.moveTo(xx, y); ctx.lineTo(xx + L * .14, y - L); ctx.stroke();
  }
  for (let j = 0; j < 8; j++) {                                                                     // 地上的水圈
    const x = [110, 200, 300, 790, 880, 980, 160, 930][j], p = ((t + j * .37) / .9) % 1;
    ctx.globalAlpha = a * (1 - p) * .3; ctx.strokeStyle = 'rgba(190,205,225,1)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(x, 1306, 8 + 40 * p, 3 + 9 * p, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

// ======================================================================== ① 两种人（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('做题之前：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('谁做得更好？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t);
  if (P > 0) {
    const p1 = 1 - E.out(prog(t, 1.0, 1.5)), p2 = 1 - E.out(prog(t, 2.0, 2.5));
    person(300, 1170, 1.25, P, '#c3cad6');
    person(780, 1170, 1.25, P, '#ffd2a0');
    pill('我肯定考砸', 300, 900, P, { size: 34, stroke: 'rgba(195,202,214,.6)', color: '#c3cad6', sc: 1 + .12 * p1 * (t > 1 ? 1 : 0) });
    pill('稳了', 780, 900, P, { size: 34, stroke: `rgba(${O_RGB},.7)`, color: '#ffd2a0', sc: 1 + .12 * p2 * (t > 2 ? 1 : 0) });
  }
  const C = sstep(10.8, 11.3, t), dimC = 1 - .6 * sstep(13.6, 14.1, t);
  if (C > 0) {                                                                                      // 预期差很多，成绩差不多（示意）
    const k1 = E.out(prog(t, 11.0, 11.8)), k2 = E.out(prog(t, 11.6, 12.4)), base = 1180;
    const bar = (x, h, col, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(x - 45, base - h, 90, h); ctx.restore(); };
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, base); ctx.lineTo(900, base); ctx.stroke(); ctx.restore();
    bar(280, 110 * k1, '#9aa3b2', C * (dimC + (1 - dimC) * .9 * (1 + Math.sin(t * 6)) / 2)); bar(400, 330 * k1, ORANGE, C * dimC);
    bar(680, 280 * k2, '#9aa3b2', C * dimC); bar(800, 300 * k2, ORANGE, C * dimC);
    text('预期', 340, base + 46, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: C });
    text('成绩', 740, base + 46, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: C });
    text('差很多', 340, 800, { font: SERIF, size: 32, weight: 700, align: 'center', color: DIM, alpha: C * sstep(11.6, 12.0, t) * dimC });
    text('差不多', 740, 822, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#7fe3d3', alpha: C * sstep(12.3, 12.7, t) * dimC, glow: `rgba(${T_RGB},.5)`, blur: 12 });
    ctx.save(); ctx.globalAlpha = C; ctx.fillStyle = '#9aa3b2'; ctx.fillRect(300, 1262, 22, 22); ctx.fillStyle = ORANGE; ctx.fillRect(640, 1262, 22, 22); ctx.restore();
    text('说「考砸」的', 336, 1274, { font: SANS, size: 24, color: '#c3cad6', alpha: C });
    text('说「稳了」的', 676, 1274, { font: SANS, size: 24, color: '#ffd2a0', alpha: C });
    text('?', 280, 1000, { font: SERIF, size: 96, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(13.7, 14.1, t), glow: `rgba(${O_RGB},.6)`, blur: 20 });
  }
  text('预期差很多，成绩差不多', 540, 560, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 差不多', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 说「考砸」的', 200], ['B · 差不多', 540], ['C · 说「稳了」的', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 防御性悲观：把坏结果一个个想一遍
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('悲观主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('PESSIMISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ⑨', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneDP(t) {
  if (t < 19.7 || t > DONT + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(DONT - .6, DONT - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('防御性悲观', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: D, glow: `rgba(${O_RGB},.4)`, blur: 14 });
    text('Defensive pessimism', 540, 704, { font: LAT, size: 30, weight: 500, align: 'center', color: DIM, alpha: D, ls: 3 });
    const lv = lerp(.85, .3, E.io(prog(t, 20.6, 21.8)));                                         // 期待：先放低
    text('期待', 200, 822, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: D });
    ctx.save(); ctx.globalAlpha = D; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(280, 810, 600, 20, 10); ctx.fill();
    ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.roundRect(280, 810, 600 * lv, 20, 10); ctx.fill(); ctx.restore();
    text('放低', 280 + 600 * lv + 50, 822, { font: SANS, size: 26, color: '#c3cad6', alpha: D * sstep(21.4, 21.8, t) });
    [['卡壳了？', '备一张提纲'], ['紧张了？', '先喝口水'], ['忘词了？', '多练两遍']].forEach(([w, f], i) => {
      const y = 960 + i * 120, a1 = D * sstep(24.1 + i * .8, 24.5 + i * .8, t), k2 = E.io(prog(t, 27.9 + i * .7, 28.5 + i * .7));
      pill(w, 320, y, a1, { size: 32, stroke: 'rgba(240,160,160,.6)', color: '#f0a0a0' });
      drawOn(() => { ctx.moveTo(440, y); ctx.lineTo(630, y); }, 190, k2, 'rgba(127,227,211,.8)', 3, D, `rgba(${T_RGB},.5)`);
      if (k2 > .95) { ctx.save(); ctx.globalAlpha = D; ctx.strokeStyle = 'rgba(127,227,211,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(616, y - 10); ctx.lineTo(630, y); ctx.lineTo(616, y + 10); ctx.stroke(); ctx.restore(); }
      pill(f, 790, y, D * sstep(28.3 + i * .7, 28.7 + i * .7, t), { size: 32, stroke: `rgba(${T_RGB},.7)`, color: '#7fe3d3', glow: `rgba(${T_RGB},.35)` });
    });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('另一种悲观主义', 540, 860, { ...big, size: 76, weight: 900 }, prog(t, 31.7, 32.6), F);
  typeText('往坏处想，是为了做准备', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#7fe3d3', spread: 4 }, prog(t, 32.4, 33.3), F);
}

// ======================================================================== ③ 别劝他：各有各的热身方式
function sceneDont(t) {
  if (t < DONT - .3 || t > DIFF + .2) return;
  const A = sstep(DONT - .1, DONT + .5, t) * (1 - sstep(DIFF - .6, DIFF - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - DONT) / BEAT) % 1);
  const S = A * (1 - sstep(40.5, 40.9, t));
  if (S > 0) {
    text('别劝他「往好处想」', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: S * sstep(37.7, 38.2, t) });
    person(420, 1190, 1.2, S, '#c3cad6');
    pill('往好处想！', 720, 930, S * sstep(38.0, 38.4, t), { size: 36, stroke: `rgba(${O_RGB},.7)`, color: '#ffd2a0' });
    const x = E.out(prog(t, 39.2, 39.6));
    if (x > 0) { ctx.save(); ctx.globalAlpha = S * x; ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(229,72,77,.6)'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(640, 880); ctx.lineTo(800, 980); ctx.moveTo(800, 880); ctx.lineTo(640, 980); ctx.stroke(); ctx.restore(); }
  }
  const G = A * sstep(40.9, 41.4, t);
  if (G <= 0) return;
  text('有研究发现', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: G * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('各有各的热身方式', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#7fe3d3', alpha: G * sstep(48.9, 49.4, t), glow: `rgba(${T_RGB},.5)`, blur: 16 }); ctx.restore();
  text('防御性悲观的人', 440, 780, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#c3cad6', alpha: G });
  text('乐观的人', 780, 780, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: G });
  text('想坏结果', 175, 902, { font: SERIF, size: 32, weight: 900, align: 'center', color: CREAM, alpha: G });
  text('不去想', 175, 1062, { font: SERIF, size: 32, weight: 900, align: 'center', color: CREAM, alpha: G });
  const cell = (x, y, s, col, rgb, a) => {
    ctx.save(); ctx.globalAlpha = G; ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.strokeStyle = 'rgba(236,230,218,.2)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x - 150, y - 65, 300, 130, 18); ctx.fill(); ctx.stroke();
    if (a > 0) { ctx.globalAlpha = G * a; ctx.fillStyle = `rgba(${rgb},.14)`; ctx.strokeStyle = `rgba(${rgb},.8)`; ctx.shadowColor = `rgba(${rgb},.5)`; ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(x - 150, y - 65, 300, 130, 18); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    text(s, x, y + 2, { font: SERIF, size: 38, weight: 900, align: 'center', color: col, alpha: G * a });
  };
  cell(440, 1060, '↓ 更差', '#f0a0a0', '229,72,77', sstep(41.3, 41.8, t));
  cell(780, 900, '↓ 更差', '#f0a0a0', '229,72,77', sstep(45.3, 45.8, t));
  cell(440, 900, '✓ 照常发挥', '#7fe3d3', T_RGB, sstep(49.1, 49.6, t));
  cell(780, 1060, '✓ 照常发挥', '#7fe3d3', T_RGB, sstep(49.5, 50.0, t));
  text('（示意）', 540, 1200, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: G });
}

// ======================================================================== ④ 想到，就做：一条停下，一条动手
function sceneDiff(t) {
  if (t < DIFF - .3 || t > COST + .2) return;
  const A = sstep(DIFF - .1, DIFF + .5, t) * (1 - sstep(COST - .7, COST - .1, t));
  if (A <= 0) return;
  text('想到坏结果之后', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) });
  const pul = .75 + .25 * Math.sin(t * 5);
  pill('坏结果', 540, 800, A * sstep(54.0, 54.4, t), { size: 36, stroke: `rgba(229,72,77,${.5 + .4 * pul})`, color: '#f0a0a0', glow: `rgba(229,72,77,${.3 * pul})` });
  const kL = E.io(prog(t, 57.9, 58.7)), kR = E.io(prog(t, 60.4, 61.2));
  drawOn(() => { ctx.moveTo(490, 850); ctx.lineTo(320, 1010); }, 235, kL, 'rgba(240,160,160,.85)', 4, A);
  drawOn(() => { ctx.moveTo(590, 850); ctx.lineTo(760, 1010); }, 235, kR, 'rgba(127,227,211,.9)', 4, A, `rgba(${T_RGB},.5)`);
  const aL = A * sstep(58.5, 58.9, t), aR = A * sstep(61.0, 61.4, t);
  text('停下', 310, 1070, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#f0a0a0', alpha: aL });
  ctx.save(); ctx.globalAlpha = aL; ctx.fillStyle = 'rgba(229,72,77,.7)'; ctx.fillRect(230, 1110, 160, 12); ctx.restore();
  text('悲观', 310, 1180, { font: SANS, size: 30, align: 'center', color: '#9aa3b2', alpha: aL });
  ctx.save(); ctx.translate(770, 1070); ctx.scale(1 + .05 * (1 - E.out(prog(t, 61.0, 61.5))), 1);
  text('动手', 0, 0, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#7fe3d3', alpha: aR, glow: `rgba(${T_RGB},.6)`, blur: 16 }); ctx.restore();
  const go = (t * .8) % 1;                                                                          // 动手：小箭头一直往前走
  ctx.save(); ctx.globalAlpha = aR * (1 - go); ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(700 + 140 * go, 1116); ctx.lineTo(716 + 140 * go, 1116); ctx.moveTo(706 + 140 * go, 1108); ctx.lineTo(716 + 140 * go, 1116); ctx.lineTo(706 + 140 * go, 1124); ctx.stroke(); ctx.restore();
  text('防御性悲观', 770, 1180, { font: SANS, size: 30, align: 'center', color: '#7fe3d3', alpha: aR });
}

// ======================================================================== ⑤ 会累：绷紧的弦 · 我能做什么 · 一本书
function sceneCost(t) {
  if (t < COST - .2 || t > CLIMAX + .3) return;
  const A = sstep(COST + .2, COST + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const R = A * (1 - sstep(75.9, 76.3, t));
  if (R > 0) {
    const relax = E.io(prog(t, 72.3, 73.6)), tight = 1 - relax;
    text('代价：心绷得紧', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#f0a0a0', alpha: R * sstep(64.5, 65.0, t) * (1 - sstep(72.0, 72.4, t)) });
    text('想完了，就放下', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#ffd2a0', alpha: R * sstep(72.4, 72.9, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    ctx.save(); ctx.globalAlpha = R; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.strokeStyle = tight > .5 ? 'rgba(240,160,160,.9)' : 'rgba(255,210,160,.9)'; ctx.shadowColor = tight > .5 ? 'rgba(229,72,77,.5)' : `rgba(${O_RGB},.5)`; ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let x = 180; x <= 900; x += 6) { const u = (x - 180) / 720, env = Math.sin(PI * u); ctx.lineTo(x, 820 + env * (5 * tight * Math.sin(x * .09 + t * 46) + 70 * relax)); }
    ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = CREAM;
    for (const x of [180, 900]) { ctx.beginPath(); ctx.arc(x, 820, 9, 0, TAU); ctx.fill(); }
    ctx.restore();
    const W1 = R * (1 - sstep(72.2, 72.8, t)), mg = E.io(prog(t, 67.9, 69.0));
    [['万一卡壳', 300, 980], ['万一冷场', 780, 980], ['万一迟到', 300, 1110], ['万一……', 780, 1110]].forEach(([s, x, y], i) =>
      pill(s, lerp(x, 540, mg), lerp(y, 1040, mg), W1 * sstep(64.6 + i * .5, 65.0 + i * .5, t) * (1 - sstep(68.6, 69.0, t)), { size: 28, color: '#9aa3b2' }));
    pill('我能做什么？', 540, 1040, W1 * sstep(68.8, 69.3, t), { size: 36, stroke: `rgba(${T_RGB},.8)`, color: '#7fe3d3', glow: `rgba(${T_RGB},.4)` });
    text('→ 去做 ✓', 540, 1170, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: W1 * sstep(70.6, 71.0, t), glow: `rgba(${O_RGB},.5)`, blur: 14 });
  }
  const Bk = A * sstep(76.3, 76.8, t);
  if (Bk > 0) {                                                                                     // 诺伦的书
    const rise = 40 * (1 - E.out(prog(t, 76.3, 77.3)));
    ctx.save(); ctx.globalAlpha = Bk; ctx.translate(540, 980 + rise); ctx.rotate(-.04);
    ctx.shadowColor = `rgba(${O_RGB},.35)`; ctx.shadowBlur = 40; ctx.fillStyle = '#1d1a17'; ctx.fillRect(-165, -220, 330, 440); ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2; ctx.strokeRect(-165, -220, 330, 440);
    ctx.fillStyle = 'rgba(242,161,74,.8)'; ctx.fillRect(-165, -220, 14, 440);
    ctx.fillStyle = ORANGE; ctx.fillRect(-120, -150, 60, 4);
    ctx.restore();
    ctx.save(); ctx.translate(540, 980 + rise); ctx.rotate(-.04);
    ['The Positive', 'Power of', 'Negative', 'Thinking'].forEach((s, i) => text(s, -120, -96 + i * 56, { font: LAT, size: 44, weight: 600, color: i === 2 ? '#ffd2a0' : CREAM, alpha: Bk }));
    text('Julie K. Norem', -120, 150, { font: LAT, size: 28, weight: 500, color: DIM, alpha: Bk });
    text('2001', -120, 186, { font: LAT, size: 24, weight: 500, color: '#6f7786', alpha: Bk });
    ctx.restore();
  }
}

// ======================================================================== ⑥ 带伞：雨下起来，伞撑开
function sceneRain(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), k = E.outExpo(prog(t, CLIMAX + .3, CLIMAX + 1.3));
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  rain(t, A * (1 - .45 * fin), k);
  umbrella(A, k, fin + .3 * Math.sin(t * 2) * (1 - fin));
  person(498, 1290, 1.3, A * sstep(CLIMAX + .2, CLIMAX + .8, t), '#ffd2a0');
  ctx.save(); ctx.globalAlpha = A * sstep(CLIMAX + .2, CLIMAX + .8, t); ctx.fillStyle = '#ffd2a0'; ctx.beginPath(); ctx.arc(UMB.x, UMB.y + 176, 9, 0, TAU); ctx.fill(); ctx.restore();   // 握伞的手
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('“消极思维的', 540, 440, { ...big, size: 56, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('积极力量”', 540, 548, { ...big, size: 72, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.4, CLIMAX + 2.4), qa);
  typeText('—— 诺伦，2001 年的书名', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.6, CLIMAX + 3.2), qa);
  typeText('往坏处想，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('往好处做。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneDP(t); sceneDont(t); sceneDiff(t); sceneCost(t); sceneRain(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 68.8, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1986', 'Norem & Cantor · Cogn Ther Res', 8.2, 35.3, T);
  stamp('1993', 'Norem & Illingworth · JPSP', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(42);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在升 G 小调里，最后一个和弦是升 G 大调）
const NOTE = { Gs3: 207.65, B3: 246.94, C4: 261.63, Ds4: 311.13, Gs4: 415.30, B4: 493.88, Ds5: 622.25, Gs5: 830.61, B5: 987.77, C6: 1046.50, Ds6: 1244.51, Gs6: 1661.22 };
const GSM_SHIM = [NOTE.B5, NOTE.Ds5, NOTE.Gs5, NOTE.Gs4, NOTE.Ds4], GSMAJ_SHIM = [NOTE.C6, NOTE.Ds5, NOTE.Gs5, NOTE.Gs4, NOTE.Ds4], GSM_SWELL = [51.91, 77.78, 103.83, 123.47, 155.56];
function CUES() {
  const c = [];
  c.push([1.0, 'tink', { f: NOTE.B4, gain: .06 }], [2.0, 'tink', { f: NOTE.Ds5, gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Gs3, NOTE.B3, NOTE.Ds4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Ds5, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 207, f1: 415, dur: .8, gain: .08 }], [11.6, 'bar', { f0: 207, f1: 311, dur: .8, gain: .08 }], [13.7, 'tink', { f: NOTE.Gs5, gain: .06 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: GSM_SHIM, gain: .28 }]);
  c.push([20.6, 'bar', { f0: 415, f1: 207, dur: 1.2, gain: .08 }]);
  [24.1, 24.9, 25.7].forEach(t => c.push([t, 'thud', { gain: .1 }]));
  [27.9, 28.6, 29.3].forEach((t, i) => c.push([t, 'swish', { gain: .08 }], [t + .4, 'tink', { f: [NOTE.Gs4, NOTE.B4, NOTE.Ds5][i], gain: .06 }]));
  c.push([31.7, 'page', { gain: .18 }]);
  c.push([DONT, 'whoosh', { dur: .5, gain: .25 }], [38.0, 'tink', { f: NOTE.B4, gain: .06 }], [39.2, 'thud', { gain: .14 }], [40.9, 'drone', { dur: 3.4, gain: .05 }]);
  c.push([41.3, 'thud', { gain: .1 }], [45.3, 'thud', { gain: .1 }], [49.1, 'chord', { f: [NOTE.Gs4, NOTE.B4, NOTE.Ds5], gain: .1 }], [49.2, 'tink', { f: NOTE.Ds6, gain: .08 }]);
  c.push([DIFF, 'whoosh', { dur: .5, gain: .22 }], [54.0, 'thud', { gain: .1 }], [57.9, 'arrow', { gain: .08 }], [58.6, 'stop', { gain: .1 }], [60.4, 'arrow', { gain: .08 }], [61.1, 'tink', { f: NOTE.B5, gain: .08 }]);
  [64.6, 65.1, 65.6, 66.1].forEach(t => c.push([t, 'click', { gain: .1 }]));
  c.push([67.9, 'suck', { dur: 1.0, gain: .06 }], [68.9, 'tink', { f: NOTE.Ds5, gain: .07 }], [70.6, 'tink', { f: NOTE.Gs5, gain: .08 }], [72.3, 'whoosh', { dur: .8, gain: .12 }]);
  c.push([76.4, 'page', { gain: .2 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: GSM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: GSM_SHIM, gain: .42 }], [CLIMAX + .3, 'swish', { gain: .14 }], [CLIMAX + .4, 'air', { dur: 10, hum: 103.83, gain: .14 }]);
  c.push([CLIMAX + .2, 'dust', { dur: 15, gain: .07 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: GSMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Gs3, NOTE.C4, NOTE.Ds4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
