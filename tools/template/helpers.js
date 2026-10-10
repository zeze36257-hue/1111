// ======================================================================== 共用场景元素
function heartPath(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y + s * .35);
  ctx.bezierCurveTo(x - s * .9, y - s * .25, x - s * .45, y - s * .85, x, y - s * .38);
  ctx.bezierCurveTo(x + s * .45, y - s * .85, x + s * .9, y - s * .25, x, y + s * .35); ctx.closePath();
}
// 聊天气泡：side 'L' 是 TA（左），'R' 是你（右）
function bubble(s, x, y, side, a, o = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.font = `500 40px ${SANS}`; ctx.letterSpacing = '0px';
  const w = ctx.measureText(s).width + 64, h = 86, bx = side === 'R' ? x - w : x, dy = (1 - eout(o.pop ?? 1)) * 20;
  rr(bx, y - h / 2 + dy, w, h, 30, side === 'R' ? 'rgba(242,161,74,.92)' : 'rgba(46,54,70,.96)');
  text(s, bx + 32, y + 2 + dy, { font: SANS, size: 40, color: side === 'R' ? '#21140a' : CREAM });
  if (o.time) text(o.time, x, y + h / 2 + 26 + dy, { font: SANS, size: 24, color: DIM, align: side === 'R' ? 'right' : 'left' });
  if (o.tag) text(o.tag, side === 'R' ? bx - 18 : bx + w + 18, y + h / 2 - 12 + dy, { font: SANS, size: 26, color: o.tagCol || TEAL, align: side === 'R' ? 'right' : 'left', alpha: o.tagA ?? 1 });
  ctx.restore();
}
function avatar(x, y, r, ring = TEAL) {
  ctx.save(); ctx.fillStyle = '#2b3242'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c9d0de'; ctx.beginPath(); ctx.arc(x, y - r * .18, r * .34, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + r * .62, r * .62, r * .42, 0, PI, TAU); ctx.fill();
  ctx.shadowColor = ring; ctx.shadowBlur = 12; ctx.strokeStyle = ring; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 5, 0, TAU); ctx.stroke();
  ctx.restore();
}
function chatHeader(a, status = '') {
  ctx.save(); ctx.globalAlpha *= a;
  avatar(160, 500, 34);
  text('TA', 220, 488, { font: SANS, weight: 700, size: 38, color: CREAM });
  if (status) text(status, 220, 528, { font: SANS, size: 24, color: DIM });
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(90, 572, 900, 2);
  ctx.restore();
}
const pad2 = n => String(Math.floor(n)).padStart(2, '0');

