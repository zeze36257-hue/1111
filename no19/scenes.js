// ======================================================================== No.19 存在主义：人生没有说明书
// 第三季·主义 ⑥。开头是一道选择题：一个人安静地坐 15 分钟，还是电自己一下？（Wilson et al., 2014, Science）
// 音乐：原创配乐（music.py，E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。开头的钢琴是时钟的“滴、答”。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题（全编制进入） · 37.33 被判自由（每拍一个鼓点） · 53.33 自欺（紧张） · 64.0 最后的自由（只剩钢琴）
//   80.0 高潮（小提琴和圆号） · 96.0 E 大调：人，就是他自己造就的样子
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), FREE = BT(56), BAD = BT(80), LAST = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['独处测试', 0, LIFT], ['没有说明书', LIFT, FREE], ['被判自由', FREE, BAD], ['自欺', BAD, LAST], ['最后的自由', LAST, CLIMAX], ['自己造就', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.19';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), WOMEN: BT(16) };

const LINES = [
  [0.15, 3.9, '一个人在空房间里坐 15 分钟，什么都不做，也不看手机。'],
  [4.1, 7.6, '或者，按下按钮，电自己一下。你会选哪个？'],
  [8.2, 10.4, '一项实验里，67% 的男生按下了按钮。'],
  [10.8, 13.3, '女生也有 25%。而他们之前都说过：宁愿花钱，也不想再被电。'],
  [13.6, 15.7, '我们为什么这么怕，和自己待在一起？'],
  [16.3, 19.6, '三百多年前，帕斯卡就写过：'],
  [19.9, 23.7, '「人类所有的不幸，都来自不能安静地待在一个房间里。」'],
  [24.0, 27.4, '因为一安静下来，就会冒出一个问题：我是谁？'],
  [27.7, 31.3, '萨特说：一把裁纸刀，是先有了用途，才被造出来的。'],
  [31.6, 35.3, '可人不一样：人先存在，然后才定义自己。'],
  [37.6, 40.6, '人生没有说明书。这意味着：一切都要你自己选。'],
  [40.9, 44.6, '萨特说，人是「被判定为自由的」。'],
  [44.9, 48.6, '就算你不选，那也是一种选择。'],
  [48.9, 52.9, '所以自由让人焦虑：没有人能替你负责。'],
  [53.6, 57.6, '于是我们常常假装没得选：「我就是这样」、「没办法」。'],
  [57.9, 63.4, '萨特把这叫做「自欺」：把自己活成一个角色，而不是一个人。'],
  [64.3, 67.6, '心理学家弗兰克尔，在纳粹集中营里待了将近三年。'],
  [67.9, 71.9, '他的父母、妻子和哥哥，都死在了集中营；他自己只剩一个编号。'],
  [72.2, 75.9, '可他发现，有一样东西，是谁也夺不走的。'],
  [76.3, 79.6, '后来，他在书里写下：'],
  [84.9, 88.6, '你是谁，不是出生时就写好的。'],
  [88.9, 92.6, '是你一次又一次，自己选出来的。'],
  [98.4, 103.0, '评论区：如果没有任何人期待你，你最想成为什么样的人？'],
];

// ======================================================================== 共用
function space() {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, '#12141c'); g.addColorStop(.55, '#08090f'); g.addColorStop(1, '#020305');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
let STARS = [], BRANCH = [], ROLES = [], TRAIL = [];
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .1], [FREE - .5, .1], [FREE, .18], [BAD, .18],
  [BAD + .5, .05], [LAST + 2, .05], [CLIMAX - .2, .1], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== ① 独处测试（0–16）
