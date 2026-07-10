const STORAGE_KEY = "iro_reports";
const SESSION_KEY = "iro_user";

function getReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

// ----- Format timestamp -----
function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ----- Toast notification -----
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast " + type;
  void toast.offsetWidth;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 3500);
}

// ==============================================================
//  LOGIN / LOGOUT
// ==============================================================

function loginUser(name, role) {
  const user = { name: escapeHtml(name.trim()), role: escapeHtml(role) };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

function getCurrentUser() {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById("app").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";
}

// ==============================================================
//  RENDER REPORTS (with resolve button if authorized)
// ==============================================================

// function renderReports() {
//   const reports = getReports();
//   const container = document.getElementById("reportsContainer");
//   const countBadge = document.getElementById("reportCount");
//   const user = getCurrentUser();

//   countBadge.textContent = `${reports.length} report${reports.length !== 1 ? "s" : ""}`;

//   if (reports.length === 0) {
//     container.innerHTML = `
//                     <div class="empty-state">
//                         <div class="icon">📭</div>
//                         <h3>No reports yet</h3>
//                         <p>Be the first to submit an issue in your community!</p>
//                     </div>
//                 `;
//     return;
//   }

//   // Sort newest first
//   const sorted = [...reports].sort((a, b) => b.timestamp - a.timestamp);

//   let html = "";
//   for (const report of sorted) {
//     const priorityClass = `priority-${report.priority.toLowerCase()}`;
//     const resolvedClass = report.resolved ? "resolved" : "";

//     // Build the resolve area
//     let resolveHtml = "";
//     if (user && user.role === "Authorized") {
//       if (report.resolved) {
//         const resolvedBy = report.resolvedBy
//           ? ` by ${escapeHtml(report.resolvedBy)}`
//           : "";
//         const resolvedAt = report.resolvedAt
//           ? ` on ${formatTimestamp(report.resolvedAt)}`
//           : "";
//         resolveHtml = `
//                             <div class="resolve-area">
//                                 <span class="resolved-badge">✅ Resolved</span>
//                                 <span class="resolved-info">${resolvedBy}${resolvedAt}</span>
//                             </div>
//                         `;
//       } else {
//         resolveHtml = `
//                             <div class="resolve-area">
//                                 <button class="btn-resolve" data-id="${report.id}">✅ Mark as Resolved</button>
//                             </div>
//                         `;
//       }
//     } else {
//       if (report.resolved) {
//         resolveHtml = `
//                             <div class="resolve-area">
//                                 <span class="resolved-badge">✅ Resolved</span>
//                             </div>
//                         `;
//       }
//     }

//     html += `
//                     <div class="report-item ${priorityClass} ${resolvedClass}">
//                         <div class="report-header">
//                             <span class="reporter">👤 ${escapeHtml(report.reporter)}</span>
//                             <span class="priority-badge">${escapeHtml(report.priority)}</span>
//                         </div>
//                         <div class="report-header" style="margin-top:-4px;">
//                             <span class="category">📂 ${escapeHtml(report.category)}</span>
//                             <span class="timestamp">🕐 ${formatTimestamp(report.timestamp)}</span>
//                         </div>
//                         <p class="description">${escapeHtml(report.description)}</p>
//                         <div class="community">
//                             <strong>📍 Community:</strong> ${escapeHtml(report.community)}
//                         </div>
//                         ${resolveHtml}
//                     </div>
//                 `;
//   }

//   container.innerHTML = html;

//   // Attach event listeners to resolve buttons (only for Authorized)
//   if (user && user.role === "Authorized") {
//     document.querySelectorAll(".btn-resolve").forEach((btn) => {
//       btn.addEventListener("click", function (e) {
//         const reportId = this.dataset.id;
//         resolveReport(reportId);
//       });
//     });
//   }
// }

// ==============================================================
//  RESOLVE REPORT (Authorized only)
// ==============================================================

function resolveReport(reportId) {
  const user = getCurrentUser();
  if (!user || user.role !== "Authorized") {
    showToast("⛔ Only authorized users can resolve reports.", "error");
    return;
  }

  let reports = getReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index === -1) {
    showToast("⚠️ Report not found.", "error");
    return;
  }

  if (reports[index].resolved) {
    showToast("ℹ️ This report is already resolved.", "error");
    return;
  }

  // Update report
  reports[index].resolved = true;
  reports[index].resolvedBy = user.name;
  reports[index].resolvedAt = Date.now();

  saveReports(reports);
  renderReports();
  showToast(`✅ Report resolved by ${user.name}`, "success");
}
// ==============================================================
//  RENDER REPORTS (with stats update)
// ==============================================================

