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
      Todayrow'a Hoş Geldiniz!
    </h1>
    
    <div style="color: #64748b; font-size: 16px; line-height: 24px; margin: 0 0 32px;">
      <p style="margin-bottom: 16px;">
        LinkedIn içerik planlamanızı kolaylaştırmak için buradayız. İşte Todayrow ile yapabilecekleriniz:
      </p>
      
      <div style="margin-left: 24px; margin-bottom: 24px;">
        • İçeriklerinizi takvim üzerinde planlayın<br/>
        • Notlarınızı organize edin<br/>
        • İçerik fikirlerinizi kaydedin<br/>
        • Otomatik hatırlatmalar alın
      </div>

      <p style="margin-bottom: 16px;">
        <strong>Başlamak için önerilerimiz:</strong>
      </p>
      
      <div style="margin-left: 24px;">
        1. Profilinizi güncelleyin<br/>
        2. İlk içerik planınızı oluşturun<br/>
        3. LinkedIn profilinizi bağlayın
      </div>
    </div>

    <div style="text-align: center;">
      <a href="https://todayrow.app/dashboard" 
         style="display: inline-block; background-color: #000; color: #fff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 32px; border-radius: 12px;">
        Uygulamayı Aç
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
      subject: "Todayrow'a Hoş Geldiniz!",
      html: welcomeTemplate,
    });

    console.log('Welcome email sent successfully to:', email);
      res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ message: "Error sending welcome email" });
  }
}