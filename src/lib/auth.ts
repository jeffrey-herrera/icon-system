import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

// Handle database in serverless environment
const getDatabase = () => {
  try {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
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

// Helper function to get environment variables from both contexts
function getEnvVar(name: string, fallback = ""): string {
  return process.env[name] || (import.meta.env && import.meta.env[name]) || fallback
}

export const auth = betterAuth({
  baseURL: getEnvVar("BETTER_AUTH_URL", "http://localhost:4321"),
  secret: getEnvVar("BETTER_AUTH_SECRET", "fallback-secret-key-for-development-only"),
  
  database: getDatabase(),
  
  emailAndPassword: {
    enabled: false,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${getEnvVar("BETTER_AUTH_URL", "http://localhost:4321")}/api/auth/callback/google`,
      // Add additional configuration for better error handling
      scope: ["openid", "email", "profile"],
    },
  },
  
  user: {
    additionalFields: {
      emailVerified: {
        type: "boolean",
        defaultValue: false
      },
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: true,
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  
  // Add CORS configuration
  cors: {
    origin: true, // Allow all origins in development, you can restrict this in production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  },
  
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      console.log("Sign in attempt:", { user: user.email, provider: account?.provider })
      
      // Only allow @braze.com emails
      if (!user.email?.endsWith('@braze.com')) {
        console.log('Rejected non-Braze email:', user.email)
        throw new Error('Only @braze.com email addresses are allowed')
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