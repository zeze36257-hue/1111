"""Assemble an episode's index.html from the shared template and the episode's own scenes.

    python tools/build_page.py <episode-dir>

The episode directory holds:
  meta.json  {"no": 6, "title": "窝里横", "fullTitle": "…", "total": 81,
              "sections": [["钩子", 0, "DROP"], ["原因一", "DROP", 30], …]}
  scenes.js  the episode's shots (SHOTS / shot(...)) and SUBS
The template (tools/template) provides the drawing helpers, subtitles, progress bar,
watermark, frame loop and export hooks shared by every episode.
"""
import json, os, sys

here = os.path.dirname(os.path.abspath(__file__))
ep = os.path.abspath(sys.argv[1])
meta = json.load(open(os.path.join(ep, 'meta.json'), encoding='utf-8'))
tpl = lambda f: open(os.path.join(here, 'template', f), encoding='utf-8').read()
js_val = lambda v: v if isinstance(v, str) else json.dumps(v)          # "DROP"、"CALM" 这类常量原样写进去
sections = '[' + ', '.join(f"['{n}', {js_val(a)}, {js_val(b)}]" for n, a, b in meta['sections']) + ']'
subs = {'{{TITLE}}': meta['title'], '{{FULLTITLE}}': meta['fullTitle'], '{{NO}}': str(meta['no']),
        '{{SECTIONS}}': sections, '{{TOTAL}}': str(meta['total'])}
page = tpl('head.html') + tpl('helpers.js') + tpl('series.js') + open(os.path.join(ep, 'scenes.js'), encoding='utf-8').read() + '\n' + tpl('tail.html')
for k, v in subs.items():
    page = page.replace(k, v)
assert '{{' not in page, 'unfilled placeholder'
open(os.path.join(ep, 'index.html'), 'w', encoding='utf-8').write(page)
print(f"wrote {os.path.join(ep, 'index.html')}")
