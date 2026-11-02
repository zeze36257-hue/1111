// ======================================================================== 时间轴（layout.py 生成，别手改）
const TOTAL = 37.3;
const SECTIONS = [['漫剧', 0, TOTAL]];
const LINES = [];
const DIALOG = [
  [0.60, 2.94, '我死在了婚礼那天。', '她悲', 'say'],
  [3.74, 8.70, '推我下去的，是我爱了七年的人。', '她悲', 'say'],
  [9.90, 10.87, '再睁开眼——', '她惊', 'say'],
  [11.47, 14.21, '手机上的日期，是三年前。', '她惊', 'say'],
  [15.01, 17.75, '我……回来了？', '她怕', 'say'],
  [20.35, 23.46, '醒了吗？晚上见一面吧，我有话想跟你说。', '他', 'say'],
  [24.16, 29.17, '上辈子，就是今晚，他向我求了婚。', '她冷', 'say'],
  [29.97, 31.14, '这一次——', '她冷', 'say'],
];
const SUBS = [
  [0.60, 2.84, '我死在了婚礼那天。'],
  [3.74, 8.60, '推我下去的，是我爱了七年的人。'],
  [9.90, 10.77, '再睁开眼——'],
  [11.47, 14.11, '手机上的日期，是三年前。'],
  [15.01, 17.65, '我……回来了？'],
  [20.35, 23.36, '醒了吗？晚上见一面吧，我有话想跟你说。'],
  [24.16, 29.07, '上辈子，就是今晚，他向我求了婚。'],
  [29.97, 31.04, '这一次——'],
];
const SHOTS = [[0.00, 'bride'], [3.64, 'groom'], [9.80, 'eyes'], [11.37, 'lock'], [14.91, 'bed'], [18.55, 'call'], [20.25, 'ear'], [24.06, 'smile'], [32.24, 'title']];
// ======================================================================== 时间轴结束

// ======================================================================== 漫剧样片《这一次，我不嫁了》第 1 集开头
// 给频道主看“我做的 AI 漫剧能到什么效果”。整屏竖画面（不是读文案那种黑边框）。
// 画面：MiniMax 生成的韩漫风插画（img/）；手机锁屏、来电、片名是这里画的。
// 镜头：慢推、仰拍往上摇、心跳时画面一缩一放、雨、闪电、白光、黑场、睁眼、手机插入镜头、来电震动、推到脸上、片名砸出来。
const WHITE = '#ffffff', PHONE_BLUE = '#bfe2ff', RED = '#d6403a';
document.fonts.load('900 60px "Noto Sans SC"', '我死在了婚礼那天推下去的是爱七年人再睁开眼手机上日期三前回来醒吗晚见一面吧有话想跟你说辈子就今他向求婚这次');
document.fonts.load('900 150px "Noto Serif SC"', '这一次我不嫁了');
document.fonts.load('300 210px "Noto Sans SC"', '07:30');
document.fonts.load('500 44px "Noto Sans SC"', '2023年6月12日星期一顾言手机拒绝接听第集下预告订婚宴她当众撕了的面具关注看一');

const IMG = {};
for (const k of ['bride', 'groom', 'eyes', 'bed', 'ear', 'smile']) { const im = new Image(); im.src = 'img/' + k + '.jpg'; IMG[k] = im; }
function ASSETS_READY() { return Object.values(IMG).every(im => im.complete && im.naturalWidth > 0) && document.fonts.check('900 60px "Noto Sans SC"', '我'); }

const T0 = id => SHOTS.find(s => s[1] === id)[0];
const T1 = id => { const i = SHOTS.findIndex(s => s[1] === id); return SHOTS[i + 1] ? SHOTS[i + 1][0] : TOTAL; };
const shotAt = t => { let i = 0; for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k][0]) i = k; return SHOTS[i]; };
const SUB_OF = s => SUBS.find(r => r[2] === s);

