// ======================================================================== No.52 最大化主义：选最好的，就会最开心吗？
// 第六季·日常里的主义 ⑨。开头是一道选择题：找工作时非要找到“最好”那份的人，起薪会怎样？（Iyengar, Wells & Schwartz, 2006）
// 音乐：原创配乐（music.py，D 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一串停不下来的八分音符，高潮才落成长音。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 永远在下一个（每拍一个鼓点） · 53.33 满意即可（紧张） · 64.0 够好（只剩钢琴） · 80.0 高潮：停下 · 96.0 D 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), NEXT = BT(56), SIMON = BT(80), ENOUGH = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['起薪', 0, LIFT], ['两种人', LIFT, NEXT], ['下一个', NEXT, SIMON], ['满意即可', SIMON, ENOUGH], ['够好', ENOUGH, CLIMAX], ['停下', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.52';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '找工作时，非要找到「最好」那份的人，'],
  [4.1, 7.6, '起薪会比别人高、低，还是差不多？先猜一个。'],
  [8.2, 10.4, '答案是：高约两成。'],
  [10.8, 13.3, '可是，他们对拿到的工作，反而更不满意；'],
  [13.6, 15.7, '找工作的过程，也更焦虑、更累。'],
  [16.3, 19.6, '心理学家施瓦茨，把人大致分成两种：'],
  [19.9, 23.7, '一种是「最大化者」：每个选项都要比一遍，非要最好的。'],
  [24.0, 27.4, '另一种是「满意者」：碰到够好的，就收手。'],
  [27.7, 31.3, '最大化者常常选得更好，却不一定过得更开心。'],
  [31.6, 35.3, '这就是「最大化主义」：只有最好，才算对。'],
  [37.6, 40.6, '问题在于，「最好」永远在下一个。'],
  [40.9, 44.6, '你选了这个，脑子里还在想那些没选的；'],
  [44.9, 48.6, '选项越多，没选的越多，后悔也越多。'],
  [48.9, 52.9, '研究发现：越想要最好的人，往往后悔更多、幸福感更低。'],
  [53.6, 57.6, '诺贝尔奖得主西蒙，提出过另一条路：'],
  [57.9, 60.6, '先定一个「够好」的标准，'],
  [60.8, 63.4, '碰到了，就停。他叫它「满意即可」。'],
  [64.3, 67.6, '所以，下次挑到停不下来时，'],
  [67.9, 71.9, '先问自己：我的「够好」，是什么？'],
  [72.2, 75.9, '找到了，就别再回头看。'],
  [76.3, 79.6, '两百多年前，伏尔泰写过：'],
  [84.9, 88.6, '追求最好，没有错；'],
  [88.9, 92.6, '可停不下来，好的也会变得不够好。'],
  [98.4, 103.0, '评论区：你是「最大化者」，还是「满意者」？'],
];
const BIGLINES = [
  [80.2, 92.6, '「最好，是好的敌人。」—— 伏尔泰'],
  [93.4, 98.0, '找到够好的，就停下。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [NEXT - .5, .2], [NEXT, .06], [ENOUGH, .06],
  [ENOUGH + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 卡片、人、脸、勾
const MAXC = '#ffb36b', SATC = '#7fe3d3', PINK = '#f0a0a0', GREYB = '#9aa3b2';
function card(x, y, s, a, o = {}) {                                                                 // 一个选项：卡片，底下一条“分数”
  if (a <= 0) return;
  const { hi = 0, score = .6, ghost = false } = o;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (hi > 0) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 26 * hi; }
  ctx.fillStyle = ghost ? 'rgba(30,31,40,.4)' : 'rgba(30,31,40,.96)'; ctx.strokeStyle = hi > 0 ? `rgba(255,200,140,${.45 + .55 * hi})` : 'rgba(195,202,214,.6)'; ctx.lineWidth = 3;
  if (ghost) ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.roundRect(-60, -80, 120, 160, 16); ctx.fill(); ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(236,230,218,.35)'; ctx.fillRect(-40, -54, 80, 10); ctx.fillRect(-40, -34, 56, 10); ctx.fillRect(-40, -14, 68, 10);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(-40, 34, 80, 14);
  ctx.fillStyle = hi > 0 ? '#ffd2a0' : 'rgba(195,202,214,.7)'; ctx.fillRect(-40, 34, 80 * score, 14);
  ctx.restore();
}
function tick(x, y, s, a, col = SATC, k = 1) {                                                     // 勾，k 控制画到哪
  if (a <= 0) return;
  drawOn(() => { ctx.moveTo(x - 22 * s, y); ctx.lineTo(x - 6 * s, y + 18 * s); ctx.lineTo(x + 26 * s, y - 20 * s); }, 80 * s, k, col, 7 * s, a, col);
}
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function mood(x, y, r, a, k, col) {                                                                 // 小脸：k = 1 笑，k = -1 不开心
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = 'rgba(16,17,23,.95)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(x + sx * r * .36, y - r * .18, r * .1, 0, TAU); ctx.fill(); }
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r * .4, y + r * .32); ctx.quadraticCurveTo(x, y + r * .32 + k * r * .38, x + r * .4, y + r * .32); ctx.stroke(); ctx.restore();
}

// ======================================================================== ① 起薪（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('非要找到“最好”那份工作的人：', 540, 452, { ...big, size: 42, weight: 700 }, 1, 1 - qOut);
  typeText('起薪会怎样？', 540, 560, { ...big, size: 82, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(Q.REVEAL - .2, Q.REVEAL + .3, t);
  if (P > 0) {
    const r = mulberry(5201), cur = Math.floor(t / BEAT) % 5;                                       // 一拍跳一张，停不下来
    for (let i = 0; i < 5; i++) card(140 + i * 200, 960, 1.05, P, { hi: i === cur ? 1 : 0, score: .35 + .55 * r() });
    text('最好的？', 140 + cur * 200, 830, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: P });
  }
  const C = sstep(Q.REVEAL + .2, Q.REVEAL + .7, t);
  if (C > 0) {
    const base = 1190, k1 = E.out(prog(t, Q.REVEAL + .3, Q.REVEAL + 1.3)), k2 = E.out(prog(t, 11.0, 12.0)), C2 = sstep(10.9, 11.3, t);
    const bar = (x, h, col, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(x - 46, base - h, 92, h); ctx.restore(); };
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(170, base); ctx.lineTo(910, base); ctx.stroke(); ctx.restore();
    bar(265, 250 * k1, GREYB, C); bar(385, 300 * k1, MAXC, C);
    text('+20%', 385, base - 300 * k1 - 26, { font: SERIF, size: 40, weight: 900, align: 'center', color: MAXC, alpha: C * k1 });
    text('起薪', 325, base + 44, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: C });
    bar(695, 280 * k2, GREYB, C2); bar(815, 190 * k2, PINK, C2);
    text('↓', 815, base - 190 * k2 - 26, { font: SERIF, size: 48, weight: 900, align: 'center', color: PINK, alpha: C2 * k2 });
    text('满意度', 755, base + 44, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: C2 });
    const L = sstep(Q.REVEAL + .4, Q.REVEAL + .8, t);
    ctx.save(); ctx.globalAlpha = L; ctx.fillStyle = GREYB; ctx.fillRect(278, 1278, 22, 22); ctx.fillStyle = MAXC; ctx.fillRect(578, 1278, 22, 22); ctx.restore();
    text('够好就行', 312, 1298, { font: SANS, size: 26, color: DIM, alpha: L });
    text('非要最好', 612, 1298, { font: SANS, size: 26, color: DIM, alpha: L });
  }
  text('钱更多，却更不满意', 540, 560, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('找工作的过程，也更焦虑、更累', 540, 650, { font: SANS, size: 30, align: 'center', color: PINK, alpha: sstep(13.7, 14.2, t) });
  text('C · 高约 20%', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 低一点', 200], ['B · 差不多', 540], ['C · 高约 20%', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 两种人
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('最大化主义', 540, 900, { size: 140, weight: 900, align: 'center', ls: 20, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('MAXIMIZING', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ⑨', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneTypes(t) {
  if (t < 19.7 || t > NEXT + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(NEXT - .6, NEXT - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('每个都要比一遍', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: MAXC, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('碰到够好的，就收手', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: SATC, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('选得更好，不一定更开心', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const L = D * sstep(20.0, 20.5, t), R = D * sstep(24.1, 24.6, t), r = mulberry(5202);
    const sc = [.4 + .5 * r(), .4 + .5 * r(), .4 + .5 * r(), .4 + .5 * r()];
    person(300, 960, 1.0, L, MAXC);
    text('最大化者', 300, 1040, { font: SERIF, size: 34, weight: 900, align: 'center', color: MAXC, alpha: L });
    const cur = t < 20.4 ? -1 : Math.floor((t - 20.4) / (BEAT / 2)) % 4;                            // 半拍跳一张：一直在比
    for (let i = 0; i < 4; i++) card(195 + i * 70, 1170, .5, L, { hi: i === cur && t < 27.8 ? 1 : 0, score: sc[i] });
    person(780, 960, 1.0, R, SATC);
    text('满意者', 780, 1040, { font: SERIF, size: 34, weight: 900, align: 'center', color: SATC, alpha: R });
    const pick = Math.min(2, Math.floor(Math.max(0, t - 24.6) / .5)), done = sstep(25.6, 25.9, t);
    for (let i = 0; i < 4; i++) card(675 + i * 70, 1170, .5, R * (i > 2 ? 1 - .7 * done : 1), { hi: i === pick && t > 24.6 ? 1 : 0, score: [.5, .55, .75, .6][i], ghost: i > 2 && done > .5 });
    tick(815, 1098, .8, R * done, SATC, prog(t, 25.6, 26.1));
    const M = D * sstep(28.0, 28.5, t);
    mood(300, 760, 32, M, -.5, MAXC); mood(780, 760, 32, M, 1, SATC);
    text('选得更好 ↑', 300, 1270, { font: SANS, size: 26, align: 'center', color: MAXC, alpha: D * sstep(28.4, 28.8, t) });
    text('更满意 ↑', 780, 1270, { font: SANS, size: 26, align: 'center', color: SATC, alpha: D * sstep(28.8, 29.2, t) });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('最大化主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('只有最好，才算对', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: MAXC, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 永远在下一个
function sceneNext(t) {
  if (t < NEXT - .3 || t > SIMON + .2) return;
  const A = sstep(NEXT - .1, NEXT + .5, t) * (1 - sstep(SIMON - .6, SIMON - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - NEXT) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('“最好”永远在下一个', 37.7, 40.6, CREAM);
  hd('选了这个，还在想那些', 41.0, 44.6, MAXC);
  hd('选项越多，后悔越多', 45.0, 48.6, PINK);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('后悔更多，幸福感更低', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: A * sstep(49.0, 49.5, t), glow: 'rgba(229,72,77,.4)', blur: 16 }); ctx.restore();
  const r = mulberry(5203), scores = Array.from({ length: 12 }, () => .35 + .55 * r());
  const run = (t - NEXT) * 170;
  const belt = A * (1 - sstep(40.7, 41.2, t));
  if (belt > 0) {                                                                                     // 传送带：卡片一直往左走，右边那格永远亮着
    ctx.save(); ctx.globalAlpha = belt; ctx.strokeStyle = `rgba(255,200,140,${.5 + .4 * bk})`; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.roundRect(800, 890, 160, 210, 20); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    text('最好？', 880, 860, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#ffd2a0', alpha: belt });
    for (let i = 0; i < 8; i++) {
      const x = 1250 - ((run + i * 200) % 1600);
      const hi = 1 - clamp(Math.abs(x - 880) / 90, 0, 1);
      card(x, 995, 1.05, belt * (x < 760 ? .55 : 1), { hi, score: scores[i] });
    }
  }
  const Ch = A * sstep(40.9, 41.4, t) * (1 - sstep(48.7, 49.1, t));
  if (Ch > 0) {
    const nG = Math.round(lerp(4, 16, E.io(prog(t, 45.0, 47.6))));
    for (let i = 0; i < nG; i++) {
      const ang = -PI / 2 + i * TAU / Math.max(4, nG) + .3, rad = i < 4 ? 270 : 230 + 90 * ((i * 37) % 7) / 7;
      const gx = 540 + rad * Math.cos(ang), gy = 1010 + rad * .85 * Math.sin(ang), ga = Ch * (i < 4 ? sstep(41.6 + i * .3, 42.0 + i * .3, t) : sstep(45.0 + (i - 4) * .18, 45.4 + (i - 4) * .18, t));
      card(gx + 6 * Math.sin(t * 1.3 + i), gy + 6 * Math.cos(t * 1.1 + i), .55, ga * .8, { ghost: true, score: scores[i % 12] });
    }
    card(540, 1010, 1.25, Ch, { hi: .6, score: .7 });
    tick(540, 1010 - 120, 1, Ch, SATC, prog(t, 41.2, 41.7));
    const rg = E.io(prog(t, 45.2, 48.2));                                                             // 后悔计
    ctx.save(); ctx.globalAlpha = Ch * sstep(45.0, 45.4, t); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(966, 820, 44, 380);
    ctx.fillStyle = PINK; ctx.fillRect(966, 1200 - 380 * rg, 44, 380 * rg); ctx.restore();
    text('后悔', 988, 1240, { font: SANS, size: 26, align: 'center', color: PINK, alpha: Ch * sstep(45.0, 45.4, t) });
  }
  const S = A * sstep(49.2, 49.7, t);
  [['后悔 ↑', 920, 49.4], ['幸福感 ↓', 1060, 49.9], ['生活满意度 ↓', 1200, 50.4]].forEach(([s, y, t0]) => pill(s, 540, y, S * sstep(t0, t0 + .4, t), { size: 38, stroke: 'rgba(240,160,160,.8)', color: PINK }));
  text('相关研究：不等于“想要最好”就一定导致不开心', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: S * sstep(50.6, 51.0, t) });
}

// ======================================================================== ④ 满意即可
function sceneSimon(t) {
  if (t < SIMON - .3 || t > ENOUGH + .2) return;
  const A = sstep(SIMON - .1, SIMON + .5, t) * (1 - sstep(ENOUGH - .7, ENOUGH - .1, t));
  if (A <= 0) return;
  text('另一条路', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('先定一个“够好”', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: SATC, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('满意即可', 540, 640, { font: SERIF, size: 62, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(60.9, 61.4, t), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  typeText('SATISFICING = satisfy + suffice', 540, 724, { size: 26, weight: 600, font: LAT, ls: 4, color: DIM, align: 'center', spread: 2 }, prog(t, 61.5, 62.5), A * sstep(61.4, 61.8, t));
  const N = A * sstep(53.8, 54.3, t) * (1 - sstep(57.6, 58.0, t));
  if (N > 0) {
    person(540, 1000, 1.2, N, CREAM);
    text('赫伯特·西蒙', 540, 1110, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: N });
    text('诺贝尔经济学奖 · 1978', 540, 1170, { font: SANS, size: 28, align: 'center', color: DIM, alpha: N * sstep(54.4, 54.8, t) });
    text('1956 年提出“满意即可”', 540, 1220, { font: SANS, size: 28, align: 'center', color: DIM, alpha: N * sstep(54.8, 55.2, t) });
  }
  const G = A * sstep(58.0, 58.4, t);
  if (G > 0) {
    const base = 1200, thr = base - 210;
    drawOn(() => { ctx.moveTo(150, thr); ctx.lineTo(930, thr); }, 780, prog(t, 58.1, 58.9), SATC, 3, G, SATC);
    text('够好', 186, thr - 18, { font: SERIF, size: 30, weight: 900, align: 'center', color: SATC, alpha: G });
    ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, base); ctx.lineTo(930, base); ctx.stroke(); ctx.restore();
    const ts = [58.5, 59.5, 60.6], sc = [.45, .6, .86], stopK = sstep(60.9, 61.3, t);
    for (let i = 0; i < 6; i++) {
      const x = 220 + i * 136;
      if (i < 3) {
        const k = E.out(prog(t, ts[i], ts[i] + .5)), h = 300 * sc[i] * k, on = i === 2;
        ctx.save(); ctx.globalAlpha = G * sstep(ts[i], ts[i] + .2, t); ctx.fillStyle = on ? SATC : GREYB;
        if (on) { ctx.shadowColor = `rgba(${T_RGB},.8)`; ctx.shadowBlur = 24 * stopK; }
        ctx.fillRect(x - 40, base - h, 80, h); ctx.restore();
      } else {
        ctx.save(); ctx.globalAlpha = G * .5 * (1 - .8 * stopK); ctx.strokeStyle = 'rgba(195,202,214,.5)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
        ctx.strokeRect(x - 40, base - 260, 80, 260); ctx.setLineDash([]); ctx.restore();
        text('?', x, base - 120, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#6f7786', alpha: G * .6 * (1 - stopK) });
      }
    }
    tick(492, base - 300 * .86 - 50, 1, G * stopK, SATC, prog(t, 60.9, 61.4));
    text('停', 492, base + 52, { font: SERIF, size: 40, weight: 900, align: 'center', color: SATC, alpha: G * stopK });
    text('不用看完', 764, base + 52, { font: SANS, size: 28, align: 'center', color: DIM, alpha: G * sstep(61.6, 62.0, t) });
  }
}

// ======================================================================== ⑤ 我的“够好”
function sceneEnough(t) {
  if (t < ENOUGH - .2 || t > CLIMAX + .3) return;
  const A = sstep(ENOUGH + .2, ENOUGH + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('挑到停不下来时', 64.5, 67.6, MAXC);
  hd('我的“够好”，是什么？', 67.9, 71.9, SATC, `rgba(${T_RGB},.4)`);
  hd('找到了，就别回头', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('两百多年前：', 76.4, 0, CREAM);
  const ph = A * sstep(64.6, 65.2, t) * (1 - sstep(67.6, 68.0, t));                                  // 手机：一直往下刷
  if (ph > 0) {
    ctx.save(); ctx.globalAlpha = ph; ctx.fillStyle = 'rgba(20,21,28,.96)'; ctx.strokeStyle = 'rgba(195,202,214,.7)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(380, 790, 320, 460, 36); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(396, 820, 288, 400, 12); ctx.clip();
    const off = ((t - 64.6) * 260) % 90, r = mulberry(5205);
    for (let i = -1; i < 6; i++) {
      const y = 830 + i * 90 - off;
      ctx.fillStyle = 'rgba(236,230,218,.08)'; ctx.fillRect(408, y, 264, 74);
      ctx.fillStyle = 'rgba(236,230,218,.4)'; ctx.fillRect(420, y + 14, 120 + 80 * r(), 10); ctx.fillRect(420, y + 34, 90, 8);
      ctx.fillStyle = 'rgba(255,179,107,.8)'; ctx.fillRect(420, y + 52, 100 * r(), 8);
    }
    ctx.restore();
    text('↓', 760, 1040, { font: SERIF, size: 60, weight: 900, align: 'center', color: MAXC, alpha: ph * (.5 + .5 * Math.sin(t * 8)) });
  }
  const note = A * sstep(68.0, 68.5, t) * (1 - sstep(71.9, 72.3, t));                                // 纸条：先写下“够好”
  if (note > 0) {
    ctx.save(); ctx.globalAlpha = note; ctx.fillStyle = 'rgba(236,230,218,.94)'; ctx.fillRect(310, 800, 460, 420); ctx.restore();
    text('我的“够好”：', 350, 870, { font: SERIF, size: 36, weight: 900, color: '#1a1b22', alpha: note });
    [['必须有的', 960], ['不能接受的', 1060], ['到这就够的', 1160]].forEach(([s, y], i) => {
      const k = sstep(68.6 + i * .6, 69.0 + i * .6, t);
      ctx.save(); ctx.globalAlpha = note; ctx.strokeStyle = 'rgba(26,27,34,.6)'; ctx.lineWidth = 3; ctx.strokeRect(350, y - 30, 36, 36); ctx.restore();
      text(s, 410, y, { font: SERIF, size: 32, weight: 900, color: '#1a1b22', alpha: note });
      ctx.save(); ctx.globalAlpha = note; ctx.strokeStyle = 'rgba(26,27,34,.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(600, y + 4); ctx.lineTo(730, y + 4); ctx.stroke(); ctx.restore();
      drawOn(() => { ctx.moveTo(352, y - 12); ctx.lineTo(366, y + 2); ctx.lineTo(392, y - 34); }, 70, k, '#0f766e', 6, note);
    });
  }
  const go = A * sstep(72.4, 72.9, t);                                                                // 选好了：别的卡片退到后面
  if (go > 0) {
    const back = E.io(prog(t, 73.2, 75.4)), r = mulberry(5206);
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue;
      const x0 = 160 + i * 190, x = lerp(x0, 540 + (x0 - 540) * 1.3, back), y = 1010 - 60 * back;
      card(x, y, 1.0 - .35 * back, go * (1 - .8 * back), { score: .35 + .5 * r() });
    }
    card(540, 1010 + 20 * back, 1.0 + .25 * back, go, { hi: .4 + .6 * back, score: .75 });
    tick(540, 860 - 10 * back, 1, go * sstep(72.8, 73.2, t), SATC, prog(t, 72.8, 73.3));
  }
}

// ======================================================================== ⑥ 停下
function sceneStop(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const ease = E.out(prog(t, CLIMAX, CLIMAX + 4.0)), settle = sstep(CLIMAX + 3.4, CLIMAX + 4.4, t), r = mulberry(5207);
  for (let i = -3; i < 13; i++) {                                                                     // 卡片慢慢停住，正中那张留下
    const sc = .35 + .55 * r(), x = 540 + (i - 8 * ease) * 230;
    if (x < -120 || x > 1200 || i === 8) continue;
    card(x, 1040, 1.2, A * (1 - .7 * settle), { score: sc });
  }
  glow(540, 1040, 120 * (1 + .3 * fin), O_RGB, A * settle * (.35 + .25 * fin), 8);
  card(540 + (8 - 8 * ease) * 230, 1040, 1.2 + .1 * settle, A, { hi: settle, score: .78 });
  tick(540, 880, 1.1, A * settle, SATC, prog(t, CLIMAX + 3.8, CLIMAX + 4.4));
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const rr = mulberry(5400 + i), x = 400 + rr() * 280, sp = 30 + rr() * 40, p = ((t - FINAL) * sp / 420 + rr()) % 1;
    glow(x + 16 * Math.sin(t + i), 1150 - p * 420, 2 + 2 * rr(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('最好，', 540, 440, { ...big, size: 64, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.0), qa);
  typeText('是好的敌人。', 540, 552, { ...big, size: 72, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.1, CLIMAX + 2.2), qa);
  typeText('—— 伏尔泰', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.4, CLIMAX + 3.0), qa);
  typeText('找到够好的，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('就停下。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneTypes(t); sceneNext(t); sceneSimon(t); sceneEnough(t); sceneStop(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2006', 'Iyengar, Wells & Schwartz · Psychol Sci', 8.2, 15.9, T);
  stamp('2002', 'Schwartz et al. · J Pers Soc Psychol', 16.3, 35.3, T);
  stamp('2002', 'Schwartz et al. · J Pers Soc Psychol', 48.9, 52.9, T);
  stamp('1956', 'Simon · Psychological Review', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(52);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 D 小调里，最后一个和弦是 D 大调）
const NOTE = { D3: 146.83, F3: 174.61, Fs3: 185.00, A3: 220.00, D4: 293.66, F4: 349.23, Fs4: 369.99, A4: 440.00, D5: 587.33, F5: 698.46, Fs5: 739.99, A5: 880.00 };
const DM_SHIM = [NOTE.F5, NOTE.A4, NOTE.D5, NOTE.D4, NOTE.A3], DMAJ_SHIM = [NOTE.Fs5, NOTE.A4, NOTE.D5, NOTE.D4, NOTE.A3], DM_SWELL = [36.71, 55.00, 73.42, 87.31, 110.00];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.A4, gain: .05 }], [1.0, 'tink', { f: NOTE.D5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.D3, NOTE.F3, NOTE.A3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.A4, gain: .1 }]);
  c.push([Q.REVEAL + .3, 'bar', { f0: 147, f1: 294, dur: 1.0, gain: .06 }], [11.0, 'bar', { f0: 294, f1: 175, dur: 1.0, gain: .07 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: DM_SHIM, gain: .28 }]);
  c.push([20.0, 'page', { gain: .12 }], [24.1, 'page', { gain: .12 }], [25.6, 'tink', { f: NOTE.D5, gain: .07 }], [28.0, 'tink', { f: NOTE.F4, gain: .05 }], [31.7, 'page', { gain: .18 }]);
  c.push([NEXT, 'whoosh', { dur: .5, gain: .25 }], [41.2, 'tink', { f: NOTE.D5, gain: .06 }], [45.0, 'dust', { dur: 2.4, gain: .05 }]);
  c.push([49.0, 'chord', { f: [NOTE.D3, NOTE.F3, NOTE.A3], gain: .1 }], [49.1, 'tink', { f: NOTE.F5, gain: .07 }]);
  c.push([SIMON, 'whoosh', { dur: .5, gain: .22 }], [58.1, 'tick', { gain: .2 }], [58.5, 'thud', { gain: .06 }], [59.5, 'thud', { gain: .06 }], [60.6, 'thud', { gain: .07 }]);
  c.push([60.9, 'tink', { f: NOTE.A4, gain: .06 }], [61.2, 'tink', { f: NOTE.D5, gain: .06 }]);
  c.push([64.6, 'dust', { dur: 2.6, gain: .04 }], [68.6, 'tink', { f: NOTE.D4, gain: .05 }], [69.2, 'tink', { f: NOTE.F4, gain: .05 }], [69.8, 'tink', { f: NOTE.A4, gain: .05 }], [72.4, 'page', { gain: .18 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: DM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: DM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 73.42, gain: .14 }]);
  for (let i = 0; i < 5; i++) c.push([CLIMAX + 1.1 + i * .65, 'tink', { f: [NOTE.A4, NOTE.D5, NOTE.F5, NOTE.A5, NOTE.D5][i], gain: .05 }]);
  c.push([CLIMAX + 3.9, 'tink', { f: NOTE.D5, gain: .07 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: DMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.D3, NOTE.Fs3, NOTE.A3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
