// ======================================================================== No.54 互惠主义：别人对你好，就一定要还吗？
// 第七季·人和人之间的主义 ①。开头是一道选择题：服务员递账单时送糖，哪种给法小费最多？（Strohmetz, Rind, Fisher & Lynn, 2002）
// 音乐：原创配乐（music.py，G 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一问一答：三个音往上，三个音低八度回来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 一瓶可乐（每拍一个鼓点） · 53.33 先给一点（紧张） · 64.0 不是债（只剩钢琴） · 80.0 高潮：木瓜和琼琚 · 96.0 G 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), COKE = BT(56), PULL = BT(80), THANK = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['两颗糖', 0, LIFT], ['有来有往', LIFT, COKE], ['一瓶可乐', COKE, PULL], ['先给一点', PULL, THANK], ['不是债', THANK, CLIMAX], ['木瓜', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.54';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '服务员递账单的时候，顺手送你糖。'],
  [4.1, 7.6, '哪种送法，拿到的小费最多？先猜一个。'],
  [8.2, 10.4, '答案是 C：小费多了约两成。'],
  [10.8, 13.3, '同样是两颗糖，回头的那一下，'],
  [13.6, 15.7, '像在说：这是特意给你的。'],
  [16.3, 19.6, '社会学家古尔德纳认为，几乎每种文化里，'],
  [19.9, 23.7, '都有同一条规矩：别人对你好，你要还。'],
  [24.0, 27.4, '收了好处不还，我们就浑身不自在。'],
  [27.7, 31.3, '这份不自在，是人和人之间的一根线。'],
  [31.6, 35.3, '这就是「互惠主义」：有来，就要有往。'],
  [37.6, 40.6, '心理学家里根做过一个实验：'],
  [40.9, 44.6, '一个陌生人，顺手请你喝了一瓶可乐；'],
  [44.9, 48.6, '过一会儿他找你买彩票，你买的约是别人的两倍。'],
  [48.9, 52.9, '平均下来，花的钱比那瓶可乐还多。'],
  [53.6, 57.6, '可这根线，也能被人拿来拉你。'],
  [57.9, 60.6, '免费试吃、先送小礼物，'],
  [60.8, 63.4, '都是先给你一点，再等你回一点。'],
  [64.3, 67.6, '所以，收到好意的时候，先说声谢谢；'],
  [67.9, 71.9, '真心想还，再还；觉得被套路了，也可以不还。'],
  [72.2, 75.9, '好意，不该变成一笔债。'],
  [76.3, 79.6, '两千多年前，《诗经》里写：'],
  [84.9, 88.6, '你送我木瓜，我回你美玉；'],
  [88.9, 92.6, '不是为了还清，是想一直好下去。'],
  [98.4, 103.0, '评论区：最近一次让你想“还”的好意，是什么？'],
];
const BIGLINES = [
  [80.2, 92.6, '「投我以木瓜，报之以琼琚。匪报也，永以为好也。」——《诗经》'],
  [93.4, 98.0, '好意不是债，是开始。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [COKE - .5, .2], [COKE, .06], [THANK, .06],
  [THANK + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、糖、账单、礼物、可乐、彩票
const PINK = '#f0a0a0', GOLD = '#ffd2a0', WARMC = '#ffb36b', JADE = '#7fe3d3';
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function candy(x, y, s, a, glowK = 0) {                                                             // 一颗包着糖纸的糖
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (glowK > 0) { ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 22 * glowK; }
  ctx.fillStyle = '#f08a8a';
  ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-38, -14); ctx.lineTo(-38, 14); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(38, -14); ctx.lineTo(38, 14); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, 24, 17, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-8, -15); ctx.lineTo(4, 15); ctx.stroke(); ctx.restore();
}
function bill(x, y, s, a) {                                                                          // 账单
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(236,230,218,.92)';
  ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(40, -60); ctx.lineTo(40, 60);
  for (let i = 0; i < 8; i++) ctx.lineTo(40 - (i + .5) * 10, 60 - (i % 2 ? 0 : 7));
  ctx.lineTo(-40, 60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(26,27,34,.45)'; for (let i = 0; i < 4; i++) ctx.fillRect(-28, -42 + i * 20, i === 3 ? 30 : 56, 6);
  ctx.fillStyle = 'rgba(26,27,34,.75)'; ctx.fillRect(4, 34, 24, 8); ctx.restore();
}
function gift(x, y, s, a, col = WARMC, glowK = 0) {                                                  // 礼物盒
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (glowK > 0) { ctx.shadowColor = col; ctx.shadowBlur = 24 * glowK; }
  ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-30, -22, 60, 50, 6); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.roundRect(-34, -34, 68, 14, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.fillRect(-4, -34, 8, 62);
  ctx.beginPath(); ctx.ellipse(-10, -40, 10, 6, -.5, 0, TAU); ctx.ellipse(10, -40, 10, 6, .5, 0, TAU); ctx.stroke(); ctx.restore();
}
function coke(x, y, s, a) {                                                                          // 一瓶玻璃瓶可乐
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(120,40,30,.9)'; ctx.strokeStyle = 'rgba(236,230,218,.75)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-8, -70); ctx.lineTo(8, -70); ctx.lineTo(9, -40); ctx.quadraticCurveTo(22, -20, 18, 0); ctx.quadraticCurveTo(14, 20, 20, 40); ctx.lineTo(20, 62);
  ctx.quadraticCurveTo(20, 70, 12, 70); ctx.lineTo(-12, 70); ctx.quadraticCurveTo(-20, 70, -20, 62); ctx.lineTo(-20, 40); ctx.quadraticCurveTo(-14, 20, -18, 0); ctx.quadraticCurveTo(-22, -20, -9, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(236,230,218,.85)'; ctx.fillRect(-19, 6, 38, 14); ctx.fillStyle = '#d9484d'; ctx.fillRect(-9, -76, 18, 7); ctx.restore();
}
function ticket(x, y, s, a, col = GOLD) {                                                             // 彩票
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-44, -20); ctx.lineTo(44, -20); ctx.lineTo(44, -6); ctx.arc(44, 0, 6, -PI / 2, PI / 2, true); ctx.lineTo(44, 20); ctx.lineTo(-44, 20); ctx.lineTo(-44, 6); ctx.arc(-44, 0, 6, PI / 2, -PI / 2, true); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(22, -16); ctx.lineTo(22, 16); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = col; ctx.fillRect(-32, -6, 40, 4); ctx.fillRect(-32, 4, 26, 4); ctx.restore();
}
function papaya(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.35);
  const g = ctx.createLinearGradient(-30, 0, 30, 0); g.addColorStop(0, '#9cc95a'); g.addColorStop(1, '#f2b34a'); ctx.fillStyle = g;
  ctx.shadowColor = 'rgba(242,179,74,.7)'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.ellipse(0, 0, 24, 36, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.strokeStyle = '#6a8a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(4, -46); ctx.stroke(); ctx.restore();
}
function jade(x, y, s, a) {                                                                          // 琼琚：一块玉佩
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(127,227,211,.9)'; ctx.shadowBlur = 20; ctx.strokeStyle = JADE; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
  ctx.lineWidth = 2; ctx.strokeStyle = '#d9484d'; ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -50); ctx.moveTo(0, 34); ctx.lineTo(0, 54); ctx.moveTo(-4, 54); ctx.lineTo(4, 54); ctx.stroke(); ctx.restore();
}
function thread(x1, y1, x2, y2, a, k = 1, sag = 40, col = GOLD) {                                     // 两个人之间的一根线
  drawOn(() => { ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + sag, x2, y2); }, Math.hypot(x2 - x1, y2 - y1) * 1.1, k, col, 3, a, col);
}

