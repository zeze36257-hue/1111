// ======================================================================== No.53 很久没联系的老朋友（Wojak 叙事短剧，慢节奏）
// 深夜刷到老同学阿杰要搬去深圳 → 聊天记录停在两年前的“下次一起吃饭” → 回忆六年前的篮球场：“谁先不联系，谁是小狗！”
// → 现在：往上翻聊天记录，打了字又删掉 → 手机一震，阿杰先发来“在吗？突然想起你了。” → “看来，我才是那只小狗。”
// 这一期起节奏放慢、用镜头讲故事（频道主要求）：空镜开场、中景、慢慢推到脸上的特写、手机插入镜头、黑场转场 + 时间字卡、留白。
// 一场戏一张图，换取景不换照片：卧室（深夜、现在，同一张，和以前的卧室是同一张照片）、篮球场（回忆，MiniMax 生成，画面泛黄）。
// 背景挑昏暗、昏黄的；人物不调色（只有回忆那段整体泛黄）。两个人说话时面对面。没有片头、没有进度条，片尾和水印保留。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 110.4;
const SECTIONS = [['深夜', 0.0, 24.8], ['六年前', 24.8, 49.6], ['现在', 49.6, 110.4]];
const LINES = [];                                                   // 没有旁白
const DIALOG = [
  [7.20, 9.45, '阿杰……要走了啊。', '黑', 'think'],
  [10.15, 12.84, '上一次聊天，已经是两年前了。', '黑', 'think'],
  [14.14, 18.22, '说好的“下次一起吃饭”，后来，谁也没再提。', '黑', 'think'],
  [19.72, 22.06, '我们……是怎么走散的呢？', '黑', 'think'],
  [27.80, 29.49, '毕业以后，你打算去哪？', '杰', 'say'],
  [29.89, 32.71, '不知道。走一步看一步吧。', '黑', 'say'],
  [33.21, 35.38, '不管去哪，我们都要常联系啊！', '杰', 'say'],
  [35.68, 36.67, '那当然。', '黑', 'say'],
  [37.17, 39.94, '说好了，谁先不联系，谁是小狗！', '杰', 'say'],
  [40.34, 41.45, '……幼稚。', '黑', 'say'],
  [41.85, 45.75, '哈哈，等着吧，到时候肯定是你先不理我。', '杰', 'say'],
  [46.05, 47.06, '怎么可能。', '黑', 'say'],
  [52.00, 55.29, '往上翻，以前我们一天能聊一百条。', '黑', 'think'],
  [56.19, 60.95, '后来是一天一条，再后来，是一年一条。', '黑', 'think'],
  [64.05, 67.73, '这么久没联系，突然发消息，会不会很奇怪？', '黑', 'think'],
  [71.03, 73.52, '他可能……早就不记得了吧。', '黑', 'think'],
  [76.82, 78.73, '在吗？突然想起你了。', '杰', 'msg'],
  [80.23, 83.09, '我下周就走了。走之前，一起吃个饭吧？', '杰', 'msg'],
  [83.59, 86.20, '这次，不许再说“下次”了。', '杰', 'msg'],
  [87.30, 89.40, '好。这次一定。', '黑', 'msg'],
  [90.10, 92.19, '那就，老地方见。', '杰', 'msg'],
  [93.69, 97.07, '说好谁先不联系，谁是小狗……', '黑', 'think'],
  [97.37, 99.95, '看来，我才是那只小狗。', '黑', 'think'],
  [100.85, 101.45, '喵～', '猫', 'say'],
];
const CARDS_AT = 102.25;                                          // 最后的字卡从这里开始
// 第 i 句台词开始的时间：D(i)；结束：DE(i)
const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const GOLD = '#ffd2a0';

