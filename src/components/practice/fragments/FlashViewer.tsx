import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import { useSpeaker } from "+/hooks/useSpeaker"

import { setSelectedIds, touchLastPracticed } from "+/redux/slices/wordsSlice"

import { buildQueue } from "+/utils"

import type { WordEntry } from "+/redux/slices/wordsSlice"

const speedOptions = [
  { label: "0.5 s", value: 500 },
  { label: "0.75 s", value: 750 },
  { label: "1 s", value: 1000 },
  { label: "1.5 s", value: 1500 },
  { label: "2 s", value: 2000 },
  { label: "2.5 s", value: 2500 },
  { label: "3 s", value: 3000 },
]

type ShowKey = "term" | "translation" | "notes"

type FlashStartDetail = { ids: string[]; rounds?: number }

function FlashViewer() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const selectedIds = useSelector((s) => s.words.selectedIds)
  const [intervalMs, setIntervalMs] = useState(2500)
  const rounds = useSelector((s) => s.settings.practiceRounds)
  const [showModes, setShowModes] = useState<Set<ShowKey>>(
    new Set(["term", "translation"])
  )
  const [queue, setQueue] = useState<WordEntry[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const lastTouchedIdRef = useRef<string | null>(null)
  const waitingForSpeechRef = useRef(false)
  const [ended, setEnded] = useState(false)
  const [lastRun, setLastRun] = useState<{
    ids: string[]
    rounds: number
  } | null>(null)
  const finishTimer = useRef<number | null>(null)
  const effectiveIndex = useMemo(
    () => Math.min(index, Math.max(0, queue.length - 1)),
    [index, queue.length]
  )
  const { speak, speakEnabled, stopSpeaking, isSpeaking } = useSpeaker()
  const speakerBtnClass =
    "rounded-full border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-sm"

  const wordsById = useMemo(() => new Map(words.map((w) => [w.id, w])), [words])
  const selectedWords = useMemo(
    () =>
      selectedIds
        .map((id) => wordsById.get(id))
        .filter((w): w is WordEntry => Boolean(w)),
    [selectedIds, wordsById]
  )

  const resetSession = useCallback(
    (clearSelection: boolean, keepEnded = false) => {
      setPlaying(false)
      setPaused(false)
      setQueue([])
      setIndex(0)
      lastTouchedIdRef.current = null
      waitingForSpeechRef.current = false
      if (!keepEnded) setEnded(false)
      if (clearSelection) dispatch(setSelectedIds([]))
      stopSpeaking()
    },
    [dispatch, stopSpeaking]
  )

  const goRelative = (delta: number) => {
    if (!queue.length) return
    setPaused(true)
    setEnded(false)
    stopSpeaking()
    waitingForSpeechRef.current = false
    setIndex((i) => Math.max(0, Math.min(queue.length - 1, i + delta)))
    lastTouchedIdRef.current = null
  }

  useEffect(() => {
    if (!playing || paused || queue.length === 0) return
    if (waitingForSpeechRef.current) return
    const isLast = effectiveIndex >= queue.length - 1
    const id = window.setTimeout(() => {
      if (isLast) {
        setEnded(true)
        const timer = window.setTimeout(() => {
          resetSession(true, true)
        }, 3000)
        finishTimer.current = timer
        setPlaying(false)
        setPaused(false)
      } else {
        setIndex((i) => Math.min(queue.length - 1, i + 1))
      }
    }, intervalMs)
    return () => window.clearTimeout(id)
  }, [playing, paused, queue.length, effectiveIndex, intervalMs, resetSession])

  const startWithIds = useCallback(
    (ids: string[], forcedRounds?: number) => {
      const r = Math.max(
        1,
        Math.min(10, Math.floor(forcedRounds ?? rounds) || 1)
      )
      const list = buildQueue(ids, r)
        .map((id) => wordsById.get(id))
        .filter((w): w is WordEntry => Boolean(w))
      if (!list.length) return false
      waitingForSpeechRef.current = false
      setQueue(list)
      setIndex(0)
      setPlaying(true)
      setPaused(false)
      setEnded(false)
      setLastRun({ ids, rounds: r })
      return true
    },
    [rounds, wordsById]
  )

  const toggleSpeak = (text: string, opts?: { sentencePerLine?: boolean }) => {
    if (isSpeaking) {
      stopSpeaking()
      waitingForSpeechRef.current = false
    } else {
      speak(text, opts)
    }
  }

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<FlashStartDetail>).detail
      if (!detail || !Array.isArray(detail.ids)) return
      const ok = startWithIds(detail.ids, detail.rounds)
      if (!ok)
        window.alert("No se pudo armar la cola de palabras para el visor.")
    }
    window.addEventListener("flashviewer:start", handler as EventListener)
    return () =>
      window.removeEventListener("flashviewer:start", handler as EventListener)
  }, [startWithIds])

  const stop = () => resetSession(true)

  const current = queue[effectiveIndex] || null
  const progress = queue.length
    ? `${effectiveIndex + 1} / ${queue.length}`
    : "—"

  useEffect(
    () => () => {
      if (finishTimer.current) window.clearTimeout(finishTimer.current)
    },
    []
  )

  useEffect(() => {
    if (!playing || paused || !current) return
    if (current.id === lastTouchedIdRef.current) return
    dispatch(touchLastPracticed(current.id))
    lastTouchedIdRef.current = current.id
    if (!speakEnabled) {
      waitingForSpeechRef.current = false
      return
    }
    const includeNotes =
      showModes.has("notes") && Boolean(current.notes?.trim())
    const parts = [current.term.trim()]
    if (includeNotes && current.notes) parts.push(current.notes)
    const text = parts.filter(Boolean).join("\n")
    if (!text) {
      waitingForSpeechRef.current = false
      return
    }
    if (includeNotes) waitingForSpeechRef.current = true
    const spoke = speak(text, {
      onEnd: () => {
        waitingForSpeechRef.current = false
      },
      onError: () => {
        waitingForSpeechRef.current = false
      },
      sentencePerLine: includeNotes,
    })
    if (!spoke) waitingForSpeechRef.current = false
  }, [playing, paused, current, dispatch, speakEnabled, showModes, speak])

  return (
    <section className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">
            Visor rápido (auto-play)
          </h3>
          <p className="text-xs text-slate-600">
            Cicla las palabras seleccionadas a la velocidad elegida. Útil para
            repasos rápidos sin marcar aciertos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1">
            Seleccionadas: {selectedWords.length}
          </span>
          <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1">
            Progreso: {progress}
          </span>
          {queue.length > 0 && (
            <>
              <button
                onClick={() => goRelative(-1)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-800 hover:border-slate-300"
                title="Anterior"
              >
                ←
              </button>
              <button
                onClick={() => goRelative(1)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-800 hover:border-slate-300"
                title="Siguiente"
              >
                →
              </button>
            </>
          )}
          {queue.length > 0 && (
            <button
              onClick={() => setPaused((p) => !p)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold shadow-lg transition ${
                paused
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                  : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300"
              }`}
            >
              {paused ? "Continuar" : "Pausar"}
            </button>
          )}
          {queue.length > 0 && (
            <button
              onClick={stop}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 shadow-lg hover:border-rose-300"
            >
              Detener
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner">
          Velocidad:
          <select
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            className="rounded-md border border-slate-100 bg-white px-2 py-1 text-sm focus:border-slate-400 focus:outline-none"
          >
            {speedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner sm:col-span-2 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
              Mostrar:
            </span>
            <div className="flex flex-wrap gap-1 rounded-full bg-slate-50 p-1">
              {(["term", "translation", "notes"] as ShowKey[]).map((key) => {
                const active = showModes.has(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setShowModes((prev) => {
                        const next = new Set(prev)
                        if (active && next.size === 1) return prev
                        if (active) next.delete(key)
                        else next.add(key)
                        return next
                      })
                    }
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-white"
                    }`}
                  >
                    {key === "term" && "Palabra"}
                    {key === "translation" && "Traducción"}
                    {key === "notes" && "Notas"}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-linear-to-b from-white to-slate-50 px-6 py-8 text-center shadow-inner">
        {current ? (
          <>
            {showModes.has("term") && (
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900">
                <button
                  type="button"
                  onClick={() => toggleSpeak(current.term)}
                  className={speakerBtnClass}
                  title={isSpeaking ? "Detener audio" : "Pronunciar palabra"}
                >
                  {isSpeaking ? "⏹️" : "🔊"}
                </button>
                <span>{current.term}</span>
              </div>
            )}
            {showModes.has("translation") && (
              <div className="mt-2 text-xl font-semibold text-slate-800">
                {current.translation}
              </div>
            )}
            {showModes.has("notes") && current.notes && (
              <div className="mt-3 flex items-start justify-center gap-2 text-sm text-slate-700 opacity-80">
                <button
                  type="button"
                  onClick={() => toggleSpeak(current.notes || "")}
                  className={`${speakerBtnClass} mt-0.5`}
                  title={isSpeaking ? "Detener audio" : "Pronunciar notas"}
                >
                  {isSpeaking ? "⏹️" : "🔊"}
                </button>
                <div className="line-clamp-3">{current.notes}</div>
              </div>
            )}
            {showModes.has("notes") && !current.notes && (
              <div className="text-sm text-slate-500">
                Sin notas para esta palabra.
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-slate-600">
            Usa el modo “Visor rápido” en los botones de Practicar o selecciona
            palabras en la tabla para iniciar.
          </div>
        )}
        {ended && lastRun && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                if (finishTimer.current)
                  window.clearTimeout(finishTimer.current)
                resetSession(false, false)
                startWithIds(lastRun.ids, lastRun.rounds)
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-lg"
            >
              Repetir
            </button>
            <span className="text-xs text-slate-500">
              Se detuvo al completar las rondas.
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

export default FlashViewer
