// ======================================================================== No.56 极端主义：越讨论，越极端吗？
// 第七季·人和人之间的主义 ③。开头是一道选择题：观点相近的人放在一起讨论，讨论完会怎样？（Schkade, Sunstein & Hastie, 2007）
// 音乐：原创配乐（music.py，B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机从一个音往两边散开，越散越远。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 站队（每拍一个鼓点） · 53.33 回音（紧张） · 64.0 全貌（只剩钢琴） · 80.0 高潮：过犹不及 · 96.0 B 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), SIDE = BT(56), ECHO = BT(80), WHOLE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['讨论', 0, LIFT], ['两座城', LIFT, SIDE], ['站队', SIDE, ECHO], ['回音', ECHO, WHOLE], ['全貌', WHOLE, CLIMAX], ['过犹不及', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.56';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '把观点差不多的人，放在一起讨论。'],
  [4.1, 7.6, '讨论完，他们会变温和，还是更极端？先猜一个。'],
  [8.2, 10.4, '答案是 C：更极端了。'],
  [10.8, 13.3, '偏左的更左，偏右的更右；'],
  [13.6, 15.7, '而且组里的意见，更一致了。'],
  [16.3, 19.6, '研究者在美国科罗拉多州，找来 63 个人。'],
  [19.9, 23.7, '一座城偏左，一座城偏右，各自讨论三个热门话题。'],
  [24.0, 27.4, '讨论之后，连匿名写下的看法，也更极端了。'],
  [27.7, 31.3, '两座城之间的距离，被拉得更远。'],
  [31.6, 35.3, '「极端主义」，常常就是这样，一点点聊出来的。'],
  [37.6, 40.6, '心理学叫它「群体极化」。为什么会这样？'],
  [40.9, 44.6, '一是：群里听到的理由，大多站在同一边；'],
  [44.9, 48.6, '二是：谁都想显得，比别人更像“自己人”。'],
  [48.9, 52.9, '一来一回，整个群，就往边上挪了一步。'],
  [53.6, 57.6, '到了网上，我们更容易只关注想法相近的人：'],
  [57.9, 60.6, '越聊越确定，越确定越不想听别的；'],
  [60.8, 63.4, '最后，对面的人看起来，简直不可理喻。'],
  [64.3, 67.6, '所以，当你发现自己越来越确定，'],
  [67.9, 71.9, '可以去找一个想法不同、但讲道理的人聊聊。'],
  [72.2, 75.9, '不是为了被说服，是为了看见全貌。'],
  [76.3, 79.6, '两千多年前，孔子说：'],
  [84.9, 88.6, '走过了头，和走得不够，一样是偏了；'],
  [88.9, 92.6, '站在中间，不是没立场，是两头都看得见。'],
  [98.4, 103.0, '评论区：你有没有在一个群里，越聊越上头？'],
];
const BIGLINES = [
  [80.2, 92.6, '「过犹不及。」—— 孔子'],
  [93.4, 98.0, '多听一边，少偏一步。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [SIDE - .5, .2], [SIDE, .06], [WHOLE, .06],
  [WHOLE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、光谱、城市、天平、手机、回音圈
const PINK = '#f0a0a0', GOLD = '#ffd2a0', BLU = '#7fc8e3', ORG = '#ffb36b', GREYP = '#9aa3b2';
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3 / Math.max(.6, s); ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}
const X0 = 140, X1 = 940, posCol = x => mixc(BLU, ORG, (x - X0) / (X1 - X0));
function spectrum(y, a, labels = true) {                                                               // 一条从左到右的光谱
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; const g = ctx.createLinearGradient(X0, 0, X1, 0); g.addColorStop(0, BLU); g.addColorStop(.5, '#c3cad6'); g.addColorStop(1, ORG);
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(X0, y - 4, X1 - X0, 8, 4); ctx.fill();
  ctx.fillStyle = CREAM; ctx.fillRect(538, y - 14, 4, 28); ctx.restore();
  if (labels) { text('偏左', X0, y + 42, { font: SANS, size: 26, align: 'left', color: BLU, alpha: a }); text('偏右', X1, y + 42, { font: SANS, size: 26, align: 'right', color: ORG, alpha: a }); text('中间', 540, y + 42, { font: SANS, size: 22, align: 'center', color: DIM, alpha: a }); }
}
function city(x, y, s, a, col) {                                                                        // 一排楼的剪影
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 3;
  [[-110, 60, 90], [-50, 50, 150], [0, 60, 110], [60, 50, 170]].forEach(([bx, w, h]) => { ctx.beginPath(); ctx.rect(bx, -h, w, h); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; for (let i = 0; i < Math.floor(h / 30); i++) ctx.fillRect(bx + 10, -h + 14 + i * 30, 8, 8), ctx.fillRect(bx + w - 18, -h + 14 + i * 30, 8, 8); ctx.fillStyle = 'rgba(30,31,40,.96)'; });
  ctx.restore();
}
function bubble(x, y, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,31,40,.94)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - 34, y - 22, 68, 40, 16); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 8, y + 18); ctx.lineTo(x - 2, y + 30); ctx.lineTo(x + 6, y + 18); ctx.fill();
  ctx.fillStyle = col; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(x + i * 14, y - 2, 4, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ======================================================================== ① 讨论（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('把观点相近的人放在一起讨论：', 540, 452, { ...big, size: 40, weight: 700 }, 1, 1 - qOut);
  typeText('讨论完，会怎样？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const SY = 1160; spectrum(SY, 1);
  const move = E.io(prog(t, Q.REVEAL + .2, Q.REVEAL + 1.6)), move2 = E.io(prog(t, 10.9, 12.3)), tight = E.io(prog(t, 13.7, 14.9));
  const r = mulberry(5601);
  for (let i = 0; i < 6; i++) {                                                                         // 左边一组：讨论完往左挪，挤得更紧
    const off = (i - 2.5) * 54 * (1 - .45 * tight), x = lerp(400, 260, move) + off, y = 1070 + (i % 2) * 30;
    person(x, y, .56, 1, posCol(x));
    if (t < Q.REVEAL) bubble(x, y - 100, sstep(.3, .5, ((t * .7 + r()) % 1)) * (1 - sstep(.8, 1, ((t * .7 + r()) % 1))), posCol(x));
  }
  const R = sstep(10.8, 11.2, t);
  for (let i = 0; i < 6; i++) {
    const off = (i - 2.5) * 54 * (1 - .45 * tight), x = lerp(680, 820, move2) + off, y = 1070 + (i % 2) * 30;
    person(x, y, .56, R, posCol(x));
  }
  if (move > 0) {
    ctx.save(); ctx.globalAlpha = move * (1 - sstep(10.6, 11.0, t)); ctx.strokeStyle = BLU; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, 1220); ctx.lineTo(250 + 30, 1220); ctx.stroke(); ctx.restore();
    text('←', 255, 1222, { font: SANS, size: 36, align: 'center', color: BLU, alpha: move * (1 - sstep(10.6, 11.0, t)) });
  }
  text('C · 更极端', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('左的更左，右的更右', 540, 560, { font: SERIF, size: 58, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('组里的意见，也更一致了', 540, 650, { font: SERIF, size: 40, weight: 900, align: 'center', color: CREAM, alpha: sstep(13.7, 14.2, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 更温和', 200], ['B · 不变', 540], ['C · 更极端', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 两座城
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('极端主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EXTREMISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第七季 · 人和人之间的主义 ③', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneCities(t) {
  if (t < 19.7 || t > SIDE + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(SIDE - .6, SIDE - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('一座偏左，一座偏右', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('连匿名的看法，也更极端', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('距离，被拉远了', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    city(220, 1000, .9, D, BLU); city(860, 1000, .9, D, ORG);
    text('城 A · 偏左', 220, 1050, { font: SERIF, size: 28, weight: 900, align: 'center', color: BLU, alpha: D });
    text('城 B · 偏右', 860, 1050, { font: SERIF, size: 28, weight: 900, align: 'center', color: ORG, alpha: D });
    [['气候', 840], ['平权', 920], ['同性伴侣', 1000]].forEach(([s, y], i) => pill(s, 540, y, D * sstep(20.6 + i * .5, 21.0 + i * .5, t) * (1 - sstep(23.8, 24.2, t)), { size: 28 }));
    const S = D * sstep(24.1, 24.5, t), SY = 1200, mv = E.io(prog(t, 24.4, 26.6));
    if (S > 0) {
      spectrum(SY, S, false);
      const bx = lerp(410, 250, mv), ox = lerp(670, 830, mv);
      for (const [x0, x, col] of [[410, bx, BLU], [670, ox, ORG]]) {
        glow(x0, SY, 9, '195,202,214', S * .5 * mv, 3);
        ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = 'rgba(236,230,218,.92)'; ctx.fillRect(x - 30, SY - 100, 60, 70); ctx.restore();
        text('匿名', x, SY - 60, { font: SANS, size: 20, align: 'center', color: '#1a1b22', alpha: S });
        glow(x, SY, 10, col === BLU ? '127,200,227' : O_RGB, S, 5);
      }
      text('讨论前', 540, SY + 44, { font: SANS, size: 22, align: 'center', color: DIM, alpha: S * mv });
      const gap = D * sstep(27.8, 28.2, t);
      if (gap > 0) {
        drawOn(() => { ctx.moveTo(bx + 40, SY - 140); ctx.lineTo(ox - 40, SY - 140); }, ox - bx - 80, prog(t, 27.9, 28.8), GOLD, 4, gap, GOLD);
        text('◀', bx + 40, SY - 139, { font: SANS, size: 24, align: 'center', color: GOLD, alpha: gap }); text('▶', ox - 40, SY - 139, { font: SANS, size: 24, align: 'center', color: GOLD, alpha: gap });
      }
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('极端主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('常常是一点点聊出来的', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 站队
function sceneSide(t) {
  if (t < SIDE - .3 || t > ECHO + .2) return;
  const A = sstep(SIDE - .1, SIDE + .5, t) * (1 - sstep(ECHO - .6, ECHO - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - SIDE) / BEAT) % 1), beatN = Math.floor((t - SIDE) / BEAT);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('群体极化', 37.7, 40.6, GOLD, `rgba(${O_RGB},.4)`);
  hd('理由，都站在同一边', 41.0, 44.6, CREAM);
  hd('更像“自己人”一点', 45.0, 48.6, BLU);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('整个群，往边上挪一步', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: A * sstep(49.0, 49.5, t), glow: 'rgba(229,72,77,.4)', blur: 16 }); ctx.restore();
  typeText('GROUP POLARIZATION', 540, 724, { size: 26, weight: 600, font: LAT, ls: 8, color: DIM, align: 'center', spread: 2 }, prog(t, 37.9, 38.8), A * sstep(37.8, 38.1, t) * (1 - sstep(40.6, 41.0, t)));
  const B1 = A * sstep(37.9, 38.3, t) * (1 - sstep(40.6, 41.0, t));
  if (B1 > 0) { spectrum(1160, B1); for (let i = 0; i < 6; i++) { const x = 300 + i * 44; person(x, 1090 + (i % 2) * 20, .42, B1, posCol(x)); } }
  const S = A * sstep(41.0, 41.4, t) * (1 - sstep(44.6, 45.0, t));
  if (S > 0) {                                                                                          // 天平：理由一拍一张，全落在同一边
    const n = clamp(Math.floor((t - 41.2) / BEAT) + 1, 0, 6), tilt = -.05 * n - .02 * bk * (n > 0), cx = 540, cy = 1000;
    ctx.save(); ctx.globalAlpha = S; ctx.strokeStyle = CREAM; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, 1220); ctx.moveTo(cx - 80, 1220); ctx.lineTo(cx + 80, 1220); ctx.stroke();
    ctx.translate(cx, cy); ctx.rotate(tilt); ctx.beginPath(); ctx.moveTo(-280, 0); ctx.lineTo(280, 0); ctx.stroke();
    for (let i = 0; i < n; i++) { ctx.fillStyle = 'rgba(30,31,40,.96)'; ctx.strokeStyle = BLU; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(-270 + (i % 2) * 40, -34 - Math.floor(i / 2) * 30, 110, 26, 6); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    text('理由', cx - 240, 1120, { font: SANS, size: 26, align: 'center', color: BLU, alpha: S });
    text('另一边：空的', cx + 240, 1120, { font: SANS, size: 26, align: 'center', color: DIM, alpha: S });
  }
  const P = A * sstep(45.0, 45.4, t);
  if (P > 0) {                                                                                          // 一拍一个人往外站一步
    spectrum(1160, P);
    const shift = E.io(prog(t, 49.2, 50.6)) * 50, n = clamp(Math.floor((t - 45.2) / BEAT), 0, 5);
    for (let i = 0; i < 6; i++) {
      const out = Math.max(0, n - i + 1) * 0, step = i <= n ? (n - i + 1) * 0 : 0;
      const x = 480 - i * 40 - (i <= n ? 10 * (i + 1) : 0) - shift + (i === n ? 6 * bk : 0);
      person(x, 1090 + (i % 2) * 20, .42, P, posCol(x));
    }
    glow(480 - 2.5 * 40 - 35 - shift, 1160, 9, '127,200,227', P * sstep(49.2, 49.6, t), 4);
    if (t > 49.2) text('←', 480 - 2.5 * 40 - 35 - shift, 1220, { font: SANS, size: 36, align: 'center', color: PINK, alpha: P * sstep(49.2, 49.6, t) });
  }
}

// ======================================================================== ④ 回音
function sceneEcho(t) {
  if (t < ECHO - .3 || t > WHOLE + .2) return;
  const A = sstep(ECHO - .1, ECHO + .5, t) * (1 - sstep(WHOLE - .7, WHOLE - .1, t));
  if (A <= 0) return;
  text('只关注想法相近的人', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: BLU, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('越聊越确定', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('对面：不可理喻？', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: PINK, alpha: A * sstep(60.9, 61.4, t), glow: 'rgba(229,72,77,.4)', blur: 16 });
  const Ph = A * sstep(53.8, 54.3, t) * (1 - sstep(57.6, 58.0, t));
  if (Ph > 0) {
    ctx.save(); ctx.globalAlpha = Ph; ctx.fillStyle = 'rgba(20,21,28,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.7)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(380, 790, 320, 460, 36); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(396, 820, 288, 400, 12); ctx.clip();
    const off = ((t - 53.8) * 120) % 90;
    for (let i = -1; i < 6; i++) { const y = 830 + i * 90 - off; ctx.fillStyle = 'rgba(127,200,227,.16)'; ctx.fillRect(408, y, 264, 74); ctx.fillStyle = 'rgba(127,200,227,.8)'; ctx.beginPath(); ctx.arc(436, y + 37, 16, 0, TAU); ctx.fill(); ctx.fillRect(464, y + 22, 150, 10); ctx.fillRect(464, y + 42, 100, 8); }
    ctx.restore();
  }
  const Ch = A * sstep(58.0, 58.4, t);
  if (Ch > 0) {                                                                                         // 回音圈：一圈圈往里收
    const cx = 330, cy = 1060;
    for (let i = 0; i < 5; i++) { const p = ((t - 58.0) * .6 + i / 5) % 1, r = 200 * (1 - p) + 30; ctx.save(); ctx.globalAlpha = Ch * p * .8; ctx.strokeStyle = BLU; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy - 40, r, 0, TAU); ctx.stroke(); ctx.restore(); }
    person(cx, cy, .8, Ch, BLU);
    const sure = E.io(prog(t, 58.2, 60.4)) * .95;
    ctx.save(); ctx.globalAlpha = Ch * (1 - sstep(60.6, 61.0, t)); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(700, 840, 44, 340); ctx.fillStyle = BLU; ctx.fillRect(700, 1180 - 340 * sure, 44, 340 * sure); ctx.restore();
    text('确定', 722, 1222, { font: SANS, size: 26, align: 'center', color: BLU, alpha: Ch * (1 - sstep(60.6, 61.0, t)) });
    const O = A * sstep(60.9, 61.3, t);
    if (O > 0) {
      ctx.save(); ctx.globalAlpha = O * .6; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(600, 840); ctx.lineTo(600, 1220); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      ctx.save(); ctx.filter = 'blur(4px)'; person(800 + 4 * Math.sin(t * 13), 1060, .9, O, '#e5484d'); ctx.restore();
      ['?', '!', '?'].forEach((s, i) => text(s, 760 + i * 40, 900 - 10 * Math.sin(t * 5 + i), { font: SERIF, size: 44, weight: 900, align: 'center', color: PINK, alpha: O }));
    }
  }
}

// ======================================================================== ⑤ 全貌
function sceneWhole(t) {
  if (t < WHOLE - .2 || t > CLIMAX + .3) return;
  const A = sstep(WHOLE + .2, WHOLE + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('越来越确定的时候', 64.5, 67.6, CREAM);
  hd('找个讲道理的“对面”', 67.9, 71.9, ORG, `rgba(${O_RGB},.4)`);
  hd('为了看见全貌', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('两千多年前：', 76.4, 0, CREAM);
  const S1 = A * sstep(64.6, 65.1, t) * (1 - sstep(67.6, 68.0, t));
  if (S1 > 0) {
    ctx.save(); ctx.globalAlpha = S1; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(240, 990, 600, 44); ctx.fillStyle = BLU; ctx.fillRect(240, 990, 600 * .97, 44); ctx.restore();
    text('确定度 97%', 540, 960, { font: SERIF, size: 36, weight: 900, align: 'center', color: BLU, alpha: S1 });
    text('这时候，正适合停一下', 540, 1110, { font: SANS, size: 28, align: 'center', color: DIM, alpha: S1 * sstep(65.6, 66.0, t) });
  }
  const T2 = A * sstep(68.0, 68.5, t) * (1 - sstep(71.9, 72.3, t));
  if (T2 > 0) {
    ctx.save(); ctx.globalAlpha = T2; ctx.strokeStyle = 'rgba(195,202,214,.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, 1100); ctx.lineTo(680, 1100); ctx.moveTo(540, 1100); ctx.lineTo(540, 1200); ctx.stroke(); ctx.restore();
    person(330, 1120, 1.0, T2, BLU); person(750, 1120, 1.0, T2, ORG);
    const turn = Math.floor((t - 68.4) / 1.1) % 2;
    bubble(t > 68.4 ? (turn ? 690 : 390) : 390, 920, T2 * sstep(68.4, 68.7, t), turn ? ORG : BLU);
  }
  const P = A * sstep(72.4, 72.9, t);
  if (P > 0) {                                                                                          // 两半张画拼成一幅
    const j = E.io(prog(t, 73.0, 74.6)), gap = 120 * (1 - j);
    const half = (sx, side) => {
      ctx.save(); ctx.globalAlpha = P; ctx.beginPath(); ctx.rect(side < 0 ? 340 - gap : 540 + gap, 860, 200, 300); ctx.clip(); ctx.translate(side < 0 ? -gap : gap, 0);
      ctx.fillStyle = '#1d2433'; ctx.fillRect(340, 860, 400, 300);
      ctx.fillStyle = 'rgba(255,214,160,.9)'; ctx.beginPath(); ctx.arc(600, 940, 34, 0, TAU); ctx.fill();
      ctx.fillStyle = '#3a4a5c'; ctx.beginPath(); ctx.moveTo(340, 1160); ctx.lineTo(470, 990); ctx.lineTo(560, 1080); ctx.lineTo(640, 1010); ctx.lineTo(740, 1160); ctx.closePath(); ctx.fill();
      ctx.fillStyle = side < 0 ? 'rgba(127,200,227,.18)' : `rgba(${O_RGB},.18)`; ctx.fillRect(340, 860, 400, 300); ctx.restore();
    };
    half(0, -1); half(0, 1);
    ctx.save(); ctx.globalAlpha = P * (.5 + .5 * j); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.strokeRect(340 - gap, 860, 400 + 2 * gap, 300); ctx.restore();
    text('全貌', 540, 1210, { font: SERIF, size: 34, weight: 900, align: 'center', color: GOLD, alpha: P * j });
  }
}

// ======================================================================== ⑥ 过犹不及
function sceneFinale(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const SY = 1180; spectrum(SY, A, false);
  const px = 540, py = 820, damp = Math.exp(-(t - CLIMAX) / 4.5), ang = .62 * damp * Math.sin((t - CLIMAX) * 2.2);   // 一个摆，从这头荡到那头，慢慢停在中间
  const bx = px + 330 * Math.sin(ang), by = py + 330 * Math.cos(ang);
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
  glow(px, py, 6, '236,230,218', A, 2);
  const bc = mixc(BLU, ORG, .5 + .5 * Math.sin(ang) / .62);
  glow(bx, by, 22 + 10 * fin, damp > .25 ? (Math.sin(ang) < 0 ? '127,200,227' : O_RGB) : '255,214,160', A, 10);
  glow(540, SY, 10 + 20 * fin, '255,214,160', A * (1 - damp), 8);
  for (const [x, rgb] of [[X0 + 20, '127,200,227'], [X1 - 20, O_RGB]]) glow(x, SY, 8 + 6 * fin, rgb, A * (.4 + .6 * fin), 5);
  if (fin > 0) {
    text('←', 470, SY - 60, { font: SANS, size: 40, align: 'center', color: BLU, alpha: fin });
    text('→', 610, SY - 60, { font: SANS, size: 40, align: 'center', color: ORG, alpha: fin });
    for (let i = 0; i < 24; i++) { const r = mulberry(5400 + i), x = 380 + r() * 320, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1; glow(x + 16 * Math.sin(t + i), 1150 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3); }
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('过犹不及。', 540, 500, { ...big, size: 120, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 40 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('——《论语·先进》', 540, 630, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 1.9, CLIMAX + 2.5), qa);
  typeText('多听一边，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('少偏一步。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneCities(t); sceneSide(t); sceneEcho(t); sceneWhole(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2007', 'Schkade, Sunstein & Hastie · Calif Law Rev', 8.2, 35.3, T);
  stamp('1969', 'Moscovici & Zavalloni · J Pers Soc Psychol', 37.6, 52.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(56);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 B 小调里，最后一个和弦是 B 大调）
const NOTE = { B2: 123.47, D3: 146.83, Ds3: 155.56, Fs3: 185.00, B3: 246.94, D4: 293.66, Fs4: 369.99, B4: 493.88, D5: 587.33, Ds5: 622.25, Fs5: 739.99 };
const BM_SHIM = [NOTE.D5, NOTE.Fs4, NOTE.B4, NOTE.B3, NOTE.Fs3], B_SHIM = [NOTE.Ds5, NOTE.Fs4, NOTE.B4, NOTE.B3, NOTE.Fs3], BM_SWELL = [46.25, 61.74, 92.50, 123.47, 146.83];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.D5, gain: .05 }], [1.0, 'tink', { f: NOTE.B4, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.B2, NOTE.D3, NOTE.Fs3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Fs5, gain: .1 }]);
  c.push([Q.REVEAL + .3, 'whoosh', { dur: 1.2, gain: .1 }], [10.9, 'whoosh', { dur: 1.2, gain: .1 }], [13.8, 'tink', { f: NOTE.B4, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BM_SHIM, gain: .28 }]);
  c.push([20.6, 'page', { gain: .1 }], [21.1, 'page', { gain: .1 }], [21.6, 'page', { gain: .1 }], [24.4, 'whoosh', { dur: 2.0, gain: .1 }], [27.9, 'bar', { f0: 300, f1: 600, dur: .9, gain: .06 }], [31.7, 'page', { gain: .18 }]);
  c.push([SIDE, 'whoosh', { dur: .5, gain: .25 }]);
  for (let i = 0; i < 6; i++) c.push([41.2 + i * BEAT, 'thud', { gain: .05 + .008 * i }]);
  c.push([49.1, 'chord', { f: [NOTE.B2, NOTE.D3, NOTE.Fs3], gain: .1 }], [49.3, 'whoosh', { dur: 1.2, gain: .1 }]);
  c.push([ECHO, 'whoosh', { dur: .5, gain: .22 }], [58.0, 'riser', { dur: 2.4, gain: .08 }], [61.0, 'bar', { f0: 300, f1: 150, dur: 1.0, gain: .06 }]);
  c.push([64.7, 'tick', { gain: .12 }], [68.4, 'tink', { f: NOTE.B4, gain: .05 }], [69.5, 'tink', { f: NOTE.D5, gain: .05 }], [73.0, 'dust', { dur: 1.6, gain: .04 }], [74.6, 'tink', { f: NOTE.Fs5, gain: .06 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: BM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 61.74, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: B_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.B2, NOTE.Ds3, NOTE.Fs3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
