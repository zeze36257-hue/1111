"""No.52《电梯里遇到领导》的时间轴：全是对白（对话框 + 角色配音），没有旁白。

    python3 talk09/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的，每个角色用自己的声音），按下面的停顿把句子排开；
每一段从拍子上开始（75 BPM，1 拍 = 0.8 秒）。换段的停顿写成 (段名, pad, lead)：lead 是新一段开头空多久才说第一句（默认 0.4 秒）。
结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json（music.py 用它对齐段落）。
画面里的时间都写成“第几句开始后多少秒”：D(i) / DE(i)。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, .8                                                      # 段落只对齐到拍子（不用等一整个小节，换场不拖）
CARDS = 7.5                                                               # 最后两张字卡（不配音）占的时间
# [谁, say 说出口 / think 心里想, 台词, 这一句之后的停顿]；停顿是 (段名, pad[, lead]) 的那句之后换段
# 黑 = 小黑（主人公）；板 = 领导（领导-上司，爱吹牛）；哥 = 老哥（同事）
SCRIPT = [
    # ① 电梯厅：八点五十九
    ['黑', 'think', '八点五十九，还有一分钟打卡。', .3],
    ['黑', 'think', '电梯怎么还在十八楼……', .6],
    ['黑', 'think', '快来快来快来……', 1.0],                                        # 停顿里：电梯到了，“叮”，门开
    ['板', 'say', '早啊。', .4],
    ['黑', 'think', '完了，是领导。', .3],
    ['黑', 'think', '现在转身去走楼梯，还来得及吗？', .3],
    ['板', 'say', '愣着干嘛？进来啊。', .4],
    ['黑', 'say', '好、好的！领导早！', ('电梯里', 1.0, 2.6)],                         # 进电梯：先尴尬地安静 2.6 秒
    # ② 电梯里
    ['黑', 'think', '说点什么吧……不说话，会不会显得很没礼貌？', .4],
    ['板', 'say', '吃了吗？', .3],
    ['黑', 'say', '您也是！', .4],
    ['板', 'say', '……啊？哦，吃了吃了。', .4],
    ['黑', 'think', '……我在说什么。', 2.2],                                         # 停顿里：三楼，门开了，没人
    ['黑', 'think', '谁按的三楼……', .6],
    ['板', 'say', '年轻人啊，我像你这么大的时候，一个人干三个人的活。', .4],
    ['板', 'say', '那时候哪有什么加班费，全凭热爱。', .4],
    ['黑', 'say', '是是是，领导真厉害！', .4],
    ['黑', 'think', '这个故事，我已经听了三遍了。', 1.6],                             # 停顿里：八楼，门开了，是老哥
    ['哥', 'say', '早啊……哦，领导也在啊。', .3],
    ['哥', 'say', '那个……我等下一趟！', .8],                                         # 门关上
    ['黑', 'think', '叛徒。', .8],
    ['板', 'say', '最近项目怎么样？', .3],
    ['黑', 'say', '挺好的挺好的！', .3],
    ['黑', 'think', '一点都不好。', .4],
    ['板', 'say', '那正好，下午开会你来讲讲。', .3],
    ['黑', 'say', '啊？……好、好的！', .4],
    ['黑', 'think', '我为什么要说“挺好的”……', 1.4],                                  # 停顿里：十六楼到了
    ['板', 'say', '我到了。好好干啊，年轻人。', .3],
    ['黑', 'say', '好嘞！领导慢走！', 1.6],                                           # 领导走了，门关上
    ['黑', 'think', '终于……走了。', .5],
    ['黑', 'think', '三十秒的电梯，电量掉了三成。', 1.2],
    ['黑', 'think', '还有八个小时才下班。', .6],
    ['黑', 'think', '还有下午的会。', 1.0],
]
FIRST = '电梯厅'

idx = json.load(open(os.path.join(HERE, 'voice', 'index.json'), encoding='utf-8'))
dur = {(e['text'], e.get('who', '')): e['dur'] for e in idx.values()}
t, rows, sections = .3, [], [[FIRST, 0.0]]
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
