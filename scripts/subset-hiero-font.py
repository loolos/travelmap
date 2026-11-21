"""Subset Noto Sans Egyptian Hieroglyphs (OFL) to the signs the app uses.

Usage: python3 scripts/subset-hiero-font.py <full-font.woff2>
Needs: pip install fonttools brotli. Source: npm @fontsource/noto-sans-egyptian-hieroglyphs.
Signs come from src/games/cartouche.ts and src/content/glyphs.json.
"""
import json, re, subprocess, sys

cps = {int(h, 16) for h in re.findall(r"\\u\{([0-9A-Fa-f]+)\}", open('src/games/cartouche.ts', encoding='utf8').read())}
cps |= {ord(g['glyph']) for g in json.load(open('src/content/glyphs.json', encoding='utf8'))}
unicodes = ','.join(f'U+{c:X}' for c in sorted(cps))
subprocess.run(['pyftsubset', sys.argv[1], f'--unicodes={unicodes}', '--flavor=woff2',
                '--output-file=public/fonts/hiero-subset.woff2'], check=True)
print(f'{len(cps)} glyphs')
