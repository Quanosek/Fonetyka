import {
  sonority,
  updateAlphabet,
  makeSofter,
  vowelsAccent,
  specialSofter,
  reduceRepeat,
} from "@scripts/rewrite";

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
  szi: "ʃʲ",
  sz: "ʃ",
  wi: "vʲj",
  w: "v",
  ł: "w",
  ą: "ɔ̃w̃",
  e: "ɛ",
  ę: "ɛ̃w̃",
  x: "ks",
  qu: "q",
  q: "ku",
  bi: "bʲ",
  ch: "h",
  h: "x",
  cj: "ʦ̑ʲj",
  ci: "ć",
  ć: "ʨ̑",
  cz: "ʧ̑",
  c: "ʦ̑",
  dii: "dʲĩ",
  di: "dʲ",
  zi: "ź",
  dź: "ʥ̑",
  dz: "ʣ̑",
  rz: "ż",
  dż: "ʤ̑",
  fi: "fʲj",
  gi: "ɟ",
  mi: "mʲj",
  ni: "ń",
  ń: "ɲ",
  o: "ɔ",
  ó: "u",
  pi: "pʲj",
  si: "ś",
  sj: "sʲj",
  ś: "ɕ",
  ti: "tʲj",
  y: "ɨ",
  ż: "ʒ",
  ź: "ʑ",
  zj: "zʲj",
  ji: "i",
};

const softer = {
  a: "ä",
  ɛ: "ɛ̇",
  ɔ: "ɔ̇",
  u: "ü",
};

