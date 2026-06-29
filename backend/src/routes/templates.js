const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/templates
router.get('/', async (req, res) => {
  try {
    const templates = await db.getAllTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/templates
router.post('/', async (req, res) => {
  try {
    const { taskId, slot, daysOfWeek, enabled } = req.body;
    const template = await db.createTemplate({ taskId, slot, daysOfWeek, enabled });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/templates/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, daysOfWeek, slot, taskId } = req.body;
    await db.updateTemplate(id, { enabled, daysOfWeek, slot, taskId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/templates/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteTemplate(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