// 一个空房间（透视线框）：椅子上的“你”，小桌上一个红色按钮，墙上的倒计时
const ROOM = { bx0: 330, by0: 720, bx1: 750, by1: 1010, fx0: 110, fy0: 600, fx1: 970, fy1: 1180 };
function room(t, a, timer = true) {
  if (a <= 0) return;
  const { bx0, by0, bx1, by1, fx0, fy0, fx1, fy1 } = ROOM;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(232,226,214,.6)'; ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255,255,255,.025)'; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0); ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
  ctx.beginPath();
  for (const [x1, y1, x2, y2] of [[bx0, by0, fx0, fy0], [bx1, by0, fx1, fy0], [bx0, by1, fx0, fy1], [bx1, by1, fx1, fy1]]) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(232,226,214,.12)'; ctx.lineWidth = 1.2;                   // 地板的透视线
  for (let k = 1; k < 6; k++) { const u = k / 6; ctx.beginPath(); ctx.moveTo(lerp(bx0, bx1, u), by1); ctx.lineTo(lerp(fx0, fx1, u), fy1); ctx.stroke(); }
  const g = ctx.createLinearGradient(0, by0, 0, by1); g.addColorStop(0, 'rgba(255,214,160,.06)'); g.addColorStop(1, 'rgba(255,214,160,0)');   // 一盏顶灯
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(500, by0); ctx.lineTo(580, by0); ctx.lineTo(680, by1); ctx.lineTo(400, by1); ctx.closePath(); ctx.fill();
  ctx.restore();
  if (timer) {                                                                       // 墙上的倒计时 15:00
    const left = Math.max(0, 900 - Math.floor(t * 1)), mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(10,12,18,.9)'; ctx.strokeStyle = 'rgba(79,214,196,.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(470, 750, 140, 56, 10); ctx.fill(); ctx.stroke(); ctx.restore();
    text(`${mm}:${ss}`, 540, 780, { font: SERIF, size: 34, weight: 900, align: 'center', color: TEAL, alpha: a, glow: `rgba(${T_RGB},.6)`, blur: 12 });
  }
}
function chair(x, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(232,226,214,.8)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 40, y - 110); ctx.lineTo(x - 40, y + 60); ctx.moveTo(x - 40, y); ctx.lineTo(x + 40, y); ctx.lineTo(x + 40, y + 60); ctx.moveTo(x - 30, y + 60); ctx.lineTo(x - 30, y); ctx.stroke();
  ctx.restore();
}
function button(x, y, a, t, pressed = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(232,226,214,.7)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x - 50, y); ctx.lineTo(x + 50, y); ctx.moveTo(x - 36, y); ctx.lineTo(x - 36, y + 70); ctx.moveTo(x + 36, y); ctx.lineTo(x + 36, y + 70); ctx.stroke();
  ctx.fillStyle = '#2a2f3a'; ctx.beginPath(); ctx.roundRect(x - 26, y - 18, 52, 18, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e5484d'; ctx.shadowColor = 'rgba(229,72,77,.9)'; ctx.shadowBlur = 18 + 6 * Math.sin(t * 4);
  ctx.beginPath(); ctx.ellipse(x, y - 20 + 6 * pressed, 18, 9, 0, 0, TAU); ctx.fill(); ctx.restore();
}
function zap(x, y, a) {                                                            // 一道小闪电
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = '#ffe28a'; ctx.shadowColor = 'rgba(255,226,138,.95)'; ctx.shadowBlur = 24;
  ctx.beginPath(); ctx.moveTo(x + 6, y - 46); ctx.lineTo(x - 18, y + 4); ctx.lineTo(x - 2, y + 4); ctx.lineTo(x - 10, y + 46); ctx.lineTo(x + 20, y - 8); ctx.lineTo(x + 4, y - 8); ctx.closePath(); ctx.fill(); ctx.restore();
}
function sceneAlone(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .5, t);
  typeText('独处 15 分钟，还是电自己一下？', 540, 492, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('你会选哪个？', 540, 600, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const up = E.io(prog(t, Q.REVEAL + .1, Q.REVEAL + .9)), sc = lerp(1, .58, up), cy = lerp(900, 650, up);
  const beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  const pressed = E.outExpo(prog(t, Q.REVEAL, Q.REVEAL + .2)) * (1 - E.io(prog(t, Q.REVEAL + .3, Q.REVEAL + .8)));
  ctx.save(); ctx.translate(540, cy); ctx.scale(sc, sc); ctx.translate(-540, -900);
  room(t, 1);
  chair(470, 1040, 1);
  you(470, 1012, t, 1, 11);
  button(640, 1040, 1, t, pressed);
  const zk = 1 - prog(t, Q.REVEAL, Q.REVEAL + .5);
  if (t >= Q.REVEAL && zk > 0) { zap(470, 960, zk); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,170,${.25 * zk * zk})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  ctx.restore();
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t);
  pill('A · 安静坐着', 300, 1250, oa, { size: 30, sc: 1 + .03 * beatK });
  pill('B · 按下按钮', 780, 1250, oa, { size: 30, stroke: 'rgba(229,72,77,.7)', sc: 1 + .03 * beatK });
  ['3', '2', '1'].forEach((s, i) => {
    const t0 = [Q.c3, Q.c2, Q.c1][i], v = prog(t, t0, t0 + 1.28); if (v <= 0 || v >= 1) return;
    const k = 1.5 - .5 * E.outExpo(v * 2.5), al = 1 - sstep(.62, 1, v);
    const bg = ctx.createRadialGradient(540, 920, 0, 540, 920, 230); bg.addColorStop(0, `rgba(6,7,11,${.88 * al})`); bg.addColorStop(1, 'rgba(6,7,11,0)'); ctx.fillStyle = bg; ctx.fillRect(300, 680, 480, 480);
    ctx.save(); ctx.translate(540, 920); ctx.scale(k, k);
    text(s, 0, 8, { font: SERIF, size: 210, weight: 900, align: 'center', color: CREAM, alpha: al, glow: 'rgba(255,240,220,.4)', blur: 30 });
    ctx.restore();
  });
  // 结果：按下按钮的人——男生 67%，女生 25%
  const base = 1262, unit = 4.6;
  [[360, 67, Q.REVEAL + .3, '男生', '#e5484d'], [720, 25, Q.WOMEN + .3, '女生', '#f08a8d']].forEach(([x, v, t0, lab, col]) => {
    const k = E.outExpo(prog(t, t0, t0 + .9)); if (k <= 0) return;
    const h = v * unit * k;
    ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = .9; ctx.shadowColor = col; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.roundRect(x - 74, base - h, 148, h, [10, 10, 0, 0]); ctx.fill(); ctx.restore();
    text(`${Math.round(v * k)}%`, x, base - h - 48, { font: SERIF, size: 66, weight: 900, align: 'center', color: col });
    text(lab, x, base + 36, { font: SANS, size: 28, weight: 700, align: 'center', color: '#c3cad6', alpha: sstep(t0, t0 + .4, t) });
  });
  text('按下按钮的比例', 540, 1006, { font: SANS, size: 26, weight: 500, align: 'center', color: '#8a93a3', alpha: sstep(Q.REVEAL + .6, Q.REVEAL + 1.1, t) * (1 - sstep(Q.WOMEN - .2, Q.WOMEN + .2, t)) });
  ctx.restore();
}

