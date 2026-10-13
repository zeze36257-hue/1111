// ======================================================================== No.20 完美主义：够好，就已经很好
// 第三季·主义 ⑦。开头是一道选择题：30 年来，三种完美主义里哪一种涨得最多？（Curran & Hill, 2019, Psychological Bulletin）
// 音乐：原创配乐（music.py，G 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。开头是一只“音乐盒”：精准、反复、一模一样。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 代价（每拍一个鼓点） · 53.33 最好的选择（紧张） · 64.0 裂痕（只剩钢琴：金继） · 80.0 高潮 · 96.0 G 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), COST = BT(56), MAXI = BT(80), CRACK = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['完美测试', 0, LIFT], ['三种完美', LIFT, COST], ['代价', COST, MAXI], ['最好的选择', MAXI, CRACK], ['裂痕', CRACK, CLIMAX], ['光照进来', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.20';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '30 年来，年轻人的完美主义越来越严重。'],
  [4.1, 7.6, '下面三种，你觉得哪一种涨得最多？先选一个。'],
  [8.2, 10.4, '答案是 B：觉得别人要求自己必须完美。'],
  [10.8, 13.3, '它涨了 33%，是另外两种的两到三倍。'],
  [13.6, 15.7, '这份压力，好像不全是从我们自己身上来的。'],
  [16.3, 19.6, '心理学家把完美主义分成三种：'],
  [19.9, 23.7, '对自己苛刻；对别人苛刻；还有，觉得别人对自己苛刻。'],
  [24.0, 27.4, '第三种最伤人：你觉得只要不完美，就会被嫌弃。'],
  [27.7, 31.3, '研究汇总了 4 万多名英美加大学生，1989 到 2016 年的数据。'],
  [31.6, 35.3, '三种完美主义，全都在上升。'],
  [37.6, 40.6, '可是，完美真的让人做得更好吗？'],
  [40.9, 44.6, '一项职场研究的汇总分析发现：完美主义者更投入，工作时间更长，'],
  [44.9, 48.6, '可工作表现，并没有更好；倦怠反而更多。'],
  [48.9, 52.9, '很多时候，因为怕做不好，干脆迟迟不开始。'],
  [53.6, 57.6, '还有一种完美，藏在选择里：什么都要挑「最好的」。'],
  [57.9, 63.4, '研究发现，凡事都要挑最好的人，往往更后悔，也更不快乐。'],
  [64.3, 67.6, '日本有一种修补碗的手艺，叫「金继」。'],
  [67.9, 71.9, '碗碎了，不把裂缝藏起来，而是用金粉，把它描出来。'],
  [72.2, 75.9, '修好的碗，带着它的伤，反而独一无二。'],
  [76.3, 79.6, '伏尔泰也写过：'],
  [84.9, 88.6, '你不需要完美，才配被喜欢。'],
  [88.9, 92.6, '够好，就已经很好。'],
  [98.4, 103.0, '评论区：你最近一次「放过自己」，是在什么时候？'],
];
const BIGLINES = [
  [80.2, 92.6, '「最好，是好的敌人。」—— 伏尔泰'],
  [93.4, 103.0, '就像一首歌里唱的：「万物皆有裂痕，那是光照进来的地方。」—— 莱昂纳德·科恩《Anthem》'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .1], [COST - .5, .1], [COST, .06], [CRACK, .06],
  [CRACK + 1, .12], [CLIMAX - .2, .12], [CLIMAX + .4, .8], [TOTAL, .8]]);
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


