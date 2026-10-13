// ======================================================================== No.29 怀疑主义：你真的懂吗？
// 第四季·你身上的主义 ⑥。开头是一道选择题：先给自己懂拉链的程度打分，再一步步解释出来，分数会怎样？（Rozenblit & Keil, 2002）
// 音乐：原创配乐（music.py，D 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机一直在“问”：同一个往上的问句，每次从不同的和弦音问起。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 搜索（每拍一个鼓点） · 53.33 不知道（紧张） · 64.0 笛卡尔（只剩钢琴） · 80.0 高潮 · 96.0 D 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), SEARCH = BT(56), UNKNOWN = BT(80), DOUBT = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['拉链测试', 0, LIFT], ['苏格拉底', LIFT, SEARCH], ['搜索', SEARCH, UNKNOWN], ['不知道', UNKNOWN, DOUBT], ['笛卡尔', DOUBT, CLIMAX], ['罗素', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.29';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '你知道拉链是怎么拉上的吗？给自己打个分，1 到 7。'],
  [4.1, 7.6, '现在，试着一步一步解释出来。再打一次分，会怎样？'],
  [8.2, 10.4, '答案是：大多数人的分数，往下掉了。'],
  [10.8, 13.3, '马桶、自行车锁、缝纫机，全都一样。'],
  [13.6, 15.7, '我们以为自己懂，其实只是「眼熟」。'],
  [16.3, 19.6, '心理学叫它「解释深度错觉」。'],
  [19.9, 23.7, '问「事实」，人们挺诚实；一问「原理」，就容易高估自己。'],
  [24.0, 27.4, '两千多年前，有个人整天在街上问别人问题。'],
  [27.7, 31.3, '他发现，那些自以为懂的人，一追问就答不上来。'],
  [31.6, 35.3, '他叫苏格拉底。后来的「怀疑主义」，常把他当成源头之一。'],
  [37.6, 40.6, '今天，我们离答案只有一次搜索。'],
  [40.9, 44.6, '一项研究让一组人先上网查资料，'],
  [44.9, 48.6, '结果他们觉得，自己对别的问题，也更能解释清楚了。'],
  [48.9, 52.9, '网上的知识，被我们悄悄算进了自己的脑子里。'],
  [53.6, 57.6, '最危险的，不是不知道，'],
  [57.9, 63.4, '而是不知道自己不知道，还觉得自己很懂。'],
  [64.3, 67.6, '笛卡尔说，要找到可靠的东西，先把一切都怀疑一遍。'],
  [67.9, 71.9, '最后他找到一件没法怀疑的事：我在怀疑，所以我在。'],
  [72.2, 75.9, '怀疑，不是什么都不信，而是先问一句：我真的懂吗？'],
  [76.3, 79.6, '罗素在 1933 年写过：'],
  [84.9, 88.6, '所以，如果你常常怀疑自己，'],
  [88.9, 92.6, '也许，你正走在对的路上。'],
  [98.4, 103.0, '评论区：拉链和马桶，你能讲清楚哪个？'],
];
const BIGLINES = [
  [80.2, 92.6, '「问题的根源在于：在现代世界，愚蠢的人自信满满，聪明的人却满腹怀疑。」—— 罗素'],
  [93.4, 98.0, '下次觉得「我懂」的时候，试着解释一遍。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [SEARCH - .5, .2], [SEARCH, .06], [DOUBT, .06],
  [DOUBT + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .5], [TOTAL, .5]]);
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

