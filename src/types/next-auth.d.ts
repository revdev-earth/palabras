import "next-auth"
import "next-auth/jwt"

type UserRoleForAuth = "admin" | "tenant"

declare module "next-auth" {
  interface Session {
    user?: {
      id: string
      name?: string | null
      lastName?: string | null
      email?: string | null
      role?: UserRoleForAuth
      adminLevel?: string
    }
  }

  interface User {
    role?: UserRoleForAuth
    adminLevel?: string
    lastName?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRoleForAuth
    adminLevel?: string
  }
}
