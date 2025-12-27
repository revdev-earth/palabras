import { memo, type RefObject } from "react"

import type { WordEntry } from "+/redux/slices/wordsSlice"
import { formatDate } from "+/utils"

import { columns } from "./tableLayout"

type EditDraft = {
  term: string
  translation: string
  notes: string
}

type ToggleSpeak = (
  key: string,
  text: string,
  opts?: { sentencePerLine?: boolean }
) => void

type WordRowProps = {
  word: WordEntry
  effectiveScore: number
  isEditing: boolean
  expanded: boolean
  selected: boolean
  editDraft: EditDraft
  isSpeaking: boolean
  speakingKey: string | null
  notesRef: RefObject<HTMLTextAreaElement | null>
  onToggleSelect: (checked: boolean) => void
  onEditDraftChange: (field: keyof EditDraft, value: string) => void
  onAutoSizeNotes: (el: HTMLTextAreaElement | null) => void
  onToggleExpand: () => void
  onScore: (delta: number) => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
  onToggleSpeak: ToggleSpeak
}

export const WordRow = memo(function WordRow({
  word,
  effectiveScore,
  isEditing,
  expanded,
  selected,
  editDraft,
  isSpeaking,
  speakingKey,
  notesRef,
  onToggleSelect,
  onEditDraftChange,
  onAutoSizeNotes,
  onToggleExpand,
  onScore,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onToggleSpeak,
}: WordRowProps) {
  const termKey = `term:${word.id}`
  const notesKey = `notes:${word.id}`
  const isTermSpeaking = isSpeaking && speakingKey === termKey
  const isNotesSpeaking = isSpeaking && speakingKey === notesKey

  return (
    <div className={`${columns.bodyRow} ${columns.desktopGrid}`}>
      <div className="flex items-start gap-2 md:justify-center">
        <input
          type="checkbox"
          disabled={isEditing}
          checked={selected}
          onChange={(e) => onToggleSelect(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-800"
        />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-[11px] text-slate-500 md:hidden">Palabra</p>
        {isEditing ? (
          <input
            value={editDraft.term}
            onChange={(e) => onEditDraftChange("term", e.target.value)}
            className="w-full rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
          />
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSpeak(termKey, word.term)}
              className="rounded-full border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-sm"
              title={isTermSpeaking ? "Detener audio" : "Pronunciar palabra"}
            >
              {isTermSpeaking ? "⏹️" : "🔊"}
            </button>
            <span className="wrap-break-word font-semibold text-slate-900">
              {word.term}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-[11px] text-slate-500 md:hidden">Traducción</p>
        {isEditing ? (
          <input
            value={editDraft.translation}
            onChange={(e) => onEditDraftChange("translation", e.target.value)}
            className="w-full rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
          />
        ) : (
          <span className="wrap-break-word text-slate-800">
            {word.translation}
          </span>
        )}
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-[11px] text-slate-500 md:hidden">Notas</p>
        {isEditing ? (
          <textarea
            value={editDraft.notes}
            onChange={(e) => onEditDraftChange("notes", e.target.value)}
            onInput={(e) => onAutoSizeNotes(e.currentTarget)}
            ref={notesRef}
            rows={3}
            className="w-full rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm shadow-inner focus:border-slate-400 focus:outline-none"
          />
        ) : word.notes ? (
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={() =>
                onToggleSpeak(notesKey, word.notes || "", {
                  sentencePerLine: true,
                })
              }
              className="mt-0.5 rounded-full border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-800 shadow-inner transition hover:-translate-y-0.5 hover:shadow-sm"
              title={isNotesSpeaking ? "Detener audio" : "Pronunciar notas"}
            >
              {isNotesSpeaking ? "⏹️" : "🔊"}
            </button>
            <button
              type="button"
              onClick={onToggleExpand}
              className="group w-full text-left text-slate-700"
            >
              <div
                className={
                  expanded
                    ? "whitespace-pre-wrap wrap-break-word"
                    : "note-clamp whitespace-pre-wrap wrap-break-word"
                }
              >
                {word.notes}
              </div>
              <span className="text-[11px] text-slate-500 group-hover:text-slate-700">
                {expanded ? "Ocultar" : "Ver más"}
              </span>
            </button>
          </div>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </div>

      <div className="space-y-1 text-center">
        <p className="text-[11px] text-slate-500 md:hidden">Score</p>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800">
          {effectiveScore.toFixed(1)}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-slate-500 md:hidden">Última práctica</p>
        <p className="text-slate-600">{formatDate(word.lastPracticedAt)}</p>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] text-slate-500 md:hidden">Agregado</p>
        <p className="text-slate-600">{formatDate(word.createdAt)}</p>
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-[11px] text-slate-500 md:hidden">Acciones</p>
        {isEditing ? (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={onSaveEdit}
              className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"
            >
              Guardar
            </button>
            <button
              onClick={onCancelEdit}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-800"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onScore(-1)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-800 hover:border-slate-300"
            >
              -1
            </button>
            <button
              onClick={() => onScore(1)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-800 hover:border-slate-300"
            >
              +1
            </button>
            <button
              onClick={() => onScore(2)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-800 hover:border-slate-300"
            >
              +2
            </button>
            <button
              onClick={onStartEdit}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-800 hover:border-slate-300"
            >
              Editar
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:border-rose-300"
            >
              Borrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
