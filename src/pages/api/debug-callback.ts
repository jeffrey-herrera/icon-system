import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url)
    
    // Capture all the callback data
    const debugData = {
      fullUrl: request.url,
      origin: url.origin,
      pathname: url.pathname,
      searchParams: Object.fromEntries(url.searchParams.entries()),
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString()
    }
    
    return new Response(JSON.stringify(debugData, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Debug callback failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
} 