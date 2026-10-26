// ======================================================================== No.50 高敏感人群：不是你太敏感，是你感受得更多（第一期“真实照片 + 黑猫 + 对话框”）
// 从这一期起换成参考视频那样的做法：画面是真实照片（频道主从 Pexels / Pixabay 下载的免费素材，在 photos/ 里），
// 照片放在竖屏中间的宽画框里，上下是黑的；黑猫画进照片里，故事全靠对话框和角色配音，没有旁白。
// 角色：小黑（主角，高敏感；品牌黑猫，左眼橙、右眼青）、阿橘（同事，大大咧咧）、学姐（懂心理学的朋友）、老板（只在画面外说一句）。
// 结构：早上（街上太吵）→ 公司（老板一句“先这样吧”）→ 晚上（一个人反复想）→ 是什么 → 怎么来的 → 怎么办（学姐讲）→ 第二天（公园充电）。
// 没有片头（meta.json "intro": false）：第一帧就是封面“人一多就累，一句话能想一整天”。片尾和水印保留。
// 时间：画面里的时间写成 D(i) + 秒数（第 i 句台词开始之后），时间轴由 layout.py 按配音的真实长度排出来。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 150.4;
const SECTIONS = [['早上', 0.0, 16.0], ['公司', 16.0, 32.0], ['晚上', 32.0, 41.6], ['是什么', 41.6, 89.6], ['怎么来的', 89.6, 112.0], ['怎么办', 112.0, 131.2], ['第二天', 131.2, 150.4]];
const LINES = [];                                                   // 没有旁白
const DIALOG = [
  [0.30, 8.08, '好吵……喇叭声、脚步声、有人在打电话，全挤进我脑子里了。', '黑', 'think'],
  [8.48, 10.15, '快点快点，绿灯了！', '橘', 'say'],
  [10.40, 12.58, '你不觉得……这里太吵了吗？', '黑', 'say'],
  [12.78, 14.22, '有吗？还好吧。', '橘', 'say'],
  [16.40, 17.90, '嗯……先这样吧。', '板', 'say'],
  [18.40, 21.96, '他刚才是不是叹气了？是不是我做得不好？', '黑', 'think'],
  [22.36, 24.32, '你怎么了？脸色这么差。', '橘', 'say'],
  [24.52, 27.54, '老板刚才那句话，语气好像不太对。', '黑', 'say'],
  [27.84, 30.34, '你想太多了吧。你就是太敏感了。', '橘', 'say'],
  [32.40, 35.37, '一整天的每一句话，都在脑子里重播。', '黑', 'think'],
  [35.97, 38.22, '我是不是……太脆弱了？', '黑', 'think'],
  [42.00, 43.22, '又在想白天的事？', '姐', 'say'],
  [43.47, 46.24, '嗯。大家都说我太敏感了。', '黑', 'say'],
  [46.59, 53.02, '敏感不是毛病。心理学家专门研究过像你这样的人，叫「高敏感人群」。', '姐', 'say'],
  [53.27, 54.01, '高敏感？', '黑', 'say'],
  [54.21, 58.50, '有研究估计，差不多每五个人里，就有一个是这样的。', '姐', 'say'],
  [58.85, 62.03, '你们的大脑，处理信息更深、更细。', '姐', 'say'],
  [62.23, 67.87, '别人没注意的声音、光线、一个小眼神，你都接收到了，还会反复琢磨。', '姐', 'say'],
  [68.17, 71.37, '所以我在人多的地方，特别容易累？', '黑', 'say'],
  [71.57, 76.25, '对。信息一多，就像一下子塞满了，很容易过载。', '姐', 'say'],
  [76.60, 84.85, '有个脑成像研究发现：高敏感的人看到别人开心或难过的表情，跟共情有关的脑区更活跃。', '姐', 'say'],
  [85.15, 87.94, '难怪别人一皱眉，我就跟着难受。', '黑', 'say'],
  [90.00, 92.44, '那这是怎么来的？我能改掉吗？', '黑', 'say'],
  [92.69, 98.37, '一项双胞胎研究发现，敏感程度的差别，差不多一半和基因有关。', '姐', 'say'],
  [98.62, 102.75, '它更像一种天生的特质。不是病，也不是矫情。', '姐', 'say'],
  [103.10, 110.75, '而且研究发现，高敏感的人在糟糕的环境里更容易受伤，可在好的环境里，收获也比别人多。', '姐', 'say'],
  [112.40, 113.47, '那我该怎么办？', '黑', 'say'],
  [113.72, 118.44, '累了，就找个安静的地方待一会儿。这不是逃避，是在充电。', '姐', 'say'],
  [118.74, 122.60, '人多的安排之间，提前给自己留点恢复的时间。', '姐', 'say'],
  [122.90, 127.08, '有人说你太敏感，你可以告诉他：我只是感受得比较多。', '姐', 'say'],
  [131.60, 134.03, '一大早，一个人跑公园来干嘛？', '橘', 'say'],
  [134.28, 134.85, '充个电。', '黑', 'say'],
  [135.35, 140.29, '我想明白了。我不是太脆弱，我只是……感受得比较多。', '黑', 'say'],
];
const CARDS_AT = 141.09;                                          // 最后的字卡从这里开始
// 第 i 句台词开始的时间：D(i)；结束：DE(i)
const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const SERIES = '黑猫不说话 · 心理学 No.50';
const V_LT = '#a9c4e8', A_RGB = '255,179,107', ALARM_RGB = '255,120,90';