// 整屏铺满画一张图：z 放大倍数，(fx, fy) 屏幕中心对着图里的哪一点，dx/dy 再挪一点
function cover(im, z = 1, fx = .5, fy = .5, dx = 0, dy = 0) {
  const iw = im.naturalWidth, ih = im.naturalHeight, s = Math.max(W / iw, H / ih) * z, w = iw * s, h = ih * s;
  const x = clamp(W / 2 - fx * w + dx, W - w, 0), y = clamp(H / 2 - fy * h + dy, H - h, 0);
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(im, x, y, w, h);
}
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// 雨：斜着落下的细线
function rain(t, a = 1, n = 180) {
  ctx.save(); ctx.strokeStyle = '#d6e8ff'; ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const r1 = hash2(i, 1), r2 = hash2(i, 2), r3 = hash2(i, 3), sp = 2100 + r3 * 900, len = 50 + r2 * 90;
    const y = ((r2 * (H + 300) + t * sp) % (H + 300)) - 150, x = r1 * (W + 400) - 200 - (y + 150) * .16;
    ctx.globalAlpha = (.12 + .28 * r3) * a; ctx.lineWidth = 1.2 + 1.6 * r3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len * .16, y - len); ctx.stroke();
  }
  ctx.restore();
}
function veil(color, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); }

// 心跳：画面一缩一放（开头两下“咚、咚”）
const BEATS = [.15, .55, 2.35, 2.75];
const beat = t => BEATS.reduce((s, b) => s + (t >= b ? Math.exp(-(t - b) / .12) : 0), 0);

// ======================================================================== 手机
const PH = { w: 760, h: 1540 };
function phone(t, draw, shake = 0) {
  ctx.save(); ctx.filter = 'blur(20px) brightness(.42)'; cover(IMG.bed, 1.2, .5, .5); ctx.restore();
  const k = E.out(clamp((t - shotAt(t)[0]) / .45)), px = (W - PH.w) / 2 + shake, py = (H - PH.h) / 2 - 30 + (1 - k) * 90;
  ctx.save(); ctx.globalAlpha = k;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 70; ctx.fillStyle = '#0a0a0c'; rr(px - 20, py - 20, PH.w + 40, PH.h + 40, 96); ctx.fill(); ctx.restore();
  ctx.save(); rr(px, py, PH.w, PH.h, 78); ctx.clip(); draw(px, py, PH.w, PH.h); ctx.restore();
  ctx.fillStyle = '#000'; rr(W / 2 - 100 + shake, py + 28, 200, 58, 29); ctx.fill();               // 灵动岛
  ctx.restore();
}
function wallpaper(x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x + w * .4, y + h); g.addColorStop(0, '#2a3350'); g.addColorStop(.55, '#4b3a5e'); g.addColorStop(1, '#141826');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.save(); ctx.globalAlpha = .25; ctx.filter = 'blur(30px)'; ctx.fillStyle = '#e6a6b8'; ctx.beginPath(); ctx.arc(x + w * .7, y + h * .3, 200, 0, TAU); ctx.fill(); ctx.restore();
}
function lockScreen(t, x, y, w, h) {
  wallpaper(x, y, w, h);
  const cx = x + w / 2, hl = sstep(SUB_OF('手机上的日期，是三年前。')[1] - .9, SUB_OF('手机上的日期，是三年前。')[1] - .45, t);   // 说到“三年前”时，年份变红
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  font(44, 500, SANS); ctx.fillStyle = 'rgba(255,255,255,.9)';
  const date = '2023年6月12日 星期一', yr = '2023年', wAll = ctx.measureText(date).width, wYr = ctx.measureText(yr).width;
  ctx.textAlign = 'left'; const dx = cx - wAll / 2, dy = y + 250;
  ctx.fillText(date, dx, dy);
  if (hl > 0) {
    ctx.save(); ctx.globalAlpha = hl; ctx.fillStyle = '#ff6b5e'; ctx.shadowColor = 'rgba(255,80,60,.9)'; ctx.shadowBlur = 24; ctx.fillText(yr, dx, dy); ctx.restore();
    ctx.save(); ctx.globalAlpha = hl; ctx.strokeStyle = '#ff6b5e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(dx, dy + 34); ctx.lineTo(dx + wYr * hl, dy + 34); ctx.stroke(); ctx.restore();
  }
  ctx.textAlign = 'center'; font(210, 300, SANS); ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillText('07:30', cx, y + 420);
  font(34, 500, SANS); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText('向上轻扫以解锁', cx, y + h - 90);
  ctx.restore();
}
function callScreen(t, x, y, w, h) {
  ctx.save(); ctx.filter = 'blur(26px) brightness(.55)'; ctx.drawImage(IMG.groom, x - 60, y - 60, w + 120, h + 120); ctx.restore();
  const cx = x + w / 2;
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(cx, y + 330, 92, 0, TAU); ctx.fill();
  font(84, 500, SANS); ctx.fillStyle = '#fff'; ctx.fillText('顾', cx, y + 330);
  font(78, 500, SANS); ctx.fillText('顾言', cx, y + 500);
  font(36, 500, SANS); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText('手机', cx, y + 570);
  const by = y + h - 260, pulse = 1 + .06 * Math.sin((t - shotAt(t)[0]) * 9);
  [[cx - 190, '#ff453a', '拒绝', 1], [cx + 190, '#30d158', '接听', pulse]].forEach(([bx, c, s, sc]) => {
    ctx.save(); ctx.translate(bx, by); ctx.scale(sc, sc); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 0, 76, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.rotate(s === '拒绝' ? 2.36 : 0);   // 听筒
    ctx.beginPath(); ctx.arc(0, 8, 30, PI * 1.15, PI * 1.85); ctx.stroke(); ctx.restore();
    font(34, 500, SANS); ctx.fillStyle = '#fff'; ctx.fillText(s, bx, by + 125);
  });
  ctx.restore();
}

