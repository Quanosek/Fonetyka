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
  bi: "b́",
  ch: "h",
  ci: "ć",
  cz: "č",
  dzi: "ʒ́",
  dz: "ʒ",
  rz: "ż",
  dż: "ǯ",
  zi: "ź",
  dź: "ʒ́",
  fi: "f́",
  gi: "ǵ",
  hi: "h́",
  ki: "ḱ",
  mi: "ḿ",
  ni: "ń",
  ó: "u",
  pi: "ṕ",
  si: "ś",
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
  // jeśli "i" jest ostatnią głoską, to "i" musi zostać
  if (word.endsWith("i") && !word.endsWith("ii")) word = word + "i";

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
    word = word.replace("aŋ", "ą");
    word = word.replace("eŋ", "ę");
    word = word.replace("iŋ", "į");
    word = word.replace("uŋ", "ų");

    softArray.some((soft) => {
      word = word.replace("ą" + soft, "oŋ" + soft);
      word = word.replace("ę" + soft, "eŋ" + soft);
    });

    if (word.includes("yŋ"))
      voicelessArray.some((voiceless) => {
        word = word.replace(voiceless + "yŋ", voiceless + "y̨");
      });
  });

  // wyjątki z dźwięcznością głosek przy spółgłoskach
  word = sonority(word, "l", "l̦");
  word = sonority(word, "m", "m̦");
  word = sonority(word, "n", "n̦");
  word = sonority(word, "ń", "ń̦");
  word = sonority(word, "r", "r̦");

  // zanik pierwszej głoski przy dwóch głoskach miękkich
  softArray.some((soft1) => {
    softArray.some((soft2) => {
      word = word.replace(soft1 + soft2, soft2);
    });
  });

  // zanik pierwszej głoski przy dwóch głoskach miękkich
  if (word.includes("ł"))
    vowelsArray.some((vowel1) => {
      vowelsArray.some((vowel2) => {
        word = word.replace(vowel1 + "ł" + vowel2, vowel1 + "u̯" + vowel2);
      });
    });

  // specjalne końcówki
  if (word.endsWith("ąt")) word = word.replace("ąt", "oŋt");

  //! zamiana zapisu gramatycznego
  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });

  // wyjątek z dźwięcznością "ł"
  if (word.includes("ł")) word = sonority(word, "ł", "ł̦");

  // wyjątek z dźwięcznością "ą"
  if (word.includes("ą")) {
    voicelessArray.push("š"); // korekta braku gramatyki
    const notVoicelessArray = alphabet.filter(
      (letter) => !voicelessArray.includes(letter)
    );

    notVoicelessArray.some((x) => {
      if (word.includes(x + "ą")) word = word.replace(x + "ą", x + "ǫ");
    });
  }

  // wyjątek z zapisem "rzi"
  if (word.includes("żi")) word = word.replace("żi", "rź");

  if (word.includes("ż"))
    consonantsArray.some((consonant) => {
      // wyjątki z zapisem "rz"
      if (word.includes("ż" + consonant))
        word = word.replace("ż" + consonant, "rs" + consonant);
    });

  // zmiana wymowy spółgłosek, jeśli występują po samogłoskach
  vowelsArray.some((vowel) => {
    if (word.includes(vowel + "h"))
      word = word.replace(vowel + "h", vowel + "χ");

    if (word.includes(vowel + "j"))
      word = word.replace(vowel + "j", vowel + "i̯");
  });

  return word;
}
