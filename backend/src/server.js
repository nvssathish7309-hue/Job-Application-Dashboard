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
app.use(cors({
  origin: true,
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

// Serve Uploaded Resumes statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Recruitment Backend API running on port ${PORT}`);
    console.log(`==================================================`);
  });
});
