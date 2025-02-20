import { type NextApiRequest, type NextApiResponse } from "next";
import nodemailer from "nodemailer";

// SMTP Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hello@todayrow.app",
    pass: process.env.SMTP_PASSWORD,
  },
});

// Welcome Email Template
const welcomeTemplate = `
<div style="background-color: #f8fafc; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <!-- Logo -->
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
      Welcome to Todayrow!
    </h1>
    
    <!-- Main Feature Card -->
    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <div style="background-color: #000; padding: 8px 16px; border-radius: 20px; margin: 0 auto 16px; width: fit-content;">
        <span style="color: #fff; font-size: 14px; font-weight: 500;">
          Plan your daily activities
        </span>
      </div>
      <p style="color: #64748b; font-size: 16px; line-height: 24px; text-align: center; margin: 0;">
        Create and manage your plans with our intuitive tools.
      </p>
    </div>

    <!-- Feature Cards -->
    <div style="margin-bottom: 32px;">
      <!-- Plans -->
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; margin-bottom: 8px;">
          <span style="background-color: #f8fafc; border-radius: 8px; padding: 8px;">🎯</span>
          <div>
            <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 4px;">
              Smart Planning
            </h3>
            <p style="color: #64748b; font-size: 14px; line-height: 20px; margin: 0;">
              Create plans easily, set email reminders, and drag & drop quick plans to your schedule.
            </p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="display: flex; gap: 12px; margin-bottom: 8px;">
          <span style="background-color: #f8fafc; border-radius: 8px; padding: 8px;">📝</span>
          <div>
            <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 4px;">
              Organized Notes
            </h3>
            <p style="color: #64748b; font-size: 14px; line-height: 20px; margin: 0;">
              Take notes and organize your ideas. Pin important notes for quick access.
            </p>
          </div>
        </div>
      </div>

      <!-- Content Management -->
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
        <div style="display: flex; gap: 12px; margin-bottom: 8px;">
          <span style="background-color: #f8fafc; border-radius: 8px; padding: 8px;">🔔</span>
          <div>
            <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 4px;">
              Smart Notifications
            </h3>
            <p style="color: #64748b; font-size: 14px; line-height: 20px; margin: 0;">
              Get email notifications before your plans start. Choose from 10, 30, or 60-minute reminders.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="https://todayrow.app/dashboard" 
         style="display: inline-block; background-color: #000; color: #fff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 32px; border-radius: 12px; margin-bottom: 16px;">
        Start Planning
      </a>
      <p style="color: #64748b; font-size: 14px; margin: 0;">
        Need help? Contact us at <a href="mailto:help@todayrow.app" style="color: #000; text-decoration: none;">help@todayrow.app</a>
      </p>
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

  const { email, name } = req.body;

  if (!email) {
    console.error('Welcome email attempt failed: No email provided');
    return res.status(400).json({ message: 'Email is required' });
  }

  // Email validasyonu
    if (!email) {
      console.error('Welcome email failed: Email is missing');
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('Attempting to send welcome email to:', email);

    // Email validasyonu
  if (!email) {
    console.log('Welcome email failed: No email provided');
    return res.status(400).json({ message: 'Email is required' });
  }

  console.log('Starting welcome email process for:', email);
  console.log('SMTP Config:', {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'hello@todayrow.app',
      passExists: !!process.env.SMTP_PASSWORD
    }
  });

  try {
    console.log('Attempting to send welcome email to:', email);
    await transporter.sendMail({
      from: '"Todayrow" <hello@todayrow.app>',
      to: email,
      subject: "Welcome to Todayrow!",
      html: welcomeTemplate,
    });

    console.log('Welcome email sent successfully to:', email);
      res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ message: "Error sending welcome email" });
  }
}