const conjuncionesNebenordnend = [
  {
    id: "de-conj-oder",
    term: "oder",
    translation: "o",
    context: ["A1", "konjunktion", "nebenordnend"]
  }
]

const conjuncionesUnterordnend = [
  {
    id: "de-conj-wenn",
    term: "Wenn",
    translation: "si, cuando",
    context: ["A1", "konjunktion", "unterordnend"]
  }
]

const conjuncionesAllgemein = [
  {
    id: "de-und",
    term: "und",
    translation: "y",
    context: ["A1", "konjunktion"]
  },
  {
    id: "de-als",
    term: "als",
    translation: "que/cuando",
    context: ["A1", "konjunktion"]
  },
  {
    id: "de-aber",
    term: "aber",
    translation: "pero",
    context: ["A1", "konjunktion"]
  },
  {
    id: "de-denn",
    term: "denn",
    translation: "pues/porque",
    context: ["A1", "konjunktion"]
  },
  {
    id: "de-dass",
    term: "dass",
    translation: "que",
    context: ["A2", "konjunktion"]
  }
]

const conjunciones = [
  ...conjuncionesNebenordnend,
  ...conjuncionesUnterordnend,
  ...conjuncionesAllgemein
]

export default conjunciones
