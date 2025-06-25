import type { APIRoute } from "astro"
import { simpleAuth } from "../../lib/simple-auth"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    // Get the OAuth URL that would be generated
    const oauthUrl = simpleAuth.getGoogleAuthUrl()
    
    // Parse it to see the redirect_uri
    const url = new URL(oauthUrl)
    const redirectUri = url.searchParams.get('redirect_uri')
    
    return new Response(JSON.stringify({
      success: true,
      oauthUrl: oauthUrl,
      redirectUri: redirectUri,
      envBetterAuthUrl: process.env.BETTER_AUTH_URL,
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Debug OAuth URL failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
} 