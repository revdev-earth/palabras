"use client"

import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import { setWords } from "+/redux/slices/wordsSlice"

import { AudioPanel } from "../../components/AudioPanel"
import { MemoryMenu } from "../../components/MemoryMenu"
import { getMemoryWords, setMemoryWords } from "../../shared/memoryStore"

import { Biblioteca } from "../biblioteca/Biblioteca"
import { Practicas } from "../practicas/Practicas"
import { ReconocimientoDePalabrasEnElTexto } from "../reconocimiento/ReconocimientoDePalabrasEnElTexto"

const tabs = [
  { key: "reconocimiento", label: "Reconocimiento de texto" },
  { key: "practicas", label: "Practicas" },
  { key: "biblioteca", label: "Biblioteca" },
] as const

type TabKey = (typeof tabs)[number]["key"]

function Palabras() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const useMemory = useSelector((s) => s.words.useMemory)
  const [tab, setTab] = useState<TabKey>("reconocimiento")

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
        <h1 className="text-3xl font-semibold text-slate-900">Palabras</h1>
        <div className="flex items-center gap-2">
          <AudioPanel />
          <MemoryMenu />
        </div>
      </header>

      <main className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-full px-3 py-1 transition ${
                tab === item.key
                  ? "bg-slate-900 text-white shadow-lg"
                  : "border border-slate-100 bg-white/80 hover:bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {
          {
            reconocimiento: <ReconocimientoDePalabrasEnElTexto />,
            practicas: <Practicas />,
            biblioteca: <Biblioteca />,
          }[tab]
        }
      </main>
    </div>
  )
}

export default Palabras
