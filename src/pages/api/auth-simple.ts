import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    // Test basic Better Auth import
    const { auth } = await import("../../lib/auth")
    
    // Test if we can make a simple auth request
    let sessionTest = "Not tested"
    try {
      // Create a test request to the session endpoint
      const testRequest = new Request("https://example.com/api/auth/session", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      
      const sessionResponse = await auth.handler(testRequest)
      sessionTest = `Session test: ${sessionResponse.status}`
    } catch (sessionError) {
      sessionTest = `Session error: ${sessionError instanceof Error ? sessionError.message : 'Unknown'}`
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Better Auth loaded successfully",
      timestamp: new Date().toISOString(),
      deploymentTime: "2025-06-25T01:50:00Z", // Force fresh deployment
      environment: process.env.NODE_ENV,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
      authTest: sessionTest,
      betterAuthUrl: process.env.BETTER_AUTH_URL,
      publicBetterAuthUrl: process.env.PUBLIC_BETTER_AUTH_URL,
      allPublicEnvVars: Object.keys(process.env).filter(key => key.startsWith('PUBLIC_')),
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