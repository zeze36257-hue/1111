// ======================================================================== No.52 电梯里遇到领导（Wojak 叙事短剧）
// 一件日常小事，不讲道理：八点五十九赶打卡 → 电梯门一开，领导在里面 → 尬聊（“吃了吗？”“您也是！”）→ 领导讲当年 →
// 老哥在八楼看见领导，说“我等下一趟” → 随口说项目“挺好的”，被安排下午开会讲 → 领导下电梯，电量掉了三成。
// 角色（频道主给的形象，在 ../characters/）：小黑 = 主人公（表情随台词换）；领导 = 领导-上司（有点油腻、爱吹牛）；老哥 = 同事-老哥。
// 两场戏，一场一张图（MiniMax 生成）：电梯厅（lobby）、电梯里（elevator）。电梯楼层显示放在画框下面的黑边里。
// 两个人说话时面对面：主人公在左边、朝右；别人在右边，原图朝右的左右翻过来。
// 没有片头、没有进度条，片尾和水印保留。配乐：只有电梯里那段“电梯音乐”（很轻、像从天花板喇叭里放出来的），电梯厅只有环境声。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 90.4;
const SECTIONS = [['电梯厅', 0.0, 18.4], ['电梯里', 18.4, 90.4]];
const LINES = [];                                                   // 没有旁白
const DIALOG = [
  [0.30, 3.11, '八点五十九，还有一分钟打卡。', '黑', 'think'],
  [3.31, 5.17, '电梯怎么还在十八楼……', '黑', 'think'],
  [5.67, 6.86, '快来快来快来……', '黑', 'think'],
  [7.76, 8.21, '早啊。', '板', 'say'],
  [8.51, 10.11, '完了，是领导。', '黑', 'think'],
  [10.31, 13.20, '现在转身去走楼梯，还来得及吗？', '黑', 'think'],
  [13.40, 14.86, '愣着干嘛？进来啊。', '板', 'say'],
  [15.16, 17.41, '好、好的！领导早！', '黑', 'say'],
  [21.00, 25.07, '说点什么吧……不说话，会不会显得很没礼貌？', '黑', 'think'],
  [25.37, 25.81, '吃了吗？', '板', 'say'],
  [26.01, 26.93, '您也是！', '黑', 'say'],
  [27.23, 28.95, '……啊？哦，吃了吃了。', '板', 'say'],
  [29.25, 30.27, '……我在说什么。', '黑', 'think'],
  [32.37, 33.61, '谁按的三楼……', '黑', 'think'],
  [34.11, 38.77, '年轻人啊，我像你这么大的时候，一个人干三个人的活。', '板', 'say'],
  [39.07, 41.74, '那时候哪有什么加班费，全凭热爱。', '板', 'say'],
  [42.04, 44.18, '是是是，领导真厉害！', '黑', 'say'],
  [44.48, 47.01, '这个故事，我已经听了三遍了。', '黑', 'think'],
  [48.51, 51.41, '早啊……哦，领导也在啊。', '哥', 'say'],
  [51.61, 53.60, '那个……我等下一趟！', '哥', 'say'],
  [54.30, 55.11, '叛徒。', '黑', 'think'],
  [55.81, 56.70, '最近项目怎么样？', '板', 'say'],
  [56.90, 57.97, '挺好的挺好的！', '黑', 'say'],
  [58.17, 59.31, '一点都不好。', '黑', 'think'],
  [59.61, 61.77, '那正好，下午开会你来讲讲。', '板', 'say'],
  [61.97, 63.29, '啊？……好、好的！', '黑', 'say'],
  [63.59, 64.96, '我为什么要说“挺好的”……', '黑', 'think'],
  [66.26, 68.83, '我到了。好好干啊，年轻人。', '板', 'say'],
  [69.03, 70.67, '好嘞！领导慢走！', '黑', 'say'],
  [72.17, 74.20, '终于……走了。', '黑', 'think'],
  [74.60, 77.47, '三十秒的电梯，电量掉了三成。', '黑', 'think'],
  [78.57, 80.32, '还有八个小时才下班。', '黑', 'think'],
  [80.82, 81.98, '还有下午的会。', '黑', 'think'],
];
const CARDS_AT = 82.78;                                          // 最后的字卡从这里开始
// 第 i 句台词开始的时间：D(i)；结束：DE(i)
const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const GOLD = '#ffd2a0', RED = '#e5484d', GREEN = '#7fe3a0', LED = '#ff5a4a';

