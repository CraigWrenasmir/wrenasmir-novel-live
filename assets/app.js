const REPO_URL = "https://github.com/CraigWrenasmir/wrenasmir-novel-live";

const topLevel = ["blog", "ideas", "drafts", "research", "visuals", "final"];

const draftFolders = [
  "1 Train",
  "2 Bushwalk",
  "3 Root",
  "4 Paperbacks",
  "5 Boxer",
  "6 Bushranger",
  "7 Misc"
];

const scenes = [
  "Scene A",
  "Scene B",
  "Scene C",
  "Scene D",
  "Scene E",
  "Scene F",
  "Scene G",
  "Scene H",
  "Scene I",
  "Scene J"
];

function repoTreeLink(path) {
  const safePath = path.split("/").map(encodeURIComponent).join("/");
  return `${REPO_URL}/tree/main/${safePath}`;
}

function repoBlobLink(path) {
  const safePath = path.split("/").map(encodeURIComponent).join("/");
  return `${REPO_URL}/blob/main/${safePath}`;
}

function sceneFileName(scene) {
  return scene.toLowerCase().replace(" ", "-") + ".md";
}

function renderTopLevelLinks() {
  const wrap = document.getElementById("top-level-links");
  wrap.innerHTML = topLevel
    .map((folder) => {
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

async function renderDraftMap() {
  const map = document.getElementById("draft-map");
  const existingFiles = await fetchExistingFiles();

  draftFolders.forEach((chapter, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = `dropdown-wrapper dropdown-${index + 1}`;

    const label = document.createElement("label");
    label.className = "dropdown-label";
    label.textContent = chapter;
    label.htmlFor = `draft-${index}`;

    const select = document.createElement("select");
    select.className = "scene-dropdown";
    select.id = `draft-${index}`;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a scene...";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    scenes.forEach((scene) => {
      const option = document.createElement("option");
      const filePath = `drafts/${chapter}/${scene}/${sceneFileName(scene)}`;
      const exists = existingFiles.has(filePath);
      option.value = repoBlobLink(filePath);
      option.textContent = `${exists ? "✅" : "❌"} ${scene}`;
      select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
      if (e.target.value) {
        const url = e.target.value;
        e.target.value = "";
        const newTab = window.open(url, "_blank", "noopener,noreferrer");
        if (!newTab) window.location.href = url;
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    map.appendChild(wrapper);
  });
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
renderDraftMap();
renderAudio();
renderVisuals();
