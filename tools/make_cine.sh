#!/usr/bin/env bash
# 电影感引擎（第三季起）的一键出片：片头 + 正片 + 片尾（片尾预告取自 meta.json 的 "next"）。
# meta.json 里 "intro": false 时不加片头，第一帧就是正片（No.46 起：前两秒不放片头，直接进内容）；"outro": false 时不加片尾（读文案视频起）。
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

# 片尾：写入下期预告，更新字体子集，导出。meta.json 里 "outro": false 时不要片尾（读文案视频起）
OUTRO=$(python3 -c "import json,sys;print(int(json.load(open(sys.argv[1],encoding='utf-8')).get('outro', True)))" "$EP/meta.json")
if [ "$OUTRO" = 1 ]; then
python3 - "$ROOT/brand/index.html" "$NEXT" <<'PY'
import re, sys
p, nxt = sys.argv[1], sys.argv[2]
s = open(p, encoding='utf-8').read()
s = re.sub(r"^const NEXT = .*$", "const NEXT = '" + nxt.replace("'", "\\'") + "';", s, flags=re.M)
open(p, 'w', encoding='utf-8').write(s)
PY
(cd "$ROOT/brand" && python3 fetch_fonts.py >/dev/null && node export.cjs --workers 2 --query outro=1 --audio outro.wav --out "$EP/outro_raw.mp4" | tail -1)
fi

INTRO=$(python3 -c "import json,sys;print(int(json.load(open(sys.argv[1],encoding='utf-8')).get('intro', True)))" "$EP/meta.json")
V='fps=30,format=yuv420p,setsar=1'; A='aresample=48000,aformat=channel_layouts=stereo'
# 按顺序接起来：（片头）+ 正片 +（片尾）
INPUTS=(); [ "$INTRO" = 1 ] && INPUTS+=("$ROOT/brand/片头_黑猫不说话.mp4"); INPUTS+=("$EP/body.mp4"); [ "$OUTRO" = 1 ] && INPUTS+=("$EP/outro_raw.mp4")
ARGS=(); FILT=''; CAT=''
for i in "${!INPUTS[@]}"; do ARGS+=(-i "${INPUTS[$i]}"); FILT+="[$i:v]$V[v$i];[$i:a]$A[a$i];"; CAT+="[v$i][a$i]"; done
ffmpeg -loglevel error -y "${ARGS[@]}" -filter_complex "${FILT}${CAT}concat=n=${#INPUTS[@]}:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -maxrate 4500k -bufsize 9000k -preset slow -profile:v high -c:a aac -b:a 256k -movflags +faststart "$EP/$OUT"
rm -f "$EP/body.mp4" "$EP/outro_raw.mp4"
# 码率上限 4.5 Mbps：真实照片加颗粒很占码率，不封顶的话 2 分半就超过 GitHub 单个文件 100 MB 的上限（抖音上传后也会重新压缩）
printf 'shots/\naudio.wav\naudio_raw.wav\ncues.json\nbody.mp4\noutro_raw.mp4\nout.mp4\n__pycache__/\n' > "$EP/.gitignore"
if [ -f "$EP/music.py" ]; then echo 'bgm.wav' >> "$EP/.gitignore"; fi
echo "done: $EP/$OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/$OUT")s)"
