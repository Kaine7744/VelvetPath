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
    const { taskId, slot, daysOfWeek, enabled, endDate } = req.body;
    const template = await db.createTemplate({ taskId, slot, daysOfWeek, enabled, endDate });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/templates/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, daysOfWeek, slot, taskId, endDate } = req.body;
    await db.updateTemplate(id, { enabled, daysOfWeek, slot, taskId, endDate });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/templates/for-day/:date — which recurring tasks apply to a given date
router.get('/for-day/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const dayOfWeek = new Date(date).getDay();
    const templates = await db.getTemplatesForDay(dayOfWeek, date);
    const result = templates.map(t => ({
      slot: t.slot,
      taskId: t.taskId,
      taskName: t.taskName || null
    }));
    res.json(result);
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
