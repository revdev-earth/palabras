import bcrypt from "bcryptjs"
import { prisma } from "+/lib/prisma"

const seedUsers = async () => {
  const seedPassword = process.env.SEED_PASSWORD ?? "password123"
  const hashedPassword = await bcrypt.hash(seedPassword, 10)

  const users = [
    {
      email: "sir@sir.sir",
      password: hashedPassword,
      name: "Sir",
      lastName: "Sir",
      emailVerified: new Date(),
    },
    {
      email: "shr@shr.shr",
      password: hashedPassword,
      name: "Shr",
      lastName: "Shr",
      emailVerified: new Date(),
    },
    {
      email: "was@was.was",
      password: hashedPassword,
      name: "Was",
      lastName: "Was",
      emailVerified: new Date(),
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: user,
    })
  }
}

seedUsers()
  .then(() => {
    console.log("✅ Seed completo")
  })
  .catch((error) => {
    console.error("❌ Error en seed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
