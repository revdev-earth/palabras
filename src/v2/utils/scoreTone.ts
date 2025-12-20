type ScoreTone = {
  bg: string
  border: string
  shadow: string
  text: string
  label: string
}

export const scoreTone = (score: number): ScoreTone => {
  if (score >= 10) {
    return {
      bg: "bg-emerald-100/70",
      border: "border-emerald-100",
      shadow: "shadow-[0_0_8px_rgba(16,185,129,0.25)]",
      text: "text-emerald-700",
      label: "LEARNED",
    }
  }
  if (score >= 7) {
    return {
      bg: "bg-indigo-100/70",
      border: "border-indigo-100",
      shadow: "shadow-[0_0_8px_rgba(99,102,241,0.25)]",
      text: "text-indigo-700",
      label: "LEARNING_3",
    }
  }
  if (score >= 4) {
    return {
      bg: "bg-orange-100/70",
      border: "border-orange-100",
      shadow: "shadow-[0_0_8px_rgba(251,146,60,0.2)]",
      text: "text-orange-700",
      label: "LEARNING_2",
    }
  }
  if (score >= 1) {
    return {
      bg: "bg-yellow-100/70",
      border: "border-yellow-100",
      shadow: "shadow-[0_0_8px_rgba(250,204,21,0.22)]",
      text: "text-yellow-700",
      label: "LEARNING_1",
    }
  }
  return {
    bg: "bg-teal-100/70",
    border: "border-teal-100",
    shadow: "shadow-[0_0_8px_rgba(20,184,166,0.25)]",
    text: "text-teal-700",
    label: "SAVED",
  }
}
