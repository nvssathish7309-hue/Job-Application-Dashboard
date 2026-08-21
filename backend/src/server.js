const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Security & Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : true;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins === true || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many login attempts. Please try again later.' }
});

app.use('/api/auth/login', authLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let dbReady = false;
let dbError = null;

const dbPromise = connectDB()
  .then((success) => {
    if (success !== false) {
      dbReady = true;
    } else {
      dbError = new Error('Database connection returned false status');
    }
  })
  .catch((err) => {
    dbError = err;
    console.error('Database connection error:', err);
  });

// Database readiness check middleware to avoid proxy 502 connection drops
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') return next();
  if (dbReady) return next();
  if (dbError) {
    return res.status(500).json({ success: false, message: 'Database startup failed', error: dbError.message });
  }
  try {
    await Promise.race([
      dbPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Database initialization timeout')), 10000))
    ]);
    dbReady = true;
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: 'Database initialization in progress, please retry shortly' });
  }
});

// Serve Uploaded Resumes statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root Landing API Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Recruitment Backend API Service is Active & Running!',
    status: 'Healthy',
    timestamp: new Date(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      candidates: '/api/candidates',
      jobs: '/api/jobs',
      applications: '/api/applications',
      interviews: '/api/interviews',
      notifications: '/api/notifications',
      reports: '/api/reports'
    }
  });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, status: 'Healthy', timestamp: new Date() });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/reports', reportRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`🚀 Recruitment Backend API running on http://localhost:${PORT}`);
  console.log(`==================================================`);
});
