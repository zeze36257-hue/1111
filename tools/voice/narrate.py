"""合成一整条旁白：一句一句合成，句子之间按稿子里写的时间留白；再出一条带字幕的试听视频。

    python3 tools/voice/narrate.py 稿子.txt 输出目录 [--voice ID] [--speed 1.0] [--rate 300] [--no-video]

讲故事的规矩（频道主 11 月 5 日定的）：
- 语速正常，像他发的参考视频那样，不刻意放慢；
- 话跟话之间留白，等一会儿再说，营造氛围；
- 画面是画面，话是话：旁白单独做成一条，画面另外剪，不用一句话对一个画面。
- 第 1 集以后他又要：**控制语速、避免读错**。所以有了下面两个检查。

稿子.txt 的写法：
- 一行一句（字幕也按这一行出）；
- 行尾写 `|2.5`：这句说完停 2.5 秒。不写就用默认：句子之间停 0.8 秒；
- 再往后可以写 `~260`：这句的目标语速（每分钟多少字，只算说话的时间），给要放慢的重话用；
- 空行是分段：段落之间至少停 1.8 秒；
- `#` 开头的行是注释或小标题，不读；
- `# 读音：长津湖/(chang2)(jin1)(hu2) 入朝/(ru4)(chao2)`：多音字词典，合成时传给 MiniMax（pronunciation_dict），核对时也按它算拼音；
- 读法跟写法不一样的，写成 `{字幕上显示的|配音读的}`，比如 `{1902|一九零二} 年`。

两个检查：
1. 语速（--rate 300）：每句合成完，量“只算说话时间”的语速（去掉首尾和句中 0.15 秒以上的停顿）。
   离目标超过 5% 的，按比例改 speed 重新合成，最多 5 次，留最接近的；还差 3% 以上的，用 rubberband 拉到目标（最多 ±12%）。
   8 个字以内的短句目标慢一成（--short-rate 可以另给）：第 1 集短句最赶，每分钟 330～350 字。
2. 读音（有 SenseVoice 模型就做：--asr 目录，或者环境变量 SENSEVOICE_DIR）：
   每句用语音识别听一遍，跟稿子都转成不带声调的拼音比，同音字不算错。
   对不上的，speed 微调重新合成，最多 3 次，留错得最少的；还对不上的写进报告，人再看。
   “的、地、得”识别成哪个都不算错。

输出：
- 输出目录/clips/：每句一个 mp3，按“读的文字 + 声音设置”缓存，改了哪句只重新合成哪句；
- 输出目录/旁白.wav：整条旁白，响度拉到 -16 LUFS；
- 输出目录/旁白.srt：字幕时间；
- 输出目录/检查.md：每句的语速、speed、识别结果、对不上的地方；
- 输出目录/旁白试听.mp4：黑底 + 字幕，给频道主听（--no-video 不出）。

声音默认是 11 月 5 日选定的音色设计 1 号“温和自然”。外语系统声音读中文时，这里会自动带 language_boost: "Chinese"。
"""
import argparse, hashlib, json, os, re, subprocess, time, urllib.request
import numpy as np
import scipy.io.wavfile as wf
import scipy.signal as ss

VOICE = 'ttv-voice-2026110508401026-kAVaXtXg'
SENT_GAP, PARA_GAP = 0.8, 1.8
SR = 48000
FONT_NAME = 'WenQuanYi Zen Hei'
TOL = 0.05                                     # 语速离目标 5% 以内算合格

ap = argparse.ArgumentParser()
ap.add_argument('script'); ap.add_argument('out')
ap.add_argument('--voice', default=VOICE); ap.add_argument('--speed', type=float, default=1.0)
ap.add_argument('--model', default='speech-2.8-hd'); ap.add_argument('--no-video', action='store_true')
ap.add_argument('--rate', type=float, default=0, help='目标语速：每分钟多少字，只算说话的时间（比如 300）；0 = 不自动调')
ap.add_argument('--short-rate', type=float, default=0, help='8 个字以内短句的目标语速，默认比 --rate 慢一成')
ap.add_argument('--asr', default=os.environ.get('SENSEVOICE_DIR', ''), help='SenseVoice 模型目录，有就逐句核对读音')
ap.add_argument('--no-fix', action='store_true', help='只量、只核对，不重新合成（看看旧的录音）')
a = ap.parse_args()
os.makedirs(os.path.join(a.out, 'clips'), exist_ok=True)

