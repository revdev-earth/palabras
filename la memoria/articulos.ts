const articulosBestimmt = [
  {
    id: "de-ein",
    term: "ein",
    translation: "un/uno",
    context: ["A1", "artikel", "bestimmt", "maskulin", "neutrum"]
  },
  {
    id: "de-einem",
    term: "einem",
    translation: "a un/uno",
    context: ["A1", "artikel", "bestimmt", "dativ"]
  }
]

const articulosAllgemein = [
  {
    id: "de-dem",
    term: "dem",
    translation: "al/el",
    context: ["A1", "artikel", "dativ"]
  },
  {
    id: "de-den",
    term: "den",
    translation: "el/los",
    context: ["A1", "akkusativ", "artikel"]
  },
  {
    id: "de-prep-zum",
    term: "zum",
    translation: "al, para el",
    context: ["A1", "artikel", "dativ", "maskulin", "neutrum"]
  },
  {
    id: "de-kein",
    term: "kein",
    translation: "ningún/ninguno",
    context: ["A1", "artikel", "negativ"]
  },
  {
    id: "de-des",
    term: "des",
    translation: "del (de + el)",
    context: ["A1", "artikel", "genitiv", "maskulin-neutrum"]
  },
  {
    id: "de-im",
    term: "im",
    translation: "en el (in + dem)",
    context: ["A1", "artikel", "dativ", "maskulin-neutrum"]
  },
  {
    id: "de-vom",
    term: "vom",
    translation: "del/de (von + dem)",
    context: ["A1", "artikel", "dativ", "maskulin-neutrum"]
  },
  {
    id: "de-zur",
    term: "zur",
    translation: "a la/hacia la (zu + der)",
    context: ["A1", "artikel", "dativ", "feminin"]
  },
  {
    id: "de-einen",
    term: "einen",
    translation: "un/uno (akkusativ)",
    context: ["A1", "akkusativ", "artikel", "maskulin"]
  },
  {
    id: "de-ins",
    term: "ins",
    translation: "en el/al (in + das)",
    context: ["A1", "akkusativ", "artikel", "neutrum"]
  }
]

const articulos = [
  ...articulosBestimmt,
  ...articulosAllgemein
]

export default articulos