// ======================================================================== ① 完美测试（0–16）
const OPTS = [['A', '对自己要求完美', '自我导向', 10, '200,206,216'], ['B', '觉得别人要求自己完美', '社会期许', 33, O_RGB], ['C', '要求别人必须完美', '他人导向', 16, '200,206,216']];
function sceneQuiz(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 940); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -940); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('30 年来，哪一种完美主义', 540, 492, { ...big, size: 50, weight: 700 }, 1, 1 - qOut);
  typeText('涨得最多？', 540, 600, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  const rev = E.out(prog(t, Q.REVEAL, Q.REVEAL + .35)), times = sstep(Q.TIMES, Q.TIMES + .5, t);
  OPTS.forEach(([k, lab, sub, pct, rgb], i) => {
    const y = 770 + i * 170, hot = k === 'B' ? rev : 0, dim = k === 'B' ? 0 : .45 * times;
    ctx.save(); ctx.globalAlpha *= 1 - dim; ctx.translate(540, y); ctx.scale(1 + .02 * beatK + .04 * hot * (1 - prog(t, Q.REVEAL + .4, Q.REVEAL + 1)), 1 + .02 * beatK);
    if (hot > 0) { ctx.shadowColor = `rgba(${O_RGB},${.8 * hot})`; ctx.shadowBlur = 40 * hot; }
    ctx.fillStyle = hot > 0 ? `rgba(60,38,16,${.5 + .2 * hot})` : 'rgba(22,24,31,.86)'; ctx.beginPath(); ctx.roundRect(-440, -66, 880, 132, 24); ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = hot > 0 ? `rgba(${O_RGB},${.3 + .65 * hot})` : 'rgba(255,255,255,.15)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = hot > .5 ? ORANGE : 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(-380, -18, 24, 0, TAU); ctx.fill();
    text(k, -380, -17, { font: LAT, size: 32, weight: 600, align: 'center', color: hot > .5 ? '#1a1208' : CREAM });
    text(lab, -330, -24, { font: SANS, size: 36, weight: 700, color: hot > 0 ? '#ffd7a8' : CREAM });
    text(sub, -330, 20, { font: SANS, size: 24, weight: 500, color: '#8a93a3' });
    const bk = E.outExpo(prog(t, Q.REVEAL + .2 + i * .15, Q.REVEAL + 1.2 + i * .15));            // 揭晓：每一种涨了多少
    if (bk > 0) {
      const w = 380 * pct / 33 * bk;
      ctx.fillStyle = `rgba(${rgb},.9)`; ctx.shadowColor = `rgba(${rgb},.7)`; ctx.shadowBlur = k === 'B' ? 20 : 0;
      ctx.beginPath(); ctx.roundRect(-330, 38, w, 14, 7); ctx.fill(); ctx.shadowBlur = 0;
      text(`+${Math.round(pct * bk)}%`, -330 + w + 16, 45, { font: SERIF, size: 30, weight: 900, color: k === 'B' ? ORANGE : CREAM });
    }
    ctx.restore();
  });
  const xk = times * (1 - sstep(14.8, 15.4, t));
  if (xk > 0) text('2–3 倍', 860, 940, { font: SERIF, size: 54, weight: 900, align: 'center', color: ORANGE, alpha: xk, glow: `rgba(${O_RGB},.6)`, blur: 20 });
  ['3', '2', '1'].forEach((s, i) => {
    const t0 = [Q.c3, Q.c2, Q.c1][i], v = prog(t, t0, t0 + 1.28); if (v <= 0 || v >= 1) return;
    const k = 1.5 - .5 * E.outExpo(v * 2.5), al = 1 - sstep(.62, 1, v);
    const bg = ctx.createRadialGradient(540, 940, 0, 540, 940, 230); bg.addColorStop(0, `rgba(6,7,11,${.88 * al})`); bg.addColorStop(1, 'rgba(6,7,11,0)'); ctx.fillStyle = bg; ctx.fillRect(300, 700, 480, 480);
    ctx.save(); ctx.translate(540, 940); ctx.scale(k, k);
    text(s, 0, 8, { font: SERIF, size: 210, weight: 900, align: 'center', color: CREAM, alpha: al, glow: 'rgba(255,240,220,.4)', blur: 30 });
    ctx.restore();
  });
  ctx.restore();
}

