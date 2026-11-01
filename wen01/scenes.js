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
  [1.78, 3.74, '总爱追着一个够不着的人跑。'],
  [4.19, 5.36, '明知道等不到回应，'],
  [5.75, 7.13, '还是想再勇敢一次。'],
  [7.83, 8.36, '后来，'],
  [8.36, 10.20, '心上多了一道疤，'],
  [10.50, 11.62, '才慢慢明白：'],
  [12.51, 13.38, '好的感情，'],
  [13.92, 15.05, '不用那么用力。'],
  [15.85, 16.92, '让你笑的，'],
  [17.13, 17.74, '才叫爱；'],
  [17.99, 18.98, '让你哭的，'],
  [19.15, 19.97, '只是路过。'],
  [20.77, 21.51, '别着急，'],
  [21.98, 22.49, '慢慢走。'],
  [23.19, 24.39, '总会有一个人，'],
  [24.70, 25.61, '喜欢你，'],
  [25.92, 26.78, '也懂你，'],
  [27.08, 28.36, '笑着朝你跑来，'],
  [28.84, 29.86, '牵起你的手，'],
  [30.16, 31.42, '陪你一起往前走。'],
];
// 镜头：[开始, 图]（一句配音一张图，比开口早一点点切）
const CUTS = [[0.00, '08'], [7.71, '01'], [10.38, '06'], [15.73, '04'], [20.65, '02'], [23.07, '05'], [26.96, '03'], [30.04, '07']];
// ======================================================================== 时间轴结束

// ======================================================================== 读文案 01《让你笑的，才叫爱》
// 新格式的样片：频道主的文案（改写过）+ 温润男声；一句配音一张图（频道主用 GPT 做的成图，在 characters/读文案/图/），
// 背景音乐是频道主选的 TRA$H《Memories》。
// 第二版（11 月 1 日频道主的意见）：
//   - 图按原来的比例整张放，不裁、不做特写；缩放几乎没有（一个镜头放大 1.2%）；不用 09（沙发看手机）。
//   - 边框重做：整屏是这张图放大、糊掉、压暗的底；图放在中间，圆角、细白边、底下一点投影；
//     图上面左上角是一对橙青的猫眼 + “黑猫不说话”。
// 字幕：白色特粗字加黑边，跟着配音一截一截出来。没有片头、没有进度条，片尾和水印保留。
const WHITE = '#ffffff';
document.fonts.load('900 60px "Noto Sans SC"', '让你笑的才叫爱');

// ======================================================================== 图
const DIR = '../characters/读文案/图/';
const FILES = { '01': '01_他_回头_黑白.png', '02': '02_两个人_火车上大笑.png', '03': '03_两个人_夕阳下牵手跑.png', '04': '04_两个人_自拍吐舌头.png',
  '05': '05_两个人_海边骑车.png', '06': '06_两个人_长椅靠肩.png', '07': '07_两个人_傍晚牵手.png', '08': '08_他_过马路挥手.png' };
const IMG = {};
for (const [k, f] of Object.entries(FILES)) { const im = new Image(); im.src = DIR + f; IMG[k] = im; }
function ASSETS_READY() { return Object.values(IMG).every(im => im.complete && im.naturalWidth > 0) && document.fonts.check('900 60px "Noto Sans SC"', '爱'); }

// 图最大占多大：宽 1000、高 1500（2:3），中心在 (540, 985)；别的比例的图按原比例放进这个框里（不裁）
const BOX = { cx: 540, cy: 985, w: 1000, h: 1500 }, ZOOM = .012, RADIUS = 26;
function card(id) {                                                         // 这张图在屏幕上的位置和大小
  const im = IMG[id], a = im.naturalWidth / im.naturalHeight, w = Math.min(BOX.w, BOX.h * a), h = w / a;
  return { x: BOX.cx - w / 2, y: BOX.cy - h / 2, w, h };
}
const BG = {};
function backdrop(id) {                                                     // 整屏的底：这张图放大、糊掉、压暗（只算一次）
  if (!BG[id]) {
    const c = mk(W / 4, H / 4), g = c.getContext('2d'), im = IMG[id], s = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight) * 1.15;
    g.filter = 'blur(10px) brightness(.42) saturate(.9)';
    g.drawImage(im, (c.width - im.naturalWidth * s) / 2, (c.height - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s);
    BG[id] = c;
  }
  ctx.save(); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(BG[id], 0, 0, W, H); ctx.restore();
}
function photo(id, k) {                                                     // 圆角、细白边、投影；里面几乎不缩放
  const im = IMG[id], r = card(id), z = 1 + ZOOM * k;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, RADIUS); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, RADIUS); ctx.clip();
  ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.scale(z, z); ctx.drawImage(im, -r.w / 2, -r.h / 2, r.w, r.h); ctx.restore();
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2, RADIUS - 1); ctx.stroke(); ctx.restore();
  return r;
}
function shotAt(t) { let i = 0; for (let k = 0; k < CUTS.length; k++) if (t >= CUTS[k][0]) i = k; return i; }

// ======================================================================== 字幕：一截一截出来，每个字出来时轻轻弹一下
const SUB = { size: 62, stroke: 11 };
function subtitle(t, r) {
  const y = r.y + r.h * .76;
  SUBS.forEach(([a, b, s], i) => {
    const next = SUBS[i + 1] ? SUBS[i + 1][0] : TOTAL - .6;
    if (t < a || t >= next) return;
    const str = s.replace(/[，：；。！？]$/, ''), chars = [...str], n = chars.length;
    font(SUB.size, 900, SANS); ctx.letterSpacing = '1px';
    const ws = chars.map(c => ctx.measureText(c).width + 1), total = ws.reduce((x, y) => x + y, 0) - 1;
    let x = 540 - total / 2;
    const span = Math.max(.25, (b - a) * .9), fade = 1 - sstep(next - .12, next, t) * (i + 1 === SUBS.length ? 1 : 0);
    chars.forEach((c, k) => {
      const at = a + span * k / n, p = clamp((t - at) / .09);
      if (p > 0) {
        const sc = 1 + .28 * (1 - E.out(p));
        ctx.save(); ctx.translate(x + ws[k] / 2, y); ctx.scale(sc, sc); ctx.globalAlpha = p * fade;
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

// ======================================================================== 图上面：一对橙青的猫眼 + 黑猫不说话
function brand(r) {
  const x = Math.max(r.x, 40) + 8, y = Math.min(r.y, BOX.cy - BOX.h / 2) - 44;
  ctx.save(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(x + 10, y, 10, 0, TAU); ctx.fill();
  ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(x + 38, y, 10, 0, TAU); ctx.fill(); ctx.restore();
  text('黑猫不说话', x + 62, y + 1, { font: SANS, size: 34, weight: 500, color: CREAM, ls: 3, glow: 'rgba(0,0,0,.6)', blur: 10 });
}

// ======================================================================== 一帧
function INIT() {}
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = shotAt(t), [t0, id] = CUTS[i], t1 = CUTS[i + 1] ? CUTS[i + 1][0] : TOTAL;
  backdrop(id);
  const r = photo(id, E.ioSine(clamp((t - t0) / (t1 - t0))));
  brand(r);
  subtitle(t, r);
}
function SAMPLES(T) { return 1; }
function BLOOM_K(T) { return .06; }
function OVER(T) {}
function MASTER(T) { return 1; }
function CUES() { return []; }
