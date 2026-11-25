(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const all = [...window.FEATURED, ...window.EARLIER];

  const pipeline = (steps) =>
    `<ol class="pipe">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;

  const card = (p, featured) => `
    <article class="card${featured ? " card-lg" : ""}">
      <button class="card-hit" data-id="${p.id}" aria-label="Open case study: ${esc(p.title)}"></button>
      <div class="card-top">
        <span class="metric">${esc(p.metric)}</span>
        ${p.status === "next" ? '<span class="badge">Next up</span>' : ""}
      </div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.tagline)}</p>
      ${featured && p.pipeline.length ? pipeline(p.pipeline) : ""}
      <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      ${p.links && (p.links.live || p.links.github) ? `<div class="card-actions">
        ${p.links.live ? `<a class="btn btn-primary btn-sm btn-live" href="${esc(p.links.live)}" target="_blank" rel="noopener"><span class="live-dot" aria-hidden="true"></span>Live demo ↗</a>` : ""}
        ${p.links.github ? `<a class="btn btn-ghost btn-sm" href="${esc(p.links.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
      </div>` : ""}
      <span class="more">Case study →</span>
    </article>`;

  document.getElementById("featured").innerHTML = window.FEATURED.map((p) => card(p, true)).join("");
  document.getElementById("earlier").innerHTML = window.EARLIER.map((p) => card(p, false)).join("");

  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  function open(id) {
    const p = all.find((x) => x.id === id);
    if (!p) return;
    const links = p.links || {};
    body.innerHTML = `
      <span class="metric">${esc(p.metric)}</span>
      ${p.status === "next" ? '<span class="badge">Next up</span>' : ""}
      <h2 id="m-title">${esc(p.title)}</h2>
      <p class="m-lead">${esc(p.tagline)}</p>
      ${p.pipeline.length ? `<h4>How it works</h4>${pipeline(p.pipeline)}` : ""}
      ${p.sections.map((s) => `<h4>${esc(s.h)}</h4><p>${esc(s.t)}</p>`).join("")}
      <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      ${links.github || links.live ? `<div class="hero-actions">
        ${links.github ? `<a class="btn btn-ghost" href="${esc(links.github)}" target="_blank" rel="noopener">GitHub</a>` : ""}
        ${links.live ? `<a class="btn btn-primary" href="${esc(links.live)}" target="_blank" rel="noopener">Live demo</a>` : ""}
      </div>` : ""}`;
    modal.showModal();
    body.scrollTop = 0;
    body.focus(); // arrow keys and Page Down scroll the case study straight away
    history.replaceState(null, "", "#" + id);
  }

  document.addEventListener("click", (e) => {
    const hit = e.target.closest(".card-hit");
    if (hit) open(hit.dataset.id);
    if (e.target === modal || e.target.closest("#close")) modal.close();
  });
  modal.addEventListener("close", () => history.replaceState(null, "", location.pathname));

  const start = location.hash.slice(1);
  if (all.some((p) => p.id === start)) open(start);
})();
