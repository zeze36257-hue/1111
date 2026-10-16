// ======================================================================== 新系列 · 讲课 ①《为什么越长大，朋友越少？》
// 新系列：一个人在讲课（频道主配音，不出镜），讲清楚大家说不清的情绪。结构：问题 → 三个原因（时间 / 环境 / 筛选）→ 一句带走的话。
// 每一段开头一张“板书”章节卡（一 · 时间 / 二 · 环境 / 三 · 筛选），像老师在黑板上写标题。
// 音乐：原创配乐（music.py，F 大调 75 BPM，1 小节 = 3.2 秒），从第 0 秒放到最后一秒，不剪不断。
// 段落都从小节线开始：32.0 时间 · 70.4 环境 · 99.2 筛选 · 128.0 答案；全长 48 小节 = 153.6 秒。
const BEAT = .8, BAR = 3.2, BT = n => n * BEAT;
const S_TIME = BT(40), S_ENV = BT(88), S_SIFT = BT(124), S_END = BT(160), TOTAL = BT(192);
const SECTIONS = [['问题', 0, S_TIME], ['时间', S_TIME, S_ENV], ['环境', S_ENV, S_SIFT], ['筛选', S_SIFT, S_END], ['答案', S_END, TOTAL]];
const SERIES = '黑猫不说话';

const LINES = [
  [0.15, 1.75, '你有没有发现：'],
  [2.05, 5.35, '小时候交朋友，只要一句“一起玩吧”。'],
  [5.65, 8.55, '长大以后，通讯录里几百个人，'],
  [8.85, 12.85, '能在半夜打个电话的，一只手就数得过来。'],
  [13.15, 16.75, '有人分析过三百多万人的通话记录：'],
  [17.05, 21.25, '一个人经常联系的人数，大约在25岁到顶，'],
  [21.55, 23.55, '之后就开始往下走。'],
  [23.85, 26.35, '为什么越长大，朋友越少？'],
  [26.65, 29.55, '是你变冷漠了吗？其实，不全是。'],
  [32.3, 34.6, '交朋友，是要花时间的。'],
  [34.9, 36.9, '美国有研究估算过：'],
  [37.2, 42.1, '从陌生人变成普通朋友，大约要一起待50个小时；'],
  [42.4, 45.7, '变成好朋友，要200个小时以上。'],
  [46.0, 50.0, '而且得是闲着的时间：吃饭、聊天、一起瞎玩。'],
  [50.3, 52.8, '一起开会加班，几乎不算。'],
  [53.1, 56.9, '上学的时候，这200个小时是白送的：'],
  [57.2, 61.2, '同一个教室，同一个宿舍，一待就是好几年。'],
  [61.5, 64.6, '工作以后，谁还有200个小时，'],
  [64.9, 67.2, '陪一个人什么都不干？'],
  [70.7, 74.3, '社会学家说，亲密的友谊要三个条件：'],
  [74.6, 77.3, '离得近；经常不经意地碰面；'],
  [77.6, 81.4, '还有一个能放下防备、说真心话的地方。'],
  [81.7, 83.7, '学校，三样全给你了。'],
  [84.0, 86.9, '长大以后，它们一个一个消失：'],
  [87.2, 92.3, '大家去了不同的城市，见面要提前约，约了还常常改期；'],
  [92.6, 95.3, '见了面，也很难再什么都说。'],
  [99.5, 102.4, '但还有一个原因，不全是坏事。'],
  [102.7, 106.7, '两千多年前，亚里士多德把友谊分成三种：'],
  [107.0, 111.2, '因为有用，因为开心，和因为欣赏对方这个人。'],
  [111.5, 114.0, '前两种，环境一变就散了；'],
  [114.3, 116.6, '只有第三种，会留下来。'],
  [116.9, 120.9, '心理学家也发现：年纪越大，泛泛之交越少，'],
  [121.2, 124.1, '可真正亲近的人，并没有变少。'],
  [128.3, 132.1, '所以，朋友变少，不一定是你失去了什么，'],
  [135.8, 139.6, '只是成年人的友谊，不会再自然发生了，'],
  [139.9, 144.5, '得有人先伸手：一条消息，一顿饭，一句“最近怎么样”。'],
  [144.8, 147.5, '如果你刚才想到了某个人，'],
  [147.8, 150.3, '现在就给他发条消息吧。'],
];
const BIGLINES = [
  [132.4, 135.5, '也可能是你终于知道，什么值得。'],
  [150.6, 153.4, '评论区说说：现在还能让你半夜打电话的朋友，你有几个？'],
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
const STAR_A = track([[0, .1], [S_TIME - .4, .1], [S_TIME, .3], [S_TIME + 2, .12], [S_ENV, .12], [S_SIFT - .5, .06], [S_SIFT + 1, .16], [S_END, .2], [S_END + 4, .45], [TOTAL, .5]]);
function warmth(a, x = 540, y = 980, r = 900, rgb = '255,170,90') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${.16 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function seriesTag(y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  font(30, 500); ctx.letterSpacing = '6px'; const w = ctx.measureText(SERIES).width; ctx.letterSpacing = '0px';
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
function circ(x, y, r, col, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
const GOLD = '#ffd2a0', WARMC = '#ffb36b', GREYP = '#9aa3b2', COOL = '#7f9cc4', TEALC = '#7fe3d3';
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.5, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function say(s, x, y, a, col = CREAM, size = 26) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 40, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,31,40,.95)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, y + h / 2 - 1); ctx.lineTo(x, y + h / 2 + 14); ctx.lineTo(x + 10, y + h / 2 - 1); ctx.fill(); ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}
function thread(x1, y1, x2, y2, a, col = '255,214,160', sag = 30, w = 3) {               // 两个人之间的一根线
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${col},.9)`; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + sag, x2, y2); ctx.stroke(); ctx.restore();
}
// 一张“板书”章节卡：大号的“一 / 二 / 三”，一道笔画，标题，英文小字
function chapter(t, t0, num, title, en) {
  const t1 = t0 + 2.3; if (t < t0 - .1 || t > t1 + .5) return;
  const e = E.outExpo(prog(t, t0, t0 + .9)), out = sstep(t1 - .2, t1 + .4, t), A = sstep(t0, t0 + .25, t) * (1 - out);
  if (A <= 0) return;
  ctx.save(); ctx.translate(540, 780); const sc = (1.25 - .25 * e) * (1 + .08 * out); ctx.scale(sc, sc); ctx.translate(-540, -780);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 14).toFixed(1)}px)` : 'none';
  text(num, 540, 700, { size: 190, weight: 900, align: 'center', color: CREAM, alpha: A, glow: 'rgba(255,225,190,.3)', blur: 36 });
  ctx.filter = 'none';
  const k = E.io(prog(t, t0 + .35, t0 + 1.0));                                                       // 一笔横画
  if (k > 0) { ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = ORANGE; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(400, 820); ctx.lineTo(400 + 280 * k, 820); ctx.stroke(); ctx.restore(); }
  typeText(title, 540, 900, { ...big, size: 76, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 24, ls: 16 }, prog(t, t0 + .4, t0 + 1.0), A);
  typeText(en, 540, 980, { size: 30, weight: 600, font: LAT, ls: 10, color: DIM, align: 'center', spread: 3 }, prog(t, t0 + .7, t0 + 1.4), A);
  ctx.restore();
}
// 小图标：在 (x, y) 处画一个约 100×100 的线条图标
function icon(kind, x, y, s, col, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const P = () => ctx.beginPath(), S = () => ctx.stroke();
  if (kind === 'bowl') { P(); ctx.arc(0, -4, 42, 0, PI); ctx.closePath(); S(); P(); ctx.moveTo(-14, 38); ctx.lineTo(14, 38); S(); P(); ctx.moveTo(18, -12); ctx.lineTo(46, -48); ctx.moveTo(30, -10); ctx.lineTo(58, -44); S();
    for (const dx of [-16, 0, 16]) { P(); ctx.moveTo(dx, -22); ctx.quadraticCurveTo(dx + 8, -34, dx, -46); S(); } }
  if (kind === 'chat') { P(); ctx.roundRect(-48, -40, 70, 46, 14); S(); P(); ctx.roundRect(-14, -6, 66, 44, 14); S(); for (const dx of [6, 20, 34]) { P(); ctx.arc(dx, 16, 3.5, 0, TAU); ctx.fill(); } }
  if (kind === 'pad') { P(); ctx.roundRect(-50, -26, 100, 52, 26); S(); P(); ctx.moveTo(-30, 0); ctx.lineTo(-14, 0); ctx.moveTo(-22, -8); ctx.lineTo(-22, 8); S(); P(); ctx.arc(18, -6, 5, 0, TAU); ctx.fill(); P(); ctx.arc(30, 6, 5, 0, TAU); ctx.fill(); }
  if (kind === 'laptop') { P(); ctx.roundRect(-38, -40, 76, 50, 6); S(); P(); ctx.moveTo(-52, 22); ctx.lineTo(52, 22); S(); P(); ctx.moveTo(-20, -24); ctx.lineTo(10, -24); ctx.moveTo(-20, -10); ctx.lineTo(22, -10); S(); }
  if (kind === 'case') { P(); ctx.roundRect(-46, -26, 92, 62, 8); S(); P(); ctx.roundRect(-16, -40, 32, 14, 5); S(); P(); ctx.moveTo(-46, 2); ctx.lineTo(46, 2); S(); }
  if (kind === 'house') { P(); ctx.moveTo(-34, 36); ctx.lineTo(-34, -6); ctx.lineTo(0, -38); ctx.lineTo(34, -6); ctx.lineTo(34, 36); ctx.closePath(); S(); P(); ctx.rect(-10, 12, 20, 24); S(); }
  if (kind === 'cross') { P(); ctx.moveTo(-50, 40); ctx.quadraticCurveTo(-10, 0, 50, -40); S(); P(); ctx.moveTo(-50, -40); ctx.quadraticCurveTo(-10, 0, 50, 40); S(); }
  if (kind === 'lamp') { P(); ctx.moveTo(-26, -10); ctx.lineTo(26, -10); ctx.lineTo(16, -44); ctx.lineTo(-16, -44); ctx.closePath(); S(); P(); ctx.moveTo(0, -10); ctx.lineTo(0, 24); S(); P(); ctx.moveTo(-54, 24); ctx.lineTo(54, 24); S();
    P(); ctx.moveTo(-40, 24); ctx.lineTo(-40, 46); ctx.moveTo(40, 24); ctx.lineTo(40, 46); S(); }
  if (kind === 'msg') { P(); ctx.roundRect(-46, -34, 92, 60, 16); S(); P(); ctx.moveTo(-22, 26); ctx.lineTo(-30, 44); ctx.lineTo(-6, 26); S(); P(); ctx.moveTo(-26, -10); ctx.lineTo(26, -10); ctx.moveTo(-26, 6); ctx.lineTo(10, 6); S(); }
  if (kind === 'phone') { P(); ctx.roundRect(-28, -48, 56, 96, 12); S(); P(); ctx.moveTo(-8, 36); ctx.lineTo(8, 36); S(); }
  if (kind === 'column') { P(); ctx.moveTo(-50, -52); ctx.lineTo(50, -52); ctx.moveTo(-42, -40); ctx.lineTo(42, -40); ctx.moveTo(-50, 52); ctx.lineTo(50, 52); ctx.moveTo(-42, 40); ctx.lineTo(42, 40); S();
    for (const dx of [-26, -9, 9, 26]) { P(); ctx.moveTo(dx, -40); ctx.lineTo(dx, 40); S(); } }
  ctx.restore();
}

