import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Bu interface, Supabase'den dönecek veri yapısını temsil ediyor.
// select('user_id, trial_end, user:auth.users!inner(email)')
// ile "user" adında bir nested obje gelecek (içinde "email" var).
interface SubscriptionJoin {
  user_id: string
  trial_end: string
  user?: {
    email?: string
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Supabase Client oluştur
  // Aşağıdaki environment değişkenlerini kendinize göre düzeltin
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  // Şu an ve gelecek zamanlar
  const now = new Date()
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const oneDayLater    = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

  let warningsSent = 0
  let expiredProcessed = 0

  // ----------------------------
  // 2) 7 Gün Uyarısı / 1 Gün Uyarısı Gönderilecek Kullanıcılar
  // ----------------------------
  // trial_end > now  (hala süresi var)
  // trial_end < sevenDaysLater (7 günden az kalmış) -> 7 gün uyarısı
  // NOT: eğer 1 gün kalmışsa "7 gün" yerine "1 gün" maili de gönderebilirsiniz
  const { data: nearExpirationData, error: nearExpErr } = await supabase
    .from('subscriptions')
    .select('user_id, trial_end, user:auth.users!inner(email)') 
    .eq('status', 'free_trial')
    .gt('trial_end', now.toISOString())
    .lt('trial_end', sevenDaysLater.toISOString())

  if (nearExpErr) {
    console.error('Error fetching nearExpiration data:', nearExpErr)
    return res.status(500).json({ error: nearExpErr.message })
  }

  const nearExpiration = (nearExpirationData as SubscriptionJoin[]) || []

  for (const row of nearExpiration) {
    if (!row.user?.email) {
      console.log('No email found for user_id:', row.user_id)
      continue
    }

    // Kaç gün kalmış?
    const trialEndDate = new Date(row.trial_end)
    const diffMs = trialEndDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    // daysLeft > 1 ise 7 gün maili, ==1 ise 1 gün maili gibi
    if (daysLeft > 1) {
      // Örnek: 7 gün maili
      console.log(`Sending 7-day warning mail to: ${row.user.email}`)
      // Burada sendTrialWarning API endpoint'inizi vs. çağırın
      // await fetch('/api/email/sendTrialWarning', { ... })
    } else {
      // Örnek: 1 gün maili
      console.log(`Sending 1-day warning mail to: ${row.user.email}`)
      // await fetch('/api/email/sendTrialWarning', { ... })
    }

    warningsSent++
  }

  // ----------------------------
  // 3) Süresi Dolan (Expired) Kullanıcılar
  // ----------------------------
  // trial_end < now
  const { data: expiredData, error: expiredErr } = await supabase
    .from('subscriptions')
    .select('user_id, trial_end, user:auth.users!inner(email)')
    .eq('status', 'free_trial')
    .lt('trial_end', now.toISOString())

  if (expiredErr) {
    console.error('Error fetching expired data:', expiredErr)
    return res.status(500).json({ error: expiredErr.message })
  }

  const expiredUsers = (expiredData as SubscriptionJoin[]) || []

  for (const row of expiredUsers) {
    if (!row.user?.email) {
      console.log('No email found for user_id:', row.user_id)
      continue
    }

    // Trial Ended Mail gönder
    console.log(`Sending "Trial Ended" mail to: ${row.user.email}`)
    // await fetch('/api/email/sendTrialEnded', { ... })

    // Artık status'ü 'expired' yap
    await supabase
      .from('subscriptions')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', row.user_id)

    expiredProcessed++
  }

  // ----------------------------
  // 4) Log Kaydı (cron_logs)
  // ----------------------------
  // Bu tabloyu "public.cron_logs" veya benzer şekilde oluşturduysanız, ekleyebilirsiniz
  const { error: logErr } = await supabase
    .from('cron_logs')
    .insert({
      job_name: 'check-trials',
      execution_time: now.toISOString(),
      details: {
        warningsSent,
        expiredProcessed
      }
    })

  if (logErr) {
    console.error('Error inserting cron log:', logErr)
  }

  // Sonuç döndür
  return res.status(200).json({
    message: 'Trial check completed',
    warningsSent,
    expiredProcessed
  })
}
