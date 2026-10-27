"""No.53《很久没联系的老朋友》的时间轴：对白（对话框 + 角色配音）和留白，没有旁白。

    python3 talk10/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的，每个角色用自己的声音），按下面的停顿把句子排开；
这一期节奏放慢：开头先空 LEAD0 秒给空镜和朋友圈，重要的话后面留白，打字、删字的时间也写在停顿里。
每一段从拍子上开始（75 BPM，1 拍 = 0.8 秒）。换段写成 (段名, pad, lead)：lead 是新一段开头空多久才说第一句。
结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json（music.py 用它对齐段落）。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, .8                                                      # 段落只对齐到拍子（不用等一整个小节，换场不拖）
CARDS = 7.5                                                               # 最后两张字卡（不配音）占的时间
# [谁, say 说出口 / think 心里想 / msg 手机上的消息（不出对话框，显示在手机里）, 台词, 这一句之后的停顿]
# 黑 = 小黑（主人公）；杰 = 阿杰（老同学）；猫 = 主人公肩上那只猫
LEAD0 = 7.2                                                                 # 开头：3 秒空镜 → 主人公出现 → 朋友圈（阿杰要搬走了）
SCRIPT = [
    # ① 深夜，卧室
    ['黑', 'think', '阿杰……要走了啊。', .8],                                         # 点进聊天记录
    ['黑', 'think', '上一次聊天，已经是两年前了。', 1.4],
    ['黑', 'think', '说好的“下次一起吃饭”，后来，谁也没再提。', 1.6],                  # 镜头慢慢推到脸上
    ['黑', 'think', '我们……是怎么走散的呢？', ('六年前', 2.6, 3.0)],                   # 留白；黑场，“六年前”
    # ② 六年前，学校篮球场（回忆，泛黄）
    ['杰', 'say', '毕业以后，你打算去哪？', .5],
    ['黑', 'say', '不知道。走一步看一步吧。', .6],
    ['杰', 'say', '不管去哪，我们都要常联系啊！', .4],
    ['黑', 'say', '那当然。', .6],
    ['杰', 'say', '说好了，谁先不联系，谁是小狗！', .5],
    ['黑', 'say', '……幼稚。', .5],
    ['杰', 'say', '哈哈，等着吧，到时候肯定是你先不理我。', .4],
    ['黑', 'say', '怎么可能。', ('现在', 2.4, 2.4)],                                  # 两个人笑；黑场，“现在”
    # ③ 现在，还是那个深夜
    ['黑', 'think', '往上翻，以前我们一天能聊一百条。', 1.0],
    ['黑', 'think', '后来是一天一条，再后来，是一年一条。', 3.2],                       # 停顿里：打“最近还好吗”，又删掉
    ['黑', 'think', '这么久没联系，突然发消息，会不会很奇怪？', 3.4],                   # 停顿里：打“恭喜啊，要去深圳了”，又删掉
    ['黑', 'think', '他可能……早就不记得了吧。', 3.4],                                  # 留白：光标一闪一闪，屏幕暗了；然后手机一震
    ['杰', 'msg', '在吗？突然想起你了。', 1.6],
    ['杰', 'msg', '我下周就走了。走之前，一起吃个饭吧？', .6],
    ['杰', 'msg', '这次，不许再说“下次”了。', 1.2],
    ['黑', 'msg', '好。这次一定。', .8],
    ['杰', 'msg', '那就，老地方见。', 1.6],
    ['黑', 'think', '说好谁先不联系，谁是小狗……', .4],
    ['黑', 'think', '看来，我才是那只小狗。', 1.0],
    ['猫', 'say', '喵～', 1.6],
]
FIRST = '深夜'

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
         'const LINES = [];                                                   // 没有旁白',
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
for i, r in enumerate(rows): print(f'{i:02d} {r[0]:6.2f}–{r[1]:6.2f} {r[3]} {"想" if r[4] == "think" else "说"} {r[2]}')
print(f'cards {cards:.2f}  TOTAL {total:.1f}s = {total / BEAT:.0f} beats')
