// ======================================================================== No.51 今晚聚餐，你去不去？（Wojak 叙事短剧）
// 一件日常小事，不讲道理：下班前同事约聚餐 → 嘴上说“去啊”，心里只想回家 → 火锅店里一直说“对” → 被问“周末干嘛”，答“睡觉” → 回家路上终于不用笑了 → 到家充电。
// 角色（频道主给的形象，在 ../characters/）：小黑 = 主人公（表情随台词换）；老哥 = 同事-老哥（约饭的那个）；运营 = 女同事-运营（开朗话多、爱拍照）；
// 主人公肩上的猫也会“喵”一声（对话框指着猫）。
// 一场戏一张背景图：公司（office，和上一期同一个办公室）、火锅店（hotpot，生成的）、回家路上（nightstreet，生成的，虚化过）、家（livingroom，和上一期同一个家）。
// 两个人说话时面对面：主人公在左边、朝右；别人在右边，原图朝右的左右翻过来。
// 没有片头、没有进度条，片尾和水印保留。配乐只在“到家”那段（很轻的钢琴），前面只有环境声；尴尬的时候全场安静，只剩蛐蛐叫。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 116.8;
const SECTIONS = [['公司', 0.0, 27.2], ['火锅店', 27.2, 72.8], ['回家路上', 72.8, 92.8], ['到家', 92.8, 116.8]];
const LINES = [];                                                   // 没有旁白
const DIALOG = [
  [0.30, 3.99, '还有五分钟下班。今天终于能早点回家躺着了。', '黑', 'think'],
  [4.39, 7.42, '哎，今晚部门聚餐，你去不去？', '哥', 'say'],
  [7.82, 8.46, '不想去。', '黑', 'think'],
  [8.66, 13.65, '可大家都去，就我不去，会不会显得很不合群？', '黑', 'think'],
  [13.95, 15.26, '就差你一个了！', '哥', 'say'],
  [15.56, 17.44, '去啊！当然去！', '黑', 'say'],
  [17.94, 20.03, '等等……我刚才说了什么？', '黑', 'think'],
  [20.33, 22.30, '那七点，楼下火锅店见！', '哥', 'say'],
  [22.60, 26.26, '离七点还有一个小时。我已经开始累了。', '黑', 'think'],
  [27.60, 28.93, '想吃什么？随便点！', '运', 'say'],
  [29.13, 30.90, '都行，我都可以。', '黑', 'say'],
  [31.20, 33.42, '其实……我想吃毛肚。', '黑', 'think'],
  [34.02, 38.27, '哈哈哈笑死我了，你们知道吗，今天我们组那个……', '运', 'say'],
  [38.37, 40.28, '来来来，先干一杯！', '哥', 'say'],
  [40.58, 43.07, '他们在笑什么？我要不要接一句？', '黑', 'think'],
  [43.27, 44.52, '哈哈，对。', '黑', 'say'],
  [44.92, 47.36, '不知道在笑什么，先跟着笑。', '黑', 'think'],
  [50.86, 52.67, '今晚已经说了八个“对”了。', '黑', 'think'],
  [53.07, 55.23, '诶，你平时周末都干嘛呀？', '运', 'say'],
  [55.53, 57.49, '完了，脑子一片空白。', '黑', 'think'],
  [57.79, 59.42, '睡……睡觉。', '黑', 'say'],
  [61.72, 63.92, '哈……哈哈，睡觉好，睡觉好。', '运', 'say'],
  [64.22, 65.88, '来来来，吃菜吃菜！', '哥', 'say'],
  [66.18, 68.54, '来，拍张合照！大家笑一个～', '运', 'say'],
  [70.24, 71.25, '我想回家。', '黑', 'think'],
  [73.20, 75.73, '今天挺开心的吧？下次还叫你！', '哥', 'say'],
  [76.03, 78.36, '好啊好啊，下次一定！', '黑', 'say'],
  [78.76, 80.87, '下次一定……找个理由不来。', '黑', 'think'],
  [81.27, 83.23, '那我先走啦，路上小心！', '哥', 'say'],
  [83.43, 85.09, '好，拜拜！', '黑', 'say'],
  [85.89, 88.36, '终于……可以不用笑了。', '黑', 'think'],
  [88.86, 91.35, '电量，只剩百分之一。', '黑', 'think'],
  [93.20, 95.34, '终于……到家了。', '黑', 'think'],
  [96.24, 98.67, '嗯？群里发了聚餐的合照。', '黑', 'think'],
  [98.97, 101.81, '照片里的我，笑得好用力。', '黑', 'think'],
  [102.51, 103.68, '喵～', '猫', 'say'],
  [104.08, 106.57, '嗯，还是跟你待着最舒服。', '黑', 'say'],
  [107.07, 107.94, '充电中。', '黑', 'think'],
];
const CARDS_AT = 108.74;                                          // 最后的字卡从这里开始
// 第 i 句台词开始的时间：D(i)；结束：DE(i)
const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const GOLD = '#ffd2a0', RED = '#e5484d', GREEN = '#7fe3a0';

