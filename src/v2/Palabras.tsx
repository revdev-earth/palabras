import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import { V2_STORE_KEY, setUseMemory, setWords } from "+/redux/slices/v2Slice"

import { AudioPanel } from "./AudioPanel"
import { getMemoryWords, setMemoryWords } from "./memoryStore"

import { Biblioteca } from "./biblioteca/Biblioteca"
import { ReconocimientoDePalabrasEnElTexto } from "./ReconocimientoDePalabrasEnElTexto"

function Palabras() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.v2Words.words)
  const useMemory = useSelector((s) => s.v2Words.useMemory)
  const [tab, setTab] = useState<"reconocimiento" | "biblioteca">("biblioteca")
  const [showMemoryMenu, setShowMemoryMenu] = useState(false)

  useEffect(() => {
    localStorage.setItem(V2_STORE_KEY, JSON.stringify(words))
  }, [words])

  useEffect(() => {
    if (!useMemory) return
    const memoryWords = getMemoryWords()
    dispatch(setWords(memoryWords))
  }, [dispatch, useMemory])

  useEffect(() => {
    if (!useMemory) return
    setMemoryWords(words)
  }, [useMemory, words])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-semibold text-ink-900">Palabras</h1>
        <div className="flex items-center gap-2">
          <AudioPanel />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMemoryMenu((prev) => !prev)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-inner transition ${
                showMemoryMenu
                  ? "border-ink-300 bg-ink-900 text-white"
                  : "border-ink-100 bg-white text-ink-700 hover:bg-ink-50"
              }`}
              title="Memoria"
            >
              ⚙️
            </button>
            {showMemoryMenu && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-ink-100 bg-ink-50/95 px-3 py-3 text-xs text-ink-700 shadow-soft backdrop-blur">
                <label className="flex items-center justify-between gap-2 font-semibold">
                  <span>Usar memoria</span>
                  <input
                    type="checkbox"
                    checked={useMemory}
                    onChange={(e) => dispatch(setUseMemory(e.target.checked))}
                    className="h-4 w-4 rounded border-ink-300 text-ink-800"
                  />
                </label>
                <p className="mt-2 text-[11px] text-ink-500">
                  Sincroniza cambios con la memoria local.
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-700">
          <button
            type="button"
            onClick={() => setTab("reconocimiento")}
            className={`rounded-full px-3 py-1 transition ${
              tab === "reconocimiento"
                ? "bg-ink-900 text-white shadow-soft"
                : "border border-ink-100 bg-white/80 hover:bg-white"
            }`}
          >
            Reconocimiento de texto
          </button>
          <button
            type="button"
            onClick={() => setTab("biblioteca")}
            className={`rounded-full px-3 py-1 transition ${
              tab === "biblioteca"
                ? "bg-ink-900 text-white shadow-soft"
                : "border border-ink-100 bg-white/80 hover:bg-white"
            }`}
          >
            Biblioteca
          </button>
        </div>
        {tab === "reconocimiento" ? (
          <ReconocimientoDePalabrasEnElTexto />
        ) : (
          <Biblioteca words={words} />
        )}
      </main>
    </div>
  )
}

export default Palabras
