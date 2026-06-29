const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/velvetpath.db');

async function migrate() {
  const SQL = await initSqlJs();
  let db;

  // Load existing DB or create new one
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  console.log('Running migrations...');

  // Rename stats → skills (Slice 5)
  try { db.run("ALTER TABLE stats RENAME TO skills"); } catch(e) { /* may already exist as skills */ }

  // Skills table
  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      isDefault INTEGER DEFAULT 0,
      currentValue INTEGER DEFAULT 0
    )
  `);

  // Tasks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      statId TEXT,
      statGain INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (statId) REFERENCES skills(id)
    )
  `);

  // Templates table
  db.run(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      slot TEXT NOT NULL CHECK(slot IN ('morning', 'afternoon', 'evening')),
      daysOfWeek TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      FOREIGN KEY (taskId) REFERENCES tasks(id)
    )
  `);

  // Days table
  db.run(`
    CREATE TABLE IF NOT EXISTS days (
      date TEXT PRIMARY KEY,
      morningStatus TEXT DEFAULT 'free',
      morningTaskId TEXT,
      morningCompleted INTEGER DEFAULT 0,
      afternoonStatus TEXT DEFAULT 'free',
      afternoonTaskId TEXT,
      afternoonCompleted INTEGER DEFAULT 0,
      eveningStatus TEXT DEFAULT 'free',
      eveningTaskId TEXT,
      eveningCompleted INTEGER DEFAULT 0,
      FOREIGN KEY (morningTaskId) REFERENCES tasks(id),
      FOREIGN KEY (afternoonTaskId) REFERENCES tasks(id),
      FOREIGN KEY (eveningTaskId) REFERENCES tasks(id)
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default skills (Persona 5 Royal)
  const defaultSkills = [
    { id: 'guts', name: 'Guts', description: 'Courage and bravery' },
    { id: 'courage', name: 'Courage', description: 'Willingness to take risks' },
    { id: 'academics', name: 'Academics', description: 'Knowledge and learning' },
    { id: 'kindness', name: 'Kindness', description: 'Compassion and empathy' },
    { id: 'proficiency', name: 'Proficiency', description: 'Skill and dexterity' },
  ];

  for (const skill of defaultSkills) {
    db.run(`INSERT OR IGNORE INTO skills (id, name, description, isDefault, currentValue) VALUES (?, ?, ?, 1, 0)`, [
      skill.id, skill.name, skill.description
    ]);
  }

  // Seed default tasks
  const seedTasks = [
    { id: 'work', name: 'Work', statId: 'academics', statGain: 3 },
    { id: 'study', name: 'Study', statId: 'academics', statGain: 2 },
    { id: 'gym', name: 'Gym', statId: 'proficiency', statGain: 2 },
    { id: 'social', name: 'Social', statId: 'kindness', statGain: 2 },
    { id: 'hobbies', name: 'Hobbies', statId: 'guts', statGain: 2 },
  ];

  for (const task of seedTasks) {
    db.run(`INSERT OR IGNORE INTO tasks (id, name, statId, statGain) VALUES (?, ?, ?, ?)`, [
      task.id, task.name, task.statId, task.statGain
    ]);
  }

  // Seed default Work template (Mon-Fri Morning)
  const workTemplateExists = db.exec("SELECT id FROM templates WHERE taskId = 'work'");
  if (workTemplateExists.length === 0 || workTemplateExists[0].values.length === 0) {
    db.run(`INSERT INTO templates (id, taskId, slot, daysOfWeek, enabled) VALUES (?, 'work', 'morning', '1,2,3,4,5', 1)`, ['work-default']);
  }

  // Seed default settings
  const defaultSettings = [
    { key: 'theme', value: 'p5' },
    { key: 'eveningEnabled', value: 'false' },
  ];

  for (const setting of defaultSettings) {
    db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, [setting.key, setting.value]);
  }

  // Save to disk
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);

  console.log('Migrations complete!');
  db.close();
}

migrate().catch(console.error);
