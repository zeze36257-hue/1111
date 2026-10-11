// ======================================================================== No.15 斯多葛主义：只管你能控制的
// 第三季·主义 ②。开头用“通知雪崩 + 互动测试”留住人：
//   0 秒：手机通知一条条砸下来（老板、成绩、已读不回、房租、裁员……），红点涨到 99+；
//   2.75 秒：一切戛然而止，“这里面，有几件是你能控制的？”；倒数 3·2·1 让观众自己选；
//   卡片一张张飞进“控制不了”，连“你的身体”也是；最后只有一张橙色的卡飞进“控制得了”：你怎么看、怎么回应。
// 音乐：开头 3.59 秒只有音效；之后接参考 BGM（110 BPM），21.0 全编制进入；45.0 抽空接安静段；69.72 在“松手”的一刻重新爆发。
const BEAT = 60 / 110, BAR = BEAT * 4;
const LEAD = 3.59, DROP = 21.0, CUT = 45.0, REBUILD = 69.72, TOTAL = 87.4;
const SECTIONS = [['一个测试', 0, DROP], ['奴隶与皇帝', DROP, CUT], ['战俘', CUT, 58.2], ['大脑', 58.2, 66.2], ['弓箭手', 66.2, 78.8], ['问自己', 78.8, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.15';

const LINES = [
  [-.6, 2.65, '你的焦虑，是不是长这样？'],
  [3.3, 6.5, '先在心里数一数，再往下看。'],
  [9.6, 14.2, '它们的「结果」，都不完全由你决定。'],
  [14.5, 16.4, '就连你的身体，也不完全由你决定。'],
  [16.6, 20.6, '你真正能控制的，只有一件：你怎么看它、怎么回应它。'],
  [21.5, 24.6, '这个答案，来自两千年前的一个奴隶。'],
  [25.0, 28.6, '他叫爱比克泰德，生来是奴隶。'],
  [28.9, 33.3, '他说：有些事取决于我们，有些事不取决于我们。'],
  [33.6, 37.4, '几十年后，罗马皇帝马可·奥勒留，'],
  [37.7, 41.5, '在只写给自己的日记里，一次次引用他的话。'],
  [45.4, 49.8, '1965 年，飞行员斯托克代尔被击落，当了七年多战俘。'],
  [50.1, 53.7, '他说，撑住他的，是爱比克泰德。'],
  [54.0, 57.9, '而最先撑不住的，是那些总说「圣诞节就能出去」的乐观者。'],
  [58.3, 61.7, '两千年后，有人用脑成像验证了这个想法：'],
  [62.0, 66.0, '换个角度去想同一张让人难受的照片，杏仁核的反应会变弱。'],
  [66.3, 69.5, '斯多葛还有一个比喻：弓箭手。'],
  [74.8, 78.5, '射中靶心，从来不全由你；把这一箭射好，才是你的事。'],
  [79.2, 82.6, '控制得了，就去做；控制不了，就放下。'],
  [82.9, 87.2, '评论区：写下一件你控制不了、却一直放不下的事。'],
];

// ======================================================================== 共用
function space(t) {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, '#11161f'); g.addColorStop(.55, '#080a11'); g.addColorStop(1, '#020305');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function aurora(t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, r, rgb, al, ph] of [[220, 520, 760, O_RGB, .08, 0], [880, 1420, 820, T_RGB, .06, 2], [700, 900, 600, '120,110,200', .05, 4]]) {
    const cx = x + Math.sin(t * .13 + ph) * 90, cy = y + Math.cos(t * .11 + ph) * 70;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(${rgb},${al * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
let STARS = [];
function starfield(t, A) {
  if (A <= 0) return;
  ctx.save();
  for (const s of STARS) {
    let x = s.x - t * 3 * s.z; x = ((x + 20) % (W + 40) + W + 40) % (W + 40) - 20;
    const y = s.y - t * 1.2 * s.z, al = A * s.b * (.72 + .28 * Math.sin(t * s.tw + s.ph));
    if (al <= .012 || y < -6 || y > H + 6) continue;
    ctx.globalAlpha = Math.min(1, al); ctx.fillStyle = s.warm ? '#ffdcae' : '#e2eaff';
    ctx.fillRect(x - s.s / 2, y - s.s / 2, s.s, s.s);
  }
  ctx.restore();
}
const STAR_A = track([[0, 0], [21, 0], [22, .3], [44.9, .3], [45.0, 0, E.lin], [47.2, 0], [49, .18], [58, .18], [60, .3], [TOTAL, .35]]);
function seriesTag(y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  font(30, 500); ctx.letterSpacing = '6px'; const w = ctx.measureText(SERIES).width;
  text(SERIES, W / 2, y, { size: 30, weight: 500, align: 'center', color: ORANGE, ls: 6 });
  ctx.strokeStyle = `rgba(${O_RGB},.5)`; ctx.lineWidth = 1.5;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(W / 2 + k * (w / 2 + 24), y); ctx.lineTo(W / 2 + k * (w / 2 + 84), y); ctx.stroke(); }
  ctx.restore();
}
// 沿路径逐渐画出来：先建路径，再用虚线偏移只描出前 k 的长度
function drawOn(build, len, k, col, lw, a = 1, glowCol) {
  if (k <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (glowCol) { ctx.shadowColor = glowCol; ctx.shadowBlur = 14; }
  ctx.setLineDash([len * clamp(k), len + 10]); ctx.beginPath(); build(); ctx.stroke(); ctx.restore();
}
const shake = (t, amp) => [(vnoise(t * 28, 3) - .5) * 2 * amp, (vnoise(5, t * 28) - .5) * 2 * amp];

// ======================================================================== ① 通知雪崩（0–3.6）
const NOTIFS = [
  ['微信', '老板', '明早九点，来我办公室一趟。', '#3fbf6a', '微'],
  ['教务系统', '成绩通知', '期末成绩已公布，点击查看。', '#4f8ef7', '教'],
  ['微信', 'TA', '对方已读，暂未回复。', '#3fbf6a', '微'],
  ['房东', '房租提醒', '这个月的房租该交了哦。', '#f0a03c', '房'],
  ['热搜', '#行业裁员#', '你关注的话题正在被热议。', '#e5484d', '热'],
  ['体检中心', '报告提醒', '您的报告有一项异常，建议复查。', '#9b7cf3', '体'],
  ['妈妈', '妈妈', '最近怎么都不打电话？', '#3fbf6a', '妈'],
  ['小红书', '你关注的人', '晒出了新的 offer。', '#ff2442', '书'],
  ['天气', '暴雨预警', '明天暴雨，航班可能延误。', '#5ac8fa', '天'],
];
const NT = [-.7, -.35, .12, .44, .72, .98, 1.2, 1.4, 1.58];               // 第一帧就已经有两条通知在屏幕上
const FREEZE = 2.75;
function banner(n, x, y, a, sc = 1) {
  if (a <= 0) return;
  const [app, who, msg, col, glyph] = n;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  ctx.fillStyle = 'rgba(30,34,44,.94)'; ctx.beginPath(); ctx.roundRect(-450, -66, 900, 132, 30); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = 'rgba(255,255,255,.09)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-420, -36, 72, 72, 18); ctx.fill();
  text(glyph, -384, 1, { font: SANS, weight: 700, size: 34, align: 'center', color: '#fff' });
  text(app, -326, -30, { font: SANS, weight: 500, size: 24, color: '#9aa3b2' });
  text('现在', 420, -30, { font: SANS, weight: 500, size: 24, color: '#7c8594', align: 'right' });
  text(who, -326, 18, { font: SANS, weight: 700, size: 32, color: '#f2f4f7' });
  font(32, 700, SANS); const ww = ctx.measureText(who).width;
  text(msg, -326 + ww + 16, 18, { font: SANS, weight: 500, size: 30, color: '#d4d9e1' });
  ctx.restore();
}
function sceneNotifs(t) {
  if (t > 4.2) return;
  const [sx, sy] = shake(t, 7 * sstep(1.2, 2.7, t) * (t < FREEZE ? 1 : 0));
  const zoom = 1 + .05 * sstep(.6, FREEZE, t) * (t < FREEZE ? 1 : 0);
  ctx.save(); ctx.translate(540 + sx, 900 + sy); ctx.scale(zoom, zoom); ctx.translate(-540, -900);
  if (t > FREEZE) ctx.filter = `grayscale(${prog(t, FREEZE, FREEZE + .2).toFixed(2)})`;
  for (let i = 0; i < NOTIFS.length; i++) {
    const ti = NT[i]; if (t < ti) continue;
    let k = 0; for (let j = i + 1; j < NOTIFS.length; j++) k += E.outExpo(prog(t, NT[j], NT[j] + .32));
    const e = E.outExpo(prog(t, ti, ti + .34));
    let y = 470 + 152 * k - (1 - e) * 240, x = 540, rot = 0, a = sstep(ti, ti + .1, t);
    if (t > FREEZE) {                                                              // 定格之后，全部失重掉落
      const f = E.in(prog(t, FREEZE + .05 + i * .025, FREEZE + .85 + i * .025));
      y += 1700 * f; rot = (i % 2 ? 1 : -1) * .25 * f; a *= 1 - f * .6;
    }
    a *= 1 - sstep(1120, 1330, y);                                                 // 往下沉进黑暗，不压住字幕
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); banner(NOTIFS[i], 0, 0, a, .98 + .02 * e); ctx.restore();
  }
  if (t > 1.85 && t < FREEZE) {                                                    // 越来越多：残影一样的通知不停闪过
    const r = mulberry(Math.floor(t * 22));
    for (let k = 0; k < 4; k++) banner(NOTIFS[Math.floor(r() * NOTIFS.length)], 540 + (r() - .5) * 120, 420 + r() * 820, .22 + r() * .25, .9 + r() * .15);
  }
  ctx.restore();
  // 红点角标：1 → 99+
  if (t < FREEZE + .5) {
    const n = Math.floor(2 + 97 * Math.pow(clamp(t / 2.55), 2.4)), a = 1 - sstep(FREEZE, FREEZE + .3, t), pop = 1 + .25 * Math.exp(-((t * 9) % 1) * 4) * (t < FREEZE ? 1 : 0);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(970 + sx, 404 + sy); ctx.scale(pop, pop);
    ctx.fillStyle = '#ff3b30'; ctx.shadowColor = 'rgba(255,59,48,.7)'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.roundRect(n >= 99 ? -48 : n >= 10 ? -36 : -26, -26, n >= 99 ? 96 : n >= 10 ? 72 : 52, 52, 26); ctx.fill(); ctx.restore();
    text(n >= 99 ? '99+' : String(n), 970 + sx, 405 + sy, { font: SANS, weight: 700, size: 30, align: 'center', color: '#fff', alpha: a });
  }
}

// ======================================================================== ② 测试：哪些你控制得了？（2.85–21）
const CARDS = ['老板的脸色', '考试的结果', 'TA 回不回你', '房东涨不涨租', '行业会不会裁员', '别人怎么看你', '明天的天气'];
const CPOS = CARDS.map((_, i) => i < 6 ? [i % 2 ? 785 : 295, 772 + Math.floor(i / 2) * 88] : [540, 772 + 3 * 88]);
const BIN_L = [315, 1176], BIN_R = [765, 1176];
const flyT = i => 9.5 + i * .66;
function pill(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 30; font(size, 500, SANS); const w = Math.max(o.minW || 0, ctx.measureText(s).width + 64);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 28; }
  ctx.fillStyle = o.fill || 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.roundRect(-w / 2, -36, w, 72, 36); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.18)'; ctx.lineWidth = 1.6; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 500, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
function bin(x, y, label, count, a, col, glowK) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (glowK > 0) { ctx.shadowColor = `rgba(${O_RGB},${.9 * glowK})`; ctx.shadowBlur = 40 * glowK; }
  ctx.fillStyle = glowK > 0 ? `rgba(${O_RGB},${.12 * glowK})` : 'rgba(255,255,255,.03)';
  ctx.beginPath(); ctx.roundRect(x - 205, y - 58, 410, 116, 26); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([10, 8]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  text(label, x - 170, y, { size: 34, weight: 700, color: col, alpha: a, ls: 4 });
  text(String(count), x + 170, y + 2, { font: LAT, size: 64, weight: 600, align: 'right', color: col, alpha: a });
}
function sceneQuiz(t) {
  if (t < 2.8 || t > 21.4) return;
  const out = sstep(20.25, 20.95, t);
  // 问题
  typeText('这里面，有几件', 540, 548, { size: 62, weight: 700, align: 'center', spread: 3, blur: 12 }, prog(t, 2.86, 3.3), 1 - out);
  typeText('是你能控制的？', 540, 648, { size: 80, weight: 900, align: 'center', color: ORANGE, spread: 3, blur: 14, glow: `rgba(${O_RGB},.35)`, glowBlur: 30 }, prog(t, 3.1, 3.6), 1 - out);
  // 卡片
  const dimC = 1 - .62 * win(t, 6.55, 9.45, .25, .3);
  let rc = 0;
  CARDS.forEach((s, i) => {
    const ta = 3.65 + i * .14, e = E.outExpo(prog(t, ta, ta + .5));
    let [x, y] = CPOS[i]; y += Math.sin(t * 1.3 + i) * 3;
    const f = prog(t, flyT(i), flyT(i) + .55), ff = E.io(f);
    if (f >= 1) { rc++; return; }
    const tx = BIN_R[0], ty = BIN_R[1];
    const px = lerp(x, tx, ff), py = lerp(y, ty, ff) - Math.sin(ff * PI) * 120;
    pill(s, px, py, sstep(ta, ta + .15, t) * dimC * (1 - out) * (1 - sstep(.85, 1, f)), { sc: (.92 + .08 * e) * (1 - .55 * ff) });
  });
  // 反转：“你的身体”先往“控制得了”那边飘，最后一刻拐进“控制不了”
  const b0 = 14.35, bodyE = E.outExpo(prog(t, b0, b0 + .4));
  if (t > b0) {
    const toL = E.io(prog(t, b0 + .3, 15.2)), swerve = E.io(prog(t, 15.25, 15.85));
    let x = lerp(540, 430, toL), y = lerp(930, 1060, toL);
    x = lerp(x, BIN_R[0], swerve); y = lerp(y, BIN_R[1], swerve) - Math.sin(swerve * PI) * 90;
    const done = t > 15.85;
    if (!done) pill('你的身体', x, y, bodyE * (1 - out), { size: 34, sc: (1.05 - .5 * swerve) * (.9 + .1 * bodyE), stroke: 'rgba(242,161,74,.6)', weight: 700 });
    else rc++;
  }
  // 唯一的一张橙色卡：你怎么看、怎么回应
  const c0 = 17.55, cf = E.io(prog(t, 18.55, 19.25)), lc = t > 19.25 ? 1 : 0;
  if (t > c0 && t < 19.25) {
    const e = E.outExpo(prog(t, c0, c0 + .7));
    pill('你怎么看 · 怎么回应', lerp(540, BIN_L[0], cf), lerp(950, BIN_L[1], cf) - Math.sin(cf * PI) * 100, e, { size: 36, weight: 700, sc: (.8 + .2 * e) * (1 - .45 * cf), fill: `rgba(${O_RGB},.2)`, stroke: ORANGE, color: '#ffe6c7', glow: `rgba(${O_RGB},.8)` });
  }
  // 两个框
  const ba = sstep(4.3, 4.9, t) * (1 - out);
  const pulse = t > 16.4 && t < 17.5 ? .4 + .3 * Math.sin(t * 14) : 0;
  bin(BIN_L[0], BIN_L[1], '控制得了', lc, ba, ORANGE, Math.max(pulse * 0, lc * (1 + .6 * Math.exp(-(t - 19.25) * 3)) * sstep(19.2, 19.35, t)) + (t > 16.4 && t < 17.5 ? 0 : 0));
  bin(BIN_R[0], BIN_R[1], '控制不了', rc, ba, '#9aa2b0', 0);
  if (t > 16.4 && t < 17.6) text('0', BIN_L[0] + 170, BIN_L[1] + 2, { font: LAT, size: 64, weight: 600, align: 'right', color: ORANGE, alpha: ba * (.5 + .5 * Math.sin(t * 16)) });
  // 倒数 3 · 2 · 1
  ['3', '2', '1'].forEach((s, i) => {
    const t0 = 6.6 + i * .9, u = prog(t, t0, t0 + .88); if (u <= 0 || u >= 1) return;
    const sc = 1.5 - .5 * E.outExpo(u * 2.5);
    ctx.save(); const bg = ctx.createRadialGradient(540, 950, 0, 540, 950, 230); bg.addColorStop(0, `rgba(6,8,12,${.85 * (1 - sstep(.6, 1, u))})`); bg.addColorStop(1, 'rgba(6,8,12,0)'); ctx.fillStyle = bg; ctx.fillRect(300, 700, 480, 500); ctx.restore();
    ctx.save(); ctx.translate(540, 950); ctx.scale(sc, sc);
    text(s, 0, 0, { font: LAT, size: 220, weight: 600, align: 'center', color: CREAM, alpha: (1 - sstep(.6, 1, u)), glow: 'rgba(255,240,220,.4)', blur: 30 });
    ctx.restore();
  });
  // 鼓点前：左边的框亮起来，光吞没画面
  const fl = sstep(20.3, DROP, t) * (1 - sstep(DROP, DROP + .35, t));
  if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(BIN_L[0], BIN_L[1], 0, BIN_L[0], BIN_L[1], 1600 * fl + 10); g.addColorStop(0, `rgba(255,214,170,${.9 * fl})`); g.addColorStop(1, 'rgba(255,214,170,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ======================================================================== ③ 标题
function sceneTitle(t) {
  if (t < DROP - .05 || t > 25.4) return;
  const e = E.outExpo(prog(t, DROP, DROP + .9)), out = sstep(24.6, 25.3, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('斯多葛主义', 540, 900, { size: 156, weight: 900, align: 'center', ls: 26, alpha: sstep(DROP, DROP + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(DROP + .4, DROP + 1.1, t) * (1 - out));
  typeText('STOICISM', 540, 1046, { size: 46, weight: 600, font: LAT, ls: 30, color: DIM, align: 'center', spread: 3 }, prog(t, DROP + .5, DROP + 1.5), 1 - out);
  typeText('第三季 · 主义 ②', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, DROP + 1.1, DROP + 2.0), 1 - out);
}

// ======================================================================== ④ 奴隶与皇帝
const DCX = 540, DCY = 800;
function dichotomy(t, x, y, s, a, t0) {                                            // 控制二分法：里圈取决于你，外圈不取决于你
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  const gi = E.outExpo(prog(t, t0, t0 + .8)), go = E.io(prog(t, t0 + .6, t0 + 1.7));
  drawOn(() => ctx.arc(0, 0, 300, -PI / 2 + t * .05, -PI / 2 + t * .05 + TAU), TAU * 300, go, 'rgba(154,162,176,.55)', 2);
  ctx.save(); ctx.globalAlpha *= gi; ctx.fillStyle = `rgba(${O_RGB},.09)`; ctx.beginPath(); ctx.arc(0, 0, 135 * gi, 0, TAU); ctx.fill();
  ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16; ctx.stroke(); ctx.restore();
  ['看法', '选择', '行动'].forEach((w, i) => typeText(w, 0, -48 + i * 48, { size: 36, weight: 700, align: 'center', color: '#ffe2bf', spread: 2 }, prog(t, t0 + .5 + i * .15, t0 + .9 + i * .15), 1));
  ['身体', '财产', '名声', '别人', '结果', '天气'].forEach((w, i) => {
    const ang = -PI / 2 + i * TAU / 6 + PI / 6 + t * .05;
    text(w, Math.cos(ang) * 300, Math.sin(ang) * 300, { size: 32, weight: 500, align: 'center', color: '#aab2c0', alpha: sstep(t0 + 1.3 + i * .15, t0 + 1.7 + i * .15, t), glow: 'rgba(8,10,16,1)', blur: 16 });
  });
  text('取决于你', 0, 178, { font: SANS, size: 24, weight: 500, align: 'center', color: ORANGE, alpha: sstep(t0 + 1.0, t0 + 1.5, t), ls: 6 });
  text('不取决于你', 0, 352, { font: SANS, size: 24, weight: 500, align: 'center', color: DIM, alpha: sstep(t0 + 2.2, t0 + 2.7, t), ls: 6 });
  ctx.restore();
}
function shackle(t, a) {                                                          // 一条锁链，中间那一节断开
  if (a <= 0) return;
  const k = E.io(prog(t, 25.0, 26.3)), snap = E.outExpo(prog(t, 26.6, 27.6));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(540, 760); ctx.rotate(-.12);
  for (let i = -3; i <= 3; i++) {
    const side = Math.sign(i), mid = i === 0;
    const x = i * 78 + side * 46 * snap, y = Math.abs(i) * 14 * snap * snap, rot = side * .12 * snap;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const kk = clamp(k * 7 - (i + 3));
    if (i % 2 === 0) drawOn(() => ctx.ellipse(0, 0, 52, 26, 0, mid ? .35 + 1.1 * snap : 0, mid ? TAU - .35 - 1.1 * snap : TAU), 2 * PI * 40, kk, '#d4dae4', 8, 'rgba(220,230,255,.35)');
    else drawOn(() => ctx.ellipse(0, 0, 50, 7, 0, 0, TAU), 2 * PI * 30, kk, '#d4dae4', 6, 'rgba(220,230,255,.35)');
    ctx.restore();
  }
  ctx.restore();
  typeText('τὰ ἐφ᾽ ἡμῖν', 540, 1000, { size: 46, weight: 500, font: LAT, style: 'italic', align: 'center', color: '#c3c9d4', ls: 4, spread: 3 }, prog(t, 26.8, 27.8), a);
  typeText('取决于我们的事', 540, 1056, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 8, spread: 4 }, prog(t, 27.3, 28.2), a);
}
function laurel(t, x, y, r, k, a) {                                              // 月桂冠：两条弧，叶子逐片长出来
  if (a <= 0 || k <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 9; i++) {
      const u = i / 8, show = clamp(k * 10 - i); if (show <= 0) continue;
      const ang = PI / 2 + side * (.35 + u * 2.1), px = Math.cos(ang) * r, py = Math.sin(ang) * r;
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang + side * (PI / 2 + .6)); ctx.globalAlpha *= show;
      ctx.fillStyle = 'rgba(214,190,130,.85)'; ctx.beginPath(); ctx.ellipse(0, 0, 26, 9, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    drawOn(() => ctx.arc(0, 0, r, side < 0 ? PI / 2 + .35 : PI / 2 - 2.45, side < 0 ? PI / 2 + 2.45 : PI / 2 - .35), r * 2.1, k, 'rgba(214,190,130,.7)', 2.5);
  }
  ctx.restore();
}
function book(t, a) {                                                             // 打开的日记本，字一行行写出来
  if (a <= 0) return;
  const x0 = 540, y0 = 1015;
  ctx.save(); ctx.globalAlpha *= a;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(x0, y0);
    ctx.fillStyle = 'rgba(236,226,206,.07)'; ctx.strokeStyle = 'rgba(236,226,206,.45)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -95); ctx.quadraticCurveTo(side * 150, -118, side * 300, -100); ctx.lineTo(side * 300, 100); ctx.quadraticCurveTo(side * 150, 82, 0, 105); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const k = prog(t, 37.8 + (side > 0 ? 6 : 0) * .22 + i * .22, 38.1 + (side > 0 ? 6 : 0) * .22 + i * .22); if (k <= 0) continue;
      const yy = -62 + i * 26, xa = side * 36, xb = side * (36 + 220 * k);
      ctx.save(); ctx.strokeStyle = 'rgba(236,226,206,.5)'; ctx.lineWidth = 2; ctx.beginPath();
      for (let s = 0; s <= 1.0001; s += .05) { const xx = lerp(xa, xb, s), w = Math.sin(s * 40 + i) * 2.5; s === 0 ? ctx.moveTo(xx, yy + w) : ctx.lineTo(xx, yy + w); }
      ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
  typeText('ὡς Ἐπίκτητος ἔλεγεν', 540, 1168, { size: 38, weight: 500, font: LAT, style: 'italic', align: 'center', color: '#d8c79f', ls: 2, spread: 3 }, prog(t, 39.4, 40.4), a);
  typeText('“正如爱比克泰德所说”——《沉思录》4.41', 540, 1218, { size: 22, weight: 500, font: SANS, align: 'center', color: DIM, ls: 2, spread: 5 }, prog(t, 39.9, 40.9), a);
}
function sceneStoics(t) {
  if (t < 24.6 || t > CUT) return;
  shackle(t, sstep(24.8, 25.2, t) * (1 - sstep(28.6, 29.2, t)));
  // 二分法：先在中间展开，皇帝出现时缩小、上移，戴上月桂冠
  const up = E.io(prog(t, 33.6, 34.6)), gone = sstep(41.2, 41.9, t);
  dichotomy(t, DCX, lerp(DCY, 690, up), lerp(1, .52, up), sstep(28.9, 29.3, t) * (1 - gone), 29.0);
  laurel(t, DCX, 690, 200, E.io(prog(t, 34.4, 35.8)), 1 - gone);
  book(t, sstep(37.4, 37.9, t) * (1 - gone));
  // 一个奴隶，一个皇帝，学的是同一门功课。
  const hard = t < CUT - .03 ? 1 : 0;
  typeText('一个奴隶，一个皇帝，', 540, 820, { size: 62, weight: 700, align: 'center', spread: 3, blur: 12 }, prog(t, 41.8, 42.6), hard);
  typeText('学的是同一门功课。', 540, 930, { size: 84, weight: 900, align: 'center', color: ORANGE, spread: 3, blur: 14, glow: `rgba(${O_RGB},.4)`, glowBlur: 32 }, prog(t, 42.7, 43.6), hard);
}

// ======================================================================== ⑤ 战俘：斯托克代尔
function sceneStockdale(t) {
  if (t < CUT || t > 58.6) return;
  // 降落伞
  const pA = 1 - sstep(47.4, 48.2, t);
  if (pA > 0) {
    const d = E.out(prog(t, CUT, 48.2)), x = 540 + Math.sin(t * 1.4) * 40, y = lerp(260, 820, d), sw = Math.sin(t * 1.4 + .6) * .08;
    ctx.save(); ctx.globalAlpha = pA; ctx.translate(x, y); ctx.rotate(sw);
    ctx.strokeStyle = 'rgba(220,226,236,.85)'; ctx.lineWidth = 2.2; ctx.fillStyle = 'rgba(220,226,236,.06)';
    ctx.beginPath(); ctx.ellipse(0, -150, 170, 90, 0, PI, TAU); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (const k of [-1, -.5, 0, .5, 1]) { ctx.beginPath(); ctx.moveTo(k * 165, -150); ctx.lineTo(0, 30); ctx.stroke(); }
    ctx.fillStyle = 'rgba(220,226,236,.9)'; ctx.beginPath(); ctx.arc(0, 42, 11, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 54); ctx.lineTo(0, 92); ctx.stroke();
    ctx.restore();
  }
  // 牢房的窗、月光、墙上的刻痕
  const wA = sstep(47.6, 48.6, t) * (1 - sstep(57.9, 58.5, t));
  if (wA > 0) {
    ctx.save(); ctx.globalAlpha = wA;
    const g = ctx.createLinearGradient(540, 560, 700, 1250); g.addColorStop(0, 'rgba(170,190,230,.16)'); g.addColorStop(1, 'rgba(170,190,230,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(450, 640); ctx.lineTo(630, 640); ctx.lineTo(900, 1250); ctx.lineTo(560, 1250); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(200,210,230,.7)'; ctx.lineWidth = 3; ctx.strokeRect(450, 520, 180, 120);
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(450 + i * 36, 520); ctx.lineTo(450 + i * 36, 640); ctx.stroke(); }
    ctx.restore();
    const days = Math.floor(lerp(1, 2713, E.io(prog(t, 49.2, 53.4))));
    text(String(days), 520, 760, { font: LAT, size: 72, weight: 600, align: 'right', color: CREAM, alpha: wA * sstep(49.1, 49.5, t) });
    text('天', 540, 764, { size: 44, weight: 500, color: DIM, alpha: wA * sstep(49.1, 49.5, t) });
    const groups = Math.floor(lerp(0, 72, E.io(prog(t, 49.2, 53.4))));        // 每组五道：四竖一斜
    ctx.save(); ctx.globalAlpha = wA * .75; ctx.strokeStyle = '#b9c0cc'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    for (let gI = 0; gI < groups; gI++) {
      const gx = 150 + (gI % 12) * 66, gy = 860 + Math.floor(gI / 12) * 64, r = mulberry(300 + gI);
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(gx + k * 11 + r() * 2, gy); ctx.lineTo(gx + k * 11 + r() * 2, gy + 40); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(gx - 6, gy + 34); ctx.lineTo(gx + 42, gy + 6); ctx.stroke();
    }
    ctx.restore();
  }
  // 一年又一年的圣诞节：圈上，又划掉
  ['1965', '1966', '1967', '1968'].forEach((yr, i) => {
    const t0 = 54.2 + i * .9, a = win(t, t0, t0 + .95, .12, .25) * (1 - sstep(57.9, 58.4, t));
    if (a <= 0) return;
    const yy = 1000;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(236,230,218,.95)'; ctx.beginPath(); ctx.roundRect(390, yy - 140, 300, 280, 20); ctx.fill();
    ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.roundRect(390, yy - 140, 300, 64, [20, 20, 0, 0]); ctx.fill(); ctx.restore();
    text(`${yr} · 12月`, 540, yy - 107, { font: SANS, size: 28, weight: 700, align: 'center', color: '#fff', alpha: a });
    text('25', 540, yy + 30, { font: LAT, size: 150, weight: 600, align: 'center', color: '#1b1f27', alpha: a });
    const c = E.out(prog(t, t0 + .15, t0 + .45)), x = E.out(prog(t, t0 + .5, t0 + .7));
    drawOn(() => ctx.ellipse(540, yy + 34, 96, 84, -.2, 0, TAU), 2 * PI * 90, c, ORANGE, 5, null);
    if (x > 0) seg(450, yy + 110, lerp(450, 630, x), lerp(yy + 110, yy - 50, x), '#e5484d', 7, a);
  });
}

// ======================================================================== ⑥ 大脑：换个角度想，杏仁核安静下来
const BRAIN = [[320, 860], [300, 780], [330, 700], [400, 640], [490, 605], [590, 600], [690, 625], [770, 680], [815, 760], [815, 840], [780, 900], [720, 930], [650, 925], [600, 960], [520, 985], [440, 975], [380, 945], [340, 905]];
const BX = x => 540 + (x - 560) * 1.25, BY = y => 820 + (y - 800) * 1.25;
function brainPath() {
  const p = BRAIN.map(([x, y]) => [BX(x), BY(y)]);
  ctx.moveTo((p[0][0] + p[p.length - 1][0]) / 2, (p[0][1] + p[p.length - 1][1]) / 2);
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; ctx.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
}
const SULCI = [[[420, 880], [530, 830], [650, 835]], [[565, 612], [540, 700], [520, 800]], [[470, 640], [450, 700], [430, 760]], [[640, 640], [630, 720], [680, 790]], [[360, 800], [420, 790], [470, 820]], [[700, 720], [750, 760], [760, 830]], [[470, 930], [540, 905], [600, 925]]];
function sceneBrain(t) {
  if (t < 58.0 || t > 66.8) return;
  const A = sstep(58.1, 58.6, t) * (1 - sstep(65.9, 66.6, t)), k = E.io(prog(t, 58.3, 60.0));
  if (A <= 0) return;
  ctx.save(); ctx.globalAlpha = A;
  drawOn(() => brainPath(), 2300, k, 'rgba(214,222,236,.85)', 2.6, 'rgba(200,215,255,.3)');
  SULCI.forEach(([p0, c, p1], i) => drawOn(() => { ctx.moveTo(BX(p0[0]), BY(p0[1])); ctx.quadraticCurveTo(BX(c[0]), BY(c[1]), BX(p1[0]), BY(p1[1])); }, 320, E.io(prog(t, 59.0 + i * .12, 59.8 + i * .12)), 'rgba(214,222,236,.38)', 2));
  const kc = E.io(prog(t, 59.4, 60.4));                                           // 小脑与脑干
  drawOn(() => ctx.ellipse(BX(722), BY(962), 92, 52, -.15, 0, TAU), 480, kc, 'rgba(214,222,236,.7)', 2.4);
  for (let i = 0; i < 4; i++) drawOn(() => ctx.ellipse(BX(722), BY(962), 76 - i * 16, 38 - i * 8, -.15, PI + .3, TAU - .3), 300, kc, 'rgba(214,222,236,.25)', 1.6);
  drawOn(() => { ctx.moveTo(BX(625), BY(955)); ctx.quadraticCurveTo(BX(640), BY(1010), BX(632), BY(1075)); ctx.moveTo(BX(668), BY(965)); ctx.quadraticCurveTo(BX(676), BY(1015), BX(668), BY(1075)); }, 260, kc, 'rgba(214,222,236,.6)', 2.4);
  ctx.restore();
  // 杏仁核（橙红，报警）→ 换个角度想 → 变暗；前额叶（青）亮起来
  const re = E.io(prog(t, 62.6, 63.8)), am = [BX(500), BY(925)], pf = [BX(360), BY(730)];
  const alarm = sstep(59.6, 60.2, t) * (1 - .82 * re) * (.75 + .25 * Math.sin(t * 9));
  glow(am[0], am[1], 13, '255,110,70', A * alarm, 7);
  glow(pf[0], pf[1], 12, T_RGB, A * re, 7);
  text('杏仁核', am[0] + 36, am[1] + 44, { font: SANS, size: 26, weight: 500, color: '#ff9a7a', alpha: A * sstep(59.8, 60.3, t) });
  text(re > .5 ? '↓' : '', am[0] + 130, am[1] + 44, { font: SANS, size: 30, weight: 700, color: '#ff9a7a', alpha: A * sstep(63.2, 63.6, t) });
  text('前额叶 ↑', pf[0] - 10, pf[1] - 48, { font: SANS, size: 26, weight: 500, color: TEAL, alpha: A * sstep(63.0, 63.5, t), align: 'center' });
  // 那张“让人难受的照片”，翻转过来
  const fx = 830, fy = 560, flip = Math.cos(PI * E.io(prog(t, 62.1, 62.9)));
  ctx.save(); ctx.globalAlpha = A * sstep(60.3, 60.8, t); ctx.translate(fx, fy); ctx.scale(flip, 1);
  ctx.strokeStyle = flip > 0 ? '#ff9a7a' : TEAL; ctx.lineWidth = 3; ctx.strokeRect(-70, -52, 140, 104);
  ctx.beginPath(); ctx.moveTo(-58, 40); ctx.lineTo(-18, -2); ctx.lineTo(10, 24); ctx.lineTo(30, 6); ctx.lineTo(58, 40); ctx.stroke();
  ctx.beginPath(); ctx.arc(32, -22, 10, 0, TAU); ctx.stroke(); ctx.restore();
  text('同一张照片', fx, fy + 82, { font: SANS, size: 24, weight: 500, align: 'center', color: DIM, alpha: A * sstep(60.5, 61, t) });
}

// ======================================================================== ⑦ 弓箭手
const BOW = [250, 1040], TGT = [800, 600];
const ARROW_T0 = REBUILD, HIT = REBUILD + .72;
function arrowPos(u) {                                                            // 二次贝塞尔：风把箭往上推了一点
  const c = [520, 640], p0 = [BOW[0] + 30, BOW[1] - 30], p1 = [TGT[0] - 26, TGT[1] + 18];
  const x = (1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0], y = (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1];
  const dx = 2 * (1 - u) * (c[0] - p0[0]) + 2 * u * (p1[0] - c[0]), dy = 2 * (1 - u) * (c[1] - p0[1]) + 2 * u * (p1[1] - c[1]);
  return [x, y, Math.atan2(dy, dx)];
}
function sceneArcher(t) {
  if (t < 66.0 || t > 79.2) return;
  const A = sstep(66.1, 66.7, t) * (1 - sstep(78.4, 79.1, t)), dim = 1 - .62 * sstep(70.7, 71.3, t);
  // 风：一道道青色的气流
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 22; i++) {
    const r = mulberry(500 + i), y = 420 + r() * 900, sp = 260 + r() * 380, len = 120 + r() * 220, ph = r() * 10;
    const x = ((t * sp + ph * 300) % (W + 600)) - 300, wob = Math.sin(t * 2 + i) * 14;
    const g = ctx.createLinearGradient(x - len, 0, x, 0); g.addColorStop(0, `rgba(${T_RGB},0)`); g.addColorStop(1, `rgba(${T_RGB},${.22 * A * dim})`);
    ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - len, y + wob); ctx.quadraticCurveTo(x - len / 2, y - 12 + wob, x, y + wob); ctx.stroke();
  }
  ctx.restore();
  // 靶子
  const hitK = sstep(HIT, HIT + .05, t), shk = Math.exp(-Math.max(0, t - HIT) * 9) * hitK * 6;
  ctx.save(); ctx.globalAlpha = A * dim; ctx.translate(TGT[0] + Math.sin(t * 70) * shk, TGT[1]);
  [[120, 'rgba(236,230,218,.5)'], [88, 'rgba(236,230,218,.5)'], [56, `rgba(${O_RGB},.7)`], [24, ORANGE]].forEach(([r, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); });
  ctx.restore();
  // 弓：拉满 → 松手
  const draw = E.io(prog(t, 66.6, 69.6)) * (1 - E.outExpo(prog(t, ARROW_T0, ARROW_T0 + .25)));
  const tremble = draw > .9 ? Math.sin(t * 60) * 1.5 : 0, ang = Math.atan2(TGT[1] - BOW[1], TGT[0] - BOW[0]) - .18;
  ctx.save(); ctx.globalAlpha = A * dim; ctx.translate(BOW[0] + tremble, BOW[1]); ctx.rotate(ang);
  ctx.strokeStyle = '#e8dcc4'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(255,230,190,.4)'; ctx.shadowBlur = 12;
  const bend = 40 + 26 * draw;
  ctx.beginPath(); ctx.moveTo(-10, -170); ctx.quadraticCurveTo(bend + 40, 0, -10, 170); ctx.stroke();
  ctx.shadowBlur = 0; ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(236,230,218,.8)';
  const sx = -10 - 120 * draw;
  ctx.beginPath(); ctx.moveTo(-10, -170); ctx.lineTo(sx, 0); ctx.lineTo(-10, 170); ctx.stroke();
  if (t < ARROW_T0) { ctx.strokeStyle = CREAM; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx + 230, 0); ctx.stroke(); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(sx + 248, 0); ctx.lineTo(sx + 226, -9); ctx.lineTo(sx + 226, 9); ctx.fill(); }
  ctx.restore();
  // 箭飞出去：拖着一道光
  if (t >= ARROW_T0) {
    const u = E.outQuint(prog(t, ARROW_T0, HIT)), [x, y, a] = arrowPos(u);
    ctx.save(); ctx.globalAlpha = A * dim; ctx.lineCap = 'round';
    for (let i = 0; i < 14; i++) {
      const [x1, y1] = arrowPos(Math.max(0, u - .02 * (i + 1))), [x0, y0] = arrowPos(Math.max(0, u - .02 * i));
      ctx.strokeStyle = `rgba(${O_RGB},${.5 * (1 - i / 14) * (1 - hitK * prog(t, HIT, HIT + 1))})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x0, y0); ctx.stroke();
    }
    ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = CREAM; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(0, 0); ctx.stroke();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-4, -9); ctx.lineTo(-4, 9); ctx.fill();
    ctx.restore();
  }
  // 瞄准、拉弓、松手，是你的事。风，不是。
  const big = { align: 'center', spread: 3, blur: 14, rise: 18 }, fo = 1 - sstep(78.3, 78.9, t);
  typeText('瞄准、拉弓、松手，', 540, 800, { ...big, size: 62, weight: 700 }, prog(t, 70.6, 71.4), fo);
  typeText('是你的事。', 540, 905, { ...big, size: 92, weight: 900, color: ORANGE, glow: `rgba(${O_RGB},.45)`, glowBlur: 34 }, prog(t, 71.5, 72.2), fo);
  typeText('风，不是。', 540, 1030, { ...big, size: 66, weight: 700, color: TEAL, glow: `rgba(${T_RGB},.35)`, glowBlur: 26 }, prog(t, 72.8, 73.5), fo);
}

// ======================================================================== ⑧ 问自己
function sceneEnd(t) {
  if (t < 78.6) return;
  const big = { align: 'center', spread: 3, blur: 14, rise: 18 };
  typeText('下次焦虑的时候，问问自己：', 540, 720, { ...big, size: 46, weight: 700 }, prog(t, 79.0, 79.9), 1);
  typeText('「这件事，我控制得了吗？」', 540, 830, { ...big, size: 60, weight: 900, glow: `rgba(${O_RGB},.4)`, glowBlur: 30 }, prog(t, 80.0, 81.0), 1);
  // 小小的二分法：里圈的橙光缓缓呼吸
  const a = sstep(80.8, 81.8, t);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 1060);
    ctx.strokeStyle = 'rgba(154,162,176,.5)'; ctx.lineWidth = 1.6; ctx.setLineDash([8, 8]); ctx.lineDashOffset = -t * 20; ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
    glow(540, 1060, 26 + 4 * Math.sin(t * 2), O_RGB, a * .9, 3);
  }
}

// ======================================================================== 世界层
function WORLD(t) {
  space(t);
  aurora(t, .6 * (sstep(3.0, 4.5, t) * (1 - sstep(CUT - .02, CUT + .02, t)) + sstep(58, 60, t)));
  starfield(t, STAR_A(t));
  sceneNotifs(t); sceneQuiz(t); sceneTitle(t); sceneStoics(t); sceneStockdale(t); sceneBrain(t); sceneArcher(t); sceneEnd(t);
}
function SAMPLES(T) {
  if (T < FREEZE + 1.0) return 4;                                                 // 通知砸下来、掉落
  if ((T > 9.3 && T < 16.2) || (T > 18.4 && T < 19.5) || (T > DROP - .4 && T < DROP + 1.2)) return 4;
  if (T > ARROW_T0 - .1 && T < HIT + .4) return 6;
  return 3;
}
function BLOOM_K(T) { return .42 + .25 * win(T, DROP, 24.5, .2, .6) + .2 * win(T, REBUILD, 74, .1, 1) + .15 * sstep(79, 81, T); }
function OVER(T) {
  stamp('c. 50 – 135', 'Epictetus', 25.0, 33.4, T);
  stamp('161 – 180', 'Marcus Aurelius', 33.7, 41.5, T);
  stamp('1965 – 1973', 'James Stockdale', 45.4, 57.8, T);
  stamp('2002', 'Ochsner et al. · fMRI', 58.4, 65.8, T);
  stamp('Cicero', 'De Finibus · III.22', 66.4, 74.2, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(15);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .18 }; });
}

// ======================================================================== 音效提示表
const NOTE = { C5: 523.25, Eb5: 622.25, F5: 698.46, Ab5: 830.61, Bb5: 932.33, C6: 1046.5, Eb6: 1244.5, F6: 1396.9 };
function CUES() {
  const c = [], dings = [1318.5, 1396.9, 1568, 1318.5, 1760, 1396.9, 1568, 1760, 1975.5];
  NT.forEach((t, i) => t >= 0 && c.push([t, 'ding', { f: dings[i], gain: .5 + i * .03 }]));
  const r = mulberry(77); for (let k = 0; k < 9; k++) c.push([1.85 + k * .095 + r() * .03, 'ding', { f: [1568, 1760, 1975.5, 2093][k % 4], gain: .22 }]);
  c.push([0, 'drone', { dur: FREEZE, gain: .55 }], [FREEZE, 'stop', { gain: .6 }], [2.86, 'boom', { gain: .55 }]);
  c.push([6.6, 'tick', { gain: .6 }], [7.5, 'tick', { gain: .6 }], [8.4, 'tick', { gain: .6 }], [9.3, 'tink', { f: NOTE.C6, gain: .3 }]);
  CARDS.forEach((_, i) => c.push([flyT(i) + .5, 'thud', { gain: .4 }]));
  c.push([15.25, 'whoosh', { dur: .6, gain: .45 }], [15.85, 'thud', { gain: .5 }]);
  c.push([17.55, 'shimmer', { gain: .5 }], [19.25, 'tink', { f: NOTE.F6, gain: .4 }], [DROP - 1.4, 'riser', { dur: 1.4, gain: .55 }], [DROP, 'boom', { gain: .9 }], [DROP, 'whoosh', { dur: .9, gain: .45 }]);
  c.push([26.6, 'chain', { gain: .6 }], [29.0, 'swell', { dur: 1.4, gain: .3 }], [34.4, 'shimmer', { gain: .3 }], [37.7, 'page', { gain: .5 }], [41.75, 'swish', { dur: .8, gain: .3 }]);
  c.push([CUT - 1.6, 'revcym', { dur: 1.6, gain: .5 }], [CUT, 'boom', { gain: .95, deep: 1 }], [CUT + .1, 'air', { dur: 3.2, gain: .3 }]);
  for (let k = 0; k < 22; k++) { const u = k / 21; c.push([lerp(49.2, 53.3, 1 - (1 - u) * (1 - u)), 'tick', { gain: .22 }]); }
  [0, 1, 2, 3].forEach(i => { c.push([54.2 + i * .9, 'page', { gain: .4 }], [54.7 + i * .9, 'swish', { dur: .3, gain: .25 }]); });
  c.push([59.6, 'tink', { f: NOTE.Eb5, gain: .25 }], [62.1, 'swish', { dur: .8, gain: .3 }], [62.6, 'swell', { dur: 1.2, gain: .3 }]);
  c.push([66.2, 'wind', { dur: 8.5, gain: .5 }], [66.6, 'creak', { dur: REBUILD - 66.6, gain: .55 }], [REBUILD, 'arrow', { gain: .75 }], [REBUILD, 'boom', { gain: .75 }], [HIT, 'thunk', { gain: .8 }]);
  c.push([71.5, 'tink', { f: NOTE.C6, gain: .3 }], [72.8, 'tink', { f: NOTE.Ab5, gain: .25 }]);
  c.push([78.9, 'swell', { dur: 1.4, gain: .3 }], [80.0, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .3 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