// ======================================================================== ① 两颗糖（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('服务员递账单时送糖：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('哪种送法，小费最多？', 540, 560, { ...big, size: 76, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const up = E.io(prog(t, Q.REVEAL, Q.REVEAL + .8)), iy = lerp(990, 860, up), xs = [200, 540, 880];
  xs.forEach((x, i) => {                                                                              // 三种送法
    const hiC = i === 2 ? sstep(Q.REVEAL, Q.REVEAL + .4, t) : 0, dim = i < 2 ? 1 - .5 * sstep(Q.REVEAL, Q.REVEAL + .4, t) : 1;
    bill(x - 56, iy, 1.15, dim);
    if (i === 0) candy(x + 52, iy + 8, 1.0, dim);
    if (i === 1) { candy(x + 52, iy - 14, 1.0, dim); candy(x + 52, iy + 30, 1.0, dim); }
    if (i === 2) {                                                                                      // 先给一颗，走开，再回头送来一颗
      candy(x + 52, iy + 30, 1.0, 1, hiC);
      const k = (t % 2.4) / 2.4, m = hiC > 0 ? 1 : E.io(sstep(.15, .7, k)), q = 1 - m;
      const px = q * q * (x + 100) + 2 * q * m * (x + 160) + m * m * (x + 52), py = q * q * (iy - 120) + 2 * q * m * (iy - 60) + m * m * (iy - 14);
      ctx.save(); ctx.globalAlpha = .7; ctx.strokeStyle = 'rgba(255,200,140,.8)'; ctx.lineWidth = 3; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(x + 100, iy - 120); ctx.quadraticCurveTo(x + 160, iy - 60, x + 52, iy - 14); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      candy(px, py, 1.0, hiC > 0 ? 1 : sstep(0, .12, k) * (1 - sstep(.92, 1, k)), hiC);
    }
  });
  const C = sstep(Q.REVEAL + .3, Q.REVEAL + .8, t);
  if (C > 0) {
    const base = 1200, k = E.out(prog(t, Q.REVEAL + .4, Q.REVEAL + 1.4));
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(110, base); ctx.lineTo(970, base); ctx.stroke(); ctx.restore();
    [[200, 26, '#9aa3b2'], [540, 120, '#c3cad6'], [880, 200, WARMC]].forEach(([x, h, col], i) => {
      ctx.save(); ctx.globalAlpha = C; ctx.fillStyle = col; if (i === 2) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 20; }
      ctx.fillRect(x - 60, base - h * k, 120, h * k); ctx.restore();
    });
    text('约 +20%', 880, base - 200 * k - 30, { font: SERIF, size: 40, weight: 900, align: 'center', color: WARMC, alpha: C * k });
    [['一次一颗', 200], ['一次两颗', 540], ['一颗，回头再一颗', 880]].forEach(([s, x]) => text(s, x, base + 44, { font: SANS, size: 26, align: 'center', color: x === 880 ? WARMC : DIM, alpha: C }));
    text('小费比不送糖多了多少（示意）', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: C });
    const two = sstep(10.9, 11.4, t);
    ['2 颗', '2 颗'].forEach((s, i) => pill(s, [540, 880][i], 730, two * (1 - sstep(13.5, 13.9, t)), { size: 26, stroke: 'rgba(255,200,140,.7)', color: GOLD }));
  }
  text('同样两颗糖', 540, 560, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t) * (1 - sstep(13.5, 13.9, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('回头那一下：特意给你的', 540, 560, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: sstep(13.7, 14.2, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('C · 多约两成', 540, 560, { font: SERIF, size: 68, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 一次一颗', 190], ['B · 一次两颗', 520], ['C · 一颗，回头再一颗', 870]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 有来有往
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('互惠主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('RECIPROCITY', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ①', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneNorm(t) {
  if (t < 19.7 || t > COKE + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(COKE - .6, COKE - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('别人对你好，你要还', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('不还，浑身不自在', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('人和人之间的一根线', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const L = 320, R = 760, y = 1080;
    person(L, y, 1.1, D, JADE); person(R, y, 1.1, D, WARMC);
    const g1 = E.io(prog(t, 20.2, 21.6)), g2 = E.io(prog(t, 22.0, 23.4));                          // 给过去，再还回来
    gift(lerp(L + 70, R - 70, g1), 1010 - 70 * Math.sin(PI * g1), 1.0, D * sstep(20.0, 20.3, t) * (1 - sstep(27.0, 27.4, t)), WARMC, 1 - g1);
    gift(lerp(R - 70, L + 70, g2), 1010 - 70 * Math.sin(PI * g2), .9, D * sstep(21.9, 22.1, t) * (1 - sstep(23.7, 24.0, t)), JADE);
    text('给', 540, 900, { font: SERIF, size: 36, weight: 900, align: 'center', color: WARMC, alpha: D * sstep(20.4, 20.8, t) * (1 - sstep(21.8, 22.1, t)) });
    text('还', 540, 900, { font: SERIF, size: 36, weight: 900, align: 'center', color: JADE, alpha: D * sstep(22.2, 22.6, t) * (1 - sstep(23.7, 24.0, t)) });
    const owe = D * sstep(24.2, 24.7, t) * (1 - sstep(27.4, 27.8, t));                                // 只收不还：头上一团乱线
    if (owe > 0) {
      ctx.save(); ctx.globalAlpha = owe; ctx.strokeStyle = PINK; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 3 + t * 2, r = 18 + 10 * Math.sin(i * 1.7); const px = R + r * Math.cos(a), py = y - 160 + r * .6 * Math.sin(a); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke(); ctx.restore();
      text('欠着', R, y + 80, { font: SANS, size: 28, align: 'center', color: PINK, alpha: owe });
    }
    thread(L + 30, y - 40, R - 30, y - 40, D, prog(t, 27.9, 28.9), 50);
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('互惠主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('有来，就要有往', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 一瓶可乐
function sceneCoke(t) {
  if (t < COKE - .3 || t > PULL + .2) return;
  const A = sstep(COKE - .1, COKE + .5, t) * (1 - sstep(PULL - .6, PULL - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - COKE) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('一个实验', 37.7, 40.6, CREAM);
  hd('陌生人请你喝了瓶可乐', 41.0, 44.6, CREAM);
  hd('买彩票：约 2 倍', 45.0, 48.6, GOLD, `rgba(${O_RGB},.4)`);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('花的钱 > 那瓶可乐', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: WARMC, alpha: A * sstep(49.0, 49.5, t), glow: `rgba(${O_RGB},.4)`, blur: 16 }); ctx.restore();
  const P = A * (1 - sstep(44.6, 45.0, t));
  if (P > 0) {
    person(300, 1080, 1.1, P, JADE); person(780, 1080, 1.1, P, CREAM);
    text('陌生人', 300, 1170, { font: SANS, size: 26, align: 'center', color: JADE, alpha: P });
    text('你', 780, 1170, { font: SANS, size: 26, align: 'center', color: CREAM, alpha: P });
    const c = E.io(prog(t, 41.2, 42.8));
    coke(lerp(370, 710, c), 1000 - 60 * Math.sin(PI * c), 1.0, P * sstep(40.9, 41.2, t));
    text('?', 540, 900, { font: SERIF, size: 80, weight: 900, align: 'center', color: '#6f7786', alpha: P * sstep(38.0, 38.4, t) * (1 - sstep(40.8, 41.1, t)) });
  }
  const T2 = A * sstep(45.0, 45.4, t) * (1 - sstep(48.7, 49.1, t));
  if (T2 > 0) {                                                                                       // 两摞彩票
    const n1 = 3, n2 = 6, k = prog(t, 45.2, 47.0);
    for (let i = 0; i < n1; i++) ticket(320, 1170 - i * 46, 1.3, T2 * sstep(i / n2, i / n2 + .08, k), '#c3cad6');
    for (let i = 0; i < n2; i++) ticket(760, 1170 - i * 46, 1.3, T2 * sstep(i / n2, i / n2 + .08, k), GOLD);
    text('没收到可乐', 320, 1250, { font: SANS, size: 26, align: 'center', color: DIM, alpha: T2 });
    text('收到可乐', 760, 1250, { font: SANS, size: 26, align: 'center', color: GOLD, alpha: T2 });
  }
  const S = A * sstep(49.1, 49.5, t);
  if (S > 0) {                                                                                        // 天平：彩票那头更重
    const tilt = .16 * E.out(prog(t, 49.4, 50.6)), cx = 540, cy = 980;
    ctx.save(); ctx.globalAlpha = S; ctx.strokeStyle = CREAM; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, 1220); ctx.moveTo(cx - 80, 1220); ctx.lineTo(cx + 80, 1220); ctx.stroke();
    ctx.translate(cx, cy); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(260, 0); ctx.stroke(); ctx.restore();
    const ly = cy - 260 * Math.sin(tilt), ry = cy + 260 * Math.sin(tilt);
    coke(cx - 260 * Math.cos(tilt), ly - 58, .8, S);
    for (let i = 0; i < 3; i++) ticket(cx + 260 * Math.cos(tilt), ry - 26 - i * 34, 1.0, S, GOLD);
    text('那瓶可乐', cx - 260, 1100, { font: SANS, size: 26, align: 'center', color: DIM, alpha: S });
    text('买彩票花的钱', cx + 260, 1150, { font: SANS, size: 26, align: 'center', color: GOLD, alpha: S });
  }
}

// ======================================================================== ④ 先给一点
function scenePull(t) {
  if (t < PULL - .3 || t > THANK + .2) return;
  const A = sstep(PULL - .1, PULL + .5, t) * (1 - sstep(THANK - .7, THANK - .1, t));
  if (A <= 0) return;
  text('这根线，也能拉你', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: PINK, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('免费试吃、小礼物', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('先给一点，再等你回', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(60.9, 61.4, t), glow: `rgba(${O_RGB},.4)`, blur: 16 });
  const P = A * sstep(53.8, 54.3, t) * (1 - sstep(57.6, 58.0, t));
  if (P > 0) {                                                                                        // 一根线把人往柜台那边拉
    const tug = .5 + .5 * Math.sin((t - 54.4) * 5), lean = 18 * sstep(54.6, 55.2, t) * tug;
    ctx.save(); ctx.globalAlpha = P; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.7)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(150, 980, 260, 140, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = `rgba(${O_RGB},.8)`; ctx.fillRect(150, 950, 260, 30); ctx.restore();
    text('店', 280, 1060, { font: SERIF, size: 44, weight: 900, align: 'center', color: CREAM, alpha: P });
    person(780 - lean, 1100, 1.1, P, CREAM);
    thread(410, 1040, 760 - lean, 1030, P, prog(t, 54.0, 54.8), 20 - 30 * tug, PINK);
  }
  const S = A * sstep(58.0, 58.4, t) * (1 - sstep(60.6, 61.0, t));
  if (S > 0) {
    ctx.save(); ctx.globalAlpha = S; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(330, 1080, 130, 26, 0, 0, TAU); ctx.stroke(); ctx.restore();   // 试吃盘
    for (let i = 0; i < 4; i++) { const x = 270 + i * 40; ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = '#e8b866'; ctx.fillRect(x - 12, 1050, 24, 20); ctx.strokeStyle = CREAM; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 1050); ctx.lineTo(x, 1020); ctx.stroke(); ctx.restore(); }
    text('免费试吃', 330, 1170, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: S });
    gift(750, 1060, 1.5, S * sstep(58.6, 59.0, t), WARMC, .6);
    text('送你的', 750, 1170, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: S * sstep(58.6, 59.0, t) });
  }
  const X = A * sstep(60.9, 61.3, t);
  if (X > 0) {                                                                                        // 小礼物 → 一大袋
    gift(260, 1060, .9, X, WARMC);
    text('给你一点', 260, 1160, { font: SANS, size: 28, align: 'center', color: DIM, alpha: X });
    drawOn(() => { ctx.moveTo(360, 1060); ctx.lineTo(640, 1060); }, 280, prog(t, 61.3, 61.9), GOLD, 4, X, GOLD);
    text('→', 650, 1062, { font: SANS, size: 40, align: 'center', color: GOLD, alpha: X * sstep(61.8, 62.0, t) });
    const B = X * sstep(61.9, 62.3, t);
    ctx.save(); ctx.globalAlpha = B; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(720, 960, 180, 180, 12); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(810, 960, 40, PI, TAU); ctx.stroke(); ctx.restore();
    text('你回一大袋', 810, 1190, { font: SANS, size: 28, align: 'center', color: GOLD, alpha: B });
  }
}

// ======================================================================== ⑤ 不是债
function sceneThank(t) {
  if (t < THANK - .2 || t > CLIMAX + .3) return;
  const A = sstep(THANK + .2, THANK + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('先说声谢谢', 64.5, 67.6, CREAM);
  hd('想还再还，被套路可以不还', 67.9, 71.9, JADE, `rgba(${T_RGB},.4)`);
  hd('好意，不是债', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('两千多年前：', 76.4, 0, CREAM);
  const S = A * sstep(64.6, 65.1, t) * (1 - sstep(67.6, 68.0, t));
  if (S > 0) {
    person(400, 1100, 1.1, S, CREAM); gift(400, 1000, .8, S, WARMC, .5);
    pill('谢谢', 640, 930, S * sstep(65.2, 65.6, t), { size: 40, stroke: `rgba(${O_RGB},.8)`, color: GOLD });
  }
  const C2 = A * sstep(68.0, 68.5, t) * (1 - sstep(71.9, 72.3, t));
  if (C2 > 0) {
    [['真心想还', '再还', JADE, 330, 68.2], ['觉得被套路', '可以不还', PINK, 750, 69.2]].forEach(([a, b, col, x, t0]) => {
      const k = C2 * sstep(t0, t0 + .4, t);
      ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = 'rgba(30,31,40,.94)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 170, 900, 340, 300, 24); ctx.fill(); ctx.stroke(); ctx.restore();
      text(a, x, 990, { font: SERIF, size: 40, weight: 900, align: 'center', color: CREAM, alpha: k });
      text('↓', x, 1060, { font: SERIF, size: 36, weight: 900, align: 'center', color: DIM, alpha: k });
      text(b, x, 1130, { font: SERIF, size: 44, weight: 900, align: 'center', color: col, alpha: k });
    });
  }
  const I = A * sstep(72.4, 72.9, t);
  if (I > 0) {                                                                                        // 一张欠条被划掉，变成一点暖光
    const x = E.io(prog(t, 73.4, 74.4)), melt = sstep(74.8, 76.0, t);
    ctx.save(); ctx.globalAlpha = I * (1 - melt); ctx.fillStyle = 'rgba(236,230,218,.94)'; ctx.fillRect(360, 880, 360, 300); ctx.restore();
    text('欠条', 540, 960, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#1a1b22', alpha: I * (1 - melt) });
    ctx.save(); ctx.globalAlpha = I * (1 - melt); ctx.fillStyle = 'rgba(26,27,34,.35)'; for (let i = 0; i < 3; i++) ctx.fillRect(400, 1020 + i * 44, i === 2 ? 160 : 280, 10); ctx.restore();
    drawOn(() => { ctx.moveTo(380, 1150); ctx.lineTo(700, 900); }, 410, x, '#c2410c', 7, I * (1 - melt));
    glow(540, 1030, 40 + 40 * melt, O_RGB, I * melt, 10);
    gift(540, 1040, 1.2, I * melt, GOLD, melt);
  }
}

// ======================================================================== ⑥ 木瓜和琼琚
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), L = 330, R = 750, y = 1120;
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  person(L, y, 1.1, A, JADE); person(R, y, 1.1, A, WARMC);
  const arc = (k, dir) => [lerp(dir > 0 ? L + 60 : R - 60, dir > 0 ? R - 60 : L + 60, k), 1040 - 150 * Math.sin(PI * k)];
  const p1 = E.io(prog(t, CLIMAX + .6, CLIMAX + 2.6)), p2 = E.io(prog(t, CLIMAX + 3.2, CLIMAX + 5.2));
  if (t < CLIMAX + 3.0) { const [x, yy] = arc(p1, 1); papaya(x, yy, 1.1, A * sstep(CLIMAX + .4, CLIMAX + .7, t)); }
  else papaya(R - 20, 1000, .9, A);
  if (t > CLIMAX + 3.0) { const [x, yy] = arc(p2, -1); jade(x, t < CLIMAX + 5.3 ? yy : 1000, 1.0, A); }
  const loop = sstep(CLIMAX + 5.4, CLIMAX + 6.4, t);                                                  // 之后一直来来往往：一圈不断的光
  if (loop > 0) {
    ctx.save(); ctx.globalAlpha = A * loop * (.5 + .3 * fin); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.ellipse(540, 1000, 200, 70 + 10 * fin, 0, 0, TAU); ctx.stroke(); ctx.restore();
    for (let i = 0; i < 2; i++) { const a = (t - CLIMAX) * 1.4 + i * PI; glow(540 + 200 * Math.cos(a), 1000 + (70 + 10 * fin) * Math.sin(a), 8, i ? T_RGB : O_RGB, A * loop, 6); }
  }
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const r = mulberry(5400 + i), x = 380 + r() * 320, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1150 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('投我以木瓜，报之以琼琚。', 540, 420, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.5), qa);
  typeText('匪报也，永以为好也。', 540, 528, { ...big, size: 64, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.7, CLIMAX + 2.8), qa);
  typeText('——《诗经·卫风·木瓜》', 540, 616, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.0, CLIMAX + 3.6), qa);
  typeText('好意不是债，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('是开始。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneNorm(t); sceneCoke(t); scenePull(t); sceneThank(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2002', 'Strohmetz et al. · J Appl Soc Psychol', 8.2, 15.9, T);
  stamp('1960', 'Gouldner · Am Sociol Rev', 16.3, 35.3, T);
  stamp('1971', 'Regan · J Exp Soc Psychol', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(54);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 G 小调里，最后一个和弦是 G 大调）
const NOTE = { G2: 98.00, Bb2: 116.54, B2: 123.47, D3: 146.83, G3: 196.00, Bb3: 233.08, D4: 293.66, G4: 392.00, Bb4: 466.16, B4: 493.88, D5: 587.33, G5: 783.99, Bb5: 932.33 };
const GM_SHIM = [NOTE.Bb4, NOTE.D4, NOTE.G4, NOTE.G3, NOTE.D3], G_SHIM = [NOTE.B4, NOTE.D4, NOTE.G4, NOTE.G3, NOTE.D3], GM_SWELL = [49.00, 73.42, 98.00, 116.54, 146.83];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.D5, gain: .05 }], [1.0, 'tink', { f: NOTE.G4, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.G2, NOTE.Bb2, NOTE.D3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.D5, gain: .1 }]);
  c.push([Q.REVEAL + .4, 'bar', { f0: 196, f1: 392, dur: 1.0, gain: .06 }], [10.9, 'tink', { f: NOTE.G4, gain: .05 }], [13.8, 'tink', { f: NOTE.Bb4, gain: .05 }], [14.0, 'tink', { f: NOTE.D5, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: GM_SHIM, gain: .28 }]);
  c.push([20.2, 'whoosh', { dur: .7, gain: .1 }], [21.6, 'tink', { f: NOTE.D5, gain: .05 }], [22.0, 'whoosh', { dur: .7, gain: .1 }], [23.4, 'tink', { f: NOTE.G4, gain: .05 }]);
  c.push([24.3, 'bar', { f0: 330, f1: 220, dur: 1.0, gain: .05 }], [27.9, 'swell', { dur: 2.0, f: GM_SWELL, gain: .1 }], [31.7, 'page', { gain: .18 }]);
  c.push([COKE, 'whoosh', { dur: .5, gain: .25 }], [41.2, 'whoosh', { dur: .8, gain: .12 }], [42.8, 'thud', { gain: .07 }]);
  for (let i = 0; i < 6; i++) c.push([45.2 + i * .3, 'tick', { gain: .12 }]);
  c.push([49.1, 'chord', { f: [NOTE.G2, NOTE.Bb2, NOTE.D3], gain: .1 }], [49.5, 'thud', { gain: .08 }]);
  c.push([PULL, 'whoosh', { dur: .5, gain: .22 }], [54.0, 'bar', { f0: 220, f1: 165, dur: 1.2, gain: .06 }], [58.6, 'tink', { f: NOTE.Bb4, gain: .05 }], [61.3, 'whoosh', { dur: .6, gain: .1 }], [61.9, 'thud', { gain: .07 }]);
  c.push([65.2, 'tink', { f: NOTE.G4, gain: .06 }], [68.2, 'page', { gain: .12 }], [69.2, 'page', { gain: .12 }], [72.4, 'page', { gain: .18 }], [73.4, 'dust', { dur: 1.0, gain: .05 }], [74.8, 'tink', { f: NOTE.D5, gain: .06 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: GM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: GM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 98.00, gain: .14 }]);
  c.push([CLIMAX + 2.6, 'tink', { f: NOTE.D5, gain: .07 }], [CLIMAX + 5.2, 'tink', { f: NOTE.G5, gain: .07 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: G_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.G2, NOTE.B2, NOTE.D3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
