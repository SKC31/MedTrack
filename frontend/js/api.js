// frontend/js/api.js — MedTrack v2

const API_BASE = 'https://medtrack-backend-qg2v.onrender.com/api';

function getToken() { return localStorage.getItem('medtrack_token'); }

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Track whether a redirect is already in progress so we never loop
let _redirecting = false;

async function request(method, path, body = null) {
  const opts = { method, headers: authHeaders() };
  if (body) opts.body = JSON.stringify(body);

  let res, data;

  try {
    res = await fetch(API_BASE + path, opts);
  } catch (err) {
    // Network error — backend is probably not running
    // Do NOT wipe localStorage or redirect. Just surface the error.
    throw new Error('Cannot reach the server. Make sure the backend is running on port 8080.');
  }

  try { data = await res.json(); } catch { data = {}; }

  // Only redirect on 401 if we're not already redirecting and have a token
  // (genuine session expiry), not on every failed request
  if (res.status === 401 && !_redirecting && getToken()) {
    _redirecting = true;
    localStorage.clear();
    window.location.href = '../index.html';
    return;
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }

  return data;
}

async function loginRequest(email, password) {
  let res, data;
  try {
    res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  } catch (err) {
    throw new Error('Cannot reach the server. Make sure the backend is running on port 8080.');
  }

  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) throw new Error(data.error || data.message || 'Login failed');
  if (!data.token) throw new Error('No token returned from server');

  localStorage.setItem('medtrack_token', data.token);
  localStorage.setItem('medtrack_role',  data.role  || 'staff');
  localStorage.setItem('medtrack_name',  data.name  || 'User');

  return data;
}

const api = {
  login: loginRequest,
  me:    () => request('GET', '/auth/me'),

  getEquipment:        ()         => request('GET',    '/equipment'),
  getEquipmentById:    (id)       => request('GET',    `/equipment/${id}`),
  createEquipment:     (data)     => request('POST',   '/equipment', data),
  updateEquipment:     (id, data) => request('PATCH',  `/equipment/${id}`, data),
  deleteEquipment:     (id)       => request('DELETE', `/equipment/${id}`),

  getMaintenance:          ()           => request('GET',    '/maintenance'),
  getMaintenanceById:      (id)         => request('GET',    `/maintenance/${id}`),
  createMaintenance:       (data)       => request('POST',   '/maintenance', data),
  updateMaintenanceStatus: (id, status) => request('PATCH',  `/maintenance/${id}/status`, { status }),
  deleteMaintenance:       (id)         => request('DELETE', `/maintenance/${id}`),

  getFaults:         ()           => request('GET',   '/faults'),
  getFaultById:      (id)         => request('GET',   `/faults/${id}`),
  createFault:       (data)       => request('POST',  '/faults', data),
  updateFaultStatus: (id, status) => request('PATCH', `/faults/${id}/status`, { status }),

  getUsers:   ()     => request('GET',    '/users'),
  createUser: (data) => request('POST',   '/users', data),
  deleteUser: (id)   => request('DELETE', `/users/${id}`),
};
