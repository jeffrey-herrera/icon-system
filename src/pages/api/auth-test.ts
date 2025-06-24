import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const { auth } = await import("../../lib/auth")
    return new Response(JSON.stringify({
      message: "Auth module loaded successfully",
      hasHandler: typeof auth.handler === 'function'
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      message: "Failed to load auth module",
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
} 