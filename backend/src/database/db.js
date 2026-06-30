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
  async getDaysRange(startDate, endDate) {
    await getDb();
    const days = [];
    const stmt = db.prepare(`
      SELECT
        date,
        morningStatus, morningTaskId, morningCompleted,
        afternoonStatus, afternoonTaskId, afternoonCompleted,
        eveningStatus, eveningTaskId, eveningCompleted
      FROM days WHERE date >= ? AND date <= ? ORDER BY date ASC
    `);
    stmt.bind([startDate, endDate]);
    const existingRows = [];
    while (stmt.step()) {
      existingRows.push(stmt.getAsObject());
    }
    stmt.free();

    // Build set of dates that have explicit DB records
    const existingSet = new Set(existingRows.map(r => r.date));

    // Generate all dates in range and fill gaps with templates
    const cur = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    while (cur <= end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const dayOfWeek = cur.getDay();
      const templates = await this.getTemplatesForDay(dayOfWeek);
      const templateMap = {};
      for (const t of templates) {
        templateMap[t.slot] = t.taskId;
      }
      if (existingSet.has(dateStr)) {
        const row = existingRows.find(r => r.date === dateStr);
        days.push({
          date: row.date,
          morning: { status: row.morningStatus, taskId: row.morningTaskId, completed: row.morningCompleted === 1 },
          afternoon: { status: row.afternoonStatus, taskId: row.afternoonTaskId, completed: row.afternoonCompleted === 1 },
          evening: { status: row.eveningStatus, taskId: row.eveningTaskId, completed: row.eveningCompleted === 1 },
        });
      } else {
        days.push(this.createDayFromTemplates(dateStr, templates));
      }
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  },

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
    const templates = await this.getTemplatesForDay(dayOfWeek, date);
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

  async getTemplatesForDay(dayOfWeek, date) {
    await getDb();
    const templates = [];
    // date is YYYY-MM-DD — filter: endDate IS NULL OR endDate >= date
    const sql = `
      SELECT t.*, tk.name as taskName
      FROM templates t
      JOIN tasks tk ON t.taskId = tk.id
      WHERE t.enabled = 1
        AND (t.endDate IS NULL OR t.endDate >= ?)
    `;
    const stmt = db.prepare(sql);
    stmt.bind([date || '']);
    while (stmt.step()) {
      const t = stmt.getAsObject();
      const days = t.daysOfWeek ? t.daysOfWeek.split(',').map(Number) : [];
      if (days.includes(dayOfWeek)) {
        t.daysOfWeek = days;
        templates.push(t);
      }
    }
    stmt.free();
    return templates;
  },

  async updateDay(date, slots) {
    await getDb();

    // Get raw existing record from DB (may not exist)
    const rawExisting = await this.getDayRecord(date);

    // Apply templates to fill gaps in raw existing (for slots with no explicit value)
    const dayOfWeek = new Date(date).getDay();
    const templates = await this.getTemplatesForDay(dayOfWeek, date);
    const templateMap = {};
    for (const t of templates) {
      templateMap[t.slot] = t.taskId;
    }

    const applyTemplate = (slot, slotName) => {
      if (slot.status === 'free' && templateMap[slotName]) {
        return { status: 'set', taskId: templateMap[slotName], completed: false };
      }
      return slot;
    };

    const existing = {
      morning: applyTemplate(rawExisting.morning, 'morning'),
      afternoon: applyTemplate(rawExisting.afternoon, 'afternoon'),
      evening: applyTemplate(rawExisting.evening, 'evening'),
    };

    // Merge: provided slots always win, rest comes from existing (with templates applied)
    const mergeSlot = (existing, provided) => {
      if (!provided) return existing;
      return {
        status: provided.status || existing.status,
        taskId: provided.status === 'free' ? null : (provided.taskId ?? existing.taskId),
        completed: provided.completed !== undefined ? provided.completed : existing.completed,
      };
    };

    const morning = mergeSlot(existing.morning, slots.morning);
    const afternoon = mergeSlot(existing.afternoon, slots.afternoon);
    const evening = mergeSlot(existing.evening, slots.evening);

    db.run(`
      INSERT OR REPLACE INTO days (
        date,
        morningStatus, morningTaskId, morningCompleted,
        afternoonStatus, afternoonTaskId, afternoonCompleted,
        eveningStatus, eveningTaskId, eveningCompleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      date,
      morning.status, morning.taskId, morning.completed ? 1 : 0,
      afternoon.status, afternoon.taskId, afternoon.completed ? 1 : 0,
      evening.status, evening.taskId, evening.completed ? 1 : 0
    ]);
    saveDb();

    // Stat growth/shrinkage: handle both completion (grow) and undo (shrink) transitions
    const statGrowths = [];
    const statShrinkages = [];
    const allTasks = await this.getAllTasks();
    const tasksMap = Object.fromEntries(allTasks.map(t => [t.id, t]));
    for (const [slotName, slot, prevSlot] of [['morning', morning, existing.morning], ['afternoon', afternoon, existing.afternoon], ['evening', evening, existing.evening]]) {
      if (slot.completed && !prevSlot.completed && slot.taskId) {
        // Slot transitioned to completed → award stat points
        const task = tasksMap[slot.taskId];
        if (task && task.statId) {
          const result = await this.growStat(task.statId, task.statGain);
          if (result && result.gain > 0) {
            statGrowths.push({ slot: slotName, statId: task.statId, statName: task.statName, gain: result.gain, oldTier: result.oldTier, newTier: result.newTier });
          }
        }
      } else if (!slot.completed && prevSlot.completed && prevSlot.taskId) {
        // Slot transitioned to uncompleted (undo) → remove stat points
        const task = tasksMap[prevSlot.taskId];
        if (task && task.statId) {
          const result = await this.shrinkStat(task.statId, task.statGain);
          if (result && result.newValue !== result.oldValue) {
            statShrinkages.push({ slot: slotName, statId: task.statId, statName: task.statName, gain: result.gain, oldTier: result.oldTier, newTier: result.newTier });
          }
        }
      }
    }
    return { statGrowths, statShrinkages };
  },

  async growStat(statId, amount) {
    if (!statId || !amount) return { gain: 0, oldValue: 0, newValue: 0, oldTier: 1, newTier: 1 };
    await getDb();
    const stmt = db.prepare('SELECT currentValue FROM skills WHERE id = ?');
    stmt.bind([statId]);
    if (!stmt.step()) { stmt.free(); return { gain: 0, oldValue: 0, newValue: 0, oldTier: 1, newTier: 1 }; }
    const row = stmt.getAsObject();
    stmt.free();
    const oldTier = Math.floor(row.currentValue / 100) + 1;
    const newValue = row.currentValue + amount;
    const newTier = Math.floor(newValue / 100) + 1;
    db.run('UPDATE skills SET currentValue = ? WHERE id = ?', [newValue, statId]);
    saveDb();
    return { gain: amount, oldValue: row.currentValue, newValue, oldTier, newTier };
  },

  async shrinkStat(statId, amount) {
    if (!statId || !amount) return { gain: 0, oldValue: 0, newValue: 0, oldTier: 1, newTier: 1 };
    await getDb();
    const stmt = db.prepare('SELECT currentValue FROM skills WHERE id = ?');
    stmt.bind([statId]);
    if (!stmt.step()) { stmt.free(); return { gain: 0, oldValue: 0, newValue: 0, oldTier: 1, newTier: 1 }; }
    const row = stmt.getAsObject();
    stmt.free();
    const oldTier = Math.floor(row.currentValue / 100) + 1;
    const newValue = Math.max(0, row.currentValue - amount);
    const newTier = Math.floor(newValue / 100) + 1;
    db.run('UPDATE skills SET currentValue = ? WHERE id = ?', [newValue, statId]);
    saveDb();
    return { gain: -amount, oldValue: row.currentValue, newValue, oldTier, newTier };
  },

  async getDayRecord(date) {
    await getDb();
    const stmt = db.prepare('SELECT * FROM days WHERE date = ?');
    stmt.bind([date]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return {
        morning: { status: row.morningStatus, taskId: row.morningTaskId, completed: row.morningCompleted === 1 },
        afternoon: { status: row.afternoonStatus, taskId: row.afternoonTaskId, completed: row.afternoonCompleted === 1 },
        evening: { status: row.eveningStatus, taskId: row.eveningTaskId, completed: row.eveningCompleted === 1 },
      };
    }
    stmt.free();
    return {
      morning: { status: 'free', taskId: null, completed: false },
      afternoon: { status: 'free', taskId: null, completed: false },
      evening: { status: 'free', taskId: null, completed: false },
    };
  },

  // Tasks
  async getAllTasks() {
    await getDb();
    const tasks = [];
    const stmt = db.prepare(`
      SELECT t.*, s.name as statName
      FROM tasks t
      LEFT JOIN skills s ON t.statId = s.id
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

  async updateTask(id, { name, statId, statGain }) {
    await getDb();
    const updates = [], values = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (statId !== undefined) { updates.push('statId = ?'); values.push(statId || null); }
    if (statGain !== undefined) { updates.push('statGain = ?'); values.push(statGain); }
    if (!updates.length) return;
    values.push(id);
    db.run(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDb();
  },

  async deleteTask(id) {
    await getDb();
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    saveDb();
  },

  // Skills
  async getAllSkills() {
    await getDb();
    const skills = [];
    const stmt = db.prepare('SELECT * FROM skills ORDER BY isDefault DESC, name ASC');
    while (stmt.step()) {
      skills.push(stmt.getAsObject());
    }
    stmt.free();
    return skills;
  },

  async createSkill({ name, description, icon }) {
    await getDb();
    const id = name.toLowerCase().replace(/\s+/g, '-');
    db.run(`INSERT INTO skills (id, name, description, isDefault, currentValue, icon) VALUES (?, ?, ?, 0, 0, ?)`, [
      id, name, description || '', icon || '⭐'
    ]);
    saveDb();
    return { id, name, description, isDefault: false, currentValue: 0, icon: icon || '⭐' };
  },

  async updateSkill(id, { name, description, icon }) {
    await getDb();
    const updates = [], values = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (icon !== undefined) { updates.push('icon = ?'); values.push(icon || '⭐'); }
    if (!updates.length) return;
    values.push(id);
    db.run(`UPDATE skills SET ${updates.join(', ')} WHERE id = ?`, values);
    saveDb();
  },

  async deleteSkill(id) {
    await getDb();
    db.run('DELETE FROM skills WHERE id = ?', [id]);
    saveDb();
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
      const row = stmt.getAsObject();
      row.daysOfWeek = row.daysOfWeek ? row.daysOfWeek.split(',').map(Number) : [];
      templates.push(row);
    }
    stmt.free();
    return templates;
  },

  async createTemplate({ taskId, slot, daysOfWeek, enabled = true, endDate = null }) {
    await getDb();
    const id = generateId();
    db.run(`INSERT INTO templates (id, taskId, slot, daysOfWeek, enabled, endDate) VALUES (?, ?, ?, ?, ?, ?)`, [
      id, taskId, slot, daysOfWeek.join(','), enabled ? 1 : 0, endDate || null
    ]);
    saveDb();
    return { id, taskId, slot, daysOfWeek, enabled, endDate };
  },

  async updateTemplate(id, { enabled, daysOfWeek, slot, taskId, endDate }) {
    await getDb();
    const updates = [];
    const values = [];
    if (enabled !== undefined) { updates.push('enabled = ?'); values.push(enabled ? 1 : 0); }
    if (daysOfWeek !== undefined) { updates.push('daysOfWeek = ?'); values.push(daysOfWeek.join(',')); }
    if (slot !== undefined) { updates.push('slot = ?'); values.push(slot); }
    if (taskId !== undefined) { updates.push('taskId = ?'); values.push(taskId); }
    if (endDate !== undefined) { updates.push('endDate = ?'); values.push(endDate || null); }
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
  async getStatistics(period, { startDate, endDate } = {}) {
    const { start, end } = this.computeDateRange(period, startDate, endDate);
    const days = await this.getDaysRange(start, end);

    const totalSlots = days.length * 3;
    let completedSlots = 0;
    let morningCompleted = 0, afternoonCompleted = 0, eveningCompleted = 0;
    let morningTotal = 0, afternoonTotal = 0, eveningTotal = 0;

    for (const day of days) {
      if (day.morning.status === 'set') { morningTotal++; if (day.morning.completed) { morningCompleted++; completedSlots++; } }
      if (day.afternoon.status === 'set') { afternoonTotal++; if (day.afternoon.completed) { afternoonCompleted++; completedSlots++; } }
      if (day.evening.status === 'set') { eveningTotal++; if (day.evening.completed) { eveningCompleted++; completedSlots++; } }
    }

    const completionRate = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

    // Streak: count consecutive days with ≥1 completed task, going backwards from end date
    const streakDays = await this.getStreakDays(end);

    // Today's gains (day view only): stat gains from completed tasks on today
    const todayGains = [];
    if (period === 'day') {
      const today = new Date().toISOString().split('T')[0];
      const todayDay = await this.getDay(today);
      const allTasks = await this.getAllTasks();
      const tasksMap = Object.fromEntries(allTasks.map(t => [t.id, t]));
      for (const slotName of ['morning', 'afternoon', 'evening']) {
        const slot = todayDay[slotName];
        if (slot.status === 'set' && slot.completed && slot.taskId) {
          const task = tasksMap[slot.taskId];
          if (task && task.statId) {
            todayGains.push({ statId: task.statId, statName: task.statName || task.name, gain: task.statGain || 0 });
          }
        }
      }
    }

    return {
      period,
      startDate: start,
      endDate: end,
      totalSlots,
      completedSlots,
      completionRate,
      bySlot: {
        morning: { total: morningTotal, completed: morningCompleted, rate: morningTotal > 0 ? Math.round((morningCompleted / morningTotal) * 100) : 0 },
        afternoon: { total: afternoonTotal, completed: afternoonCompleted, rate: afternoonTotal > 0 ? Math.round((afternoonCompleted / afternoonTotal) * 100) : 0 },
        evening: { total: eveningTotal, completed: eveningCompleted, rate: eveningTotal > 0 ? Math.round((eveningCompleted / eveningTotal) * 100) : 0 },
      },
      streakDays,
      todayGains,
    };
  },

  computeDateRange(period, startDate, endDate) {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    const dow = today.getDay(); // 0=Sun

    if (startDate && endDate) {
      return { start: startDate, end: endDate };
    }

    switch (period) {
      case 'day': {
        const start = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return { start, end: start };
      }
      case 'week': {
        // Monday of current week
        const mondayOffset = dow === 0 ? -6 : 1 - dow;
        const monday = new Date(today);
        monday.setDate(d + mondayOffset);
        // Sunday of current week
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const fmt = dt => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        return { start: fmt(monday), end: fmt(sunday) };
      }
      case 'month': {
        const start = `${y}-${String(m + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(y, m + 1, 0).getDate();
        const end = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        return { start, end };
      }
      case 'year': {
        return { start: `${y}-01-01`, end: `${y}-12-31` };
      }
      default:
        return { start: startDate || `${y}-01-01`, end: endDate || `${y}-12-31` };
    }
  },

  async getStreakDays(endDate) {
    let streak = 0;
    const cur = new Date(endDate + 'T00:00:00');
    while (true) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const dayStr = `${y}-${m}-${String(cur.getDate()).padStart(2, '0')}`;
      const day = await this.getDayRecord(dayStr);
      const hasCompleted = day.morning.completed || day.afternoon.completed || day.evening.completed;
      if (hasCompleted) {
        streak++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  async getStatGrowth(period, { startDate, endDate } = {}) {
    const { start, end } = this.computeDateRange(period, startDate, endDate);
    const days = await this.getDaysRange(start, end);
    const allTasks = await this.getAllTasks();

    // Build statId -> { name, color } map from tasks that have stats
    const statMap = {}; // statId -> { name, values: number[] }
    for (const task of allTasks) {
      if (task.statId && !statMap[task.statId]) {
        statMap[task.statId] = { name: task.statName || task.name, values: [] };
      }
    }

    const statIds = Object.keys(statMap);
    const accumulators = {};
    statIds.forEach(id => { accumulators[id] = 0; });

    for (const day of days) {
      for (const slotName of ['morning', 'afternoon', 'evening']) {
        const slot = day[slotName];
        if (slot.status === 'set' && slot.completed && slot.taskId) {
          const task = allTasks.find(t => t.id === slot.taskId);
          if (task && task.statId && accumulators[task.statId] !== undefined) {
            accumulators[task.statId] += task.statGain || 0;
          }
        }
      }
      // Snapshot end-of-day cumulative values
      for (const statId of statIds) {
        statMap[statId].values.push(accumulators[statId]);
      }
    }

    return {
      dates: days.map(d => d.date),
      stats: statMap,
    };
  },

  async getPopularTasks(period, limit = 3) {
    const { start, end } = this.computeDateRange(period);
    const days = await this.getDaysRange(start, end);
    const taskCounts = {};

    for (const day of days) {
      for (const slotName of ['morning', 'afternoon', 'evening']) {
        const slot = day[slotName];
        if (slot.status === 'set' && slot.completed && slot.taskId) {
          taskCounts[slot.taskId] = (taskCounts[slot.taskId] || 0) + 1;
        }
      }
    }

    const allTasks = await this.getAllTasks();
    const tasksMap = Object.fromEntries(allTasks.map(t => [t.id, t]));

    const entries = Object.entries(taskCounts)
      .map(([taskId, count]) => ({ taskId, taskName: tasksMap[taskId]?.name || taskId, count }))
      .sort((a, b) => b.count - a.count);

    const mostUsed = entries.slice(0, limit);
    const leastUsed = entries.slice(-limit).reverse();
    return { mostUsed, leastUsed };
  },

  // ============ DEV TOOLS ============

  async resetDatabase() {
    await getDb();

    // Wipe all days, templates, and non-default tasks
    db.run('DELETE FROM days');
    db.run('DELETE FROM templates');
    db.run("DELETE FROM tasks WHERE id NOT IN ('work','study','gym','social','hobbies')");

    // Reset all skill values to 0
    db.run('UPDATE skills SET currentValue = 0');

    // Re-seed default tasks
    const seedTasks = [
      { id: 'work',   name: 'Work',   statId: 'academics',   statGain: 3 },
      { id: 'study',  name: 'Study',  statId: 'academics',   statGain: 2 },
      { id: 'gym',    name: 'Gym',    statId: 'proficiency', statGain: 2 },
      { id: 'social', name: 'Social', statId: 'kindness',    statGain: 2 },
      { id: 'hobbies',name: 'Hobbies',statId: 'guts',       statGain: 2 },
    ];
    for (const task of seedTasks) {
      db.run(`INSERT OR IGNORE INTO tasks (id, name, statId, statGain) VALUES (?, ?, ?, ?)`, [
        task.id, task.name, task.statId, task.statGain
      ]);
    }

    // Re-seed work template (Mon-Fri Morning)
    db.run(`INSERT OR IGNORE INTO templates (id, taskId, slot, daysOfWeek, enabled) VALUES (?, 'work', 'morning', '1,2,3,4,5', 1)`, ['work-default']);

    // Re-seed default settings
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('theme', 'p5')`);
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('morningEnabled', 'true')`);
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('eveningEnabled', 'false')`);

    saveDb();
  },

  async deleteNonDefaultTasks() {
    await getDb();

    // Count before deleting
    const beforeResult = db.exec("SELECT COUNT(*) as count FROM tasks WHERE id NOT IN ('work','study','gym','social','hobbies')");
    const count = beforeResult.length > 0 && beforeResult[0].values.length > 0 ? beforeResult[0].values[0][0] : 0;

    db.run("DELETE FROM tasks WHERE id NOT IN ('work','study','gym','social','hobbies')");
    saveDb();

    return { deletedCount: count };
  },

  async resetAllSkills() {
    await getDb();

    // Wipe all skills
    db.run('DELETE FROM skills');

    // Re-seed 5 default skills with value 0
    const seedSkills = [
      { id: 'guts',      name: 'Guts',      description: 'Courage and bravery',      icon: '💪' },
      { id: 'courage',   name: 'Courage',   description: 'Willingness to take risks', icon: '🔥' },
      { id: 'academics', name: 'Academics', description: 'Knowledge and learning',   icon: '📚' },
      { id: 'kindness',  name: 'Kindness',  description: 'Compassion and empathy',   icon: '💗' },
      { id: 'proficiency', name: 'Proficiency', description: 'Skill and dexterity', icon: '⚡' },
    ];
    for (const skill of seedSkills) {
      db.run(`INSERT OR IGNORE INTO skills (id, name, description, icon, currentValue) VALUES (?, ?, ?, ?, 0)`, [
        skill.id, skill.name, skill.description, skill.icon
      ]);
    }

    saveDb();
  },

  async modifySkillPoints(statId, delta) {
    await getDb();

    const stmt = db.prepare('SELECT currentValue FROM skills WHERE id = ?');
    stmt.bind([statId]);
    if (!stmt.step()) { stmt.free(); return null; }
    const row = stmt.getAsObject();
    stmt.free();

    const oldTier = Math.floor(row.currentValue / 100) + 1;
    const newValue = Math.max(0, row.currentValue + delta);
    const newTier = Math.floor(newValue / 100) + 1;

    db.run('UPDATE skills SET currentValue = ? WHERE id = ?', [newValue, statId]);
    saveDb();

    return { statId, oldValue: row.currentValue, newValue, oldTier, newTier };
  },

  async deleteAllTasks() {
    await getDb();

    const countResult = db.exec('SELECT COUNT(*) as count FROM tasks');
    const count = countResult.length > 0 && countResult[0].values.length > 0 ? countResult[0].values[0][0] : 0;

    db.run('DELETE FROM tasks');
    saveDb();

    return { deletedCount: count };
  },
};

module.exports = dbModule;
