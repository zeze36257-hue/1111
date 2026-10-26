"""用 MiniMax image-01 生成角色图（可以带一张角色参考图）。

    python3 tools/wojak/gen_images.py jobs.json <输出目录> [参考图.png]

jobs.json：[[名字, 英文提示词, 画幅比例如 "2:3", 张数], ...]。输出 <名字>_<序号>.jpg。
api.minimaxi.com 的密钥由环境的代理自动加上，不用自己填。
"""
import base64, concurrent.futures as cf, io, json, os, subprocess, sys
from PIL import Image

jobs, out = json.load(open(sys.argv[1], encoding='utf-8')), sys.argv[2]
os.makedirs(out, exist_ok=True)
ref = None
if len(sys.argv) > 3:
    buf = io.BytesIO(); Image.open(sys.argv[3]).convert('RGB').save(buf, 'JPEG', quality=92)
    ref = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

def run(job):
    name, prompt, aspect, n = job
    body = {'model': 'image-01', 'prompt': prompt, 'aspect_ratio': aspect, 'response_format': 'base64', 'n': n, 'prompt_optimizer': False}
    if ref: body['subject_reference'] = [{'type': 'character', 'image_file': ref}]
    req = os.path.join(out, f'_{name}.json'); json.dump(body, open(req, 'w'))
    res = subprocess.run(['curl', '-sS', '-m', '300', 'https://api.minimaxi.com/v1/image_generation', '-H', 'Content-Type: application/json', '-d', '@' + req], capture_output=True, text=True).stdout
    os.remove(req)
    r = json.loads(res); imgs = (r.get('data') or {}).get('image_base64') or []
    for i, b in enumerate(imgs): open(os.path.join(out, f'{name}_{i}.jpg'), 'wb').write(base64.b64decode(b))
    return f"{name}: {r.get('base_resp')} {len(imgs)} 张"

with cf.ThreadPoolExecutor(4) as ex:
    for s in ex.map(run, jobs): print(s, flush=True)
