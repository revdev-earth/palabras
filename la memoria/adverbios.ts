const adverbiosFrequenz = [
  {
    id: "de-oft",
    term: "oft",
    translation: "a menudo",
    context: ["A1", "adverb", "frequenz"]
  },
  {
    id: "de-adv-wie-oft",
    term: "wie oft",
    translation: "¿con qué frecuencia?",
    context: ["A1", "adverb", "frequenz"]
  },
  {
    id: "de-adv-wievielmal",
    term: "wievielmal",
    translation: "¿cuántas veces?",
    context: ["B1", "adverb", "frequenz"]
  }
]

const adverbiosLokal = [
  {
    id: "de-vorne",
    term: "vorne",
    translation: "adelante",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-da",
    term: "da",
    translation: "ahí/allí",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-oben",
    term: "oben",
    translation: "arriba",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-unten",
    term: "unten",
    translation: "abajo",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-hier",
    term: "hier",
    translation: "aquí",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-da",
    term: "da",
    translation: "ahí, allí",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-dort",
    term: "dort",
    translation: "allí, allá",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-dorther",
    term: "dorther",
    translation: "de allí, desde allí",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-oben",
    term: "oben",
    translation: "arriba",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-unten",
    term: "unten",
    translation: "abajo",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-vorn",
    term: "vorn(e)",
    translation: "delante, adelante",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-hinten",
    term: "hinten",
    translation: "atrás, detrás",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-links",
    term: "links",
    translation: "a la izquierda",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-rechts",
    term: "rechts",
    translation: "a la derecha",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-innen",
    term: "innen",
    translation: "dentro, en el interior",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-aussen",
    term: "außen",
    translation: "fuera, en el exterior",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-draussen",
    term: "draußen",
    translation: "afuera",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-drinnen",
    term: "drinnen",
    translation: "adentro",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-dazwischen",
    term: "dazwischen",
    translation: "en medio, entre",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-mittendrin",
    term: "mittendrin",
    translation: "en medio, en el centro",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-nebenan",
    term: "nebenan",
    translation: "al lado, en el lado contiguo",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-daneben",
    term: "daneben",
    translation: "al lado de eso, junto a eso",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-gegenueber",
    term: "gegenüber",
    translation: "enfrente, frente a",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-irgendwo",
    term: "irgendwo",
    translation: "en algún lugar",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-nirgendwo",
    term: "nirgendwo",
    translation: "en ningún lugar",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-nirgends",
    term: "nirgends",
    translation: "en ninguna parte",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-ueberall",
    term: "überall",
    translation: "en todas partes",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-allenthalben",
    term: "allenthalben",
    translation: "por doquier, en todas partes",
    context: ["C1", "adverb", "lokal"]
  },
  {
    id: "de-adv-hierher",
    term: "hierher",
    translation: "hacia aquí",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-daher",
    term: "daher",
    translation: "de ahí, por eso",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-dorthin",
    term: "dorthin",
    translation: "hacia allí",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-hinauf",
    term: "hinauf",
    translation: "hacia arriba (alejándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-herauf",
    term: "herauf",
    translation: "hacia arriba (acercándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-aufwaerts",
    term: "aufwärts",
    translation: "hacia arriba, ascendente",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-empor",
    term: "empor",
    translation: "hacia arriba, hacia lo alto",
    context: ["C1", "adverb", "lokal"]
  },
  {
    id: "de-adv-hinunter",
    term: "hinunter",
    translation: "hacia abajo (alejándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-herunter",
    term: "herunter",
    translation: "hacia abajo (acercándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-hinab",
    term: "hinab",
    translation: "hacia abajo (formal/poético)",
    context: ["C1", "adverb", "lokal"]
  },
  {
    id: "de-adv-herab",
    term: "herab",
    translation: "hacia abajo (formal/poético)",
    context: ["C1", "adverb", "lokal"]
  },
  {
    id: "de-adv-abwaerts",
    term: "abwärts",
    translation: "hacia abajo, descendente",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-vorwaerts",
    term: "vorwärts",
    translation: "hacia adelante",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-rueckwaerts",
    term: "rückwärts",
    translation: "hacia atrás",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-seitwaerts",
    term: "seitwärts",
    translation: "hacia el lado, lateralmente",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-querfeldein",
    term: "querfeldein",
    translation: "a campo traviesa",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-heimwaerts",
    term: "heimwärts",
    translation: "hacia casa",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-ostwaerts",
    term: "ostwärts",
    translation: "hacia el este",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-nordwaerts",
    term: "nordwärts",
    translation: "hacia el norte",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-suedwaerts",
    term: "südwärts",
    translation: "hacia el sur",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-westwaerts",
    term: "westwärts",
    translation: "hacia el oeste",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-bergauf",
    term: "bergauf",
    translation: "cuesta arriba",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-bergab",
    term: "bergab",
    translation: "cuesta abajo",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-flussaufwaerts",
    term: "flussaufwärts",
    translation: "río arriba",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-flussabwaerts",
    term: "flussabwärts",
    translation: "río abajo",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-stadteinwaerts",
    term: "stadteinwärts",
    translation: "hacia el centro de la ciudad",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-stadtauswaerts",
    term: "stadtauswärts",
    translation: "hacia afuera de la ciudad",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-nah",
    term: "nah(e)",
    translation: "cerca",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-fern",
    term: "fern",
    translation: "lejos",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-weit-distancia",
    term: "weit",
    translation: "lejos, amplio",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-ringsum",
    term: "ringsum",
    translation: "alrededor, en torno",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-rundum",
    term: "rundum",
    translation: "alrededor, completamente",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-ringsherum",
    term: "ringsherum",
    translation: "alrededor, en círculo",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-oberhalb",
    term: "oberhalb",
    translation: "por encima de, arriba de",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-unterhalb",
    term: "unterhalb",
    translation: "por debajo de, debajo de",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-innerhalb",
    term: "innerhalb",
    translation: "dentro de, en el interior de",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-ausserhalb",
    term: "außerhalb",
    translation: "fuera de, en el exterior de",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-diesseits",
    term: "diesseits",
    translation: "de este lado",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-jenseits",
    term: "jenseits",
    translation: "del otro lado, más allá",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-anderswo",
    term: "anderswo",
    translation: "en otra parte",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-anderwaerts",
    term: "anderwärts",
    translation: "en otra parte, en otro lugar",
    context: ["B2", "adverb", "lokal"]
  },
  {
    id: "de-adv-woanders",
    term: "woanders",
    translation: "en otro lugar",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-hin",
    term: "hin",
    translation: "hacia allá (alejándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-her",
    term: "her",
    translation: "hacia acá (acercándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-hinein",
    term: "hinein",
    translation: "hacia dentro (alejándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-herein",
    term: "herein",
    translation: "hacia dentro (acercándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-rein",
    term: "rein",
    translation: "adentro (coloquial)",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-hinaus",
    term: "hinaus",
    translation: "hacia fuera (alejándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-heraus",
    term: "heraus",
    translation: "hacia fuera (acercándose)",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-raus",
    term: "raus",
    translation: "afuera (coloquial)",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-umher",
    term: "umher",
    translation: "alrededor, de un lado a otro",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-herum",
    term: "herum",
    translation: "alrededor",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-fort",
    term: "fort",
    translation: "lejos, fuera",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-weg",
    term: "weg",
    translation: "lejos, fuera",
    context: ["A1", "adverb", "lokal"]
  },
  {
    id: "de-adv-entlang",
    term: "entlang",
    translation: "a lo largo de",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-entgegen",
    term: "entgegen",
    translation: "hacia, al encuentro de",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-voraus",
    term: "voraus",
    translation: "adelante, por delante",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-aufeinander",
    term: "aufeinander",
    translation: "uno sobre otro, uno hacia otro",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-auseinander",
    term: "auseinander",
    translation: "separados, apartados",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-durcheinander",
    term: "durcheinander",
    translation: "desordenado, mezclado",
    context: ["A2", "adverb", "lokal"]
  },
  {
    id: "de-adv-abseits",
    term: "abseits",
    translation: "apartado, alejado, fuera de juego",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-beiseite",
    term: "beiseite",
    translation: "a un lado, aparte",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-seitlich",
    term: "seitlich",
    translation: "lateral, de lado",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-mittig",
    term: "mittig",
    translation: "en el medio, central",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-zentral",
    term: "zentral",
    translation: "central, céntrico",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-flach",
    term: "flach",
    translation: "plano, llano",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-steil",
    term: "steil",
    translation: "empinado, inclinado",
    context: ["B1", "adverb", "lokal"]
  },
  {
    id: "de-adv-hier-var",
    term: "hier",
    translation: "aquí",
    context: ["A1", "adverb", "lokal"]
  }
]

