const express = require('express');
const { processPayment, sendStripeApiKey, createCheckoutSession } = require('../controllers/payments');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/payment/process').post(protect, processPayment);
router.route('/stripeapikey').get(sendStripeApiKey);
router.route('/checkout/session').post(createCheckoutSession);

module.exports = router;





