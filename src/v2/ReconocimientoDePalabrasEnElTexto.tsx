import type { Dispatch, SetStateAction } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import type { V2Word } from "+/redux/slices/v2Slice"
import { applyScore, upsertWord } from "+/redux/slices/v2Slice"

import { ReconocimientoEditorTabs, WordDraft } from "./ReconocimientoEditorTabs"

import { effectiveScore } from "+/utils"
import { scoreTone } from "./utils/scoreTone"

type Token = {
  value: string
  type: "word" | "space" | "punct"
  known: boolean
}

type Model = {
  text: string
  tokens: Token[]
}

const normalizeTerm = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim()

const tokenize = (text: string, knownWords: Set<string>): Token[] => {
  const parts = text.match(/([\p{L}\p{N}]+|[^\p{L}\p{N}\s]+|\s+)/gu) || []
  return parts.map((value) => {
    if (/^\s+$/.test(value)) {
      return { value, type: "space", known: false }
    }
    if (/^[\p{L}\p{N}]+$/u.test(value)) {
      const key = normalizeTerm(value)
      return { value, type: "word", known: knownWords.has(key) }
    }
    return { value, type: "punct", known: false }
  })
}

type PhraseTrieNode = {
  term?: string
  children: Map<string, PhraseTrieNode>
}

type TokenGroup =
  | { kind: "knownGroup"; tokens: Token[] }
  | { kind: "phrase"; tokens: Token[]; term: string }
  | { kind: "token"; token: Token }

const MAX_PHRASE_WORDS = 4

