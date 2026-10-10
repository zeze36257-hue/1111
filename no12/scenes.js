
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
const RED = '#ff8a8a', R_RGB = '255,138,138';
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
// 俯视的一颗棉花糖
function marshmallow(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  const g = ctx.createRadialGradient(x - s * .3, y - s * .3, 0, x, y, s); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(210,200,185,.6)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * .86, 0, TAU); ctx.fill();
  ctx.restore();
}
function plate(x, y, r, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(236,230,218,.12)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * .78, 0, TAU); ctx.stroke(); ctx.restore();
}
function timer(x, y, sec, col, a = 1, size = 56) {
  text(`${pad2(sec / 60)}:${pad2(sec % 60)}`, x, y, { weight: 700, size, align: 'center', color: col, alpha: a });
}
function bars(rows, t, x0, y0, gap) {               // 竖条：[标签, 值, 颜色, rgb, 出现时间]
  rows.forEach(([lab, v, col, rgb, t0], i) => {
    const x = x0 + i * gap, a = sstep(t0, t0 + .4, t), h = 420 * v * eout((t - t0 - .1) / 1.2);
    ctx.save(); ctx.globalAlpha = a; rr(x - 80, 1120 - 420, 160, 420, 14, 'rgba(255,255,255,.04)', 'rgba(255,255,255,.1)', 2);
    ctx.shadowColor = col; ctx.shadowBlur = 16; rr(x - 80, 1120 - h, 160, Math.max(1, h), 14, `rgba(${rgb},.8)`); ctx.restore();
    lab.split('\n').forEach((l, j) => text(l, x, 1166 + j * 36, { font: SANS, weight: 700, size: 26, align: 'center', color: col, alpha: a }));
  });
}

// ---------------------------------------------------------------- 0–10.5 钩子（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('能忍住不吃棉花糖的孩子，', W / 2, 430, { size: 54, weight: 700, align: 'center', ls: 3 });
    text('长大后更成功？', W / 2, 520, { size: 70, weight: 900, align: 'center', color: ORANGE, ls: 4, glow: `rgba(${O_RGB},.45)`, blur: 26 });
    rr(190, 760, 700, 300, 30, '#2e241d', 'rgba(255,255,255,.06)', 2);              // 一张小桌子
    plate(540, 880, 90); marshmallow(540, 880, 40);
    marshmallow(760, 820, 30, .35); marshmallow(810, 850, 30, .35);
    text('等一等，就有两颗', 785, 920, { font: SANS, size: 24, align: 'center', color: DIM });
    pool(540, 1150, 120, .7); human(540, 1150, 30, { ring: ORANGE, dir: -PI / 2, lookY: -1 });
    timer(540, 690, 15 * 60 - Math.max(0, lt - .5) * 60, CREAM, 1, 52);
    text('后来的研究：没那么简单。', W / 2, 1260, { size: 38, weight: 700, align: 'center', color: TEAL, alpha: sstep(6, 6.6, lt) });
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('被误解的心理学 ②', W / 2, 580, { size: 40, weight: 700, align: 'center', color: TEAL, ls: 10, alpha: sstep(.9, 1.6, lt) });
    text('棉花糖实验', W / 2, 700, { size: 120, weight: 900, align: 'center', ls: 14, alpha: sstep(1.2, 2.4, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    plate(540, 960, 110, sstep(2, 2.8, lt)); marshmallow(540, 960, 48, sstep(2.2, 3, lt));
  },
});

