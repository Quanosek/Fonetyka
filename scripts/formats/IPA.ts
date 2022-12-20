import { sonority } from "@scripts/rewrite";

// podział liter alfabetu
import letters from "./alphabet.json";
const alphabet = letters.all;
const vowelsArray = letters.vowels;

const consonantsArray = alphabet.filter(
  (letter) => !vowelsArray.includes(letter)
);

// zamiana zapisu gramatycznego
const grammar = {
  x: "ks",
  qu: "q",
  q: "ku",
  bi: "bʲ",
  ch: "h",
  h: "x",
  ci: "ć",
  ć: "ʨ̑",
  cz: "ʧ̑",
  c: "ʦ̑",
  dzi: "ʥ̑",
  dz: "ʣ̑",
  e: "ɛ",
  ę: "ɛ̃",
  rz: "ż",
  ż: "ʒ",
  dż: "ʤ̑",
  zi: "ź",
  ź: "ʑ",
  fi: "fʲ",
  hi: "h",
  mi: "mʲ",
  ni: "ń",
  ń: "ȵ",
  o: "ɔ",
  ó: "u",
  pi: "pʲ",
  si: "ś",
  ś: "ɕ",
  sz: "ʃ",
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

    // wyjątki z dźwięcznością głosek przy spółgłoskach
    word = sonority(word, consonant, "l", "l̥");
    word = sonority(word, consonant, "m", "m̥");
    word = sonority(word, consonant, "n", "n̥");
    word = sonority(word, consonant, "ń", "ȵ̥");
    word = sonority(word, consonant, "r", "r̥");
  });

  // poprawa gramatyczna
  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });

  // kiedy zostaje "ki" na końcu wyrazu
  if (!word.endsWith("ki")) word = word.replace("ki", "c");
  else word = word.replace("ki", "ci");

  // wyjątek z "rzi"
  if (word.includes("ʒi")) word = word.replace("ʒi", "rʑ");

  // wyjątek z "rz"
  consonantsArray.some((consonant) => {
    // wyjątki z "rz"
    if (word.includes("ʒ" + consonant))
      word = word.replace("ʒ" + consonant, "rs" + consonant);
  });

  // zmiana wymowy spółgłosek, jeśli występują po samogłoskach
  vowelsArray.some((vowel) => {
    if (word.includes(vowel + "ʧ̑"))
      word = word.replace(vowel + "ʧ̑", vowel + "ʤ̑");
  });

  return word;
}
