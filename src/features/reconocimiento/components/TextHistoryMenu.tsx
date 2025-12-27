import { useEffect, useRef } from "react"

import { useDispatch, useSelector } from "+/redux"

import {
  addTextHistory,
  removeTextHistory,
  setRecognitionText,
  setShowTextHistory,
  toggleTextHistory,
} from "+/redux/slices/recognitionSlice"
import { formatDate } from "+/utils"

export function TextHistoryMenu() {
  const dispatch = useDispatch()
  const text = useSelector((s) => s.recognition.recognitionText)
  const textHistory = useSelector((s) => s.recognition.textHistory)
  const showHistory = useSelector((s) => s.recognition.showTextHistory)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!showHistory) return
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(event.target as Node)) return
      dispatch(setShowTextHistory(false))
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [dispatch, showHistory])

  return (
    <div className="relative flex items-center gap-2" ref={menuRef}>
      <button
        type="button"
        onClick={() => dispatch(addTextHistory(text))}
        disabled={!text.trim()}
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-inner transition ${
          text.trim()
            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-400"
        }`}
      >
        Guardar
      </button>
      <button
        type="button"
        onClick={() => dispatch(toggleTextHistory())}
        className="rounded-full border border-slate-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-inner transition hover:bg-slate-50"
      >
        Historial {textHistory.length ? `(${textHistory.length})` : ""}
      </button>
      {showHistory && (
        <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-slate-100 bg-white/95 p-2 text-[11px] text-slate-700 shadow-lg backdrop-blur">
          {textHistory.length ? (
            <div className="max-h-56 space-y-1 overflow-auto pr-1">
              {textHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-1 transition hover:bg-slate-100"
                >
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setRecognitionText(item.text))
                      dispatch(setShowTextHistory(false))
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate font-semibold text-slate-800">{item.text}</div>
                    <div className="text-[10px] text-slate-500">{formatDate(item.createdAt)}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(removeTextHistory(item.id))}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                    title="Borrar"
                  >
                    Borrar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-2 text-slate-500">Sin historial.</div>
          )}
        </div>
      )}
    </div>
  )
}
