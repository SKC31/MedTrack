// js/sidebar.js — MedTrack v2 collapsible sidebar

document.addEventListener('DOMContentLoaded', () => {
  const role    = localStorage.getItem('medtrack_role') || 'staff';
  const name    = localStorage.getItem('medtrack_name') || 'User';
  const initial = name.charAt(0).toUpperCase();
  const page    = window.location.pathname.split('/').pop();
  const isAdmin = role === 'admin';

  const navItems = [
    { href:'dashboard.html',   icon:'📊', label:'Dashboard' },
    { href:'equipment.html',   icon:'🩺', label:'Equipment' },
    { href:'maintenance.html', icon:'🔧', label:'Maintenance' },
    { href:'faults.html',      icon:'⚠️', label:'Fault Reports' },
    ...(isAdmin ? [{ href:'users.html', icon:'👥', label:'Users' }] : []),
  ];

  const navHTML = navItems.map(item => `
    <a class="nav-item${page === item.href ? ' active' : ''}" href="${item.href}">
      <div class="nav-icon">${item.icon}</div>
      <span class="nav-text">${item.label}</span>
    </a>`).join('');

  const html = `
    <aside class="sidebar" id="sidebar">
      <button class="sidebar-toggle" id="sidebarToggle" title="Toggle sidebar">◀</button>

      <div class="sidebar-logo">
        <div class="logo-mark">🏥</div>
        <div class="logo-text">
          <h1>MedTrack</h1>
          <span>Equipment System</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-label">Navigation</div>
        ${navHTML}
      </nav>

      <div class="sidebar-footer">
        <div class="user-block">
          <div class="avatar">${initial}</div>
          <div class="user-info">
            <div class="user-name">${name}</div>
            <div class="user-role">${role.charAt(0).toUpperCase() + role.slice(1)}</div>
          </div>
        </div>
        <button class="btn-logout" id="btnLogout">
          <span>🚪</span><span>Sign Out</span>
        </button>
      </div>
    </aside>`;

  document.body.insertAdjacentHTML('afterbegin', html);

  // ── Collapse / expand ──────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('sidebarToggle');
  const main    = document.querySelector('.main');

  const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (collapsed) {
    sidebar.classList.add('collapsed');
    toggle.textContent = '▶';
  }

  toggle.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    toggle.textContent = isCollapsed ? '▶' : '◀';
    localStorage.setItem('sidebar_collapsed', isCollapsed);
  });

  // ── Logout ─────────────────────────────────────────────
  document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../index.html';
  });

  // ── Mobile overlay ─────────────────────────────────────
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
  }
});