// ======================================================================== 共用
function pill(s, x, y, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 30; font(size, o.weight || 700, SANS); const w = ctx.measureText(s).width + 56;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(o.sc || 1, o.sc || 1);
  ctx.fillStyle = o.fill || 'rgba(20,24,34,.9)'; ctx.beginPath(); ctx.roundRect(-w / 2, -size * 1.05, w, size * 2.1, size * 1.05); ctx.fill();
  ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();
  text(s, 0, 1, { font: SANS, weight: o.weight || 700, size, align: 'center', color: o.color || CREAM });
  ctx.restore();
}
const big = { align: 'center', spread: 3, blur: 14, rise: 18 };
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}

// ======================================================================== 照片和人物
const FR = { x: 0, y: 470, w: 1080, h: 960 }, ASP = FR.w / FR.h, FB = FR.y + FR.h;   // FB：画框底边，半身像贴着它
const PHOTO_FILES = ['lobby', 'elevator'];                                         // 一场戏一张图，中途不换
const HERO_EXPR = ['calm', 'sad', 'cry', 'happy', 'shock', 'angry', 'meh', 'awkward'];
const CAST_FILES = ['领导-上司', '同事-老哥'];
const PH = {}, IMG = {};
const load = (src) => { const im = new Image(); im.src = src; return im; };
for (const n of PHOTO_FILES) PH[n] = load(`photos/${n}.jpg`);
for (const e of HERO_EXPR) IMG['hero_' + e] = load(`../characters/hero/expr/${e}.png`);
for (const n of CAST_FILES) IMG[n] = load(`../characters/cast/${n}.png`);
function ASSETS_READY() { return [...Object.values(PH), ...Object.values(IMG)].every(im => im.complete && im.naturalWidth > 0); }

// 主人公的图（1002×2992，原图的 2 倍）：脸的中心在 (640, 319)，帽子耳朵尖在 y ≈ 10
const HERO = { fx: 640, fy: 319, top: 10, s: .652 };
// 其他人：图是平底的半身像。w：画多宽；fx：脸在图里的横向位置（比例）；top：头顶在图里的纵向位置（比例）；
// face：原图里脸朝哪边（1 = 朝右）。站在画面右边、脸又朝右的，左右翻过来，跟主人公面对面。
const CAST = {
  黑: { name: '小黑' },
  板: { name: '领导', img: '领导-上司', w: 580, fx: .45, top: .02, face: 1 },
  哥: { name: '老哥', img: '同事-老哥', w: 470, fx: .55, top: .03, face: 1 },
};
// 主人公每一句台词时的表情（第 i 句开始时换；别人说话时是他听的反应）
const HX = ['awkward', 'sad', 'awkward', 'shock', 'shock', 'awkward', 'awkward', 'happy',               // 电梯厅
            'awkward', 'calm', 'happy', 'awkward', 'cry', 'meh',                                        // 吃了吗 / 您也是 / 三楼
            'meh', 'meh', 'happy', 'meh', 'happy', 'shock', 'angry',                                    // 领导讲当年 / 老哥“我等下一趟”
            'shock', 'happy', 'sad', 'shock', 'awkward', 'cry',                                         // 项目“挺好的” → 下午开会
            'awkward', 'happy', 'calm', 'meh', 'sad', 'cry'];                                           // 领导下电梯 / 电量