// ======================================================================== 共用
function warmth(a, x = 540, y = 980, r = 900, rgb = '255,170,90') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${.16 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
const big = { align: 'center', spread: 3, blur: 14, rise: 18 };

// ======================================================================== 照片和人物
const FR = { x: 0, y: 470, w: 1080, h: 960 }, ASP = FR.w / FR.h, FB = FR.y + FR.h;   // FB：画框底边，半身像贴着它
const PHOTO_FILES = ['bedroom', 'court', 'boxes'];                                  // boxes：朋友圈里的配图
const HERO_EXPR = ['calm', 'sad', 'cry', 'happy', 'shock', 'angry', 'meh', 'awkward'];
const CAST_FILES = ['蓝卫衣男'];
const PH = {}, IMG = {};
const load = (src) => { const im = new Image(); im.src = src; return im; };
for (const n of PHOTO_FILES) PH[n] = load(`photos/${n}.jpg`);
for (const e of HERO_EXPR) IMG['hero_' + e] = load(`../characters/hero/expr/${e}.png`);
for (const n of CAST_FILES) IMG[n] = load(`../characters/cast/${n}.png`);
function ASSETS_READY() { return [...Object.values(PH), ...Object.values(IMG)].every(im => im.complete && im.naturalWidth > 0); }

// 主人公的图（1002×2992，原图的 2 倍）：脸的中心在 (640, 319)，帽子耳朵尖在 y ≈ 10；肩上那只猫的头顶在 (270, 180)
const HERO = { fx: 640, fy: 319, top: 10, s: .652, cat: [270, 180] };
// 其他人：w 画多宽；fx 脸在图里的横向位置；top 头顶的纵向位置；face 原图里脸朝哪边（1 = 朝右，站在右边时翻过来）
const CAST = {
  黑: { name: '小黑' },
  杰: { name: '阿杰', img: '蓝卫衣男', w: 470, fx: .62, top: .01, face: 1 },
  猫: { name: '猫' },
};
// 主人公每一句台词时的表情（第 i 句开始时换）；EXTRA：台词之间另外换的表情 [时间, 表情]
const HX = ['calm', 'sad', 'sad', 'sad',                                                   // 深夜
            'calm', 'calm', 'happy', 'happy', 'happy', 'happy', 'happy', 'happy',           // 六年前
            'calm', 'sad', 'awkward', 'sad',                                                // 现在：往上翻、打了又删
            'shock', 'happy', 'happy', 'happy', 'happy', 'calm', 'awkward', 'happy'];        // 他先发来了
const EXTRA = () => [[DE(16) + .9, 'happy']];                                             // “在吗？”之后：愣住 → 笑出来
function heroExpr(t) {                                                              // [现在的表情, 上一个表情, 切换进度]
  const keys = DIALOG.map((d, i) => [D(i) - .05, HX[i]]).concat(EXTRA()).sort((a, b) => a[0] - b[0]);
  let i = -1; for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) i = k;
  if (i < 0) return ['calm', 'calm', 1];
  return [keys[i][1], i ? keys[i - 1][1] : 'calm', sstep(keys[i][0], keys[i][0] + .2, t)];
}
const speaking = (who, t) => DIALOG.some(([a, b, , w, k]) => k !== 'msg' && (w === who || (who === '黑' && w === '猫')) && t >= a && t <= b);
const anyoneSpeaking = t => DIALOG.some(([a, b, , , k]) => k !== 'msg' && t >= a && t <= b);
// 画一个人（还没乘镜头的坐标）。返回头顶、脸（主人公还有肩上猫的头顶）
function person(m, t) {
  const c = CAST[m.who], a = m.a ?? 1; if (a <= 0) return null;
  const talk = speaking(m.who, t), bob = talk ? -6 * Math.abs(Math.sin(t * 7)) : 1.5 * Math.sin(t * 1.4 + m.cx * .01);
  const dimmed = !talk && anyoneSpeaking(t);
  ctx.save(); ctx.globalAlpha *= a; if (dimmed) ctx.filter = 'brightness(.88)';
  let r;
  if (m.who === '黑') {
    const s = HERO.s, top = (m.top ?? 770) + bob, x = m.cx - HERO.fx * s, y = top - HERO.top * s;
    const [e, prev, k] = heroExpr(t);
    if (k < 1) ctx.drawImage(IMG['hero_' + prev], x, y, 1002 * s, 2992 * s);
    ctx.globalAlpha *= k < 1 ? k : 1; ctx.drawImage(IMG['hero_' + e], x, y, 1002 * s, 2992 * s);
    r = { top: [m.cx, top], face: [m.cx, y + HERO.fy * s], cat: [x + HERO.cat[0] * s, y + HERO.cat[1] * s] };
  } else {
    const im = IMG[c.img], w = c.w, h = w * im.naturalHeight / im.naturalWidth;
    const flip = (m.cx > W / 2) === (c.face > 0), fx = flip ? 1 - c.fx : c.fx;              // 朝向画面中间
    const x = m.cx - fx * w, y = FB - h + 6 + bob;
    if (flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); } else ctx.drawImage(im, x, y, w, h);
    r = { top: [m.cx, y + c.top * h], face: [m.cx, y + (c.top + .24) * h] };
  }
  ctx.restore();
  return { who: m.who, ...r };
}

