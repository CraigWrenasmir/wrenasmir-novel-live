# Their Most August Public Organ

novel.wrenasmir.com: the finished book, kept on a ROOT terminal.

- `index.html` is the landing page: the monitor in the paddock, resting on the `/ROOT` directory as a menu (about, read, unabridged recording, play ROOT). Set `VIDEO_ID` near the top of its script to the YouTube ID once the recording is uploaded; until then the recording is listed under `/unverified/` and cannot be selected.
- `read/index.html` is the reader (SCAN, TEXT, PAPER, STEADY and FIELD modes; `HOME` returns to the directory; `/read/?embed=1` gives a bare monitor for the Squarespace iframe).
- README.txt (about the novel: Craig's note and the photographs) opens in the tube too. Its words live in the `<template id="readme">` block in `index.html`; `/about/` redirects to `/#about`, which opens it directly. Media for it goes in `about/`.
- `terminal.css` is the monitor, tube and paddock, shared by the landing page and the reader.
- `pages/` holds the 82 page scans; `pages.json` is the text layer; `field.jpg` is the paddock behind the monitor.
- `404.html` sends everything else to the landing page.

The writing-period site (progress log, Pressure Map, Frequencies, drafts, research, visuals) was retired on 3 October 2026 when the first draft was completed. It survives in this repository's history and in a local archive.
