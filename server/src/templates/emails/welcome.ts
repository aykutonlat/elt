import { transporter } from "../../config/connect/mail";
import env from "../../config/env/env";

export const welcomeEmail = async (username: string, email: string) => {
  const mailOptions = {
    from: env.mailUser,
    to: email,
    subject: `Welcome to Planimo, ${username}!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Planimo</title>
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
          .logo {
              text-align: center;
              margin-bottom: 20px;
          }
          .logo img {
              max-width: 150px;
          }
          h1 {
              color: #4A90E2;
              text-align: center;
          }
          p {
              line-height: 1.6;
              font-size: 16px;
          }
          .button {
              display: block;
              width: fit-content;
              margin: 20px auto;
              padding: 12px 24px;
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
          .features {
              margin: 20px 0;
              padding: 0;
              list-style: none;
          }
          .features li {
              margin: 10px 0;
              font-size: 16px;
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
              Thank you for joining Planimo, the ultimate project management tool to help you organize and streamline your workflow.
          </p>
          <ul class="features">
              <li>📋 Create and manage tasks with ease.</li>
              <li>👥 Collaborate with your team effortlessly.</li>
              <li>📊 Track progress and meet deadlines.</li>
          </ul>
          <a href="${env.frontendUrl}" class="button">
              Get Started with Planimo
          </a>
          <p>
              If you have any questions, feel free to reach out to our support team at 
              <a href="mailto:support@planimo.com">support@planimo.com</a>.
          </p>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Planimo. All rights reserved.</p>
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

{
  /* <div class="container">
          <div class="logo">
              <img src="${ENV.FRONTEND_URL}/logo.png" alt="Planimo Logo">
          </div>
          <h1>Welcome, ${username}!</h1>
          <p>
              Thank you for joining Planimo, the ultimate project management tool to help you organize and streamline your workflow.
          </p>
          <ul class="features">
              <li>📋 Create and manage tasks with ease.</li>
              <li>👥 Collaborate with your team effortlessly.</li>
              <li>📊 Track progress and meet deadlines.</li>
          </ul>
          <a href="${ENV.FRONTEND_URL}" class="button">
              Get Started with Planimo
          </a>
          <p>
              If you have any questions, feel free to reach out to our support team at 
              <a href="mailto:support@planimo.com">support@planimo.com</a>.
          </p>
          <div class="social-icons">
              <a href="https://facebook.com/Planimo"><img src="${
                ENV.FRONTEND_URL
              }/icons/facebook.png" alt="Facebook"></a>
              <a href="https://twitter.com/Planimo"><img src="${
                ENV.FRONTEND_URL
              }/icons/twitter.png" alt="Twitter"></a>
              <a href="https://linkedin.com/company/Planimo"><img src="${
                ENV.FRONTEND_URL
              }/icons/linkedin.png" alt="LinkedIn"></a>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Planimo. All rights reserved.</p>
          </div>
      </div> */
}
