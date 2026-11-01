// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 28.1;
const SECTIONS = [['读文案', 0, TOTAL]];
const LINES = [];                                                   // 字幕自己画（SUBS）
const DIALOG = [
  [0.70, 4.78, '你有没有发现，真正在乎你的人，话都不多。', '黑', 'vo'],
  [5.43, 7.50, '你逗他，他就笑着随你逗；', '黑', 'vo'],
  [7.70, 11.35, '你害羞得捂住脸，他就笑着摸摸你的头。', '黑', 'vo'],
  [12.05, 17.76, '爷爷也是这样，陪你坐一下午，一句话不说，也不会先走。', '黑', 'vo'],
  [18.56, 21.94, '后来，满场的人都在鼓掌，他只看着你。', '黑', 'vo'],
  [22.74, 24.11, '爱不一定要说出口，', '黑', 'vo'],
  [24.36, 25.63, '它一直都在。', '黑', 'vo'],
];
// 字幕：[出来, 说完, 这一截]（一句配音按标点分成几截，跟着录音里的停顿）
const SUBS = [
  [0.70, 1.50, '你有没有发现，'],
  [2.08, 3.24, '真正在乎你的人，'],
  [3.96, 4.68, '话都不多。'],
  [5.43, 6.07, '你逗他，'],
  [6.38, 7.40, '他就笑着随你逗；'],
  [7.70, 9.17, '你害羞得捂住脸，'],
  [9.56, 11.25, '他就笑着摸摸你的头。'],
  [12.05, 13.02, '爷爷也是这样，'],
  [13.93, 14.82, '陪你坐一下午，'],
  [15.38, 16.17, '一句话不说，'],
  [16.83, 17.66, '也不会先走。'],
  [18.56, 19.04, '后来，'],
  [19.41, 20.59, '满场的人都在鼓掌，'],
  [21.16, 21.84, '他只看着你。'],
  [22.74, 24.01, '爱不一定要说出口，'],
  [24.36, 25.53, '它一直都在。'],
];
// 镜头：[开始, 图]（一句配音一张图，比开口早一点点切）
const CUTS = [[0.00, '13'], [5.31, '10'], [7.58, '11'], [11.93, '12'], [18.44, '15'], [22.62, '14']];
// ======================================================================== 时间轴结束

// ======================================================================== 读文案 02《真正在乎你的人，话都不多》
// 文案是照着频道主 11 月 1 日发来的 6 张图写的（他这次没给文案）；温润男声；一句配音一张图，硬切。
// 背景音乐：TRA$H《Memories》完整版，从头放，结尾淡出。
// 画面按频道主 11 月 1 日的要求：
//   - 不要边框（第二版那种糊掉的底、圆角、细白边、投影都不要）：黑底，图放在正中间；
//   - 图按原来的比例整张放，不裁、不做特写：2:3 的图宽 1080、高 1620，别的比例按原比例缩进这个框；
//   - 缩放几乎没有（一个镜头里放大 1.2%，只在图的范围里放大，图的边不动）；
//   - 图的左上角上方：一对橙青的猫眼 + “黑猫不说话”。
// 字幕：白色特粗字加黑边，跟着配音一截一截出来，位置固定。没有片头、没有进度条、没有片尾；水印照旧。
const WHITE = '#ffffff';
document.fonts.load('900 60px "Noto Sans SC"', '真正在乎你的人话都不多');

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
