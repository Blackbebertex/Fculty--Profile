const mongoose = require('mongoose');
const Faculty = require('./models/Faculty');
const Publication = require('./models/Publication');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const MONGO_URI = 'mongodb://localhost:27017/faculty_dashboard';
const CSV_PATH = path.join(__dirname, '..', 'faculty_profile_links.csv');

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('🌱 Seeding MongoDB...');

  // Clear existing
  await Faculty.deleteMany({});
  await Publication.deleteMany({});

  const faculties = [];
  
  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => {
      if (row['Faculty Name']) {
        faculties.push({
          name: row['Faculty Name'],
          area: 'Computer Science',
          papers: Math.floor(Math.random() * 50) + 5, // Mock data for initial pro feel
          citations: Math.floor(Math.random() * 500) + 50,
          hIndex: Math.floor(Math.random() * 20) + 2,
          profileLinks: {
            googleScholar: row['Google Scholar'],
            scopus: row['Scopus Profile'],
            wos: row['WoS / ORCID / Publons']
          }
        });
      }
    })
    .on('end', async () => {
      await Faculty.insertMany(faculties);
      console.log(`✅ Seeded ${faculties.length} faculty profiles.`);
      
      // Mock some publications for the feed
      const pubs = faculties.flatMap(f => [
        { title: `Advances in ${f.area} Research`, faculty: f.name, year: 2024, journal: 'Springer', source: 'Scopus' },
        { title: `Case Study on ${f.name} methodology`, faculty: f.name, year: 2023, journal: 'IEEE Xplore', source: 'WoS' }
      ]);
      await Publication.insertMany(pubs);
      console.log(`✅ Seeded ${pubs.length} sample publications.`);
      
      process.exit();
    });
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
