// ======================================================================== No.32 实用主义：明知是假的，还有用吗？
// 第四季·你身上的主义 ⑨。开头是一道选择题：医生明说“这是安慰剂”，你照吃三周，会好一点吗？（开放标签安慰剂，Kaptchuk et al., 2010）
// 音乐：原创配乐（music.py，C 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机问了两次：同一个音敲两下，往下沉三度，再往上爬。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 詹姆斯（每拍一个鼓点） · 53.33 代价（紧张） · 64.0 断崖（只剩钢琴） · 80.0 高潮：起跳 · 96.0 C 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), JAMES = BT(56), PRICE = BT(80), LEAP = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['安慰剂', 0, LIFT], ['假喷雾', LIFT, JAMES], ['詹姆斯', JAMES, PRICE], ['代价', PRICE, LEAP], ['断崖', LEAP, CLIMAX], ['信念', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.32';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '医生直接告诉你：这是安慰剂，里面没有任何药。'],
  [4.1, 7.6, '你照着吃三周，会好一点吗？先猜一个。'],
  [8.2, 10.4, '真有人做了这个实验。'],
  [10.8, 13.3, '吃的人，约六成说明显缓解；'],
  [13.6, 15.7, '什么都不吃的，约三成五。'],
  [16.3, 19.6, '这叫「开放标签安慰剂」：明说是假药。'],
  [19.9, 23.7, '这是 2010 年哈佛的研究，只有 80 个病人，样本不大。'],
  [24.0, 27.4, '可它改变的，到底是什么？'],
  [27.7, 31.3, '哮喘实验里，用假喷雾的人，觉得好多了；'],
  [31.6, 35.3, '可测出来的肺功能，跟不治疗的人一样。'],
  [37.6, 40.6, '哲学家詹姆斯，是「实用主义」的代表。'],
  [40.9, 44.6, '他认为：一个想法算不算「真」，要看它管不管用。'],
  [44.9, 48.6, '按这个标准，安慰剂好像真的「有用」。'],
  [48.9, 52.9, '可是，感觉好了，不等于病好了。'],
  [53.6, 57.6, '安慰剂治不了肿瘤，也杀不死病毒。'],
  [57.9, 63.4, '一项研究里，只用替代疗法的癌症病人，死亡风险约是 2.5 倍。'],
  [64.3, 67.6, '所以，明知是假的，还有用吗？'],
  [67.9, 71.9, '对感受，常常有用；对病本身，往往没用。'],
  [72.2, 75.9, '詹姆斯举过一个例子：山路断了，只能跳过去。'],
  [76.3, 79.6, '你越相信自己跳得过，脚下越有力气。'],
  [84.9, 88.6, '信念治不好病，'],
  [88.9, 92.6, '却能决定，你怎么迈出下一步。'],
  [98.4, 103.0, '评论区：你吃过最管用的「安慰剂」是什么？'],
];
const BIGLINES = [
  [80.2, 92.6, '「相信生活值得过，你的信念，会帮你把它变成事实。」—— 威廉·詹姆斯'],
  [93.4, 98.0, '病，交给证据；路，交给信念。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [JAMES - .5, .2], [JAMES, .06], [LEAP, .06],
  [LEAP + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 药瓶、胶囊、人
function bottle(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(30,34,44,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.85)'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(236,230,218,.25)'; ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.roundRect(-96, -120, 192, 260, 26); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-58, -156, 116, 40, 6); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.roundRect(-68, -200, 136, 50, 10); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 8; i++) ctx.fillRect(-60 + i * 16, -196, 5, 42);
  ctx.fillStyle = 'rgba(240,234,220,.95)'; ctx.fillRect(-82, -50, 164, 140);
  ctx.restore();
  text('安慰剂', x, y - 16 * s, { font: SERIF, size: 40 * s, weight: 900, align: 'center', color: '#1a1410', alpha: a });
  text('PLACEBO', x, y + 26 * s, { font: LAT, size: 22 * s, weight: 700, align: 'center', color: '#5a4a36', alpha: a, ls: 3 });
  text('不含任何药物成分', x, y + 62 * s, { font: SANS, size: 17 * s, weight: 500, align: 'center', color: '#5a4a36', alpha: a });
}
function capsule(x, y, rot, a, s = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(240,234,220,.95)'; ctx.beginPath(); ctx.roundRect(-30, -13, 60, 26, 13); ctx.fill();
  ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.roundRect(-30, -13, 30, 26, [13, 0, 0, 13]); ctx.fill();
  ctx.restore();
}
function person(x, y, s, a, col = CREAM, sy = 1, fill = 'rgba(16,17,23,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = fill;
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function mark(ok, x, y, a, r = 26) {                                                          // ✓ 或 ✗
  if (a <= 0) return;
  const col = ok ? TEAL : '#e5484d';
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 16;
  ctx.beginPath();
  if (ok) { ctx.moveTo(x - r, y); ctx.lineTo(x - r * .3, y + r * .7); ctx.lineTo(x + r, y - r * .7); }
  else { ctx.moveTo(x - r * .7, y - r * .7); ctx.lineTo(x + r * .7, y + r * .7); ctx.moveTo(x + r * .7, y - r * .7); ctx.lineTo(x - r * .7, y + r * .7); }
  ctx.stroke(); ctx.restore();
}
function bar(x, base, w, h, rgb, a) {
  if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgba(${rgb},.88)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14; ctx.fillRect(x - w / 2, base - h, w, h); ctx.restore();
}
let PILLS = [];

// ======================================================================== ① 安慰剂（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('医生明说：这是安慰剂。', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('吃了，会好吗？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const bOut = sstep(10.6, 11.1, t), shake = Math.sin(t * 9) * 3 * (1 - sstep(.3, 1.6, t));
  bottle(540 + shake, 930, 1.15, 1 - bOut);
  PILLS.forEach((p, i) => {                                                                  // 瓶子倒出来的几颗胶囊
    const k = E.out(prog(t, .3 + i * .12, 1.3 + i * .12));
    capsule(lerp(540, p.x, k), lerp(1000, p.y, k), p.rot * k, (1 - bOut) * k);
  });
  text('B · 会好一点', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const ca = sstep(10.8, 11.3, t);                                                           // 说“明显缓解”的人
  if (ca > 0) {
    const base = 1240, g1 = E.out(prog(t, 11.0, 12.2)), g2 = E.out(prog(t, 13.7, 14.9));
    text('说“明显缓解”的人', 540, 540, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: ca });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, ca);
    bar(380, base, 150, 560 * .59 * g1, O_RGB, ca); bar(700, base, 150, 560 * .35 * g2, '154,163,178', ca);
    text('约六成', 380, base - 560 * .59 * g1 - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: ca * sstep(11.6, 12.0, t) });
    text('约三成五', 700, base - 560 * .35 * g2 - 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#c3cad6', alpha: ca * sstep(14.2, 14.6, t) });
    text('明知是安慰剂', 380, base + 40, { font: SANS, size: 28, align: 'center', color: '#ffd2a0', alpha: ca });
    text('什么都不吃', 700, base + 40, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: ca * sstep(13.6, 14.0, t) });
  }
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 没用', 220], ['B · 会好一点', 540], ['C · 反而更糟', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 80 个病人 · 假喷雾
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('实用主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('PRAGMATISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ⑨', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function inhaler(x, y, s, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.18); ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(30,34,44,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.85)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-34, -110, 68, 150, 18); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-34, 20); ctx.lineTo(-34, 70); ctx.lineTo(70, 70); ctx.lineTo(70, 30); ctx.lineTo(34, 30); ctx.lineTo(34, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = ORANGE; ctx.fillRect(-26, -150, 52, 40);
  ctx.restore();
}
function sceneSpray(t) {
  if (t < 19.7 || t > JAMES + .2) return;
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.1, t));                                // 80 个病人：样本不大
  if (A1 > 0) {
    typeText('哈佛 · 2010', 540, 640, { ...big, size: 52, weight: 900 }, prog(t, 20.0, 20.8), A1);
    for (let i = 0; i < 80; i++) { const r = Math.floor(i / 10), c = i % 10, a = A1 * sstep(20.3 + i * .02, 20.6 + i * .02, t); glow(270 + c * 60, 800 + r * 52, 8, i < 40 ? O_RGB : '154,163,178', a, 2.4); }
    text('80 个病人 · 样本不大', 540, 1270, { font: SERIF, size: 38, weight: 900, align: 'center', color: '#c3cad6', alpha: A1 * sstep(21.6, 22.1, t) });
  }
  const A2 = sstep(24.0, 24.5, t) * (1 - sstep(27.3, 27.8, t));                                // 它改变的，到底是什么？
  if (A2 > 0) {
    capsule(540, 930, -.35, A2, 3);
    text('？', 540, 760, { font: SERIF, size: 150, weight: 900, align: 'center', color: '#ffd2a0', alpha: A2 * sstep(24.6, 25.2, t), glow: `rgba(${O_RGB},.6)`, blur: 30 });
  }
  const A3 = sstep(27.7, 28.2, t) * (1 - sstep(JAMES - .6, JAMES - .05, t));                  // 哮喘：感觉 vs 肺功能
  if (A3 > 0) {
    inhaler(540, 590, .72, A3);
    const base = 1180, k1 = prog(t, 28.0, 29.6), k2 = prog(t, 31.8, 33.4), cols = [T_RGB, O_RGB, '154,163,178'];
    [[300, '自己觉得好多了', [50, 45, 21], k1, 27.7], [780, '肺功能提升', [20, 7, 7], k2, 31.6]].forEach(([cx, title, vals, k, t0]) => {
      const pa = A3 * sstep(t0, t0 + .4, t);
      text(title, cx, 770, { font: SERIF, size: 36, weight: 900, align: 'center', color: CREAM, alpha: pa });
      seg(cx - 150, base, cx + 150, base, 'rgba(236,230,218,.35)', 2, pa);
      vals.forEach((v, i) => {
        const g = E.out(clamp(k * 1.6 - i * .3)), x = cx - 90 + i * 90;
        bar(x, base, 64, 6 * v * g, cols[i], pa);
        text(`${v}%`, x, base - 6 * v * g - 26, { font: SERIF, size: 26, weight: 900, align: 'center', color: i === 1 ? '#ffd2a0' : '#c3cad6', alpha: pa * g });
      });
    });
    [['真药', 330, '#7fe3d3'], ['假喷雾', 540, '#ffd2a0'], ['不治疗', 750, '#9aa3b2']].forEach(([s, x, col], i) => {
      glow(x - 58, 1250, 7, cols[i], A3, 2.2); text(s, x - 40, 1251, { font: SANS, size: 26, color: col, alpha: A3 });
    });
  }
}

