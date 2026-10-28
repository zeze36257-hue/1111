# catify：把照片里的人换成频道的形象

“读文案”短视频（参考见 `refs/读文案/剖析.md`）用的：真实照片打底，头换成画好的猫头，露出来的皮肤涂成形象的颜色，衣服和背景不动。**形象还没定**，现在是试样子用的。

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
<环境目录>/bin/python tools/catify/catify.py <模型目录> 照片.jpg 输出.png black,white
```
最后一个参数是从左到右每个人的样子：`black` 黑猫头、`blackn` 黑猫头不要细边、`white` 白猫头、`beanie` 猫耳毛线帽、`skip` 不动。

## 适合什么照片
- 脸、手看得清的：正脸、侧脸都行，背影不行（没有脸）。
- 浅色、带花纹的衣服容易被认成皮肤，涂上一块一块的；挑照片时注意。
- 两个人挨着坐时，姿态模型偶尔只认出一个人，另一个人的膝盖可能被涂错；出问题的照片换一张。
