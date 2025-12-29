export type Token = {
  value: string
  type: "word" | "number" | "space" | "punct"
  known: boolean
}

export type PhraseTrieNode = {
  term?: string
  children: Map<string, PhraseTrieNode>
}

export type TokenGroup =
  | { kind: "knownGroup"; tokens: Token[] }
  | { kind: "phrase"; tokens: Token[]; term: string }
  | { kind: "token"; token: Token }
