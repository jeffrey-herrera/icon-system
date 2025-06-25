import { createAuthClient } from "better-auth/client"

// Get the base URL for the client
const getBaseURL = () => {
  // In browser, use current origin if no public env var is set
  if (typeof window !== 'undefined') {
    return import.meta.env.PUBLIC_BETTER_AUTH_URL || window.location.origin
  }
  // Fallback for SSR
  return import.meta.env.PUBLIC_BETTER_AUTH_URL || "http://localhost:4321"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})

export const { signIn, signOut, useSession } = authClient 