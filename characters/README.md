# 角色素材（Wojak 格式，No.51 起）

## 主人公 `hero/`
- `ref.png`：频道主给的原图（1024×1536，白底）。他戴黑色毛线猫耳帽，一只黑猫趴在右肩（画面左边），穿黑衬衫、黑阔腿裤。
- `expr/*.png`：8 个表情，透明底，原图的 2 倍大（2048×3072 抠图后裁成 1002×2992）。

  | 文件 | 表情 | 改了什么 |
  |---|---|---|
  | `calm` | 平静（原图） | 不改 |
  | `sad` | 难过 | 眉毛内侧往上挑，嘴角往下，额头上有两道纹 |
  | `cry` | 哭 | 难过 + 两道眼泪 + 嘴瘪着 |
  | `happy` | 开心 | 眉毛放松，嘴角往上 |
  | `shock` | 震惊 | 眼睛瞪圆、瞳孔变小，眉毛抬高，嘴张成 O |
  | `angry` | 生气 | 整张脸变红，眉毛压成 V，咬着牙 |
  | `meh` | 无语 | 眼皮耷拉一半，眉毛、嘴都是平的 |
  | `awkward` | 尴尬 | 脸红，太阳穴挂一滴汗，嘴角歪着笑 |
- `表情一览.png`：8 个表情排在一起。

**怎么做的**：在原图上把眉毛、眼睛、嘴擦掉（用脸的底色 `#fcfcfc`），再画上新的。
- 线条两头细、中间粗，跟原图的墨线一样。
- 原图五官的坐标是逐像素量出来的，写在 `tools/wojak/expressions.html` 里，只对这张原图有效。
- 最后用 `tools/wojak/cutout.py` 抠掉白底：从画面四边往里找连着的白色当背景，所以脸、脖子这些被线围住的白色不会被抠掉。

```
NODE_PATH=$(npm root -g) node tools/wojak/make_expressions.cjs characters/hero/ref.png characters/hero/expr          # 全部
NODE_PATH=$(npm root -g) node tools/wojak/make_expressions.cjs characters/hero/ref.png characters/hero/expr cry      # 只出一个
```

## 其他角色 `candidates/`（候选，频道主还没选）
用 `tools/wojak/gen_images.py` 生成（MiniMax image-01），把主人公原图当角色参考，提示词里写清楚经典 Wojak 的脸（眼袋皱纹、细墨线）。
- 1 同事（橙卫衣）、2 老板 A（光头眼镜）、3 老板 B（戴帽子）、4–6 女生 A/B/C。
- 7–10 是主人公换装：AI 换装时脸和帽子会有点走样，所以主人公平时穿原图那一身。
- `一览.png`：这 10 张排在一起。

选定以后：
1. 用 `python3 -I tools/wojak/cutout.py <图> <输出.png>` 抠图，放进 `characters/<角色名>/`。
2. 表情也照主人公的办法改，坐标要重新量。

## 放进视频的样子
`样子_办公室.png`：
- 竖屏 1080×1920，照片画框在中间（y 470–1430），上方是封面钩子。
- 人物露出半身站在照片前面。说出口的话用白色椭圆框，心里想的用淡蓝泡泡。
- 水印“@黑猫不说话”保留，没有进度条（`meta.json` 写 `"progress": false`）。
