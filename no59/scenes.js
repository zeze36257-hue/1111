// ======================================================================== No.59 攀比主义：邻居中了彩票，你会更穷吗？
// 第七季·人和人之间的主义 ⑥。开头是一道选择题：加拿大有人中了彩票，奖金越大，他的邻居后来会怎样？（Agarwal, Mikhed & Scholnick, 2020）
// 音乐：原创配乐（music.py，E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一句话，马上被高一级的同一句话盖过去。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 选哪个（每拍一个鼓点） · 53.33 没有尽头（紧张） · 64.0 看不见（只剩钢琴） · 80.0 高潮：知足 · 96.0 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), PICK = BT(56), ENDLESS = BT(80), UNSEEN = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['中彩票', 0, LIFT], ['坐不住', LIFT, PICK], ['选哪个', PICK, ENDLESS], ['没有尽头', ENDLESS, UNSEEN], ['看不见', UNSEEN, CLIMAX], ['知足', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.59';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '在加拿大，有人中了彩票，奖金有大有小。'],
  [4.1, 7.6, '奖金越大，他的邻居后来会怎样？先猜一个。'],
  [8.2, 10.4, '答案是 C：邻居更容易破产。'],
  [10.8, 13.3, '奖金越大，附近人家后来申请破产的越多；'],
  [13.6, 15.7, '他们手里，多的是车、房这些看得见的东西。'],
  [16.3, 19.6, '不是中奖的人做了什么，'],
  [19.9, 23.7, '而是：看着身边的人突然变好，自己坐不住了。'],
  [24.0, 27.4, '借钱买车、换房子，想跟上隔壁的节奏。'],
  [27.7, 31.3, '比的往往不是需要，是“别人有”。'],
  [31.6, 35.3, '这就是「攀比主义」：过得好不好，要看跟谁比。'],
  [37.6, 40.6, '有个经典问题：'],
  [40.9, 44.6, '你年薪 5 万，别人 2.5 万；'],
  [44.9, 48.6, '或者你年薪 10 万，别人 20 万。你选哪个？'],
  [48.9, 52.9, '约一半的人选了前者：钱少一半，也要比别人多。'],
  [53.6, 57.6, '可比较，是没有尽头的：'],
  [57.9, 60.6, '你追上了隔壁，还有楼上；'],
  [60.8, 63.4, '追上了楼上，还有手机里的所有人。'],
  [64.3, 67.6, '所以，想买点什么的时候，先问一句：'],
  [67.9, 71.9, '如果没人看得见，我还想要它吗？'],
  [72.2, 75.9, '真想要的，留下；只想被看见的，可以放一放。'],
  [76.3, 79.6, '两千多年前，老子说：'],
  [84.9, 88.6, '赢过别人，靠的是力气；'],
  [88.9, 92.6, '赢过那个总想比的自己，才叫强。'],
  [98.4, 103.0, '评论区：你有没有为了“别人有”，买过用不上的东西？'],
];
const BIGLINES = [
  [80.2, 92.6, '「胜人者有力，自胜者强。知足者富。」——《道德经》'],
  [93.4, 98.0, '少比一点，多过一点。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [PICK - .5, .2], [PICK, .06], [UNSEEN, .06],
  [UNSEEN + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、房子、车、彩票、手机
const PINK = '#f0a0a0', GOLD = '#ffd2a0', TEALC = '#7fe3d3', WARMC = '#ffb36b', GREYP = '#9aa3b2';
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function house(x, y, s, a, col = GREYP, glowK = 0, grow = 0) {                                       // y 是地面；grow 让房子长高一层
  if (a <= 0) return;
  const h = 70 + 50 * grow;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (glowK > 0) { ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 30 * glowK; }
  ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.rect(-50, -h, 100, h); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.moveTo(-62, -h); ctx.lineTo(0, -h - 50); ctx.lineTo(62, -h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = glowK > 0 ? `rgba(255,214,160,${.5 + .5 * glowK})` : 'rgba(195,202,214,.25)'; ctx.fillRect(-30, -h + 16, 22, 22); ctx.fillRect(8, -h + 16, 22, 22);
  if (grow > .5) { ctx.fillRect(-30, -h + 66, 22, 22); ctx.fillRect(8, -h + 66, 22, 22); }
  ctx.strokeRect(-10, -36, 20, 36); ctx.restore();
}
function car(x, y, s, a, col = WARMC) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-60, -10); ctx.lineTo(-60, -30); ctx.lineTo(-30, -32); ctx.lineTo(-16, -52); ctx.lineTo(24, -52); ctx.lineTo(40, -32); ctx.lineTo(60, -28); ctx.lineTo(60, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (const wx of [-34, 34]) { ctx.beginPath(); ctx.arc(wx, -8, 11, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
function lotto(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.15); ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 20;
  ctx.fillStyle = '#e8b866'; ctx.fillRect(-46, -26, 92, 52); ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(26,27,34,.8)';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-32 + i * 13, -6, 5, 0, TAU); ctx.fill(); }
  ctx.fillRect(-34, 8, 50, 6); ctx.restore();
}
function stamp2(s, x, y, a, rot = -.2) {                                                              // 盖章
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 4; ctx.strokeRect(-56, -24, 112, 48); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); text(s, 0, 2, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#e5484d', alpha: a }); ctx.restore();
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}

// ======================================================================== ① 中彩票（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('邻居中了彩票，奖金越大：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('周围的人会怎样？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const G = 1120, after = sstep(Q.REVEAL + .2, Q.REVEAL + 1.4, t);
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, G); ctx.lineTo(1000, G); ctx.stroke(); ctx.restore();
  const xs = [150, 330, 540, 750, 930];
  xs.forEach((x, i) => {
    if (i === 2) { house(x, G, 1.15, 1, GOLD, .6 + .4 * Math.sin(t * 3) ** 2); return; }
    const k = sstep(Q.REVEAL + .3 + i * .15, Q.REVEAL + .9 + i * .15, t);
    house(x, G, 1.0, 1, mixc(GREYP, WARMC, k), 0, k);
    car(x + 40, G + 60, .7, k, WARMC);
  });
  lotto(540, 860 + 6 * Math.sin(t * 2), 1.1, 1 - sstep(Q.REVEAL - .2, Q.REVEAL + .2, t));
  const B = sstep(10.9, 11.3, t);
  stamp2('破产', 330, 960, B * sstep(11.0, 11.2, t)); stamp2('破产', 930, 960, B * sstep(11.4, 11.6, t), .15);
  text('车、房：看得见的', 540, 1250, { font: SANS, size: 28, align: 'center', color: WARMC, alpha: sstep(13.7, 14.1, t) });
  text('C · 更容易破产', 540, 560, { font: SERIF, size: 68, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('奖金越大，附近破产越多', 540, 560, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 更省钱', 200], ['B · 没影响', 540], ['C · 更容易破产', 870]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 坐不住
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('攀比主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('KEEPING UP WITH THE JONESES', 540, 1046, { size: 32, weight: 600, font: LAT, ls: 8, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ⑥', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneFence(t) {
  if (t < 19.7 || t > PICK + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(PICK - .6, PICK - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('看着隔壁，坐不住了', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('借钱，跟上节奏', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('比的是“别人有”', 540, 640, { font: SERIF, size: 58, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const G = 1150;
    ctx.save(); ctx.globalAlpha = D; ctx.strokeStyle = 'rgba(236,230,218,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, G); ctx.lineTo(1000, G); ctx.stroke(); ctx.restore();
    house(760, G, 1.4, D, GOLD, .7, 1); car(760, G + 70, 1.0, D, GOLD);
    const grow = E.io(prog(t, 24.6, 26.4)), carIn = E.io(prog(t, 24.2, 25.4));
    house(300, G, 1.4, D, mixc(GREYP, WARMC, grow), 0, grow);
    car(lerp(-80, 300, carIn), G + 70, 1.0, D * sstep(24.2, 24.4, t), WARMC);
    for (let i = 0; i < 7; i++) { ctx.save(); ctx.globalAlpha = D; ctx.strokeStyle = 'rgba(200,164,106,.8)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(500 + i * 14, G); ctx.lineTo(500 + i * 14, G - 70); ctx.stroke(); ctx.restore(); }
    person(470, G - 10, .8, D, CREAM);
    const peek = Math.sin(t * 4) * 4;
    text('👀', 470 + peek, G - 150, { font: SANS, size: 34, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    const loan = D * sstep(24.6, 25.0, t) * (1 - sstep(27.4, 27.8, t));
    if (loan > 0) { ctx.save(); ctx.globalAlpha = loan; ctx.fillStyle = 'rgba(236,230,218,.92)'; ctx.fillRect(130, 820, 150, 100); ctx.restore(); text('借据', 205, 872, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#c2410c', alpha: loan }); }
    pill('别人有', 300, 860, D * sstep(28.0, 28.4, t), { size: 34, stroke: `rgba(${O_RGB},.8)`, color: GOLD });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('攀比主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('过得好不好，要看跟谁比', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 选哪个
function scenePick(t) {
  if (t < PICK - .3 || t > ENDLESS + .2) return;
  const A = sstep(PICK - .1, PICK + .5, t) * (1 - sstep(ENDLESS - .6, ENDLESS - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - PICK) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('一个经典问题', 37.7, 40.6, CREAM);
  hd('你选哪个世界？', 41.0, 48.6, GOLD, `rgba(${O_RGB},.4)`);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('约一半选了 A', 0, 0, { font: SERIF, size: 56, weight: 900, align: 'center', color: PINK, alpha: A * sstep(49.0, 49.5, t), glow: 'rgba(229,72,77,.4)', blur: 16 }); ctx.restore();
  const base = 1200, u = 16;
  const world = (cx, lab, me, other, t0, hi) => {                                                       // 一个“世界”：你 vs 别人
    const a = A * sstep(t0, t0 + .4, t), k = E.out(prog(t, t0 + .2, t0 + 1.2));
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(30,31,40,.85)'; ctx.strokeStyle = hi > 0 ? `rgba(${O_RGB},${.4 + .6 * hi})` : 'rgba(195,202,214,.4)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(cx - 200, 760, 400, 520, 24); ctx.fill(); ctx.stroke();
    ctx.fillStyle = TEALC; ctx.fillRect(cx - 110, base - me * u * k, 90, me * u * k); ctx.fillStyle = GREYP; ctx.fillRect(cx + 20, base - other * u * k, 90, other * u * k); ctx.restore();
    text(lab, cx, 800, { font: SERIF, size: 36, weight: 900, align: 'center', color: hi > 0 ? GOLD : CREAM, alpha: a });
    text(me + '万', cx - 65, base - me * u * k - 22, { font: SERIF, size: 30, weight: 900, align: 'center', color: TEALC, alpha: a * k });
    text(other + '万', cx + 65, base - other * u * k - 22, { font: SERIF, size: 30, weight: 900, align: 'center', color: GREYP, alpha: a * k });
    text('你', cx - 65, base + 36, { font: SANS, size: 26, align: 'center', color: TEALC, alpha: a });
    text('别人', cx + 65, base + 36, { font: SANS, size: 26, align: 'center', color: GREYP, alpha: a });
  };
  const hiA = sstep(49.0, 49.5, t) * (.7 + .3 * bk);
  world(300, 'A', 5, 2.5, 41.0, hiA);
  world(780, 'B', 10, 20, 45.0, 0);
  const pie = A * sstep(49.2, 49.6, t);
  if (pie > 0) { ctx.save(); ctx.globalAlpha = pie; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 900, 34, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = WARMC; ctx.beginPath(); ctx.moveTo(540, 900); ctx.arc(540, 900, 34, -PI / 2, -PI / 2 + PI * E.out(prog(t, 49.3, 50.3))); ctx.closePath(); ctx.fill(); ctx.restore(); }
}

// ======================================================================== ④ 没有尽头
function sceneEndless(t) {
  if (t < ENDLESS - .3 || t > UNSEEN + .2) return;
  const A = sstep(ENDLESS - .1, ENDLESS + .5, t) * (1 - sstep(UNSEEN - .7, UNSEEN - .1, t));
  if (A <= 0) return;
  text('比较，没有尽头', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('追上隔壁，还有楼上', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: WARMC, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('还有手机里的所有人', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: PINK, alpha: A * sstep(60.9, 61.4, t), glow: 'rgba(229,72,77,.4)', blur: 16 });
  const lv = clamp((t - 54.4) / 1.6, 0, 6), cam = E.io(prog(t, 57.9, 61.5)) * 300;                  // 一级比一级高的台子，人一级级往上爬
  for (let i = 0; i < 7; i++) {
    const x = 180 + i * 120, y = 1240 - i * 70 + cam * (i / 6), a = A * sstep(53.8 + i * .4, 54.2 + i * .4, t);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.5)'; ctx.lineWidth = 2; ctx.fillRect(x - 55, y, 110, 1400 - y); ctx.strokeRect(x - 55, y, 110, 1400 - y); ctx.restore();
    if (i > 0) person(x, y - 4, .5, a, i <= lv ? GREYP : GOLD);
  }
  const me = Math.floor(lv), fr = lv - me, mx = 180 + Math.min(me, 6) * 120 + 120 * E.io(fr) * (me < 6), my = 1240 - Math.min(lv, 6) * 70 + cam * (Math.min(lv, 6) / 6);
  person(mx - 30, my - 4, .5, A, TEALC);
  const Ph = A * sstep(60.9, 61.3, t);
  if (Ph > 0) {
    ctx.save(); ctx.globalAlpha = Ph; ctx.fillStyle = 'rgba(20,21,28,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(740, 740, 240, 360, 30); ctx.fill(); ctx.stroke(); ctx.restore();
    for (let i = 0; i < 12; i++) { const r = mulberry(5900 + i), x = 780 + (i % 3) * 80, y = 790 + Math.floor(i / 3) * 76; glow(x, y, 16, i % 4 ? '232,184,102' : '255,214,160', Ph * sstep(61.0 + i * .1, 61.2 + i * .1, t), 4); text(['🚗', '🏠', '✈', '⌚'][i % 4], x, y + 2, { font: SANS, size: 24, align: 'center', color: CREAM, alpha: Ph * sstep(61.0 + i * .1, 61.2 + i * .1, t) }); }
  }
}

// ======================================================================== ⑤ 看不见
function sceneUnseen(t) {
  if (t < UNSEEN - .2 || t > CLIMAX + .3) return;
  const A = sstep(UNSEEN + .2, UNSEEN + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('想买的时候，先问一句', 64.5, 67.6, CREAM);
  hd('没人看得见，还想要吗？', 67.9, 71.9, TEALC, `rgba(${T_RGB},.4)`);
  hd('想要的留下', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('两千多年前：', 76.4, 0, CREAM);
  const bag = (x, y, s, a, col) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-50, -40); ctx.lineTo(50, -40); ctx.lineTo(60, 60); ctx.lineTo(-60, 60); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -40, 26, PI, TAU); ctx.stroke(); ctx.restore(); };
  const B1 = A * sstep(64.6, 65.1, t) * (1 - sstep(71.9, 72.3, t));
  if (B1 > 0) {
    bag(540, 1040, 1.6, B1, GOLD);
    const eye = B1 * (1 - sstep(68.4, 69.4, t));                                                      // 一只眼睛，慢慢闭上
    ctx.save(); ctx.globalAlpha = Math.max(eye, B1 * .4); ctx.strokeStyle = CREAM; ctx.lineWidth = 4;
    const open = 1 - sstep(68.4, 69.4, t); ctx.beginPath(); ctx.ellipse(540, 860, 70, 34 * open + 2, 0, 0, TAU); ctx.stroke();
    if (open > .2) { ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(540, 860, 14 * open, 0, TAU); ctx.fill(); } ctx.restore();
    text('?', 680, 1040, { font: SERIF, size: 70, weight: 900, align: 'center', color: TEALC, alpha: B1 * sstep(69.4, 69.8, t) });
  }
  const B2 = A * sstep(72.4, 72.9, t);
  if (B2 > 0) {
    const put = E.io(prog(t, 73.6, 74.8));
    bag(340, 1060, 1.1, B2, TEALC); text('真想要的', 340, 1180, { font: SANS, size: 28, align: 'center', color: TEALC, alpha: B2 });
    bag(740, 1060 + 60 * put, 1.1 - .2 * put, B2 * (1 - .6 * put), GREYP); text('想被看见的：放一放', 740, 1200, { font: SANS, size: 28, align: 'center', color: DIM, alpha: B2 * sstep(73.6, 74.0, t) });
    glow(340, 1040, 40, O_RGB, B2 * .5, 8);
  }
}

// ======================================================================== ⑥ 知足
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), G = 1180;
  warmth(A * (1 + .5 * fin), 540, 1080, 760);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, G); ctx.lineTo(1000, G); ctx.stroke(); ctx.restore();
  const back = E.io(prog(t, CLIMAX + 4, CLIMAX + 10));                                                 // 往外比的那些箭头，一支支收回来，变成自家窗里的光
  const targets = [[160, 860], [300, 760], [780, 760], [920, 860], [540, 720]];
  targets.forEach(([x, y], i) => {
    const k = clamp(back * 1.4 - i * .1, 0, 1), ex = lerp(x, 540, k), ey = lerp(y, 1010, k);
    house(x, G, .7, A * (1 - .7 * back), GREYP, 0, (i % 2));
    if (k < 1) { ctx.save(); ctx.globalAlpha = A * (1 - k); ctx.strokeStyle = PINK; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(540, 1010); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
  });
  house(540, G, 1.5, A, GOLD, .4 + .6 * Math.max(back, fin));
  person(660, G - 4, .7, A, mixc(TEALC, GOLD, back));
  if (fin > 0) for (let i = 0; i < 24; i++) { const r = mulberry(5400 + i), x = 380 + r() * 320, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1; glow(x + 16 * Math.sin(t + i), 1150 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3); }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('胜人者有力，自胜者强。', 540, 430, { ...big, size: 54, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.5), qa);
  typeText('知足者富。', 540, 540, { ...big, size: 80, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.8, CLIMAX + 2.6), qa);
  typeText('——《道德经》第三十三章', 540, 630, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.8, CLIMAX + 3.4), qa);
  typeText('少比一点，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('多过一点。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneFence(t); scenePick(t); sceneEndless(t); sceneUnseen(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2020', 'Agarwal, Mikhed & Scholnick · Rev Financ Stud', 8.2, 35.3, T);
  stamp('1998', 'Solnick & Hemenway · J Econ Behav Organ', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(59);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 E 小调里，最后一个和弦是 E 大调）
const NOTE = { E3: 164.81, G3: 196.00, Gs3: 207.65, B3: 246.94, E4: 329.63, G4: 392.00, Gs4: 415.30, B4: 493.88, E5: 659.25, G5: 783.99, B5: 987.77 };
const EM_SHIM = [NOTE.G5, NOTE.B4, NOTE.E5, NOTE.E4, NOTE.B3], E_SHIM = [NOTE.Gs4 * 2, NOTE.B4, NOTE.E5, NOTE.E4, NOTE.B3], EM_SWELL = [41.20, 61.74, 82.41, 98.00, 123.47];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.B4, gain: .05 }], [1.0, 'tink', { f: NOTE.E5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.E3, NOTE.G3, NOTE.B3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.B4, gain: .1 }]);
  for (let i = 0; i < 4; i++) c.push([Q.REVEAL + .4 + i * .15, 'tick', { gain: .08 }]);
  c.push([11.0, 'thud', { gain: .08 }], [11.4, 'thud', { gain: .08 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EM_SHIM, gain: .28 }]);
  c.push([24.2, 'whoosh', { dur: 1.2, gain: .12 }], [24.6, 'page', { gain: .12 }], [28.0, 'tink', { f: NOTE.G5, gain: .06 }], [31.7, 'page', { gain: .18 }]);
  c.push([PICK, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'page', { gain: .12 }], [45.0, 'page', { gain: .12 }]);
  c.push([49.1, 'chord', { f: [NOTE.E3, NOTE.G3, NOTE.B3], gain: .1 }], [49.3, 'bar', { f0: 200, f1: 400, dur: 1.0, gain: .06 }]);
  c.push([ENDLESS, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'riser', { dur: 3.0, gain: .08 }]);
  for (let i = 0; i < 6; i++) c.push([54.4 + i * 1.6, 'tick', { gain: .08 }]);
  for (let i = 0; i < 12; i++) c.push([61.0 + i * .1, 'tick', { gain: .05 }]);
  c.push([64.7, 'page', { gain: .1 }], [68.4, 'bar', { f0: 300, f1: 200, dur: 1.0, gain: .05 }], [72.6, 'tink', { f: NOTE.E5, gain: .06 }], [73.6, 'thud', { gain: .05 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: EM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 82.41, gain: .14 }]);
  c.push([CLIMAX + 4, 'whoosh', { dur: 6, gain: .08 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: E_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.E3, NOTE.Gs3, NOTE.B3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
