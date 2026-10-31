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
const CUTS = [[0.00, '01'], [4.07, '09'], [7.71, '01c'], [10.38, '06'], [15.73, '04'], [17.87, '08'], [20.65, '02'], [23.07, '05'], [26.96, '03'], [30.04, '07']];
// ======================================================================== 时间轴结束

// ======================================================================== 读文案 01《让你笑的，才叫爱》
// 新格式的第一条样片：频道主的文案（改写过）+ 温润男声配音；一句配音一张图（频道主用 GPT 做的成图，在 characters/读文案/图/），
// 字幕是白色特粗字加黑边，跟着配音一截一截冒出来；上面的黑边左上角是一对橙青的猫眼 + “黑猫不说话”。没有片头、没有进度条，片尾和水印保留。
const WHITE = '#ffffff';
document.fonts.load('900 60px "Noto Sans SC"', '让你笑的才叫爱');

// ======================================================================== 图
const FR = { x: 0, y: 240, w: 1080, h: 1440 }, CX = FR.x + FR.w / 2;
const DIR = '../characters/读文案/图/';
const FILES = { '01': '01_他_回头_黑白.png', '02': '02_两个人_火车上大笑.png', '03': '03_两个人_夕阳下牵手跑.png', '04': '04_两个人_自拍吐舌头.png',
  '05': '05_两个人_海边骑车.png', '06': '06_两个人_长椅靠肩.png', '07': '07_两个人_傍晚牵手.png', '08': '08_他_过马路挥手.png', '09': '09_他_沙发看手机.png' };
// 每个镜头怎么取景：图、看哪里（图里的比例位置）、从多大推到多大（1 = 刚好盖满画框）；fy1：竖着慢慢移到哪
const LOOK = {
  '01': { img: '01', fx: .5, fy: .36, z0: 1.0, z1: 1.06 },
  '09': { img: '09', fx: .5, fy: .45, z0: 1.0, z1: 1.07 },
  '01c': { img: '01', fx: .46, fy: .27, z0: 1.9, z1: 2.05 },                   // 01 的脸部特写
  '06': { img: '06', fx: .42, fy: .42, z0: 1.0, z1: 1.08 },
  '04': { img: '04', fx: .5, fy: .36, z0: 1.0, z1: 1.06 },
  '08': { img: '08', fx: .5, fy: .42, z0: 1.0, z1: 1.07 },
  '02': { img: '02', fx: .5, fy: .4, z0: 1.0, z1: 1.06 },
  '05': { img: '05', fx: .5, fy: .26, fy1: .5, z0: 1.0, z1: 1.0 },              // 竖图：从她张开的手慢慢移到他骑车
  '03': { img: '03', fx: .5, fy: .5, z0: 1.0, z1: 1.07 },
  '07': { img: '07', fx: .6, fy: .5, z0: 1.0, z1: 1.06 },                 // 他在右边只露半张脸，往右偏一点
};
const IMG = {};
for (const [k, f] of Object.entries(FILES)) { const im = new Image(); im.src = DIR + f; IMG[k] = im; }
function ASSETS_READY() { return Object.values(IMG).every(im => im.complete && im.naturalWidth > 0) && document.fonts.check('900 60px "Noto Sans SC"', '爱'); }

// 盖满画框画一张图：z 在“刚好盖满”的基础上再放大，(fx, fy) 是画框中心对着图里的哪一点
function cover(im, fx, fy, z) {
  const iw = im.naturalWidth, ih = im.naturalHeight; if (!iw) return;
  const s = Math.max(FR.w / iw, FR.h / ih) * z, sw = FR.w / s, sh = FR.h / s;
  const sx = clamp(fx * iw - sw / 2, 0, iw - sw), sy = clamp(fy * ih - sh / 2, 0, ih - sh);
  ctx.drawImage(im, sx, sy, sw, sh, FR.x, FR.y, FR.w, FR.h);
}
function shotAt(t) { let i = 0; for (let k = 0; k < CUTS.length; k++) if (t >= CUTS[k][0]) i = k; return i; }

// ======================================================================== 字幕：一截一截出来，每个字出来时轻轻弹一下
const SUB = { y: FR.y + FR.h * .74, size: 62, stroke: 11 };
function subtitle(t) {
  SUBS.forEach(([a, b, s], i) => {
    const next = SUBS[i + 1] ? SUBS[i + 1][0] : TOTAL - .6;
    if (t < a || t >= next) return;
    const str = s.replace(/[，：；。！？]$/, ''), chars = [...str], n = chars.length;
    font(SUB.size, 900, SANS); ctx.letterSpacing = '1px';
    const ws = chars.map(c => ctx.measureText(c).width + 1), total = ws.reduce((x, y) => x + y, 0) - 1;
    let x = CX - total / 2;
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

// ======================================================================== 画框上面：一对橙青的猫眼 + 黑猫不说话
function brand() {
  const y = FR.y - 68;
  ctx.save(); ctx.fillStyle = ORANGE; ctx.beginPath(); ctx.arc(72, y, 11, 0, TAU); ctx.fill();
  ctx.fillStyle = TEAL; ctx.beginPath(); ctx.arc(104, y, 11, 0, TAU); ctx.fill(); ctx.restore();
  text('黑猫不说话', 130, y + 1, { font: SANS, size: 36, weight: 500, color: CREAM, ls: 2 });
}

// ======================================================================== 一帧
function INIT() {}
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = shotAt(t), [t0, id] = CUTS[i], t1 = CUTS[i + 1] ? CUTS[i + 1][0] : TOTAL, L = LOOK[id];
  const k = E.ioSine(clamp((t - t0) / (t1 - t0))), z = lerp(L.z0, L.z1, k), fy = L.fy1 != null ? lerp(L.fy, L.fy1, k) : L.fy;
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip(); cover(IMG[L.img], L.fx, fy, z); ctx.restore();
  brand();
  subtitle(t);
}
function SAMPLES(T) { return 1; }
function BLOOM_K(T) { return .08; }
function OVER(T) {}
function MASTER(T) { return 1; }
function CUES() { return []; }
