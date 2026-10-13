// ======================================================================== No.40 决定论：你的选择，是你做的吗？
// 第五季·看不见的主义 ⑦。开头是一道选择题：你决定动手指之前，大脑开始准备这个动作，比你“决定”早多久？（Libet et al., 1983）
// 音乐：原创配乐（music.py，升 F 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机像利贝特的钟：每小节转一圈，四个音上去又下来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 拉普拉斯（每拍一个鼓点） · 53.33 随机起伏（紧张） · 64.0 喊停（只剩钢琴） · 80.0 高潮 · 96.0 升 F 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), LAP = BT(56), NOISE = BT(80), VETO = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['0.35 秒', 0, LIFT], ['提前几秒', LIFT, LAP], ['拉普拉斯', LAP, NOISE], ['随机起伏', NOISE, VETO], ['喊停', VETO, CLIMAX], ['说不', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.40';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '你决定动一下手指，然后，它动了。'],
  [4.1, 7.6, '大脑开始准备，比你「决定」早多久？先猜一个。'],
  [8.2, 10.4, '答案是：约 0.35 秒。'],
  [10.8, 13.3, '在你觉得「我要动了」之前，'],
  [13.6, 15.7, '大脑已经准备了一会儿。'],
  [16.3, 19.6, '这是 1983 年，利贝特做的实验。'],
  [19.9, 23.7, '后来有研究用脑扫描，能提前几秒猜你按左还是按右，'],
  [24.0, 27.4, '准确率约六成，只比瞎猜好一点。'],
  [27.7, 31.3, '难道，我们的选择早就被决定了？'],
  [31.6, 35.3, '这就是「决定论」的问题。'],
  [37.6, 40.6, '两百年前，拉普拉斯想象过一个「恶魔」：'],
  [40.9, 44.6, '只要知道此刻所有粒子的位置和速度，'],
  [44.9, 48.6, '就能算出全部的未来，包括你下一秒做什么。'],
  [48.9, 52.9, '如果真是这样，「我决定」还有意义吗？'],
  [53.6, 57.6, '可 2012 年，研究者重新解释了那个「准备信号」：'],
  [57.9, 63.4, '它更像随机的起伏，碰巧涨过门槛，未必是「已经做好的决定」。'],
  [64.3, 67.6, '科学还没有给出最后的答案。'],
  [67.9, 71.9, '但利贝特自己，并不觉得人只是机器。'],
  [72.2, 75.9, '他发现，人在最后一刻，还能喊停。'],
  [76.3, 79.6, '他写道：'],
  [84.9, 88.6, '念头会先来，'],
  [88.9, 92.6, '但最后那一下，你还能说「不」。'],
  [98.4, 103.0, '评论区：你相信自由意志吗？'],
];
const BIGLINES = [
  [80.2, 92.6, '「意识的作用，也许不是发起一个动作，而是决定让不让它发生。」—— 利贝特'],
  [93.4, 98.0, '你管不了念头，但管得了下一步。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [LAP - .5, .2], [LAP, .06], [VETO, .06],
  [VETO + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、钟、柱子、闸门
function person(x, y, s, a, col = CREAM, fill = 'rgba(16,17,23,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = fill;
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function libetClock(cx, cy, r, a, t) {                                                               // 利贝特的钟：一个点 2.56 秒转一圈
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 60; i++) { const an = i / 60 * TAU, l = i % 5 ? 8 : 18; ctx.lineWidth = i % 5 ? 1.5 : 3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * (r - 4), cy + Math.sin(an) * (r - 4)); ctx.lineTo(cx + Math.cos(an) * (r - 4 - l), cy + Math.sin(an) * (r - 4 - l)); ctx.stroke(); }
  ctx.restore();
  const an = -PI / 2 + (t / 2.56) * TAU; glow(cx + Math.cos(an) * (r - 34), cy + Math.sin(an) * (r - 34), 9, O_RGB, a, 4);
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
function gate(x, y0, y1, a, k, col = ORANGE) {                                                          // 一道闸：k=1 落下
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20 * k; ctx.fillRect(x - 8, y0, 16, (y1 - y0) * k); ctx.restore();
}

// ======================================================================== ① 0.35 秒（0–16）
const TX = s => 140 + (s + .8) / .9 * 800;                                                              // 时间轴：-0.8 s … +0.1 s
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('大脑开始准备：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('比你决定早多久？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const C = 1 - sstep(10.5, 11.0, t);
  if (C > 0) {
    libetClock(540, 880, 170, C, t);
    const press = Math.pow(Math.max(0, Math.sin(PI * clamp(prog(t, 3.6, 4.1)))), 1);
    ctx.save(); ctx.globalAlpha = C; ctx.fillStyle = 'rgba(30,34,44,.95)'; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(540, 1180, 70, 20, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = press > .5 ? ORANGE : 'rgba(229,72,77,.9)'; ctx.beginPath(); ctx.ellipse(540, 1172 + 6 * press, 40, 12, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = C; ctx.fillStyle = 'rgba(16,17,23,.95)'; ctx.strokeStyle = '#ffd2a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(522, 1080 + 30 * press, 36, 90, 18); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  const T2 = sstep(10.8, 11.3, t);                                                                     // 时间轴：准备 → 觉得决定了 → 动了
  if (T2 > 0) {
    const y = 1100, k = E.out(prog(t, 11.0, 12.6));
    seg(140, y, 940, y, 'rgba(236,230,218,.45)', 2, T2);
    ctx.save(); ctx.globalAlpha = T2; ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.shadowColor = `rgba(${T_RGB},.6)`; ctx.shadowBlur = 12; ctx.beginPath();
    for (let i = 0; i <= 120 * k; i++) { const s = -.8 + i / 120 * .9, x = TX(s), v = s < -.55 ? 0 : Math.pow((s + .55) / .55, 1.8); ctx.lineTo(x, y - 10 - 260 * Math.min(v, 1.25) + Math.sin(i * 1.7) * 3); }
    ctx.stroke(); ctx.restore();
    [[-.55, '开始准备', '#7fe3d3', 11.0], [-.2, '觉得「决定了」', '#ffd2a0', 11.9], [0, '动了', CREAM, 12.6]].forEach(([s, lab, col, t0]) => {
      const a = T2 * sstep(t0, t0 + .4, t), x = TX(s);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x, 760); ctx.stroke(); ctx.restore();
      text(lab, x, y + 44, { font: SERIF, size: 28, weight: 900, align: 'center', color: col, alpha: a });
    });
    const br = sstep(13.6, 14.1, t);
    if (br > 0) { ctx.save(); ctx.globalAlpha = br; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(TX(-.55), 740); ctx.lineTo(TX(-.55), 720); ctx.lineTo(TX(-.2), 720); ctx.lineTo(TX(-.2), 740); ctx.stroke(); ctx.restore();
      text('约 0.35 秒', (TX(-.55) + TX(-.2)) / 2, 680, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: br, glow: `rgba(${O_RGB},.5)`, blur: 14 }); }
  }
  text('B · 约 0.35 秒', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('大脑先动，你后知道', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: CREAM, alpha: sstep(10.9, 11.4, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 同时', 220], ['B · 约 0.35 秒', 540], ['C · 约 10 秒', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 脑扫描猜左右 · 提线木偶
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('决定论', 540, 900, { size: 166, weight: 900, align: 'center', ls: 40, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('DETERMINISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ⑦', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function brain(cx, cy, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(255,255,255,.04)';
  ctx.beginPath(); ctx.ellipse(cx, cy, 220, 160, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, cy - 160); ctx.quadraticCurveTo(cx - 20, cy, cx, cy + 160); ctx.stroke();
  for (let i = 0; i < 40; i++) { const x = cx - 180 + (i % 8) * 46, y = cy - 110 + Math.floor(i / 8) * 46, v = .5 + .5 * Math.sin(t * 2 + i * 1.7); ctx.fillStyle = `rgba(${i % 3 ? T_RGB : O_RGB},${.12 + .3 * v})`; ctx.fillRect(x, y, 38, 38); }
  ctx.restore();
}
function sceneScan(t) {
  if (t < 19.7 || t > LAP + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(LAP - .6, LAP - .05, t));
  if (A <= 0) return;
  const S = A * (1 - sstep(27.4, 27.9, t));
  if (S > 0) {
    brain(540, 860, S, t);
    [['左', 380], ['右', 700]].forEach(([s, x], i) => { const hot = Math.floor(t / 1.6) % 2 === i; ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = hot ? 'rgba(242,161,74,.3)' : 'rgba(255,255,255,.06)'; ctx.strokeStyle = hot ? ORANGE : 'rgba(236,230,218,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 70, 1060, 140, 90, 16); ctx.fill(); ctx.stroke(); ctx.restore(); text(s, x, 1106, { font: SERIF, size: 44, weight: 900, align: 'center', color: hot ? '#ffd2a0' : CREAM, alpha: S }); });
    text('提前几秒猜', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: S * sstep(20.2, 20.7, t) });
    const g = S * sstep(24.0, 24.4, t);
    if (g > 0) {
      const x0 = 240, x1 = 840, y = 1230, k = E.out(prog(t, 24.2, 25.4));
      ctx.save(); ctx.globalAlpha = g; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x0, y - 16, x1 - x0, 32); ctx.fillStyle = `rgba(${O_RGB},.9)`; ctx.fillRect(x0, y - 16, (x1 - x0) * .6 * k, 32);
      ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(x0 + (x1 - x0) * .5, y - 34); ctx.lineTo(x0 + (x1 - x0) * .5, y + 34); ctx.stroke(); ctx.restore();
      text('准确率约 60%', x0 + (x1 - x0) * .6, y - 54, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: g * k });
      text('瞎猜 50%', x0 + (x1 - x0) * .5 - 90, y + 50, { font: SANS, size: 24, align: 'center', color: '#9aa3b2', alpha: g });
    }
  }
  const P = A * sstep(27.7, 28.2, t);
  if (P > 0) {                                                                                        // 提线木偶
    const sway = Math.sin(t * 1.6) * 8;
    ctx.save(); ctx.globalAlpha = P; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 1.5; ctx.fillStyle = '#8a7a5a';
    ctx.fillRect(400 + sway, 740, 280, 12);
    for (const [hx, hy] of [[-60, 1040], [60, 1040], [0, 930], [-30, 1150], [30, 1150]]) { ctx.beginPath(); ctx.moveTo(540 + hx * 1.6 + sway, 752); ctx.lineTo(540 + hx, hy); ctx.stroke(); }
    ctx.restore();
    person(540, 1120, 1.4, P, '#c3cad6');
    text('早就被决定了？', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#f0a0a0', alpha: P * (1 - sstep(31.4, 31.8, t)) });
    typeText('决定论', 540, 610, { ...big, size: 64, weight: 900 }, prog(t, 31.7, 32.4), P * sstep(31.6, 31.9, t));
    typeText('一切，都由之前的原因决定', 540, 690, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 32.3, 33.1), P * sstep(31.6, 31.9, t));
  }
}

// ======================================================================== ③ 拉普拉斯的恶魔
let PARTS = [];
function sceneLaplace(t) {
  if (t < LAP - .3 || t > NOISE + .2) return;
  const A = sstep(LAP - .1, LAP + .5, t) * (1 - sstep(NOISE - .6, NOISE - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - LAP) / BEAT) % 1);
  const N = A * (1 - sstep(48.6, 49.0, t));
  typeText('拉普拉斯 · 1814', 540, 620, { ...big, size: 52, weight: 900 }, prog(t, 37.7, 38.5), N);
  typeText('一个全知的「恶魔」', 540, 700, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 38.3, 39.1), N);
  const run = Math.max(0, t - 44.9), vec = sstep(40.9, 41.4, t);
  PARTS.forEach((p, i) => {
    const a = A * sstep(37.8 + i * .03, 38.1 + i * .03, t), x = 140 + ((p.x + p.vx * run - 140) % 800 + 800) % 800, y = 800 + ((p.y + p.vy * run - 800) % 460 + 460) % 460;
    glow(x, y, 4, i % 4 ? '200,210,230' : O_RGB, a, 3);
    if (vec > 0 && run < .1) { ctx.save(); ctx.globalAlpha = a * vec; ctx.strokeStyle = 'rgba(127,227,211,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + p.vx * .6, y + p.vy * .6); ctx.stroke(); ctx.restore(); }
  });
  if (t > 44.9) {                                                                                       // 你的下一秒，也是一条算好的虚线
    const k = E.io(prog(t, 45.2, 47.8));
    drawOn(() => { ctx.moveTo(240, 1200); ctx.bezierCurveTo(420, 1000, 640, 1240, 840, 1020); }, 700, 1, 'rgba(242,161,74,.5)', 3, N);
    const bx = (u => { const a = 1 - u; return [a * a * a * 240 + 3 * a * a * u * 420 + 3 * a * u * u * 640 + u * u * u * 840, a * a * a * 1200 + 3 * a * a * u * 1000 + 3 * a * u * u * 1240 + u * u * u * 1020]; })(k);
    person(bx[0], bx[1], .5, N, '#ffd2a0');
    text('下一秒的你', 840, 960, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: N * sstep(46.0, 46.5, t) });
  }
  const Q2 = A * sstep(48.9, 49.4, t);
  if (Q2 > 0) { ctx.save(); ctx.translate(540, 960); ctx.scale(1 + .03 * bk, 1 + .03 * bk); text('「我决定」还有意义吗？', 0, 0, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: Q2 }); ctx.restore(); }
}

// ======================================================================== ④ 随机起伏碰巧过线
function sceneNoise(t) {
  if (t < NOISE - .3 || t > VETO + .2) return;
  const A = sstep(NOISE - .1, NOISE + .5, t) * (1 - sstep(VETO - .7, VETO - .1, t));
  if (A <= 0) return;
  text('那个「准备信号」', 540, 620, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) });
  const x0 = 160, x1 = 920, yb = 1220, th = 820, k = clamp(prog(t, 54.2, 61.0));
  seg(x0, yb, x1, yb, 'rgba(236,230,218,.35)', 2, A);
  ctx.save(); ctx.globalAlpha = A * sstep(57.9, 58.4, t); ctx.strokeStyle = 'rgba(240,160,160,.8)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(x0, th); ctx.lineTo(x1, th); ctx.stroke(); ctx.restore();
  text('门槛', x0 + 10, th - 30, { font: SERIF, size: 30, weight: 900, align: 'left', color: '#f0a0a0', alpha: A * sstep(57.9, 58.4, t) });
  let crossed = null;
  for (let j = 0; j < 5; j++) {
    const r = mulberry(400 + j); let v = 0, pts = [];
    for (let i = 0; i <= 100; i++) { v = v * .985 + (r() - .46) * 20; pts.push(v); }
    ctx.save(); ctx.globalAlpha = A * .85; ctx.strokeStyle = j === 2 ? ORANGE : 'rgba(127,227,211,.6)'; ctx.lineWidth = j === 2 ? 4 : 2.5; ctx.beginPath();
    const n = Math.floor(100 * k);
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / 100), y = Math.max(th - 20, yb - 40 - pts[i] * 2.4 - (j === 2 ? i * 3.2 : 0)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); if (j === 2 && !crossed && y <= th) crossed = [x, y]; }
    ctx.stroke(); ctx.restore();
  }
  if (crossed) { glow(crossed[0], crossed[1], 10, O_RGB, A, 5); text('碰巧过线', crossed[0], crossed[1] - 44, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: A }); }
  text('随机起伏', x0 + 10, yb + 36, { font: SANS, size: 26, color: '#7fe3d3', alpha: A * sstep(54.4, 54.9, t) });
}

// ======================================================================== ⑤ 喊停
function impulse(x, y, a, col, len = 120) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath();
  for (let i = 0; i <= 40; i++) { const u = i / 40, xx = x - len + u * len; ctx.lineTo(xx, y - Math.sin(u * PI) * 60 * Math.exp(-((u - .7) ** 2) * 8)); }
  ctx.stroke(); ctx.restore();
}
function sceneVeto(t) {
  if (t < VETO - .2 || t > CLIMAX + .3) return;
  const A = sstep(VETO + .2, VETO + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const Qm = A * (1 - sstep(67.6, 68.0, t));
  text('？', 540, 960, { font: SERIF, size: 200, weight: 900, align: 'center', color: '#ffd2a0', alpha: Qm * sstep(64.4, 64.9, t), glow: `rgba(${O_RGB},.6)`, blur: 30 });
  text('还没有最后的答案', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: Qm * sstep(64.6, 65.1, t) });
  const V = A * sstep(67.9, 68.4, t);
  if (V > 0) {
    const y = 1060, gk = E.out(prog(t, 73.4, 73.8));
    seg(140, y + 70, 940, y + 70, 'rgba(236,230,218,.35)', 2, V);
    gate(760, y - 120, y + 70, V, gk);
    const px = Math.min(lerp(160, 900, clamp(prog(t, 68.4, 74.6))), gk > .5 ? 740 : 2000);
    impulse(px, y + 60, V, 'rgba(240,160,160,.9)');
    text('冲动', 200, y + 110, { font: SANS, size: 26, color: '#f0a0a0', alpha: V });
    text('动作', 880, y + 110, { font: SANS, size: 26, align: 'center', color: '#c3cad6', alpha: V });
    text('最后一刻：喊停', 760, y - 160, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: V * gk });
  }
  const Hm = A * sstep(76.3, 76.8, t);
  typeText('利贝特', 540, 640, { ...big, size: 60, weight: 900 }, prog(t, 76.4, 77.2), Hm);
  typeText('《我们有自由意志吗？》1999', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), Hm);
}

