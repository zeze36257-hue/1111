// ======================================================================== No.41 失败主义：放弃，是学会的吗？
// 第五季·看不见的主义 ⑧。开头是一道选择题：狗被电击逃不掉；后来换到一跳就能逃的箱子，它会逃吗？（Seligman & Maier, 1967）
// 音乐：原创配乐（music.py，降 B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机一直在试：爬上去，沉下来，再试一次，比上次更高。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 50 年后（每拍一个鼓点） · 53.33 察觉控制（紧张） · 64.0 一件小事（只剩钢琴） · 80.0 高潮：一级级台阶 · 96.0 降 B 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), FIFTY = BT(56), CTRL = BT(80), SMALL = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['笼子', 0, LIFT], ['反正没用', LIFT, FIFTY], ['50 年后', FIFTY, CTRL], ['察觉控制', CTRL, SMALL], ['一件小事', SMALL, CLIMAX], ['台阶', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.41';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '1967 年的一个实验：狗被电击，怎么都逃不掉。'],
  [4.1, 7.6, '后来换到一跳就能逃的箱子，它会逃吗？先猜一个。'],
  [8.2, 10.4, '答案是：大多数，趴着不动。'],
  [10.8, 13.3, '明明能逃，却不再试了。'],
  [13.6, 15.7, '这个实验，今天看来很残忍。'],
  [16.3, 19.6, '心理学家塞利格曼，把这叫「习得性无助」。'],
  [19.9, 23.7, '人也一样：一次次努力没用，就学会了放弃。'],
  [24.0, 27.4, '「反正没用」「我就这样了」——'],
  [27.7, 31.3, '这些话，你是不是也对自己说过？'],
  [31.6, 35.3, '这就是「失败主义」：还没开始，先认输。'],
  [37.6, 40.6, '可 50 年后，塞利格曼自己改了说法。'],
  [40.9, 44.6, '长期受苦时，「不动」是大脑的默认反应，'],
  [44.9, 48.6, '根本不用学。要学的，是另一件事：'],
  [48.9, 52.9, '「我做的事，有用」。'],
  [53.6, 57.6, '大脑里有一块区域，专门察觉「我能控制」。'],
  [57.9, 63.4, '一旦察觉到，就能压住「放弃」的反应；而这种察觉，是从经验里学会的。'],
  [64.3, 67.6, '所以，你不是学会了无助，'],
  [67.9, 71.9, '只是还没学会：有些事，你说了算。'],
  [72.2, 75.9, '从一件小事开始，就够了。'],
  [76.3, 79.6, '50 年后，他们在论文里写道：'],
  [84.9, 88.6, '放弃不用学，'],
  [88.9, 92.6, '「我能行」才要学。'],
  [98.4, 103.0, '评论区：你最近做成的一件小事是什么？'],
];
const BIGLINES = [
  [80.2, 92.6, '「大脑要察觉的，是控制的存在，而不是它的缺失。」—— 迈尔 & 塞利格曼'],
  [93.4, 98.0, '先做成一件小事，再说「没用」。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [FIFTY - .5, .2], [FIFTY, .06], [SMALL, .06],
  [SMALL + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 狗、箱子、人、台阶
function dog(x, y, s, a, lying = 1, col = '#d8c79f') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(30,28,24,.96)'; ctx.lineJoin = 'round';
  const hy = lerp(-60, -30, lying);
  ctx.beginPath(); ctx.ellipse(0, -20 + 6 * lying, 72, lerp(34, 26, lying), 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(70, hy, 24, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(96, hy + 8, 22, 13, .12, 0, TAU); ctx.fill(); ctx.stroke();                  // 嘴筒
  ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(116, hy + 6, 5, 0, TAU); ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(56, hy - 16); ctx.quadraticCurveTo(40, hy - 14, 42, hy + 22); ctx.quadraticCurveTo(52, hy + 24, 62, hy - 4); ctx.closePath(); ctx.fill(); ctx.stroke();   // 垂耳
  ctx.beginPath(); ctx.moveTo(-70, -26); ctx.quadraticCurveTo(-96, lerp(-44, -18, lying), -116, lerp(-36, -4, lying)); ctx.stroke();
  if (lying < .5) for (const lx of [-40, -10, 30, 54]) { ctx.beginPath(); ctx.moveTo(lx, 6); ctx.lineTo(lx, 40); ctx.stroke(); }
  ctx.restore();
}
function shuttle(a, t, shockK) {                                                                    // 穿梭箱：中间一道矮挡板
  if (a <= 0) return;
  const y0 = 760, y1 = 1150;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.55)'; ctx.lineWidth = 3; ctx.strokeRect(120, y0, 840, y1 - y0);
  ctx.fillStyle = 'rgba(79,214,196,.08)'; ctx.fillRect(560, y0, 400, y1 - y0);
  ctx.fillStyle = 'rgba(236,230,218,.6)'; ctx.fillRect(532, y1 - 110, 16, 110); ctx.restore();
  if (shockK > 0) for (let i = 0; i < 6; i++) {
    const x = 160 + i * 64, fl = Math.max(0, Math.sin(t * 9 + i * 2.1)); if (fl < .5) continue;
    ctx.save(); ctx.globalAlpha = a * shockK * (fl - .5) * 1.6; ctx.strokeStyle = '#f2c76a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y1 - 4); ctx.lineTo(x + 8, y1 - 18); ctx.lineTo(x + 2, y1 - 22); ctx.lineTo(x + 12, y1 - 38); ctx.stroke(); ctx.restore();
  }
  text('能逃的一边', 760, y0 + 40, { font: SANS, size: 26, align: 'center', color: '#7fe3d3', alpha: a });
}
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function brainRegions(a, t, ctrl, quiet) {                                                          // 深处：默认“不动”（红）；前面：察觉控制（青）
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(255,255,255,.04)';
  ctx.beginPath(); ctx.ellipse(540, 980, 300, 210, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  const red = 1 - .75 * quiet;
  glow(600, 1060, 26, '229,72,77', a * red * (.8 + .2 * Math.sin(t * 3)), 4);
  text('放弃', 600, 1124, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#f0a0a0', alpha: a * Math.max(.35, red) });
  if (ctrl > 0) {
    glow(380, 900, 24, T_RGB, a * ctrl, 4);
    text('察觉控制', 380, 844, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#7fe3d3', alpha: a * ctrl });
  }
}

// ======================================================================== ① 笼子（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('一跳就能逃：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('它会逃吗？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  shuttle(1, t, .5 * (1 - sstep(4.0, 5.0, t)) + .35 * sstep(5.0, 5.6, t) * (1 - sstep(10.5, 11.0, t)));
  dog(320, 1120, 1.1, 1, sstep(.6, 1.6, t));
  const arc = sstep(10.8, 11.3, t);
  if (arc > 0) { drawOn(() => { ctx.moveTo(380, 1060); ctx.quadraticCurveTo(540, 820, 720, 1080); }, 460, E.io(prog(t, 10.9, 12.0)), 'rgba(127,227,211,.8)', 3, arc, `rgba(${T_RGB},.5)`); text('明明能逃', 720, 900, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#7fe3d3', alpha: arc * sstep(11.6, 12.0, t) }); }
  text('却不再试了', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(10.9, 11.4, t), glow: 'rgba(229,72,77,.4)', blur: 14 });
  text('B · 大多数趴着不动', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('今天看来，这个实验很残忍', 540, 1230, { font: SANS, size: 26, align: 'center', color: '#9aa3b2', alpha: sstep(13.6, 14.1, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 马上跳过去', 200], ['B · 大多数趴着不动', 540], ['C · 都会逃', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 一次次碰壁 · 反正没用
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('失败主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('DEFEATISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ⑧', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneGiveUp(t) {
  if (t < 19.7 || t > FIFTY + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(FIFTY - .6, FIFTY - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    ctx.save(); ctx.globalAlpha = D; ctx.fillStyle = 'rgba(154,163,178,.35)'; ctx.fillRect(760, 780, 40, 440); ctx.restore();
    const sit = sstep(22.8, 23.6, t);
    let px = 340;
    for (let i = 0; i < 3; i++) { const k = prog(t, 20.2 + i * .8, 20.9 + i * .8); if (k > 0 && k < 1) px = lerp(340, 720, Math.sin(PI * k)); }
    person(px, 1200 - 40 * sit, 1.1, D, sit > .5 ? '#9aa3b2' : CREAM, 1 - .3 * sit);
    [['反正没用', 300, 820, 24.0], ['我就这样了', 640, 760, 24.8]].forEach(([s, x, y, t0]) => pill(s, x, y, D * sstep(t0, t0 + .4, t), { size: 34, stroke: 'rgba(240,160,160,.6)', color: '#f0a0a0' }));
    text('你也说过吗？', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: D * sstep(27.7, 28.2, t) });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('失败主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('还没开始，先认输', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#f0a0a0', spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 50 年后：不动是默认，要学的是“有用”
function sceneFifty(t) {
  if (t < FIFTY - .3 || t > CTRL + .2) return;
  const A = sstep(FIFTY - .1, FIFTY + .5, t) * (1 - sstep(CTRL - .6, CTRL - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - FIFTY) / BEAT) % 1);
  const Y = A * (1 - sstep(40.6, 41.0, t));
  if (Y > 0) {
    text('1967', 300, 960, { font: LAT, size: 90, weight: 700, align: 'center', color: '#9aa3b2', alpha: Y });
    drawOn(() => { ctx.moveTo(420, 950); ctx.lineTo(640, 950); }, 220, E.io(prog(t, 38.0, 39.0)), ORANGE, 4, Y);
    text('2016', 780, 960, { font: LAT, size: 90, weight: 700, align: 'center', color: '#ffd2a0', alpha: Y * sstep(38.8, 39.3, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
    text('自己改了说法', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: Y * sstep(37.8, 38.3, t) });
  }
  const B2 = A * sstep(40.9, 41.4, t);
  if (B2 > 0) {
    brainRegions(B2, t, sstep(48.9, 49.6, t), 0);
    text('「不动」：默认反应', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#f0a0a0', alpha: B2 * (1 - sstep(44.6, 45.0, t)) });
    text('不用学', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#c3cad6', alpha: B2 * sstep(44.9, 45.4, t) * (1 - sstep(48.6, 49.0, t)) });
    ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
    text('要学的：我做的事，有用', 0, 0, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#7fe3d3', alpha: B2 * sstep(48.9, 49.4, t), glow: `rgba(${T_RGB},.5)`, blur: 16 }); ctx.restore();
  }
}

// ======================================================================== ④ 察觉控制：青色压住红色
function sceneCtrl(t) {
  if (t < CTRL - .3 || t > SMALL + .2) return;
  const A = sstep(CTRL - .1, CTRL + .5, t) * (1 - sstep(SMALL - .7, SMALL - .1, t));
  if (A <= 0) return;
  const inh = E.io(prog(t, 58.0, 59.4));
  brainRegions(A, t, 1, inh);
  if (inh > 0) {                                                                                    // 抑制：青色那一块压住红色那一块
    drawOn(() => { ctx.moveTo(420, 930); ctx.lineTo(570, 1030); }, 180, inh, TEAL, 5, A, `rgba(${T_RGB},.6)`);
    ctx.save(); ctx.globalAlpha = A * inh; ctx.strokeStyle = TEAL; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(552, 1050); ctx.lineTo(590, 1010); ctx.stroke(); ctx.restore();
  }
  text('察觉「我能控制」', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(60.6, 61.0, t)) });
  text('是从经验里学会的', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(60.8, 61.3, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  text('前额叶 → 中缝核（示意）', 540, 1240, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: A * sstep(54.4, 54.9, t) });
}

// ======================================================================== ⑤ 一件小事：狗跳了过去 · 小小的勾
function sceneSmall(t) {
  if (t < SMALL - .2 || t > CLIMAX + .3) return;
  const A = sstep(SMALL + .2, SMALL + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const S1 = A * (1 - sstep(71.8, 72.2, t));
  if (S1 > 0) {
    shuttle(S1, t, 0);
    const jump = E.io(prog(t, 66.6, 68.2)), stand = sstep(65.6, 66.4, t);
    dog(lerp(320, 760, jump), 1120 - Math.sin(PI * jump) * 220, 1.1, S1, 1 - stand, jump > .5 ? '#7fe3d3' : '#d8c79f');
    text('有些事，你说了算', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#7fe3d3', alpha: S1 * sstep(68.2, 68.7, t) });
  }
  const S2 = A * sstep(72.2, 72.6, t) * (1 - sstep(76.0, 76.4, t));
  if (S2 > 0) [['起床', 900], ['喝一杯水', 1010], ['出门走十分钟', 1120]].forEach(([s, y], i) => {
    const a = S2 * sstep(72.4 + i * .8, 72.8 + i * .8, t);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.strokeRect(300, y - 26, 52, 52);
    ctx.strokeStyle = TEAL; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(310, y); ctx.lineTo(322, y + 14); ctx.lineTo(344, y - 16); ctx.stroke(); ctx.restore();
    text(s, 390, y + 2, { font: SERIF, size: 44, weight: 900, color: CREAM, alpha: a });
  });
  const Hm = A * sstep(76.3, 76.8, t);
  typeText('迈尔 & 塞利格曼 · 2016', 540, 860, { ...big, size: 52, weight: 900 }, prog(t, 76.4, 77.2), Hm);
  typeText('《习得性无助五十年》', 540, 950, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), Hm);
}

// ======================================================================== ⑥ 台阶：一级一级亮起来
function sceneSteps(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const N = 6, step = i => [180 + i * 130, 1260 - i * 70], prog6 = clamp((t - CLIMAX - 1.0) / 2.1);
  const at = Math.min(N - 1, Math.floor(prog6 * N + (t > FINAL ? N : 0)));
  for (let i = 0; i < N; i++) {
    const [x, y] = step(i), lit = sstep(CLIMAX + 1.0 + i * 2.1 * (1 / N) * N * .25, CLIMAX + 1.4 + i * .52, t) * (i <= at ? 1 : 0);
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = lit ? `rgba(242,161,74,${.25 + .35 * lit})` : 'rgba(255,255,255,.06)'; ctx.strokeStyle = lit ? ORANGE : 'rgba(236,230,218,.35)'; ctx.lineWidth = 3;
    if (lit) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 18 * lit * (1 + fin); }
    ctx.fillRect(x - 60, y, 130, 1290 - y); ctx.strokeRect(x - 60, y, 130, 1290 - y); ctx.restore();
  }
  const [px, py] = step(at), [nx, ny] = step(Math.min(N - 1, at + 1)), hop = (prog6 * N) % 1;
  person(at < N - 1 && t < FINAL ? lerp(px, nx, E.io(sstep(.7, 1, hop))) : px, (at < N - 1 && t < FINAL ? lerp(py, ny, E.io(sstep(.7, 1, hop))) - Math.sin(PI * sstep(.7, 1, hop)) * 40 : py) - 30, .7, A, '#ffd2a0');
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「大脑要察觉的，', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('是控制的存在，', 540, 522, { ...big, size: 52, weight: 900, color: '#7fe3d3' }, prog(t, CLIMAX + 1.4, CLIMAX + 2.3), qa);
  typeText('而不是它的缺失。」', 540, 616, { ...big, size: 58, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.4), qa);
  typeText('—— 迈尔 & 塞利格曼（大意）', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.6, CLIMAX + 4.2), qa);
  typeText('先做成一件小事，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('再说「没用」。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneGiveUp(t); sceneFifty(t); sceneCtrl(t); sceneSmall(t); sceneSteps(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 66.4, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1967', 'Seligman & Maier · J Exp Psychol', 8.2, 35.3, T);
  stamp('2016', 'Maier & Seligman · Psych Review', 37.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(41);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在降 B 小调里，最后一个和弦是降 B 大调）
const NOTE = { Bb3: 233.08, Db4: 277.18, D4: 293.66, F4: 349.23, Bb4: 466.16, Db5: 554.37, F5: 698.46, Bb5: 932.33, Db6: 1108.73, D6: 1174.66, F6: 1396.91 };
const BBM_SHIM = [NOTE.Db6, NOTE.F5, NOTE.Bb5, NOTE.Bb4, NOTE.F4], BBMAJ_SHIM = [NOTE.D6, NOTE.F5, NOTE.Bb5, NOTE.Bb4, NOTE.F4], BBM_SWELL = [58.27, 87.31, 116.54, 138.59, 174.61];
function CUES() {
  const c = [];
  [.5, 1.3, 2.1].forEach(t => c.push([t, 'click', { gain: .08 }]));
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Bb3, NOTE.Db4, NOTE.F4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.F5, gain: .1 }]);
  c.push([10.9, 'swish', { gain: .1 }], [13.6, 'thud', { gain: .1 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BBM_SHIM, gain: .28 }]);
  [20.55, 21.35, 22.15].forEach(t => c.push([t, 'thud', { gain: .12 }]));
  c.push([22.8, 'suck', { dur: 1.0, gain: .06 }], [24.0, 'tink', { f: NOTE.Db5, gain: .06 }], [24.8, 'tink', { f: NOTE.Bb4, gain: .06 }], [31.7, 'page', { gain: .18 }]);
  c.push([FIFTY, 'whoosh', { dur: .5, gain: .25 }], [38.0, 'bar', { f0: 233, f1: 466, dur: 1.0, gain: .1 }], [40.9, 'drone', { dur: 3.4, gain: .05 }], [44.9, 'tink', { f: NOTE.Bb4, gain: .06 }]);
  c.push([48.9, 'chord', { f: [NOTE.Bb4, NOTE.Db5, NOTE.F5], gain: .1 }], [49.0, 'tink', { f: NOTE.F6, gain: .08 }]);
  c.push([CTRL, 'whoosh', { dur: .5, gain: .22 }], [53.8, 'tink', { f: NOTE.Db6, gain: .06 }], [58.0, 'bar', { f0: 466, f1: 233, dur: 1.4, gain: .1 }], [60.8, 'tink', { f: NOTE.Bb5, gain: .08 }]);
  c.push([66.6, 'whoosh', { dur: .8, gain: .14 }], [68.2, 'thud', { gain: .14 }], [68.3, 'tink', { f: NOTE.F5, gain: .08 }]);
  for (let i = 0; i < 3; i++) c.push([72.4 + i * .8, 'click', { gain: .12 }]);
  c.push([76.4, 'page', { gain: .2 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: BBM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BBM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 116.54, gain: .14 }]);
  for (let i = 0; i < 6; i++) c.push([CLIMAX + 1.0 + i * 2.1, 'tink', { f: [NOTE.Bb4, NOTE.Db5, NOTE.F5, NOTE.Bb5, NOTE.Db6, NOTE.F6][i], gain: .06 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: BBMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Bb3, NOTE.D4, NOTE.F4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
