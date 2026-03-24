const bcrypt = require('bcryptjs');
const pool   = require('../db/pool');

// GET /api/users  (admin only)
async function getAll(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// POST /api/users  (admin only)
async function create(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required.' });

  const validRoles = ['admin', 'staff', 'healthcare'];
  const userRole = validRoles.includes(role) ? role : 'staff';

  try {
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashed, userRole]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Email already in use.' });
    res.status(500).json({ error: 'Server error.' });
  }
}

// DELETE /api/users/:id  (admin only)
async function remove(req, res) {
  if (parseInt(req.params.id) === req.user.id)
    return res.status(400).json({ error: 'Cannot delete your own account.' });

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM users WHERE id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

module.exports = { getAll, create, remove };