// ======================================================================== 共用
function space() {
  const g = ctx.createRadialGradient(540, 820, 80, 540, 820, 1500);
  g.addColorStop(0, '#11141d'); g.addColorStop(.55, '#08090f'); g.addColorStop(1, '#020305');
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
function warmth(a, x = 540, y = 980, r = 900, rgb = '255,170,90') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${.16 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
const chill = (a, x, y, r) => warmth(a, x, y, r, '120,170,255');
function seriesTag(y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  font(30, 500); ctx.letterSpacing = '6px'; const w = ctx.measureText(SERIES).width; ctx.letterSpacing = '0px';
  text(SERIES, W / 2, y, { size: 30, weight: 500, align: 'center', color: ORANGE, ls: 6 });
  ctx.strokeStyle = `rgba(${O_RGB},.5)`; ctx.lineWidth = 1.5;
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(W / 2 + k * (w / 2 + 24), y); ctx.lineTo(W / 2 + k * (w / 2 + 84), y); ctx.stroke(); }
  ctx.restore();
}
function pill(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 30; font(size, o.weight || 700, SANS); const w = ctx.measureText(s).width + 56;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(o.sc || 1, o.sc || 1);
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 24; }
  ctx.fillStyle = o.fill || 'rgba(20,24,34,.9)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 1.05, w, size * 2.1, size * 1.05); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 700, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
const big = { align: 'center', spread: 3, blur: 14, rise: 18 };
function circ(x, y, r, col, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
const GOLD = '#ffd2a0', WARMC = '#ffb36b', COOL = '#7f9cc4', ICE = '#bfe0ff', TEALC = '#7fe3d3', RED = '#e5484d';
const C_RGB2 = '127,156,196', ICE_RGB = '190,225,255', W_RGB = '255,214,160';
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}
function say(s, x, y, a, col = CREAM, size = 28) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 44, h = size * 1.9;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(26,28,38,.96)'; ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, y + h / 2 - 1); ctx.lineTo(x, y + h / 2 + 14); ctx.lineTo(x + 10, y + h / 2 - 1); ctx.fill(); ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}
function thread(x1, y1, x2, y2, a, col = W_RGB, sag = 30, w = 3) {                                       // 两个人之间的一根线
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.shadowColor = `rgba(${col},.9)`; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + sag, x2, y2); ctx.stroke(); ctx.restore();
}
function pop(t, t0) { const k = prog(t, t0, t0 + .45); return k <= 0 ? 0 : 1 + .18 * Math.sin(PI * Math.min(1, k * 1.25)) * (1 - k); }
function floor(y, x0, x1, a) { seg(x0, y, x1, y, 'rgba(236,230,218,.28)', 2, a); }

// 一只坐着的黑猫（和片头、片尾那只同一个造型，缩小到 1/4）。局部坐标：脚底在 y = 30，耳朵尖在 y ≈ -106。
// o.baby：0 大猫 → 1 小奶猫（头大身小）；o.arm：伸出前爪（o.dir 朝向，o.lift / o.reach：抬多高、伸多远）；
// o.heart：胸口的光（o.beat 跳一下时变大）；o.gone：从脚往上消失；o.sq：横向压扁；o.tear：眼泪。
// 轮廓光和眼睛用这只猫自己的颜色（回避型冷蓝，爱着他的暖橙），身体是黑的。胸口在 (x, y + s * (top + 30))。
const CS = .251, CAT_PATH = (() => {                                                                  // 片头那只猫的形状（原尺寸）
  const head = new Path2D(); head.ellipse(0, -150, 108, 94, 0, 0, TAU);
  const earL = new Path2D(); earL.moveTo(-100, -190); earL.lineTo(-84, -292); earL.lineTo(-30, -232); earL.closePath();
  const earR = new Path2D(); earR.moveTo(100, -190); earR.lineTo(84, -292); earR.lineTo(30, -232); earR.closePath();
  const body = new Path2D(); body.moveTo(-62, -80); body.bezierCurveTo(-120, -20, -168, 110, -150, 210);
  body.quadraticCurveTo(-140, 248, -96, 250); body.lineTo(96, 250); body.quadraticCurveTo(140, 248, 150, 210);
  body.bezierCurveTo(168, 110, 120, -20, 62, -80); body.closePath();
  const tail = new Path2D(); tail.moveTo(120, 236); tail.bezierCurveTo(220, 250, 262, 170, 238, 96); tail.quadraticCurveTo(226, 62, 200, 70);
  return { head, earL, earR, body, tail };
})();
function catGeo(k) {                                                                                  // 小奶猫：身体缩小、头放大
  const bs = lerp(1, .74, k), hs = lerp(1, 1.14, k), bodyTop = 250 - 330 * bs, hc = bodyTop - 70 * hs;
  const f = yb => (yb - 250) * CS + 30;
  return { bs, hs, hc, hy: f(hc), hr: 94 * hs * CS, top: f(bodyTop) + 6, hw: 150 * bs * CS, bot: 30, earTop: f(hc - 142 * hs) };
}
function figDims(k) { const g = catGeo(k); return { hr: g.hr, hy: g.hy, top: g.top, hw: g.hw, bot: g.bot }; }
function chestY(y, s, k = 0) { return y + s * (figDims(k).top + 30); }
function fig(x, y, s, a, col, o = {}) {
  if (a <= 0 || s <= 0) return;
  const k = o.baby || 0, g = catGeo(k), gone = o.gone || 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s * (o.sq ?? 1), s);
  if (gone > 0) { ctx.beginPath(); ctx.rect(-300, -500, 600, 500 + lerp(g.bot + 4, g.earTop - 4, gone)); ctx.clip(); }
  ctx.save(); ctx.translate(0, 30 - 250 * CS); ctx.scale(CS, CS);                                      // 进入片头那只猫的坐标
  const lw = 3 / (Math.max(.5, s) * CS);
  const bodyT = () => { ctx.translate(0, 250); ctx.scale(g.bs, g.bs); ctx.translate(0, -250); };
  const headT = () => { ctx.translate(0, g.hc); ctx.scale(g.hs, g.hs); ctx.translate(0, 150); };     // 片头里头的中心在 y = -150
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8 / CS;
  ctx.save(); bodyT(); ctx.strokeStyle = col; ctx.lineWidth = lw * 2 + 30; ctx.stroke(CAT_PATH.tail); ctx.shadowBlur = 0;      // 尾巴：轮廓光 + 黑色
  ctx.strokeStyle = '#07080b'; ctx.lineWidth = 30; ctx.stroke(CAT_PATH.tail); ctx.restore();
  ctx.strokeStyle = col; ctx.lineWidth = lw;
  ctx.save(); bodyT(); ctx.stroke(CAT_PATH.body); ctx.restore();
  ctx.save(); headT(); ctx.stroke(CAT_PATH.head); ctx.stroke(CAT_PATH.earL); ctx.stroke(CAT_PATH.earR); ctx.restore();
  ctx.shadowBlur = 0; ctx.fillStyle = '#07080b';
  ctx.save(); bodyT(); ctx.fill(CAT_PATH.body); ctx.restore();
  ctx.save(); headT(); ctx.fill(CAT_PATH.head); ctx.fill(CAT_PATH.earL); ctx.fill(CAT_PATH.earR);
  ctx.globalAlpha *= .3; ctx.strokeStyle = CREAM; ctx.lineWidth = 1.2 / (Math.max(.5, s) * CS);       // 胡须
  for (const kx of [-1, 1]) for (const dy of [-6, 6]) { ctx.beginPath(); ctx.moveTo(kx * 50, -118 + dy * .5); ctx.lineTo(kx * 140, -126 + dy * 2); ctx.stroke(); }
  ctx.globalAlpha /= .3;
  for (const ex of [-42, 42]) {                                                                       // 眼睛：这只猫自己的颜色，竖瞳
    ctx.save(); ctx.translate(ex, -152); ctx.scale(1, 1 - .92 * (o.blink || 0)); ctx.shadowColor = o.eye || col; ctx.shadowBlur = 30;   // blink：闭眼
    ctx.beginPath(); ctx.moveTo(-24, 0); ctx.quadraticCurveTo(0, -20, 24, 0); ctx.quadraticCurveTo(0, 20, -24, 0); ctx.closePath();
    ctx.fillStyle = o.eye || col; ctx.fill(); ctx.shadowBlur = 0; ctx.clip();
    ctx.fillStyle = '#050505'; ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 15, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(-7, -5, 3, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  // 回到猫的局部坐标（脚底 y = 30）：前爪、眼泪
  if (o.arm > .12) {                                                                                  // 爪子收回来时直接不画（不在身上留一条竖线）
    const d = o.dir || 1, ax = d * (g.hw * .55), ay = g.top + 22, ex = ax + d * (o.reach || 50) * o.arm, ey = ay + lerp(34, o.lift ?? -22, o.arm);
    ctx.save(); ctx.globalAlpha *= sstep(.12, .35, o.arm); ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 8;
    ctx.strokeStyle = col; ctx.lineWidth = 11 / Math.max(.5, s); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.shadowBlur = 0; ctx.strokeStyle = '#07080b'; ctx.lineWidth = 6 / Math.max(.5, s); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
  }
  if (o.tear > 0) { ctx.save(); ctx.globalAlpha *= o.tear * (1 - sstep(.75, 1, o.tearY)); ctx.fillStyle = ICE; ctx.shadowColor = ICE; ctx.shadowBlur = 8;
    ctx.translate(-42 * CS * g.hs, g.hy + 6 + 10 * o.tearY); ctx.scale(1.5, 1.5);
    ctx.beginPath(); ctx.moveTo(0, -7); ctx.quadraticCurveTo(5.5, 2, 0, 4.5); ctx.quadraticCurveTo(-5.5, 2, 0, -7); ctx.fill(); ctx.restore(); }
  ctx.restore();
  if (o.heart > 0) {
    const cy = y + s * (g.top + 30), r = s * (4 + 3 * (o.beat || 0));
    glow(x, cy, r, o.heartRgb || '255,170,110', a * o.heart, 5 + 3 * (o.beat || 0));
  }
}
// 从脚往上消失时飘起来的碎光
function dust(x, y, s, gone, col, a, seed = 1) {
  if (gone <= 0 || a <= 0) return;
  const { hy, hr, hw, bot } = figDims(0);
  for (let i = 0; i < 46; i++) {
    const r = mulberry(seed * 97 + i), th = r() * .95; if (gone < th) continue;
    const age = (gone - th) * 2.6; if (age > 1) continue;
    const px = x + s * ((r() - .5) * 2 * hw + age * (40 + 70 * r())), py = y + s * (lerp(bot, hy - hr, th) - age * (60 + 90 * r()));
    circ(px, py, s * (1.6 + 2 * r()) * (1 - age), col, a * (1 - age) * .9);
  }
}

// 冷：身边飘着的小冰晶
function frost(cx, cy, R, a, t, seed = 5) {
  if (a <= 0) return;
  for (let i = 0; i < 36; i++) {
    const r = mulberry(seed * 31 + i), ang = r() * TAU + t * (.08 + .1 * r()) * (r() < .5 ? -1 : 1), d = R * (.55 + .6 * r());
    const x = cx + Math.cos(ang) * d, y = cy + Math.sin(ang) * d * 1.25, s = 3 + 5 * r(), tw = .5 + .5 * Math.sin(t * (1.5 + 2 * r()) + i);
    ctx.save(); ctx.globalAlpha = a * (.35 + .5 * tw); ctx.strokeStyle = ICE; ctx.lineWidth = 1.4; ctx.translate(x, y); ctx.rotate(r() * PI);
    ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.rotate(PI / 3); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); } ctx.stroke(); ctx.restore();
  }
}

