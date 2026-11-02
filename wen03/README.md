# 读文案第二期《你也不用做完美的人》

频道主说的“第二期”。
- 第一期是《让你笑的，才叫爱》：`../wen01/` 是样片，`../wen02/` 是换了新图、新画面的那版。
- 这一期的文案是频道主给的，他要我改写过（见 `文案.md`）。
- 图是从他发来的两批图里按意思挑的。
- 配音：温润男声，0.95 倍速。
- 背景音乐：TRA$H《Memories》完整版。

## 做法
跟 `../wen02/` 完全一样（见那边的 README），只换了这些：
- `layout.py` 的 `SCRIPT`：文案和每句配哪张图；
- `scenes.js` 的 `FILES`：两批图都放进来了（除了 09），以后换图只改 `SCRIPT`。

步骤：
1. `python3 layout.py --prov`（会把 `scenes.js` 整个重写，只留时间轴）；
2. `python3 ../tools/cine/tts.py .`；
3. `python3 layout.py`；
4. 把画面的代码接在时间轴后面（从上一期拷）。

## 出片
```
NODE_PATH=$(npm root -g) tools/make_cine.sh wen03 读文案第二期_你也不用做完美的人_无配乐.mp4
```

## 11 月 2 日起不带背景音乐
频道主发布时在抖音曲库里自己加《Memories》，所以成片只留配音：
- `meta.json` 写 `"music": {"off": true}`；
- 文件名后面加了“_无配乐”。
- 原来带音乐的那版还在 git 历史里。

