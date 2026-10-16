#!/usr/bin/env bash
# No.64 真人出镜试播的出片：底版（上半屏动画、下半屏留给主持人，音乐垫在人声底下）+ 提词版（静音，前面 3 秒倒数）。
#
#   bash no64/make.sh
#
# 没有片头（第一帧就是封面）、没有单独的片尾（片尾卡在正片里）。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; EP="$ROOT/no64"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"
python3 "$ROOT/tools/build_cine.py" "$EP"
cd "$EP"
python3 fetch_fonts.py >/dev/null
node export.cjs --cues cues.json >/dev/null
python3 music.py                                                        # 原创配乐 -> bgm.wav
python3 "$ROOT/tools/cine/audio.py" "$EP"                               # 配乐 + 音效 -> audio.wav（-14 LUFS）
ffmpeg -loglevel error -y -i audio.wav -af volume=-10dB audio_bed.wav  # 垫在人声底下：-24 LUFS
node export.cjs --workers 4 --audio audio_bed.wav --out "你的眼睛在骗你_No64_底版.mp4" | tail -1
node export.cjs --workers 4 --query prompter=1 --out "你的眼睛在骗你_No64_提词版.mp4" | tail -1
printf 'shots/\naudio.wav\naudio_raw.wav\naudio_bed.wav\ncues.json\nout.mp4\nbgm.wav\n__pycache__/\n' > .gitignore