// ======================================================================== ② 标题
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.7, 20.4, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('存在主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EXISTENTIALISM', 540, 1046, { size: 42, weight: 600, font: LAT, ls: 20, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第三季 · 主义 ⑥', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}

// ======================================================================== ③ 没有说明书：帕斯卡的房间、我是谁、裁纸刀 vs 人
function knife(x, y, k, a) {                                                       // 先有图纸，再有刀
  const blue = 'rgba(79,214,196,.75)';
  drawOn(() => { ctx.rect(x - 150, y - 210, 300, 420); }, 1500, k, 'rgba(79,214,196,.25)', 1.2, a);
  for (let i = 1; i < 6; i++) drawOn(() => { ctx.moveTo(x - 150, y - 210 + i * 70); ctx.lineTo(x + 150, y - 210 + i * 70); }, 300, k, 'rgba(79,214,196,.12)', 1, a);
  const blade = () => { ctx.moveTo(x - 20, y + 40); ctx.lineTo(x - 20, y - 150); ctx.quadraticCurveTo(x - 4, y - 186, x + 20, y - 170); ctx.lineTo(x + 20, y + 40); ctx.closePath(); };
  ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([8, 8]); ctx.strokeStyle = blue; ctx.lineWidth = 2; ctx.beginPath(); blade(); ctx.stroke(); ctx.restore();   // 图纸上的虚线
  const made = E.out(prog(k, .55, 1));
  if (made > 0) {
    ctx.save(); ctx.globalAlpha *= a * made; const g = ctx.createLinearGradient(x - 20, 0, x + 20, 0); g.addColorStop(0, '#e8edf3'); g.addColorStop(1, '#8a929e');
    ctx.fillStyle = g; ctx.beginPath(); blade(); ctx.fill();
    ctx.fillStyle = '#6b4a2e'; ctx.beginPath(); ctx.roundRect(x - 26, y + 40, 52, 150, 10); ctx.fill(); ctx.restore();
  }
}
function sceneEssence(t) {
  if (t < 19.9 || t > FREE + .3) return;
  // 帕斯卡：那个房间又回来了，空的，只有你
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.2, t));
  if (A1 > 0) { room(t, A1 * .9, false); chair(470, 1040, A1); you(470, 1012, t, A1, 11); }
  // 我是谁？
  const A2 = sstep(24.0, 24.4, t) * (1 - sstep(27.3, 27.8, t));
  if (A2 > 0) {
    typeText('我是谁？', 540, 860, { ...big, size: 120, weight: 900, glow: `rgba(${O_RGB},.4)`, glowBlur: 36 }, prog(t, 24.3, 25.0), A2);
    you(540, 1060, t, A2, 10);
  }
  // 裁纸刀：先有用途（图纸），才有刀；人：先存在（光点），再一点点画出自己的轮廓
  const A3 = sstep(27.7, 28.2, t) * (1 - sstep(FREE - .8, FREE - .1, t));
  if (A3 > 0) {
    knife(290, 940, prog(t, 28.0, 30.4), A3);
    text('用途', 290, 680, { size: 34, weight: 700, align: 'center', color: TEAL, alpha: A3 * sstep(28.2, 28.6, t) });
    text('↓', 290, 1196, { size: 30, weight: 700, align: 'center', color: DIM, alpha: A3 * sstep(29.6, 30.0, t) });
    text('裁纸刀', 290, 1240, { size: 32, weight: 700, align: 'center', color: CREAM, alpha: A3 * sstep(29.8, 30.2, t) });
    const hk = sstep(31.6, 32.1, t);
    you(790, 900, t, A3 * hk, 11);
    text('存在', 790, 680, { size: 34, weight: 700, align: 'center', color: ORANGE, alpha: A3 * sstep(31.8, 32.2, t) });
    const ok = prog(t, 32.6, 35.0);                                               // 自己画出来的轮廓：一圈不规则的线
    if (ok > 0) drawOn(() => { for (let i = 0; i <= 60; i++) { const an = i / 60 * TAU - PI / 2, r = 120 + 26 * Math.sin(an * 3 + 1) + 14 * Math.sin(an * 5); i ? ctx.lineTo(790 + Math.cos(an) * r, 900 + Math.sin(an) * r * 1.3) : ctx.moveTo(790 + Math.cos(an) * r, 900 + Math.sin(an) * r * 1.3); } }, 1100, ok, ORANGE, 3, A3, `rgba(${O_RGB},.8)`);
    text('↓', 790, 1196, { size: 30, weight: 700, align: 'center', color: DIM, alpha: A3 * sstep(33.4, 33.8, t) });
    text('自己定义', 790, 1240, { size: 32, weight: 700, align: 'center', color: '#ffd2a0', alpha: A3 * sstep(33.6, 34.0, t) });
    seg(540, 700, 540, 1250, 'rgba(236,230,218,.18)', 1.5, A3);
    typeText('「存在先于本质」', 540, 560, { ...big, size: 66, weight: 900, glow: `rgba(${O_RGB},.4)`, glowBlur: 30 }, prog(t, 32.2, 33.2), A3);
  }
}

