import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

/**
 * 1) Subscriptions tablonuzdaki her kaydı temsil edecek arayüz.
 *    - user_id: hangi kullanıcının kaydı
 *    - trial_end: trial bitiş tarihi
 */
interface SubscriptionRecord {
  user_id: string
  trial_end: string  // string formatında tarih
  status: string
}

/**
 * 2) auth.users tablonuzdaki kullanıcılar. 
 *    - email bilgisini almak yeterli.
 */
interface UserRecord {
  id: string
  email: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supabase client oluştur
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  // Şu an, 7 gün sonrası, 1 gün sonrası
  const now = new Date()
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const oneDayLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

  let warningsSent = 0
  let expiredProcessed = 0

  // ----------------------------------------------------------------------------
  // 1) 7 gün uyarısı veya 1 gün uyarısı gönderilecek kullanıcıları al (free_trial)
  //    trial_end > now AND trial_end < 7 gün sonrası
  // ----------------------------------------------------------------------------
  const { data: nearExpSubs, error: nearExpError } = await supabase
    .from('subscriptions')
    .select('user_id, trial_end, status')
    .eq('status', 'free_trial')
    .gt('trial_end', now.toISOString())
    .lt('trial_end', sevenDaysLater.toISOString())

  if (nearExpError) {
    console.error('Error fetching near-expiration subscriptions:', nearExpError)
    return res.status(500).json({ error: nearExpError.message })
  }

  // nearExpSubs bir SubscriptionRecord dizisi olmalı
  const nearExpiration = (nearExpSubs as SubscriptionRecord[]) || []

  for (const sub of nearExpiration) {
    // Kullanıcının email adresini çekmek için ikinci sorgu:
    const { data: userData, error: userError } = await supabase
      .from('users')    // dikkat: auth.users tablosu "users" ismiyle tanımlıysa
      .select('id, email')
      .eq('id', sub.user_id)
      .single()

    if (userError) {
      console.error('Error fetching user record:', userError)
      continue
    }
    const user = userData as UserRecord | null

    if (!user || !user.email) {
      console.log('No email found for user_id:', sub.user_id)
      continue
    }

    // Gün farkını hesaplayalım
    const trialEndDate = new Date(sub.trial_end)
    const diffMs = trialEndDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (daysLeft > 1) {
      // Örnek: 7 gün maili
      console.log(`(Trial) Sending 7-day warning mail to: ${user.email}`)
      // Burada gerçek mail fonksiyonunuzu çağırabilirsiniz:
      // await fetch('/api/email/sendTrialWarning', { ... })
    } else {
      // Örnek: 1 gün maili
      console.log(`(Trial) Sending 1-day warning mail to: ${user.email}`)
      // Benzer şekilde mail endpointini çağırın
    }

    warningsSent++
  }

  // ----------------------------------------------------------------------------
  // 2) Süresi dolan (expired) kullanıcıları al (free_trial)
  //    trial_end < now
  // ----------------------------------------------------------------------------
  const { data: expiredSubs, error: expiredError } = await supabase
    .from('subscriptions')
    .select('user_id, trial_end, status')
    .eq('status', 'free_trial')
    .lt('trial_end', now.toISOString())

  if (expiredError) {
    console.error('Error fetching expired subscriptions:', expiredError)
    return res.status(500).json({ error: expiredError.message })
  }

  // expiredSubs da SubscriptionRecord dizisi
  const expiredUsers = (expiredSubs as SubscriptionRecord[]) || []

  for (const sub of expiredUsers) {
    // Kullanıcı bilgisi:
    const { data: userData, error: userError } = await supabase
      .from('users') // auth.users tablonuzu burada "users" olarak çektiyseniz
      .select('id, email')
      .eq('id', sub.user_id)
      .single()

    if (userError) {
      console.error('Error fetching user record (expired):', userError)
      continue
    }
    const user = userData as UserRecord | null

    if (!user || !user.email) {
      console.log('No email found for user_id (expired):', sub.user_id)
      continue
    }

    // "Trial Ended" maili gönder
    console.log(`Sending "Trial Ended" mail to: ${user.email}`)
    // await fetch('/api/email/sendTrialEnded', { ... })

    // Status'ü "expired" yap
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', sub.user_id)

    expiredProcessed++
  }

  // ----------------------------------------------------------------------------
  // 3) cron_logs tablosuna log yaz (isteğe bağlı)
  // ----------------------------------------------------------------------------
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
    // Devam et, fatal değildir
  }

  // Bitti
  return res.status(200).json({
    message: 'Trial check completed',
    warningsSent,
    expiredProcessed
  })
}
