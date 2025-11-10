const sendEmail = async (options) => {
  // Use SendGrid in production, Nodemailer in development
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: options.email,
      from: process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_MAIL,
      subject: options.subject,
      text: options.message
    };
    
    try {
      await sgMail.send(msg);
      console.log('Email sent via SendGrid to:', options.email);
    } catch (error) {
      console.error('SendGrid error:', error.message);
      throw error;
    }
  } else {
    // Fallback to nodemailer for local development
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const message = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent via Gmail:', info.messageId);
  }
};

module.exports = sendEmail;



