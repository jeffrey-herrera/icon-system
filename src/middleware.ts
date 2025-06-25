import { defineMiddleware } from "astro:middleware"
import { simpleAuth } from "./lib/simple-auth"

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/api/"]

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip auth check for public routes
  if (PUBLIC_ROUTES.some(route => context.url.pathname.startsWith(route))) {
    return next()
  }

  // Check if user is authenticated using our simple auth system
  const sessionCookie = context.cookies.get('session')?.value
  
  if (!sessionCookie) {
    console.log('No session cookie found, redirecting to login')
    return context.redirect('/login')
  }

  // Verify the session token
  const user = simpleAuth.verifySessionToken(sessionCookie)
  
  if (!user) {
    console.log('Invalid session token, redirecting to login')
    return context.redirect('/login')
  }

  // Verify it's a @braze.com email (double-check)
  if (!user.email?.endsWith('@braze.com')) {
    console.log('Non-Braze email in session, redirecting to login')
    return context.redirect('/login')
  }

  console.log('Valid session found for user:', user.email)

  // Add user data to locals for use in pages
  context.locals.user = user
  context.locals.session = { user }

  return next()
}) 