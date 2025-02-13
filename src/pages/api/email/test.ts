// src/pages/api/email/test.ts
import { type NextApiRequest, type NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "hello@todayrow.app",
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    console.log('Test email configuration:', {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'hello@todayrow.app',
        passExists: !!process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: '"Todayrow Test" <hello@todayrow.app>',
      to: "hayrmeplatform@gmail.com",
      subject: "Test Mail",
      html: "<p>Bu bir test mailidir.</p>",
    });

    console.log('Test email sent successfully');
    res.status(200).json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ message: "Error sending test email", error });
  }
}