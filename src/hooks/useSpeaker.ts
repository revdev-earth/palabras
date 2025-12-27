import { useCallback, useEffect, useMemo, useState } from "react"

import { useSelector } from "+/redux"

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const toSentencesByLine = (raw: string) =>
  raw
    .split(/\r?\n/)
    .map((line) => {
      const t = line.trim()
      if (!t) return ""
      if (/[.!?…:]$/.test(t)) return t
      return `${t}.`
    })
    .filter(Boolean)
    .join(" ")

export const useSpeaker = (hookOpts?: { enabled?: boolean }) => {
  const speakEnabled = useSelector((s) => s.settings.practiceSpeakEnabled)
  const voiceId = useSelector((s) => s.settings.practiceVoiceId)
  const voiceLang = useSelector((s) => s.settings.practiceVoiceLang)
  const voiceRate = useSelector((s) => s.settings.practiceVoiceRate)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)

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

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const preferredVoice = useMemo(() => {
    if (!voices.length) return null
    return (
      voices.find((v) => v.voiceURI === voiceId || v.name === voiceId) ||
      voices.find((v) =>
        voiceLang ? v.lang?.toLowerCase().startsWith(voiceLang.toLowerCase()) : false
      ) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("es")) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0]
    )
  }, [voiceId, voiceLang, voices])

  const speak = useCallback(
    (
      text: string,
      opts?: { onEnd?: () => void; onError?: () => void; sentencePerLine?: boolean }
    ) => {
      const enabled = typeof hookOpts?.enabled === "boolean" ? hookOpts.enabled : speakEnabled
      const prepared = opts?.sentencePerLine ? toSentencesByLine(text || "") : text
      const clean = prepared?.trim()
      if (!clean || typeof window === "undefined" || !window.speechSynthesis || !enabled)
        return false
      const utter = new SpeechSynthesisUtterance(clean)
      if (preferredVoice) utter.voice = preferredVoice
      utter.rate = clamp(voiceRate || 1, 0.5, 2)
      utter.onend = () => {
        setIsSpeaking(false)
        if (opts?.onEnd) opts.onEnd()
      }
      utter.onerror = () => {
        setIsSpeaking(false)
        if (opts?.onError) opts.onError()
      }
      window.speechSynthesis.cancel()
      setIsSpeaking(true)
      window.speechSynthesis.speak(utter)
      return true
    },
    [hookOpts, preferredVoice, speakEnabled, voiceRate]
  )

  const enabled = typeof hookOpts?.enabled === "boolean" ? hookOpts.enabled : speakEnabled
  return { speak, stopSpeaking, voices, preferredVoice, speakEnabled: enabled, isSpeaking }
}
