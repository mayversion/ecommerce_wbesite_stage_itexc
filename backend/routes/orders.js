const express = require('express');
const { 
  newOrder, 
  getSingleOrder, 
  myOrders, 
  getAllOrders, 
  updateOrder, 
  deleteOrder 
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/order/new').post(protect, newOrder);
router.route('/order/:id').get(protect, getSingleOrder);
router.route('/orders/me').get(protect, myOrders);
router.route('/admin/orders').get(protect, authorize('admin'), getAllOrders);
router.route('/admin/order/:id')
  .put(protect, authorize('admin'), updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

module.exports = router;





