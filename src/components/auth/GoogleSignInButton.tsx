'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import { sendEvent } from '@/lib/analytics/ga-manager'
import Script from 'next/script'

interface Props {
  text: string;
  className?: string;
}

const GoogleSignInButton = ({ text, className = '' }: Props) => {
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
    const initializeGoogle = async () => {
      try {
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
            nonce: hashedNonce
          })
          
          // @ts-ignore
          window.google.accounts.id.renderButton(
            document.getElementById('google-sign-in-button'),
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 250
            }
          )
        }
      } catch (error) {
        console.error('Error initializing Google Sign In:', error)
      }
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        initializeGoogle()
      }
    }, 1000)

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
      <div id="google-sign-in-button" className={className} />
    </>
  )
}

export default GoogleSignInButton