// ======================================================================== ① 拉链测试（0–16）
function zipper(x, y, h, open, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const sy = y - h / 2 + h * open;                                                                  // 拉头的位置：上面张开，下面咬合
  for (const side of [-1, 1]) {
    ctx.fillStyle = 'rgba(60,64,80,.95)';
    ctx.beginPath(); ctx.moveTo(x + side * 14, y + h / 2);
    for (let yy = y + h / 2; yy >= y - h / 2; yy -= 8) { const spread = yy < sy ? (sy - yy) * .35 : 0; ctx.lineTo(x + side * (14 + spread), yy); }
    ctx.lineTo(x + side * (60 + (sy - (y - h / 2)) * .35), y - h / 2); ctx.lineTo(x + side * 60, y + h / 2); ctx.closePath(); ctx.fill();
    for (let yy = y + h / 2 - 6, i = 0; yy >= y - h / 2; yy -= 14, i++) {
      const spread = yy < sy ? (sy - yy) * .35 : 0, off = (i % 2 === (side > 0 ? 0 : 1)) ? 0 : 7;
      ctx.fillStyle = '#d9c9a0'; ctx.fillRect(x + side * spread - 9 + (side > 0 ? 0 : 0) + side * 1, yy - 4 + off * 0, 18 * (side > 0 ? 1 : 1) * .5 + 4, 7);
    }
  }
  ctx.fillStyle = '#f2e6c4'; ctx.shadowColor = 'rgba(242,190,110,.6)'; ctx.shadowBlur = 16;                    // 拉头
  ctx.beginPath(); ctx.roundRect(x - 26, sy - 22, 52, 44, 10); ctx.fill();
  ctx.fillRect(x - 8, sy + 20, 16, 50); ctx.restore();
}
function scale7(y, val, a, col = ORANGE, label = '') {
  if (a <= 0) return;
  const x0 = 210, x1 = 870, px = v => x0 + (x1 - x0) * (v - 1) / 6;
  seg(x0, y, x1, y, 'rgba(236,230,218,.3)', 3, a);
  for (let v = 1; v <= 7; v++) { seg(px(v), y - 10, px(v), y + 10, 'rgba(236,230,218,.4)', 2, a); text(String(v), px(v), y + 40, { font: SERIF, size: 26, align: 'center', color: '#8a93a3', alpha: a }); }
  glow(px(val), y, 13, col === ORANGE ? O_RGB : T_RGB, a, 5);
  if (label) text(label, px(val), y - 44, { font: SANS, size: 26, align: 'center', color: col, alpha: a });
}
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('先给自己打分，再解释一遍：', 540, 452, { ...big, size: 48, weight: 700 }, 1, 1 - qOut);
  typeText('你真的懂拉链吗？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  zipper(540, 880, 360, .5 + .35 * Math.sin(t * 1.1), 1, t);
  const drop = E.io(prog(t, Q.REVEAL, Q.REVEAL + 1.2));
  scale7(1150, lerp(6, 3, drop), 1, drop > .5 ? TEAL : ORANGE, drop < .05 ? '先打：6' : drop > .95 ? '解释之后：3' : '');
  ['马桶', '自行车锁', '缝纫机'].forEach((s, i) => pill(`${s} ↓`, [260, 540, 820][i], 1290, sstep(10.8 + i * .3, 11.2 + i * .3, t) * (1 - sstep(13.4, 13.8, t)), { size: 28, stroke: `rgba(${T_RGB},.7)`, color: TEAL }));
  text('眼熟 ≠ 懂', 540, 560, { font: SERIF, size: 84, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(13.6, 14.1, t), glow: `rgba(${O_RGB},.5)`, blur: 20 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 不变', 220], ['B · 更高', 540], ['C · 下降', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 事实 vs 原理 · 苏格拉底在街上发问
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('怀疑主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('SKEPTICISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ⑥', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke(); ctx.restore();
}
function sceneSocrates(t) {
  if (t < 19.7 || t > SEARCH + .2) return;
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.1, t));                                     // 事实 vs 原理（示意）
  if (A1 > 0) {
    [['问事实', '“法国的首都是？”', 300, .15], ['问原理', '“拉链怎么拉上？”', 780, .55]].forEach(([h, q, x, dropK], i) => {
      const k = E.out(prog(t, 20.6 + i * .4, 21.6 + i * .4));
      text(h, x, 680, { font: SERIF, size: 44, weight: 900, align: 'center', color: i ? '#ffd2a0' : CREAM, alpha: A1 });
      text(q, x, 750, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: A1 });
      const before = 300, after = before * (1 - dropK * k);
      ctx.save(); ctx.globalAlpha = A1; ctx.fillStyle = 'rgba(236,230,218,.25)'; ctx.fillRect(x - 70, 1150 - before, 50, before);
      ctx.fillStyle = i ? `rgba(${O_RGB},.85)` : `rgba(${T_RGB},.8)`; ctx.fillRect(x + 20, 1150 - after, 50, after); ctx.restore();
      text('之前', x - 45, 1190, { font: SANS, size: 22, align: 'center', color: '#8a93a3', alpha: A1 }); text('解释后', x + 45, 1190, { font: SANS, size: 22, align: 'center', color: '#8a93a3', alpha: A1 });
    });
    text('自我评分（示意）', 540, 1250, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: A1 });
  }
  const A2 = sstep(24.0, 24.5, t) * (1 - sstep(SEARCH - .6, SEARCH - .05, t));                    // 街上：一个人挨个发问
  if (A2 > 0) {
    const xs = [460, 640, 820], soc = 220;
    person(soc, 1130, 1.2, A2, '#ffd2a0');
    xs.forEach((x, i) => {
      person(x, 1130, 1.05, A2 * sstep(24.2 + i * .3, 24.6 + i * .3, t), CREAM);
      const ask = 27.7 + i * 1.1, k1 = sstep(24.6 + i * .3, 25.0 + i * .3, t) * (1 - sstep(ask + .6, ask + .9, t)), k2 = sstep(ask + .7, ask + 1.0, t);
      if (k1 > 0) pill('我懂', x, 960, A2 * k1, { size: 26 });
      if (k2 > 0) pill('呃……', x, 960, A2 * k2, { size: 26, stroke: 'rgba(154,163,178,.7)', color: '#9aa3b2' });
      if (t > ask && t < ask + 1.2) { const ph = (t - ask) / 1.2; ctx.save(); ctx.globalAlpha = A2 * Math.sin(PI * ph); text('为什么？', lerp(soc, x, ph), 900 - 40 * Math.sin(PI * ph), { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0' }); ctx.restore(); }
    });
    text('苏格拉底', soc, 1230, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: A2 * sstep(31.6, 32.2, t) });
    text('约公元前 400 年 · 雅典', 540, 700, { font: SERIF, size: 36, weight: 900, align: 'center', color: '#d8c79f', alpha: A2 * sstep(31.8, 32.4, t) });
  }
}

// ======================================================================== ③ 搜索：觉得自己懂的，越来越多
function sceneSearch(t) {
  if (t < SEARCH - .3 || t > UNKNOWN + .2) return;
  const A = sstep(SEARCH - .1, SEARCH + .5, t) * (1 - sstep(UNKNOWN - .6, UNKNOWN - .05, t));
  if (A <= 0) return;
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(30,32,42,.95)'; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2.5;   // 搜索框
  ctx.beginPath(); ctx.roundRect(150, 600, 780, 90, 45); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(205, 640, 16, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(217, 652); ctx.lineTo(232, 667); ctx.stroke(); ctx.restore();
  typeText('拉链是怎么拉上的？', 260, 646, { size: 34, weight: 500, font: SANS, spread: 2, rise: 4, blur: 3 }, prog(t, 37.8, 39.4), A);
  const beats = Math.floor(Math.max(0, t - 38.4) / BEAT);
  for (let i = 0; i < Math.min(6, beats); i++) {                                                     // 一拍一条结果
    const y = 740 + i * 46, k = sstep(38.4 + i * BEAT, 38.7 + i * BEAT, t);
    ctx.save(); ctx.globalAlpha = A * k * (1 - sstep(40.6, 41.2, t) * .7); ctx.fillStyle = 'rgba(127,178,255,.7)'; ctx.fillRect(170, y, 300 + 140 * hash2(i, 3), 12); ctx.fillStyle = 'rgba(236,230,218,.25)'; ctx.fillRect(170, y + 20, 600 * (.6 + .4 * hash2(i, 7)), 8); ctx.restore();
  }
  const B = A * sstep(40.9, 41.5, t);                                                                // 两根柱：觉得自己懂的 vs 脑子里真有的
  if (B > 0) {
    const g = E.io(prog(t, 44.9, 48.4)), base = 1250;
    seg(260, base, 820, base, 'rgba(236,230,218,.35)', 2, B);
    [['觉得自己懂的', 380, 140 + 190 * g, ORANGE, O_RGB], ['脑子里真有的', 700, 140, TEAL, T_RGB]].forEach(([lab, x, h, col, rgb]) => {
      ctx.save(); ctx.globalAlpha = B; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 16; ctx.fillRect(x - 60, base - h, 120, h); ctx.restore();
      text(lab, x, base + 40, { font: SANS, size: 26, align: 'center', color: col, alpha: B });
    });
    const ka = B * sstep(48.9, 49.4, t);
    if (ka > 0) { ctx.save(); ctx.globalAlpha = ka * .8; ctx.setLineDash([8, 8]); ctx.strokeStyle = '#ffd2a0'; ctx.lineWidth = 2; ctx.strokeRect(320, base - 330, 120, 190); ctx.restore(); text('网上的', 380, base - 380, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: ka }); }
  }
}

// ======================================================================== ④ 不知道自己不知道：三个圈
function sceneUnknown(t) {
  if (t < UNKNOWN - .3 || t > DOUBT + .2) return;
  const A = sstep(UNKNOWN - .1, UNKNOWN + .5, t) * (1 - sstep(DOUBT - .7, DOUBT - .1, t));
  if (A <= 0) return;
  const cx = 540, cy = 930, grow = E.io(prog(t, 57.9, 63.0));
  const R3 = lerp(320, 420, grow);
  ctx.save(); ctx.globalAlpha = A; const g = ctx.createRadialGradient(cx, cy, 160, cx, cy, R3); g.addColorStop(0, 'rgba(60,20,30,.0)'); g.addColorStop(1, `rgba(120,30,40,${.35 + .25 * grow})`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R3, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(229,72,77,.6)'; ctx.lineWidth = 2; ctx.setLineDash([10, 10]); ctx.lineDashOffset = t * 20; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 230, 0, TAU); ctx.stroke(); ctx.restore();
  glow(cx, cy, 90, O_RGB, A * .35, 2); ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 110, 0, TAU); ctx.stroke(); ctx.restore();
  text('知道的', cx, cy, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(53.8, 54.4, t) });
  text('知道自己不知道的', cx, cy - 170, { font: SANS, size: 26, align: 'center', color: CREAM, alpha: A * sstep(54.4, 55.0, t) });
  text('不知道自己不知道的', cx, cy - 170 - (R3 - 230) / 2 - 40, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#e5484d', alpha: A * sstep(57.9, 58.5, t) });
  pill('“我很懂”', cx + 260, cy + 260, A * sstep(60.5, 61.1, t), { size: 28, stroke: 'rgba(229,72,77,.7)', color: '#f0a0a0' });
}

// ======================================================================== ⑤ 笛卡尔：把一切打上问号，只剩“我在怀疑”
function sceneDescartes(t) {
  if (t < DOUBT - .2 || t > CLIMAX + .3) return;
  const A = sstep(DOUBT + .2, DOUBT + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const things = ['天空', '身体', '书本', '老师', '常识', '眼睛', '记忆', '数学'];
  things.forEach((s, i) => {
    const an = i / 8 * TAU - PI / 2, x = 540 + Math.cos(an) * 300, y = 960 + Math.sin(an) * 300;
    const k = sstep(64.4 + i * .2, 64.8 + i * .2, t), q = sstep(65.6 + i * .25, 66.0 + i * .25, t), fade = sstep(67.9, 69.5, t);
    pill(s, x, y, A * k * (1 - .7 * fade), { size: 28 });
    text('?', x + 54, y - 30, { font: SERIF, size: 40, weight: 900, color: '#e5484d', alpha: A * q * (1 - .7 * fade) });
  });
  const me = sstep(68.4, 69.4, t);
  glow(540, 960, 14 + 6 * me, O_RGB, A * me, 6);
  if (me > 0) {
    text('我在怀疑', 540, 1050, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * me });
    text('所以我在', 540, 1110, { font: SERIF, size: 36, weight: 700, align: 'center', color: CREAM, alpha: A * sstep(69.6, 70.2, t) });
  }
  text('我真的懂吗？', 540, 700, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(72.4, 73.0, t), glow: `rgba(${O_RGB},.5)`, blur: 18 });
}

