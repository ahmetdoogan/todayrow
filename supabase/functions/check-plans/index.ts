import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.1.0";
import { SMTPClient } from "https://deno.land/x/denomailer@1.3.0/mod.ts";

// Supabase env
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Initialize client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Tarih/saat bilgisini belirli bir zaman dilimine göre formatlar
function formatDateWithTimezone(date: Date, timeZone: string): string {
  try {
    // Intl.DateTimeFormat ile formatlı stringi döndür
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error(`Tarih formatlama hatası (${timeZone}):`, error);
    // Hata durumunda yerel string'i döndür
    return date.toLocaleString();
  }
}

// Email HTML template
function emailTemplate(title: string, startTime: string) {
  return `<div style="background-color: #f8fafc; padding: 40px 0;"><div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"><div style="text-align: center; margin-bottom: 32px; padding: 16px;"><img alt="Todayrow" width="200" height="40" style="display: block; margin: 0 auto; object-fit: contain; max-width: 100%;" src="https://todayrow.app/images/logo_dark.png"></div><h1 style="color: #1e293b; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 16px;">Plan Reminder</h1><div style="color: #64748b; font-size: 16px; line-height: 24px; margin: 0 0 32px; text-align: center;"><p>Your plan "${title}" is scheduled to start at ${startTime}.</p></div><div style="text-align: center;"><a href="https://todayrow.app/dashboard" style="display: inline-block; background-color: #000; color: #fff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 32px; border-radius: 12px;">View Plans</a></div></div></div>`;
}

