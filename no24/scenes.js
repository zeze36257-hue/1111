// ======================================================================== No.24 唯美主义：为什么照片里的你，没有镜子里好看？
// 第四季·你身上的主义 ①。开头是一道选择题：同一张脸，原图和左右翻转的照片，你和朋友各会选哪张？（Mita, Dermer & Knight, 1977）
// 音乐：原创配乐（music.py，升 C 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。开头的动机先往上走，再像镜子一样原路落回来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 颜值即正义（每拍一个鼓点） · 53.33 道林·格雷（紧张） · 64.0 真实的你（只剩钢琴） · 80.0 高潮 · 96.0 升 C 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), HALO = BT(56), DORIAN = BT(80), REAL = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['照片测试', 0, LIFT], ['曝光效应', LIFT, HALO], ['颜值即正义', HALO, DORIAN], ['道林·格雷', DORIAN, REAL], ['真实的你', REAL, CLIMAX], ['爱自己', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.24';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '同一张脸，两张照片：一张原图，一张左右翻转。'],
  [4.1, 7.6, '你会更喜欢哪一张？你的朋友呢？先猜一个。'],
  [8.2, 10.4, '答案是：你选翻转的那张，朋友选原图。'],
  [10.8, 13.3, '因为镜子里的你，本来就是左右翻过来的。'],
  [13.6, 15.7, '而别人眼里的你，一直是原图。'],
  [16.3, 19.6, '心理学叫它「曝光效应」：看得越多，就越喜欢。'],
  [19.9, 23.7, '你看惯了镜子里的自己，照片里的那个，反而像陌生人。'],
  [24.0, 27.4, '还有一个原因：自拍时，手机离脸太近。'],
  [27.7, 31.3, '30 厘米外自拍，鼻子会比 1.5 米外拍的宽三成左右。'],
  [31.6, 35.3, '不是你变丑了，是镜头离你太近。'],
  [37.6, 40.6, '19 世纪的唯美主义说：美，本身就是意义。'],
  [40.9, 44.6, '今天，它变成了一句话：「颜值即正义」。'],
  [44.9, 48.6, '1972 年的实验：好看的人，被认为性格更好、更会成功。'],
  [48.9, 52.9, '心理学叫它「光环效应」：美的，就被当成好的。'],
  [53.6, 57.6, '唯美主义的代表王尔德，却写过这样一个故事：'],
  [57.9, 63.4, '道林·格雷永远年轻，他做过的坏事，全刻在了画像上。'],
  [64.3, 67.6, '其实，我们心里的自己，还被悄悄美化过。'],
  [67.9, 71.9, '一项研究把照片修得更好看，人们反而一眼认出：这就是我。'],
  [72.2, 75.9, '所以照片没有错，它只是比你的想象更诚实。'],
  [76.3, 79.6, '王尔德自己也写过一句：'],
  [84.9, 88.6, '你嫌弃的那张照片，'],
  [88.9, 92.6, '正是别人每天看到、也最熟悉的你。'],
  [98.4, 103.0, '评论区：你更喜欢镜子里的自己，还是照片里的？'],
];
const BIGLINES = [
  [80.2, 92.6, '「爱自己，是一场终身浪漫的开始。」—— 王尔德《理想丈夫》'],
  [93.4, 98.0, '所以，下次别急着删那张照片。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [HALO - .5, .2], [HALO, .06], [REAL, .06],
  [REAL + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== 一张脸（线描）：不对称的分头、一边挑起的眉、一颗痣、一边高一点的笑
// o.flip 左右翻转 · o.nose 鼻翼宽度 · o.age 老去 0–1 · o.glam 美化 −1–1 · o.lit 描边发光 · o.ink 线条颜色
function face(x, y, s, a, t, o = {}) {
  if (a <= 0) return;
  const nose = o.nose || 1, age = o.age || 0, glam = o.glam || 0, lit = o.lit ?? 1, ink = o.ink || CREAM;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ink; ctx.lineWidth = 3;
  ctx.shadowColor = o.glow || `rgba(${O_RGB},.5)`; ctx.shadowBlur = 18 * lit;
  ctx.fillStyle = 'rgba(14,15,20,.97)';                                                     // 肩膀和脖子
  ctx.beginPath(); ctx.moveTo(-34, 104); ctx.lineTo(-32, 146); ctx.bezierCurveTo(-110, 158, -162, 190, -172, 250);
  ctx.lineTo(172, 250); ctx.bezierCurveTo(162, 190, 110, 158, 32, 146); ctx.lineTo(34, 104); ctx.fill(); ctx.stroke();
  const sk = ctx.createRadialGradient(-24, -10, 6, 0, 10, 150);                              // 脸
  sk.addColorStop(0, age > .01 ? `rgba(${Math.round(lerp(236, 150, age))},${Math.round(lerp(206, 140, age))},${Math.round(lerp(178, 128, age))},${.2 + .12 * glam})` : `rgba(236,206,178,${.2 + .12 * glam})`);
  sk.addColorStop(1, 'rgba(18,17,22,.97)');
  ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(0, 4, 94 * (o.narrow || 1), 122, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  const hairCol = age > .01 ? `rgb(${Math.round(lerp(26, 120, age))},${Math.round(lerp(20, 116, age))},${Math.round(lerp(16, 110, age))})` : '#1a1410';
  ctx.fillStyle = hairCol; ctx.beginPath();                                                   // 头发：左边分头，刘海扫向右边
  ctx.moveTo(-96, 18); ctx.bezierCurveTo(-112, -70, -86, -134, -30, -138);
  ctx.bezierCurveTo(40, -146, 108, -106, 102, -10); ctx.bezierCurveTo(100, 14, 96, 30, 90, 40);
  ctx.bezierCurveTo(84, -12, 60, -52, 4, -62); ctx.bezierCurveTo(-18, -66, -30, -86, -36, -108);
  ctx.bezierCurveTo(-56, -78, -78, -46, -84, 14); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.globalAlpha *= .35; ctx.lineWidth = 1.6;                                  // 发丝
  for (const k of [0, 1, 2]) { ctx.beginPath(); ctx.moveTo(-26 + k * 24, -118 + k * 4); ctx.bezierCurveTo(10 + k * 22, -110, 60 + k * 10, -80, 78 + k * 6, -28 + k * 10); ctx.stroke(); }
  ctx.restore();
  ctx.lineWidth = 4;                                                                          // 眉毛：左边挑得高一点
  ctx.beginPath(); ctx.moveTo(-60, -34); ctx.quadraticCurveTo(-40, -48, -18, -38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18, -32); ctx.quadraticCurveTo(38, -40, 58, -31); ctx.stroke();
  const er = 1 + .2 * glam;                                                                   // 眼睛
  for (const ex of [-38, 38]) {
    ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(ex, -12, 13 * er, 7.5 * er, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#17110c'; ctx.beginPath(); ctx.arc(ex + 2, -12, 5.6 * er, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + 4.2, -14.2, 1.9 * er, 0, TAU); ctx.fill();
  }
  ctx.lineWidth = 3;                                                                          // 鼻子
  ctx.beginPath(); ctx.moveTo(6, -4); ctx.quadraticCurveTo(10 + 2 * nose, 20, 12 * nose + 2, 32); ctx.quadraticCurveTo(0, 40 + 2 * nose, -12 * nose - 2, 32); ctx.stroke();
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 8 * nose, 33, 3 * nose, 0, PI); ctx.stroke(); }
  ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(-30, 66); ctx.quadraticCurveTo(-2, 82, 32, 57); ctx.stroke();   // 一边高一点的笑
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, 54); ctx.quadraticCurveTo(36, 56, 36, 62); ctx.stroke();
  ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(-54, 44, 3.4, 0, TAU); ctx.fill();             // 痣
  if (glam > 0) for (const k of [-1, 1]) {                                                    // 修图：两颊发光
    const g = ctx.createRadialGradient(k * 52, 26, 0, k * 52, 26, 30); g.addColorStop(0, `rgba(255,170,130,${.32 * glam})`); g.addColorStop(1, 'rgba(255,170,130,0)');
    ctx.fillStyle = g; ctx.fillRect(k * 52 - 32, -6, 64, 64);
  }
  if (age > 0) {                                                                              // 老去：皱纹、眼袋、法令纹、裂痕
    ctx.save(); ctx.globalAlpha *= clamp(age * 1.4); ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(40,30,24,.9)';
    for (const yy of [-70, -60, -50]) { ctx.beginPath(); ctx.moveTo(-50, yy); ctx.quadraticCurveTo(0, yy - 6, 50, yy); ctx.stroke(); }
    for (const k of [-1, 1]) {
      for (const d of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(k * 58, -12 + d); ctx.lineTo(k * 72, -16 + d * 1.6); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(k * 38, -2, 13, .2 * PI, .8 * PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(k * 18, 36); ctx.quadraticCurveTo(k * 34, 56, k * 30, 78); ctx.stroke();
    }
    ctx.restore();
    if (age > .55) {
      ctx.save(); ctx.globalAlpha *= (age - .55) / .45; ctx.strokeStyle = 'rgba(10,8,6,.95)'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-70, -96); ctx.lineTo(-40, -40); ctx.lineTo(-56, 6); ctx.lineTo(-30, 60); ctx.lineTo(-44, 110); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(60, -80); ctx.lineTo(36, -20); ctx.lineTo(62, 30); ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}
function frame(x, y, w, h, a, t, gold = 1) {                                                  // 镀金画框
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
  g.addColorStop(0, '#f4d58a'); g.addColorStop(.35, '#a8782e'); g.addColorStop(.6, '#f7e2a6'); g.addColorStop(1, '#7a5520');
  ctx.strokeStyle = g; ctx.lineWidth = 16; ctx.shadowColor = `rgba(242,190,110,${.45 * gold})`; ctx.shadowBlur = 24;
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  ctx.shadowBlur = 0; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(247,226,166,.6)'; ctx.strokeRect(x - w / 2 + 16, y - h / 2 + 16, w - 32, h - 32);
  ctx.fillStyle = '#f4d58a';
  for (const [cx, cy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.arc(x + cx * w / 2, y + cy * h / 2, 11, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function mirrorLine(x, y0, y1, a, t, k = 1) {                                                 // 镜子：一道竖着的玻璃，闪一道光
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(x - 10, 0, x + 10, 0); g.addColorStop(0, 'rgba(180,210,230,0)'); g.addColorStop(.5, `rgba(200,225,240,${.5 * k})`); g.addColorStop(1, 'rgba(180,210,230,0)');
  ctx.fillStyle = g; ctx.fillRect(x - 10, y0, 20, y1 - y0);
  const sy = y0 + ((t * .35) % 1) * (y1 - y0);
  const s = ctx.createLinearGradient(0, sy - 80, 0, sy + 80); s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(.5, `rgba(255,255,255,${.7 * k})`); s.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = s; ctx.fillRect(x - 2, sy - 80, 4, 160);
  ctx.restore();
}
function heart(x, y, r, a, col) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(r / 10, r / 10); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-14, -2, -8, -14, 0, -6); ctx.bezierCurveTo(8, -14, 14, -2, 0, 8); ctx.fill(); ctx.restore();
}
function phone(x, y, a, lab) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(20,22,30,.95)';
  ctx.beginPath(); ctx.roundRect(x - 22, y - 40, 44, 80, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x, y - 28, 4, 0, TAU); ctx.fill();
  ctx.restore();
  if (lab) text(lab, x, y + 66, { font: SERIF, size: 30, weight: 900, align: 'center', color: CREAM, alpha: a });
}

// ======================================================================== ① 照片测试（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('同一张脸，两张照片：', 540, 452, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('你更喜欢哪一张？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const rev = E.out(prog(t, Q.REVEAL, Q.REVEAL + .5)), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  const glint = sstep(10.8, 11.4, t);
  mirrorLine(540, 660, 1150, 1, t, .5 + .5 * glint);
  face(300, 860, .92, 1, t, { lit: .6 + .4 * sstep(13.6, 14.2, t), glow: `rgba(${T_RGB},.5)` });
  face(780, 860, .92, 1, t, { flip: true, lit: .6 + .4 * rev, glow: `rgba(${O_RGB},.55)` });
  const la = 1 - sstep(10.6, 11.0, t);
  pill('原图', 300, 662, la, { size: 26 }); pill('翻转', 780, 662, la, { size: 26 });
  pill('别人眼里的你', 300, 662, sstep(13.6, 14.1, t), { size: 26, stroke: `rgba(${T_RGB},.8)`, color: TEAL });
  pill('镜子里的你', 780, 662, sstep(10.8, 11.3, t), { size: 26, stroke: `rgba(${O_RGB},.8)`, color: '#ffd2a0' });
  if (rev > 0) {
    heart(780, 1160, 16 * (1 + .25 * (1 - prog(t, Q.REVEAL, Q.REVEAL + .6))), rev, ORANGE);
    text('你', 780, 1214, { font: SERIF, size: 40, weight: 900, align: 'center', color: ORANGE, alpha: rev });
    const r2 = E.out(prog(t, Q.REVEAL + .45, Q.REVEAL + .95));
    heart(300, 1160, 16 * (1 + .25 * (1 - prog(t, Q.REVEAL + .45, Q.REVEAL + 1.05))), r2, TEAL);
    text('朋友', 300, 1214, { font: SERIF, size: 40, weight: 900, align: 'center', color: TEAL, alpha: r2 });
  }
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t);
  [['A · 都选原图', 200], ['B · 都选翻转', 540], ['C · 不一样', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 曝光效应 · 自拍的距离
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('唯美主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('AESTHETICISM', 540, 1046, { size: 42, weight: 600, font: LAT, ls: 20, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ①', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneExposure(t) {
  if (t < 19.7 || t > HALO + .2) return;
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.1, t));                       // 镜子里看过无数次的自己
  if (A1 > 0) {
    for (let k = 4; k >= 1; k--) {
      const al = A1 * (.07 + .04 * (4 - k)) * sstep(19.9 + k * .15, 20.5 + k * .15, t), sc = .86 + k * .07 + .02 * Math.sin(t * 1.5 + k);
      face(540, 880 + k * 10, sc, al, t, { flip: true, lit: 0, ink: '#c9b89a' });
    }
    ctx.save(); ctx.globalAlpha = A1; ctx.strokeStyle = 'rgba(200,225,240,.55)'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(200,225,240,.5)'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.ellipse(540, 900, 230, 300, 0, 0, TAU); ctx.stroke(); ctx.restore();
    face(540, 880, .86, A1, t, { flip: true, lit: .9 });
    const sa = A1 * sstep(21.3, 22.0, t);
    face(880, 1150, .4, sa * .85, t, { lit: .3, ink: '#b8c0cc', glow: `rgba(${T_RGB},.4)` });
    if (sa > 0) text('照片里的你：有点陌生', 860, 1290, { font: SANS, size: 26, weight: 500, align: 'center', color: '#b8c0cc', alpha: sa });
  }
  const A2 = sstep(24.0, 24.5, t) * (1 - sstep(27.3, 27.8, t));                        // 手机越拿越近，鼻子越来越宽
  if (A2 > 0) {
    const near = E.io(prog(t, 24.6, 27.0)), px = lerp(860, 300, near);
    face(540, 860, .9, A2, t, { nose: 1 + .3 * near, narrow: 1 - .05 * near, lit: .7 });
    seg(200, 1240, 880, 1240, 'rgba(236,230,218,.3)', 2, A2);
    text('1.5 米', 880, 1290, { font: SANS, size: 24, align: 'center', color: DIM, alpha: A2 });
    text('30 厘米', 200, 1290, { font: SANS, size: 24, align: 'center', color: DIM, alpha: A2 });
    phone(px, 1186, A2);
  }
  const A3 = sstep(27.7, 28.3, t) * (1 - sstep(HALO - .7, HALO - .1, t));             // 并排比一比
  if (A3 > 0) {
    const same = sstep(31.6, 33.0, t);
    face(300, 860, .78, A3, t, { nose: 1.3 - .3 * same, narrow: .95 + .05 * same, lit: .5 + .5 * same });
    face(780, 860, .78, A3, t, { lit: .5 + .5 * same });
    phone(300, 640, A3 * (1 - same), '30 厘米'); phone(780, 640, A3 * (1 - same), '1.5 米');
    const wa = A3 * sstep(28.6, 29.2, t) * (1 - same), bk = E.outExpo(prog(t, 28.6, 29.6));
    if (wa > 0) {
      const bar = (cx, w, col, rgb) => { ctx.save(); ctx.globalAlpha = wa; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.beginPath(); ctx.roundRect(cx - w / 2, 1112, w, 22, 8); ctx.fill(); ctx.restore(); };
      bar(300, 150 * 1.3 * bk, ORANGE, O_RGB); bar(780, 150 * bk, CREAM, C_RGB);
      text('鼻翼宽度', 540, 1123, { font: SANS, size: 24, align: 'center', color: DIM, alpha: wa });
      text('+30%', 300, 1190, { font: SERIF, size: 48, weight: 900, align: 'center', color: ORANGE, alpha: wa, glow: `rgba(${O_RGB},.5)`, blur: 14 });
    }
    if (same > 0) text('= 同一个你', 540, 1200, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#ffd2a0', alpha: A3 * same, glow: `rgba(${O_RGB},.5)`, blur: 16 });
  }
}

// ======================================================================== ③ 颜值即正义：一朵向日葵（唯美主义的标志），一个光环
let ORBIT = [];
function sunflower(x, y, r, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(t * .08);
  ctx.fillStyle = '#e8b04a'; ctx.shadowColor = 'rgba(242,190,90,.7)'; ctx.shadowBlur = 22;
  for (let i = 0; i < 18; i++) { ctx.save(); ctx.rotate(i / 18 * TAU); ctx.beginPath(); ctx.ellipse(r * .78, 0, r * .42, r * .14, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.shadowBlur = 0; ctx.fillStyle = '#3a2412'; ctx.beginPath(); ctx.arc(0, 0, r * .48, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(242,190,90,.5)';
  for (let i = 0; i < 60; i++) { const an = i * 2.39996, rr = Math.sqrt(i / 60) * r * .44; ctx.beginPath(); ctx.arc(Math.cos(an) * rr, Math.sin(an) * rr, 2.2, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function sceneHalo(t) {
  if (t < HALO - .3 || t > DORIAN + .2) return;
  const A = sstep(HALO - .1, HALO + .5, t) * (1 - sstep(DORIAN - .6, DORIAN - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - HALO) / BEAT) % 1);                                         // 每拍一下
  const A1 = A * (1 - sstep(44.4, 45.0, t));
  if (A1 > 0) {
    frame(540, 860, 420, 520, A1 * sstep(37.6, 38.2, t), t);
    sunflower(540, 860, 120 * (1 + .03 * bk), A1 * sstep(37.9, 38.6, t), t);
    typeText('为艺术而艺术', 540, 1196, { ...big, size: 40, weight: 700, color: '#f4d58a' }, prog(t, 38.4, 39.4), A1 * (1 - sstep(40.6, 41.0, t)));
    const ja = A1 * sstep(40.9, 41.3, t);
    if (ja > 0) {
      ctx.save(); ctx.translate(540, 1196); ctx.scale(1 + .06 * bk, 1 + .06 * bk);
      text('颜值即正义', 0, 0, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: ja, glow: `rgba(${O_RGB},.6)`, blur: 26 });
      ctx.restore();
    }
  }
  const A2 = A * sstep(44.9, 45.5, t);                                                    // 光环效应
  if (A2 > 0) {
    const hk = E.outExpo(prog(t, 45.0, 45.9));
    face(540, 930, .9, A2, t, { glam: .6, lit: 1 });
    ctx.save(); ctx.globalAlpha = A2 * hk; ctx.strokeStyle = '#f7d27a'; ctx.lineWidth = 9; ctx.shadowColor = 'rgba(247,210,122,.9)'; ctx.shadowBlur = 30;
    ctx.beginPath(); ctx.ellipse(540, 760 - 20 * (1 - hk), 130, 30, 0, 0, TAU); ctx.stroke(); ctx.restore();
    ORBIT.forEach((w, i) => {
      const k = E.outExpo(prog(t, 46.0 + i * .5, 46.8 + i * .5)); if (k <= 0) return;
      const x = lerp(540, w.x, k) + Math.sin(t * 1.1 + i) * 6, y = lerp(760, w.y, k) + Math.cos(t * .9 + i) * 6;
      pill(w.s, x, y, A2 * k, { size: 28, stroke: 'rgba(247,210,122,.7)', color: '#f7d27a' });
    });
    pill('光环效应', 540, 1300, A2 * sstep(48.9, 49.4, t), { size: 32, stroke: `rgba(${O_RGB},.8)`, color: '#ffd2a0', glow: `rgba(${O_RGB},.4)` });
  }
}

// ======================================================================== ④ 道林·格雷：人不老，画像替他老
function sceneDorian(t) {
  if (t < DORIAN - .3 || t > REAL + .2) return;
  const A = sstep(DORIAN - .1, DORIAN + .5, t) * (1 - sstep(REAL - .7, REAL - .1, t));
  if (A <= 0) return;
  const age = E.io(prog(t, 57.9, 63.2));
  typeText('《道林·格雷的画像》', 540, 620, { ...big, size: 46, weight: 700 }, prog(t, 53.8, 54.8), A);
  face(290, 900, .78, A * sstep(54.2, 54.8, t), t, { lit: 1, glam: .3 });
  frame(780, 900, 330, 430, A * sstep(54.8, 55.4, t), t, 1 - .6 * age);
  ctx.save(); ctx.beginPath(); ctx.rect(780 - 149, 900 - 199, 298, 398); ctx.clip();
  ctx.fillStyle = `rgba(${Math.round(lerp(40, 22, age))},${Math.round(lerp(34, 20, age))},${Math.round(lerp(30, 18, age))},1)`; ctx.globalAlpha = A * sstep(54.8, 55.4, t); ctx.fillRect(631, 701, 298, 398);
  face(780, 930, .7, A * sstep(55.0, 55.6, t), t, { age, lit: .4 * (1 - age), ink: age > .3 ? `rgb(${Math.round(lerp(236, 140, age))},${Math.round(lerp(230, 132, age))},${Math.round(lerp(218, 120, age))})` : CREAM });
  ctx.restore();
  text('道林', 290, 1200, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(55.0, 55.6, t) });
  text('画像', 780, 1200, { font: SERIF, size: 34, weight: 900, align: 'center', color: age > .5 ? '#8a93a3' : CREAM, alpha: A * sstep(55.4, 56.0, t) });
}

// ======================================================================== ⑤ 真实的你：心里的自己被悄悄美化过
function sceneReal(t) {
  if (t < REAL - .2 || t > CLIMAX + .3) return;
  const A = sstep(REAL + .2, REAL + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const A1 = A * (1 - sstep(67.4, 68.0, t));
  if (A1 > 0) {
    const gl = E.io(prog(t, 64.6, 67.0));
    face(540, 880, .95, A1, t, { glam: gl, lit: .5 + .5 * gl });
    for (let i = 0; i < 12; i++) { const r = mulberry(2400 + i), x = 540 + (r() - .5) * 360, y = 820 + (r() - .5) * 300; glow(x, y + Math.sin(t * 2 + i) * 6, 2 + 2 * r(), '255,240,220', A1 * gl * (.5 + .5 * Math.sin(t * 3 + i * 1.7)), 3); }
    text('心里的你', 540, 1210, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A1 * sstep(65.2, 65.8, t) });
  }
  const A2 = A * sstep(67.9, 68.5, t);                                                    // 一排从“更丑”到“更好看”的你
  if (A2 > 0) {
    const G = [-.6, -.3, 0, .45, .9], xs = [150, 345, 540, 735, 930];
    const pick = sstep(69.0, 69.8, t), trueK = sstep(72.2, 72.9, t);
    G.forEach((g, i) => {
      const k = sstep(68.0 + i * .12, 68.4 + i * .12, t), hi = i === 3 ? pick * (1 - trueK) : i === 2 ? trueK : 0;
      face(xs[i], 900, .44, A2 * k * (.55 + .45 * hi + (g < 0 ? -.1 : 0)), t, { glam: g, lit: hi, glow: i === 2 ? `rgba(${T_RGB},.7)` : `rgba(${O_RGB},.6)` });
    });
    text('更丑', 150, 1060, { font: SANS, size: 24, align: 'center', color: DIM, alpha: A2 });
    text('原图', 540, 1060, { font: SANS, size: 24, align: 'center', color: trueK > .5 ? TEAL : DIM, alpha: A2 });
    text('更好看', 930, 1060, { font: SANS, size: 24, align: 'center', color: DIM, alpha: A2 });
    const cx = lerp(540, 735, E.io(pick)) * (1 - trueK) + 540 * trueK;
    ctx.save(); ctx.globalAlpha = A2 * sstep(68.6, 69.0, t); ctx.strokeStyle = trueK > .5 ? TEAL : ORANGE; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.lineDashOffset = -t * 30;
    ctx.beginPath(); ctx.roundRect(cx - 88, 790, 176, 230, 18); ctx.stroke(); ctx.restore();
    text('“这才是我”', 735, 740, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: A2 * pick * (1 - trueK) });
    text('真实的你', 540, 740, { font: SERIF, size: 36, weight: 900, align: 'center', color: TEAL, alpha: A2 * trueK, glow: `rgba(${T_RGB},.5)`, blur: 14 });
  }
}

// ======================================================================== ⑥ 爱自己：两张脸合成一张，朋友们的心飘过来
let HEARTS = [];
function sceneLove(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1060, 760);
  const m = E.io(prog(t, CLIMAX + .4, 85.0));                                              // 原图和镜像慢慢走到一起
  mirrorLine(540, 820, 1300, A * (1 - m), t, .6);
  face(lerp(330, 540, m), 1010, .82, A * (1 - .5 * m), t, { lit: .8, glow: `rgba(${T_RGB},.5)` });
  face(lerp(750, 540, m), 1010, .82, A * (1 - m), t, { flip: true, lit: .6 });
  if (m > .5) face(540, 1010, .82, A * (m - .5) * 2, t, { lit: 1 + .4 * sstep(FINAL, FINAL + 1, t) });
  HEARTS.forEach(h => {                                                                     // 朋友们的心
    const k = prog(t, h.t0, h.t0 + 3.2); if (k <= 0 || k >= 1) return;
    const tx = 540 + Math.cos(h.an) * 250, ty = 1000 + Math.sin(h.an) * 190, x = lerp(h.x, tx, E.out(k)), y = lerp(1330, ty, E.out(k));
    heart(x, y, h.r, A * Math.sin(PI * k) * .9, h.teal ? TEAL : '#ffb28a');
  });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「爱自己，', 540, 540, { ...big, size: 72, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.0), qa);
  typeText('是一场终身浪漫的开始。', 540, 650, { ...big, size: 64, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.1, CLIMAX + 2.2), qa);
  typeText('—— 王尔德《理想丈夫》', 540, 748, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.0), qa);
  typeText('所以，下次', 540, 560, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('别急着删那张照片。', 540, 666, { ...big, size: 72, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneExposure(t); sceneHalo(t); sceneDorian(t); sceneReal(t); sceneLove(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2) || (T > 44.8 && T < 46.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .12 * win(T, 44.9, 52.9, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1977', 'Mita, Dermer & Knight · JPSP', 8.2, 15.6, T);
  stamp('1968', 'Zajonc · JPSP', 16.3, 23.7, T);
  stamp('2018', 'Ward et al. · JAMA Facial Plast Surg', 27.7, 35.3, T);
  stamp('1972', 'Dion, Berscheid & Walster · JPSP', 44.9, 52.9, T);
  stamp('1890', 'Wilde · The Picture of Dorian Gray', 53.6, 63.4, T);
  stamp('2008', 'Epley & Whitchurch · PSPB', 67.9, 75.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(24);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  ORBIT = [['善良', 210, 790], ['聪明', 870, 790], ['可信', 190, 1040], ['更会成功', 880, 1040]].map(([s, x, y]) => ({ s, x, y }));
  const rh = mulberry(241);
  HEARTS = Array.from({ length: 22 }, (_, i) => ({ x: 140 + rh() * 800, an: PI + (rh() - .5) * .3 + (i % 2 ? -1 : 1) * (.5 + rh() * 1.2), r: 9 + rh() * 9, t0: CLIMAX + 4.4 + i * .5 + rh() * .3, teal: rh() < .6 }));
}

// ======================================================================== 音效提示表（音高都在升 C 小调里，最后一个和弦是升 C 大调）
const NOTE = { Cs5: 554.37, E5: 659.26, F5: 698.46, Gs5: 830.61, Cs6: 1108.73, E6: 1318.51, F6: 1396.91, Gs6: 1661.22, Cs7: 2217.46, E7: 2637.02, F7: 2793.83 };
const CM_SHIM = [NOTE.E7, NOTE.Gs6, NOTE.Cs7, NOTE.E6, NOTE.Cs6], CMAJ_SHIM = [NOTE.F7, NOTE.Gs6, NOTE.Cs7, NOTE.F6, NOTE.Cs6], CM_SWELL = [138.59, 207.65, 277.18, 329.63, 415.30];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.Cs5, NOTE.E5, NOTE.Gs5], gain: .24 }], [Q.REVEAL + .05, 'tink', { f: NOTE.Gs6, gain: .2 }], [Q.REVEAL + .5, 'tink', { f: NOTE.E6, gain: .18 }]);
  c.push([10.8, 'shimmer', { f: CM_SHIM, gain: .16 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: CM_SHIM, gain: .28 }]);
  c.push([20.0, 'swish', { gain: .2 }], [24.6, 'whoosh', { dur: 2.4, gain: .14 }], [27.7, 'click', { gain: .32 }], [27.78, 'click', { gain: .22 }], [31.6, 'chord', { f: [NOTE.Cs5, NOTE.E5, NOTE.Gs5], gain: .12 }]);
  c.push([HALO, 'whoosh', { dur: .5, gain: .25 }], [37.9, 'shimmer', { f: CM_SHIM, gain: .16 }], [45.0, 'bar', { f0: 415, f1: 831, dur: .9, gain: .26 }], [45.1, 'shimmer', { f: CM_SHIM, gain: .24 }]);
  for (let i = 0; i < 4; i++) c.push([46.0 + i * .5, 'tink', { f: [NOTE.Cs6, NOTE.E6, NOTE.Gs6, NOTE.Cs7][i], gain: .12 }]);
  c.push([DORIAN, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'dust', { dur: 5.3, gain: .16 }], [60.6, 'crack', { gain: .2 }]);
  c.push([64.6, 'shimmer', { f: CM_SHIM, gain: .14 }], [69.0, 'tick', { gain: .2 }], [72.3, 'chord', { f: [NOTE.Cs5, NOTE.E5, NOTE.Gs5], gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: CM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: CM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 138.59, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: CMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Cs5, NOTE.F5, NOTE.Gs5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
