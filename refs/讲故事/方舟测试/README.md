# 火山方舟第一次测试（11 月 5 日）

频道主在手机上开通了火山方舟，在环境的 Network secrets 里加了密钥，Allowed domains 加了 `*.volces.com`。在同一个会话里就能用了，不用新开会话。

## 结果
- **密钥**：代理自动带上，会话里没有 `ARK_API_KEY` 也能调。
- **模型 ID**：`GET https://ark.cn-beijing.volces.com/api/v3/models` 能列出来。用得上的：
  - 画图：`doubao-seedream-5-0-flash-260915`、`doubao-seedream-5-0-pro-260628`；
  - 视频：`doubao-seedance-2-0-mini-260615`、`doubao-seedance-2-0-260128`。
- **画图 flash 能用**：2560×1440 一张 17 秒，算 14400 token。图是 `西部小镇_flash.jpg`，2D 手绘风格，效果不错。
- **画图 pro 用不了**：
  - 现象：出一张要两分钟左右，代理等了 30 秒就断开，返回 502 “upstream request failed”。
  - pro 不支持 stream，没法绕。所以画图先全用 flash。
  - 以后一定要用 pro 的话，可以试试删掉 Network secret、改成环境变量 `ARK_API_KEY`，让请求不走代理的注入，但没试过这样行不行。
- **视频 mini 能用**：
  - 用上面那张图当首帧，做了 4 秒 480p，排队加生成 93 秒，算 40594 token。成片是 `西部小镇_mini_480p_4秒.mp4`（864×496，24 帧）。
  - 按第三方说的 0.023 元/千 token，这段不到 1 元；720p 大约是 480p 的两倍多。
  - 画面跟首帧一致：镜头往前推，沙尘飘，旗子摆。
- 工具：`tools/ark/gen_images.py`（默认已改成 flash）、`tools/ark/gen_video.py`（创建任务、查进度、下载）。
