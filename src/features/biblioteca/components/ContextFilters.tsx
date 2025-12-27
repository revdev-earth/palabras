type ContextFiltersProps = {
  contextOptions: string[]
  practiceOptions: string[]
  activeContexts: Set<string>
  activePracticeContexts: Set<string>
  onToggleContext: (value: string) => void
  onTogglePracticeContext: (value: string) => void
}

export function ContextFilters({
  contextOptions,
  practiceOptions,
  activeContexts,
  activePracticeContexts,
  onToggleContext,
  onTogglePracticeContext,
}: ContextFiltersProps) {
  if (contextOptions.length === 0 && practiceOptions.length === 0) return null

  return (
    <div className="border-b border-slate-100 px-5 py-3 text-xs text-slate-600">
      {contextOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold uppercase text-slate-500">context:</span>
          {contextOptions.map((ctx) => (
            <button
              key={ctx}
              type="button"
              onClick={() => onToggleContext(ctx)}
              className={`rounded-full border border-slate-100 px-2 py-0.5 text-[11px] transition ${
                activeContexts.has(ctx)
                  ? "bg-slate-900 text-white shadow-lg font-semibold"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              {ctx}
            </button>
          ))}
        </div>
      )}
      {practiceOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold uppercase text-slate-500">contextToPractice:</span>
          {practiceOptions.map((ctx) => (
            <button
              key={ctx}
              type="button"
              onClick={() => onTogglePracticeContext(ctx)}
              className={`rounded-full border border-slate-100 px-2 py-0.5 text-[11px] transition ${
                activePracticeContexts.has(ctx)
                  ? "bg-slate-900 text-white shadow-lg font-semibold"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              {ctx}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
