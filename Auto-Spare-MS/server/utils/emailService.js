const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

const sendStockAlert = async (subject, plainText, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `Auto Spares System <${process.env.ALERT_EMAIL}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject,
      text: plainText,
      html: htmlContent,
    });

    console.log('Stock alert email sent.');
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

module.exports = {
  sendStockAlert,
};
