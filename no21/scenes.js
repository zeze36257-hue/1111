// ======================================================================== No.21 极简主义：为什么我们扔不掉东西
// 第三季·主义 ⑧。开头是一道选择题：一个刚到手的马克杯，买家只出 2.87 美元，卖家要多少？（Kahneman, Knetsch & Thaler, 1990）
// 音乐：原创配乐（music.py，A 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。开头刻意很“空”：两拍才一个音。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 东西的代价（每拍一个鼓点） · 53.33 生命的价格（紧张） · 64.0 经历（只剩钢琴） · 80.0 高潮 · 96.0 A 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), COST = BT(56), LIFE = BT(80), EXP = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['杯子测试', 0, LIFT], ['越攒越多', LIFT, COST], ['东西的代价', COST, LIFE], ['生命的价格', LIFE, EXP], ['经历', EXP, CLIMAX], ['放下', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.21';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '实验里，有人刚拿到一个马克杯，就被问：多少钱你肯卖？'],
  [4.1, 7.6, '想买的人，只愿意出 2.87 美元。你猜，卖家要多少？'],
  [8.2, 10.4, '答案是 7.12 美元，差不多是买家的两倍半。'],
  [10.8, 13.3, '杯子才到手几分钟，在他们眼里，就贵了一倍多。'],
  [13.6, 15.7, '这就是我们扔不掉东西的原因之一。'],
  [16.3, 19.6, '心理学叫它「禀赋效应」：东西一旦是你的，就显得更值钱。'],
  [19.9, 23.7, '于是我们越买越多，越攒越多，什么都舍不得扔。'],
  [24.0, 27.4, '一百八十年前，梭罗做了一个相反的实验。'],
  [27.7, 31.3, '他在瓦尔登湖边，自己盖了一间小木屋，只花了 28 美元。'],
  [31.6, 35.3, '在那里住了两年零两个月，只留下生活真正需要的东西。'],
  [37.6, 40.6, '今天，我们的东西比那时多太多了。可我们更快乐了吗？'],
  [40.9, 44.6, '一项汇总了 259 个样本的研究发现：'],
  [44.9, 48.6, '越看重物质、金钱和拥有的人，幸福感往往越低，'],
  [48.9, 52.9, '焦虑和抑郁，反而更多。'],
  [53.6, 57.6, '梭罗说：一样东西真正的价格，'],
  [57.9, 63.4, '是你为了得到它，换出去的那部分生命。'],
  [64.3, 67.6, '那钱该花在哪儿？'],
  [67.9, 71.9, '研究发现：比起买东西，花钱去经历一些事，往往让人更快乐。'],
  [72.2, 75.9, '东西会旧，会被习惯；经历会变成回忆，变成你的一部分。'],
  [76.3, 79.6, '梭罗还写过：'],
  [84.9, 88.6, '极简，不是什么都不要。'],
  [88.9, 92.6, '是只留下，让你真正活着的东西。'],
  [98.4, 103.0, '评论区：你家里最舍不得扔、却一年都没用过的东西是什么？'],
];
const BIGLINES = [
  [80.2, 92.6, '「一个人有多富有，要看他能放下多少东西。」—— 梭罗《瓦尔登湖》'],
  [93.4, 103.0, '他说：「简单，简单，再简单！」'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .1], [24, .1], [25, .3], [COST - .5, .3], [COST, .06], [EXP, .06],
  [EXP + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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


// ======================================================================== ① 杯子测试（0–16）
function mug(x, y, s, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(0, 120, 120, 16, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#e8e2d6'; ctx.lineWidth = 16; ctx.beginPath(); ctx.ellipse(104, 20, 46, 56, 0, -1.3, 1.3); ctx.stroke();      // 把手
  const g = ctx.createLinearGradient(-100, 0, 100, 0); g.addColorStop(0, '#f4efe6'); g.addColorStop(.6, '#d9d2c4'); g.addColorStop(1, '#9e978a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-100, -80); ctx.lineTo(-92, 104); ctx.quadraticCurveTo(0, 126, 92, 104); ctx.lineTo(100, -80); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3b2a1c'; ctx.beginPath(); ctx.ellipse(0, -80, 100, 18, 0, 0, TAU); ctx.fill();                                // 咖啡
  ctx.strokeStyle = '#f4efe6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, -80, 100, 18, 0, 0, TAU); ctx.stroke();
  ctx.fillStyle = ORANGE; ctx.font = `900 24px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CORNELL', 0, 14);   // 杯子上的字
  for (let k = 0; k < 3; k++) {                                                      // 热气
    const ph = (t * .5 + k / 3) % 1;
    ctx.save(); ctx.globalAlpha *= Math.sin(PI * ph) * .5; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); for (let u = 0; u <= 1; u += .1) { const yy = -100 - u * 90 - ph * 30, xx = (k - 1) * 34 + Math.sin(u * 6 + t * 2 + k) * 9; u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
function tag(s, sub, x, y, a, col, sc = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.05);
  ctx.fillStyle = 'rgba(20,22,30,.92)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(-110, -56); ctx.lineTo(90, -56); ctx.lineTo(126, 0); ctx.lineTo(90, 56); ctx.lineTo(-110, 56); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(94, 0, 7, 0, TAU); ctx.fill();
  ctx.restore();
  text(sub, x - 8, y - 22, { font: SANS, size: 24, weight: 500, align: 'center', color: '#9aa3b2', alpha: a });
  text(s, x - 8, y + 16, { font: SERIF, size: 48 * sc, weight: 900, align: 'center', color: col, alpha: a });
}
function sceneMug(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('买家只出 2.87 美元，', 540, 492, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('卖家要多少？', 540, 600, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const rev = E.out(prog(t, Q.REVEAL, Q.REVEAL + .4)), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  mug(540, 880, 1.1 + .04 * rev * (1 - prog(t, Q.REVEAL + .4, Q.REVEAL + 1)), 1, t);
  tag('$2.87', '买家', 230, 1110, 1, TEAL);
  tag('$7.12', '卖家', 850, 1110, rev, ORANGE, 1 + .15 * (1 - prog(t, Q.REVEAL, Q.REVEAL + .6)));
  if (t < Q.REVEAL + .4) tag('?', '卖家', 850, 1110, 1 - rev, '#c3cad6');
  const xa = sstep(Q.TIMES, Q.TIMES + .5, t) * (1 - sstep(14.9, 15.4, t));
  if (xa > 0) text('≈ 2.5 倍', 540, 1110, { font: SERIF, size: 56, weight: 900, align: 'center', color: ORANGE, alpha: xa, glow: `rgba(${O_RGB},.6)`, blur: 18 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t);
  [['A · $3', 270], ['B · $5', 540], ['C · $7', 810]].forEach(([s, x]) => pill(s, x, 1270, oa, { size: 30, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.7, 20.4, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('极简主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('MINIMALISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第三季 · 主义 ⑧', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}

// ======================================================================== ③ 越攒越多：东西一件件掉下来堆成山；梭罗的小木屋
let STUFF = [];
function stuff(it, x, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(it.rot);
  ctx.fillStyle = it.col; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (it.kind === 0) ctx.roundRect(-it.w / 2, -it.h / 2, it.w, it.h, 6);                          // 盒子
  else if (it.kind === 1) ctx.ellipse(0, 0, it.w / 2, it.h / 2, 0, 0, TAU);                         // 圆的
  else { ctx.moveTo(-it.w / 2, it.h / 2); ctx.lineTo(0, -it.h / 2); ctx.lineTo(it.w / 2, it.h / 2); ctx.closePath(); }   // 三角
  ctx.fill(); ctx.stroke();
  if (it.kind === 0) { ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.moveTo(-it.w / 2, 0); ctx.lineTo(it.w / 2, 0); ctx.stroke(); }
  ctx.restore();
}
function pileAt(t, n0, n1, a, lift = 0) {
  for (let i = n0; i < n1; i++) {
    const it = STUFF[i], k = E.out(prog(t, it.t, it.t + .5)); if (k <= 0) continue;
    const y = lerp(it.y - 900, it.y, E.in(k) * .4 + k * .6) - lift * (300 + 900 * it.r), x = it.x + lift * (it.r - .5) * 400;
    stuff(it, x, y, a * Math.max(0, 1 - lift * 1.4));
  }
}
function cabin(t, a) {
  if (a <= 0) return;
  const k = E.io(prog(t, 24.2, 26.2));
  for (let j = 0; j < 6; j++) seg(120 + j * 18, 1140 + j * 18, 960 - j * 18, 1140 + j * 18, `rgba(150,190,210,${.45 - j * .06})`, 1.5, a * k);   // 湖
  for (const [x, h] of [[170, 300], [260, 220], [860, 330], [940, 240]]) {                       // 松树
    ctx.save(); ctx.globalAlpha *= a * k; ctx.fillStyle = '#0f1a14'; ctx.strokeStyle = 'rgba(216,199,159,.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, 1120 - h); ctx.lineTo(x + h * .22, 1120); ctx.lineTo(x - h * .22, 1120); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  drawOn(() => { ctx.moveTo(400, 1120); ctx.lineTo(400, 960); ctx.lineTo(540, 870); ctx.lineTo(680, 960); ctx.lineTo(680, 1120); ctx.closePath(); }, 1000, k, 'rgba(232,214,176,.9)', 3, a);
  drawOn(() => ctx.rect(510, 1030, 60, 90), 320, k, 'rgba(232,214,176,.9)', 2.5, a);
  drawOn(() => ctx.rect(420, 990, 54, 44), 200, k, 'rgba(232,214,176,.9)', 2.5, a);
  const lit = sstep(25.6, 26.6, t);
  if (lit > 0) { ctx.save(); ctx.globalAlpha = a * lit; ctx.fillStyle = 'rgba(255,200,120,.55)'; ctx.fillRect(422, 992, 50, 40); ctx.restore(); warmth(a * lit * .8, 447, 1012, 260); }
  ctx.save(); ctx.globalAlpha = a * sstep(25.0, 26.0, t) * .8; ctx.strokeStyle = 'rgba(232,214,176,.5)'; ctx.lineWidth = 2;   // 烟囱的烟
  ctx.beginPath(); for (let u = 0; u <= 1; u += .05) { const xx = 630 + Math.sin(u * 7 + t) * 14 + u * 40, yy = 900 - u * 200; u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore();
  const p1 = sstep(28.4, 29.0, t), p2 = sstep(32.2, 32.8, t);
  text('$28.12', 540, 700, { font: SERIF, size: 72, weight: 900, align: 'center', color: ORANGE, alpha: a * p1 * (1 - .4 * p2), glow: `rgba(${O_RGB},.5)`, blur: 20 });
  text('2 年 2 个月', 540, 790, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: a * p2 });
}
function scenePile(t) {
  if (t < 19.9 || t > LIFE + .3) return;
  const A1 = sstep(19.9, 20.3, t) * (1 - sstep(23.6, 24.2, t));
  pileAt(t, 0, 70, A1);
  cabin(t, sstep(24.0, 24.5, t) * (1 - sstep(COST - .7, COST - .1, t)));
  // 东西的代价：东西围着“你”越聚越多，你越来越暗
  const A3 = sstep(COST - .2, COST + .4, t) * (1 - sstep(LIFE - .5, LIFE + .1, t));
  if (A3 > 0) {
    const cx = 540, cy = 900, n = Math.floor(lerp(10, 140, sstep(COST, 47.5, t))), dim = sstep(44.9, 48.0, t);
    for (let i = 0; i < n; i++) {
      const it = STUFF[i], an = it.r * TAU + t * .15 * (i % 2 ? 1 : -1), R = 110 + 260 * Math.sqrt((i + 1) / 140);
      stuff(it, cx + Math.cos(an) * R, cy + Math.sin(an) * R * .85, A3 * .85 * sstep(0, 1, (n - i) / 4));
    }
    you(cx, cy, t, A3 * (1 - .65 * dim), 12);
    [['幸福感', '↓', 45.2, TEAL], ['焦虑', '↑', 49.1, '#e5484d'], ['抑郁', '↑', 49.6, '#e5484d']].forEach(([lab, sym, t0, col], i) => {
      const k = E.outExpo(prog(t, t0, t0 + .6)); if (k <= 0) return;
      pill(`${lab} ${sym}`, 260 + i * 280, 1300, A3 * k, { size: 30, stroke: col, color: col });
    });
  }
}

// ======================================================================== ④ 生命的价格：价签上的数字，变成沙漏里的沙
function sceneLife(t) {
  if (t < LIFE - .4 || t > EXP + .2) return;
  const A = sstep(LIFE - .1, LIFE + .5, t) * (1 - sstep(EXP - .8, EXP - .1, t));
  if (A <= 0) return;
  tag('¥ 6999', '价格', 300, 900, A, CREAM, 1.3);
  text('=', 540, 900, { font: SERIF, size: 110, weight: 700, align: 'center', color: CREAM, alpha: A * sstep(57.9, 58.4, t) });
  const hx = 790, hy = 900, hk = sstep(58.2, 58.8, t);                                 // 沙漏
  if (hk > 0) {
    ctx.save(); ctx.globalAlpha = A * hk; ctx.strokeStyle = CREAM; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(hx - 90, hy - 150); ctx.lineTo(hx + 90, hy - 150); ctx.lineTo(hx + 10, hy); ctx.lineTo(hx + 90, hy + 150); ctx.lineTo(hx - 90, hy + 150); ctx.lineTo(hx - 10, hy); ctx.closePath(); ctx.stroke();
    const sand = prog(t, 58.4, 63.4), top = 1 - sand;
    ctx.fillStyle = ORANGE; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(hx - 80 * top, hy - 140 * top); ctx.lineTo(hx + 80 * top, hy - 140 * top); ctx.lineTo(hx + 4, hy - 4); ctx.lineTo(hx - 4, hy - 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx - 80, hy + 146); ctx.lineTo(hx + 80, hy + 146); ctx.lineTo(hx + 80 * (1 - sand * .9), hy + 146 - 120 * sand); ctx.lineTo(hx - 80 * (1 - sand * .9), hy + 146 - 120 * sand); ctx.closePath(); ctx.fill();
    for (let k = 0; k < 6; k++) glow(hx, hy + ((t * 2 + k / 6) % 1) * (140 - 120 * sand), 2, O_RGB, .8, 2);
    ctx.restore();
    text('生命', hx, hy + 210, { size: 36, weight: 900, align: 'center', color: ORANGE, alpha: A * sstep(58.8, 59.4, t) });
  }
}

// ======================================================================== ⑤ 经历：一堆东西变灰，一串回忆亮起来
function sceneExp(t) {
  if (t < EXP - .2 || t > CLIMAX + .3) return;
  const A = sstep(EXP + .2, EXP + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const split = sstep(67.9, 68.8, t), dull = sstep(72.2, 74.0, t);
  for (let i = 0; i < 18; i++) {                                                     // 东西：慢慢变灰、蒙尘
    const it = STUFF[i], x = 300 + (i % 4 - 1.5) * 70 + (it.r - .5) * 20, y = 1080 - Math.floor(i / 4) * 60;
    stuff({ ...it, col: dull > .5 ? '#5d6370' : it.col }, x, y, A * split * (1 - .5 * dull));
  }
  text('东西', 300, 700, { size: 40, weight: 900, align: 'center', color: dull > .5 ? '#8a93a3' : CREAM, alpha: A * split });
  for (let i = 0; i < 14; i++) {                                                     // 经历：一颗颗亮起来的回忆
    const r = mulberry(2100 + i), k = sstep(68.4 + i * .25, 68.9 + i * .25, t), x = 780 + (r() - .5) * 220, y = 760 + r() * 380;
    glow(x + Math.sin(t * .8 + i) * 8, y + Math.cos(t * .7 + i) * 8, 5 + 4 * r() + 3 * dull, '255,214,160', A * split * k, 5);
  }
  text('经历', 780, 700, { size: 40, weight: 900, align: 'center', color: ORANGE, alpha: A * split, glow: `rgba(${O_RGB},.5)`, blur: 16 });
  seg(540, 720, 540, 1160, 'rgba(236,230,218,.2)', 1.5, A * split);
  you(540, 900, t, A * (1 - split), 11);
}

// ======================================================================== ⑥ 放下：东西都飘走，只留下你和几样真正需要的
function sceneLetGo(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1060, 760);
  const up = E.io(prog(t, CLIMAX + .2, 92.0));
  pileAt(t + 999, 0, 120, A * (1 - sstep(91.0, 92.6, t)), up);                         // 整堆东西慢慢升起、散开、消失
  const keep = [['书', 400], ['杯子', 540], ['朋友', 680]];                             // 留下的几样
  keep.forEach(([s, x], i) => {
    const k = sstep(86.0 + i * .4, 86.6 + i * .4, t);
    pill(s, x, 1220, A * k, { size: 28, stroke: `rgba(${O_RGB},.7)`, color: '#ffd2a0' });
  });
  you(540, 1080, t, A, 12);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「一个人有多富有，', 540, 580, { ...big, size: 64, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.2), qa);
  typeText('要看他能放下多少东西。」', 540, 680, { ...big, size: 64, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.3, CLIMAX + 2.3), qa);
  typeText('—— 梭罗《瓦尔登湖》', 540, 780, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.1), qa);
  typeText('他说：', 540, 556, { ...big, size: 46, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('「简单，简单，再简单！」', 540, 682, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
  typeText('—— 梭罗《瓦尔登湖》', 540, 790, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, FINAL + 1.0, FINAL + 1.6), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneMug(t); sceneTitle(t); scenePile(t); sceneLife(t); sceneExp(t); sceneLetGo(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2) || (T > 19.9 && T < 23.8)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 25.6, 35, .5, .8) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1990', 'Kahneman, Knetsch & Thaler · JPE', 8.2, 15.6, T);
  stamp('1845–1847', 'Thoreau · Walden', 24.0, 35.3, T);
  stamp('2014', 'Dittmar et al. · JPSP', 40.9, 52.9, T);
  stamp('2003', 'Van Boven & Gilovich · JPSP', 67.9, 75.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(21);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rs = mulberry(210), cols = ['#5b6b86', '#8a5a44', '#4f7a6b', '#a07a3c', '#6b4f7a', '#3f5f8a', '#7a3f4f', '#8a8f99'];
  STUFF = Array.from({ length: 140 }, (_, i) => {
    const row = Math.floor(i / 14), x = 140 + (i % 14) * 62 + (rs() - .5) * 40, y = 1260 - row * 46 - Math.sin((x - 140) / 800 * PI) * row * 18;
    return { x, y, w: 50 + rs() * 60, h: 36 + rs() * 50, kind: Math.floor(rs() * 3), col: cols[Math.floor(rs() * cols.length)], rot: (rs() - .5) * .6, t: 19.9 + i * .05 + rs() * .3, r: rs() };
  });
}

// ======================================================================== 音效提示表（音高都在 A 小调里，最后一个和弦是 A 大调）
const NOTE = { A5: 880, Cs6: 1108.73, C6: 1046.5, E6: 1318.51, A6: 1760, C7: 2093.0, Cs7: 2217.46, E7: 2637.02, A7: 3520.0, E5: 659.26, B5: 987.77 };
const AM_SHIM = [NOTE.C7, NOTE.E7, NOTE.A6, NOTE.A7, NOTE.E6], AMAJ_SHIM = [NOTE.Cs7, NOTE.E7, NOTE.A6, NOTE.A7, NOTE.E6], AM_SWELL = [220.0, 329.63, 440.0, 523.25, 659.26];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.A5, NOTE.C6, NOTE.E6], gain: .26 }], [Q.REVEAL, 'slap', { gain: .4, pan: .4 }], [Q.TIMES, 'tink', { f: NOTE.E6, gain: .2 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: AM_SHIM, gain: .28 }]);
  for (let i = 0; i < 12; i++) c.push([19.9 + i * .3 + .4, 'thunk', { gain: .12 + .01 * i }]);
  c.push([24.2, 'wind', { dur: 4, gain: .14 }], [25.6, 'tink', { f: NOTE.E6, gain: .2 }], [28.4, 'chord', { f: [NOTE.A5, NOTE.C6, NOTE.E6], gain: .14 }]);
  c.push([COST, 'whoosh', { dur: .5, gain: .25 }], [45.2, 'bar', { f0: 659, f1: 330, dur: 1.0, gain: .35 }], [49.1, 'click', { gain: .3 }], [49.6, 'click', { gain: .3 }]);
  c.push([LIFE, 'whoosh', { dur: .5, gain: .22 }], [58.2, 'dust', { dur: 5, gain: .16 }]);
  c.push([67.9, 'shimmer', { f: AM_SHIM, gain: .22 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: AM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: AM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 110, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: AMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.A5, NOTE.Cs6, NOTE.E6], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
