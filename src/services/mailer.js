import nodemailer from 'nodemailer';
import config from '../config/index';

const transportOptions = {
  host: config.get('mail:mailtrap:host'),
  port: config.get('mail:mailtrap:port'),
  auth: {
    user: config.get('mail:mailtrap:user'),
    pass: config.get('mail:mailtrap:password'),
  },
};

const transporter = nodemailer.createTransport(transportOptions);

async function sendEmail(recipient, title, message) {
  const mailOptions = {
    from: '',
    to: recipient,
    subject: title,
    text: message,
  };

  await transporter.sendMail(mailOptions);
}

export default { sendEmail };
