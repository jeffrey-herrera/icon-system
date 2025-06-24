import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: "Debug endpoint working",
    env: {
      BETTER_AUTH_URL: import.meta.env.BETTER_AUTH_URL,
      GOOGLE_CLIENT_ID: import.meta.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
      GOOGLE_CLIENT_SECRET: import.meta.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
      BETTER_AUTH_SECRET: import.meta.env.BETTER_AUTH_SECRET ? "Set" : "Not set"
    }
  }, null, 2), {
    headers: {
      "Content-Type": "application/json"
    }
  })
} 