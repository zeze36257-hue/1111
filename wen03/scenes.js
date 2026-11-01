// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 36.7;
const SECTIONS = [['读文案', 0, TOTAL]];
const LINES = [];                                                   // 字幕自己画（SUBS）
const DIALOG = [
  [0.70, 3.48, '为什么，你总是不肯让自己犯一点错？', '黑', 'vo'],
  [4.18, 8.55, '日子稍微有点风吹草动，你就开始焦虑、开始内耗。', '黑', 'vo'],
  [8.75, 12.76, '可想来想去，问题没解决，心情倒先坏了。', '黑', 'vo'],
  [13.36, 15.78, '放不下昨天，也过不好今天。', '黑', 'vo'],
  [16.58, 20.61, '其实，生活里有点不如意，再正常不过了。', '黑', 'vo'],
  [21.11, 24.96, '这世上本来就没有完美的事，你也不用做完美的人。', '黑', 'vo'],
  [25.76, 27.95, '不想犯错，当然是好事；', '黑', 'vo'],
  [28.10, 31.74, '可要是你允许自己出错，还敢从错里学到点什么，', '黑', 'vo'],
  [31.94, 34.19, '这样的你，只会越来越好。', '黑', 'vo'],
];
// 字幕：[出来, 说完, 这一截]（一句配音按标点分成几截，跟着录音里的停顿）
const SUBS = [
  [0.70, 1.34, '为什么，'],
  [1.45, 3.38, '你总是不肯让自己犯一点错？'],
  [4.18, 6.00, '日子稍微有点风吹草动，'],
  [6.39, 8.45, '你就开始焦虑、开始内耗。'],
  [8.75, 9.69, '可想来想去，'],
  [10.08, 10.90, '问题没解决，'],
  [11.44, 12.66, '心情倒先坏了。'],
  [13.36, 14.34, '放不下昨天，'],
  [14.75, 15.68, '也过不好今天。'],
  [16.58, 17.28, '其实，'],
  [17.78, 18.95, '生活里有点不如意，'],
  [19.56, 20.51, '再正常不过了。'],
  [21.11, 23.00, '这世上本来就没有完美的事，'],
  [23.59, 24.86, '你也不用做完美的人。'],
  [25.76, 26.54, '不想犯错，'],
  [26.95, 27.85, '当然是好事；'],
  [28.10, 29.68, '可要是你允许自己出错，'],
  [30.01, 31.64, '还敢从错里学到点什么，'],
  [31.94, 32.73, '这样的你，'],
  [33.19, 34.09, '只会越来越好。'],
];
// 镜头：[开始, 图]（一句配音一张图，比开口早一点点切）
const CUTS = [[0.00, '01'], [4.06, '14'], [8.63, '06'], [13.24, '12'], [16.46, '11'], [20.99, '04'], [25.64, '05'], [31.82, '03']];
// ======================================================================== 时间轴结束

// ======================================================================== 读文案第二期《你也不用做完美的人》
// 文案是频道主给的（他要我改写过）；图从他发来的两批图里按意思挑；温润男声；一句配音一张图，硬切。
// 背景音乐：TRA$H《Memories》完整版，从头放，结尾淡出。
// 画面跟 wen02 一样（以后的读文案都照这个做）：
//   - 不要边框（第二版那种糊掉的底、圆角、细白边、投影都不要）：黑底，图放在正中间；
//   - 图按原来的比例整张放，不裁、不做特写：2:3 的图宽 1080、高 1620，别的比例按原比例缩进这个框；
//   - 缩放几乎没有（一个镜头里放大 1.2%，只在图的范围里放大，图的边不动）；
//   - 图的左上角上方：一对橙青的猫眼 + “黑猫不说话”。
// 字幕：白色特粗字加黑边，跟着配音一截一截出来，位置固定。没有片头、没有进度条、没有片尾；水印照旧。
const WHITE = '#ffffff';
document.fonts.load('900 60px "Noto Sans SC"', '你也不用做完美的人');

