// ======================================================================== No.43 理想主义：热爱，是找到的吗？
// 第五季·看不见的主义 ⑩（完结）。开头是一道选择题：先看好看的黑洞视频，再读很难的黑洞论文；相信“热爱靠找”的人，兴趣会怎样？（O'Keefe, Dweck & Walton, 2018）
// 音乐：原创配乐（music.py，降 E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机会“长”：每回来一次，就多一个音。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 一个篮子（每拍一个鼓点） · 53.33 后来（紧张） · 64.0 慢慢长（只剩钢琴） · 80.0 高潮：一棵树 · 96.0 降 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), BASKET = BT(56), LATER = BT(80), GROW = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['黑洞', 0, LIFT], ['找', LIFT, BASKET], ['一个篮子', BASKET, LATER], ['后来', LATER, GROW], ['慢慢长', GROW, CLIMAX], ['一棵树', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.43';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '先看一段很好看的黑洞视频，再读一篇很难的黑洞论文。'],
  [4.1, 7.6, '相信「热爱靠找」的人，兴趣会怎样？先猜一个。'],
  [8.2, 10.4, '答案是：掉得更多。'],
  [10.8, 13.3, '看视频的时候，大家都觉得黑洞很有意思；'],
  [13.6, 15.7, '一难起来，他们的兴趣掉得更快。'],
  [16.3, 19.6, '很多人心里，都有一个理想：'],
  [19.9, 23.7, '总有一件事，是我命中注定的热爱；找到它，就不会累。'],
  [24.0, 27.4, '心理学家把这叫做「兴趣的固定观」：'],
  [27.7, 31.3, '热爱是现成的，只等你去找。'],
  [31.6, 35.3, '这就是「理想主义」的一种：完美的那一个，就在某处等你。'],
  [37.6, 40.6, '研究发现，这样想的人，'],
  [40.9, 44.6, '对自己领域以外的东西，兴趣更少；'],
  [44.9, 48.6, '还以为找到热爱以后，动力会无穷无尽。'],
  [48.9, 52.9, '研究者说：这像把鸡蛋都放进一个篮子，篮子一沉，就扔了。'],
  [53.6, 57.6, '另一项研究发现：相信「找」的人，一开始更觉得自己选对了；'],
  [57.9, 63.4, '可后来，相信「找」和相信「养」的人，对工作的热爱和满意，差不多。'],
  [64.3, 67.6, '所以，热爱也许不是找到的，'],
  [67.9, 71.9, '是你一次次回去、一点点做，慢慢长出来的。'],
  [72.2, 75.9, '难的那一段，不一定是选错了，可能只是它正在长。'],
  [76.3, 79.6, '那篇论文最后，研究者建议：'],
  [84.9, 88.6, '这一季，我们聊了十个「看不见的主义」。'],
  [88.9, 92.6, '谢谢你，一期一期看到这里。'],
  [98.4, 103.0, '评论区：你有哪件事，是慢慢才喜欢上的？'],
];
const BIGLINES = [
  [80.2, 92.6, '与其「找到」你的热爱，不如「培养」它。—— 奥基夫、德韦克 & 沃尔顿（大意）'],
  [93.4, 98.0, '热爱，是养出来的。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [BASKET - .5, .2], [BASKET, .06], [GROW, .06],
  [GROW + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、黑洞、门、篮子、芽、树
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function blackHole(x, y, r, t, a) {                                                                 // 吸积盘绕着一个黑点转
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  for (let i = 0; i < 46; i++) {
    const ang = i / 46 * TAU + t * .9, rr = r * (1.05 + .5 * ((i * 37) % 11) / 11);
    const px = Math.cos(ang) * rr, py = Math.sin(ang) * rr * .32;
    ctx.globalAlpha = a * (.35 + .5 * (py > 0 ? 1 : .55)); ctx.fillStyle = i % 3 ? '#ffd2a0' : ORANGE;
    ctx.beginPath(); ctx.arc(px, py, 2.2 + (i % 4), 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = a; const g = ctx.createRadialGradient(0, 0, r * .55, 0, 0, r * 1.25); g.addColorStop(0, 'rgba(255,190,120,0)'); g.addColorStop(.6, 'rgba(255,190,120,.35)'); g.addColorStop(1, 'rgba(255,190,120,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, TAU); ctx.fill();
  ctx.fillStyle = '#050608'; ctx.beginPath(); ctx.arc(0, 0, r * .55, 0, TAU); ctx.fill();
  ctx.restore();
}
function paper(x, y, a, rot = .04) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#e9e3d6'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.fillRect(-120, -160, 240, 320); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(40,40,48,.75)'; ctx.fillRect(-96, -136, 150, 10);
  for (let i = 0; i < 17; i++) { ctx.fillStyle = 'rgba(60,60,70,.45)'; ctx.fillRect(-96, -108 + i * 14, 192 - ((i * 53) % 5) * 14, 5); }
  ctx.strokeStyle = 'rgba(60,60,70,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-90, 140); ctx.lineTo(-40, 120); ctx.lineTo(-10, 132); ctx.lineTo(40, 112); ctx.stroke();
  ctx.restore();
}
function door(x, y, open, a, glowK = 0) {                                                           // y 是门的下沿
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (glowK > 0) { const g = ctx.createRadialGradient(x, y - 120, 0, x, y - 120, 140); g.addColorStop(0, `rgba(255,190,120,${.7 * glowK})`); g.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - 70, y - 240, 140, 240); }
  ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 3; ctx.strokeRect(x - 60, y - 240, 120, 240);
  const w = 120 * (1 - .8 * open);
  ctx.fillStyle = 'rgba(28,30,38,.96)'; ctx.fillRect(x - 60, y - 240, w, 240); ctx.strokeRect(x - 60, y - 240, w, 240);
  ctx.fillStyle = 'rgba(236,230,218,.7)'; ctx.beginPath(); ctx.arc(x - 60 + w - 16, y - 116, 5, 0, TAU); ctx.fill();
  ctx.restore();
}
function egg(x, y, s, a, col = '#ece6da') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y, 22 * s, 29 * s, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
function basket(x, y, a, sag = 0) {                                                                 // (x, y)：篮口中心
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#d8b07a'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - 140, y); ctx.quadraticCurveTo(x, y - 190 + 50 * sag, x + 140, y); ctx.stroke();
  ctx.fillStyle = 'rgba(70,52,34,.96)'; ctx.beginPath(); ctx.moveTo(x - 150, y); ctx.lineTo(x + 150, y); ctx.lineTo(x + 110, y + 140 + 12 * sag); ctx.lineTo(x - 110, y + 140 + 12 * sag); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(216,176,122,.45)'; ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) { const yy = y + i * 35; ctx.beginPath(); ctx.moveTo(x - 150 + 40 * i * 35 / 140, yy); ctx.lineTo(x + 150 - 40 * i * 35 / 140, yy); ctx.stroke(); }
  for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * 42, y); ctx.lineTo(x + i * 31, y + 140); ctx.stroke(); }
  ctx.restore();
}
const FRUIT = [['集体', 210], ['相对', -30], ['保守', 180], ['形式', 0], ['理性', 152], ['个人', 30], ['决定论', 128], ['失败', 60], ['悲观', 110], ['理想', 90]]
  .map(([s, d]) => { const r = d * PI / 180; return { s, d, x: 540 + 330 * Math.cos(r), y: 960 - 230 * Math.sin(r) }; });
function tree(t, grow, a, litN, fin) {                                                            // 树干 → 三个分叉 → 十根枝
  if (a <= 0) return;
  const base = [540, 1310], fork = [540, 1050], F3 = { L: [395, 965], M: [540, 870], R: [685, 965] };
  const grp = f => f.d >= 150 ? 'L' : f.d <= 30 ? 'R' : 'M';
  const k0 = E.io(clamp(grow * 3)), k1 = E.io(clamp(grow * 3 - 1));
  drawOn(() => { ctx.moveTo(...base); ctx.lineTo(...fork); }, 260, k0, '#d8b07a', 14, a);
  for (const [, [x, y]] of Object.entries(F3)) drawOn(() => { ctx.moveTo(...fork); ctx.quadraticCurveTo(lerp(fork[0], x, .2), lerp(fork[1], y, .7), x, y); }, 200, k1, '#d8b07a', 8, a);
  FRUIT.forEach((f, i) => {
    const [fx, fy] = F3[grp(f)], k = E.io(clamp(grow * 2.6 - 1.6 - i * .02)), cx = lerp(fx, f.x, .3), cy = lerp(fy, f.y, .8) + 18;
    drawOn(() => { ctx.moveTo(fx, fy); ctx.quadraticCurveTo(cx, cy, f.x, f.y); }, 240, k, 'rgba(216,176,122,.95)', 4, a);
    if (k > .9) {                                                                                   // 叶子
      ctx.save(); ctx.globalAlpha = a * sstep(.9, 1, k) * .8; ctx.fillStyle = 'rgba(79,214,196,.55)';
      const mx = lerp(fx, f.x, .55), my = lerp(fy, f.y, .55);
      for (const sgn of [-1, 1]) { ctx.beginPath(); ctx.ellipse(mx + sgn * 12, my - 8, 13, 6, sgn * .6, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    const lit = clamp(litN - i), last = i === FRUIT.length - 1;
    if (k > .95) {
      const pul = 1 + .08 * Math.sin(t * 3 + i), dx = f.x - 540, dy = f.y - 980, dl = Math.hypot(dx, dy);
      if (lit > 0) glow(f.x, f.y, (last ? 16 : 11) * pul * (1 + .3 * fin), last ? T_RGB : O_RGB, a * lit, last ? 7 : 5);
      else { ctx.save(); ctx.globalAlpha = a * .5; ctx.fillStyle = 'rgba(236,230,218,.25)'; ctx.beginPath(); ctx.arc(f.x, f.y, 8, 0, TAU); ctx.fill(); ctx.restore(); }
      text(f.s, f.x + dx / dl * 50, f.y + dy / dl * 46 + 9, { font: SERIF, size: last ? 30 : 24, weight: 900, align: 'center', color: last ? '#7fe3d3' : '#ffd2a0', alpha: a * lit });
    }
  });
}

// ======================================================================== ① 黑洞（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('相信「热爱靠找」的人：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('读到难处，兴趣会？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t);
  if (P > 0) {
    ctx.save(); ctx.globalAlpha = P; ctx.fillStyle = 'rgba(8,9,13,.9)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(140, 800, 380, 250, 16); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.roundRect(140, 800, 380, 250, 16); ctx.clip(); blackHole(330, 925, 80, t, P); ctx.restore();
    text('好看的视频', 330, 1100, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: P });
    drawOn(() => { ctx.moveTo(545, 925); ctx.lineTo(615, 925); }, 70, 1, 'rgba(236,230,218,.6)', 3, P);
    ctx.save(); ctx.globalAlpha = P; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(603, 914); ctx.lineTo(615, 925); ctx.lineTo(603, 936); ctx.stroke(); ctx.restore();
    paper(780, 925, P);
    text('很难的论文', 780, 1130, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#c3cad6', alpha: P });
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {                                                                                      // 兴趣：一开始一样高，难起来以后“靠找”掉得更多（示意）
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(200, 790); ctx.lineTo(200, 1180); ctx.lineTo(880, 1180); ctx.stroke(); ctx.restore();
    text('兴趣', 200, 760, { font: SERIF, size: 30, weight: 900, align: 'center', color: CREAM, alpha: C });
    text('看视频', 330, 1224, { font: SANS, size: 26, align: 'center', color: DIM, alpha: C });
    text('读论文', 760, 1224, { font: SANS, size: 26, align: 'center', color: DIM, alpha: C });
    const k = E.io(prog(t, 11.0, 12.6)), k2 = E.io(prog(t, 13.6, 14.8));
    drawOn(() => { ctx.moveTo(240, 860); ctx.lineTo(470, 860); ctx.quadraticCurveTo(560, 860, 620, 930); ctx.lineTo(840, 960); }, 640, k, 'rgba(127,227,211,.9)', 4, C, `rgba(${T_RGB},.5)`);
    drawOn(() => { ctx.moveTo(240, 850); ctx.lineTo(470, 850); ctx.quadraticCurveTo(560, 850, 620, 1000); ctx.lineTo(840, 1110); }, 700, k2, ORANGE, 5, C, `rgba(${O_RGB},.6)`);
    if (k2 <= 0) drawOn(() => { ctx.moveTo(240, 850); ctx.lineTo(470, 850); }, 230, k * 1.6, ORANGE, 5, C);
    text('相信「养」', 860, 930, { font: SANS, size: 24, align: 'right', color: '#7fe3d3', alpha: C * sstep(12.4, 12.8, t) });
    text('相信「找」', 860, 1150, { font: SANS, size: 24, align: 'right', color: '#ffd2a0', alpha: sstep(14.6, 15.0, t) });
    text('（示意）', 540, 1270, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: C });
  }
  text('一难起来，掉得更快', 540, 560, { font: SERIF, size: 60, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 掉得更多', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 更浓', 200], ['B · 掉得更多', 540], ['C · 不变', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 找：一排门，命中注定的那一扇
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('理想主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('IDEALISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ⑩ · 完结', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneFind(t) {
  if (t < 19.7 || t > BASKET + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(BASKET - .6, BASKET - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('命中注定的热爱', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * (1 - sstep(23.8, 24.2, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    text('兴趣的固定观', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: D * sstep(24.1, 24.6, t) });
    text('fixed theory of interest', 540, 704, { font: LAT, size: 30, weight: 500, align: 'center', color: DIM, alpha: D * sstep(24.4, 24.9, t), ls: 3 });
    const op = E.io(prog(t, 27.8, 28.8));
    const sweep = t < 27.6 ? Math.sin((t - 20.2) * 1.3) : lerp(Math.sin((27.6 - 20.2) * 1.3), .46, E.io(prog(t, 27.6, 28.2)));
    const tx = 540 + 330 * sweep;                                                                   // 手电的光
    ctx.save(); ctx.globalAlpha = D * .55; ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(540, 1210, tx, 980); g.addColorStop(0, 'rgba(255,220,170,.5)'); g.addColorStop(1, 'rgba(255,220,170,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(540, 1200); ctx.lineTo(tx - 90, 900); ctx.lineTo(tx + 90, 900); ctx.closePath(); ctx.fill(); ctx.restore();
    [220, 380, 540, 700, 860].forEach((x, i) => door(x, 1120, i === 3 ? op : 0, D * sstep(20.0 + i * .2, 20.4 + i * .2, t), i === 3 ? op : 0));
    if (op > .3) { glow(700, 1000, 14, O_RGB, D * op, 6); }
    text('只等你去找', 700, 846, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(28.6, 29.0, t) });
    person(540, 1290, 1.0, D, CREAM);
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('理想主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('完美的那一个，就在某处等你', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#ffd2a0', spread: 4 }, prog(t, 32.3, 33.3), F);
}

// ======================================================================== ③ 一个篮子
function sceneBasket(t) {
  if (t < BASKET - .3 || t > LATER + .2) return;
  const A = sstep(BASKET - .1, BASKET + .5, t) * (1 - sstep(LATER - .6, LATER - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - BASKET) / BEAT) % 1);
  const hd = (s, t0, t1, col) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1) });
  hd('研究发现，这样想的人：', 37.7, 40.6, CREAM);
  hd('别的领域：兴趣更少', 40.9, 44.6, '#c3cad6');
  hd('以为动力：无穷无尽', 44.9, 48.6, '#ffd2a0');
  hd('一个篮子', 48.9, 0, '#f0a0a0');
  const dim = 1 - .7 * sstep(41.0, 41.6, t);
  [[220, 960], [860, 960], [230, 1180], [850, 1180]].forEach(([x, y], i) => egg(x, y, .9, A * sstep(38.2 + i * .2, 38.6 + i * .2, t) * dim, '#9aa3b2'));
  const sag = sstep(49.4, 50.6, t), drop = E.inExpo(prog(t, 51.2, 52.2)), out = 1 - sstep(52.0, 52.6, t);
  const bx = 540 + 40 * drop, by = 1060 + 160 * drop + 6 * Math.sin(t * 30) * sag * (1 - drop);
  ctx.save(); ctx.translate(bx, by); ctx.rotate(.5 * drop); ctx.translate(-bx, -by);
  basket(bx, by, A * out, sag);
  [[-90, -18], [-45, -26], [0, -30], [45, -26], [90, -18]].forEach(([dx, dy]) => egg(bx + dx, by + dy, .9, A * out));
  ctx.restore();
  if (drop > 0) [[-1, .9], [1, 1.1], [-.4, 1.3], [.6, .7]].forEach(([dir, sp], i) => {                // 蛋撒出来
    const p = prog(t, 51.5, 52.5); if (p <= 0) return;
    egg(bx + dir * 180 * p * sp, by - 60 + 260 * p * p - 120 * p * sp, .8, A * (1 - sstep(.6, 1, p)));
  });
  const inf = A * sstep(45.0, 45.6, t) * (1 - sstep(48.6, 49.0, t));
  if (inf > 0) {
    ctx.save(); ctx.translate(540, 820); ctx.scale(1 + .04 * bk, 1 + .04 * bk);
    drawOn(() => { for (let i = 0; i <= 80; i++) { const a = i / 80 * TAU, d = 1 + Math.sin(a) ** 2; ctx.lineTo(110 * Math.cos(a) / d, 110 * Math.sin(a) * Math.cos(a) / d); } }, 520, E.io(prog(t, 45.0, 46.2)), '#ffd2a0', 6, inf, `rgba(${O_RGB},.7)`);
    ctx.restore();
  }
  for (let i = 0; i < 3; i++) {                                                                     // 越来越沉
    const a = A * sag * (1 - drop); if (a <= 0) break;
    ctx.save(); ctx.globalAlpha = a * .6; ctx.strokeStyle = '#f0a0a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(380 + i * 140, 1230); ctx.lineTo(380 + i * 140, 1270); ctx.moveTo(370 + i * 140, 1260); ctx.lineTo(380 + i * 140, 1272); ctx.lineTo(390 + i * 140, 1260); ctx.stroke(); ctx.restore();
  }
}

// ======================================================================== ④ 后来：一开始差很多，后来差不多
function sceneLater(t) {
  if (t < LATER - .3 || t > GROW + .2) return;
  const A = sstep(LATER - .1, LATER + .5, t) * (1 - sstep(GROW - .7, GROW - .1, t));
  if (A <= 0) return;
  text('一开始', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('后来：差不多', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * sstep(58.0, 58.5, t), glow: `rgba(${T_RGB},.4)`, blur: 14 });
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(200, 790); ctx.lineTo(200, 1180); ctx.lineTo(880, 1180); ctx.stroke(); ctx.restore();
  text('热爱 / 满意', 210, 760, { font: SERIF, size: 28, weight: 900, color: CREAM, alpha: A });
  text('一开始', 280, 1224, { font: SANS, size: 26, align: 'center', color: DIM, alpha: A });
  text('后来', 820, 1224, { font: SANS, size: 26, align: 'center', color: DIM, alpha: A });
  const s0 = sstep(54.2, 54.8, t), k = E.io(prog(t, 58.0, 59.6));
  glow(260, 860, 10, O_RGB, A * s0, 4); glow(260, 1040, 10, T_RGB, A * s0, 4);
  text('更觉得选对了', 300, 830, { font: SANS, size: 24, color: '#ffd2a0', alpha: A * sstep(55.0, 55.5, t) });
  drawOn(() => { ctx.moveTo(260, 860); ctx.bezierCurveTo(480, 880, 620, 900, 840, 900); }, 600, k, ORANGE, 4, A, `rgba(${O_RGB},.5)`);
  drawOn(() => { ctx.moveTo(260, 1040); ctx.bezierCurveTo(480, 1000, 620, 920, 840, 915); }, 620, k, 'rgba(127,227,211,.95)', 4, A, `rgba(${T_RGB},.5)`);
  if (k > .98) { glow(840, 900, 10, O_RGB, A, 4); glow(840, 915, 10, T_RGB, A, 4); }
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = ORANGE; ctx.fillRect(300, 1262, 22, 22); ctx.fillStyle = TEAL; ctx.fillRect(620, 1262, 22, 22); ctx.restore();
  text('相信「找」', 336, 1274, { font: SANS, size: 24, color: '#ffd2a0', alpha: A });
  text('相信「养」', 656, 1274, { font: SANS, size: 24, color: '#7fe3d3', alpha: A });
}

// ======================================================================== ⑤ 慢慢长：一次次浇水，芽穿过难的那一段
function sceneGrow(t) {
  if (t < GROW - .2 || t > CLIMAX + .3) return;
  const A = sstep(GROW + .2, GROW + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('热爱，也许是长出来的', 64.5, 71.9, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('难，不一定是选错了', 72.3, 76.0, '#ffd2a0');
  hd('研究者建议：', 76.4, 0, CREAM);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(216,176,122,.6)'; ctx.lineWidth = 3;               // 土
  ctx.beginPath(); ctx.moveTo(260, 1240); ctx.quadraticCurveTo(540, 1200, 820, 1240); ctx.stroke(); ctx.restore();
  let h = 60 * E.out(prog(t, 64.4, 65.4));
  [68.2, 69.2, 70.2, 71.2].forEach(t0 => { h += 40 * E.out(prog(t, t0 + .3, t0 + .8)); });
  const push = E.io(prog(t, 74.4, 75.6)); h += 110 * push + 40 * E.out(prog(t, 76.4, 77.4));
  const y0 = 1222, top = y0 - h, bend = 14 * sstep(72.3, 72.8, t) * (1 - push);
  if (h > 1) {
    ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = TEAL; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${T_RGB},.6)`; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(540, y0); ctx.quadraticCurveTo(540 + bend, y0 - h / 2, 540, top); ctx.stroke(); ctx.restore();
    [[50, -1], [90, 1], [130, -1], [170, 1], [240, -1], [290, 1]].forEach(([hy, sgn]) => {
      const a = A * sstep(hy, hy + 16, h); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(79,214,196,.75)'; ctx.translate(540 + sgn * 4, y0 - hy); ctx.rotate(sgn * -.7);
      ctx.beginPath(); ctx.ellipse(sgn * 26, 0, 26 * sstep(hy, hy + 30, h), 11, 0, 0, TAU); ctx.fill(); ctx.restore();
    });
  }
  [68.2, 69.2, 70.2, 71.2].forEach(t0 => {                                                          // 一次次回去：一滴水
    const p = prog(t, t0 - .2, t0 + .3); if (p <= 0 || p >= 1) return;
    ctx.save(); ctx.globalAlpha = A * (1 - sstep(.85, 1, p)); ctx.fillStyle = '#9fe9de'; ctx.beginPath(); ctx.ellipse(540, lerp(780, top - 10, p * p), 7, 11, 0, 0, TAU); ctx.fill(); ctx.restore();
  });
  const hard = A * sstep(72.3, 72.8, t) * (1 - sstep(75.0, 75.8, t));                               // 难的那一段
  if (hard > 0) {
    ctx.save(); ctx.globalAlpha = hard; ctx.fillStyle = 'rgba(154,163,178,.28)'; ctx.strokeStyle = 'rgba(154,163,178,.6)'; ctx.lineWidth = 2;
    const yb = y0 - 245; ctx.beginPath(); ctx.roundRect(330, yb - 26, 420, 40, 12); ctx.fill(); ctx.stroke(); ctx.restore();
    text('难的那一段', 840, y0 - 244, { font: SANS, size: 26, align: 'center', color: '#c3cad6', alpha: hard });
  }
  text('它正在长', 700, top + 10, { font: SERIF, size: 34, weight: 900, color: '#7fe3d3', alpha: A * sstep(75.4, 75.9, t) * (1 - sstep(76.2, 76.6, t)) });
}

// ======================================================================== ⑥ 一棵树：十个看不见的主义
function sceneTree(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1000, 780);
  const grow = prog(t, CLIMAX + .2, CLIMAX + 4.2), litN = (t - 84.9) / .72 + .5;
  tree(t, grow, A, litN, fin);
  if (fin > 0) for (let i = 0; i < 26; i++) {                                                       // 光点往上飘
    const r = mulberry(4300 + i), x = 220 + r() * 640, sp = 30 + r() * 50, p = ((t - FINAL) * sp / 520 + r()) % 1;
    glow(x + 20 * Math.sin(t + i), 1250 - p * 520, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('与其「找到」你的热爱，', 540, 440, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('不如「培养」它。', 540, 548, { ...big, size: 68, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.5, CLIMAX + 2.5), qa);
  typeText('—— 奥基夫、德韦克 & 沃尔顿（大意）', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.7, CLIMAX + 3.3), qa);
  typeText('热爱，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('是养出来的。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneFind(t); sceneBasket(t); sceneLater(t); sceneGrow(t); sceneTree(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 68.0, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2018', "O'Keefe, Dweck & Walton · Psych Sci", 8.2, 52.9, T);
  stamp('2015', 'Chen, Ellsworth & Schwarz · PSPB', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(43);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在降 E 小调里，最后一个和弦是降 E 大调）
const NOTE = { Bb3: 233.08, Eb4: 311.13, Gb4: 369.99, G4: 392.00, Ab4: 415.30, Bb4: 466.16, Db5: 554.37, Eb5: 622.25, Gb5: 739.99, G5: 783.99, Ab5: 830.61, Bb5: 932.33, Db6: 1108.73, Eb6: 1244.51 };
const EBM_SHIM = [NOTE.Gb5, NOTE.Bb4, NOTE.Eb5, NOTE.Eb4, NOTE.Bb3], EBMAJ_SHIM = [NOTE.G5, NOTE.Bb4, NOTE.Eb5, NOTE.Eb4, NOTE.Bb3], EBM_SWELL = [77.78, 116.54, 155.56, 185.00, 233.08];
function CUES() {
  const c = [];
  [.5, 1.3, 2.1].forEach(t => c.push([t, 'click', { gain: .08 }]));
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Eb4, NOTE.Gb4, NOTE.Bb4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Bb5, gain: .1 }]);
  c.push([11.0, 'swish', { gain: .08 }], [13.7, 'bar', { f0: 311, f1: 156, dur: 1.2, gain: .09 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EBM_SHIM, gain: .28 }]);
  c.push([20.2, 'creak', { gain: .06 }], [21.6, 'swish', { gain: .06 }], [24.0, 'swish', { gain: .06 }], [27.9, 'creak', { gain: .1 }], [28.4, 'tink', { f: NOTE.Gb5, gain: .07 }], [31.7, 'page', { gain: .18 }]);
  c.push([BASKET, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'drone', { dur: 3.4, gain: .05 }], [45.0, 'tink', { f: NOTE.Eb6, gain: .08 }], [49.4, 'creak', { gain: .1 }], [51.4, 'crack', { gain: .14 }]);
  c.push([LATER, 'whoosh', { dur: .5, gain: .22 }], [54.3, 'tink', { f: NOTE.Bb4, gain: .06 }], [58.0, 'bar', { f0: 233, f1: 311, dur: 1.6, gain: .09 }], [59.6, 'chord', { f: [NOTE.Eb4, NOTE.Gb4, NOTE.Bb4], gain: .1 }]);
  c.push([64.4, 'tink', { f: NOTE.Bb4, gain: .06 }]);
  [68.2, 69.2, 70.2, 71.2].forEach((t, i) => c.push([t + .3, 'tink', { f: [NOTE.Eb5, NOTE.Gb5, NOTE.Bb5, NOTE.Eb6][i], gain: .06 }]));
  c.push([72.3, 'thud', { gain: .1 }], [74.4, 'swish', { gain: .1 }], [75.4, 'tink', { f: NOTE.Bb5, gain: .07 }]);
  c.push([76.4, 'page', { gain: .2 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: EBM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EBM_SHIM, gain: .42 }], [CLIMAX + .3, 'wind', { dur: 4, gain: .08 }], [CLIMAX + .4, 'air', { dur: 10, hum: 77.78, gain: .14 }]);
  const PENT = [NOTE.Eb4, NOTE.Gb4, NOTE.Ab4, NOTE.Bb4, NOTE.Db5, NOTE.Eb5, NOTE.Gb5, NOTE.Ab5, NOTE.Bb5, NOTE.Db6];
  for (let i = 0; i < 10; i++) c.push([84.9 + i * .72, 'tink', { f: PENT[i], gain: .06 + .004 * i }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EBMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Eb4, NOTE.G4, NOTE.Bb4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
