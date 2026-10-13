// ======================================================================== No.34 集体主义：大家都选错，你会跟吗？
// 第五季·看不见的主义 ①。开头是一道选择题：哪条线和左边一样长？明明是 2 号，可前面的人都说 1 号。多少人至少跟错过一次？（阿希从众实验）
// 音乐：原创配乐（music.py，D 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机像一群人：同一个音说三遍，第四个音走开。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 集体主义（每拍一个鼓点） · 53.33 一个盟友（紧张） · 64.0 孤单（只剩钢琴） · 80.0 高潮：一排人依次亮起 · 96.0 D 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), CULT = BT(56), ALLY = BT(80), ALONE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['线段', 0, LIFT], ['从众实验', LIFT, CULT], ['集体主义', CULT, ALLY], ['一个盟友', ALLY, ALONE], ['孤单', ALONE, CLIMAX], ['共识', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.34';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '哪条线和左边一样长？明明是 2 号，'],
  [4.1, 7.6, '可前面的人都说 1 号。多少人跟着错过？'],
  [8.2, 10.4, '答案是：约四分之三。'],
  [10.8, 13.3, '一个人单独回答，几乎没人答错；'],
  [13.6, 15.7, '在群里，三分之一跟着错。'],
  [16.3, 19.6, '这是 1950 年代，阿希做的「从众实验」。'],
  [19.9, 23.7, '前面那些人，都是安排好的演员。'],
  [24.0, 27.4, '明知道错，为什么还要跟？'],
  [27.7, 31.3, '有人说，怕自己显得奇怪；'],
  [31.6, 35.3, '也有人开始怀疑：是不是我看错了？'],
  [37.6, 40.6, '后来，研究者汇总了 17 个国家的 133 项研究：'],
  [40.9, 44.6, '越看重集体的文化，跟着错的比例越高。'],
  [44.9, 48.6, '这就是「集体主义」：把群体，放在自己前面。'],
  [48.9, 52.9, '它让人合群、肯合作，也可能让人不敢开口。'],
  [53.6, 57.6, '可阿希还做了一个变化：'],
  [57.9, 63.4, '只要有一个人说真话，跟着错的次数，就降到原来的四分之一。'],
  [64.3, 67.6, '原来，压住我们的不是所有人，'],
  [67.9, 71.9, '而是「只有我一个」的那种孤单。'],
  [72.2, 75.9, '你说出来，也许正是别人在等的那个人。'],
  [76.3, 79.6, '阿希写过：'],
  [84.9, 88.6, '合群没有错，'],
  [88.9, 92.6, '错的是，为了合群，假装没看见。'],
  [98.4, 103.0, '评论区：你有过明知不对，还跟着大家的时候吗？'],
];
const BIGLINES = [
  [80.2, 92.6, '「社会需要共识；但有价值的共识，需要每个人独立说出自己看到的。」—— 阿希'],
  [93.4, 98.0, '做那个说真话的第一个人。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [CULT - .5, .2], [CULT, .06], [ALONE, .06],
  [ALONE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、线段卡片、对话泡泡
function person(x, y, s, a, col = CREAM, fill = 'rgba(16,17,23,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = fill;
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function lineCard(cx, base, s, a) {                                                            // 左边是标准线，右边是 ① ② ③
  if (a <= 0) return;
  const L = [[-280, 280, '标准', CREAM], [20, 210, '①', '#9aa3b2'], [160, 280, '②', '#ffd2a0'], [300, 350, '③', '#9aa3b2']];
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.2)'; ctx.lineWidth = 2; ctx.setLineDash([6, 8]);
  ctx.beginPath(); ctx.moveTo(cx - 140 * s, base - 370 * s); ctx.lineTo(cx - 140 * s, base + 10 * s); ctx.stroke(); ctx.restore();
  L.forEach(([dx, h, lab, col]) => {
    const x = cx + dx * s;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 9 * s; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(236,230,218,.5)'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x, base - h * s); ctx.stroke(); ctx.restore();
    text(lab, x, base + 40 * s, { font: SERIF, size: (lab === '标准' ? 26 : 36) * s, weight: 900, align: 'center', color: col, alpha: a });
  });
}
function bubble(x, y, s, a, lab, hot = 0) {
  if (a <= 0) return;
  const col = hot ? ORANGE : 'rgba(236,230,218,.75)';
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hot ? 'rgba(242,161,74,.18)' : 'rgba(255,255,255,.07)'; ctx.strokeStyle = col; ctx.lineWidth = 2;
  if (hot) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 18; }
  ctx.beginPath(); ctx.roundRect(x - 30 * s, y - 26 * s, 60 * s, 46 * s, 14 * s); ctx.moveTo(x - 6 * s, y + 20 * s); ctx.lineTo(x, y + 32 * s); ctx.lineTo(x + 6 * s, y + 20 * s); ctx.fill(); ctx.stroke(); ctx.restore();
  text(lab, x, y - 2 * s, { font: SERIF, size: 30 * s, weight: 900, align: 'center', color: hot ? '#ffd2a0' : CREAM, alpha: a });
}
function mark(ok, x, y, a, r = 26) {
  if (a <= 0) return;
  const col = ok ? TEAL : '#e5484d';
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 16;
  ctx.beginPath();
  if (ok) { ctx.moveTo(x - r, y); ctx.lineTo(x - r * .3, y + r * .7); ctx.lineTo(x + r, y - r * .7); }
  else { ctx.moveTo(x - r * .7, y - r * .7); ctx.lineTo(x + r * .7, y + r * .7); ctx.moveTo(x + r * .7, y - r * .7); ctx.lineTo(x - r * .7, y + r * .7); }
  ctx.stroke(); ctx.restore();
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
const ROW = [150, 270, 390, 510, 630, 750];                                                     // 六个“演员”，最后是你
const YOU = 900;

// ======================================================================== ① 线段（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('前面的人都说 ① 号：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('多少人跟着错过？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const scn = 1 - sstep(10.5, 11.0, t);
  lineCard(600, 1000, 1, scn);
  ROW.forEach((x, i) => { person(x, 1210, .55, scn, '#9aa3b2'); bubble(x, 1110, .9, scn * sstep(.5 + i * .3, .8 + i * .3, t), '①'); });
  person(YOU, 1210, .55, scn, ORANGE); bubble(YOU, 1110, .9, scn * sstep(2.6, 2.9, t), '？', 1);
  text('你', YOU + 44, 1228, { font: SERIF, size: 26, weight: 900, color: '#ffd2a0', alpha: scn });
  text('C · 约四分之三', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('至少跟错过一次', 540, 646, { font: SANS, size: 30, align: 'center', color: '#c3cad6', alpha: sstep(Q.REVEAL + .3, Q.REVEAL + .7, t) * (1 - sstep(10.6, 11.0, t)) });
  const ca = sstep(10.8, 11.3, t);                                                              // 单独回答 vs 在群里
  if (ca > 0) {
    const base = 1240, g1 = E.out(prog(t, 11.0, 11.8)), g2 = E.out(prog(t, 13.7, 14.9));
    text('答错的比例', 540, 540, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: ca });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, ca);
    bar(380, base, 150, 900 * .008 * g1 + 2, T_RGB, ca); bar(700, base, 150, 900 * .34 * g2, '229,72,77', ca);
    text('不到 1%', 380, base - 50, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#7fe3d3', alpha: ca * sstep(11.4, 11.8, t) });
    text('约 1/3', 700, base - 900 * .34 * g2 - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#f0a0a0', alpha: ca * sstep(14.2, 14.6, t) });
    text('单独回答', 380, base + 40, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: ca });
    text('在群里', 700, base + 40, { font: SANS, size: 28, align: 'center', color: '#f0a0a0', alpha: ca * sstep(13.6, 14.0, t) });
  }
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 约 5%', 220], ['B · 约 35%', 540], ['C · 约 75%', 860]].forEach(([s, x]) => pill(s, x, 1300, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 演员 · 为什么要跟
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('集体主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('COLLECTIVISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ①', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function cloud(s, x, y, a, col) {
  if (a <= 0) return;
  pill(s, x, y, a, { size: 32, stroke: col, color: CREAM });
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.strokeStyle = col; ctx.lineWidth = 1.6;
  const dx = x < 540 ? 1 : -1;
  [[60, 52, 9], [96, 86, 6]].forEach(([ox, oy, r]) => { ctx.beginPath(); ctx.arc(x + dx * ox, y + oy, r, 0, TAU); ctx.fill(); ctx.stroke(); }); ctx.restore();
}
function sceneAsch(t) {
  if (t < 19.7 || t > CULT + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(CULT - .6, CULT - .05, t));
  if (A <= 0) return;
  const A1 = A * (1 - sstep(23.6, 24.1, t));
  if (A1 > 0) {
    typeText('阿希 · 1951', 540, 640, { ...big, size: 52, weight: 900 }, prog(t, 20.0, 20.8), A1);
    typeText('从众实验', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 20.6, 21.4), A1);
    [180, 300, 420, 540, 660, 780, 900].forEach((x, i) => {
      const me = i === 5;
      person(x, 1080, .8, A1 * sstep(20.2 + i * .1, 20.6 + i * .1, t), me ? ORANGE : '#9aa3b2');
      text(me ? '你' : '演员', x, 1140, { font: SANS, size: 24, align: 'center', color: me ? '#ffd2a0' : '#6f7786', alpha: A1 * sstep(21.0 + i * .12, 21.4 + i * .12, t) });
    });
  }
  const A2 = A * sstep(24.0, 24.5, t);
  if (A2 > 0) {
    person(540, 1180, 1.5, A2, ORANGE);
    text('？', 540, 860, { font: SERIF, size: 120, weight: 900, align: 'center', color: '#ffd2a0', alpha: A2 * sstep(24.3, 24.8, t) * (1 - sstep(27.4, 27.8, t)), glow: `rgba(${O_RGB},.6)`, blur: 24 });
    cloud('怕显得奇怪', 320, 820, A2 * sstep(27.7, 28.2, t), 'rgba(240,160,160,.7)');
    cloud('是我看错了？', 760, 900, A2 * sstep(31.6, 32.1, t), 'rgba(154,163,178,.8)');
  }
}

// ======================================================================== ③ 集体主义：17 个国家 · 合群也可能不敢开口
function sceneCult(t) {
  if (t < CULT - .3 || t > ALLY + .2) return;
  const A = sstep(CULT - .1, CULT + .5, t) * (1 - sstep(ALLY - .6, ALLY - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - CULT) / BEAT) % 1);
  const P = A * (1 - sstep(44.6, 45.0, t));                                                       // 散点：越看重集体，跟错越多（示意）
  if (P > 0) {
    const x0 = 180, x1 = 900, y0 = 1180, y1 = 760;
    text('17 个国家 · 133 项研究', 540, 640, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: P });
    seg(x0, y0, x1, y0, 'rgba(236,230,218,.4)', 2, P); seg(x0, y0, x0, y1, 'rgba(236,230,218,.4)', 2, P);
    text('跟着错的比例', x0 + 14, y1 - 6, { font: SANS, size: 24, color: '#9aa3b2', alpha: P });
    text('越看重集体 →', x1, y0 + 36, { font: SANS, size: 24, align: 'right', color: '#9aa3b2', alpha: P });
    text('示意', x1, y1 - 6, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: P });
    for (let i = 0; i < 17; i++) {
      const u = (i + .5) / 17, x = lerp(x0 + 30, x1 - 30, u), y = lerp(y0 - 70, y1 + 60, u) + (hash2(i, 34) - .5) * 120;
      const a = P * sstep(38.0 + i * .2, 38.3 + i * .2, t); glow(x, y, 7 * (1 + .2 * bk), u > .5 ? O_RGB : '154,163,178', a, 2.6);
    }
    drawOn(() => { ctx.moveTo(x0 + 20, y0 - 70); ctx.lineTo(x1 - 20, y1 + 60); }, 830, E.io(prog(t, 41.0, 42.6)), ORANGE, 3, P, `rgba(${O_RGB},.6)`);
  }
  const D = A * sstep(44.9, 45.4, t) * (1 - sstep(48.6, 49.0, t));                                 // 把群体放在自己前面
  if (D > 0) {
    typeText('集体主义', 540, 640, { ...big, size: 64, weight: 900 }, prog(t, 45.0, 45.7), D);
    typeText('把群体，放在自己前面', 540, 730, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 45.6, 46.4), D);
    for (let i = 0; i < 10; i++) { const an = -PI / 2 + i / 10 * TAU; person(540 + Math.cos(an) * 230, 1060 + Math.sin(an) * 170, .55 * (1 + .05 * bk), D * sstep(45.2 + i * .08, 45.5 + i * .08, t), '#c3cad6'); }
    person(540, 1080, .75, D, ORANGE);
  }
  const Sp = A * sstep(48.9, 49.4, t);
  if (Sp > 0) [['合群 · 肯合作', 880, true, 49.0], ['不敢开口', 1080, false, 50.6]].forEach(([s, y, ok, t0]) => {
    const a = Sp * sstep(t0, t0 + .4, t);
    ctx.save(); ctx.translate(500, y); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
    text(s, 0, 0, { font: SERIF, size: 66, weight: 900, align: 'center', color: ok ? CREAM : '#f0a0a0', alpha: a }); ctx.restore();
    mark(ok, 820, y, a, 32);
  });
}

