import type { SortBy } from "+/types"

export const nextSort = (current: SortBy, asc: SortBy, desc: SortBy, fallback: SortBy) => {
  if (current === asc) return desc
  if (current === desc) return fallback
  return asc
}

export const sortIndicator = (current: SortBy, asc: SortBy, desc: SortBy) => {
  if (current === asc) return "↑"
  if (current === desc) return "↓"
  return ""
}
