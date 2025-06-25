import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

// Get environment variables with proper fallbacks
const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || import.meta.env[key]
  if (!value && !fallback) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || fallback!
}

// Handle database in serverless environment
const getDatabase = () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production (Vercel), create an in-memory database
      console.log('Creating in-memory database for serverless environment')
      return new Database(':memory:')
    } else {
      // In development, use file-based database
      console.log('Using file-based database for development')
      return new Database("./auth.db")
    }
  } catch (error) {
    console.error('Database creation error:', error)
    // Fallback to in-memory database
    return new Database(':memory:')
  }
}

export const auth = betterAuth({
  database: getDatabase(),
  secret: getEnvVar("BETTER_AUTH_SECRET", "fallback-secret-key-for-development-only"),
  
  emailAndPassword: {
    enabled: false
  },
  
  socialProviders: {
    google: {
      clientId: getEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
    }
  },
  
  user: {
    additionalFields: {
      emailVerified: {
        type: "boolean",
        defaultValue: false
      }
    }
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  advanced: {
    generateId: () => crypto.randomUUID(),
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      console.log('Sign in attempt:', { user: user.email, provider: account?.provider })
      
      // Only allow @braze.com emails
      if (!user.email?.endsWith('@braze.com')) {
        console.log('Rejected non-Braze email:', user.email)
        throw new Error('Only @braze.com email addresses are allowed')
      }
      
      console.log('Approved Braze email:', user.email)
      return true
    }
  }
}) 