// ======================================================================== 共用
function warmth(a, x = 540, y = 980, r = 900, rgb = '255,170,90') {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${.16 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
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
function mixc(a, b, k) {
  const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A2 = p(a), B2 = p(b);
  return '#' + A2.map((v, i) => Math.round(lerp(v, B2[i], clamp(k, 0, 1))).toString(16).padStart(2, '0')).join('');
}
const pop = (t, t0) => { const k = prog(t, t0, t0 + .35); return k <= 0 ? 0 : 1 + .25 * Math.sin(PI * Math.min(1, k * 1.2)) * (1 - k); };

// ======================================================================== 照片和人物
const FR = { x: 0, y: 470, w: 1080, h: 960 }, ASP = FR.w / FR.h, FB = FR.y + FR.h;   // FB：画框底边，半身像贴着它
const PHOTO_FILES = ['office', 'hotpot', 'nightstreet', 'livingroom'];              // 一场戏一张图，中途不换
const HERO_EXPR = ['calm', 'sad', 'cry', 'happy', 'shock', 'angry', 'meh', 'awkward'];
const CAST_FILES = ['同事-老哥', '女同事-运营'];
const PH = {}, IMG = {};
const load = (src) => { const im = new Image(); im.src = src; return im; };
for (const n of PHOTO_FILES) PH[n] = load(`photos/${n}.jpg`);
for (const e of HERO_EXPR) IMG['hero_' + e] = load(`../characters/hero/expr/${e}.png`);
for (const n of CAST_FILES) IMG[n] = load(`../characters/cast/${n}.png`);
function ASSETS_READY() { return [...Object.values(PH), ...Object.values(IMG)].every(im => im.complete && im.naturalWidth > 0); }

// 主人公的图（1002×2992，原图的 2 倍）：脸的中心在 (640, 319)，帽子耳朵尖在 y ≈ 10；肩上那只猫的头顶在 (270, 180)、脸在 (290, 329)
const HERO = { fx: 640, fy: 319, top: 10, s: .652, cat: [270, 180], catFace: [290, 329] };
// 其他人：图是平底的半身像。w：画多宽；fx：脸在图里的横向位置（比例）；top：头顶在图里的纵向位置（比例）；
// face：原图里脸朝哪边（1 = 朝右）。站在画面右边、脸又朝右的，左右翻过来，跟主人公面对面。
const CAST = {
  黑: { name: '小黑' },
  哥: { name: '老哥', img: '同事-老哥', w: 560, fx: .55, top: .03, face: 1 },
  运: { name: '运营', img: '女同事-运营', w: 430, fx: .55, top: .03, face: 1 },
  猫: { name: '猫' },
};
// 主人公每一句台词时的表情（第 i 句开始时换；别人说话时是他听的反应）
const HX = ['happy', 'shock', 'meh', 'awkward', 'shock', 'happy', 'cry', 'awkward', 'meh',            // 公司
            'calm', 'happy', 'sad', 'calm', 'awkward', 'awkward', 'awkward', 'awkward', 'meh',        // 火锅店：点菜、跟着笑
            'shock', 'shock', 'awkward', 'awkward', 'meh', 'awkward', 'cry',                          //         被问周末、合照、想回家
            'awkward', 'happy', 'meh', 'happy', 'happy', 'meh', 'sad',                                // 回家路上
            'calm', 'calm', 'meh', 'calm', 'happy', 'happy'];                                         // 到家
function heroExpr(t) {                                                              // [现在的表情, 上一个表情, 切换进度]
  let i = -1; for (let k = 0; k < DIALOG.length; k++) if (t >= D(k) - .05) i = k;
  if (i < 0) return ['happy', 'happy', 1];
  return [HX[i], i ? HX[i - 1] : 'happy', sstep(D(i) - .05, D(i) + .1, t)];
}
const speaking = (who, t) => DIALOG.some(([a, b, , w]) => (w === who || (who === '黑' && w === '猫')) && t >= a && t <= b);
const anyoneSpeaking = t => DIALOG.some(([a, b]) => t >= a && t <= b);
// 画一个人（屏幕坐标）。m：{ who, cx 脸的横向位置, top 主人公帽子耳朵尖的高度, dy 往下挪, a 透明度 }；返回头顶、脸（还有主人公肩上猫的头顶）
function person(m, t) {
  const c = CAST[m.who], a = m.a ?? 1; if (a <= 0) return null;
  const talk = speaking(m.who, t), bob = talk ? -7 * Math.abs(Math.sin(t * 7.5)) : 1.5 * Math.sin(t * 1.6 + m.cx * .01);
  const dimmed = !talk && anyoneSpeaking(t);                                        // 别人说话时，听的人稍微暗一点
  ctx.save(); ctx.globalAlpha *= a; if (dimmed) ctx.filter = 'brightness(.86)';
  let r;
  if (m.who === '黑') {
    const s = HERO.s, top = (m.top ?? 760) + (m.dy || 0) + bob, x = m.cx - HERO.fx * s, y = top - HERO.top * s;
    const [e, prev, k] = heroExpr(t);
    if (k < 1) ctx.drawImage(IMG['hero_' + prev], x, y, 1002 * s, 2992 * s);
    ctx.globalAlpha *= k < 1 ? k : 1; ctx.drawImage(IMG['hero_' + e], x, y, 1002 * s, 2992 * s);
    r = { top: [m.cx, top], face: [m.cx, y + HERO.fy * s], cat: [x + HERO.cat[0] * s, y + HERO.cat[1] * s], catFace: [x + HERO.catFace[0] * s, y + HERO.catFace[1] * s] };
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
// 小一号的半身像（手机里的合照用）：底边中点在 (x, y)，高 h
function bust(key, x, y, h, a = 1) {
  const im = IMG[key]; if (a <= 0 || !im.naturalWidth) return;
  const hero = key.startsWith('hero_'), sw = im.naturalWidth, sh = hero ? 1143 : im.naturalHeight, w = h * sw / sh;
  ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(im, 0, 0, sw, sh, x - w / 2, y - h, w, h); ctx.restore();
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
function bubble(str, kind, ax, ay, a, o = {}) {
  if (a <= 0) return;
  const size = o.size || 34, lh = size * 1.35, lines = wrapText(str, size, 640);
  font(size, 900, SANS); const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
  const w = tw + size * 3.2, h = lines.length * lh + size * 1.7;
  const bx = clamp(ax, w / 2 + 24, W - w / 2 - 24), by = o.y ?? FR.y + 30 + h / 2;
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
// 小对话框（一串“对”）：白色圆角小框，弹出来
function miniBubble(s, x, y, a, sc = 1, rot = 0) {
  if (a <= 0) return;
  font(30, 900, SANS); const w = ctx.measureText(s).width + 36, h = 54;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; ctx.fillStyle = '#f3efe8'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 18); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; text(s, 0, 2, { font: SANS, size: 30, weight: 900, align: 'center', color: '#1d1e24' }); ctx.restore();
}
// 电池：level 0–1；颜色随电量从红变绿
function battery(x, y, level, a, label, blink = 0) {
  if (a <= 0) return;
  const col = level < .2 ? RED : mixc('#f2c14a', GREEN, (level - .2) / .5);
  ctx.save(); ctx.globalAlpha *= a * (1 - blink * .55 * (.5 + .5 * Math.sin(performanceT * 9)));   // blink：没电时一闪一闪（不整个消失）
  ctx.fillStyle = 'rgba(14,16,22,.88)'; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 80, y - 38, 160, 76, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = CREAM; ctx.fillRect(x + 82, y - 14, 11, 28);
  ctx.fillStyle = col; ctx.fillRect(x - 71, y - 29, Math.max(6, 142 * level), 58); ctx.restore();
  text(Math.round(level * 100) + '%', x, y + 2, { font: SANS, size: 30, weight: 900, align: 'center', color: level < .5 ? CREAM : '#0e2a1b', alpha: a });
  if (label) text(label, x, y - 70, { font: SANS, size: 32, weight: 900, align: 'center', color: col, alpha: a, glow: 'rgba(0,0,0,.9)', blur: 12 });
}
let performanceT = 0;                                                            // 当前时间（电池闪烁用）

// ---------------------------------------------------------------- 每个镜头里的人（屏幕坐标：cx 是脸的横向位置）
const slide = (t, t0, t1, from, to, e = E.out) => lerp(from, to, e(prog(t, t0, t1)));
function castIn(sh, t) {
  switch (sh.name) {
    case 'office':                                                               // 老哥从右边过来约饭
      return [{ who: '哥', cx: slide(t, D(1) - 1.0, D(1) - .2, 1500, 840) }, { who: '黑', cx: 320 }];
    case 'hotpot':                                                               // 一桌：主人公在左，运营、老哥在右（老哥在后面）
      return [{ who: '哥', cx: 945, sc: .92 }, { who: '运', cx: 700 }, { who: '黑', cx: 300 }];
    case 'nightstreet':                                                          // 老哥说完拜拜就往右走了，剩主人公一个人
      return [{ who: '哥', cx: slide(t, DE(29) - .2, DE(29) + .9, 840, 1500, E.in) }, { who: '黑', cx: 320 }];
    case 'livingroom': {                                                         // 一进门往沙发上一倒（往下一沉，再轻轻弹一下）
      const k = prog(t, D(32) + .35, D(32) + .95), sink = 90 * (k < 1 ? E.out(k) + .12 * Math.sin(PI * k) : 1);
      return [{ who: '黑', cx: 400, top: 760 + sink }];
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
  const g = ctx.createLinearGradient(0, FR.y + FR.h * .45, 0, FB); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');   // 底部压暗一点，人物站得稳
  ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h);
  if (sh.name === 'livingroom') warmth(.6 + .5 * sstep(D(36), D(37) + 2, t), 420, 1000, 760);      // 家里的暖光，越来越暖
  const out = [];
  for (const m of castIn(sh, t)) { if (m.cx < -300 || m.cx > W + 300) continue; const r = person(m, t); if (r) out.push(r); }
  ctx.restore();
  return { c, cast: out };
}

// ---------------------------------------------------------------- 火锅店：一桌人在聊、一串“对”、被点名时的聚光灯、合照
// 一桌人在聊：一句句轮流冒在人头顶上方的四个位置（每句停 2.6 秒，同时最多三句，互不重叠）
const CHATTER = ['哈哈哈哈', '真的假的？', '笑死我了', '然后呢然后呢', '不会吧！', '太离谱了', '哈哈哈哈哈', '我跟你说', '绝了绝了', '他真这么说的？', '服了', '还有更离谱的', '笑不活了', '哈哈哈', '来来来喝'];
const CHAT_AT = [[700, 735], [945, 812], [760, 855], [940, 722]];
const YES = [['对', 0], ['对对对', .5], ['哈哈对', 1.0], ['是是是', 1.5], ['对！', 2.0], ['对对', 2.45], ['嗯嗯，对', 2.9]];
const YES_AT = [[120, 760, -.08], [520, 730, .06], [95, 905, .05], [545, 880, -.05], [300, 700, .03], [150, 1050, -.04], [500, 1030, .07]];
const FLASH = () => DE(23) + .45;                                                 // 合照：闪光灯
function hotpotLayer(t, me) {
  // 一桌人在聊（运营讲笑话开始，被点名时一下子停住）
  CHATTER.forEach((s, j) => {
    const t0 = D(12) + .3 + j * 1.25, [x, y] = CHAT_AT[j % 4], k = win(t, t0, Math.min(t0 + 2.6, D(18)), .2, .4); if (k <= 0) return;
    text(s, x + Math.sin(t * 1.3 + j) * 6, y - (t - t0) * 10, { font: SANS, size: 34 + (j % 2) * 4, weight: 900, align: 'center', color: j % 2 ? '#ffd2a0' : '#ffffff', alpha: k * .9, glow: 'rgba(0,0,0,.95)', blur: 14 });
  });
  if (!me) return;
  // 一串“对”（不配音），每个弹出来、停一会儿、淡掉
  YES.forEach(([s, dt], j) => { const t0 = DE(16) + .1 + dt, k = sstep(t0, t0 + .12, t) * (1 - sstep(t0 + 1.1, t0 + 1.4, t)); if (k <= 0) return;
    const [x, y, rot] = YES_AT[j]; miniBubble(s, x, y, k, pop(t, t0), rot); });
  // 计数：“对” × N
  const n = t < D(15) + .3 ? 0 : 1 + YES.filter(([, dt]) => t >= DE(16) + .1 + dt).length;
  const ka = sstep(D(15) + .3, D(15) + .6, t) * (1 - sstep(D(18) - .2, D(18), t));
  if (ka > 0 && n > 0) { const lastT = n === 1 ? D(15) + .3 : DE(16) + .1 + YES[n - 2][1];
    pill(`“对” × ${n}`, me.top[0] + 10, me.top[1] - 40, ka, { size: 30, color: '#1a1208', fill: 'rgba(255,210,150,.96)', stroke: 'rgba(0,0,0,0)', sc: pop(t, lastT) || 1 }); }
}
// 被点名：全场暗下来，只有主人公在光里
function spotlight(t, me) {
  const k = win(t, D(18) + .15, D(21) + .5, .35, .5); if (k <= 0 || !me) return;
  const [x, y] = me.face, r = 340;
  ctx.save(); ctx.globalAlpha = k; const g = ctx.createRadialGradient(x, y, r * .55, x, y, r * 1.25);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(4,5,8,.86)'); ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore();
  // 他说完“睡觉”之后：全场安静
  const q = win(t, DE(20) + .15, D(21) + .1, .25, .3);
  text('……', 790, 820, { font: SANS, size: 96, weight: 900, align: 'center', color: CREAM, alpha: q * .95 });
  text('（唧——唧——）', 790, 905, { font: SANS, size: 30, weight: 700, align: 'center', color: '#9aa3b3', alpha: q * .9 });
}
// 拍合照：取景框的四个角 → 闪光灯
function snapshot(t) {
  const fr = win(t, D(23) + 1.0, FLASH() + .15, .3, .1);
  if (fr > 0) { ctx.save(); ctx.globalAlpha = fr; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    const x0 = 60, y0 = FR.y + 250, x1 = 1020, y1 = FB - 40, L = 70;
    for (const [x, y, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y); ctx.stroke(); }
    ctx.restore(); }
  const f = t < FLASH() ? 0 : Math.exp(-(t - FLASH()) / .18);
  if (f > .01) { ctx.save(); ctx.globalAlpha = f; ctx.fillStyle = '#ffffff'; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore(); }
}

// ---------------------------------------------------------------- 到家：群里的合照
function phone(t, me) {
  const k = win(t, D(33) - .3, D(35) - .2, .45, .45); if (k <= 0) return;
  const cx = 830, cy = 1000 + 60 * (1 - E.out(prog(t, D(33) - .3, D(33) + .3))), w = 330, h = 560;
  ctx.save(); ctx.globalAlpha = k;
  ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; ctx.fillStyle = '#121317'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 40); ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)'; const sx = cx - w / 2 + 12, sy = cy - h / 2 + 14, sw = w - 24, sh = h - 28;
  ctx.fillStyle = '#ededed'; ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, 30); ctx.fill();
  ctx.fillStyle = '#f7f7f7'; ctx.fillRect(sx, sy + 34, sw, 48); ctx.restore();
  text('部门群（8）', cx, sy + 60, { font: SANS, size: 24, weight: 700, align: 'center', color: '#222', alpha: k });
  // 老哥的消息
  const ax = sx + 34, ay = sy + 130;
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(ax, ay, 22, 0, TAU); ctx.fillStyle = '#ccc'; ctx.fill(); ctx.clip();
  const im = IMG['同事-老哥']; if (im.naturalWidth) ctx.drawImage(im, im.naturalWidth * .38, 0, im.naturalWidth * .5, im.naturalWidth * .5, ax - 24, ay - 22, 48, 48); ctx.restore();
  text('老哥', ax + 34, ay - 12, { font: SANS, size: 18, weight: 500, color: '#888', alpha: k });
  ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(ax + 30, ay - 2, 200, 44, 10); ctx.fill(); ctx.restore();
  text('今天聚餐合影～', ax + 46, ay + 21, { font: SANS, size: 21, weight: 700, color: '#222', alpha: k });
  // 合照：火锅店 + 运营（比耶）、主人公（笑得很用力）、老哥
  const px = ax + 30, py = ay + 62, pw = 230, ph = 200;
  ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.clip();
  const bg = PH.hotpot; if (bg.naturalWidth) ctx.drawImage(bg, 200, 100, 1000, 870, px, py, pw, ph);
  const hx = px + 128, hh = 150;                                                 // 主人公在中间（脸在 640/1002、319/1143 处）
  bust('同事-老哥', px + 196, py + ph + 4, 118); bust('女同事-运营', px + 46, py + ph + 4, 150); bust('hero_awkward', hx, py + ph + 4, hh);
  ctx.restore();
  // “笑得好用力”：红圈圈住照片里的自己
  const rc = sstep(D(34) + .4, D(34) + 1.0, t) * k;
  if (rc > 0) { const ex = hx + (640 / 1002 - .5) * hh * 1002 / 1143, ey = py + ph + 4 - hh * (1 - 319 / 1143), rr = 32; ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.ellipse(ex, ey, rr * 1.1, rr, -.2, -PI / 2, -PI / 2 + TAU * 1.08 * rc); ctx.stroke(); ctx.restore(); }
}

// ======================================================================== 世界层
function WORLD(t) {
  performanceT = t;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let info = null;
  SHOTS.forEach((sh, i) => {
    if (t < sh.t0 - XF / 2 || t > sh.t1 + XF / 2) return;
    const a = i === 0 ? 1 : sstep(sh.t0 - XF / 2, sh.t0 + XF / 2, t);
    const r = drawShot(sh, t, a); if (r && a > .5) info = { ...r, name: sh.name };
  });
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.12)'; ctx.lineWidth = 2; ctx.strokeRect(FR.x - 1, FR.y - 1, FR.w + 2, FR.h + 2); ctx.restore();
  const me = info && info.cast.find(m => m.who === '黑');
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
  if (info && info.name === 'hotpot') { spotlight(t, me); hotpotLayer(t, me); snapshot(t); }
  // 回家路上：电量 1%，红色闪；到家：慢慢充满
  if (me && info.name === 'nightstreet') battery(me.face[0] + 290, me.face[1] - 60, .01, win(t, D(31) + .3, S['到家'] + .3, .3, .4), '电量', 1);
  if (me && info.name === 'livingroom') { const lv = lerp(.01, 1, E.io(prog(t, D(37) - .1, D(37) + 2.6)));
    battery(me.face[0] + 300, me.face[1] - 120, lv, sstep(D(37) - .3, D(37), t), lv >= .99 ? '充满了' : '充电中'); phone(t, me); }
  ctx.restore();
  // 对话框：每一句在它说的时候出现，说完淡出
  DIALOG.forEach(([a, b, s, who, kind], i) => {
    const next = DIALOG[i + 1] ? DIALOG[i + 1][0] : TOTAL, fe = Math.max(b + .25, Math.min(b + .7, next - .05));
    if (t < a - .1 || t > fe + .05) return;
    const k = sstep(a - .1, a + .15, t) * (1 - sstep(fe - .25, fe, t));
    if (who === '猫') { if (me) bubble(s, kind, me.cat[0], me.cat[1], k, { size: 40 }); return; }
    const m = info && info.cast.find(c => c.who === who);
    if (m) bubble(s, kind, m.top[0], m.top[1], k);
  });
  // 画框上面的黑边：第一段是封面钩子；之后换成标题
  const hook = 1 - sstep(S['火锅店'] - .8, S['火锅店'] - .1, t), ttl = sstep(S['火锅店'] - .3, S['火锅店'] + .5, t);
  text('下班前五分钟，', 540, 270, { size: 64, weight: 900, align: 'center', color: CREAM, alpha: hook });
  text('同事问我：今晚聚餐去不去？', 540, 375, { size: 66, weight: 900, align: 'center', color: GOLD, alpha: hook });
  text('今晚聚餐，你去不去？', 540, 300, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: ttl });
  text('嘴上说“去啊”，心里只想回家', 540, 376, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: ttl * .85 });
  // 最后的字卡（画框下面）
  const c1 = win(t, CARDS_AT, CARDS_AT + 4.0, .4, .4), c2 = sstep(CARDS_AT + 3.8, CARDS_AT + 4.3, t);
  typeText('聚餐两小时，', 540, 1530, { ...big, size: 60, weight: 900, color: CREAM }, prog(t, CARDS_AT, CARDS_AT + .8), c1);
  typeText('回家充一晚上的电。', 540, 1630, { ...big, size: 68, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, CARDS_AT + 1.0, CARDS_AT + 2.0), c1);
  typeText('评论区说说：', 540, 1530, { size: 44, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, CARDS_AT + 3.9, CARDS_AT + 4.4), c2);
  typeText('你是不是也这样？', 540, 1620, { size: 60, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, CARDS_AT + 4.3, CARDS_AT + 5.3), c2);
}
function SAMPLES(T) { return SHOTS.some((sh, i) => i && Math.abs(T - sh.t0) < XF / 2 + .05) ? 4 : 2; }
function BLOOM_K(T) { return .22; }
function OVER(T) {}
function MASTER(T) { return 1; }
function INIT() {
  const sec = n => S[n];
  SHOTS = [
    { name: 'office', img: 'office', t0: 0, t1: sec('火锅店'), a: [0, 700, 1333], b: [40, 720, 1280] },
    { name: 'hotpot', img: 'hotpot', t0: sec('火锅店'), t1: sec('回家路上'), a: [0, 0, 1440], b: [30, 26, 1380] },
    { name: 'nightstreet', img: 'nightstreet', t0: sec('回家路上'), t1: sec('到家'), a: [40, 40, 1360], b: [70, 60, 1300] },
    { name: 'livingroom', img: 'livingroom', t0: sec('到家'), t1: TOTAL + 1, a: [130, 760, 1400], b: [170, 785, 1350] },
  ];
}

