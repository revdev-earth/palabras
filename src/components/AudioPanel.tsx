import { useEffect, useMemo, useRef, useState } from "react"

import { useDispatch, useSelector } from "+/redux"
import { setSettings } from "+/redux/slices/settingsSlice"

import { useSpeaker } from "+/hooks/useSpeaker"

type AudioPanelProps = {
  className?: string
}

export function AudioPanel({ className }: AudioPanelProps) {
  const dispatch = useDispatch()
  const voiceId = useSelector((s) => s.settings.practiceVoiceId)
  const voiceLang = useSelector((s) => s.settings.practiceVoiceLang)
  const voiceRate = useSelector((s) => s.settings.practiceVoiceRate)
  const practiceSpeakEnabled = useSelector(
    (s) => s.settings.practiceSpeakEnabled
  )
  const { speak, stopSpeaking, voices, isSpeaking } = useSpeaker({
    enabled: true,
  })

  const [previewText, setPreviewText] = useState("Hola, probando audio.")
  const [showAudioConfig, setShowAudioConfig] = useState(false)
  const [speakingKey, setSpeakingKey] = useState<string | null>(null)
  const [systemSpeaking, setSystemSpeaking] = useState(false)
  const [systemPaused, setSystemPaused] = useState(false)
  const configRef = useRef<HTMLDivElement | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const update = () => {
      setSystemSpeaking(window.speechSynthesis.speaking)
      setSystemPaused(window.speechSynthesis.paused)
    }
    update()
    const id = window.setInterval(update, 300)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!showAudioConfig) return
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (configRef.current && configRef.current.contains(target)) {
        if (closeTimeoutRef.current) {
          window.clearTimeout(closeTimeoutRef.current)
          closeTimeoutRef.current = null
        }
        return
      }
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = window.setTimeout(() => {
        setShowAudioConfig(false)
        closeTimeoutRef.current = null
      }, 2000)
    }
    window.addEventListener("mousedown", onClick)
    return () => {
      window.removeEventListener("mousedown", onClick)
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    }
  }, [showAudioConfig])

  const isAudioActive = systemSpeaking || isSpeaking

  const filteredVoices = useMemo(() => {
    if (!voiceLang) return voices
    const key = voiceLang.toLowerCase()
    return voices.filter((voice) => voice.lang?.toLowerCase().startsWith(key))
  }, [voiceLang, voices])

  const togglePreview = () => {
    if (isAudioActive) {
      stopSpeaking()
      if (speakingKey === "preview") {
        setSpeakingKey(null)
        return
      }
    }
    setSpeakingKey("preview")
    speak(previewText, {
      onEnd: () => setSpeakingKey(null),
      onError: () => setSpeakingKey(null),
    })
  }

  const stopAll = () => {
    stopSpeaking()
    setSpeakingKey(null)
  }

  const togglePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    if (window.speechSynthesis.paused) window.speechSynthesis.resume()
    else if (window.speechSynthesis.speaking) window.speechSynthesis.pause()
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-100 bg-white px-2.5 py-1.5 text-xs shadow-inner">
        <button
          type="button"
          onClick={togglePreview}
          className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 font-semibold text-slate-800 shadow-inner"
          title={
            isAudioActive && speakingKey === "preview"
              ? "Detener audio"
              : "Probar audio"
          }
        >
          {isAudioActive && speakingKey === "preview" ? "⏹️" : "🔊"}
        </button>
        <input
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Texto de prueba..."
          className="w-56 bg-transparent text-slate-900 outline-none"
        />
        <button
          type="button"
          onClick={togglePause}
          disabled={!systemSpeaking}
          className="rounded-lg border border-slate-100 bg-white px-2 py-1 font-semibold text-slate-700 shadow-inner disabled:opacity-40"
          title={systemPaused ? "Reanudar audio" : "Pausar audio"}
        >
          {systemPaused ? "▶️" : "⏸️"}
        </button>
        <button
          type="button"
          onClick={stopAll}
          disabled={!systemSpeaking}
          className="rounded-lg border border-slate-100 bg-white px-2 py-1 font-semibold text-slate-700 shadow-inner disabled:opacity-40"
          title="Detener audio"
        >
          ⏹️
        </button>
      </div>
      <div className="relative" ref={configRef}>
        <button
          type="button"
          onClick={() => setShowAudioConfig((prev) => !prev)}
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm shadow-inner transition ${
            showAudioConfig
              ? "border-slate-300 bg-slate-900 text-white"
              : "border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
          }`}
          title="Configurar audio"
        >
          ⚙️
        </button>
        {showAudioConfig && (
          <div className="absolute right-0 top-full z-20 mt-2 w-[320px] rounded-xl border border-slate-100 bg-slate-50/95 px-3 py-3 text-xs text-slate-700 shadow-lg backdrop-blur">
            <div className="grid gap-3">
              <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-inner">
                <span>Audio en prácticas</span>
                <input
                  type="checkbox"
                  checked={practiceSpeakEnabled}
                  onChange={(e) =>
                    dispatch(
                      setSettings({
                        practiceSpeakEnabled: e.target.checked,
                      })
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-slate-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Idioma
                </span>
                <select
                  value={voiceLang}
                  onChange={(e) =>
                    dispatch(
                      setSettings({
                        practiceVoiceLang: e.target.value,
                      })
                    )
                  }
                  className="rounded-lg border border-slate-100 bg-white px-2 py-1 text-xs text-slate-900"
                >
                  <option value="">Auto</option>
                  <option value="es">Espanol</option>
                  <option value="de">Aleman</option>
                  <option value="en">Ingles</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Voz
                </span>
                <select
                  value={voiceId}
                  onChange={(e) =>
                    dispatch(
                      setSettings({
                        practiceVoiceId: e.target.value,
                      })
                    )
                  }
                  className="rounded-lg border border-slate-100 bg-white px-2 py-1 text-xs text-slate-900"
                >
                  <option value="">Auto</option>
                  {filteredVoices.map((voice) => {
                    const id = voice.voiceURI || voice.name
                    return (
                      <option key={id} value={id}>
                        {voice.name} ({voice.lang})
                      </option>
                    )
                  })}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Velocidad
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={voiceRate}
                    onChange={(e) =>
                      dispatch(
                        setSettings({
                          practiceVoiceRate: Number(e.target.value),
                        })
                      )
                    }
                    className="w-full"
                  />
                  <span className="min-w-[36px] text-right text-[11px] font-semibold">
                    {voiceRate.toFixed(2)}
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
