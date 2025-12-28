import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
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
  context?: Prisma.InputJsonValue
  contextForPractice?: Prisma.InputJsonValue
  baseScore: number
  lastPracticedAt: Date | null
  createdAt: Date
}

const toJsonInput = (value: unknown): Prisma.InputJsonValue | undefined => {
  if (value === null || value === undefined) return undefined
  return value as Prisma.InputJsonValue
}

const normalizeWord = (word: RawWord): NormalizedWord => {
  const createdAt = word.createdAt ? new Date(word.createdAt) : new Date()
  return {
    id: String(word.id),
    term: String(word.term ?? ""),
    translation: String(word.translation ?? ""),
    notes: String(word.notes ?? ""),
    context: toJsonInput(Array.isArray(word.context) ? word.context : word.context ?? []),
    contextForPractice: toJsonInput(
      Array.isArray(word.contextForPractice) ? word.contextForPractice : word.contextForPractice ?? []
    ),
    baseScore: Number.isFinite(word.baseScore) ? Math.round(word.baseScore as number) : 0,
    lastPracticedAt: word.lastPracticedAt ? new Date(word.lastPracticedAt) : null,
    createdAt,
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

  for (const word of memoryWords) {
    await prisma.wordLibrary.upsert({
      where: { id: word.id },
      create: {
        id: word.id,
        term: word.term,
        translation: word.translation,
        notes: word.notes,
        context: word.context,
        contextForPractice: word.contextForPractice,
        createdAt: word.createdAt,
      },
      update: {
        term: word.term,
        translation: word.translation,
        notes: word.notes,
        context: word.context,
        contextForPractice: word.contextForPractice,
        createdAt: word.createdAt,
      },
    })
  }

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

    for (const word of memoryWords) {
      await prisma.wordProgress.upsert({
        where: {
          userId_wordId: {
            userId: user.id,
            wordId: word.id,
          },
        },
        create: {
          userId: user.id,
          wordId: word.id,
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
          createdAt: word.createdAt,
        },
        update: {
          baseScore: word.baseScore,
          lastPracticedAt: word.lastPracticedAt,
        },
      })
    }
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
