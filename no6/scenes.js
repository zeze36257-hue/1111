
// ======================================================================== 镜头
const SHOTS = [];
function shot(o) { SHOTS.push(o); return o; }
const RED = '#ff6b6b', R_RGB = '255,107,107';
// 一个词标签（对外人 / 对家人）
function tag(s, x, y, col, rgb, a, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${o.size || 36}px ${SANS}`; ctx.letterSpacing = '0px';
  const w = ctx.measureText(s).width + 48, h = (o.size || 36) + 34, dy = (1 - eout(a)) * 16;
  rr(x - w / 2, y - h / 2 + dy, w, h, h / 2, `rgba(${rgb},.12)`, `rgba(${rgb},.6)`, 2);
  text(s, x, y + 2 + dy, { font: SANS, weight: 700, size: o.size || 36, align: 'center', color: col });
  ctx.restore();
}
const OUT_WORDS = ['谢谢', '不好意思', '辛苦了', '没关系'], HOME_WORDS = ['你烦不烦', '知道了知道了', '别管我', '说了你也不懂'];
function twoColumns(lt, T, o = {}) {
  text('对外人', 290, 640, { font: SANS, weight: 700, size: 34, align: 'center', color: TEAL });
  text('对家人', 790, 640, { font: SANS, weight: 700, size: 34, align: 'center', color: o.warm ? ORANGE : RED });
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(538, 620, 4, 560);
  OUT_WORDS.forEach((s, i) => tag(s, 290, 740 + i * 110, TEAL, T_RGB, o.out ? o.out(i) : 1));
  (o.homeWords || HOME_WORDS).forEach((s, i) => tag(s, 790, 740 + i * 110, o.warm ? ORANGE : RED, o.warm ? O_RGB : R_RGB, o.home ? o.home(i) : 1));
}

// ---------------------------------------------------------------- 0–10.5 钩子：对外客客气气，对家人一句“你烦不烦”（第一帧就是封面）
shot({
  t0: 0, t1: 10.5, fi: 0,
  draw(lt, d, T) {
    floor('#131a26', '#05070a');
    text('对外卖小哥说「辛苦了」，', W / 2, 430, { size: 56, weight: 700, align: 'center', ls: 3 });
    text('对妈妈说「你烦不烦」。', W / 2, 520, { size: 66, weight: 900, align: 'center', color: RED, ls: 4, glow: `rgba(${R_RGB},.45)`, blur: 26 });
    twoColumns(lt, T, { out: i => sstep(.4 + i * .5, .7 + i * .5, lt), home: i => sstep(2.6 + i * .6, 2.9 + i * .6, lt) });
  },
});
// ---------------------------------------------------------------- 10.5–17.25 标题：窝里横
shot({
  t0: 10.5, t1: DROP,
  draw(lt, d, T) {
    floor('#121925', '#05070a');
    seriesTag(500, sstep(.6, 1.6, lt));
    text('窝里横', W / 2, 640, { size: 140, weight: 900, align: 'center', ls: 30, alpha: sstep(1, 2.2, lt), glow: 'rgba(255,220,170,.25)', blur: 30 });
    text('为什么越亲近，越容易说狠话', W / 2, 770, { size: 40, weight: 500, align: 'center', ls: 8, color: '#a7b0bf', alpha: sstep(2.2, 3.3, lt) });
    // 一扇门：门外光环是青色、平静；进了门，变成带刺的红色
    const fa = sstep(1.6, 2.4, lt), x = lerp(240, 840, eio((lt - 2.2) / 3)), inside = x > 540;
    ctx.save(); ctx.globalAlpha = fa; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(540, 930); ctx.lineTo(540, 990); ctx.moveTo(540, 1070); ctx.lineTo(540, 1130); ctx.stroke(); ctx.restore();
    text('外面', 300, 900, { font: SANS, size: 28, align: 'center', color: DIM, alpha: fa }); text('家里', 780, 900, { font: SANS, size: 28, align: 'center', color: DIM, alpha: fa });
    pool(x, 1030, 130, fa * .7, inside ? '255,140,140' : '150,230,220');
    human(x, 1030, 30, { ring: inside ? RED : TEAL, alpha: fa, dir: 0 });
    if (inside) for (let k = 0; k < 10; k++) {
      const a = k / 10 * TAU + lt, r1 = 52, r2 = 66 + 6 * Math.sin(lt * 8 + k);
      ctx.save(); ctx.globalAlpha = fa * sstep(540, 600, x); ctx.strokeStyle = RED; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r1, 1030 + Math.sin(a) * r1); ctx.lineTo(x + Math.cos(a) * r2, 1030 + Math.sin(a) * r2); ctx.stroke(); ctx.restore();
    }
  },
});

// ---------------------------------------------------------------- 17.25–31 原因一：情绪溢出
const EVENTS = [['被老板说了一句', 18.4], ['地铁挤了一小时', 19.6], ['消息没人回', 20.8], ['作业还没写完', 22]];
function heading(n, s, a) {
  if (a <= 0) return;
  text(n, 96, 470, { weight: 900, size: 56, color: ORANGE, alpha: a, glow: `rgba(${O_RGB},.4)`, blur: 20 });
  text(s, 170, 470, { weight: 700, size: 50, color: CREAM, alpha: a });
}
shot({
  t0: DROP, t1: 31, fi: .12,
  draw(lt, d, T) {
    const t = DROP + lt;
    floor('#131a26', '#05070a');
    heading('①', '情绪溢出', sstep(17.4, 18, t));
    const level = clamp(EVENTS.filter(([, t0]) => t >= t0 + .2).length * .23 + (t > 23 ? .04 : 0));   // 一桶情绪，越装越满
    const fill = lerp(0, level, 1), tx = 760, ty0 = 620, th = 520, tw = 200;
    rr(tx - tw / 2, ty0, tw, th, 18, 'rgba(255,255,255,.04)', 'rgba(236,230,218,.35)', 3);
    const spill = sstep(26.4, 27.2, t);
    const lv = Math.min(1, fill + spill * .1), lh = th * lv;
    ctx.save(); ctx.beginPath(); ctx.roundRect(tx - tw / 2, ty0, tw, th, 18); ctx.clip();
    const g = ctx.createLinearGradient(0, ty0 + th - lh, 0, ty0 + th); g.addColorStop(0, `rgba(${R_RGB},.85)`); g.addColorStop(1, `rgba(${O_RGB},.6)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty0 + th);
    for (let x = -tw / 2; x <= tw / 2; x += 6) ctx.lineTo(tx + x, ty0 + th - lh + Math.sin(x * .06 + t * 3) * 6);
    ctx.lineTo(tx + tw / 2, ty0 + th); ctx.closePath(); ctx.fill(); ctx.restore();
    text('情绪', tx, ty0 - 34, { font: SANS, size: 28, align: 'center', color: DIM });
    if (spill > 0) for (let k = 0; k < 14; k++) {                   // 溢出来，洒到家人身上
      const p = clamp((t - 26.4 - k * .06) / 1.2), x = tx - 60 + p * -260 + k * 6, y = ty0 + 10 + p * p * 420 + Math.sin(k) * 20;
      ctx.fillStyle = `rgba(${R_RGB},${.8 * (1 - p * .6)})`; ctx.beginPath(); ctx.arc(x, y, 7 + k % 3 * 2, 0, TAU); ctx.fill();
    }
    EVENTS.forEach(([s, t0], i) => {
      const a = sstep(t0, t0 + .3, t) * (1 - sstep(25.6, 26.2, t)), y = 660 + i * 100;
      tag('+ ' + s, 330, y, CREAM, '236,230,218', a, { size: 30 });
    });
    if (t > 23) text('（在外面，都憋着）', 330, 1080, { size: 32, weight: 500, align: 'center', color: DIM, alpha: sstep(23, 23.4, t) * (1 - sstep(25.6, 26.2, t)) });
    const ha = sstep(25.8, 26.4, t);
    human(400, 1080, 30, { ring: TEAL, alpha: ha, dir: 0 });
    bubble('吃饭了吗？', 120, 960, 'L', ha, { pop: (t - 25.8) / .35 });
    text('你烦不烦！', 640, 1200, { weight: 900, size: 44, align: 'center', color: RED, alpha: sstep(27, 27.3, t), glow: `rgba(${R_RGB},.5)`, blur: 20 });
    stamp('1989', sstep(21.6, 22.2, t), 'Repetti · 空中交通管制员');
  },
});

