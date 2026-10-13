// ======================================================================== No.28 浪漫主义：爱情，能被制造吗？
// 第四季·你身上的主义 ⑤。开头是一道选择题：两个陌生人用 45 分钟互问 36 个越来越私人的问题，会怎样？（Aron et al., 1997）
// 音乐：原创配乐（music.py，升 G 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一问一答：一句往上停在半空，一句落回来。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 命中注定（每拍一个鼓点） · 53.33 结晶（紧张） · 64.0 挂满的光（只剩钢琴） · 80.0 高潮 · 96.0 升 G 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), FATE = BT(56), CRYST = BT(80), LIGHT = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['36 个问题', 0, LIFT], ['浪漫主义', LIFT, FATE], ['命中注定', FATE, CRYST], ['结晶', CRYST, LIGHT], ['挂满的光', LIGHT, CLIMAX], ['爱的艺术', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.28';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '两个陌生人，在 45 分钟里，轮流问对方一组问题。'],
  [4.1, 7.6, '问题一个比一个私人。最后会怎样？先猜一个。'],
  [8.2, 10.4, '答案是：明显更亲近了。'],
  [10.8, 13.3, '比只聊闲话的那一组，亲近得多。'],
  [13.6, 15.7, '原来，亲密是可以「问」出来的。'],
  [16.3, 19.6, '问题从「你最想请谁吃晚饭」开始，'],
  [19.9, 23.7, '一直问到「你上一次在别人面前哭，是什么时候」。'],
  [24.0, 27.4, '可我们心里的爱情，往往是另一个样子：'],
  [27.7, 31.3, '一眼万年，命中注定，遇到「对的人」就够了。'],
  [31.6, 35.3, '这种想象，很多来自两百年前的「浪漫主义」。'],
  [37.6, 40.6, '心理学家把它叫做「命运信念」：'],
  [40.9, 44.6, '相信合适的人，一开始就会合适。'],
  [44.9, 48.6, '研究发现：这样想的人，开头不顺，往往很快就分手；'],
  [48.9, 52.9, '相信「感情要经营」的人，遇到问题，更愿意去修。'],
  [53.6, 57.6, '1818 年，作家司汤达去了萨尔茨堡附近的盐矿。'],
  [57.9, 63.4, '一根枯枝扔进矿井，几个月后拿出来，挂满了闪闪发光的结晶。'],
  [64.3, 67.6, '他说，爱上一个人，就是这样：'],
  [67.9, 71.9, '我们给对方挂满想象，看到的，是自己挂上去的光。'],
  [72.2, 75.9, '等光慢慢掉了，枝露出来，爱才真正开始。'],
  [76.3, 79.6, '心理学家弗洛姆说：'],
  [84.9, 88.6, '爱情不只是遇到，'],
  [88.9, 92.6, '也是一次次问，一次次答。'],
  [98.4, 103.0, '评论区：你相信「对的人」，还是「慢慢磨合」？'],
];
const BIGLINES = [
  [80.2, 92.6, '「爱是一门艺术吗？如果是，它就需要知识和努力。」—— 弗洛姆《爱的艺术》'],
  [93.4, 98.0, '今晚，问对方一个你从没问过的问题。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .3], [FATE - .5, .3], [FATE, .06], [LIGHT, .06],
  [LIGHT + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .8], [TOTAL, .8]]);
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

// ======================================================================== 人：坐着，朝左或朝右
function sitter(x, y, s, a, face = 1, col = CREAM) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * face, s); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.96)';
  ctx.shadowColor = col; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(0, -96, 26, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-26, -64); ctx.quadraticCurveTo(-34, 0, -24, 20); ctx.lineTo(40, 20); ctx.lineTo(40, 70); ctx.moveTo(-24, 20); ctx.lineTo(-24, 70); ctx.moveTo(24, -64); ctx.quadraticCurveTo(28, -20, 22, 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -40); ctx.lineTo(54, -20); ctx.stroke();                                   // 手伸向对方
  ctx.restore();
}
function bubble(x, y, s, a, txt, col = CREAM, rgb = C_RGB) {
  if (a <= 0) return;
  font(28, 500, SANS); const w = Math.max(90, ctx.measureText(txt).width + 44);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = `rgba(${rgb},.12)`; ctx.strokeStyle = `rgba(${rgb},.7)`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-w / 2, -30, w, 60, 22); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, 30); ctx.lineTo(0, 46); ctx.lineTo(8, 30); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); text(txt, 0, 1, { font: SANS, size: 28, weight: 500, align: 'center', color: col, alpha: a }); ctx.restore();
}

