// ======================================================================== No.55 购物车里的游戏机（Wojak 叙事短剧：一个男生的配得感）
// 照着频道主的“理想型”参考视频（《当一个男生的配得感越来越低》，剖析见 refs/配得感/）的骨架和镜头做，故事和台词都是自己写的：
//   大二暑假的夜班，购物车里加了一台游戏机 → 发工资那天，先给妈妈换了手机 → 工作第一年，请同事吃饭、给妈妈转钱
//   → 三年后，老同学结婚 → 她的生日，送她相机 → 他生日前一周，她问他想要什么（“电饭煲”）→ 她看见购物车：五年了
//   → 回忆快闪 → “我好像……不配。” → “这次，你自己下单。我看着。” → 他生日那天，他在玩。
// 学参考视频的手法（量出来的参数见 refs/配得感/手法细节.md）：
//   - 换段用模糊转场：0.2 秒糊掉，最糊的时候切，0.6 秒变清楚，配一声很低的“嗡”；画框上面的黑边写时间（*大二暑假）；
//   - 说话时嘴一张一合（按配音的响度）；过肩镜头（前景的人压成黑影、糊的）；拍近景时背景虚掉；长镜头慢推、短镜头不动；
//   - 背景跟着机位换：出租屋是一张很宽的照片，两人同框用中间，拍她用右边（台灯、书桌），拍他用左边（沙发）——还是同一张图；
//   - 同一个画面用两次：开头的购物车（刚刚加入）后面原样再出现（5年前加入）；回忆快闪的最后一张也是它，彩色的；
//   - 只有游戏机一直是饱和的暖色（橙、青），手机里的购物、付款界面是白的、冷冰冰的。
// 规矩照旧：说话时面对面（主人公在左朝右）；一场戏一张背景图；对话框在画框上部；不说教；没有片头、没有进度条，片尾和水印保留。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 154.4;
const SECTIONS = [['便利店', 0.0, 7.2], ['回家', 7.2, 28.8], ['几天后', 28.8, 38.4], ['办公室', 38.4, 54.4], ['三年后', 54.4, 63.2], ['她的生日', 63.2, 75.2], ['他的生日', 75.2, 142.4], ['生日那天', 142.4, 154.4]];
const LINES = [];                                                   // 没有旁白
const DIALOG = [
  [2.40, 4.04, '再上三十个夜班……', '黑', 'think'],
  [4.44, 5.43, '你就是我的了。', '黑', 'think'],
  [8.20, 8.92, '工资到了！', '黑', 'think'],
  [9.82, 13.05, '儿子，你帮我看看，这手机又卡住了。', '妈', 'say'],
  [13.45, 16.52, '妈，这屏幕都碎成这样了。', '黑', 'say'],
  [16.82, 19.50, '还能用，换啥换，浪费钱。', '妈', 'say'],
  [20.40, 22.73, '这个手机，她用了快六年了。', '黑', 'think'],
  [25.23, 27.46, '游戏机……明年再说吧。', '黑', 'think'],
  [29.70, 32.20, '这新手机真好使，字也大。', '妈', 'say'],
  [32.50, 34.58, '你哪来的钱？没乱花吧？', '妈', 'say'],
  [34.88, 37.00, '同学换下来的，不要钱。', '黑', 'say'],
  [39.30, 43.41, '新人第一个月发工资，按规矩——请客！', '哥', 'say'],
  [43.61, 45.42, '我要喝那家最贵的奶茶！', '运', 'say'],
  [45.72, 47.51, '好好好，今晚我请！', '黑', 'say'],
  [49.61, 52.43, '游戏机……下个月吧。', '黑', 'think'],
  [55.40, 58.23, '兄弟，我下个月结婚，一定要来啊！', '杰', 'msg'],
  [59.73, 61.82, '份子钱，不能少。', '黑', 'think'],
  [64.20, 67.62, '哇！是我一直想要的那台相机！', '她', 'say'],
  [67.92, 69.13, '这个很贵吧？', '她', 'say'],
  [69.43, 72.00, '不贵，你喜欢就好。', '黑', 'say'],
  [72.30, 73.89, '也就三个月的饭钱。', '黑', 'think'],
  [76.20, 78.67, '下周你生日，想要什么？', '她', 'say'],
  [79.07, 80.84, '都行，别破费了。', '黑', 'say'],
  [81.24, 82.28, '说一个嘛。', '她', 'say'],
  [82.98, 88.32, '嗯……家里电饭煲坏了，要不买个电饭煲？', '黑', 'say'],
  [89.22, 92.55, '他好像，从来没给自己要过什么。', '她', 'think'],
  [92.85, 95.49, '电饭煲，是生日礼物吗？', '她', 'say'],
  [96.99, 99.74, '你购物车里这台游戏机，放了多久了？', '她', 'say'],
  [100.64, 101.80, '……五年了吧。', '黑', 'say'],
  [103.50, 104.70, '那为什么一直不买？', '她', 'say'],
  [105.40, 106.23, '为什么……', '黑', 'think'],
  [111.73, 114.32, '因为……总觉得不太应该。', '黑', 'say'],
  [114.82, 117.57, '打游戏，又不是什么正经事。', '黑', 'say'],
  [117.97, 123.74, '两千多块花在自己身上，我好像……不配。', '黑', 'say'],
  [125.64, 129.66, '你给别人花钱的时候，从来没问过应不应该。', '她', 'say'],
  [130.56, 133.59, '这次，你自己下单。我看着。', '她', 'say'],
  [136.49, 140.28, '原来……按下去，也没那么难。', '黑', 'think'],
  [144.00, 144.67, '好玩吗？', '她', 'say'],
  [145.47, 146.06, '好玩。', '黑', 'say'],
];
const MOUTH = ['0001100110110011110100000', '00110101100011000', '001101110000', '1100100000101110011001000001101101100110010011100000', '0000111100000000000001110011100101011100000000', '0001100110000000110110110000000110110111000', '00111010011000000111100111100000000', '0000110110111100001111011010100000', '0100110100110110111011000000011000110000', '1111000011011000000111111011000000', '00100101011110111000011100100000', '00111101100110111100111000000000001110110111000000000000110110000', '11110011101101101111000011000', '00111000100000001110010000000', '000000111001100111100000000001101100110000', '0111100000110011011101011100000111110001100000', '00001101001110000000010110100000', '00001110000000000000000111011001110111000011100110000', '001110100110110000', '00010110000000000000001100101010010000', '000011010010100010100000', '00011011100110010000000001111000110000', '00011001100001101101000000', '0000110011100000', '00011100000000000000000000011101101010010000000000000011011100001100010100110000', '0001001100111110000000010111010010111011011100000', '0001100110110000000011010111000111000000', '0110011100111010111001101100111011001001000', '00001101010100000', '01110110101011100000', '0110001111000', '000001111110000000011001110011100000000', '01100001100110000000110111000110001110000', '00110011010011011110100011110000000000000000000011001001111110000000000000000011001000000', '001111001101100110010110000000000011011011010110011101100000', '000110001100010110001101100000000110011000000', '000001111111000000000111001110001110000000110111100000000', '000100111000', '0000110110000'];              // 口型：每句每秒 15 格，1 = 张嘴
const CARDS_AT = 147.26;                                          // 最后的字卡从这里开始
// 第 i 句台词开始的时间：D(i)；结束：DE(i)
const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const GOLD = '#ffd2a0', WHITE = '#f6f3ee';
for (const w of ['300', '900']) document.fonts.load(`${w} 40px "Noto Sans SC"`, '购物车');

// ======================================================================== 照片和人物
const FR = { x: 0, y: 470, w: 1080, h: 960 }, ASP = FR.w / FR.h, FB = FR.y + FR.h, CX = FR.x + FR.w / 2, CY = FR.y + FR.h / 2;
const PHOTO_FILES = ['store', 'living', 'office', 'room'];
// 出租屋是一张 2048×1024 的宽照片：两人同框用中间，拍她用右边（台灯、书桌），拍他用左边（沙发）
const ROOM = { L: [0, 0, 1152], C: [448, 0, 1152], R: [896, 0, 1152] };
const TV = [813, 506, 1012, 609];                                             // 电视屏幕在宽照片里的位置（x0, y0, x1, y1）
const HERO_EXPR = ['calm', 'sad', 'cry', 'happy', 'meh', 'awkward'];
const PH = {}, IMG = {};
const load = src => { const im = new Image(); im.src = src; return im; };
for (const n of PHOTO_FILES) PH[n] = load(`photos/${n}.jpg`);
for (const e of HERO_EXPR) IMG['hero_' + e] = load(`../characters/hero/expr/${e}.png`);
for (const [k, f] of Object.entries({ 她: 'cast/女同事-设计', 哥: 'cast/同事-老哥', 运: 'cast/女同事-运营', 杰: 'cast/蓝卫衣男', 妈f: 'full/校园/家长-母亲', 她f: 'full/办公室/女同事-设计' }))
  IMG[k] = load(`../characters/${f}.png`);
function ASSETS_READY() {
  return [...Object.values(PH), ...Object.values(IMG)].every(im => im.complete && im.naturalWidth > 0)
    && document.fonts.check('900 40px "Noto Sans SC"', '购') && document.fonts.check('300 40px "Noto Sans SC"', '购');
}

// 照片画满画框（镜头在外面乘）。crop：[x, y, 宽]（高按画框比例）；z / at：只把照片再放大一点（换了机位、离得更近）；
// dof：近景时背景虚掉（叠一张糊的）；inner：跟着照片一起放大的东西（比如电视屏幕）
const SOFT = {};
function soft(name) {
  if (!SOFT[name]) { const im = PH[name], c = mk(im.naturalWidth, im.naturalHeight), g = c.getContext('2d'); g.filter = 'blur(7px)'; g.drawImage(im, 0, 0); SOFT[name] = c; }
  return SOFT[name];
}
function photo(name, crop, o = {}, inner) {
  const im = PH[name]; if (!im.naturalWidth) return;
  const [x, y, w] = crop || [0, 0, im.naturalWidth], h = w / ASP;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (o.z && o.z !== 1) { const [fx, fy] = o.at || [CX, CY]; ctx.translate(fx, fy); ctx.scale(o.z, o.z); ctx.translate(-fx, -fy); }
  ctx.drawImage(im, x, y, w, h, FR.x, FR.y, FR.w, FR.h);
  const dof = clamp(o.dof || 0);
  if (dof > 0) { ctx.save(); ctx.globalAlpha *= dof; ctx.drawImage(soft(name), x, y, w, h, FR.x, FR.y, FR.w, FR.h); ctx.restore(); }
  if (inner) inner();
  ctx.restore();
}
const BLUR = {};
function blurred(name, crop) {                                               // 插入镜头后面：照片糊掉、压暗（只算一次）
  const key = name + (crop || '');
  if (!BLUR[key]) {
    const c = mk(FR.w, FR.h), g = c.getContext('2d'), im = PH[name], [x, y, w] = crop || [0, 0, im.naturalWidth];
    g.filter = 'blur(18px) brightness(.45)'; g.drawImage(im, x, y, w, w / ASP, -40, -40, FR.w + 80, FR.h + 80); BLUR[key] = c;
  }
  ctx.drawImage(BLUR[key], FR.x, FR.y);
}
// 宽照片上的一点 → 画框里的位置（照片没放大时）
const ph2fr = (crop, px, py) => [FR.x + (px - crop[0]) * FR.w / crop[2], FR.y + (py - crop[1]) * FR.w / crop[2]];

