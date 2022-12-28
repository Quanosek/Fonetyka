import {
  sonority,
  updateAlphabet,
  makeSofter,
  vowelsAccent,
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
  ą: "õũ̯",
  ę: "ẽũ̯",
  x: "ks",
  qu: "q",
  q: "ku",
  bi: "b́",
  ch: "h",
  h: "χ",
  cj: "cʹj",
  ci: "ć",
  cz: "č",
  dii: "dʹĩ",
  di: "dʹ",
  zi: "ź",
  dź: "ʒ́",
  dz: "ʒ",
  rz: "ż",
  dż: "ǯ",
  fi: "f́j",
  gi: "ǵ",
  ki: "ḱ",
  ł: "u̯",
  mi: "mʹj",
  ni: "ń",
  ó: "u",
  pi: "pʹj",
  si: "ś",
  sz: "š",
  ti: "tʹj",
  wi: "vʹj",
  w: "v",
  ż: "ž",
  ji: "i",
  j: "i̯",
};

const softer = {
  a: "ä",
  e: "ė",
  o: "ȯ",
  u: "ü",
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
    word = word.replace("ą" + soft, "o̊̃ŋ" + soft);
    word = word.replace("ę" + soft, "ɛ̃ŋ" + soft);
  });

  // wyjątki z "ŋ"
  if (word.includes("ŋ")) {
    if (word.includes("ŋgi") || word.includes("ŋki"))
      word = word.replace("ŋ", "ŋʹ");

    hardArray.some((hard) => {
      word = word.replace("ŋ" + hard, "n" + hard);
    });

    word = word.replace("yn", "yŋ");
  }

  // wyjątki z dźwięcznością głosek przy spółgłoskach
  word = sonority(word, "l", "l̦");
  word = sonority(word, "m", "m̦");
  word = sonority(word, "n", "n̦");
  word = sonority(word, "ń", "ń̦");
  word = sonority(word, "r", "r̦");

  // zmiana wymowy przed głoskami dźwięcznymi na twardszą
  if (word.includes("yŋ") && !word.includes("yŋi"))
    voicedArray.some((voiced) => {
      word = word.replace(voiced + "yŋ", voiced + "ỹn");
    });

  // zmiękczenie przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("li"))
      word = word.replace("li" + voiceless, "lʹi" + voiceless);
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

    word = word.replace("in" + voiceless, "į" + voiceless);
    word = word.replace("un" + voiceless, "ų" + voiceless);
    word = word.replace("ą" + voiceless, "õṇ" + voiceless);
  });

  // specjalne
  word = word.replace("aur", "ałr");

  if (!(word.endsWith("an") || word.startsWith("an") || word.includes("ani")))
    word = word.replace("an", "ą");

  if (word.includes("rin")) word = word.replace("ri", "rʹi");
  word = word.replace("rzi", "rź");

  // zanik dźwięczności "ń"
  hardArray.some((hard) => {
    word = word.replace("ń" + hard, "į̯" + hard);
  });
  word = word.replace("įtr", "intr");

  //! zamiana zapisu gramatycznego
  type grammarType = keyof typeof grammar;

  Object.keys(grammar).forEach((key) => {
    const value = grammar[key as grammarType];
    word = word.replaceAll(key, value);

    updateAlphabet(vowelsArray, key, value);
    if (!vowelsArray.includes("i̯")) vowelsArray.push("i̯");
    updateAlphabet(consonantsArray, key, value);
    updateAlphabet(voicedArray, key, value);
    updateAlphabet(voicelessArray, key, value);
    updateAlphabet(softArray, key, value);
    updateAlphabet(hardArray, key, value);
  });

  //! dodatkowe akcenty
  word = vowelsAccent(word, "a", "ã");
  word = vowelsAccent(word, "e", "ẽ");
  word = vowelsAccent(word, "i", "ĩ");
  word = vowelsAccent(word, "o", "õ");
  word = vowelsAccent(word, "u", "ũ");
  word = vowelsAccent(word, "y", "ỹ");

  //! zmiękczanie głoski pomiędzy dwiema miękkimi
  word = makeSofter(word, softArray, softer);

  // zanik wymowy pierwszej głoski przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("l"))
      word = word.replace("l" + voiceless, "l̦" + voiceless);
    if (word.startsWith("ł"))
      word = word.replace("u̯" + voiceless, "u̯̦" + voiceless);
    if (word.startsWith("m"))
      word = word.replace("m" + voiceless, "m̦" + voiceless);
    if (word.startsWith("r"))
      word = word.replace("r" + voiceless, "r̦" + voiceless);
  });

  // dźwięczność "ł"
  if (word.includes("u̯")) {
    word = sonority(word, "u̯", "u̯̦");
    word = word.replace("bu̯̦k", "pu̯̦k");
  }

  // wyjątki z dźwięcznością "hi"
  if (word.includes("χ")) {
    voicelessArray.some((voiceless) => {
      word = word.replace("χi" + voiceless, "χʹi" + voiceless);
    });

    if (word.startsWith("χi")) word = word.replace("χi", "x́j");
    word = word.replace("x́ji", "χʹi");
    word = word.replace("χi", "x́");

    vowelsArray.some((vowel) => {
      if (word.endsWith(vowel + "χ"))
        word = word.replace(vowel + "χ", vowel + "h̦");
      if (word.endsWith("x́" + vowel))
        word = word.replace("x́" + vowel, "x́j" + vowel);
    });
  }

  // zmiękczenie "ż"
  word = word.replace("żi", "žʹi");

  // specjalne przypadki
  word = word.replace("śb", "źb");
  word = word.replace("oŋć", "ońć");
  word = word.replace("ŋć", "ńć");
  word = word.replace("fan", "van");

  // wyjątki ze zmiękczaniem
  if (word.includes("ćʒ́"))
    softArray.some((soft) => {
      word = word.replace(soft + "ćʒ́", soft + "ʒ́");
    });
  if (word.includes("ḿi"))
    hardArray.some((hard) => {
      word = word.replace("ḿi" + hard, "mi" + hard);
    });

  voicedArray.some((voiced) => {
    // ujednolicenie zapisu
    word = word.replace(voiced + "ia", voiced + "i̯a");

    word = word.replace(voiced + "r̦z", voiced + "ž");
    word = word.replace(voiced + "r̦s", voiced + "ž");

    // wyjątek
    word = word.replace("aż" + voiced, "arz" + voiced);
  });
  word = word.replace("dž", "ḍž");

  voicelessArray.some((voiceless) => {
    word = word.replace("d" + voiceless, "t" + voiceless);

    word = word.replace(voiceless + "r̦z", voiceless + "š");
    word = word.replace(voiceless + "r̦s", voiceless + "š");
  });
  word = word.replace("tš", "ṭš");

  // zmiękczenie końcówek wyrazów
  if (word.endsWith("ż"))
    vowelsArray.some((vowel) => {
      word = word.replace(vowel + "ż", vowel + "š");
    });

  // anglicyzmy
  if (word.startsWith("vee")) word = word.replace("v", "u̯");
  word = word.replace("oo", "u");
  word = word.replace("ee", "i");
  word = word.replace("auto", "au̯to");

  // pozostałe wyjątki
  if (word.endsWith("ḿa")) word = word.replace("ḿa", "mja");
  if (word.endsWith("nd")) word = word.replace("nd", "nt");
  word = word.replace("ońt", "ońit");
  word = word.replace("x́jer", "x́er");

  // korekta "i"
  if (word.includes("ii")) word = word.replace("ii", "i");

  // zwracanie wartości
  return word;
}
