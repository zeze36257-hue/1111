// ======================================================================== No.60 沉默主义：大家都不说，是因为都同意吗？
// 第七季·人和人之间的主义 ⑦。开头是一道选择题：问大学生对校园狂饮自不自在，再问“一般同学”呢？（Prentice & Miller, 1993）
// 音乐：原创配乐（music.py，C 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机留一个空：一个音，一拍沉默，再小声问三个音。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 教室（每拍一个鼓点） · 53.33 新装（紧张） · 64.0 不止我（只剩钢琴） · 80.0 高潮：说出口 · 96.0 C 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), CLASS = BT(56), CLOTHES = BT(80), NOTONLY = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['自在吗', 0, LIFT], ['都不说', LIFT, CLASS], ['教室', CLASS, CLOTHES], ['新装', CLOTHES, NOTONLY], ['不止我', NOTONLY, CLIMAX], ['说出口', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.60';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '研究者问大学生：校园里那种狂饮，你自在吗？'],
  [4.1, 7.6, '再问：那一般同学呢？结果会怎样？先猜一个。'],
  [8.2, 10.4, '答案是 C：都觉得别人比自己更自在。'],
  [10.8, 13.3, '很多人私下都有点不舒服，'],
  [13.6, 15.7, '却都以为，只有自己这样。'],
  [16.3, 19.6, '于是，谁也不说。'],
  [19.9, 23.7, '大家一起喝，一起装作很享受。'],
  [24.0, 27.4, '更糟的是，一个学期后，男生的看法，'],
  [27.7, 31.3, '慢慢变得更像那个“想象中的大家”。'],
  [31.6, 35.3, '这就是「沉默主义」：都以为别人同意，就都不开口。'],
  [37.6, 40.6, '教室里也一样。'],
  [40.9, 44.6, '老师问：有没有问题？没人举手。'],
  [44.9, 48.6, '每个没听懂的人都在想：大家应该都懂了吧。'],
  [48.9, 52.9, '一屋子的沉默，其实是一屋子的问号。'],
  [53.6, 57.6, '这像不像《皇帝的新装》？'],
  [57.9, 60.6, '人人都看见了，却以为只有自己看见；'],
  [60.8, 63.4, '直到一个小孩，说出了口。'],
  [64.3, 67.6, '所以，当你心里犯嘀咕，却没人说话时，'],
  [67.9, 71.9, '可以先轻轻问一句：只有我这么觉得吗？'],
  [72.2, 75.9, '很多时候，会有人松一口气：原来不止我。'],
  [76.3, 79.6, '一百年前，鲁迅写过：'],
  [84.9, 88.6, '不一定要爆发，'],
  [88.9, 92.6, '但可以做那个，先小声说出来的人。'],
  [98.4, 103.0, '评论区：你有没有一句“大家都不说”的话？'],
];
const BIGLINES = [
  [80.2, 92.6, '「不在沉默中爆发，就在沉默中灭亡。」—— 鲁迅'],
  [93.4, 98.0, '你说出口，别人才敢说。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [CLASS - .5, .2], [CLASS, .06], [NOTONLY, .06],
  [NOTONLY + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、心里的气泡、面具、课桌、皇冠
const PINK = '#f0a0a0', GOLD = '#ffd2a0', TEALC = '#7fe3d3', WARMC = '#ffb36b', GREYP = '#9aa3b2';
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function think(s, x, y, a, col = CREAM, size = 26) {                                                     // 心里话：云朵气泡 + 两个小圆点
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 40, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,31,40,.92)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x - 6, y + h / 2 + 10, 4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x - 12, y + h / 2 + 22, 3, 0, TAU); ctx.fill();
  ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}
function cup(x, y, s, a, col = GOLD) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(232,184,102,.7)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-14, -20); ctx.lineTo(14, -20); ctx.lineTo(11, 20); ctx.lineTo(-11, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.ellipse(0, -20, 15, 5, 0, 0, TAU); ctx.fill(); ctx.restore();
}
function smileMask(x, y, s, a) {                                                                        // 贴在脸上的笑脸面具
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(236,230,218,.92)'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#1a1b22'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(-8, -4, 2.5, 0, TAU); ctx.arc(8, -4, 2.5, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 4, 10, .2, PI - .2); ctx.stroke(); ctx.restore();
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}

