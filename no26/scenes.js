// ======================================================================== No.26 拜金主义：钱，能买到快乐吗？
// 第四季·你身上的主义 ③。开头是一道选择题：你年薪 5 万、别人 2.5 万，还是你 10 万、别人 20 万？（Solnick & Hemenway, 1998：将近一半选前者）
// 音乐：原创配乐（music.py，降 E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机每一句都先“叮叮”两声，像两枚硬币。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 翻倍（每拍一个鼓点） · 53.33 邻居（紧张） · 64.0 比较的链子（只剩钢琴） · 80.0 高潮 · 96.0 降 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), DOUBLE = BT(56), NEIGH = BT(80), CHAIN = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['收入测试', 0, LIFT], ['7.5 万美元', LIFT, DOUBLE], ['翻倍', DOUBLE, NEIGH], ['邻居', NEIGH, CHAIN], ['比较的链子', CHAIN, CLIMAX], ['罗素', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.26';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, 'A：你年薪 5 万，身边的人都是 2.5 万。'],
  [4.1, 7.6, 'B：你年薪 10 万，身边的人都是 20 万。你选哪个？'],
  [8.2, 10.4, '将近一半的人，选了 A。'],
  [10.8, 13.3, '宁愿少赚一半，也要比别人多。'],
  [13.6, 15.7, '那钱，到底能不能买到快乐？'],
  [16.3, 19.6, '2010 年，一项很有名的研究说：'],
  [19.9, 23.7, '年收入过了 7.5 万美元，日常的快乐就不再上升。'],
  [24.0, 27.4, '这个数字，后来传遍了全世界。'],
  [27.7, 31.3, '可 2021 年，有人用手机追踪了三万多人的心情，'],
  [31.6, 35.3, '发现快乐一直在涨，过了 7.5 万也没停。'],
  [37.6, 40.6, '后来，两边的学者一起重新分析。'],
  [40.9, 44.6, '2023 年的结论：对大多数人，快乐会随收入一直上升；'],
  [44.9, 48.6, '只有最不快乐的那群人，到 10 万美元左右就停了。'],
  [48.9, 52.9, '但要注意：收入每翻一倍，快乐才多一格。'],
  [53.6, 57.6, '而且我们在乎的不只是钱，还有「比别人多」。'],
  [57.9, 63.4, '一项研究发现：自己收入不变，邻居赚得越多，人就越不快乐。'],
  [64.3, 67.6, '哲学家罗素说，比较是一条没有尽头的链子：'],
  [67.9, 71.9, '你羡慕的人，也在羡慕别人。'],
  [72.2, 75.9, '就算你站到了最前面，前面还有一个。'],
  [76.3, 79.6, '他在《幸福之路》里写：'],
  [84.9, 88.6, '钱能买到的快乐，是真的。'],
  [88.9, 92.6, '只是别拿别人的数字，来量自己的日子。'],
  [98.4, 103.0, '评论区：A 和 B，你选哪个？'],
];
const BIGLINES = [
  [80.2, 92.6, '「拿破仑嫉妒恺撒，恺撒嫉妒亚历山大，而亚历山大，大概嫉妒那个根本不存在的赫拉克勒斯。」—— 罗素《幸福之路》'],
  [93.4, 98.0, '钱能买到快乐，买不到「比别人多」。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [DOUBLE - .5, .2], [DOUBLE, .06], [CHAIN, .06],
  [CHAIN + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== ① 收入测试（0–16）
function jobCard(x, y, lab, you, others, a, t, hi = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(24,24,32,.95)'; ctx.strokeStyle = hi > 0 ? `rgba(${O_RGB},${.5 + .5 * hi})` : 'rgba(236,230,218,.3)'; ctx.lineWidth = 2.5;
  ctx.shadowColor = `rgba(${O_RGB},${.5 * hi})`; ctx.shadowBlur = 30 * hi;
  ctx.beginPath(); ctx.roundRect(x - 210, y - 230, 420, 460, 24); ctx.fill(); ctx.stroke(); ctx.restore();
  text(lab, x, y - 160, { font: SERIF, size: 96, weight: 900, align: 'center', color: hi > 0 ? '#ffd2a0' : CREAM, alpha: a });
  const sc = 12;                                                                       // 1 万 = 12 像素
  [['你', you, ORANGE, O_RGB, -30], ['别人', others, '#9aa3b2', '154,163,178', 70]].forEach(([who, v, col, rgb, dy]) => {
    const w = v * sc * E.out(prog(t, .6, 1.8));
    text(who, x - 170, y + dy, { font: SANS, size: 28, weight: 500, color: col, alpha: a });
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.beginPath(); ctx.roundRect(x - 100, y + dy - 15, Math.max(4, w), 30, 8); ctx.fill(); ctx.restore();
    text(`${v} 万`, x - 100 + Math.max(4, w) + 12, y + dy + 1, { font: SERIF, size: 28, weight: 900, color: col, alpha: a * sstep(1.2, 1.8, t) });
  });
}
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('两份工作，物价一样：', 540, 452, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('你选哪一个？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const rev = E.out(prog(t, Q.REVEAL, Q.REVEAL + .6)), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  ctx.save(); ctx.translate(300, 900); ctx.scale(1 + .02 * beatK, 1 + .02 * beatK); ctx.translate(-300, -900); jobCard(300, 900, 'A', 5, 2.5, 1, t, rev * (1 - .5 * sstep(13.4, 13.8, t))); ctx.restore();
  ctx.save(); ctx.translate(780, 900); ctx.scale(1 + .02 * beatK, 1 + .02 * beatK); ctx.translate(-780, -900); jobCard(780, 900, 'B', 10, 20, 1, t, 0); ctx.restore();
  if (rev > 0) {                                                                          // 将近一半选 A
    const pct = 48 * rev;
    ctx.save(); ctx.globalAlpha = rev; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(236,230,218,.15)'; ctx.beginPath(); ctx.arc(540, 1290, 58, 0, TAU); ctx.stroke();
    ctx.strokeStyle = ORANGE; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(540, 1290, 58, -PI / 2, -PI / 2 + TAU * pct / 100); ctx.stroke(); ctx.restore();
    text(`${Math.round(pct)}%`, 540, 1292, { font: SERIF, size: 40, weight: 900, align: 'center', color: ORANGE, alpha: rev });
    text('选 A', 540, 1380, { font: SANS, size: 28, weight: 500, align: 'center', color: '#ffd2a0', alpha: rev });
  }
  text('宁愿少赚一半', 540, 560, { font: SERIF, size: 66, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.8, 11.3, t) * (1 - sstep(13.4, 13.7, t)), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  text('钱能买到快乐吗？', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: CREAM, alpha: sstep(13.6, 14.1, t) });
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

// ======================================================================== ② 标题 · 7.5 万美元 · 一直在涨
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('拜金主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('MAMMONISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ③', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
// 收入（对数轴）和快乐：x 从 1 万到 50 万美元
const CX0 = 150, CX1 = 930, CY0 = 1060, CH = 330;
const lx = k => CX0 + (CX1 - CX0) * Math.log(k / 1) / Math.log(50);                        // k：万美元
function axes(a, t) {
  seg(CX0, CY0, CX1, CY0, 'rgba(236,230,218,.35)', 2, a); seg(CX0, CY0, CX0, CY0 - CH - 20, 'rgba(236,230,218,.25)', 2, a);
  [[1, '1 万'], [2.5, '2.5 万'], [7.5, '7.5 万'], [20, '20 万'], [50, '50 万']].forEach(([k, s]) => text(s, lx(k), CY0 + 34, { font: SERIF, size: 24, align: 'center', color: '#6f7786', alpha: a }));
  text('年收入（美元）', CX1, CY0 + 76, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: a });
  text('快乐', CX0 - 12, CY0 - CH - 40, { font: SANS, size: 24, color: DIM, alpha: a });
}
const happy = k => CY0 - 30 - (CH - 60) * Math.log(k) / Math.log(50);                       // 对数增长：一条直线
function sceneMoney(t) {
  if (t < 19.7 || t > NEIGH + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(NEIGH - .6, NEIGH - .05, t));
  if (A <= 0) return;
  axes(A, t);
  const flatK = sstep(19.9, 23.0, t), flatOut = sstep(31.6, 32.6, t);
  drawOn(() => { for (let k = 1; k <= 50; k *= 1.05) { const y = k < 7.5 ? happy(k) : happy(7.5); k === 1 ? ctx.moveTo(lx(k), y) : ctx.lineTo(lx(k), y); } }, 1100, flatK, '#9aa3b2', 4, A * (1 - .75 * flatOut) * (1 - sstep(36.8, 37.4, t)));
  const m75 = A * sstep(21.4, 22.0, t) * (1 - sstep(36.8, 37.4, t));
  if (m75 > 0) { ctx.save(); ctx.globalAlpha = m75; ctx.setLineDash([6, 8]); seg(lx(7.5), CY0, lx(7.5), CY0 - CH, '#ffd2a0', 2, 1); ctx.restore(); text('2010：7.5 万后变平？', lx(7.5) + 16, CY0 - CH - 10, { font: SERIF, size: 30, weight: 900, color: '#ffd2a0', alpha: m75 }); }
  const news = A * sstep(24.0, 24.6, t) * (1 - sstep(27.3, 27.8, t));                        // 传遍全世界
  ['头条', '转发 10 万+', '“7.5 万美元”', '热搜'].forEach((s, i) => pill(s, [250, 820, 300, 760][i], [640, 600, 520, 500][i] + Math.sin(t * 2 + i) * 6, news * sstep(24.0 + i * .3, 24.4 + i * .3, t), { size: 26 }));
  const pings = A * sstep(27.7, 28.2, t) * (1 - sstep(37.0, 37.6, t));                        // 手机上的心情采样
  if (pings > 0) {
    for (let i = 0; i < 60; i++) {
      const r = mulberry(2600 + i), k = Math.exp(r() * Math.log(50)), x = lx(k), yT = happy(k) + (r() - .5) * 90, born = 27.8 + r() * 3.4, p = prog(t, born, born + .7);
      if (p <= 0) continue;
      glow(x, lerp(560, yT, E.out(p)), 3, T_RGB, pings * .8, 3);
    }
  }
  const up = sstep(31.6, 33.2, t);
  drawOn(() => { for (let k = 1; k <= 50; k *= 1.05) { const y = happy(k); k === 1 ? ctx.moveTo(lx(k), y) : ctx.lineTo(lx(k), y); } }, 1100, up, TEAL, 5, A, `rgba(${T_RGB},.7)`);
  if (up > .9) text('一直在涨', lx(30), happy(30) - 40, { font: SERIF, size: 34, weight: 900, align: 'center', color: TEAL, alpha: A * sstep(33.0, 33.5, t) * (1 - sstep(40.6, 41.0, t)) });
  const unhappy = sstep(44.9, 46.4, t);                                                       // 最不快乐的那群人：10 万左右变平
  const sad = k => CY0 - 16 - (CH - 60) * .55 * Math.log(Math.min(k, 10)) / Math.log(50);
  drawOn(() => { for (let k = 1; k <= 50; k *= 1.05) { const y = sad(k); k === 1 ? ctx.moveTo(lx(k), y) : ctx.lineTo(lx(k), y); } }, 1100, unhappy, '#8a93a3', 3, A);
  if (unhappy > .5) text('最不快乐的那群人', lx(24), sad(10) + 30, { font: SANS, size: 24, align: 'center', color: '#9aa3b2', alpha: A * sstep(46.0, 46.5, t) });
  text('大多数人', lx(22), happy(22) - 40, { font: SANS, size: 26, align: 'center', color: TEAL, alpha: A * sstep(41.0, 41.6, t) });
  const dbl = A * sstep(48.9, 49.3, t);                                                       // 每翻一倍，才多一格
  if (dbl > 0) {
    [1, 2, 4, 8, 16, 32].forEach((k, i) => {
      const s = sstep(49.0 + i * .5, 49.3 + i * .5, t); if (s <= 0) return;
      const x = lx(k * 1.25), y = happy(k * 1.25);
      glow(x, y, 7, O_RGB, dbl * s, 5);
      if (i > 0) text('+1', x, y - 34, { font: SERIF, size: 26, weight: 900, align: 'center', color: ORANGE, alpha: dbl * s });
      text(`×${k}`, x, CY0 + 120, { font: SERIF, size: 28, weight: 900, align: 'center', color: '#ffd2a0', alpha: dbl * s });
    });
    text('收入每翻一倍，快乐才 +1', 540, CY0 + 176, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: dbl * sstep(50.0, 50.6, t) });
  }
}

// ======================================================================== ④ 邻居：你的收入没变，邻居越赚越多
function house(x, y, a, me, bar, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = me ? ORANGE : 'rgba(200,205,215,.7)'; ctx.lineWidth = me ? 3 : 2; ctx.fillStyle = 'rgba(18,19,26,.95)';
  if (me) { ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 16; }
  ctx.beginPath(); ctx.moveTo(x - 60, y + 50); ctx.lineTo(x - 60, y - 20); ctx.lineTo(x, y - 70); ctx.lineTo(x + 60, y - 20); ctx.lineTo(x + 60, y + 50); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeRect(x - 14, y + 10, 28, 40);
  ctx.restore();
  const h = bar;                                                                               // 收入柱
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = me ? `rgba(${O_RGB},.85)` : 'rgba(154,163,178,.75)'; ctx.beginPath(); ctx.roundRect(x - 16, y - 90 - h, 32, h, 6); ctx.fill(); ctx.restore();
}
function smiley(x, y, r, mood, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#ffd2a0'; ctx.lineWidth = 4; ctx.shadowColor = `rgba(${O_RGB},.5)`; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#ffd2a0'; ctx.beginPath(); ctx.arc(x - r * .35, y - r * .2, 4, 0, TAU); ctx.arc(x + r * .35, y - r * .2, 4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - r * .45, y + r * .3); ctx.quadraticCurveTo(x, y + r * .3 + r * .45 * mood, x + r * .45, y + r * .3); ctx.stroke();
  ctx.restore();
}
function sceneNeighbors(t) {
  if (t < NEIGH - .3 || t > CHAIN + .2) return;
  const A = sstep(NEIGH - .1, NEIGH + .5, t) * (1 - sstep(CHAIN - .7, CHAIN - .1, t));
  if (A <= 0) return;
  const g = E.io(prog(t, 57.9, 62.5));
  [150, 345, 540, 735, 930].forEach((x, i) => house(x, 1150, A * sstep(53.8 + i * .12, 54.3 + i * .12, t), i === 2, i === 2 ? 110 : lerp(80, 80 + [180, 120, 0, 150, 210][i], g), t));
  text('你', 540, 1250, { font: SERIF, size: 34, weight: 900, align: 'center', color: ORANGE, alpha: A });
  text('收入不变', 540, 1300, { font: SANS, size: 24, align: 'center', color: DIM, alpha: A * sstep(58.4, 58.9, t) });
  smiley(540, 700, 60, 1 - 1.6 * g, A * sstep(54.6, 55.2, t));
}

// ======================================================================== ⑤ 比较的链子：每个人都看着前面那个人
let CHAIN_P = [];
const PAN = track([[64.6, 0, E.lin], [79.8, 1000], [80.4, 1140], [81.2, 1350], [82.2, 1560], [83.4, 1770], [86.5, 1830]]);
function person(x, y, s, a, dotted = false, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  if (dotted) ctx.setLineDash([6, 7]);
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(30, -86); ctx.lineTo(46, -80); ctx.lineTo(30, -74); ctx.closePath(); ctx.fill();   // 看向前面
  ctx.restore();
}
function sceneChain(t) {
  if (t < CHAIN - .2) return;
  const A = sstep(CHAIN + .2, CHAIN + 1.0, t) * (1 - sstep(86.0, 87.4, t));
  if (A <= 0) return;
  const pan = PAN(t);                                                                          // 镜头一直往前走，高潮时停在拿破仑、恺撒、亚历山大、赫拉克勒斯
  CHAIN_P.forEach((p, i) => {
    const x = 220 + i * 210 - pan; if (x < -120 || x > 1200) return;
    const me = i === 0, last = i === CHAIN_P.length - 1, y = 1120;
    const nameA = p.t0 ? sstep(p.t0, p.t0 + .6, t) : 1;
    person(x, y, 1.15, A * nameA * (last ? .55 : 1), last, me ? ORANGE : p.t0 ? '#ffd2a0' : CREAM);
    text(p.s, x, y + 76, { font: SERIF, size: 30, weight: 900, align: 'center', color: me ? ORANGE : p.t0 ? '#ffd2a0' : '#b8c0cc', alpha: A * nameA });
    if (!last) { ctx.save(); ctx.globalAlpha = A * nameA * .5; ctx.setLineDash([4, 8]); ctx.lineDashOffset = -t * 30; seg(x + 60, y - 80, x + 150, y - 80, '#ffd2a0', 2, 1); ctx.restore(); }
  });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「拿破仑嫉妒恺撒，', 540, 470, { ...big, size: 56, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.2), qa);
  typeText('恺撒嫉妒亚历山大，', 540, 560, { ...big, size: 56, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.3, CLIMAX + 2.2), qa);
  typeText('而亚历山大，大概嫉妒赫拉克勒斯——', 540, 650, { ...big, size: 48, weight: 900, color: CREAM }, prog(t, CLIMAX + 2.4, CLIMAX + 3.6), qa);
  typeText('一个根本不存在的人。」', 540, 740, { ...big, size: 56, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 3.8, CLIMAX + 4.8), qa);
  typeText('—— 罗素《幸福之路》', 540, 830, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 5.0, CLIMAX + 5.6), qa);
}

// ======================================================================== ⑥ 你自己的日子：链子散了，只剩你和你自己的灯
let COINS = [];
function sceneOwn(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1080, 760);
  const B = sstep(86.4, 87.8, t);
  if (B > 0) {
    person(540, 1160, 1.3, B, false, ORANGE);
    COINS.forEach((c, i) => {                                                                   // 一枚枚硬币，变成你身边的灯
      const k = sstep(87.0 + c.d * 4, 88.0 + c.d * 4, t); if (k <= 0) return;
      const x = 540 + Math.cos(c.an) * c.r, y = 1060 + Math.sin(c.an) * c.r * .7 + Math.sin(t * 1.2 + i) * 5;
      glow(x, y, 3 + 3 * c.b + 2 * sstep(FINAL, FINAL + 1, t), '255,214,160', B * k * (.6 + .4 * Math.sin(t * 2 + i)), 5);
    });
  }
  typeText('钱能买到快乐，', 540, 560, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.3), 1);
  typeText('买不到「比别人多」。', 540, 666, { ...big, size: 72, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneMoney(t); sceneNeighbors(t); sceneChain(t); sceneOwn(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2) || (T > 64.4 && T < 92.6)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 31.6, 37.3, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1998', 'Solnick & Hemenway · J Econ Behav Organ', 8.2, 15.6, T);
  stamp('2010', 'Kahneman & Deaton · PNAS', 16.3, 27.4, T);
  stamp('2021', 'Killingsworth · PNAS', 27.7, 35.3, T);
  stamp('2023', 'Killingsworth, Kahneman & Mellers · PNAS', 40.9, 52.9, T);
  stamp('2005', 'Luttmer · QJE', 57.9, 63.4, T);
  stamp('1930', 'Russell · The Conquest of Happiness', 64.3, 79.6, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(26);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  CHAIN_P = [{ s: '你' }, { s: '同学' }, { s: '同事' }, { s: '老板' }, { s: '首富' }, { s: '……' }, { s: '……' }, { s: '……' },
    { s: '拿破仑', t0: CLIMAX + .3 }, { s: '恺撒', t0: CLIMAX + 1.0 }, { s: '亚历山大', t0: CLIMAX + 2.0 }, { s: '赫拉克勒斯', t0: CLIMAX + 3.0 }];
  const rc = mulberry(261);
  COINS = Array.from({ length: 26 }, () => ({ an: rc() * TAU, r: 170 + rc() * 230, d: rc(), b: rc() }));
}

// ======================================================================== 音效提示表（音高都在降 E 小调里，最后一个和弦是降 E 大调）
const NOTE = { Eb5: 622.25, Gb5: 739.99, G5: 783.99, Bb5: 932.33, Eb6: 1244.51, Gb6: 1479.98, G6: 1567.98, Bb6: 1864.66, Eb7: 2489.02 };
const EM_SHIM = [NOTE.Gb6, NOTE.Bb6, NOTE.Eb6, NOTE.Eb7, NOTE.Bb5], EMAJ_SHIM = [NOTE.G6, NOTE.Bb6, NOTE.Eb6, NOTE.Eb7, NOTE.Bb5], EM_SWELL = [77.78, 116.54, 155.56, 185.00, 233.08];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.Bb6, gain: .12 }], [.75, 'tink', { f: NOTE.Eb7, gain: .1 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.Eb5, NOTE.Gb5, NOTE.Bb5], gain: .24 }], [Q.REVEAL + .1, 'bar', { f0: 311, f1: 622, dur: .6, gain: .2 }], [10.8, 'tink', { f: NOTE.Bb6, gain: .14 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EM_SHIM, gain: .28 }]);
  c.push([20.0, 'swish', { gain: .2 }], [21.4, 'thud', { gain: .2 }], [24.0, 'page', { gain: .24 }], [24.6, 'page', { gain: .18 }], [31.6, 'bar', { f0: 311, f1: 932, dur: 1.4, gain: .26 }]);
  for (let i = 0; i < 6; i++) c.push([27.9 + i * .55, 'tink', { f: [NOTE.Eb6, NOTE.Gb6, NOTE.Bb6][i % 3], gain: .06 }]);
  c.push([DOUBLE, 'whoosh', { dur: .5, gain: .25 }], [40.9, 'chord', { f: [NOTE.Eb5, NOTE.Gb5, NOTE.Bb5], gain: .12 }], [44.9, 'bar', { f0: 622, f1: 466, dur: .8, gain: .18 }]);
  for (let i = 0; i < 6; i++) c.push([49.0 + i * .5, 'tink', { f: [NOTE.Bb5, NOTE.Eb6, NOTE.Gb6, NOTE.Bb6, NOTE.Eb7, NOTE.Eb7][i], gain: .1 + .01 * i }]);
  c.push([NEIGH, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'bar', { f0: 233, f1: 466, dur: 4.4, gain: .16 }], [60.0, 'bar', { f0: 622, f1: 311, dur: 2.4, gain: .16 }]);
  c.push([64.6, 'wind', { dur: 6, gain: .1 }], [72.2, 'tink', { f: NOTE.Gb6, gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: EM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 77.78, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Eb5, NOTE.G5, NOTE.Bb5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
