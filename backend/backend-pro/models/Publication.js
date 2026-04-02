const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  faculty: { type: String, required: true },
  authors: { type: String, default: '' },
  journal: { type: String, default: 'General Publication' },
  year: { type: Number, default: new Date().getFullYear() },
  link: { type: String, default: '#' },
  source: { type: String, default: 'Sourced' }, // Scopus, Google Scholar, WoS
  citations: { type: Number, default: 0 }
}, { timestamps: true });

publicationSchema.index({ title: 1, faculty: 1 }, { unique: true });

module.exports = mongoose.model('Publication', publicationSchema);
