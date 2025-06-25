import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: "Hello from Vercel!",
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'unknown'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} 