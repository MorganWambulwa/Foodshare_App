import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  getDrivers, 
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getMe);
router.get('/drivers', protect, getDrivers);


router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;