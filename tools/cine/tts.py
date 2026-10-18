"""Synthesize an episode's narration with MiniMax TTS (国内版 api.minimaxi.com).

    python tools/cine/tts.py <episode-dir>

Reads LINES and BIGLINES from <episode-dir>/scenes.js and "voice" from meta.json
({"id": voice_id, "model": ..., "speed": ..., "pitch": ...}). Each line becomes <episode-dir>/voice/NN.mp3, cached by
text + settings (voice/index.json), so a re-render only calls the API for lines that changed. A line that comes out
longer than the time it has (until the next line starts) starts up to 1 s early if the previous line left a gap, and
is otherwise synthesized again, faster (up to 1.3x). If it still does not fit, it runs over and the next line waits
for it (a short delay, never two voices at once).
"say" in the voice settings maps text to how it should be read, e.g. {"120": "幺二零"}.
tools/cine/audio.py then places the clips at their start times and ducks the music under them.
The API key is not needed here: the proxy injects it for api.minimaxi.com (or set MINIMAX_API_KEY).
"""
import hashlib, json, os, re, subprocess, sys, time, urllib.request

API = 'https://api.minimaxi.com/v1/t2a_v2'
ep = os.path.abspath(sys.argv[1])
meta = json.load(open(os.path.join(ep, 'meta.json'), encoding='utf-8'))
src = open(os.path.join(ep, 'scenes.js'), encoding='utf-8').read()
v = meta['voice']
out_dir = os.path.join(ep, 'voice'); os.makedirs(out_dir, exist_ok=True)
idx_path = os.path.join(out_dir, 'index.json')
idx = json.load(open(idx_path, encoding='utf-8')) if os.path.exists(idx_path) else {}


def block(name):
    m = re.search(r'const ' + name + r' = \[(.*?)\n\];', src, re.S)
    return re.findall(r"\[([\d.]+), ([\d.]+), '([^']+)'\]", m.group(1)) if m else []


total = json.load(open(os.path.join(ep, 'cues.json'), encoding='utf-8'))['total']   # 正片长度（export.cjs --cues 写的）
rows = sorted((float(a), float(b), t) for a, b, t in block('LINES') + block('BIGLINES'))


def synth(text, speed):
    body = {'model': v.get('model', 'speech-2.8-hd'), 'text': text, 'stream': False,
            'voice_setting': {'voice_id': v['id'], 'speed': round(speed, 3), 'vol': 1, 'pitch': v.get('pitch', 0)},
            'audio_setting': {'sample_rate': 44100, 'format': 'mp3', 'bitrate': 256000, 'channel': 1}}
    if v.get('emotion'): body['voice_setting']['emotion'] = v['emotion']
    hdr = {'Content-Type': 'application/json'}
    if os.environ.get('MINIMAX_API_KEY'): hdr['Authorization'] = 'Bearer ' + os.environ['MINIMAX_API_KEY']
    for attempt in range(8):
        if attempt: time.sleep(min(60, 4 * 2 ** attempt))                  # 1002 = 每分钟请求数超限，等一会儿再试
        try:
            r = json.load(urllib.request.urlopen(urllib.request.Request(API, json.dumps(body).encode(), hdr), timeout=120))
            if r['base_resp']['status_code'] == 0: return bytes.fromhex(r['data']['audio'])
            err = r['base_resp']
        except Exception as e:
            err = e
    raise RuntimeError(f'TTS failed for {text!r}: {err}')


def spoken(path):                                  # 去掉首尾静音后的时长
    s = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
                        'silenceremove=start_periods=1:start_threshold=-45dB,areverse', '-f', 'null', '-'], capture_output=True, text=True).stderr
    h, m, sec = re.findall(r'time=(\d+):(\d+):([\d.]+)', s)[-1]
    return int(h) * 3600 + int(m) * 60 + float(sec)


for i, (a, b, text) in enumerate(rows):
    room = (rows[i + 1][0] if i + 1 < len(rows) else total) - a - .15        # 到下一句开始之前说完
    say = text.replace('「', '').replace('」', '')
    for k_, r_ in v.get('say', {}).items(): say = say.replace(k_, r_)        # 读法，例如电话号码 120 读“幺二零”
    key = hashlib.sha1(json.dumps([say, v, round(room, 2)], ensure_ascii=False).encode()).hexdigest()[:12]
    name = f'{i:02d}.mp3'; path = os.path.join(out_dir, name)
    if idx.get(name, {}).get('key') == key and os.path.exists(path): continue
    prev = idx.get(f'{i - 1:02d}.mp3')
    lead = min(1.0, max(0, a - (prev['start'] + prev['dur'] + .3))) if prev else 0   # 上一句说完后空着的时间，可以提前一点开口
    speed = v.get('speed', 1.0)
    open(path, 'wb').write(synth(say, speed)); d = spoken(path)
    if d > room + lead:                                                    # 还是太长：按比例加快（最多 1.3 倍）再合成一次
        speed = min(1.3, speed * d / (room + lead) * 1.03)
        open(path, 'wb').write(synth(say, speed)); d = spoken(path)
    start = a - min(lead, max(0, d - room))
    if prev: start = max(start, prev['start'] + prev['dur'] + .15)        # 上一句超时了：等它说完再开口
    start = round(start, 2)
    idx[name] = {'key': key, 'start': start, 'text': text, 'speed': round(speed, 3), 'dur': round(d, 2), 'room': round(room, 2)}
    json.dump(idx, open(idx_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{name}  {start:6.2f}s  {d:4.2f}/{room:4.2f}s  x{speed:.2f}  {text}')
for name in list(idx):                                                     # 删掉多出来的旧句子
    if int(name[:2]) >= len(rows):
        idx.pop(name); os.path.exists(os.path.join(out_dir, name)) and os.remove(os.path.join(out_dir, name))
json.dump(idx, open(idx_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'voice: {len(rows)} lines in {out_dir}')
