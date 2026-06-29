const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/statistics/:period (day/week/month/year)
router.get('/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const { startDate, endDate } = req.query;
    const statistics = await db.getStatistics(period, { startDate, endDate });
    res.json(statistics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
