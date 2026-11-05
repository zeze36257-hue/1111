"""MiniMax 音色设计：用一段文字描述想要的声音，生成一个新声音，并拿到一段试听。

    python3 tools/voice/design.py 名字 '声音的描述' '试听要读的文字' [输出目录]

- 接口：POST https://api.minimaxi.com/v1/voice_design，body 是 {"prompt": 描述, "preview_text": 试听文字}。
  返回 voice_id（像 ttv-voice-2026110508401026-kAVaXtXg）和 trial_audio（十六进制的 mp3）。
- 写出 名字.json（voice_id 等，不含音频）和 名字.mp3（试听）。
- 拿到的 voice_id 跟系统声音一样用：meta.json 的 voice 写 {"id": voice_id, "model": "speech-2.8-hd"}。
- 按我知道的规则（没核对官方页面）：
  - 设计出来的声音跟克隆的一样是临时的，7 天内不拿去正式合成一次就会被删；
  - 第一次拿去合成时可能要另收一次音色费。所以只合成选中的那个。
- 11 月 5 日照频道主发的参考视频（沃铁熊）的旁白设计了 4 个，见 refs/讲故事/说书声音.md 的“音色设计”。
"""
import json, os, sys, urllib.request, urllib.error
name, prompt, text = sys.argv[1], sys.argv[2], sys.argv[3]
out = sys.argv[4] if len(sys.argv) > 4 else '.'
os.makedirs(out, exist_ok=True)
req = urllib.request.Request('https://api.minimaxi.com/v1/voice_design', json.dumps({'prompt': prompt, 'preview_text': text}).encode(),
                             {'Content-Type': 'application/json'})
try:
    r = json.load(urllib.request.urlopen(req, timeout=300))
except urllib.error.HTTPError as e:
    sys.exit(f'HTTP {e.code}: {e.read()[:500]}')
audio = r.pop('trial_audio', None)
r['prompt'] = prompt
json.dump(r, open(os.path.join(out, name + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
if audio: open(os.path.join(out, name + '.mp3'), 'wb').write(bytes.fromhex(audio))
print(name, r.get('voice_id'), r.get('base_resp'))
