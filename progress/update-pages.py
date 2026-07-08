#!/usr/bin/env python3
"""Refresh the progress reader from a BookWright proof-copy PDF export.

Usage:
    python3 update-pages.py ~/Desktop/TMAPO_July2026.pdf

What it does:
  1. Whites out the orange "Proof Copy" overlay (bottom disclaimer + top rule)
     in every page's content stream.
  2. Renders each book page to PNG (PDF page 1 is the epigraph and is skipped;
     PDF page N+1 = book page N).
  3. Writes the PNGs into pages/ as "Page N.png" and rewrites the
     `const pages = [...]` array in index.html to match.

Requires: pypdf, pdftoppm (poppler).
"""

import re
import subprocess
import sys
import tempfile
from pathlib import Path

from pypdf import PdfWriter
from pypdf.generic import DecodedStreamObject

PROOF_ORANGE = b"1 0.647058823 0"
WHITE = b"1 1 1"
FRONT_MATTER_PAGES = 1  # PDF pages to skip before book page 1
DPI = 200

HERE = Path(__file__).resolve().parent
PAGES_DIR = HERE / "pages"
INDEX_HTML = HERE / "index.html"


def clean_pdf(src: Path, dst: Path) -> int:
    writer = PdfWriter(clone_from=str(src))
    total_swaps = 0
    for page in writer.pages:
        data = page.get_contents().get_data()
        swaps = data.count(PROOF_ORANGE)
        if swaps:
            data = data.replace(PROOF_ORANGE + b" scn", WHITE + b" scn")
            data = data.replace(PROOF_ORANGE + b" SCN", WHITE + b" SCN")
            stream = DecodedStreamObject()
            stream.set_data(data)
            page.replace_contents(stream)
            total_swaps += swaps
    with open(dst, "wb") as f:
        writer.write(f)
    return total_swaps


def render_pages(clean: Path, page_count: int) -> None:
    PAGES_DIR.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            [
                "pdftoppm", "-png", "-r", str(DPI),
                "-f", str(FRONT_MATTER_PAGES + 1), "-l", str(page_count),
                str(clean), f"{tmp}/pg",
            ],
            check=True,
        )
        rendered = sorted(Path(tmp).glob("pg-*.png"))
        for i, png in enumerate(rendered, start=1):
            png.replace(PAGES_DIR / f"Page {i}.png")
        return len(rendered)


def update_index(book_pages: int) -> None:
    html = INDEX_HTML.read_text()
    entries = "\n".join(
        f"            'pages/Page%20{n}.png'," for n in range(1, book_pages + 1)
    )
    new_html, count = re.subn(
        r"const pages = \[.*?\];",
        f"const pages = [\n{entries}\n        ];",
        html,
        flags=re.DOTALL,
    )
    if count != 1:
        sys.exit("Could not find the pages array in index.html — not updated.")
    INDEX_HTML.write_text(new_html)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1]).expanduser()
    if not src.exists():
        sys.exit(f"No such PDF: {src}")

    from pypdf import PdfReader
    page_count = len(PdfReader(str(src)).pages)
    book_pages = page_count - FRONT_MATTER_PAGES
    print(f"{page_count} PDF pages -> book pages 1-{book_pages}")

    with tempfile.TemporaryDirectory() as tmp:
        clean = Path(tmp) / "clean.pdf"
        swaps = clean_pdf(src, clean)
        print(f"Whited out {swaps} proof-overlay colour ops")
        rendered = render_pages(clean, page_count)
        print(f"Rendered {rendered} pages at {DPI} dpi into {PAGES_DIR}")

    update_index(book_pages)
    print(f"Updated pages array in index.html to {book_pages} pages")


if __name__ == "__main__":
    main()
