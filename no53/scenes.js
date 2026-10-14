// ======================================================================== No.53 幸福主义：越想要幸福，越难幸福吗？
// 第六季·日常里的主义 ⑩（完结）。开头是一道选择题：哈佛追踪一群人八十多年，比胆固醇更能预测晚年健康的是什么？（哈佛成人发展研究）
// 音乐：原创配乐（music.py，降 B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机往上够一个六度，再一级一级放下来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 越盯越远（每拍一个鼓点） · 53.33 关系（紧张） · 64.0 副产品（只剩钢琴） · 80.0 高潮：十个主义 · 96.0 降 B 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), CHASE = BT(56), BACK = BT(80), LIVE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['80 年', 0, LIFT], ['活得好', LIFT, CHASE], ['越盯越远', CHASE, BACK], ['关系', BACK, LIVE], ['副产品', LIVE, CLIMAX], ['好好生活', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.53';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '哈佛追踪了一群人，八十多年。'],
  [4.1, 7.6, '比胆固醇更能预测晚年健康的，是什么？先猜一个。'],
  [8.2, 10.4, '答案是：关系。'],
  [10.8, 13.3, '50 岁时对关系最满意的人，'],
  [13.6, 15.7, '到了 80 岁，往往最健康。'],
  [16.3, 19.6, '两千多年前，亚里士多德说：'],
  [19.9, 23.7, '我们做的一切，最后都是为了「幸福」。'],
  [24.0, 27.4, '但他说的幸福，不是开心一阵子，'],
  [27.7, 31.3, '而是「活得好」：把你能成为的样子，活出来。'],
  [31.6, 35.3, '这就是「幸福主义」：幸福，是人生最后的目的。'],
  [37.6, 40.6, '可是，越盯着幸福，它好像越远。'],
  [40.9, 44.6, '心理学家莫斯发现：越把「要幸福」看得重的人，'],
  [44.9, 48.6, '在本该开心的时候，反而更容易失望。'],
  [48.9, 52.9, '就像一边开心，一边在检查：我够不够开心？'],
  [53.6, 57.6, '那幸福从哪来？回到开头那个研究。'],
  [57.9, 60.6, '追了八十多年，研究者说：'],
  [60.8, 63.4, '好的关系，让人更快乐，也更健康。'],
  [64.3, 67.6, '所以，与其一遍遍问：我幸福吗？'],
  [67.9, 71.9, '不如问问：今天，我好好对待谁了？'],
  [72.2, 75.9, '幸福，常常是好好生活的「副产品」。'],
  [76.3, 79.6, '一百五十多年前，密尔写过：'],
  [84.9, 88.6, '这一季，我们聊了十个「日常里的主义」。'],
  [88.9, 92.6, '谢谢你，一期一期看到这里。'],
  [98.4, 103.0, '评论区：你最近一次觉得幸福，是什么时候？'],
];
const BIGLINES = [
  [80.2, 92.6, '「问问自己幸不幸福，你就不再幸福了。」—— 约翰·密尔'],
  [93.4, 98.0, '别盯着幸福，好好去生活。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [CHASE - .5, .2], [CHASE, .06], [LIVE, .06],
  [LIVE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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

// ======================================================================== 人、脸、放大镜
const PINK = '#f0a0a0', GOLD = '#ffd2a0', WARMC = '#ffb36b';
const ISMS = ['消费主义', '平均主义', '权威主义', '外貌主义', '自我中心主义', '节俭主义', '英雄主义', '自然主义', '最大化主义', '幸福主义'];
function person(x, y, s, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function pair(x, y, s, a, col = WARMC, link = 1) {                                                   // 两个人肩并肩，中间一点暖光
  if (a <= 0) return;
  if (link > 0) glow(x, y - 40 * s, 14 * s, O_RGB, a * link, 6);
  person(x - 46 * s, y, s, a, col); person(x + 46 * s, y, s, a, col);
}
function mood(x, y, r, a, k, col) {                                                                 // 脸：k = 1 笑，k = -1 不开心
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = 'rgba(16,17,23,.95)'; ctx.lineWidth = Math.max(3, r * .05);
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(x + sx * r * .36, y - r * .18, r * .09, 0, TAU); ctx.fill(); }
  ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r * .4, y + r * .32); ctx.quadraticCurveTo(x, y + r * .32 + k * r * .38, x + r * .4, y + r * .32); ctx.stroke(); ctx.restore();
}
function lens(x, y, s, a, rot = 0, col = CREAM) {                                                    // 放大镜
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.fillStyle = 'rgba(169,211,255,.12)'; ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(32, 32); ctx.lineTo(80, 80); ctx.stroke(); ctx.restore();
}

// ======================================================================== ① 80 年（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('哈佛追踪 80 多年：比胆固醇更能预测', 540, 452, { ...big, size: 40, weight: 700 }, 1, 1 - qOut);
  typeText('晚年健康的是？', 540, 560, { ...big, size: 80, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const base = 1100, x50 = 330, x80 = 750;                                                            // 一条人生的时间轴
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(190, base); ctx.lineTo(890, base); ctx.stroke(); ctx.restore();
  for (const x of [x50, x80]) { ctx.save(); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x, base, 6, 0, TAU); ctx.fill(); ctx.restore(); }
  text('50 岁', x50, base + 46, { font: SERIF, size: 32, weight: 900, align: 'center', color: CREAM });
  text('80 岁', x80, base + 46, { font: SERIF, size: 32, weight: 900, align: 'center', color: CREAM });
  const sw = ((t % 4) / 4); glow(190 + 700 * sw, base, 8, '255,225,190', .7 * (1 - sstep(Q.REVEAL, Q.REVEAL + .3, t)), 4);
  const C = sstep(Q.REVEAL + .1, Q.REVEAL + .6, t), late = sstep(10.9, 11.4, t);
  person(x50 - 46 * C, base - 34, .8, 1, lerp(0, 1, C) > .5 ? WARMC : CREAM);
  person(x50 + 46 + 60 * (1 - E.out(prog(t, Q.REVEAL + .1, Q.REVEAL + .8))), base - 34, .8, C, WARMC);
  if (C > 0) glow(x50, base - 66, 12, O_RGB, C, 6);
  text('?', x80, base - 70, { font: SERIF, size: 110, weight: 900, align: 'center', color: '#6f7786', alpha: 1 - late });
  drawOn(() => { ctx.moveTo(x50 + 70, base - 130); ctx.quadraticCurveTo(540, base - 260, x80 - 70, base - 130); }, 420, prog(t, Q.REVEAL + .5, 11.0), WARMC, 4, C, WARMC);
  pair(x80, base - 34, .8, late, WARMC, late);
  text('关系最满意', x50, base + 96, { font: SANS, size: 26, align: 'center', color: WARMC, alpha: sstep(11.0, 11.4, t) });
  text('往往最健康', x80, base + 96, { font: SANS, size: 26, align: 'center', color: GOLD, alpha: sstep(13.7, 14.1, t) });
  text('50 岁时，关系最满意的人', 540, 560, { font: SERIF, size: 52, weight: 900, align: 'center', color: GOLD, alpha: sstep(10.9, 11.4, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  text('到了 80 岁，往往最健康', 540, 650, { font: SERIF, size: 40, weight: 900, align: 'center', color: CREAM, alpha: sstep(13.7, 14.2, t) });
  text('C · 关系', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: GOLD, alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 收入', 200], ['B · 智商', 540], ['C · 关系', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 活得好
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('幸福主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('EUDAIMONISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ⑩ · 完结', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneGood(t) {
  if (t < 19.7 || t > CHASE + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(CHASE - .6, CHASE - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    text('一切，最后都为了幸福', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: D * (1 - sstep(23.8, 24.2, t)) });
    text('不是开心一阵子', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: D * sstep(24.1, 24.6, t) * (1 - sstep(27.4, 27.8, t)) });
    text('而是“活得好”', 540, 640, { font: SERIF, size: 56, weight: 900, align: 'center', color: GOLD, alpha: D * sstep(27.8, 28.3, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
    const ch = D * (1 - sstep(23.8, 24.2, t));                                                        // 为了什么？为了什么？……到幸福为止
    [['工作', 830], ['为了赚钱', 940], ['为了安稳', 1050], ['为了幸福', 1160]].forEach(([s, y], i) => {
      const a = ch * sstep(20.2 + i * .7, 20.6 + i * .7, t), last = i === 3;
      pill(s, 540, y, a, last ? { size: 38, stroke: `rgba(${O_RGB},.9)`, color: GOLD, glow: `rgba(${O_RGB},.6)` } : { size: 32 });
      if (i < 3) text('↓', 540, y + 66, { font: SERIF, size: 30, weight: 900, align: 'center', color: DIM, alpha: ch * sstep(20.5 + i * .7, 20.9 + i * .7, t) });
    });
    text('到这儿，就不再“为了”别的', 540, 1250, { font: SANS, size: 26, align: 'center', color: DIM, alpha: ch * sstep(22.8, 23.2, t) });
    const G = D * sstep(24.1, 24.5, t), base = 1180;
    if (G > 0) {
      ctx.save(); ctx.globalAlpha = G; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, base); ctx.lineTo(900, base); ctx.stroke(); ctx.restore();
      text('一辈子 →', 900, base + 44, { font: SANS, size: 26, align: 'right', color: DIM, alpha: G });
      const sp = 1 - .6 * sstep(26.0, 27.4, t);                                                      // 开心一阵子：冲上去，又掉下来
      drawOn(() => { ctx.moveTo(250, base); ctx.quadraticCurveTo(330, base - 560, 410, base); }, 640, prog(t, 24.3, 25.1), PINK, 5, G * sp, PINK);
      text('开心一阵子', 330, base - 340, { font: SERIF, size: 32, weight: 900, align: 'center', color: PINK, alpha: G * sp * sstep(24.8, 25.2, t) });
      drawOn(() => { ctx.moveTo(180, base - 30); ctx.bezierCurveTo(420, base - 50, 640, base - 120, 900, base - 250); }, 780, prog(t, 27.9, 29.6), GOLD, 6, G * sstep(27.8, 28.0, t), GOLD);
      text('活得好', 760, base - 300, { font: SERIF, size: 40, weight: 900, align: 'center', color: GOLD, alpha: G * sstep(28.6, 29.0, t), glow: `rgba(${O_RGB},.4)`, blur: 12 });
      text('eudaimonia', 760, base - 256, { font: LAT, size: 26, align: 'center', color: DIM, alpha: G * sstep(29.0, 29.4, t) });
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('幸福主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('幸福，是人生最后的目的', 540, 970, { size: 38, weight: 700, font: SERIF, align: 'center', color: GOLD, spread: 4 }, prog(t, 32.3, 33.1), F);
}

// ======================================================================== ③ 越盯越远
function sceneChase(t) {
  if (t < CHASE - .3 || t > BACK + .2) return;
  const A = sstep(CHASE - .1, CHASE + .5, t) * (1 - sstep(BACK - .6, BACK - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - CHASE) / BEAT) % 1);
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('越盯着，越远', 37.7, 40.6, CREAM);
  hd('越看重“要幸福”', 41.0, 44.6, WARMC);
  hd('本该开心，反而失望', 45.0, 48.6, PINK);
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('一边开心，一边检查', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: PINK, alpha: A * sstep(49.0, 49.5, t), glow: 'rgba(229,72,77,.4)', blur: 16 }); ctx.restore();
  const R = A * (1 - sstep(40.6, 41.0, t));                                                          // 人追着光跑，光一直在前面
  if (R > 0) {
    const p = E.io(prog(t, 37.5, 40.6)), px = 190 + 300 * p, ox = px + 340;
    person(px, 1080 - 12 * bk, 1.0, R, CREAM);
    glow(ox, 960 - 10 * Math.sin(t * 3), 30, '255,214,160', R, 10);
    ctx.save(); ctx.globalAlpha = R * .6; ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.setLineDash([8, 10]); ctx.beginPath(); ctx.moveTo(px + 50, 990); ctx.lineTo(ox - 50, 965); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    text('幸福', ox, 1040, { font: SERIF, size: 32, weight: 900, align: 'center', color: GOLD, alpha: R });
    text('还差一点', (px + ox) / 2, 1200, { font: SANS, size: 26, align: 'center', color: DIM, alpha: R * sstep(38.6, 39.0, t) });
  }
  const Fa = A * sstep(40.9, 41.4, t);
  if (Fa > 0) {
    const k = 1 - 1.3 * E.io(prog(t, 45.2, 46.6)), fx = 540, fy = 1010;
    mood(fx, fy, 110, Fa, k, GOLD);
    const ang = (t - 41.2) * 1.6, la = Fa * sstep(41.2, 41.7, t);                                   // 放大镜绕着脸转：检查
    lens(fx + 190 * Math.cos(ang), fy + 150 * Math.sin(ang), 1.0, la, 0, CREAM);
    const m = E.io(prog(t, 41.4, 42.8)) * .85;
    ctx.save(); ctx.globalAlpha = Fa * sstep(41.2, 41.6, t); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(950, 840, 44, 340);
    ctx.fillStyle = WARMC; ctx.fillRect(950, 1180 - 340 * m, 44, 340 * m); ctx.restore();
    text('看重“要幸福”', 972, 1226, { font: SANS, size: 24, align: 'center', color: WARMC, alpha: Fa * sstep(41.2, 41.6, t) });
    text('失望', fx, fy + 170, { font: SERIF, size: 36, weight: 900, align: 'center', color: PINK, alpha: Fa * sstep(46.2, 46.6, t) });
    const B2 = Fa * sstep(49.1, 49.6, t);
    glow(fx + 70, fy - 130, 6, '236,230,218', B2, 2); glow(fx + 96, fy - 166, 9, '236,230,218', B2, 2);
    pill('我够不够开心？', fx, 790, B2, { size: 34, stroke: 'rgba(240,160,160,.8)', color: PINK });
    text('研究 1 是相关研究，研究 2 是实验；参与者都是女性', 540, 1300, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: Fa * sstep(49.6, 50.0, t) });
  }
}

// ======================================================================== ④ 关系
function sceneBack(t) {
  if (t < BACK - .3 || t > LIVE + .2) return;
  const A = sstep(BACK - .1, BACK + .5, t) * (1 - sstep(LIVE - .7, LIVE - .1, t));
  if (A <= 0) return;
  text('幸福从哪来？', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('追了 80 多年', 540, 640, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(58.0, 58.5, t) * (1 - sstep(60.6, 61.0, t)) });
  text('好的关系', 540, 640, { font: SERIF, size: 62, weight: 900, align: 'center', color: GOLD, alpha: A * sstep(60.9, 61.4, t), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  text('更快乐，也更健康', 540, 724, { font: SANS, size: 32, align: 'center', color: CREAM, alpha: A * sstep(61.5, 61.9, t) });
  const Qm = A * sstep(53.8, 54.3, t) * (1 - sstep(57.6, 58.0, t));
  text('?', 540, 1080, { font: SERIF, size: 260, weight: 900, align: 'center', color: '#6f7786', alpha: Qm, glow: 'rgba(255,225,190,.2)', blur: 30 });
  const Y = A * sstep(58.0, 58.4, t) * (1 - sstep(60.6, 61.0, t));
  if (Y > 0) {
    const k = E.io(prog(t, 58.2, 59.9));
    text(k < 1 ? String(Math.round(lerp(1938, 2026, k))) : '今天', 540, 1030, { font: SERIF, size: 130, weight: 900, align: 'center', color: CREAM, alpha: Y });
    text('1938 年开始', 540, 1170, { font: SANS, size: 28, align: 'center', color: DIM, alpha: Y });
    ctx.save(); ctx.globalAlpha = Y; ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(240, 1225, 600, 8); ctx.fillStyle = WARMC; ctx.fillRect(240, 1225, 600 * k, 8); ctx.restore();
  }
  const N = A * sstep(60.9, 61.3, t);
  if (N > 0) {                                                                                       // 一圈人，一条条线连起来
    const pts = Array.from({ length: 8 }, (_, i) => { const a = -PI / 2 + i * TAU / 8; return [540 + 300 * Math.cos(a), 1050 + 190 * Math.sin(a)]; });
    const lk = prog(t, 61.4, 62.8);
    ctx.save(); ctx.strokeStyle = `rgba(${O_RGB},.7)`; ctx.lineWidth = 2.5; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 10;
    for (let i = 0; i < 8; i++) for (const j of [i + 1, i + 3]) {
      const q = clamp(lk * 12 - (i + (j - i === 3 ? 6 : 0)) * .7, 0, 1); if (q <= 0) continue;
      const [x1, y1] = pts[i], [x2, y2] = pts[j % 8];
      ctx.globalAlpha = N * .8; ctx.beginPath(); ctx.moveTo(x1, y1 - 30); ctx.lineTo(lerp(x1, x2, q), lerp(y1 - 30, y2 - 30, q)); ctx.stroke();
    }
    ctx.restore();
    glow(540, 1040, 60, O_RGB, N * lk * .6, 10);
    pts.forEach(([x, y], i) => person(x, y + 30, .55, N * sstep(60.9 + i * .08, 61.2 + i * .08, t), WARMC));
  }
}

// ======================================================================== ⑤ 副产品
function sceneLive(t) {
  if (t < LIVE - .2 || t > CLIMAX + .3) return;
  const A = sstep(LIVE + .2, LIVE + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('别一遍遍问：我幸福吗？', 64.5, 67.6, CREAM);
  hd('今天，我好好对待谁了？', 67.9, 71.9, TEAL, `rgba(${T_RGB},.4)`);
  hd('幸福，是副产品', 72.3, 76.0, GOLD, `rgba(${O_RGB},.4)`);
  hd('一百五十多年前：', 76.4, 0, CREAM);
  const L = A * sstep(64.6, 65.1, t) * (1 - sstep(67.6, 68.0, t));                                   // 把放大镜放下
  if (L > 0) {
    const d = E.io(prog(t, 65.6, 67.0));
    mood(540, 980, 100, L * (1 - .5 * d), .2 + .6 * d, CREAM);
    lens(540 + 60 - 180 * d, 980 - 40 + 220 * d, 1.3, L * (1 - .55 * d), -.9 * d, CREAM);
    text('放下', 540, 1250, { font: SANS, size: 28, align: 'center', color: DIM, alpha: L * sstep(66.6, 67.0, t) });
  }
  const P = A * sstep(68.0, 68.5, t);
  if (P > 0) {
    person(380, 1060, 1.0, P, TEAL); person(700, 1060, 1.0, P, WARMC);
    drawOn(() => { ctx.moveTo(430, 1020); ctx.quadraticCurveTo(540, 960, 650, 1020); }, 260, prog(t, 68.6, 69.6), GOLD, 4, P, GOLD);
    const q = ((t - 69.6) / 1.8) % 1;
    if (t > 69.6) glow(lerp(430, 650, q), 1020 - 120 * q * (1 - q), 8, O_RGB, P * .9, 4);
    [['一起吃饭', 220, 72.6], ['聊聊天', 540, 73.1], ['帮个忙', 860, 73.6]].forEach(([s, x, t0]) => pill(s, x, 1220, P * sstep(t0, t0 + .4, t), { size: 28, stroke: `rgba(${O_RGB},.7)`, color: GOLD }));
    const sp = P * sstep(73.0, 74.0, t);                                                             // 幸福自己来了：暖光往上飘
    if (sp > 0) for (let i = 0; i < 22; i++) {
      const r = mulberry(5300 + i), x = 260 + r() * 560, v = 30 + r() * 40, p = ((t - 73.0) * v / 380 + r()) % 1;
      glow(x + 14 * Math.sin(t + i), 1120 - p * 380, 2 + 2 * r(), O_RGB, sp * (1 - p) * .8, 3);
    }
  }
}

// ======================================================================== ⑥ 十个主义 · 好好生活
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
  const lk = E.io(prog(t, FINAL, FINAL + 1.6));
  if (lk > 0) {
    ctx.save(); ctx.strokeStyle = `rgba(${O_RGB},.55)`; ctx.lineWidth = 2; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 8; ctx.globalAlpha = A;
    pts.forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, cx, lk * .78), lerp(y, cy - 40, lk * .78)); ctx.stroke(); });
    ctx.restore();
  }
  pts.forEach(([x, y, sn], i) => {
    const lit = sstep(84.9 + i * .38, 85.3 + i * .38, t), last = i === 9;
    glow(x, y, 7 + 4 * lit, last ? '255,214,160' : O_RGB, A * (.3 + .7 * lit), 5);
    text(ISMS[i], x, sn < -.1 ? y - 24 : y + 42, { font: SERIF, size: last ? 28 : 24, weight: 900, align: 'center', color: last ? GOLD : CREAM, alpha: A * (.3 + .7 * lit) });
  });
  pair(cx, cy + 20, .9, A, WARMC, .6 + .4 * fin);
  if (fin > 0) for (let i = 0; i < 24; i++) {
    const r = mulberry(5400 + i), x = 380 + r() * 320, v = 30 + r() * 40, p = ((t - FINAL) * v / 420 + r()) % 1;
    glow(x + 16 * Math.sin(t + i), 1120 - p * 420, 2 + 2 * r(), O_RGB, fin * (1 - p) * .8, 3);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('问问自己幸不幸福，', 540, 440, { ...big, size: 58, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('你就不再幸福了。', 540, 552, { ...big, size: 68, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.4, CLIMAX + 2.5), qa);
  typeText('—— 约翰·密尔', 540, 636, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.7, CLIMAX + 3.3), qa);
  typeText('别盯着幸福，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('好好去生活。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneGood(t); sceneChase(t); sceneBack(t); sceneLive(t); sceneFinale(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1938', 'Harvard Study of Adult Development', 8.2, 15.9, T);
  stamp('350 BC', 'Aristotle · Nicomachean Ethics', 16.3, 35.3, T);
  stamp('2011', 'Mauss et al. · Emotion', 40.9, 52.9, T);
  stamp('1938', 'Harvard Study of Adult Development', 53.6, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(53);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在降 B 小调里，最后一个和弦是降 B 大调）
const NOTE = { Bb2: 116.54, Db3: 138.59, D3: 146.83, F3: 174.61, Bb3: 233.08, Db4: 277.18, D4: 293.66, F4: 349.23, Bb4: 466.16, Db5: 554.37, D5: 587.33, F5: 698.46, Bb5: 932.33 };
const BBM_SHIM = [NOTE.Db5, NOTE.F4, NOTE.Bb4, NOTE.Bb3, NOTE.F3], BB_SHIM = [NOTE.D5, NOTE.F4, NOTE.Bb4, NOTE.Bb3, NOTE.F3], BBM_SWELL = [43.65, 58.27, 69.30, 87.31, 116.54];
function CUES() {
  const c = [];
  c.push([.6, 'tink', { f: NOTE.F4, gain: .05 }], [1.0, 'tink', { f: NOTE.Db5, gain: .05 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.Bb2, NOTE.Db3, NOTE.F3], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.F4, gain: .1 }]);
  c.push([Q.REVEAL + .5, 'swell', { dur: 2.5, f: BBM_SWELL, gain: .08 }], [11.0, 'tink', { f: NOTE.Bb4, gain: .06 }], [13.8, 'tink', { f: NOTE.Db5, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BBM_SHIM, gain: .28 }]);
  for (let i = 0; i < 4; i++) c.push([20.2 + i * .7, 'tick', { gain: .14 }]);
  c.push([24.3, 'whoosh', { dur: .6, gain: .1 }], [27.9, 'swell', { dur: 2.0, f: BBM_SWELL, gain: .1 }], [31.7, 'page', { gain: .18 }]);
  c.push([CHASE, 'whoosh', { dur: .5, gain: .25 }], [41.2, 'page', { gain: .12 }], [45.2, 'bar', { f0: 233, f1: 139, dur: 1.4, gain: .07 }], [46.2, 'thud', { gain: .07 }]);
  c.push([49.1, 'chord', { f: [NOTE.Bb2, NOTE.Db3, NOTE.F3], gain: .1 }], [49.2, 'tink', { f: NOTE.Db5, gain: .07 }]);
  c.push([BACK, 'whoosh', { dur: .5, gain: .22 }], [58.2, 'riser', { dur: 1.7, gain: .1 }], [61.0, 'tink', { f: NOTE.F4, gain: .06 }], [61.3, 'tink', { f: NOTE.Bb4, gain: .06 }], [61.6, 'tink', { f: NOTE.Db5, gain: .06 }]);
  c.push([65.6, 'dust', { dur: 1.4, gain: .04 }], [66.9, 'thud', { gain: .05 }], [68.6, 'tink', { f: NOTE.Bb4, gain: .05 }], [69.6, 'tink', { f: NOTE.Db5, gain: .05 }], [72.6, 'page', { gain: .14 }]);
  c.push([76.4, 'page', { gain: .14 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: BBM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BBM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 58.27, gain: .14 }]);
  for (let i = 0; i < 10; i++) c.push([84.9 + i * .38, 'tink', { f: [NOTE.F4, NOTE.Bb4, NOTE.Db5, NOTE.F5, NOTE.Bb5][i % 5] * (i >= 5 ? .5 : 1), gain: .045 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: BB_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Bb2, NOTE.D3, NOTE.F3], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
