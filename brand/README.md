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

## 拼接：片头 + 正片 + 片尾

```bash
ffmpeg -i 片头_黑猫不说话.mp4 -i 正片.mp4 -i 片尾.mp4 -filter_complex \
  "[0:v]fps=30,format=yuv420p,setsar=1[v0];[1:v]fps=30,format=yuv420p,setsar=1[v1];[2:v]fps=30,format=yuv420p,setsar=1[v2];[0:a]aresample=44100[a0];[1:a]aresample=44100[a1];[2:a]aresample=44100[a2];[v0][a0][v1][a1][v2][a2]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 19 -c:a aac -b:a 192k -movflags +faststart 成片.mp4
```

片头有自己的提示音，正片音乐仍从正片第 0 秒开始，所以正片内部的卡点不受影响。

## 片尾（No.4 起使用）

用 `node export.cjs --query outro=1 --audio outro.wav --out <输出>` 导出；下期预告在 `index.html` 的 `NEXT` 常量里，每期更新后重新运行 `fetch_fonts.py`。提示音用 `python sting.py outro` 生成 `outro.wav`。

约 2.5 秒，接在每期结尾的提问之后：

- 画面：黑猫回到画面中央，异色瞳睁着，尾巴卷一下；下方两行字“关注 @黑猫不说话”“下一期：No.X《下期标题》”；最后猫慢慢闭眼，画面暗下去。
- 声音：片头提示音倒过来——先青色的铃音，再橙色的铃音，最后一声很轻的“咚”。
- 用意：下期预告给观众一个关注的理由；片尾“闭眼”、片头“睁眼”，TikTok 自动重播时首尾无缝衔接。
- 每期结尾的评论区提问仍留在正片里，片尾只负责“记住我”和“下期见”。

## 系列规范（每期都要满足）

- 片头：从 No.4 起，每期开头接 `片头_黑猫不说话.mp4`（No.1–No.3 不加）。
- 片尾：从 No.4 起，每期结尾接片尾（见上）。
- 系列标记：“黑猫不说话 · 心理学 No.X”。No.1《聚光灯效应》（video2）、No.2《忽冷忽热》（video3）、No.3《四种依恋类型》（video4）。
- 水印：`@黑猫不说话`，白色约 16% 透明度，缓慢漂移，画在场景层里随镜头淡入淡出，避开进度条和字幕。
- 进度条：顶部 y = 336（TikTok 顶部“关注 / 推荐”栏之下），按段落分节，当前段橙色发光。
- 风格：俯视与留白、左下角衬线字幕、数字注释、无配音；橙 = 你，青 = 对方。
- 正片第一帧就是钩子；正片时长 60–80 秒；结尾一个好回答的问题。
- 研究数据先上网核实，出处写进各期 README；证据弱的地方字幕用“可能”。
- 第一季《感情里的你》：No.1–No.6，全部完成。
- 第二季《你和自己》：No.7《精神内耗》、No.8《讨好型人格》、No.9《21 天神话》、No.10《焦虑》、No.11《拖延》、No.12《棉花糖实验》、No.13《意义感》，全部完成。No.13 片尾为“第二季完 · 第三季，下次见”。
- 重新出片：`tools/make_episode.sh <目录> <文件名.mp4> "<片尾预告>"`，每期的命令和预告文字见 git 历史或各期 README。
- 出片前需先放好 `video2/bgm.m4a`（参考视频的背景音乐，未入库）。
