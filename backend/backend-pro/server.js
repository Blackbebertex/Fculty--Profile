const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const Faculty = require('./models/Faculty');
const Publication = require('./models/Publication');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/faculty_dashboard';

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB (Pro Level)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- API Endpoints ---

// 1. SMART Stats (KPIs)
app.get('/api/stats', async (req, res) => {
  try {
    const totalPubs = await Publication.countDocuments();
    const totalFaculties = await Faculty.countDocuments();
    const uniqueJournals = await Publication.distinct('journal');
    const sources = await Publication.distinct('source');
    
    res.json({
      totalPublications: totalPubs,
      totalFaculties: totalFaculties,
      journalsCovered: uniqueJournals.length,
      sourcesCovered: sources.length,
      status: 'Online'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topFaculty = await Faculty.find().sort({ papers: -1 }).limit(10);
    res.json(topFaculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Publications Trend
app.get('/api/trends', async (req, res) => {
  try {
    const trends = await Publication.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(trends.map(t => ({ year: t._id, count: t.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Latest Feed
app.get('/api/feed', async (req, res) => {
  try {
    const latest = await Publication.find().sort({ createdAt: -1 }).limit(20);
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Faculty Cards (Profiles)
app.get('/api/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Research Distribution (Pie Chart)
app.get('/api/distribution', async (req, res) => {
  try {
    const distribution = await Faculty.aggregate([
      { $group: { _id: "$area", count: { $sum: 1 } } }
    ]);
    res.json(distribution.map(d => ({ name: d._id, value: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Scraper Integration ---
app.post('/api/scrape/start', async (req, res) => {
  // Use existing Python scraper logic via child_process
  const scraperPath = path.join(__dirname, '..', 'backend', 'scraper_engine.py');
  const pythonProcess = spawn('python3', [scraperPath]);

  pythonProcess.stdout.on('data', (data) => console.log(`Scraper Output: ${data}`));
  pythonProcess.stderr.on('data', (data) => console.error(`Scraper Error: ${data}`));

  res.json({ status: 'Scraping project started', pid: pythonProcess.pid });
});

app.listen(PORT, () => {
  console.log(`🚀 Pro Backend listening on port ${PORT}`);
});
