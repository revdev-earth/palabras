type ContextFiltersProps = {
  contextOptions: string[]
  practiceOptions: string[]
  activeContexts: Set<string>
  activePracticeContexts: Set<string>
  availableContexts: Set<string>
  availablePracticeContexts: Set<string>
  onToggleContext: (value: string) => void
  onTogglePracticeContext: (value: string) => void
}

export const LEVEL_TAGS = ["A1", "A2", "B1", "B2", "C1", "C2"]
export const TYPE_TAGS = [
  "adjektiv",
  "adverb",
  "artikel",
  "konjunktion",
  "interjektion",
  "zahl",
  "präposition",
  "pronomen",
  "substantiv",
  "verb",
]
const PRESET_TAGS = new Set([...LEVEL_TAGS, ...TYPE_TAGS])

export function ContextFilters({
  contextOptions,
  practiceOptions,
  activeContexts,
  activePracticeContexts,
  availableContexts,
  availablePracticeContexts,
  onToggleContext,
  onTogglePracticeContext,
}: ContextFiltersProps) {
  const extraContexts = contextOptions.filter((ctx) => !PRESET_TAGS.has(ctx))
  if (
    LEVEL_TAGS.length === 0 &&
    TYPE_TAGS.length === 0 &&
    extraContexts.length === 0 &&
    practiceOptions.length === 0
  ) {
    return null
  }

  return (
    <div className="border-b border-slate-100 px-5 py-3 text-xs text-slate-600">
      {LEVEL_TAGS.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold uppercase text-slate-500">niveles:</span>
          {LEVEL_TAGS.map((ctx) => {
            const isActive = activeContexts.has(ctx)
            const isDisabled = !isActive && !availableContexts.has(ctx)
            return (
              <button
                key={ctx}
                type="button"
                onClick={() => onToggleContext(ctx)}
                disabled={isDisabled}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg font-semibold"
                    : isDisabled
                      ? "border-slate-200 text-slate-400 cursor-not-allowed"
                      : "border-slate-100 text-slate-700 hover:bg-white"
                }`}
              >
                {ctx}
              </button>
            )
          })}
        </div>
      )}
      {TYPE_TAGS.length > 0 && (
        <div className={`flex flex-wrap items-center gap-2 ${LEVEL_TAGS.length > 0 ? "mt-2" : ""}`}>
          <span className="font-semibold uppercase text-slate-500">tipo:</span>
          {TYPE_TAGS.map((ctx) => {
            const isActive = activeContexts.has(ctx)
            const isDisabled = !isActive && !availableContexts.has(ctx)
            return (
              <button
                key={ctx}
                type="button"
                onClick={() => onToggleContext(ctx)}
                disabled={isDisabled}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg font-semibold"
                    : isDisabled
                      ? "border-slate-200 text-slate-400 cursor-not-allowed"
                      : "border-slate-100 text-slate-700 hover:bg-white"
                }`}
              >
                {ctx}
              </button>
            )
          })}
        </div>
      )}
      {extraContexts.length > 0 && (
        <div
          className={`flex flex-wrap items-center gap-2 ${LEVEL_TAGS.length > 0 || TYPE_TAGS.length > 0 ? "mt-2" : ""}`}
        >
          <span className="font-semibold uppercase text-slate-500">context:</span>
          {extraContexts.map((ctx) => {
            const isActive = activeContexts.has(ctx)
            const isDisabled = !isActive && !availableContexts.has(ctx)
            return (
              <button
                key={ctx}
                type="button"
                onClick={() => onToggleContext(ctx)}
                disabled={isDisabled}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg font-semibold"
                    : isDisabled
                      ? "border-slate-200 text-slate-400 cursor-not-allowed"
                      : "border-slate-100 text-slate-700 hover:bg-white"
                }`}
              >
                {ctx}
              </button>
            )
          })}
        </div>
      )}
      {practiceOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold uppercase text-slate-500">contextToPractice:</span>
          {practiceOptions.map((ctx) => {
            const isActive = activePracticeContexts.has(ctx)
            const isDisabled = !isActive && !availablePracticeContexts.has(ctx)
            return (
              <button
                key={ctx}
                type="button"
                onClick={() => onTogglePracticeContext(ctx)}
                disabled={isDisabled}
                className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg font-semibold"
                    : isDisabled
                      ? "border-slate-200 text-slate-400 cursor-not-allowed"
                      : "border-slate-100 text-slate-700 hover:bg-white"
                }`}
              >
                {ctx}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
