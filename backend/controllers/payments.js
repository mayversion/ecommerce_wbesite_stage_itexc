const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Process payment
// @route   POST /api/payments/payment/process
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send stripe API key
// @route   GET /api/payments/stripeapikey
// @access  Private
exports.sendStripeApiKey = async (req, res, next) => {
  res.status(200).json({
    success: true,
    stripeApiKey: process.env.STRIPE_API_KEY
  });
};

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Classic May Store T-Shirt' },
            unit_amount: 1900
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};





