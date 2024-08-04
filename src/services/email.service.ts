import { OAuth2Client } from 'google-auth-library';

import nodemailer from 'nodemailer';
import { BadRequestError } from '../core/error.response';

class EmailService {
  static sendEmail = async (data: string) => {
    try {
      const myOAuth2Client = new OAuth2Client(
        process.env.GOOGLE_MAILER_CLIENT_ID,
        process.env.GOOGLE_MAILER_CLIENT_SECRET,
      );

      myOAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      });

      const myAccessTokenObject = await myOAuth2Client.getAccessToken();

      const myAccessToken = myAccessTokenObject?.token;

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.ADMIN_EMAIL_ADDRESS,
          clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
          clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken,
        },
      });

      const mailOptions = {
        to: 'vuanhlam000@gmail.com',
        subject: 'Thông báo về việc phát hành hóa đơn điện tử',
        html: '<p>You have got a new message</b><ul><li>Hello:' + data,
      };

      await transporter.sendMail(mailOptions);

      return {
        message: 'Email sent successfully',
      };
    } catch (error) {
      throw new BadRequestError('Email sent failed');
    }
  };
}
export default EmailService;
