import type { APIRoute } from "astro"
import { simpleAuth } from "../../../lib/simple-auth"

export const prerender = false

// Force redeploy - 2025-06-25 02:15
export const GET: APIRoute = async () => {
  try {
    console.log('Login initiation requested')
    
    // Generate Google OAuth URL
    const authUrl = simpleAuth.getGoogleAuthUrl()
    
    console.log('Redirecting to Google OAuth:', authUrl)
    
    // Redirect to Google OAuth
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl,
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Login initiation error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to initiate login',
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