// ======================================================================== 字幕：整句出来，轻轻浮起；长句在逗号处折成两行
const SUB = { y: 1420, size: 60, stroke: 11 };
function subtitle(t) {
  for (const [a, b, s] of SUBS) {
    if (t < a - .05 || t > b + .55) continue;
    const k = E.out(clamp((t - a + .05) / .25)) * (1 - sstep(b + .3, b + .55, t));
    const who = DIALOG.find(r => r[2] === s)[3], color = who === '他' ? PHONE_BLUE : WHITE;
    let str = s.replace(/[，。！？]$/, '');
    font(SUB.size, 900, SANS); ctx.letterSpacing = '2px';
    let rows = [str];
    if (ctx.measureText(str).width > 940) { const m = str.indexOf('，', Math.floor(str.length / 3)); rows = [str.slice(0, m + 1), str.slice(m + 1)]; }
    rows.forEach((r, i) => {
      const y = SUB.y + (i - (rows.length - 1) / 2) * 80 + (1 - k) * 16;
      ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
      ctx.strokeStyle = '#000'; ctx.lineWidth = SUB.stroke; ctx.strokeText(r.replace(/，$/, ''), W / 2, y);
      ctx.shadowColor = 'rgba(0,0,0,0)'; ctx.fillStyle = color; ctx.fillText(r.replace(/，$/, ''), W / 2, y); ctx.restore();
    });
  }
}

