// ======================================================================== No.36 保守主义：为什么你总选默认选项？
// 第五季·看不见的主义 ③。开头是一道选择题：德国和奥地利，同意捐献器官的比例差多少？（Johnson & Goldstein, 2003）
// 音乐：原创配乐（music.py，F 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机总回到原地：走开一步又回来，最后一句才冲出去。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 保守主义（每拍一个鼓点） · 53.33 自动加入（紧张） · 64.0 篱笆（只剩钢琴） · 80.0 高潮 · 96.0 F 大调：门打开
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), CONS = BT(56), AUTO = BT(80), FENCE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['一个勾', 0, LIFT], ['默认', LIFT, CONS], ['保守主义', CONS, AUTO], ['自动加入', AUTO, FENCE], ['篱笆', FENCE, CLIMAX], ['想明白', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.36';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '德国和奥地利，是邻居，语言一样，文化相近。'],
  [4.1, 7.6, '同意死后捐献器官的人，差多少？先猜一个。'],
  [8.2, 10.4, '答案是：德国约 12%，'],
  [10.8, 13.3, '奥地利，接近 100%。'],
  [13.6, 15.7, '差别，只在表格上的一个勾。'],
  [16.3, 19.6, '德国要你主动勾「我愿意」；'],
  [19.9, 23.7, '奥地利默认你愿意，不愿意的人才去勾。'],
  [24.0, 27.4, '研究者在网上又做了一次：'],
  [27.7, 31.3, '默认「不捐」，约四成的人同意；'],
  [31.6, 35.3, '默认「捐」，约八成的人同意。'],
  [37.6, 40.6, '这就是「保守主义」：没想好，就先别动。'],
  [40.9, 44.6, '心理学叫它「现状偏差」。'],
  [44.9, 48.6, '换工作、换专业、换手机套餐，我们都倾向于不换。'],
  [48.9, 52.9, '于是，默认选项悄悄替很多人做了决定。'],
  [53.6, 57.6, '一家公司把养老储蓄，改成了自动加入，'],
  [57.9, 63.4, '新员工的参加率，一下子提高了将近 50 个百分点。'],
  [64.3, 67.6, '保守，不全是坏事。'],
  [67.9, 71.9, '很多默认，背后有它的道理。'],
  [72.2, 75.9, '可不做选择，也是一种选择，只是别人替你选的。'],
  [76.3, 79.6, '作家切斯特顿讲过一道篱笆：'],
  [84.9, 88.6, '默认不是敌人，'],
  [88.9, 92.6, '没想过的默认才是。'],
  [98.4, 103.0, '评论区：你有没有一个「一直没换」的东西？'],
];
const BIGLINES = [
  [80.2, 92.6, '「不知道它为什么立在那儿，就别急着拆；想明白了，再决定。」—— 切斯特顿'],
  [93.4, 98.0, '这是我选的，还是它替我选的？'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [CONS - .5, .2], [CONS, .06], [FENCE, .06],
  [FENCE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 表格、勾、柱子、人
function form(cx, cy, a, title, line, checked, note, hot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy);
  ctx.fillStyle = 'rgba(232,224,204,.94)'; ctx.shadowColor = hot ? `rgba(${O_RGB},.7)` : 'rgba(0,0,0,.5)'; ctx.shadowBlur = hot ? 30 : 20; ctx.fillRect(-190, -200, 380, 400); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(60,52,40,.3)'; for (let i = 0; i < 5; i++) ctx.fillRect(-150, -70 + i * 26, 300 * (.5 + .5 * hash2(i, title.length)), 6);
  ctx.strokeStyle = '#2a2418'; ctx.lineWidth = 3; ctx.strokeRect(-150, 90, 40, 40);
  if (checked > 0) { ctx.strokeStyle = `rgba(42,120,90,${checked})`; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-142, 110); ctx.lineTo(-130, 122); ctx.lineTo(-114, 96); ctx.stroke(); }
  ctx.restore();
  text(title, cx, cy - 150, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#2a2418', alpha: a });
  text(line, cx - 90, cy + 111, { font: SERIF, size: 26, weight: 900, color: '#2a2418', alpha: a });
  if (note) text(note, cx, cy + 250, { font: SANS, size: 26, align: 'center', color: '#c3cad6', alpha: a });
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
function chart(title, a, t, items, scale = 5, base = 1240) {                                     // items: [x, value, label, rgb, valText, t0]
  if (a <= 0) return;
  text(title, 540, 540, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: a });
  seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, a);
  items.forEach(([x, v, lab, rgb, vt, t0]) => {
    const g = E.out(prog(t, t0, t0 + 1.0)), la = a * sstep(t0 - .2, t0 + .2, t);
    bar(x, base, 150, scale * v * g, rgb, la);
    text(vt, x, base - scale * v * g - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: rgb === O_RGB ? '#ffd2a0' : '#c3cad6', alpha: la * sstep(t0 + .5, t0 + .9, t) });
    text(lab, x, base + 40, { font: SANS, size: 28, align: 'center', color: rgb === O_RGB ? '#ffd2a0' : '#9aa3b2', alpha: la });
  });
}
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function checkbox(x, y, s, a, on, hot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = hot ? ORANGE : CREAM; ctx.lineWidth = 6; if (hot) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 30 * hot; }
  ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.roundRect(-60, -60, 120, 120, 16); ctx.fill(); ctx.stroke();
  if (on > 0) { ctx.strokeStyle = `rgba(242,161,74,${on})`; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-8, 28); ctx.lineTo(38, -30); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================== ① 一个勾（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('德国 vs 奥地利：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('同意捐器官的比例？', 540, 560, { ...big, size: 76, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const fa = 1 - sstep(10.5, 11.0, t);
  form(300, 950, fa, '德国', '我同意捐献', 0, null);
  form(780, 950, fa, '奥地利', '我不同意捐献', 0, null);
  chart('同意捐献器官的比例', sstep(10.8, 11.3, t), t, [[380, 12, '德国', '154,163,178', '约 12%', 11.0], [700, 99, '奥地利', O_RGB, '接近 100%', 11.2]]);
  text('C · 差八倍以上', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 差不多', 220], ['B · 差一倍', 540], ['C · 差八倍以上', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 默认 · 网上实验
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('保守主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('CONSERVATISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ③', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneDefault(t) {
  if (t < 19.7 || t > CONS + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(CONS - .6, CONS - .05, t));
  if (A <= 0) return;
  const F = A * (1 - sstep(23.6, 24.1, t));
  if (F > 0) {
    form(300, 930, F, '德国', '我愿意捐献', 0, '要你主动勾');
    form(780, 930, F, '奥地利', '我愿意捐献', sstep(20.4, 20.9, t), '默认已经勾好', 1);
  }
  const X = A * sstep(24.0, 24.5, t);
  if (X > 0) chart('网上实验：同意捐献的比例', X, t, [[380, 42, '默认「不捐」', '154,163,178', '约四成', 27.7], [700, 82, '默认「捐」', O_RGB, '约八成', 31.6]]);
}

// ======================================================================== ③ 保守主义：不换 · 默认替你选
function toggle(x, y, a, label, on, bk) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = on ? 'rgba(242,161,74,.85)' : 'rgba(154,163,178,.3)'; ctx.beginPath(); ctx.roundRect(x - 50, y - 26, 100, 52, 26); ctx.fill();
  ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x + (on ? 24 : -24) + bk * 4, y, 20, 0, TAU); ctx.fill(); ctx.restore();
  text(label, x - 90, y + 1, { font: SERIF, size: 36, weight: 900, align: 'right', color: CREAM, alpha: a });
  text('不换', x + 80, y + 1, { font: SANS, size: 26, color: '#9aa3b2', alpha: a });
}
function sceneCons(t) {
  if (t < CONS - .3 || t > AUTO + .2) return;
  const A = sstep(CONS - .1, CONS + .5, t) * (1 - sstep(AUTO - .6, AUTO - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - CONS) / BEAT) % 1);
  const D = A * (1 - sstep(48.6, 49.0, t));
  typeText('保守主义', 540, 640, { ...big, size: 64, weight: 900 }, prog(t, 37.7, 38.4), D);
  typeText('没想好，就先别动', 540, 730, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 38.3, 39.1), D);
  pill('现状偏差 · Status quo bias', 540, 860, D * sstep(40.9, 41.4, t), { size: 32, stroke: `rgba(${O_RGB},.6)`, color: '#ffd2a0' });
  [['换工作', 990], ['换专业', 1090], ['换手机套餐', 1190]].forEach(([s, y], i) => {
    const a = D * sstep(44.9 + i * BEAT, 45.2 + i * BEAT, t), tryOn = Math.sin(PI * clamp(prog(t, 45.3 + i * BEAT, 46.0 + i * BEAT)));
    toggle(620, y, a, s, false, tryOn * .8 * bk + tryOn * 3);
  });
  const C = A * sstep(48.9, 49.4, t);
  if (C > 0) {
    checkbox(540, 820, 1.2 + .04 * bk, C, 1, 1);
    text('默认', 540, 940, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: C });
    for (let i = 0; i < 24; i++) {                                                                // 一群人，不知不觉都走到了默认那一格
      const sx = 120 + (i % 8) * 120, sy = 1150 + Math.floor(i / 8) * 70, k = E.io(prog(t, 49.4 + i * .1, 51.4 + i * .1));
      person(lerp(sx, 540 + (i % 8 - 3.5) * 22, k), lerp(sy, 1040 + Math.floor(i / 8) * 26, k), .36, C * (1 - .3 * k), '#9aa3b2');
    }
  }
}

