"""用 MiniMax image-01 生成角色图（可以带一张角色参考图）。

    python3 tools/wojak/gen_images.py jobs.json <输出目录> [参考图.png]

jobs.json：[[名字, 英文提示词, 画幅, 张数], ...]。画幅写比例（如 "2:3"）或像素（如 "1440x1280"，512–2048、8 的倍数）。输出 <名字>_<序号>.jpg。
api.minimaxi.com 的密钥由环境的代理自动加上，不用自己填。
"""
import base64, concurrent.futures as cf, io, json, os, subprocess, sys, time
from PIL import Image

jobs, out = json.load(open(sys.argv[1], encoding='utf-8')), sys.argv[2]
os.makedirs(out, exist_ok=True)
ref = None
if len(sys.argv) > 3:
    buf = io.BytesIO(); Image.open(sys.argv[3]).convert('RGB').save(buf, 'JPEG', quality=92)
    ref = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

def run(req):                                                             # 一次请求只要一张（一次要好几张时，返回的数据太大，常常断掉）
    name, prompt, aspect, i = req
    body = {'model': 'image-01', 'prompt': prompt, 'response_format': 'base64', 'n': 1, 'prompt_optimizer': False}
    if 'x' in aspect: body['width'], body['height'] = map(int, aspect.split('x'))
    else: body['aspect_ratio'] = aspect
    if ref: body['subject_reference'] = [{'type': 'character', 'image_file': ref}]
    req_path = os.path.join(out, f'_{name}_{i}.json'); json.dump(body, open(req_path, 'w'))
    for attempt in range(3):                                                 # 偶尔会空着返回，重试两次
        res = subprocess.run(['curl', '-sS', '-m', '300', 'https://api.minimaxi.com/v1/image_generation', '-H', 'Content-Type: application/json', '-d', '@' + req_path], capture_output=True, text=True)
        try: r = json.loads(res.stdout); break
        except ValueError: r = None; time.sleep(5)
    os.remove(req_path)
    if r is None: return f'{name}_{i}: 没有拿到结果 {res.stderr.strip()[:200]}'
    imgs = (r.get('data') or {}).get('image_base64') or []
    for b in imgs: open(os.path.join(out, f'{name}_{i}.jpg'), 'wb').write(base64.b64decode(b))
    return f"{name}_{i}: {r.get('base_resp')}"

reqs = [(name, prompt, aspect, i) for name, prompt, aspect, n in jobs for i in range(n)]
with cf.ThreadPoolExecutor(2) as ex:
    for s in ex.map(run, reqs): print(s, flush=True)
