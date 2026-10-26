'use strict';
// ======================================================================== 基础
const W = 1080, H = 1920, FPS = 30, SHUTTER = .5;                 // 180° 快门：每帧曝光半个帧间隔
const EXPORT = /[?&]export=1/.test(location.search);
const cv = document.getElementById('c'), OUT = cv.getContext('2d');
const mk = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
const LAYER = mk(W, H), LCTX = LAYER.getContext('2d');          // 动态模糊：子帧先画在这里，再平均到 OUT
const BLOOM = mk(W / 4, H / 4), BCTX = BLOOM.getContext('2d');   // 泛光：缩小、提亮部、模糊后叠回去
let ctx = OUT;

const PI = Math.PI, TAU = PI * 2;
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const sstep = (a, b, x) => { const t = prog(x, a, b); return t * t * (3 - 2 * t); };
const win = (t, a, b, fi = .5, fo = .5) => sstep(a, a + fi, t) * (1 - sstep(b - fo, b, t));
const E = {
  lin: t => clamp(t),
  io: t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  out: t => 1 - Math.pow(1 - clamp(t), 3),
  in: t => Math.pow(clamp(t), 3),
  outQuint: t => 1 - Math.pow(1 - clamp(t), 5),
  outExpo: t => (t = clamp(t)) >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inExpo: t => (t = clamp(t)) <= 0 ? 0 : Math.pow(2, 10 * t - 10),
  ioExpo: t => { t = clamp(t); return t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2; },
  ioSine: t => -(Math.cos(PI * clamp(t)) - 1) / 2,
};
// 关键帧轨道：[[t, v, ease?], …]，ease 作用于从这一帧到下一帧的那一段（默认三次缓入缓出）
function track(keys) {
  return T => {
    if (T <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [a, va, e] = keys[i], [b, vb] = keys[i + 1];
      if (T < b) return lerp(va, vb, (e || E.io)((T - a) / (b - a)));
    }
    return keys[keys.length - 1][1];
  };
}
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash2(i, j) { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
function vnoise(x, y) {
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return lerp(lerp(hash2(i, j), hash2(i + 1, j), u), lerp(hash2(i, j + 1), hash2(i + 1, j + 1), u), v);
}
function fbm(x, y, o = 4) { let s = 0, a = .5, f = 1, n = 0; for (let k = 0; k < o; k++) { s += a * vnoise(x * f, y * f); n += a; f *= 2.03; a *= .5; } return s / n; }

const SERIF = '"Noto Serif SC", serif', SANS = '"Noto Sans SC", sans-serif', LAT = '"Cormorant Garamond", serif';
const ORANGE = '#f2a14a', TEAL = '#4fd6c4', CREAM = '#ece6da', DIM = '#8a93a3';
const O_RGB = '242,161,74', T_RGB = '79,214,196', C_RGB = '236,230,218';

function reset(c) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
  c.shadowBlur = 0; c.shadowColor = 'rgba(0,0,0,0)'; c.letterSpacing = '0px'; c.setLineDash([]); c.lineCap = 'butt'; c.lineJoin = 'miter';
}

// ======================================================================== 基础绘制
function font(size, weight = 500, fam = SERIF, style = '') { ctx.font = `${style} ${weight} ${size}px ${fam}`; }
function text(s, x, y, o = {}) {
  if ((o.alpha ?? 1) <= 0) return;
  ctx.save();
  font(o.size || 44, o.weight || 500, o.font || SERIF, o.style || '');
  ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
  ctx.globalAlpha *= o.alpha ?? 1; ctx.letterSpacing = (o.ls || 0) + 'px';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur ?? 20; }
  if (o.filter) ctx.filter = o.filter;
  ctx.fillStyle = o.color || CREAM; ctx.fillText(s, x, y);
  ctx.restore();
}
// 发光的点：外圈光晕 + 实心核
function glow(x, y, r, rgb, a = 1, halo = 5) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = r * halo, g = ctx.createRadialGradient(x, y, 0, x, y, R);
  g.addColorStop(0, `rgba(${rgb},${.55 * a})`); g.addColorStop(.25, `rgba(${rgb},${.18 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = `rgb(${rgb})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
}
function seg(x1, y1, x2, y2, col, lw = 2, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}

