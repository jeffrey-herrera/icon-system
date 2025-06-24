import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_BETTER_AUTH_URL || "http://localhost:4321"
})

export const { signIn, signOut, useSession } = authClient 