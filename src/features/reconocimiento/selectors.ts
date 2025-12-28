import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "+/redux/store"

import { effectiveScore } from "+/utils"

import { buildPhraseTrie, expandTermVariants, groupTokens, normalizeTerm, tokenize } from "./utils/text"

const buildBase = createSelector(
  [(state: RootState) => state.words.words, (state: RootState) => state.recognition.recognitionText],
  (words, text) => {
    const knownWords = new Set<string>()
    words.forEach((word) => {
      const variants = expandTermVariants(word.term)
      variants.forEach((term) => {
        if (term && word.translation.trim() && !term.includes(" ")) knownWords.add(term)
      })
    })

    const tokens = tokenize(text, knownWords)
    const wordsByTerm = new Map<string, (typeof words)[number]>()
    words.forEach((word) => {
      const variants = expandTermVariants(word.term)
      variants.forEach((key) => {
        if (key && !wordsByTerm.has(key)) wordsByTerm.set(key, word)
      })
    })

    const terms = words.map((word) => word.term)
    const phraseTrie = buildPhraseTrie(terms)
    const groups = groupTokens(tokens, phraseTrie)

    return {
      words,
      text,
      tokens,
      wordsByTerm,
      groups,
    }
  }
)

export const selectUnknownWords = createSelector([buildBase], ({ tokens, wordsByTerm }) => {
  const list: string[] = []
  const seen = new Set<string>()
  tokens.forEach((token) => {
    if (token.type !== "word") return
    const key = normalizeTerm(token.value)
    if (!key || wordsByTerm.has(key) || seen.has(key)) return
    seen.add(key)
    list.push(token.value)
  })

  return list
})

export const selectLearningWords = createSelector([buildBase], ({ tokens, wordsByTerm }) => {
  const list: Array<{ term: string; score: number }> = []
  const seen = new Set<string>()
  tokens.forEach((token) => {
    if (token.type !== "word") return
    const key = normalizeTerm(token.value)
    if (!key || seen.has(key)) return
    const lookup = wordsByTerm.get(key)
    if (!lookup) return
    const score = effectiveScore(lookup)
    if (score >= 10) return
    seen.add(key)
    list.push({ term: lookup.term, score })
  })

  return list
})

const toTag = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export const selectRecognitionDerived = createSelector(
  [buildBase, (_state: RootState, activeWord: string | null) => activeWord],
  ({ words, text, tokens, wordsByTerm, groups }, activeWord) => {

  const contextSuggestions = (() => {
    const wordsRaw = text.match(/[\p{L}\p{N}]+/gu) || []
    const wordsSlice = wordsRaw.slice(0, 4)
    const pairs: string[] = []
    if (wordsSlice.length >= 2) pairs.push(`${wordsSlice[0]} ${wordsSlice[1]}`)
    if (wordsSlice.length >= 4) pairs.push(`${wordsSlice[2]} ${wordsSlice[3]}`)
    const tags = pairs.map((pair) => toTag(pair)).filter(Boolean)
    return Array.from(new Set(tags))
  })()

  const phraseSuggestions = (() => {
    if (!activeWord) return []
    const key = normalizeTerm(activeWord)
    const suggestions = new Set<string>()
    for (let i = 0; i < tokens.length - 2; i += 1) {
      const token = tokens[i]
      const next = tokens[i + 1]
      const afterNext = tokens[i + 2]
      if (
        token.type === "word" &&
        normalizeTerm(token.value) === key &&
        next?.type === "space" &&
        afterNext?.type === "word"
      ) {
        suggestions.add(`${token.value} ${afterNext.value}`)
      }
    }
    words.forEach((word) => {
      const normalized = normalizeTerm(word.term)
      if (normalized.startsWith(`${key} `)) {
        suggestions.add(word.term)
      }
    })
    return Array.from(suggestions)
  })()

  const practiceTargets = (() => {
    const ids = new Set<string>()
    tokens.forEach((token) => {
      if (token.type !== "word") return
      const lookup = wordsByTerm.get(normalizeTerm(token.value))
      if (!lookup) return
      if (effectiveScore(lookup) >= 10) return
      ids.add(lookup.id)
    })
    return Array.from(ids)
  })()

    return {
      tokens,
      groups,
      wordsByTerm,
      contextSuggestions,
      phraseSuggestions,
      practiceTargets,
    }
  }
)
