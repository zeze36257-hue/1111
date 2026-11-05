"""用火山方舟的 Seedance 把一张图做成一段会动的镜头（图生视频）。

    python3 tools/ark/gen_video.py 首帧.jpg '提示词' 输出.mp4 [--model ID] [--duration 5] [--resolution 720p] [--ratio 16:9] [--last 尾帧.jpg]

- 默认模型 doubao-seedance-2-0-mini-260615（便宜，最高 720p）。最要紧的镜头换标准版：--model doubao-seedance-2-0-260128。
  方舟上的模型 ID 用 GET https://ark.cn-beijing.volces.com/api/v3/models 能查到。
- 流程：创建任务 → 每 10 秒查一次 → 成功后从返回的地址下载 mp4。
  - 这几步每次请求都很快，不怕代理的 30 秒限制（同步出图的 5.0-pro 就是被这个卡住的）；
  - 下载地址在 *.volces.com 下面，要在环境的 Allowed domains 里放开。
- 不要声音：我们自己配音效和音乐（generate_audio 关掉）。
- 密钥：环境的 Network secrets 里加了 ark.cn-beijing.volces.com 的 Bearer 密钥，代理会自动带上；有 ARK_API_KEY 环境变量也行。
"""
import argparse, base64, io, json, os, sys, time, urllib.request, urllib.error
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('first'); ap.add_argument('prompt'); ap.add_argument('out')
ap.add_argument('--model', default='doubao-seedance-2-0-mini-260615')
ap.add_argument('--duration', type=int, default=5); ap.add_argument('--resolution', default='720p'); ap.add_argument('--ratio', default='16:9')
ap.add_argument('--last', default=None)
a = ap.parse_args()

API = 'https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks'
HDR = {'Content-Type': 'application/json'}
if os.environ.get('ARK_API_KEY'): HDR['Authorization'] = 'Bearer ' + os.environ['ARK_API_KEY']


def data_url(path):
    im = Image.open(path).convert('RGB')
    if max(im.size) > 2560: im.thumbnail((2560, 2560))
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=92)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def call(url, body=None):
    rq = urllib.request.Request(url, json.dumps(body).encode() if body is not None else None, HDR, method='POST' if body is not None else 'GET')
    try:
        return json.load(urllib.request.urlopen(rq, timeout=60))
    except urllib.error.HTTPError as e:
        sys.exit(f'HTTP {e.code}: {e.read()[:500].decode("utf-8", "ignore")}')


content = [{'type': 'text', 'text': a.prompt},
           {'type': 'image_url', 'image_url': {'url': data_url(a.first)}, 'role': 'first_frame'}]
if a.last: content.append({'type': 'image_url', 'image_url': {'url': data_url(a.last)}, 'role': 'last_frame'})
body = {'model': a.model, 'content': content, 'duration': a.duration, 'resolution': a.resolution, 'ratio': a.ratio,
        'watermark': False, 'generate_audio': False}
task = call(API, body)
tid = task.get('id'); print('任务', tid, flush=True)
t0 = time.time()
while True:
    time.sleep(10)
    r = call(f'{API}/{tid}')
    st = r.get('status')
    if st == 'succeeded': break
    if st in ('failed', 'cancelled', 'expired'): sys.exit(f'失败：{json.dumps(r, ensure_ascii=False)[:600]}')
    print(f'  {st} {time.time() - t0:.0f}s', flush=True)
vurl = (r.get('content') or {}).get('video_url')
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
with urllib.request.urlopen(vurl, timeout=300) as resp, open(a.out, 'wb') as f: f.write(resp.read())
print('->', a.out, f'{time.time() - t0:.0f}s', json.dumps(r.get('usage', {}), ensure_ascii=False))
