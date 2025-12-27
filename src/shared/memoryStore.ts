import type { WordEntry } from "+/redux/slices/wordsSlice"

import rawMemory from "../../la memoria"

type MemoryEntry = {
  id?: string
  term?: string
  translation?: string
  notes?: string
  context?: string[]
  contextForPractice?: string[]
  baseScore?: number
  lastPracticedAt?: string | null
  createdAt?: string
}

const normalizeEntry = (entry: MemoryEntry): WordEntry | null => {
  const term = (entry.term || "").trim()
  const translation = (entry.translation || "").trim()
  if (!term || !translation) return null
  return {
    id: entry.id || `mem-${term.toLowerCase().replace(/\s+/g, "-")}`,
    term,
    translation,
    notes: entry.notes || "",
    context: Array.isArray(entry.context) ? entry.context : [],
    contextForPractice: Array.isArray(entry.contextForPractice)
      ? entry.contextForPractice
      : [],
    baseScore: typeof entry.baseScore === "number" ? entry.baseScore : 0,
    lastPracticedAt: entry.lastPracticedAt ?? null,
    createdAt: entry.createdAt || new Date().toISOString(),
  }
}

let memoryCache: WordEntry[] | null = null

export const getMemoryWords = (): WordEntry[] => {
  if (memoryCache) return memoryCache
  const normalized = (rawMemory as MemoryEntry[])
    .map(normalizeEntry)
    .filter((entry): entry is WordEntry => Boolean(entry))
  memoryCache = normalized
  return memoryCache
}

export const setMemoryWords = (words: WordEntry[]) => {
  memoryCache = words
}
