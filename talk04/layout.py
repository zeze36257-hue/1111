"""No.48《焦虑型配回避型》的时间轴：先按自然语速合成配音，再按每句的真实长度排时间。

    python3 talk04/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的），按下面的停顿把句子排开；每一段从配乐的小节线开始
（75 BPM，1 小节 = 3.2 秒）。结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json
（music.py 用它对齐段落）。画面里的时间都写成“第几句开始后多少秒”，所以改了文案、重新排时间，画面会跟着走。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, 3.2
# [文字, 这一句说完后的停顿（秒）]；停顿是 (段名, pad) 的那句之后换段（下一段从下一个小节线开始，至少空出 pad 秒）
SCRIPT = [
    # ① 问题
    ['你发了三条消息，他一条也没回；', .4],
    ['你越问「你怎么了」，他越不想说话；', .4],
    ['他只是想静一静，你却觉得：他要走了。', .55],
    ['一个越追，一个越跑。', .6],
    ['今天，我们一起来聊聊：焦虑型配回避型。', ('为什么在一起', 1.6)],
    # ② 为什么在一起
    ['有一项研究，调查了三百多对恋人：', .3],
    ['两个都焦虑、两个都回避的，一对也没有。', .5],
    ['一种解释是：对方的样子，正好印证了自己的担心。', .4],
    ['焦虑型想：「你看，他果然会走。」', .3],
    ['回避型想：「你看，靠太近，就会被缠住。」', ('一个圈', 1.2)],
    # ③ 一个圈
    ['于是，就有了这个圈：', .3],
    ['焦虑型心里的警报一响，就去追：发消息、追问、要一个答案；', .35],
    ['回避型被追得喘不过气，就往后退：不回、沉默、冷下来。', .45],
    ['心理学家把它叫作「要求—退缩」。', .4],
    ['研究发现：这样的圈转得越多，两个人都越不满意。', ('分不开', 1.2)],
    # ④ 分不开
    ['可奇怪的是，这样的两个人，常常分不开。', .4],
    ['那项研究三年后又回访：', .2],
    ['回避型男生、焦虑型女生的恋爱，两个人打分都不高，却意外地稳定。', ('怎么办', 1.2)],
    # ⑤ 怎么办
    ['想走出这个圈，先要看见它。', .35],
    ['下次又绕起来，说一句：「我们又在转圈了。」', .45],
    ['焦虑型，先别追问，直接说你需要什么；', .3],
    ['回避型，想退的时候，说好什么时候回来。', .45],
    ['要对付的，是这个圈，不是对方。', .7],
    ['!一个怕被丢下，一个怕被困住。', .8],                                                  # ! = 画面大字（BIGLINES）
    ['!评论区说说：你是追的那个，还是跑的那个？', 1.4],
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
