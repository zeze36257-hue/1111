"""讲故事用的环境声和音效，全部用 numpy 合成，没有版权问题。每个函数返回单声道（或立体声）的 numpy 数组，48 kHz。

风、河水、篝火、雨、雷、雪夜的风、心跳、闷响（扑上来、砸下去）、熊吼、
蟋蟀、狼嚎、鸟叫、脚步（草地、雪地）、马蹄、开门的吱呀声、人群低声议论、转场的呼啸声；
第 2 集加了：呼吸、炮声、照明弹、枪声、发动机、布和纸的窸窣、刨雪、电影院放映机；
第 3 集加了：运输机、铁件撞击和修桥的敲打、电台沙沙声、海浪、轮船汽笛。
"""
import numpy as np
import scipy.signal as ss

SR = 48000
rng = np.random.default_rng(11)


def n_(sec): return int(sec * SR)


def env(n, att, rel):
    e = np.ones(n)
    a, r = min(n, n_(att)), min(n, n_(rel))
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[n - r:] *= np.linspace(1, 0, r)
    return e


def band(sec, lo, hi, order=2):
    x = rng.standard_normal(n_(sec))
    b, a = ss.butter(order, [lo, hi], 'band', fs=SR)
    return ss.lfilter(b, a, x)


def wobble(sec, rate, lo=0.3):
    n = n_(sec); k = max(2, int(sec * rate))
    return np.interp(np.linspace(0, k, n), np.arange(k + 2), rng.uniform(lo, 1.0, k + 2))


def norm(x, peak=1.0): return x / (np.abs(x).max() + 1e-9) * peak


def wind(sec, lo=180, hi=1400, rate=0.4): return norm(band(sec, lo, hi) * wobble(sec, rate)) * env(n_(sec), 1.5, 1.5)
def snow_wind(sec): return norm(band(sec, 500, 3500) * wobble(sec, 0.8)) * env(n_(sec), 1.5, 1.5)
def river(sec): return norm(band(sec, 300, 2600) * wobble(sec, 6)) * env(n_(sec), 0.8, 0.8)
def rain(sec): return norm(band(sec, 1500, 9000)) * env(n_(sec), 0.3, 0.5)


def thunder(sec=3.5):
    return norm(band(sec, 30, 180) * np.exp(-np.arange(n_(sec)) / SR * 1.3))


def fire(sec):
    n = n_(sec); y = band(sec, 80, 400) * 0.3
    for _ in range(int(sec * 9)):
        a = rng.integers(0, n - 2000); L = int(rng.integers(60, 400))
        y[a:a + L] += rng.uniform(-1, 1, L) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(0.3, 1)
    b, a = ss.butter(2, 300, 'high', fs=SR)
    return norm(ss.lfilter(b, a, y)) * env(n, 0.6, 0.8)


def heartbeat(bpm, sec):
    n = n_(sec); y = np.zeros(n); t1 = np.arange(n_(0.18)) / SR
    thump = np.sin(2 * np.pi * 52 * t1) * np.exp(-t1 * 28)
    step = 60 / bpm
    for k in range(int(sec / step)):
        for off, g in ((0, 1.0), (0.28, 0.6)):
            a = n_(k * step + off)
            if a + len(thump) < n: y[a:a + len(thump)] += thump * g
    return y


def boom(sec=1.4):
    t = np.arange(n_(sec)) / SR
    return norm(np.sin(2 * np.pi * (75 - 35 * t) * t) * np.exp(-t * 3.0) + band(sec, 60, 2500) * np.exp(-t * 9) * 0.6)


def growl(sec=2.6):
    t = np.arange(n_(sec)) / SR
    return norm(band(sec, 90, 520) * (1 + 0.7 * np.sin(2 * np.pi * 27 * t)) * env(n_(sec), 0.5, 1.0))


def crickets(sec, count=4):
    """几只蟋蟀，各自隔一会儿叫一串。返回立体声。"""
    n = n_(sec); out = np.zeros((n, 2))
    for _ in range(count):
        f = rng.uniform(3800, 5200); pan = rng.uniform(-0.8, 0.8); t = rng.uniform(0, 1.5)
        while t < sec - 0.5:
            for p in range(int(rng.integers(3, 6))):
                a = n_(t + p * 0.045); L = n_(0.025)
                if a + L >= n: break
                tt = np.arange(L) / SR
                ch = np.sin(2 * np.pi * f * tt) * np.sin(np.pi * tt / tt[-1])
                out[a:a + L, 0] += ch * (1 - pan) / 2; out[a:a + L, 1] += ch * (1 + pan) / 2
            t += rng.uniform(0.5, 1.4)
    return norm(out) * env(n, 0.8, 0.8)[:, None]