// ======================================================================== ① 自在吗（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('校园狂饮：你自在吗？那一般同学呢？', 540, 452, { ...big, size: 38, weight: 700 }, 1, 1 - qOut);
  typeText('谁更自在？', 540, 560, { ...big, size: 84, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t) + sstep(10.7, 11.1, t);                         // 一圈举着杯子的人
  const xs = [190, 330, 470, 610, 750, 890];
  xs.forEach((x, i) => {
    const y = 1110 + (i % 2) * 20, bob = 4 * Math.sin(t * 4 + i);
    person(x, y + bob, .62, Math.min(1, P), WARMC);
    cup(x + 34, y - 60 + bob, .9, Math.min(1, P));
    think('不舒服…', x, y - 160 - (i % 2) * 60, sstep(10.9 + i * .12, 11.2 + i * .12, t), PINK, 22);
    if (t > 13.6) think('只有我吧', x, y - 160 - (i % 2) * 60, 0, TEALC, 22);
  });
  text('只有我这样？', 540, 1250, { font: SERIF, size: 34, weight: 900, align: 'center', color: TEALC, alpha: sstep(13.7, 14.1, t) });
  const C = sstep(Q.REVEAL + .1, Q.REVEAL + .5, t) * (1 - sstep(10.6, 11.0, t));
  if (C > 0) {
    const base = 1200, k = E.out(prog(t, Q.REVEAL + .2, Q.REVEAL + 1.2));
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(260, base); ctx.lineTo(820, base); ctx.stroke();
    ctx.fillStyle = TEALC; ctx.fillRect(330, base - 170 * k, 140, 170 * k); ctx.fillStyle = WARMC; ctx.fillRect(610, base - 280 * k, 140, 280 * k); ctx.restore();
    text('我自己', 400, base + 44, { font: SANS, size: 28, align: 'center', color: TEALC, alpha: C });
    text('一般同学', 680, base + 44, { font: SANS, size: 28, align: 'center', color: WARMC, alpha: C });
    text('有多自在（示意）', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: C });
  }
  text('C · 都觉得别人更自在', 540, 560, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('每个人心里，都有点不舒服', 540, 560, { font: SERIF, size: 52, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 自己更自在', 200], ['B · 差不多', 540], ['C · 别人更自在', 870]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 都不说
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('沉默主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('PLURALISTIC IGNORANCE', 540, 1046, { size: 36, weight: 600, font: LAT, ls: 10, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ⑦', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneMask(t) {
  if (t < 19.7 || t > CLASS + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(CLASS - .6, CLASS - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('一起装作很享受', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('一学期后', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('变得像“想象中的大家”', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const M = D * (1 - sstep(23.8, 24.2, t));
    for (let i = 0; i < 5; i++) {                                                                         // 每个人脸上一张笑脸面具，心里一个皱眉
      const x = 220 + i * 160, y = 1120;
      person(x, y, .8, M, WARMC); smileMask(x, y - 67, 1.0, M * sstep(20.2 + i * .15, 20.5 + i * .15, t));
      think('…', x, y - 170, M * sstep(21.4 + i * .15, 21.7 + i * .15, t), PINK, 24);
    }
    const S = D * sstep(24.1, 24.5, t);
    if (S > 0) {                                                                                          // 一条“自在程度”的刻度：他自己的看法慢慢挪向“想象中的大家”
      const y = 1080, x0 = 200, x1 = 880, own = lerp(380, 600, E.io(prog(t, 25.0, 30.0))), norm = 720;
      ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = 'rgba(236,230,218,.25)'; ctx.fillRect(x0, y - 3, x1 - x0, 6); ctx.restore();
      text('不自在', x0, y + 44, { font: SANS, size: 24, align: 'left', color: DIM, alpha: S }); text('很自在', x1, y + 44, { font: SANS, size: 24, align: 'right', color: DIM, alpha: S });
      text('9 月', 540, 900, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: S * (1 - sstep(26.2, 26.6, t)) });
      text('12 月', 540, 900, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: S * sstep(26.4, 26.8, t) });
      glow(norm, y, 12, O_RGB, S, 5); text('想象中的大家', norm, y - 40, { font: SANS, size: 24, align: 'center', color: WARMC, alpha: S });
      person(own, y - 30, .5, S, TEALC); text('男生自己', own, y + 80, { font: SANS, size: 24, align: 'center', color: TEALC, alpha: S });
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('沉默主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('都以为别人同意，就都不开口', 540, 970, { size: 36, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 教室
function sceneClass(t) {
  if (t < CLASS - .3 || t > CLOTHES + .2) return;
  const A = sstep(CLASS - .1, CLASS + .5, t) * (1 - sstep(CLOTHES - .6, CLOTHES - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - CLASS) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('教室里', 37.7, 40.6, CREAM);
  hd('“有没有问题？”', 41.0, 44.6, CREAM);
  hd('“大家应该都懂了吧”', 45.0, 48.6, TEALC);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('一屋子的问号', 0, 0, { font: SERIF, size: 58, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(49.0, 49.5, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(30,50,40,.9)'; ctx.strokeStyle = 'rgba(195,202,214,.5)'; ctx.lineWidth = 3; ctx.fillRect(300, 760, 480, 130); ctx.strokeRect(300, 760, 480, 130); ctx.restore();   // 黑板
  ctx.save(); ctx.globalAlpha = A * .7; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 2; ctx.beginPath();
  for (let i = 0; i < 3; i++) { ctx.moveTo(330, 790 + i * 34); for (let x = 330; x < 740; x += 20) ctx.lineTo(x, 790 + i * 34 + 6 * Math.sin(x * .3 + i)); } ctx.stroke(); ctx.restore();
  const qa = A * sstep(41.0, 41.4, t) * (1 - sstep(44.6, 45.0, t) * 0);
  pill('有没有问题？', 860, 820, qa * (1 - sstep(48.7, 49.0, t)), { size: 26, stroke: 'rgba(236,230,218,.6)' });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {                                               // 三排学生，谁都没举手
    const x = 240 + c * 200, y = 1010 + r * 110, i = r * 4 + c;
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(120,90,70,.7)'; ctx.fillRect(x - 60, y + 6, 120, 14); ctx.restore();
    person(x, y, .5, A, GREYP);
    const lit = sstep(45.2 + i * .12, 45.4 + i * .12, t), all = sstep(49.0, 49.4, t);
    text('?', x + 34, y - 70, { font: SERIF, size: 34, weight: 900, align: 'center', color: all > 0 ? GOLD : TEALC, alpha: A * Math.max(lit * .5, all) * (all > 0 ? .7 + .3 * bk : 1) });
  }
}

// ======================================================================== ④ 新装
function sceneClothes(t) {
  if (t < CLOTHES - .3 || t > NOTONLY + .2) return;
  const A = sstep(CLOTHES - .1, CLOTHES + .5, t) * (1 - sstep(NOTONLY - .7, NOTONLY - .1, t));
  if (A <= 0) return;
  text('《皇帝的新装》', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('人人都看见了', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: TEALC, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('直到一个小孩说出口', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(60.9, 61.4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  const kx = 540, ky = 1030;                                                                             // 皇帝：一顶皇冠，身上一个虚线轮廓
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.arc(kx, ky - 110, 30, 0, TAU); ctx.moveTo(kx - 56, ky + 60); ctx.lineTo(kx - 56, ky - 40); ctx.quadraticCurveTo(kx - 56, ky - 76, kx - 18, ky - 78); ctx.lineTo(kx + 18, ky - 78); ctx.quadraticCurveTo(kx + 56, ky - 76, kx + 56, ky - 40); ctx.lineTo(kx + 56, ky + 60); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = '#e8b866'; ctx.beginPath(); ctx.moveTo(kx - 34, ky - 136); ctx.lineTo(kx - 34, ky - 166); ctx.lineTo(kx - 17, ky - 150); ctx.lineTo(kx, ky - 172); ctx.lineTo(kx + 17, ky - 150); ctx.lineTo(kx + 34, ky - 166); ctx.lineTo(kx + 34, ky - 136); ctx.closePath(); ctx.fill(); ctx.restore();
  const crowd = [[180, 1180], [290, 1200], [790, 1200], [900, 1180], [360, 1240], [720, 1240]];
  crowd.forEach(([x, y], i) => { person(x, y, .6, A, GREYP); think('明明什么都没穿…', x, y - 150, A * sstep(58.1 + i * .2, 58.4 + i * .2, t) * (1 - sstep(60.8, 61.2, t)) * (i < 4 ? 1 : 0), TEALC, 18); });
  const kid = A * sstep(60.9, 61.3, t);
  person(540, 1260, .42, kid, GOLD);
  pill('他什么都没穿！', 540, 1150 - 0, kid * sstep(61.2, 61.5, t), { size: 30, stroke: `rgba(${O_RGB},.9)`, color: GOLD, glow: `rgba(${O_RGB},.6)` });
}

// ======================================================================== ⑤ 不止我
function sceneNotOnly(t) {
  if (t < NOTONLY - .2 || t > CLIMAX + .3) return;
  const A = sstep(NOTONLY + .2, NOTONLY + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('心里犯嘀咕，却没人说话', 64.5, 67.6, CREAM);
  hd('“只有我这么觉得吗？”', 67.9, 71.9, TEALC, `rgba(${T_RGB},.4)`);
  hd('原来，不止我', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('一百年前：', 76.4, 0, CREAM);
  const xs = [200, 340, 480, 620, 760, 900];
  xs.forEach((x, i) => {
    const me = i === 2, relief = sstep(72.4 + Math.abs(i - 2) * .35, 72.8 + Math.abs(i - 2) * .35, t);
    person(x, 1150, .66, A, me ? TEALC : mixc(GREYP, WARMC, relief));
    if (!me) think('不止我', x, 1000 - (i % 2) * 50, A * relief * (1 - sstep(76.0, 76.4, t)), WARMC, 20);
    else { think('…', x, 980, A * sstep(64.6, 65.0, t) * (1 - sstep(67.8, 68.1, t)), PINK, 22);
      pill('只有我这么觉得吗？', x + 60, 930, A * sstep(68.1, 68.5, t) * (1 - sstep(76.0, 76.4, t)), { size: 26, stroke: `rgba(${T_RGB},.8)`, color: TEALC }); }
  });
  if (A * sstep(68.2, 68.4, t) > 0) for (let k = 0; k < 3; k++) {                                         // 一句话，一圈圈传开
    const p = ((t - 68.2) / 1.6 + k / 3) % 1; ctx.save(); ctx.globalAlpha = A * (1 - p) * .6 * (1 - sstep(76.0, 76.4, t)); ctx.strokeStyle = TEALC; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(480, 1100, 60 + 420 * p, 30 + 120 * p, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
}

// ======================================================================== ⑥ 说出口
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), cx = 540, cy = 1100;
  warmth(A * (1 + .5 * fin), cx, cy, 760);
  const R = (t - CLIMAX - 1.5) * 70;                                                                     // 从一个人开始，一圈声波往外传，碰到谁，谁就亮
  for (let k = 0; k < 4; k++) { const r = R - k * 160; if (r <= 0 || r > 700) continue; ctx.save(); ctx.globalAlpha = A * (1 - r / 700) * .7; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy - 40, r, r * .45, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
  const ring = [];                                                                                      // 三圈人，围着中间那个先开口的
  [[150, 6], [270, 9], [390, 12]].forEach(([d, n], j) => { for (let k = 0; k < n; k++) ring.push([d, (k + .5 * (j % 2)) / n * TAU]); });
  for (let i = 0; i < ring.length; i++) {
    const [d, a] = ring[i], x = cx + d * Math.cos(a), y = cy + d * .42 * Math.sin(a), dist = d;
    const lit = sstep(dist - 30, dist + 30, R);
    person(x, y, .42, A, mixc('#6f7786', GOLD, Math.max(lit, fin)));
  }
  person(cx, cy, .6, A, GOLD); glow(cx, cy - 60, 24 + 10 * fin, O_RGB, A, 8);
  if (fin > 0) for (let i = 0; i < 24; i++) { const r = mulberry(5400 + i), x = 380 + r() * 320, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1; glow(x + 16 * Math.sin(t + i), 1150 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3); }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('不在沉默中爆发，', 540, 440, { ...big, size: 60, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('就在沉默中灭亡。', 540, 552, { ...big, size: 68, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.5, CLIMAX + 2.5), qa);
  typeText('—— 鲁迅《记念刘和珍君》', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.7, CLIMAX + 3.3), qa);
  typeText('你说出口，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('别人才敢说。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneMask(t); sceneClass(t); sceneClothes(t); sceneNotOnly(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1993', 'Prentice & Miller · J Pers Soc Psychol', 8.2, 35.3, T);
  stamp('1987', 'Miller & McFarland · J Pers Soc Psychol', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(60);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 C 小调里，最后一个和弦是 C 大调）
const NOTE = { C3: 130.81, Eb3: 155.56, E3: 164.81, G3: 196.00, C4: 261.63, Eb4: 311.13, G4: 392.00, C5: 523.25, Eb5: 622.25, E5: 659.25, G5: 783.99 };
const CM_SHIM = [NOTE.Eb5, NOTE.G4, NOTE.C5, NOTE.C4, NOTE.G3], C_SHIM = [NOTE.E5, NOTE.G4, NOTE.C5, NOTE.C4, NOTE.G3], CM_SWELL = [65.41, 98.00, 130.81, 155.56, 196.00];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.G4, gain: .05 }], [1.0, 'tink', { f: NOTE.C5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.C3, NOTE.Eb3, NOTE.G3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.G5, gain: .1 }]);
  c.push([Q.REVEAL + .3, 'bar', { f0: 200, f1: 400, dur: 1.0, gain: .06 }]);
  for (let i = 0; i < 6; i++) c.push([10.9 + i * .12, 'tick', { gain: .06 }]);
  c.push([13.8, 'tink', { f: NOTE.Eb4, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: CM_SHIM, gain: .28 }]);
  c.push([20.2, 'page', { gain: .08 }], [24.2, 'page', { gain: .12 }], [26.4, 'tick', { gain: .1 }], [28.0, 'whoosh', { dur: 2.0, gain: .08 }], [31.7, 'page', { gain: .18 }]);
  c.push([CLASS, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'tink', { f: NOTE.C5, gain: .05 }]);
  for (let i = 0; i < 12; i++) c.push([45.2 + i * .12, 'tick', { gain: .05 }]);
  c.push([49.1, 'chord', { f: [NOTE.C3, NOTE.Eb3, NOTE.G3], gain: .1 }], [49.2, 'tink', { f: NOTE.G5, gain: .06 }]);
  c.push([CLOTHES, 'whoosh', { dur: .5, gain: .22 }], [58.1, 'dust', { dur: 2.4, gain: .04 }], [61.0, 'tink', { f: NOTE.C5, gain: .07 }], [61.2, 'tink', { f: NOTE.G5, gain: .07 }]);
  c.push([68.2, 'tink', { f: NOTE.Eb4, gain: .05 }], [69.8, 'whoosh', { dur: 1.4, gain: .06 }]);
  for (let i = 0; i < 4; i++) c.push([72.4 + i * .35, 'tink', { f: [NOTE.G4, NOTE.C5, NOTE.Eb5, NOTE.G5][i], gain: .05 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: CM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: CM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 65.41, gain: .14 }]);
  c.push([CLIMAX + 1.5, 'whoosh', { dur: 4, gain: .08 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: C_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.C3, NOTE.E3, NOTE.G3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
