// ======================================================================== No.51 自然主义：天然的，就更好吗？
// 第六季·日常里的主义 ⑧。开头是一道选择题：两种药安全性、效果完全一样，一种天然、一种合成，多少人选天然？（Meier & Lappas, 2016）
// 音乐：原创配乐（music.py，E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机像一句民谣：两个短音往上，落到一个长音。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 毒蘑菇（每拍一个鼓点） · 53.33 明知更差（紧张） · 64.0 出身（只剩钢琴） · 80.0 高潮：一滴 · 96.0 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), POISON = BT(56), WORSE = BT(80), ORIGIN = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['两种药', 0, LIFT], ['一瓶水', LIFT, POISON], ['毒蘑菇', POISON, WORSE], ['明知更差', WORSE, ORIGIN], ['出身', ORIGIN, CLIMAX], ['剂量', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.51';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '两种药，安全性一样，效果也一样。'],
  [4.1, 7.6, '一种是天然的，一种是合成的。多少人选天然？先猜一个。'],
  [8.2, 10.4, '答案是：约八成。'],
  [10.8, 13.3, '明明告诉了他们：两种一模一样，'],
  [13.6, 15.7, '大多数人，还是选了「天然」。'],
  [16.3, 19.6, '心理学家罗津做过一个更妙的实验：'],
  [19.9, 23.7, '一瓶矿泉水，把里面的矿物质拿出来，再原样放回去。'],
  [24.0, 27.4, '成分一模一样，人们却觉得它「没那么天然」了。'],
  [27.7, 31.3, '我们在意的，常常不是它是什么，而是它经历过什么。'],
  [31.6, 35.3, '这就是「自然主义」的直觉：天然的，就更好。'],
  [37.6, 40.6, '可是，「天然」不等于「安全」。'],
  [40.9, 44.6, '毒蘑菇、蛇毒、砒霜，都很天然；'],
  [44.9, 48.6, '而很多救命的药，是在实验室里合成的。'],
  [48.9, 52.9, '这叫「诉诸自然」：把「天然」，当成了「好」。'],
  [53.6, 57.6, '更夸张的是：'],
  [57.9, 60.6, '就算告诉人们，天然的那种更不安全、效果更差，'],
  [60.8, 63.4, '仍然有约两成的人，选它。'],
  [64.3, 67.6, '所以，下次看到「纯天然」三个字，'],
  [67.9, 71.9, '先问一句：它安不安全？有没有用？'],
  [72.2, 75.9, '天然还是人造，只是出身；安全和有效，才是成绩。'],
  [76.3, 79.6, '约 500 年前，一位医生说过：'],
  [84.9, 88.6, '天然的不一定好，合成的也不一定坏，'],
  [88.9, 92.6, '要看的，是它到底是什么、用了多少。'],
  [98.4, 103.0, '评论区：你有没有为「纯天然」多花过钱？'],
];
const BIGLINES = [
  [80.2, 92.6, '「万物皆有毒，剂量决定它是不是毒。」—— 帕拉塞尔苏斯（大意）'],
  [93.4, 98.0, '别看出身，看成绩。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [POISON - .5, .2], [POISON, .06], [ORIGIN, .06],
  [ORIGIN + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 药瓶、叶子、烧瓶、水瓶、蘑菇、滴管
const GREEN = '#8fd18a', G_RGB = '143,209,138';
function leaf(x, y, s, a, col = GREEN) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.5); ctx.fillStyle = col; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(26, -6, 0, 30); ctx.quadraticCurveTo(-26, -6, 0, -30); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, 30); ctx.stroke(); ctx.restore();
}
function flask(x, y, s, a, col = '#c3cad6') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-8, -30); ctx.lineTo(-8, -8); ctx.lineTo(-26, 26); ctx.lineTo(26, 26); ctx.lineTo(8, -8); ctx.lineTo(8, -30); ctx.stroke();
  ctx.fillStyle = 'rgba(127,227,211,.6)'; ctx.beginPath(); ctx.moveTo(-18, 10); ctx.lineTo(18, 10); ctx.lineTo(26, 26); ctx.lineTo(-26, 26); ctx.closePath(); ctx.fill(); ctx.restore();
}
function bottle(x, y, s, a, kind, glowK = 0) {                                                    // 药瓶：kind 'leaf' 天然 / 'flask' 合成
  if (a <= 0) return;
  const rgb = kind === 'leaf' ? G_RGB : '195,202,214';
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (glowK > 0) { ctx.shadowColor = `rgba(${rgb},.7)`; ctx.shadowBlur = 30 * glowK; }
  ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = `rgba(${rgb},.85)`; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-70, -110, 140, 210, 22); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(${rgb},.85)`; ctx.fillRect(-50, -140, 100, 34);
  ctx.fillStyle = 'rgba(236,230,218,.9)'; ctx.fillRect(-56, -60, 112, 110); ctx.restore();
  if (kind === 'leaf') leaf(x, y - 8 * s, 1.1 * s, a); else flask(x, y - 8 * s, 1.1 * s, a, '#5c6575');
}
function waterBottle(x, y, s, a, t, out) {                                                         // 矿泉水瓶，矿物质（小点）出来又回去
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(111,183,255,.12)'; ctx.strokeStyle = 'rgba(169,211,255,.8)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-26, -200); ctx.lineTo(26, -200); ctx.lineTo(26, -170); ctx.quadraticCurveTo(70, -150, 70, -100); ctx.lineTo(70, 160); ctx.quadraticCurveTo(70, 180, 50, 180); ctx.lineTo(-50, 180); ctx.quadraticCurveTo(-70, 180, -70, 160); ctx.lineTo(-70, -100); ctx.quadraticCurveTo(-70, -150, -26, -170); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  const r = mulberry(5300);
  for (let i = 0; i < 18; i++) {
    const bx = x + (r() - .5) * 100 * s, by = y + (r() * 300 - 100) * s, ox = x + 220 + (r() - .5) * 120, oy = y - 40 + (r() - .5) * 160;
    glow(lerp(bx, ox, out) + 3 * Math.sin(t * 3 + i), lerp(by, oy, out), 4, '232,184,102', a, 2);
  }
}
function mushroom(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(236,230,218,.9)'; ctx.beginPath(); ctx.roundRect(-18, -40, 36, 70, 12); ctx.fill();
  ctx.fillStyle = '#d9484d'; ctx.beginPath(); ctx.ellipse(0, -40, 70, 46, 0, PI, TAU); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.9)'; for (const [dx, dy, r] of [[-34, -56, 8], [0, -74, 9], [30, -54, 7], [-10, -48, 5]]) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ======================================================================== ① 两种药（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('安全、效果都一样：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('多少人选天然？', 540, 560, { ...big, size: 82, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t), rv = sstep(Q.REVEAL, Q.REVEAL + .5, t);
  if (P > 0) {
    bottle(320, 980, 1.05, P, 'leaf', rv); bottle(760, 980, 1.05, P, 'flask');
    text('天然', 320, 1150, { font: SERIF, size: 36, weight: 900, align: 'center', color: GREEN, alpha: P });
    text('合成', 760, 1150, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#c3cad6', alpha: P });
    text('安全性 =', 540, 950, { font: SANS, size: 26, align: 'center', color: DIM, alpha: P * sstep(.6, 1.0, t) });
    text('效果 =', 540, 1000, { font: SANS, size: 26, align: 'center', color: DIM, alpha: P * sstep(1.0, 1.4, t) });
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {
    const base = 1180, k = E.out(prog(t, 11.0, 12.0));
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(200, base); ctx.lineTo(880, base); ctx.stroke();
    ctx.fillStyle = GREEN; ctx.fillRect(240, base - 4.6 * 79 * k, 160, 4.6 * 79 * k); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(680, base - 4.6 * 21 * k, 160, 4.6 * 21 * k); ctx.restore();
    text('约 79%', 320, base - 4.6 * 79 * k - 30, { font: SERIF, size: 42, weight: 900, align: 'center', color: GREEN, alpha: C * k });
    text('约 21%', 760, base - 4.6 * 21 * k - 30, { font: SERIF, size: 38, weight: 900, align: 'center', color: '#c3cad6', alpha: C * k });
    text('选天然', 320, base + 42, { font: SANS, size: 28, align: 'center', color: GREEN, alpha: C });
    text('选合成', 760, base + 42, { font: SANS, size: 28, align: 'center', color: '#c3cad6', alpha: C });
  }
  text('明明一样，还是选天然', 540, 560, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 约八成', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 约一半', 200], ['B · 约八成', 540], ['C · 几乎所有人', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 一瓶水：拿出来，再放回去
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('自然主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('NATURALISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ⑧', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneWater(t) {
  if (t < 19.7 || t > POISON + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(POISON - .6, POISON - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('拿出来，再放回去', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('成分：一模一样', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#a9d3ff', alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('在意的是「经历过什么」', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const out = E.io(prog(t, 20.4, 21.6)) * (1 - E.io(prog(t, 22.2, 23.4)));
    waterBottle(400, 1000, 1.0, D, t, out);
    const g = 1 - .55 * sstep(24.6, 25.8, t);                                                      // “天然”程度：掉下去
    text('「天然」程度', 780, 820, { font: SANS, size: 26, align: 'center', color: DIM, alpha: D * sstep(24.2, 24.6, t) });
    ctx.save(); ctx.globalAlpha = D * sstep(24.2, 24.6, t); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(740, 860, 80, 320);
    ctx.fillStyle = GREEN; ctx.fillRect(740, 860 + 320 * (1 - g), 80, 320 * g); ctx.restore();
    text('↓', 860, 1100, { font: SERIF, size: 60, weight: 900, align: 'center', color: '#f0a0a0', alpha: D * sstep(25.6, 26.0, t) });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('自然主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('天然的，就更好', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GREEN, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 毒蘑菇：天然不等于安全
function scenePoison(t) {
  if (t < POISON - .3 || t > WORSE + .2) return;
  const A = sstep(POISON - .1, POISON + .5, t) * (1 - sstep(WORSE - .6, WORSE - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - POISON) / BEAT) % 1);
  text('天然 ≠ 安全', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('诉诸自然', 0, 0, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(48.9, 49.4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  text('把「天然」，当成了「好」', 540, 720, { font: SANS, size: 30, align: 'center', color: '#ffd2a0', alpha: A * sstep(49.4, 49.9, t) });
  const L = A * sstep(41.0, 41.5, t);
  mushroom(320, 1040, 1.4, L);
  text('天然', 320, 1130, { font: SERIF, size: 34, weight: 900, align: 'center', color: GREEN, alpha: L });
  text('☠ 有毒', 320, 1190, { font: SANS, size: 28, align: 'center', color: '#f0a0a0', alpha: A * sstep(42.0, 42.4, t) });
  const R = A * sstep(45.0, 45.5, t);
  ctx.save(); ctx.globalAlpha = R; ctx.translate(760, 990); ctx.rotate(-.5);
  ctx.fillStyle = '#7fe3d3'; ctx.beginPath(); ctx.roundRect(-70, -26, 70, 52, [26, 0, 0, 26]); ctx.fill(); ctx.fillStyle = '#f3efe6'; ctx.beginPath(); ctx.roundRect(0, -26, 70, 52, [0, 26, 26, 0]); ctx.fill(); ctx.restore();
  text('合成', 760, 1130, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#c3cad6', alpha: R });
  text('✚ 救命', 760, 1190, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: A * sstep(46.0, 46.4, t) });
}

// ======================================================================== ④ 明知更差：仍有约两成
function sceneWorse(t) {
  if (t < WORSE - .3 || t > ORIGIN + .2) return;
  const A = sstep(WORSE - .1, WORSE + .5, t) * (1 - sstep(ORIGIN - .7, ORIGIN - .1, t));
  if (A <= 0) return;
  text('更夸张的是', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('明知更差，仍有约两成', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#f0a0a0', alpha: A * sstep(60.9, 61.4, t), glow: 'rgba(229,72,77,.4)', blur: 14 });
  text('天然的：更不安全、效果更差', 540, 640, { font: SERIF, size: 46, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  bottle(320, 960, 1.0, A, 'leaf'); bottle(760, 960, 1.0, A, 'flask');
  const tag = (x, s, a) => text(s, x, 1140, { font: SANS, size: 26, align: 'center', color: '#f0a0a0', alpha: a });
  tag(320, '安全 ↓  效果 ↓', A * sstep(58.2, 58.6, t));
  const n = Math.round(10 * E.out(prog(t, 61.0, 61.8)));
  for (let i = 0; i < 10; i++) {
    const on = i < 2 && n > i;
    ctx.save(); ctx.globalAlpha = A * sstep(60.9, 61.3, t); ctx.fillStyle = on ? GREEN : 'rgba(195,202,214,.35)'; ctx.beginPath(); ctx.arc(230 + i * 70, 1230, 16, 0, TAU); ctx.fill(); ctx.restore();
  }
}

// ======================================================================== ⑤ 出身和成绩
function sceneOrigin(t) {
  if (t < ORIGIN - .2 || t > CLIMAX + .3) return;
  const A = sstep(ORIGIN + .2, ORIGIN + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('看到「纯天然」', 64.5, 67.6, GREEN);
  hd('安不安全？有没有用？', 67.9, 71.9, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('出身，和成绩', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('约 500 年前：', 76.4, 0, CREAM);
  const lab = A * sstep(64.6, 65.2, t) * (1 - sstep(67.6, 68.0, t));
  if (lab > 0) { ctx.save(); ctx.globalAlpha = lab; ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(540, 980, 220, 90, 0, 0, TAU); ctx.stroke(); ctx.restore();
    text('纯天然', 540, 1000, { font: SERIF, size: 72, weight: 900, align: 'center', color: GREEN, alpha: lab }); leaf(400, 940, 1.0, lab); }
  const Q2 = A * sstep(68.0, 68.5, t) * (1 - sstep(71.9, 72.3, t));
  [['安全吗？', 900], ['有用吗？', 1040]].forEach(([s, y], i) => pill(s, 540, y, Q2 * sstep(68.2 + i * .5, 68.6 + i * .5, t), { size: 40, stroke: `rgba(${T_RGB},.8)`, color: '#7fe3d3' }));
  const card = A * sstep(72.4, 72.9, t);
  if (card > 0) {
    ctx.save(); ctx.globalAlpha = card; ctx.fillStyle = 'rgba(236,230,218,.94)'; ctx.fillRect(330, 820, 420, 400); ctx.restore();
    const row = (y, k, v, col, a) => { text(k, 370, y, { font: SERIF, size: 34, weight: 900, color: '#1a1b22', alpha: a }); text(v, 710, y, { font: SERIF, size: 34, weight: 900, align: 'right', color: col, alpha: a }); };
    row(890, '出身', '天然 / 合成', '#6f7786', card);
    ctx.save(); ctx.globalAlpha = card; ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(360, 940); ctx.lineTo(720, 940); ctx.stroke(); ctx.restore();
    row(1010, '安全', '?', '#c2410c', card * sstep(73.4, 73.8, t));
    row(1100, '有效', '?', '#c2410c', card * sstep(73.8, 74.2, t));
    text('成绩', 540, 1180, { font: SANS, size: 24, align: 'center', color: '#c2410c', alpha: card * sstep(74.2, 74.6, t) });
  }
}

// ======================================================================== ⑥ 剂量：一滴
function sceneDose(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(30,31,40,.96)';                             // 滴管
  ctx.beginPath(); ctx.roundRect(510, 760, 60, 60, 20); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(522, 820); ctx.lineTo(522, 960); ctx.lineTo(540, 990); ctx.lineTo(558, 960); ctx.lineTo(558, 820); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 4; i++) {
    const p = ((t - CLIMAX - .5) / 2.6 + i / 4) % 1; if (t < CLIMAX + .5) break;
    const y = 1000 + 240 * p * p;
    ctx.save(); ctx.globalAlpha = A * (1 - sstep(.85, 1, p)); ctx.fillStyle = '#ffd2a0'; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16; ctx.beginPath(); ctx.ellipse(540, y, 9, 13, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  glow(540, 1260, 26 * (1 + .6 * fin), O_RGB, A * (.5 + .5 * fin), 8);
  leaf(400, 1220, 1.0, A * .8); flask(680, 1220, 1.0, A * .8);
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const r = mulberry(5400 + i), x = 380 + r() * 320, sp = 30 + r() * 40, p = ((t - FINAL) * sp / 420 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1250 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('万物皆有毒，', 540, 440, { ...big, size: 60, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.2), qa);
  typeText('剂量决定它是不是毒。', 540, 552, { ...big, size: 62, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.3, CLIMAX + 2.4), qa);
  typeText('—— 帕拉塞尔苏斯（大意）', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.6, CLIMAX + 3.2), qa);
  typeText('别看出身，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('看成绩。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneWater(t); scenePoison(t); sceneWorse(t); sceneOrigin(t); sceneDose(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2016', 'Meier & Lappas · Med Decis Making', 8.2, 15.9, T);
  stamp('2006', 'Rozin · Judgm Decis Mak', 16.3, 35.3, T);
  stamp('2016', 'Meier & Lappas · Med Decis Making', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(51);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 E 小调里，最后一个和弦是 E 大调）
const NOTE = { E3: 164.81, G3: 196.00, Gs3: 207.65, B3: 246.94, E4: 329.63, G4: 392.00, Gs4: 415.30, B4: 493.88, E5: 659.25, G5: 783.99, Gs5: 830.61, B5: 987.77 };
const EM_SHIM = [NOTE.G5, NOTE.B4, NOTE.E5, NOTE.E4, NOTE.B3], EMAJ_SHIM = [NOTE.Gs5, NOTE.B4, NOTE.E5, NOTE.E4, NOTE.B3], EM_SWELL = [41.20, 61.74, 82.41, 98.00, 123.47];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.B4, gain: .05 }], [1.0, 'tink', { f: NOTE.E5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.E3, NOTE.G3, NOTE.B3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.B4, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 165, f1: 330, dur: 1.0, gain: .07 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EM_SHIM, gain: .28 }]);
  c.push([20.4, 'dust', { dur: 1.2, gain: .05 }], [22.2, 'dust', { dur: 1.2, gain: .05 }], [24.6, 'bar', { f0: 330, f1: 196, dur: 1.2, gain: .07 }], [31.7, 'page', { gain: .18 }]);
  c.push([POISON, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'thud', { gain: .08 }], [42.0, 'tink', { f: NOTE.E4, gain: .05 }], [45.0, 'thud', { gain: .08 }], [46.0, 'tink', { f: NOTE.B5, gain: .06 }]);
  c.push([49.0, 'chord', { f: [NOTE.E3, NOTE.G3, NOTE.B3], gain: .1 }], [49.1, 'tink', { f: NOTE.G5, gain: .07 }]);
  c.push([WORSE, 'whoosh', { dur: .5, gain: .22 }], [58.2, 'tick', { gain: .2 }], [61.0, 'tink', { f: NOTE.E5, gain: .06 }], [61.3, 'tink', { f: NOTE.G5, gain: .06 }]);
  c.push([64.6, 'tink', { f: NOTE.G4, gain: .06 }], [68.2, 'tink', { f: NOTE.B4, gain: .06 }], [68.7, 'tink', { f: NOTE.E5, gain: .06 }], [72.4, 'page', { gain: .18 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: EM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 82.41, gain: .14 }]);
  for (let i = 0; i < 5; i++) c.push([CLIMAX + 1.1 + i * .65, 'tink', { f: [NOTE.B4, NOTE.E5, NOTE.G5, NOTE.B5, NOTE.E5][i], gain: .05 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.E3, NOTE.Gs3, NOTE.B3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
