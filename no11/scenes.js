
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
const RED = '#ff8a8a', R_RGB = '255,138,138', GHOST = 'rgba(150,158,175,.7)';
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
function taskBox(s, x, y, a, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 30px ${SANS}`; ctx.letterSpacing = '0px';
  const w = ctx.measureText(s).width + 44;
  rr(x - w / 2, y - 28, w, 56, 12, 'rgba(255,255,255,.06)', 'rgba(236,230,218,.35)', 1.5);
  text(s, x, y + 1, { font: SANS, weight: 700, size: 30, align: 'center', color: col });
  ctx.restore();
}
const TASKS = ['写论文', '回邮件', '健身', '背单词', '整理房间'];

// ---------------------------------------------------------------- 0–10.5 钩子：今天的你 vs 明天的你（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('你不是懒，', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 4 });
    text('是把事情都留给了「陌生人」。', W / 2, 520, { size: 58, weight: 900, align: 'center', color: ORANGE, ls: 2, glow: `rgba(${O_RGB},.45)`, blur: 26 });
    pool(270, 1080, 140, .8); human(270, 1080, 32, { ring: ORANGE, dir: 0 });
    text('今天的你', 270, 1170, { font: SANS, size: 28, align: 'center', color: ORANGE });
    human(810, 1080, 32, { ring: GHOST, ringA: .6, alpha: .45, dir: PI });
    text('明天的你', 810, 1170, { font: SANS, size: 28, align: 'center', color: DIM });
    TASKS.forEach((s, i) => {                                           // 一件一件推给明天
      const p = eio((lt - .8 - i * .9) / 1.1), x = lerp(270, 810, p), y = 700 + i * 70 - Math.sin(p * PI) * 60;
      taskBox(s, x, y, 1, p > .5 ? DIM : CREAM);
    });
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题：拖延
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('拖延', W / 2, 650, { size: 150, weight: 900, align: 'center', ls: 40, alpha: sstep(1, 2.2, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('你不是懒', W / 2, 790, { size: 44, weight: 500, align: 'center', ls: 16, color: '#a7b0bf', alpha: sstep(2.2, 3.3, lt) });
    const fa = sstep(1.6, 2.6, lt);
    ['今天', '明天', '后天', '下周'].forEach((s, i) => {
      text(s, 220 + i * 215, 1000, { font: SANS, weight: 700, size: 30, align: 'center', color: i ? DIM : ORANGE, alpha: fa });
      ctx.fillStyle = `rgba(255,255,255,${.06 * fa})`; ctx.fillRect(220 + i * 215 - 80, 1030, 160, 4);
    });
    const p = (lt * .45) % 1, col = Math.floor(lt * .45) % 3;          // 同一件事，被一天天往后推
    taskBox('写论文', lerp(220 + col * 215, 220 + (col + 1) * 215, eio(p)), 1090 - Math.sin(p * PI) * 40, fa);
  },
});

// ---------------------------------------------------------------- 17.25–31 未来的你，在大脑看来像个陌生人
const BRAIN = [['现在的你', .9, ORANGE, O_RGB, 1], ['未来的你', .38, CREAM, '236,230,218', .5], ['一个陌生人', .32, GHOST, '150,158,175', .5]];
shot({
  t0: DROP, t1: 31, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#131a26', '#05070a');
    BRAIN.forEach(([lab, v, col, rgb, al], i) => {
      const x = 220 + i * 320, a = sstep(17.6 + i * .5, 18 + i * .5, t), h = 380 * v * eout((t - 21.9 - i * .25) / 1.2);
      pool(x, 680, 110, a * .6, rgb); human(x, 680, 30, { ring: col, ringA: al, alpha: a * (i ? .6 : 1), dir: PI / 2 });
      text(lab, x, 780, { font: SANS, weight: 700, size: 30, align: 'center', color: col, alpha: a });
      ctx.save(); ctx.globalAlpha = a; rr(x - 70, 1220 - 380, 140, 380, 14, 'rgba(255,255,255,.04)', 'rgba(255,255,255,.1)', 2);
      ctx.shadowColor = col; ctx.shadowBlur = 16; rr(x - 70, 1220 - h, 140, Math.max(1, h), 14, `rgba(${rgb},.75)`); ctx.restore();
    });
    text('大脑的“自我”反应', 96, 1270, { font: SANS, size: 26, color: DIM, alpha: sstep(21.9, 22.3, t) });
    const eq = sstep(24.4, 24.9, t);
    text('≈', 700, 1030, { weight: 900, size: 80, align: 'center', color: CREAM, alpha: eq });
    text('示意图', 960, 1270, { font: SANS, size: 22, align: 'right', color: 'rgba(138,147,163,.6)', alpha: sstep(22, 22.5, t) });
    stamp('2009', sstep(17.6, 18.2, t), 'Hershfield et al. · Stanford');
  },
});

// ---------------------------------------------------------------- 31–45 情绪：躲开难受，让心情先好一点
shot({
  t0: 31, t1: 45,
  draw(lt, d, T) {
    const t = 31 + lt;
    floor('#131a26', '#05070a');
    heading('♡', '拖延，是情绪问题', sstep(31.2, 31.8, t));
    const X0 = 120, X1 = 960, YM = 960;                                // 心情曲线：面对任务时下沉，躲开时回升，之后掉得更深
    ctx.save(); ctx.globalAlpha = sstep(35.6, 36, t); ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.setLineDash([4, 10]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X0, YM); ctx.lineTo(X1, YM); ctx.stroke(); ctx.restore();
    text('心情', X0, YM - 220, { font: SANS, size: 26, color: DIM, alpha: sstep(35.6, 36, t) });
    const mood = u => u < .25 ? lerp(0, -.6, u / .25) : u < .5 ? lerp(-.6, .55, (u - .25) / .25) : u < .7 ? lerp(.55, .4, (u - .5) / .2) : lerp(.4, -.85, (u - .7) / .3);
    const p = eio((t - 36) / 7.5);
    if (p > 0) {
      ctx.save(); ctx.lineWidth = 5; ctx.lineCap = 'round';
      let px = X0, py = YM;
      for (let u = .01; u <= p + 1e-6; u += .01) {
        const v = mood(u), x = lerp(X0, X1, u), y = YM - v * 220, k = clamp(v * .7 + .5);
        ctx.strokeStyle = `rgb(${Math.round(lerp(255, 242, k))},${Math.round(lerp(138, 161, k))},${Math.round(lerp(138, 74, k))})`;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); px = x; py = y;
      }
      ctx.restore();
    }
    [['打开文档', .2, 36.6, 120], ['刷一下手机', .42, 38.4, -150], ['deadline', .95, 41.2, 120]].forEach(([s, u, t0, dy]) => {
      const a = sstep(t0, t0 + .4, t); if (a <= 0) return;
      taskBox(s, lerp(X0, X1, u), YM - mood(u) * 220 + dy, a, u > .9 ? RED : CREAM);
    });
    stamp('2013', sstep(35.7, 36.3, t), 'Sirois & Pychyl');
  },
});
// ---------------------------------------------------------------- 45–56 恶性循环：拖延 → 自责 → 更难受 → 更想躲
const LOOP = ['拖延', '自责', '更难受', '更想躲'];
shot({
  t0: 45, t1: 56,
  draw(lt, d, T) {
    const t = 45 + lt, cx = 540, cy = 900, R = 250;
    floor('#131a26', '#05070a');
    heading('◎', '越骂自己，越拖', sstep(45.2, 45.8, t));
    const spin = t * .5;
    ctx.save(); ctx.strokeStyle = `rgba(${R_RGB},.5)`; ctx.lineWidth = 4; ctx.globalAlpha = sstep(45.4, 46, t);
    for (let k = 0; k < 4; k++) { const a0 = spin + k * PI / 2 + .35, a1 = a0 + PI / 2 - .7; ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.stroke(); const ex = cx + Math.cos(a1) * R, ey = cy + Math.sin(a1) * R; ctx.fillStyle = `rgba(${R_RGB},.7)`; ctx.beginPath(); ctx.arc(ex, ey, 8, 0, TAU); ctx.fill(); }
    ctx.restore();
    LOOP.forEach((s, i) => {
      const a = spin + i * PI / 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, al = sstep(45.6 + i * .5, 46 + i * .5, t);
      ctx.save(); ctx.globalAlpha = al; rr(x - 90, y - 38, 180, 76, 38, 'rgba(20,24,32,.95)', i === 1 ? RED : 'rgba(236,230,218,.4)', 2); ctx.restore();
      text(s, x, y + 2, { font: SANS, weight: 700, size: 32, align: 'center', color: i === 1 ? RED : CREAM, alpha: al });
    });
    pool(cx, cy, 120, .6, '255,150,150'); human(cx, cy, 30, { ring: RED, dir: -PI / 2 });
  },
});
// ---------------------------------------------------------------- 56–72 一个反直觉的办法：原谅自己
shot({
  t0: 56, t1: 72,
  draw(lt, d, T) {
    const t = 56 + lt;
    floor('#131a26', '#05070a');
    heading('→', '原谅自己', sstep(56.2, 56.8, t));
    const xs = [220, 540, 860], ya = 700;                              // 第一次考试 → 原谅 / 自责 → 第二次考试
    [['第一次考试前', 0], ['之后', 1], ['第二次考试前', 2]].forEach(([s, i]) => text(s, xs[i], ya, { font: SANS, weight: 700, size: 28, align: 'center', color: DIM, alpha: sstep(60.6 + i * .4, 61 + i * .4, t) }));
    taskBox('拖延了', xs[0], 830, sstep(60.8, 61.2, t), RED);
    taskBox('原谅自己', xs[1], 790, sstep(62, 62.4, t), TEAL);
    taskBox('骂自己', xs[1], 900, sstep(62.3, 62.7, t), RED);
    ctx.save(); ctx.globalAlpha = sstep(62, 62.6, t) * .6; ctx.strokeStyle = CREAM; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(xs[0] + 80, 830); ctx.lineTo(xs[1] - 90, 790); ctx.moveTo(xs[0] + 80, 830); ctx.lineTo(xs[1] - 80, 900); ctx.stroke(); ctx.restore();
    [[TEAL, T_RGB, .3, 790], [RED, R_RGB, .75, 900]].forEach(([col, rgb, v, y], i) => {    // 第二次考试前，拖延的程度
      const w = 220 * v * eout((t - 66 - i * .2) / 1);
      ctx.save(); ctx.globalAlpha = sstep(65.9, 66.3, t); ctx.shadowColor = col; ctx.shadowBlur = 14; rr(xs[2] - 110, y - 22, Math.max(1, w), 44, 10, `rgba(${rgb},.8)`); ctx.restore();
    });
    text('拖得更少', xs[2], 1000, { weight: 900, size: 40, align: 'center', color: TEAL, alpha: sstep(67.6, 68, t) });
    text('问卷研究 · 示意图', 960, 1230, { font: SANS, size: 22, align: 'right', color: 'rgba(138,147,163,.6)', alpha: sstep(61, 61.5, t) });
    stamp('2010', sstep(60.7, 61.3, t), 'Wohl, Pychyl & Bennett');
  },
});
// ---------------------------------------------------------------- 72–81 结尾：对明天的自己，好一点
shot({
  t0: 72, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('对明天的自己，', W / 2, 560, { size: 56, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('好一点。', W / 2, 670, { size: 80, weight: 900, align: 'center', color: ORANGE, alpha: sstep(.5, 1.2, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    const k = eio((lt - 1) / 3), x2 = lerp(810, 620, k);
    pool(460, 1060, 150, .8); human(460, 1060, 32, { ring: ORANGE, dir: 0 });
    pool(x2, 1060, 150, .8 * k); human(x2, 1060, 32, { ring: k > .6 ? ORANGE : GHOST, alpha: lerp(.45, 1, k), dir: PI });
    text('今天的你', 460, 1150, { font: SANS, size: 28, align: 'center', color: ORANGE });
    text('明天的你', x2, 1150, { font: SANS, size: 28, align: 'center', color: k > .6 ? ORANGE : DIM });
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, 'deadline 前一晚才动手，然后骂自己懒？'], [5.1, 10.2, '这一期，聊聊「拖延」。'],
  [10.8, 16.8, '先说结论：你很可能不是懒。'],
  [17.5, 21.6, '斯坦福的 Hershfield 用脑成像发现：'],
  [21.9, 26.2, '人想到「未来的自己」时，大脑的反应，更像在想一个别人。'],
  [26.5, 30.8, '越把未来的自己当外人，越容易选眼前的小奖励。'],
  [31.3, 35.4, '拖延，其实不是时间管理问题，'],
  [35.7, 40.2, '而是情绪问题：躲开难受的任务，让心情先好一点。'],
  [40.5, 44.6, '代价，是把难受打包，留给明天的自己。'],
  [45.3, 49.4, '然后骂自己懒，心情更差——'],
  [49.7, 55.6, '于是更想躲。拖延和自责，互相喂养。'],
  [56.3, 60.4, '一个反直觉的办法：原谅自己。'],
  [60.7, 65.6, '2010 年的研究：第一次考试前拖延、但原谅了自己的学生，'],
  [65.9, 71.6, '第二次考试前，拖得更少了。'],
  [72.4, 78.8, '评论区：你现在正在拖的一件事，是什么？'],
];
