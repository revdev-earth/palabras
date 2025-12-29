import type { RefObject } from "react"
import { useMemo, useRef, useState } from "react"

import type { WordEntry } from "+/redux/slices/wordsSlice"

import { normalizeTerm } from "../utils/text"
import type { TooltipState } from "../components/ReconocimientoTooltip"

type TooltipOpenInput =
  | { kind: "known"; lookup: WordEntry; keyTerm: string }
  | { kind: "phrase"; options: Array<{ label: string; lookup?: WordEntry }> }
  | { kind: "unknown"; token: string }

type UseTooltipStateProps = {
  previewRef: RefObject<HTMLDivElement | null>
  wordsByTerm: Map<string, WordEntry>
}

export function useTooltipState({ previewRef, wordsByTerm }: UseTooltipStateProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const derivedTooltip = useMemo(() => {
    if (!tooltip) return tooltip
    const sameLookup = (a?: WordEntry, b?: WordEntry) => (a?.id ?? null) === (b?.id ?? null)
    if (tooltip.kind === "known") {
      const nextLookup = wordsByTerm.get(normalizeTerm(tooltip.lookup.term))
      if (!nextLookup || sameLookup(nextLookup, tooltip.lookup)) return tooltip
      return { ...tooltip, lookup: nextLookup }
    }
    if (tooltip.kind === "phrase") {
      let changed = false
      const nextOptions = tooltip.options.map((option) => {
        const nextLookup = option.label
          ? (wordsByTerm.get(normalizeTerm(option.label)) ?? option.lookup)
          : option.lookup
        if (!sameLookup(nextLookup, option.lookup)) changed = true
        return nextLookup === option.lookup ? option : { ...option, lookup: nextLookup }
      })
      if (!changed) return tooltip
      return { ...tooltip, options: nextOptions }
    }
    return tooltip
  }, [tooltip, wordsByTerm])

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const scheduleClose = () => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = window.setTimeout(() => {
      setTooltip(null)
      closeTimeoutRef.current = null
    }, 300)
  }

  const openTooltip = (el: HTMLElement, next: TooltipOpenInput) => {
    if (!previewRef.current) return
    const rect = el.getBoundingClientRect()
    const containerRect = previewRef.current.getBoundingClientRect()
    const left = rect.left - containerRect.left + rect.width / 2
    const top = rect.top - containerRect.top
    if (next.kind === "known") {
      setTooltip({
        kind: "known",
        left,
        top,
        widthClass: "w-56",
        lookup: next.lookup,
        keyTerm: next.keyTerm,
      })
      return
    }
    if (next.kind === "phrase") {
      setTooltip({
        kind: "phrase",
        left,
        top,
        widthClass: "w-60",
        options: next.options,
      })
      return
    }
    setTooltip({
      kind: "unknown",
      left,
      top,
      widthClass: "w-64",
      token: next.token,
    })
  }

  return { tooltip: derivedTooltip, setTooltip, cancelClose, scheduleClose, openTooltip }
}
