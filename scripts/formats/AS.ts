import { sonority } from "@scripts/rewrite";

// podział liter alfabetu
import letters from "./alphabet.json";
const alphabet = letters.all;

const vowelsArray = letters.vowels;
const consonantsArray = alphabet.filter(
  (letter) => !vowelsArray.includes(letter)
);

const voicedArray = letters.voiced;
const voicelessArray = letters.voiceless;

const softArray = letters.soft;
const hardArray = alphabet.filter((letter) => !softArray.includes(letter));

// zamiana zapisu gramatycznego
const grammar = {
  x: "ks",
  qu: "q",
  q: "ku",
  bi: "b́",
  ch: "h",
  ci: "ć",
  cz: "č",
  di: "d'",
  dzi: "ʒ́",
  dz: "ʒ",
  rz: "ż",
  dż: "ǯ",
  zi: "ź",
  dź: "ʒ́",
  fi: "f́",
  gi: "ǵ",
  hi: "χ́",
  h: "χ",
  ki: "ḱ",
  mi: "ḿ",
  ni: "ń",
  ó: "u",
  pi: "ṕ",
  si: "ś",
  ti: "t'",
  sz: "š",
  tż: "tš",
  wi: "v́",
  w: "v",
};

// główna funkcja
export default function (word: string) {
  const changed = changeGrammar(word);
  console.log("AS: " + changed);

  return changed;
}

// zmiana gramatyki
function changeGrammar(word: string) {
  consonantsArray.some((consonant) => {
    // jeśli po "i" występuje spółgłoska, to "i" musi zostać
    if (word.endsWith("i"))
      word = word.replaceAll("i" + consonant, "ii" + consonant);

    // wyjątki z "i"
    if (
      word.includes("i" + consonant) &&
      !(
        word.includes("li" + consonant) ||
        word.startsWith("i") ||
        word.includes("ri")
      )
    ) {
      word = word.replaceAll("i" + consonant, "ii" + consonant);
    }
  });

  // bezdźwięczność "n"
  if (word.includes("n"))
    alphabet.some(() => {
      vowelsArray.some((vowel) => {
        consonantsArray.some((consonant) => {
          if (word.includes(vowel + "n" + consonant))
            word = word.replace(
              vowel + "n" + consonant,
              vowel + "ŋ" + consonant
            );
        });
      });
    });

  // zanikanie samogłosek przed bezdźwięcznym "n"
  word = word.replace("aŋ", "ą");
  word = word.replace("eŋ", "ę");
  word = word.replace("iŋ", "į");
  word = word.replace("uŋ", "ų");

  softArray.some((soft) => {
    word = word.replace("ą" + soft, "oŋ" + soft);
    word = word.replace("ę" + soft, "eŋ" + soft);
  });

  if (word.includes("w"))
    voicelessArray.some((voiceless) => {
      word = word.replace(voiceless + "w", voiceless + "f");
    });

  // wyjątki z dźwięcznością głosek przy spółgłoskach
  word = sonority(word, "l", "l̦");
  word = sonority(word, "m", "m̦");
  word = sonority(word, "n", "n̦");
  word = sonority(word, "ń", "ń̦");
  word = sonority(word, "r", "r̦");

  // zanik pierwszej głoski przy dwóch głoskach miękkich
  if (word.includes("ł"))
    vowelsArray.some((vowel1) => {
      vowelsArray.some((vowel2) => {
        word = word.replace(vowel1 + "ł" + vowel2, vowel1 + "u̯" + vowel2);
      });
    });

  // zmiana wymowy spółgłosek, jeśli występują po samogłoskach
  if (word.includes("j"))
    vowelsArray.some((vowel) => {
      word = word.replace(vowel + "j", vowel + "i̯");
    });

  // specjalna końcówka
  if (word.endsWith("ąt")) word = word.replace("ąt", "oŋt");

  // zmiana wymowy przed głoskami dźwięcznymi na twardszą
  voicedArray.some((voiced) => {
    word = word.replace(voiced + "ia", voiced + "ja");
    word = word.replace(voiced + "yŋ", voiced + "y̨");
    word = word.replace("cz" + voiced, "dż" + voiced);
  });

  // zmiękczone "l" i "r"
  voicelessArray.some((voiceless) => {
    if (word.startsWith("li"))
      word = word.replace("li" + voiceless, "l'i" + voiceless);
    word = word.replace("ri" + voiceless, "r'i" + voiceless);
  });

  //! zamiana zapisu gramatycznego
  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });

  // wyjątek z dźwięcznością "ł"
  if (word.includes("ł")) word = sonority(word, "ł", "ł̦");

  // wyjątek z dźwięcznością "ą"
  if (word.includes("ą")) {
    const notVoicedArray = alphabet.filter(
      (letter) => !voicedArray.includes(letter)
    );
    notVoicedArray.some((x) => {
      if (word.includes(x + "ą")) word = word.replace(x + "ą", x + "ǫ");
    });
  }

  // wyjątki z zapisem "rz"
  if (word.includes("żi")) word = word.replace("żi", "rź");
  word = word.replace("aż", "arz");

  // specjalne przypadki
  if (word.includes("ń"))
    consonantsArray.some((consonant) => {
      word = word.replace("ń" + consonant, "į̯" + consonant);
    });

  word = word.replace("ǫč", "oṇč");
  word = word.replace("oŋć", "ońć");

  word = word.replace("dr̦z", "ḍž");
  word = word.replace("pr̦z", "pš");
  word = word.replace("tr̦z", "ṭš");

  word = word.replace("rź", "ž′");

  // zwracanie wartości
  return word;
}
