import nodemailer from "nodemailer";
import env from "../env/env";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.mailUser,
    pass: env.mailPass,
  },
});
