import { defineMiddleware } from "astro:middleware"
import { auth } from "./lib/auth"

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/api/", "/test-auth"]

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip auth check for public routes
  if (PUBLIC_ROUTES.some(route => context.url.pathname.startsWith(route))) {
    return next()
  }

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: context.request.headers,
  })

  // If no session or user doesn't have @braze.com email, redirect to login
  if (!session?.user || !session.user.email?.endsWith('@braze.com')) {
    return context.redirect('/login')
  }

  // Add user data to locals for use in pages
  context.locals.user = session.user
  context.locals.session = session.session

  return next()
}) 