def wolf_howl(sec=3.2, f0=420):
    t = np.arange(n_(sec)) / SR
    glide = f0 + 260 * np.sin(np.pi * np.clip(t / (sec * 0.45), 0, 1)) ** 0.7 - 60 * np.clip((t - sec * 0.6) / (sec * 0.4), 0, 1)
    vib = 1 + 0.012 * np.sin(2 * np.pi * 5.5 * t)
    ph = 2 * np.pi * np.cumsum(glide * vib) / SR
    y = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph) + 0.05 * band(sec, 400, 3000)
    y *= env(len(t), 0.35, 1.2)
    # 远处的回声
    out = y.copy()
    for d, g in ((0.23, 0.35), (0.51, 0.22), (0.83, 0.12)):
        k = n_(d); out[k:] += y[:-k] * g
    return norm(out)


def birds(sec, count=6):
    n = n_(sec); out = np.zeros((n, 2))
    for _ in range(count):
        t0 = rng.uniform(0, sec - 0.6); pan = rng.uniform(-0.7, 0.7)
        f1, f2 = rng.uniform(2500, 4200), rng.uniform(3500, 6000)
        for k in range(int(rng.integers(2, 5))):
            L = n_(rng.uniform(0.05, 0.12)); a = n_(t0 + k * 0.13)
            if a + L >= n: break
            tt = np.arange(L) / SR; f = np.linspace(f1, f2, L) if k % 2 == 0 else np.linspace(f2, f1, L)
            ch = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / tt[-1]) ** 2
            out[a:a + L, 0] += ch * (1 - pan) / 2; out[a:a + L, 1] += ch * (1 + pan) / 2
    return norm(out)


def steps(sec, rate=1.8, kind='grass'):
    n = n_(sec); y = np.zeros(n)
    lo, hi = (200, 3000) if kind == 'grass' else (400, 5000)
    t = 0.1
    while t < sec - 0.3:
        L = n_(0.12 if kind == 'grass' else 0.18); a = n_(t)
        s = band(L / SR, lo, hi) * np.exp(-np.arange(L) / (L / 3)) * rng.uniform(0.6, 1.0)
        y[a:a + L] += s; t += 1 / rate * rng.uniform(0.9, 1.1)
    return norm(y)


def hooves(sec, rate=1.6):
    n = n_(sec); y = np.zeros(n); t = 0.1
    while t < sec - 0.5:
        for off in (0, 0.11, 0.26, 0.37):
            a = n_(t + off); L = n_(0.06)
            if a + L >= n: break
            tt = np.arange(L) / SR
            y[a:a + L] += (np.sin(2 * np.pi * 180 * tt) * 0.6 + band(0.06, 800, 3000)[:L] * 0.4) * np.exp(-tt * 60)
        t += 1 / rate
    return norm(y)


def creak(sec=1.6, f=110):
    t = np.arange(n_(sec)) / SR
    fm = f * (1 + 0.25 * np.sin(2 * np.pi * 0.7 * t) + 0.05 * rng.standard_normal(len(t)).cumsum() / 300)
    saw = 2 * ((np.cumsum(fm) / SR) % 1) - 1
    b, a = ss.butter(2, [600, 2400], 'band', fs=SR)
    return norm(ss.lfilter(b, a, saw) * env(len(t), 0.1, 0.4))


def crowd(sec, voices=8):
    n = n_(sec); y = np.zeros(n)
    for _ in range(voices):
        f = rng.uniform(250, 700)
        syll = (wobble(sec, rng.uniform(3, 6), lo=0.0) > 0.55).astype(float)
        b, a = ss.butter(1, 12, 'low', fs=SR); syll = ss.lfilter(b, a, syll)
        y += band(sec, f, f * 2.2) * syll
    return norm(y) * env(n, 0.6, 0.8)


def whoosh(sec=1.0, up=True):
    n = n_(sec); t = np.arange(n) / SR
    x = rng.standard_normal(n); y = np.zeros(n)
    fc = np.linspace(300, 3000, n) if up else np.linspace(3000, 300, n)
    for k in range(0, n, 480):
        b, a = ss.butter(2, [max(60, fc[k] * 0.6), min(20000, fc[k] * 1.4)], 'band', fs=SR)
        y[k:k + 480] = ss.lfilter(b, a, x[k:k + 480])
    return norm(y * np.sin(np.pi * t / t[-1]) ** 2)