// ---------------------------------------------------------------- 镜头（机位）：同一张照片上换取景。[时间, 焦点 x, 焦点 y, 放大倍数]；两帧时间挨着 = 切
let CAM_KEYS = [];
function camAt(t) {
  const K = CAM_KEYS; if (t <= K[0][0]) return { fx: K[0][1], fy: K[0][2], z: K[0][3] };
  for (let i = 0; i < K.length - 1; i++) { const [a, ...va] = K[i], [b, ...vb] = K[i + 1];
    if (t < b) { const k = b - a < .02 ? 0 : E.io((t - a) / (b - a)); return { fx: lerp(va[0], vb[0], k), fy: lerp(va[1], vb[1], k), z: lerp(va[2], vb[2], k) }; } }
  const L = K[K.length - 1]; return { fx: L[1], fy: L[2], z: L[3] };
}
const camMap = (cam, [x, y]) => [cam.fx + (x - cam.fx) * cam.z, cam.fy + (y - cam.fy) * cam.z];

// ---------------------------------------------------------------- 场景：一场戏一张照片；换场用黑场
let SHOTS = [];
function cropAt(sh) {
  const im = PH[sh.img], W0 = im.naturalWidth || 2000, H0 = im.naturalHeight || 2000;
  let [x, y, w] = sh.crop; w = Math.min(w, W0, H0 * ASP); const h = w / ASP;
  return { x: clamp(x, 0, W0 - w), y: clamp(y, 0, H0 - h), w, h, k: FR.w / w };
}
const PHONE_LIT = t => (t > 3.0 && t < S['六年前']) || (t > S['现在'] && t < SCREEN_OFF()) || t > BUZZ();   // 手机亮着（脸上有屏幕的光）
function castIn(sh, t) {
  if (sh.name === 'court') { const a = sstep(S['六年前'] + 2.0, S['六年前'] + 2.6, t);
    return [{ who: '杰', cx: 830, a }, { who: '黑', cx: 320, a }]; }
  return [{ who: '黑', cx: 400, a: sh.name === 'night' ? sstep(3.0, 3.8, t) : 1 }];
}
function drawShot(sh, t) {
  const c = cropAt(sh), im = PH[sh.img], cam = camAt(t);
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  ctx.translate(cam.fx, cam.fy); ctx.scale(cam.z, cam.z); ctx.translate(-cam.fx, -cam.fy);
  ctx.save(); ctx.translate(FR.x - c.x * c.k, FR.y - c.y * c.k); ctx.scale(c.k, c.k); if (im.naturalWidth) ctx.drawImage(im, 0, 0); ctx.restore();
  const g = ctx.createLinearGradient(0, FR.y + FR.h * .45, 0, FB); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
  ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h);
  const out = [];
  for (const m of castIn(sh, t)) { if ((m.a ?? 1) <= 0) continue; const r = person(m, t); if (r) out.push(r); }
  const me = out.find(m => m.who === '黑');
  if (me && sh.name !== 'court' && PHONE_LIT(t)) {                                // 手机屏幕照在脸上：一点冷白的光
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const [x, y] = me.face, gl = ctx.createRadialGradient(x + 30, y + 150, 10, x + 30, y + 150, 300);
    gl.addColorStop(0, 'rgba(170,190,230,.20)'); gl.addColorStop(1, 'rgba(170,190,230,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 330, y - 200, 700, 700); ctx.restore();
  }
  ctx.restore();
  if (sh.name === 'court') memoryLook(t);                                         // 回忆：整体泛黄、颗粒、轻轻闪
  return { cam, cast: out.map(m => ({ ...m, top: camMap(cam, m.top), face: camMap(cam, m.face), cat: m.cat && camMap(cam, m.cat) })) };
}
function memoryLook(t) {
  warmGrade(FR.x, FR.y, FR.w, FR.h, 1, { sepia: .55, sat: .72, bright: .92, contrast: 1.04, tint: 'rgb(255,226,182)', vig: .6 });
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  ctx.fillStyle = `rgba(0,0,0,${.04 + .03 * Math.sin(t * 23) * Math.sin(t * 7.1)})`; ctx.fillRect(FR.x, FR.y, FR.w, FR.h);   // 老片子的轻微闪烁
  const r = mulberry(Math.floor(t * 12)); ctx.fillStyle = 'rgba(255,240,215,.55)';                                          // 灰尘和划痕
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(r() * W, FR.y + r() * FR.h, .8 + r() * 1.8, 0, TAU); ctx.fill(); }
  if (r() < .35) { const x = r() * W; ctx.fillStyle = 'rgba(255,240,215,.12)'; ctx.fillRect(x, FR.y, 1.5, FR.h); }
  ctx.restore();
}

