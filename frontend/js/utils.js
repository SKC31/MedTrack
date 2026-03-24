// js/utils.js — MedTrack v2

function getRole()     { return localStorage.getItem('medtrack_role') || 'staff'; }
function getUserName() { return localStorage.getItem('medtrack_name') || 'User'; }
function isLoggedIn()  { return !!localStorage.getItem('medtrack_token'); }

function requireAuth() {
  if (!isLoggedIn()) window.location.href = '../index.html';
}
function requireAdmin() {
  requireAuth();
  if (getRole() !== 'admin') window.location.href = 'dashboard.html';
}

/* ── Toast ─────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success:'✓', error:'✕', warning:'⚠', info:'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<div class="toast-icon">${icons[type]||'ℹ'}</div><div class="toast-msg">${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('out'); setTimeout(() => toast.remove(), 280); }, 3200);
}

/* ── Modal ─────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

/* ── Confirm ───────────────────────────────────────────── */
function showConfirm({ title, message, confirmText = 'Delete', onConfirm }) {
  let overlay = document.getElementById('confirmOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirmOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal modal-sm">
        <div class="modal-body" style="padding-top:28px">
          <div class="confirm-icon danger">🗑️</div>
          <div class="confirm-text">
            <h3 id="confirmTitle"></h3>
            <p id="confirmMessage"></p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" id="confirmCancel">Cancel</button>
          <button class="btn btn-danger btn-sm" id="confirmOk"></button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById('confirmTitle').textContent   = title;
  document.getElementById('confirmMessage').textContent = message;
  document.getElementById('confirmOk').textContent      = confirmText;
  overlay.classList.add('open');
  const ok = document.getElementById('confirmOk');
  const cancel = document.getElementById('confirmCancel');
  const cleanup = () => overlay.classList.remove('open');
  ok.addEventListener('click', () => { cleanup(); onConfirm(); }, { once: true });
  cancel.onclick = cleanup;
  overlay.onclick = e => { if (e.target === overlay) cleanup(); };
}

/* ── Drawer ────────────────────────────────────────────── */
function openDrawer(id) {
  document.getElementById(id + 'Overlay')?.classList.add('open');
  document.getElementById(id)?.classList.add('open');
}
function closeDrawer(id) {
  document.getElementById(id + 'Overlay')?.classList.remove('open');
  document.getElementById(id)?.classList.remove('open');
}

/* ── Badges ────────────────────────────────────────────── */
const BADGE_MAP = {
  'Operational':'badge-green','Under Maintenance':'badge-orange',
  'Out of Service':'badge-red','Retired':'badge-grey',
  'Scheduled':'badge-blue','In Progress':'badge-orange',
  'Completed':'badge-green','Overdue':'badge-red',
  'Open':'badge-red','Resolved':'badge-green','Closed':'badge-grey',
  'Low':'badge-green','Medium':'badge-orange','High':'badge-red','Critical':'badge-red',
};
function statusBadge(status, clickable = false) {
  const cls = BADGE_MAP[status] || 'badge-grey';
  return `<span class="badge ${cls}${clickable?' badge-click':''}">${status ?? '—'}</span>`;
}

/* ── Date ──────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

/* ── Backdrop close ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
  });
});
