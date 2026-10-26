// 出主人公的表情图（透明底 PNG，原图 2 倍大）。底图用 base.png（猫眼已换成品牌色，见 cat_eyes.py）：
//   NODE_PATH=$(npm root -g) node tools/wojak/make_expressions.cjs characters/hero/base.png characters/hero/expr [calm sad ...]
// 不写表情名就全出。表情在 expressions.html 的 EXPR 里。
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url'), { execFileSync } = require('child_process');
const [ref, out, ...want] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage();
  p.on('pageerror', e => console.error('page error:', e.message));
  await p.goto(pathToFileURL(path.join(__dirname, 'expressions.html')).href + '?src=' + encodeURIComponent(pathToFileURL(path.resolve(ref)).href));
  await p.waitForFunction(() => window.ready);
  const names = want.length ? want : await p.evaluate(() => Object.keys(EXPR));
  fs.mkdirSync(out, { recursive: true });
  for (const n of names) {
    const raw = path.join(out, `_raw_${n}.png`);
    fs.writeFileSync(raw, Buffer.from((await p.evaluate(n => window.render(n), n)).split(',')[1], 'base64'));
    execFileSync('python3', ['-I', path.join(__dirname, 'cutout.py'), raw, path.join(out, `${n}.png`)], { stdio: 'inherit' });
    fs.unlinkSync(raw);
  }
  await b.close();
})();
