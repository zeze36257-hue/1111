
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
// 打卡日历：n 格，done(i) 返回 0..1 的打卡进度，miss 是空着的那天
function calendar(x0, y0, n, cols, cell, done, o = {}) {
  for (let i = 0; i < n; i++) {
    const x = x0 + (i % cols) * cell, y = y0 + Math.floor(i / cols) * cell, d = done(i), miss = o.miss === i;
    rr(x, y, cell - 10, cell - 10, 10, 'rgba(255,255,255,.04)', 'rgba(236,230,218,.18)', 1.5);
    if (o.nums) text(String(i + 1), x + 12, y + 20, { font: SANS, size: 18, color: 'rgba(138,147,163,.7)' });
    if (miss && d > 0) { text('×', x + (cell - 10) / 2, y + (cell - 10) / 2 + 2, { font: SANS, weight: 700, size: cell * .5, align: 'center', color: '#ff8a8a', alpha: d }); continue; }
    if (d <= 0) continue;
    ctx.save(); ctx.globalAlpha = d; ctx.strokeStyle = o.col || ORANGE; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const cx = x + (cell - 10) / 2, cy = y + (cell - 10) / 2, s = (cell - 10) * .28;
    ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.lineTo(cx - s * .3, cy + s * .7); ctx.lineTo(cx + s, cy - s * .6); ctx.stroke(); ctx.restore();
  }
}

// ---------------------------------------------------------------- 0–10.5 钩子：坚持 21 天就能养成习惯？（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('坚持 21 天，就能养成习惯？', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 3 });
    text('研究说：没那么快。', W / 2, 520, { size: 66, weight: 900, align: 'center', color: ORANGE, ls: 4, glow: `rgba(${O_RGB},.45)`, blur: 26 });
    calendar(150, 640, 21, 7, 112, i => sstep(.4 + i * .18, .6 + i * .18, lt), { nums: true });
    const q = sstep(4.8, 5.4, lt);
    text('21', 540, 1060, { weight: 900, size: 0.1 + 160 * q, align: 'center', color: CREAM, alpha: q * .95, glow: 'rgba(255,220,170,.35)', blur: 30 });
    text('？', 700, 1020, { weight: 900, size: 110, align: 'center', color: ORANGE, alpha: sstep(5.8, 6.3, lt) });
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题：被误解的心理学 ①
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('被误解的心理学 ①', W / 2, 580, { size: 40, weight: 700, align: 'center', color: TEAL, ls: 10, alpha: sstep(.9, 1.6, lt) });
    text('21 天神话', W / 2, 700, { size: 124, weight: 900, align: 'center', ls: 14, alpha: sstep(1.2, 2.4, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('养成一个习惯，到底要多久', W / 2, 830, { size: 40, weight: 500, align: 'center', ls: 10, color: '#a7b0bf', alpha: sstep(2.4, 3.4, lt) });
  },
});

// ---------------------------------------------------------------- 17.25–29 出处：一本 1960 年的畅销书
shot({
  t0: DROP, t1: 29, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#1a1612', '#060504');
    const ba = sstep(17.5, 18.1, t);                                   // 一本书
    ctx.save(); ctx.globalAlpha = ba; ctx.translate(540, 760); ctx.rotate(-.04);
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; rr(-190, -250, 380, 500, 10, '#2c3e66'); ctx.shadowBlur = 0;
    rr(-190, -250, 26, 500, 4, '#22314f');
    text('PSYCHO-', 10, -120, { font: LAT, weight: 600, size: 52, align: 'center', color: '#f2e6c8', ls: 4 });
    text('CYBERNETICS', 10, -60, { font: LAT, weight: 600, size: 44, align: 'center', color: '#f2e6c8', ls: 4 });
    text('Maxwell Maltz', 10, 150, { font: LAT, style: 'italic', weight: 500, size: 34, align: 'center', color: '#cdbf9e' });
    ctx.restore();
    // 原话被一步步简化：“最少约 21 天，适应新的样子” → “21 天养成习惯”
    const s1 = sstep(21.8, 22.3, t), cut = eout((t - 24.4) / .8), s2 = sstep(25.6, 26.2, t);
    text('病人适应新的样子，最少要 21 天左右', W / 2, 1100, { size: 40, weight: 700, align: 'center', color: CREAM, alpha: s1 * (1 - .6 * s2) });
    if (cut > 0) { ctx.save(); ctx.globalAlpha = s1 * (1 - .6 * s2); ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(190, 1102); ctx.lineTo(190 + 700 * cut, 1102); ctx.stroke(); ctx.restore(); }
    text('↓', W / 2, 1170, { weight: 900, size: 44, align: 'center', color: DIM, alpha: s2 });
    text('「21 天养成一个习惯」', W / 2, 1240, { size: 52, weight: 900, align: 'center', color: ORANGE, alpha: s2, glow: `rgba(${O_RGB},.4)`, blur: 20 });
    stamp('1960', sstep(17.6, 18.2, t), 'Maxwell Maltz · 整形外科医生');
  },
});

