// ======================================================================== No.45 平均主义：不公平，猴子也受不了？
// 第六季·日常里的主义 ②。开头是一道选择题：两只猴子做一样的事，一只拿到葡萄，一只拿到黄瓜，拿黄瓜的会怎样？（Brosnan & de Waal, 2003）
// 音乐：原创配乐（music.py，G 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是两个一样的音，再来第三个：有时短了一截（黄瓜），高潮时终于往上跳。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 分钱游戏（每拍一个鼓点） · 53.33 公平≠平均（紧张） · 64.0 分清（只剩钢琴） · 80.0 高潮：天平放平 · 96.0 G 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), GAME = BT(56), FAIR = BT(80), SORT = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['葡萄与黄瓜', 0, LIFT], ['不公平', LIFT, GAME], ['分钱游戏', GAME, FAIR], ['公平≠平均', FAIR, SORT], ['分清', SORT, CLIMAX], ['一样的对待', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.45';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '两只猴子，做一样的事：交一块小石头，换一份吃的。'],
  [4.1, 7.6, '一只拿到葡萄，另一只拿到黄瓜。它会怎样？先猜一个。'],
  [8.2, 10.4, '答案是：常常不干了。'],
  [10.8, 13.3, '有的，直接把黄瓜扔了回去；'],
  [13.6, 15.7, '可平时，黄瓜它吃得好好的。'],
  [16.3, 19.6, '这是 2003 年，布罗斯南和德瓦尔的实验。'],
  [19.9, 23.7, '两边都拿黄瓜时，猴子几乎每次都肯换；'],
  [24.0, 27.4, '隔壁换来的是葡萄，肯换的只剩约六成；'],
  [27.7, 31.3, '隔壁什么都不做就拿到葡萄，只剩约两成。'],
  [31.6, 35.3, '这就是「平均主义」的直觉：一样的付出，该得一样的东西。'],
  [37.6, 40.6, '人也一样。有一个分钱游戏：'],
  [40.9, 44.6, '对方分 100 块，给你 20；你不接受，两个人都拿不到。'],
  [44.9, 48.6, '很多人会拒绝，宁可两手空空。'],
  [48.9, 52.9, '不是不要钱，是不想被不公平地对待。'],
  [53.6, 57.6, '可公平，不等于平均。'],
  [57.9, 60.6, '如果有人确实做得更多，'],
  [60.8, 63.4, '大多数人，连小孩子，都愿意让他多拿。'],
  [64.3, 67.6, '所以，觉得委屈的时候，先分清：'],
  [67.9, 71.9, '是我拿得少，还是规则不公平？'],
  [72.2, 75.9, '前者，可以放下；后者，值得说出来。'],
  [76.3, 79.6, '耶鲁的研究者总结过：'],
  [84.9, 88.6, '人们在意的，从来不是一样多，'],
  [88.9, 92.6, '而是一样被公平地对待。'],
  [98.4, 103.0, '评论区：你遇到过的「黄瓜时刻」是什么？'],
];
const BIGLINES = [
  [80.2, 92.6, '「让人不满的，不是不平等，而是不公平。」—— 斯塔曼斯、谢斯金 & 布鲁姆（大意）'],
  [93.4, 98.0, '不求一样多，只求一样公平。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [GAME - .5, .2], [GAME, .06], [SORT, .06],
  [SORT + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 猴子、笼子、葡萄、黄瓜、人、天平
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function monkey(x, y, s, a, o = {}) {                                                              // 卷尾猴：(x, y) 脚下
  if (a <= 0) return;
  const col = o.col || '#d8b07a', arm = o.arm || 0, face = o.face || 0, flip = o.flip || 1;          // arm：0 放下 → 1 举起；face：-1 生气 → 1 开心
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * flip, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.fillStyle = 'rgba(34,26,20,.96)';
  ctx.beginPath(); ctx.moveTo(-34, -40); ctx.bezierCurveTo(-90, -40, -100, -120, -60, -130); ctx.bezierCurveTo(-36, -134, -36, -110, -52, -108); ctx.stroke();   // 尾巴
  ctx.beginPath(); ctx.ellipse(0, -60, 40, 56, 0, 0, TAU); ctx.fill(); ctx.stroke();                                                                          // 身子
  ctx.beginPath(); ctx.moveTo(-24, -10); ctx.lineTo(-30, 0); ctx.moveTo(24, -10); ctx.lineTo(30, 0); ctx.stroke();
  const ax = lerp(36, 56, arm), ay = lerp(-40, -150, arm);                                                                                                     // 右臂
  ctx.beginPath(); ctx.moveTo(26, -90); ctx.quadraticCurveTo(lerp(56, 66, arm), lerp(-70, -120, arm), ax, ay); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-26, -90); ctx.quadraticCurveTo(-48, -70, -36, -42); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -140, 36, 0, TAU); ctx.fill(); ctx.stroke();                                                                                    // 头
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 38, -142, 10, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = 'rgba(236,214,180,.92)'; ctx.beginPath(); ctx.ellipse(0, -132, 24, 22, 0, 0, TAU); ctx.fill();                                              // 脸
  ctx.fillStyle = '#1a1410'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 9, -138 + (face < 0 ? 1 : 0), 3.5, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 2.5;
  if (face < 0) for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 15, -150); ctx.lineTo(sx * 4, -145); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-8, -122); ctx.quadraticCurveTo(0, -122 + 6 * face, 8, -122); ctx.stroke();
  ctx.restore();
  return [x + ax * s * flip, y + ay * s];
}
function grape(x, y, r, a, glowK = 0) {
  if (a <= 0) return;
  if (glowK > 0) glow(x, y, r * 1.4, '170,120,230', a * glowK, 4);
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r); g.addColorStop(0, '#c9a2f0'); g.addColorStop(1, '#5a2f8a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#6d8f3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + 4, y - r - 8); ctx.stroke(); ctx.restore();
}
function cucumber(x, y, r, a, rot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#3f7a3a'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.fillStyle = '#cfe7a9'; ctx.beginPath(); ctx.arc(0, 0, r * .82, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(120,160,80,.8)'; for (let i = 0; i < 6; i++) { const an = i / 6 * TAU; ctx.beginPath(); ctx.ellipse(Math.cos(an) * r * .4, Math.sin(an) * r * .4, 3, 5, an, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function cage(x0, x1, y0, y1, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.45)'; ctx.lineWidth = 3; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = 'rgba(236,230,218,.12)'; ctx.lineWidth = 2; for (let x = x0 + 40; x < x1; x += 40) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
  ctx.restore();
}
function scale2(x, y, a, tilt, glowK = 0) {                                                        // 天平：(x, y) 横梁中心
  if (a <= 0) return [[x - 200, y], [x + 200, y]];
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = glowK > 0 ? ORANGE : 'rgba(236,230,218,.75)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  if (glowK > 0) { ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 20 * glowK; }
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 300); ctx.moveTo(x - 80, y + 300); ctx.lineTo(x + 80, y + 300); ctx.stroke();
  const dx = Math.cos(tilt) * 200, dy = Math.sin(tilt) * 200, L = [x - dx, y - dy], R = [x + dx, y + dy];
  ctx.beginPath(); ctx.moveTo(...L); ctx.lineTo(...R); ctx.stroke();
  for (const [px, py] of [L, R]) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 60, py + 110); ctx.moveTo(px, py); ctx.lineTo(px + 60, py + 110); ctx.moveTo(px - 75, py + 110); ctx.quadraticCurveTo(px, py + 150, px + 75, py + 110); ctx.stroke(); }
  ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
  ctx.restore();
  return [[L[0], L[1] + 112], [R[0], R[1] + 112]];
}

