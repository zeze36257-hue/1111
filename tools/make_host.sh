#!/usr/bin/env bash
# 真人出镜格式（No.65 起）的一键出片：底版 + 提词版。
#
#   tools/make_host.sh <episode-dir> <标题>
#
# 底版：上半屏动画、下半屏留给主持人，配乐 + 音效压到 -24 LUFS（垫在人声底下）。
# 提词版：?prompter=1，静音，前面多 3 秒倒数，下半屏显示台词、动作提示和下一句。
# 没有片头（第一帧就是封面）、没有单独的片尾（片尾卡在正片里）。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EP="$(cd "$1" && pwd)"; NAME="$2"
NO=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1],encoding='utf-8'))['no'])" "$EP/meta.json")
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
python3 "$ROOT/tools/build_cine.py" "$EP"
cp "$ROOT/tools/export.cjs" "$ROOT/tools/fetch_fonts.py" "$EP/"
cd "$EP"
python3 fetch_fonts.py >/dev/null
node export.cjs --cues cues.json >/dev/null
python3 music.py                                                        # 这一期的原创配乐 -> bgm.wav
python3 "$ROOT/tools/cine/audio.py" "$EP"                               # 配乐 + 音效 -> audio.wav（-14 LUFS）
ffmpeg -loglevel error -y -i audio.wav -af volume=-10dB audio_bed.wav  # 垫在人声底下：-24 LUFS
node export.cjs --workers 4 --audio audio_bed.wav --out "${NAME}_No${NO}_底版.mp4" | tail -1
node export.cjs --workers 4 --query prompter=1 --out "${NAME}_No${NO}_提词版.mp4" | tail -1
printf 'shots/\naudio.wav\naudio_raw.wav\naudio_bed.wav\ncues.json\nout.mp4\nbgm.wav\n__pycache__/\n' > .gitignore
