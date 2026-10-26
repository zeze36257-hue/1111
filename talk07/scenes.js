// ======================================================================== No.50 高敏感人群：不是你太敏感，是你感受得更多（Wojak 版）
// 和 talk06 同一个故事、同一套台词和配音，只是角色从黑猫换成了 Wojak（频道主给的形象，在 ../characters/）：
//   小黑 = 主人公（戴猫耳帽、肩上趴着黑猫，characters/hero/expr/ 里 8 个表情，随台词换）；
//   老哥 = 同事-老哥（原来的阿橘）；学姐 = 女同事-行政；老板 = 领导-上司（这一版露脸了）。
// 画面：真实照片放在竖屏中间的画框里（y 470–1430），人物是半身像，站在照片前面、贴着画框底边；
// 对话框统一在画框上部；讲知识的小图示画在压暗的画框中下部，和对话框错开。封面钩子和标题在画框上面的黑边里。
// 没有片头（"intro": false），没有进度条（"progress": false）；片尾和水印保留。
// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 150.4;
const SECTIONS = [['早上', 0.0, 16.0], ['公司', 16.0, 32.0], ['晚上', 32.0, 41.6], ['是什么', 41.6, 89.6], ['怎么来的', 89.6, 112.0], ['怎么办', 112.0, 131.2], ['第二天', 131.2, 150.4]];
const LINES = [];                                                   // 没有旁白
const DIALOG = [
  [0.30, 8.08, '好吵……喇叭声、脚步声、有人在打电话，全挤进我脑子里了。', '黑', 'think'],
  [8.48, 10.15, '快点快点，绿灯了！', '橘', 'say'],
  [10.40, 12.58, '你不觉得……这里太吵了吗？', '黑', 'say'],
  [12.78, 14.22, '有吗？还好吧。', '橘', 'say'],
  [16.40, 17.90, '嗯……先这样吧。', '板', 'say'],
  [18.40, 21.96, '他刚才是不是叹气了？是不是我做得不好？', '黑', 'think'],
  [22.36, 24.32, '你怎么了？脸色这么差。', '橘', 'say'],
  [24.52, 27.54, '老板刚才那句话，语气好像不太对。', '黑', 'say'],
  [27.84, 30.34, '你想太多了吧。你就是太敏感了。', '橘', 'say'],
  [32.40, 35.37, '一整天的每一句话，都在脑子里重播。', '黑', 'think'],
  [35.97, 38.22, '我是不是……太脆弱了？', '黑', 'think'],
  [42.00, 43.22, '又在想白天的事？', '姐', 'say'],
  [43.47, 46.24, '嗯。大家都说我太敏感了。', '黑', 'say'],
  [46.59, 53.02, '敏感不是毛病。心理学家专门研究过像你这样的人，叫「高敏感人群」。', '姐', 'say'],
  [53.27, 54.01, '高敏感？', '黑', 'say'],
  [54.21, 58.50, '有研究估计，差不多每五个人里，就有一个是这样的。', '姐', 'say'],
  [58.85, 62.03, '你们的大脑，处理信息更深、更细。', '姐', 'say'],
  [62.23, 67.87, '别人没注意的声音、光线、一个小眼神，你都接收到了，还会反复琢磨。', '姐', 'say'],
  [68.17, 71.37, '所以我在人多的地方，特别容易累？', '黑', 'say'],
  [71.57, 76.25, '对。信息一多，就像一下子塞满了，很容易过载。', '姐', 'say'],
  [76.60, 84.85, '有个脑成像研究发现：高敏感的人看到别人开心或难过的表情，跟共情有关的脑区更活跃。', '姐', 'say'],
  [85.15, 87.94, '难怪别人一皱眉，我就跟着难受。', '黑', 'say'],
  [90.00, 92.44, '那这是怎么来的？我能改掉吗？', '黑', 'say'],
  [92.69, 98.37, '一项双胞胎研究发现，敏感程度的差别，差不多一半和基因有关。', '姐', 'say'],
  [98.62, 102.75, '它更像一种天生的特质。不是病，也不是矫情。', '姐', 'say'],
  [103.10, 110.75, '而且研究发现，高敏感的人在糟糕的环境里更容易受伤，可在好的环境里，收获也比别人多。', '姐', 'say'],
  [112.40, 113.47, '那我该怎么办？', '黑', 'say'],
  [113.72, 118.44, '累了，就找个安静的地方待一会儿。这不是逃避，是在充电。', '姐', 'say'],
  [118.74, 122.60, '人多的安排之间，提前给自己留点恢复的时间。', '姐', 'say'],
  [122.90, 127.08, '有人说你太敏感，你可以告诉他：我只是感受得比较多。', '姐', 'say'],
  [131.60, 134.03, '一大早，一个人跑公园来干嘛？', '橘', 'say'],
  [134.28, 134.85, '充个电。', '黑', 'say'],
  [135.35, 140.29, '我想明白了。我不是太脆弱，我只是……感受得比较多。', '黑', 'say'],
];
const CARDS_AT = 141.09;                                          // 最后的字卡从这里开始
// 第 i 句台词开始的时间：D(i)；结束：DE(i)
const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];
const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));
// ======================================================================== 时间轴结束
const V_LT = '#a9c4e8';
const GOLD = '#ffd2a0', TEALC = '#7fe3d3', RED = '#e5484d';

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