// ---------------------------------------------------------------- 对话框：统一在画框上部，尾巴指向说话的人
function wrapText(s, size, maxW, weight = 900) {
  font(size, weight, SANS); const out = []; let cur = '';
  for (const ch of s) { if (ctx.measureText(cur + ch).width > maxW && cur && !'，。？！、…」：；～”'.includes(ch)) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
function bubble(str, kind, ax, ay, a, size = 34, noTail = false) {
  if (a <= 0) return;
  const lh = size * 1.35, lines = wrapText(str, size, 640);
  font(size, 900, SANS); const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
  const w = tw + size * 3.2, h = lines.length * lh + size * 1.7;
  const bx = clamp(ax, w / 2 + 24, W - w / 2 - 24), by = FR.y + 30 + h / 2;
  const sc = .86 + .14 * E.outQuint(clamp(a * 1.6));
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(bx, by); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 6;
  ctx.fillStyle = kind === 'think' ? 'rgba(214,224,238,.96)' : '#f3efe8';
  ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)';
  const dx = ax - bx, dy = Math.max(ay - by, h / 2 + 40), L0 = Math.hypot(dx, dy) || 1, ux = dx / L0, uy = dy / L0;
  if (noTail) {                                                                  // 手机插入镜头挡在前面时，不画尾巴
  } else if (kind === 'think') {
    for (const [k, r] of [[1.08, 12], [1.3, 8.5], [1.5, 6]]) { const d = (h / 2) / Math.max(.35, uy) * k;
      ctx.beginPath(); ctx.arc(ux * d, uy * d, r, 0, TAU); ctx.fill(); }
  } else {
    const ex = ux * (w / 2) * .5, ey = uy * (h / 2) * .85, tip = Math.min(L0 - h / 2, 80);
    ctx.beginPath(); ctx.moveTo(ex - uy * 18, ey + ux * 18); ctx.lineTo(ex + ux * tip, ey + uy * tip); ctx.lineTo(ex + uy * 18, ey - ux * 18); ctx.closePath(); ctx.fill();
  }
  lines.forEach((l, i) => text(l, 0, (i - (lines.length - 1) / 2) * lh + 2, { font: SANS, size, weight: 900, align: 'center', color: '#1d1e24' }));
  ctx.restore();
}

// ---------------------------------------------------------------- 手机（插入镜头）：朋友圈 / 聊天记录 / 打字又删 / 锁屏通知 / 新消息
const PHN = { x: 540, y: 960, w: 500, h: 800 };
const SCREEN_OFF = () => DE(15) + 1.6, BUZZ = () => D(16) - .55;
const TYPE1 = () => [DE(13) + .3, '最近还好吗'], TYPE2 = () => [DE(14) + .3, '恭喜啊，要去深圳了'];
// 插入镜头的时间段：[开始, 结束, 内容]
const INSERTS = () => [[4.4, DE(1) + 1.0, 'night'], [D(12) - .9, SCREEN_OFF(), 'scroll'], [BUZZ(), DE(16) + .1, 'lock'], [D(17) - .4, DE(20) + .5, 'chat']];
function insertAt(t) { for (const [a, b, m] of INSERTS()) if (t > a - .01 && t < b + .4) return { a, b, m, k: sstep(a, a + .4, t) * (1 - sstep(b, b + .35, t)) }; return null; }
function headCrop(key) {                                                         // 头像：从角色图上裁一块头
  const im = IMG[key]; if (key.startsWith('hero_')) return [im, 400, 0, 480, 480];
  return [im, im.naturalWidth * .3, 0, im.naturalWidth * .55, im.naturalWidth * .55];
}
function avatar(key, x, y, s) { const [im, sx, sy, sw, sh] = headCrop(key); ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, s, s, 8); ctx.clip(); ctx.fillStyle = '#3a3c42'; ctx.fillRect(x, y, s, s);
  if (im.naturalWidth) ctx.drawImage(im, sx, sy, sw, sh, x, y, s, s); ctx.restore(); }
