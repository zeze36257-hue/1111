// ======================================================================== No.30 利己主义：人，都是自私的吗？
// 第四季·你身上的主义 ⑦。开头是一道选择题：陌生人分 100 块只给你 10 块，你拒绝的话两人都拿不到，你要不要？（最后通牒博弈，Güth et al., 1982 起）
// 音乐：原创配乐（music.py，A 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机被两个声部“分着”唱：一句在高处，回答低一个八度。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 高估自私（每拍一个鼓点） · 53.33 自我实现（紧张） · 64.0 另一本书（只剩钢琴） · 80.0 高潮 · 96.0 A 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), OVER_ = BT(56), SELF = BT(80), BOOK = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['最后通牒', 0, LIFT], ['屠夫与面包师', LIFT, OVER_], ['高估自私', OVER_, SELF], ['自我实现', SELF, BOOK], ['另一本书', BOOK, CLIMAX], ['道德情操论', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.30';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '陌生人拿到 100 块，要分你一点。他只给你 10 块。'],
  [4.1, 7.6, '你接受，两人照分；你拒绝，两个人都拿不到。要不要？'],
  [8.2, 10.4, '实验里，很多人宁可一分都不要。'],
  [10.8, 13.3, '低于两成的分法，常常被直接拒绝。'],
  [13.6, 15.7, '而大多数分钱的人，主动给了四五成。'],
  [16.3, 19.6, '这个实验叫「最后通牒博弈」，在很多国家都做过。'],
  [19.9, 23.7, '可按经济学的老假设，人应该只算对自己有利的账。'],
  [24.0, 27.4, '亚当·斯密有一句名言：'],
  [27.7, 31.3, '我们有饭吃，不是因为屠夫和面包师心善，'],
  [31.6, 35.3, '而是因为他们在乎自己的利益。'],
  [37.6, 40.6, '这就是「利己主义」：人归根到底，只为自己。'],
  [40.9, 44.6, '可我们往往高估了别人的自私。'],
  [44.9, 48.6, '一项研究里，人们以为给钱，会让多得多的人去献血；'],
  [48.9, 52.9, '实际上，钱的作用远没有大家猜的那么大。'],
  [53.6, 57.6, '心理学家米勒认为，这个信念会自我实现：'],
  [57.9, 63.4, '你越相信人都自私，就越会防着别人、算计别人，最后只看见自私。'],
  [64.3, 67.6, '有意思的是，写下屠夫那句话的亚当·斯密，'],
  [67.9, 71.9, '还写过另一本书，叫《道德情操论》。'],
  [72.2, 75.9, '他一辈子都在修改它，最后一版出在他去世那年。'],
  [76.3, 79.6, '书的第一句是：'],
  [84.9, 88.6, '人当然在乎自己，'],
  [88.9, 92.6, '但也会为了公平，放弃到手的钱。'],
  [98.4, 103.0, '评论区：给你 10 块，你要还是不要？'],
];
const BIGLINES = [
  [80.2, 92.6, '「无论人们认为一个人有多么自私，他的天性里显然还有一些东西，让他关心别人的命运。」—— 亚当·斯密《道德情操论》'],
  [93.4, 98.0, '别急着用「人都是自私的」，给世界下结论。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [OVER_ - .5, .2], [OVER_, .06], [BOOK, .06],
  [BOOK + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人和硬币
function person(x, y, s, a, col = CREAM, face = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * face, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function coin(x, y, r, a, col = '#f2c76a') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.shadowColor = 'rgba(242,199,106,.6)'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(120,80,20,.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r * .65, 0, TAU); ctx.stroke(); ctx.restore();
}
let COINS = [];

// ======================================================================== ① 最后通牒（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('100 块，他分你 10 块；你拒绝，两人都没有：', 540, 452, { ...big, size: 40, weight: 700 }, 1, 1 - qOut);
  typeText('你要不要？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const pa = 1 - sstep(10.6, 11.0, t);
  person(220, 1080, 1.1, pa, '#9aa3b2', 1); person(860, 1080, 1.1, pa, '#ffd2a0', -1);
  text('他', 220, 1170, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#9aa3b2', alpha: pa }); text('你', 860, 1170, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: pa });
  const split = E.io(prog(t, .4, 2.2)), rej = E.out(prog(t, Q.REVEAL, Q.REVEAL + .6));
  COINS.forEach((c, i) => {                                                                  // 100 枚硬币：90 枚往他那边，10 枚往你这边
    const mine = i >= 90, tx = mine ? 790 + (i - 90) % 5 * 28 : 280 + (i % 10) * 26, ty = mine ? 840 + Math.floor((i - 90) / 5) * 28 : 760 + Math.floor(i / 10) * 26;
    const x = lerp(c.x, tx, split), y = lerp(c.y, ty, split) + rej * (200 + 300 * c.r);
    coin(x, y, 10, 1 - rej);
  });
  text('90', 400, 1040, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#9aa3b2', alpha: split * (1 - rej) });
  text('10', 845, 790, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: split * (1 - rej) });
  if (rej > 0) {
    ctx.save(); ctx.globalAlpha = rej * (1 - sstep(10.6, 11.0, t)); ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(229,72,77,.7)'; ctx.shadowBlur = 20;
    const k = 60 * rej; ctx.beginPath(); ctx.moveTo(540 - k, 860 - k); ctx.lineTo(540 + k, 860 + k); ctx.moveTo(540 + k, 860 - k); ctx.lineTo(540 - k, 860 + k); ctx.stroke(); ctx.restore();
    text('很多人：不要', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: '#f0a0a0', alpha: rej * (1 - sstep(10.6, 11.0, t)), glow: 'rgba(229,72,77,.5)', blur: 18 });
  }
  const ba = sstep(10.8, 11.3, t) * (1 - sstep(15.0, 15.6, t));                               // 分法的分布（示意）
  if (ba > 0) {
    const base = 1300, bars = [[10, .2, '#e5484d'], [20, .35, '#e5484d'], [30, .5, CREAM], [40, .95, ORANGE], [50, 1, ORANGE]];
    bars.forEach(([pct, h, col], i) => {
      const x = 250 + i * 145, t0 = i < 2 ? 10.9 + i * .2 : 13.6 + (i - 2) * .15, k = E.out(prog(t, t0, t0 + .8));
      ctx.save(); ctx.globalAlpha = ba; ctx.fillStyle = col; ctx.globalAlpha *= .85; ctx.fillRect(x - 40, base - 220 * h * k, 80, 220 * h * k); ctx.restore();
      text(`${pct}`, x, base + 30, { font: SERIF, size: 26, align: 'center', color: '#9aa3b2', alpha: ba });
    });
    text('给对方几成（示意）', 540, base + 70, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: ba });
    text('低于两成：常被拒绝', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(10.8, 11.3, t) * (1 - sstep(13.4, 13.7, t)) });
    text('大多数：给四五成', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(13.6, 14.0, t) });
  }
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 要', 220], ['B · 不要', 540], ['C · 看心情', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 经济人 · 屠夫和面包师
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('利己主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EGOISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 28, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ⑦', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function shop(x, y, a, sign, col) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(216,199,159,.8)'; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(20,20,26,.95)';
  ctx.beginPath(); ctx.rect(x - 130, y - 120, 260, 220); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? 'rgba(236,230,218,.75)' : col; ctx.beginPath(); ctx.moveTo(x - 140 + i * 47, y - 120); ctx.lineTo(x - 140 + (i + 1) * 47, y - 120); ctx.lineTo(x - 140 + (i + 1) * 47 - 6, y - 80); ctx.lineTo(x - 140 + i * 47 + 6, y - 80); ctx.closePath(); ctx.fill(); }
  ctx.strokeRect(x - 30, y + 10, 60, 90); ctx.restore();
  text(sign, x, y - 150, { font: SERIF, size: 38, weight: 900, align: 'center', color: '#d8c79f', alpha: a });
}
function sceneSmith(t) {
  if (t < 19.7 || t > OVER_ + .2) return;
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.1, t));                                // 经济学的老假设：一个只会算账的人
  if (A1 > 0) {
    person(540, 1060, 1.5, A1, CREAM);
    ctx.save(); ctx.globalAlpha = A1; ctx.fillStyle = 'rgba(30,34,44,.95)'; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(470, 720, 140, 180, 14); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 9; i++) { ctx.fillStyle = i === 8 ? ORANGE : 'rgba(236,230,218,.4)'; ctx.fillRect(485 + (i % 3) * 40, 790 + Math.floor(i / 3) * 34, 30, 24); } ctx.fillStyle = TEAL; ctx.fillRect(485, 735, 110, 40); ctx.restore();
    text('只算自己的账', 540, 1250, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: A1 * sstep(20.6, 21.2, t) });
  }
  const A2 = sstep(24.0, 24.5, t) * (1 - sstep(OVER_ - .6, OVER_ - .05, t));
  if (A2 > 0) {
    shop(280, 1040, A2 * sstep(27.7, 28.3, t), '肉铺', '#c0504d'); shop(800, 1040, A2 * sstep(28.4, 29.0, t), '面包店', '#d9a066');
    const flow = sstep(31.6, 32.0, t);
    for (let i = 0; i < 8; i++) { const ph = ((t - 31.6) * .6 + i / 8) % 1; if (flow > 0) coin(lerp(380, 700, ph), 1000 - 120 * Math.sin(PI * ph), 9, A2 * flow * Math.sin(PI * ph)); }
    typeText('亚当·斯密', 540, 640, { ...big, size: 52, weight: 900 }, prog(t, 24.2, 25.0), A2);
    typeText('《国富论》1776', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 24.8, 25.6), A2);
  }
}

