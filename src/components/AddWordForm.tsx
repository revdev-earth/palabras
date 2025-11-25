import { RefObject } from "react"

interface Props {
  term: string
  translation: string
  notes: string
  onTermChange: (v: string) => void
  onTranslationChange: (v: string) => void
  onNotesChange: (v: string) => void
  onSubmit: () => void
  translationRef: RefObject<HTMLInputElement>
}

function AddWordForm({
  term,
  translation,
  notes,
  onTermChange,
  onTranslationChange,
  onNotesChange,
  onSubmit,
  translationRef,
}: Props) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white/80 p-5 shadow-soft backdrop-blur">
      <h2 className="mb-3 text-lg font-semibold text-ink-900">Agregar palabra</h2>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <input
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            placeholder="Palabra"
            className="w-full flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-base shadow-inner focus:border-ink-400 focus:outline-none"
          />
          <input
            ref={translationRef}
            value={translation}
            onChange={(e) => onTranslationChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit()
            }}
            placeholder="Traducción"
            className="w-full flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-base shadow-inner focus:border-ink-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Agregar
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Notas (opcional) — pega aquí tu ‘plantilla’ con saltos de línea"
          className="w-full rounded-xl border border-ink-100 bg-white px-3 py-3 text-sm shadow-inner focus:border-ink-400 focus:outline-none"
          rows={4}
        />
        <p className="text-xs text-ink-500">Tip: puedes añadir rápido con Enter en "Traducción".</p>
      </div>
    </section>
  )
}

export default AddWordForm