// ======================================================================== ② 标题
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.7, 20.4, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('完美主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('PERFECTIONISM', 540, 1046, { size: 42, weight: 600, font: LAT, ls: 20, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第三季 · 主义 ⑦', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}

// ======================================================================== ③ 三种完美：箭头指向谁；三条都在上升的线
function arrow(x1, y1, x2, y2, col, a, lw = 2.5) {
  if (a <= 0) return;
  const an = Math.atan2(y2 - y1, x2 - x1);
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(an) * 10, y2 - Math.sin(an) * 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - Math.cos(an - .45) * 18, y2 - Math.sin(an - .45) * 18); ctx.lineTo(x2 - Math.cos(an + .45) * 18, y2 - Math.sin(an + .45) * 18); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function sceneThree(t) {
  if (t < 19.9 || t > COST + .3) return;
  const A1 = sstep(19.9, 20.4, t) * (1 - sstep(27.3, 27.9, t));
  if (A1 > 0) {
    const cols = [[190, '对自己', 19.9], [520, '对别人', 21.1], [830, '别人对你', 22.3]];
    cols.forEach(([x, lab, t0], i) => {
      const k = sstep(t0, t0 + .5, t), third = i === 2, em = third ? sstep(24.0, 24.6, t) : 0, dim = third ? 0 : .5 * sstep(24.0, 24.6, t);
      const a = A1 * k * (1 - dim), y = 900;
      you(x, y, t, a, 10 + 4 * em);
      if (i === 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = CREAM; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y - 52, 34, PI * .8, PI * 2.25); ctx.stroke(); ctx.restore(); arrow(x + 30, y - 30, x + 14, y - 14, CREAM, a); }
      if (i === 1) for (const an of [-2.4, -1.57, -.74, .2, 2.9]) arrow(x + Math.cos(an) * 26, y + Math.sin(an) * 26, x + Math.cos(an) * 110, y + Math.sin(an) * 110, CREAM, a * .9);
      if (i === 2) {
        const n = 6 + Math.round(10 * em);
        for (let j = 0; j < n; j++) {
          const an = j / n * TAU + .3, R = 120 + 20 * em, px = x + Math.cos(an) * R * (1 + .3 * em), py = y + Math.sin(an) * R * (1 + .5 * em);
          glow(px, py, 5, '200,206,216', a, 3);
          arrow(px, py, x + Math.cos(an) * 26, y + Math.sin(an) * 26, em > .5 ? '#e5484d' : CREAM, a * .85, 2);
        }
      }
      text(lab, x, 1130, { size: 40, weight: 900, align: 'center', color: third && em > .5 ? ORANGE : CREAM, alpha: a });
    });
  }
  // 1989 → 2016：三条线都在上升（示意）
  const A2 = sstep(27.7, 28.3, t) * (1 - sstep(COST - .8, COST - .1, t));
  if (A2 > 0) {
    const x0 = 170, x1 = 920, y0 = 1180, k = E.io(prog(t, 28.2, 31.8));
    ctx.save(); ctx.globalAlpha = A2; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, 640); ctx.lineTo(x0, y0); ctx.lineTo(x1 + 20, y0); ctx.stroke(); ctx.restore();
    text('1989', x0, y0 + 40, { font: SERIF, size: 28, weight: 700, align: 'center', color: DIM, alpha: A2 });
    text('2016', x1, y0 + 40, { font: SERIF, size: 28, weight: 700, align: 'center', color: DIM, alpha: A2 });
    [[33, ORANGE, '觉得别人要求你'], [16, '#c3cad6', '要求别人'], [10, '#8a93a3', '要求自己']].forEach(([g, col, lab], i) => {
      const ys = 1100, ye = ys - g * 13;
      ctx.save(); ctx.globalAlpha = A2; ctx.strokeStyle = col; ctx.lineWidth = i ? 3 : 5; ctx.lineCap = 'round'; if (!i) { ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16; }
      ctx.beginPath(); for (let u = 0; u <= k + 1e-6; u += .02) { const x = lerp(x0, x1, u), y = lerp(ys, ye, u) - Math.sin(u * 9 + i) * 5; u ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      if (k > .9) text(`${lab}  +${g}%`, x1 - 10, ye + (i === 2 ? 30 : -26), { font: SANS, size: 26, weight: 700, align: 'right', color: col, alpha: A2 * sstep(.9, 1, k) });
    });
    text('示意图', x1, 600, { font: SANS, size: 22, weight: 500, align: 'right', color: 'rgba(138,147,163,.6)', alpha: A2 });
  }
}