// ======================================================================== 文字：逐字浮现
// 「」里的字用高亮色
function runs(s) { const r = []; let hi = false; for (const ch of s) { if (ch === '「') { hi = true; continue; } if (ch === '」') { hi = false; continue; } r.push({ ch, hi }); } return r; }
function advances(rs, o) { font(o.size, o.weight || 500, o.font || SERIF, o.style || ''); ctx.letterSpacing = '0px'; return rs.map(c => ctx.measureText(c.ch).width + (o.ls || 0)); }
const runWidth = (rs, o) => advances(rs, o).reduce((a, b) => a + b, 0) - (o.ls || 0);
// p：0 → 1 的出现进度；每个字从模糊、偏下、透明变清晰，前后重叠 spread 个字
function typeRun(rs, x, y, o, p, alpha = 1) {
  if (alpha <= 0 || p <= 0) return;
  const adv = advances(rs, o), total = adv.reduce((a, b) => a + b, 0) - (o.ls || 0);
  let cx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x;
  const n = rs.length, sp = o.spread ?? 6;
  ctx.save(); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.glowBlur ?? 24; }
  for (let i = 0; i < n; i++) {
    const e = E.out(clamp((p * (n + sp) - i) / sp));
    if (e > 0) {
      ctx.globalAlpha = alpha * e;
      const b = (1 - e) * (o.blur ?? 10);
      ctx.filter = b > .4 ? `blur(${b.toFixed(1)}px)` : 'none';
      ctx.fillStyle = rs[i].hi ? (o.hi || ORANGE) : (o.color || CREAM);
      ctx.fillText(rs[i].ch, cx, y + (1 - e) * (o.rise ?? 22));
    }
    cx += adv[i];
  }
  ctx.restore();
}
const typeText = (s, x, y, o, p, alpha) => typeRun(runs(s), x, y, o, p, alpha);

// 断行：放得下就一行；否则两行，优先在标点后断、取最均衡的位置；不拆英文单词和数字
const PUNCT = '，、：；。？！——…';
function wrapRuns(rs, o, max) {
  const wid = a => runWidth(a, o);
  if (wid(rs) <= max) return [rs];
  let best = -1, bd = 1e9;
  rs.forEach((c, i) => {
    if (!PUNCT.includes(c.ch) || i === rs.length - 1) return;
    const a = wid(rs.slice(0, i + 1)), b = wid(rs.slice(i + 1));
    if (a <= max && b <= max && Math.abs(a - b) < bd) { bd = Math.abs(a - b); best = i + 1; }
  });
  if (best < 0) rs.forEach((c, i) => {
    if (i === 0 || PUNCT.includes(c.ch) || /\w\w/.test(rs[i - 1].ch + c.ch)) return;
    const a = wid(rs.slice(0, i)), b = wid(rs.slice(i));
    if (a <= max && b <= max && Math.abs(a - b) < bd) { bd = Math.abs(a - b); best = i; }
  });
  return best > 0 ? [rs.slice(0, best), rs.slice(best)] : [rs];
}

