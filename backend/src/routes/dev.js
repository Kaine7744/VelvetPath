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

// DELETE /api/dev/tasks — delete ALL tasks
router.delete('/tasks', async (req, res) => {
  try {
    const result = await db.deleteAllTasks();
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/dev/skills — reset all skills to defaults
router.delete('/skills', async (req, res) => {
  try {
    await db.resetAllSkills();
    res.json({ success: true, message: 'All skills reset to defaults' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/dev/skills/:id/points — add or remove stat points
router.put('/skills/:id/points', async (req, res) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;
    if (typeof delta !== 'number') {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'delta (number) required' });
    }
    const result = await db.modifySkillPoints(id, delta);
    if (!result) {
      return res.status(404).json({ error: 'NOT_FOUND', message: `Skill '${id}' not found` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
