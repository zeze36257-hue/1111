// ======================================================================== No.61 印象主义：第一印象，会改写你看到的一切吗？
// 第七季·人和人之间的主义 ⑧。开头是一道选择题：同一个老师、同一口口音，一段和蔼、一段冷淡，谁更喜欢他的口音？（Nisbett & Wilson, 1977）
// 音乐：原创配乐（music.py，升 F 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。每小节先一个长音，后面的短音只能跟着它的颜色走。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 六个词（每拍一个鼓点） · 53.33 好与坏（紧张） · 64.0 换个人（只剩钢琴） · 80.0 高潮：子羽 · 96.0 升 F 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), WORDS = BT(56), TWIN = BT(80), SWAP = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['口音', 0, LIFT], ['光环', LIFT, WORDS], ['六个词', WORDS, TWIN], ['好与坏', TWIN, SWAP], ['换个人', SWAP, CLIMAX], ['子羽', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.61';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '同一个老师、同一口口音，录了两段视频：'],
  [4.1, 7.6, '一段和蔼，一段冷淡。谁更喜欢他的口音？先猜一个。'],
  [8.2, 10.4, '答案是 C：看和蔼那段的。'],
  [10.8, 13.3, '连他的长相、小动作，都跟着变顺眼了；'],
  [13.6, 15.7, '而学生们，坚决否认自己受了影响。'],
  [16.3, 19.6, '心理学叫它「光环效应」：'],
  [19.9, 23.7, '一个整体印象，会给所有细节都镀上一层颜色。'],
  [24.0, 27.4, '更早的一个实验，只在介绍里改了一个词：'],
  [27.7, 31.3, '“热情”换成“冷淡”，同一堂课的评价就变了。'],
  [31.6, 35.3, '这就是「印象主义」：先有印象，再看细节。'],
  [37.6, 40.6, '心理学家阿施做过一个更简单的测试：'],
  [40.9, 44.6, '聪明、勤奋、冲动、爱挑剔、固执、嫉妒；'],
  [44.9, 48.6, '同样六个词，倒过来念，印象就差了一截。'],
  [48.9, 52.9, '先听到的，决定了后面怎么听。'],
  [53.6, 57.6, '所以，第一印象一旦定了：'],
  [57.9, 60.6, '印象好的人，缺点也像优点；'],
  [60.8, 63.4, '印象差的人，优点也像缺点。'],
  [64.3, 67.6, '下次对一个人下结论之前，'],
  [67.9, 71.9, '可以把“印象”先放一放，单独看这一件事：'],
  [72.2, 75.9, '同样的事，换个人做，我还会这么想吗？'],
  [76.3, 79.6, '两千多年前，孔子自己也看走过眼：'],
  [84.9, 88.6, '连孔子，也被第一印象骗过；'],
  [88.9, 92.6, '他做的是：多看一眼，再改过来。'],
  [98.4, 103.0, '评论区：有没有谁，你对他的第一印象完全错了？'],
];
const BIGLINES = [
  [80.2, 92.6, '「以貌取人，失之子羽。」—— 孔子'],
  [93.4, 98.0, '印象是开始，不是结论。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [WORDS - .5, .2], [WORDS, .06], [SWAP, .06],
  [SWAP + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、屏幕、脸、光环、词卡、点彩画
const PINK = '#f0a0a0', GOLD = '#ffd2a0', TEALC = '#7fe3d3', WARMC = '#ffb36b', GREYP = '#9aa3b2', COOL = '#8fb8e8';
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function face(x, y, r, a, k, col) {                                                                      // k = 1 和蔼的笑，k = -.2 冷淡
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = 'rgba(16,17,23,.95)'; ctx.lineWidth = Math.max(3, r * .05);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = col;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(x + sx * r * .36, y - r * .18, r * .09, 0, TAU); ctx.fill(); }
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r * .4, y + r * .32); ctx.quadraticCurveTo(x, y + r * .32 + k * r * .38, x + r * .4, y + r * .32); ctx.stroke(); ctx.restore();
}
function screen(x, y, w, h, a, col) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(20,21,28,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(195,202,214,.5)'; ctx.fillRect(x - 30, y + h / 2, 60, 14); ctx.fillRect(x - 60, y + h / 2 + 14, 120, 6); ctx.restore();
}
function wave(x, y, w, a, col, t) {                                                                      // 口音：一小段声波
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 40; i++) { const xx = x - w / 2 + w * i / 40, yy = y + 10 * Math.sin(i * .9 + t * 6) * Math.sin(PI * i / 40); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
  ctx.stroke(); ctx.restore();
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}

// ======================================================================== ① 口音（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('同一个老师：一段和蔼，一段冷淡', 540, 452, { ...big, size: 40, weight: 700 }, 1, 1 - qOut);
  typeText('谁更喜欢他的口音？', 540, 560, { ...big, size: 76, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const up = E.io(prog(t, Q.REVEAL, Q.REVEAL + .8)), sy = lerp(980, 860, up), ss = 1 - .25 * up;
  screen(310, sy, 360 * ss, 260 * ss, 1, WARMC); screen(770, sy, 360 * ss, 260 * ss, 1, COOL);
  face(310, sy - 20 * ss, 64 * ss, 1, 1, WARMC); face(770, sy - 20 * ss, 64 * ss, 1, -.15, COOL);
  wave(310, sy + 80 * ss, 140 * ss, 1 - up, WARMC, t); wave(770, sy + 80 * ss, 140 * ss, 1 - up, COOL, t);
  text('和蔼', 310, sy + 170 * ss, { font: SERIF, size: 32, weight: 900, align: 'center', color: WARMC, alpha: 1 });
  text('冷淡', 770, sy + 170 * ss, { font: SERIF, size: 32, weight: 900, align: 'center', color: COOL, alpha: 1 });
  const C = sstep(Q.REVEAL + .3, Q.REVEAL + .7, t);
  if (C > 0) {
    const base = 1230, k = E.out(prog(t, Q.REVEAL + .4, Q.REVEAL + 1.4)), more = sstep(10.9, 11.3, t);
    const rows = [['口音', 0], ['长相', 1], ['小动作', 2]];
    rows.forEach(([lab, i]) => {
      const a = i === 0 ? C : C * more, x = 260 + i * 280, kk = i === 0 ? k : E.out(prog(t, 11.0 + i * .3, 12.0 + i * .3));
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = WARMC; ctx.fillRect(x - 70, base - 190 * kk, 60, 190 * kk); ctx.fillStyle = COOL; ctx.fillRect(x + 10, base - 80 * kk, 60, 80 * kk); ctx.restore();
      text(lab, x, base + 40, { font: SANS, size: 26, align: 'center', color: CREAM, alpha: a });
    });
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, base); ctx.lineTo(930, base); ctx.stroke(); ctx.restore();
    text('评价（示意）', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: C });
  }
  pill('我才没被影响', 770, 700, sstep(13.7, 14.1, t), { size: 28, stroke: 'rgba(143,184,232,.8)', color: COOL });
  text('C · 看和蔼那段的', 540, 560, { font: SERIF, size: 66, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('长相、小动作，也跟着变', 540, 560, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t) * (1 - sstep(13.5, 13.9, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('却都说：没受影响', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: COOL, alpha: sstep(13.7, 14.2, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 一样', 200], ['B · 冷淡组', 540], ['C · 和蔼组', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 光环
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('印象主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('THE HALO EFFECT', 540, 1046, { size: 40, weight: 600, font: LAT, ls: 16, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ⑧', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneHalo(t) {
  if (t < 19.7 || t > WORDS + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(WORDS - .6, WORDS - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('光环效应', 540, 640, { font: SERIF, size: 58, weight: 900, align: 'center', color: GOLD, alpha: D * (1 - sstep(23.8, 24.2, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    text('只改了一个词', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('评价，跟着变了', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: PINK, alpha: D * sstep(27.8, 28.3, t) });
    const H = D * (1 - sstep(23.8, 24.2, t));
    if (H > 0) {                                                                                           // 头顶一圈光，光洒到每个细节上
      person(540, 1130, 1.2, H, GOLD);
      ctx.save(); ctx.globalAlpha = H; ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.ellipse(540, 1130 - 84 * 1.2 - 40, 50, 14, 0, 0, TAU); ctx.stroke(); ctx.restore();
      [['声音', 260, 900], ['衣服', 820, 900], ['字迹', 230, 1150], ['笑容', 850, 1150]].forEach(([s, x, y], i) => {
        const k = sstep(20.4 + i * .5, 20.9 + i * .5, t);
        drawOn(() => { ctx.moveTo(540, 990); ctx.lineTo(x + (540 - x) * .25, y + (990 - y) * .25); }, 300, k, GOLD, 2, H * .6, GOLD);
        pill(s, x, y, H * sstep(20.2 + i * .5, 20.5 + i * .5, t), { size: 28, stroke: mixc('#6f7786', GOLD, k), color: mixc(GREYP, GOLD, k) });
      });
    }
    const B = D * sstep(24.1, 24.5, t);
    if (B > 0) {                                                                                           // 一张介绍卡，只有一个词在翻
      ctx.save(); ctx.globalAlpha = B; ctx.fillStyle = 'rgba(236,230,218,.94)'; ctx.fillRect(290, 830, 500, 330); ctx.restore();
      text('客座讲师介绍', 540, 890, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#1a1b22', alpha: B });
      ctx.save(); ctx.globalAlpha = B; ctx.fillStyle = 'rgba(26,27,34,.35)'; for (let i = 0; i < 2; i++) ctx.fillRect(330, 940 + i * 40, 420, 10); ctx.fillRect(330, 1100, 300, 10); ctx.restore();
      text('为人：', 380, 1046, { font: SERIF, size: 36, weight: 900, color: '#1a1b22', alpha: B });
      const flip = Math.floor((t - 24.6) / 1.1) % 2, sc = Math.abs(Math.cos(((t - 24.6) / 1.1) * PI));
      ctx.save(); ctx.translate(560, 1044); ctx.scale(1, t > 24.6 ? Math.max(.08, sc) : 1);
      text(t > 24.6 && flip ? '冷淡' : '热情', 0, 0, { font: SERIF, size: 44, weight: 900, align: 'center', color: t > 24.6 && flip ? '#2a5a9a' : '#c2410c', alpha: B }); ctx.restore();
      text('其余一字不差', 540, 1210, { font: SANS, size: 26, align: 'center', color: DIM, alpha: B * sstep(25.4, 25.8, t) });
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('印象主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('先有印象，再看细节', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 六个词
function sceneWords(t) {
  if (t < WORDS - .3 || t > TWIN + .2) return;
  const A = sstep(WORDS - .1, WORDS + .5, t) * (1 - sstep(TWIN - .6, TWIN - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - WORDS) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('阿施的测试', 37.7, 40.6, CREAM);
  hd('同样六个词', 41.0, 48.6, CREAM);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('先听到的，决定后面', 0, 0, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(49.0, 49.5, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  const W = ['聪明', '勤奋', '冲动', '爱挑剔', '固执', '嫉妒'];
  const row = (y, order, t0, col, meter, lab) => {
    const a = A * sstep(t0, t0 + .3, t);
    if (a <= 0) return;
    order.forEach((wi, j) => pill(W[wi], 170 + j * 148, y, a * sstep(t0 + j * BEAT, t0 + j * BEAT + .2, t), { size: 24, stroke: j < 2 ? col : 'rgba(255,255,255,.2)', color: j < 2 ? col : CREAM }));
    const m = E.out(prog(t, t0 + 6 * BEAT, t0 + 6 * BEAT + 1));
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(240, y + 50, 600, 18); ctx.fillStyle = col; ctx.fillRect(240, y + 50, 600 * meter * m, 18); ctx.restore();
    text(lab, 540, y + 100, { font: SANS, size: 24, align: 'center', color: col, alpha: a * m });
  };
  row(880, [0, 1, 2, 3, 4, 5], 41.0, WARMC, .72, '印象：还不错');
  row(1120, [5, 4, 3, 2, 1, 0], 45.0, COOL, .34, '印象：差了一截');
}

// ======================================================================== ④ 好与坏
function sceneTwin(t) {
  if (t < TWIN - .3 || t > SWAP + .2) return;
  const A = sstep(TWIN - .1, TWIN + .5, t) * (1 - sstep(SWAP - .7, SWAP - .1, t));
  if (A <= 0) return;
  text('第一印象一旦定了', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('缺点也像优点', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('优点也像缺点', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: COOL, alpha: A * sstep(60.9, 61.4, t) });
  const L = 300, R = 780;
  person(L, 1000, 1.0, A, GOLD); person(R, 1000, 1.0, A, COOL);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 16; ctx.beginPath(); ctx.ellipse(L, 1000 - 84 - 40, 40, 11, 0, 0, TAU); ctx.stroke(); ctx.restore();
  text('印象好', L, 1080, { font: SANS, size: 26, align: 'center', color: GOLD, alpha: A }); text('印象差', R, 1080, { font: SANS, size: 26, align: 'center', color: COOL, alpha: A });
  const e1 = A * sstep(58.0, 58.4, t), e2 = A * sstep(60.9, 61.3, t);
  pill('迟到了', 540, 1170, e1 * (1 - sstep(60.6, 60.9, t)), { size: 30 });
  text('→ “有个性”', L, 1250, { font: SERIF, size: 32, weight: 900, align: 'center', color: GOLD, alpha: e1 * sstep(58.6, 59.0, t) * (1 - sstep(60.6, 60.9, t)) });
  text('→ “不靠谱”', R, 1250, { font: SERIF, size: 32, weight: 900, align: 'center', color: COOL, alpha: e1 * sstep(59.2, 59.6, t) * (1 - sstep(60.6, 60.9, t)) });
  pill('加班到很晚', 540, 1170, e2, { size: 30 });
  text('→ “敬业”', L, 1250, { font: SERIF, size: 32, weight: 900, align: 'center', color: GOLD, alpha: e2 * sstep(61.4, 61.8, t) });
  text('→ “装样子”', R, 1250, { font: SERIF, size: 32, weight: 900, align: 'center', color: COOL, alpha: e2 * sstep(62.0, 62.4, t) });
}

// ======================================================================== ⑤ 换个人
function sceneSwap(t) {
  if (t < SWAP - .2 || t > CLIMAX + .3) return;
  const A = sstep(SWAP + .2, SWAP + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('下结论之前', 64.5, 67.6, CREAM);
  hd('把印象，先放一放', 67.9, 71.9, TEALC, `rgba(${T_RGB},.4)`);
  hd('换个人做，我还会这么想吗？', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('两千多年前：', 76.4, 0, CREAM);
  const card = A * sstep(64.6, 65.0, t);
  ctx.save(); ctx.globalAlpha = card; ctx.fillStyle = 'rgba(236,230,218,.94)'; ctx.fillRect(400, 1000, 280, 180); ctx.restore();
  text('这件事', 540, 1070, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#1a1b22', alpha: card });
  ctx.save(); ctx.globalAlpha = card; ctx.fillStyle = 'rgba(26,27,34,.35)'; ctx.fillRect(440, 1110, 200, 10); ctx.fillRect(440, 1140, 140, 10); ctx.restore();
  const lift = E.io(prog(t, 68.0, 69.4));                                                                 // 头顶的光环/乌云被拿开，只看那件事
  const who = Math.floor((t - 72.4) / 1.1) % 3, cols = [GOLD, COOL, TEALC];
  const pc = t > 72.4 ? cols[(who + 3) % 3] : GOLD;
  person(540, 960, 1.0, A, pc);
  ctx.save(); ctx.globalAlpha = A * (1 - lift); ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(540, 960 - 84 - 40 - 80 * lift, 40, 11, 0, 0, TAU); ctx.stroke(); ctx.restore();
  if (t > 72.4) { const sw = ((t - 72.4) / 1.1) % 1; ctx.save(); ctx.globalAlpha = A * (1 - sstep(.0, .25, sw) * 0) * .6; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(540, 900, 90, -PI / 2, -PI / 2 + TAU * sw); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  text('🔍', 700, 1050, { font: SANS, size: 48, align: 'center', color: CREAM, alpha: A * sstep(68.6, 69.0, t) });
}

// ======================================================================== ⑥ 子羽：点彩画慢慢看清
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), cx = 540, cy = 1060;
  warmth(A * (1 + .5 * fin), cx, cy, 760);
  const clear = E.io(prog(t, CLIMAX + 2, FINAL + 1));                                                     // 一幅点彩画：一开始是一团模糊的颜色点，慢慢聚成一个清楚的人
  const r = mulberry(6101);
  for (let i = 0; i < 220; i++) {
    const u = r(), v = r(), ang = r() * TAU, rad = r();
    let tx, ty;
    if (u < .25) { tx = cx + 26 * Math.sqrt(rad) * Math.cos(ang) * 2.2; ty = cy - 150 + 26 * Math.sqrt(rad) * Math.sin(ang) * 2.2; }
    else { const px = (v - .5) * 200, py = -90 + rad * 230; if (Math.abs(px) > 100 - 30 * Math.max(0, (-py - 60) / 40)) continue; tx = cx + px; ty = cy + py; }
    const sx = cx + (r() - .5) * 760, sy = cy + (r() - .5) * 460;
    const x = lerp(sx, tx, clear), y = lerp(sy, ty, clear), col = mixc(r() < .5 ? COOL : PINK, GOLD, clear * .8 + .2 * r());
    glow(x, y, 5 + 3 * (1 - clear), col.replace('#', '').match(/../g).map(h => parseInt(h, 16)).join(','), A * (.55 + .35 * clear), 2);
  }
  person(cx, cy + 140, 1.4, A * sstep(FINAL - 1, FINAL + .8, t), GOLD);
  if (fin > 0) for (let i = 0; i < 24; i++) { const rr = mulberry(5400 + i), x = 380 + rr() * 320, vv = 30 + rr() * 40, p = ((t - FINAL) * vv / 420 + rr()) % 1; glow(x + 16 * Math.sin(t + i), 1250 - p * 420, 2 + 2 * rr(), O_RGB, fin * (1 - p) * .8, 3); }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('以貌取人，', 540, 440, { ...big, size: 64, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.1), qa);
  typeText('失之子羽。', 540, 552, { ...big, size: 76, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.3, CLIMAX + 2.2), qa);
  typeText('—— 孔子（《史记·仲尼弟子列传》）', 540, 636, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.0), qa);
  typeText('印象是开始，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('不是结论。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneHalo(t); sceneWords(t); sceneTwin(t); sceneSwap(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1977', 'Nisbett & Wilson · J Pers Soc Psychol', 8.2, 23.7, T);
  stamp('1950', 'Kelley · J Pers', 24.0, 31.3, T);
  stamp('1946', 'Asch · J Abnorm Soc Psychol', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(61);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在升 F 小调里，最后一个和弦是升 F 大调）
const NOTE = { Fs3: 185.00, A3: 220.00, As3: 233.08, Cs4: 277.18, Fs4: 369.99, A4: 440.00, As4: 466.16, Cs5: 554.37, Fs5: 739.99, A5: 880.00 };
const FSM_SHIM = [NOTE.A5, NOTE.Cs5, NOTE.Fs5, NOTE.Fs4, NOTE.Cs4], FS_SHIM = [NOTE.As4 * 2, NOTE.Cs5, NOTE.Fs5, NOTE.Fs4, NOTE.Cs4], FSM_SWELL = [46.25, 69.30, 92.50, 110.00, 138.59];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.A4, gain: .05 }], [1.0, 'tink', { f: NOTE.Cs5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Fs3, NOTE.A3, NOTE.Cs4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.A5, gain: .1 }]);
  c.push([Q.REVEAL + .4, 'bar', { f0: 200, f1: 400, dur: 1.0, gain: .06 }], [11.0, 'tick', { gain: .08 }], [11.3, 'tick', { gain: .08 }], [13.8, 'bar', { f0: 300, f1: 220, dur: .8, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: FSM_SHIM, gain: .28 }]);
  for (let i = 0; i < 4; i++) c.push([20.4 + i * .5, 'tink', { f: [NOTE.Cs5, NOTE.Fs5, NOTE.A5, NOTE.Cs5 * 2][i], gain: .04 }]);
  c.push([24.2, 'page', { gain: .14 }], [24.6, 'whoosh', { dur: .5, gain: .06 }], [28.0, 'bar', { f0: 300, f1: 200, dur: 1.0, gain: .05 }], [31.7, 'page', { gain: .18 }]);
  c.push([WORDS, 'whoosh', { dur: .5, gain: .25 }]);
  for (let i = 0; i < 6; i++) { c.push([41.0 + i * BEAT, 'tick', { gain: .08 }]); c.push([45.0 + i * BEAT, 'tick', { gain: .08 }]); }
  c.push([49.1, 'chord', { f: [NOTE.Fs3, NOTE.A3, NOTE.Cs4], gain: .1 }], [49.2, 'tink', { f: NOTE.Fs5, gain: .06 }]);
  c.push([TWIN, 'whoosh', { dur: .5, gain: .22 }], [58.6, 'tink', { f: NOTE.A5, gain: .05 }], [59.2, 'bar', { f0: 260, f1: 200, dur: .6, gain: .05 }], [61.4, 'tink', { f: NOTE.A5, gain: .05 }], [62.0, 'bar', { f0: 260, f1: 200, dur: .6, gain: .05 }]);
  c.push([64.7, 'page', { gain: .12 }], [68.0, 'whoosh', { dur: 1.4, gain: .07 }], [72.4, 'tick', { gain: .08 }], [73.5, 'tick', { gain: .08 }], [74.6, 'tick', { gain: .08 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: FSM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: FSM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 92.50, gain: .14 }], [CLIMAX + 2, 'dust', { dur: 12, gain: .04 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: FS_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Fs3, NOTE.As3, NOTE.Cs4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
