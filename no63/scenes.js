// ======================================================================== No.63 社群主义：被冷落几分钟，也会疼吗？
// 第七季·人和人之间的主义 ⑩（完结）。开头是一道选择题：三个人在网上传球，传着传着再也没人传给你，只有几分钟，你会怎样？（Williams, Cheung & Choi, 2000）
// 音乐：原创配乐（music.py，降 E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是三个声部之间传一个球，有几小节最低的那个一直接不到。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 心痛（每拍一个鼓点） · 53.33 没人接（紧张） · 64.0 传一个球（只剩钢琴） · 80.0 高潮：十个主义 · 96.0 降 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), ACHE = BT(56), NOREPLY = BT(80), PASS = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['传球', 0, LIFT], ['会疼', LIFT, ACHE], ['心痛', ACHE, NOREPLY], ['没人接', NOREPLY, PASS], ['传一个球', PASS, CLIMAX], ['必有邻', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.63';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '三个人在网上玩传球，传着传着，'],
  [4.1, 7.6, '再也没人传给你。只有几分钟，你会怎样？先猜一个。'],
  [8.2, 10.4, '答案是 C：明显受伤。'],
  [10.8, 13.3, '心情变差，归属感、自尊都往下掉；'],
  [13.6, 15.7, '就算告诉你，另外两个只是电脑程序。'],
  [16.3, 19.6, '这个小游戏，后来被很多研究反复用过，'],
  [19.9, 23.7, '结果很一致：被冷落，哪怕几分钟，也会疼。'],
  [24.0, 27.4, '有研究发现：被讨厌的人冷落，也一样难受。'],
  [27.7, 31.3, '人需要“在群里”，就像需要吃饭。'],
  [31.6, 35.3, '这就是「社群主义」：人，是在“我们”里活着的。'],
  [37.6, 40.6, '研究者给被冷落的人做了脑部扫描：'],
  [40.9, 44.6, '一块和身体疼痛有关的区域，也活跃了起来。'],
  [44.9, 48.6, '“心痛”这个词，也许不只是比喻。'],
  [48.9, 52.9, '具体机制还有争论，但“被冷落会疼”，一再被证实。'],
  [53.6, 57.6, '而我们每个人，都可能是那个不传球的人：'],
  [57.9, 60.6, '群里有人说话，没人接；'],
  [60.8, 63.4, '饭桌上有人插不上嘴，没人看。'],
  [64.3, 67.6, '所以，下次看到有人被晾在一边，'],
  [67.9, 71.9, '传一个球给他就好：叫一声名字，问一句“你觉得呢”。'],
  [72.2, 75.9, '对你只是顺手，对他可能是一整天。'],
  [76.3, 79.6, '两千多年前，孔子说：'],
  [84.9, 88.6, '这一季，我们聊了十个「人和人之间的主义」。'],
  [88.9, 92.6, '谢谢你，一期一期看到这里。'],
  [98.4, 103.0, '评论区：最近一次有人“传球”给你，是什么时候？'],
];
const BIGLINES = [
  [80.2, 92.6, '「德不孤，必有邻。」—— 孔子'],
  [93.4, 98.0, '传一个球，就有人不孤单。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [ACHE - .5, .2], [ACHE, .06], [PASS, .06],
  [PASS + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、球、电脑、大脑、聊天框、饭桌
const PINK = '#f0a0a0', GOLD = '#ffd2a0', TEALC = '#7fe3d3', WARMC = '#ffb36b', GREYP = '#9aa3b2';
const ISMS = ['互惠主义', '部落主义', '极端主义', '精英主义', '孤立主义', '攀比主义', '沉默主义', '印象主义', '面子主义', '社群主义'];
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function monitor(x, y, s, a, col = GREYP) {                                                              // “电脑程序”
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(20,21,28,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-46, -110, 92, 70, 8); ctx.fill(); ctx.stroke(); ctx.fillRect(-8, -40, 16, 22); ctx.strokeRect(-30, -18, 60, 8);
  ctx.fillStyle = col; ctx.font = '700 22px monospace'; ctx.textAlign = 'center'; ctx.fillText('01', 0, -68); ctx.restore();
}
function say(s, x, y, a, col = CREAM, size = 26) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 40, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,31,40,.95)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke(); ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}
function ballAt(t, passes, pos) {                                                                       // passes: [[from, to, t0], ...]，每次 0.8 秒，走一道弧线
  let cur = passes[0][0], x = pos[cur][0], y = pos[cur][1];
  for (const [f, to, t0] of passes) {
    if (t < t0) break;
    const k = E.io(clamp((t - t0) / .8, 0, 1)), [x1, y1] = pos[f], [x2, y2] = pos[to];
    x = lerp(x1, x2, k); y = lerp(y1, y2, k) - 90 * Math.sin(PI * k); cur = k >= 1 ? to : f;
  }
  return [x, y];
}

// ======================================================================== ① 传球（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('网上传球，再也没人传给你：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('几分钟，会怎样？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const up = E.io(prog(t, Q.REVEAL, Q.REVEAL + .8)), dy = -60 * up;
  const pos = [[300, 900 + dy], [780, 900 + dy], [540, 1140 + dy]];
  const passes = [[2, 0, .3], [0, 1, 1.3], [1, 2, 2.3], [2, 1, 3.3], [1, 0, 4.3]];                          // 先传给你几次，之后只在上面两个人之间来回
  for (let k = 0; k < 14; k++) passes.push([k % 2 ? 0 : 1, k % 2 ? 1 : 0, 5.3 + k * 1.0]);
  const comp = sstep(13.6, 14.2, t);
  [[0, WARMC], [1, WARMC]].forEach(([i]) => { person(pos[i][0], pos[i][1], .8, 1 - comp, WARMC); monitor(pos[i][0], pos[i][1], 1.0, comp, GREYP); });
  const hurt = sstep(5.5, 9.0, t);
  person(pos[2][0], pos[2][1], .8, 1, mixc(TEALC, PINK, hurt));
  text('你', pos[2][0], pos[2][1] + 60, { font: SERIF, size: 30, weight: 900, align: 'center', color: mixc(TEALC, PINK, hurt), alpha: 1 });
  if (comp > 0) { text('电脑', pos[0][0], pos[0][1] + 40, { font: SANS, size: 24, align: 'center', color: DIM, alpha: comp }); text('电脑', pos[1][0], pos[1][1] + 40, { font: SANS, size: 24, align: 'center', color: DIM, alpha: comp }); }
  const [bx, by] = ballAt(t, passes, pos.map(([x, y]) => [x, y - 150]));
  glow(bx, by, 14, '255,214,160', 1, 6);
  const C = sstep(Q.REVEAL + .3, Q.REVEAL + .7, t);
  if (C > 0) [['心情', 0], ['归属感', 1], ['自尊', 2]].forEach(([lab, i]) => {                         // 三根往下掉的条
    const y = 1220 + i * 46, k = 1 - .55 * E.io(prog(t, Q.REVEAL + .5 + i * .3, Q.REVEAL + 2.2 + i * .3));
    ctx.save(); ctx.globalAlpha = C; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(330, y - 12, 420, 24); ctx.fillStyle = mixc(TEALC, PINK, 1 - k); ctx.fillRect(330, y - 12, 420 * k, 24); ctx.restore();
    text(lab, 310, y + 1, { font: SANS, size: 26, align: 'right', color: CREAM, alpha: C });
    text('↓', 780, y + 1, { font: SERIF, size: 30, weight: 900, align: 'center', color: PINK, alpha: C * (1 - k) * 2 });
  });
  text('C · 明显受伤', 540, 560, { font: SERIF, size: 70, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('心情、归属感、自尊，都往下掉', 540, 560, { font: SERIF, size: 48, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t) * (1 - sstep(13.5, 13.9, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('就算对面只是电脑', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: PINK, alpha: sstep(13.7, 14.2, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 无所谓', 200], ['B · 有点不爽', 540], ['C · 明显受伤', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 会疼
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('社群主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('COMMUNITARIANISM', 540, 1046, { size: 38, weight: 600, font: LAT, ls: 12, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ⑩ · 完结', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneHurt(t) {
  if (t < 19.7 || t > ACHE + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(ACHE - .6, ACHE - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('被冷落，哪怕几分钟，也会疼', 540, 640, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('被讨厌的人冷落，也难受', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('像需要吃饭一样', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const G = D * (1 - sstep(23.8, 24.2, t));
    for (let i = 0; i < 6; i++) {                                                                           // 一格格小的“传球”：每一格里，下面那个人都变红
      const cx = 250 + (i % 3) * 290, cy = 920 + Math.floor(i / 3) * 260, a = G * sstep(20.2 + i * .3, 20.5 + i * .3, t);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(195,202,214,.3)'; ctx.lineWidth = 2; ctx.strokeRect(cx - 120, cy - 110, 240, 220); ctx.restore();
      person(cx - 60, cy - 10, .4, a, GREYP); person(cx + 60, cy - 10, .4, a, GREYP); person(cx, cy + 80, .4, a, PINK);
      const k = ((t * 1.2 + i * .3) % 1), bx = lerp(cx - 60, cx + 60, (Math.floor(t * 1.2 + i * .3) % 2) ? 1 - k : k);
      glow(bx, cy - 70 - 30 * Math.sin(PI * k), 6, '255,214,160', a, 3);
    }
    const H = D * sstep(24.1, 24.5, t) * (1 - sstep(27.4, 27.8, t));
    if (H > 0) { person(330, 1060, 1.0, H, '#5a3a3a'); person(750, 1060, 1.0, H, '#5a3a3a'); text('讨厌的人', 540, 1000, { font: SANS, size: 28, align: 'center', color: DIM, alpha: H });
      person(540, 1260, .8, H, PINK); text('还是会难受', 540, 1320, { font: SANS, size: 26, align: 'center', color: PINK, alpha: H * sstep(25.2, 25.6, t) }); }
    const N = D * sstep(27.8, 28.2, t);
    if (N > 0) {
      ctx.save(); ctx.globalAlpha = N; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(320, 1020, 90, 0, PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(220, 1020); ctx.lineTo(420, 1020); ctx.stroke(); ctx.restore();
      text('吃饭', 320, 1160, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: N });
      text('=', 540, 1040, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: N * sstep(28.4, 28.8, t) });
      for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * TAU / 5; person(760 + 80 * Math.cos(a), 1050 + 60 * Math.sin(a), .38, N * sstep(28.6 + i * .1, 28.9 + i * .1, t), GOLD); }
      text('在群里', 760, 1160, { font: SERIF, size: 34, weight: 900, align: 'center', color: GOLD, alpha: N * sstep(28.6, 29.0, t) });
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('社群主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('人，是在“我们”里活着的', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 心痛
function sceneAche(t) {
  if (t < ACHE - .3 || t > NOREPLY + .2) return;
  const A = sstep(ACHE - .1, ACHE + .5, t) * (1 - sstep(NOREPLY - .6, NOREPLY - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - ACHE) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('一次脑部扫描', 37.7, 40.6, CREAM);
  hd('和身体疼痛有关的区域', 41.0, 44.6, PINK, 'rgba(229,72,77,.4)');
  hd('“心痛”，也许不只是比喻', 45.0, 48.6, GOLD, `rgba(${O_RGB},.4)`);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('被冷落会疼：一再被证实', 0, 0, { font: SERIF, size: 50, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(49.0, 49.5, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  const cx = 540, cy = 1000;                                                                               // 一个侧面的大脑轮廓
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(30,31,40,.85)';
  ctx.beginPath(); ctx.moveTo(cx - 200, cy + 40); ctx.bezierCurveTo(cx - 230, cy - 120, cx - 80, cy - 200, cx + 40, cy - 180); ctx.bezierCurveTo(cx + 180, cy - 170, cx + 230, cy - 60, cx + 200, cy + 30);
  ctx.bezierCurveTo(cx + 190, cy + 90, cx + 120, cy + 110, cx + 60, cy + 100); ctx.lineTo(cx + 40, cy + 160); ctx.lineTo(cx, cy + 160); ctx.lineTo(cx - 10, cy + 100); ctx.bezierCurveTo(cx - 100, cy + 110, cx - 190, cy + 100, cx - 200, cy + 40); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.clip(); ctx.strokeStyle = 'rgba(236,230,218,.32)'; ctx.lineWidth = 2.5;                                 // 脑回：一道道弯弯曲曲的沟
  for (let r = 0; r < 6; r++) { ctx.beginPath(); for (let x = cx - 220; x <= cx + 220; x += 8) { const y = cy - 150 + r * 42 + 12 * Math.sin(x * .06 + r * 1.7) + 6 * Math.sin(x * .17 + r); x === cx - 220 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  ctx.restore();
  const lit = A * sstep(41.0, 41.4, t);
  glow(cx + 10, cy - 80, 30 + 14 * bk, '229,72,77', lit * (.6 + .4 * bk), 10);
  const I1 = A * sstep(41.4, 41.8, t), I2 = A * sstep(42.2, 42.6, t);
  pill('身体疼痛', 200, 800, I1, { size: 28, stroke: 'rgba(240,160,160,.8)', color: PINK });
  pill('被冷落', 880, 800, I2, { size: 28, stroke: 'rgba(240,160,160,.8)', color: PINK });
  drawOn(() => { ctx.moveTo(240, 830); ctx.quadraticCurveTo(380, 880, cx - 10, cy - 90); }, 360, prog(t, 41.6, 42.4), PINK, 3, I1, PINK);
  drawOn(() => { ctx.moveTo(840, 830); ctx.quadraticCurveTo(700, 880, cx + 30, cy - 90); }, 360, prog(t, 42.4, 43.2), PINK, 3, I2, PINK);
  text('♡', 540, 1240, { font: SANS, size: 60, align: 'center', color: PINK, alpha: A * sstep(45.0, 45.4, t) * (.6 + .4 * bk) });
  text('具体机制还有争论', 540, 1300, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: A * sstep(49.4, 49.8, t) });
}

// ======================================================================== ④ 没人接
function sceneNoReply(t) {
  if (t < NOREPLY - .3 || t > PASS + .2) return;
  const A = sstep(NOREPLY - .1, NOREPLY + .5, t) * (1 - sstep(PASS - .7, PASS - .1, t));
  if (A <= 0) return;
  text('每个人，都可能不传球', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('群里有人说话，没人接', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('饭桌上，有人插不上嘴', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: A * sstep(60.9, 61.4, t) });
  const C = A * (1 - sstep(60.6, 61.0, t));
  if (C > 0) {                                                                                              // 一个群聊：别人一直在互相回，一句没人回的话被顶上去
    ctx.save(); ctx.globalAlpha = C; ctx.fillStyle = 'rgba(20,21,28,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(240, 760, 600, 520, 30); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(256, 790, 568, 470, 14); ctx.clip();
    const msgs = [['哈哈哈', 0], ['周末去哪？', 1], ['我也觉得…', 2], ['爬山吧', 0], ['好啊！', 1], ['几点集合', 0], ['九点？', 1], ['可以', 0]];
    const shown = clamp(Math.floor((t - 54.0) / .7) + 1, 0, msgs.length), off = Math.max(0, shown - 6) * 70;
    msgs.slice(0, shown).forEach(([s, who], i) => {
      const y = 830 + i * 70 - off, me = who === 2, x = me ? 700 : 400;
      ctx.fillStyle = me ? 'rgba(127,227,211,.18)' : 'rgba(236,230,218,.10)'; ctx.beginPath(); ctx.roundRect(x - 130, y - 24, 260, 48, 18); ctx.fill();
      ctx.fillStyle = me ? TEALC : CREAM; ctx.font = '700 24px "Noto Sans SC", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s, x, y + 8);
    });
    ctx.restore();
  }
  const T = A * sstep(60.9, 61.3, t);
  if (T > 0) {
    ctx.save(); ctx.globalAlpha = T; ctx.fillStyle = 'rgba(120,90,70,.6)'; ctx.strokeStyle = '#c8a46a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(540, 1080, 260, 90, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    [[330, 990, 1], [450, 960, 1], [630, 960, 1], [750, 990, 1], [880, 1150, 0]].forEach(([x, y, inn], i) => person(x, y, .55, T, inn ? WARMC : '#6f7786'));
    const talk = Math.floor(t * 1.5) % 4;
    say('…', [330, 450, 630, 750][talk], 860, T, WARMC, 22);
    text('…', 880, 1010, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#6f7786', alpha: T * (.5 + .5 * Math.sin(t * 3)) });
  }
}

// ======================================================================== ⑤ 传一个球
function scenePass(t) {
  if (t < PASS - .2 || t > CLIMAX + .3) return;
  const A = sstep(PASS + .2, PASS + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('有人被晾在一边时', 64.5, 67.6, CREAM);
  hd('传一个球给他', 67.9, 71.9, TEALC, `rgba(${T_RGB},.4)`);
  hd('对你顺手，对他一整天', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('两千多年前：', 76.4, 0, CREAM);
  const pos = [[300, 900], [780, 900], [540, 1160]];
  const passes = [[0, 1, 64.6], [1, 0, 65.6], [0, 1, 66.6], [1, 2, 68.2], [2, 0, 70.2], [0, 2, 71.4], [2, 1, 72.6], [1, 2, 73.8], [2, 0, 75.0], [0, 1, 76.2]];
  const inc = sstep(68.6, 69.4, t);
  person(pos[0][0], pos[0][1], .8, A, WARMC); person(pos[1][0], pos[1][1], .8, A, WARMC);
  person(pos[2][0], pos[2][1], .8, A, mixc('#c98a8a', GOLD, inc));
  const [bx, by] = ballAt(t, passes, pos.map(([x, y]) => [x, y - 150]));
  glow(bx, by, 14, '255,214,160', A, 6);
  say('你觉得呢？', 780, 720, A * sstep(68.4, 68.8, t) * (1 - sstep(71.9, 72.3, t)), WARMC, 28);
  const day = A * sstep(72.4, 73.0, t);
  if (day > 0) { glow(540, 1060, 70 + 20 * Math.sin(t * 2), O_RGB, day * .55, 12); for (let i = 0; i < 14; i++) { const r = mulberry(6300 + i), p = ((t - 72.4) * (.2 + .2 * r()) + r()) % 1; glow(380 + r() * 320, 1200 - p * 300, 2 + 2 * r(), O_RGB, day * (1 - p) * .8, 3); } }
}

// ======================================================================== ⑥ 必有邻：第七季的十个主义
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), cx = 540, cy = 1040;
  warmth(A * (1 + .5 * fin), cx, cy, 760);
  const pts = ISMS.map((s, i) => { const a = -PI / 2 + i * TAU / 10; return [cx + 330 * Math.cos(a), cy + 200 * Math.sin(a), Math.sin(a)]; });
  const bp = clamp((t - 84.9) / 3.7, 0, 1) * 10;                                                          // 一个球沿着这一圈传过去，传到谁，谁就亮
  pts.forEach(([x, y, sn], i) => {
    const lit = clamp(bp - i, 0, 1), last = i === 9;
    glow(x, y, 7 + 4 * lit, last ? '255,214,160' : O_RGB, A * (.3 + .7 * Math.max(lit, fin)), 5);
    text(ISMS[i], x, sn < -.1 ? y - 24 : y + 42, { font: SERIF, size: last ? 28 : 24, weight: 900, align: 'center', color: last ? GOLD : CREAM, alpha: A * (.3 + .7 * Math.max(lit, fin)) });
  });
  if (bp > 0 && bp < 10) { const i = Math.floor(bp), k = bp - i, [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % 10]; glow(lerp(x1, x2, k), lerp(y1, y2, k) - 30 * Math.sin(PI * k), 12, '255,230,190', A, 6); }
  const lk = E.io(prog(t, FINAL, FINAL + 1.6));
  if (lk > 0) { ctx.save(); ctx.strokeStyle = `rgba(${O_RGB},.55)`; ctx.lineWidth = 2; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 8; ctx.globalAlpha = A;
    pts.forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, cx, lk * .78), lerp(y, cy - 40, lk * .78)); ctx.stroke(); }); ctx.restore(); }
  for (let i = 0; i < 3; i++) person(cx - 70 + i * 70, cy + 30, .55, A, mixc(WARMC, GOLD, fin));
  glow(cx, cy - 70, 16 + 8 * fin, '255,214,160', A * (.6 + .4 * fin), 6);
  if (fin > 0) for (let i = 0; i < 24; i++) { const r = mulberry(5400 + i), x = 380 + r() * 320, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1; glow(x + 16 * Math.sin(t + i), 1120 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3); }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('德不孤，', 540, 440, { ...big, size: 72, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.0), qa);
  typeText('必有邻。', 540, 552, { ...big, size: 84, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.2, CLIMAX + 2.0), qa);
  typeText('—— 孔子（《论语·里仁》）', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.2, CLIMAX + 2.8), qa);
  typeText('传一个球，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('就有人不孤单。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneHurt(t); sceneAche(t); sceneNoReply(t); scenePass(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2000', 'Williams, Cheung & Choi · J Pers Soc Psychol', 8.2, 13.3, T);
  stamp('2004', 'Zadro, Williams & Richardson · J Exp Soc Psychol', 13.6, 15.7, T);
  stamp('2007', 'Gonsalkorale & Williams · Eur J Soc Psychol', 24.0, 27.4, T);
  stamp('1995', 'Baumeister & Leary · Psychol Bull', 27.7, 35.3, T);
  stamp('2003', 'Eisenberger, Lieberman & Williams · Science', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(63);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在降 E 小调里，最后一个和弦是降 E 大调）
const NOTE = { Eb3: 155.56, Gb3: 185.00, G3: 196.00, Bb3: 233.08, Eb4: 311.13, Gb4: 369.99, Bb4: 466.16, Eb5: 622.25, Gb5: 739.99, G5: 783.99, Bb5: 932.33 };
const EBM_SHIM = [NOTE.Gb5, NOTE.Bb4, NOTE.Eb5, NOTE.Eb4, NOTE.Bb3], EB_SHIM = [NOTE.G5, NOTE.Bb4, NOTE.Eb5, NOTE.Eb4, NOTE.Bb3], EBM_SWELL = [38.89, 58.27, 77.78, 92.50, 116.54];
function CUES() {
  const c = [];
  [.3, 1.3, 2.3, 3.3, 4.3].forEach(t => c.push([t + .78, 'tick', { gain: .07 }]));
  for (let k = 0; k < 7; k++) c.push([5.3 + k * 1.0 + .78, 'tick', { gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Eb3, NOTE.Gb3, NOTE.Bb3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Gb5, gain: .1 }]);
  c.push([Q.REVEAL + .5, 'bar', { f0: 400, f1: 200, dur: 1.6, gain: .06 }], [13.8, 'tick', { gain: .08 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EBM_SHIM, gain: .28 }]);
  for (let i = 0; i < 6; i++) c.push([20.2 + i * .3, 'tick', { gain: .05 }]);
  c.push([24.2, 'bar', { f0: 260, f1: 200, dur: .8, gain: .05 }], [27.9, 'swell', { dur: 2.0, f: EBM_SWELL, gain: .1 }], [31.7, 'page', { gain: .18 }]);
  c.push([ACHE, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'thud', { gain: .07 }], [41.6, 'whoosh', { dur: .8, gain: .06 }], [42.4, 'whoosh', { dur: .8, gain: .06 }]);
  c.push([49.1, 'chord', { f: [NOTE.Eb3, NOTE.Gb3, NOTE.Bb3], gain: .1 }], [49.2, 'tink', { f: NOTE.Bb5, gain: .06 }]);
  c.push([NOREPLY, 'whoosh', { dur: .5, gain: .22 }]);
  for (let i = 0; i < 8; i++) c.push([54.0 + i * .7, 'tick', { gain: i === 2 ? .1 : .05 }]);
  c.push([61.0, 'dust', { dur: 2.0, gain: .04 }]);
  [64.6, 65.6, 66.6, 68.2, 70.2, 71.4, 72.6, 73.8, 75.0].forEach((t, i) => c.push([t + .78, 'tink', { f: [NOTE.Bb4, NOTE.Eb5, NOTE.Gb5][i % 3], gain: .04 }]));
  c.push([68.4, 'tink', { f: NOTE.Eb5, gain: .06 }], [72.4, 'swell', { dur: 3.0, f: EBM_SWELL, gain: .1 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: EBM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EBM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 77.78, gain: .14 }]);
  for (let i = 0; i < 10; i++) c.push([84.9 + i * .37, 'tink', { f: [NOTE.Eb4, NOTE.Gb4, NOTE.Bb4, NOTE.Eb5, NOTE.Gb5][i % 5] * (i >= 5 ? 1 : 1), gain: .045 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EB_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Eb3, NOTE.G3, NOTE.Bb3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
