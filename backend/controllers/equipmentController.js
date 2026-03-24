const pool = require('../db/pool');

// GET /api/equipment
async function getAll(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM equipment ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// GET /api/equipment/:id
async function getById(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM equipment WHERE id = $1', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Equipment not found.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// POST /api/equipment  (admin only)
async function create(req, res) {
  const { name, serial_number, department, location, status, notes } = req.body;
  if (!name || !serial_number || !department)
    return res.status(400).json({ error: 'name, serial_number and department are required.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO equipment (name, serial_number, department, location, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, serial_number, department, location || null,
       status || 'Operational', notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Serial number already exists.' });
    res.status(500).json({ error: 'Server error.' });
  }
}

// PATCH /api/equipment/:id  (admin only)
async function update(req, res) {
  const { name, department, location, status, notes } = req.body;
  if (!name || !department)
    return res.status(400).json({ error: 'name and department are required.' });
  try {
    const { rows } = await pool.query(
      `UPDATE equipment
          SET name=$1, department=$2, location=$3, status=$4, notes=$5
        WHERE id=$6 RETURNING *`,
      [name, department, location, status, notes, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Equipment not found.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// DELETE /api/equipment/:id  (admin only)
async function remove(req, res) {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM equipment WHERE id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Equipment not found.' });
    res.json({ message: 'Equipment deleted.' });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

module.exports = { getAll, getById, create, update, remove };
