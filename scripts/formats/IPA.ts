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
        word.startsWith("i") ||
        word.includes("li" + consonant) ||
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
          word = word.replace(vowel + "n" + consonant, vowel + "ŋ" + consonant);
        });
      });
    });

  word = word.replace("ŋd", "ŋt");

  // zanikanie samogłosek przed bezdźwięcznym "n"
  word = word.replace("aŋ", "ã");
  word = word.replace("ɛŋ", "ɔ̃");
  word = word.replace("uŋ", "ũ");

  softArray.some((soft) => {
    word = word.replace("iŋ" + soft, "ĩ" + soft);
    word = word.replace("ą" + soft, "ɔŋ" + soft);
    word = word.replace("ę" + soft, "ɛŋ" + soft);
    // wyjątki dla "ą" i "ę"
    word = word.replace("ã" + soft, "ɔŋ" + soft);
    word = word.replace("ɔ̃" + soft, "ɛŋ" + soft);
  });

  // dźwięczność "w"
  if (word.includes("w") && !word.includes("zw"))
    consonantsArray.some((consonant) => {
      word = word.replace(consonant + "w", consonant + "f");
    });

  // zmiękczenie "in"
  if (word.includes("iŋ"))
    voicelessArray.some((vl1) => {
      voicelessArray.some((vl2) => {
        word = word.replace("iŋ" + vl1 + vl2, "į" + vl1 + vl2);
      });
    });

  // wyjątki z dźwięcznością głosek przy spółgłoskach
  word = sonority(word, "l", "l̥");
  word = sonority(word, "m", "m̥");
  word = sonority(word, "n", "n̥");
  word = sonority(word, "ń", "ȵ̥");
  word = sonority(word, "r", "r̥");

  // zmiana wymowy przed głoskami dźwięcznymi na twardszą
  voicedArray.some((voiced) => {
    word = word.replace(voiced + "yŋ", voiced + "ɨ̃");
    word = word.replace("cz" + voiced, "dż" + voiced);
  });

  // zmiękczenie przed głoską bezdźwięczną
  if (word.startsWith("li"))
    voicelessArray.some((voiceless) => {
      word = word.replace("li" + voiceless, "ʎi" + voiceless);
    });

  // specjalne
  if (word.endsWith("ąt")) word = word.replace("ąt", "oŋt");
  if (word.includes("rin")) word = word.replace("ri", "rʲi");
  word = word.replace("rzi", "rź");

  //! zamiana zapisu gramatycznego
  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });

  // zmiana wymowy przed głoskami dźwięcznymi na twardszą
  voicedArray.some((voiced) => {
    word = word.replace(voiced + "ia", voiced + "ja");
  });

  // zanik wymowy pierwszej głoski przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("l"))
      word = word.replace("l" + voiceless, "l̥" + voiceless);
    if (word.startsWith("ł"))
      word = word.replace("ł" + voiceless, "ł̦" + voiceless);
    if (word.startsWith("m"))
      word = word.replace("m" + voiceless, "m̥" + voiceless);
  });

  if (word.startsWith("mʲi")) word = word.replace("mʲi", "mi");

  // dźwięczność "ł"
  if (word.includes("w")) word = sonority(word, "w", "w̥");
  word = word.replace("au", "aw");

  // kiedy zostaje "ki" na końcu wyrazu
  if (!word.endsWith("ki")) word = word.replace("ki", "c");
  else word = word.replace("ki", "ci");

  // wyjątek z dźwięcznością "ą"
  if (word.includes("ą")) {
    const notVoicedArray = alphabet.filter(
      (letter) => !voicedArray.includes(letter)
    );
    notVoicedArray.some((x) => {
      if (word.includes(x + "ą")) word = word.replace(x + "ą", x + "ɔ̃");
    });
  }

  // wyjątki z dźwięcznością "hi"
  if (word.includes("x")) {
    voicelessArray.some((voiceless) => {
      word = word.replace("xi" + voiceless, "çi" + voiceless);
    });

    if (word.startsWith("xi")) word = word.replace("xi", "çj");
    word = word.replace("çji", "çi");
    word = word.replace("xi", "ç");

    vowelsArray.some((vowel) => {
      if (word.endsWith(vowel + "x"))
        word = word.replace(vowel + "x", vowel + "h");
      if (word.endsWith("ç" + vowel))
        word = word.replace("ç" + vowel, "çj" + vowel);
    });
  }

  // zanik dźwięczności "ń"
  if (word.includes("ȵ"))
    consonantsArray.some((consonant) => {
      word = word.replace("ȵ" + consonant, "j̃" + consonant);
    });

  // zmiękczenie "ż"
  word = word.replace("ʒi", "ʒʲi");

  // wyjątek z wymową "rz"
  voicedArray.some((voiced) => {
    word = word.replace("ʒ" + voiced, "rz" + voiced);
  });

  // specjalne przypadki
  word = word.replace("ɔ̃ʧ̑", "ɔn͇ʧ̑");
  word = word.replace("oŋʧ̑", "oȵʧ̑");
  word = word.replace("ŋʨ̑", "ȵʨ̑");

  word = word.replace("dr̥z", "d͇ʒ");
  word = word.replace("pr̥z", "pʒ");
  word = word.replace("tr̥z", "t͇ʃ");

  // anglicyzmy
  if (word.startsWith("vɛɛ")) word = word.replace("v", "w");
  word = word.replace("ɔɔ", "u");
  word = word.replace("ɛɛ", "i");

  // korekta "i"
  if (word.includes("ii") && !word.endsWith("ii"))
    word = word.replace("ii", "i");

  // zwracanie wartości
  return word;
}
