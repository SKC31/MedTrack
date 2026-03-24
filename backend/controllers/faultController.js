const pool = require('../db/pool');

// GET /api/faults
async function getAll(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT f.*, e.name AS equipment_name
         FROM fault_reports f
         JOIN equipment e ON e.id = f.equipment_id
        ORDER BY f.created_at DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// GET /api/faults/:id
async function getById(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT f.*, e.name AS equipment_name
         FROM fault_reports f
         JOIN equipment e ON e.id = f.equipment_id
        WHERE f.id = $1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Report not found.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// POST /api/faults  (any authenticated user)
async function create(req, res) {
  const { equipment_id, description, reported_by, severity } = req.body;
  if (!equipment_id || !description || !reported_by)
    return res.status(400).json({ error: 'equipment_id, description and reported_by are required.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO fault_reports (equipment_id, description, reported_by, severity)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [equipment_id, description, reported_by, severity || 'Medium']
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// PATCH /api/faults/:id/status  (admin only)
async function updateStatus(req, res) {
  const { status } = req.body;
  if (!['Open', 'Resolved', 'Closed'].includes(status))
    return res.status(400).json({ error: 'Invalid status.' });

  try {
    const { rows } = await pool.query(
      'UPDATE fault_reports SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Report not found.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

module.exports = { getAll, getById, create, updateStatus };