// ======================================================================== 图
const DIR = '../characters/读文案/图/';
const FILES = { '01': '01_他_回头_黑白.png', '02': '02_两个人_火车上大笑.png', '03': '03_两个人_夕阳下牵手跑.png',
  '04': '04_两个人_自拍吐舌头.png', '05': '05_两个人_海边骑车.png', '06': '06_两个人_长椅靠肩.png', '07': '07_两个人_傍晚牵手.png',
  '08': '08_他_过马路挥手.png', '10': '10_两个人_海边点鼻子.png', '11': '11_两个人_咖啡馆摸头.png', '12': '12_他和老人_雪天河边长椅.png',
  '13': '13_两个人_门两边对望.png', '14': '14_两个人_车边靠肩.png', '15': '15_两个人_婚礼.png' };   // 09 频道主说不要再用
const IMG = {};
for (const [k, f] of Object.entries(FILES)) { const im = new Image(); im.src = DIR + f; IMG[k] = im; }
function ASSETS_READY() { return Object.values(IMG).every(im => im.complete && im.naturalWidth > 0) && document.fonts.check('900 60px "Noto Sans SC"', '爱'); }

// 图最大占多大：宽 1080、高 1620（2:3），放在正中间；别的比例的图按原比例放进这个框里（不裁）
const BOX = { cx: 540, cy: 960, w: 1080, h: 1620 }, TOP = BOX.cy - BOX.h / 2, ZOOM = .012;
function rectOf(id) {
  const im = IMG[id], a = im.naturalWidth / im.naturalHeight, w = Math.min(BOX.w, BOX.h * a), h = w / a;
  return { x: BOX.cx - w / 2, y: BOX.cy - h / 2, w, h };
}
function photo(id, k) {                                                     // 图的边不动，里面几乎不缩放
  const im = IMG[id], r = rectOf(id), z = 1 + ZOOM * k;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip(); ctx.imageSmoothingQuality = 'high';
  ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.scale(z, z); ctx.drawImage(im, -r.w / 2, -r.h / 2, r.w, r.h); ctx.restore();
}
function shotAt(t) { let i = 0; for (let k = 0; k < CUTS.length; k++) if (t >= CUTS[k][0]) i = k; return i; }

// ======================================================================== 字幕：一截一截出来，每个字出来时轻轻弹一下
const SUB = { y: TOP + BOX.h * .76, size: 62, stroke: 11 };
function subtitle(t) {
  SUBS.forEach(([a, b, s], i) => {
    const next = SUBS[i + 1] ? SUBS[i + 1][0] : TOTAL - .6;
    if (t < a || t >= next) return;
    const str = s.replace(/[，：；。！？]$/, ''), chars = [...str], n = chars.length;
    font(SUB.size, 900, SANS); ctx.letterSpacing = '1px';
    const ws = chars.map(c => ctx.measureText(c).width + 1), total = ws.reduce((x, y) => x + y, 0) - 1;
    let x = BOX.cx - total / 2;
    const span = Math.max(.25, (b - a) * .9), fade = 1 - sstep(next - .12, next, t) * (i + 1 === SUBS.length ? 1 : 0);
    chars.forEach((c, k) => {
      const at = a + span * k / n, p = clamp((t - at) / .09);
      if (p > 0) {
        const sc = 1 + .28 * (1 - E.out(p));
        ctx.save(); ctx.translate(x + ws[k] / 2, SUB.y); ctx.scale(sc, sc); ctx.globalAlpha = p * fade;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
        ctx.strokeStyle = '#000'; ctx.lineWidth = SUB.stroke; ctx.strokeText(c, 0, 0);
        ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.fillStyle = WHITE; ctx.fillText(c, 0, 0);
        ctx.restore();
      }
      x += ws[k];
    });
  });
}

// ======================================================================== 图的左上角上方：一对橙青的猫眼 + 黑猫不说话（位置固定）
function brand() {
  const x = 48, y = TOP - 46;
  ctx.save(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x + 10, y, 10, 0, TAU); ctx.fill();
  ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(x + 38, y, 10, 0, TAU); ctx.fill(); ctx.restore();
  text('黑猫不说话', x + 62, y + 1, { font: SANS, size: 34, weight: 500, color: CREAM, ls: 3 });
}

// ======================================================================== 一帧
function INIT() {}
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = shotAt(t), [t0, id] = CUTS[i], t1 = CUTS[i + 1] ? CUTS[i + 1][0] : TOTAL;
  photo(id, E.ioSine(clamp((t - t0) / (t1 - t0))));
  brand();
  subtitle(t);
}
function SAMPLES(T) { return 1; }
function BLOOM_K(T) { return .06; }
function OVER(T) {}
function MASTER(T) { return 1; }
function CUES() { return []; }
