const mongoose = require('mongoose');

const checkAndSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const Candidate = require('../models/Candidate');
    const userCount = await User.countDocuments().catch(() => 0);
    const candCount = await Candidate.countDocuments().catch(() => 0);

    if (userCount === 0 || candCount === 0) {
      console.log('Database empty on boot. Auto-seeding initial recruitment data...');
      const { runSeedLogic } = require('../utils/seed');
      await runSeedLogic();
    }
  } catch (e) {
    console.warn('Check and seed error:', e.message);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/job_application_dashboard';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1000
    });
    console.log(`==================================================`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`==================================================`);
    await checkAndSeedIfEmpty();
    return true;
  } catch (error) {
    console.warn(`Local MongoDB not reachable (${error.message}).`);
    console.log(`Starting automatically managed MongoMemoryServer fallback...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      await mongoose.connect(memUri);
      console.log(`==================================================`);
      console.log(`In-Memory MongoDB Active: ${memUri}`);
      console.log(`Auto-seeding demo accounts and candidate data...`);
      console.log(`==================================================`);
      
      const { runSeedLogic } = require('../utils/seed');
      await runSeedLogic();
      return true;
    } catch (memErr) {
      console.error('Failed to start MongoMemoryServer:', memErr.message);
      return false;
    }
  }
};

module.exports = connectDB;

