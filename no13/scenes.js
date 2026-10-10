
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
const GHOST = 'rgba(150,158,175,.7)';
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
function item(s, x, y, a, o = {}) {                 // 房间里的一样东西：一个小牌子
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 28px ${SANS}`; ctx.letterSpacing = '0px';
  const w = ctx.measureText(s).width + 40;
  ctx.translate(x, y); ctx.rotate(o.rot || 0);
  rr(-w / 2, -26, w, 52, 10, 'rgba(255,255,255,.06)', 'rgba(236,230,218,.3)', 1.5);
  text(s, 0, 1, { font: SANS, weight: 700, size: 28, align: 'center', color: o.col || CREAM });
  ctx.restore();
}
// 空心的光环：fill 从 0 到 1，慢慢被暖光填满
function hollow(x, y, fill, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.setLineDash(fill < .99 ? [8, 10] : []); ctx.strokeStyle = fill > .5 ? ORANGE : GHOST; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(x, y, 70, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  if (fill > 0) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, 70 * fill + 1); g.addColorStop(0, `rgba(${O_RGB},${.55 * fill})`); g.addColorStop(1, `rgba(${O_RGB},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 70, 0, TAU); ctx.fill(); }
  ctx.restore();
}
const STUFF = [['offer', 260, 700, -.08], ['新手机', 820, 690, .06], ['奖状', 230, 960, .05], ['名牌包', 850, 980, -.05], ['点赞 999+', 300, 1180, .04], ['旅行照片', 800, 1190, -.04]];

// ---------------------------------------------------------------- 0–10.5 钩子：什么都有了，为什么还是觉得空（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('什么都有了，', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 4 });
    text('为什么还是觉得空？', W / 2, 520, { size: 68, weight: 900, align: 'center', color: ORANGE, ls: 4, glow: `rgba(${O_RGB},.45)`, blur: 26 });
    STUFF.forEach(([s, x, y, rot], i) => item(s, x, y, 1, { rot }));
    human(540, 950, 32, { ring: GHOST, ringA: .7, dir: -PI / 2 });
    hollow(540, 950, 0, sstep(1, 2, lt));
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题：意义感
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('意义感', W / 2, 660, { size: 140, weight: 900, align: 'center', ls: 30, alpha: sstep(1, 2.2, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('第二季 · 最后一期', W / 2, 800, { size: 40, weight: 500, align: 'center', ls: 12, color: '#a7b0bf', alpha: sstep(2.2, 3.3, lt) });
    const fa = sstep(1.6, 2.6, lt);
    human(540, 1080, 32, { ring: GHOST, ringA: .7, alpha: fa, dir: -PI / 2 }); hollow(540, 1080, 0, fa);
  },
});

// ---------------------------------------------------------------- 17.25–36 意义感的三件事：说得通、有方向、值得
const THREE = [['说得通', '生活不是一团乱麻', 21.9, -1], ['有方向', '知道自己在往哪走', 26.1, 1], ['值得', '觉得自己是重要的', 30.7, 0]];
shot({
  t0: DROP, t1: 36, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#131a26', '#05070a');
    THREE.forEach(([s, sub, t0, k], i) => {                            // 三个圆，依次点亮
      const cx = 540 + (i === 2 ? 0 : k * 150), cy = i === 2 ? 1010 : 790, a = sstep(t0, t0 + .5, t), base = sstep(17.6, 18.2, t);
      ctx.save(); ctx.globalAlpha = base * (.35 + .65 * a); ctx.strokeStyle = a > .5 ? ORANGE : 'rgba(236,230,218,.3)'; ctx.lineWidth = 3;
      if (a > .5) { ctx.shadowColor = ORANGE; ctx.shadowBlur = 20; }
      ctx.beginPath(); ctx.arc(cx, cy, 210, 0, TAU); ctx.stroke(); ctx.restore();
      if (a > 0) pool(cx, cy, 200, a * .35, '255,200,140', false);
      const lx = i === 2 ? cx : cx + k * 70, ly = i === 2 ? cy + 70 : cy - 40;
      text(s, lx, ly, { size: 50, weight: 900, align: 'center', color: a > .5 ? ORANGE : CREAM, alpha: base * (.4 + .6 * a) });
      text(sub, lx, ly + 54, { font: SANS, size: 26, align: 'center', color: DIM, alpha: a });
    });
    const all = sstep(34, 34.6, t);
    human(540, 890, 26, { ring: all > .5 ? ORANGE : GHOST, dir: -PI / 2 });
    stamp('2016', sstep(17.6, 18.2, t), 'Martela & Steger');
  },
});

