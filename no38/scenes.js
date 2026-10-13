// ======================================================================== No.38 理性主义：人，是理性的动物吗？
// 第五季·看不见的主义 ⑤。开头是一道选择题：琳达更可能是银行职员，还是女权主义的银行职员？（Tversky & Kahneman, 1983）
// 音乐：原创配乐（music.py，升 C 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机每一句都比上一句多一个音，像故事越讲越细。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 理性主义（每拍一个鼓点） · 53.33 讲故事的人（紧张） · 64.0 剪刀（只剩钢琴） · 80.0 高潮：剪刀合上 · 96.0 升 C 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), RAT = BT(56), STORY = BT(80), SCISSOR = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['琳达', 0, LIFT], ['换个问法', LIFT, RAT], ['理性主义', RAT, STORY], ['讲故事的人', STORY, SCISSOR], ['剪刀', SCISSOR, CLIMAX], ['两片刀刃', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.38';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '琳达，31 岁，单身，学哲学，很关心社会公正。'],
  [4.1, 7.6, '她更可能是银行职员，还是女权主义的银行职员？'],
  [8.2, 10.4, '答案是：银行职员。'],
  [10.8, 13.3, '后者，只是前者的一部分。'],
  [13.6, 15.7, '可在经典的实验里，约 85% 的人选了后者。'],
  [16.3, 19.6, '这是特沃斯基和卡尼曼的「琳达问题」。'],
  [19.9, 23.7, '描述越像一个完整的故事，我们越觉得它可能。'],
  [24.0, 27.4, '人，真的是理性的动物吗？'],
  [27.7, 31.3, '后来，有人换了一种问法：'],
  [31.6, 35.3, '「像琳达这样的 100 个人里，各有几个？」'],
  [37.6, 40.6, '答错的人，从八成多，降到了二到四成。'],
  [40.9, 44.6, '同一道题，换成数人头，脑子就清楚多了。'],
  [44.9, 48.6, '「理性主义」相信：人能靠推理，找到对的答案。'],
  [48.9, 52.9, '可推理好不好，也要看题目怎么问。'],
  [53.6, 57.6, '最懂这一点的，是讲故事的人。'],
  [57.9, 63.4, '谣言和广告，细节越多，越像真的；可每多一个细节，它真的概率就更小。'],
  [64.3, 67.6, '所以，理性不只在脑子里，'],
  [67.9, 71.9, '也在你给自己出的题目里。'],
  [72.2, 75.9, '诺贝尔奖得主西蒙打过一个比方：'],
  [76.3, 79.6, '理性，像一把剪刀。'],
  [84.9, 88.6, '细节越多，越要停一下，'],
  [88.9, 92.6, '把故事，换成数字。'],
  [98.4, 103.0, '评论区：你第一反应选的是哪个？'],
];
const BIGLINES = [
  [80.2, 92.6, '「人的理性像一把剪刀：一片刀刃是头脑，一片是环境。」—— 西蒙'],
  [93.4, 98.0, '你没那么笨，换个问法试试。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [RAT - .5, .2], [RAT, .06], [SCISSOR, .06],
  [SCISSOR + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、琳达的卡片、柱子
function person(x, y, s, a, col = CREAM, fill = 'rgba(16,17,23,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = fill;
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const TAGS = ['31 岁 · 单身', '直率，很聪明', '大学学哲学', '关心歧视和社会公正', '参加过反核游行'];
function lindaCard(cx, cy, a, n, glowK = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.strokeStyle = glowK ? ORANGE : 'rgba(236,230,218,.35)'; ctx.lineWidth = 2;
  if (glowK) { ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 24 * glowK; }
  ctx.beginPath(); ctx.roundRect(cx - 360, cy - 170, 720, 340, 24); ctx.fill(); ctx.stroke(); ctx.restore();
  person(cx - 240, cy + 40, 1.1, a, '#ffd2a0');
  text('琳达', cx - 240, cy + 120, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#ffd2a0', alpha: a });
  TAGS.forEach((s, i) => { if (i < n) text('· ' + s, cx - 110, cy - 112 + i * 56, { font: SANS, size: 30, color: CREAM, alpha: a * clamp(n - i) }); });
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
function venn(cx, cy, a, k) {                                                                       // 大圆：银行职员；里面的小圆：女权主义的银行职员
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(79,214,196,.12)'; ctx.strokeStyle = TEAL; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 250, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(242,161,74,.25)'; ctx.strokeStyle = ORANGE; ctx.beginPath(); ctx.arc(cx + 70, cy + 70, 110 * k, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  text('银行职员', cx - 70, cy - 150, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#7fe3d3', alpha: a });
  text('女权主义的', cx + 70, cy + 50, { font: SERIF, size: 28, weight: 900, align: 'center', color: '#ffd2a0', alpha: a * k });
  text('银行职员', cx + 70, cy + 90, { font: SERIF, size: 28, weight: 900, align: 'center', color: '#ffd2a0', alpha: a * k });
}

// ======================================================================== ① 琳达（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('琳达更可能是：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('哪一个？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  lindaCard(540, 920, 1 - sstep(10.5, 11.0, t), 2 + clamp(prog(t, .3, 3.6)) * 3);
  const V = sstep(10.8, 11.3, t);
  venn(540, 960, V, E.out(prog(t, 11.2, 12.0)));
  text('约 85% 的人选了它', 760, 1290, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(13.6, 14.1, t), glow: 'rgba(229,72,77,.5)', blur: 14 });
  text('A · 银行职员', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#7fe3d3', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${T_RGB},.5)`, blur: 22 });
  text('后者，只是前者的一部分', 540, 560, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: sstep(10.9, 11.4, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 银行职员', 210], ['B · 女权主义的银行职员', 540], ['C · 一样', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 越像故事越可信 · 100 个人
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('理性主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('RATIONALISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第五季 · 看不见的主义 ⑤', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneFrame(t) {
  if (t < 19.7 || t > RAT + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(RAT - .6, RAT - .05, t));
  if (A <= 0) return;
  const S = A * (1 - sstep(23.6, 24.1, t));
  if (S > 0) {
    const n = 1 + clamp(prog(t, 20.0, 22.6)) * 4;
    lindaCard(540, 820, S, n, sstep(22.0, 22.6, t));
    const gx0 = 240, gx1 = 840, gy = 1160, k = (n - 1) / 4;
    text('越像一个故事', 240, gy - 50, { font: SANS, size: 26, color: '#9aa3b2', alpha: S });
    ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(gx0, gy - 14, gx1 - gx0, 28); ctx.fillStyle = `rgba(${O_RGB},.9)`; ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 14; ctx.fillRect(gx0, gy - 14, (gx1 - gx0) * (.25 + .75 * k), 28); ctx.restore();
    text('越觉得可能', gx1, gy + 50, { font: SANS, size: 26, align: 'right', color: '#ffd2a0', alpha: S * k });
  }
  const Q2 = A * sstep(24.0, 24.5, t) * (1 - sstep(27.4, 27.8, t));
  text('人，是理性的动物吗？', 540, 900, { font: SERIF, size: 66, weight: 900, align: 'center', color: CREAM, alpha: Q2 });
  const G = A * sstep(27.7, 28.2, t);
  if (G > 0) {                                                                                       // 100 个像琳达的人
    text('像琳达这样的 100 个人里：', 540, 640, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: G });
    const hi = sstep(31.6, 32.2, t), fem = sstep(33.0, 33.6, t);
    for (let i = 0; i < 100; i++) {
      const r = Math.floor(i / 10), c = i % 10, x = 270 + c * 60, y = 780 + r * 50, bank = [12, 27, 35, 48, 53, 66, 81, 94].includes(i), both = [27, 53, 81].includes(i);
      const col = both && fem ? ORANGE : bank && hi ? TEAL : 'rgba(154,163,178,.55)';
      ctx.save(); ctx.globalAlpha = G * sstep(27.8 + i * .01, 28.1 + i * .01, t); ctx.fillStyle = col; if (bank && hi) { ctx.shadowColor = col; ctx.shadowBlur = 12; }
      ctx.beginPath(); ctx.arc(x, y - 10, 8, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.roundRect(x - 9, y, 18, 20, 6); ctx.fill(); ctx.restore();
    }
    text('银行职员：几个？', 300, 1310, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#7fe3d3', alpha: G * hi });
    text('女权主义的银行职员：几个？', 760, 1310, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: G * fem });
  }
}

// ======================================================================== ③ 理性主义：答错的少了 · 题目怎么问
function sceneRat(t) {
  if (t < RAT - .3 || t > STORY + .2) return;
  const A = sstep(RAT - .1, RAT + .5, t) * (1 - sstep(STORY - .6, STORY - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - RAT) / BEAT) % 1);
  const B = A * (1 - sstep(44.6, 45.0, t));
  if (B > 0) {
    const base = 1200, g1 = E.out(prog(t, 37.8, 38.8)), g2 = E.out(prog(t, 38.6, 39.6));
    text('答错的比例', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: B });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, B);
    bar(380, base, 150, 4 * 85 * g1, '229,72,77', B); bar(700, base, 150, 4 * 30 * g2, T_RGB, B);
    ctx.save(); ctx.globalAlpha = B * g2; ctx.strokeStyle = '#7fe3d3'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(700, base - 80); ctx.lineTo(700, base - 160); ctx.moveTo(680, base - 80); ctx.lineTo(720, base - 80); ctx.moveTo(680, base - 160); ctx.lineTo(720, base - 160); ctx.stroke(); ctx.restore();
    text('八成多', 380, base - 4 * 85 * g1 - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#f0a0a0', alpha: B * g1 });
    text('二到四成', 700, base - 200, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#7fe3d3', alpha: B * g2 });
    text('问「概率」', 380, base + 40, { font: SANS, size: 28, align: 'center', color: '#f0a0a0', alpha: B });
    text('问「几个人」', 700, base + 40, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: B });
    text('少了，但没消失', 700, 760, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#c3cad6', alpha: B * sstep(41.6, 42.1, t) });
  }
  const D = A * sstep(44.9, 45.4, t);
  if (D > 0) {
    typeText('理性主义', 540, 640, { ...big, size: 64, weight: 900 }, prog(t, 45.0, 45.7), D);
    typeText('人能靠推理，找到对的答案', 540, 730, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 45.6, 46.4), D);
    const flip = (Math.floor((t - 48.9) / (BEAT * 2)) % 2 + 2) % 2, F = D * sstep(48.9, 49.4, t);
    ctx.save(); ctx.globalAlpha = F; ctx.translate(540, 1000); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.strokeStyle = flip ? TEAL : 'rgba(240,160,160,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-300, -110, 600, 220, 22); ctx.fill(); ctx.stroke(); ctx.restore();
    text(flip ? '100 个人里，有几个？' : '可能性有多大？', 540, 1004, { font: SERIF, size: 44, weight: 900, align: 'center', color: flip ? '#7fe3d3' : '#f0a0a0', alpha: F });
    text('同一道题', 540, 1180, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: F });
  }
}

// ======================================================================== ④ 讲故事的人：细节越多越像真的，概率却越小
function sceneStory(t) {
  if (t < STORY - .3 || t > SCISSOR + .2) return;
  const A = sstep(STORY - .1, STORY + .5, t) * (1 - sstep(SCISSOR - .7, SCISSOR - .1, t));
  if (A <= 0) return;
  const lines = ['某人辞职了', '……因为和老板吵架', '……据知情人透露', '……还有聊天截图'];
  lines.forEach((s, i) => { const a = A * sstep(53.8 + i * .9, 54.2 + i * .9, t); text(s, 220 + i * 30, 640 + i * 56, { font: SANS, size: 32, color: i ? '#ffd2a0' : CREAM, alpha: a }); });
  const G = A * sstep(57.9, 58.4, t);
  if (G > 0) {
    const x0 = 200, x1 = 880, y0 = 1250, y1 = 900, k = clamp(prog(t, 58.2, 61.8));
    seg(x0, y0, x1, y0, 'rgba(236,230,218,.4)', 2, G); seg(x0, y0, x0, y1, 'rgba(236,230,218,.4)', 2, G);
    text('细节越来越多 →', x1, y0 + 34, { font: SANS, size: 24, align: 'right', color: '#9aa3b2', alpha: G });
    const line = (f, col) => { ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.beginPath(); for (let i = 0; i <= 60 * k; i++) { const u = i / 60; const x = lerp(x0, x1 - 20, u), y = f(u); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); };
    line(u => lerp(y0 - 60, y1 + 10, Math.sqrt(u)), ORANGE);
    line(u => lerp(y1 + 20, y0 - 30, Math.sqrt(u)), TEAL);
    text('感觉像真的', x1, y1 - 14, { font: SERIF, size: 30, weight: 900, align: 'right', color: '#ffd2a0', alpha: G * sstep(60.0, 60.5, t) });
    text('真的概率', x1, y0 - 70, { font: SERIF, size: 30, weight: 900, align: 'right', color: '#7fe3d3', alpha: G * sstep(61.0, 61.5, t) });
    text('示意', x0 + 10, y1 - 14, { font: SANS, size: 22, color: '#6f7786', alpha: G });
  }
}

// ======================================================================== ⑤ 剪刀：一片是头脑，一片是题目
function scissors(cx, cy, s, a, open, glowK = 0) {
  if (a <= 0) return;
  for (const [sgn, col] of [[-1, '#7fe3d3'], [1, '#ffd2a0']]) {
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(s, s); ctx.rotate(sgn * open * .45);
    ctx.fillStyle = 'rgba(200,205,215,.9)'; ctx.strokeStyle = col; ctx.lineWidth = 4; if (glowK) { ctx.shadowColor = col; ctx.shadowBlur = 24 * glowK; }
    ctx.beginPath(); ctx.moveTo(0, -6 * sgn); ctx.lineTo(-300, -14 * sgn); ctx.lineTo(-300, 0); ctx.lineTo(0, 10 * sgn); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(16,17,23,.95)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(110, 40 * sgn, 70, 44, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(50, 22 * sgn); ctx.stroke();
    ctx.restore();
  }
  glow(cx, cy, 8 * s, '236,230,218', a, 3);
}
function sceneScissor(t) {
  if (t < SCISSOR - .2) return;
  const A = sstep(SCISSOR + .2, SCISSOR + 1.0, t);
  const R = A * (1 - sstep(71.6, 72.1, t));
  if (R > 0) {
    text('理性', 540, 640, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: R * sstep(64.4, 64.9, t) });
    text('脑子', 300, 1180, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#7fe3d3', alpha: R * sstep(64.6, 65.1, t) });
    text('题目', 300, 820, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: R * sstep(67.9, 68.4, t) });
  }
  const Hm = A * sstep(72.2, 72.7, t) * (1 - sstep(CLIMAX - .4, CLIMAX, t));
  typeText('赫伯特·西蒙', 540, 620, { ...big, size: 60, weight: 900 }, prog(t, 72.3, 73.1), Hm);
  typeText('诺贝尔经济学奖 · 1978', 540, 710, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 72.9, 73.7), Hm);
  const close = E.inExpo(prog(t, CLIMAX - .5, CLIMAX)), open = (1 - close) * (.8 + .1 * Math.sin(t * 1.2)) + .15 * E.io(prog(t, CLIMAX + .6, CLIMAX + 2.0)) * (1 - sstep(FINAL - .3, FINAL, t));
  scissors(600, 1010, .9, A, Math.max(.02, open), sstep(CLIMAX, CLIMAX + .6, t) * (.6 + .4 * sstep(FINAL, FINAL + 1, t)));
}

// ======================================================================== ⑥ 两片刀刃
function sceneBlades(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1020, 760);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「人的理性像一把剪刀：', 540, 430, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('一片刀刃是头脑，', 540, 522, { ...big, size: 52, weight: 900, color: '#7fe3d3' }, prog(t, CLIMAX + 1.7, CLIMAX + 2.6), qa);
  typeText('一片是环境。」', 540, 616, { ...big, size: 60, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.7, CLIMAX + 3.5), qa);
  typeText('—— 赫伯特·西蒙（大意）', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.7, CLIMAX + 4.3), qa);
  typeText('你没那么笨，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('换个问法试试。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneFrame(t); sceneRat(t); sceneStory(t); sceneScissor(t); sceneBlades(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .6 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 64.3, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1983', 'Tversky & Kahneman · Psych Review', 8.2, 23.7, T);
  stamp('1988', 'Fiedler; Hertwig & Gigerenzer 1999', 27.7, 44.6, T);
  stamp('1990', 'Herbert A. Simon · Annu Rev Psychol', 72.2, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(38);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在升 C 小调里，最后一个和弦是升 C 大调）
const NOTE = { Cs4: 277.18, E4: 329.63, F4: 349.23, Gs4: 415.3, Cs5: 554.37, E5: 659.26, Gs5: 830.61, Cs6: 1108.73, E6: 1318.51, F6: 1396.91, Gs6: 1661.22 };
const CSM_SHIM = [NOTE.E6, NOTE.Gs5, NOTE.Cs6, NOTE.Cs5, NOTE.Gs4], CSMAJ_SHIM = [NOTE.F6, NOTE.Gs5, NOTE.Cs6, NOTE.Cs5, NOTE.Gs4], CSM_SWELL = [69.3, 103.83, 138.59, 164.81, 207.65];
function CUES() {
  const c = [];
  for (let i = 0; i < 3; i++) c.push([.9 + i * 1.0, 'tink', { f: [NOTE.Cs5, NOTE.E5, NOTE.Gs5][i], gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Cs4, NOTE.E4, NOTE.Gs4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Cs6, gain: .12 }]);
  c.push([11.2, 'swish', { gain: .12 }], [13.6, 'thud', { gain: .16 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: CSM_SHIM, gain: .28 }]);
  for (let i = 0; i < 4; i++) c.push([20.3 + i * .65, 'tink', { f: [NOTE.Cs5, NOTE.E5, NOTE.Gs5, NOTE.Cs6][i], gain: .06 }]);
  c.push([24.1, 'thud', { gain: .12 }], [27.8, 'dust', { dur: 1.4, gain: .1 }], [31.6, 'tink', { f: NOTE.E6, gain: .08 }], [33.0, 'tink', { f: NOTE.Gs6, gain: .08 }]);
  c.push([RAT, 'whoosh', { dur: .5, gain: .25 }], [37.8, 'bar', { f0: 277, f1: 554, dur: 1.0, gain: .12 }], [38.6, 'bar', { f0: 277, f1: 370, dur: 1.0, gain: .12 }], [41.6, 'tink', { f: NOTE.Cs6, gain: .08 }]);
  c.push([45.0, 'chord', { f: [NOTE.Cs5, NOTE.E5, NOTE.Gs5], gain: .08 }]);
  for (let i = 0; i < 3; i++) c.push([48.9 + i * BEAT * 2, 'swish', { gain: .08 }]);
  c.push([STORY, 'whoosh', { dur: .5, gain: .22 }]);
  for (let i = 0; i < 4; i++) c.push([53.8 + i * .9, 'click', { gain: .1 }]);
  c.push([58.2, 'bar', { f0: 277, f1: 554, dur: 3.0, gain: .08 }], [58.4, 'bar', { f0: 554, f1: 277, dur: 3.0, gain: .08 }]);
  c.push([64.4, 'tink', { f: NOTE.E6, gain: .07 }], [67.9, 'tink', { f: NOTE.Gs5, gain: .07 }], [72.3, 'page', { gain: .2 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: CSM_SWELL, gain: .28 }], [CLIMAX - .1, 'crack', { gain: .14 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: CSM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 138.59, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL - .1, 'crack', { gain: .12 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: CSMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Cs4, NOTE.F4, NOTE.Gs4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
