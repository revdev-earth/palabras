import type { RefObject, SetStateAction } from "react"

import { effectiveScore } from "+/utils"

import type { WordEntry } from "+/redux/slices/wordsSlice"
import type { Token, TokenGroup } from "../types"
import { normalizeTerm } from "../utils/text"
import { scoreTone, type ToneVariant } from "../../../shared/scoreTone"
import { ReconocimientoTooltip, type PhraseTone, type TooltipState } from "./ReconocimientoTooltip"
import type { WordDraft } from "./ReconocimientoEditorTabs"

type TextPreviewProps = {
  tokens: Token[]
  groups: TokenGroup[]
  wordsByTerm: Map<string, WordEntry>
  toneVariant: ToneVariant
  phraseTone: PhraseTone
  previewRef: RefObject<HTMLDivElement | null>
  tooltip: TooltipState | null
  activeWord: string | null
  draft: WordDraft
  phraseSuggestions: string[]
  contextSuggestions: string[]
  onAddPhraseSuggestion: (value: string) => void
  onAddContextSuggestion: (value: string) => void
  onScore: (id: string, delta: number) => void
  onStartEdit: (term: string) => void
  onToggleActive: (term: string) => void
  onSave: (draft: WordDraft, previousTerm?: string, shouldAlert?: boolean) => boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  setDraft: (next: SetStateAction<WordDraft>) => void
  fontSize: number
  lineHeight: number
  wordSpacing: number
  openTooltip: (
    el: HTMLElement,
    next:
      | { kind: "known"; lookup: WordEntry; keyTerm: string }
      | { kind: "phrase"; options: Array<{ label: string; lookup?: WordEntry }> }
      | { kind: "unknown"; token: string }
  ) => void
}