function heroExpr(t) {                                                              // [现在的表情, 上一个表情, 切换进度]
  let i = -1; for (let k = 0; k < DIALOG.length; k++) if (t >= D(k) - .05) i = k;
  if (i < 0) return ['awkward', 'awkward', 1];
  return [HX[i], i ? HX[i - 1] : 'awkward', sstep(D(i) - .05, D(i) + .1, t)];
}
const speaking = (who, t) => DIALOG.some(([a, b, , w]) => w === who && t >= a && t <= b);
const anyoneSpeaking = t => DIALOG.some(([a, b]) => t >= a && t <= b);
// 画一个人（屏幕坐标）。m：{ who, cx 脸的横向位置, top 主人公帽子耳朵尖的高度, dy 往下挪, a 透明度, sc 缩放 }；返回头顶、脸
function person(m, t) {
  const c = CAST[m.who], a = m.a ?? 1; if (a <= 0) return null;
  const talk = speaking(m.who, t), bob = talk ? -7 * Math.abs(Math.sin(t * 7.5)) : 1.5 * Math.sin(t * 1.6 + m.cx * .01);
  const dimmed = !talk && anyoneSpeaking(t);                                        // 别人说话时，听的人稍微暗一点
  ctx.save(); ctx.globalAlpha *= a; if (dimmed || m.filter) ctx.filter = m.filter || 'brightness(.86)';
  let r;
  if (m.who === '黑') {
    const s = HERO.s, top = (m.top ?? 760) + (m.dy || 0) + bob, x = m.cx - HERO.fx * s, y = top - HERO.top * s;
    const [e, prev, k] = heroExpr(t);
    if (k < 1) ctx.drawImage(IMG['hero_' + prev], x, y, 1002 * s, 2992 * s);
    ctx.globalAlpha *= k < 1 ? k : 1; ctx.drawImage(IMG['hero_' + e], x, y, 1002 * s, 2992 * s);
    r = { top: [m.cx, top], face: [m.cx, y + HERO.fy * s] };
  } else {
    const im = IMG[c.img], w = c.w * (m.sc || 1), h = w * im.naturalHeight / im.naturalWidth;
    const flip = (m.cx > W / 2) === (c.face > 0), fx = flip ? 1 - c.fx : c.fx;            // 朝向画面中间
    const x = m.cx - fx * w, y = FB - h + 6 + (m.dy || 0) + bob;
    if (flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); } else ctx.drawImage(im, x, y, w, h);
    r = { top: [m.cx, y + c.top * h], face: [m.cx, y + (c.top + .2) * h] };
  }
  ctx.restore();
  return { who: m.who, ...r };
}

// ---------------------------------------------------------------- 镜头：一场戏一张照片，取景基本不动，只有很慢的一点推近
const XF = .7;                                                                   // 换场时的交叉淡化
let SHOTS = [];
function cropAt(sh, t) {
  const k = E.io(prog(t, sh.t0, sh.t1));
  let [x, y, w] = sh.a.map((v, i) => lerp(v, sh.b[i], k));
  const im = PH[sh.img], W0 = im.naturalWidth || 2000, H0 = im.naturalHeight || 2000;
  w = Math.min(w, W0, H0 * ASP); const h = w / ASP;
  x = clamp(x, 0, W0 - w); y = clamp(y, 0, H0 - h);
  return { x, y, w, h, k: FR.w / w };
}