// ======================================================================== 照片和人物
const FR = { x: 0, y: 470, w: 1080, h: 960 }, ASP = FR.w / FR.h, FB = FR.y + FR.h;   // FB：画框底边，半身像贴着它
const PHOTO_FILES = ['street', 'office', 'bedroom_dark', 'livingroom', 'park_fog'];        // 一场戏一张图，中途不换背景（频道主要求）
const HERO_EXPR = ['calm', 'sad', 'cry', 'happy', 'shock', 'angry', 'meh', 'awkward'];
const CAST_FILES = ['同事-老哥', '女同事-行政', '领导-上司', '眼镜男', '同事-实习生', '女同事-运营'];
const PH = {}, IMG = {};
const load = (src) => { const im = new Image(); im.src = src; return im; };
for (const n of PHOTO_FILES) PH[n] = load(`photos/${n}.jpg`);
for (const e of HERO_EXPR) IMG['hero_' + e] = load(`../characters/hero/expr/${e}.png`);
for (const n of CAST_FILES) IMG[n] = load(`../characters/cast/${n}.png`);
function ASSETS_READY() { return [...Object.values(PH), ...Object.values(IMG)].every(im => im.complete && im.naturalWidth > 0); }

// 主人公的图（1002×2992，原图的 2 倍）：脸的中心在 (640, 319)，帽子耳朵尖在 y ≈ 10
const HERO = { fx: 640, fy: 319, top: 10, s: .652 };
// 其他人：图是平底的半身像。w：画多宽；fx：脸在图里的横向位置（比例）；top：头顶在图里的纵向位置（比例）；
// face：原图里脸朝哪边（1 = 朝右）。两个人说话要面对面：站在画面右边、脸又朝右的，左右翻过来（主人公朝右，站在左边）。
const CAST = {
  黑: { name: '小黑' },
  橘: { name: '老哥', img: '同事-老哥', w: 560, fx: .55, top: .03, face: 1 },
  姐: { name: '学姐', img: '女同事-行政', w: 420, fx: .55, top: .02, face: 1 },
  板: { name: '老板', img: '领导-上司', w: 580, fx: .45, top: .02, face: 1 },
};
// 主人公每一句台词时的表情（第 i 句开始时换；别人说话时是他听的反应）
const HX = ['sad', 'calm', 'sad', 'meh', 'awkward', 'sad', 'sad', 'sad', 'meh', 'sad', 'cry',
            'sad', 'sad', 'calm', 'shock', 'calm', 'calm', 'calm', 'calm', 'calm', 'calm', 'sad',
            'calm', 'calm', 'happy', 'calm', 'calm', 'calm', 'calm', 'happy', 'calm', 'happy', 'happy'];
function heroExpr(t) {                                                              // [现在的表情, 上一个表情, 切换进度]
  let i = -1; for (let k = 0; k < DIALOG.length; k++) if (t >= D(k) - .05) i = k;
  if (t >= CARDS_AT - .6) return ['happy', HX[DIALOG.length - 1], 1];
  if (i < 0) return ['sad', 'sad', 1];
  return [HX[i], i ? HX[i - 1] : 'sad', sstep(D(i) - .05, D(i) + .1, t)];
}
const speaking = (who, t) => DIALOG.some(([a, b, , w]) => w === who && t >= a && t <= b);
const anyoneSpeaking = t => DIALOG.some(([a, b]) => t >= a && t <= b);
// 画一个人（屏幕坐标）。m：{ who, cx 脸的横向位置, dy 往下挪, a 透明度, sc 缩放 }；返回头顶的位置（对话框的尾巴指向这里）
function person(m, t) {
  const c = CAST[m.who], a = m.a ?? 1; if (a <= 0) return null;
  const talk = speaking(m.who, t), bob = talk ? -7 * Math.abs(Math.sin(t * 7.5)) : 1.5 * Math.sin(t * 1.6 + m.cx * .01);
  const dimmed = !talk && anyoneSpeaking(t);                                        // 别人说话时，听的人稍微暗一点
  ctx.save(); ctx.globalAlpha *= a; if (dimmed || m.filter) ctx.filter = m.filter || 'brightness(.86)';
  let head;
  if (m.who === '黑') {
    const s = HERO.s * (m.sc || 1), top = (m.top ?? 760) + (m.dy || 0) + bob, x = m.cx - HERO.fx * s, y = top - HERO.top * s;
    const [e, prev, k] = m.expr ? [m.expr, m.expr, 1] : heroExpr(t);
    if (k < 1) ctx.drawImage(IMG['hero_' + prev], x, y, 1002 * s, 2992 * s);
    ctx.globalAlpha *= k < 1 ? k : 1; ctx.drawImage(IMG['hero_' + e], x, y, 1002 * s, 2992 * s);
    head = [m.cx, top, m.cx, y + HERO.fy * s];
  } else {
    const im = IMG[c.img], w = c.w * (m.sc || 1), h = w * im.naturalHeight / im.naturalWidth;
    const flip = (m.cx > W / 2) === (c.face > 0), fx = flip ? 1 - c.fx : c.fx;            // 朝向画面中间
    const x = m.cx - fx * w, y = FB - h + 6 + (m.dy || 0) + bob;
    if (flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(im, 0, 0, w, h); } else ctx.drawImage(im, x, y, w, h);
    head = [m.cx, y + c.top * h, m.cx, y + (c.top + .2) * h];
  }
  ctx.restore();
  return { who: m.who, top: [head[0], head[1]], face: [head[2], head[3]] };
}
// 小一号的半身像（讲知识时用）：底边中点在 (x, y)，高 h
function bust(key, x, y, h, a, filter) {
  if (a <= 0) return;
  const im = IMG[key]; if (!im.naturalWidth) return;
  const hero = key.startsWith('hero_'), sw = im.naturalWidth, sh = hero ? 1143 : im.naturalHeight, w = h * sw / sh;
  ctx.save(); ctx.globalAlpha *= a; if (filter) ctx.filter = filter;
  ctx.drawImage(im, 0, 0, sw, sh, x - w / 2, y - h, w, h); ctx.restore();
}

