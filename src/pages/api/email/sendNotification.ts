import { type NextApiRequest, type NextApiResponse } from "next";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hello@todayrow.app",
    pass: process.env.SMTP_PASSWORD,
  },
});

// Plan bildirim template'i
const notificationTemplate = (planTitle: string, startTime: string) => `
<div style="background-color: #f8fafc; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 32px; padding: 16px;">
      <img 
        alt="Todayrow"
        width="200"
        height="40"
        style="display: block; margin: 0 auto; object-fit: contain; max-width: 100%;"
        src="https://todayrow.app/images/logo_dark.png"
      >
    </div>
    
    <h1 style="color: #1e293b; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 16px;">
      Plan Reminder
    </h1>
    
    <div style="color: #64748b; font-size: 16px; line-height: 24px; margin: 0 0 32px; text-align: center;">
      <p style="margin: 24px 0;">
        Your plan "${planTitle}" is scheduled to start at ${startTime}.
      </p>
    </div>

    <div style="text-align: center;">
      <a href="https://todayrow.app/dashboard" 
         style="display: inline-block; background-color: #000; color: #fff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 32px; border-radius: 12px;">
        View Dashboard
      </a>
    </div>
  </div>
</div>`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, planTitle, startTime } = req.body;

  if (!email || !planTitle || !startTime) {
    console.error('Plan notification attempt failed: Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  console.log('Starting plan notification process for:', email);

  try {
    await transporter.sendMail({
      from: '"Todayrow" <hello@todayrow.app>',
      to: email,
      subject: `Plan Reminder: ${planTitle}`,
      html: notificationTemplate(planTitle, startTime),
    });

    console.log('Plan notification sent successfully to:', email);
    res.status(200).json({ message: 'Plan notification sent successfully' });
  } catch (error) {
    console.error("Error sending plan notification:", error);
    res.status(500).json({ message: "Error sending plan notification" });
  }
}