// ---------------------------------------------------------------- 29–45 Lally 2010：平均 66 天，18 到 254 天
const CURVES = [[18, TEAL], [40, CREAM], [66, ORANGE], [110, CREAM], [180, CREAM], [254, '#8fa8ff']];
const GX0 = 150, GX1 = 940, GYB = 1120, GYT = 680, DMAX = 260;
const gx = dd => lerp(GX0, GX1, dd / DMAX);
shot({
  t0: 29, t1: 45,
  draw(lt, d, T) {
    const t = 29 + lt;
    floor('#131a26', '#05070a');
    ctx.save(); ctx.globalAlpha = sstep(29.3, 29.9, t); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(GX0, GYT - 30); ctx.lineTo(GX0, GYB); ctx.lineTo(GX1 + 20, GYB); ctx.stroke(); ctx.restore();
    text('自动化程度（不用想就会去做）', GX0, GYT - 100, { font: SANS, size: 26, color: DIM, alpha: sstep(29.3, 29.9, t) });
    text('天数 →', GX1, GYB + 46, { font: SANS, size: 26, align: 'right', color: DIM, alpha: sstep(29.3, 29.9, t) });
    const p = eio((t - 33.4) / 4);                                      // 每个人的曲线都在不同的时候“走平”
    CURVES.forEach(([days, col], i) => {
      if (p <= 0) return;
      ctx.save(); ctx.lineWidth = days === 66 ? 5 : 3; ctx.strokeStyle = col; ctx.globalAlpha = days === 66 ? 1 : .6;
      if (days === 66) { ctx.shadowColor = ORANGE; ctx.shadowBlur = 14; }
      ctx.beginPath();
      for (let dd = 0; dd <= DMAX * p; dd += 2) { const v = 1 - Math.exp(-3 * dd / days), y = lerp(GYB, GYT, v * (.82 + i * .03)); dd === 0 ? ctx.moveTo(gx(dd), y) : ctx.lineTo(gx(dd), y); }
      ctx.stroke(); ctx.restore();
    });
    [[18, TEAL, 38], [66, ORANGE, 40.6], [254, '#8fa8ff', 38.8]].forEach(([dd, col, t0]) => {
      const a = sstep(t0, t0 + .4, t); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.setLineDash([5, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx(dd), GYT - 20); ctx.lineTo(gx(dd), GYB); ctx.stroke(); ctx.restore();
      text(`${dd} 天`, gx(dd), GYB + (dd === 66 ? 46 : 86), { weight: 900, size: dd === 66 ? 48 : 34, align: 'center', color: col, alpha: a });
    });
    const ra = sstep(29.8, 30.4, t);
    ctx.save(); ctx.globalAlpha = ra; ctx.strokeStyle = '#ff8a8a'; ctx.setLineDash([3, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx(21), GYT - 20); ctx.lineTo(gx(21), GYB); ctx.stroke(); ctx.restore();
    text('21', gx(21), GYT - 40, { font: SANS, weight: 700, size: 26, align: 'center', color: '#ff8a8a', alpha: ra });
    stamp('2010', sstep(29.3, 29.9, t), 'Lally et al. · UCL');
  },
});
// ---------------------------------------------------------------- 45–55 2024 年的综述：4 到 335 天
shot({
  t0: 45, t1: 55,
  draw(lt, d, T) {
    const t = 45 + lt, X0 = 120, X1 = 960, M = 340, y = 880;
    floor('#131a26', '#05070a');
    const sx = dd => lerp(X0, X1, dd / M), a = sstep(45.3, 45.9, t), p = eout((t - 45.6) / 1.4);
    ctx.save(); ctx.globalAlpha = a; rr(X0, y - 6, (X1 - X0) * p, 12, 6, 'rgba(236,230,218,.35)'); ctx.restore();
    text('4 天', sx(4), y + 60, { weight: 900, size: 40, align: 'center', color: CREAM, alpha: sstep(46.6, 47, t) });
    text('335 天', sx(335), y + 60, { weight: 900, size: 40, align: 'center', color: CREAM, alpha: sstep(46.8, 47.2, t) });
    text('个体差异', W / 2, y - 80, { font: SANS, size: 30, align: 'center', color: DIM, alpha: sstep(46.6, 47, t) });
    const ma = sstep(49.6, 50.1, t);
    ctx.save(); ctx.globalAlpha = ma; ctx.shadowColor = ORANGE; ctx.shadowBlur = 20; rr(sx(59), y - 22, sx(66) - sx(59), 44, 8, ORANGE); ctx.restore();
    if (ma > 0) callout(sx(62.5), y - 22, 120, -140, ma, '59–66 天', '中位数', ORANGE, { grow: (t - 49.6) / .5, bigSize: 56 });
    const r = sstep(51.2, 51.6, t);
    ctx.save(); ctx.globalAlpha = r; ctx.strokeStyle = '#ff8a8a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx(21), y - 30); ctx.lineTo(sx(21), y + 30); ctx.stroke(); ctx.restore();
    text('21', sx(21), y - 56, { font: SANS, weight: 700, size: 28, align: 'center', color: '#ff8a8a', alpha: r });
    stamp('2024', sstep(45.3, 45.9, t), 'Singh et al. · 系统综述');
  },
});
// ---------------------------------------------------------------- 55–66 好消息：断一天，没关系
shot({
  t0: 55, t1: 66,
  draw(lt, d, T) {
    const t = 55 + lt;
    floor('#131a26', '#05070a');
    heading('♡', '断一天，没关系', sstep(55.2, 55.8, t));
    calendar(150, 600, 28, 7, 112, i => sstep(55.6 + i * .12, 55.8 + i * .12, t), { miss: 11, col: TEAL });
    const a = sstep(59.6, 60, t);
    if (a > 0) callout(150 + 4 * 112 + 51, 600 + 112 + 51, -120, 430, a, '', '这天忘了，也没影响', '#ff8a8a', { grow: (t - 59.6) / .5 });
    stamp('2010', sstep(55.3, 55.9, t), 'Lally et al.');
  },
});
// ---------------------------------------------------------------- 66–74 办法：“如果……就……”
shot({
  t0: 66, t1: 74,
  draw(lt, d, T) {
    const t = 66 + lt;
    floor('#131a26', '#05070a');
    heading('→', '给它一个固定的时刻', sstep(66.2, 66.8, t));
    const a1 = sstep(66.8, 67.3, t), a2 = sstep(68.4, 68.9, t);
    rr(100, 620, 880, 200, 26, `rgba(${O_RGB},${.08 * a1})`, `rgba(${O_RGB},${.6 * a1})`, 2);
    text('如果', 140, 680, { font: SANS, weight: 700, size: 30, color: ORANGE, alpha: a1 });
    text('吃完早饭，', 140, 755, { size: 52, weight: 700, color: CREAM, alpha: a1 });
    rr(100, 880, 880, 200, 26, `rgba(${T_RGB},${.08 * a2})`, `rgba(${T_RGB},${.6 * a2})`, 2);
    text('就', 140, 940, { font: SANS, weight: 700, size: 30, color: TEAL, alpha: a2 });
    text('喝一杯水。', 140, 1015, { size: 52, weight: 700, color: CREAM, alpha: a2 });
    stamp('Gollwitzer', sstep(68.9, 69.5, t), 'Implementation Intentions');
  },
});
// ---------------------------------------------------------------- 74–81 结尾
shot({
  t0: 74, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('慢一点没关系，', W / 2, 560, { size: 56, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('第 22 天，也别放弃。', W / 2, 660, { size: 70, weight: 900, align: 'center', color: ORANGE, alpha: sstep(.5, 1.2, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    calendar(150, 800, 28, 7, 112, i => sstep(1 + i * .08, 1.2 + i * .08, lt), { col: TEAL });
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '「坚持 21 天，养成一个好习惯」，你也听过吧？'], [5.1, 10.2, '这个说法，其实是个误会。'],
  [10.8, 16.8, '被误解的心理学，第一期。'],
  [17.5, 21.6, '这个说法，通常被追溯到 1960 年的一本畅销书。'],
  [21.9, 25.4, '作者是整形外科医生，他发现：病人适应新样子，最少要 21 天左右。'],
  [25.7, 28.8, '传着传着，就成了「21 天养成习惯」。'],
  [29.3, 33.2, '2010 年，伦敦大学学院的研究者，真的去测了。'],
  [33.5, 38.0, '96 个人，每人每天坚持一个新习惯，追踪了 84 天。'],
  [38.3, 44.6, '结果：平均要 66 天；快的 18 天，慢的推算要 254 天。'],
  [45.3, 49.4, '2024 年的一篇综述，汇总了更多研究：'],
  [49.7, 54.6, '中位数 59 到 66 天，个体差异从 4 天到 335 天。'],
  [55.3, 59.4, '但也有好消息：'],
  [59.7, 65.6, '偶尔断一天，对养成习惯几乎没有影响。'],
  [66.3, 69.4, '一个办法：给它绑一个固定的时刻。'],
  [69.7, 73.6, '心理学家 Gollwitzer 叫它「执行意图」：如果……就……'],
  [74.4, 79.4, '评论区：你坚持最久的一个习惯是什么？'],
];
