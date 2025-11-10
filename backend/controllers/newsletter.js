const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const sendEmail = require('../utils/sendEmail');

// POST /api/newsletter/subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Upsert subscriber
    const sub = await NewsletterSubscriber.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $setOnInsert: { email: email.toLowerCase().trim(), source } },
      { new: true, upsert: true }
    );

    // Send confirmation email (best-effort)
    try {
      await sendEmail({
        email,
        subject: 'Thanks for subscribing to May Store',
        message: 'You have been subscribed to our newsletter. You can unsubscribe anytime from your profile.'
      });
    } catch (e) {
      // log only, do not fail subscription on email error
      console.log('Newsletter confirmation email failed:', e.message);
    }

    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    const msg = err.code === 11000 ? 'You are already subscribed' : err.message;
    return res.status(400).json({ success: false, message: msg });
  }
};

// GET /api/newsletter/status?email=...
exports.status = async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ success: false, subscribed: false, message: 'Email is required' });
    const exists = await NewsletterSubscriber.exists({ email });
    return res.status(200).json({ success: true, subscribed: !!exists });
  } catch (err) {
    return res.status(400).json({ success: false, subscribed: false, message: err.message });
  }
};

// POST /api/newsletter/unsubscribe
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    await NewsletterSubscriber.deleteOne({ email: email.toLowerCase().trim() });

    // Send confirmation email (best-effort)
    try {
      await sendEmail({
        email,
        subject: 'You have unsubscribed from May Store Newsletter',
        message:
          'This is to confirm that your email has been unsubscribed from the May Store newsletter.\n\nYou will no longer receive marketing emails from us. If this was a mistake, you can re‑subscribe anytime from your profile or our homepage newsletter box.\n\nThank you,\nMay Store Team'
      });
    } catch (e) {
      console.log('Newsletter unsubscribe confirmation email failed:', e.message);
    }

    return res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
