const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/days/:date
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const day = await db.getDay(date);
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/days/:date
router.put('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { slots } = req.body;
    await db.updateDay(date, slots);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