// ======================================================================== ① 36 个问题（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('两个陌生人，互问 36 个问题：', 540, 452, { ...big, size: 48, weight: 700 }, 1, 1 - qOut);
  typeText('最后会怎样？', 540, 560, { ...big, size: 86, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const close = E.io(prog(t, Q.REVEAL, Q.REVEAL + 2.4)), gap = lerp(250, 150, close);
  sitter(540 - gap, 1010, 1.1, 1, 1, CREAM); sitter(540 + gap, 1010, 1.1, 1, -1, CREAM);
  ctx.save(); ctx.globalAlpha = .6; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(470, 1000); ctx.lineTo(610, 1000); ctx.stroke(); ctx.restore();   // 小桌子
  const qn = Math.min(36, Math.floor(prog(t, .3, 7.4) * 36) + 1), side = qn % 2;
  if (t < Q.REVEAL) bubble(540 + (side ? 1 : -1) * gap * .55, 780, 1, 1 - qOut, `${qn} / 36`);
  if (close > 0) {                                                                               // 两个人之间亮起一根线
    ctx.save(); ctx.globalAlpha = close; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.moveTo(540 - gap + 30, 910); ctx.quadraticCurveTo(540, 860 - 30 * Math.sin(t * 2), 540 + gap - 30, 910); ctx.stroke(); ctx.restore();
    glow(540, 870 - 30 * Math.sin(t * 2) * .5, 8, O_RGB, close, 6);
  }
  const bk = sstep(10.8, 11.4, t) * (1 - sstep(13.4, 13.8, t));                                    // 亲近感：36 题组 vs 闲聊组（示意）
  if (bk > 0) {
    [['36 个问题', 1, ORANGE, O_RGB], ['闲聊', .45, '#9aa3b2', '154,163,178']].forEach(([lab, v, col, rgb], i) => {
      const y = 1180 + i * 70, k = E.out(prog(t, 10.9 + i * .3, 11.8 + i * .3));
      text(lab, 150, y, { font: SANS, size: 28, color: col, alpha: bk });
      ctx.save(); ctx.globalAlpha = bk; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.beginPath(); ctx.roundRect(330, y - 15, 560 * v * k, 30, 9); ctx.fill(); ctx.restore();
    });
    text('亲近感（示意）', 930, 1130, { font: SANS, size: 22, align: 'right', color: '#6f7786', alpha: bk });
  }
  text('更亲近了', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL + .2, Q.REVEAL + .6, t) * (1 - sstep(13.4, 13.7, t)), glow: `rgba(${O_RGB},.5)`, blur: 18 });
  typeText('亲密，是可以「问」出来的', 540, 560, { ...big, size: 60, weight: 900 }, prog(t, 13.6, 14.6), 1);
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 更尴尬', 220], ['B · 没变化', 540], ['C · 更亲近', 860]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 28, sc: 1 + .03 * beatK }));
  ['3', '2', '1'].forEach((s, i) => {
    const t0 = [Q.c3, Q.c2, Q.c1][i], v = prog(t, t0, t0 + 1.28); if (v <= 0 || v >= 1) return;
    const k = 1.5 - .5 * E.outExpo(v * 2.5), al = 1 - sstep(.62, 1, v);
    const bg = ctx.createRadialGradient(540, 900, 0, 540, 900, 230); bg.addColorStop(0, `rgba(6,7,11,${.88 * al})`); bg.addColorStop(1, 'rgba(6,7,11,0)'); ctx.fillStyle = bg; ctx.fillRect(300, 660, 480, 480);
    ctx.save(); ctx.translate(540, 900); ctx.scale(k, k);
    text(s, 0, 8, { font: SERIF, size: 210, weight: 900, align: 'center', color: CREAM, alpha: al, glow: 'rgba(255,240,220,.4)', blur: 30 });
    ctx.restore();
  });
  ctx.restore();
}