// 警报：从胸口一圈一圈扩散出去的光环；k 越大，圈越密、越亮、越红
function alarm(x, y, s, k, t, a = 1) {
  if (k <= 0 || a <= 0) return;
  const rate = lerp(.7, 2.6, k), n = 4;
  for (let i = 0; i < n; i++) {
    const p = ((t * rate + i / n) % 1), r = s * (12 + 150 * p);
    ctx.save(); ctx.globalAlpha = a * k * (1 - p) * .8; ctx.strokeStyle = `rgb(${k > .6 ? ALARM_RGB : A_RGB})`; ctx.lineWidth = 3 + 3 * k;
    ctx.shadowColor = `rgba(${ALARM_RGB},.9)`; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore();
  }
  glow(x, y, s * (5 + 4 * k * (.5 + .5 * Math.sin(t * rate * TAU))), k > .6 ? ALARM_RGB : '255,170,110', a, 6);
}

// 想法：一朵小云（没有尖角的气泡）
function thought(s, x, y, a, size = 30, col = CREAM) {
  if (a <= 0) return;
  font(size, 700, SANS); const w = ctx.measureText(s).width + 48, h = size * 2;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(30,32,42,.94)'; ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  for (const [dx, dy, r] of [[-w * .3, h * .62, 7], [-w * .38, h * .95, 4.5]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, TAU); ctx.fill(); ctx.stroke(); }
  ctx.restore();
  text(s, x, y + 1, { font: SANS, size, weight: 700, align: 'center', color: col, alpha: a });
}

