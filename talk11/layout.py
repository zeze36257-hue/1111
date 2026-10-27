"""No.54《把自己捡回来》的时间轴：主人公的独白（画外音 + 下面的字幕），没有对话框。

    python3 talk11/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的），按下面的停顿把句子排开。
照着频道主发来的参考视频的节奏：开头和结尾慢，中间“一天”那段一个词一个镜头，快切；重要的话后面留白。
每一段从拍子上开始（75 BPM，1 拍 = 0.8 秒）。换段写成 (段名, pad, lead)：lead 是新一段开头空多久才说第一句。
结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json（music.py 用它对齐段落）。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, .8                                                      # 段落只对齐到拍子
CARDS = 6.8                                                               # 最后两张字卡（不配音）占的时间
# [谁, vo（画外音：字幕在画框下面，不出对话框）, 台词, 这一句之后的停顿]；黑 = 小黑（主人公）
LEAD0 = 1.2                                                               # 开头：路口的人潮先走一会儿，第一句说到一半他才出现
SCRIPT = [
    # ① 路口：傍晚下班的人潮，只有他站着不动
    ['黑', 'vo', '上班以后，我最崩溃的一刻，', .3],
    ['黑', 'vo', '不是加班，', .25],                                                  # 大字：不是加班
    ['黑', 'vo', '也不是挨骂。', .6],                                                  # 大字：不是挨骂
    ['黑', 'vo', '而是有一天，我突然发现，', .3],
    ['黑', 'vo', '我好像正在变成一个——', .5],
    ['黑', 'vo', '麻木，', .3],                                                        # 大字：麻木
    ['黑', 'vo', '听话，', .3],                                                        # 大字：听话
    ['黑', 'vo', '只会说“好的”的人。', ('一天', 1.4, .4)],                            # 大字：只会说“好的”
    # ② 一天：一个词一个镜头
    ['黑', 'vo', '每天就是开会，', .2],
    ['黑', 'vo', '打卡，', .2],
    ['黑', 'vo', '写周报，', .2],
    ['黑', 'vo', '回一百个“好的”。', .6],
    ['黑', 'vo', '下班，', .15],
    ['黑', 'vo', '躺下，', .15],
    ['黑', 'vo', '刷手机，', .15],
    ['黑', 'vo', '睡觉。', .8],                                                        # 台灯“咔哒”关了
    ['黑', 'vo', '第二天，再来一遍。', ('以前', 1.5, .6)],                          # 闹钟 → 一天快放一遍 → 黑场
    # ③ 以前：高中教室（回忆，泛黄）
    ['黑', 'vo', '上学的时候，目标很简单：', .2],
    ['黑', 'vo', '考个好大学。', ('办公室', 1.1, .6)],
    # 现在：傍晚的办公室，窗前的剪影
    ['黑', 'vo', '可上班以后，再也没有人告诉我，', .2],
    ['黑', 'vo', '下一步，该往哪走。', ('身边', 2.0, .7)],                                # 留白
    # ④ 身边的人
    ['黑', 'vo', '最可怕的是，', .4],
    ['黑', 'vo', '身边的人，好像都过得挺好。', .5],
    ['黑', 'vo', '老哥照样开黑，', .3],
    ['黑', 'vo', '运营照样晒奶茶，', .3],
    ['黑', 'vo', '朋友圈里，有人在旅游，有人升职了。', ('深夜', 1.0, 1.0)],
    # ⑤ 深夜：卧室，灯关着
    ['黑', 'vo', '好像只有我一个人，', .3],
    ['黑', 'vo', '凌晨两点，', .3],
    ['黑', 'vo', '还睁着眼睛，盯着天花板。', 2.0],                                     # 留白
    ['黑', 'vo', '但人不能一直烂在那里。', .7],
    ['黑', 'vo', '你总得抓住一点什么，', .3],
    ['黑', 'vo', '证明自己，还能变。', 1.1],                                           # 台灯“咔哒”亮了
    ['黑', 'vo', '对我来说，那个东西是——', ('跑步', .9, .4)],                       # 黑场
    # ⑥ 跑步：夜里的操场
    ['黑', 'vo', '跑步。', 2.0],                                                       # 大字“跑步”在他身后
    ['黑', 'vo', '第一天，八百米，', .3],
    ['黑', 'vo', '喘得像条狗。', 1.1],                                                 # 背心男轻轻松松超过他
    ['黑', 'vo', '第七天，两公里。', .9],
    ['黑', 'vo', '第三十天，五公里。', 1.3],                                           # 这回是他超过背心男
    ['黑', 'vo', '原来，我不是没有力气，', .4],
    ['黑', 'vo', '我只是，太久没有为自己，用过力气了。', ('给你', 2.3, .7)],         # 留白
    # ⑦ 给你：回到开头的路口
    ['黑', 'vo', '所以，如果你也觉得，现在的日子——', .3],
    ['黑', 'vo', '很空，', .25],                                                       # 大字
    ['黑', 'vo', '很乱，', .25],                                                       # 大字
    ['黑', 'vo', '很没意义，', .6],                                                    # 大字
    ['黑', 'vo', '先别急着骂自己没用。', .6],
    ['黑', 'vo', '你可能只是需要一件小事，', .2],
    ['黑', 'vo', '能亲手完成，', .2],                                                 # 大字
    ['黑', 'vo', '能亲眼看到变化。', .7],                                              # 大字
    ['黑', 'vo', '哪怕每天，只跑一公里。', 1.1],
    ['黑', 'vo', '人是可以一点一点，把自己捡回来的。', 1.2],                          # 他往前走了
]
FIRST = '路口'

idx = json.load(open(os.path.join(HERE, 'voice', 'index.json'), encoding='utf-8'))
dur = {(e['text'], e.get('who', '')): e['dur'] for e in idx.values()}
t, rows, sections = LEAD0, [], [[FIRST, 0.0]]
for who, kind, text, after in SCRIPT:
    d = dur[(text, who)]
    rows.append((round(t, 2), round(t + d + .1, 2), text, who, kind))
    end = t + d
    if isinstance(after, tuple):                                       # 换段：下一段从拍子上开始；lead：开头空多久才说第一句
        name, pad, lead = (*after, .4)[:3]
        s = math.ceil((end + pad) / BAR - 1e-9) * BAR
        sections.append([name, round(s, 2)]); t = s + lead
    else:
        t = end + after
cards = rows[-1][1] + .8
total = math.ceil((cards + CARDS) / BAR - 1e-9) * BAR
secs = [(n, s, sections[i + 1][1] if i + 1 < len(sections) else total) for i, (n, s) in enumerate(sections)]

fmt = lambda r: f"  [{r[0]:.2f}, {r[1]:.2f}, '{r[2]}', '{r[3]}', '{r[4]}'],"
block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
         f'const TOTAL = {total:.1f};',
         'const SECTIONS = [' + ', '.join(f"['{n}', {a:.1f}, {b:.1f}]" for n, a, b in secs) + '];',
         'const LINES = [];                                                   // 独白放在 DIALOG 里（kind = vo），字幕自己画',
         'const DIALOG = [', *[fmt(r) for r in rows], '];',
         f'const CARDS_AT = {cards:.2f};                                          // 最后的字卡从这里开始',
         '// 第 i 句台词开始的时间：D(i)；结束：DE(i)',
         'const D = i => DIALOG[i][0], DE = i => DIALOG[i][1];',
         'const S = Object.fromEntries(SECTIONS.map(([n, a]) => [n, a]));',
         '// ======================================================================== 时间轴结束']
p = os.path.join(HERE, 'scenes.js')
src = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
pat = re.compile(r'// =+ 时间轴（layout\.py 生成，别手改）.*?// =+ 时间轴结束', re.S)
src = pat.sub(lambda m: '\n'.join(block), src) if pat.search(src) else '\n'.join(block) + '\n' + src
open(p, 'w', encoding='utf-8').write(src)
json.dump({'bpm': 60 / BEAT, 'total': total, 'sections': [[n, a / BEAT, b / BEAT] for n, a, b in secs],
           'lines': [[r[0], r[1], r[2], r[3]] for r in rows]}, open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for n, a, b in secs: print(f'{n:6s} {a:6.1f}–{b:6.1f}s  (beats {a / BEAT:.0f}–{b / BEAT:.0f})')
for i, r in enumerate(rows): print(f'{i:02d} {r[0]:6.2f}–{r[1]:6.2f} {r[2]}')
print(f'cards {cards:.2f}  TOTAL {total:.1f}s = {total / BEAT:.0f} beats')
