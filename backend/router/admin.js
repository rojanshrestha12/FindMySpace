import express from 'express';
import authenticate from '../middlewares/authMiddleware.js';
import {
  validateAdmin,
  modifyUser,
  modifyProperty,
  getAllUsers,
  getAllProperties,
  searchUsers,
  searchProperties,
} from '../controllers/admin.js';

const router = express.Router();

// Admin validation
router.get('/validateAdmin', authenticate, validateAdmin);

// Modify operations
router.post('/modifyUser', authenticate, modifyUser);
router.post('/modifyProperty', authenticate, modifyProperty);

// Get all
router.get('/users', authenticate, getAllUsers);
router.get('/properties', authenticate, getAllProperties);

// Search endpoints
router.post('/search/users', authenticate, searchUsers);
router.post('/search/properties', authenticate, searchProperties);

export default router;