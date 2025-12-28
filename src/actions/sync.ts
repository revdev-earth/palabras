"use server"

import { Prisma } from "@prisma/client"

import { auth } from "+/lib/auth"
import { prisma } from "+/lib/prisma"
import type { PracticeDateFilter, Settings, SortBy } from "+/types"
import type { WordEntry } from "+/redux/slices/wordsSlice"
import type { TextHistoryItem } from "+/redux/slices/recognitionSlice"
import { defaultSettings } from "+/utils"

type WordProgressInput = {
  id: string
  baseScore: number
  lastPracticedAt: string | null
}

const toStringArray = (value: Prisma.JsonValue | null | undefined): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []

const toIso = (value: Date | null) => (value ? value.toISOString() : null)
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

export const getUserSyncPayload = async () => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return null

  const [settings, progresses, user, recognitionState] = await Promise.all([
    prisma.settings.findUnique({ where: { userId } }),
    prisma.wordProgress.findMany({
      where: { userId },
      include: { word: true },
    }),
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

  const words: WordEntry[] = progresses.map((progress) => ({
    id: progress.wordId,
    term: progress.word.term,
    translation: progress.word.translation,
    notes: progress.word.notes,
    context: toStringArray(progress.word.context as Prisma.JsonValue | null | undefined),
    contextForPractice: toStringArray(
      progress.word.contextForPractice as Prisma.JsonValue | null | undefined
    ),
    baseScore: progress.baseScore,
    lastPracticedAt: toIso(progress.lastPracticedAt),
    createdAt: progress.word.createdAt.toISOString(),
  }))

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

export const syncWordLibrary = async (words: WordEntry[]) => {
  if (!words.length) return
  const session = await auth()
  if (!session?.user?.id) return
  await Promise.all(
    words.map((word) =>
      prisma.wordLibrary.upsert({
        where: { id: word.id },
        create: {
          id: word.id,
          term: word.term,
          translation: word.translation,
          notes: word.notes,
          context: word.context,
          contextForPractice: word.contextForPractice,
          createdAt: new Date(word.createdAt),
        },
        update: {
          term: word.term,
          translation: word.translation,
          notes: word.notes,
          context: word.context,
          contextForPractice: word.contextForPractice,
        },
      })
    )
  )
}

export const syncWordProgress = async (changes: WordProgressInput[]) => {
  if (!changes.length) return
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return

  await Promise.all(
    changes.map((change) =>
      prisma.wordProgress.upsert({
        where: { userId_wordId: { userId, wordId: change.id } },
        create: {
          userId,
          wordId: change.id,
          baseScore: change.baseScore,
          lastPracticedAt: change.lastPracticedAt ? new Date(change.lastPracticedAt) : null,
        },
        update: {
          baseScore: change.baseScore,
          lastPracticedAt: change.lastPracticedAt ? new Date(change.lastPracticedAt) : null,
        },
      })
    )
  )
}

export const deleteWordLibrary = async (ids: string[]) => {
  if (!ids.length) return
  const session = await auth()
  if (!session?.user?.id) return
  await prisma.wordLibrary.deleteMany({ where: { id: { in: ids } } })
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
