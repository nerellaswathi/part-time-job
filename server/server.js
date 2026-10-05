require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { connectDB, getModel } = require('./services/db');
const demoJobs = require('./seed/seedData');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');
const notificationRoutes = require('./routes/notifications');

const app = express();

const PORT = process.env.PORT || 5000;

// ======================================================
// CORS
// ======================================================

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow localhost dev origins
    if (origin.startsWith('http://localhost')) return callback(null, true);

    // Allow any Vercel deployment of this project
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow the production custom domain if set
    const productionDomain = process.env.CLIENT_URL;
    if (productionDomain && origin === productionDomain) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ======================================================
// BODY PARSING
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiMode: process.env.AI_MODE || 'mock',
    message: 'AI-Powered Part-Time Job Platform API is running.'
  });
});

// ======================================================
// API ROUTES
// ======================================================

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);

  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : undefined
  });
});

// Serve React frontend only when running locally (not on Vercel)
const clientDistPath = path.join(
  __dirname,
  '..',
  'client',
  'dist'
);

if (fs.existsSync(clientDistPath) && process.env.NODE_ENV !== 'production') {
  app.use(express.static(clientDistPath));

  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(
      path.join(clientDistPath, 'index.html')
    );
  });

  console.log(
    `[Server] Serving React frontend from: ${clientDistPath}`
  );
}

// ======================================================
// START SERVER
// ======================================================

async function startServer() {
  try {
    await connectDB();

    // Auto-seed initial jobs
    if (getModel) {
      const Job = getModel('Job');

      const existingCount = await Job.countDocuments();

      if (existingCount === 0) {
        console.log(
          '[Server] Populating database with realistic initial student job listings...'
        );

        if (Job.insertMany) {
          await Job.insertMany(demoJobs);
        } else {
          for (const j of demoJobs) {
            await Job.create(j);
          }
        }

        console.log(
          `[Server] Seeded ${demoJobs.length} jobs.`
        );
      }
    }

    app.listen(PORT, () => {
      console.log(
        `\n======================================================`
      );

      console.log(
        `🚀 TalentAI Server running on port ${PORT}`
      );

      console.log(
        `   Health Check: /api/health`
      );

      console.log(
        `   AI Engine Mode: ${process.env.AI_MODE || 'mock'}`
      );

      console.log(
        `======================================================\n`
      );
    });

  } catch (err) {
    console.error(
      '[Server Startup Failure]:',
      err
    );

    process.exit(1);
  }
}

startServer();
