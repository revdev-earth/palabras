import { useEffect, useMemo, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import { addV2Word } from "+/redux/slices/v2Slice"

import { genId } from "+/utils"

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

type TokenGroup = { kind: "knownGroup"; tokens: Token[] } | { kind: "token"; token: Token }

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

const seedPreviewText = "Hallo Danke bicicleta azul, Bitte Wasser y Buch con mesa."

const formatList = (items: string[] | undefined) => {
  if (!items || items.length === 0) return "—"
  return items.join(", ")
}

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const toTag = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export function ReconocimientoDePalabrasEnElTexto() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.v2Words.words)
  const [text, setText] = useState(seedPreviewText)
  const [activeWord, setActiveWord] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    term: "",
    translation: "",
    notes: "",
    context: "",
    contextForPractice: "",
  })
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
    const map = new Map<string, (typeof words)[number]>()
    words.forEach((word) => {
      const key = word.term.trim().toLowerCase()
      if (key && !map.has(key)) map.set(key, word)
    })
    return map
  }, [words])

  useEffect(() => {
    modelRef.current = { text, tokens }
  }, [text, tokens])

  const contextSuggestions = useMemo(() => {
    const wordsRaw = text.match(/[\p{L}\p{N}]+/gu) || []
    const words = wordsRaw.slice(0, 4)
    const pairs: string[] = []
    if (words.length >= 2) pairs.push(`${words[0]} ${words[1]}`)
    if (words.length >= 4) pairs.push(`${words[2]} ${words[3]}`)
    const tags = pairs.map((pair) => toTag(pair)).filter(Boolean)
    return Array.from(new Set(tags))
  }, [text])

  const startAdd = (term: string) => {
    setActiveWord(term)
    setDraft({
      term,
      translation: "",
      notes: "",
      context: "",
      contextForPractice: "",
    })
  }

  const addWord = () => {
    if (!draft.term.trim() || !draft.translation.trim()) {
      window.alert("Palabra y traduccion son obligatorias.")
      return
    }
    dispatch(
      addV2Word({
        id: genId(),
        term: draft.term.trim(),
        translation: draft.translation.trim(),
        notes: draft.notes,
        context: parseList(draft.context),
        contextForPractice: parseList(draft.contextForPractice),
      })
    )
    setActiveWord(null)
  }

  const addContextSuggestion = (value: string) => {
    if (!value) return
    setDraft((prev) => {
      const current = new Set(parseList(prev.contextForPractice))
      current.add(value)
      return { ...prev, contextForPractice: Array.from(current).join(", ") }
    })
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-ink-100 bg-white/90 px-4 py-3 shadow-soft">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Texto</div>
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
          {tokens.length === 0 && <span className="text-ink-400">Sin texto para analizar.</span>}
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
                        className="group relative inline-flex rounded-sm px-0.5 text-ink-900 after:absolute after:left-0 after:top-full after:h-2 after:w-full after:content-['']"
                      >
                        {token.value}
                        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-56 -translate-x-1/2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-ink-800 opacity-0 shadow-soft transition group-hover:pointer-events-auto group-hover:opacity-100">
                          <div className="font-semibold text-ink-900">
                            {lookup?.term ?? token.value}
                          </div>
                          {lookup?.translation && (
                            <div className="text-emerald-700">{lookup.translation}</div>
                          )}
                          <div className="mt-1 text-[10px] uppercase tracking-wide text-emerald-600">
                            Aprendida
                          </div>
                          <details className="mt-2">
                            <summary className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink-700">
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 text-emerald-700">
                                +
                              </span>
                              Detalles
                            </summary>
                            <div className="mt-2 space-y-1 text-ink-600">
                              <div>Notas: {lookup?.notes || "—"}</div>
                              <div>Contexto: {formatList(lookup?.context)}</div>
                              <div>Contexto practica: {formatList(lookup?.contextForPractice)}</div>
                            </div>
                          </details>
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
                  className="group relative inline-flex rounded-md bg-orange-200/70 px-1 shadow-[0_0_8px_rgba(249,115,22,0.45)] after:absolute after:left-0 after:top-full after:h-2 after:w-full after:content-['']"
                >
                  {token.value}
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-48 -translate-x-1/2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs text-ink-800 opacity-0 shadow-soft transition group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="font-semibold text-ink-900">{token.value}</div>
                    <div className="text-orange-700">No registrada</div>
                    <details className="mt-2">
                      <summary
                        className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink-700"
                        onClick={() => startAdd(token.value)}
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-orange-200 text-orange-600">
                          +
                        </span>
                        Agregar
                      </summary>
                      <div className="mt-2 space-y-2 text-ink-700">
                        <input
                          value={activeWord === token.value ? draft.translation : ""}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, translation: e.target.value }))
                          }
                          placeholder="Traduccion"
                          className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
                        />
                        <textarea
                          value={activeWord === token.value ? draft.notes : ""}
                          onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
                          rows={2}
                          placeholder="Notas"
                          className="w-full resize-none rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
                        />
                        <input
                          value={activeWord === token.value ? draft.context : ""}
                          onChange={(e) =>
                            setDraft((prev) => ({ ...prev, context: e.target.value }))
                          }
                          placeholder="Contexto (coma separada)"
                          className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
                        />
                        <input
                          value={activeWord === token.value ? draft.contextForPractice : ""}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              contextForPractice: e.target.value,
                            }))
                          }
                          placeholder="Contexto practica"
                          className="w-full rounded-md border border-ink-100 px-2 py-1 text-xs focus:border-orange-300 focus:outline-none"
                        />
                        {contextSuggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            {contextSuggestions.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => addContextSuggestion(tag)}
                                className="rounded-full border border-orange-200 px-2 py-0.5 font-semibold text-orange-700"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={addWord}
                            className="rounded-md bg-orange-500 px-2 py-1 text-[11px] font-semibold text-white"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    </details>
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