// ======================================================================== ④ 被判自由：一棵不停分岔的路
function sceneFree(t) {
  if (t < FREE - .4 || t > BAD + .3) return;
  const A = sstep(FREE - .2, FREE + .4, t) * (1 - sstep(BAD - .5, BAD + .1, t));
  if (A <= 0) return;
  const shake = .6 * sstep(48.9, 50.0, t);                                          // 焦虑：线开始发抖
  for (const b of BRANCH) {
    const k = E.out(prog(t, b.t, b.t + .6)); if (k <= 0) continue;
    const jx = shake * Math.sin(t * 23 + b.ph) * 3, jy = shake * Math.cos(t * 19 + b.ph) * 3;
    const x2 = lerp(b.x1, b.x2, k) + jx, y2 = lerp(b.y1, b.y2, k) + jy;
    const chosen = b.on, notChosen = sstep(b.t + .9, b.t + 1.6, t) * (chosen ? 0 : 1);
    seg(b.x1, b.y1, x2, y2, chosen ? 'rgba(255,214,160,.9)' : 'rgba(200,206,216,.55)', chosen ? 3 : 2, A * (1 - .7 * notChosen));
    if (b.label && k > .8) text(b.label, b.x2 + (b.x2 > b.x1 ? 14 : -14), b.y2 - 6, { font: SANS, size: 24, weight: 500, align: b.x2 > b.x1 ? 'left' : 'right', color: chosen ? '#ffd2a0' : '#9aa3b2', alpha: A * (1 - .6 * notChosen) * sstep(.8, 1, k) });
  }
  // “你”沿着选中的路往上走
  const path = BRANCH.filter(b => b.on), seg_i = path.findIndex(b => t < b.t + 1.2);
  let px = 540, py = 1220;
  if (seg_i < 0) { const b = path[path.length - 1]; px = b.x2; py = b.y2; }
  else { const b = path[seg_i], u = E.io(prog(t, b.t + .2, b.t + 1.2)); px = lerp(b.x1, b.x2, u); py = lerp(b.y1, b.y2, u); }
  you(px, py, t, A, 11);
  const nc = A * sstep(44.9, 45.5, t) * (1 - sstep(48.6, 49.0, t));                   // 不选，也是一种选择
  if (nc > 0) { pill('不选', px + 90, py - 20, nc, { size: 26, stroke: 'rgba(229,72,77,.7)' }); text('= 也是一种选择', px + 90, py + 30, { font: SANS, size: 24, weight: 500, align: 'center', color: '#e5a0a0', alpha: nc }); }
}

