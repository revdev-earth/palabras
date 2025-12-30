"use server"

import { auth } from "+/lib/auth"
import { prisma } from "+/lib/prisma"
import type { PracticeDateFilter, Settings, SortBy } from "+/types"
import type { WordEntry } from "+/redux/slices/wordsSlice"
import type { TextHistoryItem } from "+/redux/slices/recognitionSlice"
import { defaultSettings } from "+/utils"

const sortByValues: SortBy[] = [
  "score",
  "scoreAsc",
  "lastPracticedAt",
  "lastPracticedAtAsc",
  "createdAt",
  "createdAtAsc",
  "term",
  "termDesc",
  "translation",
  "translationDesc",
  "notes",
  "notesDesc",
]
const practiceDateValues: PracticeDateFilter[] = [
  "any",
  "today",
  "yesterday",
  "last3",
  "last7",
  "older7",
  "never",
]

const coerceSortBy = (value: string | null | undefined): SortBy =>
  sortByValues.includes(value as SortBy) ? (value as SortBy) : defaultSettings.sortBy

const coercePracticeDate = (value: string | null | undefined): PracticeDateFilter =>
  practiceDateValues.includes(value as PracticeDateFilter)
    ? (value as PracticeDateFilter)
    : defaultSettings.practiceDateFilter

const normalizeWordList = (raw: unknown): WordEntry[] => {
  if (!Array.isArray(raw)) return []
  return raw.filter((entry): entry is WordEntry => Boolean(entry && typeof entry === "object"))
}

export const getUserSyncPayload = async () => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const [settings, progress, user, recognitionState] = await Promise.all([
    prisma.settings.findUnique({ where: { userId } }),
    prisma.wordProgress.findUnique({ where: { id: userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        canUploadWords: true,
      },
    }),
    prisma.textRecognition.findUnique({
      where: { userId },
      select: { recognitionText: true, textHistory: true },
    }),
  ])
  if (!user) return null

  const words = normalizeWordList(progress?.terms)

  const mappedSettings: Settings = {
    ...defaultSettings,
    ...settings,
    sortBy: coerceSortBy(settings?.sortBy ?? null),
    practiceDateFilter: coercePracticeDate(settings?.practiceDateFilter ?? null),
    practiceScoreBuckets: Array.isArray(settings?.practiceScoreBuckets)
      ? (settings?.practiceScoreBuckets as Settings["practiceScoreBuckets"])
      : defaultSettings.practiceScoreBuckets,
  }

  const textHistory = Array.isArray(recognitionState?.textHistory)
    ? (recognitionState?.textHistory as TextHistoryItem[])
    : []

  return {
    user,
    words,
    settings: mappedSettings,
    recognition: {
      recognitionText: recognitionState?.recognitionText ?? null,
      textHistory,
    },
  }
}

export const syncWordProgress = async (words: WordEntry[]) => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return

  await prisma.wordProgress.upsert({
    where: { id: userId },
    create: {
      id: userId,
      userId,
      terms: words,
    },
    update: {
      terms: words,
    },
  })
}

export const syncSettings = async (nextSettings: Settings) => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return

  await prisma.settings.upsert({
    where: { userId },
    create: {
      userId,
      ...nextSettings,
    },
    update: {
      ...nextSettings,
    },
  })
}

export const syncRecognitionState = async (payload: {
  recognitionText: string
  textHistory: TextHistoryItem[]
}) => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return

  await prisma.textRecognition.upsert({
    where: { userId },
    create: {
      userId,
      recognitionText: payload.recognitionText,
      textHistory: payload.textHistory,
    },
    update: {
      recognitionText: payload.recognitionText,
      textHistory: payload.textHistory,
    },
  })
}
