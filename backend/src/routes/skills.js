const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const skills = await db.getAllSkills();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/skills
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const skill = await db.createSkill({ name, description });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/skills/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.updateSkill(req.params.id, { name, description });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/skills/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.deleteSkill(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
