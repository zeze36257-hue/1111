"""Download Google Fonts subsets covering every character in index.html into fonts/.

    python fetch_fonts.py      -> fonts/*.woff2 + fonts/fonts.css

Run it again whenever the copy in index.html gains new characters.
"""
import os, re, urllib.parse, urllib.request

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'fonts')
os.makedirs(out, exist_ok=True)
src = open(os.path.join(here, 'index.html'), encoding='utf-8').read()
chars = ''.join(sorted(set(src) | set(map(chr, range(32, 127))) - set('\n\r\t')))
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
FAMILIES = [('Noto Serif SC', 'wght@500;700;900'), ('Noto Sans SC', 'wght@300;500;700;900'), ('Cormorant Garamond', 'ital,wght@0,600;1,500;1,600')]


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


css_out = []
for fam, axes in FAMILIES:
    q = urllib.parse.urlencode({'family': f'{fam}:{axes}', 'text': chars, 'display': 'block'})
    css = get('https://fonts.googleapis.com/css2?' + q).decode()
    for i, block in enumerate(re.findall(r'@font-face\s*{[^}]*}', css)):
        url = re.search(r'url\(([^)]+)\)', block).group(1)
        style = re.search(r'font-style:\s*(\w+)', block).group(1)
        weight = re.search(r'font-weight:\s*(\d+)', block).group(1)
        name = f"{fam.replace(' ', '')}-{weight}{'i' if style == 'italic' else ''}.woff2"
        open(os.path.join(out, name), 'wb').write(get(url))
        css_out.append(block.replace(url, name))
        print(f'{name}  {os.path.getsize(os.path.join(out, name)) // 1024} KB')
open(os.path.join(out, 'fonts.css'), 'w', encoding='utf-8').write('\n'.join(css_out) + '\n')
