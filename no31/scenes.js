// ======================================================================== No.31 经验主义：成功经验，能复制吗？
// 第四季·你身上的主义 ⑧。开头是一道选择题：飞回来的轰炸机满身弹孔，装甲只能加一处，加在哪里？（沃尔德，1943，幸存者偏差）
// 音乐：原创配乐（music.py，E 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机像飞机起飞：先跳四度、五度，再长长地滑下来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 上岸经验（每拍一个鼓点） · 53.33 罗素的鸡（紧张） · 64.0 黑天鹅（只剩钢琴） · 80.0 高潮 · 96.0 E 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), STORY = BT(56), CHICKEN = BT(80), SWAN = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['轰炸机', 0, LIFT], ['幸存者偏差', LIFT, STORY], ['上岸经验', STORY, CHICKEN], ['罗素的鸡', CHICKEN, SWAN], ['黑天鹅', SWAN, CLIMAX], ['休谟', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.31';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '二战时，飞回来的轰炸机，机翼和机身上全是弹孔。'],
  [4.1, 7.6, '装甲有限，只能加一处。加在哪里？先猜一个。'],
  [8.2, 10.4, '答案是：加在几乎没有弹孔的发动机上。'],
  [10.8, 13.3, '因为发动机中弹的飞机，根本没能飞回来。'],
  [13.6, 15.7, '我们看到的，只是活下来的那部分。'],
  [16.3, 19.6, '这就是「幸存者偏差」。'],
  [19.9, 23.7, '这个故事来自统计学家沃尔德，细节后来被讲得更精彩。'],
  [24.0, 27.4, '今天，它藏在每一篇「成功经验」里。'],
  [27.7, 31.3, '辍学创业的富豪，你听说过很多；'],
  [31.6, 35.3, '辍学之后一事无成的人，没人给他们写书。'],
  [37.6, 40.6, '考上的人，写「上岸经验」；'],
  [40.9, 44.6, '没考上的人，往往一声不吭。'],
  [44.9, 48.6, '于是我们看到的「经验」，全是赢家的版本。'],
  [48.9, 52.9, '照着做却没成功，不一定是你不行，是你看到的样本，缺了一大半。'],
  [53.6, 57.6, '哲学家罗素讲过一只鸡：'],
  [57.9, 60.4, '每天有人喂它，它越来越确定：明天还有饭吃。'],
  [60.6, 63.4, '直到有一天，喂它的人拧断了它的脖子。'],
  [64.3, 67.6, '这就是「经验主义」的难题：'],
  [67.9, 71.9, '我们只能从经验里学习，可经验，从来都不完整。'],
  [72.2, 75.9, '看过一千只白天鹅，也证明不了没有黑天鹅。'],
  [76.3, 79.6, '哲学家休谟说：'],
  [84.9, 88.6, '听别人的经验之前，先问一句：'],
  [88.9, 92.6, '那些没成功的人，去哪了？'],
  [98.4, 103.0, '评论区：你被哪条「成功经验」坑过？'],
];
const BIGLINES = [
  [80.2, 92.6, '「聪明人，按照证据的多少，来决定相信的程度。」—— 休谟'],
  [93.4, 98.0, '别只看飞回来的飞机。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [STORY - .5, .2], [STORY, .06], [SWAN, .06],
  [SWAN + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 轰炸机（俯视，机头朝上）、人
const WING = [[24, -55], [300, -8], [300, 20], [24, 46]], TAILP = [[20, 128], [112, 148], [112, 164], [18, 166]], ENGX = [90, 175];
function plane(x, y, s, a, o = {}) {
  if (a <= 0) return;
  const col = o.col || 'rgba(236,230,218,.85)';
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  ctx.lineWidth = 2.6 / Math.sqrt(s); ctx.strokeStyle = col; ctx.fillStyle = o.ghost ? 'rgba(10,11,16,.35)' : 'rgba(22,24,32,.96)'; ctx.lineJoin = 'round';
  if (o.ghost) ctx.setLineDash([10, 9]); else { ctx.shadowColor = 'rgba(236,230,218,.25)'; ctx.shadowBlur = 10; }
  for (const k of [-1, 1]) {
    for (const P of [WING, TAILP]) { ctx.beginPath(); P.forEach(([px, py], i) => i ? ctx.lineTo(px * k, py) : ctx.moveTo(px * k, py)); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    for (const ex of ENGX) { ctx.beginPath(); ctx.ellipse(ex * k, -50, 15, 34, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
  }
  ctx.beginPath(); ctx.moveTo(0, -190); ctx.bezierCurveTo(22, -185, 26, -150, 26, -110); ctx.lineTo(24, 120); ctx.quadraticCurveTo(14, 175, 0, 182);
  ctx.quadraticCurveTo(-14, 175, -24, 120); ctx.lineTo(-26, -110); ctx.bezierCurveTo(-26, -150, -22, -185, 0, -190); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.setLineDash([]);
  if (o.hits) HITS.forEach(h => {                                                         // 弹孔：机翼、机身、尾翼；发动机上一个都没有
    const k = clamp((o.hits - h.k) * 8); if (k <= 0) return;
    ctx.fillStyle = `rgba(229,72,77,${.9 * k})`; ctx.beginPath(); ctx.arc(h.x, h.y, h.r * (1.6 - .6 * k), 0, TAU); ctx.fill();
    ctx.fillStyle = `rgba(20,8,8,${.8 * k})`; ctx.beginPath(); ctx.arc(h.x, h.y, h.r * .45, 0, TAU); ctx.fill();
  });
  if (o.engHit) for (const k of [-1, 1]) for (const ex of ENGX) {                         // 没飞回来的飞机：中弹的是发动机
    ctx.fillStyle = `rgba(229,72,77,${.95 * o.engHit})`; ctx.shadowColor = 'rgba(229,72,77,.9)'; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(ex * k + 3, -56, 9, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(ex * k - 4, -38, 6, 0, TAU); ctx.fill();
  }
  ctx.restore();
  if (o.eng) for (const k of [-1, 1]) for (const ex of ENGX) {                             // 揭晓：发动机亮起来
    const px = x + Math.cos(o.rot || 0) * ex * k * s, py = y - 50 * s;
    glow(px, py, 9 * s, O_RGB, o.eng, 5);
    ctx.save(); ctx.globalAlpha = o.eng * a; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.ellipse(px, py, 26 * s, 48 * s, 0, 0, TAU); ctx.stroke(); ctx.restore();
  }
}
let HITS = [];
function person(x, y, s, a, col = CREAM, fill = 'rgba(16,17,23,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = fill;
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -80, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-26, -54, 52, 84, 20); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const GHOSTS = [[230, 640, -1], [850, 640, 1], [230, 1180, -1], [850, 1180, 1]];

// ======================================================================== ① 轰炸机（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('装甲只能加一处：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('加在哪里？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const shrink = E.io(prog(t, 10.8, 11.8)), ps = lerp(1.25, .95, shrink), py = lerp(900, 910, shrink);
  const eng = sstep(Q.REVEAL, Q.REVEAL + .5, t) * (.75 + .25 * Math.sin(t * 5));
  plane(540, py, ps, 1, { hits: .08 + 1.1 * prog(t, .3, 3.6), eng });
  const tags = 1 - qOut;                                                                     // 选项的位置：A 机翼、B 机身、C 发动机
  if (tags > 0) [['A', -235, 6], ['B', 0, 60], ['C', 175, -118]].forEach(([s, lx, ly]) => {
    const tx = 540 + lx * ps, ty = py + ly * ps;
    ctx.save(); ctx.globalAlpha = tags; ctx.fillStyle = 'rgba(12,13,18,.85)'; ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(tx, ty, 24, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
    text(s, tx, ty + 1, { font: LAT, size: 28, weight: 700, align: 'center', color: ORANGE, alpha: tags });
  });
  GHOSTS.forEach(([gx, gy, d], i) => {                                                       // 发动机中弹的飞机：掉下去，没能飞回来
    const ap = sstep(10.8 + i * .15, 11.3 + i * .15, t), k = E.in(prog(t, 11.6 + i * .35, 13.2 + i * .35));
    const back = sstep(13.6, 14.2, t) * .3;
    plane(gx, gy + 300 * k, .42 * (1 - .4 * k), Math.max(ap * (1 - k), back), { ghost: 1, col: k > 0 || back ? 'rgba(240,160,160,.7)' : 'rgba(236,230,218,.7)', engHit: ap * (1 - k) + back, rot: d * 1.1 * k });
  });
  text('C · 发动机', 540, 560, { font: SERIF, size: 76, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  text('中弹的，没飞回来', 540, 520, { font: SERIF, size: 60, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(10.9, 11.4, t) * (1 - sstep(13.3, 13.6, t)), glow: 'rgba(229,72,77,.45)', blur: 18 });
  text('你看到的，只是幸存者', 540, 520, { font: SERIF, size: 60, weight: 900, align: 'center', color: CREAM, alpha: sstep(13.7, 14.2, t) });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 机翼', 220], ['B · 机身', 540], ['C · 发动机', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 沃尔德 · 冰山
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('经验主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EMPIRICISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ⑧', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneWald(t) {
  if (t < 19.7 || t > 24.2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(23.6, 24.1, t));
  if (A <= 0) return;
  typeText('沃尔德', 540, 640, { ...big, size: 52, weight: 900 }, prog(t, 20.0, 20.8), A);
  typeText('统计研究小组 · 1943', 540, 730, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 20.6, 21.4), A);
  const up = E.out(prog(t, 20.0, 21.0));
  ctx.save(); ctx.globalAlpha = A * up; ctx.translate(540, 990 + 40 * (1 - up)); ctx.rotate(-.025);
  ctx.fillStyle = 'rgba(232,224,204,.94)'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; ctx.fillRect(-210, -200, 420, 400); ctx.shadowBlur = 0;
  ['A METHOD OF ESTIMATING', 'PLANE VULNERABILITY', 'BASED ON DAMAGE', 'OF SURVIVORS'].forEach((s, i) => text(s, 0, -150 + i * 32, { font: LAT, size: 21, weight: 700, align: 'center', color: '#2a2418', ls: 1 }));
  for (let i = 0; i < 9; i++) { ctx.fillStyle = 'rgba(60,52,40,.35)'; ctx.fillRect(-170, -10 + i * 22, 340 * (.55 + .45 * hash2(i, 31)), 6); }
  ctx.restore();
  pill('故事的细节：后来被加工过', 540, 1268, A * sstep(21.9, 22.4, t), { size: 26, color: DIM });
}
function book(x, y, a, title) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = '#e8c88a'; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(-110, -150, 220, 300, 8); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(255,240,220,.9)'; ctx.fillRect(-110, 140, 220, 10); ctx.fillStyle = 'rgba(60,40,10,.35)'; ctx.fillRect(-86, -120, 172, 3); ctx.fillRect(-86, 100, 172, 3);
  ctx.restore();
  text(title, x, y - 10, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#1a120a', alpha: a });
}
function sceneIceberg(t) {
  if (t < 23.8 || t > STORY + .2) return;
  const A = sstep(24.0, 24.5, t) * (1 - sstep(STORY - .6, STORY - .05, t));
  if (A <= 0) return;
  const bk = sstep(24.0, 24.6, t) * (1 - sstep(27.3, 27.9, t));
  if (bk > 0) { warmth(bk * .8, 540, 880, 420); book(540, 880 - 20 * (1 - E.out(prog(t, 24.0, 24.8))), bk, '成功经验'); }
  const top = sstep(27.7, 28.2, t), WL = 962;
  [380, 540, 700].forEach((x, i) => { const a = A * sstep(27.8 + i * .25, 28.3 + i * .25, t); if (a > 0) { glow(x, 812, 10, '242,199,106', a * .7, 6); person(x, 920, .85, a, '#f2c76a'); } });
  text('被写成书的', 540, 700, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#f2c76a', alpha: A * top });
  const sea = sstep(31.5, 32.1, t);
  if (sea > 0) {                                                                             // 水面以下：没人写的那一大片
    ctx.save(); ctx.globalAlpha = A * sea; const g = ctx.createLinearGradient(0, WL, 0, 1320); g.addColorStop(0, 'rgba(60,90,130,.28)'); g.addColorStop(1, 'rgba(60,90,130,0)'); ctx.fillStyle = g; ctx.fillRect(0, WL, W, 1320 - WL); ctx.restore();
    drawOn(() => { ctx.moveTo(60, WL); ctx.lineTo(1020, WL); }, 960, E.io(prog(t, 31.5, 32.3)), 'rgba(150,190,230,.7)', 2, A);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
      const i = r * 8 + c, a = A * sstep(31.9 + hash2(i, 7) * 1.8, 32.4 + hash2(i, 7) * 1.8, t);
      person(150 + c * 111 + (r % 2) * 20, 1040 + r * 62, .4, a * .55, '#7d8796');
    }
    text('没人写的', 540, 1288, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#9aa3b2', alpha: A * sstep(32.6, 33.2, t) });
  }
}

// ======================================================================== ③ 上岸经验：写出来的 vs 没说话的
const POSTS = ['上岸经验｜我是怎么逆袭的', '三个月上岸，方法全公开', '二战上岸，只做对了一件事', '普通人的上岸之路', '上岸后，我想说……'];
function sceneFeed(t) {
  if (t < STORY - .3 || t > CHICKEN + .2) return;
  const A = sstep(STORY - .1, STORY + .5, t) * (1 - sstep(CHICKEN - .6, CHICKEN - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - STORY) / BEAT) % 1), cols = A * (1 - sstep(48.6, 49.2, t)), dimR = 1 - .7 * sstep(44.9, 45.5, t);
  text('写出来的', 300, 600, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: cols * sstep(37.6, 38.0, t) });
  text('没说话的', 800, 600, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#9aa3b2', alpha: cols * dimR * sstep(40.9, 41.3, t) });
  POSTS.forEach((s, i) => {
    const t0 = 37.8 + i * BEAT, k = E.outExpo(prog(t, t0, t0 + .5)), a = cols * k; if (a <= 0) return;
    const y = 690 + i * 100, sc = 1 + .05 * (1 - k);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(300, y); ctx.scale(sc, sc);
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.strokeStyle = `rgba(${O_RGB},.55)`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(-230, -38, 460, 76, 14); ctx.fill(); ctx.stroke();
    ctx.restore();
    glow(300 - 196, y, 12, '242,199,106', a * .8, 2.2);
    text(s, 300 - 168, y + 1, { font: SANS, size: 25, weight: 500, color: CREAM, alpha: a });
  });
  for (let i = 0; i < 5; i++) {
    const t0 = 41.0 + i * .4, a = cols * dimR * sstep(t0, t0 + .4, t); if (a <= 0) continue;
    const y = 690 + i * 100;
    ctx.save(); ctx.globalAlpha = a * .8; ctx.fillStyle = 'rgba(120,128,142,.5)'; ctx.beginPath(); ctx.arc(700, y, 26, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(154,163,178,.5)'; ctx.lineWidth = 1.6; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.roundRect(746, y - 28, 170, 56, 14); ctx.stroke(); ctx.restore();
    text('……', 831, y - 4, { font: SANS, size: 28, align: 'center', color: '#6f7786', alpha: a });
  }
  const ph = A * sstep(44.9, 45.5, t) * (1 - sstep(48.6, 49.2, t));                         // 你的手机里：只有左边那一列
  if (ph > 0) {
    ctx.save(); ctx.globalAlpha = ph; ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.roundRect(48, 548, 504, 640, 40); ctx.stroke(); ctx.restore();
    text('你看到的「经验」', 300, 1250, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: ph });
  }
  const sa = A * sstep(49.0, 49.6, t);                                                       // 样本：你看到的只是一小截
  if (sa > 0) {
    const y = 900, x0 = 160, x1 = 920, f = E.out(prog(t, 49.4, 50.4)), rest = E.out(prog(t, 50.6, 51.8));
    ctx.save(); ctx.globalAlpha = sa; ctx.strokeStyle = 'rgba(154,163,178,.6)'; ctx.lineWidth = 2.5; ctx.setLineDash([12, 10]);
    ctx.beginPath(); ctx.roundRect(x0, y - 40, (x1 - x0) * rest, 80, 12); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = `rgba(${O_RGB},.9)`; ctx.shadowColor = `rgba(${O_RGB},.6)`; ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(x0, y - 40, 190 * f, 80, 12); ctx.fill(); ctx.restore();
    text('你看到的', x0, y - 90, { font: SERIF, size: 34, weight: 900, color: '#ffd2a0', alpha: sa * f });
    text('所有照着做的人', x1, y + 96, { font: SERIF, size: 34, weight: 900, align: 'right', color: '#9aa3b2', alpha: sa * rest });
    text('示意', x1, y - 90, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: sa });
    ctx.save(); ctx.translate(540, 1180); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
    text('不一定是你不行', 0, 0, { font: SERIF, size: 56, weight: 900, align: 'center', color: CREAM, alpha: sa * sstep(50.0, 50.5, t) }); ctx.restore();
  }
}

// ======================================================================== ④ 罗素的鸡：每天被喂，越来越确定……直到某一天
function chicken(x, y, s, a, peck = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(30,30,36,.96)'; ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(236,230,218,.35)'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(-70, -10); ctx.quadraticCurveTo(-110, -70, -86, -96); ctx.quadraticCurveTo(-70, -60, -50, -50); ctx.closePath(); ctx.fill(); ctx.stroke();   // 尾巴
  ctx.beginPath(); ctx.ellipse(0, 0, 78, 56, -.08, 0, TAU); ctx.fill(); ctx.stroke();                                                                                         // 身子
  ctx.beginPath(); ctx.ellipse(-8, 4, 38, 22, -.3, 0, TAU); ctx.stroke();                                                                                                       // 翅膀
  ctx.save(); ctx.translate(58, -46); ctx.rotate(peck * .9); ctx.translate(0, peck * 30);
  ctx.beginPath(); ctx.arc(0, -14, 30, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#e5484d'; ctx.beginPath(); ctx.arc(-8, -46, 9, 0, TAU); ctx.arc(6, -48, 10, 0, TAU); ctx.fill();
  ctx.fillStyle = '#f2c76a'; ctx.beginPath(); ctx.moveTo(26, -20); ctx.lineTo(48, -10); ctx.lineTo(26, -4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(10, -20, 4, 0, TAU); ctx.fill(); ctx.restore();
  ctx.shadowBlur = 0; ctx.beginPath(); ctx.moveTo(-14, 52); ctx.lineTo(-18, 92); ctx.moveTo(18, 52); ctx.lineTo(22, 92); ctx.stroke();
  ctx.restore();
}
function sceneChicken(t) {
  if (t < CHICKEN - .3 || t > SWAN + .2) return;
  const A = sstep(CHICKEN - .1, CHICKEN + .5, t) * (1 - sstep(SWAN - .7, SWAN - .1, t));
  if (A <= 0) return;
  const nm = A * (1 - sstep(57.4, 57.9, t));
  typeText('罗素', 540, 620, { ...big, size: 56, weight: 900 }, prog(t, 53.8, 54.5), nm);
  typeText('《哲学问题》1912', 540, 710, { size: 30, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 54.4, 55.2), nm);
  const cut = 61.6, dead = sstep(cut, cut + .5, t), beatPh = ((t - CHICKEN) / BEAT) % 1;
  const feeding = t > 57.9 && t < cut, peck = feeding ? Math.pow(Math.sin(PI * beatPh), 6) : 0;
  chicken(540, 1200, 1, A * (1 - dead), peck);
  if (feeding) for (let i = 0; i < 6; i++) { const ph = (beatPh + i / 6) % 1; ctx.save(); ctx.globalAlpha = A * Math.sin(PI * ph); ctx.fillStyle = '#f2c76a'; ctx.beginPath(); ctx.arc(600 + (i - 2.5) * 22, lerp(1080, 1290, ph), 4, 0, TAU); ctx.fill(); ctx.restore(); }
  if (dead > 0) { const fk = prog(t, cut, cut + 2.2); ctx.save(); ctx.globalAlpha = A * (1 - fk); ctx.translate(560 + 40 * Math.sin(fk * 6), 1150 + 120 * fk); ctx.rotate(Math.sin(fk * 5) * .6); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.ellipse(0, 0, 8, 24, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  const G = A * sstep(57.9, 58.4, t);                                                         // 它有多确定：每天往上一点
  if (G > 0) {
    const x0 = 180, x1 = 900, y0 = 1000, y1 = 640, fx = clamp(prog(t, 58.0, cut)), day = Math.max(1, Math.round(E.io(fx) * 100));
    seg(x0, y0, x1, y0, 'rgba(236,230,218,.4)', 2, G); seg(x0, y0, x0, y1, 'rgba(236,230,218,.4)', 2, G);
    text('它有多确定', x0 + 14, y1 + 6, { font: SANS, size: 24, color: '#9aa3b2', alpha: G });
    text('天数', x1, y0 + 34, { font: SANS, size: 24, align: 'right', color: '#9aa3b2', alpha: G });
    const curve = u => y0 - (y0 - y1 - 40) * (1 - Math.exp(-u * 4.2));
    ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.shadowColor = `rgba(${T_RGB},.6)`; ctx.shadowBlur = 14; ctx.beginPath();
    for (let i = 0; i <= 80; i++) { const u = i / 80 * fx; i ? ctx.lineTo(lerp(x0, x1 - 40, u), curve(u)) : ctx.moveTo(x0, curve(0)); }
    ctx.stroke(); ctx.restore();
    const hx = lerp(x0, x1 - 40, fx), hy = curve(fx);
    if (!dead) glow(hx, hy, 7, T_RGB, G, 5);
    text(`第 ${day} 天`, x1, y1 - 36, { font: SERIF, size: 36, weight: 900, align: 'right', color: '#7fe3d3', alpha: G * (1 - dead) });
    if (dead > 0) {
      ctx.save(); ctx.globalAlpha = G * dead; ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.shadowColor = 'rgba(229,72,77,.8)'; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.moveTo(hx, y1 - 10); ctx.lineTo(hx, y0); ctx.stroke(); ctx.restore();
      text('某一天', x1, y1 - 36, { font: SERIF, size: 36, weight: 900, align: 'right', color: '#f0a0a0', alpha: G * dead, glow: 'rgba(229,72,77,.5)', blur: 14 });
    }
  }
}

// ======================================================================== ⑤ 经验不完整 · 一千只白天鹅 · 休谟
function swan(x, y, s, a, black = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = black ? '#050507' : 'rgba(240,236,228,.95)'; ctx.strokeStyle = black ? ORANGE : 'rgba(240,236,228,.95)'; ctx.lineWidth = black ? 3 : 1;
  if (black) { ctx.shadowColor = `rgba(${O_RGB},.9)`; ctx.shadowBlur = 18; }
  ctx.beginPath(); ctx.moveTo(-40, 0); ctx.quadraticCurveTo(-36, 22, 0, 24); ctx.quadraticCurveTo(34, 24, 40, 4); ctx.quadraticCurveTo(10, 8, 0, -4); ctx.quadraticCurveTo(-20, -14, -40, 0); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(26, 6); ctx.bezierCurveTo(14, -16, 40, -30, 30, -46); ctx.lineTo(36, -50); ctx.bezierCurveTo(48, -30, 24, -16, 34, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = black ? '#e5484d' : '#f2a14a'; ctx.beginPath(); ctx.moveTo(34, -50); ctx.lineTo(48, -44); ctx.lineTo(36, -42); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function sceneSwan(t) {
  if (t < SWAN - .2 || t > CLIMAX + .3) return;
  const A = sstep(SWAN + .2, SWAN + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(71.6, 72.2, t));                                                   // 经验：一块永远缺了一角的圆
  if (D > 0) {
    typeText('经验主义', 540, 600, { ...big, size: 64, weight: 900 }, prog(t, 64.4, 65.2), D);
    typeText('知识，来自经验', 540, 690, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 65.0, 65.8), D);
    const miss = E.io(prog(t, 67.9, 69.2)) * .95, a0 = -PI / 2, r = 210, cy = 1020;
    ctx.save(); ctx.globalAlpha = D * sstep(64.6, 65.4, t); ctx.fillStyle = 'rgba(79,214,196,.18)'; ctx.strokeStyle = TEAL; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${T_RGB},.5)`; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.moveTo(540, cy); ctx.arc(540, cy, r, a0 + miss, a0 + TAU); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    if (miss > .05) {
      ctx.save(); ctx.globalAlpha = D * miss; ctx.strokeStyle = 'rgba(240,160,160,.8)'; ctx.lineWidth = 2.5; ctx.setLineDash([10, 9]);
      ctx.beginPath(); ctx.moveTo(540, cy); ctx.arc(540, cy, r, a0, a0 + miss); ctx.closePath(); ctx.stroke(); ctx.restore();
      const am = a0 + miss / 2; text('？', 540 + Math.cos(am) * r * .62, cy + Math.sin(am) * r * .62, { font: SERIF, size: 54, weight: 900, align: 'center', color: '#f0a0a0', alpha: D * miss });
    }
    text('经验', 500, cy + 40, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#7fe3d3', alpha: D * sstep(64.8, 65.4, t) });
  }
  const S = A * sstep(72.1, 72.5, t) * (1 - sstep(75.9, 76.4, t));                            // 白天鹅越来越多，然后出现一只黑的
  if (S > 0) {
    const n = Math.floor(clamp(prog(t, 72.3, 74.4)) * 40), blk = sstep(74.8, 75.2, t);
    for (let i = 0; i < n; i++) { const r = Math.floor(i / 8), c = i % 8; if (i === 27 && blk > 0) continue; swan(166 + c * 107, 760 + r * 112, .9, S * sstep(0, 1, (n - i) / 2 + .3)); }
    if (blk > 0) { const c = 27 % 8, r = Math.floor(27 / 8), x = 166 + c * 107, y = 760 + r * 112; glow(x, y - 10, 16, O_RGB, S * blk * .8, 4); swan(x, y, .9 + .5 * (1 - E.out(prog(t, 74.8, 75.4))), S * blk, 1); }
    text(`× ${Math.max(1, Math.round(E.in(prog(t, 72.3, 74.4)) * 1000))}`, 540, 620, { font: SERIF, size: 64, weight: 900, align: 'center', color: CREAM, alpha: S * (1 - blk) });
    text('一只黑天鹅', 540, 620, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: S * blk, glow: `rgba(${O_RGB},.5)`, blur: 20 });
  }
  const Hm = A * sstep(76.3, 76.8, t);
  typeText('休谟', 540, 860, { ...big, size: 72, weight: 900 }, prog(t, 76.4, 77.2), Hm);
  typeText('《人类理解研究》1748', 540, 960, { size: 32, weight: 500, font: SERIF, align: 'center', color: DIM, spread: 4 }, prog(t, 77.0, 77.8), Hm);
}

// ======================================================================== ⑥ 休谟：完整的那张图
function sceneHume(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const pa = A * sstep(CLIMAX + 1.2, CLIMAX + 2.2, t), drift = Math.sin(t * .8) * 6;
  plane(540, 1050 + drift, .8, pa, { hits: 1.2 });
  GHOSTS.forEach(([gx, gy, d], i) => {                                                       // 那些没成功的人：一架架虚线的飞机，回到画面里
    const g = sstep(88.9 + i * .3, 89.6 + i * .3, t), y = gy < 900 ? 900 : 1230;
    plane(gx < 540 ? 200 : 880, y + drift * .6, .4, A * g * (.55 + .45 * fin), { ghost: 1, col: fin > .1 ? `rgba(255,210,160,${.5 + .4 * fin})` : 'rgba(240,160,160,.75)', engHit: g * (1 - fin) });
  });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「聪明人，按照证据的多少，', 540, 480, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.8), qa);
  typeText('来决定相信的程度。」', 540, 590, { ...big, size: 62, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.9, CLIMAX + 3.2), qa);
  typeText('—— 休谟', 540, 684, { size: 28, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.4, CLIMAX + 4.0), qa);
  typeText('别只看', 540, 560, { ...big, size: 52, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('飞回来的飞机。', 540, 666, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneWald(t); sceneIceberg(t); sceneFeed(t); sceneChicken(t); sceneSwan(t); sceneHume(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.2, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1943', 'Abraham Wald · Statistical Research Group', 16.3, 23.7, T);
  stamp('1912', 'Bertrand Russell · The Problems of Philosophy', 53.6, 63.4, T);
  stamp('1697', 'Black swans · Swan River, Australia', 72.2, 75.9, T);
  stamp('1748', 'David Hume · An Enquiry Concerning Human Understanding', 76.3, 79.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(31);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rh = mulberry(311); HITS = [];
  while (HITS.length < 78) {                                                                 // 弹孔只落在机翼、机身和尾翼上，避开四台发动机
    const z = rh(); let x, y;
    if (z < .55) { const u = 30 + rh() * 262, k = rh() < .5 ? -1 : 1, le = -55 + (u - 24) / 276 * 47, te = 46 - (u - 24) / 276 * 26; x = u * k; y = lerp(le + 6, te - 6, rh()); if (ENGX.some(ex => Math.abs(u - ex) < 30)) continue; }
    else if (z < .9) { x = (rh() - .5) * 34; y = -140 + rh() * 290; }
    else { const u = 26 + rh() * 80, k = rh() < .5 ? -1 : 1; x = u * k; y = lerp(134 + (u - 20) / 92 * 20, 162, rh()); }
    HITS.push({ x, y, r: 3.5 + rh() * 3, k: rh() });
  }
}

// ======================================================================== 音效提示表（音高都在 E 小调里，最后一个和弦是 E 大调）
const NOTE = { E4: 329.63, G4: 392, Gs4: 415.3, B4: 493.88, E5: 659.26, G5: 783.99, B5: 987.77, E6: 1318.51, G6: 1567.98, Gs6: 1661.22, B6: 1975.53 };
const EM_SHIM = [NOTE.G6, NOTE.B5, NOTE.E6, NOTE.E5, NOTE.B4], EMAJ_SHIM = [NOTE.Gs6, NOTE.B5, NOTE.E6, NOTE.E5, NOTE.B4], EM_SWELL = [82.41, 123.47, 164.81, 196, 246.94];
function CUES() {
  const c = [];
  for (let i = 0; i < 11; i++) c.push([.4 + i * .3, 'click', { gain: .1 + .02 * (i % 3) }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.E4, NOTE.G4, NOTE.B4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.E6, gain: .12 }]);
  c.push([11.6, 'bar', { f0: 880, f1: 220, dur: 1.4, gain: .12, pan: -.5 }], [12.1, 'bar', { f0: 880, f1: 196, dur: 1.4, gain: .1, pan: .5 }], [13.7, 'tink', { f: NOTE.B5, gain: .1 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: EM_SHIM, gain: .28 }]);
  c.push([20.0, 'page', { gain: .22 }], [21.9, 'tink', { f: NOTE.G6, gain: .08 }], [24.1, 'tink', { f: NOTE.B5, gain: .1 }], [24.3, 'tink', { f: NOTE.E6, gain: .08 }]);
  [27.8, 28.05, 28.3].forEach((t, i) => c.push([t, 'tink', { f: [NOTE.E6, NOTE.G6, NOTE.B6][i], gain: .07 }]));
  c.push([31.5, 'whoosh', { dur: .8, gain: .18 }], [31.9, 'dust', { dur: 1.8, gain: .1 }]);
  c.push([STORY, 'whoosh', { dur: .5, gain: .25 }]);
  for (let i = 0; i < 5; i++) c.push([37.8 + i * BEAT, 'ding', { gain: .07 + .01 * i }]);
  for (let i = 0; i < 5; i++) c.push([41.0 + i * .4, 'click', { gain: .08 }]);
  c.push([44.9, 'tink', { f: NOTE.E6, gain: .1 }], [49.4, 'bar', { f0: 220, f1: 330, dur: .9, gain: .14 }], [50.6, 'bar', { f0: 220, f1: 660, dur: 1.2, gain: .12 }]);
  c.push([CHICKEN, 'whoosh', { dur: .5, gain: .22 }], [53.8, 'tink', { f: NOTE.B5, gain: .08 }]);
  c.push([61.6, 'thud', { gain: .22 }], [61.62, 'crack', { gain: .2 }]);
  c.push([64.4, 'tink', { f: NOTE.E6, gain: .08 }], [67.9, 'bar', { f0: 494, f1: 247, dur: 1.2, gain: .1 }]);
  for (let i = 0; i < 6; i++) c.push([72.3 + i * .35, 'tink', { f: [NOTE.E5, NOTE.G5, NOTE.B5, NOTE.E6, NOTE.G6, NOTE.B6][i], gain: .05 }]);
  c.push([74.8, 'thud', { gain: .2 }], [74.82, 'chord', { f: [NOTE.E4, NOTE.G4, NOTE.B4], gain: .14 }], [76.4, 'page', { gain: .22 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: EM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: EM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 82.41, gain: .14 }]);
  c.push([88.9, 'whoosh', { dur: .8, gain: .18 }], [89.0, 'dust', { dur: 1.6, gain: .1 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: EMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.E4, NOTE.Gs4, NOTE.B4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
