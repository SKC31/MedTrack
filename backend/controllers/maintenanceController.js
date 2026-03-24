const pool = require('../db/pool');

// GET /api/maintenance
async function getAll(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, e.name AS equipment_name
         FROM maintenance_records m
         JOIN equipment e ON e.id = m.equipment_id
        ORDER BY m.scheduled_date ASC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// GET /api/maintenance/:id
async function getById(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, e.name AS equipment_name
         FROM maintenance_records m
         JOIN equipment e ON e.id = m.equipment_id
        WHERE m.id = $1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Record not found.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// POST /api/maintenance  (admin only)
async function create(req, res) {
  const { equipment_id, maintenance_type, technician_name, scheduled_date, notes } = req.body;
  if (!equipment_id || !maintenance_type || !technician_name || !scheduled_date)
    return res.status(400).json({ error: 'equipment_id, maintenance_type, technician_name and scheduled_date are required.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO maintenance_records
         (equipment_id, maintenance_type, technician_name, scheduled_date, notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [equipment_id, maintenance_type, technician_name, scheduled_date, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// PATCH /api/maintenance/:id/status
async function updateStatus(req, res) {
  const { status } = req.body;
  const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ error: 'Invalid status.' });

  try {
    // Only stamp completed_date when transitioning TO Completed
    const dateClause = status === 'Completed'
      ? `status=$1, completed_date=CURRENT_DATE`
      : `status=$1`;
    const { rows } = await pool.query(
      `UPDATE maintenance_records SET ${dateClause} WHERE id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Record not found.' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

// DELETE /api/maintenance/:id  (admin only)
async function remove(req, res) {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM maintenance_records WHERE id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Record not found.' });
    res.json({ message: 'Record deleted.' });
  } catch (err) { res.status(500).json({ error: 'Server error.' }); }
}

module.exports = { getAll, getById, create, updateStatus, remove };
