// Render index.html frame by frame in headless Chromium and encode it with ffmpeg.
//
//   node export.cjs --cues cues.json                 (sound-effect cue sheet + line timings for music.py)
//   node export.cjs --shots 1,12.5,40                (single frames to shots/ for checking)
//   node export.cjs [--workers 4] [--audio music.wav] [--out out.mp4]
//
// Every frame is a pure function of its time, so workers render frames out of order and the writer
// puts them back in order; the video is identical for any worker count.
// Playwright resolves from NODE_PATH (e.g. NODE_PATH=$(npm root -g)).
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const { once, EventEmitter } = require('node:events');
const fs = require('node:fs'), path = require('node:path'), { pathToFileURL } = require('node:url');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]]] : a), []));
const FPS = +(args.fps || 30), CRF = +(args.crf || 18);
const page = path.resolve(__dirname, 'index.html');
const OUT = path.resolve(__dirname, args.out || 'out.mp4');
const WORKERS = args.shots || args.cues ? 1 : +(args.workers || 4);
const exe = process.env.CHROME || undefined;

(async () => {
  const browser = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files', '--force-device-scale-factor=1'] });
  const pages = await Promise.all(Array.from({ length: WORKERS }, async () => {
    const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    p.on('pageerror', e => console.error('page error:', e.message));
    p.on('console', m => m.type() === 'error' && console.error('console.error:', m.text()));
    await p.goto(pathToFileURL(page).href + '?export=1');
    await p.waitForFunction(() => window.__ready && window.__ready(), null, { timeout: 60000 });
    return p;
  }));
  const shot = async (p, t) => { const url = await p.evaluate(t => window.__frame(t), t); return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'); };

  if (args.cues) {
    fs.writeFileSync(path.resolve(__dirname, args.cues), JSON.stringify(await pages[0].evaluate(() => window.__cues()), null, 1));
    console.log(`wrote ${args.cues}`);
  } else if (args.shots) {
    const dir = path.join(__dirname, 'shots'); fs.mkdirSync(dir, { recursive: true });
    for (const t of args.shots.split(',').map(Number)) fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.jpg`), await shot(pages[0], t));
    console.log(`wrote ${args.shots.split(',').length} shots to ${dir}`);
  } else {
    const DUR = await pages[0].evaluate(() => window.__duration()), N = Math.ceil(DUR * FPS);
    console.log(`rendering ${N} frames (${DUR.toFixed(2)}s @ ${FPS} fps) with ${WORKERS} workers -> ${OUT}`);
    const audio = args.audio ? ['-i', path.resolve(__dirname, args.audio)] : [];
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', ...audio,
      '-map', '0:v:0', ...(audio.length ? ['-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', String(CRF), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(FPS),
      '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = once(ff, 'exit');
    const ev = new EventEmitter(); ev.setMaxListeners(0);
    const ready = new Map(); let nextTake = 0, nextWrite = 0; const AHEAD = 8 * WORKERS, t0 = Date.now();
    const work = async p => { while (nextTake < N) { if (nextTake >= nextWrite + AHEAD) { await once(ev, 'written'); continue; } const i = nextTake++; ready.set(i, await shot(p, i / FPS)); ev.emit('rendered'); } };
    const write = async () => {
      while (nextWrite < N) {
        const b = ready.get(nextWrite); if (!b) { await once(ev, 'rendered'); continue; }
        ready.delete(nextWrite); if (!ff.stdin.write(b)) await once(ff.stdin, 'drain'); nextWrite++; ev.emit('written');
        if (nextWrite % 300 === 0 || nextWrite === N) console.log(`frame ${nextWrite}/${N}  ${(nextWrite / ((Date.now() - t0) / 1000)).toFixed(1)} fps`);
      }
    };
    await Promise.all([write(), ...pages.map(work)]);
    ff.stdin.end(); const [code] = await done; if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
    console.log(`done: ${OUT}  (${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB)`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
