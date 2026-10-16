
// ======================================================================== 真人出镜格式（No.65 起的共用层；No.64 是它的原型）
// 上半屏（y 360–1170）是动画舞台，下半屏（y 1250 以下）留给主持人的画面（画中画 / 智能抠像）。
// 底版不压旁白字幕：字幕由剪辑软件按主持人自己的声音识别。舞台上只放关键词。
// ?prompter=1 出“提词版”：前面多 LEAD = 3 秒倒数，下半屏显示当前台词（逐字走色）、动作提示和下一句；静音导出。
// 这一层覆盖引擎的 render：不加泛光、暗角、颗粒（错觉、数据点的像素值不该被后期改动）。
// 剧集提供：BODY、TOTAL（= BODY + LEAD）、SECTIONS、LINES、WORLD(t)、SAMPLES(t)、HUD(t)、CUES()；可选 MARK_FROM（水印出现的时间）。
// LINES：[开始, 结束, 台词, 动作提示, { count: [每个数字的时间…], digits: '五四三二一' }?]，时间是底版时间。
const PROMPTER = /[?&]prompter=1/.test(location.search);
const LEAD = PROMPTER ? 3 : 0;
const BLUEGREY = '#9aa3b2', GOLD = '#ffd2a0';
const gray = v => `rgb(${v},${v},${v})`;
function circ(x, y, r, col, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
function poly(pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }
function chip(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 34; font(size, o.weight || 700, SANS); ctx.letterSpacing = '0px'; const w = ctx.measureText(s).width + size * 1.8;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 26; }
  ctx.fillStyle = o.fill || 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 1.05, w, size * 2.1, size * 1.05); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 700, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
const BIG = { align: 'center', spread: 3, blur: 14, rise: 18 };
const pop = (t, t0) => { const k = prog(t, t0, t0 + .45); return k <= 0 ? 0 : 1 + .18 * Math.sin(PI * Math.min(1, k * 1.25)) * (1 - k); };
const blink = (t, t0) => 1 - .96 * Math.max(0, 1 - Math.abs(t - t0) / .09);

function bgGrad() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0e1119'); g.addColorStop(.62, '#0a0c12'); g.addColorStop(1, '#07080b');
  return g;
}
function background() {
  ctx.fillStyle = bgGrad(); ctx.fillRect(0, 0, W, H);
  const s = ctx.createRadialGradient(540, 1330, 30, 540, 1520, 760);                  // 主持人区：一盏暖色的顶光
  s.addColorStop(0, 'rgba(242,161,74,.11)'); s.addColorStop(.6, 'rgba(242,161,74,.03)'); s.addColorStop(1, 'rgba(242,161,74,0)');
  ctx.fillStyle = s; ctx.fillRect(0, 1180, W, H - 1180);
}