const adverbiosModal = [
  {
    id: "de-adv-so",
    term: "so",
    translation: "así, tan",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-ebenso",
    term: "ebenso",
    translation: "igualmente, del mismo modo",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-genauso",
    term: "genauso",
    translation: "exactamente igual, de la misma manera",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-also",
    term: "also",
    translation: "así, entonces, por lo tanto",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-anders",
    term: "anders",
    translation: "de otra manera, diferente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-anderswie",
    term: "anderswie",
    translation: "de otra forma, de otro modo",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-irgendwie",
    term: "irgendwie",
    translation: "de alguna manera, de algún modo",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-sowieso",
    term: "sowieso",
    translation: "de todos modos, de todas formas",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-ja",
    term: "ja",
    translation: "sí",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-doch",
    term: "doch",
    translation: "sí (contradicción), sin embargo",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-freilich",
    term: "freilich",
    translation: "por supuesto, ciertamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-gewiss",
    term: "gewiss",
    translation: "ciertamente, sin duda",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-allerdings",
    term: "allerdings",
    translation: "ciertamente, desde luego, aunque",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-fuerwahr",
    term: "fürwahr",
    translation: "en verdad, verdaderamente",
    context: ["C1", "adverb", "modal"]
  },
  {
    id: "de-adv-nein",
    term: "nein",
    translation: "no",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-nicht",
    term: "nicht",
    translation: "no",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-keineswegs",
    term: "keineswegs",
    translation: "de ninguna manera, en absoluto",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-mitnichten",
    term: "mitnichten",
    translation: "de ningún modo, en absoluto",
    context: ["C1", "adverb", "modal"]
  },
  {
    id: "de-adv-gut",
    term: "gut",
    translation: "bien",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-schlecht",
    term: "schlecht",
    translation: "mal",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-gern",
    term: "gern(e)",
    translation: "con gusto, de buena gana",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-ungern",
    term: "ungern",
    translation: "de mala gana, a disgusto",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-richtig",
    term: "richtig",
    translation: "correctamente, bien",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-falsch",
    term: "falsch",
    translation: "incorrectamente, mal",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-leicht",
    term: "leicht",
    translation: "fácilmente, ligeramente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-schwer",
    term: "schwer",
    translation: "difícilmente, pesadamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-schnell",
    term: "schnell",
    translation: "rápidamente, rápido",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-langsam",
    term: "langsam",
    translation: "lentamente, despacio",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-laut",
    term: "laut",
    translation: "en voz alta, ruidosamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-leise",
    term: "leise",
    translation: "en voz baja, silenciosamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-zusammen",
    term: "zusammen",
    translation: "juntos",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-gemeinsam",
    term: "gemeinsam",
    translation: "conjuntamente, en común",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-miteinander",
    term: "miteinander",
    translation: "el uno con el otro, mutuamente",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-allein",
    term: "allein",
    translation: "solo, solamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-einzeln",
    term: "einzeln",
    translation: "individualmente, por separado",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-absichtlich",
    term: "absichtlich",
    translation: "intencionalmente, a propósito",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-vorsaetzlich",
    term: "vorsätzlich",
    translation: "premeditadamente, deliberadamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-wissentlich",
    term: "wissentlich",
    translation: "a sabiendas, conscientemente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-versehentlich",
    term: "versehentlich",
    translation: "por error, accidentalmente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-unabsichtlich",
    term: "unabsichtlich",
    translation: "sin querer, involuntariamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-unwissentlich",
    term: "unwissentlich",
    translation: "sin saberlo, inconscientemente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-freiwillig",
    term: "freiwillig",
    translation: "voluntariamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-unfreiwillig",
    term: "unfreiwillig",
    translation: "involuntariamente, a la fuerza",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-umsonst",
    term: "umsonst",
    translation: "en vano, gratis",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-vergebens",
    term: "vergebens",
    translation: "en vano, inútilmente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-vergeblich",
    term: "vergeblich",
    translation: "en vano, infructuosamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-blind",
    term: "blind",
    translation: "ciegamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-blindlings",
    term: "blindlings",
    translation: "a ciegas, ciegamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-kopfueber",
    term: "kopfüber",
    translation: "de cabeza",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-hals-ueber-kopf",
    term: "hals über Kopf",
    translation: "precipitadamente, a toda prisa",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-ebenfalls",
    term: "ebenfalls",
    translation: "igualmente, también",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-gleichfalls",
    term: "gleichfalls",
    translation: "igualmente, asimismo",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-ebenso-comp",
    term: "ebenso",
    translation: "igualmente, del mismo modo",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-desgleichen",
    term: "desgleichen",
    translation: "igualmente, asimismo",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-aehnlich",
    term: "ähnlich",
    translation: "similarmente, de manera parecida",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-gleichermassen",
    term: "gleichermaßen",
    translation: "por igual, de la misma manera",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-bestimmt",
    term: "bestimmt",
    translation: "seguramente, con seguridad",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-sicherlich",
    term: "sicherlich",
    translation: "seguramente, ciertamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-gewiss-cert",
    term: "gewiss",
    translation: "ciertamente, sin duda",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-vielleicht",
    term: "vielleicht",
    translation: "quizás, tal vez",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-moeglicherweise",
    term: "möglicherweise",
    translation: "posiblemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-eventuell",
    term: "eventuell",
    translation: "eventualmente, posiblemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-wahrscheinlich",
    term: "wahrscheinlich",
    translation: "probablemente",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-vermutlich",
    term: "vermutlich",
    translation: "presumiblemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-hoffentlich",
    term: "hoffentlich",
    translation: "ojalá, esperemos que",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-gluecklicherweise",
    term: "glücklicherweise",
    translation: "afortunadamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-leider",
    term: "leider",
    translation: "lamentablemente, desgraciadamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-bedauerlicherweise",
    term: "bedauerlicherweise",
    translation: "lamentablemente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-ungluecklicherweise",
    term: "unglücklicherweise",
    translation: "desafortunadamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-nur",
    term: "nur",
    translation: "solo, solamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-bloss",
    term: "bloß",
    translation: "solo, meramente",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-lediglich",
    term: "lediglich",
    translation: "únicamente, meramente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-ausschliesslich",
    term: "ausschließlich",
    translation: "exclusivamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-einzig",
    term: "einzig",
    translation: "únicamente, solo",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-allein-excl",
    term: "allein",
    translation: "solamente, solo",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-insbesondere",
    term: "insbesondere",
    translation: "especialmente, en particular",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-besonders",
    term: "besonders",
    translation: "especialmente, particularmente",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-namentlich",
    term: "namentlich",
    translation: "especialmente, nominalmente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-vornehmlich",
    term: "vornehmlich",
    translation: "principalmente, sobre todo",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-hauptsaechlich",
    term: "hauptsächlich",
    translation: "principalmente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-vorwiegend",
    term: "vorwiegend",
    translation: "predominantemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-ueberwiegend",
    term: "überwiegend",
    translation: "mayormente, predominantemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-bejahendenfalls",
    term: "bejahendenfalls",
    translation: "en caso afirmativo",
    context: ["C1", "adverb", "modal"]
  },
  {
    id: "de-adv-verneinendenfalls",
    term: "verneinendenfalls",
    translation: "en caso negativo",
    context: ["C1", "adverb", "modal"]
  },
  {
    id: "de-adv-gegebenenfalls",
    term: "gegebenenfalls",
    translation: "en su caso, si procede",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-notfalls",
    term: "notfalls",
    translation: "en caso de necesidad, si es necesario",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-schlimmstenfalls",
    term: "schlimmstenfalls",
    translation: "en el peor de los casos",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-bestenfalls",
    term: "bestenfalls",
    translation: "en el mejor de los casos",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-gratis",
    term: "gratis",
    translation: "gratis, gratuito",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-kostenlos",
    term: "kostenlos",
    translation: "sin costo, gratuito",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-halb",
    term: "halb",
    translation: "a medias, medio",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-ganz",
    term: "ganz",
    translation: "completamente, totalmente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-voellig",
    term: "völlig",
    translation: "completamente, totalmente",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-vollstaendig",
    term: "vollständig",
    translation: "completamente, íntegramente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-teilweise",
    term: "teilweise",
    translation: "parcialmente, en parte",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-beinahe",
    term: "beinahe",
    translation: "casi",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-fast",
    term: "fast",
    translation: "casi",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-nahezu",
    term: "nahezu",
    translation: "casi, prácticamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-annaehernd",
    term: "annähernd",
    translation: "aproximadamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-kaum",
    term: "kaum",
    translation: "apenas",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-schwerlich",
    term: "schwerlich",
    translation: "difícilmente, apenas",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-wirklich",
    term: "wirklich",
    translation: "realmente, verdaderamente",
    context: ["A1", "adverb", "modal"]
  },
  {
    id: "de-adv-tatsaechlich",
    term: "tatsächlich",
    translation: "efectivamente, de hecho",
    context: ["A2", "adverb", "modal"]
  },
  {
    id: "de-adv-wahrhaftig",
    term: "wahrhaftig",
    translation: "verdaderamente, de veras",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-anscheinend",
    term: "anscheinend",
    translation: "aparentemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-scheinbar",
    term: "scheinbar",
    translation: "aparentemente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-offenbar",
    term: "offenbar",
    translation: "evidentemente, obviamente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-offensichtlich",
    term: "offensichtlich",
    translation: "obviamente, claramente",
    context: ["B1", "adverb", "modal"]
  },
  {
    id: "de-adv-sozusagen",
    term: "sozusagen",
    translation: "por así decirlo",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-gewissermassen",
    term: "gewissermaßen",
    translation: "en cierto modo, hasta cierto punto",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-quasi",
    term: "quasi",
    translation: "casi, prácticamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-foermlich",
    term: "förmlich",
    translation: "formalmente, literalmente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-regelrecht",
    term: "regelrecht",
    translation: "literalmente, directamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-geradezu",
    term: "geradezu",
    translation: "prácticamente, directamente",
    context: ["B2", "adverb", "modal"]
  },
  {
    id: "de-adv-wie-interr",
    term: "wie",
    translation: "¿cómo?",
    context: ["A1", "adverb", "modal"]
  }
]

