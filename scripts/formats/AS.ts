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

const softer = {
  ą: "ä",
  ę: "ė",
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

  // zanikanie samogłosek z "ŋ"
  word = word.replace("ŋd", "ŋt");
  word = word.replace("aŋ", "ą");
  word = word.replace("uŋ", "ų");

  // zmiana "ą" i "ę"
  softArray.some((soft) => {
    word = word.replace("ą" + soft, "oŋ" + soft);
    word = word.replace("ę" + soft, "eŋ" + soft);
  });

  // wyjątki z "in"
  voicelessArray.some((voiceless) => {
    word = word.replace("iŋ" + voiceless, "į" + voiceless);
  });
  word = word.replace("įtr", "intr");

  // wyjątki z "ŋ"
  if (word.includes("ŋ")) {
    if (word.includes("ŋgi") || word.includes("ŋki"))
      word = word.replace("ŋ", "ń");

    hardArray.some((hard) => {
      word = word.replace("ŋ" + hard, "n" + hard);
    });
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

  // zmiękczenie "in"
  if (word.includes("iŋ"))
    voicelessArray.some((vl1) => {
      voicelessArray.some((vl2) => {
        word = word.replace("iŋ" + vl1 + vl2, "į" + vl1 + vl2);
      });
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

  // zmiana wymowy przed głoskami dźwięcznymi na twardszą
  voicedArray.some((voiced) => {
    word = word.replace(voiced + "yn", voiced + "y̨");
    word = word.replace("cz" + voiced, "dż" + voiced);
  });

  // zmiękczenie przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("li"))
      word = word.replace("li" + voiceless, "l'i" + voiceless);
    if (
      !(
        word.includes("cz") ||
        word.includes("sz") ||
        word.includes("rz") ||
        word.includes("dz")
      )
    )
      word = word.replace("z" + voiceless, "s" + voiceless);
  });

  // specjalne
  if (word.endsWith("ąt")) word = word.replace("ąt", "oŋt");
  if (word.includes("rin")) word = word.replace("ri", "r'i");
  word = word.replace("rzi", "rź");

  // zanik dźwięczności "ń"
  if (word.includes("ń"))
    hardArray.some((hard) => {
      word = word.replace("ń" + hard, "į̯" + hard);
    });

  //! zmiękczanie głoski pomiędzy miękkimi

  //! zamiana zapisu gramatycznego
  type grammarType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as grammarType]);
  });

  // zanik wymowy pierwszej głoski przed głoską bezdźwięczną
  voicelessArray.some((voiceless) => {
    if (word.startsWith("l"))
      word = word.replace("l" + voiceless, "l̦" + voiceless);
    if (word.startsWith("ł"))
      word = word.replace("ł" + voiceless, "ł̦" + voiceless);
    if (word.startsWith("m"))
      word = word.replace("m" + voiceless, "m̦" + voiceless);
    if (word.startsWith("r"))
      word = word.replace("r" + voiceless, "r̦" + voiceless);
  });

  if (word.startsWith("ḿi")) word = word.replace("ḿi", "mi");

  // dźwięczność "ł"
  if (word.includes("ł")) word = sonority(word, "ł", "ł̦");
  if (!word.includes("u̯")) word = word.replace("au", "ał");

  // wyjątek z dźwięcznością "ą"
  if (word.includes("ą")) {
    const notVoicedArray = alphabet.filter(
      (letter) => !voicedArray.includes(letter)
    );
    notVoicedArray.some((x) => {
      if (word.includes(x + "ą")) word = word.replace(x + "ą", x + "ǫ");
    });
  }

  // wyjątki z dźwięcznością "hi"
  if (word.includes("χ")) {
    voicelessArray.some((voiceless) => {
      word = word.replace("χi" + voiceless, "x́i" + voiceless);
    });

    if (word.startsWith("χi")) word = word.replace("χi", "x́j");
    word = word.replace("x́ji", "x́i");
    word = word.replace("χi", "x́");

    vowelsArray.some((vowel) => {
      if (word.endsWith(vowel + "χ"))
        word = word.replace(vowel + "χ", vowel + "h̦");
      if (word.endsWith("x́" + vowel))
        word = word.replace("x́" + vowel, "x́j" + vowel);
    });
  }

  // zmiękczenie "ż"
  word = word.replace("żi", "ž'i");

  // ujednolicenia wymowy
  voicedArray.some((voiced) => {
    word = word.replace(voiced + "ia", voiced + "ja");
    word = word.replace("ż" + voiced, "rz" + voiced);
  });

  // specjalne przypadki
  word = word.replace("śb", "źb");

  word = word.replace("ǫč", "oṇč");
  word = word.replace("oŋć", "ońć");
  word = word.replace("ŋć", "ńć");

  word = word.replace("dr̦z", "ḍž");
  word = word.replace("tr̦z", "ṭš");
  word = word.replace("pr̦z", "pš");

  // zmiękczenie końcówek wyrazów
  vowelsArray.some((vowel) => {
    word = word.replace(vowel + "ż", vowel + "š");
  });

  // anglicyzmy
  if (word.startsWith("vee")) word = word.replace("v", "ł");
  word = word.replace("oo", "u");
  word = word.replace("ee", "i");

  if (word.endsWith("ḿa")) word = word.replace("ḿa", "mja");

  // korekta "i"
  if (word.includes("ii")) word = word.replace("ii", "i");

  // zwracanie wartości
  return word;
}