// główna funkcja
export default function (word: string) {
  let changed = "";

  changed = changeGrammar(word);
  console.log("IPA: " + changed);

  changed = reduceRepeat(changed);
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

  // zmiana "ą" i "ę"
  softArray.some((soft) => {
    word = word.replace("ą" + soft, "ɔ̇̃ŋ" + soft);
    word = word.replace("ę" + soft, "ɛ̃ŋ" + soft);
  });

  // wyjątki z "ŋ"
  if (word.includes("ŋ")) {
    if (word.includes("ŋgi") || word.includes("ŋki"))
      word = word.replace("ŋ", "ŋʲ");

    hardArray.some((hard) => {
      word = word.replace("ŋ" + hard, "n" + hard);
    });

    word = word.replace("yn", "yŋ");
  }

  // wyjątki z dźwięcznością głosek przy spółgłoskach
  word = sonority(word, "l", "l̥");
  word = sonority(word, "m", "m̥");
  word = sonority(word, "n", "n̥");
  word = sonority(word, "ń", "ɲ̊");
  word = sonority(word, "r", "r̥");

  // zmiana wymowy przed głoskami dźwięcznymi na twardszą
  voicedArray.some((voiced) => {
    if (word.includes("yŋ") && !word.includes("yŋi"))
      word = word.replace(voiced + "yŋ", voiced + "ɨ̃n");

    word = word.replace(voiced + "li", voiced + "lʲi");
  });

  // zmiękczenie przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("li"))
      word = word.replace("li" + voiceless, "lʲi" + voiceless);
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

    word = word.replace("in" + voiceless, "ĩ" + voiceless);
    word = word.replace("un" + voiceless, "ũ" + voiceless);

    if (!word.endsWith(voiceless))
      word = word.replace("ą" + voiceless, "on͇" + voiceless);
  });

  // specjalne
  word = word.replace("aur", "ałr");
  word = word.replace("rin", "rʲin");
  word = word.replace("rzi", "rź");

  // zanik dźwięczności "ń"
  if (word.includes("ń") && !word.includes("oń")) {
    hardArray.some((hard) => {
      word = word.replace("ń" + hard, "j̃" + hard);
    });
  }

  // bezdźwięczność "dz"
  word = specialSofter(word, "dz", "c");
  word = specialSofter(word, "dź", "ć");
  word = specialSofter(word, "dż", "cz");

  // wyjątki
  word = word.replace("ĩtr", "intr");
  word = word.replace("podż", "poḍż");

  //! zamiana zapisu gramatycznego
  type grammarType = keyof typeof grammar;

  Object.keys(grammar).forEach((key) => {
    const value = grammar[key as grammarType];
    word = word.replaceAll(key, value);

    updateAlphabet(vowelsArray, key, value);
    updateAlphabet(consonantsArray, key, value);
    updateAlphabet(voicedArray, key, value);
    updateAlphabet(voicelessArray, key, value);
    updateAlphabet(softArray, key, value);
    updateAlphabet(hardArray, key, value);
  });

  //! dodatkowe akcenty
  word = vowelsAccent(word, "a", "ã");
  word = vowelsAccent(word, "ɛ", "ɛ̃");
  word = vowelsAccent(word, "i", "ĩ");
  word = vowelsAccent(word, "ɔ", "ɔ̃");
  word = vowelsAccent(word, "u", "ũ");
  word = vowelsAccent(word, "ɨ", "ɨ̃");

  word = vowelsAccent(word, "v", "vʲ");

  //! zmiękczanie głoski pomiędzy dwiema miękkimi
  word = makeSofter(word, softArray, softer);

  // zanik wymowy pierwszej głoski przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("l"))
      word = word.replace("l" + voiceless, "l̥" + voiceless);
    if (word.startsWith("w"))
      word = word.replace("w" + voiceless, "w̥" + voiceless);
    if (word.startsWith("m"))
      word = word.replace("m" + voiceless, "m̥" + voiceless);
    if (word.startsWith("r"))
      word = word.replace("r" + voiceless, "r̥" + voiceless);
  });

  // dźwięczność "ł"
  if (word.includes("w")) {
    word = sonority(word, "w", "w̥");
    word = word.replace("bw̥k", "pw̥k");
  }

  // kiedy zostaje "ki" na końcu wyrazu
  if (!word.endsWith("ki")) word = word.replace("ki", "c");
  else word = word.replace("ki", "ci");

  // wyjątki z dźwięcznością "hi"
  if (word.includes("x")) {
    voicelessArray.some((voiceless) => {
      word = word.replace("xi" + voiceless, "xʲi" + voiceless);
    });

    if (word.startsWith("xi")) word = word.replace("xi", "x́j");
    word = word.replace("x́jĩ", "xʲĩ");
    word = word.replace("xi", "x́");

    vowelsArray.some((vowel) => {
      if (word.endsWith(vowel + "x"))
        word = word.replace(vowel + "x", vowel + "h");
      if (word.endsWith("x́" + vowel))
        word = word.replace("x́" + vowel, "x́j" + vowel);
    });

    if (word.includes("ɛx")) {
      voicedArray.some((voiced) => {
        word = word.replace("ɛx" + voiced, "ɛγ" + voiced);
      });
    }

    if (word.startsWith("x́jɛ") && !word.startsWith("x́jɛ̃"))
      word = word.replace("x́jɛ", "x́ɛ");

    word = word.replace("x́ji", "xʲi");
  }

  // zmiany dźwięczności
  word = word.replace("fan", "van");
  word = word.replace("ɕb", "ʑb");
  word = word.replace("ʒi", "ʒʲi");

  // przypadki z "ć"
  if (word.includes("ʨ̑")) {
    word = word.replace("ɔ̃n͇ʨ̑", "ɔɲʨ̑");
    word = word.replace("ŋʨ̑", "ɲʨ̑");
  }

  // wyjątki ze zmiękczaniem
  softArray.some((soft) => {
    if (word.startsWith("k")) word = word.replace("k" + soft, "c" + soft);
    word = word.replace(soft + "ʨ̑ʥ̑", soft + "ʥ̑");
    word = word.replace("ɛ̃w̃" + soft, "ɛɲ" + soft);
  });

  voicedArray.some((voiced) => {
    // utwardzanie "c"
    word = word.replace("ʦ̑" + voiced, "ʣ̑" + voiced);
    word = word.replace("ʨ̑" + voiced, "ʥ̑" + voiced);
    if (voiced !== "ɲ") word = word.replace("ʧ̑" + voiced, "ʤ̑" + voiced);

    // ujednolicenie zapisu
    word = word.replace(voiced + "ɔn͇", voiced + "ɔ̃");
    word = word.replace(voiced + "ia", voiced + "ja");
    word = word.replace(voiced + "r̥z", voiced + "ʒ");
    word = word.replace(voiced + "r̥s", voiced + "ʒ");

    word = word.replace("aʒ" + voiced, "arz" + voiced);
    word = word.replace("ɛ̃w̃" + voiced, "ɛn" + voiced);
  });

  word = word.replace("dʒ", "ḍʒ");

  voicelessArray.some((voiceless) => {
    // ubezdźwięcznienie "dz"
    word = word.replace("ʣ̑" + voiceless, "ʦ̑" + voiceless);

    if (voiceless !== "s") {
      word = word.replace("ɛ̃w̃" + voiceless, "ɛn" + voiceless);
    }
    word = word.replace("b" + voiceless, "p" + voiceless);
    word = word.replace("d" + voiceless, "t" + voiceless);

    // "sz"/"rz"
    word = word.replace("ʒ" + voiceless, "ʃ" + voiceless);
    word = word.replace(voiceless + "r̥z", voiceless + "ʃ");
    word = word.replace(voiceless + "r̥s", voiceless + "ʃ");

    // "w"/"f"
    word = word.replace(voiceless + "v", voiceless + "f");
    word = word.replace("v" + voiceless, "f" + voiceless);

    // końcówki
    word = word.replace(voiceless + "ɔ̃n͇", voiceless + "ɔ̃n");
  });

  voicedArray.some((voiced) => {
    word = word.replace("ą" + voiced, "om" + voiced);
    word = word.replace("ɛn" + voiced, "ɛm" + voiced);
    word = word.replace("f" + voiced, "v" + voiced);
  });

  word = word.replace("ãns", "ãw̃s");
  word = word.replace("ɕɔ̃w̃ʦ̑", "ɕɔ̃nʦ̑");
  word = word.replace("l̥v", "l̥f");
  word = word.replace("tʃ", "ṭʃ");

  word = word.replace(/b$/, "p");
  word = word.replace(/g$/, "k");

  // zmiękczenie końcówek wyrazów
  vowelsArray.some((vowel) => {
    if (word.endsWith(vowel + "ʒ")) word = word.replace(/ʒ$/, "ʃ");
    if (word.endsWith(vowel + "d")) word = word.replace(/d$/, "t");
    if (word.endsWith(vowel + "i")) word = word.replace(/i$/, "ji");
    word = word.replace(/iji$/, "ji");

    word = word.replace("dʲ" + vowel, "dj" + vowel);
    word = word.replace("bʲ" + vowel, "bj" + vowel);
    word = word.replace("ɟ" + vowel, "ɟj" + vowel);
  });

  // anglicyzmy
  if (word.startsWith("vɛɛ")) word = word.replace("v", "w");
  word = word.replace("ɔɔ", "u");
  word = word.replace("ɛɛ", "i");
  word = word.replace("autɔ", "awtɔ");

  // specjalne końcówki
  word = word.replace(/zn̥$/, "sn̥");
  word = word.replace(/mʲa$/, "mja");
  word = word.replace(/nd$/, "nt");

  // wyjątki
  word = word.replace("ibʲ", "ibʲi");
  word = word.replace("ɔȵt", "ɔȵit");
  word = word.replace("çjɛr", "çɛr");

  // korekty
  word = word.replace("w̃w", "w");
  word = word.replace("rj", "rʲj");

  word = word.replace("iĩ", "i");
  word = word.replace("ii", "i");

  return word; // zwracanie wartości
}
