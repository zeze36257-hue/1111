"""把按第一版旁白排的时间，换到现在的旁白上。

第一版旁白（narration_v1.srt）给重的话特意放慢了，频道主说“太慢了，很怪”，第二版按正常语速重新挑了录音（narration.srt），整条短了 11 秒。
分镜（shots.py）、配乐和音效（music.py）、字卡的时间都是照第一版写的，用 W(t) 换算：
每句话的开头、结尾对齐到新录音的开头、结尾，中间按比例。所以镜头还是切在同样的留白里，留白的长短跟稿子写的一样。
"""
import os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OFF = 9.0          # 旁白整体往后挪的秒数（跟 shots.NARR_OFF 一样）
TAIL = 5.0         # 最后一句说完到片子结束


def _lines(name):
    def ts(x):
        h, m, r = x.split(':'); s, ms = r.split(','); return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    out = []
    for b in open(os.path.join(HERE, name), encoding='utf-8').read().strip().split('\n\n'):
        a, e = map(ts, b.split('\n')[1].split(' --> ')); out += [a + OFF, e + OFF]
    return out


_old, _new = _lines('narration_v1.srt'), _lines('narration.srt')
OLD = np.array([0.0] + _old + [_old[-1] + TAIL])
NEW = np.array([0.0] + _new + [_new[-1] + TAIL])


def W(t):
    return float(np.interp(t, OLD, NEW))