function phoneFrame(k, shake = 0) {
  const { x, y, w, h } = PHN, px = x - w / 2 + shake, py = y - h / 2 + 30 * (1 - k);
  ctx.save(); ctx.globalAlpha = k; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40; ctx.fillStyle = '#0c0c0e';
  ctx.beginPath(); ctx.roundRect(px, py, w, h, 46); ctx.fill(); ctx.restore();
  return { sx: px + 14, sy: py + 14, sw: w - 28, sh: h - 28 };
}
// 一条聊天：side 0 左（阿杰）/ 1 右（自己）/ 'date'；返回占的高度
function chatItem(it, sx, sw, y, a) {
  if (it[0] === 'date') { text(it[1], sx + sw / 2, y + 16, { font: SANS, size: 19, weight: 500, align: 'center', color: '#7d8088', alpha: a }); return 44; }
  const [side, s] = it, lines = wrapText(s, 24, 250, 500), bw = Math.max(...lines.map(l => { font(24, 500, SANS); return ctx.measureText(l).width; })) + 32, bh = lines.length * 34 + 22;
  const ax = side ? sx + sw - 62 : sx + 14, bx = side ? ax - 12 - bw : ax + 60;
  ctx.save(); ctx.globalAlpha *= a; avatar(side ? 'hero_calm' : '蓝卫衣男', ax, y, 48);
  ctx.fillStyle = side ? '#3d9a62' : '#2c2d31'; ctx.beginPath(); ctx.roundRect(bx, y, bw, bh, 10); ctx.fill(); ctx.restore();
  lines.forEach((l, i) => text(l, bx + 16, y + 28 + i * 34, { font: SANS, size: 24, weight: 500, color: side ? '#f2f5f2' : '#e6e6e8', alpha: a }));
  return bh + 22;
}
// 聊天记录（从老到新）
const OLD = [['date', '2020年4月12日 22:41'], [0, '明天打球？'], [1, '走！'], [0, '老规矩，输了的请奶茶'], [1, '你就没赢过'], [0, '哈哈哈哈哈'],
             [0, '你看那个视频没'], [1, '笑死我了'], [0, '作业写完没'], [1, '抄我的'], [0, '兄弟！'],
             ['date', '2021年9月3日 23:10'], [0, '到新学校了吗'], [1, '到了，宿舍好小'], [0, '哈哈，有空视频'],
             ['date', '2022年3月8日 20:15'], [1, '生日快乐！'], [0, '谢啦兄弟'],
             ['date', '2023年1月22日 00:01'], [0, '新年快乐！'], [1, '新年快乐！'],
             ['date', '2024年6月18日 21:03'], [0, '下次一起吃饭啊！'], [1, '好啊，一定。']];
const NEW = () => [['date', '今天 23:47', D(16) - .3], [0, '在吗？突然想起你了。', D(16)], [0, '我下周就走了。走之前，一起吃个饭吧？', D(17)],
                   [0, '这次，不许再说“下次”了。', D(18)], [1, '好。这次一定。', D(19) + .3], [0, '那就，老地方见。', D(20)]];
