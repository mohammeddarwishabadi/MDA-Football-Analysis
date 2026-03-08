const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Rate limit exceeded. Please slow down.' }
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(xssClean());
app.use('/api', apiLimiter);
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req, res) => res.json({ success: true, data: { ok: true }, message: 'API healthy' }));
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
