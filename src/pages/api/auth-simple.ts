import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    // Test basic Better Auth import
    const { auth } = await import("../../lib/auth")
    
    return new Response(JSON.stringify({
      success: true,
      message: "Better Auth loaded successfully",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error('Auth simple test error:', error)
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