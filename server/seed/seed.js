require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectDB, getModel, isMongooseConnected } = require('../services/db');
const demoJobs = require('./seedData');

async function seed() {
  await connectDB();
  const Job = getModel('Job');

  console.log('[Seed] Seeding job listings...');
  const count = await Job.countDocuments();
  if (count > 0) {
    console.log(`[Seed] Database already contains ${count} jobs. Refreshing seed data...`);
    await Job.deleteMany({});
  }

  if (Job.insertMany) {
    await Job.insertMany(demoJobs);
  } else {
    for (const job of demoJobs) {
      await Job.create(job);
    }
  }

  console.log(`[Seed] Successfully seeded ${demoJobs.length} realistic part-time student jobs.`);
  if (isMongooseConnected()) {
    process.exit(0);
  }
}

if (require.main === module) {
  seed().then(() => {
    console.log('[Seed] Completed.');
    process.exit(0);
  }).catch(err => {
    console.error('[Seed Error]:', err);
    process.exit(1);
  });
}

module.exports = seed;