// ======================================================================== ③ 高估自私：献血（示意）
function drop(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#e5484d'; ctx.shadowColor = 'rgba(229,72,77,.7)'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(0, -60); ctx.bezierCurveTo(30, -20, 44, 10, 44, 30); ctx.arc(0, 30, 44, 0, PI); ctx.bezierCurveTo(-44, 10, -30, -20, 0, -60); ctx.fill(); ctx.restore();
}
function sceneOver(t) {
  if (t < OVER_ - .3 || t > SELF + .2) return;
  const A = sstep(OVER_ - .1, OVER_ + .5, t) * (1 - sstep(SELF - .6, SELF - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - OVER_) / BEAT) % 1);
  const A1 = A * (1 - sstep(40.4, 40.9, t));
  if (A1 > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(1 + .04 * bk, 1 + .04 * bk); text('人归根到底，只为自己？', 0, 0, { font: SERIF, size: 64, weight: 900, align: 'center', color: CREAM, alpha: A1 }); ctx.restore(); }
  const A2 = A * sstep(40.9, 41.5, t);
  if (A2 > 0) {
    drop(540, 720, 1.1 + .04 * bk, A2);
    text('+ 给钱', 640, 650, { font: SERIF, size: 36, weight: 900, color: '#f2c76a', alpha: A2 * sstep(44.9, 45.4, t) });
    const base = 1250, g1 = E.out(prog(t, 45.4, 46.6)), g2 = E.out(prog(t, 49.0, 50.2));
    seg(260, base, 820, base, 'rgba(236,230,218,.35)', 2, A2);
    [['大家猜的影响', 400, 300 * g1, '#f0a0a0', '240,160,160'], ['实际的影响', 680, 110 * g2, TEAL, T_RGB]].forEach(([lab, x, h, col, rgb], i) => {
      ctx.save(); ctx.globalAlpha = A2; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - 60, base - h, 120, h); ctx.restore();
      text(lab, x, base + 40, { font: SANS, size: 26, align: 'center', color: col, alpha: A2 * (i ? sstep(48.9, 49.3, t) : sstep(44.9, 45.3, t)) });
    });
    text('示意', 820, base - 340, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: A2 });
  }
}