def rope_creaks(sec, every=1.4):
    n = n_(sec); y = np.zeros(n); t = 0.2
    while t < sec - 1.0:
        c = creak(rng.uniform(0.5, 0.9), rng.uniform(140, 260)); a = n_(t)
        y[a:a + len(c)] += c[:max(0, min(len(c), n - a))] * rng.uniform(0.4, 0.8)
        t += every * rng.uniform(0.8, 1.3)
    return norm(y)


# ---------- 第 2 集（冰雕连）加的 ----------
def breath(sec, rate=0.22):
    """很慢的呼吸：吸一口、呼一口，冷天里带一点颤。rate 是每秒几次。"""
    n = n_(sec); t = np.arange(n) / SR; y = np.zeros(n)
    per = 1 / rate; k = 0.0
    while k < sec:
        for off, L, g, lo, hi in ((0.0, per * 0.38, 0.7, 500, 2600), (per * 0.45, per * 0.45, 1.0, 300, 1800)):   # 吸气、呼气
            a, m = n_(k + off), n_(L)
            if a + m >= n: break
            e = np.sin(np.pi * np.arange(m) / m) ** 1.5 * (1 + 0.15 * np.sin(2 * np.pi * 9 * np.arange(m) / SR))
            y[a:a + m] += band(L, lo, hi)[:m] * e * g
        k += per
    return norm(y)


def artillery(sec=4.0, far=True):
    """炮声：远处的是闷雷一样的一声，再拖一条长长的低音尾巴。"""
    t = np.arange(n_(sec)) / SR
    hit = band(sec, 25, 160 if far else 600) * np.exp(-t * (2.2 if far else 4.0))
    body = np.sin(2 * np.pi * (48 - 14 * t) * t) * np.exp(-t * 3.5)
    y = hit + body * 0.6
    if not far: y += band(sec, 800, 5000) * np.exp(-t * 18) * 0.5
    return norm(y)


def flare(sec=3.0):
    """照明弹：“嘭”的一声打上去，然后一直嘶嘶地烧。"""
    n = n_(sec); t = np.arange(n) / SR
    pop = band(sec, 200, 3000) * np.exp(-t * 30) * 0.8
    hiss = band(sec, 2500, 9000) * (0.25 + 0.1 * wobble(sec, 7)) * np.clip((t - 0.25) / 0.4, 0, 1) * env(n, 0.01, 0.8)
    return norm(pop + hiss)


def gunfire(sec, shots=14, mg=True, far=True):
    """枪声：零零星星的步枪声，夹着几串机枪的连发。远处的低通一点。"""
    n = n_(sec); y = np.zeros(n)
    def crack(g):
        L = n_(0.35); tt = np.arange(L) / SR
        return (band(0.35, 300, 4000)[:L] * np.exp(-tt * 40) + np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 25) * 0.6) * g
    times = sorted(rng.uniform(0, sec - 0.4, shots))
    for t0 in times:
        c = crack(rng.uniform(0.4, 1.0)); a = n_(t0); y[a:a + len(c)] += c[:max(0, min(len(c), n - a))]
    if mg:
        for _ in range(max(1, int(sec / 2.5))):
            t0 = rng.uniform(0, max(0.1, sec - 1.6))
            for k in range(int(rng.integers(5, 10))):
                c = crack(0.55); a = n_(t0 + k * 0.09)
                if a + len(c) < n: y[a:a + len(c)] += c
    if far:
        b, a = ss.butter(2, 1800, 'low', fs=SR); y = ss.lfilter(b, a, y)
    return norm(y)


def engines(sec, approach=False):
    """卡车、坦克的发动机声：低沉的轰鸣，approach=True 时越来越近。"""
    n = n_(sec); t = np.arange(n) / SR
    f = 38 + 4 * np.sin(2 * np.pi * 0.3 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sign(np.sin(3 * ph)) * 0.3) * (0.7 + 0.3 * wobble(sec, 2))
    y += band(sec, 80, 700) * 0.6
    g = np.linspace(0.25, 1.0, n) ** 1.5 if approach else np.ones(n)
    return norm(y * g) * env(n, 1.0, 1.2)


def rustle(sec=1.2, n_bits=24):
    """布料、纸的窸窣声。"""
    n = n_(sec); y = np.zeros(n)
    for _ in range(n_bits):
        L = n_(rng.uniform(0.02, 0.08)); a = int(rng.integers(0, max(1, n - L)))
        y[a:a + L] += band(L / SR + 0.01, 1500, 7000)[:L] * np.hanning(L) * rng.uniform(0.3, 1.0)
    return norm(y)