function chatScreen(t, sx, sy, sw, sh, k, items, scroll, typed, cursor) {
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 34); ctx.clip();
  ctx.fillStyle = '#151517'; ctx.fillRect(sx, sy, sw, sh);
  // 从下往上排：最新的在最下面；scroll > 0 往上翻
  const inputH = 84, bottom = sy + sh - inputH - 16; let hs = items.map(it => { ctx.save(); const hh = chatItem(it, sx, sw, -9999, 0); ctx.restore(); return hh; });
  let y = bottom + scroll; for (let i = items.length - 1; i >= 0; i--) { y -= hs[i]; if (y < sy + 40 || y > bottom) { if (y > bottom) continue; } chatItem(items[i], sx, sw, y, 1); }
  ctx.fillStyle = '#1d1d20'; ctx.fillRect(sx, sy, sw, 76); text('阿杰', sx + sw / 2, sy + 50, { font: SANS, size: 26, weight: 700, align: 'center', color: '#ececec' });
  text('‹', sx + 30, sy + 52, { font: SANS, size: 40, weight: 500, color: '#ececec' });
  ctx.fillStyle = '#1d1d20'; ctx.fillRect(sx, sy + sh - inputH, sw, inputH);
  ctx.fillStyle = '#2b2b2f'; ctx.beginPath(); ctx.roundRect(sx + 18, sy + sh - inputH + 14, sw - 36, inputH - 30, 10); ctx.fill();
  if (typed) text(typed, sx + 34, sy + sh - inputH / 2 + 4, { font: SANS, size: 24, weight: 500, color: '#ececec' });
  if (cursor) { font(24, 500, SANS); const cw = typed ? ctx.measureText(typed).width : 0; ctx.fillStyle = '#56c27a'; ctx.fillRect(sx + 36 + cw, sy + sh - inputH / 2 - 14, 3, 30); }
  ctx.restore();
}
function postScreen(sx, sy, sw, sh, k) {                                         // 朋友圈：阿杰要搬走了
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 34); ctx.clip();
  ctx.fillStyle = '#151517'; ctx.fillRect(sx, sy, sw, sh); ctx.fillStyle = '#1d1d20'; ctx.fillRect(sx, sy, sw, 76); ctx.restore();
  text('朋友圈', sx + sw / 2, sy + 50, { font: SANS, size: 26, weight: 700, align: 'center', color: '#ececec', alpha: k });
  ctx.save(); ctx.globalAlpha = k; avatar('蓝卫衣男', sx + 22, sy + 104, 64); ctx.restore();
  text('阿杰', sx + 102, sy + 126, { font: SANS, size: 27, weight: 700, color: '#8ea4cc', alpha: k });
  text('下周就搬去深圳啦。', sx + 102, sy + 170, { font: SANS, size: 25, weight: 500, color: '#e6e6e8', alpha: k });
  text('这座城市，再见了。', sx + 102, sy + 206, { font: SANS, size: 25, weight: 500, color: '#e6e6e8', alpha: k });
  const im = PH.boxes; ctx.save(); ctx.globalAlpha = k; if (im.naturalWidth) ctx.drawImage(im, 0, 0, im.naturalWidth, im.naturalHeight, sx + 102, sy + 236, 300, 300); ctx.restore();
  text('1小时前', sx + 102, sy + 572, { font: SANS, size: 19, weight: 500, color: '#7d8088', alpha: k });
}
function lockScreen(t, sx, sy, sw, sh, k) {                                     // 锁屏 + 通知
  const lit = sstep(BUZZ(), BUZZ() + .15, t);
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 34); ctx.clip();
  const g = ctx.createLinearGradient(0, sy, 0, sy + sh); g.addColorStop(0, '#1b2030'); g.addColorStop(1, '#0b0c12'); ctx.fillStyle = g; ctx.fillRect(sx, sy, sw, sh);
  ctx.fillStyle = `rgba(0,0,0,${1 - lit})`; ctx.fillRect(sx, sy, sw, sh); ctx.restore();
  text('23:47', sx + sw / 2, sy + 170, { font: SANS, size: 92, weight: 500, align: 'center', color: '#e8eaf0', alpha: k * lit });
  text('10月26日 星期一', sx + sw / 2, sy + 222, { font: SANS, size: 22, weight: 500, align: 'center', color: '#b8bcc8', alpha: k * lit });
  const nk = k * sstep(BUZZ() + .1, BUZZ() + .45, t), ny = sy + 280 - 20 * (1 - nk);
  ctx.save(); ctx.globalAlpha = nk; ctx.fillStyle = 'rgba(60,62,70,.92)'; ctx.beginPath(); ctx.roundRect(sx + 18, ny, sw - 36, 108, 22); ctx.fill(); avatar('蓝卫衣男', sx + 36, ny + 22, 64); ctx.restore();
  text('阿杰', sx + 116, ny + 44, { font: SANS, size: 24, weight: 700, color: '#f0f0f0', alpha: nk });
  text('在吗？突然想起你了。', sx + 116, ny + 82, { font: SANS, size: 23, weight: 500, color: '#e0e0e4', alpha: nk });
}
function phone(t) {
  const ins = insertAt(t); if (!ins || ins.k <= 0) return;
  const { m, k } = ins;
  ctx.save(); ctx.globalAlpha = .6 * k; ctx.fillStyle = '#000'; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore();       // 插入镜头：后面压暗
  const shake = m === 'lock' ? Math.sin(t * 90) * 5 * (win(t, BUZZ(), BUZZ() + .3, .02, .05) + win(t, BUZZ() + .45, BUZZ() + .75, .02, .05)) : 0;
  const { sx, sy, sw, sh } = phoneFrame(k, shake);
  if (m === 'night') {                                                           // 朋友圈 → 点进聊天，停在两年前
    const toChat = sstep(DE(0) + .2, DE(0) + .5, t);
    if (toChat < 1) postScreen(sx, sy, sw, sh, k * (1 - toChat));
    if (toChat > 0) chatScreen(t, sx, sy, sw, sh, k * toChat, OLD, 0, '', Math.floor(t * 2) % 2 === 0);
  } else if (m === 'scroll') {                                                   // 往上翻（以前一天一百条）→ 慢慢翻回来（一年一条）→ 打字、删掉
    const up = E.io(prog(t, D(12) - .4, D(12) + 2.4)) * 760 * (1 - E.io(prog(t, D(13) + .2, DE(13))));
    const type = (start, s) => { const n = Math.floor(clamp((t - start) / .16, 0, s.length)), hold = start + s.length * .16 + .3, del = Math.floor(clamp((t - hold) / .07, 0, s.length)); return t < start ? null : s.slice(0, Math.max(0, n - del)); };
    let typed = ''; for (const [st, s] of [TYPE1(), TYPE2()]) { const r = type(st, s); if (r !== null) typed = r; }
    const fade = 1 - sstep(SCREEN_OFF() - .6, SCREEN_OFF(), t);                                                  // 最后屏幕暗下去
    chatScreen(t, sx, sy, sw, sh, k * Math.max(.25, fade), OLD, up, typed, Math.floor(t * 2.2) % 2 === 0);
  } else if (m === 'lock') lockScreen(t, sx, sy, sw, sh, k);
  else if (m === 'chat') {                                                       // 他先发来了：消息一条条冒出来
    const items = OLD.concat(NEW().filter(it => t >= it[2]).map(it => it.slice(0, 2)));
    const typing = t > D(19) - .9 && t < D(19) + .3 ? '好。这次一定。'.slice(0, Math.floor(clamp((t - D(19) + .9) / .12, 0, 7))) : '';
    chatScreen(t, sx, sy, sw, sh, k, items, 0, typing, typing.length > 0);
  }
}