// ======================================================================== ③ 詹姆斯：真 = 有用？
function sceneJames(t) {
  if (t < JAMES - .3 || t > PRICE + .2) return;
  const A = sstep(JAMES - .1, JAMES + .5, t) * (1 - sstep(PRICE - .6, PRICE - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - JAMES) / BEAT) % 1);
  const nm = A * (1 - sstep(48.6, 49.1, t));
  typeText('威廉·詹姆斯', 540, 640, { ...big, size: 56, weight: 900 }, prog(t, 37.7, 38.5), nm);
  typeText('《实用主义》1907', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 38.3, 39.1), nm);
  const Eq = A * sstep(40.9, 41.4, t) * (1 - sstep(44.6, 45.0, t));
  if (Eq > 0) {
    ctx.save(); ctx.translate(540, 990); ctx.scale(1 + .04 * bk, 1 + .04 * bk);
    text('真', -220, 0, { font: SERIF, size: 130, weight: 900, align: 'center', color: CREAM, alpha: Eq });
    text('=', 0, -6, { font: SERIF, size: 110, weight: 900, align: 'center', color: ORANGE, alpha: Eq * sstep(41.6, 42.0, t), glow: `rgba(${O_RGB},.6)`, blur: 20 });
    text('管用', 230, 0, { font: SERIF, size: 130, weight: 900, align: 'center', color: '#ffd2a0', alpha: Eq * sstep(42.2, 42.7, t) });
    ctx.restore();
    text('（实用主义的真理观，极简版）', 540, 1150, { font: SANS, size: 26, align: 'center', color: '#6f7786', alpha: Eq * sstep(42.8, 43.3, t) });
  }
  const Pb = A * sstep(44.9, 45.4, t) * (1 - sstep(48.6, 49.0, t));
  if (Pb > 0) { bottle(540, 980, 1 + .03 * bk, Pb); mark(true, 700, 820, Pb * sstep(45.4, 45.8, t), 34); text('“有用”', 540, 1230, { font: SERIF, size: 48, weight: 900, align: 'center', color: '#7fe3d3', alpha: Pb * sstep(45.6, 46.0, t) }); }
  const Sp = A * sstep(48.9, 49.4, t);
  if (Sp > 0) {
    [['感觉好了', 880, true, 49.2], ['病好了', 1080, false, 50.6]].forEach(([s, y, ok, t0]) => {
      const a = Sp * sstep(t0, t0 + .4, t);
      ctx.save(); ctx.translate(540, y); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
      text(s, -60, 0, { font: SERIF, size: 72, weight: 900, align: 'center', color: ok ? CREAM : '#f0a0a0', alpha: a }); ctx.restore();
      mark(ok, 760, y, a, 34);
    });
    text('≠', 480, 985, { font: SERIF, size: 60, weight: 900, align: 'center', color: ORANGE, alpha: Sp * sstep(50.4, 50.8, t), glow: `rgba(${O_RGB},.6)`, blur: 14 });
  }
}

