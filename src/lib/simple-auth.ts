// Simple Google OAuth implementation for Vercel serverless
export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
}

export class SimpleAuth {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || ''
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
    this.redirectUri = `${process.env.BETTER_AUTH_URL || 'http://localhost:4321'}/api/auth/callback`
  }

  // Generate Google OAuth URL
  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // Exchange code for tokens
  async exchangeCodeForTokens(code: string): Promise<{ access_token: string; id_token: string }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Get user info from Google
  async getGoogleUser(accessToken: string): Promise<GoogleUser> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`)
    }

    return response.json()
  }

  // Validate user email domain
  validateBrazeEmail(email: string): boolean {
    return email.endsWith('@braze.com')
  }

  // Create session token (simple JWT-like)
  createSessionToken(user: GoogleUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }

    // Simple base64 encoding (for demo - in production use proper JWT)
    return btoa(JSON.stringify(payload))
  }

  // Verify session token
  verifySessionToken(token: string): GoogleUser | null {
    try {
      const payload = JSON.parse(atob(token))
      
      // Check if token is expired
      if (payload.exp < Date.now()) {
        return null
      }

      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    } catch {
      return null
    }
  }
}

export const simpleAuth = new SimpleAuth() 