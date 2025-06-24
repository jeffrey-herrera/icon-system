import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

export const auth = betterAuth({
  baseURL: import.meta.env.BETTER_AUTH_URL || "http://localhost:4321",
  secret: import.meta.env.BETTER_AUTH_SECRET || "fallback-secret-key-for-development-only",
  
  database: new Database("./auth.db"),
  
  socialProviders: {
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID || "",
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  
  callbacks: {
    user: {
      create: {
        before: async (user: any) => {
          // Only allow @braze.com emails
          if (!user.email?.endsWith('@braze.com')) {
            throw new Error('Only @braze.com email addresses are allowed')
          }
          return user
        }
      }
    }
  }
}) 