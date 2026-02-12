# Their Most August Public Organ

A plain HTML/CSS/JS GitHub Pages project for sharing drafts, ideas, research, visuals, and short audio blog updates.

## Folder structure

Top-level folders:

- `blog/`
- `drafts/`
- `ideas/`
- `research/`
- `visuals/`
- `final/`

Draft folders:

- `drafts/1 Train/` through `drafts/7 Misc/`
- Each draft contains `Scene A` to `Scene J`

## Manual update workflow

1. Add or edit files locally (draft text, images, `.mp3`, etc.).
2. For audio posts:
   - Put audio files in `blog/audio/`.
   - Add one entry in `data/audio.json` for each new `.mp3`.
3. Commit and push:

```bash
git add .
git commit -m "Update novel materials"
git push
```

## First-time GitHub setup

1. Create a new GitHub repo.
2. Connect local repo to GitHub:

```bash
git remote add origin https://github.com/<your-username>/their-most-august-public-organ.git
git branch -M main
git push -u origin main
```

3. In GitHub repo settings, enable Pages:
   - Source: `Deploy from a branch`
   - Branch: `main` and folder `/ (root)`

## Important placeholders to edit

- In `assets/app.js`, set:
  - `REPO_URL = "https://github.com/YOUR_USERNAME/YOUR_REPO"`

## Custom subdomain

Custom domain selected: `novel.wrenasmir.com`

1. A `CNAME` file is already included in repo root with `novel.wrenasmir.com`.
2. In your DNS provider, add a `CNAME` record for the chosen subdomain pointing to `<your-username>.github.io`.
3. In GitHub Pages settings, set the custom domain to the same subdomain and enable HTTPS.
