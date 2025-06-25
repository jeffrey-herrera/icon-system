import { auth } from "../../../lib/auth"
import type { APIRoute } from "astro"

export const prerender = false

export const ALL: APIRoute = async (ctx) => {
  try {
    console.log('Auth handler called:', ctx.request.method, ctx.request.url)
    
    // Pass the original request directly to Better Auth
    // Don't try to clone it as that causes duplex issues
    const result = await auth.handler(ctx.request)
    console.log('Auth handler result:', result.status)
    return result
  } catch (error) {
    console.error('Auth handler error:', error)
    return new Response(JSON.stringify({ 
      error: 'Auth handler failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      url: ctx.request.url,
      method: ctx.request.method
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}

// Export individual methods for better compatibility
export const GET: APIRoute = ALL
export const POST: APIRoute = ALL
export const PUT: APIRoute = ALL
export const DELETE: APIRoute = ALL
export const PATCH: APIRoute = ALL
export const OPTIONS: APIRoute = ALL 