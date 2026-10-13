// ======================================================================== No.33 人本主义：先活下去，才能谈理想吗？（第四季完结）
// 第四季·你身上的主义 ⑩。开头是一道选择题：课本里的“马斯洛需求金字塔”是谁画的？（不是马斯洛，Bridgman, Cummings & Ballard, 2019）
// 音乐：原创配乐（music.py，G 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机在爬金字塔：每一句琶音都比上一句高一层。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 人本主义（每拍一个鼓点） · 53.33 维生素（紧张） · 64.0 二十种主义（只剩钢琴） · 80.0 高潮：一圈全亮 · 96.0 G 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), HUMAN = BT(56), VITA = BT(80), RING = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['金字塔', 0, LIFT], ['不是阶梯', LIFT, HUMAN], ['人本主义', HUMAN, VITA], ['维生素', VITA, RING], ['二十种主义', RING, CLIMAX], ['能成为什么', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.33';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '这座「需求金字塔」，你一定在课本上见过。'],
  [4.1, 7.6, '可它是谁画的？先猜一个。'],
  [8.2, 10.4, '答案是：都不是。'],
  [10.8, 13.3, '马斯洛一辈子，没画过这座金字塔。'],
  [13.6, 15.7, '它出自 1960 年一本商业杂志。'],
  [16.3, 19.6, '画它的人，是给企业做咨询的心理学家。'],
  [19.9, 23.7, '他说，这样能用最低的成本，换来最大的干劲。'],
  [24.0, 27.4, '可马斯洛自己写过：'],
  [27.7, 31.3, '这个层次，远没有看上去那么死板。'],
  [31.6, 35.3, '他还说：有人为了理想，连命都可以不要。'],
  [37.6, 40.6, '马斯洛是「人本主义」心理学的代表。'],
  [40.9, 44.6, '它不只研究人怎么生病，也研究人怎么活得更好。'],
  [44.9, 48.6, '2011 年，一项研究分析了 123 个国家的数据：'],
  [48.9, 52.9, '被尊重、有人爱，这些需求带来的快乐，'],
  [53.6, 57.6, '并不用等到吃饱穿暖，才会出现。'],
  [57.9, 63.4, '研究者打了个比方：需求更像维生素，每一种都要，但不用排队。'],
  [64.3, 67.6, '所以，先活下去，才能谈理想吗？'],
  [67.9, 71.9, '不必。理想，不是吃饱以后的奢侈品。'],
  [72.2, 75.9, '这两季，我们讲了二十种主义。'],
  [76.3, 79.6, '马斯洛说过一句话：'],
  [84.9, 88.6, '二十种主义，'],
  [88.9, 92.6, '都是人在找：自己能成为什么。'],
  [98.4, 103.0, '评论区：二十种主义里，你最像哪一种？'],
];
const BIGLINES = [
  [80.2, 92.6, '「一个人能成为什么，他就必须成为什么。」—— 马斯洛'],
  [93.4, 98.0, '你不必爬完金字塔，才配谈理想。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [HUMAN - .5, .2], [HUMAN, .06], [RING, .06],
  [RING + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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



// ======================================================================== 金字塔、人、需求泡泡
const TIERS = ['生理', '安全', '归属与爱', '尊重', '自我实现'];
const TIER_RGB = ['154,163,178', '170,170,170', '216,199,159', '242,190,120', '242,161,74'];
function pyramid(x, y, w, h, a, o = {}) {                                                     // 五层，从下往上；o.off(i) -> [dx, dy, rot, alpha, glow]
  if (a <= 0) return;
  const th = h / 5, gap = 6;
  for (let i = 0; i < 5; i++) {
    const [dx, dy, rot, al, gl] = o.off ? o.off(i) : [0, 0, 0, 1, 0]; if (al <= 0) continue;
    const yb = y + h / 2 - i * th, yt = yb - th + gap, wb = w * (1 - i / 5), wt = w * (1 - (i + 1) / 5) + (i === 4 ? 0 : 0);
    const cx = x + dx, cy = (yb + yt) / 2 + dy;
    ctx.save(); ctx.globalAlpha *= a * al; ctx.translate(cx, cy); ctx.rotate(rot);
    const rgb = o.ink ? '42,36,24' : o.mono ? '154,163,178' : TIER_RGB[i];
    ctx.fillStyle = `rgba(${rgb},${(o.ink ? .1 + .06 * i : .16) + .5 * gl})`; ctx.strokeStyle = `rgba(${rgb},.9)`; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    if (gl > 0) { ctx.shadowColor = `rgba(${rgb},.9)`; ctx.shadowBlur = 30 * gl; }
    const hh = (yb - yt) / 2;
    ctx.beginPath(); ctx.moveTo(-wb / 2, hh); ctx.lineTo(wb / 2, hh); ctx.lineTo(wt / 2, -hh); ctx.lineTo(-wt / 2, -hh); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    if (!o.noLabel) text(TIERS[i], cx, cy + 2, { font: SERIF, size: Math.min(34, th * .36) * (o.ls || 1), weight: 900, align: 'center', color: o.ink ? '#2a2418' : gl > .3 ? '#fff4e6' : CREAM, alpha: a * al });
  }
}
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function star(x, y, r, a) {
  if (a <= 0) return;
  glow(x, y, r * .5, '255,214,150', a, 6);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#fff1d6'; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const an = -PI / 2 + i * PI / 5, rr = i % 2 ? r * .42 : r; ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}
const NEEDS = [['吃饱穿暖', '154,163,178'], ['安全感', '154,163,178'], ['有人爱', O_RGB], ['被尊重', O_RGB], ['能做好事', '154,163,178'], ['自己做主', '154,163,178']];
function bubble(x, y, r, label, rgb, a, lit = 0, fill = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(16,17,23,.9)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  if (fill < 1) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); ctx.fillStyle = `rgba(${rgb},.28)`; ctx.fillRect(x - r, y + r - 2 * r * fill, 2 * r, 2 * r * fill); ctx.restore(); }
  else { ctx.fillStyle = `rgba(${rgb},${.14 + .3 * lit})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = `rgba(${rgb},.9)`; ctx.lineWidth = 2.5; if (lit > 0) { ctx.shadowColor = `rgba(${rgb},.9)`; ctx.shadowBlur = 26 * lit; }
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
  text(label, x, y + 2, { font: SERIF, size: 24, weight: 900, align: 'center', color: lit > .3 ? '#fff4e6' : CREAM, alpha: a });
}
const ISMS3 = ['虚无', '斯多葛', '犬儒', '享乐', '功利', '存在', '完美', '极简', '乐观', '利他'];               // 圈上只写前半，“主义”写在圆心下面
const ISMS4 = ['唯美', '本质', '拜金', '苦行', '浪漫', '怀疑', '利己', '经验', '实用', '人本'];

// ======================================================================== ① 金字塔（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('课本里的「需求金字塔」：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('是谁画的？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const mag = E.io(prog(t, 13.6, 14.6)), pw = lerp(640, 360, mag), ph = lerp(500, 290, mag), py = lerp(930, 990, mag);
  if (mag > 0) {                                                                              // 1960 年的商业杂志
    ctx.save(); ctx.globalAlpha = mag; ctx.translate(540, 940); ctx.rotate(-.03 * mag);
    ctx.fillStyle = 'rgba(232,224,204,.95)'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; ctx.fillRect(-230, -270, 460, 560); ctx.shadowBlur = 0;
    ctx.fillStyle = '#2a2418'; ctx.fillRect(-230, -270, 460, 90); ctx.restore();
    text('BUSINESS HORIZONS', 540, 712, { font: LAT, size: 34, weight: 700, align: 'center', color: '#f0e6d0', alpha: mag, ls: 2 });
    text('1960', 540, 1180, { font: LAT, size: 40, weight: 700, align: 'center', color: '#2a2418', alpha: mag });
  }
  pyramid(540, py, pw, ph, 1 - sstep(.3, .7, mag), { ls: lerp(1, .7, mag) });
  pyramid(540, py, pw, ph, sstep(.3, .7, mag), { ls: .7, ink: 1 });
  const st = sstep(10.9, 11.2, t) * (1 - sstep(13.4, 13.7, t));                               // “马斯洛没画过”
  if (st > 0) {
    const k = 1 + .4 * (1 - E.out(prog(t, 10.9, 11.3)));
    ctx.save(); ctx.globalAlpha = st; ctx.translate(540, 930); ctx.rotate(-.18); ctx.scale(k, k);
    ctx.fillStyle = 'rgba(24,8,10,.88)'; ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 6; ctx.shadowColor = 'rgba(229,72,77,.7)'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(-250, -60, 500, 120, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(540, 930); ctx.rotate(-.18); ctx.scale(k, k);
    text('马斯洛没画过', 0, 4, { font: SERIF, size: 66, weight: 900, align: 'center', color: '#f0a0a0', alpha: st, glow: 'rgba(229,72,77,.6)', blur: 16 }); ctx.restore();
  }
  text('C · 都不是', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(13.3, 13.7, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('1960 · 一本商业杂志', 540, 560, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: sstep(13.7, 14.2, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 马斯洛', 220], ['B · 他的学生', 540], ['C · 都不是', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 最低成本最大干劲 · 远没有那么死板
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('人本主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('HUMANISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 28, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ⑩ · 完结', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneLadder(t) {
  if (t < 19.7 || t > HUMAN + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(HUMAN - .6, HUMAN - .05, t));
  if (A <= 0) return;
  const A1 = A * (1 - sstep(23.6, 24.1, t));
  if (A1 > 0) {
    pill('“最低的成本，最大的干劲”', 540, 660, A1 * sstep(20.0, 20.5, t), { size: 34, stroke: `rgba(${O_RGB},.6)`, color: '#ffd2a0' });
    for (let i = 0; i < 7; i++) {                                                               // 金字塔上方飘着几枚硬币
      const ph = ((t - 20) * .35 + i / 7) % 1, x = 330 + i * 70;
      ctx.save(); ctx.globalAlpha = A1 * Math.sin(PI * ph) * sstep(20.4, 21.0, t); ctx.fillStyle = '#f2c76a'; ctx.shadowColor = 'rgba(242,199,106,.6)'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(x, lerp(1210, 760, ph), 10, 0, TAU); ctx.fill(); ctx.restore();
    }
  }
  const nm = A * sstep(24.0, 24.4, t) * (1 - sstep(27.3, 27.8, t));
  typeText('马斯洛 · 1943', 540, 640, { ...big, size: 52, weight: 900 }, prog(t, 24.1, 24.9), nm);
  typeText('《人类动机理论》', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 24.7, 25.5), nm);
  const loose = sstep(27.7, 29.0, t), ideal = sstep(31.6, 32.4, t);
  pyramid(540, 1000, 560, 430, A, { off: i => {
    const w = loose * (1 - .6 * ideal);
    const dx = Math.sin(t * 1.3 + i * 1.9) * 34 * w + (i % 2 ? 1 : -1) * 40 * loose, dy = -i * 14 * loose - (i === 4 ? 150 * E.out(ideal) : 0), rot = Math.sin(t * .9 + i) * .06 * w;
    return [dx, dy, rot, i === 0 ? 1 - .7 * ideal : 1, i === 4 ? ideal : 0];
  } });
  const top4 = 1000 + 430 / 2 - 4 * 86 - 40 - 56 * loose - 150 * E.out(ideal) - 80;
  if (ideal > 0) text('理想', 500, top4, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * ideal * sstep(32.2, 32.6, t), glow: `rgba(${O_RGB},.6)`, blur: 16 });
}

// ======================================================================== ③ 人本主义：123 个国家，六种需求
function sceneHuman(t) {
  if (t < HUMAN - .3 || t > VITA + .2) return;
  const A = sstep(HUMAN - .1, HUMAN + .5, t) * (1 - sstep(VITA - .3, VITA + .1, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - HUMAN) / BEAT) % 1);
  const A1 = A * (1 - sstep(44.6, 45.0, t));
  if (A1 > 0) {
    typeText('人本主义心理学', 540, 640, { ...big, size: 60, weight: 900 }, prog(t, 37.7, 38.6), A1);
    typeText('马斯洛 · 罗杰斯 · 20 世纪 50–60 年代', 540, 730, { size: 28, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 38.4, 39.4), A1);
    [['人怎么生病', 310, '154,163,178', 40.9], ['人怎么活得更好', 770, O_RGB, 42.4]].forEach(([s, x, rgb, t0]) => {
      const a = A1 * sstep(t0, t0 + .4, t), r = 150 * (1 + .03 * bk * (t0 > 42 ? 1 : 0));
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = `rgba(${rgb},.85)`; ctx.fillStyle = `rgba(${rgb},.12)`; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = t0 > 42 ? 24 : 0;
      ctx.beginPath(); ctx.arc(x, 1020, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
      text(s, x, 1022, { font: SERIF, size: 36, weight: 900, align: 'center', color: t0 > 42 ? '#ffd2a0' : '#c3cad6', alpha: a });
    });
    text('也研究', 540, 1022, { font: SANS, size: 26, align: 'center', color: '#9aa3b2', alpha: A1 * sstep(42.2, 42.6, t) });
  }
  const A2 = A * sstep(44.9, 45.4, t) * (1 - sstep(48.6, 49.0, t));                               // 123 个国家
  if (A2 > 0) {
    ctx.save(); ctx.globalAlpha = A2 * .5; ctx.strokeStyle = 'rgba(154,163,178,.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(540, 960, 380, 230, 0, 0, TAU); ctx.stroke();
    for (const k of [-.5, 0, .5]) { ctx.beginPath(); ctx.ellipse(540, 960, 380 * Math.cos(k * 1.2), 230, 0, 0, TAU); ctx.stroke(); } ctx.restore();
    const n = Math.floor(clamp(prog(t, 45.0, 47.6)) * 123);
    for (let i = 0; i < n; i++) { const a = hash2(i, 1) * TAU, rr = Math.sqrt(hash2(i, 2)) * .92; glow(540 + Math.cos(a) * 380 * rr, 960 + Math.sin(a) * 230 * rr, 4, O_RGB, A2, 3); }
    text(`${Math.max(1, n)} 个国家`, 540, 650, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: A2 });
    text('约 6 万人 · 2005–2010', 540, 1250, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: A2 * sstep(46.0, 46.4, t) });
  }
}
function needPos(i, t) {                                                                       // 先排成一列（排队），再站成一排（不用排队）
  const row = E.io(prog(t, 59.0, 61.0));
  const qx = 540, qy = 1250 - i * 120, rx = 165 + i * 150, ry = 1000;
  return [lerp(qx, rx, row), lerp(qy, ry, row)];
}
function sceneVita(t) {
  if (t < 48.7 || t > RING + .2) return;
  const A = sstep(48.9, 49.4, t) * (1 - sstep(RING - .7, RING - .1, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - HUMAN) / BEAT) % 1), lit = sstep(49.6, 50.4, t), poor = sstep(53.6, 54.4, t);
  NEEDS.forEach(([s, rgb], i) => {
    const [x, y] = needPos(i, t), a = A * sstep(49.0 + i * .12, 49.4 + i * .12, t);
    const l = (i === 2 || i === 3) ? lit * (1 + .2 * bk) : 0;
    bubble(x, y, 56 * (1 + (l > 0 ? .04 * bk : 0)), s, rgb, a, l, i === 0 ? 1 - .7 * poor : 1);
    if (l > 0 && t > 53.6) for (let k = 0; k < 4; k++) { const ph = ((t - 53.6) * .5 + k / 4) % 1; glow(x + Math.sin(k * 2 + t) * 40, y - 60 - ph * 90, 3, '255,214,150', A * Math.sin(PI * ph) * poor, 4); }
  });
  text('快乐', 760, 880, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * poor * (1 - sstep(58.6, 59.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 14 });
  const row = sstep(59.0, 61.0, t);
  text('像维生素：每一种都要', 540, 760, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(58.0, 58.5, t) });
  text('但不用排队', 540, 1200, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * row * sstep(61.0, 61.5, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
}

// ======================================================================== ⑤ 先活下去，才能谈理想？ · 二十种主义
function ringPos(k, outer, t) {
  const rot = .035 * Math.max(0, t - 72.2), r = outer ? 310 : 185, an = -PI / 2 + k / 10 * TAU + (outer ? PI / 10 : 0) + rot * (outer ? 1 : -1);
  return [540 + Math.cos(an) * r, 1020 + Math.sin(an) * r * .98];
}
function sceneRing(t) {
  if (t < RING - .2) return;
  const A = sstep(RING + .2, RING + 1.0, t);
  const P = A * (1 - sstep(71.7, 72.3, t));
  if (P > 0) {                                                                                 // 金字塔底下的人，和塔顶上的星
    pyramid(540, 1000, 560, 430, P * .55, { mono: 1, noLabel: 1 });
    const down = E.io(prog(t, 68.0, 70.2)), sx = lerp(540, 540, down), sy = lerp(740, 1150, down);
    star(sx, sy, 26, P * sstep(64.4, 65.0, t));
    person(540, 1270, 1, P, down > .8 ? '#ffd2a0' : CREAM);
    if (down > .8) glow(540, 1200, 30, O_RGB, P * sstep(70.0, 70.6, t) * .8, 4);
    text('先活下去，才能谈理想？', 540, 600, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: P * sstep(64.4, 64.9, t) * (1 - sstep(67.6, 68.0, t)) });
    text('不必', 540, 600, { font: SERIF, size: 90, weight: 900, align: 'center', color: '#ffd2a0', alpha: P * sstep(67.9, 68.4, t), glow: `rgba(${O_RGB},.55)`, blur: 26 });
  }
  const R = A * sstep(72.2, 72.6, t);
  if (R <= 0) return;
  const lit = k => sstep(CLIMAX + k * .07, CLIMAX + k * .07 + .25, t), fin = sstep(FINAL, FINAL + 1.5, t);
  ctx.save(); ctx.globalAlpha = R; ctx.lineWidth = 1.5;
  for (const [r, k0] of [[185, 0], [310, 10]]) { ctx.strokeStyle = `rgba(${O_RGB},${.12 + .35 * lit(k0 + 9)})`; ctx.beginPath(); ctx.ellipse(540, 1020, r, r * .98, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
  [[ISMS3, false], [ISMS4, true]].forEach(([names, outer], g) => names.forEach((s, k) => {
    const [x, y] = ringPos(k, outer, t), idx = g * 10 + k, a = R * sstep(72.4 + idx * .16, 72.8 + idx * .16, t), L = lit(idx), me = outer && k === 9;
    if (L > 0) glow(x, y, 6, O_RGB, a * L * (me ? 1 + fin : .6), 5);
    text(s, x, y, { font: SERIF, size: outer ? 34 : 30, weight: 900, align: 'center', color: L > .5 ? (me ? '#fff4e6' : outer ? '#ffd2a0' : '#f6dcb8') : '#8a93a3', alpha: a, glow: L > .5 ? `rgba(${O_RGB},.6)` : null, blur: 14 });
  }));
  const ca = R * sstep(76.3, 77.0, t);                                                           // 圆心：一个“人”
  if (ca > 0) {
    const L = sstep(CLIMAX, CLIMAX + 1.5, t);
    if (L > 0) glow(540, 1020, 30, O_RGB, ca * L * (.8 + .4 * fin), 4);
    text('主义', 540, 1092, { font: SERIF, size: 26, weight: 700, align: 'center', color: L > .5 ? '#ffd2a0' : DIM, alpha: ca * .9, ls: 8 });
    text('人', 540, 1016, { font: SERIF, size: 120, weight: 900, align: 'center', color: L > .5 ? '#fff4e6' : CREAM, alpha: ca, glow: L > 0 ? `rgba(${O_RGB},.7)` : null, blur: 30 });
  }
}

// ======================================================================== ⑥ 能成为什么
function sceneQuote(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1020, 760);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「一个人能成为什么，', 540, 450, { ...big, size: 54, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('他就必须成为什么。」', 540, 552, { ...big, size: 62, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.7, CLIMAX + 3.0), qa);
  typeText('—— 马斯洛《动机与人格》', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.2, CLIMAX + 3.8), qa);
  typeText('你不必爬完金字塔，', 540, 470, { ...big, size: 54, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('才配谈理想。', 540, 584, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneLadder(t); sceneHuman(t); sceneVita(t); sceneRing(t); sceneQuote(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.6) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.2, 80, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2019', 'Bridgman, Cummings & Ballard · AMLE', 8.2, 15.7, T);
  stamp('1960', 'McDermid · Business Horizons', 16.3, 23.7, T);
  stamp('1943', 'Maslow · A Theory of Human Motivation', 24.0, 35.3, T);
  stamp('2011', 'Tay & Diener · JPSP', 44.9, 63.4, T);
  stamp('1954', 'Maslow · Motivation and Personality', 76.3, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(33);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 G 小调里，最后一个和弦是 G 大调）
const NOTE = { G4: 392, Bb4: 466.16, B4: 493.88, D5: 587.33, G5: 783.99, Bb5: 932.33, D6: 1174.66, G6: 1567.98, Bb6: 1864.66, B6: 1975.53 };
const GM_SHIM = [NOTE.Bb6, NOTE.D6, NOTE.G6, NOTE.G5, NOTE.D5], GMAJ_SHIM = [NOTE.B6, NOTE.D6, NOTE.G6, NOTE.G5, NOTE.D5], GM_SWELL = [49, 73.42, 98, 116.54, 146.83];
function CUES() {
  const c = [];
  for (let i = 0; i < 5; i++) c.push([.3 + i * .25, 'tink', { f: [NOTE.G4, NOTE.Bb4, NOTE.D5, NOTE.G5, NOTE.Bb5][i], gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.G4, NOTE.Bb4, NOTE.D5], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.G6, gain: .1 }]);
  c.push([10.9, 'thunk', { gain: .3 }], [13.6, 'page', { gain: .24 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: GM_SHIM, gain: .28 }]);
  for (let i = 0; i < 4; i++) c.push([20.4 + i * .5, 'tink', { f: NOTE.D6, gain: .05 }]);
  c.push([24.1, 'page', { gain: .2 }], [27.7, 'swish', { gain: .14 }], [31.6, 'chord', { f: [NOTE.G4, NOTE.Bb4, NOTE.D5], gain: .1 }], [31.7, 'tink', { f: NOTE.Bb5, gain: .1 }]);
  c.push([HUMAN, 'whoosh', { dur: .5, gain: .25 }], [40.9, 'tink', { f: NOTE.D5, gain: .08 }], [42.4, 'tink', { f: NOTE.G5, gain: .1 }], [45.0, 'dust', { dur: 2.6, gain: .1 }]);
  for (let i = 0; i < 6; i++) c.push([49.0 + i * .12, 'tink', { f: [NOTE.G5, NOTE.Bb5, NOTE.D6, NOTE.G6, NOTE.D6, NOTE.Bb5][i], gain: .05 }]);
  c.push([VITA, 'whoosh', { dur: .5, gain: .2 }], [53.7, 'bar', { f0: 392, f1: 196, dur: 1.0, gain: .1 }], [59.0, 'swish', { gain: .16 }], [61.0, 'chord', { f: [NOTE.G4, NOTE.Bb4, NOTE.D5], gain: .1 }]);
  c.push([64.4, 'tink', { f: NOTE.D6, gain: .08 }], [68.0, 'bar', { f0: 784, f1: 392, dur: 2.0, gain: .08 }], [70.2, 'tink', { f: NOTE.G5, gain: .1 }]);
  for (let i = 0; i < 20; i += 2) c.push([72.4 + i * .16, 'tink', { f: [NOTE.G5, NOTE.Bb5, NOTE.D6, NOTE.G6, NOTE.Bb6][(i / 2) % 5], gain: .04 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: GM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: GM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 98, gain: .14 }]);
  for (let i = 0; i < 10; i++) c.push([CLIMAX + i * .14, 'tink', { f: [NOTE.G5, NOTE.Bb5, NOTE.D6, NOTE.G6, NOTE.Bb6][i % 5], gain: .05 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: GMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.G4, NOTE.B4, NOTE.D5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