// ======================================================================== ② 标题 · 两张问题卡 · 红线 · 雾海上的旅人
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('浪漫主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('ROMANTICISM', 540, 1046, { size: 44, weight: 600, font: LAT, ls: 22, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第四季 · 你身上的主义 ⑤', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function qcard(x, y, a, head, body, rot) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(30,26,36,.96)'; ctx.strokeStyle = `rgba(${O_RGB},.6)`; ctx.lineWidth = 2.5; ctx.shadowColor = `rgba(${O_RGB},.3)`; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.roundRect(-340, -110, 680, 220, 20); ctx.fill(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  text(head, -300, -60, { font: SANS, size: 24, color: '#ffd2a0', alpha: a });
  text(body, 0, 20, { font: SERIF, size: 34, weight: 900, align: 'center', color: CREAM, alpha: a });
  ctx.restore();
}
function wanderer(x, y, a, t) {                                                                    // 雾海上的旅人（浪漫主义的象征画面）
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 5; i++) { const yy = y + 60 + i * 34, g = ctx.createLinearGradient(0, yy - 30, 0, yy + 30); g.addColorStop(0, 'rgba(200,210,226,0)'); g.addColorStop(.5, `rgba(200,210,226,${.12 + .03 * i})`); g.addColorStop(1, 'rgba(200,210,226,0)'); ctx.fillStyle = g; ctx.fillRect(80 + Math.sin(t * .3 + i) * 30, yy - 30, 920, 60); }
  ctx.fillStyle = 'rgba(10,10,14,.98)'; ctx.strokeStyle = 'rgba(216,199,159,.7)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x - 200, y + 200); ctx.lineTo(x - 80, y + 40); ctx.lineTo(x - 20, y + 60); ctx.lineTo(x + 40, y + 20); ctx.lineTo(x + 160, y + 200); ctx.closePath(); ctx.fill(); ctx.stroke();   // 岩石
  ctx.beginPath(); ctx.arc(x, y - 110, 16, 0, TAU); ctx.fill(); ctx.stroke();                                                                            // 背影
  ctx.beginPath(); ctx.moveTo(x - 20, y - 92); ctx.lineTo(x - 26, y - 20); ctx.lineTo(x - 14, y + 30); ctx.moveTo(x + 20, y - 92); ctx.lineTo(x + 26, y - 20); ctx.lineTo(x + 30, y + 22); ctx.moveTo(x - 20, y - 92); ctx.lineTo(x + 20, y - 92); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 22, y - 70); ctx.lineTo(x + 60, y + 20); ctx.stroke();                                                                 // 手杖
  ctx.restore();
}
function sceneRomance(t) {
  if (t < 16.1 || t > FATE + .2) return;
  const A1 = sstep(16.3, 16.7, t) * (1 - sstep(23.6, 24.1, t));
  if (A1 > 0 && t > 19.9) {
    qcard(540, 760, A1 * sstep(19.9, 20.4, t), '第 1 题', '你最想请谁吃晚饭？', -.04);
    qcard(540, 1060, A1 * sstep(20.8, 21.4, t), '越往后，越私人', '你上一次在别人面前哭，是什么时候？', .03);
  }
  const A2 = sstep(24.0, 24.5, t) * (1 - sstep(31.3, 31.8, t));                                    // 一根红线，两颗星
  if (A2 > 0) {
    const k = E.io(prog(t, 24.3, 26.5));
    glow(260, 760, 9, '255,214,190', A2, 6); glow(820, 1080, 9, '255,214,190', A2, 6);
    drawOn(() => { ctx.moveTo(260, 760); ctx.bezierCurveTo(560, 700, 420, 1150, 820, 1080); }, 900, k, '#e5484d', 3, A2, 'rgba(229,72,77,.8)');
    ['一眼万年', '命中注定', '对的人'].forEach((s, i) => pill(s, [300, 760, 540][i], [1240, 700, 900][i] + Math.sin(t * 1.5 + i) * 6, A2 * sstep(27.8 + i * .5, 28.3 + i * .5, t), { size: 30, stroke: 'rgba(229,72,77,.7)', color: '#f0a0a0' }));
  }
  const A3 = sstep(31.6, 32.2, t) * (1 - sstep(FATE - .6, FATE - .05, t));
  if (A3 > 0) {
    wanderer(540, 900, A3, t);
    text('约 1800 年 · 浪漫主义', 540, 640, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#d8c79f', alpha: A3 * sstep(32.2, 32.8, t) });
  }
}

// ======================================================================== ③ 命中注定 vs 慢慢经营：路上有个坎
function sceneFate(t) {
  if (t < FATE - .3 || t > CRYST + .2) return;
  const A = sstep(FATE - .1, FATE + .5, t) * (1 - sstep(CRYST - .6, CRYST - .05, t));
  if (A <= 0) return;
  const lanes = [[880, '命运信念', '#f0a0a0', '240,160,160', 0], [1170, '成长信念', TEAL, T_RGB, 1]], x0 = 150, x1 = 930, bumpX = 560;
  lanes.forEach(([y, lab, col, rgb, grow]) => {
    const la = sstep(37.6 + grow * 11.3, 38.2 + grow * 11.3, t);
    seg(x0, y, x1, y, 'rgba(236,230,218,.25)', 2, A);
    const bk = sstep(44.9, 45.5, t);                                                              // 路上的坎
    if (bk > 0) { ctx.save(); ctx.globalAlpha = A * bk; ctx.strokeStyle = '#e5484d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bumpX - 40, y); ctx.quadraticCurveTo(bumpX, y - 50, bumpX + 40, y); ctx.stroke(); ctx.restore(); text('问题', bumpX, y - 70, { font: SANS, size: 24, align: 'center', color: '#e5484d', alpha: A * bk }); }
    text(lab, x0, y - 110, { font: SERIF, size: 36, weight: 900, color: col, alpha: A * (grow ? sstep(48.9, 49.4, t) : sstep(37.6, 38.2, t)) });
    const go = E.io(prog(t, grow ? 48.9 : 40.9, grow ? 52.6 : 47.6)), x = lerp(x0 + 40, grow ? x1 - 30 : bumpX + 60, go);
    const split = grow ? 0 : E.out(prog(t, 46.6, 48.4));
    const bump = (xx) => Math.abs(xx - bumpX) < 40 ? -50 * Math.sin((xx - bumpX + 40) / 80 * PI) * (grow ? 1 : 0) : 0;
    glow(x - 16, y - 16 + bump(x - 16) - split * 90, 10, rgb, A * (grow ? sstep(48.9, 49.3, t) : 1), 5);
    glow(x + 16, y - 16 + bump(x + 16) + split * 30, 10, rgb, A * (grow ? sstep(48.9, 49.3, t) : 1), 5);
    if (!grow && split > .3) text('分手', x + 70, y - 90, { font: SERIF, size: 34, weight: 900, color: '#f0a0a0', alpha: A * sstep(47.0, 47.6, t) });
    if (grow && x > bumpX - 40 && x < bumpX + 60) for (let k = 0; k < 6; k++) glow(x + Math.cos(k + t * 5) * 30, y - 40 + Math.sin(k + t * 5) * 20, 3, O_RGB, A * .8, 3);   // 修
    if (grow && go >= 1) text('一起过去了', x1 - 20, y + 60, { font: SERIF, size: 32, weight: 900, align: 'right', color: TEAL, alpha: A * sstep(52.4, 52.9, t) });
  });
  text('“合适的人，一开始就合适”', 540, 700, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#f0a0a0', alpha: A * sstep(40.9, 41.5, t) * (1 - sstep(44.6, 45.0, t)) });
}

// ======================================================================== ④⑤ 结晶：枯枝进盐矿，挂满晶体；光掉了，枝上长出花苞
let CRYSTALS = [], BRANCH = [];
function branch(x, y, s, a, col = 'rgba(160,130,100,.95)') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineCap = 'round';
  BRANCH.forEach(([x0, y0, x1, y1, w]) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); });
  ctx.restore();
}
function sceneCrystal(t) {
  if (t < CRYST - .3 || t > CLIMAX + .3) return;
  const A = sstep(CRYST - .1, CRYST + .5, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const mine = sstep(53.8, 54.6, t) * (1 - sstep(63.0, 64.0, t));                                   // 盐矿
  if (mine > 0) {
    ctx.save(); ctx.globalAlpha = A * mine; ctx.fillStyle = 'rgba(8,8,12,.9)'; ctx.strokeStyle = 'rgba(200,210,226,.35)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(140, 1300); ctx.lineTo(140, 900); ctx.quadraticCurveTo(540, 640, 940, 900); ctx.lineTo(940, 1300); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    text('盐矿 · 1818', 540, 1255, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#9aa3b2', alpha: A * mine });
  }
  const drop = E.io(prog(t, 54.2, 56.4)), lift = E.io(prog(t, 58.0, 60.0));
  const by = lerp(lerp(560, 1080, drop), 900, lift);
  branch(540, by, 1, A);
  const grow = sstep(58.6, 63.0, t), fall = sstep(72.2, 75.6, t);
  CRYSTALS.forEach((c, i) => {                                                                     // 晶体：一颗颗长出来，后来一颗颗掉
    const k = sstep(58.6 + c.d * 4, 59.0 + c.d * 4, t); if (k <= 0) return;
    const gone = sstep(72.2 + c.d * 3.2, 72.8 + c.d * 3.2, t), fy = gone * (200 + 300 * c.d);
    const x = 540 + c.x, y = by + c.y + fy, r = c.r * k * (1 + .2 * Math.sin(t * 3 + i));
    ctx.save(); ctx.globalAlpha = A * k * (1 - gone); ctx.translate(x, y); ctx.rotate(c.rot); ctx.fillStyle = 'rgba(220,235,255,.85)'; ctx.shadowColor = 'rgba(200,230,255,.9)'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * .6, 0); ctx.lineTo(0, r); ctx.lineTo(-r * .6, 0); ctx.closePath(); ctx.fill(); ctx.restore();
  });
  const tags = A * sstep(67.9, 68.5, t) * (1 - sstep(72.0, 72.6, t));
  ['温柔', '完美', '最懂我', '命中注定'].forEach((s, i) => pill(s, [250, 830, 300, 800][i], [720, 760, 1120, 1100][i] + Math.sin(t * 1.4 + i) * 6, tags * sstep(68.0 + i * .4, 68.4 + i * .4, t), { size: 28, stroke: 'rgba(200,230,255,.7)', color: '#dcebff' }));
  const bud = sstep(74.6, 76.2, t);                                                                  // 花苞
  if (bud > 0) { glow(540 + 150, by - 150, 6 + 6 * bud, '255,170,190', A * bud, 6); text('真正的开始', 540, 1250, { font: SERIF, size: 40, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(75.2, 75.8, t) }); }
}