// ---------------------------------------------------------------- 31–43 原因二：越亲近，越不客气
const RINGS = [['家人', 110, 0], ['朋友', 200, 3], ['同事', 290, 6], ['陌生人', 380, 10]];
shot({
  t0: 31, t1: 43,
  draw(lt, d, T) {
    const t = 31 + lt, cx = 540, cy = 930;
    floor('#131a26', '#05070a');
    heading('②', '越近，越不客气', sstep(31.2, 31.8, t));
    RINGS.forEach(([lab, r, n], i) => {
      const a = sstep(31.6 + i * .3, 32 + i * .3, t);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = `rgba(236,230,218,${.12 + i * .05})`; ctx.lineWidth = 2; ctx.setLineDash([5, 9]);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.restore();
      text(lab, cx + r - 8, cy - 18, { font: SANS, size: 26, align: 'right', color: DIM, alpha: a });
      for (let k = 0; k < n; k++) {                                     // 每一圈上的“客气话”：离得越远越多
        const ang = -PI / 2 + (k + .5) / Math.max(1, n) * TAU * .9 + i, pa = sstep(35.6 + i * .4 + k * .03, 36 + i * .4 + k * .03, t);
        const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
        ctx.save(); ctx.globalAlpha = pa; ctx.fillStyle = TEAL; ctx.shadowColor = TEAL; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.restore();
      }
    });
    pool(cx, cy, 120, .8); human(cx, cy, 30, { ring: ORANGE, dir: -PI / 2 });
    text('●  = 一句「请」「谢谢」「不好意思」', 120, 1380 - 140, { font: SANS, size: 26, color: TEAL, alpha: sstep(36, 36.5, t) });
    const zero = sstep(39.8, 40.3, t);
    if (zero > 0) callout(cx + 70, cy - 70, 150, -150, zero, '0', '句', RED, { grow: (t - 39.8) / .5, bigSize: 72 });
    stamp('1987', sstep(35.5, 36.1, t), 'Brown & Levinson');
  },
});

