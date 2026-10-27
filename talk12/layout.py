"""No.55《购物车里的游戏机》的时间轴：对白（对话框 + 角色配音）和留白。

    python3 talk12/layout.py

照着频道主的“理想型”参考视频（剖析见 refs/配得感/）的骨架：
- 一个想要的小东西一拖再拖；
- 钱先给别人，一次比一次短；
- 心疼他的人发现了，问他“你自己想要什么”；
- 他答不上来，回忆快闪，最后说出口。
故事和台词都是自己写的。
读 voice/index.json 里每句的时长（tools/cine/tts.py 写的），按下面的停顿把句子排开；换段写成 (段名, pad, lead)。
结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json（music.py 用它对齐段落）。
"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
BEAT, BAR = .8, .8                                                      # 段落只对齐到拍子
CARDS = 7.0                                                               # 最后两张字卡（不配音）占的时间
# [谁, say 说出口 / think 心里想 / msg 手机上的消息（显示在手机里，有配音）, 台词, 这一句之后的停顿]
# 黑 = 小黑（主人公）；妈 = 妈妈；哥 = 老哥；运 = 运营；杰 = 阿杰（老同学，No.53 那个）；她 = 女朋友
LEAD0 = 2.4                                                               # 开头：夜里的便利店，先空一会儿
SCRIPT = [
    # ① 便利店，大二暑假的夜班
    ['黑', 'think', '再上三十个夜班……', .5],                                          # 手机：购物车里的游戏机
    ['黑', 'think', '你就是我的了。', ('回家', 1.4, 1.0)],
    # ② 回家：妈妈的手机
    ['黑', 'think', '工资到了！', 1.0],                                                # 银行短信：入账 2400
    ['妈', 'say', '儿子，你帮我看看，这手机又卡住了。', .5],
    ['黑', 'say', '妈，这屏幕都碎成这样了。', .4],                                     # 手机：碎屏、卡住、内存不足
    ['妈', 'say', '还能用，换啥换，浪费钱。', 1.0],
    ['黑', 'think', '这个手机，她用了快六年了。', 2.6],                                 # 留白：他打开购物车，退出去，搜手机
    ['黑', 'think', '游戏机……明年再说吧。', ('几天后', 1.3, .9)],
    ['妈', 'say', '这新手机真好使，字也大。', .4],
    ['妈', 'say', '你哪来的钱？没乱花吧？', .4],
    ['黑', 'say', '同学换下来的，不要钱。', ('办公室', 1.4, .9)],
    # ③ 工作第一年：办公室
    ['哥', 'say', '新人第一个月发工资，按规矩——请客！', .3],
    ['运', 'say', '我要喝那家最贵的奶茶！', .4],
    ['黑', 'say', '好好好，今晚我请！', 2.2],                                          # 手机：火锅 860、给爸妈转 2000、余额
    ['黑', 'think', '游戏机……下个月吧。', ('三年后', 1.3, 1.0)],
    # ④ 三年后：阿杰结婚（手机）
    ['杰', 'msg', '兄弟，我下个月结婚，一定要来啊！', 1.6],                            # 他发了个 1000 的红包
    ['黑', 'think', '份子钱，不能少。', ('她的生日', 1.3, 1.0)],
    # ⑤ 她的生日：出租屋
    ['她', 'say', '哇！是我一直想要的那台相机！', .4],
    ['她', 'say', '这个很贵吧？', .4],
    ['黑', 'say', '不贵，你喜欢就好。', .4],
    ['黑', 'think', '也就三个月的饭钱。', ('他的生日', 1.4, 1.0)],
    # ⑥ 他的生日前一周：还是那个出租屋
    ['她', 'say', '下周你生日，想要什么？', .5],
    ['黑', 'say', '都行，别破费了。', .5],
    ['她', 'say', '说一个嘛。', .8],
    ['黑', 'say', '嗯……家里电饭煲坏了，要不买个电饭煲？', 1.0],
    ['她', 'think', '他好像，从来没给自己要过什么。', .4],
    ['她', 'say', '电饭煲，是生日礼物吗？', 1.6],                                     # 她看见他手机上的购物车
    ['她', 'say', '你购物车里这台游戏机，放了多久了？', 1.0],
    ['黑', 'say', '……五年了吧。', 1.8],
    ['她', 'say', '那为什么一直不买？', .8],
    ['黑', 'think', '为什么……', 5.6],                                                 # 回忆快闪（灰的，夹着白光，最后停在彩色的游戏机上）
    # ⑦ 说出口
    ['黑', 'say', '因为……总觉得不太应该。', .6],
    ['黑', 'say', '打游戏，又不是什么正经事。', .5],
    ['黑', 'say', '两千多块花在自己身上，我好像……不配。', 2.0],                       # 留白
    ['她', 'say', '你给别人花钱的时候，从来没问过应不应该。', 1.0],
    ['她', 'say', '这次，你自己下单。我看着。', 3.0],                                  # 手指停在“立即购买”上……按下去
    ['黑', 'think', '原来……按下去，也没那么难。', ('生日那天', 1.6, 1.6)],
    # ⑧ 他生日那天
    ['她', 'say', '好玩吗？', .9],
    ['黑', 'say', '好玩。', 2.0],
]
FIRST = '便利店'

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
cards = rows[-1][1] + 1.2
total = math.ceil((cards + CARDS) / BAR - 1e-9) * BAR
secs = [(n, s, sections[i + 1][1] if i + 1 < len(sections) else total) for i, (n, s) in enumerate(sections)]

# 口型：每句配音按每秒 15 格量响度，响的那几格张嘴（比前后 0.3 秒的平均响就张，一个字一张一合）
import subprocess
import numpy as np
def mouth_bits(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, '<i2').astype(float) / 32768
    k = np.flatnonzero(np.abs(x) > 10 ** (-45 / 20)); x = x[max(0, k[0] - int(.03 * 16000)):] if len(k) else x   # 跟 audio.py 一样去掉开头的静音
    hop = 16000 // 15; env = np.array([np.sqrt((x[i:i + hop] ** 2).mean()) for i in range(0, len(x) - hop, hop)])
    if not len(env): return ''
    thr = .25 * np.percentile(env, 90); ma = np.convolve(env, np.ones(5) / 5, 'same')
    return ''.join('1' if e > thr and e >= m * .95 else '0' for e, m in zip(env, ma))
name_of = {(e['text'], e.get('who', '')): n for n, e in idx.items()}
mouths = [mouth_bits(os.path.join(HERE, 'voice', name_of[(r[2], r[3])])) for r in rows]

fmt = lambda r: f"  [{r[0]:.2f}, {r[1]:.2f}, '{r[2]}', '{r[3]}', '{r[4]}'],"
block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
         f'const TOTAL = {total:.1f};',
         'const SECTIONS = [' + ', '.join(f"['{n}', {a:.1f}, {b:.1f}]" for n, a, b in secs) + '];',
         'const LINES = [];                                                   // 没有旁白',
         'const DIALOG = [', *[fmt(r) for r in rows], '];',
         'const MOUTH = [' + ', '.join(f"'{m}'" for m in mouths) + '];              // 口型：每句每秒 15 格，1 = 张嘴',
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
for i, r in enumerate(rows): print(f'{i:02d} {r[0]:6.2f}–{r[1]:6.2f} {r[3]} {r[4]:5s} {r[2]}')
print(f'cards {cards:.2f}  TOTAL {total:.1f}s = {total / BEAT:.0f} beats')
