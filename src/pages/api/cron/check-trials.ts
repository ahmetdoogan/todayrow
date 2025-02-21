import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

/**
 * 1) Subscriptions tablonuzdaki her kaydı temsil eden arayüz.
 */
interface SubscriptionRecord {
  user_id: string
  trial_end: string  // tarih stringi
  status: string
}

/**
 * 2) auth.users tablosundaki kullanıcılar (email bilgisini almak için).
 */
interface UserRecord {
  id: string
  email: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const now = new Date()
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const oneDayLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

  let warningsSent = 0
  let expiredProcessed = 0

  // ----------------------------------------------------------------------------
  // 1) trial_end > now AND < 7 gün sonrası → 7/1 gün maili gönderilecek free_trial'lar
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
  const nearExpiration = (nearExpSubs as SubscriptionRecord[]) || []

  for (const sub of nearExpiration) {
    // auth.users tablosundan email çek
    const { data: userData, error: userError } = await supabase
      .from('auth.users')  // <-- Önemli düzeltme: public.users değil
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

    // Gün farkını hesapla
    const trialEndDate = new Date(sub.trial_end)
    const diffMs = trialEndDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (daysLeft > 1) {
      console.log(`(Trial) Sending 7-day warning mail to: ${user.email}`)
      // await fetch('/api/email/sendTrialWarning', { ... })
    } else {
      console.log(`(Trial) Sending 1-day warning mail to: ${user.email}`)
      // await fetch('/api/email/sendTrialWarning', { ... })
    }

    warningsSent++
  }

  // ----------------------------------------------------------------------------
  // 2) trial_end < now → Süresi dolan (expired) free_trial'lar
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
  const expiredUsers = (expiredSubs as SubscriptionRecord[]) || []

  for (const sub of expiredUsers) {
    // auth.users tablosundan email çek
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
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

    // Trial ended maili
    console.log(`Sending "Trial Ended" mail to: ${user.email}`)
    // await fetch('/api/email/sendTrialEnded', { ... })

    // Artık subscriptions tablosunda status='expired'
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', sub.user_id)

    expiredProcessed++
  }

  // ----------------------------------------------------------------------------
  // 3) cron_logs tablosuna log (opsiyonel)
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
  }

  return res.status(200).json({
    message: 'Trial check completed',
    warningsSent,
    expiredProcessed
  })
}
