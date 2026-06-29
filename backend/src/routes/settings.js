const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const settings = await db.getAllSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings
router.put('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    await db.updateSetting(key, value);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
