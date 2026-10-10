#!/usr/bin/env bash
# 一键出片：片头 + 正片 + 片尾（片尾预告下一期）。
#
#   tools/make_episode.sh <episode-dir> <成片文件名.mp4> "<片尾的下期预告>"
#
# 例：tools/make_episode.sh no6 窝里横_No6.mp4 "下一期 · No.7《精神内耗：一半的时间，你不在这儿》"
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EP="$(cd "$1" && pwd)"; OUT="$2"; NEXT="$3"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"

python3 "$ROOT/tools/build_page.py" "$EP"
cp -n "$ROOT/tools/export.cjs" "$ROOT/tools/fetch_fonts.py" "$EP/" 2>/dev/null || true
(cd "$EP" && python3 fetch_fonts.py >/dev/null)

TOTAL=$(python3 -c "import json;print(json.load(open('$EP/meta.json'))['total'])")
if [ ! -f "$EP/bgm_cut.wav" ]; then                       # 背景音乐：截到正片长度，最后 3 秒淡出
  ffmpeg -loglevel error -y -i "$ROOT/video2/bgm.m4a" -t "$TOTAL" \
    -af "afade=t=in:st=0:d=0.05,afade=t=out:st=$(python3 -c "print($TOTAL-3)"):d=3,loudnorm=I=-14:TP=-1.5:LRA=11" -ar 44100 "$EP/bgm_cut.wav"
fi
(cd "$EP" && node export.cjs --workers 4 --audio bgm_cut.wav --out body.mp4 | tail -1)

# 片尾：写入下期预告，更新字体子集，导出
python3 - "$ROOT/brand/index.html" "$NEXT" <<'PY'
import re, sys
p, nxt = sys.argv[1], sys.argv[2]
s = open(p, encoding='utf-8').read()
s = re.sub(r"^const NEXT = .*$", "const NEXT = '" + nxt.replace("'", "\\'") + "';", s, flags=re.M)
open(p, 'w', encoding='utf-8').write(s)
PY
(cd "$ROOT/brand" && python3 fetch_fonts.py >/dev/null && node export.cjs --workers 2 --query outro=1 --audio outro.wav --out "$EP/outro_raw.mp4" | tail -1)

ffmpeg -loglevel error -y -i "$ROOT/brand/片头_黑猫不说话.mp4" -i "$EP/body.mp4" -i "$EP/outro_raw.mp4" -filter_complex \
  "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]fps=30,format=yuv420p,setsar=1[v1];[2:v]fps=30,format=yuv420p,setsar=1[v2];[0:a]aresample=44100,aformat=channel_layouts=stereo[a0];[1:a]aresample=44100,aformat=channel_layouts=stereo[a1];[2:a]aresample=44100,aformat=channel_layouts=stereo[a2];[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 20 -preset slow -profile:v high -c:a aac -b:a 192k -movflags +faststart "$EP/$OUT"
rm -f "$EP/body.mp4" "$EP/outro_raw.mp4"
printf 'shots/\nbgm_cut.wav\nbody.mp4\noutro_raw.mp4\nout.mp4\n__pycache__/\n' > "$EP/.gitignore"
echo "done: $EP/$OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/$OUT")s)"
