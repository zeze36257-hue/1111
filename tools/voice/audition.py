"""在 MiniMax 里试声音：每个候选声音读同一段中文，再打分（中文念得清不清楚、起伏、语速）。

    python3 tools/voice/audition.py 候选.txt 输出目录 ['要读的文字']

- 候选.txt 每行一个：`voice_id|说明`，比如 `Spanish_Jovialman|沙哑快活的老人（西班牙语）`。
- 外语声音也能读中文：请求里写 `language_boost: "Chinese"`。11 月 3 日试的 54 个，中文都念得清楚。
- 账号的声音列表（/v1/get_voice）里没有的一些声音也能用，比如 `audiobook_male_2`、`English_expressive_narrator`。
- MiniMax 每分钟请求数有限（1002 rate limit），这里会等一会儿再试；已经合成过的跳过。
- 打分：
  - 错字率：用 SenseVoice 把录音认成字，跟原文比。要先准备：
    `pip install sherpa-onnx`，再下载
    https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2025-09-09.tar.bz2
    解压，把目录写进环境变量 `SENSEVOICE_DIR`。没有这个模型就不算错字率。
  - 起伏、语速：用 tools/voice/analyze.py 量。起伏是音高 5%–95% 跨几个半音，“温润男声”是 10 个左右。
- 结果写在 输出目录/scores.json；试听视频用 tools/voice/audition_video.py 做。
"""
import json, os, re, subprocess, sys, time, urllib.request
import numpy as np
import scipy.io.wavfile as wf

cands, out = sys.argv[1], sys.argv[2]
TEXT = sys.argv[3] if len(sys.argv) > 3 else ('一九零二年，美国西部的一个小镇。一张通缉令摆在桌上，屋里的法警，没有一个人伸手。<#0.6#>'
                                             '最后，一个六十多岁的老法警走过来，把它拿了起来。<#0.5#>他说：“这是我的事。”')
ANA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'analyze.py')
os.makedirs(out, exist_ok=True)
fname = lambda vid: os.path.join(out, re.sub(r'[ ()]', '_', vid) + '.mp3')
desc = dict(l.rstrip('\n').split('|', 1) for l in open(cands, encoding='utf-8') if '|' in l)


def synth(vid, path):
    body = {'model': 'speech-2.8-hd', 'text': TEXT, 'stream': False, 'language_boost': 'Chinese',
            'voice_setting': {'voice_id': vid, 'speed': 1.0, 'vol': 1, 'pitch': 0},
            'audio_setting': {'sample_rate': 44100, 'format': 'mp3', 'bitrate': 256000, 'channel': 1}}
    for k in range(8):
        if k: time.sleep(5 * k)
        try:
            r = json.load(urllib.request.urlopen(urllib.request.Request('https://api.minimaxi.com/v1/t2a_v2', json.dumps(body).encode(),
                                                                        {'Content-Type': 'application/json'}), timeout=180))
        except Exception as e:
            print(vid, 'ERR', e); continue
        c = r['base_resp']['status_code']
        if c == 0:
            open(path, 'wb').write(bytes.fromhex(r['data']['audio'])); return True
        print(vid, r['base_resp'])
        if c != 1002: return False
    return False


for vid in desc:
    if not os.path.exists(fname(vid)): synth(vid, fname(vid))

rec = None
if os.environ.get('SENSEVOICE_DIR'):
    import sherpa_onnx
    M = os.environ['SENSEVOICE_DIR']
    rec = sherpa_onnx.OfflineRecognizer.from_sense_voice(model=f'{M}/model.int8.onnx', tokens=f'{M}/tokens.txt', language='zh', use_itn=False, num_threads=4)
han = lambda s: ''.join(re.findall(r'[一-鿿]', re.sub(r'<#[\d.]+#>', '', s)))
REF = han(TEXT)


def ed(a, b):
    d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        p, d[0] = d[0], i
        for j, cb in enumerate(b, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (ca != cb))
    return d[-1]


rows = []
for vid, ds in desc.items():
    f = fname(vid)
    if not os.path.exists(f): rows.append({'vid': vid, 'desc': ds, 'missing': True}); continue
    w16, w48 = f[:-4] + '.16k.wav', f[:-4] + '.48k.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ac', '1', '-ar', '16000', w16], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ac', '1', '-ar', '48000', w48], check=True)
    r = {'vid': vid, 'desc': ds}
    if rec:
        sr, x = wf.read(w16)
        s = rec.create_stream(); s.accept_waveform(sr, x.astype(np.float32) / 32768); rec.decode_stream(s)
        r['cer'] = round(ed(REF, han(s.result.text)) / len(REF), 3)
    a = subprocess.run(['python3', ANA, w48, str(len(REF))], capture_output=True, text=True).stdout
    m1 = re.search(r'中位数 (\d+) Hz.*?跨 ([\d.]+) 个半音', a); m2 = re.search(r'只算说话的时间 (\d+) 字/分钟', a)
    r.update(f0=int(m1.group(1)), range=float(m1.group(2)), rate=int(m2.group(1)))
    rows.append(r); print(r, flush=True)
json.dump(rows, open(os.path.join(out, 'scores.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