// ======================================================================== ⑤ 自欺：一个个“角色”贴上来，把人盖住
function sceneBadFaith(t) {
  if (t < BAD - .4 || t > LAST + .2) return;
  const A = sstep(BAD - .1, BAD + .5, t) * (1 - sstep(LAST - .8, LAST - .1, t));
  if (A <= 0) return;
  const cx = 540, cy = 900, cover = sstep(54.2, 58.6, t);
  you(cx, cy, t, A * (1 - .75 * cover), 11);
  ROLES.forEach((r, i) => {
    const t0 = 53.8 + i * .42, k = E.outExpo(prog(t, t0, t0 + .7)); if (k <= 0) return;
    const x = lerp(r.sx, cx + r.ox, k), y = lerp(r.sy, cy + r.oy, k);
    ctx.save(); ctx.translate(x, y); ctx.rotate(r.rot * k);
    pill(r.s, 0, 0, A * (.55 + .45 * k), { size: 28, fill: 'rgba(28,30,38,.92)', stroke: i % 3 ? 'rgba(255,255,255,.2)' : 'rgba(229,72,77,.6)', color: '#c9cfd8' });
    ctx.restore();
  });
  const mask = A * sstep(58.4, 59.4, t);
  if (mask > 0) text('角色', cx, 1260, { size: 30, weight: 700, align: 'center', color: '#9aa3b2', alpha: mask, ls: 20 });
}

