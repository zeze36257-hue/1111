"""No.51《今晚聚餐，你去不去？》的时间轴：全是对白（对话框 + 角色配音），没有旁白。

    python3 talk08/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的，每个角色用自己的声音），按下面的停顿把句子排开；
每一段从拍子上开始（75 BPM，1 拍 = 0.8 秒；只有“到家”那段有配乐）。结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，
以及 timeline.json（music.py 用它对齐段落）。画面里的时间都写成“第几句开始后多少秒”：D(i) / DE(i)。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, .8                                                      # 段落只对齐到拍子（不用等一整个小节，换场不拖）
CARDS = 7.5                                                               # 最后两张字卡（不配音）占的时间
# [谁, say 说出口 / think 心里想, 台词, 这一句之后的停顿]；停顿是 (段名, pad) 的那句之后换段
# 黑 = 小黑（主人公）；哥 = 老哥（同事，约饭的那个）；运 = 运营（女同事，开朗话多）；猫 = 主人公肩上那只猫
SCRIPT = [
    # ① 公司：下班前五分钟
    ['黑', 'think', '还有五分钟下班。今天终于能早点回家躺着了。', .5],
    ['哥', 'say', '哎，今晚部门聚餐，你去不去？', .5],
    ['黑', 'think', '不想去。', .3],
    ['黑', 'think', '可大家都去，就我不去，会不会显得很不合群？', .4],
    ['哥', 'say', '就差你一个了！', .4],
    ['黑', 'say', '去啊！当然去！', .6],
    ['黑', 'think', '等等……我刚才说了什么？', .4],
    ['哥', 'say', '那七点，楼下火锅店见！', .4],
    ['黑', 'think', '离七点还有一个小时。我已经开始累了。', ('火锅店', 1.0)],
    # ② 火锅店
    ['运', 'say', '想吃什么？随便点！', .3],
    ['黑', 'say', '都行，我都可以。', .4],
    ['黑', 'think', '其实……我想吃毛肚。', .7],
    ['运', 'say', '哈哈哈笑死我了，你们知道吗，今天我们组那个……', .2],
    ['哥', 'say', '来来来，先干一杯！', .4],
    ['黑', 'think', '他们在笑什么？我要不要接一句？', .3],
    ['黑', 'say', '哈哈，对。', .5],
    ['黑', 'think', '不知道在笑什么，先跟着笑。', 3.6],                     # 停顿里：一串“对”“对对对”（不配音）
    ['黑', 'think', '今晚已经说了八个“对”了。', .5],
    ['运', 'say', '诶，你平时周末都干嘛呀？', .4],
    ['黑', 'think', '完了，脑子一片空白。', .4],
    ['黑', 'say', '睡……睡觉。', 2.4],                                       # 全场安静，只有蛐蛐叫
    ['运', 'say', '哈……哈哈，睡觉好，睡觉好。', .4],
    ['哥', 'say', '来来来，吃菜吃菜！', .4],
    ['运', 'say', '来，拍张合照！大家笑一个～', 1.8],                       # 停顿里：闪光灯，定格
    ['黑', 'think', '我想回家。', ('回家路上', 1.0)],
    # ③ 回家路上
    ['哥', 'say', '今天挺开心的吧？下次还叫你！', .4],
    ['黑', 'say', '好啊好啊，下次一定！', .5],
    ['黑', 'think', '下次一定……找个理由不来。', .5],
    ['哥', 'say', '那我先走啦，路上小心！', .3],
    ['黑', 'say', '好，拜拜！', .9],
    ['黑', 'think', '终于……可以不用笑了。', .6],
    ['黑', 'think', '电量，只剩百分之一。', ('到家', 1.0)],
    # ④ 到家
    ['黑', 'think', '终于……到家了。', 1.0],
    ['黑', 'think', '嗯？群里发了聚餐的合照。', .4],
    ['黑', 'think', '照片里的我，笑得好用力。', .8],
    ['猫', 'say', '喵～', .5],
    ['黑', 'say', '嗯，还是跟你待着最舒服。', .6],
    ['黑', 'think', '充电中。', 1.0],
]
FIRST = '公司'

idx = json.load(open(os.path.join(HERE, 'voice', 'index.json'), encoding='utf-8'))
dur = {(e['text'], e.get('who', '')): e['dur'] for e in idx.values()}
t, rows, sections = .3, [], [[FIRST, 0.0]]
for who, kind, text, after in SCRIPT:
    d = dur[(text, who)]
    rows.append((round(t, 2), round(t + d + .1, 2), text, who, kind))
    end = t + d
    if isinstance(after, tuple):                                       # 换段：下一段从小节线开始
        name, pad = after
        s = math.ceil((end + pad) / BAR - 1e-9) * BAR
        sections.append([name, round(s, 2)]); t = s + .4
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