// ======================================================================== ④ 一个盟友
function sceneAlly(t) {
  if (t < ALLY - .3 || t > ALONE + .2) return;
  const A = sstep(ALLY - .1, ALLY + .5, t) * (1 - sstep(ALONE - .7, ALONE - .1, t));
  if (A <= 0) return;
  lineCard(600, 960, .8, A);
  const ally = sstep(57.9, 58.4, t), me = sstep(59.6, 60.1, t);
  ROW.forEach((x, i) => {
    const hot = i === 2 ? ally : 0;
    person(x, 1180, .55, A, hot > .5 ? ORANGE : '#9aa3b2');
    bubble(x, 1080, .9, A * sstep(53.8 + i * .2, 54.1 + i * .2, t), hot > .5 ? '②' : '①', hot);
    if (hot > 0) glow(x, 1140, 18, O_RGB, A * hot * .7, 4);
  });
  person(YOU, 1180, .55, A, ORANGE); bubble(YOU, 1080, .9, A * sstep(55.2, 55.5, t), me > .5 ? '②' : '？', me);
  text('你', YOU + 44, 1198, { font: SERIF, size: 26, weight: 900, color: '#ffd2a0', alpha: A });
  text('只要有一个人说真话', 540, 600, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * ally * (1 - sstep(60.8, 61.2, t)), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  text('跟着错：只剩约 1/4', 540, 600, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(61.0, 61.5, t) });
}