// ---------------------------------------------------------------- 镜头：[画框中心对着的点 x, y, 放大倍数, 转角]；放大时照片始终盖满画框
function view(c) {
  const z = Math.max(1, c[2]), hw = FR.w / 2 / z, hh = FR.h / 2 / z;
  return { x: clamp(c[0], FR.x + hw, FR.x + FR.w - hw), y: clamp(c[1], FR.y + hh, FB - hh), z, rot: c[3] || 0 };
}
const camLerp = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3] || 0, b[3] || 0, k)];
function frame(c, fn) {                                                     // 在画框里、乘上镜头画 fn
  const v = view(c);
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  ctx.translate(CX, CY); if (v.rot) ctx.rotate(v.rot); ctx.scale(v.z, v.z); ctx.translate(-v.x, -v.y);
  fn(v); ctx.restore();
  return v;
}
// 一个机位：照片（可以单独放大、虚掉）+ 人。o：z / at / dof 给照片，tv 电视开没开（出租屋）
function set(t, name, crop, cam, o, fn) {
  return frame(cam, v => {
    photo(name, crop, { z: o.z, at: o.at, dof: (o.dof || 0) + clamp((v.z - 1.2) / .7) }, name === 'room' ? () => tvScreen(crop, t, o.tv || 0) : null);
    if (fn) fn(v);
  });
}

// ---------------------------------------------------------------- 说话：嘴一张一合（layout.py 按配音的响度量好的，每秒 15 格）
function mouthOpen(who, t) {
  for (let i = 0; i < DIALOG.length; i++) {
    const [a, b, , w, k] = DIALOG[i];
    if (w === who && k === 'say' && t >= a && t < b) return MOUTH[i][Math.floor((t - a) * 15)] === '1';
  }
  return false;
}
let SEEN = {};                                                               // 这一帧画出来的人：头顶在屏幕上的位置（对话框的尾巴指过去）
function mark(who, x, y) { const p = ctx.getTransform().transformPoint(new DOMPoint(x, y)); SEEN[who] = [p.x, p.y]; }