// ======================================================================== 字幕（无配音，字幕就是旁白）
// 左下角衬线字，逐字浮现；离场时轻轻上浮淡出。位置避开 TikTok 底部文案和右侧按钮。
const NARR = { x: 96, y: 1436, lh: 68, max: 880, size: 46, weight: 500, font: SERIF, ls: 2, spread: 7, rise: 14, blur: 8 };
const WRAP_CACHE = new Map();
function narration(T) {
  let shade = 0;
  for (const [a, b] of LINES) shade = Math.max(shade, win(T, a - .4, b + .6, .5, .6));
  if (shade > 0) {
    const g = ctx.createLinearGradient(0, 1250, 0, 1620); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, `rgba(0,0,0,${.42 * shade})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 1250, W, 370);
  }
  LINES.forEach(([a, b, s], k) => {
    const next = LINES[k + 1] ? LINES[k + 1][0] : Infinity, fe = Math.max(b + .15, Math.min(b + .6, next - .05));   // 下一句开始之前淡出完，两句不叠在一起
    if (T < a || T > fe + .1) return;
    if (!WRAP_CACHE.has(s)) WRAP_CACHE.set(s, wrapRuns(runs(s), NARR, NARR.max));
    const lines = WRAP_CACHE.get(s);
    const fade = 1 - sstep(b, fe, T), drift = -16 * E.in(prog(T, b, fe + .1));
    const n = lines.reduce((k, l) => k + l.length, 0), dur = Math.min(1.2, .3 + n * .03);
    lines.forEach((ln, i) => {
      const t0 = a + i * .22;
      typeRun(ln, NARR.x, NARR.y + (i - (lines.length - 1)) * NARR.lh + drift, { ...NARR, glow: 'rgba(0,0,0,.9)', glowBlur: 14 }, prog(T, t0, t0 + dur), fade);
    });
  });
}

// ======================================================================== 右上角的年份 / 出处
function stamp(s, sub, t0, t1, T) {
  const a = win(T, t0, t1, .7, .7); if (a <= 0) return;
  const e = E.outExpo(prog(T, t0, t0 + 1.4));
  text(s, W - 96 + (1 - e) * 40, 412, { font: LAT, weight: 600, size: 56, align: 'right', alpha: a * .95, ls: 4 });
  if (sub) text(sub, W - 96 + (1 - e) * 70, 462, { font: LAT, style: 'italic', weight: 500, size: 29, align: 'right', color: DIM, alpha: a });
}

// ======================================================================== 顶部分段进度条
// 放在 TikTok 顶部“关注 / 推荐”栏之下（y = 336）。当前段落橙色，头部带一颗发光的点；段落名切换时上下交替。
const PB = { y: 336, x0: 96, x1: 984, gap: 12 };
function progress(T, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const span = PB.x1 - PB.x0 - PB.gap * (SECTIONS.length - 1);
  let x = PB.x0, cur = 0;
  SECTIONS.forEach(([, s0, s1], i) => {
    const w = span * (s1 - s0) / TOTAL, f = clamp((T - s0) / (s1 - s0)); if (T >= s0) cur = i;
    ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(x, PB.y - 1, w, 2);
    if (f > 0) {
      ctx.fillStyle = f < 1 ? ORANGE : 'rgba(236,230,218,.7)'; ctx.fillRect(x, PB.y - 1, w * f, 2);
      if (f < 1) glow(x + w * f, PB.y, 3.2, O_RGB, 1, 5);
    }
    x += w + PB.gap;
  });
  SECTIONS.forEach(([name, s0], i) => {
    const s1 = SECTIONS[i + 1] ? SECTIONS[i + 1][1] : TOTAL + 9;
    const k = (i ? sstep(s0, s0 + .45, T) : 1) * (1 - sstep(s1 - .45, s1, T)); if (k <= 0) return;
    const e = i ? sstep(s0, s0 + .45, T) : 1, y = PB.y - 34 + (1 - e) * 10 - 10 * sstep(s1 - .45, s1, T);
    text(`${String(i + 1).padStart(2, '0')}   ${name}`, PB.x0, y, { size: 27, weight: 500, color: CREAM, alpha: .88 * k, ls: 4 });
  });
  text(`${String(cur + 1).padStart(2, '0')} / ${String(SECTIONS.length).padStart(2, '0')}`, PB.x1, PB.y - 34, { font: LAT, weight: 600, size: 30, color: DIM, align: 'right', ls: 2 });
  ctx.restore();
}

// ======================================================================== 水印
// 低透明度、缓慢漂移，活动范围避开进度条和字幕
const WM = '@黑猫不说话';
function watermark(T, a = 1) {
  const x = 540 + Math.sin(T * TAU / 47 + 1.1) * 210 + Math.sin(T * TAU / 83 + 1) * 50;
  const y = 860 + Math.sin(T * TAU / 61 + 1.3) * 300;
  text(WM, x, y, { font: SANS, weight: 500, size: 30, align: 'center', color: '#ffffff', alpha: .16 * a, ls: 2 });
}

// ======================================================================== 后期：泛光、暗角、颗粒
const GRAIN = (() => {
  const c = mk(256, 256), g = c.getContext('2d'), im = g.createImageData(256, 256), r = mulberry(3);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); return c;
})();
function bloom(k) {
  if (k <= 0) return;
  reset(BCTX); BCTX.globalCompositeOperation = 'copy'; BCTX.filter = 'brightness(.9) contrast(2.4) blur(5px)';
  BCTX.drawImage(cv, 0, 0, W / 4, H / 4);
  OUT.save(); OUT.globalCompositeOperation = 'screen'; OUT.globalAlpha = k; OUT.imageSmoothingQuality = 'high'; OUT.drawImage(BLOOM, 0, 0, W, H); OUT.restore();
}
function grade(T, vig = .62, grain = .07) {
  const v = ctx.createRadialGradient(W / 2, H * .46, H * .26, W / 2, H * .46, H * .82);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${vig})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  const f = Math.floor(T * FPS), ox = (f * 97) % 256, oy = (f * 61) % 256;
  ctx.save(); ctx.globalAlpha = grain; ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(GRAIN, 'repeat'); ctx.translate(-ox, -oy); ctx.fillRect(0, 0, W + 256, H + 256); ctx.restore();
}

// ======================================================================== 一帧
// 剧集提供：TOTAL、SECTIONS、LINES、CUES、INIT()、WORLD(t)、SAMPLES(T)、OVER(T)、MASTER(T)
function render(T) {
  T = clamp(T, 0, TOTAL - 1e-4);
  const n = Math.max(1, SAMPLES(T) | 0);
  reset(OUT);
  for (let k = 0; k < n; k++) {
    const t = n === 1 ? T : T + (k / (n - 1) - .5) * SHUTTER / FPS;
    ctx = n === 1 ? OUT : LCTX; reset(ctx); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    WORLD(t);
    if (n > 1) { reset(OUT); OUT.globalAlpha = 1 / (k + 1); OUT.drawImage(LAYER, 0, 0); }
  }
  ctx = OUT; reset(OUT);
  bloom(BLOOM_K(T)); reset(OUT);
  grade(T); reset(OUT);
  OVER(T); reset(OUT);
  narration(T); reset(OUT);
  const m = MASTER(T);
  watermark(T, m); if (SHOW_PROGRESS) progress(T, m); reset(OUT);
  const dark = sstep(TOTAL - .9, TOTAL, T);                         // 第一帧就是封面，不做淡入；结尾淡出接片尾
  if (dark > 0) { OUT.fillStyle = `rgba(0,0,0,${dark})`; OUT.fillRect(0, 0, W, H); }
}
