"use server"

import { prisma } from "+/lib/prisma"

export const getUserAfterLogin = async ({ email }: { email: string }) => {
  if (!email) return null
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        canUploadWords: true,
      },
    })
    if (!user) return null
    return user
  } catch (error) {
    console.error("Error getting user after login:", error)
    return null
  }
}