// ======================================================================== ④ 代价：一份永远在重写的作业
function sceneCost(t) {
  if (t < COST - .4 || t > MAXI + .3) return;
  const A = sstep(COST - .2, COST + .4, t) * (1 - sstep(MAXI - .5, MAXI + .1, t));
  if (A <= 0) return;
  const cx = 540, cy = 760;
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(24,27,36,.95)'; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.roundRect(cx - 380, cy - 150, 760, 300, 26); ctx.fill(); ctx.stroke(); ctx.restore();
  text('作业_最终版_改.docx', cx - 330, cy - 92, { font: SANS, size: 32, weight: 700, color: CREAM, alpha: A });
  // 进度条：写到快完成，又删回去重来；48.9 以后停在 0，光标一直闪
  const cyc = 2 * BEAT * 2, stop = t >= 48.9, ph = stop ? 0 : ((t - COST) % cyc) / cyc, round = Math.floor((Math.min(t, 48.9) - COST) / cyc) + 1;
  const fill = stop ? 0 : ph < .8 ? E.out(ph / .8) * .96 : .96 * (1 - E.in((ph - .8) / .2));
  ctx.save(); ctx.globalAlpha = A; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(cx - 330, cy - 20, 660, 26, 13); ctx.fill();
  ctx.fillStyle = TEAL; ctx.shadowColor = `rgba(${T_RGB},.7)`; ctx.shadowBlur = 14; ctx.beginPath(); ctx.roundRect(cx - 330, cy - 20, 660 * fill, 26, 13); ctx.fill(); ctx.restore();
  text(stop ? '0%' : `${Math.round(fill * 100)}%`, cx + 330, cy - 54, { font: SERIF, size: 34, weight: 900, align: 'right', color: TEAL, alpha: A });
  text(stop ? '还没开始……' : `第 ${round} 次重写`, cx - 330, cy + 60, { font: SANS, size: 28, weight: 500, color: stop ? '#e5a0a0' : '#9aa3b2', alpha: A });
  if (stop && Math.floor(t * 2) % 2 === 0) seg(cx - 120, cy + 44, cx - 120, cy + 78, CREAM, 3, A);
  // 研究结果：一项项亮出来
  [['更投入', '↑', 41.2, TEAL], ['工作时间', '↑', 42.3, TEAL], ['工作表现', '—', 45.1, CREAM], ['倦怠', '↑', 46.4, '#e5484d']].forEach(([lab, sym, t0, col], i) => {
    const k = E.outExpo(prog(t, t0, t0 + .6)); if (k <= 0) return;
    const x = 210 + i * 220, y = 1110;
    ctx.save(); ctx.globalAlpha = A * k; ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x - 95, y - 80, 190, 160, 20); ctx.fill(); ctx.stroke(); ctx.restore();
    text(sym, x, y - 20, { font: SERIF, size: 70, weight: 900, align: 'center', color: col, alpha: A * k, glow: col === CREAM ? undefined : col, blur: 14 });
    text(lab, x, y + 48, { font: SANS, size: 28, weight: 700, align: 'center', color: '#c3cad6', alpha: A * k });
  });
}