// ---------------------------------------------------------------- 主人公
// 图 1002×2992（原图的 2 倍）：脸的中心 (640, 319)，帽子顶 y ≈ 10，脚底 y ≈ 2984，两脚中间 x ≈ 535
const HERO = { w: 1002, h: 2992, fx: 640, fy: 319, top: 10, feet: 2984, bx: 535 };
// 嘴（2 倍图的坐标）：[中心 x, 中心 y, 盖住原来那条线的椭圆半宽, 半高]；开心的嘴张开是“D”形
const HMOUTH = { calm: [641, 401, 52, 14], sad: [642, 409, 52, 16], cry: [643, 410, 52, 17], happy: [642, 401, 56, 18], meh: [642, 405, 44, 10], awkward: [643, 404, 50, 13] };
let HX = [];                                                                  // 表情时间表 [时间, 表情]，换的时候 0.2 秒淡过去
function heroExpr(t) {
  let i = -1; for (let k = 0; k < HX.length; k++) if (t >= HX[k][0]) i = k;
  if (i < 0) return ['calm', 'calm', 1];
  return [HX[i][1], i ? HX[i - 1][1] : 'calm', sstep(HX[i][0], HX[i][0] + .2, t)];
}
// 半身：cx 脸的横坐标、top 帽子顶、s 缩放；全身：feet 脚底、hgt 身高、cx 两脚中间。dark：过肩镜头的前景（压成黑影、糊的）
function hero(o, t) {
  const a = o.a ?? 1; if (a <= 0) return null;
  let s, x, y;
  if (o.feet != null) { s = o.hgt / (HERO.feet - HERO.top); x = o.cx - HERO.bx * s; y = o.feet - HERO.feet * s; }
  else { s = o.s ?? .652; x = o.cx - HERO.fx * s; y = o.top - HERO.top * s; }
  const [e, prev, k] = o.e ? [o.e, o.e, 1] : heroExpr(t);
  ctx.save(); ctx.globalAlpha *= a;
  if (o.feet != null) footShadow(o.cx, o.feet, o.hgt * .2);
  if (o.dark) ctx.filter = o.dark;
  const base = ctx.globalAlpha;
  if (k < 1) ctx.drawImage(IMG['hero_' + prev], x, y, HERO.w * s, HERO.h * s);
  ctx.globalAlpha = base * (k < 1 ? k : 1); ctx.drawImage(IMG['hero_' + e], x, y, HERO.w * s, HERO.h * s);
  ctx.globalAlpha = base; ctx.filter = 'none';
  if (!o.dark && HMOUTH[e] && mouthOpen('黑', t)) heroLips(x, y, s, e);
  ctx.restore();
  if (!o.dark) mark('黑', x + HERO.fx * s, y + HERO.top * s + 40 * s);
  return { face: [x + HERO.fx * s, y + HERO.fy * s], s, x, y };
}
function heroLips(x, y, s, e) {
  const [mx, my, rx, ry] = HMOUTH[e], X = x + mx * s, Y = y + my * s;
  ctx.fillStyle = '#fdfdfd'; ctx.beginPath(); ctx.ellipse(X, Y, rx * s, ry * s, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3d2b2b'; ctx.strokeStyle = '#161616'; ctx.lineWidth = 4.5 * s; ctx.beginPath();
  if (e === 'happy') {
    ctx.moveTo(X - 34 * s, Y - 7 * s); ctx.quadraticCurveTo(X, Y - 1 * s, X + 34 * s, Y - 7 * s);
    ctx.bezierCurveTo(X + 30 * s, Y + 22 * s, X - 30 * s, Y + 22 * s, X - 34 * s, Y - 7 * s);
  } else ctx.ellipse(X, Y + 2 * s, 19 * s, 12 * s, 0, 0, TAU);
  ctx.fill(); ctx.stroke();
}
function footShadow(x, y, r) {
  ctx.save(); ctx.filter = `blur(${Math.max(2, r / 12).toFixed(1)}px)`; ctx.fillStyle = 'rgba(0,0,0,.5)';
  ctx.beginPath(); ctx.ellipse(x, y - r * .03, r, r * .14, 0, 0, TAU); ctx.fill(); ctx.restore();
}
// ---------------------------------------------------------------- 其他人
// 半身像（底边贴着画框底边）。fx：脸在图里的横向位置；mouth：嘴 [x, y, 宽]（原图像素）；原图都朝右，站在右边时翻过来
const CAST = { 她: { fx: .5, mouth: [153, 127, 22] }, 哥: { fx: .62, mouth: [199, 113, 28] }, 运: { fx: .58, mouth: [177, 150, 20] } };
const DARK = 'brightness(.06) blur(6px)';
function bust(key, o, t) {                                                   // o：cx 脸的位置、w 宽、flip 左右翻、bottom 底边、dark 压暗（过肩的前景）
  const im = IMG[key], c = CAST[key]; if (!im.naturalWidth || (o.a ?? 1) <= 0) return;
  const w = o.w, sc = w / im.naturalWidth, h = im.naturalHeight * sc, fx = o.flip ? 1 - c.fx : c.fx;
  const x = o.cx - fx * w, y = (o.bottom ?? FB + 6) - h + (o.dy || 0);
  if (!o.dark) mark(key, o.cx, y + h * .02);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; if (o.dark) ctx.filter = o.dark;
  ctx.translate(x, y); if (o.flip) { ctx.translate(w, 0); ctx.scale(-1, 1); }
  ctx.drawImage(im, 0, 0, w, h); ctx.filter = 'none';
  if (!o.dark && c.mouth && mouthOpen(key, t)) {
    const [mx, my, mw] = c.mouth; ctx.scale(sc, sc);
    ctx.fillStyle = '#f8f6f2'; ctx.beginPath(); ctx.ellipse(mx, my, mw * .62, mw * .22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#3a2424'; ctx.beginPath(); ctx.ellipse(mx, my + mw * .05, mw * .3, mw * .2, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// 全身像（人比较小，用在远景、过肩镜头的后景）：cx 两脚中间、feet 脚底、hgt 身高、who 是谁（对话框指过去）
function full(key, o) {
  const im = IMG[key]; if (!im.naturalWidth || (o.a ?? 1) <= 0) return;
  const s = o.hgt / im.naturalHeight, w = im.naturalWidth * s, x = o.cx - w / 2, y = o.feet - o.hgt;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; footShadow(o.cx, o.feet, w * .42);
  if (o.flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, o.hgt); } else ctx.drawImage(im, x, y, w, o.hgt);
  ctx.restore();
  mark(o.who, o.cx, y);
}

// ======================================================================== 对话框（画框上部；主人公的在左边，别人的在右边；看得见说话的人才画尾巴）
function wrapText(s, size, maxW, weight = 900) {
  font(size, weight, SANS); const out = []; let cur = '';
  for (const ch of s) { if (ctx.measureText(cur + ch).width > maxW && cur && !'，。？！、…」：；～”'.includes(ch)) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
function bubble(str, kind, x0, an, a, size = 44) {
  if (a <= 0) return;
  const lh = size * 1.35, lines = wrapRuns(runs(str), { size, weight: 900, font: SANS }, 640).map(l => l.map(c => c.ch).join(''));   // 两行时在标点后断、两行差不多长
  font(size, 900, SANS); const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
  const w = tw + size * 3, h = lines.length * lh + size * 1.6;
  const bx = clamp(x0, w / 2 + 24, W - w / 2 - 24), by = FR.y + 28 + h / 2;
  const sc = .86 + .14 * E.outQuint(clamp(a * 1.6));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(bx, by); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 6;
  ctx.fillStyle = kind === 'think' ? 'rgba(214,224,238,.96)' : '#f3efe8';
  ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)';
  if (an) {
    const dx = an[0] - bx, dy = Math.max(an[1] - by, h / 2 + 40), L0 = Math.hypot(dx, dy) || 1, ux = dx / L0, uy = dy / L0;
    if (kind === 'think') {
      for (const [k, r] of [[1.08, 12], [1.3, 8.5], [1.5, 6]]) { const d = (h / 2) / Math.max(.35, uy) * k; ctx.beginPath(); ctx.arc(ux * d, uy * d, r, 0, TAU); ctx.fill(); }
    } else {
      const ex = ux * (w / 2) * .5, ey = uy * (h / 2) * .85, tip = Math.min(L0 - h / 2, 80);
      ctx.beginPath(); ctx.moveTo(ex - uy * 18, ey + ux * 18); ctx.lineTo(ex + ux * tip, ey + uy * tip); ctx.lineTo(ex + uy * 18, ey - ux * 18); ctx.closePath(); ctx.fill();
    }
  }
  lines.forEach((l, i) => text(l, 0, (i - (lines.length - 1) / 2) * lh + 2, { font: SANS, size, weight: 900, align: 'center', color: '#1d1e24' }));
  ctx.restore();
}
function bubbles(t) {
  DIALOG.forEach(([a, b, s, who, kind], i) => {
    if (kind === 'msg') return;                                              // 手机上的消息不出对话框
    const next = DIALOG[i + 1] ? DIALOG[i + 1][0] : TOTAL, cut = [...CUTS(), M0(), TOTAL].filter(c => c > b).sort((x, y) => x - y)[0];
    const fe = Math.min(Math.max(b + .25, Math.min(b + .8, next - .05)), cut - .02);                  // 换段（模糊转场、回忆快闪）之前收掉
    if (t < a - .08 || t > fe) return;
    const k = sstep(a - .08, a + .1, t) * (1 - sstep(fe - .15, fe, t));
    bubble(s, kind, who === '黑' ? 330 : 750, SEEN[who], k);
  });
}

// ======================================================================== 手机（插入镜头）：购物、付款这些界面是白的、冷冰冰的
const UI = { bg: '#f2f2f5', ink: '#1c1c1e', gray: '#8e8e93', line: '#e5e5ea', red: '#ff4a2b', green: '#07c160' };
const PHN = { x: CX, y: CY, w: 500, h: 800 };
function rr(x, y, w, h, r, fill, stroke, lw = 2) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
const T = (s, x, y, size, weight, color, align = 'left', o = {}) => text(s, x, y, { font: SANS, size, weight, color, align, ...o });
function phoneFrame(shake = 0) {
  const { x, y, w, h } = PHN, px = x - w / 2 + shake, py = y - h / 2;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40; rr(px, py, w, h, 46, '#0c0c0e'); ctx.restore();
  return { sx: px + 14, sy: py + 14, sw: w - 28, sh: h - 28 };
}
function clipScreen(sx, sy, sw, sh, bg) { ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 34); ctx.clip(); ctx.fillStyle = bg; ctx.fillRect(sx, sy, sw, sh); }
// 插入镜头：后面糊掉的照片 + 手机（sc 慢慢推近，at 推向哪里）
function phoneInsert(bg, crop, fn, o = {}) {
  blurred(bg, crop);
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  const sc = o.sc || 1, [fx, fy] = o.at || [CX, CY]; ctx.translate(fx, fy); ctx.scale(sc, sc); ctx.translate(-fx, -fy);   // at：往哪儿推
  if (o.old) fn(); else { const { sx, sy, sw, sh } = phoneFrame(o.shake || 0); fn(sx, sy, sw, sh); }
  ctx.restore();
  const g = ctx.createRadialGradient(CX, CY, 100, CX, CY, 620); g.addColorStop(0, 'rgba(170,185,220,.07)'); g.addColorStop(1, 'rgba(170,185,220,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore();
}
function statusBar(sx, sy, sw, time, dark) {
  const c = dark ? '#f2f2f2' : UI.ink;
  T(time, sx + 38, sy + 26, 18, 700, c);
  rr(sx + sw - 66, sy + 18, 30, 15, 4, null, c, 2); rr(sx + sw - 63, sy + 21, 19, 9, 2, c);
  ctx.fillStyle = c; for (let i = 0; i < 4; i++) ctx.fillRect(sx + sw - 108 + i * 7, sy + 33 - (i + 1) * 4, 4, (i + 1) * 4);
}
function checkMark(x, y, r, col, lw = 8) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * .5, y); ctx.lineTo(x - r * .1, y + r * .4); ctx.lineTo(x + r * .55, y - r * .4); ctx.stroke(); ctx.restore();
}
function checkCircle(x, y, r, on) {
  if (on) { ctx.fillStyle = UI.red; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); checkMark(x, y, r * 1.1, '#fff', r * .26); }
  else { ctx.strokeStyle = '#c7c7cc'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
}
// 手指：按之前是一个淡淡的圆（hover 0–1），按下去以后一圈波纹
function finger(x, y, tap, u, hover = 1) {
  if (u < tap) { if (hover > 0) { ctx.fillStyle = `rgba(70,70,80,${.2 * hover})`; ctx.beginPath(); ctx.arc(x, y, 30, 0, TAU); ctx.fill(); } return; }
  const p = (u - tap) / .4; if (p > 1) return;
  ctx.fillStyle = `rgba(70,70,80,${.28 * (1 - p)})`; ctx.beginPath(); ctx.arc(x, y, 27, 0, TAU); ctx.fill();
  ctx.strokeStyle = `rgba(90,90,100,${.5 * (1 - p)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 27 + 34 * p, 0, TAU); ctx.stroke();
}
function headCrop(key) {                                                     // 头像：从角色图上裁一块头
  const im = IMG[key];
  if (key.startsWith('hero_')) return [im, 400, 0, 480, 480];
  if (key === '妈f') return [im, 28, 0, 64, 64];
  return [im, im.naturalWidth * .3, 0, im.naturalWidth * .55, im.naturalWidth * .55];
}
function avatar(key, x, y, s) {
  const [im, sx, sy, sw, sh] = headCrop(key); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, s, s, 8); ctx.clip();
  ctx.fillStyle = '#c9ccd2'; ctx.fillRect(x, y, s, s); if (im.naturalWidth) ctx.drawImage(im, sx, sy, sw, sh, x, y, s, s); ctx.restore();
}

// 游戏机（没有牌子的掌机）：两边的手柄是橙和青，全片只有它一直是饱和的暖色
function drawConsole(cx, cy, w) {
  const h = w * .44, gw = w * .19, x = cx - w / 2, y = cy - h / 2;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = w * .06; ctx.shadowOffsetY = w * .02;
  rr(x, y, gw + h * .5, h, h * .5, '#ff8a3d'); rr(x + w - gw - h * .5, y, gw + h * .5, h, h * .5, '#2fcbbb');
  ctx.shadowColor = 'rgba(0,0,0,0)';
  rr(x + gw, y, w - 2 * gw, h, h * .05, '#24262c');
  const m = h * .1, scx = x + gw + m, scy = y + m, scw = w - 2 * gw - 2 * m, sch = h - 2 * m;
  ctx.save(); ctx.beginPath(); ctx.rect(scx, scy, scw, sch); ctx.clip();
  const g = ctx.createLinearGradient(0, scy, 0, scy + sch); g.addColorStop(0, '#5ec8ff'); g.addColorStop(1, '#c4f0ff'); ctx.fillStyle = g; ctx.fillRect(scx, scy, scw, sch);
  ctx.fillStyle = '#3fbf6a'; ctx.beginPath(); ctx.arc(scx + scw * .28, scy + sch * .86, sch * .42, PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(scx + scw * .78, scy + sch * .86, sch * .32, PI, 0); ctx.fill();
  ctx.fillStyle = '#e07a2f'; ctx.fillRect(scx, scy + sch * .82, scw, sch * .18);
  ctx.fillStyle = '#ff5a4f'; ctx.fillRect(scx + scw * .3, scy + sch * .52, scw * .07, sch * .3);
  ctx.fillStyle = '#ffd23f'; ctx.fillRect(scx + scw * .56, scy + sch * .3, scw * .045, sch * .12); ctx.fillRect(scx + scw * .66, scy + sch * .3, scw * .045, sch * .12);
  ctx.restore();
  ctx.fillStyle = '#26282e';
  ctx.beginPath(); ctx.arc(x + gw * .62, y + h * .3, h * .11, 0, TAU); ctx.fill();
  const dx = x + gw * .62, dy = y + h * .7, q = h * .055; ctx.fillRect(dx - q * 2.2, dy - q * .7, q * 4.4, q * 1.4); ctx.fillRect(dx - q * .7, dy - q * 2.2, q * 1.4, q * 4.4);
  const bx = x + w - gw * .62, by = y + h * .3; for (const [ox, oy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) { ctx.beginPath(); ctx.arc(bx + ox * h * .1, by + oy * h * .1, h * .045, 0, TAU); ctx.fill(); }
  ctx.beginPath(); ctx.arc(x + w - gw * .62, y + h * .7, h * .11, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- 购物车：开头（刚刚加入）、发工资那天（2个月前加入）、她看见的时候（5年前加入），是同一个画面
function cartScreen(sx, sy, sw, sh, o = {}) {
  clipScreen(sx, sy, sw, sh, UI.bg);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, 112);
  statusBar(sx, sy, sw, o.time || '23:41');
  T('购物车(1)', sx + sw / 2, sy + 80, 27, 700, UI.ink, 'center'); T('管理', sx + sw - 28, sy + 80, 20, 500, UI.ink, 'right');
  const y0 = sy + 128; rr(sx + 14, y0, sw - 28, 250, 18, '#fff');
  checkCircle(sx + 42, y0 + 101, 14, o.on);
  rr(sx + 66, y0 + 26, 150, 150, 12, '#f1f2f4'); drawConsole(sx + 141, y0 + 101, 132);
  T('掌上游戏机', sx + 232, y0 + 44, 25, 700, UI.ink);
  T('便携 · 128G · 橙青配色', sx + 232, y0 + 78, 17, 500, UI.gray);
  const old = /年/.test(o.tag || ''); font(19, old ? 700 : 500, SANS); const tw = ctx.measureText(o.tag || '').width + 20;
  rr(sx + 232, y0 + 100, tw, 34, 7, old ? '#fff0e8' : '#f2f2f5'); T(o.tag || '', sx + 242, y0 + 118, 19, old ? 700 : 500, old ? '#ff6a2b' : UI.gray);
  T('¥', sx + 232, y0 + 164, 20, 700, UI.red); T('2099', sx + 248, y0 + 160, 33, 700, UI.red);
  T('×1', sx + sw - 34, y0 + 162, 20, 500, UI.gray, 'right');
  ctx.fillStyle = '#f0f0f3'; ctx.fillRect(sx + 30, y0 + 194, sw - 60, 2);
  T('店铺优惠：满 2000 减 50', sx + 42, y0 + 224, 16, 500, UI.gray);
  T('— 猜你喜欢 —', sx + sw / 2, sy + 418, 17, 500, UI.gray, 'center');
  for (let i = 0; i < 2; i++) {
    const w = (sw - 38) / 2, x = sx + 14 + i * (w + 10);
    rr(x, sy + 442, w, 214, 14, '#fff'); rr(x + 12, sy + 454, w - 24, 124, 10, '#eceef1');
    ctx.fillStyle = '#e4e5e8'; ctx.fillRect(x + 12, sy + 592, w - 40, 12); ctx.fillRect(x + 12, sy + 612, w - 80, 12); ctx.fillStyle = '#ffd5c8'; ctx.fillRect(x + 12, sy + 634, 60, 13);
  }
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy + sh - 96, sw, 96); ctx.fillStyle = UI.line; ctx.fillRect(sx, sy + sh - 96, sw, 1);
  checkCircle(sx + 32, sy + sh - 52, 13, o.on); T('全选', sx + 53, sy + sh - 52, 18, 500, UI.ink);
  T('合计：', sx + 118, sy + sh - 52, 18, 500, UI.ink); T(o.on ? '¥2,099.00' : '¥0.00', sx + 168, sy + sh - 53, 23, 700, UI.red);
  rr(sx + sw - 146, sy + sh - 76, 128, 50, 25, o.on ? UI.red : '#d1d1d6'); T(o.on ? '结算(1)' : '结算(0)', sx + sw - 82, sy + sh - 51, 20, 700, '#fff', 'center');
  if (o.fn) o.fn();
  ctx.restore();
}
const PAY_BTN = (sx, sy, sw, sh) => [sx + sw - 82, sy + sh - 51];              // “结算”按钮的位置
const ITEM = [CX, 800];                                                      // 购物车里那一件在屏幕上的位置（插入镜头推向它）

// ---------------------------------------------------------------- 发工资那天：锁屏上的银行短信
function smsScreen(u, sx, sy, sw, sh) {
  clipScreen(sx, sy, sw, sh, '#14161c');
  const g = ctx.createLinearGradient(0, sy, 0, sy + sh); g.addColorStop(0, '#3a3f4f'); g.addColorStop(.6, '#1a1c24'); g.addColorStop(1, '#0d0e12'); ctx.fillStyle = g; ctx.fillRect(sx, sy, sw, sh);
  statusBar(sx, sy, sw, '', true);
  T('21:48', sx + sw / 2, sy + 150, 96, 300, '#f2f2f4', 'center'); T('8月31日 星期六', sx + sw / 2, sy + 218, 21, 500, '#c9ccd6', 'center');
  const k = E.outQuint(prog(u, .05, .45)), y = sy + 270 - (1 - k) * 240;
  ctx.globalAlpha = k; rr(sx + 14, y, sw - 28, 156, 24, 'rgba(244,244,247,.95)');
  rr(sx + 32, y + 18, 34, 34, 9, '#34c759'); rr(sx + 40, y + 27, 18, 13, 5, '#fff');
  T('短信', sx + 78, y + 35, 19, 700, UI.ink); T('现在', sx + sw - 34, y + 35, 16, 500, UI.gray, 'right');
  T('【银行】您尾号0427的账户8月31日', sx + 32, y + 76, 19, 500, UI.ink);
  T('入账人民币 2,400.00 元（工资），', sx + 32, y + 104, 19, 700, UI.ink);
  T('当前余额 2,486.52 元。', sx + 32, y + 132, 19, 500, UI.ink);
  ctx.restore();
}
// ---------------------------------------------------------------- 妈妈的旧手机：边框厚，屏幕碎成蛛网，微信卡住了
function momPhone(t) {
  const w = 430, h = 770, x = CX - w / 2, y = CY - h / 2 + 6;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40; rr(x, y, w, h, 38, '#2b2a2c'); ctx.restore();
  rr(x + 3, y + 3, w - 6, h - 6, 36, null, '#4a484c', 3);
  const sx = x + 22, sy = y + 66, sw = w - 44, sh = h - 132;
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ctx.fillStyle = '#ededed'; ctx.fillRect(sx, sy, sw, sh);
  ctx.fillStyle = '#f7f7f7'; ctx.fillRect(sx, sy, sw, 70); T('微信(99+)', sx + sw / 2, sy + 44, 20, 700, '#222', 'center');
  for (let i = 0; i < 6; i++) { const yy = sy + 84 + i * 80; rr(sx + 14, yy, 50, 50, 6, ['#9fb2c8', '#c8b29f', '#a8c89f', '#c89fb8', '#b6b6b6', '#9fc8c4'][i]); ctx.fillStyle = '#cfcfd2'; ctx.fillRect(sx + 76, yy + 8, 120 + (i * 37) % 90, 12); ctx.fillStyle = '#dedee0'; ctx.fillRect(sx + 76, yy + 32, 190 + (i * 53) % 70, 10); }
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(sx, sy, sw, sh);
  rr(sx + 30, sy + 210, sw - 60, 190, 14, '#fafafa');                      // “无响应”的对话框
  T('“微信”无响应', sx + sw / 2, sy + 252, 22, 700, '#111', 'center'); T('要将其关闭吗？', sx + sw / 2, sy + 292, 17, 500, '#666', 'center');
  ctx.fillStyle = '#e0e0e0'; ctx.fillRect(sx + 30, sy + 330, sw - 60, 1); ctx.fillRect(sx + sw / 2, sy + 330, 1, 70);
  T('等待', sx + sw / 4 + 15, sy + 366, 19, 500, '#1a73e8', 'center'); T('确定', sx + sw * 3 / 4 - 15, sy + 366, 19, 700, '#1a73e8', 'center');
  rr(sx + 10, sy + 6, sw - 20, 46, 10, 'rgba(255,255,255,.95)'); ctx.fillStyle = '#ff9500'; ctx.beginPath(); ctx.arc(sx + 34, sy + 29, 9, 0, TAU); ctx.fill();
  T('存储空间不足', sx + 52, sy + 29, 16, 700, '#222'); T('请清理后再试', sx + sw - 22, sy + 29, 14, 500, '#888', 'right');
  ctx.restore();
  // 裂纹：从右下角磕到的地方往外裂
  const r = mulberry(11), ox = sx + sw * .74, oy = sy + sh * .72;
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ctx.lineCap = 'round';
  for (let i = 0; i < 13; i++) {
    let a = i / 13 * TAU + r() * .4, px = ox, py = oy; ctx.strokeStyle = `rgba(255,255,255,${.55 + r() * .3})`; ctx.lineWidth = .9 + r() * 1.6;
    ctx.beginPath(); ctx.moveTo(px, py);
    for (let j = 0; j < 9; j++) { a += (r() - .5) * .5; const L = 25 + r() * 55; px += Math.cos(a) * L; py += Math.sin(a) * L; ctx.lineTo(px, py); }
    ctx.stroke();
  }
  for (const R of [22, 48, 85]) { ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k <= 14; k++) { const a = k / 14 * TAU, rr2 = R * (.8 + r() * .4); k ? ctx.lineTo(ox + Math.cos(a) * rr2, oy + Math.sin(a) * rr2) : ctx.moveTo(ox + Math.cos(a) * rr2, oy + Math.sin(a) * rr2); } ctx.stroke(); }
  ctx.restore();
}
// ---------------------------------------------------------------- 给妈妈买手机：商品页 → 立即购买 → 支付成功
function successPage(sx, sy, sw, sh, u, price) {
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, sh);
  const k = E.outQuint(clamp(u / .3)), cx = sx + sw / 2, cy = sy + 250;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(.6 + .4 * k, .6 + .4 * k); ctx.fillStyle = UI.green; ctx.beginPath(); ctx.arc(0, 0, 62, 0, TAU); ctx.fill(); checkMark(0, -6, 62, '#fff', 11); ctx.restore();
  T('支付成功', cx, sy + 370, 30, 700, UI.ink, 'center', { alpha: k });
  T(price, cx, sy + 436, 44, 700, UI.ink, 'center', { alpha: k });
  rr(sx + 120, sy + sh - 150, sw - 240, 60, 30, null, UI.green, 2.5); T('完成', cx, sy + sh - 120, 22, 700, UI.green, 'center');
}
function oldPhone(cx, cy, w) {                                               // 商品图：大屏手机，屏幕上是很大的字
  const h = w * 1.9; rr(cx - w / 2, cy - h / 2, w, h, w * .14, '#1b1b1d');
  rr(cx - w / 2 + 7, cy - h / 2 + 7, w - 14, h - 14, w * .1, '#f6f1e6');
  T('09:30', cx, cy - h * .18, w * .3, 700, '#222', 'center'); T('大字体', cx, cy + h * .05, w * .2, 900, '#e2541d', 'center');
  for (let i = 0; i < 6; i++) rr(cx - w * .34 + (i % 3) * w * .25, cy + h * .17 + Math.floor(i / 3) * w * .27, w * .18, w * .18, 6, ['#4d9bf0', '#34c759', '#ff9f0a', '#ff6159', '#a78bfa', '#5ac8fa'][i]);
}
function buyScreen(u, sx, sy, sw, sh) {
  const TAP = .85;
  clipScreen(sx, sy, sw, sh, '#fff');
  if (u < TAP + .2) {
    rr(sx, sy, sw, 430, 0, '#f3f4f6'); statusBar(sx, sy, sw, '21:52'); oldPhone(sx + sw / 2, sy + 238, 150);
    T('¥', sx + 24, sy + 470, 22, 700, UI.red); T('1,999', sx + 42, sy + 466, 40, 700, UI.red); T('已售 1万+', sx + sw - 24, sy + 470, 16, 500, UI.gray, 'right');
    T('大屏智能手机｜大字体 大音量', sx + 24, sy + 524, 22, 700, UI.ink); T('长续航 · 老人也好用', sx + 24, sy + 558, 18, 500, UI.gray);
    for (const [i, s] of ['7天无理由', '包邮', '送手机壳'].entries()) { font(15, 500, SANS); rr(sx + 24 + i * 110, sy + 590, 98, 28, 6, '#fff3ee'); T(s, sx + 73 + i * 110, sy + 604, 15, 500, '#ff6a2b', 'center'); }
    ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy + sh - 96, sw, 96); ctx.fillStyle = UI.line; ctx.fillRect(sx, sy + sh - 96, sw, 1);
    rr(sx + 110, sy + sh - 76, 168, 52, 26, '#ffb02e'); T('加入购物车', sx + 194, sy + sh - 50, 19, 700, '#fff', 'center');
    rr(sx + 286, sy + sh - 76, 168, 52, 26, UI.red); T('立即购买', sx + 370, sy + sh - 50, 19, 700, '#fff', 'center');
    finger(sx + 370, sy + sh - 50, TAP, u, sstep(.3, .6, u));
  } else successPage(sx, sy, sw, sh, u - TAP - .2, '¥1,999.00');
  ctx.restore();
}
// ---------------------------------------------------------------- 几天后：妈妈的新手机，字很大
function bigChat(u, sx, sy, sw, sh) {
  clipScreen(sx, sy, sw, sh, '#ededed');
  ctx.fillStyle = '#f7f7f7'; ctx.fillRect(sx, sy, sw, 112); statusBar(sx, sy, sw, '19:20');
  T('‹', sx + 26, sy + 78, 40, 500, '#222'); T('儿子', sx + sw / 2, sy + 80, 30, 700, '#222', 'center');
  const items = [[0, '妈，新手机\n用着咋样？', .0], [1, '好使！', .55], [1, '字可大了', 1.0]];
  let y = sy + 140;
  for (const [me, s, at] of items) {
    const k = E.outQuint(prog(u, at, at + .25)); if (k <= 0) break;
    const lines = s.split('\n'); font(38, 500, SANS); const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 40, bh = lines.length * 52 + 26;
    const ax = me ? sx + sw - 74 : sx + 14, bx = me ? ax - 12 - bw : ax + 72;
    ctx.save(); ctx.globalAlpha *= k; avatar(me ? '妈f' : 'hero_calm', ax, y, 60); rr(bx, y, bw, bh, 10, me ? '#95ec69' : '#fff');
    lines.forEach((l, i) => T(l, bx + 20, y + 39 + i * 52, 38, 500, '#111')); ctx.restore();
    y += bh + 26;
  }
  ctx.fillStyle = '#f7f7f7'; ctx.fillRect(sx, sy + sh - 90, sw, 90); rr(sx + 70, sy + sh - 70, sw - 160, 50, 8, '#fff');
  ctx.restore();
}
// ---------------------------------------------------------------- 工作第一年：账单（请客、给妈妈转钱、房租）
const BILL = [['火', '#ff8a3d', '老街火锅（同事聚餐）', '今天 21:36', '-860.00'], ['转', UI.green, '转账-妈妈', '备注：第一个月工资', '-2,000.00'], ['房', '#5b8def', '房租（9月）', '9月1日', '-1,800.00']];
function billScreen(u, sx, sy, sw, sh) {
  clipScreen(sx, sy, sw, sh, UI.bg);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, 112); statusBar(sx, sy, sw, '22:41');
  T('账单', sx + sw / 2, sy + 80, 27, 700, UI.ink, 'center');
  T('9月', sx + 24, sy + 146, 24, 700, UI.ink); T('支出 ¥4,660.00   收入 ¥5,000.00', sx + 24, sy + 182, 17, 500, UI.gray);
  BILL.forEach(([ic, col, name, sub, amt], i) => {
    const k = E.outQuint(prog(u, .1 + i * .38, .4 + i * .38)); if (k <= 0) return;
    const y = sy + 214 + i * 104 - (1 - k) * 30;
    ctx.save(); ctx.globalAlpha *= k; rr(sx + 14, y, sw - 28, 92, 14, '#fff');
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(sx + 58, y + 46, 24, 0, TAU); ctx.fill(); T(ic, sx + 58, y + 47, 22, 700, '#fff', 'center');
    T(name, sx + 96, y + 32, 20, 700, UI.ink); T(sub, sx + 96, y + 64, 16, 500, UI.gray); T(amt, sx + sw - 32, y + 46, 23, 700, UI.ink, 'right');
    ctx.restore();
  });
  const k = E.outQuint(prog(u, 1.35, 1.7));
  if (k > 0) { ctx.save(); ctx.globalAlpha *= k; rr(sx + 14, sy + 548, sw - 28, 120, 16, '#fff'); T('余额', sx + 40, sy + 584, 19, 500, UI.gray); T('¥1,612.40', sx + 40, sy + 630, 40, 700, UI.ink); ctx.restore(); }
  ctx.restore();
}
// ---------------------------------------------------------------- 三年后：阿杰的消息（深色聊天）
const WED_REPLY = () => DE(15) + .35;
function weddingChat(t, sx, sy, sw, sh) {
  clipScreen(sx, sy, sw, sh, '#111113');
  const items = [['date', '晚上 10:24', -9], ['card', '', D(15) - .55], [0, '兄弟，我下个月结婚，一定要来啊！', D(15) - .05], [1, '一定到！', WED_REPLY()]].filter(it => t >= it[2]);
  let y = sy + 132;
  for (const it of items) {
    const k = E.outQuint(prog(t, it[2], it[2] + .25));
    ctx.save(); ctx.globalAlpha *= k;
    if (it[0] === 'date') { T(it[1], sx + sw / 2, y + 12, 17, 500, '#7d8088', 'center'); y += 44; }
    else if (it[0] === 'card') {                                               // 电子请帖
      avatar('杰', sx + 14, y, 48); const x = sx + 74; rr(x, y, 226, 290, 12, '#c8242f');
      rr(x + 10, y + 10, 206, 270, 8, null, 'rgba(255,215,140,.6)', 2);
      T('囍', x + 113, y + 82, 70, 900, '#ffd58a', 'center'); T('我们结婚啦', x + 113, y + 160, 24, 700, '#fff3df', 'center');
      T('阿杰 & 晓雯', x + 113, y + 200, 18, 500, '#ffe3b8', 'center'); T('11月18日 中午12:00', x + 113, y + 236, 15, 500, '#ffd9a8', 'center');
      y += 314;
    } else {
      const me = it[0] === 1, lines = wrapText(it[1], 24, 250, 500); font(24, 500, SANS);
      const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 32, bh = lines.length * 34 + 22, ax = me ? sx + sw - 62 : sx + 14, bx = me ? ax - 12 - bw : ax + 60;
      avatar(me ? 'hero_calm' : '杰', ax, y, 48); rr(bx, y, bw, bh, 10, me ? '#3d9a62' : '#2c2d31');
      lines.forEach((l, i) => T(l, bx + 16, y + 28 + i * 34, 24, 500, me ? '#f2f5f2' : '#e6e6e8')); y += bh + 22;
    }
    ctx.restore();
  }
  ctx.fillStyle = '#1d1d20'; ctx.fillRect(sx, sy, sw, 112); ctx.fillRect(sx, sy + sh - 84, sw, 84); statusBar(sx, sy, sw, '22:24', true);
  T('‹', sx + 26, sy + 78, 40, 500, '#ececec'); T('阿杰', sx + sw / 2, sy + 80, 26, 700, '#ececec', 'center');
  rr(sx + 70, sy + sh - 66, sw - 150, 46, 8, '#2c2d31');
  ctx.restore();
}
// ---------------------------------------------------------------- 他生日前一周：搜电饭煲 → 点“购物车”→ 那台游戏机（5年前加入）
function searchScreen(u, sx, sy, sw, sh) {
  const TAP = .5;
  if (u > TAP + .15) return cartScreen(sx, sy, sw, sh, { tag: '5年前加入', time: '21:10' });
  clipScreen(sx, sy, sw, sh, UI.bg);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, 120); statusBar(sx, sy, sw, '21:10');
  rr(sx + 20, sy + 56, sw - 40, 48, 24, '#f2f2f5'); T('电饭煲', sx + 50, sy + 80, 19, 500, UI.ink);
  for (let i = 0; i < 4; i++) {
    const w = (sw - 38) / 2, x = sx + 14 + (i % 2) * (w + 10), y = sy + 136 + Math.floor(i / 2) * 270;
    rr(x, y, w, 258, 14, '#fff'); rr(x + 12, y + 12, w - 24, 150, 10, '#f1f2f4');
    const cx = x + w / 2, cy = y + 92; rr(cx - 48, cy - 26, 96, 64, 20, '#fbfbfb', '#d6d6da', 2); rr(cx - 52, cy - 38, 104, 22, 11, ['#e8e8ea', '#f3d9c8', '#dfe8f3', '#e9e3d4'][i], '#d0d0d4', 2);
    T(['智能电饭煲 4L', '迷你电饭煲 2L', '家用电饭锅 5L', '电饭煲 预约款'][i], x + 12, y + 186, 16, 500, UI.ink);
    T(['¥299', '¥169', '¥399', '¥189'][i], x + 12, y + 226, 22, 700, UI.red);
  }
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy + sh - 86, sw, 86); ctx.fillStyle = UI.line; ctx.fillRect(sx, sy + sh - 86, sw, 1);
  ['首页', '分类', '购物车', '我的'].forEach((s, i) => { const x = sx + sw * (i + .5) / 4; rr(x - 14, sy + sh - 72, 28, 26, 6, null, i === 2 ? UI.red : '#a0a0a6', 2.5); T(s, x, sy + sh - 28, 15, 500, i === 2 ? UI.red : '#8e8e93', 'center'); });
  finger(sx + sw * 2.5 / 4, sy + sh - 52, TAP, u, sstep(.15, .35, u));
  ctx.restore();
}
// ---------------------------------------------------------------- 这次，你自己下单：结算 → 付款面板 → 手指停在“立即支付”上 → 按下去 → 支付成功
const PAY = { tap1: .35, sheet: .45, press: 1.62 };
function payScreen(u, sx, sy, sw, sh) {
  if (u > PAY.press + .12) { clipScreen(sx, sy, sw, sh, '#fff'); successPage(sx, sy, sw, sh, u - PAY.press - .12, '¥2,099.00'); ctx.restore(); return; }
  cartScreen(sx, sy, sw, sh, { tag: '5年前加入', time: '21:14', on: true, fn: () => { const [bx, by] = PAY_BTN(sx, sy, sw, sh); finger(bx, by, PAY.tap1, u, sstep(0, .15, u)); } });
  const k = E.outQuint(prog(u, PAY.sheet, PAY.sheet + .3)); if (k <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 34); ctx.clip();
  ctx.fillStyle = `rgba(0,0,0,${.45 * k})`; ctx.fillRect(sx, sy, sw, sh);
  const top = sy + sh - 470 * k; rr(sx, top, sw, 500, 26, '#fff');
  T('×', sx + 30, top + 40, 30, 300, UI.gray); T('确认付款', sx + sw / 2, top + 42, 21, 700, UI.ink, 'center');
  T('¥2,099.00', sx + sw / 2, top + 126, 50, 700, UI.ink, 'center');
  ctx.fillStyle = UI.line; ctx.fillRect(sx + 24, top + 190, sw - 48, 1);
  T('付款方式', sx + 30, top + 232, 18, 500, UI.gray); T('零钱  ›', sx + sw - 30, top + 232, 18, 500, UI.ink, 'right');
  T('商品', sx + 30, top + 280, 18, 500, UI.gray); T('掌上游戏机 ×1', sx + sw - 30, top + 280, 18, 500, UI.ink, 'right');
  const pressed = u > PAY.press, bx = sx + 30, by = top + 340;
  rr(bx, by, sw - 60, 72, 36, pressed ? '#06a050' : UI.green); T('立即支付', sx + sw / 2, by + 37, 24, 700, '#fff', 'center');
  const jit = 2.2 * Math.sin(u * 37) * (1 - sstep(PAY.press - .2, PAY.press, u));    // 手指在按钮上停着，有一点抖
  finger(sx + sw / 2 + 40 + jit, by + 38 + jit * .4, PAY.press, u, sstep(.85, 1.05, u));
  ctx.restore();
}
// ---------------------------------------------------------------- 电视：关着是黑的（照片里本来亮着）；他生日那天在玩游戏
function tvScreen(crop, t, on) {
  const [x0, y0] = ph2fr(crop, TV[0], TV[1]), [x1, y1] = ph2fr(crop, TV[2], TV[3]), w = x1 - x0, h = y1 - y0;
  if (x1 < FR.x || x0 > FR.x + FR.w) return;
  ctx.save();
  if (!on) {
    const r = ctx.createRadialGradient(x0 + w / 2, y0 + h / 2, w * .3, x0 + w / 2, y0 + h / 2, w * 1.5);   // 屏幕暗了，周围的光也收一点
    r.addColorStop(0, 'rgba(6,8,12,.42)'); r.addColorStop(1, 'rgba(6,8,12,0)'); ctx.fillStyle = r; ctx.fillRect(x0 - w * 1.5, y0 - w * 1.5, w * 4, w * 4);
    const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#20252d'); g.addColorStop(.45, '#0e1116'); g.addColorStop(1, '#161b22');
    ctx.fillStyle = g; ctx.fillRect(x0 - 1, y0 - 1, w + 2, h + 2);
  } else pixelGame(x0, y0, w, h, t);
  ctx.restore();
}
function pixelGame(x, y, w, h, t) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#4fc0ff'); g.addColorStop(1, '#b8eeff'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const p = w / 64, sc = t * 10;
  ctx.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) { const cx = ((i * 23 - t * 3) % 92 + 92) % 92 - 14; ctx.fillRect(x + cx * p, y + (5 + (i % 2) * 6) * p, 10 * p, 3 * p); ctx.fillRect(x + (cx + 2) * p, y + (4 + (i % 2) * 6) * p, 5 * p, p); }
  ctx.fillStyle = '#3fbf6a'; for (let i = -1; i < 7; i++) { const hx = i * 14 - (sc * .4) % 14; ctx.beginPath(); ctx.arc(x + (hx + 7) * p, y + h - 5 * p, 8 * p, PI, 0); ctx.fill(); }
  for (let i = -1; i < 18; i++) { const bx = x + (i * 4 - sc % 4) * p, gy = y + h - 6 * p; ctx.fillStyle = '#e8782c'; ctx.fillRect(bx, gy, 4 * p - 1, 3 * p - 1); ctx.fillStyle = '#b8571c'; ctx.fillRect(bx, gy + 3 * p, 4 * p - 1, 3 * p); }
  ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 6; i++) { const cx = ((i * 11 - sc) % 66 + 66) % 66 - 2; ctx.fillRect(x + cx * p, y + h - (15 + (i % 3) * 3) * p, 2 * p, 3 * p); }
  const ph = (t % 1.05) / 1.05, jump = Math.max(0, Math.sin(ph * PI)) * 10, px = x + 18 * p, py = y + h - (12 + jump) * p;
  ctx.fillStyle = '#ff5a4f'; ctx.fillRect(px, py, 4 * p, 2 * p); ctx.fillStyle = '#ffd9b3'; ctx.fillRect(px, py + 2 * p, 4 * p, 2 * p); ctx.fillStyle = '#2fcbbb'; ctx.fillRect(px, py + 4 * p, 4 * p, 2 * p);
  ctx.restore();
}
function tvLight(t, x, y, r, k = 1) {                                        // 电视的光照在屋里：一闪一闪，颜色跟着画面变
  const f = .75 + .25 * Math.sin(t * 7.3) * Math.sin(t * 2.9 + 1), c = Math.sin(t * 1.7) > .3 ? '120,200,255' : '255,170,110';
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 10, x, y, r);
  g.addColorStop(0, `rgba(${c},${.2 * f * k})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore();
}

// ======================================================================== 各个机位
// 人站在哪（画框坐标；镜头在外面乘）
const LIV = { me: { cx: 300, feet: 1405, hgt: 600 }, mom: { cx: 790, feet: 1352, hgt: 500, flip: true }, med: { cx: 430, top: 790, s: .66 } };
const ROOMP = { me2: { cx: 250, top: 806, s: .58 }, her2: { cx: 832, w: 520, flip: true }, me1: { cx: 470, top: 770, s: .7 }, her1: { cx: 600, w: 640, flip: true } };
const faceOf = m => [m.cx, m.top + (HERO.fy - HERO.top) * m.s];
// 过肩：前景是他（压成黑影、糊的，占画面左边四成）
function inFrame(fn) { ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip(); fn(); ctx.restore(); }
const otsMe = t => inFrame(() => hero({ cx: 120, top: 610, s: 1.12, dark: DARK }, t));
const otsHer = t => inFrame(() => bust('她', { cx: 990, w: 860, flip: true, dark: DARK, bottom: FB + 250 }, t));
const store = (t, cam, me, o = {}) => set(t, 'store', null, cam, o, () => { if (me) hero(me, t); });
const living = (t, cam, o, fn) => set(t, 'living', null, cam, o, fn);
const office = (t, cam, o, fn) => set(t, 'office', null, cam, o, fn);
const room = (t, side, cam, o, fn) => set(t, 'room', ROOM[side], cam, o, fn);
const push = (a, b) => (t, u, d) => camLerp(a, b, E.io(u / Math.max(d, .1)));    // 慢推

// ======================================================================== 镜头表
let SHOTS = [], BYID = {};
const M0 = () => DE(30) + .17;                                               // 回忆快闪开始（“为什么……”说完）
const M_END = 5.15;                                                           // 快闪一共多长（最后 0.45 秒叠化到他的脸）
const TIMES = () => [[S['便利店'], '*大二暑假'], [S['回家'], '*发工资那天'], [S['几天后'], '*几天后'], [S['办公室'], '*工作第一年'], [S['三年后'], '*三年后'],
  [S['她的生日'], '*在一起的第一年，她的生日'], [S['他的生日'], '*他生日前一周'], [S['生日那天'], '*他生日那天']];
function INIT() {
  HX = [[0, 'calm'], [D(1) - .4, 'happy'],                                    // 换表情尽量放在他不在画面里的时候（插入镜头、过肩的黑影）
        [S['回家'], 'calm'], [D(2) - .1, 'happy'], [D(3) - .1, 'calm'], [D(4) - .4, 'sad'], [DE(7) - .96, 'meh'],
        [S['几天后'], 'calm'], [D(10) - .35, 'awkward'],
        [S['办公室'], 'calm'], [D(13) - .3, 'happy'], [D(14) + .1, 'meh'],
        [S['三年后'], 'calm'], [D(16) - .2, 'meh'],
        [S['她的生日'], 'happy'], [D(20) - .15, 'awkward'],
        [S['他的生日'], 'calm'], [D(24) - .1, 'awkward'], [D(28) - .4, 'sad'], [D(33) + 5.2, 'cry'], [D(34), 'sad'], [D(35) + .6, 'calm'], [D(36) - .3, 'happy']];
  const sh = (id, t0, f) => ({ id, t0, f });
  const ME = LIV.med, MEF = faceOf(ME), R1F = faceOf(ROOMP.me1);
  SHOTS = [
    // ① 便利店（大二暑假的夜班）：空镜 → 他 → 购物车（刚刚加入）→ 脸
    sh('A1', 0, (t, u, d) => store(t, push([CX, CY, 1.0], [CX, CY, 1.03])(t, u, d), null)),
    sh('A2', 1.3, (t, u, d) => store(t, [CX, CY, 1.0], { cx: 600, top: 800, s: .64 }, { z: 1.15, at: [600, 1000], dof: .35 })),
    sh('A3', 2.3, (t, u, d) => phoneInsert('store', null, (sx, sy, sw, sh) => cartScreen(sx, sy, sw, sh, { tag: '刚刚加入' }), { sc: lerp(1, 1.22, E.io(u / d)), at: ITEM })),
    sh('A4', D(1) - .14, (t, u, d) => store(t, push([600, 990, 1.62], [600, 985, 1.72])(t, u, d), { cx: 600, top: 800, s: .64 }, { z: 1.15, at: [600, 1000], dof: .35 })),
    // ② 发工资那天：家
    sh('B1', S['回家'], (t) => living(t, [CX, CY, 1.0], {}, () => { full('妈f', { ...LIV.mom, who: '妈' }); hero(LIV.me, t); })),
    sh('B2', D(2) - .25, (t, u) => phoneInsert('living', null, (sx, sy, sw, sh) => smsScreen(u, sx, sy, sw, sh))),
    sh('B3', D(3) - .07, (t, u, d) => { living(t, push([700, 960, 1.06], [700, 960, 1.1])(t, u, d), {}, () => full('妈f', { cx: 760, feet: 1335, hgt: 430, flip: true, who: '妈' })); otsMe(t); }),
    sh('B4', D(4) - .15, (t, u, d) => living(t, push([CX, CY, 1.0], [CX, CY, 1.02])(t, u, d), { z: 1.3, at: [430, 1000], dof: .5 }, () => hero(ME, t))),
    sh('B5', D(4) + 1.55, (t, u, d) => phoneInsert('living', null, () => momPhone(t), { old: true, sc: lerp(1, 1.03, u / d) })),
    sh('B6', D(5) - .07, (t, u, d) => living(t, push([600, 1000, 1.1], [600, 1000, 1.14])(t, u, d), {}, () => { full('妈f', { ...LIV.mom, who: '妈' }); hero(LIV.me, t); })),
    sh('B7', DE(5) + .45, (t, u, d) => living(t, push([MEF[0], MEF[1], 1.75], [MEF[0], MEF[1] - 5, 1.86])(t, u, d), { z: 1.3, at: [430, 1000], dof: .5 }, () => hero(ME, t))),
    sh('B8', DE(6) + .12, (t, u) => phoneInsert('living', null, (sx, sy, sw, sh) => buyScreen(u, sx, sy, sw, sh))),
    sh('B9', D(7) - .23, (t, u, d) => phoneInsert('living', null, (sx, sy, sw, sh) => cartScreen(sx, sy, sw, sh, { tag: '2个月前加入', time: '21:53' }), { sc: lerp(1, 1.18, E.io(u / d)), at: ITEM })),
    sh('B10', DE(7) - .76, (t, u, d) => living(t, push([MEF[0], MEF[1], 1.6], [MEF[0], MEF[1], 1.68])(t, u, d), { z: 1.3, at: [430, 1000], dof: .5 }, () => hero(ME, t))),
    // ③ 几天后：妈妈的新手机 → 两个人 → 他（撒了个谎）
    sh('C1', S['几天后'], (t, u) => phoneInsert('living', null, (sx, sy, sw, sh) => bigChat(u, sx, sy, sw, sh))),
    sh('C2', D(8) + 1.2, (t, u, d) => living(t, push([CX, 990, 1.04], [CX, 990, 1.09])(t, u, d), {}, () => { full('妈f', { ...LIV.mom, who: '妈' }); hero(LIV.me, t); })),
    sh('C3', D(10) - .13, (t, u, d) => living(t, push([CX, CY, 1.0], [CX, CY, 1.03])(t, u, d), { z: 1.3, at: [430, 1000], dof: .5 }, () => hero(ME, t))),
    // ④ 工作第一年：办公室，请客 → 账单 → 他
    sh('D1', S['办公室'], (t, u, d) => office(t, push([CX, CY, 1.0], [CX, CY, 1.03])(t, u, d), {}, () => {
      bust('运', { cx: 905, w: 360, flip: true }, t); bust('哥', { cx: 615, w: 440, flip: true }, t); hero({ cx: 255, top: 868, s: .52 }, t); })),
    sh('D2', D(11) + 1.9, (t, u, d) => office(t, push([CX, CY, 1.0], [CX, CY, 1.02])(t, u, d), { z: 1.3, at: [650, 1000], dof: .55 }, () => bust('哥', { cx: 600, w: 620, flip: true }, t))),
    sh('D3', D(12) - .11, (t, u, d) => office(t, [CX, CY, 1.0], { z: 1.3, at: [800, 1000], dof: .55 }, () => bust('运', { cx: 620, w: 570, flip: true }, t))),
    sh('D4', D(13) - .12, (t, u, d) => office(t, [CX, CY, 1.0], { z: 1.3, at: [300, 1000], dof: .55 }, () => hero({ cx: 450, top: 780, s: .68 }, t))),
    sh('D5', DE(13) + .19, (t, u) => phoneInsert('office', null, (sx, sy, sw, sh) => billScreen(u, sx, sy, sw, sh))),
    sh('D6', D(14) + .34, (t, u, d) => office(t, push([450, 990, 1.6], [450, 985, 1.75])(t, u, d), { z: 1.3, at: [300, 1000], dof: .55 }, () => hero({ cx: 450, top: 780, s: .68 }, t))),
    // ⑤ 三年后：夜里的出租屋，阿杰结婚
    sh('E1', S['三年后'], (t) => room(t, 'R', [CX, CY, 1.0], {}, () => hero({ cx: 430, top: 800, s: .62 }, t))),
    sh('E2', D(15) - .15, (t) => phoneInsert('room', ROOM.R, (sx, sy, sw, sh) => weddingChat(t, sx, sy, sw, sh))),
    sh('E3', D(16) - .23, (t, u, d) => room(t, 'R', push([430, 990, 1.6], [430, 985, 1.7])(t, u, d), {}, () => hero({ cx: 430, top: 800, s: .62 }, t))),
    // ⑥ 她的生日：两人同框（中间）→ 她（右边）→ 过肩 → 他（左边）→ 他的脸
    sh('F1', S['她的生日'], (t) => room(t, 'C', [CX, CY, 1.0], {}, () => { bust('她', ROOMP.her2, t); hero(ROOMP.me2, t); })),
    sh('F2', D(17) - .05, (t, u, d) => room(t, 'R', push([CX, CY, 1.0], [CX, CY, 1.05])(t, u, d), { z: 1.2, at: [560, 1000], dof: .45 }, () => bust('她', ROOMP.her1, t))),
    sh('F3', D(18) - .12, (t) => { room(t, 'R', [CX, CY, 1.0], { z: 1.1, at: [700, 1000], dof: .2 }, () => bust('她', { cx: 720, w: 440, flip: true }, t)); otsMe(t); }),
    sh('F4', D(19) - .13, (t, u, d) => room(t, 'L', push([CX, CY, 1.0], [CX, CY, 1.04])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('F5', D(20) - .15, (t, u, d) => room(t, 'L', push([R1F[0], R1F[1], 1.6], [R1F[0], R1F[1] - 5, 1.72])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    // ⑦ 他生日前一周
    sh('G1', S['他的生日'], (t, u, d) => { room(t, 'C', push([600, 980, 1.02], [600, 980, 1.07])(t, u, d), {}, () => full('她f', { cx: 735, feet: 1338, hgt: 405, flip: true, who: '她' })); otsMe(t); }),
    sh('G2', D(22) - .17, (t) => room(t, 'L', [CX, CY, 1.0], { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('G3', D(23) - .19, (t) => room(t, 'R', [CX, CY, 1.0], { z: 1.2, at: [560, 1000], dof: .45 }, () => bust('她', ROOMP.her1, t))),
    sh('G4', D(24) - .13, (t, u, d) => room(t, 'L', push([CX, CY, 1.0], [R1F[0], R1F[1] + 40, 1.12])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('G5', DE(24) + .43, (t, u, d) => room(t, 'R', push([CX, CY, 1.0], [CX, CY, 1.06])(t, u, d), { z: 1.45, at: [560, 1000], dof: .9 }, () => bust('她', { cx: 590, w: 780, flip: true, bottom: FB + 150 }, t))),
    sh('G6', D(26) - .1, (t, u, d) => room(t, 'C', push([CX, CY, 1.0], [CX, CY, 1.03])(t, u, d), {}, () => { bust('她', ROOMP.her2, t); hero(ROOMP.me2, t); })),
    sh('G7', DE(26) + .11, (t, u, d) => phoneInsert('room', ROOM.L, (sx, sy, sw, sh) => searchScreen(u, sx, sy, sw, sh), { sc: lerp(1, 1.42, E.io(prog(u, .8, 2.9))), at: ITEM })),
    sh('G8', D(28) - .34, (t, u, d) => room(t, 'L', push([R1F[0], R1F[1], 1.55], [R1F[0], R1F[1] - 4, 1.62])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('G9', D(29) - .15, (t) => { room(t, 'R', [CX, CY, 1.0], { z: 1.1, at: [700, 1000], dof: .2 }, () => bust('她', { cx: 720, w: 440, flip: true }, t)); otsMe(t); }),
    sh('G10', D(30) - .15, (t, u, d) => room(t, 'L', push([R1F[0], R1F[1] + 10, 2.2], [R1F[0], R1F[1] + 10, 2.3])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('M', M0(), montage),
    sh('G11', M0() + M_END, (t, u, d) => room(t, 'L', push([R1F[0], R1F[1], 1.5], [R1F[0], R1F[1], 1.56])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('G12', D(32) - .12, (t, u, d) => { room(t, 'L', push([CX, CY, 1.0], [CX, CY, 1.03])(t, u, d), { z: 1.1, at: [400, 1000], dof: .2 }, () => hero({ cx: 420, top: 900, s: .5 }, t)); otsHer(t); }),
    sh('G13', D(33) - .12, (t, u, d) => room(t, 'L', camLerp([R1F[0], R1F[1] + 60, 1.25], [R1F[0], R1F[1] - 10, 2.05], E.ioSine(prog(t, D(33), DE(33) + 1.4))), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    sh('G14', D(34) - .19, (t, u, d) => room(t, 'R', push([CX, CY, 1.0], [CX, CY, 1.07])(t, u, d), { z: 1.2, at: [560, 1000], dof: .45 }, () => bust('她', ROOMP.her1, t))),
    sh('G15', D(35) - .16, (t, u, d) => room(t, 'C', push([CX, CY, 1.0], [CX, CY, 1.04])(t, u, d), {}, () => { bust('她', ROOMP.her2, t); hero(ROOMP.me2, t); })),
    sh('G16', DE(35) + .16, (t, u) => phoneInsert('room', ROOM.L, (sx, sy, sw, sh) => payScreen(u, sx, sy, sw, sh))),
    sh('G17', D(36) + .16, (t, u, d) => room(t, 'L', push([R1F[0], R1F[1] + 30, 1.35], [R1F[0], R1F[1], 1.5])(t, u, d), { z: 1.2, at: [500, 1000], dof: .45 }, () => hero(ROOMP.me1, t))),
    // ⑧ 他生日那天：电视在玩游戏 → 两个人 → “好玩。”→ 拉远，字卡
    sh('H1', S['生日那天'], (t, u, d) => { const [x0, y0] = ph2fr(ROOM.C, TV[0], TV[1]), [x1, y1] = ph2fr(ROOM.C, TV[2], TV[3]);
      room(t, 'C', push([(x0 + x1) / 2, (y0 + y1) / 2 + 10, 2.5], [(x0 + x1) / 2, (y0 + y1) / 2 + 10, 2.6])(t, u, d), { tv: 1 }, () => tvLight(t, (x0 + x1) / 2, (y0 + y1) / 2, 420)); }),
    sh('H2', D(37) - .15, (t) => room(t, 'C', [CX, CY, 1.0], { tv: 1 }, () => { tvLight(t, 437, 990, 640); bust('她', ROOMP.her2, t); hero(ROOMP.me2, t); tvLight(t, 437, 990, 900, .6); })),
    sh('H3', D(38) - .12, (t) => room(t, 'L', [CX, CY, 1.0], { z: 1.2, at: [500, 1000], dof: .45, tv: 1 }, () => { hero(ROOMP.me1, t); tvLight(t, 880, 1000, 700, .8); })),
    sh('H4', DE(38) + 1.25, (t, u, d) => room(t, 'C', push([CX, CY, 1.0], [CX, CY, 1.12])(t, u, d), { tv: 1 }, () => { tvLight(t, 437, 990, 640); bust('她', ROOMP.her2, t); hero(ROOMP.me2, t); tvLight(t, 437, 990, 900, .6); })),
  ];
  SHOTS.forEach((s, i) => { s.t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t0 : TOTAL + 1; BYID[s.id] = s; });
}

// ======================================================================== 回忆快闪（照着参考视频逐帧量出来的节奏）
// 前面出现过的画面，灰的、一张比一张快，夹着白光；最后一下白光里淡出彩色的购物车（开头那个画面），停一会儿，叠化到他的脸
const FLASH = [.45, .9, 1.25, 1.6, 1.95, 2.75, 3.05, 3.4];
let MSEQ = null;
function montageSeq() {
  if (MSEQ) return MSEQ;
  const r = mulberry(55), pool = ['A2', 'A4', 'B1', 'B3', 'B5', 'B6', 'B7', 'B8', 'B9', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'E2', 'E3', 'F1', 'F2', 'F4', 'F5', 'G4', 'G6'];
  let last = ''; const pick = () => { let id; do id = pool[Math.floor(r() * pool.length)]; while (id === last); last = id; return id; };
  const seq = [];                                                            // [开始, 结束, 镜头, 镜头里的哪一刻（0–1）, 糊, 亮度]
  ['B7', 'B5', 'D5', 'F2'].forEach((id, i) => seq.push([i * .11, (i + 1) * .11, id, .6, 9, .95]));
  for (let t = .58; t < 2.1;) { const d = (1 + Math.floor(r() * 3)) / 30; seq.push([t, t + d, pick(), r(), 0, .95]); t += d; }
  seq.push([2.1, 2.32, 'C2', .45, 0, .72], [2.32, 2.52, 'E2', .7, 0, .72]);
  for (let t = 2.52; t < 3.4;) { const d = (1 + Math.floor(r() * 2)) / 30; seq.push([t, t + d, pick(), r(), 0, .95]); t += d; }
  return (MSEQ = seq);
}
const MIX = mk(W, H), MIXC = MIX.getContext('2d');
function drawShotAt(id, k) { const s = BYID[id], tt = lerp(s.t0, s.t1, k); s.f(tt, tt - s.t0, s.t1 - s.t0); }
function montage(t, u) {
  if (u < 3.45) {
    const it = montageSeq().find(([a, b]) => u >= a && u < b);
    if (it) { drawShotAt(it[2], it[3]); postFilter(`grayscale(.92) contrast(1.12) brightness(${it[5]})${it[4] ? ` blur(${it[4]}px)` : ''}`); }
  } else {                                                                     // 彩色的购物车，从白光里出来
    drawShotAt('A3', .4);
    postFilter(`saturate(${lerp(.1, 1, E.out(prog(u, 3.45, 3.85))).toFixed(2)})`);
    if (u > M_END - .45) {                                                     // 叠化到他的脸
      MIXC.setTransform(1, 0, 0, 1, 0, 0); MIXC.globalCompositeOperation = 'copy'; MIXC.drawImage(ctx.canvas, 0, 0);
      const g = BYID.G11, tt = t; g.f(tt, 0, g.t1 - g.t0);
      ctx.save(); ctx.globalAlpha = 1 - sstep(M_END - .45, M_END, u); ctx.drawImage(MIX, 0, 0); ctx.restore();
    }
  }
  let fl = 0; for (const f of FLASH) fl = Math.max(fl, win(u, f, f + (f === FLASH[0] ? .13 : .08), .02, .05));
  fl = Math.max(fl, u >= 3.4 ? 1 - E.out(prog(u, 3.45, 3.85)) : 0);
  if (fl > 0) { ctx.save(); ctx.globalAlpha = fl * .96; ctx.fillStyle = '#fbf8f2'; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore(); }
}

// ======================================================================== 后期：模糊转场、整块加滤镜
const PF = mk(FR.w, FR.h), PFX = PF.getContext('2d');
function postFilter(f) {                                                     // 把画框那块拷出来，加滤镜再画回去
  PFX.setTransform(1, 0, 0, 1, 0, 0); PFX.globalCompositeOperation = 'copy'; PFX.filter = 'none'; PFX.globalAlpha = 1;
  PFX.drawImage(ctx.canvas, FR.x, FR.y, FR.w, FR.h, 0, 0, FR.w, FR.h);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  ctx.fillStyle = '#000'; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.filter = f; ctx.drawImage(PF, FR.x, FR.y); ctx.restore();
}
// 模糊转场：0.2 秒越来越糊，最糊的时候切，0.6 秒先快后慢地变清楚（进回忆快闪只糊不清，快闪自己的头几张还是糊的）
const CUTS = () => ['回家', '几天后', '办公室', '三年后', '她的生日', '他的生日', '生日那天'].map(n => S[n]);
function cutBlur(t) {
  let r = 0;
  for (const c of [...CUTS(), M0()]) {
    if (t >= c - .2 && t < c) r = Math.max(r, 26 * E.in((t - c + .2) / .2));
    if (t >= c && t < c + .6 && c !== M0()) r = Math.max(r, 26 * (1 - E.out((t - c) / .6)));
  }
  return r;
}

// ======================================================================== 世界层
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  SEEN = {};
  const i = Math.max(0, SHOTS.findIndex(s => t >= s.t0 && t < s.t1)), sh = SHOTS[i];
  sh.f(t, t - sh.t0, sh.t1 - sh.t0);
  if (sh.id === 'M') SEEN = {};
  const r = cutBlur(t); if (r > .3) postFilter(`blur(${r.toFixed(1)}px)`);
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.10)'; ctx.lineWidth = 2; ctx.strokeRect(FR.x - 1, FR.y - 1, FR.w + 2, FR.h + 2); ctx.restore();
  bubbles(t);
  // 画框上面的黑边：开头是封面钩子，之后是标题；左下角写时间（*大二暑假）
  const L = S['回家'], hook = 1 - sstep(L - .9, L - .2, t), ttl = sstep(L + .5, L + 1.3, t);
  text('他给所有人都花过钱，', CX, 256, { size: 60, weight: 900, align: 'center', color: CREAM, alpha: hook });
  text('除了他自己。', CX, 352, { size: 70, weight: 900, align: 'center', color: GOLD, alpha: hook });
  text('购物车里的游戏机', CX, 272, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: ttl, ls: 6 });
  text('当一个男生，觉得自己不配', CX, 348, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: ttl * .85, ls: 2 });
  for (const [s, label] of TIMES()) text(label, 40, 428, { font: SANS, size: 36, weight: 900, color: '#ffffff', alpha: win(t, s + .1, s + 3.4, .25, .5), ls: 2 });
  // 最后的字卡（画框下面）
  const c1 = win(t, CARDS_AT, CARDS_AT + 3.6, .5, .5), c2 = sstep(CARDS_AT + 3.4, CARDS_AT + 4.0, t);
  typeText('你上一次为自己花钱，', CX, 1530, { ...BIGO, size: 52, weight: 900, color: CREAM }, prog(t, CARDS_AT, CARDS_AT + 1.0), c1);
  typeText('是什么时候？', CX, 1622, { ...BIGO, size: 58, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, CARDS_AT + 1.0, CARDS_AT + 2.0), c1);
  typeText('评论区说说：', CX, 1530, { size: 44, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, CARDS_AT + 3.5, CARDS_AT + 4.0), c2);
  typeText('你的购物车里，放得最久的是什么？', CX, 1620, { size: 48, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, CARDS_AT + 3.9, CARDS_AT + 5.0), c2);
}
const BIGO = { align: 'center', spread: 3, blur: 14, rise: 18 };
function SAMPLES(T) { return 2; }
function BLOOM_K(T) { return T >= S['生日那天'] ? .28 : .18; }               // 最后电视的光泛一点
function OVER(T) {}
function MASTER(T) { return 1; }

// ======================================================================== 音效提示表
function CUES() {
  const c = [], A = (t, kind, o = {}) => c.push([t, kind, o]), at = id => BYID[id].t0;
  // 换段：模糊转场配一声很低的“嗡”
  for (const s of CUTS()) A(s - .24, 'whoomp', { gain: .55 });
  // ① 便利店：冰柜和灯的嗡嗡声；手机上点一下
  A(0, 'room', { dur: S['回家'] + .1, gain: 1.1, fi: .05, fo: .25 }); A(at('A3') + .08, 'click', { gain: .45 });
  // ② 家：进门；屋里很静，钟在走；短信；妈妈的手机“卡住了”；下单、付款成功
  A(S['回家'], 'room', { dur: S['办公室'] - S['回家'], gain: .5, fi: .3, fo: .3 });
  for (let t = S['回家'] + .6; t < S['办公室'] - .3; t += 1.0) A(t, 'tick', { gain: .016 });
  A(S['回家'] + .05, 'door', { gain: .45 });
  A(at('B2') + .1, 'ding', { gain: .3, f: 1318.5, pan: .1 });
  A(at('B5') + .2, 'lowbat', { gain: .3 });
  A(at('B8') + .85, 'click', { gain: .45 }); A(at('B8') + 1.05, 'chord', { f: [1568, 2093], gain: .22 });
  // ③ 几天后：新手机上一条条消息
  for (const [k, f] of [[0, 850], [.55, 1200], [1.0, 1200]]) A(at('C1') + k, 'pop', { f, gain: .3 });
  // ④ 办公室：空调的嗡嗡声、同事们在说笑；账单一条条冒出来
  A(S['办公室'], 'room', { dur: S['三年后'] - S['办公室'], gain: .9, fi: .3, fo: .3 });
  A(S['办公室'], 'chatter', { dur: at('D5') - S['办公室'] + .3, gain: .22, fi: .4, fo: .5 });
  for (let i = 0; i < 3; i++) A(at('D5') + .1 + i * .38, 'pop', { f: 900, gain: .25 });
  A(at('D5') + 1.35, 'pop', { f: 700, gain: .3 });
  // ⑤ 三年后：夜里，窗外远处的车；手机一震；请帖、消息、回复
  A(S['三年后'], 'room', { dur: S['她的生日'] - S['三年后'], gain: .45, fi: .3, fo: .3 }); A(S['三年后'], 'night', { dur: S['她的生日'] - S['三年后'], gain: .6, fi: .4, fo: .4 });
  A(at('E1') + .4, 'buzz', { gain: .45 });
  A(D(15) - .55, 'pop', { f: 850, gain: .3 }); A(D(15) - .05, 'pop', { f: 850, gain: .3 }); A(WED_REPLY(), 'pop', { f: 1200, gain: .3 });
  // ⑥ 她的生日：拆礼物的纸
  A(S['她的生日'], 'room', { dur: S['他的生日'] - S['她的生日'], gain: .45, fi: .3, fo: .3 });
  A(S['她的生日'] + .1, 'page', { gain: .35 }); A(S['她的生日'] + .45, 'page', { gain: .25 });
  // ⑦ 他生日前一周：屋里很静，钟在走；点“购物车”；“为什么……”往上走的一声“嘶”；回忆快闪的白光配低音冲击，最后留一个长音
  A(S['他的生日'], 'room', { dur: M0() - S['他的生日'], gain: .45, fi: .3, fo: .2 });
  for (let t = S['他的生日'] + .5; t < M0() - 1.2; t += 1.0) A(t, 'tick', { gain: .014 });
  A(at('G7') + .5, 'click', { gain: .45 });
  A(M0() - 1.0, 'riser', { dur: 1.0, gain: .22 });
  for (const f of FLASH) A(M0() + f - .02, 'impact', { gain: .5 });
  A(M0() + 3.45, 'tone', { dur: 1.8, gain: .3 });
  A(M0() + M_END - .4, 'room', { dur: S['生日那天'] - M0() - M_END + .4, gain: .45, fi: .6, fo: .2 });
  for (let t = M0() + M_END + .5; t < S['生日那天'] - .5; t += 1.0) A(t, 'tick', { gain: .014 });
  A(at('G16') + PAY.tap1, 'click', { gain: .45 }); A(at('G16') + PAY.sheet, 'swish', { dur: .3, gain: .04 });
  A(at('G16') + PAY.press, 'click', { gain: .5 }); A(at('G16') + PAY.press + .12, 'chord', { f: [1568, 2093, 2637], gain: .26 });
  // ⑧ 他生日那天：电视里的游戏
  A(S['生日那天'], 'room', { dur: TOTAL - S['生日那天'], gain: .4, fi: .3, fo: 1.0 });
  A(S['生日那天'], 'game', { dur: at('H2') - S['生日那天'] + .1, gain: .32, pan: 0 });
  A(at('H2'), 'game', { dur: TOTAL - at('H2'), gain: .14, pan: -.2 });
  A(CARDS_AT, 'shimmer', { f: [1174.7, 1568, 1975.5, 2349.3], gain: .05 });
  return c.sort((a, b) => a[0] - b[0]);
}
