# catify：把照片里的人换成频道的形象

“读文案”短视频（参考见 `refs/读文案/剖析.md`）用的：真实照片打底，头换成画好的头，露出来的皮肤涂成白的、加黑边，衣服和背景不动。形象是频道主 10 月 28 日定的（见 `characters/读文案/README.md`）。

## 装
MediaPipe 要单独的 Python 环境，还要两个系统库：
```
apt-get install -y libegl1 libgles2
python3 -m venv <环境目录> && <环境目录>/bin/pip install mediapipe scipy pillow
```
模型放在一个目录里（storage.googleapis.com 能连上）：
```
curl -O https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
curl -O https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task
```

## 用
```
<环境目录>/bin/python tools/catify/catify.py <模型目录> 照片.jpg 输出.png him,her [meh,smile]
```
- 第一个逗号列表是从左到右每个人是谁：`him` 他、`her` 她、`friend` 别的人、`skip` 不动。
- 第二个（可以不写）是表情：`calm` 平静、`meh` 无语（他的默认）、`smile` 笑（她的默认）、`sad` 难过。

## 怎么换的
- 每个人：MediaPipe 姿态模型给一张蒙版；再把这个人那块裁出来单独分割一遍（模型只看 256×256，人小的时候整张图分不细）。
- 脸归谁：按鼻子离哪块脸最近来分（抱在一起时两个人的蒙版会叠在一起）。鼻子看不见的人画成背影。
- 头：白脸比真人的脸大一点（像频道主的参考图），帽子盖住头发；鼻子相对两只耳朵的位置定朝向，转头时五官往那边挪。
- 皮肤：有把握的皮肤往外长到“可能是皮肤”的地方，修圆边缘、去掉零碎，涂成白的，外面一圈黑边。头发涂黑，只涂跟头连着的那片。

## 适合什么照片
见 `refs/读文案/剖析.md` 的“挑照片”。换完一定要一张张看，不行就换一张。
