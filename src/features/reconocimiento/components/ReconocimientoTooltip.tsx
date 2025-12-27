import type { Dispatch, SetStateAction } from "react"

import type { WordEntry } from "+/redux/slices/wordsSlice"
import { effectiveScore } from "+/utils"

import { scoreTone, type ToneVariant } from "../../../shared/scoreTone"
import { ReconocimientoEditorTabs, type WordDraft } from "./ReconocimientoEditorTabs"

export type PhraseTone = {
  bg: string
  border: string
  shadow: string
  text: string
}

export type TooltipState =
  | {
      kind: "known"
      left: number
      top: number
      widthClass: "w-56"
      lookup: WordEntry
      keyTerm: string
    }
  | {
      kind: "phrase"
      left: number
      top: number
      widthClass: "w-60"
      options: Array<{ label: string; lookup?: WordEntry }>
    }
  | {
      kind: "unknown"
      left: number
      top: number
      widthClass: "w-64"
      token: string
    }

export type TooltipProps = {
  tooltip: TooltipState
  activeWord: string | null
  draft: WordDraft
  toneVariant: ToneVariant
  phraseTone: PhraseTone
  phraseSuggestions: string[]
  contextSuggestions: string[]
  onAddPhraseSuggestion: (value: string) => void
  onAddContextSuggestion: (value: string) => void
  onScore: (id: string, delta: number) => void
  onStartEdit: (term: string) => void
  onToggleActive: (term: string) => void
  onSave: (draft: WordDraft, previousTerm?: string, shouldAlert?: boolean) => boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  setDraft: Dispatch<SetStateAction<WordDraft>>
}

const formatList = (items: string[] | undefined) => {
  if (!items || items.length === 0) return "—"
  return items.join(", ")
}

