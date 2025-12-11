import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

import { getReceivedRequests, updateRequestStatus } from './controllers/donationController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

const requestRouter = express.Router();
requestRouter.get('/received', protect, getReceivedRequests);
requestRouter.patch('/:id/status', protect, updateRequestStatus);
app.use('/api/requests', requestRouter);

app.get('/', (req, res) => {
  res.send('FoodShare API is running...');
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});