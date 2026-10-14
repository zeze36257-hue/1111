// ======================================================================== No.47 外貌主义：看一眼脸，就能猜中谁当选？
// 第六季·日常里的主义 ④。开头是一道选择题：只看一秒照片，选“看起来更能干”的候选人，能猜中多少场选举？（Todorov et al., 2005）
// 音乐：原创配乐（music.py，B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一眼：一个短音轻轻一挑，落到一个长音上，久久不散。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 光环（每拍一个鼓点） · 53.33 准吗（紧张） · 64.0 第二眼（只剩钢琴） · 80.0 高潮：封面后面的光 · 96.0 B 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), HALO = BT(56), TRUE_ = BT(80), SECOND = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['一秒', 0, LIFT], ['看脸', LIFT, HALO], ['光环', HALO, TRUE_], ['准吗', TRUE_, SECOND], ['第二眼', SECOND, CLIMAX], ['看不见的', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.47';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '两个候选人，你不认识他们，只看一秒照片。'],
  [4.1, 7.6, '选「看起来更能干」的那个，能猜中多少场选举？先猜一个。'],
  [8.2, 10.4, '答案是：约七成。'],
  [10.8, 13.3, '只看一眼脸，就猜中了大约七成的结果；'],
  [13.6, 15.7, '后来发现，0.1 秒就够了。'],
  [16.3, 19.6, '这是普林斯顿的托多罗夫，2005 年发表的研究。'],
  [19.9, 23.7, '参与者对这些人一无所知，只凭一张脸。'],
  [24.0, 27.4, '让他们多想一会儿，反而猜得没那么准。'],
  [27.7, 31.3, '第一眼的判断，又快又固执。'],
  [31.6, 35.3, '这就是「外貌主义」：先看脸，再看人。'],
  [37.6, 40.6, '脸，不只影响选票。'],
  [40.9, 44.6, '经济学家发现：相貌平平的人，收入约少 5% 到 10%；'],
  [44.9, 48.6, '长得好看的人，也会多拿一点。'],
  [48.9, 52.9, '我们以为在看能力，其实常常在看光环。'],
  [53.6, 57.6, '可是，靠脸看人，准吗？'],
  [57.9, 60.6, '一项分析了 100 多万次判断的研究发现：'],
  [60.8, 63.4, '靠脸猜，还不如不看脸、只凭常识猜得准。'],
  [64.3, 67.6, '所以，下次第一眼不喜欢一个人，'],
  [67.9, 71.9, '先等一等，给第二眼一个机会。'],
  [72.2, 75.9, '脸，是封面；人，是内容。'],
  [76.3, 79.6, '《小王子》里，狐狸说：'],
  [84.9, 88.6, '第一眼，你看到的是脸；'],
  [88.9, 92.6, '第二眼，才开始看见人。'],
  [98.4, 103.0, '评论区：你有没有看错过一个人？'],
];
const BIGLINES = [
  [80.2, 92.6, '「真正重要的东西，用眼睛是看不见的。」—— 圣埃克苏佩里《小王子》'],
  [93.4, 98.0, '第一眼，只是第一眼。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [HALO - .5, .2], [HALO, .06], [SECOND, .06],
  [SECOND + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 脸、相框、秒表、书、心
function face(x, y, s, a, type = 0, o = {}) {                                                       // type 0：方下巴、平眉；type 1：圆脸、弯眉
  if (a <= 0) return;
  const col = o.col || CREAM;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.fillStyle = 'rgba(30,31,40,.96)';
  ctx.beginPath(); ctx.moveTo(-70, 200); ctx.quadraticCurveTo(-70, 120, 0, 116); ctx.quadraticCurveTo(70, 120, 70, 200); ctx.fill(); ctx.stroke();      // 肩
  ctx.beginPath();
  if (type === 0) ctx.roundRect(-52, -70, 104, 150, [46, 46, 26, 26]); else ctx.ellipse(0, 4, 54, 74, 0, 0, TAU);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); if (type === 0) { ctx.moveTo(-54, -24); ctx.quadraticCurveTo(-50, -84, 0, -82); ctx.quadraticCurveTo(50, -84, 54, -24); }                   // 头发
  else { ctx.moveTo(-56, -10); ctx.quadraticCurveTo(-40, -84, 0, -72); ctx.quadraticCurveTo(46, -80, 56, -10); } ctx.stroke();
  for (const sx of [-1, 1]) {
    ctx.beginPath(); if (type === 0) { ctx.moveTo(sx * 12, -16); ctx.lineTo(sx * 36, -18); } else { ctx.moveTo(sx * 12, -12); ctx.quadraticCurveTo(sx * 24, -24, sx * 36, -14); } ctx.stroke();
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sx * 24, 0, 4, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(-4, 28); ctx.lineTo(4, 30); ctx.stroke();
  ctx.beginPath(); if (type === 0) { ctx.moveTo(-18, 48); ctx.quadraticCurveTo(0, 56, 18, 48); } else { ctx.moveTo(-14, 50); ctx.quadraticCurveTo(0, 50, 14, 48); } ctx.stroke();
  ctx.restore();
}
function frame(x, y, w, h, a, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = o.fill || 'rgba(14,15,20,.92)'; ctx.strokeStyle = o.stroke || 'rgba(236,230,218,.5)'; ctx.lineWidth = 3;
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 24; }
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 16); ctx.fill(); ctx.stroke(); ctx.restore();
}
function ring(x, y, r, k, a, rgb = O_RGB, lw = 14) {                                                // 一个进度环
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.strokeStyle = `rgba(${rgb},.95)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(x, y, r, -PI / 2, -PI / 2 + TAU * k); ctx.stroke(); ctx.restore();
}
function heart(x, y, s, a, k) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 40 * k; ctx.fillStyle = `rgba(255,190,120,${.35 + .5 * k})`;
  ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-60, -10, -40, -60, 0, -30); ctx.bezierCurveTo(40, -60, 60, -10, 0, 30); ctx.fill(); ctx.restore();
}

// ======================================================================== ① 一秒（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('只看一秒，选「更能干」的：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('能猜中多少场？', 540, 560, { ...big, size: 82, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t), pick = sstep(Q.REVEAL, Q.REVEAL + .5, t);
  if (P > 0) {
    frame(320, 1010, 300, 360, P, pick > 0 ? { stroke: `rgba(${O_RGB},${.5 + .5 * pick})`, glow: `rgba(${O_RGB},${.5 * pick})` } : {});
    frame(760, 1010, 300, 360, P);
    ctx.save(); ctx.beginPath(); ctx.roundRect(170, 830, 300, 360, 16); ctx.roundRect(610, 830, 300, 360, 16); ctx.clip();
    face(320, 980, 1.05, P, 0); face(760, 980, 1.05, P, 1); ctx.restore();
    text('甲', 320, 870, { font: SERIF, size: 30, weight: 900, align: 'center', color: DIM, alpha: P });
    text('乙', 760, 870, { font: SERIF, size: 30, weight: 900, align: 'center', color: DIM, alpha: P });
    ring(540, 760, 34, 1 - prog(t, .2, 1.2), P * (1 - sstep(1.2, 1.6, t)), O_RGB, 7);
    text('1 秒', 540, 768, { font: SANS, size: 22, align: 'center', color: '#ffd2a0', alpha: P * (1 - sstep(1.2, 1.6, t)) });
    text('看起来更能干', 320, 1235, { font: SANS, size: 26, align: 'center', color: '#ffd2a0', alpha: P * pick });
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {
    const k = .7 * E.out(prog(t, 11.0, 12.4));
    ring(540, 990, 170, k, C, O_RGB, 26);
    text(`${Math.round(k * 100)}%`, 540, 1010, { font: LAT, size: 84, weight: 700, align: 'center', color: '#ffd2a0', alpha: C });
    text('猜中的选举', 540, 1076, { font: SANS, size: 26, align: 'center', color: DIM, alpha: C });
    text('0.1 秒就够了', 540, 1250, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#7fe3d3', alpha: sstep(13.7, 14.2, t), glow: `rgba(${T_RGB},.5)`, blur: 14 });
  }
  text('一眼，约七成', 540, 560, { font: SERIF, size: 66, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 约 70%', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 约 50%', 200], ['B · 约 70%', 540], ['C · 约 95%', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 只凭一张脸 · 想多了反而不准
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('外貌主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('LOOKISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ④', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneLook(t) {
  if (t < 19.7 || t > HALO + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(HALO - .6, HALO - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('一无所知，只凭一张脸', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.7, 24.1, t)) });
    text('多想一会儿，反而不准', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#f0a0a0', alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('第一眼：又快又固执', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    frame(320, 1000, 300, 380, D);
    ctx.save(); ctx.beginPath(); ctx.roundRect(170, 810, 300, 380, 16); ctx.clip(); face(320, 960, 1.05, D, 0); ctx.restore();
    [['姓名', 820], ['政党', 900], ['政绩', 980]].forEach(([s, y], i) => {
      const a = D * sstep(20.4 + i * .3, 20.8 + i * .3, t) * (1 - sstep(23.7, 24.1, t));
      text(s, 610, y, { font: SANS, size: 28, color: DIM, alpha: a }); text('？', 740, y, { font: SERIF, size: 34, weight: 900, color: '#ffd2a0', alpha: a });
    });
    const B2 = D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t));
    if (B2 > 0) {                                                                                   // 凭直觉 vs 仔细想（示意）
      const base = 1060, k1 = E.out(prog(t, 24.3, 25.1)), k2 = E.out(prog(t, 25.0, 25.8));
      ctx.save(); ctx.globalAlpha = B2; ctx.fillStyle = ORANGE; ctx.fillRect(570, base - 220 * k1, 110, 220 * k1); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(740, base - 150 * k2, 110, 150 * k2);
      ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, base); ctx.lineTo(880, base); ctx.stroke(); ctx.restore();
      text('一眼', 625, base + 40, { font: SANS, size: 26, align: 'center', color: '#ffd2a0', alpha: B2 });
      text('仔细想', 795, base + 40, { font: SANS, size: 26, align: 'center', color: '#c3cad6', alpha: B2 });
      text('（示意）', 710, base + 84, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: B2 });
    }
    const st = D * sstep(27.9, 28.3, t);
    if (st > 0) { ctx.save(); ctx.globalAlpha = st; ctx.translate(720, 960); ctx.rotate(-.2); ctx.scale(1 + .4 * (1 - E.out(prog(t, 27.9, 28.3))), 1 + .4 * (1 - E.out(prog(t, 27.9, 28.3))));
      ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 14; ctx.strokeRect(-130, -48, 260, 96); ctx.restore();
      ctx.save(); ctx.translate(720, 960); ctx.rotate(-.2); text('第一印象', 0, 4, { font: SERIF, size: 46, weight: 900, align: 'center', color: '#ffd2a0', alpha: st }); ctx.restore(); }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('外貌主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('先看脸，再看人', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: '#ffd2a0', spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 光环：脸也影响工资
function sceneHalo(t) {
  if (t < HALO - .3 || t > TRUE_ + .2) return;
  const A = sstep(HALO - .1, HALO + .5, t) * (1 - sstep(TRUE_ - .6, TRUE_ - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - HALO) / BEAT) % 1);
  text('脸，不只影响选票', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(40.6, 41.0, t)) });
  text('收入（和长相一般的人比）', 540, 640, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(40.9, 41.4, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('其实在看光环', 0, 0, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(48.9, 49.4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  const S = A * (1 - sstep(40.6, 41.0, t));
  if (S > 0) {
    frame(540, 1010, 320, 400, S);
    ctx.save(); ctx.beginPath(); ctx.roundRect(380, 810, 320, 400, 16); ctx.clip(); face(540, 980, 1.1, S, 1); ctx.restore();
    ctx.save(); ctx.globalAlpha = S * sstep(38.2, 38.8, t); ctx.strokeStyle = '#ffd2a0'; ctx.lineWidth = 6; ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.ellipse(540, 860, 80, 18, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
  const G = A * sstep(40.9, 41.4, t);
  if (G > 0) {
    const base = 1060, mid = 200;
    ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(150, base - mid); ctx.lineTo(930, base - mid); ctx.stroke(); ctx.restore();
    [[270, -.075, '相貌平平', '约少 5%–10%', 41.2, '154,163,178', '#c3cad6'], [540, 0, '一般', '基准', 41.6, '236,230,218', CREAM], [810, .05, '好看', '多一点', 45.0, O_RGB, '#ffd2a0']].forEach(([x, d, lab, val, t0, rgb, col]) => {
      const k = E.out(prog(t, t0, t0 + .9)), a = G * sstep(t0, t0 + .3, t), h = (mid + d * 1000) * k;
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.8)`; ctx.fillRect(x - 70, base - h, 140, h); ctx.restore();
      text(val, x, base - h - 28, { font: SERIF, size: 34, weight: 900, align: 'center', color: col, alpha: a * sstep(.6, 1, k) });
      text(lab, x, base + 42, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: a });
    });
    text('（示意，柱高不按比例）', 540, 1160, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: G });
  }
}

