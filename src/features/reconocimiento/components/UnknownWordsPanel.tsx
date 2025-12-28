type UnknownWordsPanelProps = {
  unknownWords: string[]
}

export function UnknownWordsPanel({ unknownWords }: UnknownWordsPanelProps) {
  const unknownWordsText = unknownWords.join("\n")

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-lg">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Palabras desconocidas</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(unknownWordsText)
            } catch {
              window.prompt("Copia la lista manualmente:", unknownWordsText)
            }
          }}
          disabled={!unknownWords.length}
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-inner transition ${
            unknownWords.length
              ? "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
              : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
          }`}
        >
          Copiar todas
        </button>
      </div>
      {unknownWords.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {unknownWords.map((word) => (
            <span
              key={word}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700"
            >
              {word}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-2 text-sm text-slate-500">No hay palabras desconocidas.</div>
      )}
    </div>
  )
}
