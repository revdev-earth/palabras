type ScoreTone = {
  bg: string
  border: string
  shadow: string
  text: string
  label: string
}

export type ToneVariant = "green" | "blue" | "purple" | "mix"

const toneVariants: Record<ToneVariant, Record<1 | 2 | 3, { bg: string; text: string }>> = {
  green: {
    1: { bg: "bg-[#66BB6A]", text: "text-emerald-900" },
    2: { bg: "bg-[#C8E6C9]", text: "text-emerald-900" },
    3: { bg: "bg-[#F1F8E9]", text: "text-emerald-900" },
  },
  blue: {
    1: { bg: "bg-[#42A5F5]", text: "text-blue-900" },
    2: { bg: "bg-[#BBDEFB]", text: "text-blue-900" },
    3: { bg: "bg-[#E3F2FD]", text: "text-blue-900" },
  },
  purple: {
    1: { bg: "bg-[#AB47BC]", text: "text-purple-900" },
    2: { bg: "bg-[#E1BEE7]", text: "text-purple-900" },
    3: { bg: "bg-[#F3E5F5]", text: "text-purple-900" },
  },
  mix: {
    1: { bg: "bg-[#FDD835]", text: "text-yellow-900" },
    2: { bg: "bg-[#FFF9C4]", text: "text-amber-900" },
    3: { bg: "bg-[#E8F5E9]", text: "text-emerald-900" },
  },
}

const getVariantTone = (variant: ToneVariant, level: 1 | 2 | 3) => toneVariants[variant][level]

export const scoreTone = (score: number, variant: ToneVariant = "mix"): ScoreTone => {
  if (score >= 10) {
    return {
      bg: "bg-transparent",
      border: "border-emerald-200",
      shadow: "shadow-none",
      text: "text-emerald-800",
      label: "LEARNED",
    }
  }
  if (score >= 7) {
    const tone = getVariantTone(variant, 3)
    return {
      bg: tone.bg,
      border: tone.bg.replace("bg-", "border-"),
      shadow: "shadow-none",
      text: tone.text,
      label: "LEARNING_3",
    }
  }
  if (score >= 4) {
    const tone = getVariantTone(variant, 2)
    return {
      bg: tone.bg,
      border: tone.bg.replace("bg-", "border-"),
      shadow: "shadow-none",
      text: tone.text,
      label: "LEARNING_2",
    }
  }
  if (score >= 1) {
    const tone = getVariantTone(variant, 1)
    return {
      bg: tone.bg,
      border: tone.bg.replace("bg-", "border-"),
      shadow: "shadow-none",
      text: tone.text,
      label: "LEARNING_1",
    }
  }
  return {
    bg: "bg-slate-100/70",
    border: "border-slate-200",
    shadow: "shadow-[0_0_8px_rgba(148,163,184,0.2)]",
    text: "text-slate-700",
    label: "SAVED",
  }
}
