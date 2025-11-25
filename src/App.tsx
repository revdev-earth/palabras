import { useEffect, useMemo, useRef, useState } from "react"

const STORE_KEY = "vocab-tracker-v1"
const SETTINGS_KEY = "vocab-tracker-settings"
const DECAY_PER_DAY = 1
const PRACTICE_REPS = 5

const todayKey = () => new Date().toISOString().slice(0, 10)
const nowISO = () => new Date().toISOString()

const defaultSettings: Settings = { sortBy: "scoreAsc", lastSeenDay: todayKey() }

type SortBy =
  | "score"
  | "scoreAsc"
  | "lastPracticedAt"
  | "lastPracticedAtAsc"
  | "createdAt"
  | "term"

type Word = {
  id: string
  term: string
  translation: string
  notes: string
  baseScore: number
  lastPracticedAt: string | null
  createdAt: string
}

type Settings = {
  sortBy: SortBy
  lastSeenDay: string
}

type PracticeStats = Record<string, { correct: number; total: number }>

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const daysBetween = (aISO: string, bISO: string) => {
  const a = new Date(aISO).setHours(0, 0, 0, 0)
  const b = new Date(bISO).setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((a - b) / 86400000))
}

const effectiveScore = (word: Word) => {
  if (!word.lastPracticedAt) return word.baseScore || 0
  const d = daysBetween(new Date().toISOString(), word.lastPracticedAt)
  return Math.max(0, (word.baseScore || 0) - DECAY_PER_DAY * d)
}

const formatDate = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—")

const shuffle = <T,>(arr: T[]) => {
  const c = [...arr]
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[c[i], c[j]] = [c[j], c[i]]
  }
  return c
}

const breakAdjDuplicates = (ids: string[]) => {
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] === ids[i - 1]) {
      let j = i + 1
      while (j < ids.length && ids[j] === ids[i]) j++
      if (j < ids.length) {
        ;[ids[i], ids[j]] = [ids[j], ids[i]]
      }
    }
  }
  return ids
}

const sampleWords = (arr: Word[], n: number) => {
  if (arr.length <= n) return [...arr]
  const c = [...arr]
  shuffle(c)
  return c.slice(0, n)
}

const buildQueue = (ids: string[]) => {
  const q: string[] = []
  for (const id of ids) for (let i = 0; i < PRACTICE_REPS; i++) q.push(id)
  shuffle(q)
  return breakAdjDuplicates(q)
}

