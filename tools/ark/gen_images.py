"""用火山方舟的 Seedream（即梦背后的模型）生成图片，可以带多张参考图（让人物每张都一样）。

    python3 tools/ark/gen_images.py jobs.json <输出目录> [参考图1 参考图2 ...]

jobs.json：[[名字, 提示词, 尺寸, 张数], ...]。尺寸写 "1080x1920" 这种像素，或 "2K"。输出 <名字>_<序号>.jpg。

要先在环境设置里：
- 放开 ark.cn-beijing.volces.com；
- 加 ARK_API_KEY（火山方舟控制台创建的 API Key）。
新会话才会生效。

**还没测过**（11 月 2 日写的时候没有密钥）。第一次用时要核对：
- 模型 ID：环境变量 ARK_IMAGE_MODEL，默认 doubao-seedream-4-0-250828，以方舟控制台“模型广场”里开通的为准；
- response_format=b64_json 能不能用。
  - 不能用就改成 url，再请频道主放开下载地址的域名（返回的地址里能看到）。
"""
import base64, concurrent.futures as cf, io, json, os, sys, time, urllib.request
from PIL import Image

jobs, out = json.load(open(sys.argv[1], encoding='utf-8')), sys.argv[2]
os.makedirs(out, exist_ok=True)
refs = []
for p in sys.argv[3:]:
    buf = io.BytesIO(); Image.open(p).convert('RGB').save(buf, 'JPEG', quality=92)
    refs.append('data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode())
KEY, MODEL = os.environ.get('ARK_API_KEY'), os.environ.get('ARK_IMAGE_MODEL', 'doubao-seedream-4-0-250828')
if not KEY: sys.exit('没有 ARK_API_KEY：请频道主在环境设置里加上（新会话才生效）')

def run(req):
    name, prompt, size, i = req
    body = {'model': MODEL, 'prompt': prompt, 'size': size, 'response_format': 'b64_json', 'watermark': False}
    if refs: body['image'] = refs if len(refs) > 1 else refs[0]
    rq = urllib.request.Request('https://ark.cn-beijing.volces.com/api/v3/images/generations', json.dumps(body).encode(),
                                {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY})
    for attempt in range(3):
        try:
            r = json.load(urllib.request.urlopen(rq, timeout=300)); break
        except Exception as e:
            err = getattr(e, 'read', lambda: b'')().decode('utf-8', 'ignore')[:300] or str(e); r = None; time.sleep(5)
    if r is None: return f'{name}_{i}: 失败 {err}'
    for d in r.get('data') or []:
        if d.get('b64_json'): open(os.path.join(out, f'{name}_{i}.jpg'), 'wb').write(base64.b64decode(d['b64_json']))
        elif d.get('url'): return f"{name}_{i}: 返回的是下载地址 {d['url'][:120]}（要放开这个域名，或者改用 b64_json）"
    return f"{name}_{i}: ok {r.get('usage', '')}"

reqs = [(name, prompt, size, i) for name, prompt, size, n in jobs for i in range(n)]
with cf.ThreadPoolExecutor(2) as ex:
    for s in ex.map(run, reqs): print(s, flush=True)
