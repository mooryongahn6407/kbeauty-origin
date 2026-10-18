import asyncio, re, sys, pathlib, edge_tts
repo = pathlib.Path(sys.argv[1])
src = (repo / 'src/content/intro-script.ts').read_text(encoding='utf-8')
body = src.split('INTRO_LINES', 1)[1]
blocks = re.findall(r"L\(\s*(.*?)\),\n", body, re.S)
BS = chr(92)
def strs(b):
    out = []
    pat = "'((?:[^'" + BS + BS + "]|" + BS + BS + ".)*)'|\"((?:[^\"" + BS + BS + "]|" + BS + BS + ".)*)\""
    for m in re.finditer(pat, b):
        s = m.group(1) if m.group(1) is not None else m.group(2)
        out.append(s.replace(BS + "'", "'"))
    return out
lines = [strs(b) for b in blocks]
assert len(lines) == 6 and all(len(x) == 5 for x in lines), [len(x) for x in lines]
# L(ko, en, lo, th, fr)
idx = {'ko': 0, 'en': 1, 'th': 3, 'fr': 4}
voice = {'ko': 'ko-KR-SunHiNeural', 'en': 'en-US-JennyNeural', 'fr': 'fr-FR-DeniseNeural', 'th': 'th-TH-PremwadeeNeural'}
async def main():
    for lang, i in idx.items():
        d = repo / 'public/intro/audio' / lang
        d.mkdir(parents=True, exist_ok=True)
        for n, l in enumerate(lines, 1):
            await edge_tts.Communicate(l[i], voice[lang], rate='-5%').save(str(d / f'{n}.mp3'))
            print(lang, n, (d / f'{n}.mp3').stat().st_size, l[i][:30])
asyncio.run(main())
