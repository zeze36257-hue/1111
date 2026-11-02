// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 19.8;
const SECTIONS = [['她说她想', 0, TOTAL]];
const LINES = [];                                                   // 字幕自己画（SUBS）
const DIALOG = [
  [0.70, 1.59, '你怎么了？', '他', 'say'],
  [1.74, 2.40, '我没事。', '她', 'say'],
  [2.65, 3.49, '你自己想。', '她', 'think'],
  [4.19, 9.47, '完了。是昨天没回消息，还是又忘了她说的那家店？', '他', 'think'],
  [9.97, 13.06, '要不……去吃你上次说的那家火锅？', '他', 'say'],
  [13.26, 14.24, '他记得！', '她', 'think'],
  [14.39, 15.08, '……也行吧。', '她', 'say'],
];
// 字幕：[出来, 说完, 这一截, say/think]
const SUBS = [
  [0.70, 1.49, '你怎么了？', 'say'],
  [1.74, 2.30, '我没事。', 'say'],
  [2.65, 3.39, '你自己想。', 'think'],
  [4.19, 4.64, '完了。', 'think'],
  [5.72, 6.85, '是昨天没回消息，', 'think'],
  [7.75, 9.37, '还是又忘了她说的那家店？', 'think'],
  [9.97, 12.96, '要不……去吃你上次说的那家火锅？', 'say'],
  [13.26, 14.14, '他记得！', 'think'],
  [14.39, 14.98, '……也行吧。', 'say'],
];
// 镜头：[开始, 图]
const CUTS = [[0.00, '16'], [4.07, '01'], [9.85, '11'], [15.46, '17']];
// 黑猫最后写的那句：[出来的时间, 第一行, 第二行]
const ENDLINE = [15.93, '“我没事”的意思是：', '你哄哄我，就没事了。'];
// ======================================================================== 时间轴结束

// ======================================================================== 《她说·她想》样片：她说“我没事”
// 新体系的主栏目（refs/新体系/方案.md）：情侣小场景，他和她两个声音。
//   - 嘴上说的：白字；心里想的：淡蓝字，加括号。
//   - 最后一句黑猫写在屏幕上，不配音（黑猫不说话）。
// 样片先拿现有的成图代替；正式做的时候换成他和她的表情包放在场景里。
// 画面跟读文案一样：黑底、图按原比例整张放、左上角猫眼 + “黑猫不说话”；没有片头、进度条、片尾。
const WHITE = '#ffffff', THINK = '#a9dcff';
document.fonts.load('900 60px "Noto Sans SC"', '你怎么了我没事自己想');
document.fonts.load('700 58px "Noto Serif SC"', '我没事的意思是你哄哄就了');

// ======================================================================== 图
const DIR = '../characters/读文案/图/';
const FILES = { '01': '01_他_回头_黑白.png', '02': '02_两个人_火车上大笑.png', '03': '03_两个人_夕阳下牵手跑.png',
  '04': '04_两个人_自拍吐舌头.png', '05': '05_两个人_海边骑车.png', '06': '06_两个人_长椅靠肩.png', '07': '07_两个人_傍晚牵手.png',
  '08': '08_他_过马路挥手.png', '10': '10_两个人_海边点鼻子.png', '11': '11_两个人_咖啡馆摸头.png', '12': '12_他和老人_雪天河边长椅.png',
  '13': '13_两个人_门两边对望.png', '14': '14_两个人_车边靠肩.png', '15': '15_两个人_婚礼.png',
  '16': '16_两个人_草地看向两边.png', '17': '17_两个人_拥抱大笑.png' };   // 09 频道主说不要再用
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
    const next = SUBS[i + 1] ? SUBS[i + 1][0] : ENDLINE[0];   // 最后一截在黑猫那句出来时淡掉
    if (t < a || t >= next) return;
    const think = SUBS[i][3] === 'think';
    let str = s.replace(/[，：；。！？]$/, ''); if (think) str = '（' + str + '）';
    const chars = [...str], n = chars.length;
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
        ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.fillStyle = think ? THINK : WHITE; ctx.fillText(c, 0, 0);
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
  catLine(t);
}

// ======================================================================== 黑猫最后写的一句：不配音；一对橙青的猫眼眨一下，两行字慢慢浮出来
function catLine(t) {
  const [t0, l1, l2] = ENDLINE; if (t < t0) return;
  const k = E.out(clamp((t - t0) / .7)), k2 = E.out(clamp((t - t0 - .45) / .7)), y = SUB.y - 40;
  ctx.save(); ctx.globalAlpha = k * .42; ctx.fillStyle = '#000'; ctx.fillRect(0, y - 150, W, 300); ctx.restore();   // 字后面压一条暗带，图再亮也看得清
  const blink = 1 - .85 * Math.max(0, 1 - Math.abs((t - t0 - 1.6) / .09));                                         // 1.6 秒时眨一下眼
  ctx.save(); ctx.globalAlpha = k;
  [[BOX.cx - 22, ORANGE], [BOX.cx + 22, TEAL]].forEach(([x, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y - 92, 11, 11 * blink, 0, 0, TAU); ctx.fill(); });
  ctx.restore();
  const line = (s, yy, a) => {
    ctx.save(); ctx.globalAlpha = a; font(58, 700, SERIF); ctx.letterSpacing = '2px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineWidth = 9; ctx.strokeText(s, BOX.cx, yy); ctx.fillStyle = WHITE; ctx.fillText(s, BOX.cx, yy); ctx.restore();
  };
  line(l1, y - 18 + (1 - k) * 14, k); line(l2, y + 62 + (1 - k2) * 14, k2);
}
function SAMPLES(T) { return 1; }
function BLOOM_K(T) { return .06; }
function OVER(T) {}
function MASTER(T) { return 1; }
function CUES() { return []; }