// ---------------------------------------------------------------- 镜头：每个镜头一张照片，裁切框 [x, y, w]（照片像素）随时间推拉
const XF = .7;                                                                   // 镜头之间的交叉淡化
let SHOTS = [];
function cropAt(sh, t) {
  const k = sh.keys ? null : E.io(prog(t, sh.t0, sh.t1));
  let [x, y, w] = sh.keys ? sh.keys.map(tr => tr(t)) : sh.a.map((v, i) => lerp(v, sh.b[i], k));
  const im = PH[sh.img], W0 = im.naturalWidth || 2000, H0 = im.naturalHeight || 2000;
  w = Math.min(w, W0, H0 * ASP); const h = w / ASP;
  x = clamp(x, 0, W0 - w); y = clamp(y, 0, H0 - h);
  return { x, y, w, h, k: FR.w / w };
}

// ---------------------------------------------------------------- 对话框：统一在画框上部，尾巴指向说话的人
function wrapText(s, size, maxW) {
  font(size, 900, SANS); const out = []; let cur = '';
  for (const ch of s) { if (ctx.measureText(cur + ch).width > maxW && cur && !'，。？！、…」：；'.includes(ch)) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
// kind：say 白色椭圆；think 淡蓝的“想”泡泡（尾巴是三个小圆点）；ax, ay：说话的人的头顶（屏幕坐标）；name：画面外说话的人
function bubble(str, kind, ax, ay, a, o = {}) {
  if (a <= 0) return;
  const size = 34, lh = 46, lines = wrapText(str.replace(/[「」]/g, ''), size, 640);
  font(size, 900, SANS); const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
  const w = tw + 110, h = lines.length * lh + 58;
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
  } else if (!o.noTail) {                                                        // 尖尾巴指向说话的人
    const ex = ux * (w / 2) * .5, ey = uy * (h / 2) * .85, tip = Math.min(L0 - h / 2, 80);
    ctx.beginPath(); ctx.moveTo(ex - uy * 18, ey + ux * 18); ctx.lineTo(ex + ux * tip, ey + uy * tip); ctx.lineTo(ex + uy * 18, ey - ux * 18); ctx.closePath(); ctx.fill();
  }
  lines.forEach((l, i) => text(l, 0, (i - (lines.length - 1) / 2) * lh + 2, { font: SANS, size, weight: 900, align: 'center', color: '#1d1e24' }));
  if (o.name) { pill(o.name, -w / 2 + 70, -h / 2 - 6, 1, { size: 22, color: '#1d1e24', fill: 'rgba(236,230,218,.95)', stroke: 'rgba(0,0,0,0)' }); }
  ctx.restore();
}

// ---------------------------------------------------------------- 每个镜头里的人（屏幕坐标：cx 是脸的横向位置）
const slide = (t, t0, t1, from, to, e = E.out) => lerp(from, to, e(prog(t, t0, t1)));
function castIn(sh, t) {
  switch (sh.name) {
    case 'street': {
      const jx = Math.sin(t * 31) * 3 * win(t, D(0) + .5, D(1), .3, .4);              // 太吵：主人公微微发颤
      return [{ who: '橘', cx: 840 }, { who: '黑', cx: 320 + jx }];
    }
    case 'office': {                                                               // 老板说完一句就走；老哥过来问
      const boss = slide(t, D(4) - .9, D(4) - .2, 1500, 840) + slide(t, DE(4) + .9, DE(4) + 1.7, 0, 700, E.in);
      const bro = slide(t, D(6) - 1.0, D(6) - .2, 1500, 840);
      return [{ who: '板', cx: boss }, { who: '橘', cx: bro }, { who: '黑', cx: 320 }];
    }
    case 'bedroom_dark': return [{ who: '黑', cx: 540, top: 790 }];
    case 'livingroom': {
      const jin = sh.enter ? slide(t, sh.t0 + .2, sh.t0 + 1.6, 1500, 830) : 830;      // 学姐从右边走进来
      return [{ who: '姐', cx: jin }, { who: '黑', cx: 320 }];
    }
    case 'park_fog': {                                                             // 一个人坐着；老哥从右边过来，主人公往左让一点
      const me = slide(t, D(30) - .9, D(30) + .1, 540, 320, E.io), bro = slide(t, D(30) - .9, D(30) - .1, 1500, 840);
      return [{ who: '橘', cx: bro }, { who: '黑', cx: me }];
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
  if (sh.dim) { ctx.fillStyle = `rgba(0,0,0,${sh.dim(t)})`; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); }
  const g = ctx.createLinearGradient(0, FR.y + FR.h * .45, 0, FB); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');   // 底部压暗一点，人物站得稳
  ctx.fillStyle = g; ctx.fillRect(FR.x, FR.y, FR.w, FR.h);
  const hide = sh.name === 'livingroom' ? 1 - win(t, D(25) + 2.0, D(26) + .2, .4, .4) : 1;     // 讲“糟糕 / 好的环境”时，人先藏起来
  const out = [];
  for (const m of castIn(sh, t)) { const r = person({ ...m, a: hide }, t); if (r && m.cx > -300 && m.cx < W + 300) out.push(r); }
  ctx.restore();
  return { c, cast: out };
}

// ---------------------------------------------------------------- 画框里的小图示（讲知识时）
function glyphSound(x, y, a) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x - 18, y, 10 + i * 10, -PI / 4, PI / 4); ctx.stroke(); } ctx.restore(); }
function glyphLight(x, y, a) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = GOLD; ctx.fillStyle = GOLD; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.fill();
  for (let i = 0; i < 8; i++) { const th = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(x + Math.cos(th) * 17, y + Math.sin(th) * 17); ctx.lineTo(x + Math.cos(th) * 26, y + Math.sin(th) * 26); ctx.stroke(); } ctx.restore(); }