// ---------------------------------------------------------------- 43–54 原因三：你默认，家人不会离开
shot({
  t0: 43, t1: 54,
  draw(lt, d, T) {
    const t = 43 + lt, yx = 300, yy = 920;
    floor('#131a26', '#05070a');
    heading('③', '安全基地', sstep(43.2, 43.8, t));
    // 和外人之间：一根细线，一碰就断；和家人之间：一根粗绳，挨了骂也不断——但会磨损
    const ox = 820, oy = 700, fx = 820, fy = 1140;
    const snap = sstep(45, 45.3, t);
    ctx.save(); ctx.globalAlpha = sstep(43.6, 44.2, t); ctx.strokeStyle = 'rgba(79,214,196,.6)'; ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
    if (snap < 1) { ctx.beginPath(); ctx.moveTo(yx, yy); ctx.lineTo(ox, oy); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(yx, yy); ctx.lineTo(lerp(yx, ox, .4), lerp(yy, oy, .4) + 30); ctx.moveTo(ox, oy); ctx.lineTo(lerp(yx, ox, .62), lerp(yy, oy, .62) + 30); ctx.stroke(); }
    ctx.restore();
    text('外人：一句话就断', ox, oy - 80, { font: SANS, size: 28, align: 'center', color: TEAL, alpha: sstep(44, 44.5, t) });
    const fray = sstep(48, 52, t);
    for (let k = 0; k < 9; k++) {                                       // 家人之间的粗绳，一股一股地磨断
      const broken = k / 9 < fray * .7, off = (k - 4) * 3.5;
      ctx.save(); ctx.globalAlpha = sstep(43.8, 44.4, t) * (broken ? .25 : .9); ctx.strokeStyle = broken ? 'rgba(255,107,107,.8)' : ORANGE; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(yx, yy + off); ctx.quadraticCurveTo((yx + fx) / 2, (yy + fy) / 2 + 60 + off, fx, fy + off); ctx.stroke(); ctx.restore();
    }
    text('家人：骂不走——但会磨损', fx, fy + 80, { font: SANS, size: 28, align: 'center', color: ORANGE, alpha: sstep(44.2, 44.7, t) });
    ['你烦不烦', '别管我', '说了你也不懂'].forEach((s, i) => {
      const t0 = 48 + i * 1.2, p = clamp((t - t0) / .8);
      if (p <= 0 || p >= 1) return;
      text(s, lerp(yx + 60, fx - 80, p), lerp(yy, fy, p) + 40 - Math.sin(p * PI) * 80, { weight: 900, size: 34, align: 'center', color: RED, alpha: Math.sin(p * PI) });
    });
    pool(yx, yy, 120, .8); human(yx, yy, 30, { ring: ORANGE, dir: 0 });
    human(ox, oy, 28, { ring: TEAL, dir: PI, alpha: 1 - .5 * snap }); human(fx, fy, 28, { ring: ORANGE, dir: PI });
    stamp('Bowlby', sstep(47.6, 48.2, t), 'Secure Base');
  },
});