export function ReconocimientoTooltip({
  tooltip,
  activeWord,
  draft,
  toneVariant,
  phraseTone,
  phraseSuggestions,
  contextSuggestions,
  onAddPhraseSuggestion,
  onAddContextSuggestion,
  onScore,
  onStartEdit,
  onToggleActive,
  onSave,
  onMouseEnter,
  onMouseLeave,
  setDraft,
}: TooltipProps) {
  const borderClass =
    tooltip.kind === "phrase"
      ? phraseTone.border
      : tooltip.kind === "unknown"
        ? "border-slate-200"
        : scoreTone(effectiveScore(tooltip.lookup), toneVariant).border

  return (
    <div
      className={`pointer-events-auto absolute z-20 ${tooltip.widthClass} -translate-x-1/2 rounded-xl border bg-white px-3 py-2 text-xs text-slate-800 shadow-lg ${borderClass}`}
      style={{
        left: tooltip.left,
        top: tooltip.top,
        transform: "translate(-50%, calc(-100% - 1px))",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {tooltip.kind === "known" &&
        (() => {
          const isActive = activeWord === tooltip.keyTerm
          const tone = scoreTone(effectiveScore(tooltip.lookup), toneVariant)
          return (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-slate-900">{tooltip.lookup.term}</div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => onScore(tooltip.lookup.id, -1)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => onScore(tooltip.lookup.id, 1)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleActive(tooltip.keyTerm)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${tone.border} ${tone.text}`}
                    aria-label="Editar palabra"
                    title="Editar palabra"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                      <path
                        d="M14.7 2.6a1.5 1.5 0 0 1 2.1 2.1l-9.2 9.2-3.3.7.7-3.3 9.2-9.2Zm-8.4 9.9-.3 1.2 1.2-.3 8.6-8.6-.9-.9-8.6 8.6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {tooltip.lookup.translation && <div className={tone.text}>{tooltip.lookup.translation}</div>}
              <div className={`mt-1 text-[10px] uppercase tracking-wide ${tone.text}`}>
                {tone.label} · Score {effectiveScore(tooltip.lookup).toFixed(1)}
              </div>
              <details className="mt-2">
                <summary className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-slate-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 text-emerald-700">
                    +
                  </span>
                  Detalles
                </summary>
                <div className="mt-2 space-y-1 text-slate-600">
                  <div>Notas: {tooltip.lookup.notes || "—"}</div>
                  <div>Contexto: {formatList(tooltip.lookup.context)}</div>
                  <div>Contexto practica: {formatList(tooltip.lookup.contextForPractice)}</div>
                </div>
              </details>
              {isActive && (
                <div className="mt-2">
                  <ReconocimientoEditorTabs
                    key={draft.term}
                    draft={draft}
                    setDraft={setDraft}
                    onSave={() => onSave(draft, activeWord, false)}
                    phraseSuggestions={phraseSuggestions}
                    onAddPhraseSuggestion={onAddPhraseSuggestion}
                    contextSuggestions={contextSuggestions}
                    onAddContextSuggestion={onAddContextSuggestion}
                  />
                </div>
              )}
            </>
          )
        })()}
      {tooltip.kind === "phrase" &&
        tooltip.options.map((option, optionIndex) => {
          const optionLookup = option.lookup
          const optionIsActive = activeWord === option.label
          return (
            <div key={option.label}>
              {optionIndex > 0 && <div className="my-2 h-px bg-slate-100" />}
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  {optionLookup && (
                    <>
                      <button
                        type="button"
                        onClick={() => onScore(optionLookup.id, -1)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => onScore(optionLookup.id, 1)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        +1
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleActive(option.label)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${phraseTone.border} ${phraseTone.text}`}
                    aria-label="Editar termino"
                    title="Editar termino"
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5">
                      <path
                        d="M14.7 2.6a1.5 1.5 0 0 1 2.1 2.1l-9.2 9.2-3.3.7.7-3.3 9.2-9.2Zm-8.4 9.9-.3 1.2 1.2-.3 8.6-8.6-.9-.9-8.6 8.6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {optionLookup?.translation ? (
                <div className={phraseTone.text}>{optionLookup.translation}</div>
              ) : (
                <div className="text-slate-500">No registrada</div>
              )}
              <details className="mt-2">
                <summary className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-slate-700">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${phraseTone.border} ${phraseTone.text}`}
                  >
                    +
                  </span>
                  Detalles
                </summary>
                <div className="mt-2 space-y-1 text-slate-600">
                  <div>Notas: {optionLookup?.notes || "—"}</div>
                  <div>Contexto: {formatList(optionLookup?.context)}</div>
                  <div>Contexto practica: {formatList(optionLookup?.contextForPractice)}</div>
                </div>
              </details>
              {optionIsActive && (
                <div className="mt-2">
                  <ReconocimientoEditorTabs
                    key={draft.term}
                    draft={draft}
                    setDraft={setDraft}
                    onSave={() => onSave(draft, activeWord, false)}
                    phraseSuggestions={phraseSuggestions}
                    onAddPhraseSuggestion={onAddPhraseSuggestion}
                    contextSuggestions={contextSuggestions}
                    onAddContextSuggestion={onAddContextSuggestion}
                  />
                </div>
              )}
            </div>
          )
        })}
      {tooltip.kind === "unknown" &&
        (() => {
          const isActive = activeWord === tooltip.token
          return (
            <>
              <div className="font-semibold text-slate-900">{tooltip.token}</div>
              <div className="text-slate-700">No registrada</div>
              <details className="mt-2" open={isActive}>
                <summary
                  className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-slate-700"
                  onClick={(event) => {
                    event.preventDefault()
                    if (isActive) {
                      onToggleActive(tooltip.token)
                      return
                    }
                    onStartEdit(tooltip.token)
                  }}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 text-slate-600">
                    {isActive ? "-" : "+"}
                  </span>
                  {isActive ? "Cerrar" : "Agregar"}
                </summary>
                {isActive && (
                  <div className="mt-2">
                    <ReconocimientoEditorTabs
                      key={draft.term || tooltip.token}
                      draft={draft}
                      setDraft={setDraft}
                      onSave={() => onSave(draft, activeWord, false)}
                      phraseSuggestions={phraseSuggestions}
                      onAddPhraseSuggestion={onAddPhraseSuggestion}
                      contextSuggestions={contextSuggestions}
                      onAddContextSuggestion={onAddContextSuggestion}
                    />
                  </div>
                )}
              </details>
            </>
          )
        })()}
    </div>
  )
}
