"""Assemble an episode's index.html for the cinematic engine (season 3 on).

    python tools/build_cine.py <episode-dir>

The episode directory holds meta.json ({"no", "title", "fullTitle", "music": {...}}) and scenes.js, which
defines TOTAL, SECTIONS, LINES, CUES, INIT(), WORLD(t), SAMPLES(T), BLOOM_K(T), OVER(T) and MASTER(T).
tools/cine provides the engine (typography, narration, progress bar, watermark, motion blur, bloom, grain)
and the export hooks. With "host": true in meta.json, tools/cine/host.js (the host-on-camera format) goes between
the engine and the episode. With "progress": false the top progress bar is left out.
"""
import json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
ep = os.path.abspath(sys.argv[1])
meta = json.load(open(os.path.join(ep, 'meta.json'), encoding='utf-8'))
part = lambda f: open(os.path.join(here, 'cine', f), encoding='utf-8').read()
host = part('host.js') + '\n' if meta.get('host') else ''                    # 真人出镜格式（No.65 起）：上半屏动画、下半屏留给主持人
flags = f"const SHOW_PROGRESS = {'false' if meta.get('progress') is False else 'true'};\n"   # "progress": false：不画顶部进度条（Wojak 格式起）
page = part('head.html') + part('engine.js') + '\n' + flags + host + open(os.path.join(ep, 'scenes.js'), encoding='utf-8').read() + part('tail.js')
for k, v in {'{{TITLE}}': meta['title'], '{{FULLTITLE}}': meta['fullTitle'], '{{NO}}': str(meta['no'])}.items():
    page = page.replace(k, v)
assert '{{' not in page, 'unfilled placeholder'
open(os.path.join(ep, 'index.html'), 'w', encoding='utf-8').write(page)
print(f"wrote {os.path.join(ep, 'index.html')}")
