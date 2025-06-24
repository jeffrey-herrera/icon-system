import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

// Create database with proper error handling for serverless environments
function createDatabase() {
  try {
    // Try to create/open the database file
    const db = new Database("auth.db")
    
    // Enable WAL mode for better concurrency (if supported)
    try {
      db.exec("PRAGMA journal_mode = WAL;")
    } catch (e) {
      console.warn("WAL mode not supported, using default journal mode")
    }
    
    return db
  } catch (error) {
    console.warn("Failed to create file-based database, falling back to in-memory:", error)
    // Fallback to in-memory database for serverless environments
    return new Database(":memory:")
  }
}

// Helper function to get environment variables from both contexts
function getEnvVar(name: string, fallback = ""): string {
  return process.env[name] || (import.meta.env && import.meta.env[name]) || fallback
}

export const auth = betterAuth({
  baseURL: getEnvVar("BETTER_AUTH_URL", "http://localhost:4321"),
  secret: getEnvVar("BETTER_AUTH_SECRET", "fallback-secret-key-for-development-only"),
  
  database: createDatabase(),
  
  emailAndPassword: {
    enabled: false,
  },
  
  socialProviders: {
    google: {
      clientId: getEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
      redirectURI: `${getEnvVar("BETTER_AUTH_URL", "http://localhost:4321")}/api/auth/callback/google`,
      // Add additional configuration for better error handling
      scope: ["openid", "email", "profile"],
    },
  },
  
  user: {
    additionalFields: {
      emailVerified: {
        type: "boolean",
        required: false,
      },
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      console.log("Sign in attempt:", { user: user.email, provider: account?.providerId })
      
      // Check if email is from @braze.com domain
      if (!user.email?.endsWith("@braze.com")) {
        console.log("Sign in rejected: email not from @braze.com domain")
        throw new Error("Only @braze.com email addresses are allowed")
      }
      
      console.log("Sign in approved for:", user.email)
      return true
    },
    async signUp({ user }: { user: any }) {
      console.log("Sign up attempt:", { user: user.email })
      
      // Check if email is from @braze.com domain
      if (!user.email?.endsWith("@braze.com")) {
        console.log("Sign up rejected: email not from @braze.com domain")
        throw new Error("Only @braze.com email addresses are allowed")
      }
      
      console.log("Sign up approved for:", user.email)
      return true
    },
  },
}) 