import { SearchField, Settings, Word } from "./types"

export const STORE_KEY = "vocab-tracker-v1"
export const SETTINGS_KEY = "vocab-tracker-settings"
export const DECAY_INTERVAL_DAYS = 2

export const todayKey = () => new Date().toISOString().slice(0, 10)
export const nowISO = () => new Date().toISOString()

export const defaultSettings: Settings = {
  sortBy: "scoreAsc",
  lastSeenDay: todayKey(),
  practiceRounds: 5,
  practiceCount: 10,
  practiceScoreBuckets: [],
  practiceDateFilter: "any",
}

export const safeParse = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const daysBetween = (aISO: string, bISO: string) => {
  const a = new Date(aISO).setHours(0, 0, 0, 0)
  const b = new Date(bISO).setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((a - b) / 86400000))
}

export const effectiveScore = (word: Word) => {
  if (!word.lastPracticedAt) return word.baseScore || 0
  const d = daysBetween(new Date().toISOString(), word.lastPracticedAt)
  const decaySteps = Math.floor(d / DECAY_INTERVAL_DAYS) // 1 punto cada 2 días completos
  return Math.max(0, (word.baseScore || 0) - decaySteps)
}

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        dateStyle: "short",
      })
    : "—"

export const shuffle = <T>(arr: T[]) => {
  const c = [...arr]
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[c[i], c[j]] = [c[j], c[i]]
  }
  return c
}

export const breakAdjDuplicates = (ids: string[]) => {
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === ids[i - 1]) {
      let j = i + 1
      while (j < ids.length && ids[j] === ids[i]) j++
      if (j < ids.length) {
        ;[ids[i], ids[j]] = [ids[j], ids[i]]
      }
    }
  }
  return ids
}

export const sampleWords = (arr: Word[], n: number) => {
  if (arr.length <= n) return [...arr]
  const c = [...arr]
  shuffle(c)
  return c.slice(0, n)
}

export const filterAndSortWords = (
  words: Word[],
  search: string,
  sortBy: Settings["sortBy"],
  searchField: SearchField
) => {
  const q = search.trim().toLowerCase()
  const data = words.filter(
    (w) =>
      !q ||
      (searchField === "term" && w.term.toLowerCase().includes(q)) ||
      (searchField === "translation" && w.translation.toLowerCase().includes(q))
  )

  data.sort((a, b) => {
    if (sortBy === "score") return effectiveScore(b) - effectiveScore(a)
    if (sortBy === "scoreAsc") return effectiveScore(a) - effectiveScore(b)
    if (sortBy === "lastPracticedAt")
      return new Date(b.lastPracticedAt || 0).getTime() - new Date(a.lastPracticedAt || 0).getTime()
    if (sortBy === "lastPracticedAtAsc")
      return new Date(a.lastPracticedAt || 0).getTime() - new Date(b.lastPracticedAt || 0).getTime()
    if (sortBy === "createdAt")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "createdAtAsc")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    if (sortBy === "term") return a.term.localeCompare(b.term)
    if (sortBy === "termDesc") return b.term.localeCompare(a.term)
    if (sortBy === "translation") return a.translation.localeCompare(b.translation)
    if (sortBy === "translationDesc") return b.translation.localeCompare(a.translation)
    if (sortBy === "notes") return (a.notes || "").localeCompare(b.notes || "")
    if (sortBy === "notesDesc") return (b.notes || "").localeCompare(a.notes || "")
    return 0
  })
  return data
}

export const buildQueue = (ids: string[], rounds: number) => {
  const reps = Math.max(1, Math.floor(rounds) || 1)
  const queue: string[] = []
  for (let i = 0; i < reps; i++) {
    const round = shuffle([...ids])
    queue.push(...round)
  }
  return breakAdjDuplicates(queue)
}

export const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
