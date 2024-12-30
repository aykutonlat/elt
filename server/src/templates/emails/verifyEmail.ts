import { transporter } from "../../config/connect/mail";
import env from "../../config/env/env";

interface IVerifyEmail {
  username: string;
  email: string;
  resetToken: string;
  type: string;
}

export const sendVerifyEmail = async ({
  username,
  email,
  resetToken,
  type,
}: IVerifyEmail) => {
  const mailOptions = {
    from: env.mailUser,
    to: email,
    subject: "Planimo - Activate Your Account",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Activate Your Account</title>
      <style>
          body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 15px rgba(0,0,0,0.1);
          }
          h1 {
              color: #4A90E2;
              text-align: center;
          }
          p {
              line-height: 1.6;
              font-size: 16px;
          }
          .logo {
              text-align: center;
              margin-bottom: 20px;
          }
          .logo img {
              max-width: 150px;
          }
          .button {
              display: inline-block;
              padding: 12px 24px;
              margin: 20px 0;
              background-color: #4A90E2;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              transition: background-color 0.3s;
              text-align: center;
          }
          .button:hover {
              background-color: #357ABD;
          }
          .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 12px;
              color: #777;
          }
          .social-icons {
              margin-top: 20px;
              text-align: center;
          }
          .social-icons a {
              margin: 0 10px;
              text-decoration: none;
          }
          .social-icons img {
              width: 30px;
          }
      </style>
      </head>
      <body>
      <div class="container">
          <h1>Welcome, ${username}!</h1>
          <p>
              We're excited to have you at Planimo. Please verify your email address to activate your account and get started!
          </p>
          <a href="${env.frontendUrl}/${type}/${resetToken}" class="button">
              Activate My Account
          </a>
          <p>
              If you didn't create an account with Planimo, you can safely ignore this email.
          </p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Planimo. All rights reserved.</p>
              <p>
                  Need help? Contact us at 
                  <a href="mailto:support@planimo.com">support@planimo.com</a>
              </p>
          </div>
      </div>
      </body>
      </html>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Email gönderilirken hata oluştu:", err);
    return false;
  }
};
