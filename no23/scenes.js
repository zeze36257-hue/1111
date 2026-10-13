// ======================================================================== No.23 利他主义：一岁半的你，就会帮别人了
// 第三季·主义 ⑩（完结）。开头是一道选择题：大人的夹子掉了、够不着，一岁半的孩子会怎么做？（Warneken & Tomasello, 2006, Science）
// 音乐：原创配乐（music.py，B 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。开头是一段轻轻摇晃的“摇篮曲”。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 赶时间（每拍一个鼓点） · 53.33 奖励（紧张） · 64.0 给予（只剩钢琴） · 80.0 高潮 · 96.0 B 大调：十种主义
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), HURRY = BT(56), REWARD = BT(80), GIVE = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['婴儿测试', 0, LIFT], ['为他人而活', LIFT, HURRY], ['赶时间', HURRY, REWARD], ['奖励', REWARD, GIVE], ['给予', GIVE, CLIMAX], ['十种主义', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.23';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '一个大人在晾衣服，夹子掉了，伸手够不着。'],
  [4.1, 7.6, '旁边一个一岁半的孩子，会怎么做？先猜一个。'],
  [8.2, 10.4, '答案是：走过去，捡起来，递给他。'],
  [10.8, 13.3, '没人开口，也没有奖励，几乎每个孩子都帮了。'],
  [13.6, 15.7, '而且大多数时候，不到 10 秒。'],
  [16.3, 19.6, '帮助别人，好像是我们生来就会的事。'],
  [19.9, 23.7, '19 世纪，哲学家孔德给它起了个名字：「利他」。'],
  [24.0, 27.4, '意思是：为他人而活。'],
  [27.7, 31.3, '可长大以后，我们还会为别人停下来吗？'],
  [31.6, 35.3, '1973 年，有个实验找来一群神学院学生。'],
  [37.6, 40.6, '让他们去另一栋楼，讲「好撒玛利亚人」的故事。'],
  [40.9, 44.6, '路上，有个人倒在门口，咳嗽、呻吟。'],
  [44.9, 48.6, '不赶时间的学生，63% 停下来帮忙；'],
  [48.9, 52.9, '被告知「已经迟到了」的，只有 10%。'],
  [53.6, 57.6, '还有更意外的：给帮忙的孩子发奖励，'],
  [57.9, 63.4, '结果，拿过玩具奖励的孩子，后来反而更少主动帮忙。'],
  [64.3, 67.6, '善意不需要报酬，它需要的，是时间。'],
  [67.9, 71.9, '一项覆盖 136 个国家的调查发现：'],
  [72.2, 75.9, '在其中 120 个国家，最近捐过钱的人，往往更快乐。'],
  [76.3, 79.6, '马丁·路德·金说过：'],
  [84.9, 88.6, '利他，不是要你牺牲自己。'],
  [88.9, 92.6, '它本来就在你身上。一岁半的时候，你就会了。'],
  [98.4, 103.0, '评论区：最近一次，有陌生人帮过你吗？'],
];
const BIGLINES = [
  [80.2, 92.6, '「人生最持久、最迫切的问题是：你在为别人做什么？」—— 马丁·路德·金'],
  [93.4, 98.0, '第三季「主义」，十种活法，到这里就结束了。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .3], [HURRY - .5, .3], [HURRY, .06], [GIVE, .06],
  [GIVE + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== ① 婴儿测试（0–16）
function kid(x, y, s, a, t, lit = 1, armUp = 0) {
  if (a <= 0) return;
  const bob = Math.sin(t * 2.2 + x * .01) * 2;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + bob); ctx.scale(s, s);
  ctx.strokeStyle = `rgba(255,214,160,${.5 + .45 * lit})`; ctx.fillStyle = `rgba(40,30,22,.9)`; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.shadowColor = `rgba(${O_RGB},${.6 * lit})`; ctx.shadowBlur = 18 * lit;
  ctx.beginPath(); ctx.moveTo(-14, -6); ctx.lineTo(-16, 0); ctx.moveTo(14, -6); ctx.lineTo(16, 0); ctx.stroke();              // 腿
  ctx.beginPath(); ctx.roundRect(-30, -74, 60, 70, 24); ctx.fill(); ctx.stroke();                                           // 身体
  ctx.beginPath(); ctx.moveTo(24, -58); ctx.lineTo(lerp(42, 34, armUp), lerp(-30, -96, armUp)); ctx.stroke();               // 手
  ctx.beginPath(); ctx.moveTo(-24, -58); ctx.lineTo(-40, -30); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -104, 30, 0, TAU); ctx.fill(); ctx.stroke();                                                  // 头
  ctx.restore();
}
function peg(x, y, a, rot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#d8b07a'; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.roundRect(-6, -22, 12, 44, 4); ctx.fill();
  ctx.fillStyle = '#9aa3b2'; ctx.fillRect(-7, -4, 14, 6);
  ctx.restore();
}
function adult(t, a, reach) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(200,210,226,.75)'; ctx.fillStyle = 'rgba(14,16,22,.95)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(820, 1040); ctx.lineTo(790, 1170); ctx.moveTo(820, 1040); ctx.lineTo(850, 1170); ctx.stroke();   // 腿
  ctx.beginPath(); ctx.roundRect(780, 800, 80, 250, 34); ctx.fill(); ctx.stroke();                                            // 身体
  ctx.beginPath(); ctx.moveTo(846, 830); ctx.lineTo(880, 700); ctx.stroke();                                                  // 举着衣服的手
  const hx = lerp(770, 712, reach), hy = lerp(900, 1004, reach);                                                              // 够不着的手
  ctx.beginPath(); ctx.moveTo(796, 836); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.beginPath(); ctx.arc(820, 752, 40, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
  return [hx, hy];
}
function clothesline(t, a) {
  if (a <= 0) return;
  seg(90, 690, 990, 690, 'rgba(200,210,226,.45)', 2, a);
  for (const [x, w, h, col] of [[170, 90, 120, '#4f7a8a'], [300, 110, 90, '#8a5a44'], [450, 80, 130, '#6b5f8a']]) {
    const sw = Math.sin(t * 1.4 + x) * .04;
    ctx.save(); ctx.globalAlpha *= a * .85; ctx.translate(x, 690); ctx.rotate(sw); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, 0, w, h, 6); ctx.fill(); ctx.restore();
    peg(x - w / 2 + 10, 694, a * .9); peg(x + w / 2 - 10, 694, a * .9);
  }
}
function sceneKid(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('夹子掉了，大人够不着。', 540, 452, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('一岁半的孩子会怎么做？', 540, 560, { ...big, size: 72, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  clothesline(t, 1);
  seg(90, 1172, 990, 1172, 'rgba(236,230,218,.18)', 2, 1);
  const reach = .5 + .5 * Math.sin(t * 2.6) * (1 - sstep(Q.REVEAL + 1.6, Q.REVEAL + 2.4, t));
  const [hx, hy] = adult(t, 1, Q.REVEAL + 2.4 < t ? .9 : reach);
  const walk = E.io(prog(t, Q.REVEAL + .1, Q.REVEAL + 1.5)), lift = E.io(prog(t, Q.REVEAL + 1.5, Q.REVEAL + 2.5));
  const kx = lerp(250, 560, walk) + Math.sin(prog(t, Q.REVEAL + .1, Q.REVEAL + 1.5) * PI * 6) * 3 * (1 - walk);
  const px = lerp(612, hx + 6, lift), py = lerp(1158, hy + 20, lift), rot = lerp(1.35, .3, lift);
  peg(px, py, 1, rot);
  if (t < Q.REVEAL + .3) for (const k of [0, 1, 2]) { const ph = (t * .9 + k / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * .5 * (1 - qOut); ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(612, 1158, 16 + ph * 40, 0, TAU); ctx.stroke(); ctx.restore(); }
  kid(kx, 1168, 1, 1, t, .4 + .6 * walk, lift);
  const beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t);
  [['A · 看着', 250], ['B · 等人开口', 540], ['C · 捡给他', 830]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
  const ra = sstep(Q.REVEAL + .2, Q.REVEAL + .6, t);
  if (ra > 0) pill('C · 捡起来，递给他', 540, 1290, ra * (1 - sstep(Q.TIMES - .3, Q.TIMES, t)), { size: 30, stroke: `rgba(${O_RGB},.8)`, color: '#ffd2a0', glow: `rgba(${O_RGB},.5)` });
  text('没人开口 · 没有奖励', 540, 520, { font: SERIF, size: 54, weight: 900, align: 'center', color: CREAM, alpha: sstep(10.8, 11.3, t) * (1 - sstep(13.4, 13.7, t)) });
  text('几乎每个孩子都帮了', 540, 1290, { font: SERIF, size: 40, weight: 900, align: 'center', color: ORANGE, alpha: sstep(Q.TIMES, Q.TIMES + .4, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  text('大多数 < 10 秒', 540, 520, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(13.6, 14.1, t), glow: `rgba(${O_RGB},.5)`, blur: 20 });
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

// ======================================================================== ② 标题 + 孔德：为他人而活
let OTHERS = [];
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 31.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  if (t < 20.6) {
    ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
    ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
    text('利他主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
    ctx.restore();
    seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
    typeText('ALTRUISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
    typeText('第三季 · 主义 ⑩ · 完结', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
  }
  const A1 = sstep(19.9, 20.5, t) * (1 - sstep(23.5, 24.1, t));                         // 词源
  if (A1 > 0) {
    typeText('altruisme', 540, 820, { size: 116, weight: 600, font: LAT, style: 'italic', ls: 6, align: 'center', color: CREAM, spread: 3, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, prog(t, 20.0, 20.9), A1);
    seg(380, 900, 700, 900, `rgba(${O_RGB},.6)`, 2, A1 * sstep(21.0, 21.6, t));
    typeText('拉丁文 alter ·「他人」', 540, 990, { ...big, size: 50, weight: 900 }, prog(t, 21.3, 22.2), A1);
  }
  const A2 = sstep(24.0, 24.6, t) * (1 - sstep(30.9, 31.5, t));                         // 你和别人之间，一根根线亮起来
  if (A2 > 0) {
    OTHERS.forEach((o, i) => {
      const k = sstep(24.3 + o.d * 2.4, 24.9 + o.d * 2.4, t), dim = sstep(27.7, 29.0, t);
      drawOn(() => { ctx.moveTo(540, 960); ctx.lineTo(o.x, o.y); }, 500, k, `rgba(${O_RGB},.5)`, 1.5, A2 * (1 - .7 * dim));
      glow(o.x, o.y, 5 + 3 * o.r, '255,214,160', A2 * k * (1 - .6 * dim), 4);
    });
    you(540, 960, t, A2, 12);
    typeText('为他人而活', 540, 640, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, 24.2, 25.2), A2 * (1 - sstep(27.4, 27.9, t)));
    typeText('vivre pour autrui', 540, 730, { size: 36, weight: 500, font: LAT, style: 'italic', ls: 4, align: 'center', color: DIM, spread: 3 }, prog(t, 25.0, 25.8), A2 * (1 - sstep(27.4, 27.9, t)));
    typeText('还会为别人停下来吗？', 540, 680, { ...big, size: 64, weight: 900 }, prog(t, 27.9, 28.9), A2);
  }
}

// ======================================================================== ③ 赶时间：两栋楼之间，一个人倒在门口
function house(x, y, a, lab) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(232,214,176,.8)'; ctx.lineWidth = 2.5; ctx.fillStyle = 'rgba(20,22,30,.9)';
  ctx.beginPath(); ctx.moveTo(x - 80, y + 70); ctx.lineTo(x - 80, y - 30); ctx.lineTo(x, y - 90); ctx.lineTo(x + 80, y - 30); ctx.lineTo(x + 80, y + 70); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeRect(x - 18, y + 16, 36, 54);
  ctx.restore();
  text(lab, x, y + 118, { font: SANS, size: 26, weight: 500, align: 'center', color: DIM, alpha: a });
}
function slumped(x, y, a, t) {
  if (a <= 0) return;
  const pulse = (t * .8) % 1;
  ctx.save(); ctx.globalAlpha = a * (1 - pulse) * .5; ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 20, 30 + pulse * 50, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(229,140,140,.9)'; ctx.fillStyle = 'rgba(40,20,22,.95)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(x, y - 4, 44, 22, -.2, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x - 40 + Math.sin(t * 3) * 1.5, y - 34, 20, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function sceneHurry(t) {
  if (t < 31.4 || t > REWARD + .2) return;
  const A = sstep(31.5, 32.1, t) * (1 - sstep(REWARD - .6, REWARD - .05, t));
  if (A <= 0) return;
  const py = 900;
  house(170, py - 70, A * sstep(31.6, 32.2, t), '出发');
  house(910, py - 70, A * sstep(32.0, 32.6, t), '讲台');
  drawOn(() => { ctx.moveTo(250, py); ctx.lineTo(830, py); }, 600, sstep(32.4, 33.6, t), 'rgba(236,230,218,.35)', 2, A);
  for (let i = 0; i < 9; i++) glow(250 + 70 * i + 40, py, 2, '236,230,218', A * .4 * sstep(32.8, 33.6, t), 2);
  slumped(540, py + 4, A * sstep(40.9, 41.5, t), t);
  const step = Math.floor((t - HURRY) / BEAT), bounce = 1 - E.out(((t - HURRY) / BEAT) % 1);
  const ax = lerp(250, 430, E.io(prog(t, 41.0, 44.6)));          // 不赶时间：一步一步走，停下来
  const aa = A * sstep(37.6, 38.2, t);
  if (aa > 0) {
    glow(ax, py - 30 - 8 * bounce * (t < 44.6 ? 1 : 0), 11, T_RGB, aa, 5);
    if (t > 45.0) { const ph = (t * .8) % 1; ctx.save(); ctx.globalAlpha = aa * (1 - ph) * .6; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ax, py - 30, 14 + ph * 40, 0, TAU); ctx.stroke(); ctx.restore(); }
  }
  const bk = prog(t, 48.9, 50.0), ba = A * sstep(48.6, 48.9, t);                              // 赶时间：冲过去
  if (ba > 0) {
    const bx = lerp(250, 830, E.inExpo(bk) * .4 + bk * .6);
    for (let k = 0; k < 10; k++) glow(bx - k * 18 * (bk < 1 ? 1 : 0), py - 70, 10 - k * .8, O_RGB, ba * (1 - k / 10) * (k ? .5 : 1), 4);
  }
  if (step < 0) return;
  const bar = (y, pct, k, col, rgb, lab) => {
    if (k <= 0) return;
    text(lab, 150, y - 36, { font: SANS, size: 28, weight: 500, color: col, alpha: A * sstep(0, .2, k) });
    ctx.save(); ctx.globalAlpha = A * .25; ctx.fillStyle = 'rgba(236,230,218,.4)'; ctx.beginPath(); ctx.roundRect(150, y, 780, 30, 10); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.6)`; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.roundRect(150, y, Math.max(12, 780 * pct * E.out(k)), 30, 10); ctx.fill(); ctx.restore();
    text(`${Math.round(pct * 100 * E.out(k))}%`, 930, y - 36, { font: SERIF, size: 40, weight: 900, align: 'right', color: col, alpha: A * sstep(0, .2, k) });
  };
  bar(1120, .63, prog(t, 44.9, 46.2), TEAL, T_RGB, '不赶时间 · 停下来帮忙');
  bar(1250, .10, prog(t, 48.9, 50.2), ORANGE, O_RGB, '「已经迟到了」· 停下来帮忙');
}

// ======================================================================== ④ 奖励：拿过玩具的孩子，后来更少主动帮忙
function gift(x, y, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y + Math.sin(t * 2) * 3);
  ctx.fillStyle = '#c0504d'; ctx.shadowColor = 'rgba(229,72,77,.6)'; ctx.shadowBlur = 16; ctx.fillRect(-30, -30, 60, 52);
  ctx.shadowBlur = 0; ctx.fillStyle = '#f2d27a'; ctx.fillRect(-5, -30, 10, 52); ctx.fillRect(-36, -38, 72, 12);
  ctx.restore();
}
function sceneReward(t) {
  if (t < REWARD - .3 || t > GIVE + .2) return;
  const A = sstep(REWARD - .1, REWARD + .5, t) * (1 - sstep(GIVE - .7, GIVE - .1, t));
  if (A <= 0) return;
  typeText('帮忙 = 奖励？', 540, 640, { ...big, size: 72, weight: 900 }, prog(t, 53.8, 54.8), A);
  const dim = sstep(58.6, 60.4, t);
  kid(330, 1120, 1.15, A * sstep(54.4, 55.0, t), t, 1, 0);
  kid(750, 1120, 1.15, A * sstep(55.0, 55.6, t), t, 1 - .85 * dim, 0);
  gift(850, 1090, A * sstep(55.8, 56.4, t), t);
  pill('夸一夸 / 什么都不给', 330, 1250, A * sstep(54.6, 55.2, t), { size: 26 });
  pill('给玩具奖励', 750, 1250, A * sstep(55.6, 56.2, t), { size: 26, stroke: 'rgba(229,72,77,.7)', color: '#f0a0a0' });
  const k = E.outExpo(prog(t, 60.2, 60.8));
  if (k > 0) text('后来主动帮忙 ↓', 750, 880, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#e5484d', alpha: A * k, glow: 'rgba(229,72,77,.5)', blur: 14 });
}

// ======================================================================== ⑤ 给予：136 个国家，120 个亮起来
let DOTS = [];
function sceneGive(t) {
  if (t < GIVE - .2 || t > CLIMAX + .3) return;
  const A = sstep(GIVE + .2, GIVE + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const A1 = A * (1 - sstep(67.4, 68.0, t));                                                 // 时间：一圈慢慢走完的钟
  if (A1 > 0) {
    const k = prog(t, 64.4, 67.4);
    ctx.save(); ctx.globalAlpha = A1; ctx.strokeStyle = 'rgba(236,230,218,.2)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(540, 960, 200, 0, TAU); ctx.stroke();
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(540, 960, 200, -PI / 2, -PI / 2 + TAU * k); ctx.stroke(); ctx.restore();
    you(540, 960, t, A1, 11);
    text('时间', 540, 1220, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#ffd2a0', alpha: A1 * sstep(65.6, 66.2, t) });
  }
  const A2 = A * sstep(67.9, 68.5, t) * (1 - sstep(76.0, 76.8, t) * .75);
  if (A2 > 0) {
    DOTS.forEach((d, i) => {
      const k = sstep(68.0 + d.r * 1.6, 68.4 + d.r * 1.6, t), on = d.on ? sstep(72.4 + d.r * 1.6, 72.8 + d.r * 1.6, t) : 0;
      if (on > 0) glow(d.x, d.y, 6, O_RGB, A2 * k * on, 4);
      ctx.save(); ctx.globalAlpha = A2 * k * (1 - on) * .6; ctx.fillStyle = '#8a93a3'; ctx.beginPath(); ctx.arc(d.x, d.y, 4, 0, TAU); ctx.fill(); ctx.restore();
    });
    text('136', 540, 1300, { font: SERIF, size: 56, weight: 900, align: 'center', color: CREAM, alpha: A2 * sstep(68.4, 69.0, t) * (1 - sstep(72.2, 72.6, t)) });
    text('120 / 136', 540, 1300, { font: SERIF, size: 56, weight: 900, align: 'center', color: ORANGE, alpha: A2 * sstep(72.6, 73.2, t), glow: `rgba(${O_RGB},.5)`, blur: 16 });
  }
  const ma = A * sstep(76.6, 77.4, t);
  if (ma > 0) text('Montgomery · 1957', 540, 640, { font: LAT, size: 40, weight: 600, style: 'italic', ls: 4, align: 'center', color: DIM, alpha: ma });
}

// ======================================================================== ⑥ 高潮：线一根根连出去；B 大调：十种主义
let NET = [];
const ISMS = ['虚无', '斯多葛', '犬儒', '享乐', '功利', '存在', '完美', '极简', '乐观', '利他'];
function sceneNet(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1040, 760);
  const NA = A * (1 - sstep(92.8, 93.6, t));
  if (NA > 0) {
    NET.forEach(n => {
      const k = sstep(n.t0, n.t0 + .7, t); if (k <= 0) return;
      const p = n.p < 0 ? { x: 540, y: 1060 } : NET[n.p];
      drawOn(() => { ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); }, 400, k, `rgba(${O_RGB},.55)`, 1.5, NA, `rgba(${O_RGB},.5)`);
      glow(n.x + Math.sin(t * .7 + n.x) * 3, n.y + Math.cos(t * .6 + n.y) * 3, 4 + 3 * n.r, '255,214,160', NA * sstep(n.t0 + .5, n.t0 + .9, t), 4);
    });
    you(540, 1060, t, NA, 12);
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「人生最持久、最迫切的问题是：', 540, 500, { ...big, size: 50, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.4), qa);
  typeText('你在为别人做什么？」', 540, 610, { ...big, size: 72, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.5, CLIMAX + 2.4), qa);
  typeText('—— 马丁·路德·金', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 2.6, CLIMAX + 3.2), qa);
  // 第三季结束：十种主义围成一圈，一颗颗亮起来
  const RA = sstep(93.4, 94.2, t);
  if (RA > 0) {
    typeText('第三季「主义」，十种活法，', 540, 470, { ...big, size: 48, weight: 700 }, prog(t, 93.5, 94.5), 1);
    typeText('到这里就结束了。', 540, 560, { ...big, size: 48, weight: 700 }, prog(t, 94.5, 95.3), 1);
    const cx = 540, cy = 1010, R = 250;
    drawOn(() => ctx.arc(cx, cy, R, -PI / 2, -PI / 2 + TAU), TAU * R, E.io(prog(t, 93.6, FINAL)), 'rgba(236,230,218,.25)', 1.5, RA);
    ISMS.forEach((s, i) => {
      const an = -PI / 2 + i / 10 * TAU, x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R;
      const k = sstep(FINAL + i * .22, FINAL + .3 + i * .22, t), pre = sstep(94.0 + i * .18, 94.4 + i * .18, t);
      ctx.save(); ctx.globalAlpha = RA * pre * (1 - k) * .7; ctx.fillStyle = '#8a93a3'; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill(); ctx.restore();
      if (k > 0) glow(x, y, 8 + (i === 9 ? 4 : 0), O_RGB, RA * k, 6);
      const lx = cx + Math.cos(an) * (R + 62), ly = cy + Math.sin(an) * (R + 52);
      text(s, lx, ly + 2, { font: SERIF, size: 30, weight: 900, align: 'center', color: k > .5 ? '#ffd2a0' : '#9aa3b2', alpha: RA * pre });
      text(`No.${14 + i}`, lx, ly + 32, { font: SERIF, size: 18, weight: 500, align: 'center', color: '#6f7786', alpha: RA * pre });
    });
    text('主义', cx, cy - 6, { font: SERIF, size: 92, weight: 900, align: 'center', color: CREAM, alpha: RA * sstep(FINAL + .3, FINAL + 1.2, t), glow: 'rgba(255,225,190,.35)', blur: 30 });
    text('SEASON III · FIN', cx, cy + 74, { font: LAT, size: 24, weight: 600, ls: 6, align: 'center', color: DIM, alpha: RA * sstep(FINAL + 1.0, FINAL + 1.8, t) });
  }
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneKid(t); sceneTitle(t); sceneHurry(t); sceneReward(t); sceneGive(t); sceneNet(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 11) || (T > 14.8 && T < LIFT + 1.2) || (T > 48.8 && T < 50.4)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 24.0, 31.0, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2006', 'Warneken & Tomasello · Science', 8.2, 15.6, T);
  stamp('1851–1854', 'Comte · Système de politique positive', 19.9, 27.4, T);
  stamp('1973', 'Darley & Batson · JPSP', 31.6, 52.9, T);
  stamp('2008', 'Warneken & Tomasello · Dev Psychol', 53.6, 63.4, T);
  stamp('2013', 'Aknin et al. · JPSP', 67.9, 75.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(23);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const ro = mulberry(230);
  OTHERS = Array.from({ length: 16 }, (_, i) => { const an = i / 16 * TAU + (ro() - .5) * .3, R = 220 + ro() * 160; return { x: 540 + Math.cos(an) * R, y: 960 + Math.sin(an) * R * .8, d: ro(), r: ro() }; });
  const rd = mulberry(231);
  DOTS = [];
  for (let j = 0; j < 14 && DOTS.length < 136; j++) for (let i = 0; i < 14 && DOTS.length < 136; i++) {
    const x = 540 + (i - 6.5) * 44, y = 940 + (j - 6.5) * 34;
    if (Math.hypot((x - 540) / 300, (y - 940) / 230) > 1.04) continue;
    DOTS.push({ x, y, r: rd() });
  }
  while (DOTS.length < 136) DOTS.push({ x: 540 + (rd() - .5) * 560, y: 940 + (rd() - .5) * 420, r: rd() });
  const idx = DOTS.map((_, i) => i).sort((a, b) => DOTS[a].r - DOTS[b].r);
  idx.forEach((i, k) => { DOTS[i].on = (k * 7919) % 136 < 120; });
  const rn = mulberry(232);
  NET = [];
  for (let i = 0; i < 44; i++) {
    const an = rn() * TAU, R = 60 + Math.sqrt(rn()) * 300, x = 540 + Math.cos(an) * R, y = 1060 + Math.sin(an) * R * .85;
    let p = -1, best = Math.hypot(x - 540, y - 1060);
    NET.forEach((n, j) => { const dd = Math.hypot(x - n.x, y - n.y); if (dd < best && Math.hypot(n.x - 540, n.y - 1060) < R) { best = dd; p = j; } });
    NET.push({ x, y, p, r: rn(), R });
  }
  NET.forEach(n => { n.t0 = CLIMAX + .6 + n.R / 360 * 7 + rn() * .4; });
  NET.forEach(n => { if (n.p >= 0 && NET[n.p].t0 > n.t0 - .3) n.t0 = NET[n.p].t0 + .3; });
}

// ======================================================================== 音效提示表（音高都在 B 小调里，最后一个和弦是 B 大调）
const NOTE = { B4: 493.88, D5: 587.33, Fs5: 739.99, B5: 987.77, D6: 1174.66, Ds6: 1244.51, Fs6: 1479.98, B6: 1975.53, D7: 2349.32, Ds7: 2489.02 };
const BM_SHIM = [NOTE.D7, NOTE.Fs6, NOTE.B6, NOTE.D6, NOTE.B5], BMAJ_SHIM = [NOTE.Ds7, NOTE.Fs6, NOTE.B6, NOTE.Ds6, NOTE.B5], BM_SWELL = [123.47, 185.0, 246.94, 293.66, 369.99];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.B5, NOTE.D6, NOTE.Fs6], gain: .24 }], [Q.REVEAL + 2.4, 'tink', { f: NOTE.Fs6, gain: .22 }], [Q.TIMES, 'tink', { f: NOTE.D6, gain: .18 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: BM_SHIM, gain: .28 }]);
  c.push([20.0, 'swish', { gain: .2 }], [21.0, 'tink', { f: NOTE.B6, gain: .16 }], [24.3, 'shimmer', { f: BM_SHIM, gain: .2 }]);
  c.push([31.6, 'whoosh', { dur: .6, gain: .2 }], [HURRY, 'whoosh', { dur: .5, gain: .22 }], [40.9, 'thud', { gain: .25 }]);
  c.push([44.9, 'bar', { f0: 330, f1: 587, dur: 1.2, gain: .28 }], [48.9, 'whoosh', { dur: 1.1, gain: .34 }], [49.0, 'bar', { f0: 330, f1: 370, dur: .4, gain: .26 }]);
  c.push([REWARD, 'whoosh', { dur: .5, gain: .22 }], [55.8, 'tink', { f: NOTE.D6, gain: .18 }], [60.2, 'bar', { f0: 659, f1: 330, dur: 1.0, gain: .3 }]);
  c.push([64.4, 'tick', { gain: .18 }], [72.4, 'shimmer', { f: BM_SHIM, gain: .2 }], [72.6, 'chord', { f: [NOTE.B5, NOTE.D6, NOTE.Fs6], gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: BM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: BM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 123.47, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: BMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.B5, NOTE.Ds6, NOTE.Fs6], gain: .2 }]);
  for (let i = 0; i < 10; i++) c.push([FINAL + i * .22, 'tink', { f: [NOTE.B5, NOTE.Ds6, NOTE.Fs6, NOTE.B6][i % 4], gain: .08 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