// ======================================================================== ④ 自我实现：两个人之间，墙一块块垒起来
function sceneSelf(t) {
  if (t < SELF - .3 || t > BOOK + .2) return;
  const A = sstep(SELF - .1, SELF + .5, t) * (1 - sstep(BOOK - .7, BOOK - .1, t));
  if (A <= 0) return;
  const close = 1 - E.io(prog(t, 57.9, 62.0));
  person(540 - lerp(260, 120, close), 1120, 1.2, A, '#9aa3b2', 1); person(540 + lerp(260, 120, close), 1120, 1.2, A, '#9aa3b2', -1);
  const bricks = Math.floor(clamp(prog(t, 58.2, 63.2)) * 18);
  for (let i = 0; i < bricks; i++) {
    const row = Math.floor(i / 3), col = i % 3, x = 540 - 60 + col * 40 + (row % 2) * 20 - 10, y = 1170 - row * 34;
    ctx.save(); ctx.globalAlpha = A * sstep(0, 1, (bricks - i) / 1.5 + .4); ctx.fillStyle = 'rgba(150,90,70,.9)'; ctx.strokeStyle = 'rgba(30,20,16,.9)'; ctx.lineWidth = 2; ctx.fillRect(x - 18, y - 15, 36, 30); ctx.strokeRect(x - 18, y - 15, 36, 30); ctx.restore();
  }
  pill('“他肯定只为自己”', 540, 700, A * sstep(57.9, 58.5, t), { size: 30, stroke: 'rgba(240,160,160,.7)', color: '#f0a0a0' });
  text('自我实现的预言', 540, 790, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(54.0, 54.6, t) * (1 - sstep(57.6, 58.0, t)) });
}

