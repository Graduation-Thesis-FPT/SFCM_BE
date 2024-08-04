import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'smpt.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'vuanhlam000@gmail.com',
    pass: 'Vu@nhlam0399',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
