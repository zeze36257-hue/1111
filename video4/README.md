# 黑猫不说话 · 心理学 No.3《四种依恋类型，你是哪一种？》

1080×1920、30fps，78 秒。沿用系列风格（俯视与留白、左下角衬线字幕、数字注释、无配音），水印 @黑猫不说话，进度条在 TikTok 顶部栏之下，背景音乐同前两期（截到 78 秒，在音乐自然回落前淡出）。

这一期的两处改进：第一帧就是钩子（可直接做封面）；时长缩短到 78 秒。

## 结构

| 段落 | 时间 | 内容 |
| --- | --- | --- |
| 01 钩子 | 0–17.25 | 同一条没回的消息，A/B/C/D 四种反应 → 标题“依恋类型” |
| 02–05 | 17.25–53.5 | 两条轴（怕被抛弃 / 怕太亲近）切出四个象限：安全型、焦虑型、回避型、恐惧型 |
| 06 数据 | 53.5–63 | Hazan & Shaver（1987）：620 份回答，56% 安全、25% 回避、19% 焦虑 |
| 07 能改变吗 | 63–71.5 | 习得的安全感（earned security） |
| 08 结尾 | 71.5–78 | “你是哪一种？”评论区 A/B/C/D |

## 引用

- Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. *JPSP*, 52(3), 511–524. 《落基山新闻》爱情测验的前 620 份回答（14–82 岁）；自我归类为安全型 56%、回避型 25%、焦虑/矛盾型 19%。
- Bartholomew, K., & Horowitz, L. M. (1991). 四分类模型（安全、专注/焦虑、疏离/回避、恐惧）。
- Brennan, K. A., Clark, C. L., & Shaver, P. R. (1998). 焦虑与回避两个维度。
- 习得的安全感：童年不安全、成年后表现为安全依恋的人；多为横断面研究，因果证据有限，因此字幕用“可能”。

## 重新生成

```bash
export NODE_PATH=$(npm root -g)
ffmpeg -y -i ../video2/bgm.m4a -t 78 -af "afade=t=out:st=74.5:d=3.5,loudnorm=I=-14:TP=-1.5" bgm_cut.wav
python fetch_fonts.py
node export.cjs --workers 4 --audio bgm_cut.wav --out 依恋类型_No3.mp4
```
