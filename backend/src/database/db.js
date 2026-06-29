const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/velvetpath.db');

let db = null;
let SQL = null;

async function getDb() {
  if (!db) {
    SQL = await initSqlJs();
    // Load existing DB or create new one
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  }
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const dbModule = {
  async init() {
    await getDb();
    return this;
  },

  // Days
  async getDay(date) {
    await getDb();
    const stmt = db.prepare(`
      SELECT
        date,
        morningStatus, morningTaskId, morningCompleted,
        afternoonStatus, afternoonTaskId, afternoonCompleted,
        eveningStatus, eveningTaskId, eveningCompleted
      FROM days WHERE date = ?
    `);
    stmt.bind([date]);

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return {
        date: row.date,
        morning: {
          status: row.morningStatus,
          taskId: row.morningTaskId,
          completed: row.morningCompleted === 1
        },
        afternoon: {
          status: row.afternoonStatus,
          taskId: row.afternoonTaskId,
          completed: row.afternoonCompleted === 1
        },
        evening: {
          status: row.eveningStatus,
          taskId: row.eveningTaskId,
          completed: row.eveningCompleted === 1
        }
      };
    }
    stmt.free();

    // Check if day should be auto-populated from templates
    const dayOfWeek = new Date(date).getDay();
    const templates = await this.getTemplatesForDay(dayOfWeek);
    return this.createDayFromTemplates(date, templates);
  },

  createDayFromTemplates(date, templates) {
    const day = {
      date,
      morning: { status: 'free', taskId: null, completed: false },
      afternoon: { status: 'free', taskId: null, completed: false },
      evening: { status: 'free', taskId: null, completed: false },
    };

    for (const t of templates) {
      if (day[t.slot].status === 'free') {
        day[t.slot] = { status: 'set', taskId: t.taskId, completed: false };
      }
    }

    return day;
  },

  async getTemplatesForDay(dayOfWeek) {
    await getDb();
    const templates = [];
    const stmt = db.prepare('SELECT * FROM templates WHERE enabled = 1');
    while (stmt.step()) {
      const t = stmt.getAsObject();
      if (t.daysOfWeek.split(',').includes(String(dayOfWeek))) {
        templates.push(t);
      }
    }
    stmt.free();
    return templates;
  },

  async updateDay(date, slots) {
    await getDb();
    db.run(`
      INSERT OR REPLACE INTO days (
        date,
        morningStatus, morningTaskId, morningCompleted,
        afternoonStatus, afternoonTaskId, afternoonCompleted,
        eveningStatus, eveningTaskId, eveningCompleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      date,
      slots.morning?.status || 'free', slots.morning?.taskId || null, slots.morning?.completed ? 1 : 0,
      slots.afternoon?.status || 'free', slots.afternoon?.taskId || null, slots.afternoon?.completed ? 1 : 0,
      slots.evening?.status || 'free', slots.evening?.taskId || null, slots.evening?.completed ? 1 : 0
    ]);
    saveDb();
  },

  // Tasks
  async getAllTasks() {
    await getDb();
    const tasks = [];
    const stmt = db.prepare(`
      SELECT t.*, s.name as statName
      FROM tasks t
      LEFT JOIN stats s ON t.statId = s.id
      ORDER BY t.createdAt DESC
    `);
    while (stmt.step()) {
      tasks.push(stmt.getAsObject());
    }
    stmt.free();
    return tasks;
  },

  async createTask({ name, statId, statGain }) {
    await getDb();
    const id = generateId();
    db.run(`INSERT INTO tasks (id, name, statId, statGain) VALUES (?, ?, ?, ?)`, [
      id, name, statId || null, statGain || 1
    ]);
    saveDb();
    return { id, name, statId, statGain: statGain || 1 };
  },

  async deleteTask(id) {
    await getDb();
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    saveDb();
  },

  // Stats
  async getAllStats() {
    await getDb();
    const stats = [];
    const stmt = db.prepare('SELECT * FROM stats ORDER BY isDefault DESC, name ASC');
    while (stmt.step()) {
      stats.push(stmt.getAsObject());
    }
    stmt.free();
    return stats;
  },

  async createStat({ name, description }) {
    await getDb();
    const id = name.toLowerCase().replace(/\s+/g, '-');
    db.run(`INSERT INTO stats (id, name, description, isDefault, currentValue) VALUES (?, ?, ?, 0, 0)`, [
      id, name, description || ''
    ]);
    saveDb();
    return { id, name, description, isDefault: false, currentValue: 0 };
  },

  // Templates
  async getAllTemplates() {
    await getDb();
    const templates = [];
    const stmt = db.prepare(`
      SELECT t.*, tk.name as taskName
      FROM templates t
      JOIN tasks tk ON t.taskId = tk.id
    `);
    while (stmt.step()) {
      templates.push(stmt.getAsObject());
    }
    stmt.free();
    return templates;
  },

  async createTemplate({ taskId, slot, daysOfWeek, enabled = true }) {
    await getDb();
    const id = generateId();
    db.run(`INSERT INTO templates (id, taskId, slot, daysOfWeek, enabled) VALUES (?, ?, ?, ?, ?)`, [
      id, taskId, slot, daysOfWeek.join(','), enabled ? 1 : 0
    ]);
    saveDb();
    return { id, taskId, slot, daysOfWeek, enabled };
  },

  async updateTemplate(id, { enabled, daysOfWeek, slot, taskId }) {
    await getDb();
    const updates = [];
    const values = [];
    if (enabled !== undefined) { updates.push('enabled = ?'); values.push(enabled ? 1 : 0); }
    if (daysOfWeek !== undefined) { updates.push('daysOfWeek = ?'); values.push(daysOfWeek.join(',')); }
    if (slot !== undefined) { updates.push('slot = ?'); values.push(slot); }
    if (taskId !== undefined) { updates.push('taskId = ?'); values.push(taskId); }
    values.push(id);
    db.run(`UPDATE templates SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDb();
  },

  async deleteTemplate(id) {
    await getDb();
    db.run('DELETE FROM templates WHERE id = ?', [id]);
    saveDb();
  },

  // Settings
  async getAllSettings() {
    await getDb();
    const settings = {};
    const stmt = db.prepare('SELECT * FROM settings');
    while (stmt.step()) {
      const row = stmt.getAsObject();
      settings[row.key] = row.value;
    }
    stmt.free();
    return settings;
  },

  async updateSetting(key, value) {
    await getDb();
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
    saveDb();
  },

  // Statistics
  async getStatistics(period, { startDate, endDate }) {
    // TODO: implement period-based statistics
    return { period, startDate, endDate, tasksCompleted: 0, statGrowth: {} };
  },
};

module.exports = dbModule;
