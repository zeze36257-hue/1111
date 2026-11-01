// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 34.0;
const SECTIONS = [['读文案', 0, TOTAL]];
const LINES = [];                                                   // 字幕自己画（SUBS）
const DIALOG = [
  [0.70, 3.84, '年少的时候，总爱追着一个够不着的人跑。', '黑', 'vo'],
  [4.19, 7.23, '明知道等不到回应，还是想再勇敢一次。', '黑', 'vo'],
  [7.83, 10.30, '后来，心上多了一道疤，', '黑', 'vo'],
  [10.50, 15.15, '才慢慢明白：好的感情，不用那么用力。', '黑', 'vo'],
  [15.85, 17.84, '让你笑的，才叫爱；', '黑', 'vo'],
  [17.99, 20.07, '让你哭的，只是路过。', '黑', 'vo'],
  [20.77, 22.59, '别着急，慢慢走。', '黑', 'vo'],
  [23.19, 26.88, '总会有一个人，喜欢你，也懂你，', '黑', 'vo'],
  [27.08, 29.96, '笑着朝你跑来，牵起你的手，', '黑', 'vo'],
  [30.16, 31.52, '陪你一起往前走。', '黑', 'vo'],
];
// 字幕：[出来, 说完, 这一截]（一句配音按标点分成几截，跟着录音里的停顿）
const SUBS = [
  [0.70, 1.67, '年少的时候，'],
  [2.04, 3.74, '总爱追着一个够不着的人跑。'],
  [4.19, 5.36, '明知道等不到回应，'],
  [5.75, 7.13, '还是想再勇敢一次。'],
  [7.83, 8.36, '后来，'],
  [8.36, 10.20, '心上多了一道疤，'],
  [10.50, 11.62, '才慢慢明白：'],
  [12.51, 13.38, '好的感情，'],
  [14.15, 15.05, '不用那么用力。'],
  [15.85, 16.65, '让你笑的，'],
  [17.13, 17.74, '才叫爱；'],
  [17.99, 18.98, '让你哭的，'],
  [19.15, 19.97, '只是路过。'],
  [20.77, 21.51, '别着急，'],
  [21.98, 22.49, '慢慢走。'],
  [23.19, 24.31, '总会有一个人，'],
  [24.70, 25.32, '喜欢你，'],
  [26.12, 26.78, '也懂你，'],
  [27.08, 28.36, '笑着朝你跑来，'],
  [28.94, 29.86, '牵起你的手，'],
  [30.16, 31.42, '陪你一起往前走。'],
];
// 镜头：[开始, 图]（一句配音一张图，比开口早一点点切）
const CUTS = [[0.00, '13'], [7.71, '12'], [10.38, '14'], [15.73, '10'], [20.65, '11'], [26.96, '15']];
// ======================================================================== 时间轴结束

// ======================================================================== 读文案 02《让你笑的，才叫爱》
// 文案用第一条（wen01）的，图换成频道主 11 月 1 日发来的第二批 6 张；温润男声（用 wen01 的录音）；一句配音一张图，硬切。
// 背景音乐：TRA$H《Memories》完整版，从头放，结尾淡出。
// 画面按频道主 11 月 1 日的要求：
//   - 不要边框（第二版那种糊掉的底、圆角、细白边、投影都不要）：黑底，图放在正中间；
//   - 图按原来的比例整张放，不裁、不做特写：2:3 的图宽 1080、高 1620，别的比例按原比例缩进这个框；
//   - 缩放几乎没有（一个镜头里放大 1.2%，只在图的范围里放大，图的边不动）；
//   - 图的左上角上方：一对橙青的猫眼 + “黑猫不说话”。
// 字幕：白色特粗字加黑边，跟着配音一截一截出来，位置固定。没有片头、没有进度条、没有片尾；水印照旧。
const WHITE = '#ffffff';
document.fonts.load('900 60px "Noto Sans SC"', '让你笑的才叫爱');

// ======================================================================== 图
const DIR = '../characters/读文案/图/';
const FILES = { '10': '10_两个人_海边点鼻子.png', '11': '11_两个人_咖啡馆摸头.png', '12': '12_他和老人_雪天河边长椅.png',
  '13': '13_两个人_门两边对望.png', '14': '14_两个人_车边靠肩.png', '15': '15_两个人_婚礼.png' };
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
