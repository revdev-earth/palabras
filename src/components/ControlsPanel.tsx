import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import { setSelectedIds, setSettings, setWordsAndSettings, startPractice, wipeAll } from "../store"
import { daysBetween, effectiveScore, filterAndSortWords, shuffle } from "../utils"
import { PracticeScoreBucket, Word } from "../types"
import StorageTools from "./StorageTools"
import FlashViewer from "./FlashViewer"

const dateOptions = [
  { key: "any", label: "Cualquiera" },
  { key: "today", label: "Hoy" },
  { key: "yesterday", label: "Ayer" },
  { key: "last3", label: "Últimos 3 días" },
  { key: "last7", label: "Últimos 7 días" },
  { key: "older7", label: "+7 días" },
  { key: "never", label: "Sin práctica" },
] as const

function ControlsPanel() {
  const dispatch = useDispatch()
  const settings = useSelector((s) => s.app.settings)
  const sortBy = settings.sortBy
  const search = useSelector((s) => s.app.search)
  const searchField = useSelector((s) => s.app.searchField)
  const practiceRounds = settings.practiceRounds
  const practiceCount = settings.practiceCount
  const practiceScoreBuckets = settings.practiceScoreBuckets || []
  const practiceDateFilter = settings.practiceDateFilter || "any"
  const practiceSpeakEnabled = settings.practiceSpeakEnabled
  const practiceVoiceId = settings.practiceVoiceId
  const practiceVoiceLang = settings.practiceVoiceLang
  const practiceVoiceRate = settings.practiceVoiceRate || 0.95
  const words = useSelector((s) => s.app.words)
  const selectedIds = useSelector((s) => s.app.selectedIds)
  const importRef = useRef<HTMLInputElement | null>(null)
  const [showStorageTools, setShowStorageTools] = useState(false)
  const [practiceMode, setPracticeMode] = useState<"interactive" | "flash">("flash")

  const availableScoreBuckets: PracticeScoreBucket[] = useMemo(() => {
    const buckets = new Set<string>()
    words.forEach((w) => {
      const s = Math.max(0, Math.round(effectiveScore(w)))
      if (s >= 9) buckets.add("9+")
      else buckets.add(String(s))
    })
    return Array.from(buckets).sort((a, b) => {
      if (a === "9+") return 1
      if (b === "9+") return -1
      return Number(a) - Number(b)
    }) as PracticeScoreBucket[]
  }, [words])

  useEffect(() => {
    const cleaned = practiceScoreBuckets.filter((b) => availableScoreBuckets.includes(b))
    if (cleaned.length !== practiceScoreBuckets.length) {
      dispatch(setSettings({ practiceScoreBuckets: cleaned }))
    }
  }, [availableScoreBuckets, practiceScoreBuckets, dispatch])

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceLangOptions, setVoiceLangOptions] = useState<string[]>([])
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices()
      if (list.length) {
        setVoices(list)
        const langs = Array.from(
          new Set(
            list
              .map((v) => v.lang?.slice(0, 2).toLowerCase())
              .filter((l) => l === "es" || l === "en" || l === "de")
          )
        )
        setVoiceLangOptions(langs)
        if (!practiceVoiceLang && langs.length) dispatch(setSettings({ practiceVoiceLang: langs[0] }))
        if (!practiceVoiceId) {
          const preferred =
            list.find((v) => v.lang?.toLowerCase().startsWith(practiceVoiceLang || "es")) ||
            list.find((v) => v.lang?.toLowerCase().startsWith("es")) ||
            list[0]
          if (preferred) dispatch(setSettings({ practiceVoiceId: preferred.voiceURI || preferred.name }))
        }
      }
    }
    loadVoices()
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
  }, [dispatch, practiceVoiceId, practiceVoiceLang])

  const filteredWords = filterAndSortWords(words, search, sortBy, searchField)

  const startPracticeWithIds = (ids: string[]) => {
    if (!ids.length) {
      window.alert("No hay palabras para practicar.")
      return
    }
    if (practiceMode === "interactive") {
      dispatch(startPractice(ids))
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      dispatch(setSelectedIds(ids))
      window.dispatchEvent(
        new CustomEvent("flashviewer:start", { detail: { ids, rounds: practiceRounds } })
      )
    }
  }

  const matchesScoreBucket = (w: Word) => {
    if (!practiceScoreBuckets.length) return true
    const s = Math.max(0, Math.round(effectiveScore(w)))
    return practiceScoreBuckets.some((bucket) => {
      if (bucket === "9+") return s >= 9
      return s === Number(bucket)
      return false
    })
  }

  const matchesDateFilter = (w: { lastPracticedAt: string | null }) => {
    if (practiceDateFilter === "any") return true
    if (!w.lastPracticedAt) return practiceDateFilter === "never"
    const days = daysBetween(new Date().toISOString(), w.lastPracticedAt)
    if (practiceDateFilter === "today") return days === 0
    if (practiceDateFilter === "yesterday") return days === 1
    if (practiceDateFilter === "last3") return days <= 3
    if (practiceDateFilter === "last7") return days <= 7
    if (practiceDateFilter === "older7") return days > 7
    if (practiceDateFilter === "never") return false
    return true
  }

  const pickWordsByBasis = () => {
    const filtered = words.filter((w) => matchesScoreBucket(w) && matchesDateFilter(w))
    const pool = filtered.length ? filtered : words
    if (!pool.length) return []
    const n = Math.max(1, Math.min(practiceCount, pool.length))
    const randomized = shuffle([...pool])
    return randomized.slice(0, n)
  }

  const toggleScoreBucket = (bucket: PracticeScoreBucket) => {
    const next = practiceScoreBuckets.includes(bucket)
      ? practiceScoreBuckets.filter((b) => b !== bucket)
      : [...practiceScoreBuckets, bucket]
    dispatch(setSettings({ practiceScoreBuckets: next }))
  }

  const startRandom10 = () => {
    if (!words.length) {
      window.alert("No hay palabras aún. Añade algunas primero.")
      return
    }
    const picked = pickWordsByBasis()
    startPracticeWithIds(picked.map((w) => w.id))
  }

  const startFirst10 = () => {
    const n = Math.max(1, Math.min(practiceCount, filteredWords.length))
    startPracticeWithIds(filteredWords.slice(0, n).map((w) => w.id))
  }

  const startSelected = () => startPracticeWithIds(selectedIds)

  const pickRandomAndSelect = () => {
    const picked = pickWordsByBasis()
    if (!picked.length) {
      window.alert("No hay palabras para seleccionar con el filtro actual.")
      return
    }
    dispatch(setSelectedIds(picked.map((w) => w.id)))
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings, words }, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vocab-tracker-export.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File) => {
    try {
    const text = await file.text()
    const obj = JSON.parse(text)
    if (!obj || !Array.isArray(obj.words)) throw new Error("Formato inválido")
    dispatch(
      setWordsAndSettings({
        words: obj.words,
        settings: { ...settings, ...(obj.settings || {}) },
      })
    )
      dispatch(setSelectedIds([]))
      window.alert("Importación completa")
    } catch (err) {
      window.alert("No se pudo importar: " + (err as Error).message)
    } finally {
      if (importRef.current) importRef.current.value = ""
    }
  }

  const onWipe = () => {
    if (!window.confirm("Esto borrará todas las palabras guardadas en este navegador. ¿Seguro?"))
      return
    dispatch(wipeAll())
    dispatch(setSelectedIds([]))
  }

  return (
    <section className="rounded-2xl border border-ink-100 bg-white/90 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportData}
          className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-sm hover:border-ink-300"
        >
          Exportar (.json)
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-sm hover:border-ink-300"
        >
          Importar
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void importData(file)
          }}
        />
        <button
          onClick={onWipe}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:border-rose-300"
        >
          Borrar todo
        </button>
      </div>

      <details
        className="mt-3 rounded-2xl border border-ink-100 bg-ink-50/70 p-4 shadow-inner"
        open={showStorageTools}
        onToggle={(e) => setShowStorageTools((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-sm font-semibold text-ink-900">
          Ver/editar JSON guardado y adjuntar más datos
        </summary>
        <StorageTools />
      </details>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            Rondas de práctica:
            <input
              type="number"
              min={1}
              max={20}
              value={practiceRounds}
              onChange={(e) => {
                const n = Math.max(1, Math.min(20, Number.parseInt(e.target.value, 10) || 1))
                dispatch(setSettings({ practiceRounds: n }))
              }}
              className="w-20 rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
            />
          </label>
          <p className="text-xs text-ink-600">
            Veces que cada palabra aparecerá en la sesión (se barajan cada ronda).
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            Palabras por sesión:
            <input
              type="number"
              min={1}
              max={200}
              value={practiceCount}
              onChange={(e) => {
                const n = Math.max(1, Math.min(200, Number.parseInt(e.target.value, 10) || 1))
                dispatch(setSettings({ practiceCount: n }))
              }}
              className="w-24 rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
            />
          </label>
          <p className="text-xs text-ink-600">
            Se usa en “Practicar {practiceCount} (aleatorio)” y “primeras de la lista”.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          Configuración para selección aleatoria
          <span className="text-xs font-normal text-ink-600">(aplica al botón “aleatorio”)</span>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              Filtro de score:
              <span className="text-xs font-normal text-ink-600">
                (elige uno o varios, vacío = todos)
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {availableScoreBuckets.map((key) => {
                const active = practiceScoreBuckets.includes(key)
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleScoreBucket(key)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                      active ? "bg-ink-900 text-white shadow-soft" : "text-ink-800 hover:bg-white"
                    }`}
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              Filtro por fecha de práctica:
              <span className="text-xs font-normal text-ink-600">(elige uno)</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {dateOptions.map((opt) => {
                const active = practiceDateFilter === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => dispatch(setSettings({ practiceDateFilter: opt.key }))}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                      active ? "bg-ink-900 text-white shadow-soft" : "text-ink-800 hover:bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="rounded-xl border border-ink-100 bg-white/80 p-3 shadow-inner">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-800">
              Seleccionar palabras aleatoriamente
              <span className="text-xs font-normal text-ink-600">
                (usa los filtros y el número de “Palabras por sesión”)
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={pickRandomAndSelect}
                className="rounded-lg bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Seleccionar aleatorio
              </button>
              <button
                type="button"
                onClick={() => dispatch(setSelectedIds([]))}
                className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-800 hover:border-ink-300"
              >
                Limpiar selección
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          Configuración de reproducción (voz)
          <span className="text-xs font-normal text-ink-600">(aplica al visor y al botón 🔊 de la tabla)</span>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr,1fr]">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={practiceSpeakEnabled}
              onChange={(e) => dispatch(setSettings({ practiceSpeakEnabled: e.target.checked }))}
            />
            Habilitar pronunciación
          </label>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-ink-800">Idioma:</span>
            {voiceLangOptions.length > 0 ? (
              <select
                value={practiceVoiceLang}
                onChange={(e) => {
                  const lang = e.target.value
                  dispatch(setSettings({ practiceVoiceLang: lang }))
                  const candidate =
                    voices.find((v) => v.lang?.toLowerCase().startsWith(lang)) ||
                    voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ||
                    voices[0]
                  if (candidate) dispatch(setSettings({ practiceVoiceId: candidate.voiceURI || candidate.name }))
                }}
                className="rounded-md border border-ink-100 bg-white px-2 py-1 text-sm focus:border-ink-400 focus:outline-none"
              >
                {voiceLangOptions.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-ink-500">No hay voces en es/en/de disponibles.</span>
            )}
          </div>
          <div className="lg:col-span-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-ink-800">Voz:</span>
            {practiceSpeakEnabled && voices.length > 0 ? (
              <select
                value={practiceVoiceId}
                onChange={(e) => dispatch(setSettings({ practiceVoiceId: e.target.value }))}
                className="min-w-[200px] rounded-md border border-ink-100 bg-white px-2 py-1 text-sm focus:border-ink-400 focus:outline-none"
              >
                {voices
                  .filter((v) =>
                    practiceVoiceLang ? v.lang?.toLowerCase().startsWith(practiceVoiceLang) : true
                  )
                  .map((v) => (
                    <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
            ) : (
              <span className="text-xs text-ink-500">No se encontraron voces en este navegador.</span>
            )}
          </div>
          <div className="lg:col-span-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-ink-800">Velocidad de voz:</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={practiceVoiceRate}
              onChange={(e) =>
                dispatch(
                  setSettings({
                    practiceVoiceRate: Math.min(1.5, Math.max(0.5, Number(e.target.value) || 1)),
                  })
                )
              }
              className="accent-ink-900"
            />
            <span className="rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-semibold text-ink-800 shadow-inner">
              {practiceVoiceRate.toFixed(2)}x
            </span>
            <span className="text-xs text-ink-600">Úsalo si la voz suena muy lenta o muy rápida.</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-ink-100 bg-ink-50/60 p-2 text-sm text-ink-700 shadow-inner">
        <span className="font-semibold text-ink-800">Modo:</span>
        {[
          { key: "interactive", label: "Práctica interactiva" },
          { key: "flash", label: "Visor rápido" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setPracticeMode(opt.key as "interactive" | "flash")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              practiceMode === opt.key ? "bg-ink-900 text-white shadow-soft" : "text-ink-800 hover:bg-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-xs text-ink-600">
          El modo aplica a los botones de “Practicar”.
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          onClick={startRandom10}
          className="rounded-xl border border-ink-100 bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Practicar {practiceCount} (aleatorio)
        </button>
        <button
          onClick={startFirst10}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm hover:border-ink-300"
        >
          Practicar {practiceCount} (primeras de la lista)
        </button>
        <button
          onClick={startSelected}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm hover:border-ink-300"
        >
          Practicar selección
        </button>
      </div>

      <div className="mt-4">
        <FlashViewer />
      </div>
    </section>
  )
}

export default ControlsPanel
