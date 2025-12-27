import { useEffect, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"
import { setUseMemory } from "+/redux/slices/wordsSlice"

export function MemoryMenu() {
  const dispatch = useDispatch()
  const useMemory = useSelector((s) => s.words.useMemory)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current && containerRef.current.contains(target)) return
      setOpen(false)
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-inner transition ${
          open
            ? "border-slate-300 bg-slate-900 text-white"
            : "border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
        }`}
        title="Memoria"
      >
        ⚙️
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-100 bg-slate-50/95 px-3 py-3 text-xs text-slate-700 shadow-lg backdrop-blur">
          <label className="flex items-center justify-between gap-2 font-semibold">
            <span>Usar memoria</span>
            <input
              type="checkbox"
              checked={useMemory}
              onChange={(e) => dispatch(setUseMemory(e.target.checked))}
              className="h-4 w-4 rounded border-slate-300 text-slate-800"
            />
          </label>
          <p className="mt-2 text-[11px] text-slate-500">
            Sincroniza cambios con la memoria local.
          </p>
        </div>
      )}
    </div>
  )
}
