import type { APIRoute } from "astro"
import { simpleAuth } from "../../../lib/simple-auth"

export const prerender = false

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const state = url.searchParams.get('state')
    const testMode = url.searchParams.get('test')

    console.log('=== OAuth Callback Debug ===')
    console.log('Full URL:', request.url)
    console.log('Code present:', !!code)
    console.log('Error:', error)
    console.log('State:', state)
    console.log('Test mode:', testMode)
    console.log('All params:', Object.fromEntries(url.searchParams.entries()))

    // TEST MODE: Skip Google OAuth and create test session
    if (testMode === 'braze') {
      console.log('=== TEST MODE: Creating test Braze session ===')
      const testUser = {
        id: 'test-123',
        email: 'test@braze.com',
        name: 'Test User',
        picture: 'https://via.placeholder.com/150'
      }
      
      const sessionToken = simpleAuth.createSessionToken(testUser)
      console.log('Test session token created, length:', sessionToken.length)
      console.log('Redirecting to home page with test session...')

      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/?login=test_success',
          'Set-Cookie': `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`
        }
      })
    }

    // Handle OAuth error
    if (error) {
      console.log('OAuth error detected:', error)
      return redirect('/login?error=oauth_error&details=' + encodeURIComponent(error))
    }

    // Handle missing code
    if (!code) {
      console.log('No authorization code received')
      return redirect('/login?error=no_code')
    }

    // Exchange code for tokens
    console.log('Attempting to exchange code for tokens...')
    try {
      const tokens = await simpleAuth.exchangeCodeForTokens(code)
      console.log('Token exchange successful, access_token present:', !!tokens.access_token)
      
      // Get user info
      console.log('Attempting to get user info...')
      const user = await simpleAuth.getGoogleUser(tokens.access_token)
      console.log('User info received:', { email: user.email, name: user.name })
      
      // Validate Braze email
      const isValidEmail = simpleAuth.validateBrazeEmail(user.email)
      console.log('Email validation result:', isValidEmail, 'for email:', user.email)
      
      if (!isValidEmail) {
        console.log('Non-Braze email rejected:', user.email)
        return redirect('/login?error=invalid_domain&email=' + encodeURIComponent(user.email))
      }

      // Create session token
      const sessionToken = simpleAuth.createSessionToken(user)
      console.log('Session token created, length:', sessionToken.length)
      
      console.log('=== Login Successful ===')
      console.log('User:', user.email)
      console.log('Redirecting to home page...')

      // Set session cookie and redirect to home
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/?login=success',
          'Set-Cookie': `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`
        }
      })

    } catch (tokenError) {
      console.error('Token exchange or user info error:', tokenError)
      return redirect('/login?error=token_exchange_failed&details=' + encodeURIComponent(tokenError instanceof Error ? tokenError.message : 'Unknown token error'))
    }

  } catch (error) {
    console.error('=== OAuth Callback Fatal Error ===', error)
    return redirect('/login?error=callback_failed&details=' + encodeURIComponent(error instanceof Error ? error.message : 'Unknown callback error'))
  }
} 