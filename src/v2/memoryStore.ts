import type { V2Word } from "+/redux/slices/v2Slice"

import rawMemory from "../../la memoria/memoria"

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

const MEMORY_LOCAL_KEY = "vocab-tracker-memory"

const normalizeEntry = (entry: MemoryEntry): V2Word | null => {
  const term = (entry.term || "").trim()
  const translation = (entry.translation || "").trim()
  if (!term || !translation) return null
  return {
    id: entry.id || `mem-${term.toLowerCase().replace(/\s+/g, "-")}`,
    term,
    translation,
    notes: entry.notes || "",
    context: Array.isArray(entry.context) ? entry.context : [],
    contextForPractice: Array.isArray(entry.contextForPractice) ? entry.contextForPractice : [],
    baseScore: typeof entry.baseScore === "number" ? entry.baseScore : 0,
    lastPracticedAt: entry.lastPracticedAt ?? null,
    createdAt: entry.createdAt || new Date().toISOString(),
  }
}

const loadFromLocalStorage = (): V2Word[] | null => {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(MEMORY_LOCAL_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as V2Word[]
  } catch {
    return null
  }
}

let memoryCache: V2Word[] | null = null

export const getMemoryWords = (): V2Word[] => {
  if (memoryCache) return memoryCache
  const fromStorage = loadFromLocalStorage()
  if (fromStorage && Array.isArray(fromStorage)) {
    memoryCache = fromStorage
    return memoryCache
  }
  const normalized = (rawMemory as MemoryEntry[])
    .map(normalizeEntry)
    .filter((entry): entry is V2Word => Boolean(entry))
  memoryCache = normalized
  return memoryCache
}

export const setMemoryWords = (words: V2Word[]) => {
  memoryCache = words
  if (typeof window === "undefined") return
  window.localStorage.setItem(MEMORY_LOCAL_KEY, JSON.stringify(words))
}
