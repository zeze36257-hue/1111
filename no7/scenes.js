
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
const GRAY = 'rgba(150,158,175,.55)';
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
// 缠在头顶的念头：一圈圈乱绕的线；calm 越大越整齐
function thoughts(x, y, t, a, calm = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineWidth = 2;
  for (let k = 0; k < 7; k++) {
    const r0 = 60 + k * 12, ph = k * 1.7;
    ctx.strokeStyle = k % 2 ? `rgba(${O_RGB},.5)` : 'rgba(236,230,218,.35)'; ctx.beginPath();
    for (let u = 0; u <= TAU + .01; u += .05) {
      const wob = (1 - calm) * (Math.sin(u * 3 + t * (1 + k * .2) + ph) * 22 + Math.sin(u * 5 - t * .7 + k) * 10);
      const r = lerp(r0 + wob, 90, calm), xx = x + Math.cos(u + t * .3 * (k % 2 ? 1 : -1)) * r, yy = y + Math.sin(u) * r * .55;
      u === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}
// 清醒的 16 小时：一格一格，灰的是“走神”
const DAYBAR = (() => { const r = mulberry(47), out = []; for (let i = 0; i < 32; i++) out.push(r() < .47); return out; })();
function dayBar(y, p, a) {
  ctx.save(); ctx.globalAlpha *= a;
  text('07:00', 100, y - 50, { font: SANS, size: 26, color: DIM }); text('23:00', 980, y - 50, { font: SANS, size: 26, color: DIM, align: 'right' });
  DAYBAR.forEach((wander, i) => {
    const x = 100 + i * 27.5, on = i / 32 < p;
    rr(x, y, 23, 60, 5, !on ? 'rgba(255,255,255,.06)' : wander ? GRAY : ORANGE);
  });
  ctx.restore();
}

// ---------------------------------------------------------------- 0–10.5 钩子（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('你醒着的时间里，', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 4 });
    text('将近一半，你不在这儿。', W / 2, 520, { size: 66, weight: 900, align: 'center', color: ORANGE, ls: 4, glow: `rgba(${O_RGB},.45)`, blur: 26 });
    dayBar(700, .25 + .75 * eio((lt - .3) / 6), 1);
    rr(100, 820, 30, 30, 6, ORANGE); text('在这儿', 145, 836, { font: SANS, size: 28, color: CREAM });
    rr(300, 820, 30, 30, 6, GRAY); text('走神', 345, 836, { font: SANS, size: 28, color: CREAM });
    pool(540, 1080, 150, .7); human(540, 1080, 32, { ring: ORANGE, dir: -PI / 2 });
    thoughts(540, 1000, T, sstep(1, 2, lt));
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('精神内耗', W / 2, 640, { size: 128, weight: 900, align: 'center', ls: 18, alpha: sstep(1, 2.2, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('一半的时间，你不在这儿', W / 2, 770, { size: 40, weight: 500, align: 'center', ls: 10, color: '#a7b0bf', alpha: sstep(2.2, 3.3, lt) });
    const fa = sstep(1.6, 2.6, lt);
    pool(540, 1100, 150, fa * .7); human(540, 1100, 32, { ring: ORANGE, alpha: fa, dir: -PI / 2 });
    thoughts(540, 1010, T, fa);
    stamp('2022', sstep(3.4, 4, lt), '《咬文嚼字》年度十大流行语');
  },
});

// ---------------------------------------------------------------- 17.25–31 走神：手机随机问 2,250 个人
const QS = [['你现在在做什么？', 18.2], ['你在想别的事吗？', 19.4], ['你开心吗？', 20.6]];
const SAMPLES = (() => { const r = mulberry(2250), out = []; for (let i = 0; i < 120; i++) out.push({ w: r() < .47, d: r() }); return out; })();
shot({
  t0: DROP, t1: 31, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#131a26', '#05070a');
    const qa = 1 - sstep(25.9, 26.4, t);
    if (qa > 0) {
      ctx.save(); ctx.globalAlpha = qa;
      phoneFrame(540, 880, 460, 700, 1);
      QS.forEach(([s, t0], i) => {
        const a = sstep(t0, t0 + .3, t), y = 680 + i * 150;
        ctx.save(); ctx.globalAlpha *= a; rr(350, y - 44, 380, 88, 22, 'rgba(46,54,70,.96)'); ctx.restore();
        text(s, 540, y, { font: SANS, size: 32, align: 'center', color: CREAM, alpha: a });
      });
      ctx.restore();
    }
    const da = sstep(26.4, 26.9, t);
    if (da > 0) {                                                      // 120 个随机时刻：灰的是走神
      SAMPLES.forEach((s, i) => {
        const x = 150 + (i % 12) * 71, y = 640 + Math.floor(i / 12) * 52, c = sstep(26.6 + s.d * 1.2, 26.9 + s.d * 1.2, t);
        ctx.fillStyle = c ? (s.w ? GRAY : ORANGE) : 'rgba(255,255,255,.08)'; ctx.globalAlpha = da;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
      });
      text('将近一半', W - 96, 1210, { weight: 900, size: 64, align: 'right', color: CREAM, alpha: sstep(28.2, 28.7, t) });
      text('的时刻在走神', W - 96, 1270, { font: SANS, size: 28, align: 'right', color: DIM, alpha: sstep(28.2, 28.7, t) });
      text('走神时，更不开心', 96, 1240, { weight: 700, size: 40, color: ORANGE, alpha: sstep(29.2, 29.7, t) });
    }
    stamp('2010', sstep(17.6, 18.2, t), 'Killingsworth & Gilbert · Harvard');
  },
});

// ---------------------------------------------------------------- 31–44 电击实验：宁愿电自己，也不想和自己的想法独处
shot({
  t0: 31, t1: 44,
  draw(lt, d, T) {
    const t = 31 + lt;
    floor('#141820', '#050608');
    rr(220, 600, 640, 560, 20, 'rgba(255,255,255,.03)', 'rgba(236,230,218,.25)', 3);        // 一个空房间
    const left = 15 * 60 * (1 - clamp((t - 31.6) / 11)), zap = [36.4, 38.2, 39.4].some(z => t > z && t < z + .25);
    text(`${pad2(left / 60)}:${pad2(left % 60)}`, 540, 560, { weight: 700, size: 44, align: 'center', color: CREAM });
    rr(470, 920, 140, 80, 10, '#3a2c22');
    ctx.save(); ctx.shadowColor = '#ff4d4d'; ctx.shadowBlur = zap ? 40 : 14; ctx.fillStyle = '#e0514f'; ctx.beginPath(); ctx.arc(540, 960, 18, 0, TAU); ctx.fill(); ctx.restore();
    text('电击按钮', 540, 1040, { font: SANS, size: 26, align: 'center', color: DIM, alpha: sstep(35.6, 36, t) });
    pool(540, 830, 130, zap ? 1.4 : .6, zap ? '180,200,255' : '255,222,170');
    human(540, 830, 32, { ring: ORANGE, dir: PI / 2 });
    thoughts(540, 760, T, .7 * (1 - sstep(39.8, 40.3, t)));
    if (zap) for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + t * 20; ctx.strokeStyle = 'rgba(190,210,255,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a) * 50, 830 + Math.sin(a) * 50); ctx.lineTo(540 + Math.cos(a + .2) * 80, 830 + Math.sin(a + .2) * 80); ctx.lineTo(540 + Math.cos(a - .1) * 100, 830 + Math.sin(a - .1) * 100); ctx.stroke(); }
    const sa = sstep(40.1, 40.6, t);
    if (sa > 0) {
      ctx.save(); ctx.globalAlpha = sa; rr(100, 600, 880, 560, 20, 'rgba(10,12,16,.88)'); ctx.restore();
      [['男生', .67, ORANGE], ['女生', .25, TEAL]].forEach(([lab, v, col], i) => {
        const y = 760 + i * 200, w = 700 * v * eout((t - 40.3 - i * .2) / 1);
        text(lab, 140, y, { font: SANS, size: 34, color: CREAM, alpha: sa });
        ctx.save(); ctx.globalAlpha = sa; ctx.shadowColor = col; ctx.shadowBlur = 16; rr(240, y - 26, Math.max(1, w), 52, 12, col); ctx.restore();
        text(`${Math.round(v * 100 * clamp((t - 40.3 - i * .2) / 1))}%`, 260 + w, y + 2, { weight: 900, size: 44, color: col, alpha: sa });
      });
      text('选择了电自己', 540, 1100, { font: SANS, size: 30, align: 'center', color: DIM, alpha: sa });
    }
    text('也有学者对这个解读提出质疑', W - 96, 1210, { font: SANS, size: 24, align: 'right', color: DIM, alpha: sstep(41, 41.5, t) });
    stamp('2014', sstep(31.3, 31.9, t), 'Wilson et al. · Science');
  },
});

// ---------------------------------------------------------------- 44–58 反刍：转圈 vs 往前走
const LOOP = ['为什么是我？', '早知道就……', 'TA 是不是讨厌我？', '我是不是很差？'];
shot({
  t0: 44, t1: 58,
  draw(lt, d, T) {
    const t = 44 + lt;
    floor('#131a26', '#05070a');
    heading('◎', '反刍', sstep(44.2, 44.8, t));
    const cx = 330, cy = 880, R = 190, la = sstep(44.4, 45, t);       // 左边：一个圈，绕了又绕
    ctx.save(); ctx.globalAlpha = la; ctx.strokeStyle = ORANGE; ctx.lineWidth = 4; ctx.shadowColor = ORANGE; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.restore();
    const ang = t * 1.6;
    pool(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 80, la * .8);
    human(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 22, { ring: ORANGE, alpha: la, dir: ang + PI / 2 });
    LOOP.forEach((s, i) => {
      const a = sstep(45 + i * .7, 45.4 + i * .7, t) * (.55 + .45 * Math.sin(t * 2 + i));
      text(s, cx, cy - 70 + i * 48, { size: 28, weight: 500, align: 'center', color: CREAM, alpha: a * la });
    });
    text(`第 ${Math.floor(Math.max(0, t - 44.4) * 1.6 / TAU) + 1} 圈`, cx, cy + R + 60, { font: SANS, size: 28, align: 'center', color: ORANGE, alpha: la });
    const ra = sstep(53.4, 54, t);                                     // 右边：往前走了一步
    ctx.save(); ctx.globalAlpha = ra; ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.moveTo(760, 1180); ctx.lineTo(760, 620); ctx.stroke(); ctx.restore();
    const sy = lerp(1120, 760, eio((t - 54) / 3));
    human(760, sy, 22, { ring: TEAL, alpha: ra, dir: -PI / 2 });
    text('下一步，做什么？', 760, 580, { size: 32, weight: 700, align: 'center', color: TEAL, alpha: ra });
    stamp('Nolen-Hoeksema', sstep(48.6, 49.2, t), 'Rumination · 反刍思维');
  },
});

// ---------------------------------------------------------------- 58–72 办法：用第三人称跟自己说话
shot({
  t0: 58, t1: 72,
  draw(lt, d, T) {
    const t = 58 + lt;
    floor('#131a26', '#05070a');
    heading('→', '换个人称', sstep(58.2, 58.8, t));
    const fa = sstep(58.6, 59.2, t), sw = sstep(62.6, 63.4, t);
    ctx.save(); ctx.globalAlpha = fa * (1 - .65 * sw);
    rr(100, 600, 880, 200, 26, 'rgba(255,107,107,.08)', 'rgba(255,107,107,.55)', 2);
    text('「我」', 140, 650, { font: SANS, weight: 700, size: 30, color: '#ff8a8a' });
    text('我好焦虑，我肯定会搞砸。', 140, 730, { size: 44, weight: 700, color: CREAM });
    ctx.restore();
    if (sw > 0) {
      ctx.save(); ctx.globalAlpha = sw;
      ctx.shadowColor = `rgba(${T_RGB},.5)`; ctx.shadowBlur = 30; rr(100, 860, 880, 280, 26, 'rgba(79,214,196,.08)', 'rgba(79,214,196,.7)', 2); ctx.shadowBlur = 0;
      text('「你的名字」', 140, 910, { font: SANS, weight: 700, size: 30, color: TEAL });
      text('＿＿，你现在很紧张，', 140, 990, { size: 44, weight: 700, color: CREAM });
      text('这很正常。你准备过了。', 140, 1070, { size: 44, weight: 700, color: CREAM });
      ctx.restore();
    }
    stamp('2014', sstep(62.7, 63.3, t), 'Kross et al. · JPSP');
  },
});
// ---------------------------------------------------------------- 72–81 结尾
shot({
  t0: 72, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('此刻，', W / 2, 430, { size: 56, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('你的心，在这儿吗？', W / 2, 520, { size: 70, weight: 900, align: 'center', color: ORANGE, alpha: sstep(.5, 1.2, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    const calm = eio((lt - .8) / 4);
    pool(540, 1040, 160, .8); human(540, 1040, 32, { ring: ORANGE, dir: -PI / 2 });
    thoughts(540, 960, T, .9, calm);
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '躺着一动不动，脑子却一刻不停？'], [5.1, 10.2, '这一期，聊聊「精神内耗」。'],
  [10.8, 16.8, '2022 年，它成了年度十大流行语之一。'],
  [17.5, 21.6, '哈佛的两位心理学家，用手机随机提醒 2,250 个人：'],
  [21.9, 26.2, '你在做什么？在想别的事吗？开心吗？'],
  [26.5, 30.8, '结果：人有将近一半的时间在走神，而走神的时候，更不开心。'],
  [31.3, 35.4, '2014 年的一个实验：让人独自坐 15 分钟，只能想事情。'],
  [35.7, 39.8, '桌上有个按钮，按下去会电自己一下。'],
  [40.1, 43.8, '67% 的男性、25% 的女性，按了。'],
  [44.3, 48.4, '内耗，多半是「反刍」：一遍遍嚼同一个问题。'],
  [48.7, 53.2, '心理学家 Nolen-Hoeksema 发现：越反复问「为什么」，坏情绪停留得越久。'],
  [53.5, 57.6, '想了很多，却一步都没往前走。'],
  [58.3, 62.4, '一个办法：用第三人称，和自己说话。'],
  [62.7, 67.4, 'Kross 发现：用名字开导自己，压力下表现更好，也没那么难受。'],
  [67.7, 71.6, '像安慰一个朋友那样，安慰你自己。'],
  [72.4, 78.8, '评论区说说：你最常在什么时候内耗？'],
];