// ======================================================================== ⑤ 另一本书：《道德情操论》，改了六版
function book(x, y, a, title, sub, col, open = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.roundRect(-100, -140, 200, 280, 8); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,240,220,.9)'; ctx.fillRect(-100, 130, 200, 10);
  ctx.restore();
  text(title, x, y - 30, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#1a120a', alpha: a });
  text(sub, x, y + 30, { font: SERIF, size: 26, weight: 700, align: 'center', color: '#2a1d10', alpha: a });
}
function sceneBook(t) {
  if (t < BOOK - .2 || t > CLIMAX + .3) return;
  const A = sstep(BOOK + .2, BOOK + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  book(330, 930, A * sstep(64.4, 65.0, t) * (1 - .5 * sstep(67.9, 68.5, t)), '国富论', '1776', '#b8a070');
  book(750, 930, A * sstep(67.9, 68.5, t), '道德情操论', '1759', '#e8c88a');
  const ed = 1 + Math.floor(clamp(prog(t, 72.2, 75.4)) * 5);
  if (t > 72.2) {
    text(`第 ${ed} 版`, 750, 1150, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(72.2, 72.6, t) });
    text(ed >= 6 ? '1790 · 他去世那年' : ['1759', '1761', '1767', '1774', '1781'][ed - 1], 750, 1210, { font: SERIF, size: 28, align: 'center', color: DIM, alpha: A * sstep(72.2, 72.6, t) });
  }
}

