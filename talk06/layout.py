"""No.50《高敏感人群》的时间轴：全是对白（对话框 + 角色配音），没有旁白。

    python3 talk06/layout.py

读 voice/index.json 里每句的时长（tools/cine/tts.py 写的，每个角色用自己的声音），按下面的停顿把句子排开；
每一段从配乐的小节线开始（75 BPM，1 小节 = 3.2 秒）。结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，
以及 timeline.json（music.py 用它对齐段落）。画面里的时间都写成“第几句开始后多少秒”：D(i) / DE(i)。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, 3.2
CARDS = 7.5                                                               # 最后两张字卡（不配音）占的时间
# [谁, say 说出口 / think 心里想, 台词, 这一句之后的停顿]；停顿是 (段名, pad) 的那句之后换段（下一段从下一个小节线开始）
# 黑 = 小黑（主角，高敏感）；橘 = 阿橘（同事，大大咧咧）；姐 = 学姐（懂心理学的朋友）；板 = 老板（画面外）
SCRIPT = [
    # ① 早上：斑马线，人很多
    ['黑', 'think', '好吵……喇叭声、脚步声、有人在打电话，全挤进我脑子里了。', .5],
    ['橘', 'say', '快点快点，绿灯了！', .35],
    ['黑', 'say', '你不觉得……这里太吵了吗？', .3],
    ['橘', 'say', '有吗？还好吧。', ('公司', 1.0)],
    # ② 公司
    ['板', 'say', '嗯……先这样吧。', .6],
    ['黑', 'think', '他刚才是不是叹气了？是不是我做得不好？', .5],
    ['橘', 'say', '你怎么了？脸色这么差。', .3],
    ['黑', 'say', '老板刚才那句话，语气好像不太对。', .4],
    ['橘', 'say', '你想太多了吧。你就是太敏感了。', ('晚上', 1.2)],
    # ③ 晚上：一个人
    ['黑', 'think', '一整天的每一句话，都在脑子里重播。', .7],
    ['黑', 'think', '我是不是……太脆弱了？', ('是什么', 1.2)],
    # ④ 是什么：学姐来了
    ['姐', 'say', '又在想白天的事？', .35],
    ['黑', 'say', '嗯。大家都说我太敏感了。', .45],
    ['姐', 'say', '敏感不是毛病。心理学家专门研究过像你这样的人，叫「高敏感人群」。', .35],
    ['黑', 'say', '高敏感？', .3],
    ['姐', 'say', '有研究估计，差不多每五个人里，就有一个是这样的。', .45],
    ['姐', 'say', '你们的大脑，处理信息更深、更细。', .3],
    ['姐', 'say', '别人没注意的声音、光线、一个小眼神，你都接收到了，还会反复琢磨。', .4],
    ['黑', 'say', '所以我在人多的地方，特别容易累？', .3],
    ['姐', 'say', '对。信息一多，就像一下子塞满了，很容易过载。', .45],
    ['姐', 'say', '有个脑成像研究发现：高敏感的人看到别人开心或难过的表情，跟共情有关的脑区更活跃。', .4],
    ['黑', 'say', '难怪别人一皱眉，我就跟着难受。', ('怎么来的', 1.0)],
    # ⑤ 怎么来的
    ['黑', 'say', '那这是怎么来的？我能改掉吗？', .35],
    ['姐', 'say', '一项双胞胎研究发现，敏感程度的差别，差不多一半和基因有关。', .35],
    ['姐', 'say', '它更像一种天生的特质。不是病，也不是矫情。', .45],
    ['姐', 'say', '而且研究发现，高敏感的人在糟糕的环境里更容易受伤，可在好的环境里，收获也比别人多。', ('怎么办', 1.0)],
    # ⑥ 怎么办
    ['黑', 'say', '那我该怎么办？', .35],
    ['姐', 'say', '累了，就找个安静的地方待一会儿。这不是逃避，是在充电。', .4],
    ['姐', 'say', '人多的安排之间，提前给自己留点恢复的时间。', .4],
    ['姐', 'say', '有人说你太敏感，你可以告诉他：我只是感受得比较多。', ('第二天', 1.2)],
    # ⑦ 第二天：清晨的公园
    ['橘', 'say', '一大早，一个人跑公园来干嘛？', .35],
    ['黑', 'say', '充电。', .6],
    ['黑', 'say', '我想明白了。我不是太脆弱，我只是……感受得比较多。', 1.0],
]
FIRST = '早上'

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
