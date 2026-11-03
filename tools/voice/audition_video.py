"""把挑出来的声音接成一条试听视频：每个声音一张字卡（第几个、叫什么、一句说明、读的文字），后面跟它读的那段。

    python3 tools/voice/audition_video.py picks.json 片段目录 输出.mp4

片段目录是 tools/voice/audition.py 的输出目录。中间文件（字卡、分段）写在当前目录，所以在临时目录里运行。
读的文字改 TEXT（要跟 audition.py 读的一致）。
picks.json: [[voice_id, 标题, 说明], ...]"""
import json, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
FONT = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'
TEXT = '一九〇二年，美国西部的一个小镇。一张通缉令摆在桌上，屋里的法警，没有一个人伸手。最后，一个六十多岁的老法警走过来，把它拿了起来。他说：“这是我的事。”'
picks = json.load(open(sys.argv[1], encoding='utf-8')); CLIPS = sys.argv[2]; out = sys.argv[3]
W, H = 1280, 720
CIRC = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮'
def wrap(d, text, font, width):
    lines, cur = [], ''
    for ch in text:
        if d.textlength(cur + ch, font=font) > width: lines.append(cur); cur = ch
        else: cur += ch
    return lines + [cur] if cur else lines
def lufs(path):
    s = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', s)[-1])
parts = []
for i, (vid, title, note) in enumerate(picks):
    im = Image.new('RGB', (W, H), '#1b1b1f'); d = ImageDraw.Draw(im)
    f1, f2, f3, f4 = (ImageFont.truetype(FONT, s) for s in (60, 28, 30, 22))
    d.text((70, 50), '讲故事的声音 · 试听', font=f4, fill='#8c8c96')
    d.text((70, 112), f'{CIRC[i]} {title}', font=f1, fill='#ffffff')
    d.text((72, 200), note, font=f2, fill='#f2b13a')
    y = 290
    for ln in wrap(d, TEXT, f3, W - 150):
        d.text((72, y), ln, font=f3, fill='#c9c9d1'); y += 48
    d.text((72, H - 64), vid, font=f4, fill='#5d5d66')
    img = f'card_{i:02d}.png'; im.save(img)
    src = CLIPS + '/' + re.sub(r'[ ()]', '_', vid) + '.mp3'
    g = -16 - lufs(src)
    seg = f'seg_{i:02d}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'volume={g:.2f}dB,alimiter=limit=0.89:level=false,adelay=700,apad=pad_dur=1.2',
                    '-ar', '48000', '-ac', '2', seg], check=True)
    mp4 = f'seg_{i:02d}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', '10', '-i', img, '-i', seg, '-shortest', '-c:v', 'libx264',
                    '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', '10', '-c:a', 'aac', '-b:a', '160k', mp4], check=True)
    parts.append(mp4)
open('parts.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'parts.txt', '-c', 'copy', out], check=True)
print(out, subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip())
