const express = require('express');
const { addAddress, updateAddress, deleteAddress, setDefaultAddress } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/address').post(protect, addAddress);
router.route('/address/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);
router.route('/address/:id/default').put(protect, setDefaultAddress);

module.exports = router;