// ---------------------------------------------------------------- 对话框：统一在画框上部，尾巴指向说话的人
function wrapText(s, size, maxW) {
  font(size, 900, SANS); const out = []; let cur = '';
  for (const ch of s) { if (ctx.measureText(cur + ch).width > maxW && cur && !'，。？！、…」：；～”'.includes(ch)) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
// kind：say 白色椭圆；think 淡蓝的“想”泡泡（尾巴是三个小圆点）；ax, ay：说话的人的头顶（屏幕坐标）
function bubble(str, kind, ax, ay, a) {
  if (a <= 0) return;
  const size = 34, lh = size * 1.35, lines = wrapText(str, size, 640);
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
  if (kind === 'think') {                                                        // 三个小圆点飘向头
    for (const [k, r] of [[1.08, 12], [1.3, 8.5], [1.5, 6]]) { const d = (h / 2) / Math.max(.35, uy) * k;
      ctx.beginPath(); ctx.arc(ux * d, uy * d, r, 0, TAU); ctx.fill(); }
  } else {                                                                       // 尖尾巴指向说话的人
    const ex = ux * (w / 2) * .5, ey = uy * (h / 2) * .85, tip = Math.min(L0 - h / 2, 80);
    ctx.beginPath(); ctx.moveTo(ex - uy * 18, ey + ux * 18); ctx.lineTo(ex + ux * tip, ey + uy * tip); ctx.lineTo(ex + uy * 18, ey - ux * 18); ctx.closePath(); ctx.fill();
  }
  lines.forEach((l, i) => text(l, 0, (i - (lines.length - 1) / 2) * lh + 2, { font: SANS, size, weight: 900, align: 'center', color: '#1d1e24' }));
  ctx.restore();
}
// 电池：level 0–1；颜色随电量从红变绿
function battery(x, y, level, a, label) {
  if (a <= 0) return;
  const col = level < .2 ? RED : mixc('#f2c14a', GREEN, (level - .45) / .45);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(14,16,22,.88)'; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 80, y - 38, 160, 76, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = CREAM; ctx.fillRect(x + 82, y - 14, 11, 28);
  ctx.fillStyle = col; ctx.fillRect(x - 71, y - 29, Math.max(6, 142 * level), 58); ctx.restore();
  text(Math.round(level * 100) + '%', x, y + 2, { font: SANS, size: 30, weight: 900, align: 'center', color: '#0e2a1b', alpha: a });
  if (label) text(label, x, y - 70, { font: SANS, size: 32, weight: 900, align: 'center', color: col, alpha: a, glow: 'rgba(0,0,0,.9)', blur: 12 });
}

// ---------------------------------------------------------------- 电梯：楼层、停靠、开关门（时间表）
// 电梯厅：一直停在 18 楼 → 一口气下来 → 1 楼到了。电梯里：1 → 3（没人）→ 8（老哥）→ 16（领导下）→ 18。
const STOPS = () => [                                                             // [到达时间, 楼层, 开门, 关门]
  [D(2) + .2 - 1.0, 1, D(3) - .9, null],                                          // 电梯厅：到了，门开（关门在下一段开头）
  [DE(12) + .15, 3, DE(12) + .4, D(13) + 1.4],
  [DE(17) + .15, 8, DE(17) + .4, DE(19) + .5],
  [DE(26) + .2, 16, DE(26) + .45, DE(28) + 1.1],
  [DE(31) + .2, 18, DE(31) + .45, null],
];
function liftAt(t) {                                                              // 现在几楼、往哪走、门开着没有
  const L = S['电梯里'];
  if (t < L) {                                                                    // 电梯厅：18 楼不动，D(1) 之后一口气下来
    const t0 = D(1) + .4, t1 = STOPS()[0][0], f = t < t0 ? 18 : t >= t1 ? 1 : Math.round(lerp(18, 1, E.in(prog(t, t0, t1))));
    return { floor: f, dir: t >= t0 && t < t1 ? -1 : 0, open: t >= STOPS()[0][2] ? 1 : 0 };
  }
  const st = STOPS().slice(1), legs = [[L + 1.2, 1]];
  let prevClose = L + .2;
  for (const [arr, fl, op, cl] of st) {
    const [d0, f0] = legs[legs.length - 1];
    if (t < arr) return { floor: Math.min(fl, Math.floor(lerp(f0, fl, prog(t, d0, arr)) + 1e-6)), dir: t >= d0 ? 1 : 0, open: t < prevClose + .6 && t >= prevClose ? 0 : 0 };
    if (cl === null || t < cl + .6) return { floor: fl, dir: 0, open: t >= op && (cl === null || t < cl) ? 1 : 0 };
    legs.push([cl + .6, fl]); prevClose = cl;
  }
  return { floor: 18, dir: 0, open: 1 };
}
function floorDisplay(t) {                                                        // 画框下面的黑边里：电梯楼层显示（红色 LED）
  const a = 1 - sstep(CARDS_AT - .6, CARDS_AT - .1, t); if (a <= 0) return;
  const { floor, dir } = liftAt(t), x = 540, y = 1540;
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#0b0b0d'; ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x - 130, y - 62, 260, 124, 18); ctx.fill(); ctx.stroke(); ctx.restore();
  text(String(floor), x + 30, y + 4, { font: SANS, size: 84, weight: 900, align: 'center', color: LED, alpha: a, glow: 'rgba(255,70,50,.8)', blur: 18 });
  if (dir) { const ph = (t * 2.2) % 1, ay = y + 4 - dir * (ph - .5) * 26;
    text(dir > 0 ? '▲' : '▼', x - 70, ay, { font: SANS, size: 44, weight: 900, align: 'center', color: LED, alpha: a * (1 - Math.abs(ph - .5)), glow: 'rgba(255,70,50,.8)', blur: 12 }); }
}

// ---------------------------------------------------------------- 每个镜头里的人（屏幕坐标：cx 是脸的横向位置）
const slide = (t, t0, t1, from, to, e = E.out) => lerp(from, to, e(prog(t, t0, t1)));
function castIn(sh, t) {
  switch (sh.name) {
    case 'lobby': {                                                               // 门一开：领导在里面
      const op = STOPS()[0][2];
      return [{ who: '板', cx: slide(t, op + .1, op + .8, 900, 830), a: sstep(op + .05, op + .45, t) }, { who: '黑', cx: 320 }];
    }
    case 'elevator': {
      const [, , op8, cl8] = STOPS()[2], [, , op16] = STOPS()[3];
      const bro = sstep(op8 + .2, op8 + .7, t) * (1 - sstep(cl8 - .5, cl8, t));          // 八楼：老哥站在门口
      const boss = slide(t, DE(28) + .1, DE(28) + 1.0, 830, 1500, E.in);                 // 领导说完“好好干”就出去了
      const peek = -100 - 50 * E.out(prog(t, op8 + .2, op8 + .9));                          // 小一号、在两人中间的后面探出头（下半身被两人挡住）
      return [{ who: '哥', cx: 575, sc: .6, dy: peek, a: bro }, { who: '板', cx: boss }, { who: '黑', cx: 320 }];
    }
  }
  return [];
}
function drawShot(sh, t, a) {
  if (a <= 0) return null;
  const c = cropAt(sh, t), im = PH[sh.img];
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  ctx.save(); ctx.translate(FR.x - c.x * c.k, FR.y - c.y * c.k); ctx.scale(c.k, c.k);
  if (im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0);
  ctx.restore();
  if (sh.name === 'elevator') {                                                   // 门开着时，外面走廊的光照进来一点
    const op = liftAt(t).open; if (op) { const g = ctx.createLinearGradient(FR.x, 0, FR.x + FR.w, 0); g.addColorStop(0, 'rgba(255,250,235,0)'); g.addColorStop(.5, 'rgba(255,250,235,.10)'); g.addColorStop(1, 'rgba(255,250,235,0)'); ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); }
  }
  const g = ctx.createLinearGradient(0, FR.y + FR.h * .45, 0, FB); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');   // 底部压暗一点，人物站得稳
  ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h);
  const out = [];
  for (const m of castIn(sh, t)) { if (m.cx < -300 || m.cx > W + 300 || (m.a ?? 1) <= 0) continue; const r = person(m, t); if (r) out.push(r); }
  ctx.restore();
  return { c, cast: out };
}

