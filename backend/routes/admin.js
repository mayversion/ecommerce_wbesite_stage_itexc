const express = require('express');
const { 
  getAllUsers, 
  getUserDetails, 
  updateUser, 
  deleteUser,
  getAdminStats,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User management routes
router.route('/users').get(protect, authorize('admin'), getAllUsers);
router.route('/users/:id')
  .get(protect, authorize('admin'), getUserDetails)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

// Stats route
router.route('/stats').get(protect, authorize('admin'), getAdminStats);

// Coupon management routes
router.route('/coupons')
  .get(protect, authorize('admin'), getAllCoupons)
  .post(protect, authorize('admin'), createCoupon);

router.route('/coupons/:id')
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;