def dig(sec, rate=1.6):
    """手刨雪的沙沙声。"""
    n = n_(sec); y = np.zeros(n); t = 0.1
    while t < sec - 0.4:
        L = n_(0.25); a = n_(t)
        y[a:a + L] += band(0.25, 600, 6000)[:L] * np.sin(np.pi * np.arange(L) / L) ** 2 * rng.uniform(0.5, 1.0)
        t += 1 / rate * rng.uniform(0.8, 1.2)
    return norm(y)


def projector(sec):
    """电影院：放映机很轻的嗒嗒声加上一点空调底噪。"""
    n = n_(sec); t = np.arange(n) / SR
    tick = (np.sin(2 * np.pi * 24 * t) > 0.95).astype(float)
    b, a = ss.butter(2, [1500, 4000], 'band', fs=SR)
    return norm(ss.lfilter(b, a, tick) * 0.4 + band(sec, 60, 400) * 0.5) * env(n, 0.8, 0.8)


# ---------- 第 3 集（水门桥）加的 ----------
def planes(sec, n=6, approach=True):
    """几架螺旋桨运输机：低沉的嗡嗡声，桨叶一下一下地拍，先由远到近再远去（approach=True）。"""
    t = np.arange(n_(sec)) / SR; y = np.zeros(len(t))
    for k in range(n):
        f0 = rng.uniform(58, 74); bp = rng.uniform(34, 42)
        ph = 2 * np.pi * np.cumsum(f0 * (1 + 0.004 * np.sin(2 * np.pi * rng.uniform(0.1, 0.3) * t))) / SR
        tone = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)
        y += tone * (0.75 + 0.25 * np.sin(2 * np.pi * bp * t)) * rng.uniform(0.6, 1.0)
    y += band(sec, 120, 900) * 0.5
    g = np.sin(np.pi * np.clip(t / sec, 0, 1)) ** 1.2 if approach else np.ones(len(t))
    return norm(y * g) * env(len(t), 1.5, 1.5)


def clank(f=420.0, dec=6.0, sec=1.2):
    """铁家伙撞在一起的一声“当”：几个不成倍数的泛音，很快衰减。"""
    t = np.arange(n_(sec)) / SR
    y = sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t * dec * (1 + 0.6 * k)) * g
            for k, (m, g) in enumerate(((1, 1.0), (2.63, 0.6), (4.12, 0.4), (6.3, 0.25))))
    y += band(sec, 1500, 8000) * np.exp(-t * 60) * 0.6
    return norm(y)


def hammering(sec, rate=1.3):
    """修桥：敲敲打打、铁件碰撞的声音，不太规则。"""
    n = n_(sec); y = np.zeros(n); t = 0.2
    while t < sec - 1.3:
        c = clank(rng.uniform(300, 700), rng.uniform(5, 9)) * rng.uniform(0.4, 1.0); a = n_(t)
        y[a:a + len(c)] += c[:max(0, min(len(c), n - a))]
        t += 1 / rate * rng.uniform(0.6, 1.5)
    return norm(y)


def radio(sec):
    """老式电台的沙沙声，时有时无的噼啪。"""
    n = n_(sec); y = band(sec, 400, 3200) * (0.35 + 0.25 * wobble(sec, 3))
    for _ in range(int(sec * 6)):
        a = int(rng.integers(0, max(1, n - 800))); L = int(rng.integers(100, 700))
        y[a:a + L] += rng.uniform(-1, 1, L) * rng.uniform(0.5, 1.0)
    return norm(y) * env(n, 0.2, 0.3)


def waves(sec):
    """海浪：低沉的哗——哗——。"""
    n = n_(sec); t = np.arange(n) / SR
    swell = 0.4 + 0.6 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 6.5 + rng.uniform(0, 6))) ** 2
    b, a = ss.butter(2, 900, 'low', fs=SR)
    return norm(ss.lfilter(b, a, rng.standard_normal(n)) * swell) * env(n, 1.5, 1.5)


def ship_horn(sec=3.0, f=92.0):
    """远处轮船的汽笛。"""
    t = np.arange(n_(sec)) / SR
    y = sum(np.sin(2 * np.pi * f * m * t) / m for m in range(1, 7)) * env(len(t), 0.3, 0.8)
    b, a = ss.butter(2, 1200, 'low', fs=SR)
    return norm(ss.lfilter(b, a, y))
