import { auth } from "../../../lib/auth"
import type { APIRoute } from "astro"

export const prerender = false

export const ALL: APIRoute = async (ctx) => {
  try {
    console.log('Auth handler called:', ctx.request.method, ctx.request.url)
    const result = await auth.handler(ctx.request)
    console.log('Auth handler result:', result.status)
    return result
  } catch (error) {
    console.error('Auth handler error:', error)
    return new Response(JSON.stringify({ error: 'Auth handler failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
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