# ---------- 读稿子 ----------
lines, para, TONE = [], False, []             # 每句：显示的字、读的字、说完停多久、目标语速
for raw in open(a.script, encoding='utf-8'):
    s = raw.strip()
    if not s:
        para = True; continue
    if s.startswith('#'):
        m = re.match(r'#\s*读音[:：]\s*(.+)', s)
        if m: TONE += m.group(1).split()
        continue
    rate = None
    m = re.search(r'~\s*(\d+)\s*$', s)
    if m: rate, s = float(m.group(1)), s[:m.start()].rstrip()
    pause = None
    m = re.search(r'\|\s*([\d.]+)\s*$', s)
    if m: pause, s = float(m.group(1)), s[:m.start()].rstrip()
    say = re.sub(r'\{([^{}|]*)\|([^{}]*)\}', lambda m: m.group(2), s)
    s = re.sub(r'\{([^{}|]*)\|([^{}]*)\}', lambda m: m.group(1), s)
    if para and lines: lines[-1]['pause'] = max(lines[-1]['pause'], PARA_GAP)
    para = False
    lines.append({'show': s.strip(), 'say': say.strip(), 'pause': pause if pause is not None else SENT_GAP, 'rate': rate})
if para and lines: lines[-1]['pause'] = max(lines[-1]['pause'], PARA_GAP)

nchar = lambda s: len(re.findall(r'[一-鿿0-9A-Za-z]', s))
tones_for = lambda say: [e for e in TONE if e.split('/')[0] in say]

# ---------- 合成（有缓存） ----------
idx_path = os.path.join(a.out, 'clips', 'index.json')
idx = json.load(open(idx_path, encoding='utf-8')) if os.path.exists(idx_path) else {}


def synth(text, speed, tones):
    body = {'model': a.model, 'text': text, 'stream': False,
            'voice_setting': {'voice_id': a.voice, 'speed': speed, 'vol': 1, 'pitch': 0},
            'audio_setting': {'sample_rate': 44100, 'format': 'mp3', 'bitrate': 256000, 'channel': 1}}
    if tones: body['pronunciation_dict'] = {'tone': tones}
    if not a.voice.startswith(('ttv-', 'Chinese', 'Cantonese')) and '_' in a.voice:
        body['language_boost'] = 'Chinese'
    err = None
    for k in range(8):
        if k: time.sleep(min(60, 5 * k))
        try:
            r = json.load(urllib.request.urlopen(urllib.request.Request('https://api.minimaxi.com/v1/t2a_v2', json.dumps(body).encode(),
                                                                        {'Content-Type': 'application/json'}), timeout=180))
        except Exception as e:
            err = e; continue
        c = r['base_resp']['status_code']
        if c == 0: return bytes.fromhex(r['data']['audio'])
        err = r['base_resp']
        if c != 1002: break                   # 1002 是每分钟请求太多，等一会儿再试；别的错（比如 1008 余额不足）直接停
    raise SystemExit(f'合成失败：{text!r}：{err}')


