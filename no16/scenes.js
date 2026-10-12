// ======================================================================== No.16 犬儒主义：看透一切的人，真的更聪明吗？
// 第三季·主义 ③。开头是一道选择题：空钱包和装了钱的钱包，哪个更容易被还回来？（Cohn et al., 2019, Science）
// 音乐：参考 BGM 从第 0 秒一直放到结尾，不剪不断（110 BPM）。剧情跟着原曲本身的起伏走：
//   0–17.41 前奏（测试）；17.41 全编制进入（标题）；约 79–112 原曲自己回落（盔甲、钱包、灯）；112.62 原曲重新爆发（罗曼·罗兰）。
const BEAT = 60 / 110, BAR = BEAT * 4;
const DROP = 17.41, REBUILD = 112.62, TOTAL = 121.0;
const SECTIONS = [['钱包测试', 0, DROP], ['第欧根尼', DROP, 40.2], ['看透', 40.2, 62.0], ['代价', 62.0, 78.6], ['盔甲', 78.6, 98.4], ['依然爱它', 98.4, TOTAL]];
const SERIES = '黑猫不说话 · 心理学 No.16';

const LINES = [
  [0.15, 3.4, '研究者在 40 个国家，「丢」了 1.7 万个钱包。'],
  [3.7, 6.9, '有的空着，有的装了钱。哪种更容易被还回来？'],
  [7.2, 9.7, '先在心里选一个。'],
  [10.1, 12.2, '装了钱的，被还回来的反而更多。'],
  [12.5, 14.1, '钱越多，还的人越多。'],
  [14.3, 17.0, '大多数人都猜错了——包括经济学家。'],
  [17.8, 21.0, '为什么我们总把人想得更坏？'],
  [21.4, 25.0, '「犬儒」这个词，要从两千多年前的第欧根尼说起。'],
  [25.3, 29.0, '他住在一只大陶罐里，被人叫作「狗」。'],
  [29.3, 33.4, '亚历山大大帝来看他，问他想要什么。'],
  [33.7, 36.6, '他只说：「请别挡住我的阳光。」'],
  [36.9, 40.0, '他还在大白天提着灯，说自己在找一个「人」。'],
  [40.3, 44.0, '古代的犬儒，看不起虚伪的规矩。'],
  [44.3, 48.0, '今天的犬儒，变成了：谁都别信，人都是自私的。'],
  [48.4, 52.0, '很多人觉得，这样「看透」的人更聪明。'],
  [52.3, 56.4, '心理学家分析了 30 个国家、约 20 万人的数据：'],
  [56.7, 61.6, '越愤世嫉俗的人，在认知能力测试里，得分反而更低。'],
  [62.0, 65.8, '另一项追踪研究发现：'],
  [66.1, 71.2, '越不相信别人的人，之后九年的收入，涨得越少。'],
  [71.5, 75.6, '研究者认为：不信任，让他们错过了很多合作的机会。'],
  [75.9, 78.4, '犬儒，其实是一副盔甲。'],
  [79.4, 83.6, '怕被骗，所以先不相信任何人。'],
  [84.0, 88.4, '盔甲挡住了伤害，也挡住了所有的善意。'],
  [88.9, 92.8, '可那些钱包告诉我们：'],
  [93.2, 97.8, '大多数陌生人，比你以为的更诚实。'],
  [98.6, 102.8, '两千多年前，第欧根尼提着灯找「人」。'],
  [103.1, 107.6, '今天，那一个个被还回去的钱包，就是回答。'],
  [108.0, 112.0, '罗曼·罗兰写过：'],
  [116.4, 120.7, '评论区：最近一次，陌生人的善意打动你，是什么时候？'],
];

// ======================================================================== 共用
function space() {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, '#11161f'); g.addColorStop(.55, '#080a11'); g.addColorStop(1, '#020305');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
let STARS = [], ASPHALT, FIELD = [];
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
const STAR_A = track([[0, 0], [17.3, 0], [18, .3], [21, .3], [22, 0], [40.4, 0], [42, .25], [88, .25], [90, .15], [108, .3], [REBUILD, .3], [REBUILD + .4, 1.1], [TOTAL, 1.1]]);
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
function you(x, y, t, a = 1, r = 9) {
  if (a <= 0) return;
  const pulse = (t * .75) % 1;
  ctx.save(); ctx.globalAlpha = a * (1 - pulse) * .45; ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, r + 4 + pulse * 44, 0, TAU); ctx.stroke(); ctx.restore();
  glow(x, y, r, O_RGB, a, 6);
}
const big = { align: 'center', spread: 3, blur: 14, rise: 18 };

