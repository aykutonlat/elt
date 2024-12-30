import { transporter } from "../../config/connect/mail";
import env from "../../config/env/env";

interface IForgotPassword {
  username: string;
  email: string;
  resetToken: string;
  type: string;
}

export const sendForgotPasswodMail = async ({
  username,
  email,
  resetToken,
  type,
}: IForgotPassword) => {
  const mailOptions = {
    from: env.mailUser,
    to: email,
    subject: "Planimo - Password Reset",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        Retro Think - Password Reset
    </title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 560px;
            margin: 40px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            text-align: left;
        }
        h1 {
            color: #4A90E2;
        }
        p {
            line-height: 1.6;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
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
        .mail, .mail a {
            text-decoration: none !important;
            color: inherit;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #777;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <h1>Welcome, ${username}!</h1>
        <p>
            You have requested to reset your password. Please click the button below to reset your password.
        </p>
        <p><strong>Username:</strong> ${username}</p>
        <p class="mail"><strong>Email:</strong> ${email}</p>
        <a href="${env.frontendUrl}/verify=${type}/${resetToken}" class="button">
            Reset Password
        </a>
        <p class="footer">If you didn't request a password reset, you can ignore this email.</p>
        <p class="footer">This email was automatically generated, please do not reply.</p>
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
