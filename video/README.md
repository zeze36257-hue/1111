# 《其实，没人在看你》竖屏短视频

1080×1920、30fps，约 75 秒。画面全部由 `index.html` 里的 Canvas 代码逐帧绘制，顶部有 6 段进度条；配乐和音效由 `music.py` 合成。

| 文件 | 用途 |
| --- | --- |
| `index.html` | 动画源码；直接用浏览器打开即可预览（点击播放） |
| `export.cjs` | 用无头 Chromium + ffmpeg 逐帧导出 MP4、抽检查帧、导出音效时间表 |
| `music.py` | 根据 `cues.json` 合成背景音乐和音效 |
| `fetch_fonts.py` | 按页面用到的字下载 Google Fonts 子集到 `fonts/` |
| `聚光灯效应_预览.mp4` | 成片（无配音，含配乐） |
| `music.mp3` | 单独的配乐 |

## 重新生成

```bash
export NODE_PATH=$(npm root -g)          # 需要全局安装的 playwright
python fetch_fonts.py                    # 文案改动后重新下载字体子集
node export.cjs --cues cues.json
python music.py && ffmpeg -y -i music.wav -af loudnorm=I=-20:TP=-2 music_n.wav && mv music_n.wav music.wav
node export.cjs --workers 4 --audio music.wav --out 聚光灯效应_预览.mp4
```

## 对齐真人配音

字幕时长目前按每秒 5.2 字估算。拿到配音后，把每句的起止秒数按顺序填进 `index.html` 的 `TIMING` 数组，画面、字幕、进度条和音效会一起对齐，然后重新执行上面的命令。
