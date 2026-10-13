// ======================================================================== No.22 乐观主义：为什么我们总觉得自己会没事
// 第三季·主义 ⑨。开头是一道选择题：刚领结婚证的新人，觉得自己将来离婚的可能性有多大？（Baker & Emery, 1993）
// 音乐：原创配乐（music.py，F 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。开头是一串慢慢往上走的钢琴分解和弦。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 计划谬误（每拍一个鼓点） · 53.33 美好幻想（紧张） · 64.0 乐观的好处（只剩钢琴） · 80.0 高潮 · 96.0 F 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), PLAN = BT(56), DREAM = BT(80), GOOD = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['婚礼测试', 0, LIFT], ['最好的世界', LIFT, PLAN], ['计划谬误', PLAN, DREAM], ['美好幻想', DREAM, GOOD], ['乐观的好处', GOOD, CLIMAX], ['种园子', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.22';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '美国一项研究，问了一群刚领结婚证的新人：'],
  [4.1, 7.6, '你觉得自己将来离婚的可能性，有多大？先猜一个。'],
  [8.2, 10.4, '答案是：中位数，0%。'],
  [10.8, 13.3, '可他们估计别人离婚的可能性，是 50% 左右。'],
  [13.6, 15.7, '别人会出事，我不会。'],
  [16.3, 19.6, '心理学叫它「乐观偏差」：总觉得坏事更容易落在别人头上。'],
  [19.9, 23.7, '而「乐观主义」这个词，来自拉丁文的「最好」。'],
  [24.0, 27.4, '1710 年，哲学家莱布尼茨说：'],
  [27.7, 31.3, '我们活在所有可能的世界里，最好的那一个。'],
  [31.6, 35.3, '后来里斯本大地震，伏尔泰写了《老实人》嘲讽这种乐观。'],
  [37.6, 40.6, '今天，乐观偏差最常藏在计划里。'],
  [40.9, 44.6, '研究者让大学生估计：毕业论文多久能写完？'],
  [44.9, 48.6, '他们平均估 34 天，实际用了 56 天。'],
  [48.9, 52.9, '按自己预计的时间写完的，只有大约三成。'],
  [53.6, 57.6, '更麻烦的是：把未来想得太美，反而可能不去行动。'],
  [57.9, 63.4, '一项减肥研究：越爱幻想轻松变瘦的人，一年后反而瘦得越少。'],
  [64.3, 67.6, '那乐观是坏事吗？也不是。'],
  [67.9, 71.9, '一项汇总了 22 万多人的研究发现：越乐观的人，'],
  [72.2, 75.9, '心血管出问题的风险，低了大约三分之一。'],
  [76.3, 79.6, '又盲又聋的海伦·凯勒，写过一篇《乐观》：'],
  [84.9, 88.6, '乐观，不是相信一切都会变好。'],
  [88.9, 92.6, '而是相信：你能让一些事，变好一点。'],
  [98.4, 103.0, '评论区：你最近定的一个计划，实际拖了多久？'],
];
const BIGLINES = [
  [80.2, 92.6, '「乐观，是引向成就的信念。没有希望和信心，什么也做不成。」—— 海伦·凯勒《乐观》'],
  [93.4, 103.0, '老实人最后说：「我们还是种好自己的园子吧。」—— 伏尔泰《老实人》'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .3], [PLAN - .5, .3], [PLAN, .06], [GOOD, .06],
  [GOOD + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== ① 婚礼测试（0–16）
function rings(x, y, s, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * .6) * .05);
  for (const [dx, col, glo] of [[-58, '#f3c77a', 'rgba(243,199,122,.55)'], [58, '#e9e2d4', 'rgba(233,226,212,.45)']]) {
    const g = ctx.createLinearGradient(dx - 110, -110, dx + 110, 110); g.addColorStop(0, '#fff2cf'); g.addColorStop(.5, col); g.addColorStop(1, '#8a6a3a');
    ctx.strokeStyle = g; ctx.lineWidth = 22; ctx.shadowColor = glo; ctx.shadowBlur = 26;
    ctx.beginPath(); ctx.ellipse(dx, 0, 108, 108, 0, 0, TAU); ctx.stroke();
  }
  ctx.shadowBlur = 0; ctx.strokeStyle = '#fff8e8'; ctx.lineWidth = 3; ctx.globalAlpha *= .7;    // 高光
  ctx.beginPath(); ctx.arc(-58, 0, 100, -2.4, -1.6); ctx.stroke(); ctx.beginPath(); ctx.arc(58, 0, 100, -2.4, -1.6); ctx.stroke();
  const sp = (t * .4) % 1; glow(-58 + Math.cos(-2 + sp * TAU) * 108, Math.sin(-2 + sp * TAU) * 108, 3, '255,250,230', .9 * Math.sin(PI * sp), 6);
  ctx.restore();
}
function tag(s, sub, x, y, a, col, sc = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.05);
  ctx.fillStyle = 'rgba(20,22,30,.92)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(-110, -56); ctx.lineTo(90, -56); ctx.lineTo(126, 0); ctx.lineTo(90, 56); ctx.lineTo(-110, 56); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(94, 0, 7, 0, TAU); ctx.fill();
  ctx.restore();
  text(sub, x - 8, y - 22, { font: SANS, size: 24, weight: 500, align: 'center', color: '#9aa3b2', alpha: a });
  text(s, x - 8, y + 16, { font: SERIF, size: 48 * sc, weight: 900, align: 'center', color: col, alpha: a });
}
function sceneRings(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('刚领结婚证的新人：', 540, 492, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('自己会离婚的可能性？', 540, 600, { ...big, size: 76, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const rev = E.out(prog(t, Q.REVEAL, Q.REVEAL + .4)), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  rings(540, 880, 1 + .04 * rev * (1 - prog(t, Q.REVEAL + .4, Q.REVEAL + 1)), 1, t);
  tag('0%', '自己', 850, 1110, rev, ORANGE, 1 + .15 * (1 - prog(t, Q.REVEAL, Q.REVEAL + .6)));
  if (t < Q.REVEAL + .4) tag('?', '自己', 850, 1110, 1 - rev, '#c3cad6');
  tag('≈ 50%', '别人', 230, 1110, sstep(Q.TIMES, Q.TIMES + .4, t), TEAL);
  const ma = sstep(Q.REVEAL + .3, Q.REVEAL + .8, t) * (1 - sstep(Q.TIMES - .2, Q.TIMES + .2, t));
  if (ma > 0) text('（中位数）', 850, 1206, { font: SANS, size: 24, weight: 500, align: 'center', color: DIM, alpha: ma });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t);
  [['A · 50%', 270], ['B · 20%', 540], ['C · 0%', 810]].forEach(([s, x]) => pill(s, x, 1270, oa, { size: 30, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 + 词源
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 24.2) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  if (t < 20.6) {
    ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
    ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
    text('乐观主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
    ctx.restore();
    seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
    typeText('OPTIMISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 24, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
    typeText('第三季 · 主义 ⑨', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
  }
  // 词源：OPTIMUM = 最好
  const A = sstep(19.9, 20.5, t) * (1 - sstep(23.5, 24.1, t));
  if (A > 0) {
    typeText('optimum', 540, 820, { size: 120, weight: 600, font: LAT, style: 'italic', ls: 6, align: 'center', color: CREAM, spread: 3, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, prog(t, 20.0, 20.9), A);
    seg(400, 900, 680, 900, `rgba(${O_RGB},.6)`, 2, A * sstep(21.0, 21.6, t));
    typeText('拉丁文 · 「最好」', 540, 990, { ...big, size: 56, weight: 900 }, prog(t, 21.3, 22.2), A);
  }
}

// ======================================================================== ③ 最好的世界：无数个可能的世界，选中一个；然后地震
let WORLDS = [];
function orb(x, y, r, a, col = '120,140,170', lit = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r);
  g.addColorStop(0, `rgba(${col},${.55 + .4 * lit})`); g.addColorStop(1, `rgba(${col},.08)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(${col},${.5 + .5 * lit})`; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}
function sceneBest(t) {
  if (t < 23.8 || t > PLAN + .2) return;
  const A = sstep(23.9, 24.5, t) * (1 - sstep(PLAN - .7, PLAN - .1, t));
  if (A <= 0) return;
  const pick = E.io(prog(t, 27.7, 29.4)), quake = sstep(31.6, 31.9, t) * (1 - sstep(34.0, 35.5, t));
  ctx.save();
  if (quake > 0) ctx.translate(Math.sin(t * 61) * 14 * quake, Math.cos(t * 47) * 10 * quake);
  WORLDS.forEach((w, i) => {
    const k = sstep(24.1 + w.d * 1.8, 24.6 + w.d * 1.8, t), dr = Math.sin(t * w.sp + w.ph) * 6;
    orb(w.x + dr, w.y - dr, w.r, A * k * (1 - .75 * pick), '120,140,170');
  });
  const cx = 540, cy = 930, R = lerp(60, 170, pick);                                    // 被选中的「最好的世界」
  const red = sstep(31.6, 32.4, t);
  orb(cx, cy, R, A * sstep(24.2, 24.8, t), red > 0 ? `${Math.round(lerp(242, 229, red))},${Math.round(lerp(190, 72, red))},${Math.round(lerp(120, 77, red))}` : '242,190,120', pick);
  if (pick > .5) glow(cx, cy, R * .25, O_RGB, A * (pick - .5) * 1.2 * (1 - .7 * red), 6);
  if (red > 0) {                                                                         // 裂缝
    const cr = [[[0, 0], [-40, -50], [-60, -120], [-90, -150]], [[0, 0], [50, 30], [70, 100], [120, 110]], [[0, 0], [-30, 60], [-20, 130]], [[0, 0], [60, -70], [100, -90]]];
    cr.forEach((c, i) => drawOn(() => c.forEach(([x, y], j) => j ? ctx.lineTo(cx + x * R / 170, cy + y * R / 170) : ctx.moveTo(cx, cy)), 260, sstep(31.7 + i * .12, 32.4 + i * .12, t), 'rgba(255,230,210,.95)', 3, A, 'rgba(229,72,77,.8)'));
  }
  ctx.restore();
  const la = A * pick * (1 - sstep(31.4, 31.9, t));
  if (la > 0) pill('最好的那一个', 540, 1180, la, { size: 30, stroke: `rgba(${O_RGB},.7)`, color: '#ffd2a0' });
  const qa = A * sstep(31.8, 32.4, t);
  if (qa > 0) {
    text('1755 · 里斯本大地震', 540, 1180, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#e5484d', alpha: qa * (1 - sstep(33.6, 34.1, t)) });
    pill('《老实人》 1759', 540, 1180, A * sstep(33.8, 34.4, t), { size: 30 });
  }
  text('莱布尼茨', 540, 640, { font: SERIF, size: 44, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(24.4, 25.0, t) * (1 - sstep(31.2, 31.8, t)) });
  text('伏尔泰', 540, 640, { font: SERIF, size: 44, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(33.8, 34.4, t) });
}

// ======================================================================== ④ 计划谬误：预计 34 天，实际 56 天（每拍跳一天）
function scenePlan(t) {
  if (t < PLAN - .3 || t > DREAM + .2) return;
  const A = sstep(PLAN - .1, PLAN + .5, t) * (1 - sstep(DREAM - .6, DREAM - .05, t));
  if (A <= 0) return;
  const x0 = 120, x1 = 960, px = d => x0 + (x1 - x0) * d / 60, y = 960;
  seg(x0, y, x1, y, 'rgba(236,230,218,.25)', 2, A);
  for (let d = 0; d <= 60; d += 10) { seg(px(d), y - 8, px(d), y + 8, 'rgba(236,230,218,.35)', 1.5, A); text(String(d), px(d), y + 46, { font: SERIF, size: 24, weight: 500, align: 'center', color: '#6f7786', alpha: A }); }
  text('天', x1 + 34, y + 46, { font: SANS, size: 22, align: 'center', color: '#6f7786', alpha: A });
  const pk = E.out(prog(t, 44.9, 45.9));                                                   // 预计
  if (pk > 0) {
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = `rgba(${T_RGB},.75)`; ctx.shadowColor = `rgba(${T_RGB},.6)`; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.roundRect(x0, y - 120, (px(33.9) - x0) * pk, 34, 10); ctx.fill(); ctx.restore();
    text('预计 33.9 天', x0, y - 152, { font: SERIF, size: 34, weight: 900, color: TEAL, alpha: A * pk });
  }
  const ak = prog(t, 46.0, 48.4);                                                          // 实际：一拍一拍往前拱
  if (ak > 0) {
    const wob = 1 - E.out(((t - PLAN) / BEAT) % 1);
    const d = 55.5 * E.io(ak);
    ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = `rgba(${O_RGB},.85)`; ctx.shadowColor = `rgba(${O_RGB},.7)`; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.roundRect(x0, y - 66, px(d) - x0, 34 + 4 * wob * (ak < 1 ? 1 : 0), 10); ctx.fill(); ctx.restore();
    text(`实际 ${ak >= 1 ? '55.5' : d.toFixed(1)} 天`, px(55.5), y - 152, { font: SERIF, size: 34, weight: 900, align: 'right', color: ORANGE, alpha: A * sstep(46.0, 46.4, t) });
  }
  // 还没开始的时候：一个日历在每个鼓点翻一页
  const ca = A * (1 - sstep(44.6, 45.2, t));
  if (ca > 0) {
    const day = Math.max(1, Math.floor((t - PLAN) / BEAT) + 1), flip = 1 - E.out(((t - PLAN) / BEAT) % 1);
    ctx.save(); ctx.globalAlpha = ca; ctx.translate(540, 700); ctx.scale(1 + .04 * flip, 1 + .04 * flip);
    ctx.fillStyle = 'rgba(236,230,218,.08)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-120, -130, 240, 260, 18); ctx.fill(); ctx.stroke();
    ctx.fillStyle = `rgba(${O_RGB},.8)`; ctx.beginPath(); ctx.roundRect(-120, -130, 240, 60, [18, 18, 0, 0]); ctx.fill();
    ctx.restore();
    text('DAY', 540, 600, { font: LAT, size: 30, weight: 700, ls: 8, align: 'center', color: '#1a1206', alpha: ca });
    text(String(day), 540, 730, { font: SERIF, size: 120, weight: 900, align: 'center', color: CREAM, alpha: ca });
  }
  // 按时完成：10 个点亮 3 个
  const da = A * sstep(48.9, 49.4, t);
  if (da > 0) {
    for (let i = 0; i < 10; i++) {
      const k = sstep(49.0 + i * .08, 49.3 + i * .08, t), on = i < 3 && t > 50.0;
      if (on) glow(234 + i * 68, 1180, 13, O_RGB, da * k, 5);
      else { ctx.save(); ctx.globalAlpha = da * k; ctx.strokeStyle = 'rgba(236,230,218,.45)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(234 + i * 68, 1180, 13, 0, TAU); ctx.stroke(); ctx.restore(); }
    }
    text('按时完成 ≈ 30%', 540, 1262, { font: SERIF, size: 40, weight: 900, align: 'center', color: ORANGE, alpha: da * sstep(50.0, 50.5, t) });
  }
}

// ======================================================================== ⑤ 美好幻想：脑袋里的梦越来越亮，人却一动不动
function sceneDream(t) {
  if (t < DREAM - .3 || t > GOOD + .2) return;
  const A = sstep(DREAM - .1, DREAM + .5, t) * (1 - sstep(GOOD - .7, GOOD - .1, t));
  if (A <= 0) return;
  const big = sstep(54.0, 57.6, t), cx = 540, cy = 760;
  for (let i = 0; i < 3; i++) glow(560 + i * 34, 1080 - i * 70, 6 + i * 5, '255,214,160', A * sstep(53.8 + i * .3, 54.3 + i * .3, t) * .7, 4);
  ctx.save(); ctx.globalAlpha = A * sstep(54.4, 55.2, t);                                   // 云朵形的梦
  ctx.translate(cx, cy); ctx.scale(.7 + .35 * big, .7 + .35 * big);
  const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 280); g.addColorStop(0, 'rgba(255,214,160,.55)'); g.addColorStop(1, 'rgba(255,170,90,.04)');
  ctx.fillStyle = g; ctx.shadowColor = 'rgba(255,190,120,.6)'; ctx.shadowBlur = 40;
  ctx.beginPath(); for (const [x, y, r] of [[-150, 20, 110], [-50, -60, 140], [90, -40, 130], [170, 40, 100], [20, 70, 130]]) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); } ctx.fill();
  ctx.restore();
  for (let i = 0; i < 18; i++) {                                                             // 梦里亮晶晶的东西
    const r = mulberry(2200 + i), x = cx + (r() - .5) * 420 * (.7 + .35 * big), y = cy + (r() - .5) * 240 * (.7 + .35 * big);
    glow(x, y + Math.sin(t * 1.3 + i) * 6, 2 + 3 * r(), '255,250,235', A * sstep(55.2 + i * .1, 55.6 + i * .1, t) * (.5 + .5 * Math.sin(t * 2 + i)), 4);
  }
  const dim = sstep(57.9, 60.0, t);
  you(540, 1180, t, A * (1 - .6 * dim), 12);
  const still = A * sstep(58.4, 59.0, t);
  if (still > 0) { ctx.save(); ctx.globalAlpha = still * .5; ctx.setLineDash([6, 10]); ctx.strokeStyle = CREAM; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(600, 1180); ctx.lineTo(900, 1180); ctx.stroke(); ctx.restore(); }
  [['幻想越美', '↑', 58.6, ORANGE, 300], ['瘦得越少', '↓', 60.6, TEAL, 780]].forEach(([lab, sym, t0, col, x]) => {
    const k = E.outExpo(prog(t, t0, t0 + .6)); if (k <= 0) return;
    pill(`${lab} ${sym}`, x, 1300, A * k, { size: 30, stroke: col, color: col });
  });
}

// ======================================================================== ⑥ 乐观的好处：一条心电图被画出来；盲文的点
function sceneGood(t) {
  if (t < GOOD - .2 || t > CLIMAX + .3) return;
  const A = sstep(GOOD + .2, GOOD + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const ecg = u => { const p = (u * 4) % 1; return p < .38 ? 0 : p < .42 ? -22 * (p - .38) / .04 : p < .46 ? 140 * (p - .42) / .04 - 22 : p < .5 ? -170 * (p - .46) / .04 + 118 : p < .54 ? 52 * (p - .5) / .04 - 52 : p < .7 ? 18 * Math.sin((p - .54) / .16 * PI) : 0; };
  const k = prog(t, 67.9, 72.2), y0 = 960, ea = A * (1 - sstep(75.8, 76.4, t));
  if (k > 0 && ea > 0) {
    drawOn(() => { for (let u = 0; u <= 1; u += .0025) { const x = 80 + u * 920, y = y0 - ecg(u); u ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }, 2600, k, ORANGE, 4, ea, `rgba(${O_RGB},.8)`);
    const hx = 80 + 920 * clamp(k * 1.0), hy = y0 - ecg(clamp(k)); if (k < 1) glow(hx, hy, 6, '255,230,200', ea, 6);
    const hb = (t * 1.2) % 1;
    text('♥', 540, 720, { font: SANS, size: 120 * (1 + .08 * Math.max(0, 1 - hb * 4)), weight: 900, align: 'center', color: '#e5484d', alpha: ea * sstep(68.2, 68.8, t), glow: 'rgba(229,72,77,.6)', blur: 30 });
  }
  const ra = ea * sstep(72.4, 73.0, t);
  if (ra > 0) text('风险 −35%', 540, 1200, { font: SERIF, size: 64, weight: 900, align: 'center', color: TEAL, alpha: ra, glow: `rgba(${T_RGB},.5)`, blur: 18 });
  // 盲文：一颗颗凸起的点
  const ba = A * sstep(76.3, 77.0, t);
  if (ba > 0) {
    const r = mulberry(2222);
    for (let c = 0; c < 8; c++) for (let j = 0; j < 6; j++) {
      if (r() < .45) continue;
      const x = 270 + c * 76 + (j % 2) * 26, y = 870 + Math.floor(j / 2) * 26, kk = sstep(76.4 + c * .18 + j * .02, 76.8 + c * .18 + j * .02, t);
      glow(x, y, 6, '236,230,218', ba * kk * .9, 3);
    }
    text('Helen Keller · Optimism · 1903', 540, 1010, { font: LAT, size: 30, weight: 600, style: 'italic', ls: 2, align: 'center', color: DIM, alpha: ba * sstep(77.4, 78.0, t) });
  }
  you(540, 900, t, A * (1 - sstep(66.6, 67.6, t)), 11);
}

// ======================================================================== ⑦ 种园子：土里冒出嫩芽，长大，开花
let SPROUTS = [];
function sprout(x, base, h, a, t, bloom, i) {
  if (a <= 0 || h <= 0) return;
  const sway = Math.sin(t * .9 + i) * 6 * h / 200;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#7fb27a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x - 6, base - h * .5, x + sway, base - h); ctx.stroke();
  ctx.fillStyle = '#8fc483';
  for (const [u, s] of [[.45, 1], [.7, -1]]) {
    if (h < 40) continue;
    const lx = x + sway * u, ly = base - h * u, L = Math.min(34, h * .2);
    ctx.beginPath(); ctx.ellipse(lx + s * L * .6, ly - 4, L * .6, L * .25, s * -.5, 0, TAU); ctx.fill();
  }
  ctx.restore();
  if (bloom > 0) {
    const fx = x + sway, fy = base - h;
    glow(fx, fy, 10 + 6 * bloom, O_RGB, a * bloom, 6);
    ctx.save(); ctx.globalAlpha *= a * bloom; ctx.fillStyle = '#ffd2a0';
    for (let p = 0; p < 5; p++) { const an = p / 5 * TAU + t * .2; ctx.beginPath(); ctx.ellipse(fx + Math.cos(an) * 12 * bloom, fy + Math.sin(an) * 12 * bloom, 9 * bloom, 5 * bloom, an, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
}
function sceneGarden(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1140, 760);
  const ground = 1240;
  ctx.save(); ctx.globalAlpha = A; const gg = ctx.createLinearGradient(0, ground, 0, ground + 120); gg.addColorStop(0, 'rgba(90,64,40,.55)'); gg.addColorStop(1, 'rgba(90,64,40,0)');
  ctx.fillStyle = gg; ctx.fillRect(100, ground, 880, 120); ctx.restore();
  seg(100, ground, 980, ground, 'rgba(216,190,150,.5)', 2, A);
  SPROUTS.forEach((s, i) => {
    const g = E.out(prog(t, CLIMAX + 1 + s.d * 10, CLIMAX + 4 + s.d * 10 + s.h / 80)), bl = E.outExpo(prog(t, FINAL + s.d * 1.6, FINAL + .8 + s.d * 1.6));
    sprout(s.x, ground, s.h * g * (1 + .25 * sstep(FINAL, FINAL + 3, t)), A * sstep(0, .05, g), t, s.fl ? bl : 0, i);
  });
  you(540, ground - 30, t, A * (1 - sstep(CLIMAX + 6, CLIMAX + 9, t)), 11);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「乐观，是引向成就的信念。', 540, 520, { ...big, size: 58, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('没有希望和信心，', 540, 620, { ...big, size: 58, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 1.4, CLIMAX + 2.1), qa);
  typeText('什么也做不成。」', 540, 710, { ...big, size: 58, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.1, CLIMAX + 2.8), qa);
  typeText('—— 海伦·凯勒《乐观》', 540, 800, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.0, CLIMAX + 3.6), qa);
  typeText('老实人最后说：', 540, 556, { ...big, size: 46, weight: 700 }, prog(t, 93.4, 94.2), 1);
  typeText('「我们还是种好', 540, 672, { ...big, size: 76, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .6), 1);
  typeText('自己的园子吧。」', 540, 772, { ...big, size: 76, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL + .5, FINAL + 1.1), 1);
  typeText('—— 伏尔泰《老实人》', 540, 870, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, FINAL + 1.2, FINAL + 1.8), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneRings(t); sceneTitle(t); sceneBest(t); scenePlan(t); sceneDream(t); sceneGood(t); sceneGarden(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2) || (T > 31.5 && T < 35.6)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 27.7, 31.5, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1993', 'Baker & Emery · Law and Human Behavior', 8.2, 15.6, T);
  stamp('1710 · 1759', 'Leibniz, Théodicée · Voltaire, Candide', 24.0, 35.3, T);
  stamp('1994', 'Buehler, Griffin & Ross · JPSP', 40.9, 52.9, T);
  stamp('1991', 'Oettingen & Wadden · Cogn Ther Res', 57.9, 63.4, T);
  stamp('2019', 'Rozanski et al. · JAMA Netw Open', 67.9, 75.9, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(22);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rw = mulberry(220);
  WORLDS = [];
  while (WORLDS.length < 26) {
    const x = 120 + rw() * 840, y = 640 + rw() * 600, rr = 18 + rw() * 34;
    if (Math.hypot(x - 540, y - 930) < 200 || WORLDS.some(w => Math.hypot(w.x - x, w.y - y) < w.r + rr + 16)) continue;
    WORLDS.push({ x, y, r: rr, d: rw(), sp: .4 + rw(), ph: rw() * TAU });
  }
  const rs = mulberry(221);
  SPROUTS = Array.from({ length: 11 }, (_, i) => { const x = 150 + i * 78 + (rs() - .5) * 30; return { x, h: 90 + rs() * 170 * (1 - Math.abs(x - 540) / 900), d: rs(), fl: rs() < .75 }; }).filter(s => Math.abs(s.x - 540) > 40);
}

// ======================================================================== 音效提示表（音高都在 F 小调里，最后一个和弦是 F 大调）
const NOTE = { F5: 698.46, Ab5: 830.61, A5: 880, C6: 1046.5, F6: 1396.91, Ab6: 1661.22, A6: 1760, C7: 2093.0, F7: 2793.83 };
const FM_SHIM = [NOTE.Ab6, NOTE.C7, NOTE.F6, NOTE.F7, NOTE.C6], FMAJ_SHIM = [NOTE.A6, NOTE.C7, NOTE.F6, NOTE.F7, NOTE.C6], FM_SWELL = [174.61, 261.63, 349.23, 415.30, 523.25];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .26 }], [Q.REVEAL, 'ding', { gain: .3 }], [Q.TIMES, 'tink', { f: NOTE.C6, gain: .2 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: FM_SHIM, gain: .28 }]);
  c.push([20.0, 'swish', { gain: .2 }], [21.0, 'tink', { f: NOTE.F6, gain: .16 }]);
  c.push([27.7, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .16 }], [27.8, 'shimmer', { f: FM_SHIM, gain: .18 }]);
  c.push([31.6, 'boom', { gain: .5 }], [31.65, 'crack', { gain: .4 }], [31.7, 'dust', { dur: 2.6, gain: .22 }], [33.8, 'page', { gain: .25 }]);
  c.push([PLAN, 'whoosh', { dur: .5, gain: .25 }], [44.9, 'bar', { f0: 330, f1: 523, dur: .9, gain: .26 }], [46.0, 'bar', { f0: 330, f1: 698, dur: 2.2, gain: .3 }]);
  for (let i = 0; i < 3; i++) c.push([50.0 + i * .08, 'click', { gain: .26 }]);
  c.push([DREAM, 'whoosh', { dur: .5, gain: .22 }], [55.2, 'shimmer', { f: FM_SHIM, gain: .2 }], [60.6, 'bar', { f0: 659, f1: 330, dur: 1.0, gain: .3 }]);
  c.push([67.9, 'tink', { f: NOTE.C6, gain: .16 }], [72.4, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .14 }], [76.4, 'dust', { dur: 2, gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: FM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: FM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 87.31, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: FMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.F5, NOTE.A5, NOTE.C6], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
