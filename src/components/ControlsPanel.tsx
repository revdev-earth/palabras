import { useRef, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import {
  setSearch,
  setSelectedIds,
  setSettings,
  setWordsAndSettings,
  startPractice,
  wipeAll,
} from "../store"
import { filterAndSortWords, sampleWords } from "../utils"
import { SortBy } from "../types"
import StorageTools from "./StorageTools"

function ControlsPanel() {
  const dispatch = useDispatch()
  const sortBy = useSelector((s) => s.app.settings.sortBy)
  const search = useSelector((s) => s.app.search)
  const words = useSelector((s) => s.app.words)
  const selectedIds = useSelector((s) => s.app.selectedIds)
  const importRef = useRef<HTMLInputElement | null>(null)
  const [showStorageTools, setShowStorageTools] = useState(false)

  const filteredWords = filterAndSortWords(words, search, sortBy)

  const startPracticeWithIds = (ids: string[]) => {
    if (!ids.length) {
      window.alert("No hay palabras para practicar.")
      return
    }
    dispatch(startPractice(ids))
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

  const startSelected = () => startPracticeWithIds(selectedIds)

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings: { sortBy }, words }, null, 2)], {
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
          settings: { sortBy, ...(obj.settings || {}) },
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
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-700">
          Ordenar por:
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSettings({ sortBy: e.target.value as SortBy }))}
            className="rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
          >
            <option value="score">Score (efectivo)</option>
            <option value="scoreAsc">Score (menor→mayor)</option>
            <option value="lastPracticedAt">Última práctica (más reciente)</option>
            <option value="lastPracticedAtAsc">Última práctica (más antigua)</option>
            <option value="createdAt">Fecha agregado (recientes primero)</option>
            <option value="createdAtAsc">Fecha agregado (antiguas primero)</option>
            <option value="term">Palabra (A→Z)</option>
            <option value="termDesc">Palabra (Z→A)</option>
            <option value="translation">Traducción (A→Z)</option>
            <option value="translationDesc">Traducción (Z→A)</option>
            <option value="notes">Notas (A→Z)</option>
            <option value="notesDesc">Notas (Z→A)</option>
          </select>
        </label>
        <label className="flex flex-1 items-center gap-2 text-sm text-ink-700">
          Búsqueda:
          <input
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
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
          onClick={onWipe}
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

      <details
        className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/70 p-4 shadow-inner"
        open={showStorageTools}
        onToggle={(e) => setShowStorageTools((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-sm font-semibold text-ink-900">
          Ver/editar JSON guardado y adjuntar más datos
        </summary>
        <StorageTools />
      </details>
    </section>
  )
}

export default ControlsPanel