def get(i, say, speed):
    """这句话用这个 speed 合成的文件（没有就合成）。没有读音词典时，缓存的键跟以前一样，旧的录音还能用。"""
    tones = tones_for(say)
    setting = {'voice': a.voice, 'speed': speed, 'model': a.model}
    key = hashlib.sha1(json.dumps([say, setting] + ([tones] if tones else []), ensure_ascii=False).encode()).hexdigest()[:12]
    if not (idx.get(key) and os.path.exists(os.path.join(a.out, 'clips', idx[key]))):
        name = f'{i:03d}_{key}.mp3'
        open(os.path.join(a.out, 'clips', name), 'wb').write(synth(say, speed, tones))
        idx[key] = name
        json.dump(idx, open(idx_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(f'  合成 {i + 1}/{len(lines)} speed {speed}', say, flush=True)
    return os.path.join(a.out, 'clips', idx[key])


def load(path):                                # 解码、去掉首尾静音（留 40 ms）
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    x = np.frombuffer(p.stdout, np.int16).astype(np.float32) / 32768
    hop = SR // 100
    e = np.array([np.sqrt((x[j:j + hop] ** 2).mean() + 1e-12) for j in range(0, len(x) - hop, hop)])
    on = np.where(20 * np.log10(e) > -45)[0]
    if not len(on): return x
    s, t = max(0, on[0] * hop - SR // 25), min(len(x), (on[-1] + 1) * hop + SR // 25)
    return x[s:t]


def talk_time(x):
    """只算说话的时间：去掉首尾，再去掉句中 0.15 秒以上的停顿。"""
    hop = SR // 100
    db = 20 * np.log10(np.array([np.sqrt((x[j:j + hop] ** 2).mean() + 1e-12) for j in range(0, len(x) - hop, hop)]))
    on = db > max(-50, np.percentile(db, 95) - 35)
    w = np.where(on)[0]
    if not len(w): return len(x) / SR
    seg, gap, run = on[w[0]:w[-1] + 1], 0, 0
    for v in seg:
        if v:
            if run >= 15: gap += run
            run = 0
        else: run += 1
    return (len(seg) - gap) / 100


def target(L):
    if L['rate']: return L['rate']
    if not a.rate: return None
    return (a.short_rate or a.rate * 0.9) if nchar(L['say']) <= 8 else a.rate


# ---------- 读音核对 ----------
rec = None
if a.asr and os.path.exists(os.path.join(a.asr, 'model.int8.onnx')):
    import sherpa_onnx
    from pypinyin import lazy_pinyin, load_phrases_dict
    rec = sherpa_onnx.OfflineRecognizer.from_sense_voice(model=os.path.join(a.asr, 'model.int8.onnx'), tokens=os.path.join(a.asr, 'tokens.txt'),
                                                        language='zh', use_itn=False, num_threads=4)
    phr = {}
    for e in TONE:
        w, p = e.split('/', 1)
        py = re.findall(r'\(([a-zü]+)\d?\)', p)
        if len(py) == len(w): phr[w] = [[q] for q in py]
    if phr: load_phrases_dict(phr)
elif a.asr:
    print('没找到 SenseVoice 模型，不核对读音：', a.asr)

DIG = dict(zip('0123456789', '零一二三四五六七八九'))
han = lambda s: ''.join(re.findall(r'[一-鿿]', ''.join(DIG.get(c, c) for c in s)))


def check(x, say):
    """返回 (错几个音, 识别出来的字, 对不上的地方)。"""
    x16 = ss.resample_poly(x, 1, 3).astype(np.float32)
    st = rec.create_stream(); st.accept_waveform(16000, x16); rec.decode_stream(st)
    hyp = st.result.text
    R, H = han(say), han(hyp)
    pr, ph = lazy_pinyin(R), lazy_pinyin(H)
    n, m = len(pr), len(ph)
    DE = set('的地得')
    diff1 = lambda i, j: int(pr[i] != ph[j] and not (R[i] in DE and H[j] in DE))   # 的、地、得都读 de
    d = np.zeros((n + 1, m + 1), int); d[:, 0] = range(n + 1); d[0, :] = range(m + 1)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + diff1(i - 1, j - 1))
    i, j, diff = n, m, []
    while i or j:
        if i and j and d[i, j] == d[i - 1, j - 1] + diff1(i - 1, j - 1):
            if diff1(i - 1, j - 1): diff.append(f'{R[i - 1]}({pr[i - 1]})→{H[j - 1]}({ph[j - 1]})')
            i, j = i - 1, j - 1
        elif i and d[i, j] == d[i - 1, j] + 1:
            diff.append(f'少了 {R[i - 1]}'); i -= 1
        else:
            diff.append(f'多了 {H[j - 1]}'); j -= 1
    return int(d[n, m]), hyp, diff[::-1]


# ---------- 每句：调语速、核对读音 ----------
# 同一句、同一个 speed，每次合成出来的快慢也不一样（停顿多少、哪里拖长），speed 跟语速不成比例。
# 所以：最多合成 5 次，每次照“最接近的那次”按比例改 speed；挑最接近的；还差 3% 以上的，最后用 rubberband 拉到目标（最多 ±12%）。
def take(i, L, sp, tgt, n):
    p = get(i, L['say'], sp); x = load(p); r = n / talk_time(x) * 60
    return {'off': abs(r / tgt - 1) if tgt else 0, 'speed': sp, 'path': p, 'rate': r, 'x': x, 'err': None}


def stretch(x, f):
    """不变调地改快慢：f > 1 变快。"""
    p = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', f'rubberband=tempo={f:.4f}:transients=smooth',
                        '-f', 'f32le', '-'], input=x.astype(np.float32).tobytes(), capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.float32).copy()