function renderReports() {
    const reports = getReports();
    const container = document.getElementById('reportsContainer');
    const countBadge = document.getElementById('reportCount');
    const user = getCurrentUser();

    // ---- Update stats ----
    const total = reports.length;
    const pending = reports.filter(r => !r.resolved).length;
    const resolved = reports.filter(r => r.resolved).length;
    const high = reports.filter(r => r.priority === 'High').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statResolved').textContent = resolved;
    document.getElementById('statHigh').textContent = high;

    countBadge.textContent = `${total} report${total !== 1 ? 's' : ''}`;

    // ---- Empty state ----
    if (total === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon"><i class="fas fa-inbox"></i></div>
                <h3>No reports yet</h3>
                <p>Be the first to submit an issue in your community!</p>
            </div>
        `;
        return;
    }

    // ---- Sort and render ----
    const sorted = [...reports].sort((a, b) => b.timestamp - a.timestamp);
    let html = '';
    for (const report of sorted) {
        const priorityClass = `priority-${report.priority.toLowerCase()}`;
        const resolvedClass = report.resolved ? 'resolved' : '';

        // Resolve area
        let resolveHtml = '';
        if (user && user.role === 'Authorized') {
            if (report.resolved) {
                const resolvedBy = report.resolvedBy ? ` by ${escapeHtml(report.resolvedBy)}` : '';
                const resolvedAt = report.resolvedAt ? ` on ${formatTimestamp(report.resolvedAt)}` : '';
                resolveHtml = `
                    <div class="resolve-area">
                        <span class="resolved-badge"><i class="fas fa-check-circle"></i> Resolved</span>
                        <span class="resolved-info">${resolvedBy}${resolvedAt}</span>
                    </div>
                `;
            } else {
                resolveHtml = `
                    <div class="resolve-area">
                        <button class="btn-resolve" data-id="${report.id}"><i class="fas fa-check"></i> Mark as Resolved</button>
                    </div>
                `;
            }
        } else {
            if (report.resolved) {
                resolveHtml = `
                    <div class="resolve-area">
                        <span class="resolved-badge"><i class="fas fa-check-circle"></i> Resolved</span>
                    </div>
                `;
            }
        }

        // Priority icon
        let priorityIcon = '';
        if (report.priority === 'Low') priorityIcon = '<i class="fas fa-circle" style="color:#2e7d32;"></i>';
        else if (report.priority === 'Medium') priorityIcon = '<i class="fas fa-circle" style="color:#f57f17;"></i>';
        else if (report.priority === 'High') priorityIcon = '<i class="fas fa-circle" style="color:#c62828;"></i>';

        html += `
            <div class="report-item ${priorityClass} ${resolvedClass}">
                <div class="report-header">
                    <span class="reporter"><i class="fas fa-user"></i> ${escapeHtml(report.reporter)}</span>
                    <span class="priority-badge">${priorityIcon} ${escapeHtml(report.priority)}</span>
                </div>
                <div class="report-header" style="margin-top:-4px;">
                    <span class="category"><i class="fas fa-tag"></i> ${escapeHtml(report.category)}</span>
                    <span class="timestamp"><i class="far fa-clock"></i> ${formatTimestamp(report.timestamp)}</span>
                </div>
                <p class="description">${escapeHtml(report.description)}</p>
                <div class="community">
                    <i class="fas fa-map-marker-alt"></i> <strong>Community:</strong> ${escapeHtml(report.community)}
                </div>
                ${resolveHtml}
            </div>
        `;
    }

    container.innerHTML = html;

    // Attach resolve events
    if (user && user.role === 'Authorized') {
        document.querySelectorAll('.btn-resolve').forEach((btn) => {
            btn.addEventListener('click', function (e) {
                const reportId = this.dataset.id;
                resolveReport(reportId);
            });
        });
    }
}

// ==============================================================
//  SUBMIT FORM
// ==============================================================

document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = getCurrentUser();
  if (!user) {
    showToast("⚠️ Please log in first.", "error");
    return;
  }

  let name = document.getElementById("reporterName").value.trim();
  const community = document.getElementById("community").value;
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();

  if (!community || !category || !priority || !description) {
    showToast("⚠️ Please fill in all required fields.", "error");
    return;
  }

  // Sanitize
  const sanitizedName = escapeHtml(name || "Anonymous");
  const report = {
    id: Date.now() + "_" + Math.random().toString(36).substr(2, 6),
    reporter: sanitizedName,
    community: escapeHtml(community),
    category: escapeHtml(category),
    priority: escapeHtml(priority),
    description: escapeHtml(description),
    timestamp: Date.now(),
    resolved: false, // new field
    resolvedBy: null,
    resolvedAt: null,
  };

  const reports = getReports();
  reports.push(report);
  saveReports(reports);

  document.getElementById("reportForm").reset();
  document.getElementById("reporterName").value = "";

  renderReports();
  showToast("✅ Report submitted successfully!", "success");
});

// ==============================================================
//  LOGIN FORM HANDLER
// ==============================================================

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("loginName").value.trim();
  const role = document.getElementById("loginRole").value;

  if (!name || !role) {
    showToast("⚠️ Please enter your name and select a role.", "error");
    return;
  }

  const user = loginUser(name, role);
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "block";

  // Update header
  document.getElementById("displayName").textContent = `👋 ${user.name}`;
  document.getElementById("displayRole").textContent = user.role;

  renderReports();
  showToast(`Welcome, ${user.name} (${user.role})`, "success");
});

// ==============================================================
//  LOGOUT
// ==============================================================

document.getElementById("logoutBtn").addEventListener("click", function () {
  logoutUser();
  showToast("👋 Logged out successfully.", "success");
});

// ==============================================================
//  INIT – check session on load
// ==============================================================

document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();
  if (user) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("displayName").textContent = `👋 ${user.name}`;
    document.getElementById("displayRole").textContent = user.role;
    renderReports();
  } else {
    document.getElementById("loginScreen").style.display = "block";
    document.getElementById("app").style.display = "none";
  }

  // Auto-refresh feed every 10 seconds (multi‑tab sync)
  setInterval(renderReports, 10000);
});

// Ctrl+Enter to submit form
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const form = document.getElementById("reportForm");
    if (document.activeElement && form.contains(document.activeElement)) {
      form.dispatchEvent(new Event("submit"));
    }
  }
});
