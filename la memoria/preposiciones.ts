const preposicionesAkkusativ = [
  {
    id: "de-für",
    term: "für",
    translation: "para",
    context: ["A1", "akkusativ", "präposition"]
  }
]

const preposicionesDativ = [
  {
    id: "de-bei",
    term: "bei",
    translation: "en/con/cerca de",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-mit",
    term: "mit",
    translation: "con",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-aus",
    term: "aus",
    translation: "de/desde",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-nach",
    term: "nach",
    translation: "después/hacia",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-neben",
    term: "neben",
    translation: "al lado de",
    context: ["A2", "akkusativ", "dativ", "präposition"]
  },
  {
    id: "de-prep-seit",
    term: "seit",
    translation: "desde",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-prep-von",
    term: "von",
    translation: "de, desde",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-prep-statt",
    term: "statt",
    translation: "en lugar de, en vez de",
    context: ["B1", "dativ", "genitiv", "präposition"]
  },
  {
    id: "de-prep-ab",
    term: "ab",
    translation: "desde, a partir de",
    context: ["A1", "dativ", "präposition"]
  },
  {
    id: "de-prep-vor",
    term: "vor",
    translation: "delante de, antes de, ante",
    context: ["A1", "akkusativ", "dativ", "präposition"]
  },
  {
    id: "de-prep-von-var",
    term: "von",
    translation: "de, desde",
    context: ["A1", "dativ", "präposition"]
  }
]

const preposicionesGenitiv = [
  {
    id: "de-prep-einschliesslich",
    term: "einschließlich",
    translation: "incluido, inclusive",
    context: ["B2", "genitiv", "präposition"]
  }
]

const preposicionesAllgemein = [
  {
    id: "de-in",
    term: "in",
    translation: "en",
    context: ["A1", "präposition"]
  },
  {
    id: "de-über",
    term: "über",
    translation: "sobre/acerca de",
    context: ["A1", "präposition"]
  },
  {
    id: "de-an",
    term: "an",
    translation: "en/junto a",
    context: ["A1", "präposition"]
  },
  {
    id: "de-auf",
    term: "auf",
    translation: "sobre/en",
    context: ["A1", "präposition"]
  },
  {
    id: "de-um",
    term: "um",
    translation: "alrededor/a",
    context: ["A1", "präposition"]
  },
  {
    id: "de-zu",
    term: "zu",
    translation: "a/hacia",
    context: ["A1", "präposition"]
  },
  {
    id: "de-wegen",
    term: "wegen",
    translation: "por/a causa de",
    context: ["A2", "präposition"]
  },
  {
    id: "de-unter",
    term: "unter",
    translation: "bajo/debajo de",
    context: ["A1", "dativ/akkusativ", "präposition"]
  },
  {
    id: "de-bis",
    term: "bis",
    translation: "hasta",
    context: ["A1", "akkusativ", "präposition"]
  },
  {
    id: "de-zwischen",
    term: "zwischen",
    translation: "entre",
    context: ["A1", "dativ/akkusativ", "präposition"]
  },
  {
    id: "de-während",
    term: "während",
    translation: "durante",
    context: ["A2", "genitiv", "präposition"]
  },
  {
    id: "de-durch",
    term: "durch",
    translation: "por/a través de",
    context: ["A1", "akkusativ", "präposition"]
  }
]

const preposiciones = [
  ...preposicionesAkkusativ,
  ...preposicionesDativ,
  ...preposicionesGenitiv,
  ...preposicionesAllgemein
]

export default preposiciones