// ======================================================================== ⑥ 道德情操论：墙塌了，两个人把硬币分成两半
function sceneSentiments(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1080, 760);
  person(300, 1180, 1.2, A, '#ffd2a0', 1); person(780, 1180, 1.2, A, '#ffd2a0', -1);
  const share = E.io(prog(t, 84.9, 88.4));
  COINS.forEach((c, i) => {
    const left = i % 2 === 0, k = Math.floor(i / 2), tx = (left ? 400 : 680) + (k % 5 - 2) * 24 * (left ? 1 : -1), ty = 1060 - Math.floor(k / 5) * 22;
    const sx = 540 + (c.x - 540) * .4, sy = 980 + (c.y - 900) * .3;
    coin(lerp(sx, tx, share), lerp(sy, ty, share), 9, A * sstep(CLIMAX + 1 + c.r, CLIMAX + 1.5 + c.r, t));
  });
  if (share > .9) { text('50', 400, 820, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(88.4, 88.9, t) }); text('50', 680, 820, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(88.4, 88.9, t) }); }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「无论人们认为一个人有多么自私，', 540, 470, { ...big, size: 48, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.5), qa);
  typeText('他的天性里显然还有一些东西，', 540, 560, { ...big, size: 48, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.6, CLIMAX + 2.7), qa);
  typeText('让他关心别人的命运。」', 540, 654, { ...big, size: 58, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.8, CLIMAX + 3.7), qa);
  typeText('—— 亚当·斯密《道德情操论》', 540, 744, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.9, CLIMAX + 4.5), qa);
  typeText('别急着用「人都是自私的」，', 540, 560, { ...big, size: 52, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('给世界下结论。', 540, 666, { ...big, size: 72, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneSmith(t); sceneOver(t); sceneSelf(t); sceneBook(t); sceneSentiments(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 67.9, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1982', 'Güth, Schmittberger & Schwarze · JEBO', 8.2, 23.7, T);
  stamp('1776', 'Adam Smith · The Wealth of Nations', 24.0, 35.3, T);
  stamp('1998', 'Miller & Ratner · JPSP', 40.9, 52.9, T);
  stamp('1999', 'Miller · Am Psychol', 53.6, 63.4, T);
  stamp('1759', 'Adam Smith · The Theory of Moral Sentiments', 67.9, 79.6, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(30);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rc = mulberry(301);
  COINS = Array.from({ length: 100 }, (_, i) => ({ x: 540 + (i % 10 - 4.5) * 24 + (rc() - .5) * 6, y: 820 + Math.floor(i / 10) * 22 + (rc() - .5) * 6, r: rc() }));
}

// ======================================================================== 音效提示表（音高都在 A 小调里，最后一个和弦是 A 大调）
const NOTE = { A4: 440, C5: 523.25, Cs5: 554.37, E5: 659.26, A5: 880, C6: 1046.5, Cs6: 1108.73, E6: 1318.51, A6: 1760, C7: 2093, Cs7: 2217.46 };
const AM_SHIM = [NOTE.C7, NOTE.E6, NOTE.A6, NOTE.A5, NOTE.E5], AMAJ_SHIM = [NOTE.Cs7, NOTE.E6, NOTE.A6, NOTE.A5, NOTE.E5], AM_SWELL = [110, 164.81, 220, 261.63, 329.63];
function CUES() {
  const c = [];
  for (let i = 0; i < 8; i++) c.push([.5 + i * .2, 'tink', { f: [NOTE.A6, NOTE.E6][i % 2], gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'crack', { gain: .3 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.A4, NOTE.C5, NOTE.E5], gain: .22 }], [Q.REVEAL + .3, 'dust', { dur: 1.6, gain: .12 }]);
  c.push([10.8, 'bar', { f0: 330, f1: 220, dur: .8, gain: .16 }], [13.6, 'bar', { f0: 330, f1: 660, dur: .9, gain: .18 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: AM_SHIM, gain: .28 }]);
  c.push([20.0, 'click', { gain: .2 }], [20.3, 'click', { gain: .16 }], [20.6, 'tink', { f: NOTE.E6, gain: .12 }], [27.7, 'thud', { gain: .14 }], [28.4, 'thud', { gain: .14 }]);
  for (let i = 0; i < 4; i++) c.push([31.8 + i * .6, 'tink', { f: NOTE.A6, gain: .06 }]);
  c.push([OVER_, 'whoosh', { dur: .5, gain: .25 }], [40.9, 'tink', { f: NOTE.E6, gain: .12 }], [45.4, 'bar', { f0: 220, f1: 660, dur: 1.2, gain: .18 }], [49.0, 'bar', { f0: 220, f1: 330, dur: 1.2, gain: .16 }]);
  c.push([SELF, 'whoosh', { dur: .5, gain: .22 }]);
  for (let i = 0; i < 6; i++) c.push([58.4 + i * .8, 'thud', { gain: .12 + .01 * i }]);
  c.push([64.4, 'page', { gain: .24 }], [67.9, 'page', { gain: .24 }], [72.2, 'tink', { f: NOTE.C6, gain: .1 }], [75.4, 'chord', { f: [NOTE.A4, NOTE.C5, NOTE.E5], gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: AM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: AM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 110, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: AMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.A4, NOTE.Cs5, NOTE.E5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
