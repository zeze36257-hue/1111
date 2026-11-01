"""读文案第二期《你也不用做完美的人》的时间轴：一句配音一张图，字幕一截一截跟着配音出来。

    python3 layout.py --prov     先写一个临时时间轴（每句隔 10 秒），给 tools/cine/tts.py 生成配音
    python3 layout.py            按配音的真实长度排时间轴

文案是频道主 11 月 1 日给的（参考视频 2 那段），他说“同样的你改一下”：意思和起承转合不变，句子都换了（原文见 文案.md）。
图是从他发来的两批图里按意思挑的：冷、暗的图配前半段（焦虑、内耗、放不下），从“其实”开始换成亮的、暖的图。
- SCRIPT：每一项是一句配音：[图, 配音的文字, 这一句之后停多久]。连着两句用同一张图就不切。
  配音的文字里的逗号、冒号、分号、句号把它分成几截字幕。
- 每截字幕什么时候出来：在这一句的录音里找停顿（静下来的地方），停顿最长的几处就是逗号；找不到就按字数分。
结果写进 scenes.js 开头 `// ==== 时间轴（layout.py 生成）` 那一块，以及 timeline.json（music.py 用）。
"""
import json, os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LEAD0, TAIL = .7, 2.6                                     # 开头先看一眼图再开口；最后一句说完停一会儿
# [图（characters/读文案/图/ 里的编号）, 配音, 停顿]
SCRIPT = [
    ['01', '为什么，你总是不肯让自己犯一点错？', .8],               # 他回头（黑白）：像在问看视频的人
    ['14', '日子稍微有点风吹草动，你就开始焦虑、开始内耗。', .3],   # 车边，她累了靠在他肩上
    ['06', '可想来想去，问题没解决，心情倒先坏了。', .7],           # 昏暗的屋里
    ['12', '放不下昨天，也过不好今天。', .9],                       # 雪天河边的长椅
    ['11', '其实，生活里有点不如意，再正常不过了。', .6],           # 咖啡馆：她捂着脸，他摸摸她的头（从这里开始变亮）
    ['04', '这世上本来就没有完美的事，你也不用做完美的人。', .9],   # 自拍吐舌头：不完美，也很开心
    ['05', '不想犯错，当然是好事；', .25],                         # 海边骑车，她站在后座张开双臂：敢
    ['05', '可要是你允许自己出错，还敢从错里学到点什么，', .3],
    ['03', '这样的你，只会越来越好。', TAIL],                       # 夕阳下牵手往前跑：停在这张上
]
CUT = .12                                                 # 换图比开口早一点点

if '--prov' in sys.argv:
    rows = [f"  [{i * 10:.2f}, {i * 10 + 8:.2f}, '{t}', '黑', 'vo']," for i, (_, t, _) in enumerate(SCRIPT)]
    block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
             'const DIALOG = [', *rows, '];', '// ======================================================================== 时间轴结束']
    open(os.path.join(HERE, 'scenes.js'), 'w', encoding='utf-8').write('\n'.join(block) + '\n')
    json.dump({'total': len(rows) * 10 + 20}, open(os.path.join(HERE, 'cues.json'), 'w'))
    print(f'{len(rows)} lines (provisional)'); sys.exit()

idx = json.load(open(os.path.join(HERE, 'voice', 'index.json'), encoding='utf-8'))
by_text = {e['text']: (n, e) for n, e in idx.items()}

def envelope(path, hz=100):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, '<i2').astype(float) / 32768
    k = np.flatnonzero(np.abs(x) > 10 ** (-45 / 20)); x = x[max(0, k[0] - int(.03 * 16000)):] if len(k) else x   # 跟 audio.py 一样去掉开头的静音
    hop = 16000 // hz
    return np.array([np.sqrt((x[i:i + hop] ** 2).mean()) for i in range(0, len(x) - hop, hop)])

