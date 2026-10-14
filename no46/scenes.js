// ======================================================================== No.46 权威主义：穿白大褂的人让你按下去，你会吗？
// 第六季·日常里的主义 ③。开头是一道选择题：白大褂说“请继续”，多少人按到了最高的 450 伏？（Milgram, 1963）
// 音乐：原创配乐（music.py，F 小调 90 BPM），从第 0 秒放到最后一秒，不剪不断。高音动机是一句命令：附点的“请—继—续”，一步步往下走；高潮时同样的节奏往上走。
// 画面的每个段落都落在配乐的小节线上（1 小节 = 2.667 秒）：
//   16.0 标题 · 37.33 换个条件（每拍一个鼓点） · 53.33 重做（紧张） · 64.0 谁的责任（只剩钢琴） · 80.0 高潮：手离开开关 · 96.0 F 大调
const BEAT = 60 / 90, BAR = BEAT * 4, BT = n => n * BEAT;
const LIFT = BT(24), COND = BT(56), REDO = BT(80), RESP = BT(96), CLIMAX = BT(120), FINAL = BT(144), TOTAL = BT(156);
const SECTIONS = [['450 伏', 0, LIFT], ['白大褂', LIFT, COND], ['换个条件', COND, REDO], ['重做', REDO, RESP], ['谁的责任', RESP, CLIMAX], ['良心', CLIMAX, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.46';
const Q = { c3: BT(6), c2: BT(8), c1: BT(10), REVEAL: BT(12), TIMES: BT(16) };

const LINES = [
  [0.15, 3.9, '一个穿白大褂的人，让你电击隔壁答错题的人。'],
  [4.1, 7.6, '他喊疼了，白大褂说「请继续」。多少人按到了最高的 450 伏？'],
  [8.2, 10.4, '答案是：约 65%。'],
  [10.8, 13.3, '40 个人里，有 26 个按到了最后。'],
  [13.6, 15.7, '实验前，精神科医生猜：只有极少数人会这样。'],
  [16.3, 19.6, '这是耶鲁大学米尔格拉姆的实验，1963 年发表。'],
  [19.9, 23.7, '电击是假的，喊疼的是演员；可按按钮的人不知道。'],
  [24.0, 27.4, '很多人一边冒汗、一边发抖，还是按了下去。'],
  [27.7, 31.3, '因为那个人说：「实验需要你继续。」'],
  [31.6, 35.3, '这就是「权威主义」：把对错，交给穿制服的人去判断。'],
  [37.6, 40.6, '可这个数字，会变。'],
  [40.9, 44.6, '白大褂不在场，只打电话下指令，按到底的约两成；'],
  [44.9, 48.6, '身边有两个人先拒绝了，只剩约一成。'],
  [48.9, 52.9, '服从会传染，反抗，也会。'],
  [53.6, 57.6, '这个实验，也一直有争议。'],
  [57.9, 60.6, '2009 年，有人在更安全的条件下重做：'],
  [60.8, 63.4, '到 150 伏为止，约七成的人还是愿意继续。'],
  [64.3, 67.6, '所以，当有人拿身份让你做不对的事，'],
  [67.9, 71.9, '先问一句：出了事，是谁的责任？'],
  [72.2, 75.9, '然后，试着做那个先说「不」的人。'],
  [76.3, 79.6, '米尔格拉姆后来写道：'],
  [84.9, 88.6, '你可以尊重权威，'],
  [88.9, 92.6, '但别把良心交出去。'],
  [98.4, 103.0, '评论区：你有没有一次，没敢说「不」？'],
];
const BIGLINES = [
  [80.2, 92.6, '「普通人，只是在做自己的工作，也可能成为可怕之事的一环。」—— 米尔格拉姆（大意）'],
  [93.4, 98.0, '服从之前，先问良心。'],
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
const STAR_A = track([[0, .08], [LIFT - .4, .08], [LIFT, .5], [LIFT + 3, .25], [19.8, .25], [20.6, .12], [24, .12], [25, .2], [COND - .5, .2], [COND, .06], [RESP, .06],
  [RESP + 1, .14], [CLIMAX - .2, .14], [CLIMAX + .4, .7], [TOTAL, .7]]);
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



// ======================================================================== 人、白大褂、电击器
function person(x, y, s, a, col = CREAM, sy = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s * sy); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(16,17,23,.95)';
  ctx.shadowColor = col; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(0, -84, 22, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -22); ctx.quadraticCurveTo(-40, -52, -12, -54); ctx.lineTo(12, -54); ctx.quadraticCurveTo(40, -52, 40, -22); ctx.lineTo(40, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function coat(x, y, s, a, col = '#e8ecf2') {                                                       // 白大褂：领口和一块写字板
  if (a <= 0) return;
  person(x, y, s, a, col);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-14, -54); ctx.lineTo(0, -20); ctx.lineTo(14, -54); ctx.moveTo(0, -20); ctx.lineTo(0, 30); ctx.stroke();
  ctx.fillStyle = 'rgba(232,236,242,.85)'; ctx.fillRect(44, -40, 34, 46); ctx.fillStyle = '#20232c'; ctx.fillRect(54, -44, 14, 6);
  ctx.restore();
}
const SW_N = 10, swX = i => 175 + i * 81;
function board(a, on, t, o = {}) {                                                                  // 电击器：on 个开关已经按下
  if (a <= 0) return;
  const y0 = o.y || 1070;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(28,30,38,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(120, y0, 840, 140, 16); ctx.fill(); ctx.stroke(); ctx.restore();
  for (let i = 0; i < SW_N; i++) {
    const x = swX(i), k = clamp(on - i), hot = i / (SW_N - 1), rgb = hot > .7 ? '229,72,77' : hot > .35 ? '242,161,74' : '127,227,211';
    glow(x, y0 + 30, 7, rgb, a * (.15 + .85 * k), 3);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(236,230,218,.12)'; ctx.fillRect(x - 16, y0 + 52, 32, 56);
    ctx.fillStyle = k > .5 ? `rgba(${rgb},.95)` : 'rgba(236,230,218,.7)'; ctx.fillRect(x - 10, k > .5 ? y0 + 80 : y0 + 56, 20, 24); ctx.restore();
  }
  text('15 伏', swX(0), y0 + 124, { font: SANS, size: 20, align: 'center', color: DIM, alpha: a });
  text('450 伏', swX(SW_N - 1), y0 + 124, { font: SANS, size: 20, weight: 700, align: 'center', color: '#f0a0a0', alpha: a });
  if (o.stop) {
    const x = (swX(2) + swX(3)) / 2;
    ctx.save(); ctx.globalAlpha = a * o.stop; ctx.strokeStyle = '#ffd2a0'; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(x + 40, y0 - 30); ctx.lineTo(x + 40, y0 + 160); ctx.stroke(); ctx.restore();
    text('150 伏：停', x + 40, y0 - 46, { font: SERIF, size: 30, weight: 900, align: 'center', color: '#ffd2a0', alpha: a * o.stop });
  }
}

// ======================================================================== ① 450 伏（0–16）
function sceneTest(t) {
  if (t > LIFT + .1) return;
  const push = E.inExpo(prog(t, 15.0, LIFT)), fade = 1 - sstep(15.5, LIFT, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  if (push > .02) ctx.filter = `blur(${(push * 16).toFixed(1)}px)`;
  const qOut = sstep(Q.REVEAL - .1, Q.REVEAL + .4, t);
  typeText('白大褂说「请继续」：', 540, 452, { ...big, size: 44, weight: 700 }, 1, 1 - qOut);
  typeText('多少人按到 450 伏？', 540, 560, { ...big, size: 78, weight: 900, glow: 'rgba(255,225,190,.25)', glowBlur: 30 }, 1, 1 - qOut);
  const P = 1 - sstep(10.5, 10.9, t);
  if (P > 0) {
    ctx.save(); ctx.globalAlpha = P; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(400, 760); ctx.lineTo(400, 1030); ctx.stroke(); ctx.restore();
    person(250, 1010, 1.05, P * .8, '#9aa3b2');
    const ow = .5 + .5 * Math.sin(t * 7);
    pill('啊！好疼！', 250, 790, P * sstep(1.5, 1.9, t) * (.7 + .3 * ow), { size: 30, stroke: 'rgba(240,160,160,.6)', color: '#f0a0a0' });
    coat(820, 1010, 1.15, P);
    pill('请继续。', 820, 790, P * sstep(2.6, 3.0, t), { size: 32, stroke: 'rgba(232,236,242,.6)', color: '#e8ecf2' });
    board(P, 1 + 6 * E.io(prog(t, .5, 7.5)), t);
  }
  const C = sstep(10.8, 11.3, t);
  if (C > 0) {                                                                                      // 40 个人里 26 个
    const n = 26 * E.out(prog(t, 11.0, 12.6));
    for (let i = 0; i < 40; i++) {
      const x = 260 + (i % 8) * 80, y = 820 + Math.floor(i / 8) * 80;
      if (i < n) glow(x, y, 13, '229,72,77', C, 3); else { ctx.save(); ctx.globalAlpha = C * .5; ctx.fillStyle = 'rgba(236,230,218,.35)'; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fill(); ctx.restore(); }
    }
    text('26 / 40', 540, 1230, { font: LAT, size: 46, weight: 700, align: 'center', color: '#f0a0a0', alpha: C * sstep(12.2, 12.6, t) });
    text('实验前的猜测：极少数', 540, 1290, { font: SANS, size: 26, align: 'center', color: '#9aa3b2', alpha: C * sstep(13.7, 14.1, t) });
  }
  text('约 65%', 540, 560, { font: SERIF, size: 72, weight: 900, align: 'center', color: '#f0a0a0', alpha: sstep(10.9, 11.4, t), glow: 'rgba(229,72,77,.4)', blur: 16 });
  text('C · 约 65%', 540, 560, { font: SERIF, size: 64, weight: 900, align: 'center', color: '#ffd2a0', alpha: sstep(Q.REVEAL, Q.REVEAL + .4, t) * (1 - sstep(10.6, 11.0, t)), glow: `rgba(${O_RGB},.5)`, blur: 22 });
  const oa = 1 - sstep(Q.REVEAL - .1, Q.REVEAL + .3, t), beatK = [Q.c3, Q.c2, Q.c1].reduce((m, c) => Math.max(m, t >= c ? 1 - E.out(prog(t, c, c + .4)) : 0), 0);
  [['A · 约 1%', 200], ['B · 约 30%', 540], ['C · 约 65%', 880]].forEach(([s, x]) => pill(s, x, 1290, oa, { size: 26, sc: 1 + .03 * beatK }));
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

// ======================================================================== ② 标题 · 假电击、真发抖、白大褂
function sceneTitle(t) {
  if (t < LIFT - .05 || t > 20.6) return;
  const e = E.outExpo(prog(t, LIFT, LIFT + .9)), out = sstep(19.5, 20.2, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('权威主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(LIFT, LIFT + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(LIFT + .4, LIFT + 1.1, t) * (1 - out));
  typeText('AUTHORITARIANISM', 540, 1046, { size: 40, weight: 600, font: LAT, ls: 14, color: DIM, align: 'center', spread: 3 }, prog(t, LIFT + .5, LIFT + 1.6), 1 - out);
  typeText('第六季 · 日常里的主义 ③', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, LIFT + 1.1, LIFT + 2.0), 1 - out);
}
function sceneCoat(t) {
  if (t < 19.7 || t > COND + .2) return;
  const A = sstep(19.9, 20.5, t) * (1 - sstep(COND - .6, COND - .05, t));
  if (A <= 0) return;
  const D = A * (1 - sstep(31.3, 31.7, t));
  if (D > 0) {
    const S1 = D * (1 - sstep(23.7, 24.1, t));
    if (S1 > 0) {
      text('电击是假的', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: S1 });
      person(300, 1060, 1.3, S1, '#9aa3b2');
      pill('演员', 300, 820, S1 * sstep(20.6, 21.0, t), { size: 32, stroke: `rgba(${T_RGB},.7)`, color: '#7fe3d3' });
      drawOn(() => { ctx.moveTo(380, 1000); ctx.bezierCurveTo(520, 1080, 620, 940, 760, 1010); }, 420, E.io(prog(t, 20.4, 21.4)), 'rgba(236,230,218,.5)', 3, S1);
      ctx.save(); ctx.globalAlpha = S1; ctx.fillStyle = 'rgba(28,30,38,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(760, 960, 180, 110, 12); ctx.fill(); ctx.stroke(); ctx.restore();
      text('没有电', 580, 930, { font: SERIF, size: 34, weight: 900, align: 'center', color: '#7fe3d3', alpha: S1 * sstep(21.4, 21.8, t) });
      text('按的人不知道', 540, 1220, { font: SANS, size: 30, align: 'center', color: '#ffd2a0', alpha: S1 * sstep(22.0, 22.4, t) });
    }
    const S2 = D * sstep(24.0, 24.4, t);
    if (S2 > 0) {                                                                                   // 一个大开关，手指在上面发抖
      const press = E.out(prog(t, 29.4, 29.8)), shake = (1 - press) * 6 * Math.sin(t * 40);
      text('冒汗、发抖', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#f0a0a0', alpha: S2 * (1 - sstep(27.4, 27.8, t)) });
      ctx.save(); ctx.globalAlpha = S2; ctx.fillStyle = 'rgba(28,30,38,.96)'; ctx.strokeStyle = 'rgba(236,230,218,.45)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(300, 1040, 280, 200, 20); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(236,230,218,.12)'; ctx.fillRect(400, 1080, 80, 130);
      ctx.fillStyle = press > .5 ? '#e5484d' : 'rgba(236,230,218,.75)'; ctx.fillRect(412, press > .5 ? 1150 : 1090, 56, 52); ctx.restore();
      glow(440, 1060, 10, '229,72,77', S2 * (.2 + .8 * press), 4);
      ctx.save(); ctx.globalAlpha = S2; ctx.translate(440 + shake, lerp(960, 1040, press)); ctx.fillStyle = 'rgba(236,214,180,.92)'; ctx.beginPath(); ctx.roundRect(-24, -120, 48, 130, 22); ctx.fill(); ctx.restore();
      for (let i = 0; i < 3; i++) { const p = ((t * .9) + i / 3) % 1; ctx.save(); ctx.globalAlpha = S2 * (1 - p) * (1 - press); ctx.fillStyle = '#9fd0ff'; ctx.beginPath(); ctx.ellipse(500 + i * 18, 880 + p * 120, 5, 8, 0, 0, TAU); ctx.fill(); ctx.restore(); }
      const S3 = S2 * sstep(27.7, 28.1, t);
      coat(800, 1180, 1.35, S3);
      pill('实验需要你继续。', 760, 900, S3, { size: 32, stroke: 'rgba(232,236,242,.6)', color: '#e8ecf2' });
    }
  }
  const F = A * sstep(31.6, 32.0, t);
  typeText('权威主义', 540, 860, { ...big, size: 80, weight: 900 }, prog(t, 31.7, 32.5), F);
  typeText('把对错，交给穿制服的人', 540, 970, { size: 36, weight: 500, font: SERIF, align: 'center', color: '#f0a0a0', spread: 4 }, prog(t, 32.3, 33.3), F);
}

// ======================================================================== ③ 换个条件：数字会变
function sceneCond(t) {
  if (t < COND - .3 || t > REDO + .2) return;
  const A = sstep(COND - .1, COND + .5, t) * (1 - sstep(REDO - .6, REDO - .05, t));
  if (A <= 0) return;
  const bk = 1 - E.out(((t - COND) / BEAT) % 1);
  text('按到 450 伏的比例', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(37.7, 38.2, t) * (1 - sstep(48.6, 49.0, t)) });
  ctx.save(); ctx.translate(540, 640); ctx.scale(1 + .03 * bk, 1 + .03 * bk);
  text('服从会传染，反抗也会', 0, 0, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#7fe3d3', alpha: A * sstep(48.9, 49.4, t), glow: `rgba(${T_RGB},.5)`, blur: 16 }); ctx.restore();
  const base = 1120;
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, base); ctx.lineTo(930, base); ctx.stroke(); ctx.restore();
  [[270, 65, '白大褂在场', 37.9, '#f0a0a0', '229,72,77'], [540, 20, '只打电话', 41.1, '#ffd2a0', O_RGB], [810, 10, '两人先拒绝', 45.1, '#7fe3d3', T_RGB]].forEach(([x, v, lab, t0, col, rgb]) => {
    const k = E.out(prog(t, t0, t0 + 1.0)), a = A * sstep(t0, t0 + .3, t), h = 4.2 * v * k;
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${rgb},.85)`; ctx.shadowColor = `rgba(${rgb},.5)`; ctx.shadowBlur = 16; ctx.fillRect(x - 70, base - h, 140, h); ctx.restore();
    text(`约 ${v}%`, x, base - h - 30, { font: SERIF, size: 40, weight: 900, align: 'center', color: col, alpha: a * sstep(.6, 1, k) });
    text(lab, x, base + 44, { font: SANS, size: 28, align: 'center', color: CREAM, alpha: a });
  });
  coat(270, 1260, .55, A * sstep(37.9, 38.2, t));
  const ph = A * sstep(41.1, 41.4, t);
  if (ph > 0) { ctx.save(); ctx.globalAlpha = ph; ctx.strokeStyle = '#ffd2a0'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(515, 1215); ctx.quadraticCurveTo(540, 1195, 565, 1215); ctx.stroke(); ctx.beginPath(); ctx.roundRect(510, 1215, 14, 30, 5); ctx.roundRect(556, 1215, 14, 30, 5); ctx.stroke(); ctx.restore(); }
  person(780, 1270, .55, A * sstep(45.1, 45.4, t), '#7fe3d3'); person(840, 1270, .55, A * sstep(45.1, 45.4, t), '#7fe3d3');
}

// ======================================================================== ④ 重做：2009 年，到 150 伏为止
function sceneRedo(t) {
  if (t < REDO - .3 || t > RESP + .2) return;
  const A = sstep(REDO - .1, REDO + .5, t) * (1 - sstep(RESP - .7, RESP - .1, t));
  if (A <= 0) return;
  text('一直有争议', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: CREAM, alpha: A * sstep(53.7, 54.2, t) * (1 - sstep(57.6, 58.0, t)) });
  text('2009 · 重做', 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: '#ffd2a0', alpha: A * sstep(58.0, 58.5, t), glow: `rgba(${O_RGB},.4)`, blur: 14 });
  const tl = E.io(prog(t, 54.2, 55.2));
  text('1963', 300, 820, { font: LAT, size: 64, weight: 700, align: 'center', color: '#9aa3b2', alpha: A });
  drawOn(() => { ctx.moveTo(400, 806); ctx.lineTo(680, 806); }, 280, tl, ORANGE, 4, A);
  text('2009', 780, 820, { font: LAT, size: 64, weight: 700, align: 'center', color: '#ffd2a0', alpha: A * sstep(54.9, 55.3, t) });
  text('有人怀疑电击是假的 · 实验员没完全照脚本', 540, 900, { font: SANS, size: 24, align: 'center', color: '#6f7786', alpha: A * sstep(55.4, 55.9, t) * (1 - sstep(57.6, 58.0, t)) });
  board(A * sstep(58.0, 58.5, t), 3 * E.io(prog(t, 58.6, 60.0)), t, { y: 1000, stop: sstep(60.0, 60.5, t) });
  text('约 70% 还愿意继续', 540, 1250, { font: SERIF, size: 44, weight: 900, align: 'center', color: '#f0a0a0', alpha: A * sstep(61.0, 61.5, t), glow: 'rgba(229,72,77,.4)', blur: 14 });
}

// ======================================================================== ⑤ 谁的责任：第一个说“不”
function sceneResp(t) {
  if (t < RESP - .2 || t > CLIMAX + .3) return;
  const A = sstep(RESP + .2, RESP + 1.0, t) * (1 - sstep(CLIMAX - .4, CLIMAX + .1, t));
  if (A <= 0) return;
  const hd = (s, t0, t1, col, gl) => text(s, 540, 640, { font: SERIF, size: 52, weight: 900, align: 'center', color: col, alpha: A * sstep(t0, t0 + .5, t) * (t1 ? 1 - sstep(t1, t1 + .4, t) : 1), glow: gl, blur: 14 });
  hd('拿身份压你的时候', 64.5, 67.6, CREAM);
  hd('出了事，是谁的责任？', 67.9, 71.9, '#ffd2a0');
  hd('第一个说「不」的人', 72.3, 76.0, '#7fe3d3', `rgba(${T_RGB},.4)`);
  hd('米尔格拉姆写道：', 76.4, 0, CREAM);
  const cf = 1 - .6 * sstep(72.3, 74.0, t);
  coat(540, 960, 1.25, A * cf * sstep(64.6, 65.2, t), '#9aa3b2');
  const order = [2, 1, 3, 0, 4];
  [180, 360, 540, 720, 900].forEach((x, i) => {
    const turn = sstep(72.4 + order.indexOf(i) * .7, 72.8 + order.indexOf(i) * .7, t);
    person(x, 1250, 1.0, A * sstep(64.8 + i * .12, 65.2 + i * .12, t), turn > .5 ? '#7fe3d3' : '#c3cad6');
    if (i === 2) pill('不', x, 1080, A * turn, { size: 34, stroke: `rgba(${T_RGB},.8)`, color: '#7fe3d3', glow: `rgba(${T_RGB},.4)` });
  });
  const q = A * sstep(68.0, 68.5, t) * (1 - sstep(71.9, 72.3, t));
  if (q > 0) for (const x of [180, 360, 720, 900]) drawOn(() => { ctx.moveTo(540, 1010); ctx.lineTo(x, 1130); }, 400, E.io(prog(t, 68.0, 68.8)), 'rgba(236,230,218,.35)', 2, q);
}

// ======================================================================== ⑥ 良心：手离开开关
function sceneHeart(t) {
  if (t < CLIMAX - .1) return;
  const A = sstep(CLIMAX - .1, CLIMAX + .2, t);
  const fl = 1 - prog(t, CLIMAX, CLIMAX + .6);
  if (t > CLIMAX && fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.38 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fl2 = 1 - prog(t, FINAL, FINAL + .7);
  if (t > FINAL && fl2 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,226,190,${.32 * fl2 * fl2})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const fin = sstep(FINAL, FINAL + 1.5, t);
  warmth(A * (1 + .5 * fin), 540, 1060, 760);
  const off = E.io(prog(t, CLIMAX + 1.0, CLIMAX + 3.0));
  coat(540, 1120, 2.1, A * .35 * (1 - off), '#6f7786');
  board(A * (1 - .5 * fin), 9 * (1 - off), t, { y: 1150 });
  person(540, 1090, 1.3, A, '#ffd2a0');
  glow(540, 1040, 16 * (1 + .5 * fin) * (1 + .08 * Math.sin(t * 3)), O_RGB, A * (.4 + .6 * off), 6);
  const qa = 1 - sstep(92.7, 93.3, t);
  typeText('普通人，只是在做自己的工作，', 540, 430, { ...big, size: 48, weight: 900 }, prog(t, CLIMAX + .3, CLIMAX + 1.5), qa);
  typeText('也可能成为', 540, 524, { ...big, size: 52, weight: 900 }, prog(t, CLIMAX + 1.6, CLIMAX + 2.2), qa);
  typeText('「可怕之事」的一环。', 540, 620, { ...big, size: 62, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, CLIMAX + 2.3, CLIMAX + 3.2), qa);
  typeText('—— 米尔格拉姆（大意）', 540, 698, { size: 26, weight: 500, font: SANS, align: 'center', color: DIM, ls: 4, spread: 5 }, prog(t, CLIMAX + 3.4, CLIMAX + 4.0), qa);
  typeText('服从之前，', 540, 480, { ...big, size: 56, weight: 700 }, prog(t, 93.4, 94.4), 1);
  typeText('先问良心。', 540, 596, { ...big, size: 84, weight: 900, glow: `rgba(${O_RGB},.5)`, glowBlur: 40 }, prog(t, FINAL, FINAL + .9), 1);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneTest(t); sceneTitle(t); sceneCoat(t); sceneCond(t); sceneRedo(t); sceneResp(t); sceneHeart(t);
}
function SAMPLES(T) {
  if ((T > 7.9 && T < 9.2) || (T > 14.8 && T < LIFT + 1.2)) return 4;
  if ((T > CLIMAX - .2 && T < CLIMAX + 1.4) || (T > FINAL - .2 && T < FINAL + 1.2)) return 5;
  return 3;
}
function BLOOM_K(T) { return .42 + .18 * win(T, LIFT, LIFT + 4, .2, .8) + .1 * win(T, 72.4, 76, .5, .5) + .22 * win(T, CLIMAX, TOTAL, .2, 1) + .12 * win(T, FINAL, TOTAL, .2, 1); }
function OVER(T) {
  stamp('1963', 'Milgram · J Abnorm Soc Psychol', 8.2, 35.3, T);
  stamp('1974', 'Milgram · Obedience to Authority', 37.6, 52.9, T);
  stamp('2009', 'Burger · American Psychologist', 57.9, 63.4, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(46);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .2 }; });
}

// ======================================================================== 音效提示表（音高都在 F 小调里，最后一个和弦是 F 大调）
const NOTE = { F3: 174.61, Ab3: 207.65, A3: 220.00, C4: 261.63, F4: 349.23, Ab4: 415.30, A4: 440.00, C5: 523.25, F5: 698.46, Ab5: 830.61, A5: 880.00, C6: 1046.50 };
const FM_SHIM = [NOTE.Ab5, NOTE.C5, NOTE.F5, NOTE.F4, NOTE.C4], FMAJ_SHIM = [NOTE.A5, NOTE.C5, NOTE.F5, NOTE.F4, NOTE.C4], FM_SWELL = [43.65, 65.41, 87.31, 103.83, 130.81];
function CUES() {
  const c = [];
  for (let i = 1; i < 8; i++) c.push([.5 + i * 1.0, 'click', { gain: .1 + .01 * i }]);
  c.push([1.6, 'tink', { f: NOTE.Ab5, gain: .04 }]);
  [Q.c3, Q.c2, Q.c1].forEach(t => c.push([t, 'tick', { gain: .55 }]));
  c.push([Q.REVEAL, 'whoosh', { dur: .5, gain: .22 }], [Q.REVEAL + .05, 'chord', { f: [NOTE.F3, NOTE.Ab3, NOTE.C4], gain: .22 }], [Q.REVEAL + .1, 'tink', { f: NOTE.C5, gain: .1 }]);
  c.push([11.0, 'dust', { dur: 1.6, gain: .06 }], [13.7, 'tink', { f: NOTE.F5, gain: .05 }]);
  c.push([LIFT - 1.33, 'riser', { dur: 1.33, gain: .38 }], [LIFT, 'boom', { gain: .55 }], [LIFT, 'whoosh', { dur: .9, gain: .32 }], [LIFT + .1, 'shimmer', { f: FM_SHIM, gain: .28 }]);
  c.push([20.6, 'tink', { f: NOTE.C5, gain: .06 }], [24.1, 'drone', { dur: 3.2, gain: .05 }], [29.4, 'thunk', { gain: .14 }], [29.45, 'crack', { gain: .06 }], [31.7, 'page', { gain: .18 }]);
  c.push([COND, 'whoosh', { dur: .5, gain: .25 }], [37.9, 'bar', { f0: 174, f1: 349, dur: 1.0, gain: .08 }], [41.1, 'bar', { f0: 174, f1: 233, dur: 1.0, gain: .08 }], [45.1, 'bar', { f0: 174, f1: 196, dur: 1.0, gain: .08 }]);
  c.push([49.0, 'chord', { f: [NOTE.F3, NOTE.Ab3, NOTE.C4], gain: .1 }], [49.1, 'tink', { f: NOTE.C6, gain: .07 }]);
  c.push([REDO, 'whoosh', { dur: .5, gain: .22 }], [54.2, 'swish', { gain: .07 }], [58.6, 'click', { gain: .12 }], [59.3, 'click', { gain: .12 }], [60.0, 'stop', { gain: .1 }], [61.0, 'thud', { gain: .1 }]);
  c.push([64.6, 'tink', { f: NOTE.Ab4, gain: .06 }], [68.0, 'drone', { dur: 3.0, gain: .04 }]);
  [72.4, 73.1, 73.8, 74.5, 75.2].forEach((t, i) => c.push([t, 'tink', { f: [NOTE.C5, NOTE.F5, NOTE.A4, NOTE.C6, NOTE.A5][i], gain: .06 }]));
  c.push([76.4, 'page', { gain: .2 }], [76.6, 'swell', { dur: CLIMAX - 76.6, f: FM_SWELL, gain: .28 }]);
  c.push([CLIMAX, 'boom', { gain: .6 }], [CLIMAX, 'shimmer', { f: FM_SHIM, gain: .42 }], [CLIMAX + .4, 'air', { dur: 10, hum: 87.31, gain: .14 }]);
  for (let i = 0; i < 5; i++) c.push([CLIMAX + 1.2 + i * .4, 'click', { gain: .08 }]);
  c.push([FINAL - 2.6, 'revcym', { dur: 2.6, gain: .28 }], [FINAL, 'boom', { gain: .5 }], [FINAL, 'shimmer', { f: FMAJ_SHIM, gain: .45 }], [FINAL + .1, 'chord', { f: [NOTE.F3, NOTE.A3, NOTE.C4], gain: .2 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