// ======================================================================== ① 钱包测试（0–17.41）
// 俯视的一只钱包：皮面、缝线、对折线；有钱的从上沿露出几张钞票
function wallet(x, y, rot, sc, cash, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.save(); ctx.globalAlpha *= .55; ctx.fillStyle = '#000'; ctx.filter = 'blur(14px)'; ctx.beginPath(); ctx.roundRect(-150, -96, 312, 214, 24); ctx.fill(); ctx.restore();
  for (let i = 0; i < cash; i++) {                                                 // 钞票
    const r = mulberry(70 + i), dx = (i - (cash - 1) / 2) * 34 + (r() - .5) * 16, lift = 46 + r() * 22 + (cash > 3 ? 14 : 0), rr = (r() - .5) * .22 + Math.sin(t * 2.4 + i) * .025;
    ctx.save(); ctx.translate(dx, -lift); ctx.rotate(rr);
    ctx.fillStyle = i % 2 ? '#8fb79a' : '#a9c9a4'; ctx.strokeStyle = 'rgba(30,60,40,.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-118, -62, 236, 124, 6); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,80,55,.45)'; ctx.beginPath(); ctx.ellipse(0, -10, 34, 34, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }
  const g = ctx.createLinearGradient(-150, -105, 150, 105); g.addColorStop(0, '#74492b'); g.addColorStop(1, '#3f2716');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-150, -102, 300, 204, 22); ctx.fill();
  ctx.strokeStyle = 'rgba(20,10,4,.8)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.setLineDash([9, 7]); ctx.strokeStyle = 'rgba(236,210,170,.38)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-136, -88, 272, 176, 14); ctx.stroke(); ctx.setLineDash([]);
  const f = ctx.createLinearGradient(-14, 0, 14, 0); f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(.5, 'rgba(0,0,0,.4)'); f.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = f; ctx.fillRect(-14, -102, 28, 204);
  const s = ctx.createLinearGradient(0, -102, 0, 0); s.addColorStop(0, 'rgba(255,230,200,.16)'); s.addColorStop(1, 'rgba(255,230,200,0)');
  ctx.fillStyle = s; ctx.beginPath(); ctx.roundRect(-150, -102, 300, 100, [22, 22, 0, 0]); ctx.fill();
  ctx.restore();
}
const W_REVEAL = 10.0, W_C = 12.4;
const P_A = track([[0, 300], [W_C, 300], [W_C + .6, 220]]), P_B = track([[0, 780], [W_C, 780], [W_C + .6, 540]]);
function sceneWallets(t) {
  if (t > DROP + .3) return;
  const push = E.inExpo(prog(t, 16.6, DROP)), fade = 1 - sstep(16.9, DROP, t);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + 1.4 * push, 1 + 1.4 * push); ctx.translate(-540, -900); ctx.globalAlpha = fade;
  ctx.globalAlpha = .55 * fade; ctx.drawImage(ASPHALT, 0, 0); ctx.globalAlpha = fade;   // 路面
  ctx.setLineDash([60, 46]); ctx.lineDashOffset = 0; ctx.strokeStyle = 'rgba(230,200,120,.22)'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(540, 380); ctx.lineTo(540, 1300); ctx.stroke(); ctx.setLineDash([]);
  ctx.globalAlpha = fade;
  // 问题：第一帧就在
  const qOut = sstep(13.9, 14.3, t);
  typeText('你觉得，哪个钱包', 540, 560, { ...big, size: 62, weight: 700 }, 1, 1 - qOut);
  typeText('更容易被还回来？', 540, 660, { ...big, size: 82, weight: 900, color: ORANGE, glow: `rgba(${O_RGB},.35)`, glowBlur: 30 }, 1, 1 - qOut);
  typeText('大多数人都猜错了。', 540, 580, { ...big, size: 76, weight: 900, color: ORANGE, glow: `rgba(${O_RGB},.4)`, glowBlur: 30 }, prog(t, 14.35, 15.0), 1);
  typeText('包括经济学家。', 540, 676, { ...big, size: 46, weight: 700 }, prog(t, 15.1, 15.7), 1);
  // 钱包：开场时“啪”地落地；揭晓时往上收，下面升起柱子
  const up = E.io(prog(t, W_REVEAL - .2, W_REVEAL + .5)), wy = lerp(905, 790, up), ws = lerp(1, .62, up);
  const drop = (t0) => 1 + .1 * (1 - E.outExpo(prog(t, t0, t0 + .35)));
  wallet(P_A(t), wy, -.1, ws * drop(-.25), 0, t);
  wallet(P_B(t), wy, .08, ws * drop(-.05), 3, t);
  const cIn = E.outExpo(prog(t, W_C, W_C + .6));
  if (t > W_C) wallet(lerp(1100, 860, cIn), wy, .12, ws * (1.06 - .06 * cIn), 7, t, sstep(W_C, W_C + .2, t));
  // 标签
  const la = 1 - sstep(W_REVEAL - .3, W_REVEAL, t);
  pill('A · 空钱包', P_A(t), 1105, la, { size: 30 });
  pill('B · 装了钱', P_B(t), 1105, la, { size: 30, stroke: `rgba(${O_RGB},.6)` });
  // 倒数 3 · 2 · 1
  ['3', '2', '1'].forEach((s, i) => {
    const t0 = 7.2 + i * .9, u = prog(t, t0, t0 + .88); if (u <= 0 || u >= 1) return;
    const sc = 1.5 - .5 * E.outExpo(u * 2.5), al = 1 - sstep(.6, 1, u);
    const bg = ctx.createRadialGradient(540, 905, 0, 540, 905, 200); bg.addColorStop(0, `rgba(6,8,12,${.85 * al})`); bg.addColorStop(1, 'rgba(6,8,12,0)'); ctx.fillStyle = bg; ctx.fillRect(320, 680, 440, 460);
    ctx.save(); ctx.translate(540, 905); ctx.scale(sc, sc);
    text(s, 0, 0, { font: LAT, size: 220, weight: 600, align: 'center', color: CREAM, alpha: al, glow: 'rgba(255,240,220,.4)', blur: 30 });
    ctx.restore();
  });
  // 柱状图：空钱包 40%、装 13 美元 51%、装 94 美元 72%（另一组实验）
  const base = 1262, unit = 4.5;
  const bars = [[P_A(t), 40, W_REVEAL + .1, '空钱包', 'rgba(200,206,216,.75)'], [P_B(t), 51, W_REVEAL + .4, '装了 13 美元', ORANGE]];
  if (t > W_C) bars.push([lerp(1100, 860, cIn), 72, W_C + .5, '装了 94 美元', '#ffc27a']);
  bars.forEach(([x, v, t0, lab, col]) => {
    const k = E.outExpo(prog(t, t0, t0 + .9)); if (k <= 0) return;
    const h = v * unit * k;
    ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = .9 * fade; if (col !== 'rgba(200,206,216,.75)') { ctx.shadowColor = col; ctx.shadowBlur = 24; }
    ctx.beginPath(); ctx.roundRect(x - 70, base - h, 140, h, [10, 10, 0, 0]); ctx.fill(); ctx.restore();
    text(`${Math.round(v * k)}%`, x, base - h - 46, { font: LAT, size: 66, weight: 600, align: 'center', color: col === 'rgba(200,206,216,.75)' ? CREAM : col, alpha: fade });
    text(lab, x, base + 36, { font: SANS, size: 26, weight: 500, align: 'center', color: '#aab2c0', alpha: fade * sstep(t0, t0 + .4, t) });
  });
  if (t > W_C + .5) text('另一组实验 · 3 个国家', lerp(1100, 860, cIn), base + 70, { font: SANS, size: 20, weight: 500, align: 'center', color: '#6f7786', alpha: fade * sstep(W_C + .8, W_C + 1.2, t) });
  ctx.restore();
}

