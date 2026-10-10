
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
function compareBars(rows, t, y0, gap = 190) {      // [标签, 值, 颜色, 出现时间]
  rows.forEach(([lab, v, col, t0], i) => {
    const y = y0 + i * gap, a = sstep(t0, t0 + .4, t), w = 840 * v * eout((t - t0 - .1) / 1);
    text(lab, 120, y - 46, { font: SANS, size: 30, color: CREAM, alpha: a });
    ctx.save(); ctx.globalAlpha = a; rr(120, y, 840, 40, 12, 'rgba(255,255,255,.06)');
    ctx.shadowColor = col; ctx.shadowBlur = 18; rr(120, y, Math.max(1, w), 40, 12, col); ctx.restore();
  });
}
// 输入框：先打一句、删掉，再打另一句发出去
function typeBox(lt, a, s, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  rr(110, 1080, 860, 110, 55, 'rgba(28,34,46,.95)', 'rgba(255,255,255,.08)', 2);
  ctx.font = `500 42px ${SANS}`; ctx.letterSpacing = '0px'; const tw = ctx.measureText(s).width;
  text(s, 160, 1135, { font: SANS, size: 42, color: CREAM });
  if (Math.floor(lt * 2.2) % 2 === 0 && !o.sent) { ctx.fillStyle = CREAM; ctx.fillRect(164 + tw, 1112, 3, 48); }
  ctx.fillStyle = TEAL; ctx.globalAlpha *= s.length ? 1 : .35; ctx.beginPath(); ctx.arc(910, 1135, 36, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- 0–10.5 钩子：明明不想去，嘴上说“好呀”（第一帧就是封面）
const NO_DRAFT = '我周六有点……', YES = '好呀！';
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('明明不想去，', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 4 });
    text('嘴上却说「好呀」。', W / 2, 520, { size: 66, weight: 900, align: 'center', color: ORANGE, ls: 4, glow: `rgba(${O_RGB},.45)`, blur: 26 });
    bubble('周六一起去唱歌吧？', 110, 680, 'L', 1, { time: '21:12' });
    const typed = lt < 1 ? 0 : lt < 3 ? (lt - 1) / .3 : lt < 3.4 ? 99 : lt < 4.4 ? Math.max(0, [...NO_DRAFT].length - (lt - 3.4) / .12) : 0;
    const yesT = lt < 4.6 ? 0 : (lt - 4.6) / .3, sent = lt > 6;
    const s = lt < 4.5 ? [...NO_DRAFT].slice(0, Math.floor(Math.min(typed, 99))).join('') : sent ? '' : [...YES].slice(0, Math.floor(yesT)).join('');
    typeBox(lt, 1, s, { sent });
    bubble(YES, 970, 830, 'R', sstep(6, 6.15, lt), { time: '21:13', pop: (lt - 6) / .35 });
    if (lt > 6.8) {                                                   // 心里的真话
      const a = sstep(6.8, 7.3, lt);
      ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([6, 8]); rr(330, 900, 640, 90, 45, 'rgba(255,255,255,.03)', 'rgba(236,230,218,.4)', 2); ctx.restore();
      text('（其实好累，只想在家躺着）', 650, 946, { size: 32, weight: 500, align: 'center', color: DIM, alpha: a });
    }
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('讨好型人格', W / 2, 640, { size: 118, weight: 900, align: 'center', ls: 14, alpha: sstep(1, 2.2, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('拒绝别人，没你想的那么严重', W / 2, 770, { size: 40, weight: 500, align: 'center', ls: 8, color: '#a7b0bf', alpha: sstep(2.2, 3.3, lt) });
    const fa = sstep(1.6, 2.6, lt);
    pool(540, 1060, 150, fa * .7); human(540, 1060, 32, { ring: ORANGE, alpha: fa, dir: -PI / 2 });
    ['好', '好呀', '没问题', '可以的', '都行'].forEach((s, i) => {          // 四面八方的“好”
      const a = -PI / 2 + (i - 2) * .55, p = ((lt * .4 + i * .2) % 1), r = 110 + p * 90;
      text(s, 540 + Math.cos(a) * r * 1.4, 1060 + Math.sin(a) * r, { font: SANS, weight: 700, size: 32, align: 'center', color: ORANGE, alpha: fa * Math.sin(p * PI) });
    });
  },
});

// ---------------------------------------------------------------- 17.25–27 77% 的人答应过不想去的邀约
const P77 = (() => { const r = mulberry(77), lab = [...Array(77).fill(1), ...Array(23).fill(0)]; for (let i = 99; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [lab[i], lab[j]] = [lab[j], lab[i]]; } return lab.map((v, i) => ({ v, d: r(), x: 540 + ((i % 10) - 4.5) * 72, y: 640 + Math.floor(i / 10) * 60 })); })();
shot({
  t0: DROP, t1: 27, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#131a26', '#05070a');
    P77.forEach(p => { const c = p.v ? sstep(22 + p.d * 1.5, 22.3 + p.d * 1.5, t) : 0; human(p.x, p.y, 19, { dir: -PI / 2, ring: c ? ORANGE : null, ringA: c, alpha: sstep(17.4, 18, t) }); });
    const n = Math.round(77 * clamp((t - 22) / 1.8));
    text(`${n}%`, W / 2, 1290, { weight: 900, size: 96, align: 'center', color: ORANGE, alpha: sstep(22, 22.4, t), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    stamp('2024', sstep(17.6, 18.2, t), 'Givi & Kirk · JPSP');
  },
});
// ---------------------------------------------------------------- 27–41 你以为 TA 会很失望，其实没有
shot({
  t0: 27, t1: 41,
  draw(lt, d, T) {
    const t = 27 + lt;
    floor('#131a26', '#05070a');
    heading('①', '你高估了后果', sstep(27.2, 27.8, t));
    compareBars([['你以为 TA 会有多失望', .86, ORANGE, 31.8], ['TA 实际有多失望', .38, TEAL, 32.6]], t, 680);
    const ga = sstep(34.2, 34.7, t);
    if (ga > 0) {
      ctx.save(); ctx.globalAlpha = ga; ctx.strokeStyle = 'rgba(255,138,138,.8)'; ctx.lineWidth = 3;
      const x1 = 120 + 840 * .38, x2 = 120 + 840 * .86; ctx.beginPath(); ctx.moveTo(x1, 930); ctx.lineTo(x1, 950); ctx.lineTo(x2, 950); ctx.lineTo(x2, 930); ctx.stroke(); ctx.restore();
      text('想多了的部分', (x1 => x1)(120 + 840 * .62), 1000, { weight: 700, size: 36, align: 'center', color: '#ff8a8a', alpha: ga });
    }
    const ra = sstep(36.6, 37.1, t);
    if (ra > 0) { rr(120, 1090, 840, 120, 24, `rgba(${T_RGB},${.1 * ra})`, `rgba(${T_RGB},${.6 * ra})`, 2); text('TA 更在意的：你为什么不能来', 540, 1150, { weight: 700, size: 40, align: 'center', color: TEAL, alpha: ra }); }
    text('示意图', 960, 640 - 40, { font: SANS, size: 22, align: 'right', color: 'rgba(138,147,163,.6)', alpha: sstep(31.8, 32.3, t) });
  },
});
// ---------------------------------------------------------------- 41–53 另一面：你也低估了别人愿意帮你
shot({
  t0: 41, t1: 53,
  draw(lt, d, T) {
    const t = 41 + lt;
    floor('#131a26', '#05070a');
    heading('②', '你也低估了别人', sstep(41.2, 41.8, t));
    // 你预想：只有零星几个人会答应；实际：多了将近一倍
    const pa = sstep(45.6, 46.1, t);
    for (let i = 0; i < 20; i++) {
      const x = 170 + (i % 10) * 82, yA = 740, yB = 1000 + Math.floor(i / 10) * 0;
      const exp = i < 5, act = i < 10;
      human(x, yA, 22, { dir: -PI / 2, ring: exp ? TEAL : null, ringA: sstep(45.8 + i * .05, 46.1 + i * .05, t), alpha: pa });
      human(x, yB, 22, { dir: -PI / 2, ring: act ? ORANGE : null, ringA: sstep(48 + i * .06, 48.3 + i * .06, t), alpha: sstep(47.6, 48.1, t) });
      if (i >= 9) break;
    }
    text('你以为会答应的', 120, 660, { font: SANS, size: 30, color: TEAL, alpha: pa });
    text('实际答应的', 120, 920, { font: SANS, size: 30, color: ORANGE, alpha: sstep(47.6, 48.1, t) });
    text('多了将近一倍', W - 96, 1140, { weight: 900, size: 56, align: 'right', color: ORANGE, alpha: sstep(49.4, 49.9, t), glow: `rgba(${O_RGB},.45)`, blur: 22 });
    text('示意图', 960, 1200, { font: SANS, size: 22, align: 'right', color: 'rgba(138,147,163,.6)', alpha: sstep(46, 46.5, t) });
    stamp('2008', sstep(45.6, 46.2, t), 'Flynn & Lake · Bohns');
  },
});
// ---------------------------------------------------------------- 53–63 代价：咽下去的话不会消失
const SWALLOW = ['其实我不想去', '我也很累', '这不是我想要的', '能不能问问我', '我不喜欢这样', '下次别找我了', '我也需要休息'];
shot({
  t0: 53, t1: 63,
  draw(lt, d, T) {
    const t = 53 + lt;
    floor('#131a26', '#05070a');
    heading('③', '咽下去的话', sstep(53.2, 53.8, t));
    SWALLOW.forEach((s, i) => {                                         // 一句一句堆起来
      const a = sstep(53.6 + i * .5, 54 + i * .5, t), y = 1150 - i * 72;
      ctx.save(); ctx.globalAlpha = a * .9; rr(300, y - 30, 480, 60, 14, 'rgba(255,255,255,.05)', 'rgba(236,230,218,.25)', 1.5); ctx.restore();
      text(s, 540, y + 1, { size: 30, weight: 500, align: 'center', color: i % 2 ? DIM : CREAM, alpha: a });
    });
    pool(540, 1250, 120, .6); human(540, 1250, 26, { ring: ORANGE, dir: -PI / 2 });
    stamp('1992', sstep(57.6, 58.2, t), 'Jack & Dill · Silencing the Self');
  },
});
// ---------------------------------------------------------------- 63–74 怎么拒绝：先感谢，再说真实的理由
const PARTS = [['① 感谢', '谢谢你想着我！', 64], ['② 真实的理由', '这周太累了，想在家休息。', 66.2], ['③ 下次（可选）', '下次我约你。', 68.4]];
shot({
  t0: 63, t1: 74,
  draw(lt, d, T) {
    const t = 63 + lt;
    floor('#131a26', '#05070a'); bokeh(T, .6);
    heading('→', '一个拒绝模板', sstep(63.2, 63.8, t));
    bubble('周六一起去唱歌吧？', 110, 640, 'L', sstep(63.4, 63.7, t), { time: '21:12' });
    PARTS.forEach(([lab, s, t0], i) => {
      const y = 800 + i * 150, a = sstep(t0, t0 + .3, t);
      text(lab, 970, y - 62, { font: SANS, weight: 700, size: 26, align: 'right', color: TEAL, alpha: a });
      bubble(s, 970, y, 'R', a, { pop: (t - t0) / .35 });
    });
    text('拒绝的是这件事，不是这个人', W / 2, 1270, { weight: 700, size: 40, align: 'center', color: TEAL, alpha: sstep(70.4, 70.9, t) });
  },
});
// ---------------------------------------------------------------- 74–81 结尾
shot({
  t0: 74, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('你不需要，', W / 2, 560, { size: 56, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('让所有人都满意。', W / 2, 660, { size: 70, weight: 900, align: 'center', color: ORANGE, alpha: sstep(.5, 1.2, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    text('包括今天，对自己好一点。', W / 2, 780, { size: 40, weight: 500, align: 'center', color: '#a7b0bf', alpha: sstep(1.4, 2, lt), ls: 6 });
    pool(540, 1060, 160, .8); human(540, 1060, 32, { ring: ORANGE, dir: -PI / 2 });
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '明明很累，还是答应了？'], [5.1, 10.2, '这一期，聊聊「讨好型人格」。'],
  [10.8, 16.8, '它不是正式的诊断名称，却是很多人的日常。'],
  [17.5, 21.6, '2024 年的一项研究里，'],
  [21.9, 26.6, '77% 的人承认：答应过自己根本不想去的邀约。'],
  [27.3, 31.4, '研究者让一些人想象拒绝别人，另一些人想象被拒绝。'],
  [31.7, 36.2, '结果：拒绝的人，大大高估了对方的失望和生气。'],
  [36.5, 40.6, '被拒绝的人，更在意你给出的理由。'],
  [41.3, 45.4, '反过来也一样：你总觉得开口求助会被拒绝。'],
  [45.7, 52.4, 'Flynn 和 Bohns 发现：愿意帮忙的人，比你想的多将近一倍。'],
  [53.3, 57.4, '可一直咽下去的话，并不会消失。'],
  [57.7, 62.6, '研究发现：习惯「压抑自我」，和更高的抑郁水平有关。'],
  [63.3, 67.4, '一个拒绝的模板：先感谢，再说真实的理由。'],
  [67.7, 73.6, '「谢谢你想着我！这周太累了，想在家休息，下次我约你。」'],
  [74.4, 79.4, '评论区：你最想拒绝、却没拒绝的一件事是？'],
];
