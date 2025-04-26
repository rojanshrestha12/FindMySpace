import express from 'express';
import authenticate from '../middlewares/authMiddleware.js';
import {
  modifyUser,
  deleteUser,
  getAllUsers,
  modifyProperty,
  deleteProperty,
  getAllProperties,
} from '../controllers/admin.js';

const router = express.Router();

// User Routes
// NOTE: thingy uses the register function to create a new user
router.put('/user',  modifyUser);         // Modify user
router.delete('/user/:user_id',  deleteUser); // Delete user
router.get('/users',  getAllUsers);       // Get all users

// Property Routes
router.put('/property',  modifyProperty);         // Modify property
router.delete('/property/:property_id',  deleteProperty); // Delete property
router.get('/properties',  getAllProperties);     // Get all properties

export default router;
