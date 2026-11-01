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

## 读文案视频的背景音乐：TRA$H《Memories》
- 频道主 11 月 1 日选的，以后读文案视频都用它当背景音乐。
- **`memories_trash.m4a`：完整版**，频道主 11 月 1 日发来的（从他发的视频里原样拷出音轨，没有重新编码；AAC 44.1 kHz 立体声）。
  - 有声音的部分 152.6 秒（文件 154.1 秒，最后 1.5 秒是静音）。
  - 从第 0 秒就开始有声音；大约 140 秒起慢慢淡出，150 秒以后几乎听不见。
  - 中间响度很平稳，没有特别响或特别静的段落。
- `memories_trash_30s.m4a`：之前那 30 秒（他从抖音发来的视频里取的）。跟完整版是同一个录音，对应完整版的 0.35–30.35 秒。`wen01/` 用的是它。
- **以后怎么用**：
  - 2 分 20 秒以内的视频：从完整版开头放，到视频结尾淡出，不用接。
  - 更长时才需要接：这首歌每 6.4 秒重复一个乐句，跳回早两个乐句的同一位置接着放（见 `wen01/music.py`）。
- **不是我们的原创，版权归原作者**：不从网上的非正规来源下载；发抖音时也可以直接在抖音的音乐库里选这首。
