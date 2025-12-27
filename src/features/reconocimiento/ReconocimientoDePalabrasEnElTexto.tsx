import { useMemo, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import { applyScore, upsertWord } from "+/redux/slices/wordsSlice"
import { setRecognitionText } from "+/redux/slices/recognitionSlice"

import { type WordDraft } from "./components/ReconocimientoEditorTabs"

import { PracticeSelectedChips } from "../../components/PracticeSelectedChips"

import { normalizeTerm } from "./utils/text"
import { PreviewConfigMenu } from "./components/PreviewConfigMenu"
import { type PhraseTone } from "./components/ReconocimientoTooltip"
import { useTooltipState } from "./hooks/useTooltipState"
import { TextHistoryMenu } from "./components/TextHistoryMenu"
import { UnknownWordsPanel } from "./components/UnknownWordsPanel"
import { LearningWordsPanel } from "./components/LearningWordsPanel"
import { TextPreview } from "./components/TextPreview"
import { selectLearningWords, selectRecognitionDerived, selectUnknownWords } from "./selectors"

const parseList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)

const phraseTone: PhraseTone = {
  bg: "bg-violet-100/70",
  border: "border-violet-100",
  shadow: "shadow-[0_0_8px_rgba(139,92,246,0.2)]",
  text: "text-violet-700",
}

export function ReconocimientoDePalabrasEnElTexto() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const text = useSelector((s) => s.recognition.recognitionText)
  const [activeWord, setActiveWord] = useState<string | null>(null)
  const previewFontSize = useSelector((s) => s.recognition.previewFontSize)
  const previewLineHeight = useSelector((s) => s.recognition.previewLineHeight)
  const previewWordSpacing = useSelector((s) => s.recognition.previewWordSpacing)
  const toneVariant = useSelector((s) => s.recognition.toneVariant)
  const [showUnknownList, setShowUnknownList] = useState(false)
  const [showLearningList, setShowLearningList] = useState(false)
  const [showJsonPreview, setShowJsonPreview] = useState(false)
  const [draft, setDraft] = useState<WordDraft>({
    term: "",
    translation: "",
    notes: "",
    context: "",
    contextForPractice: "",
  })
  const previewRef = useRef<HTMLDivElement | null>(null)
  const { tokens, groups, wordsByTerm, contextSuggestions, phraseSuggestions, practiceTargets } =
    useSelector((state) => selectRecognitionDerived(state, activeWord))
  const unknownWords = useSelector(selectUnknownWords)
  const learningWords = useSelector(selectLearningWords)
  const { tooltip, cancelClose, scheduleClose, openTooltip } = useTooltipState({
    previewRef,
    wordsByTerm,
  })
  const wordsJson = useMemo(() => {
    const counts = new Map<string, number>()
    tokens.forEach((token) => {
      if (token.type !== "word") return
      const key = normalizeTerm(token.value)
      if (!key) return
      counts.set(key, (counts.get(key) || 0) + 1)
    })

    return Array.from(counts.entries()).map(([term, count]) => {
      const known = wordsByTerm.get(term)
      if (known) return { ...known, count }
      return {
        id: "",
        term,
        translation: "",
        notes: "",
        context: [],
        contextForPractice: [],
        baseScore: 0,
        lastPracticedAt: null,
        createdAt: "",
        count,
      }
    })
  }, [tokens, wordsByTerm])
  const wordsJsonString = useMemo(() => JSON.stringify(wordsJson, null, 2), [wordsJson])

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

  const applyPracticeScore = () => {
    practiceTargets.forEach((id) => dispatch(applyScore({ id, delta: 1 })))
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Texto</span>
          <TextHistoryMenu />
        </div>

        <PracticeSelectedChips className="mt-2" />

        <textarea
          value={text}
          onChange={(e) => dispatch(setRecognitionText(e.target.value))}
          rows={6}
          placeholder="Escribe o pega un texto aqui..."
          className="mt-2 w-full resize-y rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={applyPracticeScore}
            disabled={practiceTargets.length === 0}
            className={`rounded-full px-3 py-1 font-semibold shadow-inner transition ${
              practiceTargets.length === 0
                ? "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-400"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Aprobar practica
          </button>
          <span className="text-[11px] text-slate-500">
            {practiceTargets.length
              ? `${practiceTargets.length} palabras con score menor a 10`
              : "Sin palabras pendientes para sumar"}
          </span>
        </div>
      </div>

      {showUnknownList && <UnknownWordsPanel unknownWords={unknownWords} />}
      {showLearningList && <LearningWordsPanel learningWords={learningWords} />}

      <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Vista previa</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUnknownList((prev) => !prev)}
              className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-inner transition hover:bg-slate-50"
            >
              Desconocidas {unknownWords.length ? `(${unknownWords.length})` : ""}
            </button>

            <button
              type="button"
              onClick={() => setShowLearningList((prev) => !prev)}
              className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-inner transition hover:bg-slate-50"
            >
              Aprendiendo {learningWords.length ? `(${learningWords.length})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setShowJsonPreview((prev) => !prev)}
              className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-inner transition hover:bg-slate-50"
            >
              JSON
            </button>

            <PreviewConfigMenu />
          </div>
        </div>

        {showJsonPreview && (
          <div className="relative mt-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-[11px] text-slate-700 shadow-inner">
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(wordsJsonString)
                } catch {
                  window.prompt("Copia el JSON manualmente:", wordsJsonString)
                }
              }}
              className="absolute right-2 top-2 rounded-full border border-slate-100 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-inner transition hover:bg-slate-50"
              title="Copiar JSON"
            >
              Copiar
            </button>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap pr-10">
              {wordsJsonString}
            </pre>
          </div>
        )}

        <TextPreview
          tokens={tokens}
          groups={groups}
          wordsByTerm={wordsByTerm}
          toneVariant={toneVariant}
          phraseTone={phraseTone}
          previewRef={previewRef}
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
          fontSize={previewFontSize}
          lineHeight={previewLineHeight}
          wordSpacing={previewWordSpacing}
          openTooltip={openTooltip}
        />
      </div>
    </section>
  )
}
