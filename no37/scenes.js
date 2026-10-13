// ======================================================================== No.37 形式主义：仪式感，真的有用吗？
// 第五季·看不见的主义 ④。开头是一道选择题：同一块巧克力，一组直接吃，一组按步骤慢慢吃，哪组觉得更好吃？（Vohs et al., 2013）
// 音乐：原创配乐（music.py，A 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机在数步骤：一、二、三，每一句都比上一句高一级。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 形式主义（每拍一个鼓点） · 53.33 告别（紧张） · 64.0 小王子（只剩钢琴） · 80.0 高潮：某一天亮起来 · 96.0 A 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), FORM = BT(56), LOSS = BT(80), PRINCE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['巧克力', 0, LIFT], ['卡拉 OK', LIFT, FORM], ['形式主义', FORM, LOSS], ['告别', LOSS, PRINCE], ['小王子', PRINCE, CLIMAX], ['某一天', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.37';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '同一块巧克力，一组直接吃；'],
  [4.1, 7.6, '一组先掰开、按步骤慢慢拆。哪组觉得更好吃？'],
  [8.2, 10.4, '答案是：按步骤吃的那组。'],
  [10.8, 13.3, '他们觉得更好吃，也愿意多花钱。'],
  [13.6, 15.7, '多出来的，只是几个动作。'],
  [16.3, 19.6, '心理学家把这叫作「仪式」。'],
  [19.9, 23.7, '另一项实验，让人在陌生人面前唱卡拉 OK。'],
  [24.0, 27.4, '一组先做一套怪动作：画心情、撒盐、大声数数。'],
  [27.7, 31.3, '做了仪式的人，心跳更平稳，'],
  [31.6, 35.3, '唱得也更准。'],
  [37.6, 40.6, '平时我们骂「形式主义」：做样子，没用。'],
  [40.9, 44.6, '可实验里，同样几个动作，'],
  [44.9, 48.6, '叫它「仪式」，比叫它「随便做做」更管用。'],
  [48.9, 52.9, '生日的蜡烛、考前的早餐、出门那句「我走了」。'],
  [53.6, 57.6, '仪式，甚至能帮人面对失去。'],
  [57.9, 63.4, '失去之后做过仪式的人，悲伤更轻：因为觉得自己还能做点什么。'],
  [64.3, 67.6, '那形式主义，错在哪？'],
  [67.9, 71.9, '错在只剩下形式，忘了为什么。'],
  [72.2, 75.9, '「仪式感」这个说法，很多人是从一本童话里知道的。'],
  [76.3, 79.6, '《小王子》里，狐狸说：'],
  [84.9, 88.6, '形式不重要，'],
  [88.9, 92.6, '重要的是，你为什么需要它。'],
  [98.4, 103.0, '评论区：你有什么小小的仪式感？'],
];
const BIGLINES = [
  [80.2, 92.6, '「仪式，就是使某一天与其他日子不同，使某一时刻与其他时刻不同。」—— 《小王子》'],
  [93.4, 98.0, '留下仪式，丢掉走过场。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [FORM - .5, .2], [FORM, .06], [PRINCE, .06],
  [PRINCE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 巧克力、勾叉、柱子、蜡烛
function choco(x, y, s, a, o = {}) {                                                              // o.wrap：包装纸盖住多少；o.split：掰开的缝
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const sp = (o.split || 0) * 26;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side * sp / 2, 0);
    ctx.fillStyle = '#5a3a22'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.roundRect(side < 0 ? -150 : 0, -70, 150, 140, side < 0 ? [14, 0, 0, 14] : [0, 14, 14, 0]); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#6e4a2e'; for (let c = 0; c < 3; c++) for (let r = 0; r < 2; r++) { ctx.beginPath(); ctx.roundRect((side < 0 ? -150 : 0) + 10 + c * 46, -60 + r * 64, 38, 56, 6); ctx.fill(); }
    const w = o.wrap === undefined ? 1 : o.wrap;
    if (w > 0 && !(o.open && side > 0 && o.open > 0)) { ctx.fillStyle = 'rgba(236,228,210,.96)'; ctx.fillRect(side < 0 ? -154 : 0, -74, 154 * w, 148); ctx.fillStyle = 'rgba(229,72,77,.85)'; ctx.fillRect(side < 0 ? -154 : 0, -14, 154 * w, 28); }
    ctx.restore();
  }
  if (o.dash) { ctx.strokeStyle = `rgba(242,161,74,${o.dash})`; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(0, -96); ctx.lineTo(0, 96); ctx.stroke(); }
  ctx.restore();
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
function candle(x, y, s, a, t, lit = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(236,230,218,.92)'; ctx.fillRect(-12, -70, 24, 90); ctx.strokeStyle = 'rgba(60,50,40,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(0, -80); ctx.stroke();
  ctx.restore();
  if (lit > 0) { const fx = x + Math.sin(t * 7 + x) * 1.5 * s, fy = y - 96 * s; glow(fx, fy, 10 * s, '255,190,110', a * lit, 5); ctx.save(); ctx.globalAlpha *= a * lit; ctx.fillStyle = '#ffd89a'; ctx.beginPath(); ctx.ellipse(fx, fy, 7 * s, 15 * s, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
function heartLine(x0, y, w, a, k, period, col) {                                                // 心电图：period 越小，跳得越快
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.beginPath();
  for (let i = 0; i <= 240 * k; i++) { const x = x0 + i / 240 * w, ph = (i / 240 * w / period) % 1; const yy = ph > .4 && ph < .46 ? -40 : ph > .46 && ph < .5 ? 26 : 0; i ? ctx.lineTo(x, y + yy) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
}

// ======================================================================== ① 巧克力（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('同一块巧克力：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('哪组觉得更好吃？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const L = 1 - sstep(10.5, 11.0, t), split = E.out(prog(t, 1.0, 1.6));
  choco(300, 900, .9, L, { wrap: 1 - E.out(prog(t, .6, 1.4)) });
  text('直接吃', 300, 1040, { font: SERIF, size: 36, weight: 900, align: 'center', color: CREAM, alpha: L });
  const rx = lerp(780, 540, sstep(10.6, 11.4, t)), ry = lerp(900, 800, sstep(10.6, 11.4, t));
  choco(rx, ry, .9, 1, { wrap: 1, split, dash: 1 - split, open: sstep(2.0, 2.4, t) });
  ['① 掰开', '② 拆一半', '③ 吃完再拆'].forEach((s, i) => text(s, 780, 1040 + i * 50, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: L * sstep(.8 + i * .5, 1.2 + i * .5, t) }));
  const R = sstep(10.8, 11.3, t);                                                                  // 更好吃，更愿意花钱
  if (R > 0) [['更好吃', 1010, 11.0], ['更愿意花钱', 1130, 11.8]].forEach(([s, y, t0]) => {
    const a = R * sstep(t0, t0 + .4, t); text(s, 500, y, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: a }); mark(true, 760, y, a, 30);
  });
  text('多出来的，只是几个动作', 540, 1250, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(13.6, 14.1, t), glow: `rgba(${O_RGB},.5)`, blur: 14 });
  text('B · 按步骤吃', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 直接吃', 220], ['B · 按步骤吃', 540], ['C · 一样', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 卡拉 OK
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('形式主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('FORMALISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ④', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function mic(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.35);
  ctx.fillStyle = '#2a2d38'; ctx.strokeStyle = 'rgba(236,230,218,.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-14, 0, 28, 150, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(200,205,215,.9)'; ctx.beginPath(); ctx.arc(0, -20, 38, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(60,64,78,.6)'; ctx.lineWidth = 2;
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(-36, -20 + i * 10); ctx.lineTo(36, -20 + i * 10); ctx.stroke(); }
  ctx.restore();
}
function sceneKaraoke(t) {
  if (t < 19.7 || t > FORM + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(FORM - .6, FORM - .05, t));
  if (A <= 0) return;
  const M = A * (1 - sstep(23.6, 24.1, t));
  if (M > 0) {
    ctx.save(); ctx.globalAlpha = M * .5; const g = ctx.createLinearGradient(540, 600, 540, 1200); g.addColorStop(0, 'rgba(255,214,150,.0)'); g.addColorStop(1, 'rgba(255,214,150,.18)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(500, 600); ctx.lineTo(580, 600); ctx.lineTo(780, 1220); ctx.lineTo(300, 1220); ctx.closePath(); ctx.fill(); ctx.restore();
    mic(540, 960, 1.3, M);
    text('在陌生人面前唱歌', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: M * sstep(20.2, 20.7, t) });
  }
  const R = A * sstep(24.0, 24.4, t) * (1 - sstep(27.4, 27.8, t));
  if (R > 0) [['✎ 画心情', 360, 880], ['∴ 撒盐', 720, 880], ['1 2 3 4 5', 360, 1060], ['揉掉，扔了', 720, 1060]].forEach(([s, x, y], i) => pill(s, x, y, R * sstep(24.2 + i * .5, 24.6 + i * .5, t), { size: 34, stroke: `rgba(${O_RGB},.6)`, color: '#ffd2a0' }));
  const H = A * sstep(27.7, 28.1, t);
  if (H > 0) {
    text('心跳', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: H * (1 - sstep(31.4, 31.8, t)) });
    text('唱得更准', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: H * sstep(31.6, 32.1, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
    const k = clamp(prog(t, 27.9, 30.5));
    text('没做仪式', 140, 820, { font: SANS, size: 26, color: '#f0a0a0', alpha: H }); heartLine(140, 900, 800, H, k, 70, 'rgba(240,160,160,.9)');
    text('做了仪式', 140, 1020, { font: SANS, size: 26, color: '#7fe3d3', alpha: H }); heartLine(140, 1100, 800, H, k, 120, 'rgba(127,227,211,.9)');
    mark(true, 860, 1200, H * sstep(31.8, 32.2, t), 30);
  }
}

// ======================================================================== ③ 形式主义：叫它“仪式”，就管用 · 生活里的小仪式
function sceneForm(t) {
  if (t < FORM - .3 || t > LOSS + .2) return;
  const A = sstep(FORM - .1, FORM + .5, t) * (1 - sstep(LOSS - .6, LOSS - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - FORM) / BEAT) % 1);
  const D = A * (1 - sstep(48.6, 49.0, t));
  typeText('形式主义', 540, 640, { ...big, size: 64, weight: 900 }, prog(t, 37.7, 38.4), D);
  typeText('做样子，没用？', 540, 730, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 38.3, 39.1), D);
  const S = D * sstep(40.9, 41.3, t);
  if (S > 0) {
    const hot = sstep(44.9, 45.4, t);
    [['「随便做做」', 300, 0], ['「仪式」', 780, 1]].forEach(([lab, x, me]) => {
      ctx.save(); ctx.globalAlpha = S; ctx.strokeStyle = me && hot ? ORANGE : 'rgba(236,230,218,.35)'; ctx.lineWidth = me && hot ? 3.5 : 2; if (me && hot) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 24 * hot; }
      ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.beginPath(); ctx.roundRect(x - 190, 830, 380, 380, 22); ctx.fill(); ctx.stroke(); ctx.restore();
      text(lab, x, 880, { font: SERIF, size: 40, weight: 900, align: 'center', color: me && hot ? '#ffd2a0' : CREAM, alpha: S });
      ['✎', '∴', '1 2 3'].forEach((g, i) => text(g, x - 110 + i * 110, 970, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#c3cad6', alpha: S }));
      text('同样的动作', x, 1040, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: S });
      bar(x, 1180, 90, (me ? 100 : 40) * E.out(prog(t, 45.0, 46.0)) * (1 + (me ? .04 * bk : 0)), me ? O_RGB : '154,163,178', S * hot);
    });
    text('效果（示意）', 540, 1250, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: S * hot });
  }
  const L = A * sstep(48.9, 49.4, t);
  if (L > 0) {
    const y = 1060;
    ctx.save(); ctx.globalAlpha = L * sstep(49.0, 49.4, t); ctx.fillStyle = 'rgba(232,200,160,.9)'; ctx.beginPath(); ctx.roundRect(150, y - 40, 180, 90, 12); ctx.fill(); ctx.fillStyle = 'rgba(242,161,74,.9)'; ctx.fillRect(150, y - 40, 180, 16); ctx.restore();
    [190, 240, 290].forEach(x => candle(x, y - 40, .6, L * sstep(49.0, 49.4, t), t, sstep(49.3, 49.7, t)));
    ctx.save(); ctx.globalAlpha = L * sstep(50.1, 50.5, t); ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(540, y - 20, 80, .1, PI - .1); ctx.closePath(); ctx.stroke();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(510 + i * 30, y - 50 - 10 * Math.sin(t * 2 + i)); ctx.quadraticCurveTo(520 + i * 30, y - 80, 510 + i * 30, y - 110); ctx.stroke(); } ctx.restore();
    ctx.save(); ctx.globalAlpha = L * sstep(51.2, 51.6, t); ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.strokeRect(820, y - 130, 120, 200); ctx.fillStyle = '#ffd2a0'; ctx.beginPath(); ctx.arc(915, y - 30, 7, 0, TAU); ctx.fill(); ctx.restore();
    [['生日的蜡烛', 240, 49.2], ['考前的早餐', 540, 50.3], ['「我走了」', 880, 51.4]].forEach(([s, x, t0]) => text(s, x, 1180, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#ffd2a0', alpha: L * sstep(t0, t0 + .4, t) }));
  }
}

// ======================================================================== ④ 告别：一支蜡烛 · 悲伤更轻
function sceneLoss(t) {
  if (t < LOSS - .3 || t > PRINCE + .2) return;
  const A = sstep(LOSS - .1, LOSS + .5, t) * (1 - sstep(PRINCE - .7, PRINCE - .1, t));
  if (A <= 0) return;
  const C = A * (1 - sstep(57.4, 57.9, t));
  if (C > 0) { candle(540, 1100, 2.2, C, t, sstep(54.0, 54.8, t)); text('失去之后', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#c3cad6', alpha: C * sstep(53.8, 54.3, t) }); }
  const G = A * sstep(57.9, 58.4, t);
  if (G > 0) {
    const base = 1180, g1 = E.out(prog(t, 58.2, 59.2)), g2 = E.out(prog(t, 59.4, 60.4));
    text('悲伤程度（示意）', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: G });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, G);
    bar(380, base, 150, 380 * g1, '154,163,178', G); bar(700, base, 150, 250 * g2, T_RGB, G);
    text('没做仪式', 380, base + 40, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: G });
    text('做了仪式', 700, base + 40, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: G * sstep(59.4, 59.8, t) });
    pill('觉得自己还能做点什么', 540, 760, G * sstep(61.0, 61.5, t), { size: 32, stroke: `rgba(${T_RGB},.6)`, color: '#7fe3d3' });
  }
}

// ======================================================================== ⑤ 走过场 · 小王子
function sceneStamp(t) {
  if (t < PRINCE - .2 || t > CLIMAX + .3) return;
  const A = sstep(PRINCE + .2, PRINCE + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const S = A * (1 - sstep(71.7, 72.2, t));
  if (S > 0) {
    for (let i = 0; i < 5; i++) {                                                                   // 一张张空白的纸，被盖上同一个章
      const t0 = 64.6 + i * 1.2, a = S * sstep(t0 - .6, t0 - .3, t), stamped = sstep(t0, t0 + .1, t);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(540 + (i - 2) * 14, 1000 - i * 8); ctx.rotate((i - 2) * .03);
      ctx.fillStyle = 'rgba(232,224,204,.94)'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 16; ctx.fillRect(-170, -220, 340, 440); ctx.shadowBlur = 0;
      if (stamped) { ctx.strokeStyle = `rgba(229,72,77,${.85 * stamped})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(60, 120, 60, 0, TAU); ctx.stroke(); }
      ctx.restore();
      if (stamped) text('已阅', 540 + (i - 2) * 14 + 60, 1000 - i * 8 + 122, { font: SERIF, size: 36, weight: 900, align: 'center', color: 'rgba(229,72,77,.9)', alpha: a * stamped });
    }
    text('那形式主义，错在哪？', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: S * sstep(64.4, 64.9, t) * (1 - sstep(67.6, 68.0, t)) });
    text('只剩形式，忘了为什么', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#f0a0a0', alpha: S * sstep(67.9, 68.4, t) });
  }
  const P = A * sstep(72.2, 72.8, t);
  if (P > 0) {                                                                                      // 一颗小星球，一朵玫瑰
    ctx.save(); ctx.globalAlpha = P; ctx.fillStyle = 'rgba(40,44,58,.95)'; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 1160, 150, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    person(500, 1000, .6, P, '#ffd2a0');
    ctx.save(); ctx.globalAlpha = P; ctx.strokeStyle = '#7fe3d3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(610, 1012); ctx.lineTo(610, 960); ctx.stroke(); ctx.fillStyle = '#e5484d'; ctx.beginPath(); ctx.arc(610, 950, 14, 0, TAU); ctx.fill(); ctx.restore();
    typeText('《小王子》', 540, 680, { ...big, size: 60, weight: 900 }, prog(t, 76.4, 77.2), P * sstep(76.3, 76.8, t));
    typeText('圣埃克苏佩里 · 1943', 540, 770, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), P * sstep(76.3, 76.8, t));
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

// ======================================================================== ⑥ 某一天：一排日子里，有一天亮起来
function sceneDay(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1080, 760);
  const lit = sstep(CLIMAX + 1.2, CLIMAX + 2.0, t);
  ['一', '二', '三', '四', '五', '六', '日'].forEach((d, i) => {
    const x = 150 + i * 130, y = 1060, me = i === 5, a = A * sstep(CLIMAX + .4 + i * .08, CLIMAX + .7 + i * .08, t);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = me && lit ? `rgba(242,161,74,${.2 + .2 * lit})` : 'rgba(255,255,255,.05)'; ctx.strokeStyle = me && lit ? ORANGE : 'rgba(236,230,218,.3)'; ctx.lineWidth = me && lit ? 3.5 : 2;
    if (me && lit) { ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 30 * lit * (1 + fin); }
    ctx.beginPath(); ctx.roundRect(x - 52, y - 70, 104, 140, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    text(d, x, y - 46, { font: SERIF, size: 28, weight: 900, align: 'center', color: me && lit ? '#ffd2a0' : '#9aa3b2', alpha: a });
    if (me) candle(x, y + 64, .46, a * lit, t, lit);
  });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「仪式，就是使某一天', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('与其他日子不同，', 540, 522, { ...big, size: 52, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.5, CLIMAX + 2.4), qa);
  typeText('使某一时刻与其他时刻不同。」', 540, 616, { ...big, size: 54, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.7), qa);
  typeText('—— 圣埃克苏佩里《小王子》', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.9, CLIMAX + 4.5), qa);
  typeText('留下仪式，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('丢掉走过场。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneKaraoke(t); sceneForm(t); sceneLoss(t); sceneStamp(t); sceneDay(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.2, 80, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2013', 'Vohs, Wang, Gino & Norton · Psych Sci', 8.2, 15.7, T);
  stamp('2016', 'Brooks et al. · OBHDP', 19.9, 48.6, T);
  stamp('2014', 'Norton & Gino · JEP: General', 53.6, 63.4, T);
  stamp('1943', 'Saint-Exupéry · Le Petit Prince', 72.2, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(37);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 A 小调里，最后一个和弦是 A 大调）
const NOTE = { A3: 220, C4: 261.63, Cs4: 277.18, E4: 329.63, A4: 440, C5: 523.25, E5: 659.26, A5: 880, C6: 1046.5, E6: 1318.51, A6: 1760, C7: 2093, Cs7: 2217.46 };
const AM_SHIM = [NOTE.C7, NOTE.E6, NOTE.A6, NOTE.A5, NOTE.E5], AMAJ_SHIM = [NOTE.Cs7, NOTE.E6, NOTE.A6, NOTE.A5, NOTE.E5], AM_SWELL = [55, 82.41, 110, 130.81, 164.81];
function CUES() {
  const c = [];
  c.push([.6, 'page', { gain: .14 }], [1.0, 'crack', { gain: .1 }], [2.0, 'page', { gain: .12 }]);
  for (let i = 0; i < 3; i++) c.push([.8 + i * .5, 'tink', { f: [NOTE.A4, NOTE.C5, NOTE.E5][i], gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.A3, NOTE.C4, NOTE.E4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.A5, gain: .12 }]);
  c.push([11.0, 'tink', { f: NOTE.E5, gain: .1 }], [11.8, 'tink', { f: NOTE.A5, gain: .1 }], [13.6, 'click', { gain: .14 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: AM_SHIM, gain: .28 }]);
  c.push([20.2, 'tink', { f: NOTE.E6, gain: .07 }], [24.2, 'swish', { gain: .1 }], [24.7, 'dust', { dur: 1.0, gain: .1 }]);
  for (let i = 0; i < 5; i++) c.push([25.2 + i * .1, 'click', { gain: .06 }]);
  c.push([25.7, 'swish', { gain: .12 }], [27.9, 'thud', { gain: .1 }], [29.2, 'thud', { gain: .1 }], [31.6, 'chord', { f: [NOTE.A4, NOTE.C5, NOTE.E5], gain: .1 }]);
  c.push([FORM, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'click', { gain: .1 }], [44.9, 'tink', { f: NOTE.A5, gain: .1 }], [45.0, 'bar', { f0: 220, f1: 440, dur: 1.0, gain: .1 }]);
  c.push([49.3, 'tink', { f: NOTE.E6, gain: .06 }], [50.3, 'tink', { f: NOTE.A5, gain: .06 }], [51.4, 'click', { gain: .1 }]);
  c.push([LOSS, 'whoosh', { dur: .5, gain: .2 }], [54.0, 'tink', { f: NOTE.E5, gain: .06 }], [58.2, 'bar', { f0: 220, f1: 330, dur: 1.0, gain: .1 }], [59.4, 'bar', { f0: 220, f1: 262, dur: 1.0, gain: .1 }], [61.0, 'tink', { f: NOTE.C6, gain: .08 }]);
  for (let i = 0; i < 5; i++) c.push([64.6 + i * 1.2, 'thunk', { gain: .14 }]);
  c.push([72.3, 'tink', { f: NOTE.E6, gain: .08 }], [76.4, 'page', { gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: AM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: AM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 110, gain: .14 }], [CLIMAX + 1.2, 'tink', { f: NOTE.A5, gain: .1 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: AMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.A3, NOTE.Cs4, NOTE.E4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