function glyphEye(x, y, a) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = TEALC; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 26, y); ctx.quadraticCurveTo(x, y - 22, x + 26, y); ctx.quadraticCurveTo(x, y + 22, x - 26, y); ctx.stroke();
  ctx.fillStyle = TEALC; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.restore(); }
function dimFrame(a, k = .8) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(6,7,10,${k})`; ctx.fillRect(FR.x, FR.y, FR.w, FR.h); ctx.restore(); }   // k：压多暗（小图示后面不要再看得见人）
function overlays(t, info) {
  const me = info && info.cast.find(m => m.who === '黑');
  // 高敏感人群（学姐说出这个词）
  const hs = win(t, D(13) + 3.6, D(14) + .9, .3, .4);
  if (hs > 0) { dimFrame(.65 * hs); const k = E.outExpo(prog(t, D(13) + 3.6, D(13) + 4.6));
    ctx.save(); ctx.translate(540, 1010); ctx.scale(lerp(1.15, 1, k), lerp(1.15, 1, k));
    text('高敏感人群', 0, 0, { font: SERIF, size: 104, weight: 900, align: 'center', color: GOLD, alpha: hs, glow: `rgba(${O_RGB},.55)`, blur: 30 });
    text('Highly Sensitive Person', 0, 88, { font: LAT, style: 'italic', weight: 500, size: 40, align: 'center', color: CREAM, alpha: hs }); ctx.restore(); }
  // 每五个人里就有一个：五个人，主人公亮起来
  const fv = win(t, D(15) + 1.4, D(16) + .3, .3, .4);
  if (fv > 0) { dimFrame(fv, .94); const lit = sstep(D(15) + 2.6, D(15) + 2.9, t);
    ['同事-老哥', '女同事-运营', 'hero_calm', '同事-实习生', '女同事-行政'].forEach((k, i) => { const x = 140 + i * 200, me5 = i === 2;
      if (me5) glow(x, 1040, 70 + 20 * lit, '255,190,120', fv * lit * .8, 5);
      bust(k, x, 1200, me5 ? lerp(300, 350, lit) : 300, fv, me5 ? `brightness(${lerp(.5, 1.05, lit)})` : 'brightness(.42) saturate(.3)'); });
    text('≈ 1 / 5', 540, 1320, { font: SERIF, size: 84, weight: 900, align: 'center', color: GOLD, alpha: fv * lit, glow: `rgba(${O_RGB},.5)`, blur: 22 }); }
  // 声音、光线、一个小眼神 → 都进了他的脑子；反复琢磨
  if (me) {
    const [hx, hy] = me.face, items = [[D(17) + 1.0, '声音', glyphSound, -190, -150], [D(17) + 1.9, '光线', glyphLight, 30, -230], [D(17) + 2.9, '眼神', glyphEye, 250, -130]];
    for (const [t0, s, g, dx, dy] of items) {
      const ap = sstep(t0, t0 + .3, t) * (1 - sstep(D(18) - .2, D(18) + .2, t)), fly = E.in(prog(t, D(17) + 4.4, D(17) + 5.4));
      if (ap <= 0) continue;
      const x = lerp(clamp(hx + dx, 90, 990), hx, fly), y = lerp(hy + dy, hy, fly);
      ctx.save(); ctx.globalAlpha = ap * (1 - fly * .8); ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.beginPath(); ctx.roundRect(x - 64, y - 52, 128, 104, 22); ctx.fill(); ctx.restore();
      g(x, y - 12, ap * (1 - fly * .8)); text(s, x, y + 30, { font: SANS, size: 26, weight: 900, align: 'center', color: CREAM, alpha: ap * (1 - fly * .8) });
    }
    const loop = win(t, D(17) + 5.0, D(18) + .2, .3, .3);
    if (loop > 0) { const lx = hx + 250, ly = hy - 30; ctx.save(); ctx.globalAlpha = loop; ctx.fillStyle = 'rgba(14,16,22,.8)'; ctx.beginPath(); ctx.roundRect(lx - 100, ly - 130, 200, 200, 30); ctx.fill();
      ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.lineCap = 'round'; const r = 46, a0 = t * 4;
      ctx.beginPath(); ctx.arc(lx, ly, r, a0, a0 + PI * 1.5); ctx.stroke(); const ex = lx + Math.cos(a0 + PI * 1.5) * r, ey = ly + Math.sin(a0 + PI * 1.5) * r;
      ctx.beginPath(); ctx.arc(ex, ey, 7, 0, TAU); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore();
      text('反复琢磨', lx, ly - 90, { font: SANS, size: 30, weight: 900, align: 'center', color: GOLD, alpha: loop }); }
    // 过载：一根竖条越涨越满
    const ov = win(t, D(19) + .6, D(20) + .2, .3, .4);
    if (ov > 0) { const fill = E.io(prog(t, D(19) + .8, D(19) + 3.4)), bx = hx + 250, by = hy + 120, bh = 280;
      ctx.save(); ctx.globalAlpha = ov; ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.strokeStyle = CREAM; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(bx - 26, by - bh, 52, bh, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = fill > .8 ? RED : mixc('#7fe3d3', '#ffb36b', fill / .8); ctx.beginPath(); ctx.roundRect(bx - 19, by - 7 - (bh - 14) * fill, 38, (bh - 14) * fill, 8); ctx.fill(); ctx.restore();
      text('过载', bx, by - bh - 34, { font: SANS, size: 36, weight: 900, align: 'center', color: fill > .8 ? '#ff8f8f' : CREAM, alpha: ov * sstep(.7, .85, fill), glow: 'rgba(0,0,0,.9)', blur: 12 }); }
  }
  // 脑成像：跟共情有关的脑区更活跃
  const br = win(t, D(20) + 2.6, D(21) + .3, .3, .4);
  if (br > 0) { dimFrame(br, .86); const cx = 540, cy = 960, p = .5 + .5 * Math.sin(t * 6);
    ctx.save(); ctx.globalAlpha = br; ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.strokeStyle = 'rgba(236,230,218,.8)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(cx, cy, 150, 105, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 100); ctx.bezierCurveTo(cx - 18, cy - 36, cx + 18, cy + 25, cx, cy + 100); ctx.stroke(); ctx.restore();
    for (const [dx, dy] of [[-65, 12], [60, -8], [-25, -48], [35, 50]]) glow(cx + dx, cy + dy, 11 + 5 * p, '255,150,120', br, 7);
    text('共情相关的脑区：更活跃', cx, cy + 160, { font: SANS, size: 36, weight: 900, align: 'center', color: '#ffb59a', alpha: br }); }
  // 双胞胎：差不多一半和基因有关
  const tw = win(t, D(23) + 1.0, D(24) + .3, .3, .4);
  if (tw > 0) { dimFrame(tw, .94);
    text('双胞胎研究', 540, 770, { font: SANS, size: 36, weight: 700, align: 'center', color: DIM, alpha: tw });
    bust('眼镜男', 410, 1090, 300, tw); bust('眼镜男', 670, 1090, 300, tw);
    const g = E.io(prog(t, D(23) + 2.6, D(23) + 4.2)), y0 = 1120, x0 = 180, x1 = 900;
    ctx.save(); ctx.globalAlpha = tw; ctx.fillStyle = 'rgba(236,230,218,.18)'; ctx.fillRect(x0, y0, x1 - x0, 34);
    ctx.fillStyle = GOLD; ctx.fillRect(x0, y0, (x1 - x0) * .47 * g, 34); ctx.restore();
    text('基因 ≈ 47%', x0, y0 + 76, { font: SANS, size: 38, weight: 900, color: GOLD, alpha: tw * sstep(.6, 1, g) });
    text('环境 ≈ 53%', x1, y0 + 76, { font: SANS, size: 38, weight: 900, align: 'right', color: CREAM, alpha: tw * sstep(.6, 1, g) }); }
  // 不是病，也不是矫情：是天生的特质
  const tr = win(t, D(24) + .6, D(25) + .2, .3, .4);
  if (tr > 0) { dimFrame(tr, .92);
    [['病', D(24) + 2.0, 360, 920], ['矫情', D(24) + 2.8, 720, 920]].forEach(([s, t0, x, y]) => { const k = sstep(t0, t0 + .25, t) * tr; pill(s, x, y, k, { size: 44, color: CREAM });
      if (t > t0 + .2) seg(x - 90, y, x - 90 + 180 * E.out(prog(t, t0 + .2, t0 + .45)), y, RED, 7, tr); });
    pill('天生的特质', 540, 1110, tr * sstep(D(24) + .6, D(24) + 1.0, t), { size: 52, color: '#1a1208', fill: 'rgba(255,210,150,.95)', stroke: 'rgba(0,0,0,0)', glow: `rgba(${O_RGB},.6)` }); }
  // 糟糕的环境 / 好的环境：同一个主人公，左边难过，右边开心
  const ev = win(t, D(25) + 2.0, D(26) + .2, .4, .4);
  if (ev > 0) {
    dimFrame(.75 * ev); ctx.save(); ctx.globalAlpha = ev; ctx.fillStyle = 'rgba(10,12,18,.72)'; ctx.fillRect(FR.x, FR.y, FR.w / 2, FR.h);
    const g2 = ctx.createLinearGradient(540, 0, 1080, 0); g2.addColorStop(0, 'rgba(255,200,120,.18)'); g2.addColorStop(1, 'rgba(255,220,150,.36)'); ctx.fillStyle = g2; ctx.fillRect(540, FR.y, 540, FR.h); ctx.restore();
    seg(540, FR.y + 260, 540, FR.y + FR.h - 40, 'rgba(236,230,218,.4)', 2, ev);
    const bad = sstep(D(25) + 2.4, D(25) + 2.8, t) * ev, good = sstep(D(25) + 5.0, D(25) + 5.4, t) * ev;
    ctx.save(); ctx.beginPath(); ctx.rect(FR.x, FR.y, FR.w, FR.h); ctx.clip();
    bust('hero_sad', 270, FB, 470, bad, 'brightness(.62) saturate(.3)');
    for (let i = 0; i < 46; i++) { const r = mulberry(70 + i), x = 20 + r() * 500, y = FR.y + ((t * (300 + 200 * r()) + r() * FR.h) % FR.h);
      seg(x, y, x - 4, y + 18, 'rgba(180,200,230,.55)', 1.5, bad); }
    warmth(.8 * good, 810, 1150, 420); bust('hero_happy', 810, FB, 470, good);
    ctx.restore();
    text('糟糕的环境', 270, 790, { font: SANS, size: 42, weight: 900, align: 'center', color: V_LT, alpha: bad, glow: 'rgba(0,0,0,.9)', blur: 12 }); text('更容易受伤', 270, 846, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: bad, glow: 'rgba(0,0,0,.9)', blur: 12 });
    text('好的环境', 810, 790, { font: SANS, size: 42, weight: 900, align: 'center', color: GOLD, alpha: good, glow: 'rgba(0,0,0,.9)', blur: 12 }); text('收获也更多', 810, 846, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: good, glow: 'rgba(0,0,0,.9)', blur: 12 });
  }
  // 安静的角落：充电
  if (me) {
    const bt = win(t, D(27) + 3.0, D(28) + .3, .3, .4);
    if (bt > 0) { const [hx, hy] = me.face, fill = E.io(prog(t, D(27) + 3.2, D(27) + 5.0)), bx = hx + 230, by = hy - 150;
      ctx.save(); ctx.globalAlpha = bt; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.fillStyle = 'rgba(14,16,22,.85)'; ctx.beginPath(); ctx.roundRect(bx - 75, by - 36, 150, 72, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = CREAM; ctx.fillRect(bx + 77, by - 13, 10, 26); ctx.fillStyle = '#7fe3a0'; ctx.fillRect(bx - 67, by - 28, 134 * (.2 + .8 * fill), 56); ctx.restore();
      text('充电中', bx, by - 70, { font: SANS, size: 32, weight: 900, align: 'center', color: '#a9f0c0', alpha: bt, glow: 'rgba(0,0,0,.9)', blur: 12 }); }
  }
  // 人多的安排之间，留出恢复的时间
  const cal = win(t, D(28) + .4, D(29) - .4, .3, .3);
  if (cal > 0) { dimFrame(.6 * cal);
    [['上班', 0, 0], ['休息', 1, 1], ['聚餐', 2, 0], ['休息', 3, 1], ['见朋友', 4, 0]].forEach(([s, i, rest]) => {
      const k = sstep(D(28) + .5 + i * .35, D(28) + .8 + i * .35, t) * cal, x = 150 + i * 195;
      pill(s, x, 1300, k, rest ? { size: 34, color: '#0e2a1b', fill: 'rgba(127,227,160,.95)', stroke: 'rgba(0,0,0,0)', glow: 'rgba(127,227,160,.6)' } : { size: 34, color: CREAM }); }); }
}

// ======================================================================== 世界层
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  let info = null;
  SHOTS.forEach((sh, i) => {
    if (t < sh.t0 - XF / 2 || t > sh.t1 + XF / 2) return;
    const a = i === 0 ? 1 : sstep(sh.t0 - XF / 2, sh.t0 + XF / 2, t);
    const r = drawShot(sh, t, a); if (r && a > .5) info = r;
  });
  ctx.save(); ctx.strokeStyle = 'rgba(236,230,218,.12)'; ctx.lineWidth = 2; ctx.strokeRect(FR.x - 1, FR.y - 1, FR.w + 2, FR.h + 2); ctx.restore();
  // 太吵：街上的声音挤进来（画框中下部，压在人身上）
  [['嘀——！', D(0) + 2.0, 250, 860], ['喂？你听得到吗？', D(0) + 2.5, 780, 820], ['让一让！', D(0) + 3.0, 260, 1060], ['嘟嘟嘟嘟', D(0) + 3.5, 820, 1080], ['叮咚', D(0) + 4.0, 540, 1200], ['到底什么时候到？', D(0) + 4.5, 620, 960]].forEach(([s, t0, x, y], i) => {
    const k = sstep(t0, t0 + .2, t) * (1 - sstep(D(1) + .2, D(1) + .7, t)); if (k <= 0) return;
    const j = Math.sin(t * 40 + i) * 3;
    text(s, x + j, y, { font: SANS, size: 42 + (i % 3) * 6, weight: 900, align: 'center', color: i % 2 ? '#ffd2a0' : '#ffffff', alpha: k * (.8 + .2 * Math.sin(t * 9 + i)), glow: 'rgba(0,0,0,.95)', blur: 16 });
  });
  overlays(t, info);
  // 晚上：白天的话在脑子里重播（主人公两边）
  [['你就是太敏感了。', D(9) + .3, 210, 830], ['嗯……先这样吧。', D(9) + 1.1, 880, 900], ['有吗？还好吧。', D(9) + 1.9, 200, 1080], ['脸色这么差。', D(9) + 2.6, 890, 1150]].forEach(([s, t0, x, y], i) => {
    const k = sstep(t0, t0 + .6, t) * (1 - sstep(S['是什么'] - 1.0, S['是什么'] - .2, t)); if (k <= 0) return;
    text(s, x + Math.sin(t * .7 + i) * 16, y - (t - t0) * 6, { font: SANS, size: 36, weight: 700, align: 'center', color: 'rgba(236,230,218,.95)', alpha: k * (.45 + .25 * Math.sin(t * 1.3 + i * 2)), filter: 'blur(1px)', glow: 'rgba(0,0,0,.9)', blur: 10 });
  });
  // 对话框：每一句在它说的时候出现，说完淡出
  DIALOG.forEach(([a, b, s, who, kind], i) => {
    const next = DIALOG[i + 1] ? DIALOG[i + 1][0] : TOTAL, fe = Math.max(b + .25, Math.min(b + .7, next - .05));
    if (t < a - .1 || t > fe + .05) return;
    const k = sstep(a - .1, a + .15, t) * (1 - sstep(fe - .25, fe, t));
    const m = info && info.cast.find(c => c.who === who);
    if (m) bubble(s, kind, m.top[0], m.top[1], k);
    else bubble(s, kind, 860, FR.y + 400, k, { name: CAST[who].name, noTail: true });
  });
  // 画框上面的黑边：第一帧是封面钩子；之后换成标题
  const hook = 1 - sstep(S['公司'] - .8, S['公司'] - .1, t), ttl = sstep(S['公司'] - .3, S['公司'] + .5, t);
  text('人一多就累，', 540, 268, { size: 78, weight: 900, align: 'center', color: CREAM, alpha: hook });
  text('一句话能想一整天', 540, 378, { size: 78, weight: 900, align: 'center', color: GOLD, alpha: hook });
  text('高敏感人群', 540, 300, { font: SERIF, size: 60, weight: 900, align: 'center', color: GOLD, alpha: ttl });
  text('不是你太敏感，是你感受得更多', 540, 376, { font: SANS, size: 34, weight: 700, align: 'center', color: CREAM, alpha: ttl * .85 });
  // 最后的字卡（画框下面）
  const c1 = win(t, CARDS_AT, CARDS_AT + 4.0, .4, .4), c2 = sstep(CARDS_AT + 3.8, CARDS_AT + 4.3, t);
  typeText('不是你太敏感，', 540, 1530, { ...big, size: 60, weight: 900, color: CREAM }, prog(t, CARDS_AT, CARDS_AT + .8), c1);
  typeText('是你感受得更多。', 540, 1630, { ...big, size: 72, weight: 900, color: GOLD, glow: `rgba(${O_RGB},.5)`, glowBlur: 26 }, prog(t, CARDS_AT + 1.0, CARDS_AT + 2.0), c1);
  typeText('评论区说说：', 540, 1530, { size: 44, weight: 700, font: SERIF, align: 'center', color: CREAM, spread: 4 }, prog(t, CARDS_AT + 3.9, CARDS_AT + 4.4), c2);
  typeText('你是高敏感的人吗？', 540, 1620, { size: 60, weight: 900, font: SERIF, align: 'center', color: GOLD, spread: 5, glow: `rgba(${O_RGB},.4)`, glowBlur: 16 }, prog(t, CARDS_AT + 4.3, CARDS_AT + 5.3), c2);
}
function SAMPLES(T) { return SHOTS.some((sh, i) => i && Math.abs(T - sh.t0) < XF / 2 + .05) ? 4 : 2; }
function BLOOM_K(T) { return .25; }
function OVER(T) {
  stamp('1997', 'Aron & Aron', D(13) + 3.6, D(16), T);
  stamp('2014', 'Acevedo 等', D(20), D(21) + .3, T);
  stamp('2021', 'Assary 等', D(23), D(24) + .3, T);
  stamp('2009', 'Belsky & Pluess', D(25), D(26) + .2, T);
}
function MASTER(T) { return 1; }
function INIT() {
  const sec = n => S[n];
  // 一场戏一张图：街上、公司、卧室、客厅（学姐整场对话）、公园（第二天到结尾）。取景基本不动，只有很慢的一点推近
  SHOTS = [
    { name: 'street', img: 'street', t0: 0, t1: sec('公司'), a: [100, 700, 1300], b: [140, 720, 1250] },
    { name: 'office', img: 'office', t0: sec('公司'), t1: sec('晚上'), a: [0, 700, 1333], b: [40, 720, 1280] },
    { name: 'bedroom_dark', img: 'bedroom_dark', t0: sec('晚上'), t1: sec('是什么'), a: [200, 760, 1100], b: [230, 780, 1060] },
    { name: 'livingroom', img: 'livingroom', enter: true, t0: sec('是什么'), t1: sec('第二天'), a: [130, 760, 1400], b: [180, 790, 1340] },
    { name: 'park_fog', img: 'park_fog', t0: sec('第二天'), t1: TOTAL + 1, a: [60, 560, 1250], b: [100, 590, 1200] },
  ];
}

// ======================================================================== 音效提示表
function CUES() {
  const c = [];
  // ① 街上：人声车声；绿灯“嘀嘀”；老哥催
  c.push([0, 'crowd', { dur: S['公司'] + .5, gain: .16, fi: .05, fo: .6 }]);
  for (const t0 of [D(0) + .5, D(0) + 2.6]) c.push([t0, 'honk', { gain: .07 }]);
  for (let i = 0; i < 6; i++) c.push([D(1) - .3 + i * .5, 'tick', { gain: .05 }]);
  // ② 公司：键盘声；老板那句之后的安静；心里一沉
  for (let i = 0; i < 10; i++) c.push([S['公司'] + .3 + i * .17 + (i % 3) * .05, 'click', { gain: .025 }]);
  c.push([D(5) + .2, 'air', { dur: 2.6, hum: 98, gain: .05 }]);
  // ③ 晚上：钟表滴答；白天的话在脑子里回响
  for (let i = 0; i < 12; i++) c.push([S['晚上'] + .2 + i * .8, 'tick', { gain: .03 }]);
  c.push([D(9) + .3, 'revcym', { dur: 2.0, gain: .05 }]);
  // ④–⑥ 学姐：进门；图示一个个亮起来
  c.push([S['是什么'] + .2, 'swish', { dur: .8, gain: .04 }]);
  c.push([D(13) + 3.6, 'shimmer', { f: [784, 988, 1175, 1568], gain: .08 }], [D(15) + 2.6, 'tink', { f: 1175, gain: .05 }]);
  for (const t0 of [D(17) + 1.0, D(17) + 1.9, D(17) + 2.9]) c.push([t0, 'tink', { f: 1318.5, gain: .04 }]);
  c.push([D(19) + .8, 'bar', { f0: 300, f1: 900, dur: 2.6, gain: .04 }], [D(20) + 2.6, 'swell', { dur: 1.6, f: [146.8, 220, 293.7, 370], gain: .05 }]);
  c.push([D(23) + 2.6, 'bar', { f0: 300, f1: 600, dur: 1.6, gain: .04 }], [D(24) + 2.2, 'swish', { dur: .3, gain: .05 }], [D(24) + 3.0, 'swish', { dur: .3, gain: .05 }]);
  c.push([D(25) + 2.4, 'rain', { dur: 3.0, gain: .06, muffle: 1, fi: .3, fo: .6 }], [D(25) + 5.0, 'shimmer', { f: [587.3, 740, 880, 1175], gain: .06 }]);
  c.push([D(27) + 3.2, 'bar', { f0: 400, f1: 800, dur: 1.8, gain: .035 }]);
  for (let i = 0; i < 5; i++) c.push([D(28) + .5 + i * .35, 'tick', { gain: .03 }]);
  // ⑦ 清晨的公园：鸟叫
  c.push([S['第二天'] - .3, 'birds', { dur: TOTAL - S['第二天'] + .3, gain: .1 }], [CARDS_AT, 'shimmer', { f: [587.3, 740, 880, 1175, 1480], gain: .1 }]);
  return c.sort((a, b) => a[0] - b[0]);
}
