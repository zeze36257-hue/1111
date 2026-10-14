// ======================================================================== No.48 自我中心主义：真的有那么多人在看你吗？
// 第六季·日常里的主义 ⑤。开头是一道选择题：穿一件尴尬的 T 恤走进教室，穿的人猜约一半人注意到了，实际呢？（Gilovich, Medvec & Savitsky, 2000）
// 音乐：原创配乐（music.py，升 C 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机像一束聚光灯：一个长长的高音，绕着它轻轻一闪，再落下来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 透明（每拍一个鼓点） · 53.33 告诉他（紧张） · 64.0 没那么亮（只剩钢琴） · 80.0 高潮：灯光散开 · 96.0 升 C 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), CLEAR = BT(56), TELL = BT(80), DIM2 = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['T 恤', 0, LIFT], ['聚光灯', LIFT, CLEAR], ['透明', CLEAR, TELL], ['告诉他', TELL, DIM2], ['没那么亮', DIM2, CLIMAX], ['自在', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.48';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '穿一件很尴尬的 T 恤，走进一间满是人的教室。'],
  [4.1, 7.6, '你会觉得有多少人注意到了？实际上呢？先猜一个。'],
  [8.2, 10.4, '答案是：不到四分之一。'],
  [10.8, 13.3, '穿的人以为，大约一半人看见了；'],
  [13.6, 15.7, '实际记得的，只有约 23%。'],
  [16.3, 19.6, '这是 2000 年，康奈尔的吉洛维奇做的实验。'],
  [19.9, 23.7, '他把这叫「聚光灯效应」：'],
  [24.0, 27.4, '我们总觉得自己站在舞台中央，灯只照着自己。'],
  [27.7, 31.3, '可别人，也都在忙着照自己。'],
  [31.6, 35.3, '这就是「自我中心主义」：把自己，看得比在别人眼里更大。'],
  [37.6, 40.6, '不只是衣服。'],
  [40.9, 44.6, '上台发言时，你以为紧张全写在脸上；'],
  [44.9, 48.6, '可听的人，往往看不出来。'],
  [48.9, 52.9, '心理学家把这叫「透明度错觉」。'],
  [53.6, 57.6, '有意思的是：'],
  [57.9, 60.6, '只要提前告诉演讲的人这一点，'],
  [60.8, 63.4, '他们就没那么紧张，讲得也更好。'],
  [64.3, 67.6, '所以，下次觉得「所有人都在看我」，'],
  [67.9, 71.9, '记得：大多数人，正忙着担心自己。'],
  [72.2, 75.9, '你的灯，没你想的那么亮。'],
  [76.3, 79.6, '有一句老话说：'],
  [84.9, 88.6, '没那么多人在看你，'],
  [88.9, 92.6, '所以，你可以更自在一点。'],
  [98.4, 103.0, '评论区：你有过哪次「全世界都在看我」的尴尬？'],
];
const BIGLINES = [
  [80.2, 92.6, '「要是你知道别人很少想到你，就不会那么在意别人怎么想你。」—— 奥林·米勒（大意）'],
  [93.4, 98.0, '没人在看，就大胆一点。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [CLEAR - .5, .2], [CLEAR, .06], [DIM2, .06],
  [DIM2 + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、T 恤、聚光灯、脸
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function tee(x, y, s, a, col = '#ffd2a0') {                                                        // 穿着印了一张大脸的 T 恤
  if (a <= 0) return;
  person(x, y, s, a, col);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -8, 17, 0, TAU); ctx.stroke();
  ctx.fillStyle = col; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 6, -12, 2, 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, -4, 8, .2, PI - .2); ctx.stroke(); ctx.restore();
}
function spot(x, y0, y1, w, a, rgb = '255,226,180') {                                             // 一束光：从 (x, y0) 照到 y1 的地面
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a;
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, `rgba(${rgb},.02)`); g.addColorStop(1, `rgba(${rgb},.22)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 14, y0); ctx.lineTo(x + 14, y0); ctx.lineTo(x + w, y1); ctx.lineTo(x - w, y1); ctx.closePath(); ctx.fill();
  const e = ctx.createRadialGradient(x, y1, 0, x, y1, w); e.addColorStop(0, `rgba(${rgb},.35)`); e.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = e; ctx.beginPath(); ctx.ellipse(x, y1, w, w * .22, 0, 0, TAU); ctx.fill(); ctx.restore();
}
function head(x, y, r, a, mood, col = CREAM) {                                                     // mood：1 紧张（冒汗、脸红）→ 0 平静
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(30,31,40,.96)';
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  if (mood > 0) { ctx.fillStyle = `rgba(229,72,77,${.35 * mood})`; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sx * r * .5, y + r * .2, r * .2, r * .12, 0, 0, TAU); ctx.fill(); } }
  ctx.fillStyle = col; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(x + sx * r * .35, y - r * .15, r * (.07 + .04 * mood), 0, TAU); ctx.fill(); }
  ctx.beginPath(); if (mood > .5) { ctx.moveTo(x - r * .3, y + r * .45); for (let i = 1; i <= 6; i++) ctx.lineTo(x - r * .3 + i * r * .1, y + r * .45 + (i % 2 ? -1 : 1) * r * .06); }
  else { ctx.moveTo(x - r * .28, y + r * .38); ctx.quadraticCurveTo(x, y + r * .55, x + r * .28, y + r * .38); } ctx.stroke();
  if (mood > 0) { ctx.fillStyle = `rgba(159,208,255,${mood})`; ctx.beginPath(); ctx.ellipse(x + r * .8, y - r * .5, r * .08, r * .13, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
const CROWD = []; for (let row = 0; row < 2; row++) for (let i = 0; i < 7; i++) CROWD.push([180 + i * 120 + (row ? 60 : 0), 1100 + row * 86]);

// ======================================================================== ① T 恤（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('穿的人猜：约一半人注意到', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('实际有多少？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t), rv = sstep(Q.REVEAL, Q.REVEAL + .5, t);
  if (P > 0) {
    spot(540, 660, 1000, 140, P);
    tee(540, 985, 1.3, P);
    const noticed = [1, 5, 9, 12];
    CROWD.forEach(([x, y], i) => person(x, y + 40, .55, P * .9, noticed.includes(i) && rv > 0 ? '#ffd2a0' : '#6f7786'));
      noticed.forEach(i => glow(CROWD[i][0], CROWD[i][1] - 50, 6, O_RGB, P * rv, 3));
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {
    const ring2 = (x, v, k, rgb, lab, col, a) => {
      ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.arc(x, 980, 130, 0, TAU); ctx.stroke();
      ctx.strokeStyle = `rgba(${rgb},.95)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(x, 980, 130, -PI / 2, -PI / 2 + TAU * v * k); ctx.stroke(); ctx.restore();
      text(`${Math.round(v * 100 * k)}%`, x, 1000, { font: LAT, size: 64, weight: 700, align: 'center', color: col, alpha: a });
      text(lab, x, 1170, { font: SERIF, size: 34, weight: 900, align: 'center', color: col, alpha: a });
    };
    ring2(300, .5, E.out(prog(t, 11.0, 12.0)), '154,163,178', '以为', '#c3cad6', C);
    ring2(780, .23, E.out(prog(t, 13.6, 14.4)), O_RGB, '实际', '#ffd2a0', C * sstep(13.6, 14.0, t));
  }
  text('以为约一半，实际约 23%', 540, 560, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('B · 不到四分之一', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 约一半', 200], ['B · 不到四分之一', 540], ['C · 几乎所有人', 880]].forEach(([s, x]) => pill(s, x, 1340 - 50, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 聚光灯效应 · 每个人都在照自己
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('自我中心主义', 540, 900, { size: 132, weight: 900, align: 'center', ls: 20, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EGOCENTRISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ⑤', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneSpot(t) {
  if (t < 19.7 || t > CLEAR + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(CLEAR - .6, CLEAR - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('聚光灯效应', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * (1 - sstep(27.4, 27.8, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    text('别人，也在照自己', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#7fe3d3', alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${T_RGB},.4)`, blur: 14 });
    const own = sstep(27.9, 29.0, t), stage = sstep(24.0, 24.6, t);
    ctx.save(); ctx.globalAlpha = D * stage; ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(540, 1010, 240, 34, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    spot(540, 660, 1005, 140, D * (1 - .55 * own));
    tee(540, 990, 1.3, D);
    CROWD.forEach(([x, y], i) => {
      const a = D * sstep(28.0 + i * .08, 28.4 + i * .08, t);
      if (a > 0) spot(x, y - 140, y + 40, 40, a * .9, '180,240,230');
      person(x, y + 40, .55, D * .9, a > .5 ? '#7fe3d3' : '#6f7786');
    });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('自我中心主义', 540, 860, { ...big, size: 72, weight: 900 }, prog(t, 31.7, 32.6), F);
  typeText('把自己，看得比在别人眼里更大', 540, 970, { size: 34, weight: 500, font: SERIF, align: 'center', color: '#ffd2a0', spread: 4 }, prog(t, 32.3, 33.3), F);
}

// ======================================================================== ③ 透明：你以为写在脸上
function sceneClear(t) {
  if (t < CLEAR - .3 || t > TELL + .2) return;
  const A = sstep(CLEAR - .1, CLEAR + .5, t) * (1 - sstep(TELL - .6, TELL - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - CLEAR) / BEAT) % 1);
  text('上台发言', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('透明度错觉', 0, 0, { font: SERIF, size: 56, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(48.9, 49.4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 }); ctx.restore();
  const L = A * sstep(41.0, 41.5, t), R = A * sstep(45.0, 45.5, t);
  frameBox(300, 960, 320, 330, L, 'rgba(229,72,77,.6)');
  head(300, 950, 90, L, 1);
  text('你以为', 300, 760, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#f0a0a0', alpha: L });
  text('紧张全写在脸上', 300, 1170, { font: SANS, size: 26, align: 'center', color: '#f0a0a0', alpha: L });
  frameBox(780, 960, 320, 330, R, `rgba(${T_RGB},.6)`);
  head(780, 950, 90, R, .1);
  text('别人看到', 780, 760, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#7fe3d3', alpha: R });
  text('看不太出来', 780, 1170, { font: SANS, size: 26, align: 'center', color: '#7fe3d3', alpha: R });
  const S = A * (1 - sstep(40.7, 41.1, t));
  if (S > 0) {
    ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = 'rgba(216,176,122,.2)'; ctx.strokeStyle = '#d8b07a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(470, 1130); ctx.lineTo(610, 1130); ctx.lineTo(590, 1260); ctx.lineTo(490, 1260); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    person(540, 1110, 1.2, S, '#ffd2a0');
    for (let i = 0; i < 3; i++) { const p = ((t - 37.4) * 1.2 + i / 3) % 1; ctx.save(); ctx.globalAlpha = S * (1 - p) * .8; ctx.strokeStyle = '#f0a0a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 960, 40 + p * 90, -2.4, -.7); ctx.stroke(); ctx.restore(); }
  }
}
function frameBox(x, y, w, h, a, stroke) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(14,15,20,.9)'; ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 18); ctx.fill(); ctx.stroke(); ctx.restore();
}

// ======================================================================== ④ 告诉他：提前说一句
function sceneTell(t) {
  if (t < TELL - .3 || t > DIM2 + .2) return;
  const A = sstep(TELL - .1, TELL + .5, t) * (1 - sstep(DIM2 - .7, DIM2 - .1, t));
  if (A <= 0) return;
  text('提前告诉他一句', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) });
  const card = A * sstep(57.9, 58.4, t), slide = E.out(prog(t, 57.9, 58.8));
  ctx.save(); ctx.globalAlpha = card; ctx.translate(lerp(900, 640, slide), 840); ctx.rotate(-.05); ctx.fillStyle = 'rgba(236,230,218,.94)'; ctx.fillRect(-190, -60, 380, 120); ctx.restore();
  ctx.save(); ctx.translate(lerp(900, 640, slide), 840); ctx.rotate(-.05);
  text('你的紧张，', 0, -14, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#1a1b22', alpha: card });
  text('别人看不太出来', 0, 30, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#1a1b22', alpha: card }); ctx.restore();
  const calm = sstep(60.8, 61.8, t);
  person(330, 1180, 1.25, A, calm > .5 ? '#7fe3d3' : '#ffd2a0');
  const ar = (x, up, lab, col, a) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 12;
    const y0 = up ? 1170 : 1030, y1 = up ? 1030 : 1170;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.moveTo(x - 24, y1 + (up ? 24 : -24)); ctx.lineTo(x, y1); ctx.lineTo(x + 24, y1 + (up ? 24 : -24)); ctx.stroke(); ctx.restore();
    text(lab, x, 1230, { font: SERIF, size: 34, weight: 900, align: 'center', color: col, alpha: a });
  };
  ar(640, false, '紧张', '#7fe3d3', A * sstep(61.0, 61.4, t));
  ar(820, true, '讲得更好', '#ffd2a0', A * sstep(61.6, 62.0, t));
  text('（示意）', 730, 1280, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: A * sstep(61.6, 62.0, t) });
}

// ======================================================================== ⑤ 没那么亮：大家都在担心自己
function sceneDim(t) {
  if (t < DIM2 - .2 || t > CLIMAX + .3) return;
  const A = sstep(DIM2 + .2, DIM2 + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('「所有人都在看我」？', 64.5, 67.6, CREAM);
  hd('大家都在担心自己', 67.9, 71.9, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('你的灯，没那么亮', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('有一句老话：', 76.4, 0, CREAM);
  const dim = sstep(72.3, 74.0, t);
  spot(540, 660, 1005, 140, A * (1 - .7 * dim));
  tee(540, 990, 1.3, A);
  CROWD.forEach(([x, y], i) => {
    const b = A * sstep(68.0 + i * .1, 68.4 + i * .1, t);
    person(x, y + 40, .55, A * .9, b > .5 ? '#7fe3d3' : '#6f7786');
    if (b > 0 && i < 7) { const s = ['我呢？', '头发？', '说错了？', '我呢？', '衣服？', '我呢？', '脸红？'][i % 7]; text(s, x, y - 50, { font: SANS, size: 20, align: 'center', color: '#7fe3d3', alpha: b * .9 }); }
  });
}

// ======================================================================== ⑥ 自在：灯光散开，照到每个人
function sceneFree(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t), wide = E.io(prog(t, CLIMAX + .5, CLIMAX + 3.5));
  warmth(A * (.6 + .6 * wide + .5 * fin), 540, 1100, 500 + 400 * wide);
  spot(540, 660, 1005, lerp(140, 520, wide), A * (1 - .5 * wide));
  tee(540, 990, 1.3, A);
  CROWD.forEach(([x, y]) => person(x, y + 40, .55, A * .9, wide > .5 ? '#ffd2a0' : '#6f7786'));
  if (fin > 0) for (let i = 0; i < 26; i++) {
    const r = mulberry(4900 + i), x = 160 + r() * 760, sp = 30 + r() * 40, p = ((t - FINAL) * sp / 460 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1280 - p * 460, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('要是你知道别人很少想到你，', 540, 440, { ...big, size: 48, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('就不会那么在意', 540, 536, { ...big, size: 54, weight: 900 }, prog(t, CLIMAX + 1.7, CLIMAX + 2.4), qa);
  typeText('「别人怎么想你」。', 540, 628, { ...big, size: 60, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.3), qa);
  typeText('—— 奥林·米勒（大意）', 540, 704, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.5, CLIMAX + 4.1), qa);
  typeText('没人在看，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('就大胆一点。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneSpot(t); sceneClear(t); sceneTell(t); sceneDim(t); sceneFree(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 68.0, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2000', 'Gilovich, Medvec & Savitsky · JPSP', 8.2, 35.3, T);
  stamp('1998', 'Gilovich, Savitsky & Medvec · JPSP', 37.6, 52.9, T);
  stamp('2003', 'Savitsky & Gilovich · J Exp Soc Psychol', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(48);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在升 C 小调里，最后一个和弦是升 C 大调）
const NOTE = { Cs4: 277.18, E4: 329.63, F4: 349.23, Gs4: 415.30, Cs5: 554.37, E5: 659.25, F5: 698.46, Gs5: 830.61, Cs6: 1108.73, E6: 1318.51, F6: 1396.91 };
const CSM_SHIM = [NOTE.E6, NOTE.Gs5, NOTE.Cs6, NOTE.Cs5, NOTE.Gs4], CSMAJ_SHIM = [NOTE.F6, NOTE.Gs5, NOTE.Cs6, NOTE.Cs5, NOTE.Gs4], CSM_SWELL = [69.30, 103.83, 138.59, 164.81, 207.65];
function CUES() {
  const c = [];
  c.push([.3, 'whoosh', { dur: .6, gain: .1 }], [.5, 'tink', { f: NOTE.Gs5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Cs4, NOTE.E4, NOTE.Gs4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.Gs5, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 277, f1: 415, dur: 1.0, gain: .07 }], [13.6, 'bar', { f0: 277, f1: 330, dur: .8, gain: .07 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: CSM_SHIM, gain: .28 }]);
  c.push([20.2, 'whoosh', { dur: .6, gain: .1 }], [24.1, 'swish', { gain: .06 }], [28.0, 'dust', { dur: 1.6, gain: .06 }], [28.6, 'tink', { f: NOTE.E5, gain: .06 }], [31.7, 'page', { gain: .18 }]);
  c.push([CLEAR, 'whoosh', { dur: .5, gain: .25 }], [41.0, 'drone', { dur: 3.4, gain: .05 }], [45.0, 'tink', { f: NOTE.Cs5, gain: .06 }]);
  c.push([49.0, 'chord', { f: [NOTE.Cs4, NOTE.E4, NOTE.Gs4], gain: .1 }], [49.1, 'tink', { f: NOTE.Cs6, gain: .07 }]);
  c.push([TELL, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'page', { gain: .16 }], [61.0, 'bar', { f0: 415, f1: 277, dur: .8, gain: .07 }], [61.6, 'bar', { f0: 277, f1: 554, dur: .8, gain: .07 }]);
  c.push([64.6, 'tink', { f: NOTE.Gs4, gain: .06 }], [68.0, 'dust', { dur: 2.0, gain: .05 }], [72.3, 'swish', { gain: .08 }]);
  c.push([76.4, 'page', { gain: .16 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: CSM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: CSM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 138.59, gain: .14 }], [CLIMAX + .6, 'whoosh', { dur: 2.5, gain: .12 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: CSMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Cs4, NOTE.F4, NOTE.Gs4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
