const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/statistics/popular-tasks?period=day|week|month|year
router.get('/popular-tasks', async (req, res) => {
  try {
    const { period = 'week', limit = '3' } = req.query;
    const result = await db.getPopularTasks(period, parseInt(limit, 10));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/statistics/growth/:period
router.get('/growth/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const { startDate, endDate } = req.query;
    const result = await db.getStatGrowth(period, { startDate, endDate });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
