// ======================================================================== No.27 苦行主义：越自律，越自由吗？
// 第四季·你身上的主义 ④。开头是一道选择题：饿着肚子只准吃萝卜，接着做解不开的题，你能撑多久？（Baumeister et al., 1998）
// 音乐：原创配乐（music.py，降 B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机先往上“拽”一下，再松开、落定。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 诱惑（每拍一个鼓点） · 53.33 苦行六年（紧张） · 64.0 琴弦（只剩钢琴） · 80.0 高潮 · 96.0 降 B 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), TEMPT = BT(56), ASC = BT(80), STR = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['萝卜测试', 0, LIFT], ['自我损耗', LIFT, TEMPT], ['诱惑', TEMPT, ASC], ['苦行六年', ASC, STR], ['琴弦', STR, CLIMAX], ['刚刚好', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.27';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '饿着肚子，面前是刚烤好的饼干，你却只准吃萝卜。'],
  [4.1, 7.6, '接着做一道解不开的题。你能撑多久？先猜一个。'],
  [8.2, 10.4, '吃萝卜的人，大约 8 分钟就放弃了。'],
  [10.8, 13.3, '吃饼干的人，撑了大约 19 分钟。'],
  [13.6, 15.7, '结论是：意志力像电池，会用完。'],
  [16.3, 19.6, '这个理论叫「自我损耗」，一度红遍心理学界。'],
  [19.9, 23.7, '于是我们相信：自律，就是咬着牙硬撑。'],
  [24.0, 27.4, '可 2016 年，23 个实验室、两千多人，'],
  [27.7, 31.3, '用同一套方法，重新做了一遍。'],
  [31.6, 35.3, '结果：效果几乎是零。'],
  [37.6, 40.6, '2021 年，36 个实验室再试：还是几乎为零。'],
  [40.9, 44.6, '那些真正自律的人，靠的是什么？'],
  [44.9, 48.6, '一项研究追踪了一群大学生，一天问好几次：'],
  [48.9, 52.9, '能完成目标的人，不是忍得更多，而是碰到的诱惑更少。'],
  [53.6, 57.6, '把欲望当成敌人，越苦越好，这就是「苦行主义」。'],
  [57.9, 63.4, '相传佛陀出家后，苦行了六年，饿到皮包骨，却没有因此开悟。'],
  [64.3, 67.6, '后来，他接过一碗乳粥，放弃了苦行。'],
  [67.9, 71.9, '有个弟子修行太用力，走路走到脚都流了血。'],
  [72.2, 75.9, '佛陀问他：琴弦太紧或者太松，还弹得出好声音吗？'],
  [76.3, 79.6, '弟子说：都弹不出。佛陀说：'],
  [84.9, 88.6, '自律，不是把弦拉到最紧，'],
  [88.9, 92.6, '是调到刚好，能弹出声音。'],
  [98.4, 103.0, '评论区：你自律靠硬撑，还是靠安排？'],
];
const BIGLINES = [
  [80.2, 92.6, '「精进太过，会让人躁动；太松，会让人懈怠。要给你的精进，调好音准。」——《增支部》'],
  [93.4, 98.0, '少一点硬撑，多一点安排：把诱惑放远一点。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [TEMPT - .5, .2], [TEMPT, .06], [STR, .06],
  [STR + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== ① 萝卜测试（0–16）
function cookie(x, y, r, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  const g = ctx.createRadialGradient(-r * .3, -r * .3, 2, 0, 0, r); g.addColorStop(0, '#d9a066'); g.addColorStop(1, '#8a5a30');
  ctx.fillStyle = g; ctx.shadowColor = 'rgba(242,170,90,.5)'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#3a2214'; for (let i = 0; i < 6; i++) { const an = i * 2.3 + 1, rr = r * (.25 + .5 * ((i * 37) % 10) / 10); ctx.beginPath(); ctx.ellipse(Math.cos(an) * rr, Math.sin(an) * rr, r * .12, r * .09, an, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function radish(x, y, r, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.3 + x) * .05);
  ctx.fillStyle = '#5f9a5a'; for (const an of [-.5, 0, .5]) { ctx.save(); ctx.rotate(an); ctx.beginPath(); ctx.ellipse(0, -r * 1.3, r * .28, r * .7, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  const g = ctx.createRadialGradient(-r * .3, -r * .3, 2, 0, 0, r); g.addColorStop(0, '#f06a6a'); g.addColorStop(1, '#a3283a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#f2e6da'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, r * .9); ctx.quadraticCurveTo(3, r * 1.3, 0, r * 1.6); ctx.stroke();
  ctx.restore();
}
function plate(x, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(236,230,218,.08)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y + 40, 190, 50, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
function timerBar(y, lab, mins, col, rgb, k, a) {
  if (a <= 0) return;
  text(lab, 140, y, { font: SANS, size: 28, weight: 500, color: col, alpha: a });
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.roundRect(260, y - 16, Math.max(6, 26 * mins * k), 32, 10); ctx.fill(); ctx.restore();
  text(`≈ ${Math.round(mins * k)} 分钟`, 260 + Math.max(6, 26 * mins * k) + 14, y + 1, { font: SERIF, size: 32, weight: 900, color: col, alpha: a });
}
function battery(x, y, s, lvl, a, col = TEAL) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = CREAM; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(-110, -55, 220, 110, 16); ctx.stroke(); ctx.fillStyle = CREAM; ctx.fillRect(112, -22, 16, 44);
  const c = lvl > .3 ? col : '#e5484d'; ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.roundRect(-96, -41, 192 * clamp(lvl), 82, 8); ctx.fill(); ctx.restore();
}
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('只准吃萝卜，然后做一道解不开的题：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('你能撑多久？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const tableA = 1 - sstep(Q.REVEAL - .2, Q.REVEAL + .3, t) * .7;
  plate(300, 850, tableA); plate(780, 850, tableA);
  [[-60, 0], [50, -10], [-5, 40], [70, 40], [-75, 50]].forEach(([dx, dy], i) => cookie(300 + dx, 840 + dy, 40, tableA, t));
  for (let k = 0; k < 3; k++) { const ph = (t * .5 + k / 3) % 1; ctx.save(); ctx.globalAlpha = tableA * Math.sin(PI * ph) * .5; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); for (let u = 0; u <= 1; u += .1) { const yy = 760 - u * 80 - ph * 30, xx = 270 + k * 30 + Math.sin(u * 6 + t * 2 + k) * 8; u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
  [[-50, 10], [40, 0], [0, 50], [70, 50]].forEach(([dx, dy]) => radish(780 + dx, 830 + dy, 30, tableA, t));
  text('饼干', 300, 980, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#d9a066', alpha: tableA });
  text('萝卜', 780, 980, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#f06a6a', alpha: tableA });
  pill('你只准吃这个', 780, 680, sstep(.6, 1.2, t) * (1 - qOut), { size: 26, stroke: 'rgba(240,106,106,.8)', color: '#f0a0a0' });
  const k1 = E.out(prog(t, Q.REVEAL, Q.REVEAL + 1.0)), k2 = E.out(prog(t, 10.8, 12.0));
  timerBar(1090, '萝卜', 8, '#f06a6a', '240,106,106', k1, sstep(Q.REVEAL, Q.REVEAL + .3, t));
  timerBar(1170, '饼干', 19, '#d9a066', '217,160,102', k2, sstep(10.8, 11.1, t));
  const ba = sstep(13.6, 14.0, t);
  if (ba > 0) { battery(540, 640, .8, 1 - .85 * prog(t, 13.8, 15.4), ba); text('意志力 = 电池？', 540, 520, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#ffd2a0', alpha: ba }); }
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 一样久', 220], ['B · 更久', 540], ['C · 更早放弃', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 硬撑 · 23 个实验室重做
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('苦行主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('ASCETICISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ④', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function flask(x, y, s, a, fill, col = TEAL, rgb = T_RGB) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = CREAM; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-8, -26); ctx.lineTo(-8, -8); ctx.lineTo(-22, 22); ctx.lineTo(22, 22); ctx.lineTo(8, -8); ctx.lineTo(8, -26); ctx.stroke();
  if (fill > 0) { ctx.fillStyle = `rgba(${rgb},.75)`; ctx.beginPath(); ctx.moveTo(-17, 12); ctx.lineTo(17, 12); ctx.lineTo(22, 22); ctx.lineTo(-22, 22); ctx.closePath(); ctx.globalAlpha *= fill; ctx.fill(); }
  ctx.restore();
}
function effectBars(t, a) {                                                                    // 原研究 vs 重做（示意）
  if (a <= 0) return;
  const base = 1240;
  seg(160, base, 920, base, 'rgba(236,230,218,.35)', 2, a);
  [['1998 · 原研究', 300, 260, ORANGE, O_RGB, 31.6], ['2016 · 23 个实验室', 540, 16, TEAL, T_RGB, 32.6], ['2021 · 36 个实验室', 780, 22, TEAL, T_RGB, 37.6]].forEach(([lab, x, h, col, rgb, t0]) => {
    const k = E.out(prog(t, t0, t0 + .9)); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - 50, base - h * k, 100, h * k); ctx.restore();
    text(lab, x, base + 40, { font: SANS, size: 24, align: 'center', color: col, alpha: a * sstep(t0, t0 + .4, t) });
    if (h < 40) text('≈ 0', x, base - 50, { font: SERIF, size: 44, weight: 900, align: 'center', color: TEAL, alpha: a * sstep(t0 + .5, t0 + 1, t) });
  });
  text('效果（示意）', 160, base - 300, { font: SANS, size: 22, color: '#6f7786', alpha: a });
}
function sceneDepletion(t) {
  if (t < 19.7 || t > ASC + .2) return;
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.1, t));
  if (A1 > 0) {
    battery(540, 880, 1.3, 1 - .9 * E.io(prog(t, 20.2, 23.4)), A1);
    text('咬牙硬撑', 540, 1080, { font: SERIF, size: 60, weight: 900, align: 'center', color: '#ffd2a0', alpha: A1 * sstep(20.6, 21.2, t) });
  }
  const A2 = sstep(24.0, 24.5, t) * (1 - sstep(TEMPT + 3.0, TEMPT + 3.4, t));
  if (A2 > 0) {
    const lab = (cx, cy, n, t0, col, rgb) => { for (let i = 0; i < n; i++) { const cols = 8, x = cx + (i % cols - (cols - 1) / 2) * 62, y = cy + Math.floor(i / cols) * 70; flask(x, y, .9, A2 * sstep(t0 + i * .1, t0 + .3 + i * .1, t), sstep(27.7 + i * .05, 28.4 + i * .05, t) * (.6 + .4 * Math.sin(t * 6 + i)), col, rgb); } };
    const up = sstep(31.2, 31.8, t);
    ctx.save(); ctx.translate(0, -230 * up); ctx.globalAlpha = 1 - .5 * up;
    lab(540, 760, 23, 24.1, TEAL, T_RGB);
    text('2,141 人', 540, 1000, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: A2 * sstep(26.0, 26.6, t) * (1 - up) });
    ctx.restore();
    effectBars(t, A2 * sstep(31.4, 31.9, t));
  }
}

// ======================================================================== ③ 诱惑：忍得多 vs 诱惑少
function lure(x, y, kind, a, s = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 3;
  if (kind === 0) { ctx.strokeStyle = '#7fb2ff'; ctx.fillStyle = 'rgba(30,40,70,.95)'; ctx.beginPath(); ctx.roundRect(-16, -28, 32, 56, 6); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#7fb2ff'; ctx.fillRect(-10, -20, 20, 32); }          // 手机
  else if (kind === 1) { ctx.strokeStyle = '#f2a0c0'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.stroke(); }                                                                                          // 甜甜圈
  else { ctx.strokeStyle = '#b8f28a'; ctx.fillStyle = 'rgba(30,50,30,.95)'; ctx.beginPath(); ctx.roundRect(-28, -16, 56, 32, 14); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#b8f28a'; ctx.beginPath(); ctx.arc(-12, 0, 4, 0, TAU); ctx.arc(12, 0, 4, 0, TAU); ctx.fill(); }   // 手柄
  ctx.restore();
}
function sceneLanes(t) {
  if (t < 40.6 || t > ASC + .2) return;
  const A = sstep(40.9, 41.5, t) * (1 - sstep(ASC - .6, ASC - .05, t));
  if (A <= 0) return;
  const lanes = [[860, '忍得多', 0], [1160, '诱惑少', 1]], x0 = 150, x1 = 900;
  lanes.forEach(([y, lab, easy]) => {
    seg(x0, y, x1, y, 'rgba(236,230,218,.25)', 2, A);
    text(lab, x0, y - 104, { font: SERIF, size: 36, weight: 900, color: easy ? TEAL : '#f0a0a0', alpha: A * sstep(44.9 + easy * .4, 45.4 + easy * .4, t) });
    ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1 + 20, y); ctx.lineTo(x1 + 20, y - 70); ctx.stroke();
    ctx.fillStyle = easy && t > 49.6 ? ORANGE : 'rgba(236,230,218,.5)'; ctx.beginPath(); ctx.moveTo(x1 + 20, y - 70); ctx.lineTo(x1 + 66, y - 56); ctx.lineTo(x1 + 20, y - 42); ctx.closePath(); ctx.fill(); ctx.restore();
  });
  const beats = Math.max(0, (t - 41.0) / BEAT);
  // 上：每一拍冒出一个诱惑，人要停下来忍
  const n = Math.min(14, Math.floor(beats) + 1);
  for (let i = 0; i < n; i++) { const x = x0 + 70 + i * 52, pop = E.outExpo(prog(t, 41.0 + i * BEAT, 41.3 + i * BEAT)); lure(x, 860 - 40, i % 3, A * pop * .9, .8); }
  const topX = x0 + 40 + 220 * E.io(prog(t, 41.0, 52.0)), strain = Math.abs(Math.sin(t * 9)) * 4;
  glow(topX + strain, 860, 11, '240,160,160', A, 5);
  for (const k of [-1, 1]) seg(topX - 18, 860 + k * 14, topX - 30, 860 + k * 22, 'rgba(240,160,160,.7)', 2, A * (.5 + .5 * Math.sin(t * 9)));
  // 下：只有两个诱惑，绕开就过去了
  lure(x0 + 300, 1160 - 40, 0, A * sstep(41.5, 41.9, t) * .9, .8); lure(x0 + 560, 1160 - 40, 1, A * sstep(42.2, 42.6, t) * .9, .8);
  const botX = lerp(x0 + 40, x1, E.io(prog(t, 41.0, 49.6)));
  glow(botX, 1160, 11, T_RGB, A, 5);
  if (t > 49.6) text('目标完成', x1 - 30, 1230, { font: SERIF, size: 34, weight: 900, align: 'right', color: ORANGE, alpha: A * sstep(49.6, 50.2, t), glow: `rgba(${O_RGB},.5)`, blur: 14 });
}

// ======================================================================== ④ 苦行六年：树下越来越瘦的人
function sitter(x, y, s, thin, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = `rgba(${O_RGB},.4)`; ctx.shadowBlur = 12 * (1 - thin);
  const w = lerp(1, .55, thin);
  ctx.beginPath(); ctx.ellipse(0, 40, 120, 26, 0, 0, TAU); ctx.fill(); ctx.stroke();                                           // 盘腿
  ctx.beginPath(); ctx.moveTo(-60 * w, 30); ctx.quadraticCurveTo(-62 * w, -40, -30 * w, -80); ctx.lineTo(30 * w, -80); ctx.quadraticCurveTo(62 * w, -40, 60 * w, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, -118, 30 * lerp(1, .8, thin), 36, 0, 0, TAU); ctx.fill(); ctx.stroke();
  if (thin > .3) { ctx.globalAlpha *= (thin - .3) / .7; ctx.lineWidth = 1.6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-22 * w, -50 + i * 14); ctx.quadraticCurveTo(0, -46 + i * 14, 22 * w, -50 + i * 14); ctx.stroke(); } }   // 肋骨
  ctx.restore();
}
function tree(x, y, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(216,199,159,.6)'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 20, y - 160, x + 10, y - 320); ctx.stroke(); ctx.restore();
  for (let i = 0; i < 46; i++) { const r = mulberry(2700 + i), an = r() * TAU, rr = Math.sqrt(r()) * 200; glow(x + Math.cos(an) * rr * 1.3, y - 380 + Math.sin(an) * rr * .7, 4 + 4 * r(), '127,178,122', a * .45, 3); }
}
function sceneAscetic(t) {
  if (t < ASC - .3 || t > STR + .2) return;
  const A = sstep(ASC - .1, ASC + .5, t) * (1 - sstep(STR - .7, STR - .1, t));
  if (A <= 0) return;
  const thin = E.io(prog(t, 57.9, 63.2));
  tree(700, 1180, A, t);
  sitter(480, 1120, 1.1, thin, A * sstep(53.8, 54.4, t), thin > .5 ? '#9aa3b2' : CREAM);
  const yrs = Math.min(6, 1 + Math.floor(prog(t, 57.9, 63.0) * 6));
  if (t > 57.9) text(`第 ${yrs} 年`, 480, 760, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#9aa3b2', alpha: A * sstep(57.9, 58.4, t) });
}

// ======================================================================== ⑤ 琴弦：太紧、太松、刚好
function stringLine(y, kind, a, t, x0 = 180, x1 = 900) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  const col = kind === 0 ? '#e5484d' : kind === 1 ? '#8a93a3' : '#f7d27a';
  ctx.strokeStyle = col; ctx.lineWidth = kind === 2 ? 4 : 3; ctx.shadowColor = col; ctx.shadowBlur = kind === 2 ? 22 : 8;
  ctx.beginPath();
  for (let i = 0; i <= 120; i++) {
    const u = i / 120, x = lerp(x0, x1, u);
    const yy = kind === 0 ? y + Math.sin(u * PI * 9) * 3 * Math.sin(t * 60) : kind === 1 ? y + Math.sin(u * PI) * 46 : y + Math.sin(u * PI) * 16 * Math.sin(t * 9);
    i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
  }
  ctx.stroke();
  ctx.fillStyle = CREAM; ctx.shadowBlur = 0; ctx.beginPath(); ctx.arc(x0, y, 7, 0, TAU); ctx.arc(x1, y, 7, 0, TAU); ctx.fill();
  ctx.restore();
}
function sceneString(t) {
  if (t < STR - .2 || t > CLIMAX + .3) return;
  const A = sstep(STR + .2, STR + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const A1 = A * (1 - sstep(67.4, 67.9, t));                                                   // 一碗乳粥
  if (A1 > 0) {
    sitter(400, 1120, 1.1, 1 - E.io(prog(t, 64.6, 67.2)), A1, CREAM);
    ctx.save(); ctx.globalAlpha = A1; ctx.fillStyle = 'rgba(236,230,218,.9)'; ctx.beginPath(); ctx.ellipse(700, 1120, 90, 26, 0, 0, PI); ctx.fill(); ctx.fillStyle = '#f4ead8'; ctx.beginPath(); ctx.ellipse(700, 1120, 90, 18, 0, 0, TAU); ctx.fill(); ctx.restore();
    warmth(A1 * .8, 700, 1100, 220);
    for (let k = 0; k < 3; k++) { const ph = (t * .5 + k / 3) % 1; ctx.save(); ctx.globalAlpha = A1 * Math.sin(PI * ph) * .5; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); for (let u = 0; u <= 1; u += .1) { const yy = 1090 - u * 90 - ph * 30, xx = 670 + k * 30 + Math.sin(u * 6 + t * 2 + k) * 8; u ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
  }
  const A2 = A * sstep(67.9, 68.4, t) * (1 - sstep(71.8, 72.2, t));                             // 走到脚流血的脚印
  if (A2 > 0) for (let i = 0; i < 10; i++) {
    const k = sstep(68.0 + i * .3, 68.3 + i * .3, t), x = 180 + i * 76, y = 1000 + (i % 2) * 50;
    ctx.save(); ctx.globalAlpha = A2 * k; ctx.fillStyle = 'rgba(236,230,218,.5)'; ctx.beginPath(); ctx.ellipse(x, y, 16, 28, .2, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(229,72,77,.7)'; ctx.beginPath(); ctx.arc(x + 4, y + 12, 5, 0, TAU); ctx.fill(); ctx.restore();
  }
  const A3 = A * sstep(72.2, 72.8, t);
  if (A3 > 0) {
    const pick = sstep(76.3, 77.0, t);
    [[800, 0, '太紧'], [950, 1, '太松'], [1130, 2, '刚好']].forEach(([y, kind, lab], i) => {
      const k = sstep(72.4 + i * .5, 72.9 + i * .5, t), dim = kind < 2 ? 1 - .6 * pick : 1;
      stringLine(y, kind, A3 * k * dim, t, 260, 920);
      text(lab, 200, y + (kind === 1 ? 20 : 0), { font: SERIF, size: 34, weight: 900, align: 'right', color: kind === 0 ? '#e5484d' : kind === 1 ? '#8a93a3' : '#f7d27a', alpha: A3 * k * dim });
    });
    text('躁动', 940, 800, { font: SANS, size: 24, color: '#e5484d', alpha: A3 * sstep(73.0, 73.4, t) * (1 - .6 * pick) });
    text('懈怠', 940, 990, { font: SANS, size: 24, color: '#8a93a3', alpha: A3 * sstep(73.5, 73.9, t) * (1 - .6 * pick) });
  }
}

// ======================================================================== ⑥ 刚刚好：一根调好的弦，声音一圈圈传出去
function sceneTuned(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1100, 760);
  const y = 1110, big = 1 + .6 * sstep(FINAL, FINAL + 1.2, t);
  for (let k = 0; k < 6; k++) {                                                                 // 声音一圈圈传出去
    const ph = ((t - CLIMAX) * .45 + k / 6) % 1;
    ctx.save(); ctx.globalAlpha = A * (1 - ph) * .35 * big; ctx.strokeStyle = '#f7d27a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(540, y, 120 + ph * 520, 30 + ph * 200, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha = A; ctx.lineCap = 'round'; ctx.strokeStyle = '#f7d27a'; ctx.lineWidth = 5; ctx.shadowColor = 'rgba(247,210,122,.9)'; ctx.shadowBlur = 30;
  ctx.beginPath(); for (let i = 0; i <= 160; i++) { const u = i / 160, x = lerp(120, 960, u), yy = y + Math.sin(u * PI) * 22 * big * Math.sin(t * 8) + Math.sin(u * PI * 2) * 6 * Math.sin(t * 16); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke();
  ctx.fillStyle = CREAM; ctx.shadowBlur = 0; ctx.beginPath(); ctx.arc(120, y, 9, 0, TAU); ctx.arc(960, y, 9, 0, TAU); ctx.fill(); ctx.restore();
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「精进太过，会让人躁动；', 540, 500, { ...big0, size: 54, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('太松，会让人懈怠。', 540, 594, { ...big0, size: 54, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.4, CLIMAX + 2.2), qa);
  typeText('要给你的精进，调好音准。」', 540, 694, { ...big0, size: 60, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.4), qa);
  typeText('——《增支部》（意译）', 540, 786, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.6, CLIMAX + 4.2), qa);
  typeText('少一点硬撑，多一点安排：', 540, 560, { ...big0, size: 52, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('把诱惑放远一点。', 540, 666, { ...big0, size: 72, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}
const big0 = big;

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneDepletion(t); sceneLanes(t); sceneAscetic(t); sceneString(t); sceneTuned(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.2, 80, .5, .3) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1998', 'Baumeister et al. · JPSP', 8.2, 19.6, T);
  stamp('2016', 'Hagger et al. · Perspect Psychol Sci', 24.0, 35.3, T);
  stamp('2021', 'Vohs et al. · Psychol Sci', 37.6, 40.6, T);
  stamp('2017', 'Milyavskaya & Inzlicht · SPPS', 44.9, 52.9, T);
  stamp('AN 6.55', 'Soṇa Sutta · Aṅguttara Nikāya', 67.9, 79.6, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(27);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在降 B 小调里，最后一个和弦是降 B 大调）
const NOTE = { Bb4: 466.16, Db5: 554.37, D5: 587.33, F5: 698.46, Bb5: 932.33, Db6: 1108.73, D6: 1174.66, F6: 1396.91, Bb6: 1864.66 };
const BM_SHIM = [NOTE.Db6, NOTE.F6, NOTE.Bb5, NOTE.Bb6, NOTE.F5], BMAJ_SHIM = [NOTE.D6, NOTE.F6, NOTE.Bb5, NOTE.Bb6, NOTE.F5], BM_SWELL = [116.54, 174.61, 233.08, 277.18, 349.23];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.Bb4, NOTE.Db5, NOTE.F5], gain: .24 }], [Q.REVEAL + .1, 'bar', { f0: 233, f1: 349, dur: .9, gain: .18 }], [10.8, 'bar', { f0: 233, f1: 466, dur: 1.2, gain: .18 }]);
  c.push([13.8, 'bar', { f0: 466, f1: 155, dur: 1.6, gain: .2 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BM_SHIM, gain: .28 }]);
  c.push([20.2, 'bar', { f0: 466, f1: 117, dur: 3.2, gain: .16 }], [27.7, 'dust', { dur: 3.4, gain: .1 }], [31.6, 'thud', { gain: .24 }], [32.6, 'tick', { gain: .2 }]);
  for (let i = 0; i < 6; i++) c.push([24.1 + i * .4, 'tink', { f: [NOTE.F5, NOTE.Bb5, NOTE.Db6][i % 3], gain: .07 }]);
  c.push([TEMPT, 'whoosh', { dur: .5, gain: .25 }], [37.6, 'tick', { gain: .2 }], [49.6, 'shimmer', { f: BM_SHIM, gain: .2 }], [49.7, 'chord', { f: [NOTE.Bb4, NOTE.Db5, NOTE.F5], gain: .12 }]);
  c.push([ASC, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'wind', { dur: 5.4, gain: .12 }]);
  c.push([64.6, 'shimmer', { f: BM_SHIM, gain: .14 }], [72.4, 'tink', { f: NOTE.F6, gain: .1 }], [72.9, 'thud', { gain: .1 }], [73.4, 'tink', { f: NOTE.Bb5, gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: BM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 116.54, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: BMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Bb4, NOTE.D5, NOTE.F5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
