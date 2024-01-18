import { createTransport } from "nodemailer";

export const gmail_transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ADDR,
    pass: process.env.GMAIL_PASS,
  },
});
