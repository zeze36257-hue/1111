# 黑猫不说话 · 心理学 No.5《被喜欢就想逃：为什么 TA 一喜欢你，你就下头了》

1080×1920、30fps，85.3 秒 = 1.8 秒片头 + 81 秒正片 + 2.5 秒片尾（预告 No.6《为什么越亲近，越容易说狠话》）。系列规范见 `../brand/README.md`。

## 结构（正片时间）

| 段落 | 时间 | 内容 |
| --- | --- | --- |
| 01 钩子 | 0–17.25 | “TA 冷淡的时候，你天天想 TA；TA 一主动，你就下头了。”TA 走远，好感升；TA 靠近，好感降 → 标题，预告“三个原因” |
| 02 共鸣 | 17.25–28 | 奶茶、晚安、“我好像有点喜欢你”，你心里的潜台词；好感 80% → 14% |
| 03 原因一 | 28–41 | 回避型依恋（呼应 No.3 的 C）：TA 每走近一步，你退一步 →“去激活” |
| 04 原因二 | 41–56 | 自我验证：你眼中的自己 4 分，TA 眼中的你 9 分，对不上 → 格劳乔·马克思的俱乐部玩笑 |
| 05 原因三 | 56–66 | 低估：自我评价低的人，常把伴侣的爱看得更少 |
| 06 #theick | 66–74 | TikTok 上的下头理由，长相只占 6%；越完美主义越容易下头 |
| 07 结尾 | 74–81 | “下头不是因为 TA 不好，而是你还不太相信，自己值得被好好喜欢。” |

## 引用与说明

- Mikulincer, M., & Shaver, P. R.：回避型依恋的“去激活”策略（压抑依恋需要、回避亲密）。
- Swann, W. B., Hixon, J. G., & De La Ronde, C. (1992). Embracing the bitter “truth”: Negative self-concepts and marital commitment. *Psychological Science*, 3, 118–121. 自我评价低的人对看低自己的配偶更投入。画面里的分数卡为示意。
- Murray, S. L., Holmes, J. G., & Griffin, D. W. (2000). Self-esteem and the quest for felt security. *JPSP*, 78(3), 478–498. 自我评价低的人低估伴侣对自己的看重。柱状图为示意。
- Collisson, B., Saunders, E., & Yin, C. (2025). The ick: Disgust sensitivity, narcissism, and perfectionism in mate choice thresholds. *Personality and Individual Differences*, 238. TikTok #theick 视频里，长相只占下头理由的 6%；完美主义与更容易下头有关。
- 格劳乔·马克思的俱乐部玩笑：据 Quote Investigator，原话的措辞和场合并不确定，画面标“据说出自”。

## 重新生成

```bash
export NODE_PATH=$(npm root -g)
ffmpeg -y -i ../video2/bgm.m4a -t 81 -af "afade=t=out:st=78:d=3,loudnorm=I=-14:TP=-1.5" bgm_cut.wav
python fetch_fonts.py
node export.cjs --workers 4 --audio bgm_cut.wav --out body.mp4
(cd ../brand && node export.cjs --query outro=1 --audio outro.wav --out ../no5/outro_raw.mp4)
# 再按 ../brand/README.md 把 片头 + body.mp4 + 片尾 依次拼接
```