// ======================================================================== 这一期：真实照片 + 黑猫 + 对话框
// 画面像参考视频那样：中间一块宽画框放照片，上下是黑的；黑猫画在照片里（照片坐标），对话框跟着说话的那只猫。
const FR = { x: 0, y: 470, w: 1080, h: 960 }, ASP = FR.w / FR.h;
const PHOTO_FILES = ['street', 'office', 'bedroom_dark', 'livingroom', 'bedroom_lamp', 'park_fog', 'park_bench'];
const PH = {};
for (const n of PHOTO_FILES) { const im = new Image(); im.src = `photos/${n}.jpg`; PH[n] = im; }
function ASSETS_READY() { return PHOTO_FILES.every(n => PH[n].complete && PH[n].naturalWidth > 0); }
// 角色：小黑（主角，品牌黑猫：左眼橙、右眼青）、阿橘（同事，橙色轮廓）、学姐（淡紫轮廓）
const CAST = {
  黑: { col: '#e9e3d6', eyeL: '#f2a14a', eyeR: '#4fd6c4', name: '小黑' },
  橘: { col: '#ffb36b', eyeL: '#ffb36b', eyeR: '#ffb36b', name: '阿橘' },
  姐: { col: '#c9b6f2', eyeL: '#c9b6f2', eyeR: '#c9b6f2', name: '学姐' },
  板: { name: '老板' },
};
// 一只猫：左右两半分别画（只有眼睛颜色不同）；light：场景的光色，混进轮廓里一点
function catP(who, x, feet, s, a, o = {}) {
  const c = CAST[who]; if (a <= 0) return;
  const rim = o.light ? mixc(c.col, o.light, .35) : c.col;
  // 接触阴影
  ctx.save(); ctx.globalAlpha *= a * .6; ctx.fillStyle = '#000'; ctx.filter = `blur(${Math.max(1, 5 * s)}px)`;
  ctx.beginPath(); ctx.ellipse(x + 4 * s, feet + 1.5 * s, 46 * s, 7 * s, 0, 0, TAU); ctx.fill(); ctx.restore();
  for (const [side, eye] of [[-1, c.eyeL], [1, c.eyeR]]) {
    ctx.save(); ctx.beginPath(); ctx.rect(side < 0 ? x - 4000 : x, -4000, 4000, 12000); ctx.clip();
    fig(x, feet - 30 * s, s, a, rim, { ...o, eye });
    ctx.restore();
  }
}
const headY = (feet, s) => feet - 30 * s + s * (figDims(0).hy - 6);           // 头的中心（照片坐标）

// ---------------------------------------------------------------- 镜头：每个镜头一张照片，裁切框 [x, y, w]（照片像素）随时间推拉
const XF = .7;                                                                   // 镜头之间的交叉淡化
let SHOTS = [];
function cropAt(sh, t) {
  const k = sh.keys ? null : E.io(prog(t, sh.t0, sh.t1));
  let [x, y, w] = sh.keys ? sh.keys.map(tr => tr(t)) : sh.a.map((v, i) => lerp(v, sh.b[i], k));
  const im = PH[sh.img], W0 = im.naturalWidth || 2000, H0 = im.naturalHeight || 2000;
  w = Math.min(w, W0, H0 * ASP); const h = w / ASP;
  x = clamp(x, 0, W0 - w); y = clamp(y, 0, H0 - h);
  return { x, y, w, h, k: FR.w / w };
}
const toScreen = (c, px, py) => [FR.x + (px - c.x) * c.k, FR.y + (py - c.y) * c.k];

// ---------------------------------------------------------------- 对话框
function wrapText(s, size, maxW) {
  font(size, 900, SANS); const out = []; let cur = '';
  for (const ch of s) { if (ctx.measureText(cur + ch).width > maxW && cur && !'，。？！、…」：；'.includes(ch)) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
// kind：say 白色椭圆；think 淡蓝的“想”泡泡（尾巴是三个小圆点）；ax, ay：说话的那只猫的头（屏幕坐标）；off：画面外说话的人
function bubble(str, kind, ax, ay, a, o = {}) {
  if (a <= 0) return;
  const size = 34, lh = 46, lines = wrapText(str.replace(/[「」]/g, ''), size, 640);
  font(size, 900, SANS); const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
  const w = tw + 110, h = lines.length * lh + 58;
  let bx = clamp(ax + (o.dx || 0), w / 2 + 24, W - w / 2 - 24), by = ay - h / 2 - 70;
  by = clamp(by, 400 + h / 2, H - h / 2 - 220);
  const sc = .86 + .14 * E.outQuint(clamp(a * 1.6));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(bx, by); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 6;
  ctx.fillStyle = kind === 'think' ? 'rgba(214,224,238,.95)' : '#f3efe8';
  ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)';
  const dx = ax - bx, dy = ay - by, L0 = Math.hypot(dx, dy) || 1, ux = dx / L0, uy = dy / L0;
  if (kind === 'think') {                                                        // 三个小圆点飘向头
    for (const [k, r] of [[.62, 11], [.78, 7.5], [.9, 5]]) { const d = Math.min(L0 - 20, (h / 2 + 30) / Math.max(.4, Math.abs(uy) + .2) * k);
      ctx.beginPath(); ctx.arc(ux * d, uy * d, r, 0, TAU); ctx.fill(); }
  } else if (!o.noTail) {                                                        // 尖尾巴指向说话的那只
    const ex = ux * (w / 2) * .55, ey = uy * (h / 2) * .9, tip = Math.min(L0 * .55, 64);
    ctx.beginPath(); ctx.moveTo(ex - uy * 16, ey + ux * 16); ctx.lineTo(ex + ux * tip, ey + uy * tip); ctx.lineTo(ex + uy * 16, ey - ux * 16); ctx.closePath(); ctx.fill();
  }
  lines.forEach((l, i) => text(l, 0, (i - (lines.length - 1) / 2) * lh + 2, { font: SANS, size, weight: 900, align: 'center', color: '#1d1e24' }));
  if (o.name) { pill(o.name, -w / 2 + 70, -h / 2 - 6, 1, { size: 22, color: '#1d1e24', fill: 'rgba(236,230,218,.95)', stroke: 'rgba(0,0,0,0)' }); }
  ctx.restore();
}

// ---------------------------------------------------------------- 每个镜头里的猫（照片坐标）
function castIn(sh, t) {
  switch (sh.name) {
    case 'street': {
      const jx = Math.sin(t * 31) * 2 * win(t, D(0) + .5, D(1), .3, .4);              // 太吵：画面微微发颤
      return [{ who: '黑', x: 690 + jx, feet: 1955, s: 1.75, light: '#c9d6dc', heart: .35 },
              { who: '橘', x: track([[0, 1000], [D(1) - .2, 1000], [D(1) + .5, 1060], [D(3) + .3, 1060], [S['公司'], 1180]])(t), feet: 1925, s: 1.6, light: '#c9d6dc', arm: win(t, D(1), D(1) + 1.6, .2, .3), dir: -1 }];
    }
    case 'office': return [{ who: '黑', x: 650, feet: 1645, s: 1.85, light: '#e6e6e6', heart: .4, beat: .4 * win(t, D(5), D(6), .3, .5) },
                           { who: '橘', x: 290, feet: 1915, s: 2.15, light: '#e6e6e6' }];
    case 'bedroom_dark': return [{ who: '黑', x: 960, feet: 1335, s: 1.95, light: '#ffd9a8', heart: .35 }];
    case 'livingroom': {
      const jin = t < sh.t0 + 2 ? E.out(prog(t, sh.t0 + .2, sh.t0 + 1.6)) : 1;                // 学姐从右边走进来
      return [{ who: '黑', x: 560, feet: 1905, s: 1.95, light: '#9fb8e6', heart: .4 + .4 * win(t, D(21), D(22), .4, .6) },
              { who: '姐', x: sh.name === 'livingroom' && sh.enter ? lerp(1720, 1160, jin) : 1160, feet: 1925, s: 1.95, light: '#ffcf8f', heart: .6 }];
    }
    case 'bedroom_lamp': return [{ who: '黑', x: 610, feet: 1560, s: 1.6, light: '#ffd6a8', heart: .6, blink: win(t, D(27) + 1.6, D(28) + 3, .5, .5) }];
    case 'park_fog': return [{ who: '黑', x: 1010, feet: 1036, s: 1.15, light: '#ffe2b0', heart: .7 },
                             { who: '橘', x: track([[0, -120], [sh.t0 + .2, -120], [D(30) + .8, 430]])(t), feet: 1520, s: 1.6, light: '#ffe2b0' }];
    case 'park_bench': return [{ who: '黑', x: 965, feet: 850, s: .78, light: '#ffe0a0', heart: .9 }];
  }
  return [];
}
function drawShot(sh, t, a) {
  if (a <= 0) return null;
  const c = cropAt(sh, t), im = PH[sh.img];
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  ctx.translate(FR.x - c.x * c.k, FR.y - c.y * c.k); ctx.scale(c.k, c.k);
  if (im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0);
  if (sh.dim) { ctx.fillStyle = `rgba(0,0,0,${sh.dim(t)})`; ctx.fillRect(c.x, c.y, c.w, c.h); }
  const cast = castIn(sh, t);
  const hide = sh.name === 'livingroom' ? 1 - win(t, D(25) + 2.0, D(26) + .2, .4, .4) : 1;     // 讲“糟糕 / 好的环境”时，场景里的猫先藏起来
  for (const m of cast) catP(m.who, m.x, m.feet + (m.bob || 0), m.s, hide, { light: m.light, heart: m.heart || 0, beat: m.beat || 0, arm: m.arm || 0, dir: m.dir || 1, reach: 40, lift: -20, blink: m.blink || 0 });
  ctx.restore();
  return { c, cast: cast.map(m => ({ ...m, head: toScreen(c, m.x, headY(m.feet, m.s)), sx: toScreen(c, m.x, m.feet)[0], sy: toScreen(c, m.x, m.feet)[1], ss: m.s * c.k })) };
}

// ---------------------------------------------------------------- 画框里的小图示（讲知识时）
function glyphSound(x, y, a) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x - 18, y, 10 + i * 10, -PI / 4, PI / 4); ctx.stroke(); } ctx.restore(); }
function glyphLight(x, y, a) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.fillStyle = GOLD; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill();
  for (let i = 0; i < 8; i++) { const th = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(th) * 17, y + Math.sin(th) * 17); ctx.lineTo(x + Math.cos(th) * 26, y + Math.sin(th) * 26); ctx.stroke(); } ctx.restore(); }
