import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import { buildQueue } from "../utils"
import { setSelectedIds, touchLastPracticed } from "../store"
import { Word } from "../types"

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

const nextItem = (arr: Word[], idx: number) => (arr.length ? (idx + 1) % arr.length : 0)
type FlashStartDetail = { ids: string[]; rounds?: number }

function FlashViewer() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.app.words)
  const selectedIds = useSelector((s) => s.app.selectedIds)
  const [intervalMs, setIntervalMs] = useState(2500)
  const rounds = useSelector((s) => s.app.settings.practiceRounds)
  const speakEnabled = useSelector((s) => s.app.settings.practiceSpeakEnabled)
  const voiceIdSetting = useSelector((s) => s.app.settings.practiceVoiceId)
  const voiceLangSetting = useSelector((s) => s.app.settings.practiceVoiceLang)
  const voiceRateSetting = useSelector((s) => s.app.settings.practiceVoiceRate)
  const [showModes, setShowModes] = useState<Set<ShowKey>>(new Set(["term", "translation"]))
  const [queue, setQueue] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [lastTouchedId, setLastTouchedId] = useState<string | null>(null)
  const [waitingForSpeech, setWaitingForSpeech] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const wordsById = useMemo(() => new Map(words.map((w) => [w.id, w])), [words])
  const selectedWords = useMemo(
    () => selectedIds.map((id) => wordsById.get(id)).filter((w): w is Word => Boolean(w)),
    [selectedIds, wordsById]
  )

  const resetSession = useCallback(
    (clearSelection: boolean, keepEnded = false) => {
      setPlaying(false)
      setPaused(false)
      setQueue([])
      setIndex(0)
      setLastTouchedId(null)
      setWaitingForSpeech(false)
      if (!keepEnded) setEnded(false)
      if (clearSelection) dispatch(setSelectedIds([]))
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel()
    },
    [dispatch]
  )
  
  const goRelative = (delta: number) => {
    if (!queue.length) return
    setPaused(true)
    setEnded(false)
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel()
    setWaitingForSpeech(false)
    setIndex((i) => Math.max(0, Math.min(queue.length - 1, i + delta)))
    setLastTouchedId(null)
  }

  useEffect(() => {
    if (!playing || paused || queue.length === 0) return
    if (waitingForSpeech) return
    const isLast = index >= queue.length - 1
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
  }, [playing, paused, queue.length, index, intervalMs, resetSession, waitingForSpeech])

  useEffect(() => {
    if (queue.length === 0) setIndex(0)
    else setIndex((i) => Math.min(i, queue.length - 1))
  }, [queue.length])

  const startWithIds = useCallback(
    (ids: string[], forcedRounds?: number) => {
      const r = Math.max(1, Math.min(10, Math.floor(forcedRounds ?? rounds) || 1))
      const list = buildQueue(ids, r)
        .map((id) => wordsById.get(id))
        .filter((w): w is Word => Boolean(w))
      if (!list.length) return false
      setWaitingForSpeech(false)
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

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices()
      if (list.length) {
        setVoices(list)
      }
    }
    loadVoices()
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
  }, [])

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<FlashStartDetail>).detail
      if (!detail || !Array.isArray(detail.ids)) return
      const ok = startWithIds(detail.ids, detail.rounds)
      if (!ok) window.alert("No se pudo armar la cola de palabras para el visor.")
    }
    window.addEventListener("flashviewer:start", handler as EventListener)
    return () => window.removeEventListener("flashviewer:start", handler as EventListener)
  }, [startWithIds])

  const stop = () => resetSession(true)

  const current = queue[index] || null
  const progress = queue.length ? `${index + 1} / ${queue.length}` : "—"
  const [ended, setEnded] = useState(false)
  const [lastRun, setLastRun] = useState<{ ids: string[]; rounds: number } | null>(null)
  const finishTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (finishTimer.current) window.clearTimeout(finishTimer.current)
    },
    []
  )

  useEffect(() => {
    if (!playing || paused || !current) return
    if (current.id === lastTouchedId) return
    dispatch(touchLastPracticed(current.id))
    setLastTouchedId(current.id)
    if (speakEnabled && typeof window !== "undefined" && window.speechSynthesis) {
      const includeNotes = showModes.has("notes") && Boolean(current.notes?.trim())
      setWaitingForSpeech(includeNotes)
      const parts = [current.term.trim()]
      if (includeNotes && current.notes) parts.push(current.notes.trim())
      const utter = new SpeechSynthesisUtterance(parts.filter(Boolean).join(". "))
      const voice =
        voices.find((v) => v.voiceURI === voiceIdSetting || v.name === voiceIdSetting) ||
        voices.find((v) =>
          voiceLangSetting ? v.lang?.toLowerCase().startsWith(voiceLangSetting.toLowerCase()) : false
        ) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
        voices[0]
      if (voice) utter.voice = voice
      utter.rate = Math.min(2, Math.max(0.5, voiceRateSetting || 1))
      if (includeNotes) setWaitingForSpeech(true)
      utter.onend = () => setWaitingForSpeech(false)
      utter.onerror = () => setWaitingForSpeech(false)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    } else {
      setWaitingForSpeech(false)
    }
  }, [
    playing,
    paused,
    current,
    dispatch,
    lastTouchedId,
    speakEnabled,
    voiceIdSetting,
    voiceLangSetting,
    voices,
    voiceRateSetting,
    showModes,
    setWaitingForSpeech,
  ])

  return (
    <section className="rounded-2xl border border-ink-100 bg-white/90 p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-ink-900">Visor rápido (auto-play)</h3>
          <p className="text-xs text-ink-600">
            Cicla las palabras seleccionadas a la velocidad elegida. Útil para repasos rápidos sin marcar aciertos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-700">
          <span className="rounded-full border border-ink-100 bg-ink-50 px-2.5 py-1">
            Seleccionadas: {selectedWords.length}
          </span>
          <span className="rounded-full border border-ink-100 bg-ink-50 px-2.5 py-1">Progreso: {progress}</span>
          {queue.length > 0 && (
            <>
              <button
                onClick={() => goRelative(-1)}
                className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                title="Anterior"
              >
                ←
              </button>
              <button
                onClick={() => goRelative(1)}
                className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                title="Siguiente"
              >
                →
              </button>
            </>
          )}
          {queue.length > 0 && (
            <button
              onClick={() => setPaused((p) => !p)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold shadow-soft transition ${
                paused
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                  : "border border-ink-200 bg-white text-ink-800 hover:border-ink-300"
              }`}
            >
              {paused ? "Continuar" : "Pausar"}
            </button>
          )}
          {queue.length > 0 && (
            <button
              onClick={stop}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 shadow-soft hover:border-rose-300"
            >
              Detener
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-700 shadow-inner">
          Velocidad:
          <select
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            className="rounded-md border border-ink-100 bg-white px-2 py-1 text-sm focus:border-ink-400 focus:outline-none"
          >
            {speedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-2 rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-700 shadow-inner">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-800">Mostrar:</span>
            <div className="flex flex-wrap gap-1 rounded-full bg-ink-50 p-1">
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
                        active ? next.delete(key) : next.add(key)
                        return next
                      })
                    }
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-white"
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

      <div className="mt-4 rounded-2xl border border-ink-100 bg-gradient-to-b from-white to-ink-50 px-6 py-8 text-center shadow-inner">
        {current ? (
          <>
            {showModes.has("term") && (
              <div className="text-2xl font-bold text-ink-900">{current.term}</div>
            )}
            {showModes.has("translation") && (
              <div className="mt-2 text-xl font-semibold text-ink-800">{current.translation}</div>
            )}
            {showModes.has("notes") && current.notes && (
              <div className="mt-3 text-sm text-ink-700 opacity-80 line-clamp-3">
                {current.notes}
              </div>
            )}
            {showModes.has("notes") && !current.notes && (
              <div className="text-sm text-ink-500">Sin notas para esta palabra.</div>
            )}
          </>
        ) : (
          <div className="text-sm text-ink-600">
            Usa el modo “Visor rápido” en los botones de Practicar o selecciona palabras en la tabla para iniciar.
          </div>
        )}
        {ended && lastRun && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                if (finishTimer.current) window.clearTimeout(finishTimer.current)
                resetSession(false, false)
                startWithIds(lastRun.ids, lastRun.rounds)
              }}
              className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg"
            >
              Repetir
            </button>
            <span className="text-xs text-ink-500">Se detuvo al completar las rondas.</span>
          </div>
        )}
      </div>
    </section>
  )
}

export default FlashViewer
