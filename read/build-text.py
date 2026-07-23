#!/usr/bin/env python3
"""Convert TMAPO-Manuscript.md into read/pages.json for the ROOT terminal's text mode.

Usage:  python3 build-text.py [path-to-manuscript.md]
Default manuscript: ~/TMAPO-Writing/TMAPO-Manuscript.md

Each "## Page N" section becomes an array of parts:
  "..." strings  -> prose paragraphs
  {"pre": "..."} -> fixed-width ASCII blocks (from ``` fences)
The page PNGs remain authoritative for exact ASCII layout.
"""
import json
import re
import sys
from pathlib import Path

src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "TMAPO-Writing" / "TMAPO-Manuscript.md"
out = Path(__file__).parent / "pages.json"

text = src.read_text()
pages = {}
current = None
buf = []
in_fence = False
fence_buf = []

def flush_paragraphs():
    if current is None:
        return
    block = "\n".join(buf).strip()
    buf.clear()
    if not block:
        return
    for para in re.split(r"\n\s*\n", block):
        para = " ".join(line.strip() for line in para.splitlines()).strip()
        if para:
            pages[current].append(para)

for line in text.splitlines():
    m = re.match(r"^## Page (\d+)\s*$", line)
    if m and not in_fence:
        flush_paragraphs()
        current = m.group(1)
        pages[current] = []
        continue
    if line.startswith("## ") and not in_fence:
        # any other heading (e.g. "## Pages 32-39 (gap)") ends the current page
        flush_paragraphs()
        current = None
        continue
    if current is None:
        continue  # preamble before Page 1
    if line.strip().startswith("```"):
        if in_fence:
            pages[current] and None
            flush_paragraphs()  # no-op safeguard; paragraphs already flushed below
            pages[current].append({"pre": "\n".join(fence_buf).rstrip()})
            fence_buf.clear()
            in_fence = False
        else:
            flush_paragraphs()
            in_fence = True
        continue
    if in_fence:
        fence_buf.append(line)
    else:
        buf.append(line)

flush_paragraphs()

out.write_text(json.dumps(pages, ensure_ascii=False, indent=1))
counts = {k: len(v) for k, v in pages.items()}
print(f"wrote {out.name}: {len(pages)} pages "
      f"({min(map(int, pages))}–{max(map(int, pages))}), "
      f"{sum(counts.values())} parts, "
      f"{sum(1 for v in pages.values() for p in v if isinstance(p, dict))} ascii blocks")
