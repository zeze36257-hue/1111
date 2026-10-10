# 黑猫不说话 · 频道片头与头像

- `片头_黑猫不说话.mp4`：1.8 秒片头，接在每期正片前面。黑暗里睁开一双异色瞳（橙 = 系列里的“你”，青 = “对方”），轮廓光勾出一只坐着的黑猫，“黑猫不说话 / 不说话，只画人心”，眨一下眼，切进正片。
- `sting.wav`：片头提示音（低沉的“咚” + 两声铃音），每期相同，作为频道的声音标志。
- `头像_黑猫不说话.png`：同款猫的头像（820×820），可用作 TikTok 头像。

## 重新生成

```bash
export NODE_PATH=$(npm root -g)
python fetch_fonts.py && python sting.py
node export.cjs --workers 2 --audio sting.wav --out ident_raw.mp4
ffmpeg -y -i ident_raw.mp4 -c:v libx264 -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 44100 -ac 2 片头_黑猫不说话.mp4
```

头像：用浏览器打开 `index.html?avatar=1`，导出画布后裁切猫所在的正方形区域。

## 接到正片前面

```bash
ffmpeg -i 片头_黑猫不说话.mp4 -i 正片.mp4 -filter_complex \
  "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]fps=30,format=yuv420p,setsar=1[v1];[0:a]aresample=44100[a0];[1:a]aresample=44100[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 19 -c:a aac -b:a 192k -movflags +faststart 成片.mp4
```

片头有自己的提示音，正片音乐仍从正片第 0 秒开始，所以正片内部的卡点不受影响。