const buildPhraseTrie = (terms: string[]) => {
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

const matchPhrase = (tokens: Token[], startIndex: number, trie: PhraseTrieNode) => {
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

const groupTokens = (tokens: Token[], trie: PhraseTrieNode): TokenGroup[] => {
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

const phraseTone = {
  bg: "bg-violet-100/70",
  border: "border-violet-100",
  shadow: "shadow-[0_0_8px_rgba(139,92,246,0.2)]",
  text: "text-violet-700",
}

type TooltipState =
  | {
      kind: "known"
      left: number
      top: number
      widthClass: "w-56"
      lookup: V2Word
      keyTerm: string
    }
  | {
      kind: "phrase"
      left: number
      top: number
      widthClass: "w-60"
      options: Array<{ label: string; lookup?: V2Word }>
    }
  | {
      kind: "unknown"
      left: number
      top: number
      widthClass: "w-64"
      token: string
    }

type TooltipProps = {
  tooltip: TooltipState
  activeWord: string | null
  draft: WordDraft
  phraseSuggestions: string[]
  contextSuggestions: string[]
  onAddPhraseSuggestion: (value: string) => void
  onAddContextSuggestion: (value: string) => void
  onScore: (id: string, delta: number) => void
  onStartEdit: (term: string) => void
  onToggleActive: (term: string) => void
  onSave: (draft: WordDraft, previousTerm?: string, shouldAlert?: boolean) => boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  setDraft: Dispatch<SetStateAction<WordDraft>>
}

function ReconocimientoTooltip({
  tooltip,
  activeWord,
  draft,
  phraseSuggestions,
  contextSuggestions,
  onAddPhraseSuggestion,
  onAddContextSuggestion,
  onScore,
  onStartEdit,
  onToggleActive,
  onSave,
  onMouseEnter,
  onMouseLeave,
  setDraft,
}: TooltipProps) {
  const borderClass =
    tooltip.kind === "phrase"
      ? phraseTone.border
      : tooltip.kind === "unknown"
        ? "border-slate-200"
        : scoreTone(effectiveScore(tooltip.lookup)).border

  return (
    <div
      className={`pointer-events-auto absolute z-20 ${tooltip.widthClass} -translate-x-1/2 rounded-xl border bg-white px-3 py-2 text-xs text-ink-800 shadow-soft ${borderClass}`}
      style={{
        left: tooltip.left,
        top: tooltip.top,
        transform: "translate(-50%, calc(-100% - 1px))",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {tooltip.kind === "known" &&
        (() => {
          const isActive = activeWord === tooltip.keyTerm
          const tone = scoreTone(effectiveScore(tooltip.lookup))
          return (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-ink-900">{tooltip.lookup.term}</div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-600">
                  <button
                    type="button"
                    onClick={() => onScore(tooltip.lookup.id, -1)}
                    className="text-ink-600 hover:text-ink-900"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => onScore(tooltip.lookup.id, 1)}
                    className="text-ink-600 hover:text-ink-900"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleActive(tooltip.keyTerm)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${tone.border} ${tone.text}`}
                    aria-label="Editar palabra"
                    title="Editar palabra"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                      <path
                        d="M14.7 2.6a1.5 1.5 0 0 1 2.1 2.1l-9.2 9.2-3.3.7.7-3.3 9.2-9.2Zm-8.4 9.9-.3 1.2 1.2-.3 8.6-8.6-.9-.9-8.6 8.6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {tooltip.lookup.translation && (
                <div className={tone.text}>{tooltip.lookup.translation}</div>
              )}
              <div className={`mt-1 text-[10px] uppercase tracking-wide ${tone.text}`}>
                {tone.label} · Score {effectiveScore(tooltip.lookup).toFixed(1)}
              </div>
              <details className="mt-2">
                <summary className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 text-emerald-700">
                    +
                  </span>
                  Detalles
                </summary>
                <div className="mt-2 space-y-1 text-ink-600">
                  <div>Notas: {tooltip.lookup.notes || "—"}</div>
                  <div>Contexto: {formatList(tooltip.lookup.context)}</div>
                  <div>Contexto practica: {formatList(tooltip.lookup.contextForPractice)}</div>
                </div>
              </details>
              {isActive && (
                <div className="mt-2">
                  <ReconocimientoEditorTabs
                    key={draft.term}
                    draft={draft}
                    setDraft={setDraft}
                    onSave={() => onSave(draft, activeWord, false)}
                    phraseSuggestions={phraseSuggestions}
                    onAddPhraseSuggestion={onAddPhraseSuggestion}
                    contextSuggestions={contextSuggestions}
                    onAddContextSuggestion={onAddContextSuggestion}
                  />
                </div>
              )}
            </>
          )
        })()}
      {tooltip.kind === "phrase" &&
        tooltip.options.map((option, optionIndex) => {
          const optionLookup = option.lookup
          const optionIsActive = activeWord === option.label
          return (
            <div key={option.label}>
              {optionIndex > 0 && <div className="my-2 h-px bg-ink-100" />}
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-ink-900">{option.label}</div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-ink-600">
                  {optionLookup && (
                    <>
                      <button
                        type="button"
                        onClick={() => onScore(optionLookup.id, -1)}
                        className="text-ink-600 hover:text-ink-900"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => onScore(optionLookup.id, 1)}
                        className="text-ink-600 hover:text-ink-900"
                      >
                        +1
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleActive(option.label)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${phraseTone.border} ${phraseTone.text}`}
                    aria-label="Editar termino"
                    title="Editar termino"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                      <path
                        d="M14.7 2.6a1.5 1.5 0 0 1 2.1 2.1l-9.2 9.2-3.3.7.7-3.3 9.2-9.2Zm-8.4 9.9-.3 1.2 1.2-.3 8.6-8.6-.9-.9-8.6 8.6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {optionLookup?.translation ? (
                <div className={phraseTone.text}>{optionLookup.translation}</div>
              ) : (
                <div className="text-ink-500">No registrada</div>
              )}
              <details className="mt-2">
                <summary className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink-700">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${phraseTone.border} ${phraseTone.text}`}
                  >
                    +
                  </span>
                  Detalles
                </summary>
                <div className="mt-2 space-y-1 text-ink-600">
                  <div>Notas: {optionLookup?.notes || "—"}</div>
                  <div>Contexto: {formatList(optionLookup?.context)}</div>
                  <div>Contexto practica: {formatList(optionLookup?.contextForPractice)}</div>
                </div>
              </details>
              {optionIsActive && (
                <div className="mt-2">
                  <ReconocimientoEditorTabs
                    key={draft.term}
                    draft={draft}
                    setDraft={setDraft}
                    onSave={() => onSave(draft, activeWord, false)}
                    phraseSuggestions={phraseSuggestions}
                    onAddPhraseSuggestion={onAddPhraseSuggestion}
                    contextSuggestions={contextSuggestions}
                    onAddContextSuggestion={onAddContextSuggestion}
                  />
                </div>
              )}
            </div>
          )
        })}
      {tooltip.kind === "unknown" &&
        (() => {
          const isActive = activeWord === tooltip.token
          return (
            <>
              <div className="font-semibold text-ink-900">{tooltip.token}</div>
              <div className="text-slate-700">No registrada</div>
              <details className="mt-2" open={isActive}>
                <summary
                  className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-ink-700"
                  onClick={(event) => {
                    event.preventDefault()
                    if (isActive) {
                      onToggleActive(tooltip.token)
                      return
                    }
                    onStartEdit(tooltip.token)
                  }}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                    {isActive ? "-" : "+"}
                  </span>
                  {isActive ? "Cerrar" : "Agregar"}
                </summary>
                {isActive && (
                  <div className="mt-2">
                    <ReconocimientoEditorTabs
                      key={draft.term || tooltip.token}
                      draft={draft}
                      setDraft={setDraft}
                      onSave={() => onSave(draft, activeWord, false)}
                      phraseSuggestions={phraseSuggestions}
                      onAddPhraseSuggestion={onAddPhraseSuggestion}
                      contextSuggestions={contextSuggestions}
                      onAddContextSuggestion={onAddContextSuggestion}
                    />
                  </div>
                )}
              </details>
            </>
          )
        })()}
    </div>
  )
}

type PreviewConfigProps = {
  fontSize: number
  lineHeight: number
  wordSpacing: number
  isOpen: boolean
  onToggle: () => void
  onFontSizeChange: (value: number) => void
  onLineHeightChange: (value: number) => void
  onWordSpacingChange: (value: number) => void
}

function PreviewConfigMenu({
  fontSize,
  lineHeight,
  wordSpacing,
  isOpen,
  onToggle,
  onFontSizeChange,
  onLineHeightChange,
  onWordSpacingChange,
}: PreviewConfigProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] shadow-inner transition ${
          isOpen
            ? "border-ink-300 bg-ink-900 text-white"
            : "border-ink-100 bg-white text-ink-700 hover:bg-ink-50"
        }`}
        title="Configurar vista previa"
      >
        ⚙️
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-[220px] rounded-xl border border-ink-100 bg-ink-50/95 px-3 py-3 text-[11px] font-medium text-ink-700 shadow-soft backdrop-blur">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
              Tamano
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={12}
                max={20}
                step={1}
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-full"
              />
              <span className="min-w-[24px] text-right text-[10px] font-semibold">{fontSize}</span>
            </div>
          </label>
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
              Interlineado
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1.2}
                max={2.2}
                step={0.05}
                value={lineHeight}
                onChange={(e) => onLineHeightChange(Number(e.target.value))}
                className="w-full"
              />
              <span className="min-w-[28px] text-right text-[10px] font-semibold">
                {lineHeight.toFixed(2)}
              </span>
            </div>
          </label>
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
              Espaciado
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={wordSpacing}
                onChange={(e) => onWordSpacingChange(Number(e.target.value))}
                className="w-full"
              />
              <span className="min-w-[28px] text-right text-[10px] font-semibold">
                {wordSpacing.toFixed(1)}
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}

export function ReconocimientoDePalabrasEnElTexto() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.v2Words.words)
  const [text, setText] = useState(seedPreviewText)
  const [activeWord, setActiveWord] = useState<string | null>(null)
  const [previewFontSize, setPreviewFontSize] = useState(14)
  const [previewLineHeight, setPreviewLineHeight] = useState(1.6)
  const [previewWordSpacing, setPreviewWordSpacing] = useState(0)
  const [showPreviewConfig, setShowPreviewConfig] = useState(false)
  const [draft, setDraft] = useState<WordDraft>({
    term: "",
    translation: "",
    notes: "",
    context: "",
    contextForPractice: "",
  })
  const modelRef = useRef<Model>({ text: "", tokens: [] })
  const previewRef = useRef<HTMLDivElement | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const knownWords = useMemo(() => {
    const set = new Set<string>()
    words.forEach((w) => {
      const term = normalizeTerm(w.term)
      if (term && w.translation.trim() && !term.includes(" ")) set.add(term)
    })
    return set
  }, [words])

  const phraseTrie = useMemo(() => {
    const terms = words.map((word) => word.term)
    return buildPhraseTrie(terms)
  }, [words])

  const tokens = useMemo(() => tokenize(text, knownWords), [text, knownWords])
  const groups = useMemo(() => groupTokens(tokens, phraseTrie), [tokens, phraseTrie])
  const wordsByTerm = useMemo(() => {
    const map = new Map<string, (typeof words)[number]>()
    words.forEach((word) => {
      const key = normalizeTerm(word.term)
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

  const phraseSuggestions = useMemo(() => {
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
  }, [activeWord, tokens, words])

  const startAdd = (term: string) => {
    setActiveWord(term)
    const existing = wordsByTerm.get(normalizeTerm(term))
    if (existing) {
      setDraft({
        term: existing.term,
        translation: existing.translation,
        notes: existing.notes,
        context: existing.context.join(", "),
        contextForPractice: existing.contextForPractice.join(", "),
      })
      return
    }
    setDraft({
      term,
      translation: "",
      notes: "",
      context: "",
      contextForPractice: "",
    })
  }

  const saveWord = (nextDraft: WordDraft, previousTerm = activeWord, shouldAlert = true) => {
    if (!nextDraft.term.trim() || !nextDraft.translation.trim()) {
      if (shouldAlert) window.alert("Palabra y traduccion son obligatorias.")
      return false
    }
    dispatch(
      upsertWord({
        term: nextDraft.term.trim(),
        translation: nextDraft.translation.trim(),
        notes: nextDraft.notes,
        context: parseList(nextDraft.context),
        contextForPractice: parseList(nextDraft.contextForPractice),
        previousTerm: previousTerm ?? undefined,
      })
    )
    if (
      previousTerm &&
      wordsByTerm.has(normalizeTerm(previousTerm)) &&
      normalizeTerm(previousTerm) !== normalizeTerm(nextDraft.term)
    ) {
      setActiveWord(nextDraft.term.trim())
    }
    return true
  }

  const addContextSuggestion = (value: string) => {
    if (!value) return
    setDraft((prev) => {
      const current = new Set(parseList(prev.contextForPractice))
      current.add(value)
      return { ...prev, contextForPractice: Array.from(current).join(", ") }
    })
  }

  const addPhraseSuggestion = (value: string) => {
    if (!value) return
    setDraft((prev) => ({ ...prev, term: value }))
  }

  const onScore = (id: string, delta: number) => {
    dispatch(applyScore({ id, delta }))
  }

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const scheduleClose = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = window.setTimeout(() => {
      setTooltip(null)
      closeTimeoutRef.current = null
    }, 300)
  }

  const openTooltip = (
    el: HTMLElement,
    next:
      | { kind: "known"; lookup: V2Word; keyTerm: string }
      | { kind: "phrase"; options: Array<{ label: string; lookup?: V2Word }> }
      | { kind: "unknown"; token: string }
  ) => {
    if (!previewRef.current) return
    const rect = el.getBoundingClientRect()
    const containerRect = previewRef.current.getBoundingClientRect()
    const left = rect.left - containerRect.left + rect.width / 2
    const top = rect.top - containerRect.top
    if (next.kind === "known") {
      setTooltip({
        kind: "known",
        left,
        top,
        widthClass: "w-56",
        lookup: next.lookup,
        keyTerm: next.keyTerm,
      })
      return
    }
    if (next.kind === "phrase") {
      setTooltip({
        kind: "phrase",
        left,
        top,
        widthClass: "w-60",
        options: next.options,
      })
      return
    }
    setTooltip({
      kind: "unknown",
      left,
      top,
      widthClass: "w-64",
      token: next.token,
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
        <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <span>Vista previa</span>
          <PreviewConfigMenu
            fontSize={previewFontSize}
            lineHeight={previewLineHeight}
            wordSpacing={previewWordSpacing}
            isOpen={showPreviewConfig}
            onToggle={() => setShowPreviewConfig((prev) => !prev)}
            onFontSizeChange={setPreviewFontSize}
            onLineHeightChange={setPreviewLineHeight}
            onWordSpacingChange={setPreviewWordSpacing}
          />
        </div>
        <div
          className="relative mt-3 whitespace-pre-wrap text-ink-900"
          style={{
            fontSize: `${previewFontSize}px`,
            lineHeight: previewLineHeight,
            wordSpacing: `${previewWordSpacing}px`,
          }}
          ref={previewRef}
        >
          {tokens.length === 0 && <span className="text-ink-400">Sin texto para analizar.</span>}
          {groups.map((group, groupIndex) => {
            if (group.kind === "knownGroup") {
              return (
                <span key={`known-group-${groupIndex}`}>
                  {(() => {
                    const segments: Array<{ kind: "high" | "normal"; tokens: Token[] }> = []
                    let i = 0
                    while (i < group.tokens.length) {
                      const token = group.tokens[i]
                      if (token.type === "word") {
                        const lookup = wordsByTerm.get(normalizeTerm(token.value))
                        const score = lookup ? effectiveScore(lookup) : 0
                        if (score >= 10) {
                          const segTokens: Token[] = [token]
                          let j = i + 1
                          while (j < group.tokens.length) {
                            const space = group.tokens[j]
                            const nextWord = group.tokens[j + 1]
                            if (space?.type === "space" && nextWord?.type === "word") {
                              const nextLookup = wordsByTerm.get(normalizeTerm(nextWord.value))
                              const nextScore = nextLookup ? effectiveScore(nextLookup) : 0
                              if (nextScore >= 10) {
                                segTokens.push(space, nextWord)
                                j += 2
                                continue
                              }
                            }
                            break
                          }
                          segments.push({ kind: "high", tokens: segTokens })
                          i = j
                          continue
                        }
                      }
                      segments.push({ kind: "normal", tokens: [token] })
                      i += 1
                    }

                    const renderToken = (token: Token, tokenIndex: number, inHigh: boolean) => {
                      if (token.type === "space") {
                        return (
                          <span key={`known-space-${groupIndex}-${tokenIndex}`}>{token.value}</span>
                        )
                      }
                      const lookup = wordsByTerm.get(normalizeTerm(token.value))
                      const keyTerm = lookup?.term ?? token.value
                      const tone = lookup ? scoreTone(effectiveScore(lookup)) : null
                      return (
                        <span
                          key={`known-word-${groupIndex}-${tokenIndex}`}
                          className={`inline-flex rounded-sm px-0.5 text-ink-900 ${
                            !inHigh && tone ? `${tone.bg} ${tone.shadow}` : ""
                          }`}
                          onMouseEnter={(event) => {
                            if (!lookup) return
                            cancelClose()
                            openTooltip(event.currentTarget, {
                              kind: "known",
                              lookup,
                              keyTerm,
                            })
                          }}
                          onMouseLeave={scheduleClose}
                        >
                          {token.value}
                        </span>
                      )
                    }

                    const highTone = scoreTone(10)
                    return segments.map((segment, segmentIndex) =>
                      segment.kind === "high" ? (
                        <span
                          key={`known-high-${groupIndex}-${segmentIndex}`}
                          className={`rounded-md px-1 ${highTone.bg} ${highTone.shadow}`}
                        >
                          {segment.tokens.map((token, tokenIndex) =>
                            renderToken(token, tokenIndex, true)
                          )}
                        </span>
                      ) : (
                        <span key={`known-normal-${groupIndex}-${segmentIndex}`}>
                          {segment.tokens.map((token, tokenIndex) =>
                            renderToken(token, tokenIndex, false)
                          )}
                        </span>
                      )
                    )
                  })()}
                </span>
              )
            }

            if (group.kind === "phrase") {
              const lookup = wordsByTerm.get(group.term)
              const label = lookup?.term ?? group.term
              const phraseText = group.tokens.map((token) => token.value).join("")
              const phraseParts = group.tokens
                .filter((token) => token.type === "word")
                .map((token) => token.value)
              const phraseOptions = Array.from(new Set([label, ...phraseParts].filter(Boolean)))
              return (
                <span
                  key={`phrase-${groupIndex}`}
                  className={`inline-flex rounded-md px-1 ${phraseTone.bg} ${phraseTone.shadow}`}
                  onMouseEnter={(event) => {
                    cancelClose()
                    openTooltip(event.currentTarget, {
                      kind: "phrase",
                      options: phraseOptions.map((option) => ({
                        label: option,
                        lookup: wordsByTerm.get(normalizeTerm(option)),
                      })),
                    })
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {phraseText}
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
                  className="inline-flex rounded-md bg-slate-200/70 px-1 shadow-[0_0_8px_rgba(100,116,139,0.35)]"
                  onMouseEnter={(event) => {
                    cancelClose()
                    openTooltip(event.currentTarget, {
                      kind: "unknown",
                      token: token.value,
                    })
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {token.value}
                </span>
              )
            }

            return <span key={`punct-${groupIndex}`}>{token.value}</span>
          })}
          {tooltip && (
            <ReconocimientoTooltip
              tooltip={tooltip}
              activeWord={activeWord}
              draft={draft}
              phraseSuggestions={phraseSuggestions}
              contextSuggestions={contextSuggestions}
              onAddPhraseSuggestion={addPhraseSuggestion}
              onAddContextSuggestion={addContextSuggestion}
              onScore={onScore}
              onStartEdit={startAdd}
              onToggleActive={(term) => {
                if (activeWord === term) {
                  setActiveWord(null)
                  return
                }
                startAdd(term)
              }}
              onSave={saveWord}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              setDraft={setDraft}
            />
          )}
        </div>
      </div>
    </section>
  )
}
