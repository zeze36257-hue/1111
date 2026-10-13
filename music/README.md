# 频道原创配乐

用 `../tools/cine/sampler.py` 里的真实乐器取样作曲、渲染：

- Salamander Grand Piano V3：Alexander Holm，CC BY 3.0
- tonejs-instruments：大提琴、小提琴、低音提琴、竖琴、圆号、长笛

`demos/` 里是第一批试听小样，每首约 60 秒，起伏和视频的节奏对应：

- 0–12 秒：开头钩子
- 约 12 秒：标题出现时抬升
- 36–46 秒：呼吸段
- 46–56 秒：高潮
- 最后：自然收尾，全程不断

| 目录 | 曲名 | 风格 |
| --- | --- | --- |
| `A_night_piano` | 夜里没说出口的话 | E 小调，3/4 拍，75 BPM。独奏钢琴，后半段弦乐轻托 |
| `B_cinematic_rise` | 暗涌 | D 小调，90 BPM。钢琴脉动、弦乐组、心跳低音，高潮加圆号 |
| `C_deep_space` | 星尘未眠 | F 小调转降 A 大调，60 BPM。温暖铺底、大提琴、竖琴星光、轻微脉冲 |

## 重新渲染

需要先把乐器取样放到 `MUSIC_ASSETS` 目录（默认是会话的 scratchpad）。取样来自 npm：

- `@audio-samples/piano-mp3-velocity{4,8,12,16}`
- `@audio-samples/piano-mp3-release`
- `tonejs-instrument-{cello-wav,violin-mp3,contrabass-mp3,harp-mp3,french-horn-mp3,flute-mp3}`

然后运行：

```bash
cd music/demos/A_night_piano && python3 compose.py
```

音频文件没有入库。
