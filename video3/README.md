# 《忽冷忽热》：为什么越得不到越上头

1080×1920、30fps，110.5 秒。风格、水印（@黑猫不说话）、进度条位置和背景音乐都沿用第二期（`video2/`）：俯视与留白、左下角衬线字幕、数字注释、无配音；画面节点卡在音乐段落上（17.25 秒全编制进入，89.5 秒回落）。

## 结构

| 段落 | 时间 | 内容 |
| --- | --- | --- |
| 01 钩子 | 0–17.25 | 已读不回 3 小时，第 27 次打开对话框 → 标题 |
| 02 共鸣 | 17.25–36 | TA 回了，心情 12 → 96；一周的“温度曲线”：周一秒回、周三已读不回、周五“想你了” |
| 03 实验 | 36–64 | 斯金纳的强化程式（鸽子）；Whitchurch 等（2011）的“不确定”实验 |
| 04 大脑 | 64–78 | Fiorillo、Tobler & Schultz（2003）：奖励概率 50% 时多巴胺持续信号最强 |
| 05 社会现象 | 78–89.5 | 暧昧、已读不回、老虎机 |
| 06 结尾 | 89.5–110.5 | “你戒不掉的，不是 TA，是那个也许”→ 稳定的回应 → “此刻，你在等谁的消息？” |

## 引用

- Ferster, C. B., & Skinner, B. F. (1957). *Schedules of Reinforcement*. 不定时（变比率）强化建立的行为最难消退。
- Whitchurch, E. R., Wilson, T. D., & Gilbert, D. T. (2011). “He loves me, he loves me not…”: Uncertainty can increase romantic attraction. *Psychological Science*, 22(2), 172–175. 47 名弗吉尼亚大学女生；“不确定”组最心动，也想得最多。局限：样本小，测的是对陌生人资料的第一印象。
- Fiorillo, C. D., Tobler, P. N., & Schultz, W. (2003). Discrete coding of reward probability and uncertainty by dopamine neurons. *Science*, 299, 1898–1902. 猴子实验；持续活动在 p = 0.5 时最强。图中曲线为示意。
- Helen Fisher 的“挫折吸引”（frustration attraction）。

## 重新生成

```bash
export NODE_PATH=$(npm root -g)
cp ../video2/bgm_cut.wav .               # 背景音乐的生成方法见 video2/README.md
python fetch_fonts.py
node export.cjs --workers 4 --audio bgm_cut.wav --out 忽冷忽热.mp4
```
