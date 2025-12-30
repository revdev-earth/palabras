import bcrypt from "bcryptjs"
import { prisma } from "+/lib/prisma"
import memory from "../la memoria"

type RawWord = {
  id: string
  term: string
  translation: string
  notes?: string
  context?: unknown
  contextForPractice?: unknown
  baseScore?: number
  lastPracticedAt?: string | null
  createdAt?: string
}

type NormalizedWord = {
  id: string
  term: string
  translation: string
  notes: string
  context: string[]
  contextForPractice: string[]
  baseScore: number
  lastPracticedAt: string | null
  createdAt: string
}

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (typeof value === "string")
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  return []
}

const normalizeWord = (word: RawWord): NormalizedWord => {
  const createdAt = word.createdAt ? new Date(word.createdAt) : new Date()
  return {
    id: String(word.id),
    term: String(word.term ?? ""),
    translation: String(word.translation ?? ""),
    notes: String(word.notes ?? ""),
    context: normalizeList(word.context),
    contextForPractice: normalizeList(word.contextForPractice),
    baseScore: Number.isFinite(word.baseScore) ? Math.round(word.baseScore as number) : 0,
    lastPracticedAt: word.lastPracticedAt ? new Date(word.lastPracticedAt).toISOString() : null,
    createdAt: createdAt.toISOString(),
  }
}

const memoryWords = (memory as RawWord[]).map(normalizeWord)

const settingsDefaults = {
  sortBy: "scoreAsc",
  lastSeenDay: new Date().toISOString().slice(0, 10),
  practiceRounds: 5,
  practiceCount: 10,
  practiceScoreBuckets: [],
  practiceDateFilter: "any",
  practiceSpeakEnabled: false,
  practiceVoiceId: "",
  practiceVoiceLang: "de",
  practiceVoiceRate: 0.95,
}

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
      canUploadWords: true,
    },
    {
      email: "shr@shr.shr",
      password: hashedPassword,
      name: "Shr",
      lastName: "Shr",
      emailVerified: new Date(),
      canUploadWords: true,
    },
    {
      email: "was@was.was",
      password: hashedPassword,
      name: "Was",
      lastName: "Was",
      emailVerified: new Date(),
      canUploadWords: true,
    },
  ]

  const seededUsers = []

  for (const user of users) {
    const seeded = await prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: user,
    })
    seededUsers.push(seeded)
  }

  const now = new Date()
  await prisma.words.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      terms: memoryWords,
      createdAt: now,
    },
    update: {
      terms: memoryWords,
    },
  })

  for (const user of seededUsers) {
    await prisma.settings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...settingsDefaults,
      },
      update: {
        ...settingsDefaults,
      },
    })

    await prisma.wordProgress.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        userId: user.id,
        terms: memoryWords,
      },
      update: {
        terms: memoryWords,
      },
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
