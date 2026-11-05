// 把 封面.html 里的两张封面截成 jpg：node 出图.cjs（B 是用的那张 -> ../封面.jpg；A 冷色的那张 -> ../封面_备选.jpg）
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/封面.html'); await p.evaluate(() => document.fonts.ready);
  for (const id of ['A', 'B']) await (await p.$('#' + id)).screenshot({ path: __dirname + (id === 'B' ? '/../封面.jpg' : '/../封面_备选.jpg'), type: 'jpeg', quality: 92 });
  await b.close();
})();