export function TextPreview({
  tokens,
  groups,
  wordsByTerm,
  toneVariant,
  phraseTone,
  previewRef,
  tooltip,
  activeWord,
  draft,
  phraseSuggestions,
  contextSuggestions,
  onAddPhraseSuggestion,
  onAddContextSuggestion,
  onScore,
  onStartEdit,
  onToggleActive,
  onSave,
  onMouseEnter,
  onMouseLeave,
  setDraft,
  fontSize,
  lineHeight,
  wordSpacing,
  openTooltip,
}: TextPreviewProps) {
  return (
    <div
      className="relative mt-3 whitespace-pre-wrap text-slate-900"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight,
        wordSpacing: `${wordSpacing}px`,
      }}
      ref={previewRef}
    >
      {tokens.length === 0 && <span className="text-slate-400">Sin texto para analizar.</span>}
      {groups.map((group, groupIndex) => {
        if (group.kind === "knownGroup") {
          return (
            <span key={`known-group-${groupIndex}`}>
              {(() => {
                const segments: Array<{ kind: "high" | "normal"; tokens: Token[] }> = []
                let i = 0
                while (i < group.tokens.length) {
                  const token = group.tokens[i]
                  if (token.type === "word") {
                    const lookup = wordsByTerm.get(normalizeTerm(token.value))
                    const score = lookup ? effectiveScore(lookup) : 0
                    if (score >= 10) {
                      const segTokens: Token[] = [token]
                      let j = i + 1
                      while (j < group.tokens.length) {
                        const space = group.tokens[j]
                        const nextWord = group.tokens[j + 1]
                        if (space?.type === "space" && nextWord?.type === "word") {
                          const nextLookup = wordsByTerm.get(normalizeTerm(nextWord.value))
                          const nextScore = nextLookup ? effectiveScore(nextLookup) : 0
                          if (nextScore >= 10) {
                            segTokens.push(space, nextWord)
                            j += 2
                            continue
                          }
                        }
                        break
                      }
                      segments.push({ kind: "high", tokens: segTokens })
                      i = j
                      continue
                    }
                  }
                  segments.push({ kind: "normal", tokens: [token] })
                  i += 1
                }

                const renderToken = (token: Token, tokenIndex: number, inHigh: boolean) => {
                  if (token.type === "space") {
                    return <span key={`known-space-${groupIndex}-${tokenIndex}`}>{token.value}</span>
                  }
                  const lookup = wordsByTerm.get(normalizeTerm(token.value))
                  const keyTerm = lookup?.term ?? token.value
                  const tone = lookup ? scoreTone(effectiveScore(lookup), toneVariant) : null
                  return (
                    <span
                      key={`known-word-${groupIndex}-${tokenIndex}`}
                      className={`inline-flex rounded-sm px-0.5 text-slate-900 ${
                        !inHigh && tone ? `${tone.bg} ${tone.shadow}` : ""
                      }`}
                      onMouseEnter={(event) => {
                        if (!lookup) return
                        onMouseEnter()
                        openTooltip(event.currentTarget, {
                          kind: "known",
                          lookup,
                          keyTerm,
                        })
                      }}
                      onMouseLeave={onMouseLeave}
                    >
                      {token.value}
                    </span>
                  )
                }

                const highTone = scoreTone(10, toneVariant)
                return segments.map((segment, segmentIndex) =>
                  segment.kind === "high" ? (
                    <span
                      key={`known-high-${groupIndex}-${segmentIndex}`}
                      className={`rounded-md px-1 ${highTone.bg} ${highTone.shadow}`}
                    >
                      {segment.tokens.map((token, tokenIndex) =>
                        renderToken(token, tokenIndex, true)
                      )}
                    </span>
                  ) : (
                    <span key={`known-normal-${groupIndex}-${segmentIndex}`}>
                      {segment.tokens.map((token, tokenIndex) =>
                        renderToken(token, tokenIndex, false)
                      )}
                    </span>
                  )
                )
              })()}
            </span>
          )
        }

        if (group.kind === "phrase") {
          const lookup = wordsByTerm.get(group.term)
          const label = lookup?.term ?? group.term
          const phraseText = group.tokens.map((token) => token.value).join("")
          const phraseParts = group.tokens
            .filter((token) => token.type === "word")
            .map((token) => token.value)
          const phraseOptions = Array.from(new Set([label, ...phraseParts].filter(Boolean)))
          return (
            <span
              key={`phrase-${groupIndex}`}
              className={`inline-flex rounded-md px-1 ${phraseTone.bg} ${phraseTone.shadow}`}
              onMouseEnter={(event) => {
                onMouseEnter()
                openTooltip(event.currentTarget, {
                  kind: "phrase",
                  options: phraseOptions.map((option) => ({
                    label: option,
                    lookup: wordsByTerm.get(normalizeTerm(option)),
                  })),
                })
              }}
              onMouseLeave={onMouseLeave}
            >
              {phraseText}
            </span>
          )
        }

        const token = group.token
        if (token.type === "space") {
          return <span key={`space-${groupIndex}`}>{token.value}</span>
        }

        if (token.type === "word") {
          return (
            <span
              key={`word-${groupIndex}`}
              className="inline-flex rounded-md bg-slate-200/70 px-1 shadow-[0_0_8px_rgba(100,116,139,0.35)]"
              onMouseEnter={(event) => {
                onMouseEnter()
                openTooltip(event.currentTarget, {
                  kind: "unknown",
                  token: token.value,
                })
              }}
              onMouseLeave={onMouseLeave}
            >
              {token.value}
            </span>
          )
        }

        return <span key={`punct-${groupIndex}`}>{token.value}</span>
      })}
      {tooltip && (
        <ReconocimientoTooltip
          tooltip={tooltip}
          activeWord={activeWord}
          draft={draft}
          toneVariant={toneVariant}
          phraseTone={phraseTone}
          phraseSuggestions={phraseSuggestions}
          contextSuggestions={contextSuggestions}
          onAddPhraseSuggestion={onAddPhraseSuggestion}
          onAddContextSuggestion={onAddContextSuggestion}
          onScore={onScore}
          onStartEdit={onStartEdit}
          onToggleActive={onToggleActive}
          onSave={onSave}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          setDraft={setDraft}
        />
      )}
    </div>
  )
}
