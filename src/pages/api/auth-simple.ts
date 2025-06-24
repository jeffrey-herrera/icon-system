import type { APIRoute } from "astro"
import { auth } from "../../lib/auth"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    // Try to get session without headers first
    const session = await auth.api.getSession({
      headers: new Headers()
    })
    
    return new Response(JSON.stringify({
      message: "Auth API working",
      session: session ? "Session found" : "No session"
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      message: "Auth API error",
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
} 