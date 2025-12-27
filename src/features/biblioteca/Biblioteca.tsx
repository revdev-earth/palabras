import { useState } from "react"

import { useSelector } from "+/redux"
import Table from "./Table"
import { JsonWordsEditor } from "./components/JsonWordsEditor"

export function Biblioteca() {
  const words = useSelector((s) => s.words.words)
  const [tab, setTab] = useState<"json" | "table">("table")

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-white/80 p-1 text-xs font-semibold text-slate-700 shadow-inner">
        <button
          type="button"
          onClick={() => setTab("json")}
          className={`rounded-full px-4 py-1.5 transition ${
            tab === "json" ? "bg-slate-900 text-white shadow-lg" : "hover:bg-white"
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => setTab("table")}
          className={`rounded-full px-4 py-1.5 transition ${
            tab === "table" ? "bg-slate-900 text-white shadow-lg" : "hover:bg-white"
          }`}
        >
          Tabla
        </button>
      </div>
      {tab === "json" ? <JsonWordsEditor words={words} /> : <Table words={words} />}
    </div>
  )
}
