
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
const RED = '#ff8a8a', R_RGB = '255,138,138';
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
// 一张“担心”卡片；stamp 为 0..1 时盖上“没发生”
function worryCard(s, x, y, w, a, stampA, happened) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  rr(x, y - 40, w, 80, 16, 'rgba(255,255,255,.05)', 'rgba(236,230,218,.22)', 1.5);
  text(s, x + 26, y + 1, { size: 32, weight: 500, color: CREAM, alpha: 1 - .45 * stampA });
  if (stampA > 0) {
    const col = happened ? RED : TEAL, rgb = happened ? R_RGB : T_RGB, sc = lerp(1.4, 1, eout(stampA));
    ctx.save(); ctx.translate(x + w - 100, y); ctx.rotate(-.12); ctx.scale(sc, sc); ctx.globalAlpha *= stampA;
    rr(-78, -26, 156, 52, 10, `rgba(${rgb},.12)`, col, 3);
    text(happened ? '发生了' : '没发生', 0, 1, { font: SANS, weight: 900, size: 28, align: 'center', color: col });
    ctx.restore();
  }
  ctx.restore();
}
const WORRIES = ['明天的汇报会搞砸', 'TA 是不是生我气了', '体检会不会有问题', '考试肯定要挂', '大家会不会笑我', '这辈子是不是就这样了'];

// ---------------------------------------------------------------- 0–10.5 钩子：你担心的事，91% 没发生（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('你担心的那些事，', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 4 });
    text('91% 都没有发生。', W / 2, 520, { size: 70, weight: 900, align: 'center', color: TEAL, ls: 4, glow: `rgba(${T_RGB},.45)`, blur: 26 });
    WORRIES.forEach((s, i) => worryCard(s, 120, 650 + i * 104, 840, 1, sstep(3 + i * .55, 3.3 + i * .55, lt), i === 3));
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题：焦虑
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('焦虑', W / 2, 650, { size: 150, weight: 900, align: 'center', ls: 40, alpha: sstep(1, 2.2, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('你担心的事，大部分没有发生', W / 2, 790, { size: 40, weight: 500, align: 'center', ls: 8, color: '#a7b0bf', alpha: sstep(2.2, 3.3, lt) });
    const fa = sstep(1.6, 2.6, lt);
    pool(540, 1080, 150, fa * .7); human(540, 1080, 32, { ring: ORANGE, alpha: fa, dir: -PI / 2 });
    ['万一……', '要是……', '会不会……', '如果……'].forEach((s, i) => {      // 头顶冒出来的“万一”
      const p = ((lt * .35 + i * .25) % 1), a = -PI / 2 + (i - 1.5) * .7;
      text(s, 540 + Math.cos(a) * (120 + p * 120) * 1.3, 1040 + Math.sin(a) * (110 + p * 90), { size: 34, weight: 700, align: 'center', color: RED, alpha: fa * Math.sin(p * PI) });
    });
  },
});

// ---------------------------------------------------------------- 17.25–31 91.4%：29 个人，把担心写下来再核对
const GRID = (() => { const r = mulberry(914), out = []; for (let i = 0; i < 100; i++) out.push({ d: r() }); const idx = [...Array(100).keys()].sort((a, b) => out[a].d - out[b].d); idx.slice(0, 9).forEach(i => out[i].hap = true); return out; })();
shot({
  t0: DROP, t1: 31, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#131a26', '#05070a');
    GRID.forEach((g, i) => {                                            // 100 条担心，一条条核对
      const x = 150 + (i % 10) * 87, y = 600 + Math.floor(i / 10) * 60, a = sstep(18 + i * .02, 18.3 + i * .02, t), c = sstep(26.4 + g.d * 2, 26.6 + g.d * 2, t);
      ctx.save(); ctx.globalAlpha = a; rr(x - 36, y - 24, 72, 48, 10, c ? (g.hap ? `rgba(${R_RGB},.7)` : `rgba(${T_RGB},.7)`) : 'rgba(255,255,255,.08)'); ctx.restore();
    });
    const n = (91.4 * clamp((t - 26.6) / 2)).toFixed(1);
    text(`${n}%`, 96, 1310 - 60, { weight: 900, size: 80, color: TEAL, alpha: sstep(26.6, 27, t), glow: `rgba(${T_RGB},.45)`, blur: 22 });
    text('没有发生', 470, 1310 - 60, { font: SANS, size: 34, color: CREAM, alpha: sstep(26.6, 27, t) });
    stamp('2020', sstep(17.6, 18.2, t), 'LaFreniere & Newman · Penn State');
  },
});

