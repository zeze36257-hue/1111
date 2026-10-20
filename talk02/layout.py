"""No.46《回避型依恋》的时间轴：先按自然语速合成配音，再按每句的真实长度排时间。

    python3 talk02/layout.py

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
    ['你是不是这样：越喜欢一个人，越想躲？', .55],
    ['对方一靠近，你就想往后退；', .45],
    ['一吵架，你不想说话，只想一个人待着。', .65],
    ['或者，你正在爱着这样一个人。', .55],
    ['今天，我们一起来聊聊「回避型依恋」。', ('是什么', 2.2)],
    # ② 是什么：两把尺子
    ['心理学家用两把尺子，量一个人怎么谈感情：', .45],
    ['一把是「怕被抛弃」，一把是「怕太亲近」。', .55],
    ['回避型，是第二把尺子特别高：', .35],
    ['离得越近，越不自在；其中有一种，还不太担心被丢下。', .55],
    ['在两项大型调查里，都有大约四分之一的人这样形容自己。', ('一层壳', 1.3)],
    # ③ 一层壳
    ['很多人以为，回避型就是冷，不在乎。', .45],
    ['可研究看到的，没那么简单。', .8],
    ['心理学家观察过一岁的宝宝：妈妈离开房间，再回来。', .45],
    ['有的宝宝不哭不闹，像什么都没发生，继续玩玩具。', .55],
    ['可仪器显示，他们的心跳一直很快，迟迟降不下来。', 1.1],
    ['长大以后也一样。', .4],
    ['越习惯回避的人，回忆起被父母拒绝、分开的往事，', .3],
    ['嘴上说「没什么」，皮肤电反应却明显升高。', .8],
    ['不在乎，是一层壳。', ('怎么来的', 1.6)],
    # ④ 怎么来的
    ['这层壳，是怎么长出来的？', .55],
    ['心理学家发现，回避型的宝宝，常有这样的经历：', .35],
    ['难过的时候想要抱抱，却常常被推开、被嫌烦。', .55],
    ['次数多了，孩子可能就学会了：', .35],
    ['把需要藏起来，就不会被推开。', .9],
    ['心理学家管这叫「去激活」：把想靠近的需要压下去，再悄悄拉开距离。', .55],
    ['可压得住，不代表它不在。', .45],
    ['实验发现：回避型的人一分心，被压下去的分手念头，就会反弹回来。', ('怎么办', 1.3)],
    # ⑤ 怎么办
    ['如果你是回避型：', .35],
    ['想退的时候，别直接消失。', .45],
    ['说一句：「我需要一点时间，晚上找你。」', .45],
    ['给对方一个时间点，也给自己留一条回来的路。', .8],
    ['如果你爱着一个回避型：', .35],
    ['越追，对方越跑。', .55],
    ['给空间，不等于被冷落。', .8],
    ['依恋类型挺稳定，但不是一辈子的标签。', .45],
    ['研究发现，在稳定、被好好回应的关系里，有些人会慢慢变得更安心。', .7],
    ['!回避型的人，不是不会爱，只是爱得很小心。', .9],                     # ! = 画面大字（BIGLINES）
    ['!评论区说说：你是回避型，还是正在爱着一个回避型？', 1.4],
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
