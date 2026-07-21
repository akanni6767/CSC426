/* =========================================================
   IRO - Issues Reporting Outlet
   Vanilla JS. Data is stored as JSON text inside the
   browser's localStorage under the key "iro_issues".
   This means the data persists even after closing the tab,
   but only on this device/browser (no server involved).
   ========================================================= */

const STORAGE_KEY = "iro_issues";

/* ---------- Storage helpers (read/write JSON) ---------- */

// Read the list of issues from localStorage.
// localStorage only stores strings, so we JSON.parse() it
// back into a real JavaScript array.
function getIssues() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Corrupted data in storage, resetting.", e);
    return [];
  }
}

// Save the list of issues back to localStorage.
// JSON.stringify() converts the array into a JSON string.
function saveIssues(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

// Create a simple unique id (good enough for this prototype).
function makeId() {
  return "IRO-" + Date.now().toString(36).toUpperCase();
}

/* ---------- Tab switching ---------- */

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");

    if (btn.dataset.tab === "dashboard") {
      renderDashboard();
    }
  });
});

/* ---------- Report form ---------- */

const issueForm = document.getElementById("issueForm");
const formMsg = document.getElementById("formMsg");

issueForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newIssue = {
    id: makeId(),
    reporterName: document.getElementById("reporterName").value.trim() || "Anonymous",
    reporterType: document.getElementById("reporterType").value,
    community: document.getElementById("community").value,
    category: document.getElementById("category").value,
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    urgency: document.getElementById("urgency").value,
    status: "Open",
    dateSubmitted: new Date().toISOString()
  };

  // Basic validation
  if (!newIssue.reporterType || !newIssue.community || !newIssue.category ||
      !newIssue.title || !newIssue.description || !newIssue.urgency) {
    formMsg.textContent = "Please fill in all required fields.";
    formMsg.className = "form-msg error";
    return;
  }

  const issues = getIssues();
  issues.unshift(newIssue); // newest first
  saveIssues(issues);

  formMsg.textContent = "Thank you — your report (" + newIssue.id + ") has been submitted.";
  formMsg.className = "form-msg success";
  issueForm.reset();
});

/* ---------- Dashboard ---------- */

const issueList = document.getElementById("issueList");
const statsBox = document.getElementById("stats");
const filterStatus = document.getElementById("filterStatus");
const filterCommunity = document.getElementById("filterCommunity");

filterStatus.addEventListener("change", renderDashboard);
filterCommunity.addEventListener("change", renderDashboard);

function renderDashboard() {
  const issues = getIssues();

  // --- Stats ---
  const total = issues.length;
  const open = issues.filter((i) => i.status === "Open").length;
  const inProgress = issues.filter((i) => i.status === "In Progress").length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  statsBox.innerHTML = `
    <div class="stat-box"><div class="num">${total}</div><div class="label">Total</div></div>
    <div class="stat-box"><div class="num">${open}</div><div class="label">Open</div></div>
    <div class="stat-box"><div class="num">${inProgress}</div><div class="label">In Progress</div></div>
    <div class="stat-box"><div class="num">${resolved}</div><div class="label">Resolved</div></div>
  `;

  // --- Filtering ---
  const statusVal = filterStatus.value;
  const communityVal = filterCommunity.value;

  const filtered = issues.filter((i) => {
    const statusOk = statusVal === "All" || i.status === statusVal;
    const communityOk = communityVal === "All" || i.community === communityVal;
    return statusOk && communityOk;
  });

  // --- Render list ---
  if (filtered.length === 0) {
    issueList.innerHTML = `<div class="empty-state">No issues match this view yet.</div>`;
    return;
  }

  issueList.innerHTML = filtered.map((issue) => `
    <div class="issue-card">
      <div class="issue-card-top">
        <div>
          <div class="issue-title">${escapeHtml(issue.title)}</div>
          <div class="issue-meta">
            ${issue.id} &middot; ${escapeHtml(issue.category)} &middot; ${escapeHtml(issue.community)}
            &middot; by ${escapeHtml(issue.reporterName)} (${escapeHtml(issue.reporterType)})
            &middot; ${new Date(issue.dateSubmitted).toLocaleString()}
          </div>
        </div>
        <span class="badge badge-${issue.urgency}">${issue.urgency}</span>
      </div>
      <div class="issue-desc">${escapeHtml(issue.description)}</div>
      <label style="font-size:0.78rem; color:var(--muted);">
        Status:
        <select class="status-select" data-id="${issue.id}">
          <option value="Open" ${issue.status === "Open" ? "selected" : ""}>Open</option>
          <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
      </label>
    </div>
  `).join("");

  // Attach status-change listeners
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      const all = getIssues();
      const idx = all.findIndex((i) => i.id === id);
      if (idx !== -1) {
        all[idx].status = newStatus;
        saveIssues(all);
        renderDashboard();
      }
    });
  });
}

// Prevent basic HTML injection when displaying user text
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Export / Clear ---------- */

document.getElementById("exportBtn").addEventListener("click", () => {
  const issues = getIssues();
  const blob = new Blob([JSON.stringify(issues, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "iro_issues.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("This will permanently delete all stored reports. Continue?")) {
    localStorage.removeItem(STORAGE_KEY);
    renderDashboard();
  }
});

/* ---------- Init ---------- */
renderDashboard();