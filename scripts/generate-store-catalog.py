"""Regenerate src/content/store-catalog.ts from the owner's ingredient master.

The workbook lives on Google Drive (KOREA_GLOW_성분표_마스터_260930.xlsx), not in this public repo.
Usage: python3 scripts/generate-store-catalog.py <master.xlsx> src/content/store-catalog.ts
then: npx prettier --single-quote --trailing-comma all --print-width 100 --write src/content/store-catalog.ts
"""
import json, re, sys, openpyxl
src, out = sys.argv[1], sys.argv[2]
SOURCE = {'실물 라벨 확인': 'LABEL_CHECKED',
          '공급사·공개자료 AI 판독(실물 확인 전)': 'SUPPLIER_TEXT_UNCHECKED',
          '전성분 확인 전': 'INCI_PENDING', '해당 없음(소품)': 'NOT_APPLICABLE'}
ws = openpyxl.load_workbook(src, read_only=True)['제품_전체']
rows = []
for r in ws.iter_rows(min_row=7, values_only=True):
    if not (r[0] and str(r[0]).startswith('KG-')) or r[1] != '지금 판매':
        continue
    raw = (r[13] or '').strip() if SOURCE[r[8]] in ('LABEL_CHECKED', 'SUPPLIER_TEXT_UNCHECKED') else ''
    truncated = '[이후 잘림]' in raw
    raw = raw.replace('[이후 잘림]', '').strip().rstrip(',')
    raw = re.sub(r'\s*(\.\.\.|…)\s*', ', <GAP>, ', raw)
    tokens = [t.strip() for t in re.split(r',\s*(?![0-9]-)', raw) if t.strip()]
    gap = None
    if '<GAP>' in tokens:
        gap = tokens.index('<GAP>')
        truncated = True
    tokens = [t for t in tokens if t != '<GAP>']
    source = SOURCE[r[8]]
    if source in ('LABEL_CHECKED', 'SUPPLIER_TEXT_UNCHECKED') and (r[7] != '확보' or not tokens):
        source = 'INCI_PENDING'  # the master's own 전성분 column says 미확보
    rows.append({'sku': r[0], 'category': r[2], 'brand': r[3], 'nameKo': r[4],
                 'nameEn': r[5] or None, 'size': (str(r[6]).strip() if r[6] and str(r[6]).strip() not in ('-', '') else None),
                 'source': source, 'inci': tokens, 'inciGapAfter': gap,
                 'inciTruncated': truncated})
body = json.dumps(rows, ensure_ascii=False, indent=2)
open(out, 'w').write('''/**
 * Every product the shop sells today (상태 = 지금 판매), as printed.
 *
 * GENERATED from the owner's ingredient master, KOREA_GLOW_성분표_마스터_260930.xlsx (Google
 * Drive), sheet 제품_전체 — do not edit by hand; regenerate. Only the columns that are printed
 * facts are carried: SKU, category, brand, names, size, which source the ingredient text came
 * from, and the ingredient list in printed order. The master's AI-written columns (핵심 성분,
 * 한 줄 소개) are deliberately left out — they are not reviewed — and nothing about price,
 * cost or supply is in that workbook or here.
 *
 * A row whose 전성분 column says 미확보 is INCI_PENDING whatever its source column says,
 * because there is no list to read.
 *
 * `inci` is the list exactly as the master transcribes it, including its occasional noise. When
 * the printed text was elided ("...") `inciGapAfter` is how many names came before the gap, and
 * the positions of the names after it are unknown.
 */
import type { StoreProduct } from './store-catalog-types';

export const storeCatalog: readonly StoreProduct[] = ''' + body + ';\n')
print(len(rows))
