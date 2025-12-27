import { useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import {
  setPreviewFontSize,
  setPreviewLineHeight,
  setPreviewWordSpacing,
  setToneVariant,
} from "+/redux/slices/recognitionSlice"
import type { ToneVariant } from "../../../shared/scoreTone"

export function PreviewConfigMenu() {
  const dispatch = useDispatch()
  const toneVariant = useSelector((s) => s.recognition.toneVariant)
  const fontSize = useSelector((s) => s.recognition.previewFontSize)
  const lineHeight = useSelector((s) => s.recognition.previewLineHeight)
  const wordSpacing = useSelector((s) => s.recognition.previewWordSpacing)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] shadow-inner transition ${
          isOpen
            ? "border-slate-300 bg-slate-900 text-white"
            : "border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
        }`}
        title="Configurar vista previa"
      >
        ⚙️
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-[220px] rounded-xl border border-slate-100 bg-slate-50/95 px-3 py-3 text-[11px] font-medium text-slate-700 shadow-lg backdrop-blur">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Tamano
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={12}
                max={20}
                step={1}
                value={fontSize}
                onChange={(e) => dispatch(setPreviewFontSize(Number(e.target.value)))}
                className="w-full"
              />
              <span className="min-w-[24px] text-right text-[10px] font-semibold">
                {fontSize}
              </span>
            </div>
          </label>
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Interlineado
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1.2}
                max={2.2}
                step={0.05}
                value={lineHeight}
                onChange={(e) => dispatch(setPreviewLineHeight(Number(e.target.value)))}
                className="w-full"
              />
              <span className="min-w-[28px] text-right text-[10px] font-semibold">
                {lineHeight.toFixed(2)}
              </span>
            </div>
          </label>
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Espaciado
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={wordSpacing}
                onChange={(e) => dispatch(setPreviewWordSpacing(Number(e.target.value)))}
                className="w-full"
              />
              <span className="min-w-[28px] text-right text-[10px] font-semibold">
                {wordSpacing.toFixed(1)}
              </span>
            </div>
          </label>
          <label className="mt-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Resaltado
            </span>
            <select
              value={toneVariant}
              onChange={(e) => dispatch(setToneVariant(e.target.value as ToneVariant))}
              className="rounded-lg border border-slate-100 bg-white px-2 py-1 text-xs text-slate-900"
            >
              <option value="green">Verde</option>
              <option value="blue">Azul</option>
              <option value="purple">Morado</option>
              <option value="mix">Mix</option>
            </select>
          </label>
        </div>
      )}
    </div>
  )
}