// ---------------------------------------------------------------- 17.25–30 原实验：斯坦福的幼儿园
shot({
  t0: DROP, t1: 30, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#1a1612', '#060504');
    const ka = sstep(17.6, 18.2, t);                                   // 一排孩子，各自面前一颗棉花糖
    for (let i = 0; i < 6; i++) {
      const x = 170 + i * 148, ate = [1, 4].includes(i) && t > 23 + i * .3;
      plate(x, 700, 52, ka); marshmallow(x, 700, 24, ka * (ate ? 0 : 1));
      human(x, 800, 24, { ring: ate ? RED : TEAL, ringA: sstep(23, 23.5, t), alpha: ka, dir: -PI / 2 });
    }
    text('现在吃：1 颗', 300, 900, { font: SANS, weight: 700, size: 30, align: 'center', color: RED, alpha: sstep(22, 22.4, t) });
    text('等一等：2 颗', 780, 900, { font: SANS, weight: 700, size: 30, align: 'center', color: TEAL, alpha: sstep(22.6, 23, t) });
    const ba = sstep(26, 26.4, t);
    [['等得短', .45, RED, R_RGB], ['等得久', .78, TEAL, T_RGB]].forEach(([lab, v, col, rgb], i) => {   // 多年后的 SAT 分数
      const y = 1030 + i * 90, w = 560 * v * eout((t - 26.2 - i * .3) / 1);
      text(lab, 120, y, { font: SANS, weight: 700, size: 28, color: col, alpha: ba });
      ctx.save(); ctx.globalAlpha = ba; ctx.shadowColor = col; ctx.shadowBlur = 14; rr(260, y - 20, Math.max(1, w), 40, 10, `rgba(${rgb},.8)`); ctx.restore();
    });
    text('多年后的 SAT 分数', 960, 980, { font: SANS, size: 26, align: 'right', color: DIM, alpha: ba });
    stamp('1968–1974', sstep(17.6, 18.2, t), 'Mischel · Stanford');
  },
});

