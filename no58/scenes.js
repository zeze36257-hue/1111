// ======================================================================== No.58 孤立主义：跟陌生人聊天，真的很尴尬吗？
// 第七季·人和人之间的主义 ⑤。开头是一道选择题：通勤火车上，跟陌生人聊天的一组和自己安静坐着的一组，谁更愉快？（Epley & Schroeder, 2014）
// 音乐：原创配乐（music.py，A 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一个没人回应的重复音，然后往上够一下别人。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 喜欢差（每拍一个鼓点） · 53.33 孤岛（紧张） · 64.0 开口（只剩钢琴） · 80.0 高潮：大陆 · 96.0 A 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), GAP = BT(56), ISLE = BT(80), SPEAK = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['火车上', 0, LIFT], ['猜错了', LIFT, GAP], ['喜欢差', GAP, ISLE], ['孤岛', ISLE, SPEAK], ['开口', SPEAK, CLIMAX], ['大陆', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.58';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '通勤火车上，一组人被要求跟陌生人聊天，'],
  [4.1, 7.6, '另一组自己安静坐着。谁更愉快？先猜一个。'],
  [8.2, 10.4, '答案是 C：聊天的那组。'],
  [10.8, 13.3, '可是事先问别的乘客，他们大多猜：'],
  [13.6, 15.7, '跟陌生人聊天，会是最难受的。'],
  [16.3, 19.6, '我们为什么不开口？研究者问了问。'],
  [19.9, 23.7, '很多人以为：别人不想跟我聊。'],
  [24.0, 27.4, '可真开了口，对方往往挺乐意。'],
  [27.7, 31.3, '我们把自己关起来，是因为猜错了别人。'],
  [31.6, 35.3, '这就是「孤立主义」：宁可一个人，也怕打扰别人。'],
  [37.6, 40.6, '还有一个“喜欢差”：'],
  [40.9, 44.6, '聊完天，我们常觉得：对方没那么喜欢我。'],
  [44.9, 48.6, '可对方对你的喜欢，往往比你以为的多。'],
  [48.9, 52.9, '我们低估了别人的善意，也低估了自己。'],
  [53.6, 57.6, '猜错的代价是：'],
  [57.9, 60.6, '越来越少开口，越来越孤单；'],
  [60.8, 63.4, '而长期孤立，对健康也有实实在在的伤害。'],
  [64.3, 67.6, '所以，下次排队、坐车、等咖啡的时候，'],
  [67.9, 71.9, '可以试着说一句：今天挺冷的哈。'],
  [72.2, 75.9, '大多数人，会比你想的更愿意接话。'],
  [76.3, 79.6, '四百年前，英国诗人邓恩写过：'],
  [84.9, 88.6, '我们以为别人想要安静，'],
  [88.9, 92.6, '其实很多人，也在等一个人先开口。'],
  [98.4, 103.0, '评论区：你最近一次跟陌生人聊天，是什么时候？'],
];
const BIGLINES = [
  [80.2, 92.6, '「没有人是一座孤岛。」—— 约翰·邓恩'],
  [93.4, 98.0, '先开口，孤岛就连成大陆。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [GAP - .5, .2], [GAP, .06], [SPEAK, .06],
  [SPEAK + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、车厢、气泡、砖墙、小岛
const PINK = '#f0a0a0', GOLD = '#ffd2a0', TEALC = '#7fe3d3', WARMC = '#ffb36b', GREYP = '#9aa3b2';
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function say(s, x, y, a, col = CREAM, size = 28, tailDir = 0) {                                        // 说话气泡；tailDir -1 尾巴朝左下，1 朝右下
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 44, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,31,40,.95)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  if (tailDir) { ctx.beginPath(); ctx.moveTo(x + tailDir * w * .2, y + h / 2 - 2); ctx.lineTo(x + tailDir * (w * .2 + 18), y + h / 2 + 18); ctx.lineTo(x + tailDir * (w * .2 + 24), y + h / 2 - 2); ctx.fill(); }
  ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}
function train(y, a) {                                                                                  // 车厢：窗户和扶手杆
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(24,26,34,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.55)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(90, y - 240, 900, 330, 40); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(127,200,227,.10)'; ctx.beginPath(); ctx.roundRect(130 + i * 172, y - 210, 140, 90, 14); ctx.fill(); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(195,202,214,.35)'; ctx.beginPath(); ctx.moveTo(110, y - 100); ctx.lineTo(970, y - 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(540, y - 238); ctx.lineTo(540, y + 88); ctx.setLineDash([8, 8]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}
function island(x, y, rx, a, col = '#3a4a3a') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.strokeStyle = 'rgba(156,201,90,.6)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y, rx, rx * .28, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
function sea(y, a, t) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(127,200,227,.35)'; ctx.lineWidth = 2.5;
  for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let x = 80; x <= 1000; x += 10) { const yy = y + k * 60 + 6 * Math.sin(x / 50 + t * 1.5 + k * 2); x === 80 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
  ctx.restore();
}

// ======================================================================== ① 火车上（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('火车上，跟陌生人聊天 vs 自己坐着：', 540, 452, { ...big, size: 40, weight: 700 }, 1, 1 - qOut);
  typeText('谁更愉快？', 540, 560, { ...big, size: 84, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), ty = 1080;
  if (P > 0) {
    train(ty, P);
    const sway = 3 * Math.sin(t * 5);
    person(230, ty + 40 + sway, .7, P, WARMC); person(380, ty + 40 + sway, .7, P, WARMC);
    const talk = Math.floor(t / 1.1) % 2;
    say('…', talk ? 380 : 230, ty - 50, P, WARMC, 26, talk ? 1 : -1);
    person(700, ty + 40 + sway, .7, P, TEALC); person(860, ty + 40 + sway, .7, P, TEALC);
    text('聊天组', 305, ty + 130, { font: SANS, size: 26, align: 'center', color: WARMC, alpha: P });
    text('安静组', 780, ty + 130, { font: SANS, size: 26, align: 'center', color: TEALC, alpha: P });
  }
  const C = sstep(Q.REVEAL + .1, Q.REVEAL + .5, t);
  if (C > 0) {
    const base = 1180, k = E.out(prog(t, Q.REVEAL + .2, Q.REVEAL + 1.2)), pr = sstep(10.9, 11.4, t);
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, base); ctx.lineTo(900, base); ctx.stroke();
    ctx.fillStyle = WARMC; ctx.fillRect(250, base - 280 * k, 110, 280 * k); ctx.fillStyle = TEALC; ctx.fillRect(470, base - 190 * k, 110, 190 * k); ctx.restore();
    text('实际', 415, base + 44, { font: SANS, size: 26, align: 'center', color: CREAM, alpha: C });
    text('聊天', 305, base - 280 * k - 26, { font: SANS, size: 24, align: 'center', color: WARMC, alpha: C * k });
    text('安静', 525, base - 190 * k - 26, { font: SANS, size: 24, align: 'center', color: TEALC, alpha: C * k });
    if (pr > 0) {                                                                                       // 别的乘客的预测：正好反过来
      const k2 = E.out(prog(t, 11.0, 12.0));
      ctx.save(); ctx.globalAlpha = pr; ctx.setLineDash([8, 6]); ctx.lineWidth = 3;
      ctx.strokeStyle = WARMC; ctx.strokeRect(680, base - 140 * k2, 90, 140 * k2); ctx.strokeStyle = TEALC; ctx.strokeRect(800, base - 250 * k2, 90, 250 * k2); ctx.setLineDash([]); ctx.restore();
      text('别人的预测', 785, base + 44, { font: SANS, size: 26, align: 'center', color: DIM, alpha: pr });
      text('聊天', 725, base - 140 * k2 - 26, { font: SANS, size: 24, align: 'center', color: WARMC, alpha: pr * k2 });
      text('安静', 845, base - 250 * k2 - 26, { font: SANS, size: 24, align: 'center', color: TEALC, alpha: pr * k2 });
    }
    text('通勤路上的愉快程度（示意）', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: C });
  }
  text('C · 聊天的那组', 540, 560, { font: SERIF, size: 68, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('可大家猜：聊天最难受', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 安静坐着的', 200], ['B · 差不多', 540], ['C · 聊天的', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 猜错了
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('孤立主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('ISOLATIONISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 20, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ⑤', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneGuess(t) {
  if (t < 19.7 || t > GAP + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(GAP - .6, GAP - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('以为：别人不想聊', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('其实：对方挺乐意', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: WARMC, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('猜错了别人', 540, 640, { font: SERIF, size: 58, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    person(300, 1120, 1.1, D, TEALC); person(780, 1120, 1.1, D, WARMC);
    say('他应该不想被打扰吧…', 330, 900, D * sstep(20.2, 20.6, t) * (1 - sstep(23.8, 24.2, t)), TEALC, 28, -1);
    say('今天好冷啊', 330, 900, D * sstep(24.2, 24.6, t), TEALC, 30, -1);
    say('是啊！你也坐这班？', 740, 980, D * sstep(25.0, 25.4, t), WARMC, 30, 1);
    const wall = D * (1 - sstep(27.9, 29.4, t));                                                       // 两人中间那堵墙，猜对了就塌了
    if (wall > 0) for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) {
      const fall = sstep(27.9 + (r + c) * .12, 28.9 + (r + c) * .12, t);
      ctx.save(); ctx.globalAlpha = wall; ctx.translate(500 + c * 40 + (r % 2) * 20 + 30 * fall * (c ? 1 : -1), 1150 - r * 34 + 120 * fall * fall); ctx.rotate(fall * (c ? .6 : -.6));
      ctx.fillStyle = 'rgba(120,90,70,.9)'; ctx.strokeStyle = 'rgba(30,31,40,.9)'; ctx.lineWidth = 2; ctx.fillRect(-19, -16, 38, 32); ctx.strokeRect(-19, -16, 38, 32); ctx.restore();
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('孤立主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('宁可一个人，也怕打扰别人', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 喜欢差
function sceneGap(t) {
  if (t < GAP - .3 || t > ISLE + .2) return;
  const A = sstep(GAP - .1, GAP + .5, t) * (1 - sstep(ISLE - .6, ISLE - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - GAP) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('喜欢差', 37.7, 40.6, GOLD, `rgba(${O_RGB},.4)`);
  hd('我猜：他没那么喜欢我', 41.0, 44.6, TEALC);
  hd('其实：他更喜欢你', 45.0, 48.6, WARMC, `rgba(${O_RGB},.4)`);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('低估了别人，也低估了自己', 0, 0, { font: SERIF, size: 50, weight: 900, align: 'center', color: PINK, alpha: A * sstep(49.0, 49.5, t), glow: 'rgba(229,72,77,.4)', blur: 16 }); ctx.restore();
  typeText('THE LIKING GAP', 540, 724, { size: 26, weight: 600, font: LAT, ls: 8, color: DIM, align: 'center', spread: 2 }, prog(t, 37.9, 38.8), A * sstep(37.8, 38.1, t) * (1 - sstep(40.6, 41.0, t)));
  person(300, 1060, 1.0, A, TEALC); person(780, 1060, 1.0, A, WARMC);
  text('你', 300, 1140, { font: SANS, size: 26, align: 'center', color: TEALC, alpha: A }); text('刚聊完的人', 780, 1140, { font: SANS, size: 26, align: 'center', color: WARMC, alpha: A });
  const base = 1260, g1 = A * sstep(41.0, 41.4, t), g2 = A * sstep(45.0, 45.4, t);
  const h1 = 90 * E.out(prog(t, 41.2, 42.2)), h2 = 190 * E.out(prog(t, 45.2, 46.4));
  ctx.save(); ctx.globalAlpha = g1; ctx.fillStyle = TEALC; ctx.fillRect(470, base - h1, 60, h1); ctx.restore();
  ctx.save(); ctx.globalAlpha = g2; ctx.fillStyle = WARMC; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16 * bk; ctx.fillRect(550, base - h2, 60, h2); ctx.restore();
  text('你以为的', 500, base + 34, { font: SANS, size: 22, align: 'center', color: TEALC, alpha: g1 });
  text('实际的', 580, base + 60, { font: SANS, size: 22, align: 'center', color: WARMC, alpha: g2 });
  text('♥', 540, 900, { font: SANS, size: 60, align: 'center', color: WARMC, alpha: g2 * (.6 + .4 * bk) });
  if (A * sstep(49.0, 49.4, t) > 0) {
    drawOn(() => { ctx.moveTo(640, base - h1); ctx.lineTo(640, base - h2); }, 100, prog(t, 49.2, 49.8), PINK, 4, A, PINK);
    text('差', 676, base - (h1 + h2) / 2, { font: SERIF, size: 32, weight: 900, align: 'center', color: PINK, alpha: A * sstep(49.6, 50.0, t) });
  }
}

// ======================================================================== ④ 孤岛
function sceneIsle(t) {
  if (t < ISLE - .3 || t > SPEAK + .2) return;
  const A = sstep(ISLE - .1, ISLE + .5, t) * (1 - sstep(SPEAK - .7, SPEAK - .1, t));
  if (A <= 0) return;
  text('猜错的代价', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('越少开口，越孤单', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: TEALC, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('孤立，也伤身体', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: PINK, alpha: A * sstep(60.9, 61.4, t), glow: 'rgba(229,72,77,.4)', blur: 16 });
  sea(1140, A, t);
  const drift = E.io(prog(t, 57.9, 60.6)), pts = [[300, 1000], [540, 1080], [780, 1000], [420, 1200], [680, 1200]];
  pts.forEach(([x, y], i) => {                                                                         // 一个人一座小岛，越漂越远
    const dx = (x - 540) * .35 * drift, dy = (y - 1100) * .3 * drift, X = x + dx, Y = y + dy;
    island(X, Y + 20, 90 - 20 * drift, A);
    person(X, Y, .55, A, mixc(TEALC, GREYP, drift));
  });
  const H = A * sstep(60.9, 61.3, t);
  if (H > 0) {
    const beat = 1 + .1 * Math.max(0, Math.sin(t * 7)) * (1 - .6 * sstep(61.5, 63.0, t));
    ctx.save(); ctx.globalAlpha = H * (1 - .5 * sstep(61.5, 63.0, t)); ctx.translate(900, 860); ctx.scale(beat, beat); ctx.fillStyle = PINK;
    ctx.beginPath(); ctx.moveTo(0, 20); ctx.bezierCurveTo(-40, -10, -30, -40, 0, -24); ctx.bezierCurveTo(30, -40, 40, -10, 0, 20); ctx.fill(); ctx.restore();
  }
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}

// ======================================================================== ⑤ 开口
function sceneSpeak(t) {
  if (t < SPEAK - .2 || t > CLIMAX + .3) return;
  const A = sstep(SPEAK + .2, SPEAK + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('排队、坐车、等咖啡', 64.5, 67.6, CREAM);
  hd('试着说一句', 67.9, 71.9, TEALC, `rgba(${T_RGB},.4)`);
  hd('对方，比你想的更愿意', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('四百年前：', 76.4, 0, CREAM);
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.55)'; ctx.lineWidth = 3;   // 咖啡店柜台
  ctx.fillRect(700, 1060, 280, 150); ctx.strokeRect(700, 1060, 280, 150); ctx.restore();
  text('☕', 840, 1130, { font: SANS, size: 50, align: 'center', color: GOLD, alpha: A });
  person(260, 1160, .8, A, GREYP); person(420, 1160, .8, A, TEALC); person(580, 1160, .8, A, WARMC);
  say('今天挺冷的哈', 380, 960, A * sstep(68.2, 68.6, t), TEALC, 30, 1);
  say('是啊！你常来这家？', 610, 860, A * sstep(72.5, 72.9, t), WARMC, 30, -1);
  const G = A * sstep(72.9, 73.6, t);
  if (G > 0) { glow(500, 1060, 50, O_RGB, G * .5, 10); for (let i = 0; i < 14; i++) { const r = mulberry(5800 + i), p = ((t - 72.9) * (.2 + .2 * r()) + r()) % 1; glow(360 + r() * 300, 1160 - p * 300, 2 + 2 * r(), O_RGB, G * (1 - p) * .8, 3); } }
}

// ======================================================================== ⑥ 大陆
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  sea(1180, A * (1 - .5 * fin), t);
  const pts = [[220, 960], [420, 900], [640, 920], [860, 980], [320, 1130], [560, 1100], [780, 1150]];
  const merge = E.io(prog(t, FINAL - 1, FINAL + 1.5));
  if (merge > 0) {                                                                                     // 最后连成一整块陆地
    ctx.save(); ctx.globalAlpha = A * merge; ctx.fillStyle = 'rgba(70,84,58,.9)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.ellipse(540, 1060, 400, 150, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  pts.forEach(([x, y], i) => island(x, y + 20, 80, A * sstep(CLIMAX + i * .12, CLIMAX + .4 + i * .12, t) * (1 - merge)));
  const links = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [3, 6], [1, 5], [2, 5]];
  links.forEach(([a, b], i) => {                                                                        // 一座座小岛之间搭起桥
    const [x1, y1] = pts[a], [x2, y2] = pts[b], k = prog(t, CLIMAX + 4 + i * .9, CLIMAX + 5 + i * .9);
    drawOn(() => { ctx.moveTo(x1, y1 - 20); ctx.lineTo(x2, y2 - 20); }, Math.hypot(x2 - x1, y2 - y1), k, GOLD, 3, A, GOLD);
  });
  pts.forEach(([x, y], i) => person(x, y, .5, A * sstep(CLIMAX + i * .12, CLIMAX + .4 + i * .12, t), mixc(GREYP, GOLD, sstep(CLIMAX + 4 + i, CLIMAX + 6 + i, t))));
  if (fin > 0) for (let i = 0; i < 24; i++) { const r = mulberry(5400 + i), x = 300 + r() * 480, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1; glow(x + 16 * Math.sin(t + i), 1150 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3); }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('没有人', 540, 440, { ...big, size: 64, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.0), qa);
  typeText('是一座孤岛。', 540, 552, { ...big, size: 76, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.2, CLIMAX + 2.2), qa);
  typeText('—— 约翰·邓恩，1624', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.0), qa);
  typeText('先开口，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('孤岛就连成大陆。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneGuess(t); sceneGap(t); sceneIsle(t); sceneSpeak(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2014', 'Epley & Schroeder · J Exp Psychol Gen', 8.2, 35.3, T);
  stamp('2018', 'Boothby et al. · Psychol Sci', 37.6, 52.9, T);
  stamp('2010', 'Holt-Lunstad et al. · PLoS Med', 60.8, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(58);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 A 小调里，最后一个和弦是 A 大调）
const NOTE = { A2: 110.00, C3: 130.81, Cs3: 138.59, E3: 164.81, A3: 220.00, C4: 261.63, E4: 329.63, A4: 440.00, C5: 523.25, Cs5: 554.37, E5: 659.25, A5: 880.00 };
const AM_SHIM = [NOTE.C5, NOTE.E4, NOTE.A4, NOTE.A3, NOTE.E3], A_SHIM = [NOTE.Cs5, NOTE.E4, NOTE.A4, NOTE.A3, NOTE.E3], AM_SWELL = [55.00, 82.41, 110.00, 130.81, 164.81];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.E5, gain: .05 }], [1.0, 'tink', { f: NOTE.A4, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.A2, NOTE.C3, NOTE.E3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.E5, gain: .1 }]);
  c.push([Q.REVEAL + .3, 'bar', { f0: 220, f1: 440, dur: 1.0, gain: .06 }], [11.0, 'bar', { f0: 440, f1: 220, dur: 1.0, gain: .06 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: AM_SHIM, gain: .28 }]);
  c.push([20.2, 'tink', { f: NOTE.C4, gain: .04 }], [24.2, 'tink', { f: NOTE.E4, gain: .05 }], [25.0, 'tink', { f: NOTE.A4, gain: .06 }], [27.9, 'dust', { dur: 1.6, gain: .06 }], [28.3, 'thud', { gain: .07 }], [31.7, 'page', { gain: .18 }]);
  c.push([GAP, 'whoosh', { dur: .5, gain: .25 }], [41.2, 'bar', { f0: 300, f1: 340, dur: .8, gain: .05 }], [45.2, 'bar', { f0: 300, f1: 600, dur: 1.0, gain: .06 }], [45.4, 'tink', { f: NOTE.A5, gain: .06 }]);
  c.push([49.1, 'chord', { f: [NOTE.A2, NOTE.C3, NOTE.E3], gain: .1 }], [49.3, 'tick', { gain: .12 }]);
  c.push([ISLE, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'whoosh', { dur: 2.6, gain: .08 }], [61.0, 'thud', { gain: .06 }], [61.5, 'thud', { gain: .04 }]);
  c.push([68.2, 'tink', { f: NOTE.E4, gain: .05 }], [72.5, 'tink', { f: NOTE.A4, gain: .06 }], [72.9, 'swell', { dur: 3.0, f: AM_SWELL, gain: .1 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: AM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: AM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 55.00, gain: .14 }]);
  for (let i = 0; i < 9; i++) c.push([CLIMAX + 5 + i * .9, 'tink', { f: [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.A5][i % 4] * (i > 3 ? .5 : 1), gain: .04 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: A_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.A2, NOTE.Cs3, NOTE.E3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
