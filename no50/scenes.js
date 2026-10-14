// ======================================================================== No.50 英雄主义：人越多，越没人帮你？
// 第六季·日常里的主义 ⑦。开头是一道选择题：对讲机里有人突然发病，以为只有自己听见，和以为还有 4 个人也听见，哪种更会去帮？（Darley & Latané, 1968）
// 音乐：原创配乐（music.py，A 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一声呼救：三个音往上，再一个长音，没人回应；高潮时终于有人回应。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 烟（每拍一个鼓点） · 53.33 真实街头（紧张） · 64.0 点名（只剩钢琴） · 80.0 高潮：第一个人 · 96.0 A 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), SMOKE = BT(56), STREET = BT(80), NAME = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['一个人', 0, LIFT], ['旁观者', LIFT, SMOKE], ['烟', SMOKE, STREET], ['真实街头', STREET, NAME], ['点名', NAME, CLIMAX], ['第一个人', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.50';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '对讲机里，有人突然发病了。'],
  [4.1, 7.6, '只有你听见，还是 5 个人都听见？哪种更会去帮？先猜一个。'],
  [8.2, 10.4, '答案是：只有你听见的时候。'],
  [10.8, 13.3, '以为只有自己，约 85% 的人在发作结束前去帮忙；'],
  [13.6, 15.7, '以为还有 4 个人，只剩约 31%。'],
  [16.3, 19.6, '这是 1968 年，达利和拉塔内的实验。'],
  [19.9, 23.7, '人越多，每个人心里那份「该我去」就越少。'],
  [24.0, 27.4, '心理学家把这叫「责任分散」。'],
  [27.7, 31.3, '每个人都在等，等一个英雄出现。'],
  [31.6, 35.3, '这就是「英雄主义」的另一面：都盼着英雄，却没人先动。'],
  [37.6, 40.6, '他们还做过一个实验：房间里慢慢冒烟。'],
  [40.9, 44.6, '一个人在屋里时，大多数人会出去报告；'],
  [44.9, 48.6, '身边坐着两个毫无反应的人，只剩约一成。'],
  [48.9, 52.9, '别人不动，我们就以为：没事。'],
  [53.6, 57.6, '可真实的街头，没那么冷漠。'],
  [57.9, 60.6, '研究者看了 219 次街头冲突的监控：'],
  [60.8, 63.4, '十次里有九次，至少有一个人上前帮忙。'],
  [64.3, 67.6, '所以，如果你需要帮助，别对着人群喊；'],
  [67.9, 71.9, '指着一个人说：「穿蓝衣服的你，请帮我打 120。」'],
  [72.2, 75.9, '责任落到具体的人身上，他就更容易动起来。'],
  [76.3, 79.6, '有一句话说：'],
  [84.9, 88.6, '英雄，不用等别人；'],
  [88.9, 92.6, '你可以就是那第一个人。'],
  [98.4, 103.0, '评论区：你有没有当过那个「第一个站出来」的人？'],
];
const BIGLINES = [
  [80.2, 92.6, '「爱的反面不是恨，是冷漠。」—— 埃利·维瑟尔'],
  [93.4, 98.0, '别等英雄，你就是第一个。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [SMOKE - .5, .2], [SMOKE, .06], [NAME, .06],
  [NAME + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、对讲机、烟、监控、手指
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function lying(x, y, s, a, col = '#f0a0a0') {                                                      // 倒在地上的人
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.beginPath(); ctx.arc(-70, -18, 20, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-46, -36, 110, 40, 18); ctx.fill(); ctx.stroke(); ctx.restore();
}
function speaker(x, y, s, a, t, on = 1) {                                                          // 对讲机：一个喇叭和几圈声波
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(30,31,40,.96)';
  ctx.beginPath(); ctx.roundRect(-34, -50, 68, 100, 12); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-18, -26 + i * 14); ctx.lineTo(18, -26 + i * 14); ctx.stroke(); }
  ctx.strokeStyle = '#f0a0a0';
  for (let i = 0; i < 3; i++) { const p = ((t * .8) + i / 3) % 1; ctx.globalAlpha = a * on * (1 - p); ctx.beginPath(); ctx.arc(30, 0, 20 + p * 60, -.8, .8); ctx.stroke(); }
  ctx.restore();
}
function smoke(x, y, a, t, k) {                                                                    // 从通风口冒出的烟
  if (a <= 0) return;
  for (let i = 0; i < 14; i++) {
    const p = ((t * .25) + i / 14) % 1, r = mulberry(5100 + i);
    const px = x + (r() - .5) * 60 + Math.sin(t + i) * 30 * p, py = y + 240 * p, rad = 20 + 50 * p;
    ctx.save(); ctx.globalAlpha = a * k * (1 - p) * .35; ctx.fillStyle = '#c3cad6'; ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fill(); ctx.restore();
  }
}

// ======================================================================== ① 一个人（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('对讲机里有人发病：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('哪种更会去帮？', 540, 560, { ...big, size: 82, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t), rv = sstep(Q.REVEAL, Q.REVEAL + .5, t);
  if (P > 0) {
    const box = (x, stroke, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(14,15,20,.9)'; ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 190, 760, 380, 420, 18); ctx.fill(); ctx.stroke(); ctx.restore(); };
    box(300, rv > 0 ? `rgba(${O_RGB},${.4 + .6 * rv})` : 'rgba(236,230,218,.4)', P); box(780, 'rgba(236,230,218,.4)', P);
    speaker(300, 860, .9, P, t); speaker(780, 860, .9, P, t);
    person(300, 1110, 1.1, P, rv > 0 ? '#ffd2a0' : CREAM);
    [[700, 1060], [860, 1060], [700, 1150], [860, 1150]].forEach(([x, y]) => person(x, y, .55, P * .7, '#6f7786'));
    person(780, 1120, .8, P, CREAM);
    text('只有你', 300, 1230, { font: SERIF, size: 32, weight: 900, align: 'center', color: rv > 0 ? '#ffd2a0' : CREAM, alpha: P });
    text('还有 4 个人', 780, 1230, { font: SERIF, size: 32, weight: 900, align: 'center', color: CREAM, alpha: P });
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {
    const base = 1180, k1 = E.out(prog(t, 11.0, 12.0)), k2 = E.out(prog(t, 13.6, 14.4));
    ctx.save(); ctx.globalAlpha = C; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(200, base); ctx.lineTo(880, base); ctx.stroke();
    ctx.fillStyle = ORANGE; ctx.fillRect(220, base - 4.4 * 85 * k1, 160, 4.4 * 85 * k1); ctx.fillStyle = '#9aa3b2'; ctx.fillRect(700, base - 4.4 * 31 * k2, 160, 4.4 * 31 * k2); ctx.restore();
    text('约 85%', 300, base - 4.4 * 85 * k1 - 30, { font: SERIF, size: 42, weight: 900, align: 'center', color: '#ffd2a0', alpha: C * k1 });
    text('约 31%', 780, base - 4.4 * 31 * k2 - 30, { font: SERIF, size: 42, weight: 900, align: 'center', color: '#c3cad6', alpha: C * k2 });
    text('只有你', 300, base + 42, { font: SANS, size: 28, align: 'center', color: '#ffd2a0', alpha: C });
    text('还有 4 个人', 780, base + 42, { font: SANS, size: 28, align: 'center', color: '#c3cad6', alpha: C });
  }
  text('人越多，越没人帮', 540, 560, { font: SERIF, size: 62, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(10.9, 11.4, t), glow: 'rgba(229,72,77,.4)', blur: 14 });
  text('A · 只有你听见时', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 只有你听见时', 200], ['B · 五个人都听见时', 540], ['C · 差不多', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 责任分散
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('英雄主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('HEROISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 26, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ⑦', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
const RING = [0, 1, 2, 3, 4, 5, 6].map(i => { const a = -PI / 2 + (i - 3) * .42; return [540 + 300 * Math.cos(a), 1150 + 140 * Math.sin(a) - 120]; });
function sceneDiffuse(t) {
  if (t < 19.7 || t > SMOKE + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(SMOKE - .6, SMOKE - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('人越多，「该我去」越少', 540, 640, { font: SERIF, size: 50, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('责任分散', 540, 640, { font: SERIF, size: 58, weight: 900, align: 'center', color: '#ffd2a0', alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    text('都在等一个英雄', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#c3cad6', alpha: D * sstep(27.8, 28.3, t) });
    lying(540, 1240, 1.1, D);
    const n = 1 + Math.floor(6 * E.io(prog(t, 20.6, 23.0)));
    RING.forEach(([x, y], i) => {
      const order = [3, 2, 4, 1, 5, 0, 6].indexOf(i), a = D * (order < n ? 1 : 0) * sstep(20.2 + order * .3, 20.5 + order * .3, t);
      person(x, y + 120, .8, a, '#c3cad6');
      if (a > 0) glow(x, y + 30, 14 / Math.sqrt(n), O_RGB, a * (1.2 / Math.sqrt(n)), 4);
      if (a > 0 && t > 27.8) text('…', x, y - 10, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#9aa3b2', alpha: a * sstep(27.9 + order * .1, 28.3 + order * .1, t) });
    });
    text(n === 1 ? '「该我去」：全部' : `每个人只剩 1/${n}`, 540, 760, { font: SANS, size: 28, align: 'center', color: '#ffd2a0', alpha: D * sstep(20.4, 20.8, t) * (1 - sstep(27.4, 27.8, t)) });
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('英雄主义的另一面', 540, 860, { ...big, size: 74, weight: 900 }, prog(t, 31.7, 32.6), F);
  typeText('都盼着英雄，却没人先动', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#f0a0a0', spread: 4 }, prog(t, 32.3, 33.3), F);
}

// ======================================================================== ③ 烟：别人不动，就以为没事
function sceneSmoke(t) {
  if (t < SMOKE - .3 || t > STREET + .2) return;
  const A = sstep(SMOKE - .1, SMOKE + .5, t) * (1 - sstep(STREET - .6, STREET - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - SMOKE) / BEAT) % 1);
  text('房间里慢慢冒烟', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('别人不动 = 没事？', 0, 0, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#f0a0a0', alpha: A * sstep(48.9, 49.4, t), glow: 'rgba(229,72,77,.4)', blur: 16 }); ctx.restore();
  const room = (x, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(14,15,20,.9)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - 200, 740, 400, 440, 18); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(236,230,218,.25)'; for (let i = 0; i < 4; i++) ctx.fillRect(x - 40 + i * 22, 760, 12, 30); ctx.restore(); };
  const L = A * sstep(40.9, 41.4, t), R = A * sstep(44.9, 45.4, t);
  room(300, A); smoke(300, 790, A, t, sstep(38.0, 40.0, t));
  const leave = E.io(prog(t, 42.2, 43.4));
  person(lerp(300, 440, leave), 1120, 1.0, A, L > 0 ? '#7fe3d3' : CREAM);
  text('大多数人：出去报告', 300, 1230, { font: SANS, size: 26, align: 'center', color: '#7fe3d3', alpha: L });
  room(780, R); smoke(780, 790, R, t, 1);
  person(700, 1110, .8, R * .8, '#6f7786'); person(860, 1110, .8, R * .8, '#6f7786'); person(780, 1130, 1.0, R, '#f0a0a0');
  text('约一成', 780, 1230, { font: SANS, size: 26, align: 'center', color: '#f0a0a0', alpha: R * sstep(45.6, 46.0, t) });
  text('两个人毫无反应', 780, 980, { font: SANS, size: 24, align: 'center', color: '#9aa3b2', alpha: R * sstep(45.2, 45.6, t) });
}

// ======================================================================== ④ 真实街头：十次里九次，有人上前
function sceneStreet(t) {
  if (t < STREET - .3 || t > NAME + .2) return;
  const A = sstep(STREET - .1, STREET + .5, t) * (1 - sstep(NAME - .7, NAME - .1, t));
  if (A <= 0) return;
  text('真实的街头', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('219 次冲突', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('十次里，九次有人上前', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * sstep(60.9, 61.4, t), glow: `rgba(${T_RGB},.4)`, blur: 14 });
  const S = A * (1 - sstep(60.5, 60.9, t));
  if (S > 0) {                                                                                       // 监控画面
    ctx.save(); ctx.globalAlpha = S; ctx.fillStyle = 'rgba(20,28,26,.9)'; ctx.strokeStyle = 'rgba(236,230,218,.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(140, 740, 800, 500, 14); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(127,227,211,.06)'; ctx.lineWidth = 1; for (let y = 744; y < 1240; y += 6) { ctx.beginPath(); ctx.moveTo(144, y); ctx.lineTo(936, y); ctx.stroke(); } ctx.restore();
    glow(190, 790, 7, '229,72,77', S * (.5 + .5 * Math.round((t * 1.5) % 1)), 2);
    text('REC', 210, 798, { font: LAT, size: 26, weight: 700, color: '#f0a0a0', alpha: S });
    person(480, 1120, .9, S, '#f0a0a0'); person(600, 1120, .9, S, '#f0a0a0');
    const step = E.io(prog(t, 55.4, 56.6));
    person(lerp(300, 420, step), 1150, .8, S, step > .5 ? '#7fe3d3' : '#9aa3b2'); person(800, 1150, .8, S, '#9aa3b2'); person(860, 1170, .8, S * .8, '#9aa3b2');
  }
  const G = A * sstep(60.9, 61.4, t);
  for (let i = 0; i < 10; i++) {
    const x = 210 + i * 73, ok = i < 9, a = G * sstep(61.1 + i * .08, 61.4 + i * .08, t);
    person(x, 1080, .6, a, ok ? '#7fe3d3' : '#6f7786');
  }
  text('至少一个人上前', 540, 1180, { font: SANS, size: 28, align: 'center', color: '#7fe3d3', alpha: G * sstep(62.0, 62.4, t) });
}

// ======================================================================== ⑤ 点名：穿蓝衣服的你
function sceneName(t) {
  if (t < NAME - .2 || t > CLIMAX + .3) return;
  const A = sstep(NAME + .2, NAME + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('别对着人群喊', 64.5, 67.6, CREAM);
  hd('指着一个人', 67.9, 71.9, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('责任落到一个人身上', 72.3, 76.0, '#ffd2a0', `rgba(${O_RGB},.4)`);
  hd('有一句话：', 76.4, 0, CREAM);
  const crowd = [[220, 1000], [360, 980], [500, 1000], [640, 980], [780, 1000], [880, 990]];
  const pick = 4, lit = sstep(68.6, 69.2, t), move = E.io(prog(t, 72.6, 74.0));
  crowd.forEach(([x, y], i) => person(i === pick ? lerp(x, 620, move) : x, i === pick ? lerp(y, 1180, move) : y, .75, A, i === pick && lit > .5 ? '#6fb7ff' : '#9aa3b2'));
  lying(520, 1250, 1.0, A);
  const shout = A * sstep(64.6, 65.0, t) * (1 - sstep(67.6, 68.0, t));
  for (let i = 0; i < 3; i++) { const p = ((t * .9) + i / 3) % 1; ctx.save(); ctx.globalAlpha = shout * (1 - p); ctx.strokeStyle = '#f0a0a0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(440, 1210, 30 + p * 200, -2.6, -.5); ctx.stroke(); ctx.restore(); }
  const pt = A * sstep(68.0, 68.5, t) * (1 - sstep(72.2, 72.6, t));
  if (pt > 0) {
    drawOn(() => { ctx.moveTo(470, 1200); ctx.lineTo(760, 1010); }, 350, E.io(prog(t, 68.0, 68.6)), '#6fb7ff', 4, pt, 'rgba(111,183,255,.6)');
    pill('穿蓝衣服的你，请帮我打 120', 540, 860, pt * sstep(68.6, 69.0, t), { size: 30, stroke: 'rgba(111,183,255,.8)', color: '#a9d3ff' });
  }
}

// ======================================================================== ⑥ 第一个人：一个人上前，其他人跟上
function sceneFirst(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1100, 760);
  const first = E.io(prog(t, CLIMAX + .6, CLIMAX + 2.0)), up = E.io(prog(t, FINAL - .5, FINAL + 1.0));
  RING.forEach(([x, y], i) => {
    const order = [3, 2, 4, 1, 5, 0, 6].indexOf(i), go = i === 3 ? first : E.io(prog(t, 86.0 + order * .9, 87.2 + order * .9));
    const tx = 540 + (x - 540) * .85, ty = y + 120 + 60;
    person(lerp(x, tx, go), lerp(y + 120, ty, go), .8, A, go > .5 ? '#ffd2a0' : '#9aa3b2');
    if (go > .5) glow(lerp(x, tx, go), lerp(y + 30, ty - 90, go), 10, O_RGB, A * go * .8, 4);
  });
  if (up < .5) lying(540, 1240, 1.1, A * (1 - 2 * up)); else person(540, 1250, 1.0, A * (2 * up - 1), '#ffd2a0');
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const r = mulberry(5200 + i), x = 300 + r() * 480, sp = 30 + r() * 40, p = ((t - FINAL) * sp / 420 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1250 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('爱的反面不是恨，', 540, 450, { ...big, size: 60, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('是冷漠。', 540, 566, { ...big, size: 80, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.5, CLIMAX + 2.3), qa);
  typeText('—— 埃利·维瑟尔', 540, 650, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.5, CLIMAX + 3.0), qa);
  typeText('别等英雄，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('你就是第一个。', 540, 596, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneDiffuse(t); sceneSmoke(t); sceneStreet(t); sceneName(t); sceneFirst(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 68.0, 72, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1968', 'Darley & Latané · JPSP', 8.2, 35.3, T);
  stamp('1968', 'Latané & Darley · JPSP', 37.6, 52.9, T);
  stamp('2020', 'Philpot et al. · American Psychologist', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(50);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 A 小调里，最后一个和弦是 A 大调）
const NOTE = { A3: 220.00, C4: 261.63, Cs4: 277.18, E4: 329.63, A4: 440.00, C5: 523.25, Cs5: 554.37, E5: 659.25, A5: 880.00, C6: 1046.50, Cs6: 1108.73 };
const AM_SHIM = [NOTE.C6, NOTE.E5, NOTE.A5, NOTE.A4, NOTE.E4], AMAJ_SHIM = [NOTE.Cs6, NOTE.E5, NOTE.A5, NOTE.A4, NOTE.E4], AM_SWELL = [55.00, 82.41, 110.00, 130.81, 164.81];
function CUES() {
  const c = [];
  c.push([.3, 'drone', { dur: 2.4, gain: .05 }], [1.2, 'tink', { f: NOTE.E5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.A3, NOTE.C4, NOTE.E4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.E5, gain: .1 }]);
  c.push([11.0, 'bar', { f0: 220, f1: 440, dur: 1.0, gain: .07 }], [13.6, 'bar', { f0: 220, f1: 262, dur: .8, gain: .07 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: AM_SHIM, gain: .28 }]);
  for (let i = 0; i < 7; i++) c.push([20.2 + i * .3, 'click', { gain: .06 }]);
  c.push([24.1, 'drone', { dur: 3.2, gain: .04 }], [27.9, 'dust', { dur: 1.2, gain: .04 }], [31.7, 'page', { gain: .18 }]);
  c.push([SMOKE, 'whoosh', { dur: .5, gain: .25 }], [38.0, 'air', { dur: 4, hum: 110, gain: .06 }], [42.2, 'swish', { gain: .08 }], [45.0, 'air', { dur: 3.5, hum: 110, gain: .06 }]);
  c.push([49.0, 'chord', { f: [NOTE.A3, NOTE.C4, NOTE.E4], gain: .1 }], [49.1, 'tink', { f: NOTE.C6, gain: .07 }]);
  c.push([STREET, 'whoosh', { dur: .5, gain: .22 }], [55.4, 'swish', { gain: .07 }], [58.0, 'tick', { gain: .2 }]);
  for (let i = 0; i < 9; i++) c.push([61.1 + i * .08, 'tink', { f: [NOTE.A4, NOTE.C5, NOTE.E5][i % 3], gain: .04 }]);
  c.push([64.6, 'drone', { dur: 2.6, gain: .05 }], [68.0, 'swish', { gain: .08 }], [68.7, 'tink', { f: NOTE.E5, gain: .07 }], [72.6, 'whoosh', { dur: .8, gain: .1 }]);
  c.push([76.4, 'page', { gain: .16 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: AM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: AM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 110, gain: .14 }], [CLIMAX + .6, 'swish', { gain: .1 }]);
  for (let i = 0; i < 6; i++) c.push([86.0 + i * .9, 'tink', { f: [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.A5, NOTE.C6, NOTE.E5][i], gain: .05 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: AMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.A3, NOTE.Cs4, NOTE.E4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
