"""按 shots.py 出图、做动画。已经有的跳过；想重画哪张，删掉 img/名字.jpg 再跑。

    python3 gen.py images        # 出图（Seedream 5.0 flash，2560×1440，3 张一起）
    python3 gen.py clips         # 做动画（Seedance 2.0 mini，720p，3 段一起）
    python3 gen.py images o3 d2  # 只出这几张
"""
import base64, concurrent.futures as cf, io, json, os, subprocess, sys, time, urllib.request, urllib.error
from PIL import Image
from shots import IMAGES, CLIPS, STYLE

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
os.makedirs('img', exist_ok=True); os.makedirs('clips', exist_ok=True)
MODEL = 'doubao-seedream-5-0-flash-260915'


def data_url(path):
    buf = io.BytesIO(); Image.open(path).convert('RGB').save(buf, 'JPEG', quality=90)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()


def gen_image(name):
    out = f'img/{name}.jpg'
    if os.path.exists(out): return f'{name}: 已有'
    prompt, refs = IMAGES[name]
    body = {'model': MODEL, 'prompt': prompt + STYLE, 'size': '2560x1440', 'response_format': 'b64_json', 'watermark': False}
    if refs: body['image'] = [data_url(r) for r in refs] if len(refs) > 1 else data_url(refs[0])
    err = ''
    for k in range(3):
        try:
            rq = urllib.request.Request('https://ark.cn-beijing.volces.com/api/v3/images/generations', json.dumps(body).encode(),
                                        {'Content-Type': 'application/json'})
            r = json.load(urllib.request.urlopen(rq, timeout=120))
            open(out, 'wb').write(base64.b64decode(r['data'][0]['b64_json']))
            return f'{name}: ok'
        except urllib.error.HTTPError as e:
            err = e.read()[:300].decode('utf-8', 'ignore')
        except Exception as e:
            err = str(e)
        time.sleep(5 * (k + 1))
    return f'{name}: 失败 {err}'


def gen_clip(name):
    out = f'clips/{name}.mp4'
    if os.path.exists(out): return f'{name}: 已有'
    img, prompt, sec = CLIPS[name]
    p = subprocess.run(['python3', '../tools/ark/gen_video.py', f'img/{img}.jpg', prompt, out, '--duration', str(sec), '--resolution', '720p'],
                       capture_output=True, text=True)
    return f'{name}: ' + (p.stdout.strip().splitlines()[-1] if p.returncode == 0 else '失败 ' + (p.stderr or p.stdout)[-300:])


what = sys.argv[1]
names = sys.argv[2:] or (list(IMAGES) if what == 'images' else list(CLIPS))
fn = gen_image if what == 'images' else gen_clip
with cf.ThreadPoolExecutor(3) as ex:
    for s in ex.map(fn, names): print(s, flush=True)