// ======================================================================== 片名
function titleCard(t) {
  const t0 = T0('title'), u = t - t0;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const k = E.outExpo(clamp(u / .22)), sc = lerp(1.35, 1, k), shake = u < .35 ? (hash2(Math.floor(u * 60), 7) - .5) * 18 * (1 - u / .35) : 0;
  ctx.save(); ctx.translate(W / 2 + shake, 860); ctx.scale(sc, sc); ctx.globalAlpha = clamp(u / .08);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  font(54, 500, SANS); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.letterSpacing = '12px'; ctx.fillText('第 1 集', 0, -250);
  font(150, 900, SERIF); ctx.letterSpacing = '6px'; ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(214,64,58,.55)'; ctx.shadowBlur = 40; ctx.fillText('这一次，', -60, -80); ctx.fillText('我不嫁了', 40, 110);
  ctx.restore();
  const k2 = E.out(clamp((u - .25) / .5));                                               // 红色的一道
  ctx.save(); ctx.fillStyle = RED; ctx.globalAlpha = .9; ctx.fillRect(W / 2 - 300, 1080, 600 * k2, 10); ctx.restore();
  const a3 = E.out(clamp((u - 1.6) / .6)), a4 = E.out(clamp((u - 2.8) / .6));
  text('下集预告｜订婚宴上，她当众撕下了他的面具', W / 2, 1250 + (1 - a3) * 14, { font: SANS, size: 40, weight: 500, color: CREAM, align: 'center', alpha: a3, ls: 2 });
  font(40, 700, SANS); ctx.letterSpacing = '4px'; const fw = ctx.measureText('关注我，看下一集').width, fx0 = W / 2 + 26 - fw / 2;   // 猫眼放在字的左边，不压字
  ctx.save(); ctx.globalAlpha = a4;
  [[fx0 - 56, ORANGE], [fx0 - 26, TEAL]].forEach(([x, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 1400, 10, 0, TAU); ctx.fill(); });
  ctx.restore();
  text('关注我，看下一集', W / 2 + 26, 1401, { font: SANS, size: 40, weight: 700, color: '#fff', align: 'center', alpha: a4, ls: 4 });
}

// ======================================================================== 一帧
function INIT() {}
function WORLD(t) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const [s0, id] = shotAt(t), s1 = T1(id), p = clamp((t - s0) / (s1 - s0)), tF = T0('eyes');
  if (id === 'bride') {                                                                  // 雨夜里的新娘：慢慢推近；心跳时一缩一放
    const z = lerp(1.1, 1.17, E.ioSine(p)) + .014 * beat(t);
    cover(IMG.bride, z, .5, .45); rain(t, 1);
    veil('#000', .18 * beat(t));
  } else if (id === 'groom') {                                                           // 仰拍：从下往上摇；一进来先打一道闪电
    const u = t - s0;
    cover(IMG.groom, lerp(1.06, 1.14, E.ioSine(p)), .5, lerp(.62, .44, E.ioSine(p)));
    rain(t, 1.1);
    const fl = Math.max(0, 1 - Math.abs(u - .05) / .06) * .9 + Math.max(0, 1 - Math.abs(u - .22) / .05) * .6;
    veil('#e8f0ff', fl);
    veil('#fff', sstep(tF - .5, tF - .04, t));                                           // 白光
  } else if (id === 'eyes') {                                                            // 黑场一下，然后“睁眼”：上下眼皮张开，画面从糊到清楚
    const u = t - s0, o = clamp((u - .3) / .7);
    ctx.save(); ctx.filter = `blur(${(1 - E.out(o)) * 22}px)`; cover(IMG.eyes, lerp(1.18, 1.1, E.out(o)) + .03 * p, .5, .42); ctx.restore();
    if (o < 1) {
      const g = H * .62 * E.out(o);
      ctx.save(); ctx.fillStyle = '#000'; ctx.shadowColor = '#000'; ctx.shadowBlur = 60;
      ctx.beginPath(); ctx.moveTo(-50, -50); ctx.lineTo(W + 50, -50); ctx.lineTo(W + 50, H / 2 - g * .7); ctx.quadraticCurveTo(W / 2, H / 2 - g * 1.3, -50, H / 2 - g * .7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-50, H + 50); ctx.lineTo(W + 50, H + 50); ctx.lineTo(W + 50, H / 2 + g * .7); ctx.quadraticCurveTo(W / 2, H / 2 + g * 1.3, -50, H / 2 + g * .7); ctx.fill();
      ctx.restore();
    }
    veil('#000', 1 - clamp(u / .3) * 0 - (u < .3 ? 0 : 1));                              // 前 0.3 秒全黑
  } else if (id === 'lock') {
    phone(t, (x, y, w, h) => lockScreen(t, x, y, w, h), Math.sin(t * 2.1) * 3);
  } else if (id === 'bed') {                                                             // 早上的房间：慢推，光有点晃眼
    cover(IMG.bed, lerp(1.03, 1.12, E.ioSine(p)), .5, .45);
    const lk = .18 + .06 * Math.sin(t * 1.7);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(W * .75, H * .2, 50, W * .75, H * .2, 900);
    g.addColorStop(0, `rgba(255,236,200,${lk})`); g.addColorStop(1, 'rgba(255,236,200,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  } else if (id === 'call') {                                                            // 来电：手机一震一震
    const u = t - s0, buzzing = (u > .1 && u < .4) || (u > .55 && u < .85) || (u > .9 && u < 1.2) || (u > 1.35 && u < 1.65);
    phone(t, (x, y, w, h) => callScreen(t, x, y, w, h), buzzing ? Math.sin(t * 150) * 7 : 0);
  } else if (id === 'ear') {
    cover(IMG.ear, lerp(1.04, 1.1, E.ioSine(p)), .5, .42);
  } else if (id === 'smile') {                                                           // 推到她脸上；说到“这一次”时画面变冷
    const cold = sstep(SUB_OF('这一次——')[0] - .2, SUB_OF('这一次——')[0] + .6, t);
    cover(IMG.smile, lerp(1.0, 1.22, E.io(p)), .5, lerp(.45, .33, E.io(p)));
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .45 * cold; ctx.fillStyle = '#7d9cc4'; ctx.fillRect(0, 0, W, H); ctx.restore();
    veil('#000', .25 * cold);
  } else if (id === 'title') {
    titleCard(t);
  }
  if (id !== 'title') subtitle(t);
}
function SAMPLES(T) { return 1; }
function BLOOM_K(T) { const id = shotAt(T)[1]; return id === 'bed' || id === 'smile' || id === 'eyes' ? .12 : .08; }
function OVER(T) {}
function MASTER(T) { return 1; }