// ------------------------------------------------------------------------ 黑猫（和片头同一只：异色瞳，橙 / 青）
function catParts(sway) {
  const head = new Path2D(); head.ellipse(0, -150, 108, 94, 0, 0, TAU);
  const earL = new Path2D(); earL.moveTo(-100, -190); earL.lineTo(-84, -292); earL.lineTo(-30, -232); earL.closePath();
  const earR = new Path2D(); earR.moveTo(100, -190); earR.lineTo(84, -292); earR.lineTo(30, -232); earR.closePath();
  const p = new Path2D();
  p.moveTo(-62, -80); p.bezierCurveTo(-120, -20, -168, 110, -150, 210);
  p.quadraticCurveTo(-140, 248, -96, 250); p.lineTo(96, 250); p.quadraticCurveTo(140, 248, 150, 210);
  p.bezierCurveTo(168, 110, 120, -20, 62, -80); p.closePath();
  const tail = new Path2D();
  tail.moveTo(120, 236); tail.bezierCurveTo(220, 250, 262 + sway * 10, 170, 238 + sway * 14, 96);
  tail.quadraticCurveTo(226 + sway * 16, 62, 200 + sway * 18, 70);
  return { parts: [head, earL, earR, p], tail };
}
function catEye(x, y, col, rgb, open, glw) {
  if (open <= .02) return;
  ctx.save(); ctx.translate(x, y);
  if (glw > 0) { ctx.shadowColor = `rgba(${rgb},${.9 * glw})`; ctx.shadowBlur = 40 * glw; }
  ctx.beginPath(); ctx.moveTo(-24, 0); ctx.quadraticCurveTo(0, -20 * open, 24, 0); ctx.quadraticCurveTo(0, 20 * open, -24, 0); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
  ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 15 * open, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(-7, -5 * open, 3, 0, TAU); ctx.fill();
  ctx.restore();
}
// rim：轮廓光强度（0 = 纯剪影）
function drawCat(x, y, s, t, rim, open, eyeL = ORANGE, eyeR = TEAL, body = '#07080b') {
  const { parts, tail } = catParts(Math.sin(t * 2.2));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  if (rim > 0) for (const [x0, rgb] of [[-400, O_RGB], [0, T_RGB]]) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -400, 400, 800); ctx.clip();
    ctx.shadowColor = `rgba(${rgb},${.9 * rim})`; ctx.shadowBlur = 24; ctx.strokeStyle = `rgba(${rgb},${.8 * rim})`;
    ctx.lineWidth = 36; ctx.stroke(tail); ctx.restore();
  }
  ctx.strokeStyle = body; ctx.lineWidth = 30; ctx.stroke(tail);
  if (rim > 0) for (const [x0, rgb] of [[-400, O_RGB], [0, T_RGB]]) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -400, 400, 800); ctx.clip();
    ctx.shadowColor = `rgba(${rgb},${.9 * rim})`; ctx.shadowBlur = 24; ctx.strokeStyle = `rgba(${rgb},${.8 * rim})`;
    ctx.lineWidth = 6; parts.forEach(q => ctx.stroke(q)); ctx.restore();
  }
  ctx.fillStyle = body; parts.forEach(q => ctx.fill(q));
  if (rim > 0) {
    ctx.save(); ctx.globalAlpha *= .35 * rim; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.5;
    for (const k of [-1, 1]) for (const dy of [-6, 6]) { ctx.beginPath(); ctx.moveTo(k * 50, -118 + dy * .5); ctx.lineTo(k * 140, -126 + dy * 2); ctx.stroke(); }
    ctx.restore();
  }
  catEye(-42, -152, eyeL, O_RGB, open, rim);
  catEye(42, -152, eyeR, T_RGB, open, rim);
  ctx.restore();
}
// 片尾卡：猫睁眼 → 关注 → 一句小字 → 最后闭眼（t0 起，到 BODY 结束）
function endCard(t, t0, sub) {
  const a = sstep(t0, t0 + .5, t);
  if (a <= 0) return;
  const open = E.out(prog(t, t0 + .2, t0 + .5)) * blink(t, t0 + 2.2) * (1 - sstep(BODY - 1, BODY - .5, t));
  drawCat(540, 800, .72, t, a, open);
  text('关注 @黑猫不说话', 544, 1050, { size: 62, weight: 900, align: 'center', color: CREAM, ls: 6, alpha: sstep(t0 + .3, t0 + .7, t), glow: 'rgba(255,225,180,.25)', blur: 24 });
  if (sub) text(sub, 542, 1140, { font: SANS, size: 36, weight: 500, align: 'center', color: ORANGE, ls: 6, alpha: sstep(t0 + .6, t0 + 1.0, t) });
}
// 顶部：关卡 / 段落名 + 几个点（LEVELS：[[开始, 名字, 小字], …]）
function levelHud(t, LEVELS, a) {
  if (a <= 0) return;
  let cur = 0; LEVELS.forEach(([t0], i) => { if (t >= t0) cur = i; });
  const [t0, name, sub] = LEVELS[cur], k = cur ? sstep(t0, t0 + .35, t) : 1;
  text(name, 96, 296, { font: SANS, size: 40, weight: 700, color: CREAM, alpha: a * k, ls: 2 });
  font(40, 700, SANS); ctx.letterSpacing = '2px'; const w = ctx.measureText(name).width; ctx.letterSpacing = '0px';
  if (sub) text('· ' + sub, 96 + w + 16, 298, { font: SANS, size: 32, weight: 500, color: ORANGE, alpha: a * k, ls: 2 });
  for (let i = 0; i < LEVELS.length; i++) {
    const x = 984 - (LEVELS.length - 1 - i) * 40;
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, 296, 9, 0, TAU);
    if (i <= cur) { ctx.fillStyle = i === cur ? ORANGE : 'rgba(236,230,218,.75)'; ctx.fill(); } else { ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.restore();
  }
}

