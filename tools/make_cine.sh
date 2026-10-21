#!/usr/bin/env bash
# 电影感引擎（第三季起）的一键出片：片头 + 正片 + 片尾（片尾预告取自 meta.json 的 "next"）。
# meta.json 里 "intro": false 时不加片头，第一帧就是正片（No.46 起：前两秒不放片头，直接进内容）。
#
#   tools/make_cine.sh <episode-dir> <成片文件名.mp4>
#
# 例：tools/make_cine.sh no14 虚无主义_No14.mp4
# 正片的音乐和音效由 tools/cine/audio.py 生成；音乐来自 meta.json 的 music.src。
# 第 17 期起每期有自己的原创配乐：<episode-dir>/music.py 先写出 bgm.wav（见 tools/cine/sampler.py）。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EP="$(cd "$1" && pwd)"; OUT="$2"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
NEXT=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1],encoding='utf-8'))['next'])" "$EP/meta.json")

python3 "$ROOT/tools/build_cine.py" "$EP"
cp -n "$ROOT/tools/export.cjs" "$ROOT/tools/fetch_fonts.py" "$EP/" 2>/dev/null || true
(cd "$EP" && python3 fetch_fonts.py >/dev/null && node export.cjs --cues cues.json >/dev/null)
if [ -f "$EP/music.py" ]; then python3 "$EP/music.py"; fi                 # 这一期自己写的原创配乐 -> bgm.wav
if grep -q '"voice"' "$EP/meta.json"; then python3 "$ROOT/tools/cine/tts.py" "$EP"; fi   # 配音（MiniMax 国内版）-> voice/*.mp3
python3 "$ROOT/tools/cine/audio.py" "$EP"
python3 "$ROOT/tools/cine/voice_script.py" "$EP"                       # 配音稿.txt（成片时间）
(cd "$EP" && node export.cjs --workers 4 --audio audio.wav --out body.mp4 | tail -1)

# 片尾：写入下期预告，更新字体子集，导出
python3 - "$ROOT/brand/index.html" "$NEXT" <<'PY'
import re, sys
p, nxt = sys.argv[1], sys.argv[2]
s = open(p, encoding='utf-8').read()
s = re.sub(r"^const NEXT = .*$", "const NEXT = '" + nxt.replace("'", "\\'") + "';", s, flags=re.M)
open(p, 'w', encoding='utf-8').write(s)
PY
(cd "$ROOT/brand" && python3 fetch_fonts.py >/dev/null && node export.cjs --workers 2 --query outro=1 --audio outro.wav --out "$EP/outro_raw.mp4" | tail -1)

INTRO=$(python3 -c "import json,sys;print(int(json.load(open(sys.argv[1],encoding='utf-8')).get('intro', True)))" "$EP/meta.json")
V='fps=30,format=yuv420p,setsar=1'; A='aresample=48000,aformat=channel_layouts=stereo'
if [ "$INTRO" = 1 ]; then
  ffmpeg -loglevel error -y -i "$ROOT/brand/片头_黑猫不说话.mp4" -i "$EP/body.mp4" -i "$EP/outro_raw.mp4" -filter_complex \
    "[0:v]$V[v0];[1:v]$V[v1];[2:v]$V[v2];[0:a]$A[a0];[1:a]$A[a1];[2:a]$A[a2];[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset slow -profile:v high -c:a aac -b:a 256k -movflags +faststart "$EP/$OUT"
else                                                                     # 不要片头：正片 + 片尾
  ffmpeg -loglevel error -y -i "$EP/body.mp4" -i "$EP/outro_raw.mp4" -filter_complex \
    "[0:v]$V[v1];[1:v]$V[v2];[0:a]$A[a1];[1:a]$A[a2];[v1][a1][v2][a2]concat=n=2:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset slow -profile:v high -c:a aac -b:a 256k -movflags +faststart "$EP/$OUT"
fi
rm -f "$EP/body.mp4" "$EP/outro_raw.mp4"
printf 'shots/\naudio.wav\naudio_raw.wav\ncues.json\nbody.mp4\noutro_raw.mp4\nout.mp4\n__pycache__/\n' > "$EP/.gitignore"
if [ -f "$EP/music.py" ]; then echo 'bgm.wav' >> "$EP/.gitignore"; fi
echo "done: $EP/$OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/$OUT")s)"
