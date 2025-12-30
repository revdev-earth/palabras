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
  },
  {
    id: "de-sowie",
    term: "sowie",
    translation: "así como/y también",
    context: ["B1", "konjunktion", "nebenordnend"]
  },
  {
    id: "de-mal",
    term: "mal",
    translation: "una vez/por una vez",
    context: ["A1", "konjunktion", "adverb"]
  },
  {
    id: "de-weil",
    term: "weil",
    translation: "porque",
    context: ["A1", "konjunktion"]
  },
  {
    id: "de-bevor",
    term: "bevor",
    translation: "antes de que",
    context: ["B1", "konjunktion"]
  },
  {
    id: "de-ob",
    term: "ob",
    translation: "si (condicional)",
    context: ["A1", "konjunktion"]
  },
  {
    id: "de-obwohl",
    term: "obwohl",
    translation: "aunque",
    context: ["A2", "konjunktion"]
  },
  {
    id: "de-sondern",
    term: "sondern",
    translation: "sino",
    context: ["A2", "konjunktion"]
  },
  {
    id: "de-falls",
    term: "Falls",
    translation: "en caso de que",
    context: ["A2", "konjunktion"]
  },
  {
    id: "de-heißt-verb",
    term: "Heißt",
    translation: "se llama/significa",
    context: ["A1", "verb"]
  },
  {
    id: "de-abrupter",
    term: "Abrupter",
    translation: "abrupto",
    context: ["B2", "adjektiv"]
  },
  {
    id: "de-lasst",
    term: "lasst",
    translation: "dejad",
    context: ["A2", "imperativ", "plural"]
  },
  {
    id: "de-männchen",
    term: "Männchen",
    translation: "hombrecito",
    context: ["A2", "das", "neutrum", "substantiv"]
  },
  {
    id: "de-baumrinde",
    term: "Baumrinde",
    translation: "corteza de árbol",
    context: ["A2", "die", "feminin", "substantiv"]
  },
  {
    id: "de-hab",
    term: "hab",
    translation: "tengo (informal)",
    context: ["A1", "erste-person", "verb"]
  },
  {
    id: "de-platt",
    term: "platt",
    translation: "aplastado/plano",
    context: ["A2", "adjektiv"]
  },
  {
    id: "de-reden",
    term: "Reden",
    translation: "charlas/conversaciones",
    context: ["A2", "das", "neutrum", "substantiv"]
  },
  {
    id: "de-hübscher",
    term: "Hübscher",
    translation: "guapo",
    context: ["A2", "adjektiv"]
  },
  {
    id: "de-liebsten",
    term: "liebsten",
    translation: "más querido",
    context: ["A2", "adjektiv", "superlativ"]
  },
  {
    id: "de-witze",
    term: "Witze",
    translation: "chistes",
    context: ["A2", "der", "maskulin", "plural", "substantiv"]
  },
  {
    id: "de-ganze",
    term: "ganze",
    translation: "entero",
    context: ["A1", "adjektiv"]
  },
  {
    id: "de-stube",
    term: "Stube",
    translation: "sala",
    context: ["A2", "die", "feminin", "substantiv"]
  },
  {
    id: "de-dran",
    term: "dran",
    translation: "en ello/turno",
    context: ["A2", "adverb"]
  },
  {
    id: "de-weihnachten",
    term: "Weihnachten",
    translation: "Navidad",
    context: ["A1", "das", "neutrum", "substantiv"]
  }
]

const conjunciones = [
  ...conjuncionesNebenordnend,
  ...conjuncionesUnterordnend,
  ...conjuncionesAllgemein
]

export default conjunciones
