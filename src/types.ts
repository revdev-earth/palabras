export type SortBy =
  | "score"
  | "scoreAsc"
  | "lastPracticedAt"
  | "lastPracticedAtAsc"
  | "createdAt"
  | "createdAtAsc"
  | "term"
  | "termDesc"
  | "translation"
  | "translationDesc"
  | "notes"
  | "notesDesc"

export type Word = {
  id: string
  term: string
  translation: string
  notes: string
  baseScore: number
  lastPracticedAt: string | null
  createdAt: string
}

export type Settings = {
  sortBy: SortBy
  lastSeenDay: string
}

export type PracticeStats = Record<string, { correct: number; total: number }>

export type SearchField = "term" | "translation"