// ---------------------------------------------------------------- 36–50 意义在日常：固定的小习惯
const DAILY = ['早上那杯咖啡', '傍晚那段散步', '睡前喂一下猫', '周日给家里打电话', '每天写三行日记'];
shot({
  t0: 36, t1: 50,
  draw(lt, d, T) {
    const t = 36 + lt, cx = 540, cy = 910, R = 290;
    floor('#131a26', '#05070a');
    heading('☼', '意义，藏在日常里', sstep(36.2, 36.8, t));
    ctx.save(); ctx.globalAlpha = sstep(40.6, 41.2, t); ctx.strokeStyle = `rgba(${O_RGB},.35)`; ctx.lineWidth = 2; ctx.setLineDash([6, 10]);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.restore();
    DAILY.forEach((s, i) => {                                          // 一天一圈，每天都会经过的几个点
      const a = -PI / 2 + i / DAILY.length * TAU, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * .9, al = sstep(41 + i * .5, 41.4 + i * .5, t);
      ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = ORANGE; ctx.shadowColor = ORANGE; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill(); ctx.restore();
      item(s, x + (x > cx + 10 ? 20 : x < cx - 10 ? -20 : 0), y + (i === 0 ? -50 : 50), al);
    });
    const ang = -PI / 2 + (t - 41) * .55, mx = cx + Math.cos(ang) * R, my = cy + Math.sin(ang) * R * .9;
    if (t > 41) { pool(mx, my, 80, .7); human(mx, my, 22, { ring: ORANGE, dir: ang + PI / 2 }); }
    stamp('2019', sstep(40.7, 41.3, t), 'Heintzelman & King');
  },
});
// ---------------------------------------------------------------- 50–60 被需要：值得，常常来自别人
const PEOPLE = [['朋友', 260, 720], ['家人', 820, 720], ['同学', 220, 1110], ['那只猫', 860, 1110]];
shot({
  t0: 50, t1: 60,
  draw(lt, d, T) {
    const t = 50 + lt, cx = 540, cy = 910;
    floor('#131a26', '#05070a');
    heading('♡', '被需要，被惦记', sstep(50.2, 50.8, t));
    PEOPLE.forEach(([s, x, y], i) => {
      const a = sstep(50.6 + i * .4, 51 + i * .4, t), link = eout((t - 54.6 - i * .4) / .8);
      if (link > 0) { ctx.save(); ctx.strokeStyle = `rgba(${O_RGB},.6)`; ctx.lineWidth = 3; ctx.shadowColor = ORANGE; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(lerp(cx, x, link), lerp(cy, y, link)); ctx.stroke(); ctx.restore(); }
      pool(x, y, 100, a * (.3 + .5 * clamp(link)), '255,210,150'); human(x, y, 26, { ring: link > .9 ? ORANGE : GHOST, ringA: .8, alpha: a, dir: Math.atan2(cy - y, cx - x) });
      text(s, x, y + 70, { font: SANS, size: 26, align: 'center', color: DIM, alpha: a });
    });
    const f = clamp((t - 55) / 3.5);
    human(cx, cy, 30, { ring: f > .5 ? ORANGE : GHOST, dir: -PI / 2 }); hollow(cx, cy, f, 1);
  },
});
// ---------------------------------------------------------------- 60–72 弗兰克尔
shot({
  t0: 60, t1: 72,
  draw(lt, d, T) {
    const t = 60 + lt;
    floor('#16120e', '#050403'); bokeh(T, .6);
    text('“', 120, 620, { size: 220, weight: 900, color: ORANGE, alpha: .5 * sstep(60.4, 61, t) });
    ['人的一切都可以被夺走，', '唯独一样不能：', '在任何境遇里，', '选择自己态度的自由。'].forEach((s, i) => {
      const p = eio((t - 64.6 - i * 1.2) / 1.1); if (p <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(110, 690 + i * 104, 900 * p, 110); ctx.clip();
      text(s, 130, 750 + i * 104, { size: 66, weight: 700, color: i === 3 ? ORANGE : CREAM, glow: 'rgba(255,210,150,.2)', blur: 18 }); ctx.restore();
    });
    text('—— 维克多·弗兰克尔《活出生命的意义》', W - 110, 1200, { size: 32, weight: 500, align: 'right', color: DIM, alpha: sstep(69.6, 70.2, t) });
  },
});
// ---------------------------------------------------------------- 72–81 结尾：意义不是找到的，是活出来的
shot({
  t0: 72, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('意义不是找到的，', W / 2, 520, { size: 58, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('是一点一点，活出来的。', W / 2, 630, { size: 66, weight: 900, align: 'center', color: ORANGE, alpha: sstep(.6, 1.3, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    const f = clamp((lt - .6) / 2.5);
    pool(540, 900, 180, .9 * f); human(540, 900, 32, { ring: ORANGE, dir: -PI / 2 }); hollow(540, 900, Math.max(.6, f), 1);
    text('如果你最近一直很难受，请告诉一个你信任的人，', W / 2, 1140, { font: SANS, size: 28, align: 'center', color: '#c9d0de', alpha: sstep(2.4, 3, lt) });
    text('或者寻求专业的帮助。你值得被好好照顾。', W / 2, 1186, { font: SANS, size: 28, align: 'center', color: '#c9d0de', alpha: sstep(2.4, 3, lt) });
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '考上了，拿到了，买到了——心里却还是空空的？'], [5.1, 10.2, '这一期，聊聊「意义感」。'],
  [10.8, 16.8, '2016 年，一位北大的心理咨询老师，把这种感觉叫做「空心病」。'],
  [17.5, 21.6, '心理学家 Martela 和 Steger，把意义感拆成了三件事：'],
  [21.9, 25.8, '一，说得通：生活不是一团乱麻。'],
  [26.1, 30.4, '二，有方向：知道自己在往哪走。'],
  [30.7, 35.6, '三，值得：觉得自己的存在，是重要的。'],
  [36.3, 40.4, '好消息是：意义感，不一定来自宏大的目标。'],
  [40.7, 45.2, '研究发现：生活里有固定小习惯的人，更容易觉得生活有意义。'],
  [45.5, 49.6, '早上那杯咖啡、傍晚那段散步，都算。'],
  [50.3, 54.4, '「值得」，也常常来自别人：被需要，被惦记。'],
  [54.7, 59.6, '给朋友回一条消息，给家里打个电话，都是在给生活增加分量。'],
  [60.3, 64.4, '心理学家弗兰克尔，从纳粹集中营里活了下来。他写道：'],
  [72.4, 78.8, '评论区：最近哪件小事，让你觉得「值得」？'],
];
