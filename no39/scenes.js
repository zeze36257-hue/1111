// ======================================================================== No.39 个人主义：挡路的椅子，你会挪开吗？
// 第五季·看不见的主义 ⑥。开头是一道选择题：星巴克里两把椅子挡住了过道，南方人和北方人，谁更常把椅子挪开？（Talhelm et al., 2018）
// 音乐：原创配乐（music.py，E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机碰到同一个音两次，然后要么跳过去，要么小步挤过去。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 个人主义（每拍一个鼓点） · 53.33 别贴标签（紧张） · 64.0 波纹（只剩钢琴） · 80.0 高潮：一圈圈波纹 · 96.0 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), IND = BT(56), LABEL = BT(80), RIPPLE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['椅子', 0, LIFT], ['稻与麦', LIFT, IND], ['个人主义', IND, LABEL], ['别贴标签', LABEL, RIPPLE], ['波纹', RIPPLE, CLIMAX], ['圈子的中心', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.39';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '星巴克里，两把椅子挡住了过道。'],
  [4.1, 7.6, '南方人和北方人，谁更常把椅子挪开？先猜一个。'],
  [8.2, 10.4, '答案是：北方人。'],
  [10.8, 13.3, '北方约 16% 的人，会把椅子挪开；'],
  [13.6, 15.7, '南方只有约 6%，大多侧身挤过去。'],
  [16.3, 19.6, '研究者说，这可能和祖辈种什么有关。'],
  [19.9, 23.7, '南方种水稻，要一起修水渠、轮流放水，离不开邻居；'],
  [24.0, 27.4, '北方种小麦，靠天下雨，一家人就能种。'],
  [27.7, 31.3, '另一项测试，让人画出自己和朋友：'],
  [31.6, 35.3, '麦区的人把自己画大一点，稻区的几乎一样大。'],
  [37.6, 40.6, '这就是「个人主义」和集体主义的差别：'],
  [40.9, 44.6, '先把自己当成一个独立的人，'],
  [44.9, 48.6, '还是先把自己放在关系里。'],
  [48.9, 52.9, '挪椅子，是改变环境；侧身挤过，是适应环境。'],
  [53.6, 57.6, '但别急着给南方人、北方人贴标签。'],
  [57.9, 63.4, '这些只是平均的倾向，差别不大，每个人都可能完全不一样。'],
  [64.3, 67.6, '两种活法，各有各的好：'],
  [67.9, 71.9, '一个人能走得快，一群人能走得远。'],
  [72.2, 75.9, '社会学家费孝通，用过一个比喻：'],
  [76.3, 79.6, '在《乡土中国》里，他写道：'],
  [84.9, 88.6, '你是自己圈子的中心，'],
  [88.9, 92.6, '也是别人圈子里的一圈波纹。'],
  [98.4, 103.0, '评论区：你是南方人还是北方人？你会挪椅子吗？'],
];
const BIGLINES = [
  [80.2, 92.6, '「好像把一块石头丢在水面上，一圈圈推出去的波纹。每个人，都是他圈子的中心。」—— 费孝通'],
  [93.4, 98.0, '做自己，也别忘了身边的人。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [IND - .5, .2], [IND, .06], [RIPPLE, .06],
  [RIPPLE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、椅子、桌子、柱子、波纹
function person(x, y, s, a, col = CREAM, fill = 'rgba(16,17,23,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = fill;
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function chair(x, y, a, rot = 0, col = '#d8c79f') {                                               // 俯视的椅子：座面 + 靠背
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = 'rgba(60,48,36,.95)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-34, -34, 68, 68, 10); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.fillRect(-34, -44, 68, 12); ctx.restore();
}
function table(x, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(40,44,58,.95)'; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 90, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
function ripples(cx, cy, a, t0, t, rgb = O_RGB, n = 4, max = 260, speed = 70) {                   // 一圈圈往外推的波纹
  if (a <= 0 || t < t0) return;
  for (let i = 0; i < n; i++) {
    const r = ((t - t0) * speed + i * max / n) % max; if (t - t0 < i * max / n / speed) continue;
    ctx.save(); ctx.globalAlpha *= a * (1 - r / max) * .8; ctx.strokeStyle = `rgba(${rgb},.9)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(cx, cy, r, r * .42, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
}

// ======================================================================== ① 椅子（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('挡路的椅子：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('谁更常挪开？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const S = 1 - sstep(10.5, 11.0, t);
  if (S > 0) {
    table(250, 880, S); table(830, 880, S);
    chair(505, 880, S, -.1); chair(578, 890, S, .08);
    const walk = E.out(prog(t, .3, 1.6));
    person(540, lerp(1200, 1120, walk), .8, S, '#c3cad6');
    const pa = sstep(1.8, 2.3, t);
    drawOn(() => { ctx.moveTo(530, 1060); ctx.quadraticCurveTo(520, 950, 600, 800); }, 300, E.io(prog(t, 2.0, 3.2)), 'rgba(242,161,74,.85)', 4, S, `rgba(${O_RGB},.5)`);
    drawOn(() => { ctx.moveTo(550, 1060); ctx.bezierCurveTo(700, 1000, 700, 860, 560, 760); }, 360, E.io(prog(t, 2.6, 3.8)), 'rgba(79,214,196,.85)', 4, S, `rgba(${T_RGB},.5)`);
    text('挪开', 420, 760, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: S * pa });
    text('侧身挤过', 760, 1000, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#7fe3d3', alpha: S * sstep(2.6, 3.0, t) });
  }
  const ca = sstep(10.8, 11.3, t);
  if (ca > 0) {
    const base = 1240, g1 = E.out(prog(t, 11.0, 12.0)), g2 = E.out(prog(t, 13.7, 14.7));
    text('把椅子挪开的人', 540, 540, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: ca });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, ca);
    bar(380, base, 150, 22 * 16 * g1, O_RGB, ca); bar(700, base, 150, 22 * 6 * g2, T_RGB, ca * sstep(13.6, 14.0, t));
    text('约 16%', 380, base - 22 * 16 * g1 - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: ca * g1 });
    text('约 6%', 700, base - 22 * 6 * g2 - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#7fe3d3', alpha: ca * g2 });
    text('北方 · 麦区', 380, base + 40, { font: SANS, size: 28, align: 'center', color: '#ffd2a0', alpha: ca });
    text('南方 · 稻区', 700, base + 40, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: ca * sstep(13.6, 14.0, t) });
  }
  text('A · 北方人', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 北方人', 220], ['B · 南方人', 540], ['C · 差不多', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 水稻与小麦 · 自我与朋友
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('个人主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('INDIVIDUALISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 20, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ⑥', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneCrops(t) {
  if (t < 19.7 || t > IND + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(IND - .6, IND - .05, t));
  if (A <= 0) return;
  const C = A * (1 - sstep(27.4, 27.9, t));
  if (C > 0) {
    const L = C * sstep(19.9, 20.4, t), R = C * sstep(24.0, 24.5, t);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {                                    // 水田：一格格稻田，中间是水渠
      ctx.save(); ctx.globalAlpha = L; ctx.fillStyle = 'rgba(90,150,90,.55)'; ctx.fillRect(160 + c * 96, 760 + r * 96, 84, 84); ctx.restore();
    }
    ctx.save(); ctx.globalAlpha = L; ctx.strokeStyle = 'rgba(110,170,230,.85)'; ctx.lineWidth = 6; const fl = (t * 40) % 24; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -fl;
    ctx.beginPath(); for (const x of [250, 346]) { ctx.moveTo(x, 750); ctx.lineTo(x, 1050); } for (const y of [850, 946]) { ctx.moveTo(150, y); ctx.lineTo(450, y); } ctx.stroke(); ctx.restore();
    [[150, 1140], [250, 1150], [350, 1140], [450, 1150]].forEach(([x, y], i) => person(x, y, .45, L, '#7fe3d3'));
    drawOn(() => { ctx.moveTo(150, 1095); ctx.lineTo(450, 1105); }, 300, E.out(prog(t, 20.6, 21.6)), 'rgba(79,214,196,.7)', 2, L);
    text('水稻：一起修水渠', 300, 1240, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#7fe3d3', alpha: L });
    for (let i = 0; i < 9; i++) {                                                                 // 麦子
      const x = 660 + i * 30, sway = Math.sin(t * 1.4 + i) * 6;
      ctx.save(); ctx.globalAlpha = R; ctx.strokeStyle = '#d9b46a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 1060); ctx.quadraticCurveTo(x + sway * .5, 960, x + sway, 860); ctx.stroke();
      ctx.fillStyle = '#e8c88a'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(x + sway + (k % 2 ? 6 : -6), 860 + k * 14, 5, 9, (k % 2 ? .4 : -.4), 0, TAU); ctx.fill(); } ctx.restore();
    }
    for (let i = 0; i < 10; i++) { const ph = ((t * .9) + i * .1) % 1; ctx.save(); ctx.globalAlpha = R * .7; ctx.strokeStyle = 'rgba(160,190,230,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(640 + i * 30, 700 + ph * 120); ctx.lineTo(636 + i * 30, 720 + ph * 120); ctx.stroke(); ctx.restore(); }
    person(740, 1150, .45, R, '#ffd2a0'); person(820, 1150, .45, R, '#ffd2a0');
    text('小麦：靠天下雨', 780, 1240, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#ffd2a0', alpha: R });
  }
  const G = A * sstep(27.7, 28.2, t);
  if (G > 0) {                                                                                     // 画出自己和朋友
    text('画出你和朋友', 540, 640, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: G });
    [[300, '麦区', 50, O_RGB, '#ffd2a0'], [780, '稻区', 34, T_RGB, '#7fe3d3']].forEach(([cx, lab, rMe, rgb, col], k) => {
      const a = G * sstep(31.6 + k * .5, 32.1 + k * .5, t), cy = 980;
      for (let i = 0; i < 4; i++) { const an = -PI / 4 + i * PI / 2, fx = cx + Math.cos(an) * 120, fy = cy + Math.sin(an) * 120; seg(cx, cy, fx, fy, 'rgba(236,230,218,.3)', 2, a); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(154,163,178,.4)'; ctx.strokeStyle = 'rgba(154,163,178,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, 34, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); text('朋友', fx, fy + 2, { font: SANS, size: 20, align: 'center', color: CREAM, alpha: a }); }
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.35)`; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(cx, cy, rMe * (.7 + .3 * E.out(prog(t, 31.8 + k * .5, 32.6 + k * .5))), 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
      text('我', cx, cy + 2, { font: SERIF, size: 28, weight: 900, align: 'center', color: '#fff4e6', alpha: a });
      text(lab, cx, 1210, { font: SERIF, size: 38, weight: 900, align: 'center', color: col, alpha: a });
      text(k ? '几乎一样大' : '自己大一点', cx, 1260, { font: SANS, size: 26, align: 'center', color: '#c3cad6', alpha: a });
    });
  }
}

// ======================================================================== ③ 个人主义：独立的我 / 关系里的我 · 改变环境 / 适应环境
function sceneInd(t) {
  if (t < IND - .3 || t > LABEL + .2) return;
  const A = sstep(IND - .1, IND + .5, t) * (1 - sstep(LABEL - .6, LABEL - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - IND) / BEAT) % 1);
  const D = A * (1 - sstep(48.6, 49.0, t));
  if (D > 0) {
    typeText('个人主义 vs 集体主义', 540, 640, { ...big, size: 56, weight: 900 }, prog(t, 37.7, 38.6), D);
    const L = D * sstep(40.9, 41.3, t), R = D * sstep(44.9, 45.3, t);
    ctx.save(); ctx.globalAlpha = L; ctx.strokeStyle = `rgba(${O_RGB},.8)`; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.arc(300, 980, 130 * (1 + .03 * bk), 0, TAU); ctx.stroke(); ctx.restore();
    person(300, 1020, .9, L, '#ffd2a0');
    text('先是独立的我', 300, 1200, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: L });
    const NB = [[-120, -110], [120, -100], [-140, 60], [140, 70], [0, 150]];
    NB.forEach(([dx, dy], i) => { seg(780, 960, 780 + dx, 960 + dy, `rgba(${T_RGB},.6)`, 2.5, R * sstep(45.0 + i * .12, 45.3 + i * .12, t)); person(780 + dx, 980 + dy + 20, .45, R * sstep(45.0 + i * .12, 45.3 + i * .12, t), '#9aa3b2'); });
    person(780, 1000, .8, R, '#7fe3d3');
    text('先是关系里的我', 780, 1200, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#7fe3d3', alpha: R });
  }
  const C = A * sstep(48.9, 49.4, t);
  if (C > 0) {
    const push = E.io(prog(t, 49.3, 50.3)), slide = E.io(prog(t, 50.8, 52.0));
    chair(300 + 90 * push, 960, C, .3 * push); person(300 - 30 + 40 * push, 1120, .7, C, '#ffd2a0');
    if (push > .1) drawOn(() => { ctx.moveTo(270, 960); ctx.lineTo(370, 960); }, 100, push, ORANGE, 4, C);
    text('改变环境', 300, 1250, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: C });
    chair(780, 960, C * sstep(50.4, 50.8, t)); person(780 + 90 * Math.sin(PI * slide), lerp(1120, 820, slide), .7, C * sstep(50.4, 50.8, t), '#7fe3d3');
    text('适应环境', 780, 1250, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#7fe3d3', alpha: C * sstep(50.4, 50.8, t) });
  }
}

// ======================================================================== ④ 别贴标签：两条几乎重叠的曲线
function sceneLabel(t) {
  if (t < LABEL - .3 || t > RIPPLE + .2) return;
  const A = sstep(LABEL - .1, LABEL + .5, t) * (1 - sstep(RIPPLE - .7, RIPPLE - .1, t));
  if (A <= 0) return;
  const T1 = A * (1 - sstep(57.4, 57.9, t));
  [['南方人 = ？', 330, 53.8], ['北方人 = ？', 750, 54.3]].forEach(([s, x, t0]) => {
    const a = T1 * sstep(t0, t0 + .4, t), peel = E.in(prog(t, 55.8, 57.2));
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, 960 + 200 * peel); ctx.rotate(-.1 + .8 * peel);
    ctx.fillStyle = 'rgba(232,224,204,.94)'; ctx.beginPath(); ctx.roundRect(-150, -50, 300, 100, 14); ctx.fill(); ctx.restore();
    text(s, x, 960 + 200 * peel, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#2a2418', alpha: a * (1 - peel) });
  });
  text('别急着贴标签', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#f0a0a0', alpha: T1 * sstep(54.8, 55.3, t) });
  const G = A * sstep(57.9, 58.4, t);
  if (G > 0) {
    const x0 = 160, x1 = 920, y0 = 1180, k = E.out(prog(t, 58.2, 59.6));
    seg(x0, y0, x1, y0, 'rgba(236,230,218,.4)', 2, G);
    [[470, O_RGB, '北方'], [610, T_RGB, '南方']].forEach(([mu, rgb, lab]) => {
      ctx.save(); ctx.globalAlpha = G * .9; ctx.strokeStyle = `rgba(${rgb},.95)`; ctx.fillStyle = `rgba(${rgb},.15)`; ctx.lineWidth = 3.5; ctx.beginPath();
      for (let i = 0; i <= 120; i++) { const x = lerp(x0, x1, i / 120), y = y0 - 380 * k * Math.exp(-((x - mu) ** 2) / (2 * 150 ** 2)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.lineTo(x1, y0); ctx.lineTo(x0, y0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      text(lab, mu + (mu < 540 ? -40 : 40), y0 - 400 * k - 24, { font: SERIF, size: 32, weight: 900, align: 'center', color: rgb === O_RGB ? '#ffd2a0' : '#7fe3d3', alpha: G * k });
    });
    text('平均差一点，个人差很多', 540, 640, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: G * sstep(59.6, 60.1, t) });
    text('示意', x1, y0 + 30, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: G });
  }
}

// ======================================================================== ⑤ 走得快、走得远 · 石头丢进水里
function sceneRipple(t) {
  if (t < RIPPLE - .2 || t > CLIMAX + .3) return;
  const A = sstep(RIPPLE + .2, RIPPLE + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const W2 = A * (1 - sstep(71.7, 72.2, t));
  if (W2 > 0) {
    const f = ((t - 64.3) * .5) % 1, g = ((t - 67.9) * .22) % 1;
    person(lerp(160, 900, f), 900, .6, W2 * sstep(64.4, 64.9, t), '#ffd2a0');
    text('一个人，走得快', 540, 760, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: W2 * sstep(64.4, 64.9, t) });
    if (t > 67.9) for (let i = 0; i < 5; i++) person(lerp(160, 900, g) + (i - 2) * 50, 1180 + (i % 2) * 18, .5, W2 * sstep(67.9, 68.4, t), '#7fe3d3');
    text('一群人，走得远', 540, 1040, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#7fe3d3', alpha: W2 * sstep(67.9, 68.4, t) });
  }
  const R = A * sstep(72.2, 72.7, t);
  if (R > 0) {
    const drop = E.in(prog(t, 72.3, 73.0));
    if (drop < 1) { ctx.save(); ctx.globalAlpha = R; ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.ellipse(540, lerp(700, 1040, drop), 18, 14, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ripples(540, 1040, R, 73.0, t, '160,190,230', 5, 300, 60);
    typeText('费孝通', 540, 640, { ...big, size: 60, weight: 900 }, prog(t, 76.4, 77.2), R * sstep(76.3, 76.8, t));
    typeText('《乡土中国》1947', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), R * sstep(76.3, 76.8, t));
  }
}

// ======================================================================== ⑥ 圈子的中心：每个人都在推出自己的波纹
function sceneCenter(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const P = [[540, 1060, 0], [260, 980, 1.2], [820, 990, 2.0], [330, 1210, 2.8], [770, 1220, 3.4]];
  P.forEach(([x, y, d], i) => {
    const t0 = CLIMAX + .4 + d, a = A * sstep(t0, t0 + .5, t), me = i === 0;
    ripples(x, y + 20, a * (me ? 1 : .7), t0, t, me ? O_RGB : (fin > .3 ? '255,210,160' : T_RGB), 4, me ? 280 : 200, 55);
    person(x, y, me ? .75 : .55, a, me ? '#ffd2a0' : (fin > .3 ? '#ffd2a0' : '#7fe3d3'));
  });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「好像把一块石头丢在水面上，', 540, 430, { ...big, size: 50, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('一圈圈推出去的波纹。', 540, 522, { ...big, size: 50, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.7, CLIMAX + 2.6), qa);
  typeText('每个人，都是他圈子的中心。」', 540, 616, { ...big, size: 54, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.7, CLIMAX + 3.8), qa);
  typeText('—— 费孝通《乡土中国》（节选）', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 4.0, CLIMAX + 4.6), qa);
  typeText('做自己，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('也别忘了身边的人。', 540, 596, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneCrops(t); sceneInd(t); sceneLabel(t); sceneRipple(t); sceneCenter(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.2, 80, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2018', 'Talhelm et al. · Science Advances', 8.2, 15.7, T);
  stamp('2014', 'Talhelm et al. · Science', 16.3, 35.3, T);
  stamp('1947', 'Fei Xiaotong · From the Soil', 72.2, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(39);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 E 小调里，最后一个和弦是 E 大调）
const NOTE = { E4: 329.63, G4: 392, Gs4: 415.3, B4: 493.88, E5: 659.26, G5: 783.99, B5: 987.77, E6: 1318.51, G6: 1567.98, Gs6: 1661.22 };
const EM_SHIM = [NOTE.G6, NOTE.B5, NOTE.E6, NOTE.E5, NOTE.B4], EMAJ_SHIM = [NOTE.Gs6, NOTE.B5, NOTE.E6, NOTE.E5, NOTE.B4], EM_SWELL = [82.41, 123.47, 164.81, 196, 246.94];
function CUES() {
  const c = [];
  c.push([.4, 'click', { gain: .12 }], [.55, 'click', { gain: .1 }], [2.0, 'swish', { gain: .1 }], [2.6, 'swish', { gain: .1 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.E4, NOTE.G4, NOTE.B4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.E6, gain: .12 }]);
  c.push([11.0, 'bar', { f0: 330, f1: 660, dur: 1.0, gain: .14 }], [13.7, 'bar', { f0: 330, f1: 392, dur: 1.0, gain: .12 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EM_SHIM, gain: .28 }]);
  c.push([20.0, 'swish', { gain: .08 }], [20.6, 'tink', { f: NOTE.B5, gain: .06 }], [24.0, 'wind', { dur: 3.4, gain: .06 }]);
  for (let i = 0; i < 2; i++) c.push([31.8 + i * .5, 'tink', { f: [NOTE.E6, NOTE.B5][i], gain: .07 }]);
  c.push([IND, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'tink', { f: NOTE.G5, gain: .08 }], [45.0, 'chord', { f: [NOTE.E5, NOTE.G5, NOTE.B5], gain: .08 }], [49.3, 'thud', { gain: .14 }], [50.8, 'swish', { gain: .1 }]);
  c.push([LABEL, 'whoosh', { dur: .5, gain: .22 }], [53.8, 'click', { gain: .1 }], [54.3, 'click', { gain: .1 }], [55.8, 'page', { gain: .14 }], [58.2, 'bar', { f0: 196, f1: 330, dur: 1.4, gain: .08 }]);
  c.push([64.4, 'whoosh', { dur: .6, gain: .1 }], [67.9, 'dust', { dur: 1.6, gain: .06 }], [73.0, 'thunk', { gain: .14 }], [73.05, 'tink', { f: NOTE.E5, gain: .06 }], [76.4, 'page', { gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: EM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 164.81, gain: .14 }]);
  [0, 1.2, 2.0, 2.8, 3.4].forEach((d, i) => c.push([CLIMAX + .4 + d, 'tink', { f: [NOTE.E5, NOTE.G5, NOTE.B5, NOTE.E6, NOTE.G6][i], gain: .05 }]));
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.E4, NOTE.Gs4, NOTE.B4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
