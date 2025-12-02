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
  practiceRounds: number
  practiceCount: number
  practiceScoreBuckets: PracticeScoreBucket[]
  practiceDateFilter: PracticeDateFilter
  practiceSpeakEnabled: boolean
  practiceVoiceId: string
  practiceVoiceLang: string
  practiceVoiceRate: number
}

export type PracticeScoreBucket = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9+"
export type PracticeDateFilter =
  | "any"
  | "today"
  | "yesterday"
  | "last3"
  | "last7"
  | "older7"
  | "never"

export type PracticeStats = Record<string, { correct: number; total: number }>

export type SearchField = "term" | "translation"