// ======================================================================== 世界层
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let info = null;
  SHOTS.forEach((sh, i) => {
    if (t < sh.t0 - XF / 2 || t > sh.t1 + XF / 2) return;
    const a = i === 0 ? 1 : sstep(sh.t0 - XF / 2, sh.t0 + XF / 2, t);
    const r = drawShot(sh, t, a); if (r && a > .5) info = { ...r, name: sh.name };
  });
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.12)'; ctx.lineWidth = 2; ctx.strokeRect(FR.x - 1, FR.y - 1, FR.w + 2, FR.h + 2); ctx.restore();
  const me = info && info.cast.find(m => m.who === '黑');
  // 三楼：门开了，没人
  const nobody = win(t, STOPS()[1][2] + .2, STOPS()[1][3], .25, .3);
  text('（门开了……没人）', 700, 830, { font: SANS, size: 34, weight: 700, align: 'center', color: '#c9ced8', alpha: nobody, glow: 'rgba(0,0,0,.9)', blur: 12 });
  // 电量：掉了三成，又掉一截
  if (me && info.name === 'elevator') {
    const lv = lerp(1, .7, E.out(prog(t, D(30) + 1.0, D(30) + 1.6))) - .3 * E.out(prog(t, D(32) + .4, D(32) + 1.0));
    battery(me.face[0] + 300, me.face[1] - 70, lv, sstep(D(30) + .2, D(30) + .6, t), '电量');
  }
  floorDisplay(t);
  // 对话框：每一句在它说的时候出现，说完淡出
  DIALOG.forEach(([a, b, s, who, kind], i) => {
    const next = DIALOG[i + 1] ? DIALOG[i + 1][0] : TOTAL, fe = Math.max(b + .25, Math.min(b + .7, next - .05));
    if (t < a - .1 || t > fe + .05) return;
    const k = sstep(a - .1, a + .15, t) * (1 - sstep(fe - .25, fe, t));
    const m = info && info.cast.find(c => c.who === who);
    if (m) bubble(s, kind, m.top[0], m.top[1], k);
  });
  // 画框上面的黑边：第一段是封面钩子；之后换成标题
  const L = S['电梯里'], hook = 1 - sstep(L - .8, L - .1, t), ttl = sstep(L - .3, L + .5, t);
  text('早上八点五十九，', 540, 270, { size: 64, weight: 900, align: 'center', color: CREAM, alpha: hook });
  text('电梯门一开，领导在里面', 540, 375, { size: 66, weight: 900, align: 'center', color: GOLD, alpha: hook });
  text('电梯里遇到领导', 540, 300, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: ttl });
  text('三十秒，比加班还累', 540, 376, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: ttl * .85 });
  // 最后的字卡（画框下面）
  const c1 = win(t, CARDS_AT, CARDS_AT + 4.0, .4, .4), c2 = sstep(CARDS_AT + 3.8, CARDS_AT + 4.3, t);
  typeText('电梯三十秒，', 540, 1530, { ...big, size: 60, weight: 900, color: CREAM }, prog(t, CARDS_AT, CARDS_AT + .8), c1);
  typeText('比加班还累。', 540, 1630, { ...big, size: 72, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, CARDS_AT + 1.0, CARDS_AT + 2.0), c1);
  typeText('评论区说说：', 540, 1530, { size: 44, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, CARDS_AT + 3.9, CARDS_AT + 4.4), c2);
  typeText('你在电梯里遇到过领导吗？', 540, 1620, { size: 56, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, CARDS_AT + 4.3, CARDS_AT + 5.3), c2);
}
function SAMPLES(T) { return SHOTS.some((sh, i) => i && Math.abs(T - sh.t0) < XF / 2 + .05) ? 4 : 2; }
function BLOOM_K(T) { return .2; }
function OVER(T) {}
function MASTER(T) { return 1; }
function INIT() {
  const sec = n => S[n];
  SHOTS = [
    { name: 'lobby', img: 'lobby', t0: 0, t1: sec('电梯里'), a: [0, 0, 1440], b: [30, 26, 1380] },
    { name: 'elevator', img: 'elevator', t0: sec('电梯里'), t1: TOTAL + 1, a: [0, 0, 1440], b: [40, 35, 1360] },
  ];
}

