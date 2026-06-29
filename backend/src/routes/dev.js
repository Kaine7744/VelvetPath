const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Guard: only allow in non-production
if (process.env.NODE_ENV === 'production') {
  router.use((req, res) => res.status(403).json({ error: 'Dev routes disabled in production' }));
  module.exports = router;
  return;
}

// POST /api/dev/reset-db
router.post('/reset-db', async (req, res) => {
  try {
    await db.resetDatabase();
    res.json({ success: true, message: 'Database reset complete' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/dev/tasks/non-default
router.delete('/tasks/non-default', async (req, res) => {
  try {
    const result = await db.deleteNonDefaultTasks();
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
