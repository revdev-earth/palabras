import { useEffect, useMemo, useState } from "react"
import { useSelector } from "+/hooks"

type SelectionInfo = {
  text: string
  rect: DOMRect
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function SelectionSpeaker() {
  const speakEnabled = useSelector((s) => s.app.settings.practiceSpeakEnabled)
  const voiceId = useSelector((s) => s.app.settings.practiceVoiceId)
  const voiceLang = useSelector((s) => s.app.settings.practiceVoiceLang)
  const voiceRate = useSelector((s) => s.app.settings.practiceVoiceRate)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selection, setSelection] = useState<SelectionInfo | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices()
      if (list.length) setVoices(list)
    }
    loadVoices()
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
  }, [])

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

  const preferredVoice = useMemo(() => {
    if (!voices.length) return null
    return (
      voices.find((v) => v.voiceURI === voiceId || v.name === voiceId) ||
      voices.find((v) =>
        voiceLang ? v.lang?.toLowerCase().startsWith(voiceLang.toLowerCase()) : false
      ) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ||
      voices[0]
    )
  }, [voiceId, voiceLang, voices])

  const speakSelection = () => {
    if (!selection) return
    const text = selection.text.trim()
    if (!text) return
    if (typeof window === "undefined" || !window.speechSynthesis) return
    if (!speakEnabled) {
      window.alert(
        "Activa “Habilitar pronunciación” en Configuración de reproducción para escuchar el texto seleccionado."
      )
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    if (preferredVoice) utter.voice = preferredVoice
    utter.rate = clamp(voiceRate || 1, 0.5, 2)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
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
      title="Reproducir texto seleccionado"
    >
      🔊
    </button>
  )
}

export default SelectionSpeaker
