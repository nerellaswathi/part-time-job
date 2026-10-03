const mongoose = require('mongoose');

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

const models = { User, Job, Application, Notification };

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[Database] MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

function getModel(name) {
  const model = models[name];
  if (!model) {
    throw new Error(`[Database] Unknown model requested: "${name}"`);
  }
  return model;
}

module.exports = { connectDB, getModel };
