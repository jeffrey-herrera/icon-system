import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const { auth } = await import("../../lib/auth")
    
    // Test various auth endpoints
    const testUrls = [
      '/api/auth/session',
      '/api/auth/sign-in/social',
      '/api/auth/callback/google',
      '/api/auth/sign-out'
    ]
    
    return new Response(JSON.stringify({
      success: true,
      message: "Auth routes test",
      availableRoutes: testUrls,
      authHandler: typeof auth.handler,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Auth routes test error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
} 