type UnknownWordsPanelProps = {
  unknownWords: string[]
}

export function UnknownWordsPanel({ unknownWords }: UnknownWordsPanelProps) {
  const unknownWordsJson = JSON.stringify(
    unknownWords.map((term) => ({
      term,
      translation: "",
      notes: "",
      context: [],
      contextForPractice: [],
    })),
    null,
    2
  )

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-lg">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Palabras desconocidas
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
      <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-lg">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>JSON para importar</span>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(unknownWordsJson)
              } catch {
                window.alert("No se pudo copiar el JSON.")
              }
            }}
            className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-inner transition hover:bg-slate-50"
          >
            Copiar
          </button>
        </div>
        <textarea
          value={unknownWordsJson}
          readOnly
          rows={10}
          className="mt-2 w-full resize-y rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 font-mono text-[11px] text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none"
        />
      </div>
    </div>
  )
}
