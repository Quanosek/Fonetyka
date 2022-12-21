import { sonority } from "@scripts/rewrite";

// podział liter alfabetu
import letters from "./alphabet.json";
const alphabet = letters.all;

const vowelsArray = letters.vowels;
const consonantsArray = alphabet.filter(
  (letter) => !vowelsArray.includes(letter)
);

const voicedArray = letters.voiced;
const voicelessArray = letters.voiced;

const softArray = letters.soft;
const hardArray = alphabet.filter((letter) => !softArray.includes(letter));

// zamiana zapisu gramatycznego
const grammar = {
  x: "ks",
  qu: "q",
  q: "ku",
  bi: "bʲ",
  ch: "h",
  ci: "ć",
  ć: "ʨ̑",
  cz: "ʧ̑",
  c: "ʦ̑",
  di: "dʲ",
  dzi: "ʥ̑",
  dz: "ʣ̑",
  e: "ɛ",
  ę: "ɛ̃",
  rz: "ż",
  dż: "ʤ̑",
  ż: "ʒ",
  zi: "ź",
  ź: "ʑ",
  fi: "fʲ",
  gi: "ɟ",
  hi: "ç",
  h: "x",
  mi: "mʲ",
  ni: "ń",
  ń: "ȵ",
  o: "ɔ",
  ó: "u",
  pi: "pʲ",
  si: "ś",
  ś: "ɕ",
  sz: "ʃ",
  ti: "tʲ",
  wi: "vʲ",
  w: "v",
  ł: "w",
  y: "ɨ",
};

// główna funkcja
export default function (word: string) {
  const changed = changeGrammar(word);
  console.log("IPA: " + changed);

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

    if (word.includes("n"))
      alphabet.some(() => {
        vowelsArray.some((vowel) => {
          consonantsArray.some((consonant) => {
            // bezdźwięczność "n"
            if (word.includes(vowel + "n" + consonant))
              word = word.replace(
                vowel + "n" + consonant,
                vowel + "ŋ" + consonant
              );
          });
        });
      });

    // zanikanie samogłosek przed bezdźwięcznym "n"
    word = word.replace("aŋ", "ã");
    word = word.replace("ɛŋ", "ɔ̃");
    word = word.replace("iŋ", "ĩ");
    word = word.replace("uŋ", "ũ");

    softArray.some((soft) => {
      word = word.replace("ą" + soft, "ɔŋ" + soft);
      word = word.replace("ę" + soft, "ɛŋ" + soft);
      // wyjątki dla "ą" i "ę"
      word = word.replace("ã" + soft, "ɔŋ" + soft);
      word = word.replace("ɔ̃" + soft, "ɛŋ" + soft);
    });

    if (word.includes("yŋ"))
      voicelessArray.some((voiceless) => {
        word = word.replace(voiceless + "yŋ", voiceless + "ɨ̃");
      });
  });

  // wyjątki z dźwięcznością głosek przy spółgłoskach
  word = sonority(word, "l", "l̥");
  word = sonority(word, "m", "m̥");
  word = sonority(word, "n", "n̥");
  word = sonority(word, "ń", "ȵ̥");
  word = sonority(word, "r", "r̥");

  // zanik pierwszej głoski przy dwóch głoskach miękkich
  softArray.some((soft1) => {
    softArray.some((soft2) => {
      word = word.replace(soft1 + soft2, soft2);
    });
  });

  // specjalne końcówki
  if (word.endsWith("ąt")) word = word.replace("ąt", "oŋt");

  //! zamiana zapisu gramatycznego
  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });
  voicelessArray.push("ɕ", "ʃ"); //? korekta braku gramatyki

  // wyjątek z dźwięcznością "ł"
  if (word.includes("w")) word = sonority(word, "w", "w̥");

  // kiedy zostaje "ki" na końcu wyrazu
  if (!word.endsWith("ki")) word = word.replace("ki", "c");
  else word = word.replace("ki", "ci");

  // wyjątek z dźwięcznością "ą"
  if (word.includes("ą")) {
    const notVoicelessArray = alphabet.filter(
      (letter) => !voicelessArray.includes(letter)
    );
    notVoicelessArray.some((x) => {
      if (word.includes(x + "ą")) word = word.replace(x + "ą", x + "ɔ̃");
    });
  }

  // wyjątki z zapisem "rz"
  if (word.includes("ʒi")) word = word.replace("ʒi", "rʑ");
  word = word.replace("aʒ", "arz");

  // zmiana wymowy "cz" przed głoskami dźwięcznymi na twardszą
  if (word.includes("ʧ̑"))
    voicedArray.some((voiced) => {
      word = word.replace("ʧ̑" + voiced, "ʤ̑" + voiced);
    });

  // specjalne przypadki
  word = word.replace("oŋć", "oȵć");
  word = word.replace("tr̥z", "t͇ʃ");
  word = word.replace("dr̥z", "d͇ʒ");

  return word;
}
