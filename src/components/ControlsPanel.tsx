import { useRef, useState } from "react"
import { useDispatch, useSelector } from "../hooks"
import { setSelectedIds, setSettings, setWordsAndSettings, startPractice, wipeAll } from "../store"
import { filterAndSortWords, sampleWords } from "../utils"
import StorageTools from "./StorageTools"

function ControlsPanel() {
  const dispatch = useDispatch()
  const settings = useSelector((s) => s.app.settings)
  const sortBy = settings.sortBy
  const search = useSelector((s) => s.app.search)
  const searchField = useSelector((s) => s.app.searchField)
  const practiceRounds = settings.practiceRounds
  const practiceCount = settings.practiceCount
  const words = useSelector((s) => s.app.words)
  const selectedIds = useSelector((s) => s.app.selectedIds)
  const importRef = useRef<HTMLInputElement | null>(null)
  const [showStorageTools, setShowStorageTools] = useState(false)

  const filteredWords = filterAndSortWords(words, search, sortBy, searchField)

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
    const n = Math.max(1, Math.min(practiceCount, words.length))
    startPracticeWithIds(sampleWords(words, n).map((w) => w.id))
  }

  const startFirst10 = () => {
    const n = Math.max(1, Math.min(practiceCount, filteredWords.length))
    startPracticeWithIds(filteredWords.slice(0, n).map((w) => w.id))
  }

  const startSelected = () => startPracticeWithIds(selectedIds)

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
