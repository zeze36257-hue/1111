# 黑猫不说话 · 心理学 No.4《没写完的结局：为什么你忘不掉的，偏偏是没在一起的人》

1080×1920、30fps，85.3 秒 = 1.8 秒片头 + 81 秒正片 + 2.5 秒片尾。系列规范见 `../brand/README.md`。

## 结构（正片时间）

| 段落 | 时间 | 内容 |
| --- | --- | --- |
| 01 钩子 | 0–17.25 | “在一起三年的，记不清了；没在一起的，一句都没忘。”两条记忆时间线（1,095 天 vs 47 天）→ 标题“没写完的结局” |
| 02 咖啡馆 | 17.25–36 | 1927 年柏林咖啡馆：没结账的单子一直亮着，结了账的消失 →“蔡格尼克效应” |
| 03 反转 | 36–50 | 2025 年元分析：没做完的事并没有记得更牢；真正稳定的是想把它做完 →“奥夫相基娜效应” |
| 04 后悔 | 50–60 | Gilovich & Medvec：短期后悔做过的，长期后悔没做的 |
| 05 写下来 | 60–74 | Pennebaker & Beall：连续 4 天、每天 15 分钟写下最放不下的事 → 一封不寄出的信 |
| 06 结尾 | 74–81 | “你最忘不掉的那个人，名字的首字母是？” |

## 引用与说明

- Zeigarnik, B. (1927)：未完成任务的记忆优势。咖啡馆服务员的故事是流传的轶事，字幕用“据说”。
- Ghibellini, R., & Meier, B. (2025). Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects. *Humanities and Social Sciences Communications*, 12. 结论：未完成任务没有记忆优势；但普遍存在回去完成的倾向（Ovsiankina 效应）。柱状图为示意。
- Gilovich, T., & Medvec, V. H. (1994). The temporal pattern to the experience of regret. *JPSP*, 67(3), 357–365. 短期更后悔行动，长期更后悔不作为。曲线为示意；后来的复制研究方向一致但幅度更小。
- Pennebaker, J. W., & Beall, S. K. (1986). *Journal of Abnormal Psychology*, 95(3), 274–281. 写创伤经历的学生之后几个月去校医院次数减少；后来的研究结论不一，画面上已注明。

## 重新生成

```bash
export NODE_PATH=$(npm root -g)
ffmpeg -y -i ../video2/bgm.m4a -t 81 -af "afade=t=out:st=78:d=3,loudnorm=I=-14:TP=-1.5" bgm_cut.wav
python fetch_fonts.py
node export.cjs --workers 4 --audio bgm_cut.wav --out body.mp4
(cd ../brand && node export.cjs --query outro=1 --audio outro.wav --out ../no4/outro_raw.mp4)
# 再按 ../brand/README.md 把 片头 + body.mp4 + 片尾 依次拼接
```
