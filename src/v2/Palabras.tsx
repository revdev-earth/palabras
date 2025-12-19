import { useEffect, useState } from "react"

import { useSelector } from "+/redux"

import { V2_STORE_KEY } from "+/redux/slices/v2Slice"

import { Biblioteca } from "./Biblioteca"
import { ReconocimientoDePalabrasEnElTexto } from "./ReconocimientoDePalabrasEnElTexto"

function Palabras() {
  const words = useSelector((s) => s.v2Words.words)
  const [tab, setTab] = useState<"reconocimiento" | "biblioteca">("biblioteca")

  useEffect(() => {
    localStorage.setItem(V2_STORE_KEY, JSON.stringify(words))
  }, [words])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 space-y-1">
        <h1 className="text-3xl font-semibold text-ink-900">Palabras</h1>
      </header>

      <main className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-700">
          <span>tabs</span>
          <button
            type="button"
            onClick={() => setTab("reconocimiento")}
            className={`rounded-full px-3 py-1 transition ${
              tab === "reconocimiento"
                ? "bg-ink-900 text-white shadow-soft"
                : "border border-ink-100 bg-white/80 hover:bg-white"
            }`}
          >
            [reconocimiento de texto]
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
            [biblioteca]
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
