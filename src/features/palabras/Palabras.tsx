"use client"

import { useState } from "react"

import { Header } from "+/components/Header"
import { Biblioteca } from "../biblioteca/Biblioteca"
import { Practicas } from "../practicas/Practicas"
import { Reconocimiento } from "../reconocimiento/Reconocimiento"

const tabs = [
  { key: "reconocimiento", label: "Reconocimiento de texto" },
  { key: "practicas", label: "Practicas" },
  { key: "biblioteca", label: "Biblioteca" },
] as const

type TabKey = (typeof tabs)[number]["key"]

function Palabras() {
  const [tab, setTab] = useState<TabKey>("reconocimiento")

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Header />

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
            reconocimiento: <Reconocimiento />,
            practicas: <Practicas />,
            biblioteca: <Biblioteca />,
          }[tab]
        }
      </main>
    </div>
  )
}

export default Palabras