// ---------------------------------------------------------------- 黑场转场 + 时间字卡
function blackCards(t) {
  const cards = [[S['六年前'], '六年前'], [S['现在'], '现在']];
  for (const [s, label] of cards) {
    const b = sstep(s - 1.0, s - .15, t) * (1 - sstep(s + .7, s + 1.4, t)); if (b <= 0) continue;
    ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = '#000'; ctx.fillRect(FR.x - 2, FR.y - 2, FR.w + 4, FR.h + 4); ctx.restore();
    const ka = sstep(s - .3, s + .1, t) * (1 - sstep(s + .55, s + 1.0, t));
    text(label, 540, FR.y + FR.h / 2 + 10, { font: SERIF, size: 64, weight: 700, align: 'center', color: CREAM, alpha: ka, ls: 12 });
  }
  const k0 = win(t, .4, 4.2, .5, .6);                                              // 开头：时间
  text('晚上十一点半', 70, FR.y + 70, { font: SERIF, size: 34, weight: 500, color: CREAM, alpha: k0 * .9, ls: 4, glow: 'rgba(0,0,0,.9)', blur: 10 });
}

// ======================================================================== 世界层
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sh = SHOTS.filter(s => t >= s.t0).pop() || SHOTS[0];                       // 换场在黑场里，直接切
  const info = drawShot(sh, t);
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.10)'; ctx.lineWidth = 2; ctx.strokeRect(FR.x - 1, FR.y - 1, FR.w + 2, FR.h + 2); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip(); phone(t); ctx.restore();
  const me = info.cast.find(m => m.who === '黑');
  // 对话框（消息不出对话框，在手机里）
  DIALOG.forEach(([a, b, s, who, kind], i) => {
    if (kind === 'msg') return;
    const next = DIALOG[i + 1] ? DIALOG[i + 1][0] : TOTAL, fe = Math.max(b + .3, Math.min(b + .9, next - .05));
    if (t < a - .1 || t > fe + .05) return;
    const k = sstep(a - .1, a + .2, t) * (1 - sstep(fe - .3, fe, t));
    if (who === '猫') { if (me) bubble(s, kind, me.cat[0], me.cat[1], k, 40); return; }
    const m = info.cast.find(c => c.who === who), ins = insertAt(t);
    if (m) bubble(s, kind, m.top[0], m.top[1], k, 34, !!ins && ins.k > .3);
  });
  blackCards(t);
  // 画框上面的黑边：第一段是封面钩子；之后换成标题
  const L = S['六年前'], hook = 1 - sstep(L - 1.0, L - .2, t), ttl = sstep(L + .6, L + 1.4, t);
  text('两年没联系的老朋友，', 540, 270, { size: 62, weight: 900, align: 'center', color: CREAM, alpha: hook });
  text('突然给我发来一句……', 540, 372, { size: 66, weight: 900, align: 'center', color: GOLD, alpha: hook });
  text('很久没联系的老朋友', 540, 300, { font: SERIF, size: 58, weight: 900, align: 'center', color: GOLD, alpha: ttl });
  text('你也有这样一个人吗', 540, 376, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: ttl * .85 });
  // 最后的字卡（画框下面）
  const c1 = win(t, CARDS_AT, CARDS_AT + 4.2, .5, .5), c2 = sstep(CARDS_AT + 4.0, CARDS_AT + 4.6, t);
  typeText('你是不是也有一个，', 540, 1530, { ...big, size: 54, weight: 900, color: CREAM }, prog(t, CARDS_AT, CARDS_AT + 1.0), c1);
  typeText('很久没联系、却一直记得的人？', 540, 1625, { ...big, size: 56, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, CARDS_AT + 1.1, CARDS_AT + 2.4), c1);
  typeText('评论区说说：', 540, 1530, { size: 44, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, CARDS_AT + 4.1, CARDS_AT + 4.6), c2);
  typeText('你最想给谁发一句“在吗”？', 540, 1620, { size: 54, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, CARDS_AT + 4.5, CARDS_AT + 5.6), c2);
}
function SAMPLES(T) { return 2; }
function BLOOM_K(T) { return .18; }
function OVER(T) {}
function MASTER(T) { return 1; }
function INIT() {
  const s1 = S['六年前'], s2 = S['现在'], HF = [400, 945], JF = [830, 950], MF = [320, 945];   // 主人公、阿杰（回忆里主人公在 320）脸的位置
  SHOTS = [
    { name: 'night', img: 'bedroom', t0: 0, crop: [200, 760, 1100] },
    { name: 'court', img: 'court', t0: s1, crop: [0, 0, 1440] },
    { name: 'now', img: 'bedroom', t0: s2, crop: [200, 760, 1100] },
  ];
  CAM_KEYS = [
    // 深夜：空镜（远景）→ 他出现 → 朋友圈和聊天记录（插入镜头）→ 镜头慢慢推到脸上，留白
    [0, 540, 950, 1.0], [DE(1) + 1.2, 540, 950, 1.0], [DE(3) + 1.6, HF[0], HF[1], 1.75],
    // 六年前：两个人（中景）；“谁先不联系谁是小狗”切到阿杰；“幼稚”切回来；“怎么可能”切到主人公
    [s1 - .01, HF[0], HF[1], 1.75], [s1, 540, 950, 1.0], [D(8) - .06, 540, 950, 1.0], [D(8) - .05, JF[0], JF[1], 1.45],
    [D(9) - .06, JF[0], JF[1], 1.5], [D(9) - .05, 540, 950, 1.0], [D(11) - .06, 540, 950, 1.0], [D(11) - .05, MF[0], MF[1], 1.4], [s2 - .2, MF[0], MF[1], 1.5],
    // 现在：中景，看手机；屏幕暗下去以后切近，慢慢推；“在吗？”之后看他的脸（特写）；最后拉远
    [s2 - .01, MF[0], MF[1], 1.5], [s2, 470, 950, 1.12], [SCREEN_OFF() - .01, 470, 950, 1.12], [SCREEN_OFF(), HF[0], HF[1], 1.4], [BUZZ(), HF[0], HF[1], 1.55],
    [DE(16) + .05, HF[0], HF[1], 1.55], [DE(16) + .06, HF[0], HF[1], 1.8], [D(17) - .5, HF[0], HF[1], 1.85],
    [D(17) - .49, 470, 950, 1.12], [DE(20) + .6, 470, 950, 1.12], [DE(20) + .61, HF[0], HF[1], 1.3], [D(23) - .2, HF[0], HF[1], 1.5],
    [CARDS_AT - .5, HF[0], HF[1], 1.5], [CARDS_AT + 3.5, 540, 950, 1.0], [TOTAL + 1, 540, 950, 1.0],
  ];
}

