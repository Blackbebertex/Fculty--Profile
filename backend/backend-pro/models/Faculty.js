const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  area: { type: String, default: 'General Research' },
  hIndex: { type: Number, default: 0 },
  i10Index: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  papers: { type: Number, default: 0 },
  lastPublication: { type: Date },
  profileLinks: {
    googleScholar: String,
    scopus: String,
    wos: String
  },
  growthTrend: [{
    year: Number,
    count: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