// ======================================================================== ② 标题
function sceneTitle(t) {
  if (t < DROP - .05 || t > 21.8) return;
  const e = E.outExpo(prog(t, DROP, DROP + .9)), out = sstep(21.0, 21.7, t), sc = (1.45 - .45 * e) * (1 + .06 * out);
  ctx.save(); ctx.translate(540, 900); ctx.scale(sc, sc); ctx.translate(-540, -900);
  ctx.filter = e < .97 ? `blur(${((1 - e) * 18).toFixed(1)}px)` : 'none';
  text('犬儒主义', 540, 900, { size: 166, weight: 900, align: 'center', ls: 30, alpha: sstep(DROP, DROP + .15, t) * (1 - out), glow: 'rgba(255,225,190,.25)', blur: 40 });
  ctx.restore();
  seriesTag(712, sstep(DROP + .4, DROP + 1.1, t) * (1 - out));
  typeText('CYNICISM', 540, 1046, { size: 46, weight: 600, font: LAT, ls: 30, color: DIM, align: 'center', spread: 3 }, prog(t, DROP + .5, DROP + 1.5), 1 - out);
  typeText('第三季 · 主义 ③', 540, 1118, { size: 28, weight: 500, ls: 10, color: '#6f7786', align: 'center', spread: 4 }, prog(t, DROP + 1.1, DROP + 2.0), 1 - out);
}