// ======================================================================== 音效提示表
function CUES() {
  const c = [], s1 = S['六年前'], s2 = S['现在'];
  // 深夜 / 现在：屋里很静，墙上的钟滴答滴答
  c.push([0, 'room', { dur: s1 + .2, gain: 1.0, fi: .3, fo: .8 }], [s2 - .2, 'room', { dur: TOTAL - s2 + .2, gain: 1.0, fi: .8, fo: 1.5 }]);
  for (let t = .6; t < TOTAL - 1; t += 1.0) if (t < s1 - .8 || t > s2 + .8) c.push([t, 'tick', { gain: .018 }]);
  c.push([DE(0) + .25, 'tick', { gain: .04 }]);                                                          // 点进聊天
  // 六年前：傍晚的球场，远处有人拍球，几声鸟叫
  c.push([s1 + .3, 'birds', { dur: s2 - s1 - .8, gain: .05 }], [s1 + .3, 'chatter', { dur: s2 - s1 - .8, gain: .25, fi: 1.0, fo: 1.0 }]);
  for (let t = s1 + .8; t < s2 - 1.2; t += .62 + (Math.round(t * 10) % 3) * .05) c.push([t, 'bounce', { gain: .45, pan: .4 }]);
  // 现在：打字、删掉；屏幕暗了；手机一震；消息一条条进来；发送
  const tap = (t0, n, dt, g) => { for (let i = 0; i < n; i++) c.push([t0 + i * dt, 'pop', { f: 1500 + (i % 3) * 120, gain: g }]); };
  for (const [st, s] of [TYPE1(), TYPE2()]) { tap(st, s.length, .16, .12); tap(st + s.length * .16 + .3, s.length, .07, .08); }
  c.push([BUZZ(), 'buzz', { gain: 1.0 }]);
  for (const i of [17, 18, 20]) c.push([D(i), 'pop', { f: 900, gain: .25 }]);
  tap(D(19) - .9, 7, .12, .12); c.push([D(19) + .3, 'swish', { dur: .35, gain: .04 }]);
  c.push([CARDS_AT, 'shimmer', { f: [587.3, 740, 880, 1174.7], gain: .06 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
