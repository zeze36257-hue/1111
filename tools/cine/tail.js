
// ======================================================================== 字体、播放与导出接口
let fontsReady = false;
Promise.all([['900', SERIF], ['700', SERIF], ['500', SERIF], ['700', SANS], ['500', SANS], ['italic 500', LAT], ['italic 600', LAT], ['600', LAT]]
  .map(([w, f]) => document.fonts.load(`${w} 40px ${f}`, '{{TITLE}} Aa')))
  .then(() => document.fonts.ready).then(() => { INIT(); fontsReady = true; render(0); });
window.__ready = () => fontsReady && (typeof ASSETS_READY !== 'function' || ASSETS_READY());   // 照片这类素材（No.50 起）也要加载完
window.__frame = (t, q = .95) => { render(t); return cv.toDataURL('image/jpeg', q); };
window.__duration = () => TOTAL;
window.__cues = () => ({ total: TOTAL, cues: typeof CUES === 'function' ? CUES() : CUES, sections: SECTIONS.map(([name, t0, t1]) => ({ name, t0, t1 })) });

if (!EXPORT) {
  const au = new Audio('audio.wav');
  let playing = false, clock0 = 0, pausedAt = 0, useAudio = true;
  const now = () => useAudio && !au.paused ? au.currentTime : playing ? (performance.now() - clock0) / 1000 : pausedAt;
  function loop() { if (!playing) return; const T = now(); render(T); if (T >= TOTAL) { playing = false; pausedAt = 0; au.pause(); return; } requestAnimationFrame(loop); }
  function play() { playing = true; clock0 = performance.now() - pausedAt * 1000; au.currentTime = pausedAt; au.play().catch(() => { useAudio = false; }); requestAnimationFrame(loop); }
  function pause() { pausedAt = now(); playing = false; au.pause(); }
  document.getElementById('stage').onclick = () => playing ? pause() : play();
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); playing ? pause() : play(); }
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') { const t = clamp(now() + (e.code === 'ArrowRight' ? 5 : -5), 0, TOTAL); pausedAt = t; clock0 = performance.now() - t * 1000; au.currentTime = t; if (!playing) render(t); }
  });
} else document.getElementById('hint').remove();
</script>
</body>
</html>