// ---------------------------------------------------------------- 54–64 戈特曼的 5:1，以及最伤人的“轻蔑”
shot({
  t0: 54, t1: 64,
  draw(lt, d, T) {
    const t = 54 + lt;
    floor('#141a26', '#05070a');
    const cx = 540, by = 980, tilt = lerp(.18, 0, eout((t - 55.4) / 1.6));            // 一架天平：1 句负面，要 5 句正面才压得平
    ctx.save(); ctx.translate(cx, by); ctx.rotate(-tilt);
    ctx.strokeStyle = CREAM; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-340, 0); ctx.lineTo(340, 0); ctx.stroke();
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 300, 0); ctx.lineTo(s * 300, 110); ctx.stroke(); ctx.beginPath(); ctx.ellipse(s * 300, 120, 120, 22, 0, 0, TAU); ctx.stroke(); }
    ctx.save(); ctx.translate(300, 98); ctx.rotate(tilt); ctx.fillStyle = RED; ctx.shadowColor = RED; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill(); ctx.restore();
    for (let k = 0; k < 5; k++) { const a = sstep(55 + k * .3, 55.3 + k * .3, t); ctx.save(); ctx.translate(-380 + k * 40, 98 - (k % 2) * 30); ctx.rotate(tilt); ctx.globalAlpha = a; ctx.fillStyle = TEAL; ctx.shadowColor = TEAL; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.restore();
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(cx - 30, by + 160); ctx.lineTo(cx + 30, by + 160); ctx.lineTo(cx, by); ctx.closePath(); ctx.fill();
    text('5', cx - 300, 740, { weight: 900, size: 120, align: 'center', color: TEAL, alpha: sstep(56.4, 57, t), glow: `rgba(${T_RGB},.5)`, blur: 24 });
    text(':', cx, 740, { weight: 900, size: 100, align: 'center', color: CREAM, alpha: sstep(56.6, 57.2, t) });
    text('1', cx + 300, 740, { weight: 900, size: 120, align: 'center', color: RED, alpha: sstep(56.8, 57.4, t), glow: `rgba(${R_RGB},.5)`, blur: 24 });
    text('正面', cx - 300, 820, { font: SANS, size: 28, align: 'center', color: DIM, alpha: sstep(57, 57.5, t) }); text('负面', cx + 300, 820, { font: SANS, size: 28, align: 'center', color: DIM, alpha: sstep(57, 57.5, t) });
    const ca = sstep(59, 59.5, t);                                       // 轻蔑
    if (ca > 0) {
      rr(160, 1220 - 70, 760, 110, 55, `rgba(${R_RGB},${.12 * ca})`, `rgba(${R_RGB},${.6 * ca})`, 2);
      text('最伤人的：轻蔑', 540, 1205 - 70 + 28, { weight: 900, size: 44, align: 'center', color: RED, alpha: ca });
    }
    stamp('1992', sstep(54.3, 55, t), 'Gottman & Levenson');
  },
});