// ---------------------------------------------------------------- 31–45 不确定：可能会被电，比一定会被电更紧张
const DOORS = [['一定不会被电', .12, TEAL, T_RGB], ['一定会被电', .45, CREAM, '236,230,218'], ['可能会被电', .92, RED, R_RGB]];
shot({
  t0: 31, t1: 45,
  draw(lt, d, T) {
    const t = 31 + lt;
    floor('#131a26', '#05070a');
    heading('?', '大脑最怕的，是不确定', sstep(31.2, 31.8, t));
    DOORS.forEach(([lab, v, col, rgb], i) => {
      const x = 210 + i * 330, a = sstep(35.6 + i * .5, 36 + i * .5, t), h = 420 * v * eout((t - 36.6 - i * .3) / 1.2);
      ctx.save(); ctx.globalAlpha = a; rr(x - 80, 1100 - 420, 160, 420, 16, 'rgba(255,255,255,.04)', 'rgba(255,255,255,.12)', 2);
      ctx.shadowColor = col; ctx.shadowBlur = 18; rr(x - 80, 1100 - h, 160, Math.max(1, h), 16, `rgba(${rgb},.75)`); ctx.restore();
      text(lab, x, 1150, { font: SANS, weight: 700, size: 28, align: 'center', color: col, alpha: a });
    });
    text('紧张程度', 96, 640, { font: SANS, size: 26, color: DIM, alpha: sstep(35.6, 36, t) });
    text('示意图', 960, 1210, { font: SANS, size: 22, align: 'right', color: 'rgba(138,147,163,.6)', alpha: sstep(36, 36.5, t) });
    stamp('2016', sstep(35.7, 36.3, t), 'de Berker et al. · UCL');
  },
});

