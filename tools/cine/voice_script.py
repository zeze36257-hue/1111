"""Write an episode's voiceover script (配音稿.txt) from its narration.

    python tools/cine/voice_script.py <episode-dir>

Reads LINES from <episode-dir>/scenes.js and, if present, BIGLINES (the big on-screen statements that the narration
does not repeat, e.g. the climax quote). Times are shifted by the 1.8 s brand intro so they match the finished video.
"""
import json, os, re, sys

ep = os.path.abspath(sys.argv[1])
meta = json.load(open(os.path.join(ep, 'meta.json'), encoding='utf-8'))
INTRO = 1.8 if meta.get('intro', True) else 0.0                                  # "intro": false 时没有片头
src = open(os.path.join(ep, 'scenes.js'), encoding='utf-8').read()


def block(name):
    m = re.search(r'const ' + name + r' = \[(.*?)\n\];', src, re.S)
    return re.findall(r"\[([\d.]+), ([\d.]+), '([^']+)'(?:, '([^']*)')?(?:, '([^']*)')?\]", m.group(1)) if m else []


cast = meta.get('cast', {})                                                      # 对话（No.50 起）：谁说的
rows = sorted([(float(a), float(b), t, '') for a, b, t, *_ in block('LINES')] + [(float(a), float(b), t, '（画面大字）') for a, b, t, *_ in block('BIGLINES')]
              + [(float(a), float(b), t, f"（{cast.get(w, w)}{'，心里想' if k == 'think' else ''}）") for a, b, t, w, k in block('DIALOG')])
fmt = lambda x: f'{int(x // 60):02d}:{x % 60:04.1f}'
out = [f"黑猫不说话 · 心理学 No.{meta['no']}《{meta['title']}》配音稿",
       (f'时间是成片时间（开头 {INTRO} 秒片头之后开始），大约在这个时间段里说完这一句即可。' if INTRO else '时间是成片时间（没有片头，第一帧就是正片），大约在这个时间段里说完这一句即可。'), '']
for a, b, t, note in rows:
    out.append(f'{fmt(a + INTRO)} – {fmt(b + INTRO)}  {t.replace("「", "").replace("」", "")}{note}')
open(os.path.join(ep, '配音稿.txt'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(f"wrote {os.path.join(ep, '配音稿.txt')} ({len(rows)} lines)")