// ---------------------------------------------------------------- 64–74 一个办法：心跳过 100，先停 20 分钟
shot({
  t0: 64, t1: 74,
  draw(lt, d, T) {
    const t = 64 + lt;
    floor('#141a26', '#05070a');
    const bpm = t < 68.9 ? lerp(72, 118, eio((t - 64.4) / 3.2)) : lerp(118, 74, eio((t - 69.6) / 3.6));
    const flooded = bpm > 100;
    ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = flooded ? RED : TEAL; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 14; ctx.beginPath();   // 心电图
    for (let x = 100; x <= 980; x += 4) {
      const ph = (x / 880 * 6 + t * bpm / 60) % 1, spike = ph < .06 ? Math.sin(ph / .06 * PI) * (ph < .03 ? -1 : 2.4) : 0;
      const y = 820 - spike * 70 + Math.sin(x * .05) * 3;
      x === 100 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.restore();
    text(`${Math.round(bpm)}`, 540, 1010, { weight: 900, size: 150, align: 'center', color: flooded ? RED : TEAL, glow: flooded ? `rgba(${R_RGB},.5)` : `rgba(${T_RGB},.4)`, blur: 30 });
    text('次 / 分钟', 540, 1110, { font: SANS, size: 30, align: 'center', color: DIM });
    text('情绪淹没', 540, 640, { weight: 900, size: 52, align: 'center', color: RED, alpha: flooded && t < 69.4 ? sstep(66.3, 66.7, t) : 0, ls: 8 });
    const ta = sstep(69, 69.5, t), left = 20 * 60 * (1 - eio((t - 69.6) / 3.8));
    if (ta > 0) {
      rr(340, 600, 400, 90, 45, `rgba(${T_RGB},${.12 * ta})`, `rgba(${T_RGB},${.6 * ta})`, 2);
      text(`暂停 ${pad2(left / 60)}:${pad2(left % 60)}`, 540, 646, { weight: 700, size: 44, align: 'center', color: TEAL, alpha: ta });
    }
    stamp('Gottman', sstep(64.4, 65, t), 'Flooding · 情绪淹没');
  },
});
// ---------------------------------------------------------------- 74–81 结尾：今天，对家人说一句谢谢
shot({
  t0: 74, t1: 81, fo: 1,
  draw(lt, d, T) {
    floor('#1a1410', '#050403');
    text('今天，', W / 2, 430, { size: 56, weight: 700, align: 'center', alpha: sstep(.1, .7, lt) });
    text('对家人说一句「谢谢」吧。', W / 2, 520, { size: 64, weight: 900, align: 'center', color: ORANGE, alpha: sstep(.5, 1.2, lt), glow: `rgba(${O_RGB},.45)`, blur: 26 });
    twoColumns(lt, T, { warm: true, homeWords: ['谢谢', '辛苦了', '今天怎么样？', '我回来了'], home: i => sstep(1.2 + i * .45, 1.5 + i * .45, lt) });
  },
});

// ======================================================================== 字幕（左下角）
// [起, 止, 文本]；「」里的字用橙色
const SUBS = [
  [.3, 4.8, '为什么我们对最亲近的人，最没耐心？'], [5.1, 10.2, '这一期：三个原因，一个办法。'],
  [10.8, 16.8, '网上有个词，叫「窝里横」。'],
  [17.5, 21.4, '原因一：情绪溢出。'],
  [21.7, 26.2, 'Repetti 研究空中交通管制员：工作越忙的那天，回家越沉默。'],
  [26.5, 30.8, '后来还发现：在单位受了气，回家对孩子更容易发火。'],
  [31.3, 35.2, '原因二：越亲近，越不客气。'],
  [35.5, 39.4, '礼貌理论认为：关系越远，人越会用客气话。'],
  [39.7, 42.8, '对家人，我们连「请」和「谢谢」都省了。'],
  [43.3, 47.4, '原因三：你默认，家人不会离开。'],
  [47.7, 53.6, '家是「安全基地」：在最安全的地方，我们卸下防备，也卸下了分寸。'],
  [54.3, 58.6, '戈特曼研究吵架的夫妻：关系稳定的，每 1 句负面话，约有 5 句正面话。'],
  [58.9, 63.6, '最伤人的，是轻蔑：翻白眼、冷笑、「你怎么这么笨」。'],
  [64.3, 68.6, '一个办法：心跳超过 100，人就很难好好说话了。'],
  [68.9, 73.6, '先停下来，至少 20 分钟，等心跳慢下来，再回来说。'],
  [74.4, 79.4, '评论区：你最后悔对家人说过的一句话是？'],
];
