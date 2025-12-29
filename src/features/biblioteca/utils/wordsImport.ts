import type { WordEntry } from "+/redux/slices/wordsSlice"

import { genId, nowISO } from "+/utils"

const normalizeList = (raw: unknown) => {
  if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean)
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export const normalizeWord = (raw: unknown): WordEntry | null => {
  if (!raw || typeof raw !== "object") return null
  const obj = raw as Partial<WordEntry>
  const term = typeof obj.term === "string" ? obj.term.trim() : ""
  const translation = typeof obj.translation === "string" ? obj.translation.trim() : ""
  if (!term || !translation) return null
  const notes = typeof obj.notes === "string" ? obj.notes : ""
  const baseScore =
    typeof obj.baseScore === "number" && Number.isFinite(obj.baseScore) ? Math.max(0, obj.baseScore) : 2
  const lastPracticedAt =
    typeof obj.lastPracticedAt === "string" && obj.lastPracticedAt.trim() ? obj.lastPracticedAt : null
  const createdAt = typeof obj.createdAt === "string" && obj.createdAt.trim() ? obj.createdAt : nowISO()
  const id = typeof obj.id === "string" && obj.id.trim() ? obj.id : genId()
  const context = normalizeList(obj.context)
  const contextForPractice = normalizeList(obj.contextForPractice)
  return {
    id,
    term,
    translation,
    notes,
    baseScore,
    lastPracticedAt,
    createdAt,
    context,
    contextForPractice,
  }
}

export const ensureUniqueIds = (list: WordEntry[]) => {
  const seen = new Set<string>()
  return list.map((w) => {
    let id = w.id
    while (seen.has(id)) id = genId()
    seen.add(id)
    return { ...w, id }
  })
}

export const parseWordsInput = (value: string) => {
  try {
    return JSON.parse(value) as unknown
  } catch (jsonError) {
    try {
      const cleaned = value
        .trim()
        .replace(/^;+/, "")
        .replace(/^export\s+default\s+/, "")
        .replace(/^module\.exports\s*=\s*/, "")
      // Allow JS object/array literals (unquoted keys, trailing commas) for local editing.
      return Function(`"use strict"; return (${cleaned});`)() as unknown
    } catch (jsError) {
      const message = (jsonError as Error).message || (jsError as Error).message
      throw new Error(message)
    }
  }
}