// ======================================================================== ⑥ 最后的自由：一片黑暗里，一个编号，和一点不灭的光
function sceneFrankl(t) {
  if (t < LAST - .2 || t > CLIMAX + .5) return;
  const A = sstep(LAST + .2, LAST + 1.2, t) * (1 - sstep(CLIMAX - .2, CLIMAX + .3, t));
  if (A <= 0) return;
  ctx.save(); ctx.globalAlpha = A * .5; ctx.strokeStyle = 'rgba(160,170,186,.35)'; ctx.lineWidth = 1.2;      // 竖线：铁栏杆一样的冷光
  for (let i = 0; i < 18; i++) { const x = 90 + i * 53; ctx.beginPath(); ctx.moveTo(x, 520); ctx.lineTo(x, 1260); ctx.stroke(); }
  ctx.restore();
  typeText('119104', 540, 700, { size: 92, weight: 900, font: SERIF, ls: 14, align: 'center', color: '#8a93a3', spread: 2 }, prog(t, 68.6, 69.6), A * (1 - sstep(72.0, 72.8, t)));
  const lit = sstep(72.4, 74.6, t);                                                       // 谁也夺不走的那一点光
  if (lit > 0) {
    warmth(A * lit * 1.1, 540, 940, 520);
    glow(540, 940, 6 + 6 * lit, O_RGB, A * lit, 8 + 4 * Math.sin(t * 2));
  }
}

