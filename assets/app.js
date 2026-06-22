const REPO_URL = "https://github.com/CraigWrenasmir/wrenasmir-novel-live";

const topLevel = ["blog", "ideas", "drafts", "research", "visuals", "progress"];

function repoTreeLink(path) {
  const safePath = path.split("/").map(encodeURIComponent).join("/");
  return `${REPO_URL}/tree/main/${safePath}`;
}

function renderTopLevelLinks() {
  const wrap = document.getElementById("top-level-links");
  wrap.innerHTML = topLevel
    .map((folder) => {
      if (folder === "progress") {
        return `<a class="chip" href="/progress">/${folder}</a>`;
      }
      return `<a class="chip" href="${repoTreeLink(folder)}" target="_blank" rel="noopener noreferrer">/${folder}</a>`;
    })
    .join("");
}

async function fetchExistingFiles() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/CraigWrenasmir/wrenasmir-novel-live/git/trees/main?recursive=1"
    );
    if (!response.ok) return new Set();
    const data = await response.json();
    return new Set(data.tree.filter(f => f.type === "blob").map(f => f.path));
  } catch {
    return new Set();
  }
}

async function renderLatestPages() {
  const container = document.getElementById("latest-pages");
  const existingFiles = await fetchExistingFiles();

  // Collect drafted page numbers from progress/pages/Page N.png
  const pageNums = [];
  existingFiles.forEach((path) => {
    const match = path.match(/^progress\/pages\/Page (\d+)\.png$/);
    if (match) pageNums.push(parseInt(match[1], 10));
  });
  pageNums.sort((a, b) => a - b);

  if (pageNums.length === 0) {
    container.innerHTML = "<p>No pages drafted yet.</p>";
    return;
  }

  const latest = pageNums.slice(-4);
  container.innerHTML = latest
    .map((n) => {
      const src = `progress/pages/Page%20${n}.png`;
      return `<a class="latest-page" href="/progress/?page=${n}" aria-label="Open page ${n} in the Progress reader">
        <img src="${src}" alt="Page ${n}" loading="lazy">
        <span class="latest-page-num">${n}</span>
      </a>`;
    })
    .join("");
}

async function renderAudio() {
  const list = document.getElementById("audio-list");

  try {
    const response = await fetch("data/audio.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Cannot load /data/audio.json");
    const tracks = await response.json();

    if (!Array.isArray(tracks) || tracks.length === 0) {
      list.innerHTML = "<p>No audio posts yet.</p>";
      return;
    }

    list.innerHTML = tracks
      .slice().sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((track) => {
        const title = track.title || "Untitled audio post";
        const date = track.date || "No date";
        const notes = track.notes || "";
        const src = track.file || "";

        return `
          <article class="audio-item">
            <h3>${title}</h3>
            <p class="audio-meta">${date}</p>
            ${notes ? `<p>${notes}</p>` : ""}
            <audio controls preload="none">
              <source src="${src}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    list.innerHTML = `<p>Audio feed unavailable: ${error.message}</p>`;
  }
}

async function renderVisuals() {
  const gallery = document.getElementById("visual-gallery");

  try {
    const response = await fetch("data/visuals.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Cannot load /data/visuals.json");
    const images = await response.json();

    if (!Array.isArray(images) || images.length === 0) {
      gallery.innerHTML = "<p>No images yet.</p>";
      return;
    }

    gallery.innerHTML = images
      .map((img) => {
        const title = img.title || "Untitled";
        const caption = img.caption || "";
        const date = img.date || "";
        const src = img.file || "";

        return `
          <div class="gallery-item">
            <a href="${src}" target="_blank" rel="noopener noreferrer">
              <img src="${src}" alt="${title}" loading="lazy">
            </a>
            <div class="gallery-info">
              <h3>${title}</h3>
              ${date ? `<p class="gallery-date">${date}</p>` : ""}
              ${caption ? `<p class="gallery-caption">${caption}</p>` : ""}
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    gallery.innerHTML = `<p>Gallery unavailable: ${error.message}</p>`;
  }
}

async function renderIdeas() {
  const container = document.getElementById("ideas-list");

  try {
    const response = await fetch("data/ideas.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Cannot load data/ideas.json");
    const ideas = await response.json();

    if (!Array.isArray(ideas) || ideas.length === 0) {
      container.innerHTML = "<p>No ideas yet.</p>";
      return;
    }

    container.innerHTML = ideas
      .slice().sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((idea) => {
        const title = idea.title || "Untitled";
        const preview = idea.preview || "";
        const date = idea.date || "";
        const file = idea.file || "";

        return `
          <div class="idea-item">
            <h3>${title}</h3>
            ${date ? `<p class="idea-date">${date}</p>` : ""}
            <p class="idea-preview">${preview}</p>
            ${file ? `<a href="${repoTreeLink(file)}" class="idea-link" target="_blank" rel="noopener noreferrer">Read full note →</a>` : ""}
          </div>
        `;
      })
      .join("");
  } catch (error) {
    container.innerHTML = `<p>Ideas unavailable: ${error.message}</p>`;
  }
}

renderTopLevelLinks();
renderIdeas();
renderLatestPages();
renderAudio();
renderVisuals();