async function checkAndNotify() {
  console.log("Starting plan notifications check...");

  try {
    const now = new Date();

    // 1) RPC: fetch_plans_with_emails fonksiyonunu çağır
    const { data: plans, error } = await supabase
      .rpc("fetch_plans_with_emails", { check_time: now.toISOString() });

    if (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }

    if (!plans || plans.length === 0) {
      console.log("No plans found");
      return { message: "No plans to check" };
    }

    console.log(`Found ${plans.length} plans to process`);

    // 2) SMTP client ayarları (TLS 465) - Deno environment için güncellendi
    const smtpConfig = {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: Deno.env.get("SMTP_USER") || "",
        password: Deno.env.get("SMTP_PASSWORD") || "",
      },
      // Daha yüksek zaman aşımı
      timeout: 60000, // 60 saniye bağlantı zaman aşımı
    };
    
    console.log("Creating SMTP client with configuration...");
    let client;
    
    try {
      // client = ... şeklinde değil, doğrudan oluştur
      client = new SMTPClient({
        connection: smtpConfig,
      });
      
      // Bağlantı testi burada gerek yok, gönderim sırasında otomatik bağlanacak
      console.log("SMTP client created");
    } catch (connErr) {
      console.error("SMTP client creation failed:", connErr);
      // Devam et, belki daha sonra düzelir
    }

    const results: Array<{
      id: number;
      title: string;
      email: string;
      status: string;
    }> = [];

    // 3) Planları işle
    for (const plan of plans as Array<any>) {
      console.log(`Processing plan: ${plan.title}`);

      const startTime = new Date(plan.start_time);
      console.log(`Plan start time: ${startTime}`);

      // Kullanıcının seçtiği bildirim süresini tercih et:
      //  - notify_before (örn. 30, 60) veya
      //  - notify_before_minutes (örn. 10) 
      //  - yoksa 10
      const minutesBefore = plan.notify_before ?? plan.notify_before_minutes ?? 10;
      console.log(`Minutes before: ${minutesBefore}`);

      const notifyTime = new Date(startTime.getTime() - minutesBefore * 60000);
      console.log(`Notify time: ${notifyTime}`);
      console.log(`Current time: ${now}`);

      // 4) Şu an notifyTime ile startTime arasında mıyız?
      if (now >= notifyTime && now < startTime) {
        console.log(`Time to notify for plan: ${plan.id}`);

                // Zaman dilimini (profiles.time_zone) kullanalım
        // "Europe/Istanbul" veya "UTC" vs.
        const userTimeZone = plan.time_zone || "UTC";
        console.log(`User timezone: ${userTimeZone}`);
        
        // Yeni yardımcı fonksiyonu kullanarak formatlı tarih/saat bilgisi oluştur
        const fullFormattedTime = formatDateWithTimezone(startTime, userTimeZone);
        console.log(`Formatted time for plan ${plan.id}: ${fullFormattedTime}`);
        
        // Kullanıcının zaman dilimini doğrulamak için UTC saati de göster
        console.log(`UTC time for reference: ${startTime.toUTCString()}`);

        try {
          console.log(`Sending email for plan ${plan.id} to ${plan.user_email}`);

            // SMTP bağlantı hatalarına karşı basitleştirilmiş mekanizma
            const maxRetries = 2;
            let retryCount = 0;
            let emailSent = false;
          
            while (!emailSent && retryCount < maxRetries) {
              try {
                console.log(`Attempting to send email (${retryCount + 1}/${maxRetries}) to ${plan.user_email}`);
                
                // Bağlanma işlemini client'a bırak - manual connect() çağrısı yapmıyoruz
                // E-posta gönderimi
                await client.send({
                  from: '"Todayrow" <hello@todayrow.app>',
                  to: plan.user_email,
                  subject: `Plan Reminder: ${plan.title}`,
                  html: emailTemplate(plan.title, fullFormattedTime),
                  // Gönderim zaman aşımını artır
                  timeout: 20000, // 20 saniye
                });
              
                emailSent = true;
                console.log(`Email successfully sent for plan ${plan.id} (attempt ${retryCount + 1})`);
              } catch (emailErr) {
                retryCount++;
                console.error(`SMTP error on attempt ${retryCount}:`, emailErr);
                console.error(`Error details: ${JSON.stringify(emailErr)}`);
              
                if (retryCount < maxRetries) {
                  console.log(`Retrying email send for plan ${plan.id} in ${1000 * Math.pow(2, retryCount)}ms...`);
                  // Her denemede biraz daha bekle (exponential backoff)
                  await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                } else {
                  console.error(`All ${maxRetries} attempts failed for plan ${plan.id}. Giving up.`);
                  // Son deneme de başarısız oldu. Hata fırlatmak yerine sadece log yazalım ve devam edelim
                  // Bu şekilde bir e-postanın başarısız olması diğerlerini engellemez
                }
              }
            }

          // 5) notification_sent = true
          const { error: updateError } = await supabase
            .from("plans")
            .update({ notification_sent: true })
            .eq("id", plan.id);

          if (updateError) {
            console.error(`Error updating plan ${plan.id}:`, updateError);
          } else {
            results.push({
              id: plan.id,
              title: plan.title,
              email: plan.user_email,
              status: "notified",
            });
            console.log(`Notification sent for plan: ${plan.id}`);
          }
        } catch (err) {
          const error = err as Error;
          console.error(`Error sending email for plan ${plan.id}:`, error);
          console.error("Detailed error:", error.stack);
        }
      } else {
        console.log(`Not time to notify yet for plan ${plan.id}`);
      }
    }

    // Sonuçları dön
    try {
      if (client) {
        // Bağlantıyı nazikçe kapat
        try {
          await client.close();
          console.log("SMTP connection closed successfully");
        } catch (closeErr) {
          console.error("Error closing SMTP connection:", closeErr);
          // Hata olsa bile devam et
        }
      }
    } catch (generalErr) {
      console.error("Error in cleanup phase:", generalErr);
    }

    return {
      message: `Notifications sent for ${results.length} plans`,
      notifications: results,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Error:", error);
    throw error;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Starting Edge Function execution...");
    
    // Zaman aşımı için bir Promise ve timeout ekleyelim
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Function execution timed out after 50 seconds"));
      }, 50000); // 50 saniye timeout
    });
    
    // Promise.race ile ya işlem tamamlanır ya da timeout olur
    const result = await Promise.race([
      checkAndNotify(),
      timeoutPromise
    ]) as any;
    
    console.log("Function completed successfully:", result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Function error:", error);
    
    // Hata detaylarını güvenli biçimde döndür
    return new Response(
      JSON.stringify({
        error: error.message,
        errorName: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