// ======================================================================== 开场 ①：小时候 · 一句“一起玩吧”（0–5.6）
function sceneKids(t) {
  if (t > 6.2) return;
  const A = 1 - sstep(5.4, 6.0, t);
  ctx.save(); ctx.globalAlpha = A;
  warmth(.9, 540, 1000, 700);
  ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(140, 1036); ctx.lineTo(940, 1036); ctx.stroke();
  const run = E.io(prog(t, 3.2, 4.4)), x1 = 360, x2 = lerp(840, 610, run);
  person(x1, 1010, .95, 1, WARMC);
  person(x2, 1010 - 18 * Math.abs(Math.sin(PI * 3 * run)) * (run < 1 ? 1 : 0), .95, 1, TEALC);
  say('一起玩吧？', x1 + 10, 790, sstep(2.2, 2.5, t) * (1 - sstep(4.6, 4.9, t)), WARMC, 34);
  say('好呀！', x2, 790, sstep(3.9, 4.2, t), TEALC, 34);
  const hold = sstep(4.4, 4.9, t);
  thread(x1 + 38, 990, x2 - 38, 990, hold, '255,214,160', 20, 4);
  for (let i = 0; i < 12; i++) { const r = mulberry(100 + i), p = ((t - 4.4) * (.3 + .3 * r()) + r()) % 1; glow(400 + r() * 260, 960 - p * 240, 2 + 2 * r(), O_RGB, hold * (1 - p) * .9, 3); }
  typeText('小时候', 540, 520, { ...big, size: 64, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.4)`, glowBlur: 20 }, prog(t, .3, 1.0), 1);
  typeText('交朋友，只要一句话', 540, 610, { size: 36, weight: 500, font: SERIF, color: CREAM, align: 'center', spread: 4 }, prog(t, 2.1, 2.9), 1);
  ctx.restore();
}

// ======================================================================== 开场 ②：长大以后 · 通讯录里几百个人（5.6–13.4）
const CONTACTS = 42, NIGHT = [1, 3, 4, 6, 8];                                                       // 半夜能打电话的那几个（停下来时在屏幕上）
function scenePhone(t) {
  if (t < 5.3 || t > 13.6) return;
  const A = sstep(5.4, 6.0, t) * (1 - sstep(12.8, 13.4, t));
  if (A <= 0) return;
  typeText('长大以后', 540, 470, { ...big, size: 60, weight: 900 }, prog(t, 5.7, 6.4), A);
  const px = 330, py = 560, pw = 420, ph = 680;
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(16,17,23,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.55)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 46); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(236,230,218,.25)'; ctx.beginPath(); ctx.roundRect(px + pw / 2 - 50, py + 18, 100, 12, 6); ctx.fill();
  text('通讯录', px + 40, py + 70, { font: SANS, size: 30, weight: 700, color: CREAM });
  text('412 位联系人', px + pw - 40, py + 72, { font: SANS, size: 22, color: DIM, align: 'right' });
  ctx.beginPath(); ctx.rect(px + 16, py + 100, pw - 32, ph - 130); ctx.clip();
  const sc = 1 - E.out(prog(t, 6.2, 9.0)), scroll = sc > 0 ? (t - 6.2) * 900 * sc : 0, stop = E.io(prog(t, 8.6, 9.2));
  const off = (lerp(scroll % (CONTACTS * 62), 0, stop));
  const lit = sstep(9.0, 9.8, t);
  for (let i = 0; i < CONTACTS; i++) {
    const y = py + 140 + i * 62 - off; if (y < py + 80 || y > py + ph + 40) continue;
    const r = mulberry(700 + i), isNight = NIGHT.includes(i) ? lit : 0, dim = isNight > 0 ? 1 : 1 - .7 * lit;
    circ(px + 64, y, 20, isNight > 0 ? mixc('#6f7786', GOLD, isNight) : '#5b6270', dim);
    ctx.fillStyle = isNight > 0 ? `rgba(255,210,160,${.25 + .6 * isNight})` : `rgba(236,230,218,${.22 * dim})`;
    ctx.beginPath(); ctx.roundRect(px + 100, y - 10, 120 + 140 * r(), 20, 10); ctx.fill();
    if (isNight > 0) glow(px + 64, y, 6, '255,214,160', isNight, 6);
  }
  ctx.restore();
  const cnt = sstep(9.2, 9.8, t);
  for (let i = 0; i < 5; i++) glow(830, 640 + i * 70, 10, '255,214,160', A * cnt * sstep(9.4 + i * .25, 9.7 + i * .25, t), 6);
  text('能在半夜', 830, 1020, { font: SANS, size: 28, weight: 700, align: 'center', color: GOLD, alpha: A * sstep(10.6, 11.0, t) });
  text('打电话的', 830, 1060, { font: SANS, size: 28, weight: 700, align: 'center', color: GOLD, alpha: A * sstep(10.6, 11.0, t) });
  text('412', 200, 760, { font: LAT, size: 80, weight: 600, align: 'center', color: DIM, alpha: A * sstep(6.4, 6.9, t) * (1 - .6 * lit) });
  text('联系人', 200, 830, { font: SANS, size: 26, align: 'center', color: DIM, alpha: A * sstep(6.4, 6.9, t) * (1 - .6 * lit) });
}

// ======================================================================== 开场 ③：25 岁到顶（13.1–24）
const CH = { x0: 170, x1: 930, y0: 1160, y1: 740, a0: 10, a1: 80 };
const CURVE = [[12, .30], [15, .45], [18, .64], [21, .84], [25, 1.0], [29, .9], [33, .79], [37, .7], [41, .64], [45, .6], [50, .58], [55, .57], [60, .55], [70, .5], [80, .46]];
function cx_(age) { return CH.x0 + (age - CH.a0) / (CH.a1 - CH.a0) * (CH.x1 - CH.x0); }
function cy_(v) { return CH.y0 - v * (CH.y0 - CH.y1); }
function curvePts(maxAge) {
  const pts = [];
  for (let a = 12; a <= maxAge + 1e-6; a += .5) {
    let i = 0; while (i < CURVE.length - 2 && CURVE[i + 1][0] < a) i++;
    const [a0, v0] = CURVE[i], [a1, v1] = CURVE[i + 1], k = sstep(a0, a1, a);
    pts.push([cx_(a), cy_(lerp(v0, v1, k))]);
  }
  return pts;
}
function sceneChart(t) {
  if (t < 12.9 || t > 24.2) return;
  const A = sstep(13.0, 13.6, t) * (1 - sstep(23.4, 24.0, t));
  if (A <= 0) return;
  typeText('320万人的通话记录', 540, 580, { ...big, size: 56, weight: 900 }, prog(t, 13.3, 14.1), A);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(CH.x0, CH.y1 - 36); ctx.lineTo(CH.x0, CH.y0); ctx.lineTo(CH.x1 + 20, CH.y0); ctx.stroke(); ctx.restore();
  for (const a of [20, 40, 60, 80]) text(String(a), cx_(a), CH.y0 + 34, { font: LAT, size: 30, weight: 600, align: 'center', color: DIM, alpha: A });
  text('年龄', CH.x1 + 10, CH.y0 + 74, { font: SANS, size: 24, align: 'right', color: DIM, alpha: A });
  text('经常联系的人数', CH.x0 - 6, CH.y1 - 66, { font: SANS, size: 24, color: DIM, alpha: A });
  text('（示意）', CH.x1, CH.y1 - 66, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: A });
  const k1 = E.io(prog(t, 17.2, 19.6)), k2 = E.io(prog(t, 21.6, 23.4));
  const maxAge = k2 > 0 ? lerp(25, 80, k2) : lerp(12, 25, k1);
  if (k1 > 0) {
    const pts = curvePts(maxAge);
    ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = ORANGE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 14;
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
    const [hx, hy] = pts[pts.length - 1]; glow(hx, hy, 9, '255,214,160', A, 6);
  }
  const pk = sstep(19.5, 19.9, t), s = pop(t, 19.5);
  if (pk > 0) {
    const x = cx_(25), y = cy_(1);
    ctx.save(); ctx.globalAlpha = A * pk * .5; ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, CH.y0); ctx.stroke(); ctx.restore();
    glow(x, y, 14, '255,214,160', A * pk, 7);
    ctx.save(); ctx.translate(x + 30, y - 26); ctx.scale(s || 1, s || 1);
    text('25岁', 0, 0, { size: 60, weight: 900, align: 'left', color: GOLD, alpha: A * pk, glow: `rgba(${O_RGB},.5)`, blur: 20 }); ctx.restore();
  }
  text('之后，一路往下', cx_(55), cy_(.78), { font: SANS, size: 30, weight: 700, align: 'center', color: CREAM, alpha: A * sstep(22.0, 22.5, t) });
}
function pop(t, t0) { const k = prog(t, t0, t0 + .45); return k <= 0 ? 0 : 1 + .18 * Math.sin(PI * Math.min(1, k * 1.25)) * (1 - k); }

// ======================================================================== 开场 ④：题目 + 三个原因的提纲（23.6–32.2）
function sceneTitle(t) {
  if (t < 23.5 || t > S_TIME + .3) return;
  const e = E.outExpo(prog(t, 23.8, 24.8)), A = sstep(23.7, 24.0, t) * (1 - sstep(S_TIME - .7, S_TIME - .1, t));
  if (A <= 0) return;
  warmth(.6 * A, 540, 760, 700);
  const up = E.io(prog(t, 26.4, 27.2));
  ctx.save(); ctx.translate(540, lerp(700, 520, up)); const sc = (1.3 - .3 * e) * lerp(1, .78, up); ctx.scale(sc, sc);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 16).toFixed(1)}px)` : 'none';
  text('为什么越长大，', 0, -70, { size: 84, weight: 900, align: 'center', color: CREAM, alpha: A, glow: 'rgba(255,225,190,.25)', blur: 30 });
  text('朋友越少？', 0, 50, { size: 120, weight: 900, align: 'center', color: GOLD, alpha: A, glow: `rgba(${O_RGB},.5)`, blur: 40 });
  ctx.restore();
  seriesTag(470, A * sstep(24.3, 24.9, t) * (1 - up));
  const q = A * sstep(26.7, 27.1, t) * (1 - sstep(28.2, 28.5, t));
  person(540, 960, .9, q, COOL);
  text('是你变冷漠了吗？', 540, 1080, { font: SERIF, size: 44, weight: 900, align: 'center', color: COOL, alpha: q });
  const o = A * sstep(28.4, 28.8, t);
  text('其实，不全是', 540, 760, { font: SERIF, size: 44, weight: 700, align: 'center', color: CREAM, alpha: o });
  [['一', '时间'], ['二', '环境'], ['三', '筛选']].forEach(([n, s], i) => {
    const k = A * sstep(28.9 + i * .45, 29.3 + i * .45, t), y = 870 + i * 96;
    ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = `rgba(${O_RGB},.6)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(400, y + 34); ctx.lineTo(680, y + 34); ctx.stroke(); ctx.restore();
    text(n, 430, y, { font: SERIF, size: 54, weight: 900, align: 'center', color: ORANGE, alpha: k });
    text(s, 590, y, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: k, ls: 14 });
  });
}

// ======================================================================== 一 · 时间（32.0–70.4）
const HB = { x0: 170, x1: 910, y: 900 };
function hoursAt(t) { return 50 * E.io(prog(t, 37.8, 41.6)) + 150 * E.io(prog(t, 42.6, 45.4)); }
function sceneHours(t) {
  chapter(t, S_TIME, '一', '时间', 'TIME');
  if (t < 34.4 || t > 53.4) return;
  const A = sstep(34.6, 35.2, t) * (1 - sstep(52.8, 53.3, t));
  if (A <= 0) return;
  const h = hoursAt(t), hx = HB.x0 + (HB.x1 - HB.x0) * h / 200, mx = HB.x0 + (HB.x1 - HB.x0) * 50 / 200;
  ctx.save(); ctx.globalAlpha = A;
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.roundRect(HB.x0, HB.y - 8, HB.x1 - HB.x0, 16, 8); ctx.fill();
  if (h > 0) { const g = ctx.createLinearGradient(HB.x0, 0, HB.x1, 0); g.addColorStop(0, 'rgba(242,161,74,.85)'); g.addColorStop(1, 'rgba(255,214,160,1)');
    ctx.fillStyle = g; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16; ctx.beginPath(); ctx.roundRect(HB.x0, HB.y - 8, hx - HB.x0, 16, 8); ctx.fill(); }
  ctx.restore();
  for (const [x, lab, v, on] of [[HB.x0, '陌生人', '0', 1], [mx, '普通朋友', '50', h >= 49.5], [HB.x1, '好朋友', '200+', h >= 199]]) {
    circ(x, HB.y, 13, on ? GOLD : '#4a505c', A); if (on) glow(x, HB.y, 6, '255,214,160', A, 5);
    text(lab, x, HB.y + 56, { font: SANS, size: 28, weight: 700, align: 'center', color: on ? GOLD : DIM, alpha: A });
    text(v + ' 小时', x, HB.y - 46, { font: SANS, size: 24, align: 'center', color: on ? CREAM : '#6f7786', alpha: A });
  }
  const k = h / 200, xa = lerp(250, 495, k), xb = lerp(830, 585, k);                                    // 两个人随着时间越走越近
  person(xa, 740, .62, A, WARMC); person(xb, 740, .62, A, TEALC);
  thread(xa + 24, 720, xb - 24, 720, A * sstep(195, 200, h), '255,214,160', 10);
  ctx.save(); ctx.globalAlpha = A * .45 * (1 - sstep(195, 200, h)); ctx.strokeStyle = CREAM; ctx.setLineDash([6, 10]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xa + 30, 720); ctx.lineTo(xb - 30, 720); ctx.stroke(); ctx.restore();
  const num = Math.round(h), s = pop(t, 45.4);
  ctx.save(); ctx.translate(540, 520); if (s) ctx.scale(s, s);
  text(h >= 199 ? '200+' : String(num), 0, 0, { font: LAT, size: 130, weight: 600, align: 'center', color: h >= 199 ? GOLD : CREAM, alpha: A * sstep(35.0, 35.5, t), glow: h >= 199 ? `rgba(${O_RGB},.5)` : '', blur: 26 });
  ctx.restore();
  text('小时', 540, 600, { font: SANS, size: 30, align: 'center', color: DIM, alpha: A * sstep(35.0, 35.5, t) });
  // 闲着的时间才算：吃饭、聊天、瞎玩 ✓；开会、加班 ×
  const I = A * sstep(46.0, 46.4, t);
  [['bowl', 220, 46.4], ['chat', 360, 47.4], ['pad', 500, 48.4]].forEach(([k2, x, t0]) => icon(k2, x, 1100, .8, GOLD, I * sstep(t0, t0 + .4, t)));
  text('闲着的时间 ✓', 360, 1190, { font: SANS, size: 28, weight: 700, align: 'center', color: GOLD, alpha: I * sstep(48.8, 49.2, t) });
  const J = A * sstep(50.3, 50.7, t);
  icon('laptop', 700, 1100, .8, '#6f7786', J); icon('case', 840, 1100, .8, '#6f7786', J);
  if (J > 0) { const kx = E.out(prog(t, 50.9, 51.4)); ctx.save(); ctx.globalAlpha = J; ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(640, 1050); ctx.lineTo(lerp(640, 900, kx), lerp(1050, 1150, kx)); ctx.stroke(); ctx.restore(); }
  text('开会、加班：几乎不算', 770, 1190, { font: SANS, size: 28, weight: 700, align: 'center', color: '#c98a8a', alpha: J * sstep(51.0, 51.4, t) });
}

// 上学的时候：一栋亮着灯的宿舍楼；工作以后：冷色的写字楼、一张空长椅
function sceneSchool(t) {
  if (t < 52.8 || t > S_ENV + .2) return;
  const A = sstep(53.0, 53.6, t) * (1 - sstep(S_ENV - .7, S_ENV - .1, t));
  if (A <= 0) return;
  const cool = sstep(61.4, 62.4, t), bench = sstep(64.8, 65.6, t);
  const B = A * (1 - bench);
  if (B > 0) {
    const bx = 290, by = 640, bw = 500, bh = 500;
    ctx.save(); ctx.globalAlpha = B; ctx.fillStyle = mixc('#1a1c26', '#131722', cool); ctx.strokeStyle = mixc('#c8a46a', '#56607a', cool); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 20, by); ctx.lineTo(bx + bw / 2, by - 90); ctx.lineTo(bx + bw + 20, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    text(cool > .5 ? '写字楼' : '宿舍楼', 540, by - 30, { font: SANS, size: 26, weight: 700, align: 'center', color: cool > .5 ? COOL : GOLD, alpha: B });
    for (let f = 0; f < 4; f++) for (let c = 0; c < 5; c++) {
      const x = bx + 40 + c * 92, y = by + 34 + f * 114, r = mulberry(800 + f * 5 + c), on = sstep(53.4 + r() * 1.5, 53.8 + r() * 1.5, t);
      const warmOn = on * (1 - cool), coolOn = cool * (r() < .55 ? 1 : .15);
      ctx.save(); ctx.globalAlpha = B; ctx.fillStyle = `rgba(255,190,120,${.15 + .65 * warmOn})`; ctx.fillRect(x, y, 64, 78);
      if (cool > 0) { ctx.fillStyle = `rgba(150,180,230,${.55 * coolOn * cool})`; ctx.fillRect(x, y, 64, 78); }
      ctx.restore();
    }
    const wx = bx + 40 + 2 * 92, wy = by + 34 + 2 * 114;                                                   // 中间那扇窗里：两个人
    person(wx + 20, wy + 70, .28, B * (1 - cool), WARMC); person(wx + 46, wy + 70, .28, B * (1 - cool), TEALC);
    const yr = Math.min(4, 1 + Math.floor(prog(t, 57.4, 60.8) * 4));
    text(`第 ${yr} 年`, 540, by + bh + 50, { font: SANS, size: 30, weight: 700, align: 'center', color: GOLD, alpha: B * sstep(57.3, 57.7, t) * (1 - cool) });
    const free = E.io(prog(t, 53.6, 55.0)), hc = cool > .5 ? COOL : GOLD, hg = cool > .5 ? '' : `rgba(${O_RGB},.4)`;     // 数字和“小时”分开画，换字时不拖影
    text(cool > .5 ? '200' : String(Math.round(200 * free)), 470, 450, { font: LAT, size: 76, weight: 600, align: 'right', color: hc, alpha: B, glow: hg, blur: 18 });
    text(cool > .5 ? '小时？' : '小时', 486, 454, { font: SERIF, size: 50, weight: 900, align: 'left', color: hc, alpha: B });
    text('· 白送', 598, 454, { font: SERIF, size: 50, weight: 900, align: 'left', color: GOLD, alpha: B * sstep(55.1, 55.5, t) * (1 - cool), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  }
  if (bench > 0) {                                                                                         // 路灯下一张空长椅
    const C = A * bench;
    ctx.save(); ctx.globalAlpha = C; ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(700, 640, 10, 600, 980, 520); g.addColorStop(0, 'rgba(255,214,160,.35)'); g.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = g; ctx.fillRect(0, 400, W, 900);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(760, 1120); ctx.lineTo(760, 640); ctx.quadraticCurveTo(760, 600, 720, 600); ctx.lineTo(690, 600); ctx.stroke();
    glow(690, 618, 10, '255,214,160', 1, 6);
    ctx.beginPath(); ctx.moveTo(360, 980); ctx.lineTo(640, 980); ctx.moveTo(360, 1010); ctx.lineTo(640, 1010); ctx.moveTo(370, 930); ctx.lineTo(630, 930); ctx.moveTo(370, 900); ctx.lineTo(630, 900); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(390, 1010); ctx.lineTo(380, 1100); ctx.moveTo(610, 1010); ctx.lineTo(620, 1100); ctx.stroke();
    ctx.restore();
    for (let i = 0; i < 6; i++) { const r = mulberry(900 + i), p = ((t - 64.8) * (.08 + .06 * r()) + r()) % 1; const x = 300 + r() * 500 + 40 * Math.sin(t + i), y = 560 + p * 600;
      ctx.save(); ctx.globalAlpha = C * (1 - p) * .7; ctx.fillStyle = WARMC; ctx.translate(x, y); ctx.rotate(t * 1.5 + i); ctx.beginPath(); ctx.ellipse(0, 0, 9, 4, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    typeText('陪一个人，什么都不干', 540, 520, { ...big, size: 54, weight: 900, color: CREAM }, prog(t, 65.0, 65.8), C);
  }
}

// ======================================================================== 二 · 环境（70.4–99.2）：三盏灯
const LAMPS = [[260, '离得近', 'house'], [540, '常常不经意地碰面', 'cross'], [820, '能说真心话的地方', 'lamp']];
function sceneLanterns(t) {
  chapter(t, S_ENV, '二', '环境', 'PLACE');
  if (t < 72.6 || t > S_SIFT + .2) return;
  const A = sstep(72.8, 73.4, t) * (1 - sstep(S_SIFT - .8, S_SIFT - .1, t));
  if (A <= 0) return;
  typeText('亲密的友谊，要三个条件', 540, 590, { ...big, size: 54, weight: 900 }, prog(t, 73.0, 73.8), A * (1 - sstep(81.5, 81.9, t)));
  const school = A * sstep(81.7, 82.2, t) * (1 - sstep(84.2, 84.8, t));
  if (school > 0) {
    ctx.save(); ctx.globalAlpha = school; ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(420, 600); ctx.lineTo(540, 520); ctx.lineTo(660, 600); ctx.lineTo(660, 680); ctx.lineTo(420, 680); ctx.closePath(); ctx.stroke(); ctx.restore();
    text('学校', 540, 470, { size: 56, weight: 900, align: 'center', color: GOLD, alpha: school, glow: `rgba(${O_RGB},.5)`, blur: 18 });
    LAMPS.forEach(([x]) => drawOn(() => { ctx.moveTo(540, 690); ctx.lineTo(x, 760); }, 320, prog(t, 82.0, 82.6), GOLD, 2.5, school));
  }
  const gone = [87.4, 89.8, 92.8];
  LAMPS.forEach(([x, lab, kind], i) => {
    const on = A * sstep(74.6 + [0, 1.2, 3.0][i], 75.0 + [0, 1.2, 3.0][i], t), off = sstep(gone[i], gone[i] + .8, t), y = 840;
    if (on <= 0) return;
    const lit = 1 - off, col = mixc('#4a505c', GOLD, lit);
    if (lit > 0) warmth(on * lit * .5, x, y, 200);
    ctx.save(); ctx.globalAlpha = on; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = `rgba(30,24,18,${.6 * lit + .3})`;
    if (lit > .05) { ctx.shadowColor = `rgba(${O_RGB},${.8 * lit})`; ctx.shadowBlur = 24 * lit; }
    ctx.beginPath(); ctx.arc(x, y, 104, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    if (i === 0) {                                                                                        // 两栋挨着的房子 → 去了不同的城市
      const d = E.io(prog(t, gone[0], gone[0] + 1.6)) * 150;
      icon('house', x - 30 - d, y + 6, .62, col, on); icon('house', x + 30 + d, y + 6, .62, col, on);
      if (d > 10) { ctx.save(); ctx.globalAlpha = on * .5; ctx.strokeStyle = CREAM; ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 10 - d, y + 40); ctx.lineTo(x + 10 + d, y + 40); ctx.stroke(); ctx.restore(); }
    }
    if (i === 1) {
      icon('cross', x, y, .9, col, on * (1 - sstep(gone[1], gone[1] + .5, t)));
      const cal = on * sstep(gone[1], gone[1] + .5, t);                                                     // 一张日历：周六见面 → 改期
      if (cal > 0) { ctx.save(); ctx.globalAlpha = cal; ctx.fillStyle = 'rgba(236,230,218,.92)'; ctx.beginPath(); ctx.roundRect(x - 62, y - 56, 124, 112, 12); ctx.fill();
        ctx.fillStyle = '#c96a5a'; ctx.beginPath(); ctx.roundRect(x - 62, y - 56, 124, 30, [12, 12, 0, 0]); ctx.fill(); ctx.restore();
        text('周六 见面', x, y + 2, { font: SANS, size: 24, weight: 700, align: 'center', color: '#2a2c33', alpha: cal });
        const st = sstep(gone[1] + .9, gone[1] + 1.2, t);
        if (st > 0) { ctx.save(); ctx.globalAlpha = cal * st; ctx.strokeStyle = '#c94a4a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 50, y + 2); ctx.lineTo(x + 50, y + 2); ctx.stroke(); ctx.restore();
          ctx.save(); ctx.translate(x + 20, y + 36); ctx.rotate(-.18); text('改期', 0, 0, { font: SANS, size: 28, weight: 700, align: 'center', color: '#c94a4a', alpha: cal * st }); ctx.restore(); } }
    }
    if (i === 2) {
      icon('lamp', x, y + 10, .8, col, on * (1 - sstep(gone[2], gone[2] + .5, t)));
      const m = on * sstep(gone[2], gone[2] + .5, t);                                                       // 两个人坐着，只有“……”
      if (m > 0) { person(x - 40, y + 50, .38, m, '#6f7786'); person(x + 40, y + 50, .38, m, '#6f7786');
        text('……', x, y - 40, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#8a93a3', alpha: m * (.6 + .4 * Math.sin(t * 2.4)) }); }
    }
    text(lab, x, y + 150, { font: SANS, size: 28, weight: 700, align: 'center', color: lit > .5 ? GOLD : '#6f7786', alpha: on });
    const ck = A * sstep(82.4 + i * .2, 82.7 + i * .2, t) * (1 - off);
    text('✓', x + 78, y - 78, { font: SANS, size: 40, weight: 700, align: 'center', color: GOLD, alpha: ck });
  });
  text('不同的城市', 260, 1060, { font: SANS, size: 24, align: 'center', color: DIM, alpha: A * sstep(88.2, 88.6, t) });
  typeText('长大以后，一个一个熄灭', 540, 470, { ...big, size: 54, weight: 900, color: CREAM }, prog(t, 84.4, 85.2), A * sstep(84.3, 84.6, t));
}

// ======================================================================== 三 · 筛选（99.2–124）：亚里士多德的三种友谊
const KINDS = [[250, '因为有用', '#8fa3c0'], [540, '因为开心', TEALC], [830, '欣赏这个人', GOLD]];
function sceneAristotle(t) {
  chapter(t, S_SIFT, '三', '筛选', 'SIFTING');
  if (t < 101.4 || t > 117.4) return;
  const A = sstep(101.6, 102.2, t) * (1 - sstep(116.6, 117.2, t));
  if (A <= 0) return;
  warmth(A * .5, 540, 900, 800);
  const col = A * sstep(102.7, 103.2, t);
  icon('column', 540, 560, 1.1, CREAM, col);
  typeText('亚里士多德：友谊有三种', 540, 700, { ...big, size: 50, weight: 900 }, prog(t, 103.0, 103.8), col);
  const wind = prog(t, 111.4, 113.0);
  if (wind > 0 && wind < 1) for (let i = 0; i < 40; i++) { const r = mulberry(1200 + i), x = -100 + (wind * 1.6 - r() * .6) * 1300, y = 820 + r() * 260;
    ctx.save(); ctx.globalAlpha = A * .5 * Math.sin(PI * wind); ctx.strokeStyle = CREAM; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 60 - 60 * r(), y); ctx.stroke(); ctx.restore(); }
  KINDS.forEach(([x, lab, c], i) => {
    const on = A * sstep(107.0 + i * 1.3, 107.4 + i * 1.3, t), y = 960;
    if (on <= 0) return;
    const snap = i < 2 ? E.io(prog(t, 111.8 + i * .4, 113.0 + i * .4)) : 0, keep = i === 2 ? sstep(114.3, 114.9, t) : 0;
    const fade = 1 - .7 * snap, sc = 1 + .12 * keep;
    ctx.save(); ctx.globalAlpha = on * fade; ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(20,21,28,.8)';
    if (keep > 0) { ctx.shadowColor = `rgba(${O_RGB},${.9 * keep})`; ctx.shadowBlur = 30 * keep; }
    ctx.beginPath(); ctx.arc(0, 0, 112, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    const dx = 46 + 70 * snap;
    person(x - dx * sc, y + 40, .4, on * fade, c); person(x + dx * sc, y + 40, .4, on * fade, c);
    if (snap < .5) thread(x - 30 * sc, y + 4, x + 30 * sc, y + 4, on * (1 - 2 * snap), i === 2 ? '255,214,160' : i === 1 ? '127,227,211' : '160,180,210', 8);
    else { ctx.save(); ctx.globalAlpha = on * (1 - snap) * .8; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 40, y + 4); ctx.lineTo(x - 18, y + 20 + 30 * snap); ctx.moveTo(x + 40, y + 4); ctx.lineTo(x + 18, y + 20 + 30 * snap); ctx.stroke(); ctx.restore(); }
    if (i === 2) thread(x - 30 * sc, y + 4, x + 30 * sc, y + 4, on * (.6 + .4 * keep), '255,214,160', 8, 3 + 2 * keep);
    text(lab, x, y + 160, { font: SANS, size: 30, weight: 700, align: 'center', color: snap > .5 ? '#6f7786' : c, alpha: on });
  });
  text('散了', 395, 1190, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#8a93a3', alpha: A * sstep(112.8, 113.2, t) });
  text('留下来', 830, 1190, { font: SERIF, size: 40, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(114.5, 114.9, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
}

// ======================================================================== 筛选 → 答案（116.6–144.6）：你身边的那张网
const NODES = (() => {
  const r = mulberry(4242), arr = [];
  for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * TAU / 5 + .3; arr.push({ x: 540 + 140 * Math.cos(a), y: 880 + 120 * Math.sin(a), close: 1, gone: 1e9 }); }
  for (let i = 0; i < 30; i++) { const a = r() * TAU, d = 250 + r() * 110; arr.push({ x: 540 + d * Math.cos(a), y: 880 + d * .78 * Math.sin(a), close: 0, gone: 117.6 + r() * 3.6 }); }
  arr.push({ x: 540 + 330, y: 880 - 150, close: 0, old: 1, gone: 1e9 });                                    // 一个很久没联系的老朋友
  return arr;
})();
function sceneNetwork(t) {
  if (t < 116.6 || t > 145.0) return;
  const A = sstep(116.8, 117.4, t) * (1 - sstep(144.2, 144.8, t));
  if (A <= 0) return;
  const big2 = sstep(132.3, 132.9, t) * (1 - sstep(135.3, 135.8, t)), shift = 70 * big2;
  const age = Math.round(lerp(20, 60, E.io(prog(t, 117.4, 121.2))));
  text(`${age} 岁`, 540, 480, { font: LAT, size: 84, weight: 600, align: 'center', color: CREAM, alpha: A * sstep(117.0, 117.4, t) * (1 - sstep(124.4, 125.0, t)) });
  const glowK = sstep(121.4, 122.2, t), reach = E.io(prog(t, 139.9, 141.1));
  NODES.forEach((n, i) => {
    const y = n.y + shift;
    if (n.old) {                                                                                          // 那个老朋友：一开始是暗的，有人先伸手，它才亮
      const vis = A * sstep(128.4, 129.0, t);
      if (vis <= 0) return;
      ctx.save(); ctx.globalAlpha = vis; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.setLineDash([5, 9]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, 880 + shift); ctx.lineTo(n.x, y); ctx.stroke(); ctx.restore();
      if (reach > 0) thread(540, 880 + shift, lerp(540, n.x, reach), lerp(880 + shift, y, reach), vis, '255,214,160', 0, 4);
      circ(n.x, y, 14, mixc('#4a505c', GOLD, reach >= 1 ? 1 : 0), vis); if (reach >= 1) glow(n.x, y, 10, '255,214,160', vis, 7);
      return;
    }
    const fade = n.close ? 1 : 1 - sstep(n.gone, n.gone + .6, t);
    if (fade <= 0) return;
    if (n.close) thread(540, 880 + shift, n.x, y, A * (.35 + .65 * glowK), '255,214,160', 0, 2 + glowK);
    else { ctx.save(); ctx.globalAlpha = A * fade * .25; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(540, 880 + shift); ctx.lineTo(n.x, y); ctx.stroke(); ctx.restore(); }
    if (n.close) glow(n.x, y, 11 + 3 * glowK, '255,214,160', A, 5 + 2 * glowK); else circ(n.x, y, 7, '#7c8494', A * fade);
  });
  person(540, 920 + shift, .5, A, CREAM);
  text('你', 540, 975 + shift, { font: SERIF, size: 28, weight: 900, align: 'center', color: CREAM, alpha: A });
  text('泛泛之交：越来越少', 270, 1180, { font: SANS, size: 28, weight: 700, align: 'center', color: '#8a93a3', alpha: A * sstep(118.4, 118.8, t) * (1 - sstep(127.8, 128.3, t)) });
  text('亲近的人：一个没少', 810, 1180, { font: SANS, size: 28, weight: 700, align: 'center', color: GOLD, alpha: A * sstep(121.4, 121.8, t) * (1 - sstep(127.8, 128.3, t)) });
  // 大字：什么值得
  typeText('也可能是你终于知道，', 540, 470, { ...big, size: 48, weight: 700 }, prog(t, 132.4, 133.1), big2);
  typeText('什么值得。', 540, 590, { ...big, size: 110, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.55)`, glowBlur: 40 }, prog(t, 133.2, 134.0), big2);
  text('不一定是失去', 540, 500, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(128.6, 129.1, t) * (1 - sstep(132.0, 132.4, t)) });
  text('得有人先伸手', 540, 500, { font: SERIF, size: 52, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(139.9, 140.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  [['msg', 300, 141.0, '一条消息'], ['bowl', 540, 142.0, '一顿饭'], ['phone', 780, 143.0, '最近怎么样']].forEach(([k, x, t0, lab]) => {
    const a = A * sstep(t0, t0 + .4, t); icon(k, x, 1150, .62, GOLD, a);
    text(lab, x, 1225, { font: SANS, size: 26, weight: 700, align: 'center', color: GOLD, alpha: a });
  });
  text('成年人的友谊，不会再自然发生', 540, 500, { font: SERIF, size: 46, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(136.0, 136.5, t) * (1 - sstep(139.5, 139.9, t)) });
}

// ======================================================================== 答案（144.6–153.6）：现在就发一条消息
function sceneMessage(t) {
  if (t < 144.4) return;
  const A = sstep(144.6, 145.2, t);
  const px = 330, py = 500, pw = 420, ph = 640;
  warmth(A * (.6 + .6 * sstep(148.4, 149.2, t)), 540, 820, 700);
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(16,17,23,.97)'; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 46); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(236,230,218,.25)'; ctx.beginPath(); ctx.roundRect(px + pw / 2 - 50, py + 18, 100, 12, 6); ctx.fill(); ctx.restore();
  circ(px + 60, py + 74, 22, '#6f7786', A);
  text('好久没联系的 TA', px + 96, py + 74, { font: SANS, size: 26, weight: 700, color: CREAM, alpha: A });
  ctx.save(); ctx.globalAlpha = A * .5; ctx.strokeStyle = 'rgba(236,230,218,.3)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px + 20, py + 110); ctx.lineTo(px + pw - 20, py + 110); ctx.stroke(); ctx.restore();
  text('去年 · 3 月', 540, py + 150, { font: SANS, size: 20, align: 'center', color: '#6f7786', alpha: A });
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(236,230,218,.1)'; ctx.beginPath(); ctx.roundRect(px + 30, py + 180, 230, 56, 20); ctx.fill(); ctx.restore();
  text('下次一起吃饭啊', px + 145, py + 209, { font: SANS, size: 24, align: 'center', color: CREAM, alpha: A });
  const msg = '最近怎么样？', typed = Math.floor(clamp(prog(t, 145.6, 147.4)) * msg.length), sent = sstep(148.4, 148.8, t);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(px + 24, py + ph - 96, pw - 120, 60, 30); ctx.stroke(); ctx.restore();
  if (sent < 1) text(msg.slice(0, typed) + ((t * 2) % 1 < .5 && t < 148.4 ? '|' : ''), px + 50, py + ph - 66, { font: SANS, size: 28, color: CREAM, alpha: A * (1 - sent) });
  const press = 1 - .12 * Math.max(0, 1 - Math.abs(t - 148.4) / .15);
  ctx.save(); ctx.globalAlpha = A; ctx.translate(px + pw - 56, py + ph - 66); ctx.scale(press, press); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a1208'; ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(14, 0); ctx.lineTo(-10, 12); ctx.lineTo(-5, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  if (sent > 0) {                                                                                           // 发出去了
    const fly = E.out(prog(t, 148.4, 149.0)), y = lerp(py + ph - 66, py + 300, fly);
    ctx.save(); ctx.globalAlpha = A * sent; ctx.fillStyle = 'rgba(242,161,74,.9)'; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.roundRect(px + pw - 250, y - 28, 220, 56, 20); ctx.fill(); ctx.restore();
    text(msg, px + pw - 140, y + 1, { font: SANS, size: 26, weight: 700, align: 'center', color: '#1a1208', alpha: A * sent });
    text('已送达', px + pw - 40, py + 350, { font: SANS, size: 20, align: 'right', color: DIM, alpha: A * sstep(149.0, 149.4, t) });
    for (let i = 0; i < 14; i++) { const r = mulberry(1500 + i), p = ((t - 148.6) * (.25 + .25 * r()) + r() * .2) % 1; glow(px + pw - 140 + (r() - .5) * 240, py + 300 - p * 200, 2 + 2 * r(), O_RGB, A * sent * (1 - p) * .9, 3); }
  }
  // 最后：评论区的问题
  const Q = sstep(150.5, 151.0, t);
  typeText('评论区说说：', 540, 1240, { size: 34, weight: 700, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 150.6, 151.1), Q);
  typeText('现在还能让你半夜打电话的朋友，你有几个？', 540, 1310, { size: 40, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, 151.0, 152.0), Q);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneKids(t); scenePhone(t); sceneChart(t); sceneTitle(t); sceneHours(t); sceneSchool(t); sceneLanterns(t); sceneAristotle(t); sceneNetwork(t); sceneMessage(t);
}
function SAMPLES(T) {
  const fast = [[3.0, 4.6], [6.2, 9.4], [23.6, 25.0], [26.2, 27.4], [S_TIME - .2, S_TIME + 1.2], [S_ENV - .2, S_ENV + 1.2], [S_SIFT - .2, S_SIFT + 1.2], [87.2, 89.2], [111.4, 113.6], [148.2, 149.2]];
  return fast.some(([a, b]) => T > a && T < b) ? 4 : 3;
}
function BLOOM_K(T) { return .4 + .12 * win(T, 23.8, 30, .4, 1) + .1 * win(T, 53.4, 61.2, .5, .5) + .14 * win(T, 132.3, 135.6, .3, .5) + .18 * win(T, 148.4, TOTAL, .3, 1); }
function OVER(T) {
  stamp('2016', 'Bhattacharya et al. · R Soc Open Sci', 13.2, 23.4, T);
  stamp('2018', 'Hall · J Soc Pers Relat', 37.2, 46.0, T);
  stamp('Adams', '社会学家 · 北卡罗来纳大学', 73.0, 81.4, T);
  stamp('c. 340 BC', '亚里士多德《尼各马可伦理学》', 102.8, 111.2, T);
  stamp('2001', 'Fung, Carstensen & Lang', 116.9, 124.2, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(1001);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 F 大调里）
const NOTE = { F3: 174.61, A3: 220.0, C4: 261.63, F4: 349.23, A4: 440.0, Bb4: 466.16, C5: 523.25, D5: 587.33, E5: 659.26, F5: 698.46, G5: 783.99, A5: 880.0, C6: 1046.5, F6: 1396.9 };
const F_SHIM = [NOTE.A5, NOTE.C6, NOTE.F5, NOTE.F6, NOTE.C5], F_SWELL = [87.31, 130.81, 174.61, 220.0, 261.63];
function CUES() {
  const c = [];
  c.push([2.2, 'tink', { f: NOTE.C6, gain: .05 }], [4.4, 'tink', { f: NOTE.A5, gain: .06 }], [4.5, 'shimmer', { f: F_SHIM, gain: .1 }]);
  c.push([5.4, 'whoosh', { dur: .6, gain: .12 }]);
  for (let i = 0; i < 10; i++) c.push([6.3 + i * .25, 'click', { gain: .025 }]);
  [9.4, 9.65, 9.9, 10.15, 10.4].forEach((tt, i) => c.push([tt, 'tink', { f: [NOTE.F5, NOTE.A5, NOTE.C6, NOTE.A5, NOTE.F5][i], gain: .035 }]));
  c.push([12.9, 'whoosh', { dur: .6, gain: .12 }], [17.2, 'bar', { f0: 300, f1: 560, dur: 2.4, gain: .05 }], [19.5, 'tink', { f: NOTE.C6, gain: .08 }], [21.6, 'bar', { f0: 560, f1: 300, dur: 1.8, gain: .04 }]);
  c.push([23.6, 'whoosh', { dur: .7, gain: .16 }], [23.8, 'swell', { dur: 1.0, f: F_SWELL, gain: .08 }]);
  [28.9, 29.35, 29.8].forEach((tt, i) => c.push([tt, 'tink', { f: [NOTE.C5, NOTE.F5, NOTE.A5][i], gain: .05 }]));
  for (const t0 of [S_TIME, S_ENV, S_SIFT]) c.push([t0 - .05, 'page', { gain: .2 }], [t0 + .1, 'thud', { gain: .08 }]);       // 章节卡：翻一页板书
  c.push([37.8, 'bar', { f0: 260, f1: 420, dur: 3.8, gain: .04 }], [41.6, 'tink', { f: NOTE.A5, gain: .06 }], [42.6, 'bar', { f0: 420, f1: 700, dur: 2.8, gain: .05 }], [45.4, 'chord', { f: [NOTE.F4, NOTE.A4, NOTE.C5], gain: .1 }]);
  [46.4, 47.4, 48.4].forEach(tt => c.push([tt, 'tink', { f: NOTE.F5, gain: .035 }]));
  c.push([50.9, 'swish', { dur: .5, gain: .08 }]);
  c.push([53.6, 'shimmer', { f: F_SHIM, gain: .08 }], [55.0, 'tink', { f: NOTE.C6, gain: .05 }]);
  [57.4, 58.25, 59.1, 59.95].forEach(tt => c.push([tt, 'tick', { gain: .05 }]));
  c.push([61.4, 'swish', { dur: .9, gain: .08 }], [64.8, 'air', { dur: 5, hum: 87.31, gain: .06 }]);
  [74.6, 75.8, 77.6].forEach((tt, i) => c.push([tt, 'tink', { f: [NOTE.D5, NOTE.F5, NOTE.A5][i], gain: .06 }]));       // B♭、B♭、F 和弦里的音
  c.push([81.8, 'chord', { f: [NOTE.F4, NOTE.A4, NOTE.C5], gain: .08 }]);
  [87.4, 89.8, 92.8].forEach(tt => c.push([tt, 'suck', { dur: .8, gain: .06 }]));
  c.push([90.9, 'thud', { gain: .06 }]);
  c.push([103.0, 'tink', { f: NOTE.F5, gain: .05 }]);
  [107.0, 108.3, 109.6].forEach((tt, i) => c.push([tt, 'tink', { f: [NOTE.A4, NOTE.C5, NOTE.F5][i], gain: .05 }]));
  c.push([111.4, 'wind', { dur: 2.2, gain: .1 }], [114.3, 'shimmer', { f: F_SHIM, gain: .1 }]);
  c.push([121.4, 'swell', { dur: 1.2, f: F_SWELL, gain: .06 }]);
  c.push([132.3, 'swell', { dur: 1.4, f: F_SWELL, gain: .1 }], [133.2, 'shimmer', { f: F_SHIM, gain: .12 }]);
  c.push([139.9, 'bar', { f0: 300, f1: 600, dur: 1.2, gain: .05 }], [141.1, 'tink', { f: NOTE.A5, gain: .06 }]);
  [141.0, 142.0, 143.0].forEach((tt, i) => c.push([tt, 'tink', { f: [NOTE.C5, NOTE.F5, NOTE.A5][i], gain: .04 }]));
  for (let i = 0; i < 6; i++) c.push([145.6 + i * .3, 'click', { gain: .03 }]);
  c.push([148.4, 'ding', { f: 1396.9, gain: .1, pan: .2 }], [148.6, 'shimmer', { f: F_SHIM, gain: .14 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