for i, L in enumerate(lines):
    tgt, n, sp = target(L), nchar(L['say']), a.speed
    tries = [take(i, L, sp, tgt, n)]
    while tgt and not a.no_fix and len(tries) < 5 and min(t['off'] for t in tries) > TOL:
        b = min(tries, key=lambda t: t['off'])
        sp = round(min(1.2, max(0.55, b['speed'] * tgt / b['rate'])), 2)
        while any(t['speed'] == sp for t in tries): sp = round(sp + (0.02 if b['rate'] < tgt else -0.02), 2)
        tries.append(take(i, L, sp, tgt, n))
    if rec:
        tries.sort(key=lambda t: t['off'])
        for t in tries:                        # 从最接近目标的开始核对，找到对得上的就停
            t['err'], t['hyp'], t['diff'] = check(t['x'], L['say'])
            if not t['err']: break
        k = 0
        while not a.no_fix and k < 3 and all(t['err'] for t in tries if t['err'] is not None):
            b = min(tries, key=lambda t: t['off'])
            sp = round(b['speed'] * (0.97, 1.03, 0.94)[k], 2); k += 1
            if any(t['speed'] == sp for t in tries): continue
            t = take(i, L, sp, tgt, n); t['err'], t['hyp'], t['diff'] = check(t['x'], L['say']); tries.append(t)
        best = min((t for t in tries if t['err'] is not None), key=lambda t: (t['err'], t['off']))
        k = 0                                  # 对得上的那次太快或太慢：在语速最接近的那次旁边再试几次
        while tgt and not a.no_fix and not best['err'] and best['off'] > 0.08 and k < 4:
            near = min(tries, key=lambda t: t['off'])
            sp = round(near['speed'] * (1.0, 0.98, 1.02, 0.96)[k], 2); k += 1
            if any(t['speed'] == sp for t in tries): continue
            t = take(i, L, sp, tgt, n); t['err'], t['hyp'], t['diff'] = check(t['x'], L['say']); tries.append(t)
            best = min((t for t in tries if t['err'] is not None), key=lambda t: (t['err'], t['off']))
    else:
        best = min(tries, key=lambda t: t['off'])
    best['raw_rate'] = best['rate']
    if tgt and best['off'] > 0.03:             # 剩下的差距用 rubberband 补上
        f = min(1.12, max(1 / 1.12, tgt / best['rate']))
        best['x'] = stretch(best['x'], f); best['rate'] *= f; best['stretch'] = f
    L.update(best=best, target=tgt)
    flag = '' if not best.get('err') else '  ← 对不上：' + '，'.join(best['diff'])
    st = f"，拉了 {best['stretch']:.2f} 倍" if best.get('stretch') else ''
    print(f"{i + 1:2d}. {n:2d}字 speed {best['speed']:.2f} 语速 {best['rate']:3.0f}" + (f"（目标 {tgt:.0f}{st}）" if tgt else '') + f"  {L['show']}{flag}", flush=True)

# ---------- 拼起来 ----------
LEAD = 1.0
parts, subs, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
for L in lines:
    x = L['best']['x']
    d = len(x) / SR
    subs.append((t, t + d, L['show']))
    parts += [x, np.zeros(int(L['pause'] * SR), np.float32)]
    t += d + L['pause']
y = np.concatenate(parts)
tmp = os.path.join(a.out, '_raw.wav')
wf.write(tmp, SR, (np.clip(y, -1, 1) * 32767).astype(np.int16))
s = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', tmp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
gain = -16 - float(re.findall(r'I:\s+(-?[\d.]+) LUFS', s)[-1])
out_wav = os.path.join(a.out, '旁白.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.89:level=false', out_wav], check=True)
os.remove(tmp)

fmt = lambda s: f'{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round(s % 1 * 1000)) % 1000:03d}'
srt = os.path.join(a.out, '旁白.srt')
open(srt, 'w', encoding='utf-8').write(''.join(f'{k}\n{fmt(b)} --> {fmt(e)}\n{txt}\n\n' for k, (b, e, txt) in enumerate(subs, 1)))
total = t + 1.0
talk = sum(e - b for b, e, _ in subs)
rates = [L['best']['rate'] for L in lines]
print(f'{len(lines)} 句，旁白 {total:.1f} 秒（说话 {talk:.1f} 秒，留白 {total - talk:.1f} 秒）；'
      f'语速 {min(rates):.0f}～{max(rates):.0f}，平均 {sum(nchar(L["say"]) for L in lines) / sum(nchar(L["say"]) / L["best"]["rate"] for L in lines):.0f} 字/分钟')

rep = ['# 旁白检查', '', f'稿子：`{a.script}`；声音 `{a.voice}`；目标语速 {a.rate or "不调"}（只算说话的时间，字/分钟）。', '',
       '| # | 字数 | speed | 语速 | 目标 | 识别 | 对不上的地方 | 句子 |', '|---|---|---|---|---|---|---|---|']
for k, L in enumerate(lines, 1):
    b = L['best']
    rep.append(f"| {k} | {nchar(L['say'])} | {b['speed']:.2f}{' ×%.2f' % b['stretch'] if b.get('stretch') else ''} | {b['rate']:.0f} | {L['target'] or ''} | "
               f"{b.get('hyp', '') if b.get('err') else ('✓' if rec else '')} | {'，'.join(b.get('diff') or [])} | {L['show']} |")
open(os.path.join(a.out, '检查.md'), 'w', encoding='utf-8').write('\n'.join(rep) + '\n')
bad = [k for k, L in enumerate(lines, 1) if L['best'].get('err')]
if rec: print('读音全对上了' if not bad else f'还有 {len(bad)} 句对不上，见 检查.md：{bad}')

if not a.no_video:
    mp4 = os.path.join(a.out, '旁白试听.mp4')
    style = f"FontName={FONT_NAME},FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=60"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x1b1b1f:s=1280x720:r=10:d={total:.2f}', '-i', out_wav,
                    '-vf', f"subtitles={srt}:force_style='{style}'", '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '160k', '-shortest', mp4], check=True)
    print('->', mp4)
