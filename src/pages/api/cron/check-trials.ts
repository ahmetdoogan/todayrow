import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

interface SubscriptionRecord {
  user_id: string
  trial_end: string
  status: string
}

interface ProfileRecord {
  id: string
  email: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  const now = new Date()
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  let warningsSent = 0
  let expiredProcessed = 0

  // ------------------------------------------------------------------------
  // 1) Trial'i bitmek üzere olan kullanıcılar (7 günden az kalmış) - free_trial
  // ------------------------------------------------------------------------
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
    // 'profiles' tablosundan e-posta al
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', sub.user_id)
      .single()

    if (profileErr) {
      console.error('Error fetching profile (near-exp):', profileErr)
      continue
    }

    const profile = profileData as ProfileRecord | null
    if (!profile || !profile.email) {
      console.log('No email found for user_id:', sub.user_id)
      continue
    }

    // Kaç gün kalmış?
    const trialEndDate = new Date(sub.trial_end)
    const diffMs = trialEndDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    // Sadece 7 gün ve 1 gün kalmışsa mail gönder
    if (daysLeft === 7) {
      console.log(`(Trial) Sending 7-day warning mail to: ${profile.email}`)
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://todayrow.app'}/api/email/sendTrialWarning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          daysLeft
        })
      })
    } else if (daysLeft === 1) {
      console.log(`(Trial) Sending 1-day warning mail to: ${profile.email}`)
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://todayrow.app'}/api/email/sendTrialWarning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          daysLeft: 1
        })
      })
    } else {
      console.log(`(Trial) Skipping email for ${profile.email} - ${daysLeft} days left (not a notification day)`)
    }

    warningsSent++
  }

  // ------------------------------------------------------------------------
  // 2) Trial'i bitmiş (expired) olanlar
  // ------------------------------------------------------------------------
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
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', sub.user_id)
      .single()

    if (profileErr) {
      console.error('Error fetching profile (expired):', profileErr)
      continue
    }

    const profile = profileData as ProfileRecord | null
    if (!profile || !profile.email) {
      console.log('No email found for user_id (expired):', sub.user_id)
      continue
    }

    console.log(`Sending "Trial Ended" mail to: ${profile.email}`)
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://todayrow.app'}/api/email/sendTrialEnded`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email
      })
    })

    // status='expired'
    await supabase
      .from('subscriptions')
      .update({ status: 'expired', updated_at: now.toISOString() })
      .eq('user_id', sub.user_id)

    expiredProcessed++
  }

  // ------------------------------------------------------------------------
  // 3) cron_logs tablosuna kayıt (opsiyonel)
  // ------------------------------------------------------------------------
  const { error: logErr } = await supabase
    .from('cron_logs')
    .insert({
      job_name: 'check-trials',
      execution_time: now.toISOString(),
      details: { warningsSent, expiredProcessed }
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