// ======================================================================== 音效提示表
function CUES() {
  const c = [], L = S['电梯里'], ST = STOPS();
  // ① 电梯厅：大堂的底噪；电梯到了“叮”，门开
  c.push([0, 'room', { dur: L + .4, gain: 1.6, fi: .05, fo: .5 }]);
  c.push([ST[0][2] - .25, 'tink', { f: 1318.5, gain: .07 }], [ST[0][2] - .05, 'tink', { f: 1046.5, gain: .06 }], [ST[0][2], 'doors', { gain: .9 }]);
  // ② 电梯里：门关上，电梯一直嗡嗡地走；每停一层“叮”、开门、关门
  c.push([L + .1, 'doors', { gain: .9 }], [L + .5, 'lift', { dur: TOTAL - L, gain: 1.2, fi: .8, fo: 1.0 }]);
  for (const [arr, , op, cl] of ST.slice(1)) {
    c.push([arr, 'tink', { f: 1318.5, gain: .06 }], [arr + .2, 'tink', { f: 1046.5, gain: .05 }], [op, 'doors', { gain: .8 }]);
    if (cl !== null) c.push([cl, 'doors', { gain: .8 }]);
  }
  // 电量掉了：两次
  c.push([D(30) + 1.0, 'lowbat', { gain: .7 }], [D(32) + .4, 'lowbat', { gain: .8 }]);
  c.push([CARDS_AT, 'shimmer', { f: [698.5, 880, 1046.5, 1396.9], gain: .06 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
