# 读文案第三期《把真话说出口，才是解药》

频道主说的“第三期”。
- 文案是频道主给的，他要我改写过一点（见 `文案.md`）。
- 图从他发来的图里挑，一句一张，尽量不跟前两期重复。每张图用在哪几期，见 `../characters/读文案/README.md`。
- 配音：温润男声，0.95 倍速。
- 背景音乐：TRA$H《Memories》完整版。

## 做法
跟 `../wen03/` 一样，只换了这些：
- `layout.py` 的 `SCRIPT`；
- `scenes.js` 的 `FILES`：加了 16、17。

## 出片
```
NODE_PATH=$(npm root -g) tools/make_cine.sh wen04 读文案第三期_把真话说出口才是解药.mp4
```
