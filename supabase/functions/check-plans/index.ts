/// <reference lib="deno.ns" />

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

    // 2) SMTP client ayarları (TLS 465)
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USER") || "",
          password: Deno.env.get("SMTP_PASSWORD") || "",
        },
      },
    });

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

        // Tarih ve saat parçası ayrı formatlayıp birleştiriyoruz
        const formattedDate = startTime.toLocaleString("en-GB", {
          month: "long",
          day: "numeric",
          timeZone: userTimeZone,
        });
        const formattedClock = startTime.toLocaleString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: userTimeZone,
          hour12: false,
        });
        const fullFormattedTime = `${formattedDate} at ${formattedClock}`;

        try {
          console.log(`Sending email for plan ${plan.id} to ${plan.user_email}`);

          await client.send({
            from: '"Todayrow" <hello@todayrow.app>',
            to: plan.user_email,
            subject: `Plan Reminder: ${plan.title}`,
            html: emailTemplate(plan.title, fullFormattedTime),
          });

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

    await client.close();

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
    const result = await checkAndNotify();
    console.log("Function completed:", result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        errorName: error.name,
        errorStack: error.stack,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