// ======================================================================== ④ 准吗：一百多万次判断
function sceneTrue(t) {
  if (t < TRUE_ - .3 || t > SECOND + .2) return;
  const A = sstep(TRUE_ - .1, TRUE_ + .5, t) * (1 - sstep(SECOND - .7, SECOND - .1, t));
  if (A <= 0) return;
  text('靠脸看人，准吗？', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('100 多万次判断', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(58.0, 58.5, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  const S = A * (1 - sstep(57.6, 58.0, t));
  if (S > 0) {
    [[230, 0], [430, 1], [650, 0], [850, 1]].forEach(([x, ty], i) => {
      const a = S * sstep(54.2 + i * .25, 54.6 + i * .25, t);
      frame(x, 1000, 170, 220, a); ctx.save(); ctx.beginPath(); ctx.roundRect(x - 85, 890, 170, 220, 14); ctx.clip(); face(x, 990, .6, a, ty); ctx.restore();
      text('？', x, 1160, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: a * sstep(55.4, 55.8, t) });
    });
  }
  const G = A * sstep(58.0, 58.5, t);
  if (G <= 0) return;
  const n = Math.floor(400 * E.out(prog(t, 58.1, 59.5))), r = mulberry(4700);
  for (let i = 0; i < 400; i++) { const x = 180 + (i % 40) * 18, y = 760 + Math.floor(i / 40) * 18 + r() * 0; if (i < n) { ctx.save(); ctx.globalAlpha = G * .45; ctx.fillStyle = '#c3cad6'; ctx.fillRect(x, y, 10, 10); ctx.restore(); } }
  const base = 1240, k1 = E.out(prog(t, 60.9, 61.7)), k2 = E.out(prog(t, 61.4, 62.2));
  ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(200, base); ctx.lineTo(880, base); ctx.stroke();
  ctx.fillStyle = '#9aa3b2'; ctx.fillRect(300, base - 150 * k1, 140, 150 * k1); ctx.fillStyle = TEAL; ctx.fillRect(640, base - 200 * k2, 140, 200 * k2); ctx.restore();
  text('靠脸猜', 370, base - 150 * k1 - 24, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#c3cad6', alpha: G * k1 });
  text('只凭常识', 710, base - 200 * k2 - 24, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#7fe3d3', alpha: G * k2 });
  text('猜得准的程度（示意）', 540, base + 40, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: G });
}

// ======================================================================== ⑤ 第二眼：封面和内容
function sceneSecond(t) {
  if (t < SECOND - .2 || t > CLIMAX + .3) return;
  const A = sstep(SECOND + .2, SECOND + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('第一眼不喜欢？', 64.5, 67.6, CREAM);
  hd('先等一等', 67.9, 71.9, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('脸是封面，人是内容', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('狐狸说：', 76.4, 0, CREAM);
  const open = E.io(prog(t, 72.5, 74.0));
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(236,230,218,.92)'; ctx.fillRect(540, 820, 300, 400);                                // 书页（内容）
  ctx.fillStyle = 'rgba(60,60,70,.45)'; for (let i = 0; i < 14; i++) ctx.fillRect(570, 860 + i * 24, 240 - ((i * 37) % 5) * 20, 6); ctx.restore();
  ctx.save(); ctx.globalAlpha = A; ctx.translate(540, 0); ctx.scale(Math.cos(PI * open), 1);                                                    // 封面绕书脊翻到左边
  ctx.fillStyle = 'rgba(30,31,40,.98)'; ctx.strokeStyle = 'rgba(236,230,218,.55)'; ctx.lineWidth = 3; ctx.fillRect(0, 820, 300, 400); ctx.strokeRect(0, 820, 300, 400);
  if (open < .5) face(150, 990, .9, 1 - 2 * open, 0);
  ctx.restore();
  text('内容', 690, 1270, { font: SANS, size: 26, align: 'center', color: '#ffd2a0', alpha: A * sstep(73.6, 74.0, t) });
  text('封面', 390, 1270, { font: SANS, size: 26, align: 'center', color: DIM, alpha: A * sstep(73.6, 74.0, t) });
  const clock = A * sstep(68.0, 68.5, t) * (1 - sstep(71.9, 72.3, t));
  if (clock > 0) { ring(800, 760, 40, prog(t, 68.2, 71.6), clock, T_RGB, 8); }
}

// ======================================================================== ⑥ 看不见的：封面后面的光
function sceneHeart(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), see = E.io(prog(t, CLIMAX + .8, CLIMAX + 4.0));
  warmth(A * (1 + .5 * fin), 540, 1030, 760);
  frame(540, 1030, 340, 440, A * (1 - .7 * see));
  ctx.save(); ctx.beginPath(); ctx.roundRect(370, 810, 340, 440, 16); ctx.clip(); face(540, 1000, 1.15, A * (1 - .8 * see), 1); ctx.restore();
  heart(540, 1050, 1.6 + .2 * fin + .05 * Math.sin(t * 3), A * see, see * (.6 + .4 * fin));
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const r = mulberry(4800 + i), x = 380 + r() * 320, sp = 30 + r() * 40, p = ((t - FINAL) * sp / 420 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1200 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('真正重要的东西，', 540, 450, { ...big, size: 58, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('用眼睛是看不见的。', 540, 560, { ...big, size: 66, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.5, CLIMAX + 2.6), qa);
  typeText('—— 圣埃克苏佩里《小王子》', 540, 646, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.8, CLIMAX + 3.4), qa);
  typeText('第一眼，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('只是第一眼。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneLook(t); sceneHalo(t); sceneTrue(t); sceneSecond(t); sceneHeart(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2005', 'Todorov et al. · Science', 8.2, 35.3, T);
  stamp('1994', 'Hamermesh & Biddle · Am Econ Rev', 37.6, 52.9, T);
  stamp('2010', 'Olivola & Todorov · J Exp Soc Psychol', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(47);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 B 小调里，最后一个和弦是 B 大调）
const NOTE = { B3: 246.94, D4: 293.66, Ds4: 311.13, Fs4: 369.99, B4: 493.88, D5: 587.33, Ds5: 622.25, Fs5: 739.99, B5: 987.77, D6: 1174.66, Ds6: 1244.51 };
const BM_SHIM = [NOTE.D6, NOTE.Fs5, NOTE.B5, NOTE.B4, NOTE.Fs4], BMAJ_SHIM = [NOTE.Ds6, NOTE.Fs5, NOTE.B5, NOTE.B4, NOTE.Fs4], BM_SWELL = [61.74, 92.50, 123.47, 146.83, 185.00];
function CUES() {
  const c = [];
  c.push([.2, 'tick', { gain: .2 }], [1.2, 'tink', { f: NOTE.Fs5, gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.B3, NOTE.D4, NOTE.Fs4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Fs5, gain: .1 }]);
  c.push([11.0, 'swish', { gain: .08 }], [13.7, 'tick', { gain: .3 }], [13.8, 'tink', { f: NOTE.B5, gain: .06 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BM_SHIM, gain: .28 }]);
  c.push([20.4, 'tink', { f: NOTE.B4, gain: .05 }], [20.7, 'tink', { f: NOTE.D5, gain: .05 }], [21.0, 'tink', { f: NOTE.Fs5, gain: .05 }], [24.3, 'bar', { f0: 246, f1: 494, dur: .8, gain: .07 }], [25.0, 'bar', { f0: 246, f1: 370, dur: .8, gain: .07 }]);
  c.push([27.9, 'slap', { gain: .14 }], [31.7, 'page', { gain: .18 }]);
  c.push([HALO, 'whoosh', { dur: .5, gain: .25 }], [38.2, 'shimmer', { f: [NOTE.B5, NOTE.Fs5, NOTE.D6], gain: .1 }], [41.2, 'bar', { f0: 246, f1: 330, dur: .9, gain: .07 }], [45.0, 'bar', { f0: 246, f1: 494, dur: .9, gain: .07 }]);
  c.push([49.0, 'chord', { f: [NOTE.B3, NOTE.D4, NOTE.Fs4], gain: .1 }], [49.1, 'tink', { f: NOTE.D6, gain: .07 }]);
  c.push([TRUE_, 'whoosh', { dur: .5, gain: .22 }], [54.2, 'click', { gain: .08 }], [54.45, 'click', { gain: .08 }], [54.7, 'click', { gain: .08 }], [54.95, 'click', { gain: .08 }], [58.1, 'dust', { dur: 1.4, gain: .06 }], [61.4, 'tink', { f: NOTE.B5, gain: .07 }]);
  c.push([64.6, 'tink', { f: NOTE.D5, gain: .06 }], [68.2, 'drone', { dur: 3.2, gain: .04 }], [72.5, 'page', { gain: .2 }], [73.6, 'tink', { f: NOTE.Fs5, gain: .06 }]);
  c.push([76.4, 'page', { gain: .16 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: BM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 123.47, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: BMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.B3, NOTE.Ds4, NOTE.Fs4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
