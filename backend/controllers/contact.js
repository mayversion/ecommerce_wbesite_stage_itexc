const sendEmail = require('../utils/sendEmail');

exports.submit = async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const plain = `New contact message\n\nFrom: ${name} <${email}>\n\nMessage:\n${message}`;

    await sendEmail({
      email: 'maymehenni1@gmail.com',
      subject: `Contact form: ${name}`,
      message: plain
    });

    return res.json({ message: 'Message sent. We will get back to you shortly.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send your message. Please try again later.' });
  }
};