// ======================================================================== ④ 自动加入：养老储蓄
function sceneAuto(t) {
  if (t < AUTO - .3 || t > FENCE + .2) return;
  const A = sstep(AUTO - .1, AUTO + .5, t) * (1 - sstep(FENCE - .7, FENCE - .1, t));
  if (A <= 0) return;
  chart('新员工参加养老储蓄', A, t, [[380, 37, '自己去申请', '154,163,178', '', 54.4], [700, 86, '自动加入', O_RGB, '', 57.9]]);
  const up = A * sstep(59.2, 59.7, t);
  if (up > 0) {
    ctx.save(); ctx.globalAlpha = up; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(470, 1240 - 5 * 37); ctx.lineTo(620, 1240 - 5 * 86); ctx.stroke(); ctx.restore();
    text('+ 近 50 个百分点', 540, 690, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#ffd2a0', alpha: up, glow: `rgba(${O_RGB},.5)`, blur: 16 });
  }
  text('示意', 860, 1290, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: A });
}

// ======================================================================== ⑤ 篱笆：路中间的一道门
function road(a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; const g = ctx.createLinearGradient(0, 760, 0, 1340); g.addColorStop(0, 'rgba(60,64,78,0)'); g.addColorStop(1, 'rgba(60,64,78,.55)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(500, 760); ctx.lineTo(580, 760); ctx.lineTo(900, 1340); ctx.lineTo(180, 1340); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(500, 760); ctx.lineTo(180, 1340); ctx.moveTo(580, 760); ctx.lineTo(900, 1340); ctx.stroke(); ctx.restore();
}
function gate(a, open, glowK) {                                                                  // 一道木门，open 0…1 往两边打开
  if (a <= 0) return;
  const y = 1080, half = 170;
  if (glowK > 0) glow(540, y - 40, 40, O_RGB, a * glowK, 5);
  for (const sgn of [-1, 1]) {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(540 + sgn * half, y); ctx.scale(1 - .85 * open, 1);
    ctx.strokeStyle = glowK > .3 ? '#ffd2a0' : '#d8c79f'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${O_RGB},${.6 * glowK})`; ctx.shadowBlur = 16 * glowK;
    ctx.beginPath(); for (const yy of [-90, -40, 10]) { ctx.moveTo(0, yy); ctx.lineTo(-sgn * half, yy); }
    for (let i = 0; i <= 3; i++) { const xx = -sgn * half * i / 3; ctx.moveTo(xx, -110); ctx.lineTo(xx, 30); }
    ctx.moveTo(0, 10); ctx.lineTo(-sgn * half, -90); ctx.stroke(); ctx.restore();
  }
  for (const sgn of [-1, 1]) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#8a7a5a'; ctx.fillRect(540 + sgn * (half + 10) - 10, y - 130, 20, 170); ctx.restore(); }
}
function sceneFence(t) {
  if (t < FENCE - .2) return;
  const A = sstep(FENCE + .2, FENCE + 1.0, t);
  road(A); 
  const open = E.io(prog(t, FINAL + .2, FINAL + 3.0)), why = sstep(67.9, 68.5, t) * (1 - sstep(71.8, 72.2, t));
  gate(A, open, Math.max(why * .8, sstep(CLIMAX, CLIMAX + 1.2, t) * .6 + .4 * sstep(FINAL, FINAL + 1, t)));
  text('？', 540, 860, { font: SERIF, size: 110, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * why, glow: `rgba(${O_RGB},.6)`, blur: 22 });
  text('为什么立在这儿？', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: A * why });
  const NB = A * sstep(72.2, 72.7, t) * (1 - sstep(76.0, 76.4, t));
  if (NB > 0) { checkbox(540, 640, .8, NB, 1, .6); text('不选 = 别人替你选', 540, 760, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: NB }); }
  const Hm = A * sstep(76.3, 76.8, t) * (1 - sstep(CLIMAX - .4, CLIMAX, t));
  typeText('切斯特顿', 540, 620, { ...big, size: 64, weight: 900 }, prog(t, 76.4, 77.2), Hm);
  typeText('英国作家 · 1929', 540, 710, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), Hm);
  if (open > 0) { person(540, 1060 - 240 * E.io(prog(t, FINAL + 1.6, TOTAL)), .7 - .3 * E.io(prog(t, FINAL + 1.6, TOTAL)), A * sstep(FINAL + .8, FINAL + 1.4, t), '#ffd2a0'); }
}

// ======================================================================== ⑥ 想明白，再决定
function sceneThink(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1060, 760);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「不知道它为什么立在那儿，', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('就别急着拆；', 540, 522, { ...big, size: 52, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.7, CLIMAX + 2.4), qa);
  typeText('想明白了，再决定。」', 540, 616, { ...big, size: 60, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.5), qa);
  typeText('—— 切斯特顿（大意）', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.7, CLIMAX + 4.3), qa);
  typeText('这是我选的，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('还是它替我选的？', 540, 596, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneDefault(t); sceneCons(t); sceneAuto(t); sceneFence(t); sceneThink(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 67.9, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2003', 'Johnson & Goldstein · Science', 8.2, 35.3, T);
  stamp('1988', 'Samuelson & Zeckhauser · J Risk Uncertainty', 40.9, 52.9, T);
  stamp('2001', 'Madrian & Shea · QJE', 53.6, 63.4, T);
  stamp('1929', 'G. K. Chesterton · The Thing', 76.3, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(36);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 F 小调里，最后一个和弦是 F 大调）
const NOTE = { F4: 349.23, Ab4: 415.3, A4: 440, C5: 523.25, F5: 698.46, Ab5: 830.61, A5: 880, C6: 1046.5, F6: 1396.91, Ab6: 1661.22, A6: 1760 };
const FM_SHIM = [NOTE.Ab6, NOTE.C6, NOTE.F6, NOTE.F5, NOTE.C5], FMAJ_SHIM = [NOTE.A6, NOTE.C6, NOTE.F6, NOTE.F5, NOTE.C5], FM_SWELL = [43.65, 65.41, 87.31, 103.83, 130.81];
function CUES() {
  const c = [];
  c.push([.4, 'page', { gain: .16 }], [.7, 'page', { gain: .14 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.F4, NOTE.Ab4, NOTE.C5], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.F6, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 175, f1: 220, dur: .8, gain: .1 }], [11.2, 'bar', { f0: 175, f1: 698, dur: 1.4, gain: .16 }], [13.6, 'click', { gain: .2 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: FM_SHIM, gain: .28 }]);
  c.push([20.4, 'click', { gain: .2 }], [24.1, 'tink', { f: NOTE.C6, gain: .08 }], [27.7, 'bar', { f0: 175, f1: 349, dur: 1.0, gain: .12 }], [31.6, 'bar', { f0: 175, f1: 698, dur: 1.2, gain: .14 }]);
  c.push([CONS, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'tink', { f: NOTE.F5, gain: .08 }]);
  for (let i = 0; i < 3; i++) c.push([45.3 + i * BEAT, 'click', { gain: .1 }]);
  c.push([48.9, 'click', { gain: .2 }], [49.0, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .08 }], [49.4, 'dust', { dur: 2.4, gain: .08 }]);
  c.push([AUTO, 'whoosh', { dur: .5, gain: .22 }], [54.4, 'bar', { f0: 175, f1: 262, dur: 1.0, gain: .1 }], [57.9, 'bar', { f0: 175, f1: 698, dur: 1.2, gain: .16 }], [59.2, 'tink', { f: NOTE.C6, gain: .1 }]);
  c.push([64.4, 'thud', { gain: .14 }], [67.9, 'tink', { f: NOTE.Ab5, gain: .08 }], [72.2, 'click', { gain: .16 }], [76.4, 'page', { gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: FM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: FM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 87.31, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: FMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.F4, NOTE.A4, NOTE.C5], gain: .2 }], [FINAL + .3, 'creak', { dur: 2.6, gain: .1 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