// ======================================================================== ③ 第欧根尼：陶罐、亚历山大的影子、白天的灯
const JAR = [560, 1000];
function sun(t, a, x = 830, y = 520) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, 900); g.addColorStop(0, `rgba(255,200,130,${.35 * a})`); g.addColorStop(.25, `rgba(255,170,90,${.12 * a})`); g.addColorStop(1, 'rgba(255,170,90,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.translate(x, y); ctx.rotate(t * .05);
  for (let i = 0; i < 14; i++) { ctx.rotate(TAU / 14); const gr = ctx.createLinearGradient(0, 0, 520, 0); gr.addColorStop(0, `rgba(255,214,160,${.12 * a})`); gr.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(520, -40); ctx.lineTo(520, 40); ctx.lineTo(0, 10); ctx.fill(); }
  ctx.restore();
  glow(x, y, 58, '255,214,160', a, 2.2);
}
function jar(t, a, lit) {
  if (a <= 0) return;
  const k = E.io(prog(t, 21.5, 23.0));
  ctx.save(); ctx.globalAlpha *= a;
  const [cx, cy] = JAR;
  const body = () => { ctx.moveTo(cx - 250, cy - 62); ctx.bezierCurveTo(cx - 200, cy - 66, cx - 190, cy - 128, cx - 110, cy - 150); ctx.bezierCurveTo(cx + 40, cy - 190, cx + 250, cy - 150, cx + 262, cy); ctx.bezierCurveTo(cx + 250, cy + 150, cx + 40, cy + 190, cx - 110, cy + 150); ctx.bezierCurveTo(cx - 190, cy + 128, cx - 200, cy + 66, cx - 250, cy + 62); };
  ctx.save(); ctx.globalAlpha *= k; const g = ctx.createRadialGradient(cx + 60, cy - 70, 20, cx, cy, 300); g.addColorStop(0, `rgba(196,128,70,${.55 * lit + .15})`); g.addColorStop(1, `rgba(90,52,28,${.5 * lit + .2})`);
  ctx.fillStyle = g; ctx.beginPath(); body(); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a120c'; ctx.beginPath(); ctx.ellipse(cx - 252, cy, 22, 62, 0, 0, TAU); ctx.fill(); ctx.restore();
  drawOn(() => { body(); }, 1500, k, `rgba(236,${Math.round(lerp(190, 214, lit))},170,.85)`, 3);
  drawOn(() => ctx.ellipse(cx - 252, cy, 22, 62, 0, 0, TAU), 300, k, 'rgba(236,214,170,.85)', 3);
  [-.45, 0, .45].forEach((u, i) => drawOn(() => ctx.ellipse(cx + 40 + u * 120, cy, 60 + 120 * (1 - Math.abs(u)), 165 - 30 * Math.abs(u), 0, -PI / 2, PI / 2), 520, E.io(prog(t, 22.4 + i * .1, 23.2 + i * .1)), 'rgba(236,214,170,.2)', 2));
  // 坐在罐口的第欧根尼
  const fa = sstep(23.0, 23.6, t);
  ctx.globalAlpha = a * fa; ctx.fillStyle = '#120d09';
  ctx.beginPath(); ctx.arc(cx - 318, cy - 34, 26, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 356, cy + 70); ctx.quadraticCurveTo(cx - 360, cy - 4, cx - 318, cy - 6); ctx.quadraticCurveTo(cx - 278, cy - 4, cx - 280, cy + 70); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = `rgba(255,214,160,${.5 * lit + .15})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx - 318, cy - 34, 26, -1.2, .6); ctx.stroke();
  ctx.restore();
  typeText('κύων', 540, 1240, { size: 44, weight: 500, font: LAT, style: 'italic', align: 'center', color: '#d8c79f', ls: 4, spread: 2 }, prog(t, 26.2, 26.9), a * (1 - sstep(28.8, 29.3, t)));
  typeText('“狗”', 540, 1292, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 6, spread: 2 }, prog(t, 26.6, 27.2), a * (1 - sstep(28.8, 29.3, t)));
}
function alexander(t) {                                                           // 戴羽冠头盔的身影和它投下的长影子
  const inK = E.io(prog(t, 29.3, 30.8)), outK = E.io(prog(t, 33.9, 35.2)), a = sstep(29.3, 29.9, t) * (1 - sstep(34.6, 35.4, t));
  if (a <= 0) return 0;
  const x = lerp(1200, 860, inK) + 360 * outK, y = 1010;
  ctx.save(); ctx.globalAlpha = a * .75; ctx.fillStyle = '#05040a';                // 影子盖住陶罐
  ctx.beginPath(); ctx.moveTo(x - 30, y + 160); ctx.lineTo(x + 30, y + 160); ctx.lineTo(JAR[0] - 320, y + 140); ctx.lineTo(JAR[0] - 340, y + 40); ctx.closePath(); ctx.filter = 'blur(10px)'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#07060b'; ctx.strokeStyle = 'rgba(255,200,140,.55)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y - 250, 34, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 36, y - 262); ctx.quadraticCurveTo(x - 10, y - 345, x + 54, y - 300); ctx.quadraticCurveTo(x + 10, y - 300, x - 36, y - 262); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 62, y - 200); ctx.lineTo(x + 62, y - 200); ctx.lineTo(x + 46, y + 160); ctx.lineTo(x - 46, y + 160); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 86, y - 360); ctx.lineTo(x + 86, y + 160); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,200,140,.45)'; ctx.stroke();
  ctx.restore();
  return a * (1 - outK);
}
function lantern(t, x, y, a, col = '255,200,120') {
  if (a <= 0) return;
  const sw = Math.sin(t * 1.6) * .12;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - 120); ctx.rotate(sw); ctx.translate(0, 120);
  ctx.strokeStyle = 'rgba(236,222,196,.85)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, -120); ctx.lineTo(0, -70); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -78, 10, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(40, -60); ctx.lineTo(34, 60); ctx.lineTo(-34, 60); ctx.closePath(); ctx.stroke();
  for (const dx of [-14, 14]) { ctx.beginPath(); ctx.moveTo(dx, -60); ctx.lineTo(dx * .85, 60); ctx.stroke(); }
  ctx.restore();
  glow(x + Math.sin(sw) * 120, y + 2, 16, col, a * (.85 + .15 * Math.sin(t * 9)), 9);
}
function sceneDiogenes(t) {
  if (t < 20.8 || t > 44.6) return;
  const day = win(t, 21.0, 40.6, .9, .9);
  ctx.save(); ctx.globalAlpha = day * .55; const bg = ctx.createLinearGradient(0, 300, 0, 1600); bg.addColorStop(0, '#3a2a18'); bg.addColorStop(1, '#120d09'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); ctx.restore();
  const shade = alexander(t);
  sun(t, day * (1 - .7 * shade) * (1 + .5 * win(t, 34.0, 36.6, .4, .8)));
  jar(t, sstep(21.3, 21.8, t) * (1 - sstep(36.4, 37.2, t)), 1 - .8 * shade);
  // 大白天提着灯
  const la = sstep(36.9, 37.6, t) * (1 - sstep(43.6, 44.4, t));
  lantern(t, lerp(380, 640, E.io(prog(t, 36.9, 41.0))), 820, la, t < 40.3 ? '255,200,120' : `${Math.round(lerp(255, 120, prog(t, 40.3, 42)))},${Math.round(lerp(200, 200, 0))},${Math.round(lerp(120, 220, prog(t, 40.3, 42)))}`);
  typeText('ἄνθρωπον ζητῶ', 540, 1060, { size: 44, weight: 500, font: LAT, style: 'italic', align: 'center', color: '#d8c79f', ls: 3, spread: 3 }, prog(t, 37.6, 38.6), la * (1 - sstep(40.2, 40.8, t)));
  typeText('我在找一个人', 540, 1112, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 8, spread: 4 }, prog(t, 38.1, 39.0), la * (1 - sstep(40.2, 40.8, t)));
  // 古代的犬儒：看不起虚伪的规矩——一行行“规矩”被划掉
  ['体面', '名声', '财富', '规矩'].forEach((w, i) => {
    const t0 = 40.6 + i * .45, a = sstep(t0, t0 + .3, t) * (1 - sstep(43.8, 44.4, t)); if (a <= 0) return;
    const x = 540 + (i - 1.5) * 190, y = 1080;
    text(w, x, y, { size: 44, weight: 700, align: 'center', color: '#c9b79a', alpha: a });
    const k = E.out(prog(t, t0 + .35, t0 + .6)); if (k > 0) seg(x - 56, y + 4, x - 56 + 112 * k, y - 4, '#e5484d', 4, a);
  });
}

// ======================================================================== ④ 今天的犬儒：弹幕
const DANMU = ['都是套路', '别信', '装的吧', '人都是自私的', '谁信谁傻', '肯定有目的', '又在演', '早看透了', '无利不起早', '别太天真'];
function sceneDanmu(t) {
  if (t < 43.8 || t > 49.4) return;
  const A = sstep(43.9, 44.5, t) * (1 - sstep(48.4, 49.2, t));
  DANMU.forEach((s, i) => {
    const r = mulberry(200 + i), lane = i, sp = 220 + r() * 160, t0 = 43.9 + r() * 1.2;
    const x = W - 80 - r() * 620 - (t - t0) * sp, y = 480 + lane * 78; if (t < t0) return;
    font(40, 700, SANS); const w = ctx.measureText(s).width;
    if (x + w < -40 || x > W + 80) return;
    text(s, x, y, { font: SANS, size: 40, weight: 700, color: i % 3 ? '#9fb8c4' : '#c7d2dc', alpha: A * .9, glow: 'rgba(0,0,0,.8)', blur: 12 });
  });
}

// ======================================================================== ⑤ 看透的人更聪明？（犬儒天才错觉）
function figure(x, y, a, cross, col = '#d8dde6') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.fillStyle = 'rgba(255,255,255,.04)';
  ctx.beginPath(); ctx.arc(x, y - 110, 34, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 56, y + 90); ctx.quadraticCurveTo(x - 62, y - 60, x, y - 62); ctx.quadraticCurveTo(x + 62, y - 60, x + 56, y + 90); ctx.stroke();
  ctx.beginPath();
  if (cross) { ctx.moveTo(x - 50, y - 10); ctx.lineTo(x + 34, y + 14); ctx.moveTo(x + 50, y - 10); ctx.lineTo(x - 34, y + 14); }
  else { ctx.moveTo(x - 50, y - 30); ctx.lineTo(x - 110, y - 70); ctx.moveTo(x + 50, y - 30); ctx.lineTo(x + 110, y - 70); }
  ctx.stroke(); ctx.restore();
}
const SCAT = Array.from({ length: 170 }, (_, i) => { const r = mulberry(400 + i); const c = r(); return { c, s: clamp(.78 - .45 * c + (r() + r() + r() - 1.5) * .28, .04, .98), d: r() }; });
function sceneGenius(t) {
  if (t < 48.0 || t > 62.6) return;
  const A1 = sstep(48.2, 48.8, t) * (1 - sstep(52.0, 52.6, t));
  if (A1 > 0) {
    typeText('谁更聪明？', 540, 560, { ...big, size: 72, weight: 900 }, prog(t, 48.4, 49.1), A1);
    figure(330, 900, A1, true); figure(750, 900, A1, false, '#e8d9c0');
    pill('看透一切的人', 330, 1080, A1, { size: 28 }); pill('愿意相信的人', 750, 1080, A1, { size: 28 });
    const bulb = sstep(49.6, 50.1, t);
    glow(330, 720, 14, '255,236,170', A1 * bulb, 7);
    text('“他肯定更聪明”', 330, 650, { font: SANS, size: 26, weight: 500, align: 'center', color: '#c9cfd8', alpha: A1 * sstep(50.0, 50.5, t) });
  }
  // 散点图：横轴愤世嫉俗程度，纵轴认知测试得分；趋势向下（示意）
  const A2 = sstep(52.3, 52.9, t) * (1 - sstep(61.8, 62.5, t));
  if (A2 <= 0) return;
  const x0 = 170, x1 = 930, y0 = 1180, y1 = 560;
  ctx.save(); ctx.globalAlpha = A2; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, y1 - 20); ctx.lineTo(x0, y0); ctx.lineTo(x1 + 20, y0); ctx.stroke(); ctx.restore();
  text('愤世嫉俗程度 →', x1, y0 + 44, { font: SANS, size: 26, weight: 500, align: 'right', color: '#aab2c0', alpha: A2 });
  ctx.save(); ctx.translate(x0 - 36, y1 + 10); ctx.rotate(-PI / 2); text('认知测试得分 →', 0, 0, { font: SANS, size: 26, weight: 500, align: 'right', color: '#aab2c0', alpha: A2 }); ctx.restore();
  SCAT.forEach(p => {
    const k = sstep(52.7 + p.d * 2.8, 53.0 + p.d * 2.8, t); if (k <= 0) return;
    glow(lerp(x0 + 20, x1, p.c), lerp(y0 - 20, y1, p.s), 4, p.c > .6 ? '200,206,216' : C_RGB, A2 * k * .9, 2.5);
  });
  const lk = E.io(prog(t, 56.8, 58.2));
  if (lk > 0) { ctx.save(); ctx.shadowColor = `rgba(${O_RGB},.8)`; ctx.shadowBlur = 16; seg(x0 + 20, lerp(y0 - 20, y1, .76), lerp(x0 + 20, x1, lk), lerp(y0 - 20, y1, .76 - .45 * lk), ORANGE, 4, A2); ctx.restore(); }
  text('示意图', x1, y1 - 40, { font: SANS, size: 22, weight: 500, align: 'right', color: 'rgba(138,147,163,.6)', alpha: A2 });
  text('越愤世嫉俗，得分越低', 560, y1 + 30, { size: 34, weight: 700, align: 'center', color: ORANGE, alpha: A2 * sstep(58.0, 58.6, t), glow: 'rgba(0,0,0,.9)', blur: 14 });
}

// ======================================================================== ⑥ 代价：收入、盔甲
function sceneIncome(t) {
  if (t < 61.8 || t > 76.6) return;
  const A = sstep(62.0, 62.6, t) * (1 - sstep(75.6, 76.4, t));
  const x0 = 170, x1 = 930, y0 = 1160, y1 = 600;
  ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = 'rgba(236,230,218,.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, y1 - 20); ctx.lineTo(x0, y0); ctx.lineTo(x1 + 20, y0); ctx.stroke(); ctx.restore();
  for (let yr = 0; yr <= 9; yr += 3) text(`第 ${yr} 年`, lerp(x0, x1, yr / 9), y0 + 40, { font: SANS, size: 24, weight: 500, align: 'center', color: '#8a93a3', alpha: A });
  ctx.save(); ctx.translate(x0 - 36, y1 + 10); ctx.rotate(-PI / 2); text('收入 →', 0, 0, { font: SANS, size: 26, weight: 500, align: 'right', color: '#aab2c0', alpha: A }); ctx.restore();
  const k = E.io(prog(t, 66.2, 70.6));
  const curve = (u, g) => [lerp(x0, x1, u), lerp(1060, 1060 - g, u) - Math.sin(u * 7 + g) * 6];
  for (const [g, col, lab, ly] of [[380, TEAL, '愿意相信别人', -1], [150, '#9aa2b0', '愤世嫉俗', 1]]) {
    ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round'; if (col === TEAL) { ctx.shadowColor = `rgba(${T_RGB},.7)`; ctx.shadowBlur = 14; }
    ctx.beginPath(); for (let u = 0; u <= k + 1e-6; u += .01) { const [x, y] = curve(u, g); u === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
    const [ex, ey] = curve(k, g);
    if (k > .02) text(lab, ex - 10, ey + ly * 40, { font: SANS, size: 26, weight: 700, align: 'right', color: col, alpha: A * sstep(.15, .3, k) });
  }
  text('示意图', x1, y1 - 40, { font: SANS, size: 22, weight: 500, align: 'right', color: 'rgba(138,147,163,.6)', alpha: A });
  // 错过的合作：橙色的小光点飞向灰线的末端，被弹开
  for (let i = 0; i < 6; i++) {
    const t0 = 71.6 + i * .55, u = prog(t, t0, t0 + 1.2); if (u <= 0 || u >= 1) continue;
    const [ex, ey] = curve(1, 150), r = mulberry(600 + i), sx = ex - 260 + r() * 80, sy = ey - 240 + r() * 120;
    const inK = E.out(clamp(u * 2)), outK = E.in(clamp(u * 2 - 1));
    const x = lerp(sx, ex - 20, inK) + (r() - .2) * 160 * outK, y = lerp(sy, ey - 10, inK) - 160 * outK;
    glow(x, y, 5, O_RGB, A * (1 - outK), 4);
  }
}
const HEX = Array.from({ length: 6 }, (_, i) => i * TAU / 6 - PI / 2);
function sceneArmor(t) {
  if (t < 75.6 || t > 90.0) return;
  const A = sstep(75.8, 76.4, t) * (1 - sstep(88.6, 89.6, t)), cx = 540, cy = 880;
  you(cx, cy, t, A, 10);
  HEX.forEach((a0, i) => {                                                        // 六块甲片一块块合上
    const k = E.outExpo(prog(t, 75.95 + i * .16, 76.6 + i * .16)); if (k <= 0) return;
    const r = lerp(420, 150, k), a1 = a0 + TAU / 6;
    ctx.save(); ctx.globalAlpha = A * k; ctx.fillStyle = 'rgba(120,132,150,.16)'; ctx.strokeStyle = 'rgba(190,200,215,.8)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r); ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
    ctx.lineTo(cx + Math.cos(a1) * (r - 40), cy + Math.sin(a1) * (r - 40)); ctx.lineTo(cx + Math.cos(a0) * (r - 40), cy + Math.sin(a0) * (r - 40)); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  });
  // 外面飞来的东西：暗红的（伤害）和暖色的（善意），都被弹开
  for (let i = 0; i < 24; i++) {
    const r = mulberry(800 + i), t0 = 79.4 + i * .36, u = prog(t, t0, t0 + 1.6); if (u <= 0 || u >= 1) continue;
    const ang = r() * TAU, good = i % 2 === 1 || t > 84;
    const d = u < .5 ? lerp(560, 160, E.out(u * 2)) : lerp(160, 560, E.in(u * 2 - 1)), sp = u < .5 ? 0 : (r() - .5) * .8 * (u * 2 - 1);
    glow(cx + Math.cos(ang + sp) * d, cy + Math.sin(ang + sp) * d, 7, good ? '255,196,120' : '220,80,80', A * (1 - u * .8), 5);
    if (Math.abs(u - .5) < .05) { ctx.save(); ctx.globalAlpha = A * .5; ctx.strokeStyle = '#dfe6f0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 152, ang - .2, ang + .2); ctx.stroke(); ctx.restore(); }
  }
}

// ======================================================================== ⑦ 那些钱包：一片暗着的点，一半以上慢慢亮起来
const FCOLS = 46, FROWS = 38;
function sceneField(t) {
  if (t < 88.4 || t > TOTAL) return;
  const A = sstep(88.6, 89.8, t);
  const rise = E.in(prog(t, 109.5, REBUILD)), burst = E.outExpo(prog(t, REBUILD, REBUILD + 2.4)), fadeAll = 1 - sstep(REBUILD + 1.2, REBUILD + 3.4, t);
  const lamp = [lerp(260, 820, E.ioSine(prog(t, 98.6, 106.5))), 600 + 40 * Math.sin(t * .7)];
  ctx.save();
  for (const p of FIELD) {
    const lit = sstep(p.t, p.t + .5, t) * (p.on ? 1 : 0);
    let x = p.x, y = p.y - rise * (120 + 300 * p.r);
    if (t > REBUILD) { x += Math.cos(p.a) * burst * 900 * p.r; y += Math.sin(p.a) * burst * 900 * p.r - burst * 300; }
    const near = Math.exp(-((x - lamp[0]) ** 2 + (y - lamp[1]) ** 2) / (2 * 230 * 230)) * win(t, 98.8, 107.5, 1, 1);
    const al = A * fadeAll * (lit ? .5 + .5 * lit + .6 * near : .14);
    ctx.globalAlpha = Math.min(1, al); ctx.fillStyle = lit ? '#ffc58a' : '#8a93a3';
    ctx.fillRect(x - 5, y - 3.5, 10, 7);
  }
  ctx.restore();
  stamp('17,303', 'wallets · 355 cities · 40 countries', 88.9, 97.8, t);
  text('装了钱的钱包：51% 被还了回来', 540, 1250, { font: SANS, size: 26, weight: 500, align: 'center', color: '#c9cfd8', alpha: A * win(t, 92.6, 98.2, .6, .6) });
  lantern(t, lamp[0], lamp[1], win(t, 98.6, 108.4, .8, 1.2));
}

// ======================================================================== ⑧ 罗曼·罗兰
function sceneEnd(t) {
  if (t < REBUILD - .1) return;
  const fl = 1 - prog(t, REBUILD, REBUILD + .5);
  if (fl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,214,170,${.35 * fl * fl})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  typeText('世上只有一种英雄主义：', 540, 680, { ...big, size: 52, weight: 700 }, prog(t, REBUILD + .2, REBUILD + 1.1), 1);
  typeText('看清这个世界，', 540, 800, { ...big, size: 76, weight: 900 }, prog(t, REBUILD + 1.2, REBUILD + 1.9), 1);
  typeText('「然后依然爱它。」', 540, 924, { ...big, size: 96, weight: 900, glow: `rgba(${O_RGB},.45)`, glowBlur: 36 }, prog(t, REBUILD + 2.2, REBUILD + 3.0), 1);
  typeText('—— 罗曼·罗兰《米开朗琪罗传》', 540, 1040, { size: 24, weight: 500, font: SANS, align: 'center', color: DIM, ls: 3, spread: 5 }, prog(t, REBUILD + 3.2, REBUILD + 4.0), 1);
  const yy = 1170;
  for (let k = 0; k < 4; k++) {
    const u = prog(t, REBUILD + 1 + k * BAR, REBUILD + 1 + k * BAR + 2.2); if (u <= 0 || u >= 1) continue;
    ctx.save(); ctx.globalAlpha = (1 - u) * .5; ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(540, yy, 14 + 200 * E.out(u), 0, TAU); ctx.stroke(); ctx.restore();
  }
  you(540, yy, t, sstep(REBUILD + .6, REBUILD + 1.2, t) * (1 - sstep(TOTAL - 1.2, TOTAL, t)), 10);
}

// ======================================================================== 世界层
function WORLD(t) {
  space();
  starfield(t, STAR_A(t));
  sceneWallets(t); sceneTitle(t); sceneDiogenes(t); sceneDanmu(t); sceneGenius(t); sceneIncome(t); sceneArmor(t); sceneField(t); sceneEnd(t);
}
function SAMPLES(T) {
  if (T < .6 || (T > 9.8 && T < 13.4) || (T > 16.4 && T < DROP + 1.2)) return 4;
  if (T > REBUILD - .2 && T < REBUILD + 2.6) return 5;
  if (T > 43.8 && T < 49.2) return 4;
  return 3;
}
function BLOOM_K(T) { return .42 + .2 * win(T, DROP, 21, .2, .6) + .15 * win(T, 21, 40.4, 1, 1) + .25 * win(T, REBUILD, 118, .2, 2); }
function OVER(T) {
  stamp('2019', 'Cohn et al. · Science', 10.1, 16.6, T);
  stamp('Diogenes', 'Diogenes Laërtius · Book VI', 21.4, 40.0, T);
  stamp('2019', 'Stavrova & Ehlebracht · PSPB', 52.3, 61.6, T);
  stamp('2016', 'Stavrova & Ehlebracht · JPSP', 62.0, 75.6, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const r = mulberry(16);
  STARS = Array.from({ length: 700 }, () => { const b = Math.pow(r(), 3); return { x: r() * W, y: r() * H, z: .35 + r() * .65, b: .22 + .78 * b, s: .8 + 2.0 * b, tw: .6 + r() * 2.2, ph: r() * TAU, warm: r() < .18 }; });
  ASPHALT = mk(W, H); const g = ASPHALT.getContext('2d'), im = g.createImageData(W, H), d = im.data, ra = mulberry(5);
  for (let i = 0; i < W * H; i++) { const v = 20 + ra() * 26 + (ra() < .02 ? 40 : 0); d[i * 4] = v; d[i * 4 + 1] = v + 1; d[i * 4 + 2] = v + 4; d[i * 4 + 3] = 255; }
  g.putImageData(im, 0, 0);
  const rf = mulberry(17);
  FIELD = [];
  for (let j = 0; j < FROWS; j++) for (let i = 0; i < FCOLS; i++) {
    const on = rf() < .51;
    FIELD.push({ x: 90 + i * (900 / (FCOLS - 1)), y: 480 + j * (700 / (FROWS - 1)), on, t: 89.8 + rf() * 7.6, r: rf(), a: rf() * TAU });
  }
}

// ======================================================================== 音效提示表
const NOTE = { C5: 523.25, Eb5: 622.25, F5: 698.46, Ab5: 830.61, Bb5: 932.33, C6: 1046.5, Eb6: 1244.5, F6: 1396.9 };
function CUES() {
  const c = [];
  c.push([0, 'slap', { gain: .7, pan: -.4 }], [0.08, 'slap', { gain: .75, pan: .4 }]);
  c.push([7.2, 'tick', { gain: .6 }], [8.1, 'tick', { gain: .6 }], [9.0, 'tick', { gain: .6 }], [9.9, 'tink', { f: NOTE.C6, gain: .3 }]);
  c.push([W_REVEAL + .1, 'bar', { f0: 260, f1: 520, gain: .5, pan: -.4 }], [W_REVEAL + .4, 'bar', { f0: 330, f1: 700, gain: .55, pan: .4 }]);
  c.push([W_C, 'whoosh', { dur: .6, gain: .4 }], [W_C + .1, 'slap', { gain: .6, pan: .6 }], [W_C + .5, 'bar', { f0: 392, f1: 1046, gain: .6, pan: .6 }]);
  c.push([14.35, 'boom', { gain: .45 }], [DROP - 1.2, 'riser', { dur: 1.2, gain: .5 }], [DROP, 'boom', { gain: .85 }], [DROP, 'whoosh', { dur: .9, gain: .45 }]);
  c.push([21.5, 'shimmer', { gain: .35 }], [23.0, 'swell', { dur: 1.2, gain: .25 }], [29.3, 'air', { dur: 4.6, gain: .25 }], [34.0, 'shimmer', { gain: .4 }], [36.9, 'tink', { f: NOTE.Ab5, gain: .3 }]);
  ['体面', '名声', '财富', '规矩'].forEach((_, i) => c.push([40.95 + i * .45, 'swish', { dur: .25, gain: .25 }]));
  for (let i = 0; i < 6; i++) c.push([44.1 + i * .55, 'swish', { dur: .5, gain: .22 }]);
  c.push([49.6, 'tink', { f: NOTE.F6, gain: .25 }], [52.7, 'dust', { dur: 3.0, gain: .25 }], [56.8, 'bar', { f0: 880, f1: 330, dur: 1.4, gain: .4 }]);
  c.push([66.2, 'swish', { dur: 1.0, gain: .25 }]);
  for (let i = 0; i < 6; i++) c.push([71.6 + i * .55 + .6, 'click', { gain: .3 }]);
  c.push([75.95, 'chain', { gain: .55 }], [79.2, 'air', { dur: 9, gain: .22 }]);
  const pent = [NOTE.F5, NOTE.Ab5, NOTE.Bb5, NOTE.C6, NOTE.Eb6, NOTE.F6];
  for (let i = 0; i < 18; i++) c.push([90.0 + i * .42, 'tink', { f: pent[(i * 3) % pent.length], gain: .12 }]);
  c.push([98.6, 'shimmer', { gain: .35 }], [108.0, 'swell', { dur: REBUILD - 108, gain: .35 }]);
  c.push([REBUILD, 'boom', { gain: .85 }], [REBUILD, 'shimmer', { gain: .6 }], [REBUILD + 2.2, 'chord', { f: [NOTE.F5, NOTE.Ab5, NOTE.C6], gain: .3 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
