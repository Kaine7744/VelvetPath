const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/days/:date
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const day = await db.getDay(date);
    const tasks = await db.getAllTasks();
    const tasksMap = Object.fromEntries(tasks.map(t => [t.id, t]));

    const enrichSlot = (slot) => {
      if (slot.status === 'set' && slot.taskId) {
        const task = tasksMap[slot.taskId];
        return {
          ...slot,
          task: task ? { id: task.id, name: task.name, statName: task.statName, statGain: task.statGain } : null
        };
      }
      return slot;
    };

    res.json({
      date: day.date,
      slots: {
        morning: enrichSlot(day.morning),
        afternoon: enrichSlot(day.afternoon),
        evening: enrichSlot(day.evening),
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/days/:date
router.put('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { slots } = req.body;

    if (!slots || typeof slots !== 'object') {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'slots object required' });
    }

    const { statGrowths } = await db.updateDay(date, slots);

    // Return enriched day data
    const day = await db.getDay(date);
    const tasks = await db.getAllTasks();
    const tasksMap = Object.fromEntries(tasks.map(t => [t.id, t]));

    const enrichSlot = (slot) => {
      if (slot.status === 'set' && slot.taskId) {
        const task = tasksMap[slot.taskId];
        return {
          ...slot,
          task: task ? { id: task.id, name: task.name, statName: task.statName, statGain: task.statGain } : null
        };
      }
      return slot;
    };

    res.json({
      date: day.date,
      slots: {
        morning: enrichSlot(day.morning),
        afternoon: enrichSlot(day.afternoon),
        evening: enrichSlot(day.evening),
      },
      statGrowths
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
