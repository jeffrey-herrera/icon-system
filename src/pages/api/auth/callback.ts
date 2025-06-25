import type { APIRoute } from "astro"
import { simpleAuth } from "../../../lib/simple-auth"

export const prerender = false

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    // Handle OAuth error
    if (error) {
      console.log('OAuth error:', error)
      return redirect('/login?error=oauth_error&details=' + encodeURIComponent(error))
    }

    // Handle missing code
    if (!code) {
      console.log('No authorization code received')
      return redirect('/login?error=no_code')
    }

    try {
      // Exchange code for tokens
      const tokens = await simpleAuth.exchangeCodeForTokens(code)
      
      // Get user info from Google
      const user = await simpleAuth.getGoogleUser(tokens.access_token)
      
      // Validate Braze email domain
      if (!simpleAuth.validateBrazeEmail(user.email)) {
        console.log('Non-Braze email rejected:', user.email)
        return redirect('/login?error=invalid_domain&email=' + encodeURIComponent(user.email))
      }

      // Create session token
      const sessionToken = simpleAuth.createSessionToken(user)
      
      console.log('Login successful for user:', user.email)

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
    console.error('OAuth callback error:', error)
    return redirect('/login?error=callback_failed&details=' + encodeURIComponent(error instanceof Error ? error.message : 'Unknown callback error'))
  }
} 