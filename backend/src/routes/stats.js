const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const stats = await db.getAllStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stats
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const stat = await db.createStat({ name, description });
    res.json(stat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
