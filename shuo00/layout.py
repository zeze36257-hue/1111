"""《她说·她想》样片：她说“我没事”。他和她两个声音，嘴上说的白字，心里想的淡蓝字加括号；最后一句黑猫写在屏幕上，不配音。

    python3 layout.py --prov     先写一个临时时间轴（每句隔 10 秒），给 tools/cine/tts.py 生成配音
    python3 layout.py            按配音的真实长度排时间轴

这是给频道主看“这类视频具体什么样”的样片：正式做的时候，画面是他和她的表情包放在场景里（见 refs/新体系/），
这条先拿现有的成图（characters/读文案/图/）代替。剧本是我写的（refs/新体系/方案.md 里的例子）。
- SCRIPT：每一项是一句：[图, 谁, say/think, 台词, 这一句之后停多久]。连着用同一张图就不切。
- END：黑猫最后写的那句（不配音），和它用的图。
"""
import json, os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LEAD0 = .7                                                # 开头先看一眼图再开口
SCRIPT = [
    ['16', '他', 'say', '你怎么了？', .25],                          # 草地上，两个人看向两边
    ['16', '她', 'say', '我没事。', .35],
    ['16', '她', 'think', '你自己想。', .8],
    ['01', '他', 'think', '完了。是昨天没回消息，还是又忘了她说的那家店？', .6],   # 他回头（黑白）：心里慌
    ['11', '他', 'say', '要不……去吃你上次说的那家火锅？', .3],       # 咖啡馆：她捂着脸偷笑，他摸她的头
    ['11', '她', 'think', '他记得！', .25],
    ['11', '她', 'say', '……也行吧。', .6],
]
END = ['17', ['“我没事”的意思是：', '你哄哄我，就没事了。'], 4.2]     # 拥抱大笑：黑猫写一句，停 4.2 秒
CUT = .12                                                 # 换图比开口早一点点

if '--prov' in sys.argv:
    rows = [f"  [{i * 10:.2f}, {i * 10 + 8:.2f}, '{t}', '{w}', '{k}']," for i, (_, w, k, t, _) in enumerate(SCRIPT)]
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
for img, who, kind, text, pause in SCRIPT:
    name, e = by_text[text]; d = e['dur']
    if not shots or shots[-1][1] != img: shots.append((round(max(0, t - CUT) if shots else 0, 2), img))
    for a, b, p in clause_times(text, os.path.join(HERE, 'voice', name), d):
        subs.append((round(t + a, 2), round(t + b, 2), p, kind))
    lines.append((round(t, 2), round(t + d + .1, 2), text, who, kind))
    t += d + pause
shots.append((round(t - CUT, 2), END[0]))
end_at = round(t + .35, 2)
total = round(t + END[2], 1)

fmt = lambda r: f"  [{r[0]:.2f}, {r[1]:.2f}, '{r[2]}', '{r[3]}', '{r[4]}'],"
block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
         f'const TOTAL = {total:.1f};',
         "const SECTIONS = [['她说她想', 0, TOTAL]];",
         'const LINES = [];                                                   // 字幕自己画（SUBS）',
         'const DIALOG = [', *[fmt(r) for r in lines], '];',
         '// 字幕：[出来, 说完, 这一截, say/think]',
         'const SUBS = [', *[f"  [{a:.2f}, {b:.2f}, '{p}', '{k}']," for a, b, p, k in subs], '];',
         '// 镜头：[开始, 图]',
         'const CUTS = [' + ', '.join(f"[{a:.2f}, '{i}']" for a, i in shots) + '];',
         f"// 黑猫最后写的那句：[出来的时间, 第一行, 第二行]",
         f"const ENDLINE = [{end_at:.2f}, '{END[1][0]}', '{END[1][1]}'];",
         '// ======================================================================== 时间轴结束']
p = os.path.join(HERE, 'scenes.js')
src = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
pat = re.compile(r'// =+ 时间轴（layout\.py 生成，别手改）.*?// =+ 时间轴结束', re.S)
src = pat.sub(lambda m: '\n'.join(block), src) if pat.search(src) else '\n'.join(block) + '\n' + src
open(p, 'w', encoding='utf-8').write(src)
json.dump({'bpm': 75, 'total': total, 'lines': [[a, b, s] for a, b, s, _, _ in lines], 'cuts': [[a, i] for a, i in shots]},
          open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for a, i in shots: print(f'cut {a:6.2f}  {i}')
for a, b, s, k in subs: print(f'   {a:6.2f}–{b:6.2f}  {k:5s} {s}')
print(f'END at {end_at:.2f}  TOTAL {total:.1f}s')
