import type { PhraseTrieNode, Token, TokenGroup } from "../types"

export const MAX_PHRASE_WORDS = 4

export const normalizeTerm = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim()

export const expandTermVariants = (value: string) => {
  const parts = value.split("/").map((part) => normalizeTerm(part)).filter(Boolean)
  return Array.from(new Set(parts))
}

export const tokenize = (text: string, knownWords: Set<string>): Token[] => {
  const parts =
    text.match(/([\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*|[^\p{L}\p{N}\s]+|\s+)/gu) ||
    []
  return parts.map((value) => {
    if (/^\s+$/.test(value)) {
      return { value, type: "space", known: false }
    }
    if (/^[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*$/u.test(value)) {
      const key = normalizeTerm(value)
      return { value, type: "word", known: knownWords.has(key) }
    }
    return { value, type: "punct", known: false }
  })
}

export const buildPhraseTrie = (terms: string[]) => {
  const root: PhraseTrieNode = { children: new Map() }
  terms.forEach((term) => {
    const parts = normalizeTerm(term).split(" ").filter(Boolean)
    if (parts.length < 2 || parts.length > MAX_PHRASE_WORDS) return
    let node = root
    parts.forEach((part) => {
      let next = node.children.get(part)
      if (!next) {
        next = { children: new Map() }
        node.children.set(part, next)
      }
      node = next
    })
    node.term = normalizeTerm(term)
  })
  return root
}

export const matchPhrase = (tokens: Token[], startIndex: number, trie: PhraseTrieNode) => {
  let node: PhraseTrieNode | undefined = trie
  let index = startIndex
  let lastMatch: { endIndex: number; term: string } | null = null
  while (index < tokens.length && node) {
    const token = tokens[index]
    if (token.type !== "word") break
    const nextNode: PhraseTrieNode | undefined = node.children.get(normalizeTerm(token.value))
    if (!nextNode) break
    node = nextNode
    if (node.term) {
      lastMatch = { endIndex: index, term: node.term }
    }
    const nextToken = tokens[index + 1]
    const afterNext = tokens[index + 2]
    if (nextToken?.type === "space" && afterNext?.type === "word") {
      index += 2
      continue
    }
    break
  }
  return lastMatch
}

export const groupTokens = (tokens: Token[], trie: PhraseTrieNode): TokenGroup[] => {
  const groups: TokenGroup[] = []
  let i = 0
  while (i < tokens.length) {
    const current = tokens[i]
    if (current.type === "word") {
      const phraseMatch = matchPhrase(tokens, i, trie)
      if (phraseMatch?.term && phraseMatch.term.includes(" ")) {
        groups.push({
          kind: "phrase",
          tokens: tokens.slice(i, phraseMatch.endIndex + 1),
          term: phraseMatch.term,
        })
        i = phraseMatch.endIndex + 1
        continue
      }
    }
    if (current.type === "word" && current.known) {
      const groupTokensList: Token[] = [current]
      let j = i + 1
      while (j < tokens.length) {
        const next = tokens[j]
        if (next.type === "space") {
          const afterSpace = tokens[j + 1]
          if (afterSpace?.type === "word" && afterSpace.known) {
            groupTokensList.push(next, afterSpace)
            j += 2
            continue
          }
        }
        break
      }
      groups.push({ kind: "knownGroup", tokens: groupTokensList })
      i = j
      continue
    }
    groups.push({ kind: "token", token: current })
    i += 1
  }
  return groups
}