// ---------------------------------------------------------------- 30–38 名声：“自控力决定人生”
const HEAD = ['自控力，决定孩子的未来', '延迟满足，成功的秘密', '等得住的孩子，更有出息'];
shot({
  t0: 30, t1: 38,
  draw(lt, d, T) {
    const t = 30 + lt;
    floor('#131a26', '#05070a');
    HEAD.forEach((s, i) => {
      const a = sstep(30.4 + i * .8, 30.8 + i * .8, t), y = 680 + i * 170, rot = (i - 1) * .03;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(540, y); ctx.rotate(rot);
      ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; rr(-400, -60, 800, 120, 14, '#e8dcc0'); ctx.shadowBlur = 0;
      text(s, 0, 2, { size: 42, weight: 900, align: 'center', color: '#3b2f2a' }); ctx.restore();
    });
  },
});
// ---------------------------------------------------------------- 38–52 复现：关联弱得多，几乎消失
shot({
  t0: 38, t1: 52,
  draw(lt, d, T) {
    const t = 38 + lt;
    floor('#131a26', '#05070a');
    heading('↓', '重做了一遍', sstep(38.2, 38.8, t));
    bars([['原研究\n的关联', .8, CREAM, '236,230,218', 38.6], ['2018\n复现', .32, ORANGE, O_RGB, 42.8], ['考虑家庭\n背景后', .08, TEAL, T_RGB, 47.2]], t, 220, 0, 320);
    text('示意图', 960, 1270, { font: SANS, size: 22, align: 'right', color: 'rgba(138,147,163,.6)', alpha: sstep(39, 39.5, t) });
    stamp('2018', sstep(38.3, 38.9, t), 'Watts, Duncan & Quan · n ≈ 900');
  },
});
// ---------------------------------------------------------------- 52–64 信任：大人说话算数吗
shot({
  t0: 52, t1: 64,
  draw(lt, d, T) {
    const t = 52 + lt;
    floor('#131a26', '#05070a');
    heading('?', '大人说话，算数吗', sstep(52.2, 52.8, t));
    [[300, '说话算数的大人', TEAL, T_RGB, 12], [780, '说话不算数的大人', RED, R_RGB, 3]].forEach(([x, lab, col, rgb, mins], i) => {
      const a = sstep(52.6 + i * .5, 53 + i * .5, t);
      text(lab, x, 620, { font: SANS, weight: 700, size: 30, align: 'center', color: col, alpha: a });
      text(i ? '✕ 答应的蜡笔没来' : '✓ 答应的蜡笔来了', x, 670, { font: SANS, size: 26, align: 'center', color: DIM, alpha: sstep(53.6 + i * .6, 54 + i * .6, t) });
      plate(x, 860, 80, a); marshmallow(x, 860, 36, a * (t > 57 + (i ? .4 : 99) ? 0 : 1));
      pool(x, 990, 110, a * .6, rgb); human(x, 990, 28, { ring: col, alpha: a, dir: -PI / 2, lookY: -1 });
      const w = clamp((t - 56.8) / 3);
      timer(x, 1140, Math.min(mins, w * 12) * 60, col, sstep(56.8, 57.2, t), 64);
      text('平均等了', x, 1210, { font: SANS, size: 26, align: 'center', color: DIM, alpha: sstep(56.8, 57.2, t) });
    });
    stamp('2013', sstep(52.3, 52.9, t), 'Kidd, Palmeri & Aslin');
  },
});
// ---------------------------------------------------------------- 64–74 意义：等不等，也是对世界的判断
shot({
  t0: 64, t1: 74,
  draw(lt, d, T) {
    const t = 64 + lt;
    floor('#131a26', '#05070a');
    const a1 = sstep(64.4, 65, t), a2 = sstep(68.8, 69.4, t);
    text('等不等，', W / 2, 640, { size: 60, weight: 700, align: 'center', alpha: a1 });
    text('不只是自控力，', W / 2, 740, { size: 60, weight: 700, align: 'center', alpha: a1 });
    text('也是对这个世界的判断。', W / 2, 860, { size: 64, weight: 900, align: 'center', color: TEAL, alpha: a2, glow: `rgba(${T_RGB},.45)`, blur: 22 });
    plate(540, 1100, 90, a1); marshmallow(540, 1100, 40, a1);
  },
});
// ---------------------------------------------------------------- 74–81 结尾
shot({
  t0: 74, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('你不是没有自控力，', W / 2, 560, { size: 54, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('也许只是，', W / 2, 660, { size: 54, weight: 700, align: 'center', alpha: sstep(.6, 1.2, lt) });
    text('还没遇到值得等的事。', W / 2, 770, { size: 66, weight: 900, align: 'center', color: ORANGE, alpha: sstep(1.1, 1.8, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    plate(540, 1040, 110, .9); marshmallow(510, 1040, 40); marshmallow(575, 1030, 40, sstep(2.2, 2.8, lt));
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '你一定听过「棉花糖实验」。'], [5.1, 10.2, '但它可能，被误解了很多年。'],
  [10.8, 16.8, '被误解的心理学，第二期。'],
  [17.5, 21.6, '上世纪六七十年代，斯坦福的 Mischel 给几百个孩子一颗棉花糖：'],
  [21.9, 25.8, '现在吃，只有一颗；等一会儿，就有两颗。'],
  [26.1, 29.8, '多年后追踪发现：当年等得久的孩子，SAT 分数更高。'],
  [30.3, 34.2, '于是，它成了「自控力决定人生」的铁证，'],
  [34.5, 37.8, '被写进了无数本育儿书。'],
  [38.3, 42.4, '2018 年，研究者用 900 多个、背景更多样的孩子重做了一遍：'],
  [42.7, 46.8, '等待时间和日后成绩的关联，弱得多；'],
  [47.1, 51.6, '再把家庭背景考虑进去，这点关联，几乎消失了。'],
  [52.3, 56.4, '还有一个实验：先让一组孩子经历「大人说话不算数」。'],
  [56.7, 63.6, '信得过大人的孩子，平均等 12 分钟；被骗过的孩子，只等了 3 分钟。'],
  [64.3, 68.4, '在承诺常常落空的环境里，'],
  [68.7, 73.6, '先把眼前的吃掉，反而是一种理性的选择。'],
  [74.4, 79.4, '评论区：你小时候，会等那第二颗棉花糖吗？'],
];
