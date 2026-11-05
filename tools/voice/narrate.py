"""合成一整条旁白：一句一句合成，句子之间按稿子里写的时间留白；再出一条带字幕的试听视频。

    python3 tools/voice/narrate.py 稿子.txt 输出目录 [--voice ID] [--speed 1.0] [--no-video]

讲故事的规矩（频道主 11 月 5 日定的）：
- 语速正常，像他发的参考视频那样，不刻意放慢（speed 1.0）；
- 话跟话之间留白，等一会儿再说，营造氛围；
- 画面是画面，话是话：旁白单独做成一条，画面另外剪，不用一句话对一个画面。

稿子.txt 的写法：
- 一行一句（字幕也按这一行出）；
- 行尾写 `|2.5`：这句说完停 2.5 秒。不写就用默认：句子之间停 0.8 秒；
- 空行是分段：段落之间至少停 1.8 秒；
- `#` 开头的行是注释或小标题，不读；
- 读法跟写法不一样的，写成 `{字幕上显示的|配音读的}`，比如 `{1902|一九零二} 年`。

输出：
- 输出目录/clips/：每句一个 mp3，按“读的文字 + 声音设置”缓存，改了哪句只重新合成哪句；
- 输出目录/旁白.wav：整条旁白，响度拉到 -16 LUFS；
- 输出目录/旁白.srt：字幕时间；
- 输出目录/旁白试听.mp4：黑底 + 字幕，给频道主听（--no-video 不出）。

声音默认是 11 月 5 日选定的音色设计 1 号“温和自然”。外语系统声音读中文时，这里会自动带 language_boost: "Chinese"。
"""
import argparse, hashlib, json, os, re, subprocess, time, urllib.request
import numpy as np
import scipy.io.wavfile as wf

VOICE = 'ttv-voice-2026110508401026-kAVaXtXg'
SENT_GAP, PARA_GAP = 0.8, 1.8
SR = 48000
FONT_NAME = 'WenQuanYi Zen Hei'

ap = argparse.ArgumentParser()
ap.add_argument('script'); ap.add_argument('out')
ap.add_argument('--voice', default=VOICE); ap.add_argument('--speed', type=float, default=1.0)
ap.add_argument('--model', default='speech-2.8-hd'); ap.add_argument('--no-video', action='store_true')
a = ap.parse_args()
os.makedirs(os.path.join(a.out, 'clips'), exist_ok=True)

# ---------- 读稿子 ----------
lines, para = [], False                       # [显示的字, 读的字, 说完停多久]
for raw in open(a.script, encoding='utf-8'):
    s = raw.strip()
    if not s:
        para = True; continue
    if s.startswith('#'): continue
    pause = None
    m = re.search(r'\|\s*([\d.]+)\s*$', s)
    if m: pause, s = float(m.group(1)), s[:m.start()].rstrip()
    say = re.sub(r'\{([^{}|]*)\|([^{}]*)\}', lambda m: m.group(2), s)
    s = re.sub(r'\{([^{}|]*)\|([^{}]*)\}', lambda m: m.group(1), s)
    if para and lines: lines[-1][2] = max(lines[-1][2], PARA_GAP)
    para = False
    lines.append([s.strip(), say.strip(), pause if pause is not None else SENT_GAP])
if para and lines: lines[-1][2] = max(lines[-1][2], PARA_GAP)

# ---------- 合成（有缓存） ----------
idx_path = os.path.join(a.out, 'clips', 'index.json')
idx = json.load(open(idx_path, encoding='utf-8')) if os.path.exists(idx_path) else {}
setting = {'voice': a.voice, 'speed': a.speed, 'model': a.model}


def synth(text):
    body = {'model': a.model, 'text': text, 'stream': False,
            'voice_setting': {'voice_id': a.voice, 'speed': a.speed, 'vol': 1, 'pitch': 0},
            'audio_setting': {'sample_rate': 44100, 'format': 'mp3', 'bitrate': 256000, 'channel': 1}}
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


for i, (show, say, _) in enumerate(lines):
    key = hashlib.sha1(json.dumps([say, setting], ensure_ascii=False).encode()).hexdigest()[:12]
    name = f'{i:03d}_{key}.mp3'
    if idx.get(key) and os.path.exists(os.path.join(a.out, 'clips', idx[key])): continue
    open(os.path.join(a.out, 'clips', name), 'wb').write(synth(say))
    idx[key] = name
    json.dump(idx, open(idx_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{i + 1}/{len(lines)}', say, flush=True)


def load(path):                                # 解码、去掉首尾静音（留 40 ms）
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
    x = np.frombuffer(p.stdout, np.int16).astype(np.float32) / 32768
    hop = SR // 100
    e = np.array([np.sqrt((x[j:j + hop] ** 2).mean() + 1e-12) for j in range(0, len(x) - hop, hop)])
    on = np.where(20 * np.log10(e) > -45)[0]
    if not len(on): return x
    s, t = max(0, on[0] * hop - SR // 25), min(len(x), (on[-1] + 1) * hop + SR // 25)
    return x[s:t]


# ---------- 拼起来 ----------
LEAD = 1.0
parts, subs, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
for show, say, pause in lines:
    key = hashlib.sha1(json.dumps([say, setting], ensure_ascii=False).encode()).hexdigest()[:12]
    x = load(os.path.join(a.out, 'clips', idx[key]))
    d = len(x) / SR
    subs.append((t, t + d, show))
    parts += [x, np.zeros(int(pause * SR), np.float32)]
    t += d + pause
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
print(f'{len(lines)} 句，旁白 {total:.1f} 秒（说话 {sum(e - b for b, e, _ in subs):.1f} 秒，留白 {total - sum(e - b for b, e, _ in subs):.1f} 秒）')

if not a.no_video:
    mp4 = os.path.join(a.out, '旁白试听.mp4')
    style = f"FontName={FONT_NAME},FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=60"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x1b1b1f:s=1280x720:r=10:d={total:.2f}', '-i', out_wav,
                    '-vf', f"subtitles={srt}:force_style='{style}'", '-c:v', 'libx264', '-tune', 'stillimage', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '160k', '-shortest', mp4], check=True)
    print('->', mp4)
