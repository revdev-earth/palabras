import { useEffect, useMemo, useState } from "react"

import { useDispatch, useSelector } from "+/redux"

import type { PracticeDateFilter, PracticeScoreBucket } from "+/types"
import type { WordEntry } from "+/redux/slices/wordsSlice"
import { setSelectedIds } from "+/redux/slices/wordsSlice"
import { setSettings } from "+/redux/slices/settingsSlice"
import { startPractice } from "+/redux/slices/practiceSlice"

import PracticeSection from "+/components/practice/PracticeSection"
import FlashViewer from "+/components/practice/fragments/FlashViewer"
import { PracticeSelectedChips } from "../../components/PracticeSelectedChips"
import { daysBetween, effectiveScore, shuffle } from "+/utils"

export function Practicas() {
  const dispatch = useDispatch()
  const words = useSelector((s) => s.words.words)
  const selectedIds = useSelector((s) => s.words.selectedIds)
  const settings = useSelector((s) => s.settings)
  const practiceCount = settings.practiceCount
  const practiceRounds = settings.practiceRounds
  const practiceScoreBuckets = useMemo(
    () => settings.practiceScoreBuckets || [],
    [settings.practiceScoreBuckets]
  )
  const practiceDateFilter = settings.practiceDateFilter || "any"
  const [practiceMode, setPracticeMode] = useState<"interactive" | "flash">("flash")
  const [showRandomConfig, setShowRandomConfig] = useState(true)

  const availableScoreBuckets: PracticeScoreBucket[] = useMemo(() => {
    const buckets = new Set<string>()
    words.forEach((w) => {
      const s = Math.max(0, Math.round(effectiveScore(w)))
      if (s >= 9) buckets.add("9+")
      else buckets.add(String(s))
    })
    return Array.from(buckets).sort((a, b) => {
      if (a === "9+") return 1
      if (b === "9+") return -1
      return Number(a) - Number(b)
    }) as PracticeScoreBucket[]
  }, [words])

  useEffect(() => {
    const cleaned = practiceScoreBuckets.filter((b) => availableScoreBuckets.includes(b))
    if (cleaned.length !== practiceScoreBuckets.length) {
      dispatch(setSettings({ practiceScoreBuckets: cleaned }))
    }
  }, [availableScoreBuckets, practiceScoreBuckets, dispatch])

  const matchesScoreBucket = (w: WordEntry) => {
    if (!practiceScoreBuckets.length) return true
    const s = Math.max(0, Math.round(effectiveScore(w)))
    return practiceScoreBuckets.some((bucket) => {
      if (bucket === "9+") return s >= 9
      return s === Number(bucket)
    })
  }

  const matchesDateFilter = (w: { lastPracticedAt: string | null }) => {
    if (practiceDateFilter === "any") return true
    if (!w.lastPracticedAt) return practiceDateFilter === "never"
    const days = daysBetween(new Date().toISOString(), w.lastPracticedAt)
    if (practiceDateFilter === "today") return days === 0
    if (practiceDateFilter === "yesterday") return days === 1
    if (practiceDateFilter === "last3") return days <= 3
    if (practiceDateFilter === "last7") return days <= 7
    if (practiceDateFilter === "older7") return days > 7
    if (practiceDateFilter === "never") return false
    return true
  }

  const pickWordsByBasis = () => {
    const filtered = words.filter((w) => matchesScoreBucket(w) && matchesDateFilter(w))
    const pool = filtered.length ? filtered : words
    if (!pool.length) return []
    const n = Math.max(1, Math.min(practiceCount, pool.length))
    const randomized = shuffle([...pool])
    return randomized.slice(0, n)
  }

  const toggleScoreBucket = (bucket: PracticeScoreBucket) => {
    const next = practiceScoreBuckets.includes(bucket)
      ? practiceScoreBuckets.filter((b) => b !== bucket)
      : [...practiceScoreBuckets, bucket]
    dispatch(setSettings({ practiceScoreBuckets: next }))
  }

  const applyRandomSelection = () => {
    const picked = pickWordsByBasis()
    if (!picked.length) {
      window.alert("No hay palabras para seleccionar con el filtro actual.")
      return
    }
    dispatch(setSelectedIds(picked.map((w) => w.id)))
  }

  const clearSelection = () => dispatch(setSelectedIds([]))

  const startPracticeWithSelected = () => {
    if (!selectedIds.length) {
      window.alert("Selecciona palabras en Biblioteca o Reconocimiento.")
      return
    }
    if (practiceMode === "interactive") {
      dispatch(startPractice(selectedIds))
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.dispatchEvent(
      new CustomEvent("flashviewer:start", {
        detail: { ids: selectedIds, rounds: practiceRounds },
      })
    )
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 text-sm text-slate-800 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Practicas
              </div>
              <div className="text-base font-semibold text-slate-900">
                Selecciona y elige el modo
              </div>
            </div>
            <div className="text-xs text-slate-600">
              Seleccionadas: <span className="font-semibold">{selectedIds.length}</span>
            </div>
          </div>

          <PracticeSelectedChips className="mt-1" />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPracticeMode("flash")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                practiceMode === "flash"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "border border-slate-100 bg-white/80 text-slate-700 hover:bg-white"
              }`}
            >
              Tarjetas rápidas
            </button>
            <button
              type="button"
              onClick={() => setPracticeMode("interactive")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                practiceMode === "interactive"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "border border-slate-100 bg-white/80 text-slate-700 hover:bg-white"
              }`}
            >
              Rondas con aciertos
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startPracticeWithSelected}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Practicar
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-xl border border-slate-100 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-inner transition hover:bg-slate-50"
            >
              Limpiar selección
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 text-sm text-slate-800 shadow-lg">
          <button
            type="button"
            onClick={() => setShowRandomConfig((prev) => !prev)}
            className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            <span>Configuración de selección aleatoria</span>
            <span className="text-base text-slate-700">{showRandomConfig ? "▾" : "▸"}</span>
          </button>

          {showRandomConfig && (
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs text-slate-700">
                Elige un filtro, arma una selección y luego practica con ella.
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Cantidad
                </div>
                <input
                  type="range"
                  min={1}
                  max={Math.max(1, words.length)}
                  value={practiceCount}
                  onChange={(e) => dispatch(setSettings({ practiceCount: Number(e.target.value) }))}
                  className="w-full accent-slate-900"
                />
                <div className="text-xs text-slate-600">{practiceCount} palabras</div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Score
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableScoreBuckets.map((bucket) => {
                    const active = practiceScoreBuckets.includes(bucket)
                    return (
                      <button
                        key={bucket}
                        type="button"
                        onClick={() => toggleScoreBucket(bucket)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                          active
                            ? "border border-slate-900 bg-slate-900 text-white"
                            : "border border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {bucket}
                      </button>
                    )
                  })}
                  {!availableScoreBuckets.length && (
                    <span className="text-xs text-slate-500">Sin datos aún</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Fecha de práctica
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "any", label: "Cualquiera" },
                    { key: "today", label: "Hoy" },
                    { key: "yesterday", label: "Ayer" },
                    { key: "last3", label: "Últimos 3" },
                    { key: "last7", label: "Últimos 7" },
                    { key: "older7", label: "+7 días" },
                    { key: "never", label: "Sin práctica" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        dispatch(setSettings({ practiceDateFilter: opt.key as PracticeDateFilter }))
                      }
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                        practiceDateFilter === opt.key
                          ? "border border-slate-900 bg-slate-900 text-white"
                          : "border border-slate-100 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={applyRandomSelection}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-inner transition hover:bg-emerald-100"
                >
                  Seleccionar aleatorio
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      setSettings({
                        practiceScoreBuckets: [],
                        practiceDateFilter: "any",
                      })
                    )
                  }
                  className="rounded-xl border border-slate-100 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-inner transition hover:bg-slate-50"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PracticeSection />
      <FlashViewer />
    </section>
  )
}
