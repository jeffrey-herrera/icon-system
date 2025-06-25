import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const { auth } = await import("../../lib/auth")
    
    // Test if we can access auth methods
    const authMethods = Object.keys(auth)
    
    return new Response(JSON.stringify({
      success: true,
      message: "Auth test endpoint working",
      authMethods: authMethods,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Auth test error:', error)
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