// ------------------------------------------------------------------------ 提词版：下半屏
const PR = { size: 58, max: 900, lh: 80 };
function prompterPanel(T) {
  const t = T - LEAD;
  ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.62)'; ctx.beginPath(); ctx.roundRect(40, 1262, 1000, 620, 28); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.setLineDash([12, 10]); ctx.stroke(); ctx.restore();
  text('提词版 · 静音播放 · 这里是你出镜的位置', 80, 1304, { font: SANS, size: 26, weight: 500, color: DIM });
  const tc = Math.max(0, t), mm = Math.floor(tc / 60), ss = (tc % 60).toFixed(1).padStart(4, '0');
  text(`${String(mm).padStart(2, '0')}:${ss}`, 1000, 1304, { font: SANS, size: 28, weight: 700, color: DIM, align: 'right' });
  if (t < 0) {
    const n = Math.ceil(-t), f = -t - Math.floor(-t);
    text(String(n), 540, 1540, { font: SANS, size: 220, weight: 700, align: 'center', color: ORANGE, alpha: .4 + .6 * f });
    text('准备好，看镜头', 540, 1730, { font: SANS, size: 44, weight: 700, align: 'center', color: CREAM });
    text(`第一句：${LINES[0][2]}`, 540, 1820, { font: SANS, size: 30, weight: 500, align: 'center', color: DIM });
    return;
  }
  const cur = LINES.find(([a, b]) => t >= a - .15 && t <= b + .3), next = LINES.find(([a]) => a > t + .05 && (!cur || a > cur[0]));
  const nextLine = () => {
    if (!next) return;
    font(32, 500, SANS); let s = '下一句：' + next[2];
    while (ctx.measureText(s).width > 900 && s.length > 6) s = s.slice(0, -2) + '…';
    text(s, 540, 1780, { font: SANS, size: 32, weight: 500, align: 'center', color: DIM });
  };
  if (cur && cur[4] && cur[4].count) {                                               // 倒数：只放一个大数字，跟着念
    const cs = cur[4].count, ci = cs.findIndex((c, i) => t >= c && t < (cs[i + 1] ?? cur[1] + .3));
    if (ci >= 0) text(cur[4].digits[ci], 540, 1470, { font: SANS, size: 210, weight: 700, align: 'center', color: GOLD, alpha: 1 - .5 * clamp((t - cs[ci]) / .75) });
    if (cur[3]) text(cur[3], 540, 1640, { font: SANS, size: 34, weight: 500, align: 'center', color: '#9fb4cf' });
    nextLine(); return;
  }
  if (cur) {
    const [a, b, s, dir] = cur, rs = runs(s), o = { size: PR.size, weight: 700, font: SANS };
    const lines = wrapRuns(rs, o, PR.max), n = rs.length, p = prog(t, a, b) * n;
    let idx = 0;
    lines.forEach((ln, li) => {
      const adv = advances(ln, o), wsum = adv.reduce((x, y) => x + y, 0);
      let x = 540 - wsum / 2; const y = 1480 + (li - (lines.length - 1) / 2) * PR.lh;
      ln.forEach((c, i) => { const k = clamp(p - idx); text(c.ch, x, y, { font: SANS, size: PR.size, weight: 700, color: k > .5 ? ORANGE : CREAM }); x += adv[i]; idx++; });
    });
    if (dir) text(dir, 540, 1630, { font: SANS, size: 34, weight: 500, align: 'center', color: '#9fb4cf' });
  } else if (next) {
    const prev = [...LINES].reverse().find(([, b]) => b < t), t0 = prev ? prev[1] + .3 : 0, k = prog(t, t0, next[0] - .15);
    text('（停）', 540, 1480, { font: SANS, size: 44, weight: 500, align: 'center', color: DIM });
    ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(240, 1560, 600, 6); ctx.fillStyle = ORANGE; ctx.fillRect(240, 1560, 600 * k, 6);
  }
  nextLine();
}

// ------------------------------------------------------------------------ 一帧（覆盖引擎的 render）
function HUD(t) {}
function render(T) {
  T = clamp(T, 0, TOTAL - 1e-4);
  const t = Math.max(0, T - LEAD), n = Math.max(1, SAMPLES(t) | 0);
  reset(OUT);
  for (let k = 0; k < n; k++) {
    const tk = n === 1 ? t : Math.max(0, t + (k / (n - 1) - .5) * SHUTTER / FPS);
    ctx = n === 1 ? OUT : LCTX; reset(ctx); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    WORLD(tk);
    if (n > 1) { reset(OUT); OUT.globalAlpha = 1 / (k + 1); OUT.drawImage(LAYER, 0, 0); }
  }
  ctx = OUT; reset(OUT);
  HUD(t); reset(OUT);
  const mk0 = typeof MARK_FROM === 'number' ? MARK_FROM : 2.9;                       // 水印：舞台左下角，静止、很淡
  text('@黑猫不说话', 96, 1152, { font: SANS, size: 24, weight: 500, color: '#ffffff', alpha: .26 * sstep(mk0, mk0 + .4, t) * (1 - sstep(BODY - 3.6, BODY - 3.2, t)), ls: 2 });
  reset(OUT);
  if (PROMPTER) {
    if (T < LEAD) { OUT.fillStyle = 'rgba(0,0,0,.45)'; OUT.fillRect(0, 0, W, 1250); }
    prompterPanel(T); reset(OUT);
  }
  const dark = sstep(BODY - .7, BODY, t);
  if (dark > 0) { OUT.fillStyle = `rgba(0,0,0,${dark})`; OUT.fillRect(0, 0, W, H); }
}
function BLOOM_K() { return 0; }
function OVER() {}
function MASTER() { return 1; }
function INIT() {}
