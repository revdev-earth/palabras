import { useEffect, useMemo, useRef, useState } from "react"

import { useSelector } from "+/redux"

type Token = {
  value: string
  type: "word" | "space" | "punct"
  known: boolean
}

type Model = {
  text: string
  tokens: Token[]
}

const tokenize = (text: string, knownWords: Set<string>): Token[] => {
  const parts = text.match(/([\p{L}\p{N}]+|[^\p{L}\p{N}\s]+|\s+)/gu) || []
  return parts.map((value) => {
    if (/^\s+$/.test(value)) {
      return { value, type: "space", known: false }
    }
    if (/^[\p{L}\p{N}]+$/u.test(value)) {
      const key = value.toLowerCase()
      return { value, type: "word", known: knownWords.has(key) }
    }
    return { value, type: "punct", known: false }
  })
}

type TokenGroup =
  | { kind: "knownGroup"; tokens: Token[] }
  | { kind: "token"; token: Token }

const groupTokens = (tokens: Token[]): TokenGroup[] => {
  const groups: TokenGroup[] = []
  let i = 0
  while (i < tokens.length) {
    const current = tokens[i]
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

const seedPreviewText =
  "Hallo Danke bicicleta azul, Bitte Wasser y Buch con mesa."

const formatList = (items: string[] | undefined) => {
  if (!items || items.length === 0) return "—"
  return items.join(", ")
}

export function ReconocimientoDePalabrasEnElTexto() {
  const words = useSelector((s) => s.v2Words.words)
  const [text, setText] = useState(seedPreviewText)
  const modelRef = useRef<Model>({ text: "", tokens: [] })

  const knownWords = useMemo(() => {
    const set = new Set<string>()
    words.forEach((w) => {
      const term = w.term.trim().toLowerCase()
      if (term) set.add(term)
    })
    return set
  }, [words])

  const tokens = useMemo(() => tokenize(text, knownWords), [text, knownWords])
  const groups = useMemo(() => groupTokens(tokens), [tokens])
  const wordsByTerm = useMemo(() => {
    const map = new Map<string, typeof words[number]>()
    words.forEach((word) => {
      const key = word.term.trim().toLowerCase()
      if (key && !map.has(key)) map.set(key, word)
    })
    return map
  }, [words])

  useEffect(() => {
    modelRef.current = { text, tokens }
  }, [text, tokens])

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-ink-100 bg-white/90 px-4 py-3 shadow-soft">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          Texto
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Escribe o pega un texto aqui..."
          className="mt-2 w-full resize-y rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2 text-sm text-ink-900 shadow-inner focus:border-ink-400 focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white/90 px-4 py-3 shadow-soft">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          Vista previa
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm text-ink-900">
          {tokens.length === 0 && (
            <span className="text-ink-400">Sin texto para analizar.</span>
          )}
          {groups.map((group, groupIndex) => {
            if (group.kind === "knownGroup") {
              return (
                <span
                  key={`known-group-${groupIndex}`}
                  className="rounded-md bg-emerald-200/70 px-1 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                >
                  {group.tokens.map((token, tokenIndex) => {
                    if (token.type === "space") {
                      return (
                        <span key={`known-space-${groupIndex}-${tokenIndex}`}>{token.value}</span>
                      )
                    }
                    const lookup = wordsByTerm.get(token.value.toLowerCase())
                    return (
                      <span
                        key={`known-word-${groupIndex}-${tokenIndex}`}
                        className="group relative rounded-sm px-0.5 text-ink-900"
                      >
                        {token.value}
                        <span className="absolute left-1/2 top-full z-10 mt-2 hidden w-56 -translate-x-1/2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-ink-800 shadow-soft group-hover:block">
                          <div className="font-semibold text-ink-900">
                            {lookup?.term ?? token.value}
                          </div>
                          {lookup?.translation && (
                            <div className="text-emerald-700">{lookup.translation}</div>
                          )}
                          <div className="mt-1 text-[10px] uppercase tracking-wide text-emerald-600">
                            Aprendida
                          </div>
                          {(lookup?.notes ||
                            (lookup?.context && lookup.context.length) ||
                            (lookup?.contextForPractice && lookup.contextForPractice.length)) && (
                            <details className="mt-2">
                              <summary className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink-700">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 text-emerald-700">
                                  +
                                </span>
                                Detalles
                              </summary>
                              <div className="mt-2 space-y-1 text-ink-600">
                                {lookup?.notes && <div>Notas: {lookup.notes}</div>}
                                <div>Contexto: {formatList(lookup?.context)}</div>
                                <div>Contexto practica: {formatList(lookup?.contextForPractice)}</div>
                              </div>
                            </details>
                          )}
                        </span>
                      </span>
                    )
                  })}
                </span>
              )
            }

            const token = group.token
            if (token.type === "space") {
              return <span key={`space-${groupIndex}`}>{token.value}</span>
            }

            if (token.type === "word") {
              return (
                <span
                  key={`word-${groupIndex}`}
                  className="group relative rounded-md bg-orange-200/70 px-1 shadow-[0_0_8px_rgba(249,115,22,0.45)]"
                >
                  {token.value}
                  <span className="absolute left-1/2 top-full z-10 mt-2 hidden w-48 -translate-x-1/2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs text-ink-800 shadow-soft group-hover:block">
                    <div className="font-semibold text-ink-900">{token.value}</div>
                    <div className="text-orange-700">No registrada</div>
                  </span>
                </span>
              )
            }

            return <span key={`punct-${groupIndex}`}>{token.value}</span>
          })}
        </div>
      </div>
    </section>
  )
}