// ======================================================================== ① 葡萄与黄瓜（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('隔壁拿葡萄，它拿黄瓜：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('它会怎样？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(13.4, 13.8, t);
  if (P > 0) {
    cage(130, 520, 820, 1200, P); cage(560, 950, 820, 1200, P);
    const thr = E.out(prog(t, 10.8, 11.6)), angry = sstep(Q.REVEAL, Q.REVEAL + .4, t);
    const hand = monkey(330, 1180, 1.25, P, { arm: Math.sin(PI * clamp(thr * 1.4)) * .9, face: -angry });
    const h2 = monkey(750, 1180, 1.25, P, { flip: -1, face: .8, arm: .35 });
    grape(h2[0] + 4, h2[1] - 8, 20, P, .5);
    if (thr <= 0) cucumber(hand[0] - 4, hand[1] - 8, 22, P);
    else cucumber(lerp(hand[0], 470, thr), lerp(hand[1], 1180, thr) - Math.sin(PI * thr) * 240, 22, P * (1 - sstep(.85, 1, thr)), thr * 9);
    text('扔回去！', 330, 790, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#f0a0a0', alpha: P * sstep(11.0, 11.4, t), glow: 'rgba(229,72,77,.4)', blur: 12 });
  }
  const C = sstep(13.6, 14.0, t);
  if (C > 0) {                                                                                      // 平时：一只猴子，黄瓜吃得好好的
    cage(345, 735, 820, 1200, C);
    const hand = monkey(540, 1180, 1.25, C, { arm: .5, face: .9 });
    cucumber(hand[0] - 4, hand[1] - 8, 22, C);
    text('单独时：吃得好好的', 540, 1250, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: C });
  }
  text('常常不干了', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(10.9, 11.4, t) * (1 - sstep(13.4, 13.8, t)), glow: 'rgba(229,72,77,.4)', blur: 14 });
  text('黄瓜没变，变的是隔壁', 540, 560, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(13.7, 14.2, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 不干了', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 照样吃', 200], ['B · 不干了', 540], ['C · 去抢葡萄', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 肯交换的比例
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('平均主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EGALITARIANISM', 540, 1046, { size: 42, weight: 600, font: LAT, ls: 18, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ②', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneUnfair(t) {
  if (t < 19.7 || t > GAME + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(GAME - .6, GAME - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('肯交换的比例', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: D });
    const base = 1150;
    ctx.save(); ctx.globalAlpha = D; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, base); ctx.lineTo(930, base); ctx.stroke(); ctx.restore();
    [[270, 95, '两边都是黄瓜', 20.2, '#7fe3d3', T_RGB], [540, 60, '隔壁换来葡萄', 24.2, '#ffd2a0', O_RGB], [810, 20, '隔壁白拿葡萄', 27.9, '#f0a0a0', '229,72,77']].forEach(([x, v, lab, t0, col, rgb]) => {
      const k = E.out(prog(t, t0, t0 + 1.0)), a = D * sstep(t0, t0 + .3, t), h = 3.4 * v * k;
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.5)`; ctx.shadowBlur = 16; ctx.fillRect(x - 70, base - h, 140, h); ctx.restore();
      text(`约 ${v}%`, x, base - h - 30, { font: SERIF, size: 40, weight: 900, align: 'center', color: col, alpha: a * sstep(.6, 1, k) });
      text(lab, x, base + 44, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: a });
    });
    cucumber(205, base + 100, 14, D * sstep(20.2, 20.5, t)); cucumber(335, base + 100, 14, D * sstep(20.2, 20.5, t));
    cucumber(475, base + 100, 14, D * sstep(24.2, 24.5, t)); grape(605, base + 100, 14, D * sstep(24.2, 24.5, t));
    cucumber(745, base + 100, 14, D * sstep(27.9, 28.2, t)); grape(875, base + 100, 14, D * sstep(27.9, 28.2, t));
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('平均主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('一样的付出，该得一样的东西', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#ffd2a0', spread: 4 }, prog(t, 32.3, 33.3), F);
}

// ======================================================================== ③ 分钱游戏：宁可两手空空
function sceneGame(t) {
  if (t < GAME - .3 || t > FAIR + .2) return;
  const A = sstep(GAME - .1, GAME + .5, t) * (1 - sstep(FAIR - .6, FAIR - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - GAME) / BEAT) % 1);
  text('分钱游戏', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('不是不要钱，是要公平', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(48.9, 49.4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  person(220, 1240, 1.15, A, '#c3cad6'); person(860, 1240, 1.15, A, '#ffd2a0');
  text('对方', 220, 1290, { font: SANS, size: 26, align: 'center', color: '#c3cad6', alpha: A });
  text('你', 860, 1290, { font: SANS, size: 26, align: 'center', color: '#ffd2a0', alpha: A });
  const split = E.io(prog(t, 41.0, 41.9)), rej = sstep(45.2, 45.6, t), vanish = E.io(prog(t, 45.8, 46.8));
  const pile = (x, y, n, a) => { for (let i = 0; i < n; i++) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = i % 2 ? '#e8b866' : '#d9a650'; ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - i * 10, 46, 13, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); } };
  if (split <= 0) { pile(540, 1000, 10, A * sstep(38.0, 38.5, t)); text('100', 540, 860, { font: LAT, size: 64, weight: 700, align: 'center', color: '#ffd2a0', alpha: A * sstep(38.0, 38.5, t) }); }
  else {
    pile(lerp(540, 400, split), 1000, 8, A * (1 - vanish)); pile(lerp(540, 680, split), 1000, 2, A * (1 - vanish));
    text('80', lerp(540, 400, split), 880, { font: LAT, size: 60, weight: 700, align: 'center', color: '#c3cad6', alpha: A * (1 - vanish) });
    text('20', lerp(540, 680, split), 940, { font: LAT, size: 60, weight: 700, align: 'center', color: '#ffd2a0', alpha: A * (1 - vanish) });
    text('0', 400, 940, { font: LAT, size: 60, weight: 700, align: 'center', color: '#6f7786', alpha: A * vanish });
    text('0', 680, 940, { font: LAT, size: 60, weight: 700, align: 'center', color: '#6f7786', alpha: A * vanish });
  }
  if (rej > 0) {
    ctx.save(); ctx.globalAlpha = A * rej; ctx.translate(860, 1060); ctx.rotate(-.18); ctx.scale(1 + .4 * (1 - E.out(prog(t, 45.2, 45.6))), 1 + .4 * (1 - E.out(prog(t, 45.2, 45.6))));
    ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 5; ctx.shadowColor = 'rgba(229,72,77,.6)'; ctx.shadowBlur = 16; ctx.strokeRect(-90, -40, 180, 80); ctx.restore();
    ctx.save(); ctx.translate(860, 1060); ctx.rotate(-.18); text('拒绝', 0, 4, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#f0a0a0', alpha: A * rej }); ctx.restore();
  }
}

// ======================================================================== ④ 公平≠平均：做得多，多拿
function sceneFair(t) {
  if (t < FAIR - .3 || t > SORT + .2) return;
  const A = sstep(FAIR - .1, FAIR + .5, t) * (1 - sstep(SORT - .7, SORT - .1, t));
  if (A <= 0) return;
  text('公平 ≠ 平均', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) });
  const box = (x, y, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(216,176,122,.25)'; ctx.strokeStyle = '#d8b07a'; ctx.lineWidth = 3; ctx.fillRect(x - 36, y - 60, 72, 60); ctx.strokeRect(x - 36, y - 60, 72, 60); ctx.restore(); };
  person(330, 1240, 1.1, A, CREAM); person(750, 1240, 1.1, A, CREAM);
  [0, 1, 2].forEach(i => box(330 + (i - 1) * 80, 1120 - 0, A * sstep(54.4 + i * .3, 54.7 + i * .3, t)));
  box(750, 1120, A * sstep(54.4, 54.7, t));
  text('做了 3 份', 330, 1290, { font: SANS, size: 26, align: 'center', color: CREAM, alpha: A * sstep(55.0, 55.4, t) });
  text('做了 1 份', 750, 1290, { font: SANS, size: 26, align: 'center', color: CREAM, alpha: A * sstep(55.0, 55.4, t) });
  const k = E.io(prog(t, 58.2, 59.2)), ok = sstep(60.9, 61.4, t);
  const coin = (x, y, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#e8b866'; ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.fill(); ctx.restore(); };
  for (let i = 0; i < 3; i++) coin(270 + i * 60, 860, A * k);
  coin(750, 860, A * k);
  text('多拿一点？', 540, 780, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(58.4, 58.9, t) * (1 - ok) });
  text('✓ 大多数人：愿意', 540, 780, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * ok, glow: `rgba(${T_RGB},.5)`, blur: 14 });
}

// ======================================================================== ⑤ 分清：拿得少，还是不公平
function sceneSort(t) {
  if (t < SORT - .2 || t > CLIMAX + .3) return;
  const A = sstep(SORT + .2, SORT + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('先分清', 64.5, 71.9, CREAM);
  hd('放下，或者说出来', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('耶鲁的研究者说：', 76.4, 0, CREAM);
  const sep = E.io(prog(t, 68.0, 69.0)), dec = E.io(prog(t, 72.4, 73.6));
  const card = (x, y, s, col, rgb, a, sc = 1) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(sc, sc); ctx.fillStyle = `rgba(${rgb},.12)`; ctx.strokeStyle = `rgba(${rgb},.8)`; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${rgb},.4)`; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.roundRect(-160, -70, 320, 140, 22); ctx.fill(); ctx.stroke(); ctx.restore();
    text(s, x, y + 2, { font: SERIF, size: 44, weight: 900, align: 'center', color: col, alpha: a });
  };
  const ca = A * sstep(64.6, 65.2, t);
  card(lerp(540, 300, sep), 960, '我拿得少', '#c3cad6', '154,163,178', ca * (1 - .75 * dec), 1 - .25 * dec);
  card(lerp(540, 780, sep), 960 + 0, '规则不公平', '#f0a0a0', '229,72,77', ca * sep);
  text('→ 放下', 300, 1100, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#9aa3b2', alpha: A * dec });
  text('→ 说出来', 780, 1100, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * dec, glow: `rgba(${O_RGB},.4)`, blur: 12 });
  text('？', 540, 1130, { font: SERIF, size: 60, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(68.6, 69.0, t) * (1 - dec) });
}

// ======================================================================== ⑥ 一样的对待：天平放平
function sceneEven(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const tilt = -.28 * (1 - E.io(prog(t, CLIMAX + .6, CLIMAX + 2.2))) + .015 * Math.sin(t * 2) * (1 - fin);
  const [L, R] = scale2(540, 830, A, tilt, .4 + .6 * fin);
  grape(L[0], L[1] - 20, 20, A, .6 + .4 * fin); grape(R[0], R[1] - 20, 20, A * sstep(CLIMAX + .8, CLIMAX + 1.4, t), .6 + .4 * fin);
  monkey(190, 1250, .95, A * sstep(CLIMAX + .3, CLIMAX + .9, t), { face: lerp(-.6, 1, sstep(CLIMAX + 1.6, CLIMAX + 2.4, t)), arm: .3 });
  monkey(890, 1250, .95, A * sstep(CLIMAX + .3, CLIMAX + .9, t), { flip: -1, face: 1, arm: .3 });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('让人不满的，', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.2), qa);
  typeText('不是「不平等」，', 540, 524, { ...big, size: 58, weight: 900 }, prog(t, CLIMAX + 1.3, CLIMAX + 2.2), qa);
  typeText('而是「不公平」。', 540, 622, { ...big, size: 64, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.3, CLIMAX + 3.2), qa);
  typeText('—— 斯塔曼斯、谢斯金 & 布鲁姆（大意）', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.4, CLIMAX + 4.0), qa);
  typeText('不求一样多，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('只求一样公平。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneUnfair(t); sceneGame(t); sceneFair(t); sceneSort(t); sceneEven(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2003', 'Brosnan & de Waal · Nature', 8.2, 35.3, T);
  stamp('1982', 'Güth, Schmittberger & Schwarze', 37.6, 52.9, T);
  stamp('2017', 'Starmans, Sheskin & Bloom · Nat Hum Behav', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(45);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 G 小调里，最后一个和弦是 G 大调）
const NOTE = { G3: 196.00, Bb3: 233.08, B3: 246.94, D4: 293.66, G4: 392.00, Bb4: 466.16, B4: 493.88, D5: 587.33, G5: 783.99, Bb5: 932.33, B5: 987.77, D6: 1174.66 };
const GM_SHIM = [NOTE.Bb5, NOTE.D5, NOTE.G5, NOTE.G4, NOTE.D4], GMAJ_SHIM = [NOTE.B5, NOTE.D5, NOTE.G5, NOTE.G4, NOTE.D4], GM_SWELL = [49.00, 73.42, 98.00, 116.54, 146.83];
function CUES() {
  const c = [];
  c.push([.8, 'tink', { f: NOTE.D5, gain: .05 }], [1.6, 'tink', { f: NOTE.D5, gain: .05 }], [2.4, 'tink', { f: NOTE.G5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.G3, NOTE.Bb3, NOTE.D4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.D5, gain: .1 }]);
  c.push([10.8, 'swish', { gain: .12 }], [11.6, 'slap', { gain: .1 }], [13.7, 'whoosh', { dur: .4, gain: .1 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: GM_SHIM, gain: .28 }]);
  c.push([20.2, 'bar', { f0: 196, f1: 392, dur: 1.0, gain: .08 }], [24.2, 'bar', { f0: 196, f1: 311, dur: 1.0, gain: .08 }], [27.9, 'bar', { f0: 196, f1: 233, dur: 1.0, gain: .08 }], [31.7, 'page', { gain: .18 }]);
  c.push([GAME, 'whoosh', { dur: .5, gain: .25 }], [38.0, 'chain', { gain: .05 }], [41.0, 'swish', { gain: .08 }], [45.2, 'slap', { gain: .14 }], [45.8, 'suck', { dur: 1.0, gain: .07 }]);
  c.push([49.0, 'chord', { f: [NOTE.G3, NOTE.Bb3, NOTE.D4], gain: .1 }], [49.1, 'tink', { f: NOTE.D6, gain: .07 }]);
  c.push([FAIR, 'whoosh', { dur: .5, gain: .22 }], [54.4, 'thunk', { gain: .06 }], [54.7, 'thunk', { gain: .06 }], [55.0, 'thunk', { gain: .06 }], [58.2, 'tink', { f: NOTE.G5, gain: .06 }], [61.0, 'tink', { f: NOTE.D6, gain: .07 }]);
  c.push([64.6, 'tink', { f: NOTE.Bb4, gain: .06 }], [68.0, 'swish', { gain: .07 }], [72.4, 'whoosh', { dur: .6, gain: .1 }], [73.0, 'tink', { f: NOTE.D5, gain: .06 }]);
  c.push([76.4, 'page', { gain: .2 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: GM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: GM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 98.00, gain: .14 }], [CLIMAX + 2.2, 'tink', { f: NOTE.G5, gain: .08 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: GMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.G3, NOTE.B3, NOTE.D4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
