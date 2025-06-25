import type { APIRoute } from 'astro'
import { auth } from '../../lib/auth'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({ 
      headers: request.headers 
    })

    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      hasSession: !!session,
      sessionData: session ? {
        userId: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        sessionId: session.session?.id,
        expiresAt: session.session?.expiresAt
      } : null,
      cookies: request.headers.get('cookie') || 'No cookies',
      userAgent: request.headers.get('user-agent') || 'Unknown'
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to get session',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
} 