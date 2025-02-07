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

const trialEndedTemplate = `
<div style="background-color: #f8fafc; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 32px; padding: 16px;">
      <img alt="Todayrow" width="200" height="40" style="display: block; margin: 0 auto; object-fit: contain; max-width: 100%;" src="https://todayrow.app/images/logo_dark.png">
    </div>
    
    <h1 style="color: #1e293b; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 16px;">
      Deneme Süreniz Sona Erdi
    </h1>
    
    <p style="color: #64748b; font-size: 16px; line-height: 24px; text-align: center; margin: 0 0 32px;">
      Pro üyeliğe geçerek Todayrow'un tüm özelliklerinden yararlanmaya devam edebilirsiniz.
    </p>

    <div style="text-align: center;">
      <a href="https://todayrow.app/upgrade" style="display: inline-block; background-color: #000; color: #fff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 32px; border-radius: 12px;">
        Pro'ya Geç
      </a>
    </div>
  </div>
</div>`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  try {
    await transporter.sendMail({
      from: '"Todayrow" <noreply@todayrow.app>',
      to: email,
      subject: "Deneme Süreniz Sona Erdi",
      html: trialEndedTemplate,
    });

    res.status(200).json({ message: "Trial ended email sent successfully" });
  } catch (error) {
    console.error("Error sending trial ended email:", error);
    res.status(500).json({ message: "Error sending trial ended email" });
  }
}