// ======================================================================== ⑦ 自己造就：光点自己走出一条路
function sceneMade(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const dimK = 1 - .35 * win(t, 93.0, FINAL + .2, .6, .3);
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1060, 820);
  // 一条自己画出来的路：光点走到哪里，路就画到哪里
  const u = E.io(prog(t, CLIMAX + .2, 95.6)), n = Math.max(2, Math.floor(u * (TRAIL.length - 1)));
  ctx.save(); ctx.globalAlpha = A * dimK; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 18; ctx.beginPath();
  for (let i = 0; i <= n; i++) { const [x, y] = TRAIL[i]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
  for (let i = 0; i < n; i += 9) glow(TRAIL[i][0], TRAIL[i][1], 2.6, '255,226,190', A * dimK * .7, 3);
  const [hx, hy] = TRAIL[n];
  you(hx, hy, t, A, 12);
  // 字：弗兰克尔 → 萨特
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('人的一切都可以被夺走，', 540, 560, { ...big, size: 48, weight: 700 }, prog(t, CLIMAX + .2, CLIMAX + 1.2), qa);
  typeText('除了最后一样：', 540, 650, { ...big, size: 48, weight: 700 }, prog(t, CLIMAX + 1.3, CLIMAX + 2.0), qa);
  typeText('「选择自己态度的自由。」', 540, 756, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.1, CLIMAX + 3.0), qa);
  typeText('—— 弗兰克尔《活出生命的意义》', 540, 850, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, CLIMAX + 3.2, CLIMAX + 4.0), qa);
  typeText('萨特说：', 540, 556, { ...big, size: 46, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('「人，就是他自己造就的样子。」', 540, 682, { ...big, size: 66, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
  typeText('—— 萨特《存在主义是一种人道主义》', 540, 790, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, FINAL + 1.0, FINAL + 1.6), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneAlone(t); sceneTitle(t); sceneEssence(t); sceneFree(t); sceneBadFaith(t); sceneFrankl(t); sceneMade(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2) || (T > 53.7 && T < 57.5)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .14 * win(T, 72.4, CLIMAX, 1, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2014', 'Wilson et al. · Science', 8.2, 15.6, T);
  stamp('1670', 'Pascal · Pensées', 16.3, 23.7, T);
  stamp('1946', "Sartre · L'existentialisme est un humanisme", 27.7, 52.9, T);
  stamp('1943', "Sartre · L'Être et le néant", 57.9, 63.4, T);
  stamp('1942–1945', 'Viktor Frankl', 64.3, 75.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(19);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  // 分岔的路：每两拍一个岔口，“你”走其中一条；前几个岔口写上具体的选择
  BRANCH = [];
  const labels = [['读研', '工作'], ['留下', '离开'], ['说出口', '不说'], ['坚持', '放弃'], ['', ''], ['', '']];
  let x = 540, y = 1230; const rb = mulberry(190);
  for (let k = 0; k < 6; k++) {
    const t0 = FREE + .2 + k * 2 * BEAT * 1.5, dy = 120, spread = 120 - k * 8;
    const left = rb() < .5;
    const ends = [[x - spread, y - dy], [x + spread, y - dy]];
    ends.forEach(([ex, ey], j) => {
      const on = (j === 0) === left;
      BRANCH.push({ x1: x, y1: y, x2: ex, y2: ey, t: t0 + j * .08, on, ph: rb() * TAU, label: labels[k][j] });
      for (const s of [-1, 1]) if (!on && rb() < .7) BRANCH.push({ x1: ex, y1: ey, x2: ex + s * 60, y2: ey - 80, t: t0 + .5, on: false, ph: rb() * TAU });   // 没走的路也在继续分岔
    });
    [x, y] = ends[left ? 0 : 1];
    x = clamp(x, 220, 860);
  }
  const roleNames = ['好学生', '乖孩子', '打工人', '我就是这样的人', '没办法', '大家都这样', '懂事', '我不配'];
  const rr = mulberry(191);
  ROLES = roleNames.map((s, i) => { const an = i / roleNames.length * TAU + .3; return { s, sx: 540 + Math.cos(an) * 900, sy: 900 + Math.sin(an) * 900, ox: Math.cos(an) * (110 + rr() * 50), oy: Math.sin(an) * (130 + rr() * 60), rot: (rr() - .5) * .3 }; });
  // 自己画的路：从下方出发，绕着往上走，最后停在中间偏下
  TRAIL = [];
  for (let i = 0; i <= 400; i++) {
    const u = i / 400, an = u * TAU * 1.6;
    TRAIL.push([540 + Math.sin(an) * 320 * (1 - .55 * u) + Math.sin(u * 23) * 10, 1290 - u * 330 + Math.cos(an * .8) * 60 * (1 - u)]);
  }
}

// ======================================================================== 音效提示表（音高都在 E 小调里，最后一个和弦是 E 大调）
const NOTE = { E5: 659.26, Gs5: 830.61, G5: 783.99, A5: 880, B5: 987.77, D6: 1174.66, E6: 1318.51, Fs6: 1479.98, G6: 1567.98, Gs6: 1661.22, B6: 1975.53, E7: 2637.02, G7: 3135.96, Gs7: 3322.44 };
const EM_SHIM = [NOTE.G6, NOTE.B6, NOTE.E6, NOTE.E7, NOTE.G7], EMAJ_SHIM = [NOTE.Gs6, NOTE.B6, NOTE.E6, NOTE.E7, NOTE.Gs7], EM_SWELL = [164.81, 246.94, 329.63, 392.0, 493.88];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'crack', { gain: .35 }], [Q.REVEAL + .3, 'bar', { f0: 247, f1: 659, gain: .5, pan: -.3 }]);
  c.push([Q.WOMEN + .3, 'bar', { f0: 247, f1: 440, gain: .45, pan: .3 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EM_SHIM, gain: .28 }]);
  c.push([20.0, 'air', { dur: 3.8, hum: 82.41, gain: .16 }], [24.3, 'tink', { f: NOTE.B5, gain: .24 }], [28.0, 'page', { gain: .4 }], [32.2, 'shimmer', { f: EM_SHIM, gain: .22 }]);
  BRANCH.filter(b => b.on).forEach((b, i) => c.push([b.t, 'click', { gain: .26 }], [b.t + .03, 'tink', { f: [NOTE.E6, NOTE.G6, NOTE.B5, NOTE.D6, NOTE.E6, NOTE.Fs6][i % 6], gain: .08 }]));
  c.push([48.9, 'drone', { dur: 4.0, gain: .12 }]);
  ROLES.forEach((_, i) => c.push([53.8 + i * .42 + .1, 'slap', { gain: .22, pan: (i % 2 ? .4 : -.4) }]));
  c.push([68.6, 'tick', { gain: .25 }], [72.4, 'swell', { dur: 2.2, f: EM_SWELL, gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: EM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EM_SHIM, gain: .42 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.E5, NOTE.Gs5, NOTE.B5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