// ======================================================================== ⑤ 最好的选择：放大镜在一堆选项里来回比
function sceneMax(t) {
  if (t < MAXI - .4 || t > CRACK + .2) return;
  const A = sstep(MAXI - .1, MAXI + .5, t) * (1 - sstep(CRACK - .8, CRACK - .1, t));
  if (A <= 0) return;
  const cols = 6, rows = 5, x0 = 190, y0 = 640, gx = 140, gy = 120;
  const lx = 540 + Math.sin(t * 1.9) * 300 + Math.sin(t * 3.1) * 60, ly = 880 + Math.sin(t * 1.3 + 1) * 190;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = x0 + i * gx, y = y0 + j * gy, d = Math.hypot(x - lx, y - ly), near = Math.exp(-d * d / (2 * 110 * 110));
    const r = mulberry(2000 + j * 10 + i), stars = 3 + Math.floor(r() * 3);
    ctx.save(); ctx.globalAlpha = A * (.4 + .6 * near); ctx.fillStyle = 'rgba(28,31,40,.95)'; ctx.strokeStyle = near > .5 ? 'rgba(242,161,74,.8)' : 'rgba(255,255,255,.14)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x - 56, y - 44, 112, 88, 14); ctx.fill(); ctx.stroke(); ctx.restore();
    text('★'.repeat(stars), x, y + 22, { font: SANS, size: 16, weight: 700, align: 'center', color: '#e8c36a', alpha: A * (.4 + .6 * near) });
    ctx.save(); ctx.globalAlpha = A * (.4 + .6 * near); ctx.fillStyle = 'rgba(200,206,216,.5)'; ctx.fillRect(x - 36, y - 26, 72, 22); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lx, ly, 70, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lx + 50, ly + 50); ctx.lineTo(lx + 110, ly + 110); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  // 快乐值：越比越低
  const mood = lerp(.8, .25, sstep(57.9, 62.5, t));
  text('后悔', 300, 1290, { font: SANS, size: 26, weight: 700, align: 'center', color: '#e5a0a0', alpha: A * sstep(58.4, 59.0, t) });
  text('快乐', 780, 1290, { font: SANS, size: 26, weight: 700, align: 'center', color: TEAL, alpha: A * sstep(58.4, 59.0, t) });
  const reg = lerp(.25, .85, sstep(57.9, 62.5, t));
  [[300, reg, '229,72,77'], [780, mood, T_RGB]].forEach(([x, v, rgb]) => {
    const a = A * sstep(58.4, 59.0, t); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(x - 120, 1240, 240, 14); ctx.fillStyle = `rgb(${rgb})`; ctx.fillRect(x - 120, 1240, 240 * v, 14); ctx.restore();
  });
}

