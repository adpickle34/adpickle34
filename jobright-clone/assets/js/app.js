/* ============================================================
   JobRight clone — app logic
   Views: recommended / liked / applied / orion / profile
   State persists to localStorage so the "account" survives reloads.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- state ---------- */

  const DEFAULT_PROFILE = {
    name: "",
    title: "",
    years: 0,
    workMode: "",
    needsH1b: false,
    skills: []
  };

  const state = {
    profile: load("jr_profile", DEFAULT_PROFILE),
    liked: load("jr_liked", []),      // job ids
    applied: load("jr_applied", []),  // job ids
    chat: load("jr_chat", []),        // {role, text}
    view: "recommended",
    filters: { search: "", level: "", workMode: "", h1b: false, minMatch: 0 }
  };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : structuredClone(fallback);
    } catch {
      return structuredClone(fallback);
    }
  }

  function save() {
    localStorage.setItem("jr_profile", JSON.stringify(state.profile));
    localStorage.setItem("jr_liked", JSON.stringify(state.liked));
    localStorage.setItem("jr_applied", JSON.stringify(state.applied));
    localStorage.setItem("jr_chat", JSON.stringify(state.chat));
  }

  /* ---------- matching engine ---------- */

  const LEVEL_YEARS = { Entry: 0, Mid: 3, Senior: 6 };

  // Returns { total, skills, experience, workMode, visa, matchedSkills, missingSkills }
  function scoreJob(job) {
    const p = state.profile;

    // Skills overlap (45%)
    const userSkills = new Set(p.skills.map(s => s.toLowerCase()));
    const matchedSkills = job.skills.filter(s => userSkills.has(s.toLowerCase()));
    const missingSkills = job.skills.filter(s => !userSkills.has(s.toLowerCase()));
    // With no profile skills yet, use a neutral baseline so the list isn't all red.
    const skillScore = p.skills.length === 0 ? 0.6 : matchedSkills.length / job.skills.length;

    // Experience fit (25%) — full credit at/above the level's bar, partial below
    const needed = LEVEL_YEARS[job.level] ?? 0;
    let expScore;
    if (p.years >= needed) {
      // Slight penalty for being very overqualified for entry roles
      expScore = job.level === "Entry" && p.years >= 6 ? 0.8 : 1;
    } else {
      expScore = 0.35 + 0.65 * (p.years / needed);
    }

    // Work mode (15%)
    const modeScore = !p.workMode ? 1 : (job.workMode === p.workMode ? 1 : job.workMode === "Hybrid" || p.workMode === "Hybrid" ? 0.7 : 0.4);

    // Visa (15%)
    const visaScore = !p.needsH1b ? 1 : (job.h1b ? 1 : 0.1);

    const total = Math.round(100 * (0.45 * skillScore + 0.25 * expScore + 0.15 * modeScore + 0.15 * visaScore));
    return {
      total,
      skills: Math.round(skillScore * 100),
      experience: Math.round(expScore * 100),
      workMode: Math.round(modeScore * 100),
      visa: Math.round(visaScore * 100),
      matchedSkills, missingSkills
    };
  }

  function matchTier(total) {
    if (total >= 85) return { label: "STRONG MATCH", cls: "strong" };
    if (total >= 70) return { label: "GOOD MATCH", cls: "good" };
    return { label: "FAIR MATCH", cls: "fair" };
  }

  /* ---------- helpers ---------- */

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function fmtSalary([lo, hi]) {
    const k = n => "$" + Math.round(n / 1000) + "K";
    return `${k(lo)} – ${k(hi)}`;
  }

  function fmtPosted(days) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // Minimal markdown: **bold**, newlines, bullet lines
  function md(text) {
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  }

  /* ---------- jobs view ---------- */

  function currentJobs() {
    let jobs = JOBS.map(j => ({ job: j, score: scoreJob(j) }));

    if (state.view === "liked") jobs = jobs.filter(x => state.liked.includes(x.job.id));
    if (state.view === "applied") jobs = jobs.filter(x => state.applied.includes(x.job.id));

    const f = state.filters;
    if (f.search) {
      const q = f.search.toLowerCase();
      jobs = jobs.filter(x =>
        x.job.title.toLowerCase().includes(q) ||
        x.job.company.toLowerCase().includes(q) ||
        x.job.skills.some(s => s.toLowerCase().includes(q)));
    }
    if (f.level) jobs = jobs.filter(x => x.job.level === f.level);
    if (f.workMode) jobs = jobs.filter(x => x.job.workMode === f.workMode);
    if (f.h1b) jobs = jobs.filter(x => x.job.h1b);
    if (f.minMatch) jobs = jobs.filter(x => x.score.total >= f.minMatch);

    jobs.sort((a, b) => b.score.total - a.score.total || a.job.postedDays - b.job.postedDays);
    return jobs;
  }

  function renderJobs() {
    const list = $("#job-list");
    const jobs = currentJobs();

    const titles = {
      recommended: ["Recommended for you", "Ranked by match score against your profile · refreshed daily"],
      liked: ["Liked jobs", "Roles you've saved — apply before they close"],
      applied: ["Applied jobs", "Your active pipeline"]
    };
    $("#view-title").textContent = titles[state.view][0];
    $("#view-sub").textContent = titles[state.view][1];

    if (jobs.length === 0) {
      list.innerHTML = "";
      $("#empty-state").classList.remove("hidden");
      $("#empty-title").textContent = state.view === "recommended" ? "No jobs match those filters" :
        state.view === "liked" ? "No liked jobs yet" : "No applications yet";
      $("#empty-sub").textContent = state.view === "recommended" ? "Try loosening your filters." :
        "Browse Recommended and " + (state.view === "liked" ? "tap ❤️ on roles you like." : "hit Apply on your strong matches.");
      return;
    }
    $("#empty-state").classList.add("hidden");

    list.innerHTML = jobs.map(({ job, score }) => {
      const tier = matchTier(score.total);
      const liked = state.liked.includes(job.id);
      const applied = state.applied.includes(job.id);
      return `
      <article class="job-card" data-id="${job.id}">
        <div class="score-ring ${tier.cls}" style="--pct:${score.total}">
          <span>${score.total}%</span>
        </div>
        <div class="job-main">
          <div class="job-head">
            <h3>${esc(job.title)}</h3>
            <span class="match-pill ${tier.cls}">${tier.label}</span>
          </div>
          <p class="job-meta">
            <strong>${esc(job.company)}</strong> · ${esc(job.location)} · ${job.workMode}
            · ${fmtSalary(job.salary)} · ${fmtPosted(job.postedDays)}
            ${job.h1b ? '· <span class="h1b-tag">H1B</span>' : ""}
          </p>
          <p class="job-skills">
            ${job.skills.map(s => `<span class="skill ${score.matchedSkills.includes(s) ? "hit" : ""}">${esc(s)}</span>`).join("")}
          </p>
        </div>
        <div class="job-actions">
          <button class="icon-btn like-btn ${liked ? "on" : ""}" data-act="like" title="Like">${liked ? "❤️" : "🤍"}</button>
          <button class="btn ${applied ? "btn-done" : "btn-primary"} btn-sm" data-act="apply">${applied ? "Applied ✓" : "Apply"}</button>
        </div>
      </article>`;
    }).join("");
  }

  /* ---------- job detail drawer ---------- */

  function openDrawer(jobId) {
    const job = JOBS.find(j => j.id === jobId);
    if (!job) return;
    const score = scoreJob(job);
    const tier = matchTier(score.total);
    const applied = state.applied.includes(job.id);
    const liked = state.liked.includes(job.id);

    $("#job-drawer").innerHTML = `
      <button class="drawer-close" data-act="close">✕</button>
      <div class="drawer-score">
        <div class="score-ring lg ${tier.cls}" style="--pct:${score.total}"><span>${score.total}%</span></div>
        <span class="match-pill ${tier.cls}">${tier.label}</span>
      </div>
      <h2>${esc(job.title)}</h2>
      <p class="job-meta"><strong>${esc(job.company)}</strong> · ${esc(job.location)} · ${job.workMode} · ${fmtSalary(job.salary)} · ${fmtPosted(job.postedDays)} ${job.h1b ? '· <span class="h1b-tag">H1B sponsor</span>' : ""}</p>

      <div class="drawer-actions">
        <button class="btn ${applied ? "btn-done" : "btn-primary"}" data-act="apply" data-id="${job.id}">${applied ? "Applied ✓" : "Apply now"}</button>
        <button class="btn btn-outline" data-act="like" data-id="${job.id}">${liked ? "❤️ Liked" : "🤍 Like"}</button>
        <button class="btn btn-ghost" data-act="ask-orion" data-id="${job.id}">🧭 Ask Orion</button>
      </div>

      <h4>Match breakdown</h4>
      <div class="breakdown">
        ${breakdownRow("Skills overlap", score.skills, "45%")}
        ${breakdownRow("Experience fit", score.experience, "25%")}
        ${breakdownRow("Work mode", score.workMode, "15%")}
        ${breakdownRow("Visa fit", score.visa, "15%")}
      </div>

      ${score.matchedSkills.length ? `<h4>Your matching skills</h4><p class="job-skills">${score.matchedSkills.map(s => `<span class="skill hit">${esc(s)}</span>`).join("")}</p>` : ""}
      ${score.missingSkills.length ? `<h4>Skills to highlight or learn</h4><p class="job-skills">${score.missingSkills.map(s => `<span class="skill">${esc(s)}</span>`).join("")}</p>` : ""}

      <h4>About the role</h4>
      <p class="drawer-desc">${esc(job.description)}</p>

      <h4>What you'll do</h4>
      <ul class="drawer-list">${job.responsibilities.map(r => `<li>${esc(r)}</li>`).join("")}</ul>

      <h4>🤝 Insider connections</h4>
      <p class="drawer-desc">${job.connections > 0
        ? `You have <strong>${job.connections} potential connection${job.connections > 1 ? "s" : ""}</strong> at ${esc(job.company)} — alumni and 2nd-degree contacts who could refer you. Referred candidates are ~4x more likely to get an interview.`
        : `No direct connections found at ${esc(job.company)} yet. Try engaging with their team on LinkedIn before applying cold.`}</p>
    `;
    $("#job-drawer").classList.remove("hidden");
    $("#drawer-overlay").classList.remove("hidden");
    $("#job-drawer").scrollTop = 0;
  }

  function breakdownRow(label, pct, weight) {
    const cls = pct >= 85 ? "strong" : pct >= 60 ? "good" : "fair";
    return `
      <div class="breakdown-row">
        <span class="breakdown-label">${label} <em>(${weight})</em></span>
        <div class="bar"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>
        <span class="breakdown-pct">${pct}%</span>
      </div>`;
  }

  function closeDrawer() {
    $("#job-drawer").classList.add("hidden");
    $("#drawer-overlay").classList.add("hidden");
  }

  /* ---------- like / apply ---------- */

  function toggleLike(id) {
    const i = state.liked.indexOf(id);
    if (i >= 0) state.liked.splice(i, 1); else state.liked.push(id);
    save(); refresh();
  }

  function toggleApply(id) {
    const i = state.applied.indexOf(id);
    if (i >= 0) state.applied.splice(i, 1); else state.applied.push(id);
    save(); refresh();
  }

  function refresh() {
    $("#liked-count").textContent = state.liked.length;
    $("#applied-count").textContent = state.applied.length;
    if (["recommended", "liked", "applied"].includes(state.view)) renderJobs();
  }

  /* ---------- orion chat ---------- */

  function orionAnswer(question) {
    const q = question.toLowerCase();
    for (const entry of ORION_RESPONSES) {
      if (entry.keys.some(k => q.includes(k))) return entry.reply;
    }
    return ORION_DEFAULT;
  }

  function orionGreeting() {
    const name = state.profile.name ? `, ${state.profile.name.split(" ")[0]}` : "";
    const strong = JOBS.map(j => scoreJob(j).total).filter(t => t >= 85).length;
    return `Hi${name}! I'm **Orion**, your AI career copilot. 🧭\n\nRight now you have **${strong} strong matches** (85%+) in your feed. I can help with resumes, interview prep, salary negotiation, or explain why any job was matched to you. What's on your mind?`;
  }

  function pushChat(role, text) {
    state.chat.push({ role, text });
    save();
    renderChat();
  }

  function renderChat() {
    const log = $("#chat-log");
    if (state.chat.length === 0) {
      state.chat.push({ role: "orion", text: orionGreeting() });
    }
    log.innerHTML = state.chat.map(m => `
      <div class="msg ${m.role}">
        ${m.role === "orion" ? '<div class="msg-avatar">🧭</div>' : ""}
        <div class="msg-bubble">${md(m.text)}</div>
      </div>`).join("");
    log.scrollTop = log.scrollHeight;
  }

  function askOrion(text) {
    pushChat("user", text);
    // Simulate "thinking" latency for realism
    const typing = document.createElement("div");
    typing.className = "msg orion typing";
    typing.innerHTML = '<div class="msg-avatar">🧭</div><div class="msg-bubble"><span class="dots"><i></i><i></i><i></i></span></div>';
    $("#chat-log").appendChild(typing);
    $("#chat-log").scrollTop = $("#chat-log").scrollHeight;
    setTimeout(() => {
      typing.remove();
      pushChat("orion", orionAnswer(text));
    }, 700 + Math.random() * 600);
  }

  function askOrionAboutJob(id) {
    const job = JOBS.find(j => j.id === id);
    if (!job) return;
    const score = scoreJob(job);
    const tier = matchTier(score.total);
    closeDrawer();
    switchView("orion");
    pushChat("user", `Why did I match with ${job.title} at ${job.company}?`);
    setTimeout(() => {
      const hits = score.matchedSkills.length ? score.matchedSkills.join(", ") : "none yet — add skills in My Profile";
      const gaps = score.missingSkills.slice(0, 3).join(", ");
      pushChat("orion",
        `**${job.title} @ ${job.company}** scored **${score.total}% (${tier.label})** for you:\n\n` +
        `• **Skills overlap: ${score.skills}%** — matching skills: ${hits}\n` +
        `• **Experience fit: ${score.experience}%** — the role is ${job.level}-level\n` +
        `• **Work mode: ${score.workMode}%** — it's ${job.workMode}\n` +
        `• **Visa fit: ${score.visa}%** — ${job.h1b ? "they have H1B sponsorship history" : "no sponsorship history on file"}\n\n` +
        (gaps ? `To stand out, address these in your resume or a project: **${gaps}**. ` : "") +
        (score.total >= 85 ? "This is a strong match — I'd apply within 48 hours and check the insider connections first." : "Tailor your resume to their skill list before applying to lift your odds."));
    }, 900);
  }

  /* ---------- profile ---------- */

  function renderProfile() {
    $("#p-name").value = state.profile.name;
    $("#p-title").value = state.profile.title;
    $("#p-years").value = String(state.profile.years);
    $("#p-workmode").value = state.profile.workMode;
    $("#p-h1b").checked = state.profile.needsH1b;
    renderSkillBank();
  }

  function renderSkillBank() {
    const all = Array.from(new Set([...SKILL_BANK, ...state.profile.skills]));
    $("#skill-bank").innerHTML = all.map(s => `
      <button type="button" class="chip skill-chip ${state.profile.skills.includes(s) ? "on" : ""}" data-skill="${esc(s)}">${esc(s)}</button>
    `).join("");
  }

  function saveProfileFromForm() {
    state.profile.name = $("#p-name").value.trim();
    state.profile.title = $("#p-title").value.trim();
    state.profile.years = Number($("#p-years").value);
    state.profile.workMode = $("#p-workmode").value;
    state.profile.needsH1b = $("#p-h1b").checked;
    save();
    renderUserChip();
  }

  function renderUserChip() {
    const p = state.profile;
    $("#user-name").textContent = p.name || "Guest";
    $("#user-title").textContent = p.title || "Set up your profile";
    $("#user-avatar").textContent = p.name ? p.name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("") : "?";
  }

  /* ---------- onboarding ---------- */

  function maybeOnboard() {
    const wantsOnboarding = location.hash === "#onboarding";
    const hasProfile = state.profile.name || state.profile.skills.length;
    if (wantsOnboarding && !hasProfile) {
      $("#onboarding-modal").classList.remove("hidden");
    }
  }

  /* ---------- view switching ---------- */

  function switchView(view) {
    state.view = view;
    $$(".side-link").forEach(b => b.classList.toggle("active", b.dataset.view === view));
    const isJobs = ["recommended", "liked", "applied"].includes(view);
    $("#view-jobs").classList.toggle("hidden", !isJobs);
    $("#view-orion").classList.toggle("hidden", view !== "orion");
    $("#view-profile").classList.toggle("hidden", view !== "profile");
    if (isJobs) renderJobs();
    if (view === "orion") renderChat();
    if (view === "profile") renderProfile();
  }

  /* ---------- events ---------- */

  function bind() {
    // Sidebar nav
    $$(".side-link").forEach(b => b.addEventListener("click", () => switchView(b.dataset.view)));

    // Filters
    $("#filter-search").addEventListener("input", e => { state.filters.search = e.target.value; renderJobs(); });
    $("#filter-level").addEventListener("change", e => { state.filters.level = e.target.value; renderJobs(); });
    $("#filter-workmode").addEventListener("change", e => { state.filters.workMode = e.target.value; renderJobs(); });
    $("#filter-h1b").addEventListener("change", e => { state.filters.h1b = e.target.checked; renderJobs(); });
    $("#filter-minmatch").addEventListener("change", e => { state.filters.minMatch = Number(e.target.value); renderJobs(); });

    // Job list clicks (card → drawer, buttons → like/apply)
    $("#job-list").addEventListener("click", e => {
      const card = e.target.closest(".job-card");
      if (!card) return;
      const id = Number(card.dataset.id);
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "like") return toggleLike(id);
      if (act === "apply") return toggleApply(id);
      openDrawer(id);
    });

    // Drawer
    $("#drawer-overlay").addEventListener("click", closeDrawer);
    $("#job-drawer").addEventListener("click", e => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (!act) return;
      const id = Number(e.target.closest("[data-act]").dataset.id);
      if (act === "close") return closeDrawer();
      if (act === "like") { toggleLike(id); openDrawer(id); }
      if (act === "apply") { toggleApply(id); openDrawer(id); }
      if (act === "ask-orion") askOrionAboutJob(id);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

    // Orion chat
    $("#chat-form").addEventListener("submit", e => {
      e.preventDefault();
      const text = $("#chat-text").value.trim();
      if (!text) return;
      $("#chat-text").value = "";
      askOrion(text);
    });
    $("#chat-suggestions").addEventListener("click", e => {
      const q = e.target.closest("[data-q]")?.dataset.q;
      if (q) askOrion(q);
    });

    // Profile
    $("#skill-bank").addEventListener("click", e => {
      const skill = e.target.closest("[data-skill]")?.dataset.skill;
      if (!skill) return;
      const i = state.profile.skills.indexOf(skill);
      if (i >= 0) state.profile.skills.splice(i, 1); else state.profile.skills.push(skill);
      save();
      renderSkillBank();
    });
    $("#add-skill-btn").addEventListener("click", () => {
      const input = $("#p-custom-skill");
      const skill = input.value.trim();
      if (!skill) return;
      if (!state.profile.skills.includes(skill)) state.profile.skills.push(skill);
      input.value = "";
      save();
      renderSkillBank();
    });
    $("#profile-form").addEventListener("submit", e => {
      e.preventDefault();
      saveProfileFromForm();
      switchView("recommended");
    });

    // Onboarding
    $("#ob-skip").addEventListener("click", () => $("#onboarding-modal").classList.add("hidden"));
    $("#ob-save").addEventListener("click", () => {
      state.profile.name = $("#ob-name").value.trim();
      state.profile.title = $("#ob-title").value.trim();
      state.profile.years = Number($("#ob-years").value);
      save();
      renderUserChip();
      $("#onboarding-modal").classList.add("hidden");
      renderJobs();
    });
  }

  /* ---------- boot ---------- */

  bind();
  renderUserChip();
  refresh();

  // Deep links: app.html#orion / #profile / #applied / #liked
  const hashView = location.hash.replace("#", "");
  if (["orion", "profile", "liked", "applied"].includes(hashView)) {
    switchView(hashView);
  } else {
    switchView("recommended");
  }
  maybeOnboard();
})();
