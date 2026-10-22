"""No.47《焦虑型依恋》的时间轴：先按自然语速合成配音，再按每句的真实长度排时间。

    python3 talk03/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的），按下面的停顿把句子排开；每一段从配乐的小节线开始
（75 BPM，1 小节 = 3.2 秒）。结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json
（music.py 用它对齐段落）。画面里的时间都写成“第几句开始后多少秒”，所以改了文案、重新排时间，画面会跟着走。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, 3.2
# [文字, 这一句说完后的停顿（秒）]；停顿为 None 的那句之后换段（下一段从下一个小节线开始，至少空出 pad 秒）
SCRIPT = [
    # ① 问题
    ['你是不是这样：消息发出去，就一直盯着屏幕？', .5],
    ['对方晚回一会儿，你就开始想：是不是我说错了什么？', .45],
    ['他回了一个「嗯」，你能琢磨一整晚。', .6],
    ['或者，你正在爱着这样一个人。', .5],
    ['今天，我们一起来聊聊「焦虑型依恋」。', ('是什么', 1.8)],
    # ② 是什么
    ['心理学家用两把尺子，量一个人怎么谈感情。', .4],
    ['焦虑型，是第一把尺子特别高：特别怕被抛弃。', .45],
    ['所以越在乎，越想靠近，越想确认。', .5],
    ['在两项大型调查里，大约一到两成的人这样形容自己。', ('警报器', 1.2)],
    # ③ 警报器
    ['心理学家把焦虑型的做法，叫「过度激活」：', .3],
    ['回避型把心里的警报关小，焦虑型把它开到最大。', .5],
    ['就像一个太灵敏的烟雾报警器：烤个面包，它也响。', .7],
    ['有个实验，让人看一张脸，慢慢变出表情。', .35],
    ['越焦虑的人，越早觉得「表情变了」；', .3],
    ['可也更容易看错，因为判断得太快。', .6],
    ['另一项研究发现：越焦虑的人，越常去翻伴侣的社交软件。', .35],
    ['警报一响，就忍不住要去确认。', ('怎么来的', 1.4)],
    # ④ 怎么来的
    ['这个警报，是怎么调得这么灵敏的？', .45],
    ['心理学家观察过一种宝宝：妈妈一走就大哭，回来了，又很难哄好。', .4],
    ['研究者认为，这可能和照顾者的回应时有时无有关：', .3],
    ['有时候哭一声就有人来，有时候怎么哭都没人理。', .5],
    ['孩子可能就学会了：声音要够大，才会被看见。', ('怎么办', 1.3)],
    # ⑤ 怎么办
    ['如果你是焦虑型：', .3],
    ['警报响的时候，先别急着试探。', .4],
    ['别问「你是不是不爱我了」，直接说：「我有点不安，能抱我一下吗？」', .7],
    ['如果你爱着一个焦虑型：', .3],
    ['一个确定的回应，比十句「我爱你」都管用。', .35],
    ['比如：「我今天很忙，晚上十点给你打电话。」', .5],
    ['研究也发现：另一半多一点包容，焦虑型的人也会慢慢缓和下来。', .6],
    ['依恋类型挺稳定，但不是一辈子的标签。', .7],
    ['!焦虑型的人，不是太黏人，只是太怕失去。', .9],                                   # ! = 画面大字（BIGLINES）
    ['!评论区说说：你是焦虑型，还是正在爱着一个焦虑型？', 1.4],
]
FIRST = '问题'

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