const adverbiosQuantitativ = [
  {
    id: "de-adv-ein-wenig",
    term: "ein wenig",
    translation: "un poco",
    context: ["A1", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-ein-bisschen",
    term: "ein bisschen",
    translation: "un poquito",
    context: ["A1", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-kaum-grad",
    term: "kaum",
    translation: "apenas",
    context: ["A2", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-geringfuegig",
    term: "geringfügig",
    translation: "levemente, ligeramente",
    context: ["B2", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-marginal",
    term: "marginal",
    translation: "marginalmente",
    context: ["B2", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-zu-viel",
    term: "zu viel",
    translation: "demasiado",
    context: ["A1", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-ausreichend",
    term: "ausreichend",
    translation: "suficientemente",
    context: ["B1", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-ungefaehr",
    term: "ungefähr",
    translation: "aproximadamente",
    context: ["A2", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-rund",
    term: "rund",
    translation: "aproximadamente, alrededor de",
    context: ["A2", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-knapp",
    term: "knapp",
    translation: "escasamente, apenas",
    context: ["A2", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-viel",
    term: "viel",
    translation: "mucho",
    context: ["A1", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-wenig-rel",
    term: "wenig",
    translation: "poco",
    context: ["A1", "adverb", "quantitativ"]
  },
  {
    id: "de-adv-wie-viel",
    term: "wie viel(e)",
    translation: "¿cuánto/cuántos?",
    context: ["A1", "adverb", "quantitativ"]
  }
]

const adverbiosTemporal = [
  {
    id: "de-dann",
    term: "dann",
    translation: "entonces/luego",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-damals",
    term: "damals",
    translation: "en aquel entonces",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-erst",
    term: "erst",
    translation: "primero/recién",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-heute",
    term: "heute",
    translation: "hoy",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-gestern",
    term: "gestern",
    translation: "ayer",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-morgen",
    term: "morgen",
    translation: "mañana",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-vorgestern",
    term: "vorgestern",
    translation: "anteayer",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-uebermorgen",
    term: "übermorgen",
    translation: "pasado mañana",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-jetzt",
    term: "jetzt",
    translation: "ahora",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-nun",
    term: "nun",
    translation: "ahora, pues",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-gerade",
    term: "gerade",
    translation: "justo ahora, precisamente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-sofort",
    term: "sofort",
    translation: "inmediatamente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-gleich",
    term: "gleich",
    translation: "enseguida, pronto",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-damals",
    term: "damals",
    translation: "en aquel entonces",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-einst",
    term: "einst",
    translation: "antaño, en otro tiempo",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-neulich",
    term: "neulich",
    translation: "hace poco, recientemente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-kuerzlich",
    term: "kürzlich",
    translation: "recientemente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-immer",
    term: "immer",
    translation: "siempre",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-stets",
    term: "stets",
    translation: "siempre, constantemente",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-ewig",
    term: "ewig",
    translation: "eternamente, siempre",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-oft",
    term: "oft",
    translation: "a menudo, frecuentemente",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-haeufig",
    term: "häufig",
    translation: "frecuentemente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-oefters",
    term: "öfters",
    translation: "a menudo, varias veces",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-manchmal",
    term: "manchmal",
    translation: "a veces",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-mitunter",
    term: "mitunter",
    translation: "a veces, de vez en cuando",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-gelegentlich",
    term: "gelegentlich",
    translation: "ocasionalmente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-bisweilen",
    term: "bisweilen",
    translation: "a veces, de vez en cuando",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-selten",
    term: "selten",
    translation: "rara vez, raramente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-nie",
    term: "nie",
    translation: "nunca",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-niemals",
    term: "niemals",
    translation: "nunca jamás",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-nimmer",
    term: "nimmer",
    translation: "nunca (poético/dialectal)",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-lange",
    term: "lange",
    translation: "largo tiempo, mucho tiempo",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-kurz",
    term: "kurz",
    translation: "brevemente, poco tiempo",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-tagelang",
    term: "tagelang",
    translation: "durante días",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-wochenlang",
    term: "wochenlang",
    translation: "durante semanas",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-monatelang",
    term: "monatelang",
    translation: "durante meses",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-jahrelang",
    term: "jahrelang",
    translation: "durante años",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-zuerst",
    term: "zuerst",
    translation: "primero, en primer lugar",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-erst",
    term: "erst",
    translation: "primero, solo, recién",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-anfangs",
    term: "anfangs",
    translation: "al principio",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-dann",
    term: "dann",
    translation: "entonces, luego",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-danach",
    term: "danach",
    translation: "después de eso",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-darauf",
    term: "darauf",
    translation: "después de eso, a continuación",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-nachher",
    term: "nachher",
    translation: "después, más tarde",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-anschliessend",
    term: "anschließend",
    translation: "a continuación",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-hierauf",
    term: "hierauf",
    translation: "acto seguido, después de esto",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-vorher",
    term: "vorher",
    translation: "antes",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-zuvor",
    term: "zuvor",
    translation: "antes, previamente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-davor",
    term: "davor",
    translation: "antes de eso",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-frueher",
    term: "früher",
    translation: "antes, antiguamente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-spaeter",
    term: "später",
    translation: "más tarde",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-hinterher",
    term: "hinterher",
    translation: "después, posteriormente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-zuletzt",
    term: "zuletzt",
    translation: "por último, finalmente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-schliesslich",
    term: "schließlich",
    translation: "finalmente, por fin",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-endlich",
    term: "endlich",
    translation: "por fin, finalmente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-inzwischen",
    term: "inzwischen",
    translation: "mientras tanto",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-unterdessen",
    term: "unterdessen",
    translation: "mientras tanto, entretanto",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-waehrenddessen",
    term: "währenddessen",
    translation: "mientras tanto",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-mittlerweile",
    term: "mittlerweile",
    translation: "mientras tanto, entretanto",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-wieder",
    term: "wieder",
    translation: "otra vez, de nuevo",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-erneut",
    term: "erneut",
    translation: "de nuevo, nuevamente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-nochmals",
    term: "nochmals",
    translation: "una vez más",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-abermals",
    term: "abermals",
    translation: "otra vez más, de nuevo",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-wiederum",
    term: "wiederum",
    translation: "a su vez, por otra parte",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-schon",
    term: "schon",
    translation: "ya",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-bereits",
    term: "bereits",
    translation: "ya",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-noch",
    term: "noch",
    translation: "todavía, aún",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-noch-nicht",
    term: "noch nicht",
    translation: "todavía no, aún no",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-bald",
    term: "bald",
    translation: "pronto",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-demnaechst",
    term: "demnächst",
    translation: "próximamente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-soeben",
    term: "soeben",
    translation: "justo ahora, recién",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-eben",
    term: "eben",
    translation: "justo, recién",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-morgens",
    term: "morgens",
    translation: "por la mañana",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-vormittags",
    term: "vormittags",
    translation: "por la mañana (antes del mediodía)",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-mittags",
    term: "mittags",
    translation: "al mediodía",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-nachmittags",
    term: "nachmittags",
    translation: "por la tarde",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-abends",
    term: "abends",
    translation: "por la noche (temprano)",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-nachts",
    term: "nachts",
    translation: "por la noche (tarde)",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-montags",
    term: "montags",
    translation: "los lunes",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-dienstags",
    term: "dienstags",
    translation: "los martes",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-mittwochs",
    term: "mittwochs",
    translation: "los miércoles",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-donnerstags",
    term: "donnerstags",
    translation: "los jueves",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-freitags",
    term: "freitags",
    translation: "los viernes",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-samstags",
    term: "samstags",
    translation: "los sábados",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-sonntags",
    term: "sonntags",
    translation: "los domingos",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-wochentags",
    term: "wochentags",
    translation: "entre semana",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-werktags",
    term: "werktags",
    translation: "días laborables",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-zugleich",
    term: "zugleich",
    translation: "al mismo tiempo, a la vez",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-gleichzeitig",
    term: "gleichzeitig",
    translation: "simultáneamente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-vorhin",
    term: "vorhin",
    translation: "hace un rato, hace poco",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-alsbald",
    term: "alsbald",
    translation: "pronto, en breve",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-ehestens",
    term: "ehestens",
    translation: "lo antes posible",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-baldigst",
    term: "baldigst",
    translation: "lo más pronto posible",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-vorerst",
    term: "vorerst",
    translation: "por ahora, de momento",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-einstweilen",
    term: "einstweilen",
    translation: "por el momento, de momento",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-vorlaeufig",
    term: "vorläufig",
    translation: "provisionalmente, provisional",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-fortan",
    term: "fortan",
    translation: "en adelante, desde ahora",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-hinfort",
    term: "hinfort",
    translation: "en adelante",
    context: ["adverb", "temporal"]
  },
  {
    id: "de-adv-kuenftig",
    term: "künftig",
    translation: "en el futuro, futuro",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-zukuenftig",
    term: "zukünftig",
    translation: "futuro, venidero",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-neuerdings",
    term: "neuerdings",
    translation: "últimamente, recientemente",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-juengst",
    term: "jüngst",
    translation: "recientemente",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-unlaengst",
    term: "unlängst",
    translation: "hace poco, recientemente",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-letztens",
    term: "letztens",
    translation: "últimamente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-letzthin",
    term: "letzthin",
    translation: "últimamente, recientemente",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-dauernd",
    term: "dauernd",
    translation: "constantemente, continuamente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-staendig",
    term: "ständig",
    translation: "constantemente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-andauernd",
    term: "andauernd",
    translation: "continuamente, sin cesar",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-fortlaufend",
    term: "fortlaufend",
    translation: "continuamente, de forma continua",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-fortwaehrend",
    term: "fortwährend",
    translation: "continuamente, perpetuamente",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-voruebergehend",
    term: "vorübergehend",
    translation: "temporalmente, provisionalmente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-zeitweise",
    term: "zeitweise",
    translation: "temporalmente, a veces",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-zeitweilig",
    term: "zeitweilig",
    translation: "temporal, ocasional",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-augenblicklich",
    term: "augenblicklich",
    translation: "momentáneamente, en este momento",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-momentan",
    term: "momentan",
    translation: "momentáneamente, actualmente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-rechtzeitig",
    term: "rechtzeitig",
    translation: "a tiempo, puntualmente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-puenktlich",
    term: "pünktlich",
    translation: "puntual, puntualmente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-verspaetet",
    term: "verspätet",
    translation: "con retraso, tardíamente",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-vorzeitig",
    term: "vorzeitig",
    translation: "prematuramente, anticipadamente",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-fruehzeitig",
    term: "frühzeitig",
    translation: "temprano, con anticipación",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-sogleich",
    term: "sogleich",
    translation: "inmediatamente, enseguida",
    context: ["B2", "adverb", "temporal"]
  },
  {
    id: "de-adv-alsogleich",
    term: "alsogleich",
    translation: "inmediatamente, al instante",
    context: ["C1", "adverb", "temporal"]
  },
  {
    id: "de-adv-allmaehlich",
    term: "allmählich",
    translation: "gradualmente, poco a poco",
    context: ["B1", "adverb", "temporal"]
  },
  {
    id: "de-adv-wann",
    term: "wann",
    translation: "¿cuándo?",
    context: ["A1", "adverb", "temporal"]
  },
  {
    id: "de-adv-seit-wann",
    term: "seit wann",
    translation: "¿desde cuándo?",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-bis-wann",
    term: "bis wann",
    translation: "¿hasta cuándo?",
    context: ["A2", "adverb", "temporal"]
  },
  {
    id: "de-adv-taeglich",
    term: "täglich",
    translation: "diariamente, cada día",
    context: ["A1", "adverb", "temporal"]
  }
]

const adverbiosAllgemein = [
  {
    id: "de-so",
    term: "so",
    translation: "así/tan",
    context: ["A1", "adverb"]
  },
  {
    id: "de-nur",
    term: "nur",
    translation: "solo/solamente",
    context: ["A1", "adverb"]
  },
  {
    id: "de-gerne",
    term: "gerne",
    translation: "con gusto",
    context: ["A1", "adverb"]
  },
  {
    id: "de-also",
    term: "also",
    translation: "entonces/así que",
    context: ["A1", "adverb"]
  },
  {
    id: "de-links",
    term: "links",
    translation: "izquierda",
    context: ["A1", "adverb"]
  },
  {
    id: "de-zurück",
    term: "zurück",
    translation: "atrás/de vuelta",
    context: ["A1", "adverb"]
  },
  {
    id: "de-wie",
    term: "wie",
    translation: "cómo",
    context: ["A1", "adverb"]
  },
  {
    id: "de-rechts",
    term: "rechts",
    translation: "derecha",
    context: ["A1", "adverb"]
  },
  {
    id: "de-auch",
    term: "auch",
    translation: "también",
    context: ["A1", "adverb"]
  },
  {
    id: "de-hoffentlich",
    term: "hoffentlich",
    translation: "ojalá/con suerte",
    context: ["A1", "adverb"]
  },
  {
    id: "de-ganz",
    term: "ganz",
    translation: "completamente/todo",
    context: ["A1", "adverb"]
  },
  {
    id: "de-vielleicht",
    term: "vielleicht",
    translation: "quizás/tal vez",
    context: ["A1", "adverb"]
  },
  {
    id: "de-immer",
    term: "immer",
    translation: "siempre",
    context: ["A1", "adverb"]
  },
  {
    id: "de-nie",
    term: "nie",
    translation: "nunca",
    context: ["A1", "adverb"]
  },
  {
    id: "de-wieder",
    term: "wieder",
    translation: "otra vez/de nuevo",
    context: ["A1", "adverb"]
  },
  {
    id: "de-eigentlich",
    term: "eigentlich",
    translation: "en realidad/realmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-einfach",
    term: "einfach",
    translation: "simple/simplemente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-etwa",
    term: "etwa",
    translation: "aproximadamente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-komplett",
    term: "komplett",
    translation: "completo/completamente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-gleich",
    term: "gleich",
    translation: "igual/enseguida",
    context: ["A2", "adverb"]
  },
  {
    id: "de-herum",
    term: "herum",
    translation: "alrededor",
    context: ["A2", "adverb"]
  },
  {
    id: "de-laut",
    term: "laut",
    translation: "fuerte/ruidoso",
    context: ["A2", "adverb"]
  },
  {
    id: "de-jedenfalls",
    term: "jedenfalls",
    translation: "en todo caso",
    context: ["A2", "adverb"]
  },
  {
    id: "de-breitbeinig",
    term: "breitbeinig",
    translation: "con las piernas abiertas",
    context: ["A2", "B2", "adverb"]
  },
  {
    id: "de-schließlich",
    term: "schließlich",
    translation: "finalmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-dabei",
    term: "Dabei",
    translation: "mientras/también",
    context: ["A2", "adverb"]
  },
  {
    id: "de-raus",
    term: "raus",
    translation: "fuera",
    context: ["A1", "adverb"]
  },
  {
    id: "de-entgegen",
    term: "entgegen",
    translation: "en dirección a",
    context: ["B1", "adverb"]
  },
  {
    id: "de-obenrum",
    term: "Obenrum",
    translation: "parte superior",
    context: ["B1", "adverb"]
  },
  {
    id: "de-zusammen",
    term: "zusammen",
    translation: "juntos",
    context: ["A1", "adverb"]
  },
  {
    id: "de-hoch",
    term: "hoch",
    translation: "alto/arriba",
    context: ["A1", "adverb"]
  },
  {
    id: "de-sogar",
    term: "sogar",
    translation: "incluso",
    context: ["A2", "adverb"]
  },
  {
    id: "de-fest",
    term: "fest",
    translation: "firme",
    context: ["A2", "adverb"]
  },
  {
    id: "de-einmal",
    term: "einmal",
    translation: "una vez",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-woher",
    term: "woher",
    translation: "¿de dónde?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-wo",
    term: "wo",
    translation: "¿dónde?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-wohin",
    term: "wohin",
    translation: "¿hacia dónde?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-sehr",
    term: "sehr",
    translation: "muy",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-ueberaus",
    term: "überaus",
    translation: "sumamente, extremadamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-aeusserst",
    term: "äußerst",
    translation: "extremadamente, sumamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-hoechst",
    term: "höchst",
    translation: "altamente, sumamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-besonders-grad",
    term: "besonders",
    translation: "especialmente, particularmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-ausserordentlich",
    term: "außerordentlich",
    translation: "extraordinariamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ungemein",
    term: "ungemein",
    translation: "inmensamente, extraordinariamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-extrem",
    term: "extrem",
    translation: "extremadamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-enorm",
    term: "enorm",
    translation: "enormemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-immens",
    term: "immens",
    translation: "inmensamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ausgesprochen",
    term: "ausgesprochen",
    translation: "decididamente, marcadamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ausnehmend",
    term: "ausnehmend",
    translation: "excepcionalmente",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-uebermaessig",
    term: "übermäßig",
    translation: "excesivamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-allzu",
    term: "allzu",
    translation: "demasiado",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-aussergewoehnlich",
    term: "außergewöhnlich",
    translation: "excepcionalmente, inusualmente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-unglaublich",
    term: "unglaublich",
    translation: "increíblemente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-unheimlich",
    term: "unheimlich",
    translation: "tremendamente, increíblemente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wahnsinnig",
    term: "wahnsinnig",
    translation: "locamente, tremendamente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-total",
    term: "total",
    translation: "totalmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-voll",
    term: "voll",
    translation: "totalmente, muy",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-mega",
    term: "mega",
    translation: "mega, súper",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-super",
    term: "super",
    translation: "súper",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-ultra",
    term: "ultra",
    translation: "ultra",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-ziemlich",
    term: "ziemlich",
    translation: "bastante",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-recht",
    term: "recht",
    translation: "bastante, muy",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-relativ",
    term: "relativ",
    translation: "relativamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-einigermassen",
    term: "einigermaßen",
    translation: "más o menos, razonablemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-halbwegs",
    term: "halbwegs",
    translation: "medianamente, más o menos",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-mittelmaessig",
    term: "mittelmäßig",
    translation: "mediocremente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-maessig",
    term: "mäßig",
    translation: "moderadamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-verhaeltnismaessig",
    term: "verhältnismäßig",
    translation: "proporcionalmente, relativamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-vergleichsweise",
    term: "vergleichsweise",
    translation: "comparativamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-etwas",
    term: "etwas",
    translation: "algo, un poco",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-wenig",
    term: "wenig",
    translation: "poco",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-leicht-grad",
    term: "leicht",
    translation: "ligeramente",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-schwach",
    term: "schwach",
    translation: "débilmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-ganz-total",
    term: "ganz",
    translation: "completamente, totalmente",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-voellig-total",
    term: "völlig",
    translation: "completamente, totalmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-vollkommen",
    term: "vollkommen",
    translation: "completamente, perfectamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-vollstaendig-grad",
    term: "vollständig",
    translation: "completamente, íntegramente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-komplett",
    term: "komplett",
    translation: "completamente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-total-grad",
    term: "total",
    translation: "totalmente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-durchaus",
    term: "durchaus",
    translation: "absolutamente, totalmente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-durchweg",
    term: "durchweg",
    translation: "en todo momento, completamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-restlos",
    term: "restlos",
    translation: "completamente, sin resto",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-gaenzlich",
    term: "gänzlich",
    translation: "completamente, enteramente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-zu",
    term: "zu",
    translation: "demasiado",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-allzu-exceso",
    term: "allzu",
    translation: "demasiado",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-uebermaessig-exceso",
    term: "übermäßig",
    translation: "excesivamente, desmesuradamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-uebertrieben",
    term: "übertrieben",
    translation: "exageradamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-zu-sehr",
    term: "zu sehr",
    translation: "demasiado",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-genug",
    term: "genug",
    translation: "suficiente, bastante",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-hinreichend",
    term: "hinreichend",
    translation: "suficientemente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-reichlich",
    term: "reichlich",
    translation: "abundantemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-ueberreichlich",
    term: "überreichlich",
    translation: "sobradamente, en exceso",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ungenuegend",
    term: "ungenügend",
    translation: "insuficientemente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-unzureichend",
    term: "unzureichend",
    translation: "insuficientemente, inadecuadamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-unzulaenglich",
    term: "unzulänglich",
    translation: "insuficientemente, deficientemente",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-etwa",
    term: "etwa",
    translation: "aproximadamente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-circa",
    term: "circa",
    translation: "circa, aproximadamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-annaehernd-grad",
    term: "annähernd",
    translation: "aproximadamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-beinahe-grad",
    term: "beinahe",
    translation: "casi",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-fast-grad",
    term: "fast",
    translation: "casi",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-nahezu-grad",
    term: "nahezu",
    translation: "casi, prácticamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-genau",
    term: "genau",
    translation: "exactamente",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-exakt",
    term: "exakt",
    translation: "exactamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-praezise",
    term: "präzise",
    translation: "precisamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-haargenau",
    term: "haargenau",
    translation: "exactísimamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-punktgenau",
    term: "punktgenau",
    translation: "con precisión exacta",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-mehr",
    term: "mehr",
    translation: "más",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-weniger",
    term: "weniger",
    translation: "menos",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-eher",
    term: "eher",
    translation: "más bien, antes",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-lieber",
    term: "lieber",
    translation: "preferiblemente, mejor",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-teils",
    term: "teils",
    translation: "en parte, parcialmente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-teilweise-grad",
    term: "teilweise",
    translation: "parcialmente, en parte",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-groesstenteils",
    term: "größtenteils",
    translation: "en su mayor parte",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-weitgehend",
    term: "weitgehend",
    translation: "en gran medida, mayormente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-hauptsaechlich-grad",
    term: "hauptsächlich",
    translation: "principalmente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-vornehmlich-grad",
    term: "vornehmlich",
    translation: "principalmente, sobre todo",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-vorwiegend-grad",
    term: "vorwiegend",
    translation: "predominantemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-ausschliesslich-grad",
    term: "ausschließlich",
    translation: "exclusivamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-einzig-grad",
    term: "einzig",
    translation: "únicamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-sogar",
    term: "sogar",
    translation: "incluso, hasta",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-selbst",
    term: "selbst",
    translation: "incluso, hasta",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-gar",
    term: "gar",
    translation: "incluso, hasta",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-umso",
    term: "umso",
    translation: "tanto más, cuanto más",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-desto",
    term: "desto",
    translation: "tanto más, cuanto más",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-weitaus",
    term: "weitaus",
    translation: "con mucho, mucho más",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-bei-weitem",
    term: "bei weitem",
    translation: "con mucho, de lejos",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-furchtbar",
    term: "furchtbar",
    translation: "terriblemente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-schrecklich",
    term: "schrecklich",
    translation: "terriblemente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-entsetzlich",
    term: "entsetzlich",
    translation: "espantosamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-ungemein-enf",
    term: "ungemein",
    translation: "inmensamente, extraordinariamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ausserordentlich-enf",
    term: "außerordentlich",
    translation: "extraordinariamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-erstaunlich",
    term: "erstaunlich",
    translation: "asombrosamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-bemerkenswert",
    term: "bemerkenswert",
    translation: "notablemente, remarkablemente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ueberraschend",
    term: "überraschend",
    translation: "sorprendentemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-mehrfach",
    term: "mehrfach",
    translation: "varias veces, múltiplemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-vielfach",
    term: "vielfach",
    translation: "múltiplemente, en muchos aspectos",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-reichlich-grad",
    term: "reichlich",
    translation: "abundantemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-ausgiebig",
    term: "ausgiebig",
    translation: "abundantemente, extensamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-deshalb",
    term: "deshalb",
    translation: "por eso, por lo tanto",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-deswegen",
    term: "deswegen",
    translation: "por eso, por esa razón",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-darum",
    term: "darum",
    translation: "por eso, por ello",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-daher-causa",
    term: "daher",
    translation: "por lo tanto, por eso",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-folglich",
    term: "folglich",
    translation: "en consecuencia, por consiguiente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-demzufolge",
    term: "demzufolge",
    translation: "en consecuencia, por consiguiente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-infolgedessen",
    term: "infolgedessen",
    translation: "como consecuencia de ello",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-somit",
    term: "somit",
    translation: "por lo tanto, así pues",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-mithin",
    term: "mithin",
    translation: "por lo tanto, en consecuencia",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-demnach",
    term: "demnach",
    translation: "según eso, en consecuencia",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-also-causa",
    term: "also",
    translation: "así que, entonces",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-ergo",
    term: "ergo",
    translation: "ergo, por lo tanto",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-dadurch",
    term: "dadurch",
    translation: "mediante eso, por eso",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-damit-causa",
    term: "damit",
    translation: "con eso, por eso",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-demgemaess",
    term: "demgemäß",
    translation: "conforme a eso, en consecuencia",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-dementsprechend",
    term: "dementsprechend",
    translation: "en consecuencia, correspondientemente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-demgegenueber-cons",
    term: "demgegenüber",
    translation: "en cambio, por el contrario",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-naemlich",
    term: "nämlich",
    translation: "es que, a saber, pues",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-denn-causa",
    term: "denn",
    translation: "pues, ya que",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-sonst",
    term: "sonst",
    translation: "si no, de lo contrario",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-andernfalls",
    term: "andernfalls",
    translation: "de lo contrario, en caso contrario",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ansonsten",
    term: "ansonsten",
    translation: "por lo demás, de lo contrario",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-anderenfalls",
    term: "anderenfalls",
    translation: "en caso contrario",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-widrigenfalls",
    term: "widrigenfalls",
    translation: "en caso contrario, de lo contrario",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-gegebenenfalls-causa",
    term: "gegebenenfalls",
    translation: "en su caso, si es necesario",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-notfalls-causa",
    term: "notfalls",
    translation: "en caso de necesidad",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-schlimmstenfalls-causa",
    term: "schlimmstenfalls",
    translation: "en el peor de los casos",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-trotzdem",
    term: "trotzdem",
    translation: "a pesar de eso, sin embargo",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-dennoch",
    term: "dennoch",
    translation: "sin embargo, no obstante",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-nichtsdestotrotz",
    term: "nichtsdestotrotz",
    translation: "no obstante, a pesar de todo",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-gleichwohl",
    term: "gleichwohl",
    translation: "sin embargo, no obstante",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-nichtsdestoweniger",
    term: "nichtsdestoweniger",
    translation: "no obstante, sin embargo",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-allerdings-causa",
    term: "allerdings",
    translation: "sin embargo, aunque",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-jedoch",
    term: "jedoch",
    translation: "sin embargo, no obstante",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-indessen",
    term: "indessen",
    translation: "sin embargo, mientras tanto",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-freilich-causa",
    term: "freilich",
    translation: "ciertamente, aunque",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-zwar",
    term: "zwar",
    translation: "ciertamente, si bien",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-dazu",
    term: "dazu",
    translation: "para eso, a eso",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-hierzu",
    term: "hierzu",
    translation: "para esto, a esto",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-dafuer",
    term: "dafür",
    translation: "para eso, por eso",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-dessentwegen",
    term: "dessentwegen",
    translation: "por eso, a causa de eso",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-derentwegen",
    term: "derentwegen",
    translation: "por eso, a causa de eso",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-hingegen",
    term: "hingegen",
    translation: "en cambio, por el contrario",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-dagegen",
    term: "dagegen",
    translation: "en cambio, por el contrario",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-demgegenueber-contr",
    term: "demgegenüber",
    translation: "frente a eso, en contraste",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-vielmehr",
    term: "vielmehr",
    translation: "más bien, antes bien",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-stattdessen",
    term: "stattdessen",
    translation: "en su lugar, en vez de eso",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-naemlich-expl",
    term: "nämlich",
    translation: "es decir, a saber",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-bekanntlich",
    term: "bekanntlich",
    translation: "como es sabido, notoriamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-offenbar-causa",
    term: "offenbar",
    translation: "evidentemente, obviamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-offensichtlich-causa",
    term: "offensichtlich",
    translation: "obviamente, claramente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-anscheinend-causa",
    term: "anscheinend",
    translation: "aparentemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-ersichtlich",
    term: "ersichtlich",
    translation: "evidentemente, visiblemente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-zwangslaeufig",
    term: "zwangsläufig",
    translation: "inevitablemente, necesariamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-notwendigerweise",
    term: "notwendigerweise",
    translation: "necesariamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-logischerweise",
    term: "logischerweise",
    translation: "lógicamente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-vernuenftigerweise",
    term: "vernünftigerweise",
    translation: "razonablemente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-naturlicherweise",
    term: "natürlicherweise",
    translation: "naturalmente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-selbstverstaendlich",
    term: "selbstverständlich",
    translation: "por supuesto, naturalmente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-eventuell-causa",
    term: "eventuell",
    translation: "eventualmente, posiblemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-moeglicherweise-causa",
    term: "möglicherweise",
    translation: "posiblemente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-gegebenenfalls-hip",
    term: "gegebenenfalls",
    translation: "en su caso, eventualmente",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-noetigenfalls",
    term: "nötigenfalls",
    translation: "si fuera necesario, en caso necesario",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-dessenungeachtet",
    term: "dessenungeachtet",
    translation: "a pesar de eso, no obstante",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-dessen-ungeachtet",
    term: "dessen ungeachtet",
    translation: "a pesar de ello",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-nichtsdestoveniger",
    term: "nichtsdestoveniger",
    translation: "no obstante, sin embargo",
    context: ["C1", "adverb"]
  },
  {
    id: "de-adv-insofern",
    term: "insofern",
    translation: "en ese sentido, en tanto que",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-insoweit",
    term: "insoweit",
    translation: "en la medida en que",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-zufolge",
    term: "zufolge",
    translation: "según, conforme a",
    context: ["B2", "adverb", "genitiv"]
  },
  {
    id: "de-adv-wie-lange",
    term: "wie lange",
    translation: "¿cuánto tiempo?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-wo-interr",
    term: "wo",
    translation: "¿dónde?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-wohin-interr",
    term: "wohin",
    translation: "¿adónde?, ¿hacia dónde?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-woher-interr",
    term: "woher",
    translation: "¿de dónde?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-auf-welche-weise",
    term: "auf welche Weise",
    translation: "¿de qué manera?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-inwiefern",
    term: "inwiefern",
    translation: "¿en qué medida?, ¿hasta qué punto?",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-inwieweit",
    term: "inwieweit",
    translation: "¿hasta qué punto?, ¿en qué medida?",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-warum",
    term: "warum",
    translation: "¿por qué?",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-weshalb",
    term: "weshalb",
    translation: "¿por qué?, ¿por qué razón?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-weswegen",
    term: "weswegen",
    translation: "¿por qué?, ¿a causa de qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-wieso",
    term: "wieso",
    translation: "¿por qué?, ¿cómo es que?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wozu-interr",
    term: "wozu",
    translation: "¿para qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wofuer",
    term: "wofür",
    translation: "¿para qué?, ¿por qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wie-sehr",
    term: "wie sehr",
    translation: "¿cuán?, ¿cuánto?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-womit",
    term: "womit",
    translation: "¿con qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wovon",
    term: "wovon",
    translation: "¿de qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-worueber",
    term: "worüber",
    translation: "¿sobre qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-woran",
    term: "woran",
    translation: "¿en qué?, ¿a qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-worauf",
    term: "worauf",
    translation: "¿sobre qué?, ¿en qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wobei",
    term: "wobei",
    translation: "¿en qué?, ¿durante qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-wodurch",
    term: "wodurch",
    translation: "¿por medio de qué?, ¿a través de qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-wogegen",
    term: "wogegen",
    translation: "¿contra qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-wonach",
    term: "wonach",
    translation: "¿según qué?, ¿tras qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-wovor",
    term: "wovor",
    translation: "¿ante qué?, ¿de qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-woraus",
    term: "woraus",
    translation: "¿de qué?, ¿de dónde?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-worin",
    term: "worin",
    translation: "¿en qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-worum",
    term: "worum",
    translation: "¿por qué?, ¿alrededor de qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-worunter",
    term: "worunter",
    translation: "¿bajo qué?, ¿entre qué?",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-wozu-pron",
    term: "wozu",
    translation: "¿para qué?",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-wozwischen",
    term: "wozwischen",
    translation: "¿entre qué?",
    context: ["B2", "adverb"]
  },
  {
    id: "de-adv-ausschliesslich-var",
    term: "ausschließlich",
    translation: "exclusivamente",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adv-direkt",
    term: "direkt",
    translation: "directamente",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-hierfuer",
    term: "hierfür",
    translation: "para esto, para ello",
    context: ["B1", "adverb"]
  },
  {
    id: "de-adj-persoenlich",
    term: "persönlich",
    translation: "personalmente, en persona",
    context: ["A2", "adverb"]
  },
  {
    id: "de-adv-sehr-var",
    term: "sehr",
    translation: "muy",
    context: ["A1", "adverb"]
  },
  {
    id: "de-adv-ausserdem",
    term: "Außerdem",
    translation: "además, por otra parte",
    context: ["A2", "adverb"]
  }
]

const adverbios = [
  ...adverbiosFrequenz,
  ...adverbiosLokal,
  ...adverbiosModal,
  ...adverbiosQuantitativ,
  ...adverbiosTemporal,
  ...adverbiosAllgemein
]

export default adverbios
