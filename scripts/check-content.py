#!/usr/bin/env python3
"""Fail if index.html still contains copy slots awaiting the source landing page text.

Usage: python3 scripts/check-content.py            # lists pending + verify slots
       python3 scripts/check-content.py --strict   # exit 1 if any pending slot remains
"""
import re, sys, pathlib

html = (pathlib.Path(__file__).resolve().parent.parent / "index.html").read_text()
pending = re.findall(r'data-copy="pending"[^>]*>(.*?)</', html, flags=re.S)
verify = re.findall(r'data-copy="verify"[^>]*>(.*?)</', html, flags=re.S)
brackets = re.findall(r'\[[^\]]{6,}\]', re.sub(r'<!--.*?-->', '', html, flags=re.S))

def clean(t):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()[:90]

print(f"Pending slots (need verbatim copy from source page): {len(pending)}")
for t in pending: print("  -", clean(t))
print(f"\nVerify slots (factual, confirm wording against source page): {len(verify)}")
for t in verify: print("  -", clean(t))
print(f"\nBracketed placeholders in visible text: {len(brackets)}")

bad = []
for pat, label in [(r'980-0545|980\) 0545|9800545', 'old phone 980-0545'), (r'479-0292|4790292', 'old phone 479-0292')]:
    if re.search(pat, html): bad.append(label)
tel = set(re.findall(r'href="tel:([^"]+)"', html))
if tel != {"7044592843"}: bad.append(f"unexpected tel links: {tel}")
if bad:
    print("\nERRORS:", *bad, sep="\n  - ")

if "--strict" in sys.argv and (pending or brackets or bad):
    sys.exit(1)