// ======================================================================== ⑥ 爱的艺术：两个人，一问一答，花开
function sceneArt(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  warmth(A * (1 + .5 * sstep(FINAL, FINAL + 1.5, t)), 540, 1060, 760);
  const gap = 150;
  sitter(540 - gap, 1130, 1.1, A, 1, '#ffd2a0'); sitter(540 + gap, 1130, 1.1, A, -1, '#ffd2a0');
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = ORANGE; ctx.lineWidth = 3; ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 18;
  ctx.beginPath(); ctx.moveTo(540 - gap + 30, 1030); ctx.quadraticCurveTo(540, 980 - 30 * Math.sin(t * 2), 540 + gap - 30, 1030); ctx.stroke(); ctx.restore();
  const n = Math.floor((t - CLIMAX) / 1.4), ph = ((t - CLIMAX) / 1.4) % 1;
  if (t < 93.0) bubble(540 + (n % 2 ? 1 : -1) * 110, 900, .9, A * Math.sin(PI * ph), n % 2 ? '……' : '？', '#ffd2a0', O_RGB);
  const bloom = E.outExpo(prog(t, FINAL, FINAL + 1.6));                                              // 花开
  if (bloom > 0) {
    glow(540, 980, 10 + 10 * bloom, '255,170,190', A * bloom, 8);
    ctx.save(); ctx.globalAlpha = A * bloom; ctx.fillStyle = '#ffb3c4'; ctx.shadowColor = 'rgba(255,170,190,.8)'; ctx.shadowBlur = 16;
    for (let p = 0; p < 6; p++) { const an = p / 6 * TAU + t * .15; ctx.beginPath(); ctx.ellipse(540 + Math.cos(an) * 20 * bloom, 980 + Math.sin(an) * 20 * bloom, 15 * bloom, 8 * bloom, an, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('「爱是一门艺术吗？', 540, 520, { ...big, size: 66, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.2), qa);
  typeText('如果是，它就需要', 540, 620, { ...big, size: 60, weight: 900, color: CREAM }, prog(t, CLIMAX + 1.4, CLIMAX + 2.2), qa);
  typeText('知识和努力。」', 540, 714, { ...big, size: 66, weight: 900, color: '#ffd2a0', glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.3, CLIMAX + 3.0), qa);
  typeText('—— 弗洛姆《爱的艺术》', 540, 806, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.2, CLIMAX + 3.8), qa);
  typeText('今晚，问对方一个', 540, 560, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.3), 1);
  typeText('你从没问过的问题。', 540, 666, { ...big, size: 72, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneRomance(t); sceneFate(t); sceneCrystal(t); sceneArt(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .14 * win(T, 58.6, 72.2, .5, 1) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1997', 'Aron et al. · PSPB', 8.2, 23.7, T);
  stamp('1998', 'Knee · JPSP', 37.6, 52.9, T);
  stamp('1822', 'Stendhal · De l’amour', 53.6, 75.9, T);
  stamp('1956', 'Fromm · The Art of Loving', 76.3, 79.6, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(28);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
  BRANCH = [[0, 220, 0, -60, 10], [0, -60, 10, -200, 7], [0, 60, -110, -40, 6], [-110, -40, -170, -110, 4], [-110, -40, -150, 10, 3], [0, 0, 120, -80, 6], [120, -80, 150, -150, 4], [120, -80, 200, -60, 3], [10, -200, -50, -260, 4], [10, -200, 60, -270, 3]];
  const rc = mulberry(281);
  CRYSTALS = [];
  BRANCH.forEach(([x0, y0, x1, y1]) => { for (let k = 0; k < 7; k++) { const u = rc(); CRYSTALS.push({ x: lerp(x0, x1, u) + (rc() - .5) * 18, y: lerp(y0, y1, u) + (rc() - .5) * 18, r: 6 + rc() * 9, rot: rc() * PI, d: rc() }); } });
}

// ======================================================================== 音效提示表（音高都在升 G 小调里，最后一个和弦是升 G 大调）
const NOTE = { Gs4: 415.30, B4: 493.88, C5: 523.25, Ds5: 622.25, Gs5: 830.61, B5: 987.77, C6: 1046.5, Ds6: 1244.51, Gs6: 1661.22, B6: 1975.53 };
const GM_SHIM = [NOTE.B6, NOTE.Ds6, NOTE.Gs6, NOTE.B5, NOTE.Gs5], GMAJ_SHIM = [NOTE.C6 * 2, NOTE.Ds6, NOTE.Gs6, NOTE.C6, NOTE.Gs5], GM_SWELL = [103.83, 155.56, 207.65, 246.94, 311.13];
function CUES() {
  const c = [];
  for (let i = 0; i < 6; i++) c.push([.4 + i * 1.2, 'tink', { f: [NOTE.B5, NOTE.Ds6][i % 2], gain: .06 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'chord', { f: [NOTE.Gs4, NOTE.B4, NOTE.Ds5], gain: .24 }], [Q.REVEAL + .1, 'shimmer', { f: GM_SHIM, gain: .18 }], [10.9, 'bar', { f0: 311, f1: 622, dur: 1.0, gain: .18 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: GM_SHIM, gain: .28 }]);
  c.push([19.9, 'page', { gain: .24 }], [20.8, 'page', { gain: .2 }], [24.3, 'swish', { gain: .18 }], [31.6, 'wind', { dur: 5, gain: .14 }]);
  c.push([FATE, 'whoosh', { dur: .5, gain: .25 }], [44.9, 'thud', { gain: .22 }], [46.6, 'bar', { f0: 622, f1: 311, dur: 1.2, gain: .18 }], [50.6, 'shimmer', { f: GM_SHIM, gain: .16 }]);
  c.push([CRYST, 'whoosh', { dur: .5, gain: .22 }], [54.2, 'whoosh', { dur: 2.2, gain: .14 }], [58.6, 'shimmer', { f: GM_SHIM, gain: .2 }]);
  for (let i = 0; i < 6; i++) c.push([59.0 + i * .6, 'tink', { f: [NOTE.Gs6, NOTE.B6, NOTE.Ds6][i % 3], gain: .07 }]);
  c.push([72.3, 'dust', { dur: 3.4, gain: .12 }], [74.8, 'chord', { f: [NOTE.Gs4, NOTE.B4, NOTE.Ds5], gain: .12 }]);
  c.push([76.6, 'swell', { dur: CLIMAX - 76.6, f: GM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: GM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 103.83, gain: .14 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: GMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.Gs4, NOTE.C5, NOTE.Ds5], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
