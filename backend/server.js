import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import subjectRoutes from './routes/subjectRoutes.js';
import pyqRoutes from './routes/pyqRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRequestRoutes from './routes/uploadRequestRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import connectDB from './config/db.js';
import axios from 'axios';
import { protect } from './middlewares/auth.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // React dev server
  'http://127.0.0.1:5173', // Alternative localhost
  'http://127.0.0.1:3000', // Alternative localhost
  'https://pyqhub-snpo.onrender.com', // Production Frontend URL
  // TODO: Add your production frontend URLs here after deployment:
  // 'https://your-pyq-app.vercel.app',
  // 'https://your-pyq-app.netlify.app',
  // 'https://pyq-hub.vercel.app',
  // 'https://pyqbbd.netlify.app'
];

// Handle OPTIONS preflight requests explicitly before CORS middleware
app.options('/{*path}', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow localhost always (for local development against prod backend)
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Universal CORS setup that works in all environments
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Always allow localhost for local development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    // Check explicitly allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Return 403 instead of throwing an error (throwing causes 500 which breaks preflight)
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse httpOnly cookies

// PDF Proxy Route for proper viewing
app.get('/api/pdf/:id', protect, async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'PDF URL is required' });
    }

    // Check credits
    const user = await User.findById(req.user.id);
    if (!user.isPro) {
      if (user.credits < 50) {
        return res.status(402).json({ error: 'Out of credits. Please upgrade to Pro.' });
      }
      user.credits -= 50;
      await user.save();
    }
    
    // Fetch PDF from Cloudinary
    const response = await axios.get(url, {
      responseType: 'stream'
    });
    
    // Set proper headers for PDF viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    
    // Pipe the PDF stream to response
    response.data.pipe(res);
  } catch (error) {
    console.error('PDF proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
});

// PDF Download Route for forcing download
app.get('/api/download/:id', protect, async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'PDF URL is required' });
    }
    
    // Check credits
    const user = await User.findById(req.user.id);
    if (!user.isPro) {
      if (user.credits < 50) {
        return res.status(402).json({ error: 'Out of credits. Please upgrade to Pro.' });
      }
      user.credits -= 50;
      await user.save();
    }
    
    // Increment download count for this PYQ
    const pyqId = req.params.id;
    if (pyqId && pyqId !== 'undefined' && pyqId !== 'null') {
      try {
        const PYQ = (await import('./models/PYQ.js')).default;
        const result = await PYQ.findByIdAndUpdate(
          pyqId, 
          { $inc: { downloadCount: 1 } },
          { new: true }
        );
        if (result) {
          console.log(`Download count updated for PYQ ${pyqId}: ${result.downloadCount}`);
        }
      } catch (error) {
        console.log('Could not update download count:', error.message);
      }
    }
    
    // Fetch PDF from Cloudinary
    const response = await axios.get(url, {
      responseType: 'stream'
    });
    
    // Set proper headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'document.pdf'}"`); 
    
    // Pipe the PDF stream to response
    response.data.pipe(res);
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ error: 'Failed to download PDF' });
  }
});

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/pyqs', pyqRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload-requests', uploadRequestRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);

// Public stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const [totalUsers, totalSubjects, totalPYQs, totalDownloadsResult] = await Promise.all([
      (await import('./models/User.js')).default.countDocuments({ role: { $ne: 'admin' } }),
      (await import('./models/Subject.js')).default.countDocuments(),
      (await import('./models/PYQ.js')).default.countDocuments(),
      (await import('./models/PYQ.js')).default.aggregate([
        { $group: { _id: null, totalDownloads: { $sum: "$downloadCount" } } }
      ])
    ]);

    const totalDownloads = totalDownloadsResult.length > 0 ? totalDownloadsResult[0].totalDownloads : 0;

    res.json({
      totalUsers,
      totalSubjects,
      totalPYQs,
      totalDownloads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});