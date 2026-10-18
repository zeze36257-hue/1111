#!/usr/bin/env bash
# 给已经出过片的一期加配音：画面不重新渲染，只换音轨（片头、片尾、下期预告都保持原样）。
#
#   tools/dub.sh <episode-dir> <成片文件名.mp4>
#
# 例：tools/dub.sh no50 英雄主义_No50.mp4
# meta.json 里要有 "voice"（见 tools/cine/tts.py）。正片的配乐 + 音效 + 配音由 tools/cine/audio.py 重新混一遍，
# 和原片音轨对齐后，替换掉正片那一段；片头、片尾的声音直接取自原片。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EP="$(cd "$1" && pwd)"; OUT="$2"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"

python3 "$ROOT/tools/build_cine.py" "$EP" >/dev/null
cp -n "$ROOT/tools/export.cjs" "$ROOT/tools/fetch_fonts.py" "$EP/" 2>/dev/null || true
(cd "$EP" && python3 fetch_fonts.py >/dev/null && node export.cjs --cues cues.json >/dev/null)
if [ -f "$EP/music.py" ]; then python3 "$EP/music.py" >/dev/null; fi
python3 "$ROOT/tools/cine/tts.py" "$EP" | tail -1
python3 "$ROOT/tools/cine/audio.py" "$EP"

python3 - "$EP" "$OUT" <<'PY'
import json, os, subprocess, sys
import numpy as np
from scipy.signal import fftconvolve
ep, out = sys.argv[1], sys.argv[2]
src = os.path.join(ep, out); tmp = os.path.join(ep, 'dub_tmp.mp4')
total = json.load(open(os.path.join(ep, 'cues.json'), encoding='utf-8'))['total']
SR = 8000
dec = lambda p, *a: np.frombuffer(subprocess.run(['ffmpeg', '-loglevel', 'error', *a, '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                                                 capture_output=True, check=True).stdout, np.float32).astype(float)
# 正片在原片里从哪儿开始：用新混的音轨（前 20 秒）去对原片的前 30 秒
new, old = dec(os.path.join(ep, 'audio.wav'), '-t', '20'), dec(src, '-t', '30')
r = fftconvolve(old, new[::-1], 'valid'); off = r.argmax() / SR
assert 1.0 < off < 4.0, f'body offset {off:.2f}s looks wrong'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-i', os.path.join(ep, 'audio.wav'), '-filter_complex',
                f'[0:a]atrim=0:{off:.4f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a0];'
                f'[1:a]atrim=0:{total:.4f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a1];'
                f'[0:a]atrim=start={off + total:.4f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo[a2];'
                '[a0][a1][a2]concat=n=3:v=0:a=1[a]', '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                '-movflags', '+faststart', tmp], check=True)
os.replace(tmp, src)
print(f'dubbed {src} (body at {off:.2f}s, {total:.2f}s long)')
PY
rm -f "$EP/audio.wav" "$EP/cues.json"
git -C "$EP" checkout -- index.html fonts 2>/dev/null || true                 # 只换音轨：页面和字体子集保持原样
