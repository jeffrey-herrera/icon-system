import type { APIRoute } from "astro"
import { simpleAuth } from "../../../lib/simple-auth"

export const prerender = false

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    console.log('OAuth callback called:', { code: !!code, error })

    // Handle OAuth error
    if (error) {
      console.log('OAuth error:', error)
      return redirect('/login?error=oauth_error')
    }

    // Handle missing code
    if (!code) {
      console.log('No authorization code received')
      return redirect('/login?error=no_code')
    }

    // Exchange code for tokens
    console.log('Exchanging code for tokens...')
    const tokens = await simpleAuth.exchangeCodeForTokens(code)
    
    // Get user info
    console.log('Getting user info...')
    const user = await simpleAuth.getGoogleUser(tokens.access_token)
    
    // Validate Braze email
    if (!simpleAuth.validateBrazeEmail(user.email)) {
      console.log('Non-Braze email rejected:', user.email)
      return redirect('/login?error=invalid_domain')
    }

    // Create session token
    const sessionToken = simpleAuth.createSessionToken(user)
    
    console.log('Login successful for:', user.email)

    // Set session cookie and redirect to home
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/',
        'Set-Cookie': `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`
      }
    })

  } catch (error) {
    console.error('OAuth callback error:', error)
    return redirect('/login?error=callback_failed')
  }
} 