import { sonority, makeSofter } from "@scripts/rewrite";

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
  h: "x",
  ci: "ć",
  ć: "ʨ̑",
  cz: "ʧ̑",
  c: "ʦ̑",
  di: "dʲ",
  zi: "ź",
  dź: "ʥ̑",
  dz: "ʣ̑",
  rz: "ż",
  dż: "ʤ̑",
  e: "ɛ",
  ę: "ɛ̃",
  fi: "fʲ",
  gi: "ɟ",
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
  ż: "ʒ",
  ź: "ʑ",
};

const softer = {
  a: "æ",
  ɛ: "e",
  ɔ: "o",
  u: "ʉ",
};

// główna funkcja
export default function (word: string) {
  const changed = changeGrammar(word);
  console.log("IPA: " + changed);

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

  // zanikanie samogłosek z "ŋ"
  word = word.replace("ŋd", "ŋt");
  word = word.replace("aŋ", "ã");
  word = word.replace("ɛŋ", "ɔ̃");
  word = word.replace("uŋ", "ũ");

  // zmiana "ą" i "ę"
  softArray.some((soft) => {
    word = word.replace("ą" + soft, "ɔŋ" + soft);
    word = word.replace("ę" + soft, "ɛŋ" + soft);
    // wyjątki w zapisie
    word = word.replace("ã" + soft, "ɔŋ" + soft);
    word = word.replace("ɔ̃" + soft, "ɛŋ" + soft);
  });

  // wyjątki z "in"
  voicelessArray.some((voiceless) => {
    word = word.replace("iŋ" + voiceless, "ĩ" + voiceless);
  });
  word = word.replace("ĩtr", "intr");

  // wyjątki z "ŋ"
  if (word.includes("ŋ")) {
    if (word.includes("ŋgi") || word.includes("ŋki"))
      word = word.replace("ŋ", "ŋʲ");

    hardArray.some((hard) => {
      word = word.replace("ŋ" + hard, "n" + hard);
    });

    word = word.replace("yn", "yŋ");
  }

  // dźwięczność "w"
  if (word.includes("w") && !word.includes("zw")) {
    consonantsArray.some((consonant) => {
      word = word.replace(consonant + "w", consonant + "f");
    });
    voicelessArray.some((voiceless) => {
      word = word.replace("w" + voiceless, "f" + voiceless);
    });
  }

  // specjalne przekształcenia "in"
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
  voicelessArray.some((voiceless) => {
    if (word.startsWith("li"))
      word = word.replace("li" + voiceless, "ʎi" + voiceless);
    if (
      !(
        word.includes("cz") ||
        word.includes("sz") ||
        word.includes("rz") ||
        word.includes("dz")
      )
    ) {
      word = word.replace("z" + voiceless, "s" + voiceless);
    }

    word = word.replace("ą" + voiceless, "on͇" + voiceless);
  });

  // specjalne
  if (word.endsWith("on͇t")) word = word.replace("on͇t", "oŋt");
  if (word.includes("rin")) word = word.replace("ri", "rʲi");
  word = word.replace("rzi", "rź");

  // zanik dźwięczności "ń"
  if (word.includes("ń"))
    hardArray.some((hard) => {
      word = word.replace("ń" + hard, "j̃" + hard);
    });

  //! zamiana zapisu gramatycznego
  type grammarType = keyof typeof grammar;

  Object.keys(grammar).forEach((key) => {
    const value = grammar[key as grammarType];
    word = word.replaceAll(key, value);

    if (softArray.includes(key) && !softArray.includes(value))
      softArray.push(value);
    if (vowelsArray.includes(key) && !vowelsArray.includes(value))
      vowelsArray.push(value);

    if (!voicedArray.includes("v")) voicedArray.push("v");
  });

  //! zmiękczanie głoski pomiędzy miękkimi
  word = makeSofter(word, softArray, softer);

  // zanik wymowy pierwszej głoski przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("l"))
      word = word.replace("l" + voiceless, "l̥" + voiceless);
    if (word.startsWith("ł"))
      word = word.replace("ł" + voiceless, "ł̦" + voiceless);
    if (word.startsWith("m"))
      word = word.replace("m" + voiceless, "m̥" + voiceless);
    if (word.startsWith("r"))
      word = word.replace("r" + voiceless, "r̥" + voiceless);
  });

  // dźwięczność "ł"
  if (word.includes("w")) word = sonority(word, "w", "w̥");
  word = word.replace("au", "aw");

  // kiedy zostaje "ki" na końcu wyrazu
  if (!word.endsWith("ki")) word = word.replace("ki", "c");
  else word = word.replace("ki", "ci");

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

  // zmiękczenie "ż"
  word = word.replace("ʒi", "ʒʲi");

  // specjalne przypadki
  word = word.replace("ɕb", "ʑb");
  word = word.replace("oŋʧ̑", "oȵʧ̑");
  word = word.replace("ŋʨ̑", "ȵʨ̑");

  softArray.some((soft) => {
    word = word.replace(soft + "ʨ̑ʥ̑", soft + "ʥ̑");
  });

  // ujednolicenie zapisu
  voicedArray.some((voiced) => {
    word = word.replace(voiced + "ɔn͇", voiced + "ɔ̃");
    word = word.replace(voiced + "ia", voiced + "ja");
    word = word.replace("ʒ" + voiced, "rz" + voiced);

    word = word.replace(voiced + "r̥z", voiced + "ʒ");
    word = word.replace(voiced + "r̥s", voiced + "ʒ");
  });
  word = word.replace("dʒ", "d͇ʒ");

  voicelessArray.some((voiceless) => {
    word = word.replace(voiceless + "r̥z", voiceless + "ʃ");
    word = word.replace(voiceless + "r̥s", voiceless + "ʃ");
  });
  word = word.replace("tʃ", "t͇ʃ");

  // zmiękczenie końcówek wyrazów
  if (word.endsWith("ʒ"))
    vowelsArray.some((vowel) => {
      word = word.replace(vowel + "ʒ", vowel + "ʃ");
    });

  // anglicyzmy
  if (word.startsWith("vɛɛ")) word = word.replace("v", "w");
  word = word.replace("ɔɔ", "u");
  word = word.replace("ɛɛ", "i");

  if (word.endsWith("mʲa")) word = word.replace("mʲa", "mja");

  // korekta "i"
  if (word.includes("i")) {
    word = word.replace("bʲi", "bi");
    word = word.replace("ii", "i");
  }

  // zwracanie wartości
  return word;
}