function glyphEye(x, y, a) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = TEALC; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.quadraticCurveTo(x, y - 22, x + 26, y); ctx.quadraticCurveTo(x, y + 22, x - 26, y); ctx.stroke();
  ctx.fillStyle = TEALC; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.restore(); }
function dimFrame(a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(6,7,10,.8)'; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore(); }
function overlays(t, info) {
  const me = info && info.cast.find(m => m.who === '黑');
  // 高敏感人群（学姐说出这个词）
  const hs = win(t, D(13) + 3.6, D(14) + .9, .3, .4);
  if (hs > 0) { dimFrame(.6 * hs); const k = E.outExpo(prog(t, D(13) + 3.6, D(13) + 4.6));
    ctx.save(); ctx.translate(540, 640); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k));
    text('高敏感人群', 0, 0, { font: SERIF, size: 104, weight: 900, align: 'center', color: GOLD, alpha: hs, glow: `rgba(${O_RGB},.55)`, blur: 30 });
    text('Highly Sensitive Person', 0, 88, { font: LAT, style: 'italic', weight: 500, size: 40, align: 'center', color: CREAM, alpha: hs }); ctx.restore(); }
  // 每五个人里就有一个
  const fv = win(t, D(15) + 1.4, D(16) + .3, .3, .4);
  if (fv > 0) { dimFrame(.8 * fv);
    for (let i = 0; i < 5; i++) { const lit = i === 2 && t > D(15) + 2.6, x = 220 + i * 160;
      fig(x, 650, 1.1, fv * (lit ? 1 : .55), lit ? GOLD : '#7d8494', { heart: lit ? .9 : 0, eye: lit ? GOLD : '#7d8494' }); }
    text('≈ 1 / 5', 540, 820, { font: SERIF, size: 84, weight: 900, align: 'center', color: GOLD, alpha: fv * sstep(D(15) + 2.6, D(15) + 2.9, t), glow: `rgba(${O_RGB},.5)`, blur: 22 }); }
  // 声音、光线、一个小眼神 → 都进了它的脑子；反复琢磨
  if (me) {
    const [hx, hy] = me.head, items = [[D(17) + 1.0, '声音', glyphSound, -200, -150], [D(17) + 1.9, '光线', glyphLight, 0, -230], [D(17) + 2.9, '眼神', glyphEye, 200, -150]];
    for (const [t0, s, g, dx, dy] of items) {
      const ap = sstep(t0, t0 + .3, t) * (1 - sstep(D(18) - .2, D(18) + .2, t)), fly = E.in(prog(t, D(17) + 4.4, D(17) + 5.4));
      if (ap <= 0) continue;
      const x = lerp(clamp(hx + dx, 90, 990), hx, fly), y = lerp(hy + dy, hy, fly);
      ctx.save(); ctx.globalAlpha = ap * (1 - fly * .8); ctx.fillStyle = 'rgba(14,16,22,.82)'; ctx.beginPath(); ctx.roundRect(x - 64, y - 52, 128, 104, 22); ctx.fill(); ctx.restore();
      g(x, y - 12, ap * (1 - fly * .8)); text(s, x, y + 30, { font: SANS, size: 26, weight: 900, align: 'center', color: CREAM, alpha: ap * (1 - fly * .8) });
    }
    const loop = win(t, D(17) + 5.0, D(18) + .2, .3, .3);
    if (loop > 0) { ctx.save(); ctx.globalAlpha = loop; ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.lineCap = 'round'; const r = 46, a0 = t * 4;
      ctx.beginPath(); ctx.arc(hx, hy - 120, r, a0, a0 + PI * 1.5); ctx.stroke(); const ex = hx + Math.cos(a0 + PI * 1.5) * r, ey = hy - 120 + Math.sin(a0 + PI * 1.5) * r;
      ctx.beginPath(); ctx.arc(ex, ey, 6, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore();
      text('反复琢磨', hx, hy - 200, { font: SANS, size: 30, weight: 900, align: 'center', color: GOLD, alpha: loop }); }
    // 过载：一根竖条越涨越满
    const ov = win(t, D(19) + .6, D(20) + .2, .3, .4);
    if (ov > 0) { const fill = E.io(prog(t, D(19) + .8, D(19) + 3.4)), bx = hx + 150, by = hy + 60, bh = 260;
      ctx.save(); ctx.globalAlpha = ov; ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(bx - 24, by - bh, 48, bh, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = fill > .8 ? RED : mixc('#7fe3d3', '#ffb36b', fill / .8); ctx.beginPath(); ctx.roundRect(bx - 17, by - 7 - (bh - 14) * fill, 34, (bh - 14) * fill, 8); ctx.fill(); ctx.restore();
      text('过载', bx, by - bh - 34, { font: SANS, size: 34, weight: 900, align: 'center', color: fill > .8 ? '#ff8f8f' : CREAM, alpha: ov * sstep(.7, .85, fill) }); }
    // 脑成像：跟共情有关的脑区更活跃
    const br = win(t, D(20) + 2.6, D(21) + .3, .3, .4);
    if (br > 0) { const cx = clamp(hx, 150, 930), cy = hy - 210, p = .5 + .5 * Math.sin(t * 6);
      ctx.save(); ctx.globalAlpha = br; ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.strokeStyle = 'rgba(236,230,218,.8)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(cx, cy, 120, 84, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - 80); ctx.bezierCurveTo(cx - 14, cy - 30, cx + 14, cy + 20, cx, cy + 80); ctx.stroke(); ctx.restore();
      for (const [dx, dy] of [[-52, 10], [48, -6], [-20, -38], [28, 40]]) glow(cx + dx, cy + dy, 9 + 4 * p, '255,150,120', br, 7);
      text('共情相关的脑区：更活跃', cx, cy + 124, { font: SANS, size: 30, weight: 900, align: 'center', color: '#ffb59a', alpha: br }); }
  }
  // 双胞胎：差不多一半和基因有关
  const tw = win(t, D(23) + 1.0, D(24) + .3, .3, .4);
  if (tw > 0) { dimFrame(.85 * tw);
    fig(440, 690, 1.15, tw, CAST.黑.col, { eye: CAST.黑.eyeL }); fig(640, 690, 1.15, tw, CAST.黑.col, { eye: CAST.黑.eyeL });
    text('双胞胎研究', 540, 530, { font: SANS, size: 34, weight: 700, align: 'center', color: DIM, alpha: tw });
    const g = E.io(prog(t, D(23) + 2.6, D(23) + 4.2)), y0 = 790, x0 = 180, x1 = 900;
    ctx.save(); ctx.globalAlpha = tw; ctx.fillStyle = 'rgba(236,230,218,.18)'; ctx.fillRect(x0, y0, x1 - x0, 34);
    ctx.fillStyle = GOLD; ctx.fillRect(x0, y0, (x1 - x0) * .47 * g, 34); ctx.restore();
    text('基因 ≈ 47%', x0, y0 + 70, { font: SANS, size: 36, weight: 900, color: GOLD, alpha: tw * sstep(.6, 1, g) });
    text('环境 ≈ 53%', x1, y0 + 70, { font: SANS, size: 36, weight: 900, align: 'right', color: CREAM, alpha: tw * sstep(.6, 1, g) }); }
  // 不是病，也不是矫情：是天生的特质
  const tr = win(t, D(24) + .6, D(25) + .2, .3, .4);
  if (tr > 0) { dimFrame(.8 * tr);
    [['病', D(24) + 2.0, 360, 600], ['矫情', D(24) + 2.8, 720, 600]].forEach(([s, t0, x, y]) => { const k = sstep(t0, t0 + .25, t) * tr; pill(s, x, y, k, { size: 44, color: CREAM });
      if (t > t0 + .2) seg(x - 90, y, x - 90 + 180 * E.out(prog(t, t0 + .2, t0 + .45)), y, RED, 7, tr); });
    pill('天生的特质', 540, 770, tr * sstep(D(24) + .6, D(24) + 1.0, t), { size: 50, color: '#1a1208', fill: 'rgba(255,210,150,.95)', stroke: 'rgba(0,0,0,0)', glow: `rgba(${O_RGB},.6)` }); }
  // 糟糕的环境 / 好的环境
  const ev = win(t, D(25) + 2.0, D(26) + .2, .4, .4);
  if (ev > 0) {
    dimFrame(.75 * ev); ctx.save(); ctx.globalAlpha = ev; ctx.fillStyle = 'rgba(10,12,18,.72)'; ctx.fillRect(FR.x, FR.y, FR.w / 2, FR.h);
    const g2 = ctx.createLinearGradient(540, 0, 1080, 0); g2.addColorStop(0, 'rgba(255,200,120,.18)'); g2.addColorStop(1, 'rgba(255,220,150,.36)'); ctx.fillStyle = g2; ctx.fillRect(540, FR.y, 540, FR.h); ctx.restore();
    seg(540, FR.y + 40, 540, FR.y + FR.h - 40, 'rgba(236,230,218,.4)', 2, ev);
    const bad = sstep(D(25) + 2.4, D(25) + 2.8, t) * ev, good = sstep(D(25) + 5.0, D(25) + 5.4, t) * ev;
    for (let i = 0; i < 40; i++) { const r = mulberry(70 + i), x = 30 + r() * 480, y = FR.y + ((t * (300 + 200 * r()) + r() * FR.h) % FR.h);
      seg(x, y, x - 4, y + 18, 'rgba(180,200,230,.5)', 1.5, bad); }
    fig(270, 1000, 1.5, bad, '#7d8494', { eye: '#7d8494', heart: .2 });
    text('糟糕的环境', 270, 600, { font: SANS, size: 40, weight: 900, align: 'center', color: V_LT, alpha: bad }); text('更容易受伤', 270, 655, { font: SANS, size: 32, weight: 700, align: 'center', color: CREAM, alpha: bad });
    warmth(.8 * good, 810, 920, 420); fig(810, 1000, 1.7, good, GOLD, { eye: GOLD, heart: 1 });
    text('好的环境', 810, 600, { font: SANS, size: 40, weight: 900, align: 'center', color: GOLD, alpha: good }); text('收获也更多', 810, 655, { font: SANS, size: 32, weight: 700, align: 'center', color: CREAM, alpha: good });
  }
  // 安静的角落：充电
  if (me) {
    const bt = win(t, D(27) + 3.0, D(28) + .3, .3, .4);
    if (bt > 0) { const [hx, hy] = me.head, fill = E.io(prog(t, D(27) + 3.2, D(27) + 5.0)), bx = hx, by = hy - 150;
      ctx.save(); ctx.globalAlpha = bt; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.beginPath(); ctx.roundRect(bx - 70, by - 34, 140, 68, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = CREAM; ctx.fillRect(bx + 72, by - 12, 10, 24); ctx.fillStyle = '#7fe3a0'; ctx.fillRect(bx - 62, by - 26, 124 * (.2 + .8 * fill), 52); ctx.restore();
      text('充电中', bx, by - 66, { font: SANS, size: 30, weight: 900, align: 'center', color: '#a9f0c0', alpha: bt }); }
  }
  // 人多的安排之间，留出恢复的时间
  const cal = win(t, D(28) + .4, D(29) - .4, .3, .3);
  if (cal > 0) { dimFrame(.5 * cal);
    [['上班', 0, 0], ['休息', 1, 1], ['聚餐', 2, 0], ['休息', 3, 1], ['见朋友', 4, 0]].forEach(([s, i, rest]) => {
      const k = sstep(D(28) + .5 + i * .35, D(28) + .8 + i * .35, t) * cal, x = 150 + i * 195;
      pill(s, x, 700, k, rest ? { size: 34, color: '#0e2a1b', fill: 'rgba(127,227,160,.95)', stroke: 'rgba(0,0,0,0)', glow: 'rgba(127,227,160,.6)' } : { size: 34, color: CREAM }); }); }
}

// ======================================================================== 世界层
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let info = null;
  SHOTS.forEach((sh, i) => {
    if (t < sh.t0 - XF / 2 || t > sh.t1 + XF / 2) return;
    const a = i === 0 ? 1 : sstep(sh.t0 - XF / 2, sh.t0 + XF / 2, t);
    const r = drawShot(sh, t, a); if (r && a > .5) info = r;
  });
  // 画框边缘的细线、上下的黑边
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.12)'; ctx.lineWidth = 2; ctx.strokeRect(FR.x - 1, FR.y - 1, FR.w + 2, FR.h + 2); ctx.restore();
  overlays(t, info);
  // 封面（第一帧）：画框上半部
  const hook = 1 - sstep(D(0) + 1.5, D(0) + 2.0, t);
  if (hook > 0) {
    ctx.save(); ctx.globalAlpha = hook; const g = ctx.createLinearGradient(0, FR.y, 0, FR.y + 420); g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, 420); ctx.restore();
    text('人一多就累，', 540, 590, { size: 92, weight: 900, align: 'center', color: CREAM, alpha: hook, glow: 'rgba(0,0,0,.9)', blur: 24 });
    text('一句话能想一整天', 540, 710, { size: 92, weight: 900, align: 'center', color: GOLD, alpha: hook, glow: 'rgba(0,0,0,.9)', blur: 24 });
  }
  // 太吵：街上的声音挤进来
  [['嘀——！', D(0) + 2.0, 260, 640], ['喂？你听得到吗？', D(0) + 2.5, 760, 600], ['让一让！', D(0) + 3.0, 300, 840], ['嘟嘟嘟嘟', D(0) + 3.5, 820, 860], ['叮咚', D(0) + 4.0, 540, 980], ['到底什么时候到？', D(0) + 4.5, 640, 760]].forEach(([s, t0, x, y], i) => {
    const k = sstep(t0, t0 + .2, t) * (1 - sstep(D(1) + .2, D(1) + .7, t)); if (k <= 0) return;
    const j = Math.sin(t * 40 + i) * 3;
    text(s, x + j, y, { font: SANS, size: 40 + (i % 3) * 6, weight: 900, align: 'center', color: i % 2 ? '#ffd2a0' : '#ffffff', alpha: k * (.75 + .25 * Math.sin(t * 9 + i)), glow: 'rgba(0,0,0,.9)', blur: 14 });
  });
  // 晚上：白天的话在脑子里重播
  [['你就是太敏感了。', D(9) + .3, 300, 600], ['嗯……先这样吧。', D(9) + 1.1, 760, 700], ['有吗？还好吧。', D(9) + 1.9, 360, 820], ['脸色这么差。', D(9) + 2.6, 700, 560]].forEach(([s, t0, x, y], i) => {
    const k = sstep(t0, t0 + .6, t) * (1 - sstep(S['是什么'] - 1.0, S['是什么'] - .2, t)); if (k <= 0) return;
    text(s, x + Math.sin(t * .7 + i) * 20, y - (t - t0) * 6, { font: SANS, size: 38, weight: 700, align: 'center', color: 'rgba(236,230,218,.9)', alpha: k * (.35 + .25 * Math.sin(t * 1.3 + i * 2)), filter: 'blur(1.2px)' });
  });
  // 对话框：每一句在它说的时候出现，说完淡出
  DIALOG.forEach(([a, b, s, who, kind], i) => {
    const next = DIALOG[i + 1] ? DIALOG[i + 1][0] : TOTAL, fe = Math.max(b + .25, Math.min(b + .7, next - .05));
    if (t < a - .1 || t > fe + .05) return;
    const k = sstep(a - .1, a + .15, t) * (1 - sstep(fe - .25, fe, t));
    const m = info && info.cast.find(c => c.who === who);
    if (m) bubble(s, kind, m.head[0], m.head[1] - 50 * m.ss, k);
    else bubble(s, kind, who === '板' ? 900 : 860, FR.y + 120, k, { name: CAST[who].name, noTail: true });
  });
  // 最后的字卡（画框下面）
  const c1 = win(t, CARDS_AT, CARDS_AT + 4.0, .4, .4), c2 = sstep(CARDS_AT + 3.8, CARDS_AT + 4.3, t);
  typeText('不是你太敏感，', 540, 1530, { ...big, size: 60, weight: 900, color: CREAM }, prog(t, CARDS_AT, CARDS_AT + .8), c1);
  typeText('是你感受得更多。', 540, 1630, { ...big, size: 72, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, CARDS_AT + 1.0, CARDS_AT + 2.0), c1);
  typeText('评论区说说：', 540, 1530, { size: 44, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, CARDS_AT + 3.9, CARDS_AT + 4.4), c2);
  typeText('你是高敏感的人吗？', 540, 1620, { size: 60, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, CARDS_AT + 4.3, CARDS_AT + 5.3), c2);
}
function SAMPLES(T) { return SHOTS.some((sh, i) => i && Math.abs(T - sh.t0) < XF / 2 + .05) ? 4 : 2; }
function BLOOM_K(T) { return .3; }
function OVER(T) {
  stamp('1997', 'Aron & Aron', D(13) + 3.6, D(16), T);
  stamp('2014', 'Acevedo 等', D(20), D(21) + .3, T);
  stamp('2021', 'Assary 等', D(23), D(24) + .3, T);
  stamp('2009', 'Belsky & Pluess', D(25), D(26) + .2, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const sec = n => S[n];
  // 学姐那一段：镜头跟着说话的那只（小黑在左 x≈560，学姐在右 x≈1160），讲知识时退到中间
  const focusX = who => who === '黑' ? 560 : who === '姐' ? 1160 : 860;
  const lk = (from, to) => { const xs = [[from, 300]], ys = [[from, 800]], ws = [[from, 1340]];
    DIALOG.forEach(([a, b, s, who], i) => { if (a < from || a >= to) return; const wide = [15, 16, 17, 19, 20, 23, 24, 25].includes(i);
      xs.push([a - .3, xs[xs.length - 1][1]], [a + .5, wide ? 260 : focusX(who) - 560]); ys.push([a - .3, ys[ys.length - 1][1]], [a + .5, wide ? 800 : 1000]); ws.push([a - .3, ws[ws.length - 1][1]], [a + .5, wide ? 1340 : 1120]); });
    return [track(xs), track(ys), track(ws)]; };
  SHOTS = [
    { name: 'street', img: 'street', t0: 0, t1: sec('公司'), a: [0, 667, 1500], b: [330, 1060, 1080] },
    { name: 'office', img: 'office', t0: sec('公司'), t1: sec('晚上'), keys: [track([[0, 0], [D(5) - .2, 140], [D(5) + 1.2, 330], [D(6), 330], [D(6) + .8, 60], [sec('晚上'), 160]]),
      track([[0, 815], [D(5) - .2, 950], [D(5) + 1.2, 1150], [D(6), 1150], [D(6) + .8, 1000], [sec('晚上'), 1040]]), track([[0, 1333], [D(5) - .2, 1150], [D(5) + 1.2, 760], [D(6), 760], [D(6) + .8, 1100], [sec('晚上'), 1050]])] },
    { name: 'bedroom_dark', img: 'bedroom_dark', t0: sec('晚上'), t1: sec('是什么'), a: [133, 700, 1200], b: [520, 960, 780] },
    { name: 'livingroom', img: 'livingroom', enter: true, t0: sec('是什么'), t1: sec('怎么办'), keys: lk(sec('是什么'), sec('怎么办')) },
    { name: 'bedroom_lamp', img: 'bedroom_lamp', t0: sec('怎么办'), t1: D(29) - .3, a: [0, 950, 1150], b: [230, 1150, 850] },
    { name: 'livingroom', img: 'livingroom', t0: D(29) - .3, t1: sec('第二天'), a: [500, 900, 1100], b: [300, 820, 1300] },
    { name: 'park_fog', img: 'park_fog', t0: sec('第二天'), t1: CARDS_AT - .6, a: [0, 420, 1333], b: [250, 760, 1080] },
    { name: 'park_bench', img: 'park_bench', t0: CARDS_AT - .6, t1: TOTAL + 1, a: [360, 0, 1130], b: [560, 230, 860] },
  ];
}

// ======================================================================== 音效提示表
function CUES() {
  const c = [];
  // ① 街上：人声车声；绿灯“嘀嘀”；阿橘催
  c.push([0, 'crowd', { dur: S['公司'] + .5, gain: .16, fi: .05, fo: .6 }]);
  for (const t0 of [D(0) + .5, D(0) + 2.6]) c.push([t0, 'honk', { gain: .07 }]);
  for (let i = 0; i < 6; i++) c.push([D(1) - .3 + i * .5, 'tick', { gain: .05 }]);
  // ② 公司：键盘声；老板那句之后的安静；心里一沉
  for (let i = 0; i < 10; i++) c.push([S['公司'] + .3 + i * .17 + (i % 3) * .05, 'click', { gain: .025 }]);
  c.push([D(5) + .2, 'air', { dur: 2.6, hum: 98, gain: .05 }]);
  // ③ 晚上：钟表滴答；白天的话在脑子里回响
  for (let i = 0; i < 12; i++) c.push([S['晚上'] + .2 + i * .8, 'tick', { gain: .03 }]);
  c.push([D(9) + .3, 'revcym', { dur: 2.0, gain: .05 }]);
  // ④–⑥ 学姐：进门；图示一个个亮起来
  c.push([S['是什么'] + .2, 'swish', { dur: .8, gain: .04 }]);
  c.push([D(13) + 3.6, 'shimmer', { f: [784, 988, 1175, 1568], gain: .08 }], [D(15) + 2.6, 'tink', { f: 1175, gain: .05 }]);
  for (const t0 of [D(17) + 1.0, D(17) + 1.9, D(17) + 2.9]) c.push([t0, 'tink', { f: 1318.5, gain: .04 }]);
  c.push([D(19) + .8, 'bar', { f0: 300, f1: 900, dur: 2.6, gain: .04 }], [D(20) + 2.6, 'swell', { dur: 1.6, f: [146.8, 220, 293.7, 370], gain: .05 }]);
  c.push([D(23) + 2.6, 'bar', { f0: 300, f1: 600, dur: 1.6, gain: .04 }], [D(24) + 2.2, 'swish', { dur: .3, gain: .05 }], [D(24) + 3.0, 'swish', { dur: .3, gain: .05 }]);
  c.push([D(25) + 2.4, 'rain', { dur: 3.0, gain: .06, muffle: 1, fi: .3, fo: .6 }], [D(25) + 5.0, 'shimmer', { f: [587.3, 740, 880, 1175], gain: .06 }]);
  c.push([D(27) + 3.2, 'bar', { f0: 400, f1: 800, dur: 1.8, gain: .035 }]);
  for (let i = 0; i < 5; i++) c.push([D(28) + .5 + i * .35, 'tick', { gain: .03 }]);
  // ⑦ 清晨的公园：鸟叫
  c.push([S['第二天'] - .3, 'birds', { dur: TOTAL - S['第二天'] + .3, gain: .1 }], [CARDS_AT, 'shimmer', { f: [587.3, 740, 880, 1175, 1480], gain: .1 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
