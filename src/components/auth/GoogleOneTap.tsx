'use client'

import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { sendEvent } from '@/lib/analytics/ga-manager'

const GoogleOneTap = () => {
  const router = useRouter()

  const generateNonce = async () => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  useEffect(() => {
    const initializeGoogleOneTap = async () => {
      try {
        // Mevcut session kontrolü
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData.session) return

        const [nonce, hashedNonce] = await generateNonce()

        // @ts-ignore
        if (window.google?.accounts?.id) {
          // @ts-ignore
          window.google.accounts.id.initialize({
            client_id: "822907467055-i8psajcj2eemirjkrisa0dhccljhdi.apps.googleusercontent.com",
            callback: async (response: any) => {
              try {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: response.credential,
                  nonce,
                })

                if (error) throw error

                if (data.session?.user) {
                  sendEvent({
                    action: 'sign_in',
                    category: 'auth',
                    label: data.session.user.email || undefined
                  })
                  router.push('/dashboard')
                }
              } catch (error) {
                console.error('Error logging in:', error)
              }
            },
            nonce: hashedNonce,
            use_fedcm_for_prompt: true,
          })

          // @ts-ignore
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log("One Tap not displayed:", notification.getNotDisplayedReason())
            }
            if (notification.isSkippedMoment()) {
              console.log("One Tap skipped:", notification.getSkippedReason())
            }
            if (notification.isDismissedMoment()) {
              console.log("One Tap dismissed:", notification.getDismissedReason())
            }
          })
        }
      } catch (error) {
        console.error('Error initializing Google One Tap:', error)
      }
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        initializeGoogleOneTap()
      }
    }, 1000) // Google script'in yüklenmesi için biraz bekle

    return () => clearTimeout(timer)
  }, [router])

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        strategy="afterInteractive"
      />
      <div id="g_id_onload" className="fixed top-24 right-4" />
    </>
  )
}

export default GoogleOneTap