const REPO_URL = "https://github.com/YOUR_USERNAME/their-most-august-public-organ";

const topLevel = ["blog", "drafts", "ideas", "research", "visuals", "final"];

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

function renderTopLevelLinks() {
  const wrap = document.getElementById("top-level-links");
  wrap.innerHTML = topLevel
    .map((folder) => {
      return `<a class="chip" href="${repoTreeLink(folder)}" target="_blank" rel="noopener noreferrer">/${folder}</a>`;
    })
    .join("");
}

function renderDraftMap() {
  const map = document.getElementById("draft-map");

  draftFolders.forEach((chapter) => {
    const block = document.createElement("section");
    block.className = "draft-block";

    const title = document.createElement("h3");
    title.className = "draft-title";
    title.textContent = chapter;

    const grid = document.createElement("div");
    grid.className = "scene-grid";

    scenes.forEach((scene) => {
      const link = document.createElement("a");
      link.className = "scene-link";
      link.textContent = scene;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.href = repoTreeLink(`drafts/${chapter}/${scene}`);
      grid.appendChild(link);
    });

    block.appendChild(title);
    block.appendChild(grid);
    map.appendChild(block);
  });
}

async function renderAudio() {
  const list = document.getElementById("audio-list");

  try {
    const response = await fetch("/data/audio.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Cannot load /data/audio.json");
    const tracks = await response.json();

    if (!Array.isArray(tracks) || tracks.length === 0) {
      list.innerHTML = "<p>No audio posts yet.</p>";
      return;
    }

    list.innerHTML = tracks
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

renderTopLevelLinks();
renderDraftMap();
renderAudio();
