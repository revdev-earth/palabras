import { useEffect, useState } from "react"

import { useSpeaker } from "+/hooks/useSpeaker"

type SelectionInfo = {
  text: string
  rect: DOMRect
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function SelectionSpeaker() {
  const { speak, speakEnabled, isSpeaking, stopSpeaking } = useSpeaker()
  const [selection, setSelection] = useState<SelectionInfo | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleSelectionChange = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed) {
        setSelection(null)
        return
      }
      const raw = sel.toString().trim()
      if (!raw || raw.length < 3) {
        setSelection(null)
        return
      }
      const anchorEl = sel.anchorNode?.parentElement
      const focusEl = sel.focusNode?.parentElement
      const inEditable =
        anchorEl?.closest("input, textarea, [contenteditable=true]") ||
        focusEl?.closest("input, textarea, [contenteditable=true]")
      if (inEditable) {
        setSelection(null)
        return
      }
      try {
        if (!sel.rangeCount) {
          setSelection(null)
          return
        }
        const rect = sel.getRangeAt(0).getBoundingClientRect()
        if (!rect || rect.width === 0 || rect.height === 0) {
          setSelection(null)
          return
        }
        setSelection({ text: raw, rect })
      } catch {
        setSelection(null)
      }
    }
    document.addEventListener("selectionchange", handleSelectionChange)
    window.addEventListener("scroll", handleSelectionChange, true)
    window.addEventListener("resize", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      window.removeEventListener("scroll", handleSelectionChange, true)
      window.removeEventListener("resize", handleSelectionChange)
    }
  }, [])

  const speakSelection = () => {
    if (!selection) return
    const text = selection.text.trim()
    if (!text) return
    if (typeof window === "undefined" || !window.speechSynthesis) return
    if (isSpeaking) {
      stopSpeaking()
      return
    }
    if (!speakEnabled) {
      window.alert(
        "Activa “Habilitar pronunciación” en Configuración de reproducción para escuchar el texto seleccionado."
      )
      return
    }
    speak(text)
  }

  const rect = selection?.rect
  if (!selection || !rect || !selection.text) return null

  const top = clamp(rect.top - 36, 8, window.innerHeight - 48)
  const left = clamp(rect.left + rect.width / 2, 24, window.innerWidth - 24)

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={speakSelection}
      className="fixed z-50 -translate-x-1/2 rounded-full border border-ink-100 bg-ink-900 px-3 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink-800"
      style={{ top, left }}
      title={isSpeaking ? "Detener audio" : "Reproducir texto seleccionado"}
    >
      {isSpeaking ? "⏹️" : "🔊"}
    </button>
  )
}

export default SelectionSpeaker