// ======================================================================== ⑥ 说不：念头先来，最后那一下由你
function sceneNo(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  [[960, 'rgba(240,160,160,.9)', 0, true], [1080, 'rgba(127,227,211,.9)', 1.3, false], [1200, 'rgba(240,160,160,.9)', 2.6, true]].forEach(([y, col, off, stop]) => {
    const per = 4.0, ph = ((t - CLIMAX - off) / per); if (ph < 0) return;
    const u = ph % 1, x = lerp(120, 1000, u), blocked = stop && x > 740;
    impulse(blocked ? 740 : x, y, A * (blocked ? 1 - clamp((x - 740) / 120) : 1) * sstep(CLIMAX + off, CLIMAX + off + .4, t), fin > .3 && !stop ? 'rgba(255,214,150,.95)' : col);
  });
  gate(760, 900, 1240, A, sstep(CLIMAX + .5, CLIMAX + 1.2, t), fin > .3 ? '#ffd2a0' : ORANGE);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「意识的作用，也许不是', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('发起一个动作，', 540, 522, { ...big, size: 52, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.5, CLIMAX + 2.3), qa);
  typeText('而是决定让不让它发生。」', 540, 616, { ...big, size: 56, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.5), qa);
  typeText('—— 利贝特（大意）', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.7, CLIMAX + 4.3), qa);
  typeText('你管不了念头，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('但管得了下一步。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneScan(t); sceneLaplace(t); sceneNoise(t); sceneVeto(t); sceneNo(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 67.9, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1983', 'Libet, Gleason, Wright & Pearl · Brain', 8.2, 19.6, T);
  stamp('2008', 'Soon, Brass, Heinze & Haynes · Nat Neurosci', 19.9, 27.4, T);
  stamp('1814', 'Laplace · Essai philosophique sur les probabilités', 40.9, 52.9, T);
  stamp('2012', 'Schurger, Sitt & Dehaene · PNAS', 53.6, 63.4, T);
  stamp('1999', 'Libet · J Consciousness Studies', 72.2, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(40);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rp = mulberry(404); PARTS = Array.from({ length: 36 }, () => ({ x: 140 + rp() * 800, y: 800 + rp() * 460, vx: (rp() - .5) * 120, vy: (rp() - .5) * 80 }));
}

// ======================================================================== 音效提示表（音高都在升 F 小调里，最后一个和弦是升 F 大调）
const NOTE = { Fs4: 369.99, A4: 440, As4: 466.16, Cs5: 554.37, Fs5: 739.99, A5: 880, Cs6: 1108.73, Fs6: 1479.98, A6: 1760, As6: 1864.66 };
const FSM_SHIM = [NOTE.A6, NOTE.Cs6, NOTE.Fs6, NOTE.Fs5, NOTE.Cs5], FSMAJ_SHIM = [NOTE.As6, NOTE.Cs6, NOTE.Fs6, NOTE.Fs5, NOTE.Cs5], FSM_SWELL = [46.25, 69.3, 92.5, 110, 138.59];
function CUES() {
  const c = [];
  for (let i = 0; i < 6; i++) c.push([.3 + i * .64, 'click', { gain: .04 }]);
  c.push([3.85, 'click', { gain: .16 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Fs4, NOTE.A4, NOTE.Cs5], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Fs6, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 185, f1: 370, dur: 1.6, gain: .1 }], [11.9, 'tink', { f: NOTE.Cs6, gain: .07 }], [12.6, 'click', { gain: .14 }], [13.6, 'tink', { f: NOTE.Fs6, gain: .08 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: FSM_SHIM, gain: .28 }]);
  c.push([20.2, 'tink', { f: NOTE.Cs6, gain: .06 }], [24.2, 'bar', { f0: 277, f1: 415, dur: 1.2, gain: .08 }], [27.7, 'creak', { dur: 2.4, gain: .05 }], [31.7, 'page', { gain: .18 }]);
  c.push([LAP, 'whoosh', { dur: .5, gain: .25 }], [37.8, 'dust', { dur: 1.6, gain: .1 }], [40.9, 'tink', { f: NOTE.A5, gain: .07 }], [45.2, 'swish', { gain: .1 }], [48.9, 'thud', { gain: .14 }]);
  c.push([NOISE, 'whoosh', { dur: .5, gain: .22 }], [54.2, 'drone', { dur: 4.0, gain: .05 }], [57.9, 'tink', { f: NOTE.Fs6, gain: .06 }]);
  c.push([64.4, 'tink', { f: NOTE.Cs6, gain: .07 }], [68.4, 'swish', { gain: .08 }], [73.4, 'thunk', { gain: .18 }], [76.4, 'page', { gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: FSM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: FSM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 92.5, gain: .14 }], [CLIMAX + .6, 'thunk', { gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: FSMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Fs4, NOTE.As4, NOTE.Cs5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