// ======================================================================== ⑤ 孤单 → 等着的那个人 → 阿希
function sceneAlone(t) {
  if (t < ALONE - .2 || t > CLIMAX + .3) return;
  const A = sstep(ALONE + .2, ALONE + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const C = A * (1 - sstep(76.0, 76.5, t)), iso = sstep(67.9, 69.0, t), other = sstep(72.4, 73.0, t);
  if (C > 0) {
    const OTH = 18;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const i = r * 7 + c, x = 180 + c * 120 + (r % 2) * 30, y = 860 + r * 120, me = i === 10, ot = i === OTH;
      const dim = me || (ot && other > 0) ? 1 : 1 - .6 * iso;
      person(x, y, .55, C * dim, me ? ORANGE : ot && other > .5 ? '#ffd2a0' : '#7d8796');
      if (me) glow(x, y - 30, 16, O_RGB, C * (.4 + .6 * iso), 4);
      if (ot && other > 0) { glow(x, y - 30, 16, O_RGB, C * other, 4); drawOn(() => { ctx.moveTo(180 + 3 * 120 + 30, 860 + 120 - 30); ctx.lineTo(x, y - 30); }, 300, E.io(prog(t, 73.0, 74.4)), 'rgba(242,161,74,.8)', 2.5, C, `rgba(${O_RGB},.6)`); }
    }
    text('只有我一个', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#c3cad6', alpha: C * iso * (1 - sstep(72.0, 72.4, t)) });
    text('还有一个', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: C * sstep(73.6, 74.1, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  }
  const Hm = A * sstep(76.3, 76.8, t);
  typeText('阿希', 540, 860, { ...big, size: 72, weight: 900 }, prog(t, 76.4, 77.2), Hm);
  typeText('《意见与社会压力》1955', 540, 960, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), Hm);
}

// ======================================================================== ⑥ 共识：一排人，从第一个开始亮
function sceneConsensus(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1100, 760);
  for (let i = 0; i < 9; i++) {
    const x = 140 + i * 100, d = Math.abs(i - 4), lit = sstep(CLIMAX + .8 + d * .35, CLIMAX + 1.2 + d * .35, t);
    if (lit > 0) glow(x, 1110, 14, O_RGB, A * lit * (.5 + .5 * fin), 4);
    person(x, 1150, .7, A, lit > .5 ? '#ffd2a0' : '#7d8796');
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「社会需要共识；', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('但有价值的共识，', 540, 520, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + 1.5, CLIMAX + 2.5), qa);
  typeText('需要每个人独立说出自己看到的。」', 540, 614, { ...big, size: 50, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.6, CLIMAX + 4.0), qa);
  typeText('—— 阿希', 540, 700, { size: 28, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 4.2, CLIMAX + 4.8), qa);
  typeText('做那个说真话的', 540, 500, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('第一个人。', 540, 620, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneAsch(t); sceneCult(t); sceneAlly(t); sceneAlone(t); sceneConsensus(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.2, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1951', 'Solomon Asch · Swarthmore College', 8.2, 23.7, T);
  stamp('1996', 'Bond & Smith · Psychological Bulletin', 37.6, 48.6, T);
  stamp('1956', 'Asch · Psychological Monographs', 53.6, 63.4, T);
  stamp('1955', 'Asch · Opinions and Social Pressure', 76.3, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(34);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 D 小调里，最后一个和弦是 D 大调）
const NOTE = { D4: 293.66, F4: 349.23, Fs4: 369.99, A4: 440, D5: 587.33, F5: 698.46, A5: 880, D6: 1174.66, F6: 1396.91, Fs6: 1479.98, A6: 1760 };
const DM_SHIM = [NOTE.F6, NOTE.A5, NOTE.D6, NOTE.D5, NOTE.A4], DMAJ_SHIM = [NOTE.Fs6, NOTE.A5, NOTE.D6, NOTE.D5, NOTE.A4], DM_SWELL = [73.42, 110, 146.83, 174.61, 220];
function CUES() {
  const c = [];
  for (let i = 0; i < 6; i++) c.push([.5 + i * .3, 'tink', { f: NOTE.A5, gain: .06 }]);                      // 六个人说同一个答案
  c.push([2.6, 'tink', { f: NOTE.D6, gain: .07 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.D4, NOTE.F4, NOTE.A4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.D6, gain: .12 }]);
  c.push([11.0, 'bar', { f0: 220, f1: 247, dur: .6, gain: .1 }], [13.7, 'bar', { f0: 220, f1: 660, dur: 1.2, gain: .16 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: DM_SHIM, gain: .28 }]);
  for (let i = 0; i < 7; i++) c.push([20.2 + i * .1, 'click', { gain: .06 }]);
  c.push([24.3, 'tink', { f: NOTE.F5, gain: .08 }], [27.7, 'swish', { gain: .12 }], [31.6, 'swish', { gain: .12 }]);
  c.push([CULT, 'whoosh', { dur: .5, gain: .25 }]);
  for (let i = 0; i < 17; i += 2) c.push([38.0 + i * .2, 'click', { gain: .06 }]);
  c.push([41.0, 'bar', { f0: 220, f1: 440, dur: 1.6, gain: .1 }], [45.0, 'chord', { f: [NOTE.D5, NOTE.F5, NOTE.A5], gain: .08 }], [49.0, 'tink', { f: NOTE.A5, gain: .08 }], [50.6, 'thud', { gain: .16 }]);
  c.push([ALLY, 'whoosh', { dur: .5, gain: .22 }]);
  for (let i = 0; i < 6; i++) c.push([53.8 + i * .2, 'tink', { f: NOTE.A5, gain: .05 }]);
  c.push([57.9, 'tink', { f: NOTE.D6, gain: .12 }], [57.95, 'chord', { f: [NOTE.D5, NOTE.F5, NOTE.A5], gain: .1 }], [59.6, 'tink', { f: NOTE.F6, gain: .1 }], [61.0, 'bar', { f0: 660, f1: 220, dur: 1.2, gain: .12 }]);
  c.push([64.4, 'tink', { f: NOTE.D6, gain: .06 }], [67.9, 'thud', { gain: .12 }], [72.4, 'tink', { f: NOTE.A5, gain: .08 }], [73.0, 'tink', { f: NOTE.D6, gain: .08 }], [76.4, 'page', { gain: .22 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: DM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: DM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 73.42, gain: .14 }]);
  for (let d = 0; d < 5; d++) c.push([CLIMAX + .8 + d * .35, 'tink', { f: [NOTE.D5, NOTE.F5, NOTE.A5, NOTE.D6, NOTE.F6][d], gain: .06 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: DMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.D4, NOTE.Fs4, NOTE.A4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