def clause_times(text, path, dur):
    """这一句里每一截（按标点分）从第几秒说到第几秒（从开口算起）"""
    parts = [p for p in re.split(r'(?<=[，：；。！？])', text) if p]
    if len(parts) == 1: return [(0.0, dur, parts[0])]
    env = envelope(path); quiet = env < env.max() * .06
    for i in range(1, len(quiet) - 1):                     # 停顿中间夹着不到 30 毫秒的一点点声音（呼吸、杂音），也算停顿
        if not quiet[i] and quiet[i - 1]:
            j = i
            while j < len(quiet) and not quiet[j]: j += 1
            if j < len(quiet) and j - i <= 3: quiet[i:j] = True
    gaps, i = [], 0
    while i < len(quiet):                                  # 静下来超过 0.1 秒的地方
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if j - i >= 5 and i > 5 and j < len(quiet) - 5: gaps.append((j - i, i / 100, j / 100))
            i = j
        else: i += 1
    need = len(parts) - 1
    n = [len(re.sub(r'[，：；。！？]', '', p)) for p in parts]; expect = np.cumsum(n) / sum(n) * dur   # 按字数估的分界
    # 每个逗号配一个停顿：停顿越长越好，离按字数估的位置越近越好，前后顺序不能乱，每截至少 0.3 秒；也可以不配停顿，用估的位置
    from itertools import product
    best = None
    for pick in product(*[gaps + [(0, e, e)] for e in expect[:need]]):
        mids = [(g[1] + g[2]) / 2 for g in pick]
        edges = [0.0] + [x for g in pick for x in (g[1], g[2])] + [dur]
        if any(b - a < .3 for a, b in zip(edges[::2], edges[1::2])) or mids != sorted(mids): continue
        score = sum(g[0] / 100 * 2 - abs(m - e) / dur * 3 for g, m, e in zip(pick, mids, expect))
        if best is None or score > best[0]: best = (score, pick)
    bounds = [(g[1], g[2]) for g in best[1]] if best else [(e, e) for e in expect[:need]]
    out, t0 = [], 0.0
    for k, p in enumerate(parts):
        t1 = bounds[k][0] if k < need else dur
        out.append((round(t0, 2), round(t1, 2), p)); t0 = bounds[k][1] if k < need else dur
    return out

t, shots, subs, lines = LEAD0, [], [], []
for img, text, pause in SCRIPT:
    name, e = by_text[text]; d = e['dur']
    if not shots or shots[-1][1] != img: shots.append((round(max(0, t - CUT) if shots else 0, 2), img))   # 同一张图连着两句：不切
    for a, b, p in clause_times(text, os.path.join(HERE, 'voice', name), d):
        subs.append((round(t + a, 2), round(t + b, 2), p))
    lines.append((round(t, 2), round(t + d + .1, 2), text))
    t += d + pause
total = round(t, 1)

fmt = lambda r: f"  [{r[0]:.2f}, {r[1]:.2f}, '{r[2]}', '黑', 'vo'],"
block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
         f'const TOTAL = {total:.1f};',
         "const SECTIONS = [['读文案', 0, TOTAL]];",
         'const LINES = [];                                                   // 字幕自己画（SUBS）',
         'const DIALOG = [', *[fmt(r) for r in lines], '];',
         '// 字幕：[出来, 说完, 这一截]（一句配音按标点分成几截，跟着录音里的停顿）',
         'const SUBS = [', *[f"  [{a:.2f}, {b:.2f}, '{p}']," for a, b, p in subs], '];',
         '// 镜头：[开始, 图]（一句配音一张图，比开口早一点点切）',
         'const CUTS = [' + ', '.join(f"[{a:.2f}, '{i}']" for a, i in shots) + '];',
         '// ======================================================================== 时间轴结束']
p = os.path.join(HERE, 'scenes.js')
src = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
pat = re.compile(r'// =+ 时间轴（layout\.py 生成，别手改）.*?// =+ 时间轴结束', re.S)
src = pat.sub(lambda m: '\n'.join(block), src) if pat.search(src) else '\n'.join(block) + '\n' + src
open(p, 'w', encoding='utf-8').write(src)
json.dump({'bpm': 75, 'total': total, 'lines': [[a, b, s] for a, b, s in lines], 'cuts': [[a, i] for a, i in shots]},
          open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for a, i in shots: print(f'cut {a:6.2f}  {i}')
for a, b, s in subs: print(f'   {a:6.2f}–{b:6.2f}  {s}')
print(f'TOTAL {total:.1f}s')