// ---------------------------------------------------------------- 45–56 冰山：各种焦虑底下，是对未知的恐惧
const TIPS = ['容貌焦虑', '年龄焦虑', '考试焦虑', '社交焦虑', '同辈压力'];
shot({
  t0: 45, t1: 56,
  draw(lt, d, T) {
    const t = 45 + lt, wl = 820;
    floor('#0f1a26', '#04070a');
    const g = ctx.createLinearGradient(0, wl, 0, 1300); g.addColorStop(0, 'rgba(60,110,160,.25)'); g.addColorStop(1, 'rgba(10,20,40,.0)');
    ctx.fillStyle = g; ctx.fillRect(0, wl, W, 500);
    ctx.strokeStyle = 'rgba(150,200,240,.35)'; ctx.lineWidth = 2; ctx.beginPath();
    for (let x = 0; x <= W; x += 8) { const y = wl + Math.sin(x * .02 + t * 1.5) * 5; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    const ia = sstep(45.3, 45.9, t), deep = sstep(49.6, 50.4, t);       // 冰山：水上一小角，水下一大块
    ctx.save(); ctx.globalAlpha = ia; ctx.fillStyle = 'rgba(225,235,245,.85)';
    ctx.beginPath(); ctx.moveTo(420, wl); ctx.lineTo(490, 650); ctx.lineTo(560, 700); ctx.lineTo(620, 620); ctx.lineTo(680, wl); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = ia * (.25 + .6 * deep); ctx.fillStyle = 'rgba(160,190,220,.6)';
    ctx.beginPath(); ctx.moveTo(420, wl); ctx.lineTo(280, 1000); ctx.lineTo(380, 1180); ctx.lineTo(700, 1230); ctx.lineTo(830, 1040); ctx.lineTo(680, wl); ctx.closePath(); ctx.fill(); ctx.restore();
    TIPS.forEach((s, i) => {
      const a = sstep(45.6 + i * .35, 46 + i * .35, t), x = [180, 900, 230, 860, 540][i], y = [660, 640, 760, 760, 560][i];
      text(s, x, y, { font: SANS, weight: 700, size: 32, align: 'center', color: CREAM, alpha: a });
    });
    text('对「未知」的恐惧', 545, 1080, { weight: 900, size: 52, align: 'center', color: ORANGE, alpha: deep, glow: `rgba(${O_RGB},.5)`, blur: 22 });
    stamp('2016', sstep(45.4, 46, t), 'Carleton · Fear of the Unknown');
  },
});

// ---------------------------------------------------------------- 56–72 办法：给担心约一个固定的时间
shot({
  t0: 56, t1: 72,
  draw(lt, d, T) {
    const t = 56 + lt;
    floor('#131a26', '#05070a');
    heading('→', '给担心约个时间', sstep(56.2, 56.8, t));
    const na = sstep(56.6, 57.2, t);                                   // 一张便签：白天冒出来的担心，先记下来
    ctx.save(); ctx.globalAlpha = na; ctx.translate(330, 880); ctx.rotate(-.04);
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; rr(-220, -260, 440, 520, 12, '#e8dcc0'); ctx.shadowBlur = 0;
    text('担心清单', -180, -200, { size: 38, weight: 900, color: '#3b2f2a' });
    ['汇报会不会搞砸', 'TA 是不是生气了', '房租怎么办', '……'].forEach((s, i) => text(`· ${s}`, -180, -120 + i * 72, { size: 30, weight: 500, color: '#3b2f2a', alpha: sstep(60.8 + i * .5, 61.1 + i * .5, t) }));
    ctx.restore();
    const ca = sstep(62.6, 63.2, t);                                   // 一个固定的“担心时间”
    ctx.save(); ctx.globalAlpha = ca;
    ctx.strokeStyle = TEAL; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(800, 800, 130, 0, TAU); ctx.stroke();
    ctx.fillStyle = `rgba(${T_RGB},.25)`; ctx.beginPath(); ctx.moveTo(800, 800); ctx.arc(800, 800, 124, -PI / 2, -PI / 2 + TAU / 12 * 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(800, 800); ctx.lineTo(800, 710); ctx.moveTo(800, 800); ctx.lineTo(860, 800); ctx.stroke();
    ctx.restore();
    text('担心时间', 800, 985, { weight: 900, size: 40, align: 'center', color: TEAL, alpha: ca });
    text('每天固定一小段', 800, 1035, { font: SANS, size: 26, align: 'center', color: DIM, alpha: ca });
    const da = sstep(66, 66.5, t);
    if (da > 0) { rr(100, 1170, 880, 90, 45, `rgba(${T_RGB},${.1 * da})`, `rgba(${T_RGB},${.6 * da})`, 2); text('四周后：每天担心的时间，明显变少', 540, 1216, { weight: 700, size: 36, align: 'center', color: TEAL, alpha: da }); }
    stamp('1983', sstep(60.8, 61.4, t), 'Borkovec et al.');
  },
});
// ---------------------------------------------------------------- 72–81 结尾
shot({
  t0: 72, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('你担心的事，大多数不会发生；', W / 2, 560, { size: 50, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('就算发生了，', W / 2, 660, { size: 56, weight: 700, align: 'center', alpha: sstep(.7, 1.3, lt) });
    text('你也会有办法。', W / 2, 760, { size: 70, weight: 900, align: 'center', color: ORANGE, alpha: sstep(1.2, 1.9, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    pool(540, 1060, 160, .8); human(540, 1060, 32, { ring: ORANGE, dir: -PI / 2 });
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '睡前，把明天所有的坏结果都预演了一遍？'], [5.1, 10.2, '这一期，聊聊「焦虑」。'],
  [10.8, 16.8, '容貌焦虑、年龄焦虑、同辈压力……它快成了年轻人的底色。'],
  [17.5, 21.6, '2020 年，宾州州立大学的研究者，请 29 位广泛性焦虑的人，'],
  [21.9, 26.2, '把每天的担心都记下来；过一段时间，再回头核对。'],
  [26.5, 30.8, '结果：91.4% 的担心，根本没有发生。'],
  [31.3, 35.4, '那为什么还停不下来？因为大脑最怕的，是「不确定」。'],
  [35.7, 40.2, '2016 年的实验：不知道会不会被电，比确定会被电，更让人紧张。'],
  [40.5, 44.6, '所以大脑宁愿把最坏的结果先演一遍，假装自己有准备。'],
  [45.3, 49.4, '加拿大心理学家 Carleton 认为：'],
  [49.7, 55.6, '对「未知」的恐惧，可能是许多焦虑最底层的那一块。'],
  [56.3, 60.4, '一个办法：给担心，约一个固定的时间。'],
  [60.7, 65.6, 'Borkovec 的方法：担心先记下来，留到「担心时间」再集中想。'],
  [65.9, 71.6, '四周后，他们每天担心的时间，明显变少了。'],
  [72.4, 78.8, '评论区：你最近一次白担心的事，是什么？'],
];