// ======================================================================== ⑥ 裂痕：金继
let CRACKS = [];
function bowlPath(cx, cy, s) {
  ctx.moveTo(cx - 190 * s, cy - 60 * s);
  ctx.bezierCurveTo(cx - 180 * s, cy + 90 * s, cx - 90 * s, cy + 140 * s, cx - 50 * s, cy + 146 * s);
  ctx.lineTo(cx - 60 * s, cy + 176 * s); ctx.lineTo(cx + 60 * s, cy + 176 * s); ctx.lineTo(cx + 50 * s, cy + 146 * s);
  ctx.bezierCurveTo(cx + 90 * s, cy + 140 * s, cx + 180 * s, cy + 90 * s, cx + 190 * s, cy - 60 * s);
  ctx.closePath();
}
function bowl(cx, cy, s, a, t, split, gold, lightK) {
  if (a <= 0) return;
  const crack = CRACKS[0].map(([x, y]) => [cx + x * s, cy + y * s]);
  const piece = (side) => {                                                         // 沿着裂缝把碗切成左右两块
    ctx.save();
    ctx.translate(side * split * 40 * s, side * split * 10 * s); ctx.rotate(side * split * .06);
    ctx.beginPath();
    if (side < 0) { ctx.moveTo(cx - 400 * s, cy - 200 * s); crack.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(cx - 400 * s, cy + 300 * s); }
    else { ctx.moveTo(cx + 400 * s, cy - 200 * s); crack.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(cx + 400 * s, cy + 300 * s); }
    ctx.closePath(); ctx.clip();
    const g = ctx.createLinearGradient(cx - 190 * s, 0, cx + 190 * s, 0); g.addColorStop(0, '#2a3a44'); g.addColorStop(.45, '#4f6672'); g.addColorStop(1, '#1b262d');
    ctx.fillStyle = g; ctx.beginPath(); bowlPath(cx, cy, s); ctx.fill();
    ctx.fillStyle = '#121a1f'; ctx.beginPath(); ctx.ellipse(cx, cy - 60 * s, 190 * s, 34 * s, 0, 0, TAU); ctx.fill();          // 碗口
    ctx.strokeStyle = 'rgba(220,236,240,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - 60 * s, 190 * s, 34 * s, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(220,236,240,.25)'; ctx.beginPath(); bowlPath(cx, cy, s); ctx.stroke();
    ctx.restore();
  };
  ctx.save(); ctx.globalAlpha *= a; piece(-1); piece(1); ctx.restore();
  const drawCrack = (pts, w, col, blur) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; if (blur) { ctx.shadowColor = col; ctx.shadowBlur = blur; } ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); };
  if (split <= .01 && gold >= 0) {
    CRACKS.forEach((c, i) => {
      const pts = c.map(([x, y]) => [cx + x * s, cy + y * s]);
      if (gold > 0) drawCrack(pts, 3.5 * s + 1, `rgba(255,${Math.round(lerp(120, 205, gold))},${Math.round(lerp(60, 90, gold))},${gold})`, 14 * gold);
      else drawCrack(pts, 2, 'rgba(5,6,8,.9)');
    });
  }
  if (lightK > 0) {                                                                  // 光从裂缝里透出来
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    CRACKS.forEach(c => c.forEach(([x, y], i) => { if (i % 2) return; const px = cx + x * s, py = cy + y * s, gr = ctx.createLinearGradient(px, py, px + (x * .9), py - 520); gr.addColorStop(0, `rgba(255,214,150,${.22 * lightK})`); gr.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(px - 6, py); ctx.lineTo(px + 6, py); ctx.lineTo(px + x * .9 + 40, py - 520); ctx.lineTo(px + x * .9 - 40, py - 520); ctx.closePath(); ctx.fill(); }));
    ctx.restore();
  }
}
function sceneKintsugi(t) {
  if (t < CRACK - .2) return;
  const A = sstep(CRACK + .2, CRACK + 1.2, t);
  const crackOn = t >= 68.0, split = E.out(prog(t, 68.0, 68.5)) * (1 - E.io(prog(t, 69.8, 71.2)));
  const gold = sstep(71.2, 73.8, t), up = E.io(prog(t, CLIMAX - .6, CLIMAX + .8));
  const s = lerp(1.25, 1.55, up), cy = lerp(950, 1080, up);
  const shake = crackOn ? (1 - prog(t, 68.0, 68.6)) * 8 : 0;
  warmth(A * gold * (.6 + .8 * up), 540, cy, 700);
  bowl(540 + Math.sin(t * 60) * shake, cy, s, A, t, crackOn ? split : 0, crackOn ? gold : -1, sstep(FINAL, FINAL + 1.6, t));
  if (!crackOn) return;
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  text('金继 · kintsugi', 540, 1290, { font: SERIF, size: 30, weight: 700, align: 'center', color: '#e8c36a', alpha: A * sstep(72.0, 72.8, t) * (1 - sstep(CLIMAX - .6, CLIMAX, t)) });
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「最好，是好的敌人。」', 540, 600, { ...big, size: 80, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + .3, CLIMAX + 1.3), qa);
  typeText('—— 伏尔泰', 540, 700, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 1.6, CLIMAX + 2.2), qa);
  typeText('就像一首歌里唱的：', 540, 556, { ...big, size: 44, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('「万物皆有裂痕，', 540, 664, { ...big, size: 70, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 36 }, prog(t, FINAL, FINAL + .7), 1);
  typeText('那是光照进来的地方。」', 540, 760, { ...big, size: 70, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 36 }, prog(t, FINAL + .6, FINAL + 1.4), 1);
  typeText('—— 莱昂纳德·科恩《Anthem》', 540, 850, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, FINAL + 1.6, FINAL + 2.2), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneQuiz(t); sceneTitle(t); sceneThree(t); sceneCost(t); sceneMax(t); sceneKintsugi(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2) || (T > 67.9 && T < 71.4)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .18 * win(T, 71.2, CLIMAX, 1, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .14 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('2019', 'Curran & Hill · Psychological Bulletin', 8.2, 15.6, T);
  stamp('1989–2016', '41,641 students · US, Canada, UK', 27.7, 35.3, T);
  stamp('2018', 'Harari et al. · J. of Applied Psychology', 40.9, 48.6, T);
  stamp('2002', 'Schwartz et al. · JPSP', 57.9, 63.4, T);
  stamp('1772', "Voltaire · « Le mieux est l'ennemi du bien »", 76.3, 79.6, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(20);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  const rc = mulberry(201), jag = (x0, y0, x1, y1, n, amp) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [lerp(x0, x1, u) + (i && i < n ? (rc() - .5) * amp : 0), lerp(y0, y1, u)]; });
  CRACKS = [jag(10, -94, -14, 180, 9, 40), jag(-120, -40, -60, 90, 5, 26), jag(120, -30, 150, 60, 4, 20)];
}

// ======================================================================== 音效提示表（音高都在 G 小调里，最后一个和弦是 G 大调）
const NOTE = { G5: 783.99, B5: 987.77, D6: 1174.66, G6: 1567.98, Bb6: 1864.66, B6: 1975.53, D7: 2349.32, G7: 3135.96, Bb5: 932.33, A5: 880, C6: 1046.5, Eb6: 1244.51 };
const GM_SHIM = [NOTE.Bb6, NOTE.D7, NOTE.G6, NOTE.G7, NOTE.D6], GMAJ_SHIM = [NOTE.B6, NOTE.D7, NOTE.G6, NOTE.G7, NOTE.D6], GM_SWELL = [196.0, 293.66, 392.0, 466.16, 587.33];
function CUES() {
  const c = [];
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.G5, NOTE.Bb5, NOTE.D6], gain: .26 }]);
  OPTS.forEach((_, i) => c.push([Q.REVEAL + .2 + i * .15, 'bar', { f0: 196, f1: [392, 784, 523][i], dur: .8, gain: .35, pan: -.3 + .3 * i }]));
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: GM_SHIM, gain: .28 }]);
  [19.9, 21.1, 22.3].forEach((t, i) => c.push([t, 'tink', { f: [NOTE.D6, NOTE.Bb5, NOTE.G5][i], gain: .18 }]));
  c.push([24.0, 'whoosh', { dur: .7, gain: .22 }], [28.2, 'swell', { dur: 3.6, f: GM_SWELL, gain: .18 }]);
  for (let k = 0; k < 6; k++) c.push([COST + k * 2 * BEAT * 2 + 2 * BEAT * 2 * .8, 'page', { gain: .3 }]);
  [41.2, 42.3, 45.1, 46.4].forEach(t => c.push([t, 'click', { gain: .3 }]));
  c.push([MAXI, 'whoosh', { dur: .5, gain: .22 }], [57.9, 'drone', { dur: 4.5, gain: .12 }]);
  c.push([68.0, 'crack', { gain: .55 }], [69.8, 'swish', { dur: 1.3, gain: .22 }], [71.2, 'shimmer', { f: GM_SHIM, gain: .3 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: GM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: GM_SHIM, gain: .42 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: GMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.G5, NOTE.B5, NOTE.D6], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