// ======================================================================== ④ 代价：病毒不吃这一套
function virus(x, y, r, a, rot) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = 'rgba(229,72,77,.9)'; ctx.fillStyle = 'rgba(60,16,20,.9)'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(229,72,77,.6)'; ctx.shadowBlur = 14;
  for (let i = 0; i < 10; i++) { const an = i / 10 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r, Math.sin(an) * r); ctx.lineTo(Math.cos(an) * r * 1.4, Math.sin(an) * r * 1.4); ctx.stroke(); ctx.beginPath(); ctx.arc(Math.cos(an) * r * 1.45, Math.sin(an) * r * 1.45, r * .1, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
}
const VIR = [[300, 820, 44], [720, 760, 52], [520, 1000, 60], [820, 1080, 40], [250, 1140, 46]];
function scenePrice(t) {
  if (t < PRICE - .3 || t > LEAP + .2) return;
  const A = sstep(PRICE - .1, PRICE + .5, t) * (1 - sstep(LEAP - .7, LEAP - .1, t));
  if (A <= 0) return;
  const V = A * (1 - sstep(57.4, 57.9, t));
  if (V > 0) {
    VIR.forEach(([x, y, r], i) => virus(x + Math.sin(t * .9 + i) * 10, y + Math.cos(t * .7 + i * 2) * 8, r, V * sstep(53.5 + i * .15, 54.0 + i * .15, t), t * .3 * (i % 2 ? 1 : -1)));
    for (let i = 0; i < 6; i++) {                                                             // 胶囊飞过去，碰到病毒就弹开
      const t0 = 54.4 + i * .5, k = prog(t, t0, t0 + 1.4); if (k <= 0 || k >= 1) continue;
      const [vx, vy, vr] = VIR[i % 5], sx = vx < 540 ? -60 : 1140, hit = .45;
      const x = k < hit ? lerp(sx, vx, k / hit) : vx + (vx < 540 ? -1 : 1) * 260 * (k - hit), y = k < hit ? lerp(vy - 180, vy - vr * 1.2, k / hit) : vy - vr * 1.2 - 300 * (k - hit) + 500 * (k - hit) ** 2;
      capsule(x, y, k * 8, V * (1 - sstep(.8, 1, k)));
    }
  }
  const R = A * sstep(57.9, 58.4, t);                                                         // 只用替代疗法：死亡风险约 2.5 倍
  if (R > 0) {
    const base = 1200, g1 = E.out(prog(t, 58.3, 59.3)), g2 = E.out(prog(t, 59.6, 61.0));
    text('癌症病人的死亡风险', 540, 640, { font: SERIF, size: 48, weight: 900, align: 'center', color: CREAM, alpha: R });
    seg(220, base, 860, base, 'rgba(236,230,218,.35)', 2, R);
    bar(380, base, 150, 160 * g1, '154,163,178', R); bar(700, base, 150, 400 * g2, '229,72,77', R);
    text('1', 380, base - 160 * g1 - 36, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#c3cad6', alpha: R * g1 });
    text('约 2.5 倍', 700, base - 400 * g2 - 36, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#f0a0a0', alpha: R * sstep(60.6, 61.0, t), glow: 'rgba(229,72,77,.5)', blur: 14 });
    text('接受常规治疗', 380, base + 40, { font: SANS, size: 28, align: 'center', color: '#9aa3b2', alpha: R });
    text('只用替代疗法', 700, base + 40, { font: SANS, size: 28, align: 'center', color: '#f0a0a0', alpha: R * sstep(59.4, 59.8, t) });
    text('观察性研究', 860, 700, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: R });
  }
}

// ======================================================================== ⑤ 断崖：感受 vs 病本身 → 山路断了，只能跳
function cliffs(a, y0 = 1150) {
  if (a <= 0) return;
  const L = [[-10, y0 + 6], [300, y0], [410, y0 + 4], [430, y0 + 60], [400, y0 + 140], [420, 1390]], R = [[1090, y0 + 4], [760, y0], [670, y0 + 6], [650, y0 + 70], [680, y0 + 150], [660, 1390]];
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(22,24,32,.98)'; ctx.strokeStyle = 'rgba(236,230,218,.6)'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  for (const P of [L, R]) {                                                                   // 只描崖顶和崖壁，底边不描，往下渐隐
    ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineTo(P[0][0], 1390); ctx.closePath(); ctx.fill();
    ctx.beginPath(); P.slice(0, -1).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
  }
  const g = ctx.createLinearGradient(0, y0 + 40, 0, 1390); g.addColorStop(0, 'rgba(22,24,32,0)'); g.addColorStop(1, 'rgba(8,9,14,1)'); ctx.fillStyle = g;
  for (const P of [L, R]) { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineTo(P[0][0], 1390); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function sceneLeap(t) {
  if (t < LEAP - .2) return;
  const A = sstep(LEAP + .2, LEAP + 1.0, t);
  const Q1 = A * (1 - sstep(67.6, 68.1, t));                                                  // 明知是假的，还有用吗？
  if (Q1 > 0) { bottle(540, 980, 1, Q1); text('？', 720, 780, { font: SERIF, size: 120, weight: 900, align: 'center', color: '#ffd2a0', alpha: Q1 * sstep(64.6, 65.1, t), glow: `rgba(${O_RGB},.6)`, blur: 24 }); }
  const Q2 = A * sstep(67.9, 68.4, t) * (1 - sstep(71.6, 72.1, t));
  if (Q2 > 0) [['感受', 330, true, 68.0], ['病本身', 750, false, 69.9]].forEach(([s, x, ok, t0]) => {
    const a = Q2 * sstep(t0, t0 + .4, t);
    text(s, x, 900, { font: SERIF, size: 72, weight: 900, align: 'center', color: ok ? '#7fe3d3' : '#f0a0a0', alpha: a });
    mark(ok, x, 1060, a, 44);
    text(ok ? '常常有用' : '往往没用', x, 1190, { font: SANS, size: 30, align: 'center', color: '#9aa3b2', alpha: a });
  });
  const C = A * sstep(72.1, 72.8, t);                                                          // 山路断了：要么跳，要么停
  if (C <= 0) return;
  cliffs(C);
  const crouch = sstep(76.4, 79.6, t), jump = E.io(prog(t, CLIMAX + .2, CLIMAX + 1.9)), land = sstep(CLIMAX + 1.9, CLIMAX + 2.3, t) * (1 - sstep(CLIMAX + 2.3, CLIMAX + 2.9, t));
  const walk = E.io(prog(t, 88.9, 91.0)) * 90 + E.io(prog(t, FINAL + .5, TOTAL)) * 60;
  const px = lerp(370, 740, jump) + walk, py = 1150 - Math.sin(PI * jump) * 300 + 30 * land;
  const sy = 1 - .22 * crouch * (1 - sstep(CLIMAX, CLIMAX + .3, t)) - .15 * land;
  const lit = sstep(76.3, 79.6, t);
  if (lit > 0) glow(px, py - 20, 26, O_RGB, C * lit * (.6 + .4 * Math.sin(t * 4)), 4);
  person(px, py - 30 * sy, 1.0, C, lit > .5 ? '#ffd2a0' : CREAM, sy);
  text('山路断了', 540, 1300, { font: SERIF, size: 32, weight: 900, align: 'center', color: '#9aa3b2', alpha: C * sstep(72.6, 73.1, t) * (1 - sstep(CLIMAX - .4, CLIMAX, t)) });
  if (land > 0 || t > CLIMAX + 2.3) {                                                          // 落地的尘土
    const k = prog(t, CLIMAX + 1.9, CLIMAX + 3.2);
    for (let i = 0; i < 10; i++) { const d = (i - 4.5) / 4.5; ctx.save(); ctx.globalAlpha = C * (1 - k) * .6; ctx.fillStyle = '#d8c79f'; ctx.beginPath(); ctx.arc(740 + d * 90 * k, 1148 - 30 * k * (1 - d * d), 4, 0, TAU); ctx.fill(); ctx.restore(); }
  }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  if (t > 88.9) for (let i = 0; i < 4; i++) glow(740 + 90 * (i + 1) * .5 + 30, 1152, 6, O_RGB, C * sstep(88.9 + i * .4, 89.4 + i * .4, t) * (.5 + .5 * fin), 3);   // 下一步
}

// ======================================================================== ⑥ 信念：詹姆斯的话
function sceneBelief(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1100, 760);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「相信生活值得过，', 540, 480, { ...big, size: 54, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.6), qa);
  typeText('你的信念，会帮你把它变成事实。」', 540, 590, { ...big, size: 54, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.7, CLIMAX + 3.4), qa);
  typeText('—— 威廉·詹姆斯', 540, 684, { size: 28, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.6, CLIMAX + 4.2), qa);
  typeText('病，交给证据；', 540, 560, { ...big, size: 60, weight: 700, color: '#7fe3d3' }, prog(t, 93.4, 94.4), 1);
  typeText('路，交给信念。', 540, 680, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneSpray(t); sceneJames(t); scenePrice(t); sceneLeap(t); sceneBelief(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 2.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 76.3, 80, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2010', 'Kaptchuk et al. · PLoS ONE', 8.2, 23.7, T);
  stamp('2011', 'Wechsler et al. · NEJM', 27.7, 35.3, T);
  stamp('1907', 'William James · Pragmatism', 37.6, 48.6, T);
  stamp('2018', 'Johnson et al. · JNCI', 57.9, 63.4, T);
  stamp('1895', 'William James · Is Life Worth Living?', 72.2, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(32);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  PILLS = [[330, 1150, 1.2], [420, 1200, -.6], [660, 1190, .4], [760, 1140, -1.4], [560, 1220, 2.2]].map(([x, y, rot]) => ({ x, y, rot }));
}

// ======================================================================== 音效提示表（音高都在 C 小调里，最后一个和弦是 C 大调）
const NOTE = { C4: 261.63, Eb4: 311.13, E4: 329.63, G4: 392, C5: 523.25, Eb5: 622.25, G5: 783.99, C6: 1046.5, Eb6: 1244.51, E6: 1318.51, G6: 1567.98 };
const CM_SHIM = [NOTE.Eb6, NOTE.G5, NOTE.C6, NOTE.C5, NOTE.G4], CMAJ_SHIM = [NOTE.E6, NOTE.G5, NOTE.C6, NOTE.C5, NOTE.G4], CM_SWELL = [65.41, 98, 130.81, 155.56, 196];
function CUES() {
  const c = [];
  for (let i = 0; i < 6; i++) c.push([.35 + i * .13, 'click', { gain: .12 + .02 * (i % 2) }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.C4, NOTE.Eb4, NOTE.G4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.C6, gain: .12 }]);
  c.push([11.0, 'bar', { f0: 262, f1: 523, dur: 1.2, gain: .16 }], [13.7, 'bar', { f0: 262, f1: 392, dur: 1.2, gain: .14 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: CM_SHIM, gain: .28 }]);
  c.push([20.3, 'dust', { dur: 1.6, gain: .08 }], [21.6, 'tink', { f: NOTE.G5, gain: .08 }], [24.6, 'tink', { f: NOTE.Eb6, gain: .1 }]);
  c.push([27.8, 'swish', { gain: .14 }], [28.0, 'bar', { f0: 262, f1: 523, dur: 1.4, gain: .12 }], [31.8, 'bar', { f0: 262, f1: 330, dur: 1.4, gain: .12 }]);
  c.push([JAMES, 'whoosh', { dur: .5, gain: .25 }], [37.7, 'page', { gain: .2 }], [41.6, 'tink', { f: NOTE.G6, gain: .08 }], [45.4, 'chord', { f: [NOTE.C5, NOTE.Eb5, NOTE.G5], gain: .1 }]);
  c.push([49.2, 'tink', { f: NOTE.G5, gain: .08 }], [50.6, 'thud', { gain: .18 }]);
  c.push([PRICE, 'whoosh', { dur: .5, gain: .22 }]);
  for (let i = 0; i < 6; i++) c.push([54.4 + i * .5 + .63, 'click', { gain: .1 }]);
  c.push([58.3, 'bar', { f0: 196, f1: 262, dur: 1.0, gain: .12 }], [59.6, 'bar', { f0: 196, f1: 523, dur: 1.4, gain: .16 }], [60.6, 'thud', { gain: .2 }]);
  c.push([64.6, 'tink', { f: NOTE.Eb6, gain: .08 }], [68.0, 'tink', { f: NOTE.G5, gain: .08 }], [69.9, 'thud', { gain: .14 }]);
  c.push([72.2, 'wind', { dur: 8.0, gain: .1 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: CM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: CM_SHIM, gain: .42 }], [CLIMAX + .2, 'whoosh', { dur: 1.2, gain: .3 }], [CLIMAX + .4, 'air', { dur: 10, hum: 65.41, gain: .14 }]);
  c.push([CLIMAX + 1.9, 'thud', { gain: .3 }], [CLIMAX + 1.95, 'dust', { dur: 1.4, gain: .12 }]);
  for (let i = 0; i < 4; i++) c.push([88.9 + i * .4, 'tink', { f: [NOTE.C5, NOTE.Eb5, NOTE.G5, NOTE.C6][i], gain: .06 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: CMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.C4, NOTE.E4, NOTE.G4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
