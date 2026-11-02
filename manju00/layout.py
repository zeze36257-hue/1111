"""漫剧样片《这一次，我不嫁了》第 1 集开头：给频道主看“我做的 AI 漫剧能到什么效果”。

    python3 layout.py --prov     先写一个临时时间轴（每句隔 10 秒），给 tools/cine/tts.py 生成配音
    python3 layout.py            按配音的真实长度排时间轴

- 画面：MiniMax 生成的韩漫风插画（img/），女主用同一张脸做参考（img/_女主设定.jpg）；手机屏幕、片名是我在画面代码里画的。
- 配音：女主用 MiniMax 的“御姐”声音，每句带情绪（悲、惊、怕、冷）；男的是“精英青年”，像在电话里（配音生成后加电话音色，见 phone_eq）。
- SCRIPT：每一项是一个镜头：[镜头, 谁, 台词, 说完停多久]。谁是 None 就是没有台词的镜头，停的时间就是镜头长度。
"""
import json, os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LEAD0 = .6
SCRIPT = [
    ['bride', '她悲', '我死在了婚礼那天。', .9],
    ['groom', '她悲', '推我下去的，是我爱了七年的人。', 1.3],      # 说完：白光一闪，声音全停
    ['eyes',  '她惊', '再睁开眼——', .7],
    ['lock',  '她惊', '手机上的日期，是三年前。', .9],
    ['bed',   '她怕', '我……回来了？', 1.0],
    ['call',  None, None, 1.7],                                 # 来电：顾言
    ['ear',   '他',   '醒了吗？晚上见一面吧，我有话想跟你说。', .8],
    ['smile', '她冷', '上辈子，就是今晚，他向我求了婚。', .9],
    ['smile', '她冷', '这一次——', 1.3],
    ['title', None, None, 5.0],                                 # 片名、下集预告
]
CUT = .1
LINES_ = [(s, w, t) for s, w, t, _ in SCRIPT if w]

if '--prov' in sys.argv:
    rows = [f"  [{i * 10:.2f}, {i * 10 + 8:.2f}, '{t}', '{w}', 'say']," for i, (_, w, t) in enumerate(LINES_)]
    block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
             'const DIALOG = [', *rows, '];', '// ======================================================================== 时间轴结束']
    open(os.path.join(HERE, 'scenes.js'), 'w', encoding='utf-8').write('\n'.join(block) + '\n')
    json.dump({'total': len(rows) * 10 + 20}, open(os.path.join(HERE, 'cues.json'), 'w'))
    print(f'{len(rows)} lines (provisional)'); sys.exit()

idx = json.load(open(os.path.join(HERE, 'voice', 'index.json'), encoding='utf-8'))
by_text = {e['text']: (n, e) for n, e in idx.items()}

if '--phone' in sys.argv:                                   # 他的那句像从电话里传出来：只留 300–3400 Hz，再压一点
    for n, e in idx.items():
        if e['who'] == '他':
            p = os.path.join(HERE, 'voice', n); tmp = p + '.tmp.mp3'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-af', 'highpass=f=320,lowpass=f=3300,acompressor=threshold=0.1:ratio=4,volume=1.4', tmp], check=True)
            os.replace(tmp, p); print('phone eq:', n)
    sys.exit()

t, shots, subs, lines = LEAD0, [], [], []
for shot, who, text, pause in SCRIPT:
    if not shots or shots[-1][1] != shot: shots.append([round(max(0, t - CUT) if shots else 0, 2), shot])
    if who:
        name, e = by_text[text]; d = e['dur']
        subs.append((round(t, 2), round(t + d, 2), text))
        lines.append((round(t, 2), round(t + d + .1, 2), text, who))
        t += d + pause
    else:
        t += pause
total = round(t, 1)
key = {s: a for a, s in shots}                              # 每个镜头从几秒开始

fmt = lambda r: f"  [{r[0]:.2f}, {r[1]:.2f}, '{r[2]}', '{r[3]}', 'say'],"
block = ['// ======================================================================== 时间轴（layout.py 生成，别手改）',
         f'const TOTAL = {total:.1f};',
         "const SECTIONS = [['漫剧', 0, TOTAL]];",
         'const LINES = [];',
         'const DIALOG = [', *[fmt(r) for r in lines], '];',
         'const SUBS = [', *[f"  [{a:.2f}, {b:.2f}, '{s}']," for a, b, s in subs], '];',
         'const SHOTS = [' + ', '.join(f"[{a:.2f}, '{s}']" for a, s in shots) + '];',
         '// ======================================================================== 时间轴结束']
p = os.path.join(HERE, 'scenes.js')
src = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
pat = re.compile(r'// =+ 时间轴（layout\.py 生成，别手改）.*?// =+ 时间轴结束', re.S)
src = pat.sub(lambda m: '\n'.join(block), src) if pat.search(src) else '\n'.join(block) + '\n' + src
open(p, 'w', encoding='utf-8').write(src)
json.dump({'total': total, 'shots': shots}, open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for a, s in shots: print(f'{a:6.2f}  {s}')
for a, b, s in subs: print(f'   {a:6.2f}–{b:6.2f}  {s}')
print(f'TOTAL {total:.1f}s')
