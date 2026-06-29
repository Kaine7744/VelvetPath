const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/days', require('./routes/days'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/statistics', require('./routes/statistics'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist/velvetpath')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/velvetpath/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`VelvetPath backend running on http://localhost:${PORT}`);
});