// ======================================================================== ⑥ 罗素：一个由星星组成的问号，慢慢亮成一盏灯
let QSTARS = [];
function sceneRussell(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1060, 760);
  QSTARS.forEach((s, i) => {
    const k = sstep(CLIMAX + .5 + s.d * 5, CLIMAX + 1.0 + s.d * 5, t); if (k <= 0) return;
    glow(s.x + Math.sin(t * .8 + i) * 2, s.y + Math.cos(t * .7 + i) * 2, 3 + 2 * s.b, '255,214,160', A * k * (.7 + .3 * Math.sin(t * 2 + i)), 4);
  });
  const lamp = sstep(FINAL, FINAL + 1.4, t);
  glow(540, 1260, 14 + 16 * lamp, O_RGB, A * sstep(CLIMAX + 4, CLIMAX + 5, t), 6 + 4 * lamp);              // 问号下面那一点，最后亮成一盏灯
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「问题的根源在于：', 540, 470, { ...big, size: 54, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.1), qa);
  typeText('在现代世界，愚蠢的人自信满满，', 540, 562, { ...big, size: 50, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.2, CLIMAX + 2.4), qa);
  typeText('聪明的人却满腹怀疑。」', 540, 656, { ...big, size: 60, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.4), qa);
  typeText('—— 罗素《愚蠢的胜利》', 540, 744, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.6, CLIMAX + 4.2), qa);
  typeText('下次觉得「我懂」的时候，', 540, 560, { ...big, size: 54, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('试着解释一遍。', 540, 666, { ...big, size: 72, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneSocrates(t); sceneSearch(t); sceneUnknown(t); sceneDescartes(t); sceneRussell(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 68.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2002', 'Rozenblit & Keil · Cognitive Science', 8.2, 23.7, T);
  stamp('前 399', 'Plato · Apology', 24.0, 35.3, T);
  stamp('2015', 'Fisher, Goddu & Keil · JEP: General', 40.9, 52.9, T);
  stamp('1641', 'Descartes · Meditations', 64.3, 71.9, T);
  stamp('1933', 'Russell · The Triumph of Stupidity', 76.3, 80.0, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(29);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rq = mulberry(291);                                                                          // 问号的形状：上面一段弧，下面一竖
  QSTARS = [];
  for (let i = 0; i < 40; i++) { const u = i / 39, an = PI * 1.05 - u * PI * 1.45, x = 540 + Math.cos(an) * 150, y = 900 - Math.sin(an) * 150; QSTARS.push({ x: x + (rq() - .5) * 10, y: y + (rq() - .5) * 10, d: u * .6, b: rq() }); }
  for (let i = 0; i < 14; i++) { const u = i / 13; QSTARS.push({ x: 540 + 70 * (1 - u) * .6 + (rq() - .5) * 8, y: 1010 + u * 150, d: .6 + u * .3, b: rq() }); }
}

// ======================================================================== 音效提示表（音高都在 D 小调里，最后一个和弦是 D 大调）
const NOTE = { D5: 587.33, F5: 698.46, Fs5: 739.99, A5: 880, D6: 1174.66, F6: 1396.91, Fs6: 1479.98, A6: 1760, D7: 2349.32 };
const DM_SHIM = [NOTE.F6, NOTE.A6, NOTE.D6, NOTE.D7, NOTE.A5], DMAJ_SHIM = [NOTE.Fs6, NOTE.A6, NOTE.D6, NOTE.D7, NOTE.A5], DM_SWELL = [73.42, 110, 146.83, 174.61, 220];
function CUES() {
  const c = [];
  c.push([.4, 'swish', { gain: .12 }], [2.2, 'swish', { gain: .1 }], [4.0, 'swish', { gain: .1 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.D5, NOTE.F5, NOTE.A5], gain: .24 }], [Q.REVEAL + .1, 'bar', { f0: 880, f1: 440, dur: 1.1, gain: .2 }]);
  for (let i = 0; i < 3; i++) c.push([10.8 + i * .3, 'tink', { f: [NOTE.A5, NOTE.F5, NOTE.D5][i], gain: .1 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: DM_SHIM, gain: .28 }]);
  c.push([20.6, 'bar', { f0: 440, f1: 392, dur: .8, gain: .14 }], [21.0, 'bar', { f0: 440, f1: 262, dur: .8, gain: .16 }]);
  for (let i = 0; i < 3; i++) c.push([27.7 + i * 1.1, 'tink', { f: NOTE.A6, gain: .1 }], [28.5 + i * 1.1, 'thud', { gain: .1 }]);
  c.push([SEARCH, 'whoosh', { dur: .5, gain: .25 }]);
  for (let i = 0; i < 16; i++) c.push([37.8 + i * .1, 'click', { gain: .05 }]);
  c.push([44.9, 'bar', { f0: 294, f1: 587, dur: 3.4, gain: .16 }], [48.9, 'tink', { f: NOTE.F6, gain: .12 }]);
  c.push([UNKNOWN, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'drone', { dur: 5.4, gain: .14 }]);
  c.push([65.6, 'tick', { gain: .12 }], [68.4, 'shimmer', { f: DM_SHIM, gain: .18 }], [72.4, 'chord', { f: [NOTE.D5, NOTE.F5, NOTE.A5], gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: DM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: DM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 73.42, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: DMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.D5, NOTE.Fs5, NOTE.A5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
