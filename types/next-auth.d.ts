import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      role: string
      id: string
      apiToken?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    accessKey?: string | null
    apiToken?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
    apiToken?: string
  }
}
