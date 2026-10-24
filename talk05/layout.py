"""No.49《恐惧型依恋》的时间轴：先按自然语速合成配音，再按每句的真实长度排时间。

    python3 talk05/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的），按下面的停顿把句子排开；每一段从配乐的小节线开始
（75 BPM，1 小节 = 3.2 秒）。结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json
（music.py 用它对齐段落）。画面里的时间都写成“第几句开始后多少秒”，所以改了文案、重新排时间，画面会跟着走。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, 3.2
# [文字, 这一句说完后的停顿（秒）]；停顿是 (段名, pad) 的那句之后换段（下一段从下一个小节线开始，至少空出 pad 秒）
SCRIPT = [
    # ① 那一晚
    ['凌晨一点，他发来一句：晚安，想你了。', .5],
    ['它打了一句「我也想你」，又删了。', .45],
    ['再打一句「别对我这么好」，也删了。', .5],
    ['最后，只回了一个字：「嗯」。', .6],
    ['然后抱着手机，一直等到天亮。', ('第二天', 1.0)],
    # ② 第二天
    ['第二天，他撑着伞来找它。', .4],
    ['它往前走了一步，又退了回去，把门关上了。', .6],
    ['门一关，它就哭了。', .9],
    ['!它不是不想被爱。它是太想了，又太怕了。', ('为什么', 1.0)],                    # ! = 画面大字（BIGLINES）
    # ③ 为什么
    ['心理学家管这叫「恐惧型依恋」。', .4],
    ['心理学家用两把尺子量感情，它两把都很高：', .35],
    ['既怕被丢下，又怕靠太近。', .5],
    ['所以心里想靠近，身体却在往后退。', ('怎么办', 1.0)],
    # ④ 怎么办
    ['如果你也是这样：想靠近的时候，不用一下子走完。', .4],
    ['一次一步，就好。', .9],
    ['!越想要，越推开。', .8],
    ['!评论区说说：你有没有把一个很想要的人，推开过？', 1.4],
]
FIRST = '那一晚'

idx = json.load(open(os.path.join(HERE, 'voice', 'index.json'), encoding='utf-8'))
dur = {e['text']: e['dur'] for e in idx.values()}
t, rows, sections, cur = .15, [], [[FIRST, 0.0]], None
for text, after in SCRIPT:
    big = text.startswith('!'); text = text.lstrip('!')
    d = dur[text]
    rows.append((round(t, 2), round(t + d + .1, 2), text, big))
    end = t + d
    if isinstance(after, tuple):                                       # 换段：下一段从小节线开始
        name, pad = after
        s = math.ceil((end + pad) / BAR - 1e-9) * BAR
        sections.append([name, round(s, 2)]); t = s + .3
    else:
        t = end + after
total = math.ceil((rows[-1][1] + 1.2) / BAR - 1e-9) * BAR
secs = [(n, s, sections[i + 1][1] if i + 1 < len(sections) else total) for i, (n, s) in enumerate(sections)]

fmt = lambda r: f"  [{r[0]:.2f}, {r[1]:.2f}, '{r[2]}'],"
block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
         f'const TOTAL = {total:.1f};',
         'const SECTIONS = [' + ', '.join(f"['{n}', {a:.1f}, {b:.1f}]" for n, a, b in secs) + '];',
         'const LINES = [', *[fmt(r) for r in rows if not r[3]], '];',
         'const BIGLINES = [', *[fmt(r) for r in rows if r[3]], '];',
         '// 第 i 句（按时间排，含大字）开始的时间：L(i)；结束：LE(i)',
         'const ALL_LINES = [...LINES, ...BIGLINES].sort((a, b) => a[0] - b[0]);',
         'const L = i => ALL_LINES[i][0], LE = i => ALL_LINES[i][1];',
         'const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));',
         '// ======================================================================== 时间轴结束']
p = os.path.join(HERE, 'scenes.js')
src = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
pat = re.compile(r'// =+ 时间轴（layout\.py 生成，别手改）.*?// =+ 时间轴结束', re.S)
src = pat.sub(lambda m: '\n'.join(block), src) if pat.search(src) else '\n'.join(block) + '\n' + src
open(p, 'w', encoding='utf-8').write(src)
json.dump({'bpm': 60 / BEAT, 'total': total, 'sections': [[n, a / BEAT, b / BEAT] for n, a, b in secs],
           'lines': [[r[0], r[1], r[2]] for r in rows]}, open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for n, a, b in secs: print(f'{n:6s} {a:6.1f}–{b:6.1f}s  (beats {a / BEAT:.0f}–{b / BEAT:.0f})')
for i, r in enumerate(rows): print(f'{i:02d} {r[0]:6.2f}–{r[1]:6.2f} {"大字 " if r[3] else ""}{r[2]}')
print(f'TOTAL {total:.1f}s = {total / BEAT:.0f} beats')