// ======================================================================== 音效提示表
function CUES() {
  const c = [], S1 = S['火锅店'], S2 = S['回家路上'], S3 = S['到家'];
  // ① 公司：空调和电脑的底噪；一阵阵敲键盘；老哥过来
  c.push([0, 'room', { dur: S1 + .4, gain: 1.8, fi: .05, fo: .6 }]);
  for (const [t0, n] of [[.2, 14], [8.8, 10], [22.8, 8]]) for (let i = 0; i < n; i++) c.push([t0 + i * .16 + (i % 3) * .04, 'click', { gain: .02 }]);
  c.push([D(1) - 1.0, 'swish', { dur: .6, gain: .03 }]);
  // ② 火锅店：一桌人在聊（被点名时一下子停住，蛐蛐叫，然后又热闹起来）；碰杯；一串“对”；拍照
  c.push([S1 - .3, 'chatter', { dur: D(18) - S1 + .3, gain: 2.9, fi: .5, fo: .05 }]);          // 聊天要够吵，后面突然安静才有反差
  c.push([D(18) + .05, 'stop', { gain: .05 }], [DE(20) + .1, 'cricket', { dur: D(21) - DE(20) + .2, gain: .8 }]);
  c.push([D(21) - .2, 'chatter', { dur: S2 - D(21) + .7, gain: 2.5, fi: .6, fo: .8 }]);
  c.push([D(13) + .7, 'clink', { gain: .9 }]);
  YES.forEach(([, dt], j) => c.push([DE(16) + .1 + dt, 'pop', { f: 650 + j * 40, pan: j % 2 ? .3 : -.3, gain: .7 }]));
  c.push([FLASH() - .02, 'shutter', { gain: 1.2 }]);
  // ③ 回家路上：夜里的街；没电的提示音
  c.push([S2 - .3, 'night', { dur: S3 - S2 + .6, gain: 1.4, fi: .6, fo: .5 }], [D(31) + .5, 'lowbat', { gain: .8 }]);
  // ④ 到家：关门；往沙发上一倒；手机“叮”；充电
  c.push([S3 + .05, 'door', { gain: .7 }], [D(32) + .35, 'flop', { gain: .55 }], [D(33) - .25, 'ding', { gain: .5, pan: .4 }]);
  c.push([D(37) - .1, 'bar', { f0: 400, f1: 900, dur: 2.4, gain: .04 }], [D(37) + 2.6, 'tink', { f: 1568, gain: .05 }]);
  c.push([CARDS_AT, 'shimmer', { f: [698.5, 880, 1046.5, 1396.9], gain: .07 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