const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`

function App() {
  const [words, setWords] = useState<Word[]>(() => safeParse(localStorage.getItem(STORE_KEY), []))
  const [settings, setSettings] = useState<Settings>(() => {
    const parsed = safeParse<Partial<Settings>>(localStorage.getItem(SETTINGS_KEY), defaultSettings)
    return { ...defaultSettings, ...parsed }
  })
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  const [term, setTerm] = useState("")
  const [translation, setTranslation] = useState("")
  const [notes, setNotes] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ term: "", translation: "", notes: "" })

  const [currentPracticeSelection, setCurrentPracticeSelection] = useState<Word[]>([])
  const [practiceQueue, setPracticeQueue] = useState<string[]>([])
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [practiceStats, setPracticeStats] = useState<PracticeStats>({})
  const [summary, setSummary] = useState<string | null>(null)
  const [alwaysShow, setAlwaysShow] = useState(false)
  const [reveal, setReveal] = useState(false)

  const importRef = useRef<HTMLInputElement | null>(null)
  const translationRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(words))
  }, [words])

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const tickNewDay = () => {
      setSettings((prev) => {
        const today = todayKey()
        if (prev.lastSeenDay === today) return prev
        return { ...prev, lastSeenDay: today }
      })
    }
    tickNewDay()
    const id = setInterval(tickNewDay, 60 * 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setReveal(alwaysShow && practiceQueue.length > 0)
  }, [alwaysShow, practiceQueue.length])

  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase()
    const sortBy = settings.sortBy || defaultSettings.sortBy
    const data = words.filter(
      (w) =>
        !q ||
        w.term.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        (w.notes || "").toLowerCase().includes(q)
    )

    data.sort((a, b) => {
      if (sortBy === "score") return effectiveScore(b) - effectiveScore(a)
      if (sortBy === "scoreAsc") return effectiveScore(a) - effectiveScore(b)
      if (sortBy === "lastPracticedAt")
        return new Date(b.lastPracticedAt || 0).getTime() - new Date(a.lastPracticedAt || 0).getTime()
      if (sortBy === "lastPracticedAtAsc")
        return new Date(a.lastPracticedAt || 0).getTime() - new Date(b.lastPracticedAt || 0).getTime()
      if (sortBy === "createdAt") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "term") return a.term.localeCompare(b.term)
      return 0
    })
    return data
  }, [search, settings.sortBy, words])

  const dueCount = useMemo(
    () => words.filter((w) => effectiveScore(w) >= 2).length,
    [settings.lastSeenDay, words]
  )

  const practiceWord = useMemo(() => {
    const id = practiceQueue[practiceIndex]
    return words.find((w) => w.id === id) || null
  }, [practiceIndex, practiceQueue, words])

  const selectAllChecked =
    filteredWords.length > 0 && filteredWords.every((w) => selectedIds.has(w.id))

  const practiceActive = practiceQueue.length > 0

  const handleAddWord = () => {
    const t = term.trim()
    const tr = translation.trim()
    if (!t || !tr) return
    setWords((prev) => [
      {
        id: genId(),
        term: t,
        translation: tr,
        notes,
        baseScore: 0,
        lastPracticedAt: null,
        createdAt: nowISO(),
      },
      ...prev,
    ])
    setTerm("")
    setTranslation("")
    setNotes("")
    translationRef.current?.focus()
  }

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleExpandNotes = (id: string) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleScore = (id: string, delta: number) => {
    if (editingId && editingId !== id) {
      window.alert("Primero guarda o cancela la edición actual.")
      return
    }
    setWords((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              baseScore: Math.max(0, (w.baseScore || 0) + delta),
              lastPracticedAt: nowISO(),
            }
          : w
      )
    )
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("¿Borrar palabra?")) return
    setWords((prev) => prev.filter((w) => w.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    if (editingId === id) setEditingId(null)
  }

  const startEdit = (word: Word) => {
    if (editingId && editingId !== word.id) {
      const ok = window.confirm(
        "Tienes otra fila en edición. ¿Descartar cambios y editar esta?"
      )
      if (!ok) return
    }
    setEditingId(word.id)
    setEditDraft({ term: word.term, translation: word.translation, notes: word.notes })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = (id: string) => {
    if (!editDraft.term.trim() || !editDraft.translation.trim()) {
      window.alert("Palabra y traducción son obligatorias.")
      return
    }
    setWords((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              term: editDraft.term.trim(),
              translation: editDraft.translation.trim(),
              notes: editDraft.notes,
            }
          : w
      )
    )
    setEditingId(null)
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
      setWords(obj.words)
      setSettings({ ...defaultSettings, ...(obj.settings || {}) })
      setSelectedIds(new Set())
      setExpandedNotes(new Set())
      window.alert("Importación completa")
    } catch (err) {
      window.alert("No se pudo importar: " + (err as Error).message)
    } finally {
      if (importRef.current) importRef.current.value = ""
    }
  }

  const wipeAll = () => {
    if (
      !window.confirm(
        "Esto borrará todas las palabras guardadas en este navegador. ¿Seguro?"
      )
    )
      return
    setWords([])
    setSelectedIds(new Set())
    setExpandedNotes(new Set())
  }

  const startPracticeWithIds = (ids: string[]) => {
    if (!ids.length) {
      window.alert("No hay palabras para practicar.")
      return
    }
    if (editingId) {
      const ok = window.confirm(
        "Tienes una fila en edición. ¿Descartar cambios para iniciar la práctica?"
      )
      if (!ok) return
      setEditingId(null)
    }
    const selected = ids
      .map((id) => words.find((w) => w.id === id))
      .filter((x): x is Word => Boolean(x))
    const stats = selected.reduce<PracticeStats>((acc, w) => {
      acc[w.id] = { correct: 0, total: 0 }
      return acc
    }, {})

    setCurrentPracticeSelection(selected)
    setPracticeStats(stats)
    setPracticeQueue(buildQueue(ids))
    setPracticeIndex(0)
    setCorrectCount(0)
    setWrongCount(0)
    setSummary(null)
    setReveal(alwaysShow)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const startRandom10 = () => {
    if (!words.length) {
      window.alert("No hay palabras aún. Añade algunas primero.")
      return
    }
    startPracticeWithIds(sampleWords(words, Math.min(10, words.length)).map((w) => w.id))
  }

  const startFirst10 = () => {
    startPracticeWithIds(filteredWords.slice(0, 10).map((w) => w.id))
  }

  const startSelected = () => startPracticeWithIds(Array.from(selectedIds))

  const finishSession = (stats: PracticeStats, okCount: number, wrong: number) => {
    let deltaTotal = 0
    setWords((prev) =>
      prev.map((w) => {
        const s = stats[w.id]
        if (!s) return w
        let delta = 0
        if (s.correct >= 4) delta = 2
        else if (s.correct === 3) delta = 1
        if (!delta) return w
        deltaTotal += delta
        return { ...w, baseScore: Math.max(0, (w.baseScore || 0) + delta) }
      })
    )
    const total = practiceQueue.length
    const pct = total ? Math.round((okCount / total) * 100) : 0
    setSummary(`Resumen: ${okCount}/${total} correctas (${pct}%). Puntos agregados: +${deltaTotal}.`)
    setPracticeQueue([])
    setPracticeIndex(0)
    setCurrentPracticeSelection([])
    setPracticeStats({})
    setReveal(false)
    setCorrectCount(okCount)
    setWrongCount(wrong)
  }

  const markPractice = (ok: boolean) => {
    const id = practiceQueue[practiceIndex]
    if (!id) return
    const nextIndex = practiceIndex + 1
    const nextCorrect = ok ? correctCount + 1 : correctCount
    const nextWrong = ok ? wrongCount : wrongCount + 1

    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, lastPracticedAt: nowISO() } : w))
    )

    const updatedStats: PracticeStats = {
      ...practiceStats,
      [id]: {
        correct: (practiceStats[id]?.correct || 0) + (ok ? 1 : 0),
        total: (practiceStats[id]?.total || 0) + 1,
      },
    }
    setPracticeStats(updatedStats)
    setCorrectCount(nextCorrect)
    setWrongCount(nextWrong)
    setPracticeIndex(nextIndex)
    setReveal(alwaysShow)

    if (nextIndex >= practiceQueue.length) finishSession(updatedStats, nextCorrect, nextWrong)
  }

  const exitPractice = () => {
    if (!practiceActive) return
    finishSession(practiceStats, correctCount, wrongCount)
  }

  const progressPct = practiceQueue.length
    ? Math.min(100, Math.round((practiceIndex / practiceQueue.length) * 100))
    : 0

  const selectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        filteredWords.forEach((w) => next.delete(w.id))
        return next
      })
      return
    }
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredWords.forEach((w) => next.add(w.id))
      return next
    })
  }

  const badge = (label: string) => (
    <span className="rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-xs text-ink-700 shadow-sm">
      {label}
    </span>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">Vocab Tracker</p>
          <h1 className="text-3xl font-semibold text-ink-900">Tu cuaderno de palabras</h1>
          <p className="text-ink-600">Guarda, repasa y sigue tu progreso sin perder el ritmo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {badge(`Palabras: ${words.length}`)}
          {badge(`Para hoy: ${dueCount}`)}
        </div>
      </header>

      {!practiceActive && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr,1.4fr]">
          <section className="rounded-2xl border border-ink-100 bg-white/80 p-5 shadow-soft backdrop-blur">
            <h2 className="mb-3 text-lg font-semibold text-ink-900">Agregar palabra</h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Palabra"
                  className="w-full flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-base shadow-inner focus:border-ink-400 focus:outline-none"
                />
                <input
                  ref={translationRef}
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddWord()
                  }}
                  placeholder="Traducción"
                  className="w-full flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-base shadow-inner focus:border-ink-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddWord}
                  className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Agregar
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas (opcional) — pega aquí tu ‘plantilla’ con saltos de línea"
                className="w-full rounded-xl border border-ink-100 bg-white px-3 py-3 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                rows={4}
              />
              <p className="text-xs text-ink-500">Tip: puedes añadir rápido con Enter en "Traducción".</p>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white/90 p-5 shadow-soft backdrop-blur">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                Ordenar por:
                <select
                  value={settings.sortBy}
                  onChange={(e) => setSettings((s) => ({ ...s, sortBy: e.target.value as SortBy }))}
                  className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                >
                  <option value="score">Score (efectivo)</option>
                  <option value="scoreAsc">Score (menor→mayor)</option>
                  <option value="lastPracticedAt">Última práctica (más reciente)</option>
                  <option value="lastPracticedAtAsc">Última práctica (más antigua)</option>
                  <option value="createdAt">Fecha agregado</option>
                  <option value="term">Palabra (A→Z)</option>
                </select>
              </label>
              <label className="flex flex-1 items-center gap-2 text-sm text-ink-700">
                Búsqueda:
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filtrar por palabra o traducción..."
                  className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
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
                onClick={wipeAll}
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:border-rose-300"
              >
                Borrar todo
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                onClick={startRandom10}
                className="rounded-xl border border-ink-100 bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Practicar 10 (aleatorio)
              </button>
              <button
                onClick={startFirst10}
                className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm hover:border-ink-300"
              >
                Practicar 10 (primeras de la lista)
              </button>
              <button
                onClick={startSelected}
                className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-900 shadow-sm hover:border-ink-300"
              >
                Practicar selección
              </button>
            </div>
          </section>
        </div>
      )}

      {!practiceActive && (
        <section className="mt-5 overflow-hidden rounded-2xl border border-ink-100 bg-white/90 shadow-soft backdrop-blur">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-ink-900">Listado de palabras</h2>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={selectAllChecked}
                onChange={(e) => selectAll(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-ink-800"
              />
              Seleccionar todo (vista actual)
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-ink-800">
              <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-600">
                <tr>
                  <th className="px-4 py-3">Sel.</th>
                  <th className="px-4 py-3">Palabra</th>
                  <th className="px-4 py-3">Traducción</th>
                  <th className="px-4 py-3">Notas</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3">Última práctica</th>
                  <th className="px-4 py-3">Agregado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredWords.map((w) => {
                  const isEditing = editingId === w.id
                  const expanded = expandedNotes.has(w.id)
                  return (
                    <tr key={w.id} className="border-b border-ink-50 hover:bg-ink-50/50">
                      <td className="px-4 py-3 align-top">
                        <input
                          type="checkbox"
                          disabled={isEditing}
                          checked={selectedIds.has(w.id)}
                          onChange={(e) => toggleSelect(w.id, e.target.checked)}
                          className="h-4 w-4 rounded border-ink-300 text-ink-800"
                        />
                      </td>
                      <td className="px-4 py-3 align-top font-semibold text-ink-900">
                        {isEditing ? (
                          <input
                            value={editDraft.term}
                            onChange={(e) => setEditDraft((d) => ({ ...d, term: e.target.value }))}
                            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{w.term}</span>
                            {currentPracticeSelection.some((x) => x.id === w.id) && (
                              <span className="rounded-md border border-ink-100 bg-ink-50 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                                en práctica
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-ink-800">
                        {isEditing ? (
                          <input
                            value={editDraft.translation}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, translation: e.target.value }))
                            }
                            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                          />
                        ) : (
                          w.translation
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-ink-700">
                        {isEditing ? (
                          <textarea
                            value={editDraft.notes}
                            onChange={(e) => setEditDraft((d) => ({ ...d, notes: e.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
                          />
                        ) : w.notes ? (
                          <button
                            type="button"
                            onClick={() => toggleExpandNotes(w.id)}
                            className="group w-full text-left text-ink-700"
                          >
                            <div className={expanded ? "whitespace-pre-wrap" : "note-clamp whitespace-pre-wrap"}>
                              {w.notes}
                            </div>
                            <span className="text-[11px] text-ink-500 group-hover:text-ink-700">
                              {expanded ? "Ocultar" : "Ver más"}
                            </span>
                          </button>
                        ) : (
                          <span className="text-ink-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center align-top">
                        <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-800">
                          {effectiveScore(w).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-ink-600">{formatDate(w.lastPracticedAt)}</td>
                      <td className="px-4 py-3 align-top text-ink-600">{formatDate(w.createdAt)}</td>
                      <td className="px-4 py-3 align-top text-ink-800">
                        {isEditing ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => saveEdit(w.id)}
                              className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-800"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {[-1, 1, 2].map((d) => (
                              <button
                                key={d}
                                onClick={() => handleScore(w.id, d)}
                                className="rounded-lg border border-ink-200 px-2 py-1 text-[11px] font-semibold text-ink-800 hover:border-ink-300"
                              >
                                {d > 0 ? `+${d}` : d}
                              </button>
                            ))}
                            <button
                              onClick={() => startEdit(w)}
                              className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:border-ink-300"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(w.id)}
                              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:border-rose-300"
                            >
                              Borrar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {!filteredWords.length && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-500">
                      No hay palabras. Añade algunas para comenzar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {practiceActive && practiceWord && (
        <section className="rounded-2xl border border-ink-100 bg-white/95 p-5 shadow-soft">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-700">
            {badge(`Palabras: ${currentPracticeSelection.length}`)}
            {badge(`Reps/Palabra: ${PRACTICE_REPS}`)}
            {badge(`Progreso: ${Math.min(practiceIndex, practiceQueue.length)} / ${practiceQueue.length}`)}
            {badge(`✔️ ${correctCount} · ❌ ${wrongCount}`)}
            <label className="flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
              <input
                type="checkbox"
                checked={alwaysShow}
                onChange={(e) => setAlwaysShow(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-ink-800"
              />
              Mostrar siempre traducción y notas
            </label>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ink-500 to-ink-800 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <details className="mt-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3 text-sm text-ink-700">
            <summary className="cursor-pointer select-none font-semibold">Ver palabras seleccionadas</summary>
            <div className="mt-2 space-y-1 text-ink-700">
              {currentPracticeSelection.map((w) => (
                <div key={w.id} className="rounded-lg bg-white px-3 py-2 shadow-inner">
                  <strong>{w.term}</strong> → {w.translation}
                </div>
              ))}
            </div>
          </details>

          <div className="mt-4 cursor-pointer rounded-2xl border border-ink-100 bg-gradient-to-b from-white to-ink-50 px-6 py-8 text-center shadow-soft"
            onClick={() => {
              if (!alwaysShow) setReveal((r) => !r)
            }}
          >
            <div className="text-2xl font-bold text-ink-900">{practiceWord.term}</div>
            {(reveal || alwaysShow) && (
              <>
                <div className="mt-3 text-xl font-semibold text-ink-800">
                  {practiceWord.translation}
                </div>
                {practiceWord.notes && (
                  <div className="mt-2 whitespace-pre-wrap text-sm text-ink-700">
                    {practiceWord.notes}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => {
                if (!alwaysShow) setReveal((r) => !r)
              }}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-800 hover:border-ink-300"
            >
              Mostrar / ocultar
            </button>
            <button
              onClick={() => markPractice(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg"
            >
              ✔️ La recordé
            </button>
            <button
              onClick={() => markPractice(false)}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lg"
            >
              ❌ No la recordé
            </button>
            <button
              onClick={exitPractice}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:border-rose-300"
            >
              Terminar sesión
            </button>
          </div>

          {summary && (
            <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/80 px-4 py-3 text-sm text-ink-800">
              {summary}
            </div>
          )}
        </section>
      )}

      {!practiceActive && summary && (
        <section className="mt-4 rounded-xl border border-ink-100 bg-ink-50/80 px-4 py-3 text-sm text-ink-800">
          {summary}
        </section>
      )}
    </div>
  )
}

export default App