// ======================================================================== 音效（没有配乐：雨、心跳、闪电、白光、睁眼的一口气、早上的鸟、手机、片名的重击）
function CUES() {
  const tF = T0('eyes'), c = [];
  c.push([0, 'rain', { dur: tF + .05, fi: .25, fo: .05, gain: .55 }]);
  BEATS.forEach(b => c.push([b, 'thud', { gain: .75 }]));
  c.push([T0('groom') + .03, 'boom', { deep: 1, gain: .6 }]);
  c.push([T0('groom') + 1.2, 'drone', { dur: tF - T0('groom') - 1.3, gain: .32 }]);
  c.push([tF - 1.3, 'riser', { dur: 1.25, gain: .45 }]);
  c.push([tF - .05, 'impact', { gain: .8 }]);
  c.push([tF + .02, 'stop', { gain: .35 }]);
  c.push([tF + .3, 'breath', { dur: .7, heavy: .9, gain: .7 }]);
  c.push([tF + .5, 'birds', { dur: T0('call') - tF - .3, gain: .28 }]);
  c.push([T0('lock') + .05, 'click', { gain: .5 }]);
  c.push([SUB_OF('手机上的日期，是三年前。')[1] - .85, 'tone', { dur: 2.2, f: 987.8, gain: .35 }]);
  c.push([T0('bed') - .1, 'swell', { dur: 2.2, f: [146.83, 220.0, 293.66, 349.23, 440.0], gain: .32 }]);
  c.push([T0('call') + .1, 'buzz', { gain: .7 }]);
  c.push([T0('call') + .9, 'buzz', { gain: .7 }]);
  c.push([T0('ear') - .05, 'click', { gain: .45 }]);
  c.push([T0('smile') + 1.0, 'swell', { dur: 3.5, f: [130.81, 196.0, 261.63, 311.13, 392.0], gain: .3 }]);
  c.push([SUB_OF('这一次——')[0] - .9, 'drone', { dur: 1.0, gain: .3 }]);
  c.push([SUB_OF('这一次——')[1] + .25, 'stop', { gain: .3 }]);
  c.push([T0('title') + .01, 'impact', { gain: .95 }]);
  c.push([T0('title') + .01, 'boom', { deep: 1, gain: .55 }]);
  c.push([T0('title') + .2, 'tone', { dur: 3.0, f: 659.26, gain: .25 }]);
  c.push([T0('title') + 2.8, 'tink', { f: 1318.5, gain: .3 }]);
  return c;
}
