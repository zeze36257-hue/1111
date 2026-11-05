"""下载这一集要用的字体（Google Fonts，只取用到的字），转成 ttf 给 PIL 用。

    python3 fetch_fonts.py      -> fonts/sub.ttf（字幕，Noto Sans SC 700）、fonts/title.ttf（片名，Noto Serif SC 900）、fonts/quote.ttf（纸条上的两句话，Noto Serif SC 600）

改了旁白稿或者片名，再跑一次。
"""
import io, os, re, urllib.parse, urllib.request
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
TEXT = open(os.path.join(HERE, '..', 'refs', '讲故事', '第2集_冰雕连_旁白.txt'), encoding='utf-8').read()
TEXT += '冰雕连长津湖一九五零年冬朝鲜致敬第二集 ·—1950'
chars = ''.join(sorted(set(TEXT) | set(map(chr, range(32, 127))) - set('\n\r\t')))
FONTS = {'sub': ('Noto Sans SC', 'wght@700'), 'title': ('Noto Serif SC', 'wght@900'), 'quote': ('Noto Serif SC', 'wght@600')}
# 纸条上的两句话本来想用手写体（Long Cang、马善政），可“耸”写出来像“算”，所以用清楚的宋体。


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


for name, (fam, axes) in FONTS.items():
    q = urllib.parse.urlencode({'family': f'{fam}:{axes}' if axes else fam, 'text': chars, 'display': 'block'})
    css = get('https://fonts.googleapis.com/css2?' + q).decode()
    url = re.search(r'url\(([^)]+)\)', css).group(1)
    f = TTFont(io.BytesIO(get(url))); f.flavor = None
    f.save(os.path.join(HERE, 'fonts', f'{name}.ttf'))
    print(name, fam, len(f.getBestCmap()), '字')
