import {
  sonority,
  updateAlphabet,
  makeSofter,
  vowelsAccent,
  specialSofter,
  reduceRepeat,
} from "@/scripts/rewrite";

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
  szi: "šʹ",
  sz: "š",
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
  sj: "sʹj",
  ti: "tʹj",
  wi: "vʹj",
  w: "v",
  ż: "ž",
  zj: "zʹj",
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
export default function format_AS(word: string) {
  let changed = "";

  changed = changeGrammar(word);
  console.log("AS: " + changed);

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
  voicedArray.some((voiced) => {
    if (word.includes("yŋ") && !word.includes("yŋi"))
      word = word.replace(voiced + "yŋ", voiced + "ỹn");

    word = word.replace(voiced + "li", voiced + "lʹi");
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

    if (!word.endsWith(voiceless))
      word = word.replace("ą" + voiceless, "õṇ" + voiceless);
  });

  // specjalne
  word = word.replace("aur", "ałr");
  word = word.replace("rin", "rʹin");
  word = word.replace("rzi", "rź");

  // zanik dźwięczności "ń"
  if (word.includes("ń") && !word.includes("oń")) {
    hardArray.some((hard) => {
      word = word.replace("ń" + hard, "ĩ ̯" + hard);
    });
  }

  // bezdźwięczność "dz"
  word = specialSofter(word, "dz", "c");
  word = specialSofter(word, "dź", "ć");
  word = specialSofter(word, "dż", "cz");

  // wyjątki
  word = word.replace("įtr", "intr");
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

  if (!vowelsArray.includes("i̯")) vowelsArray.push("i̯");
  if (!voicedArray.includes("i̯")) voicedArray.push("i̯");
  if (!softArray.includes("i̯")) softArray.push("i̯");

  //! dodatkowe akcenty
  word = vowelsAccent(word, "a", "ã");
  word = vowelsAccent(word, "e", "ẽ");
  word = vowelsAccent(word, "i", "ĩ");
  word = vowelsAccent(word, "o", "õ");
  word = vowelsAccent(word, "u", "ũ");
  word = vowelsAccent(word, "y", "ỹ");

  word = vowelsAccent(word, "v", "vʹ");

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

    if (word.startsWith("χi")) word = word.replace("χi", "χ́j");
    word = word.replace("χ́jĩ", "χʹĩ");
    word = word.replace("χi", "χ́");

    vowelsArray.some((vowel) => {
      if (word.endsWith(vowel + "χ"))
        word = word.replace(vowel + "χ", vowel + "h̦");
      if (word.endsWith("χ́" + vowel))
        word = word.replace("χ́" + vowel, "χ́j" + vowel);
    });

    if (word.includes("eχ")) {
      voicedArray.some((voiced) => {
        word = word.replace("eχ" + voiced, "eγ" + voiced);
      });
    }

    if (word.startsWith("χ́je") && !word.startsWith("x́jɛ̃"))
      word = word.replace("χ́je", "χ́e");

    word = word.replace("χ́ji", "χ́i");
  }

  // zmiany dźwięczności
  word = word.replace("fan", "van");
  word = word.replace("śb", "źb");
  word = word.replace("ži", "žʹi");

  // przypadki z "ć"
  if (word.includes("ć")) {
    word = word.replace("õṇć", "ońć");
    word = word.replace("ŋć", "ńć");
  }

  // wyjątki ze zmiękczaniem
  softArray.some((soft) => {
    if (word.startsWith("k")) word = word.replace("k" + soft, "ḱ" + soft);
    word = word.replace(soft + "ćʒ́", soft + "ʒ́");
    word = word.replace("ẽũ̯" + soft, "eń" + soft);
  });

  voicedArray.some((voiced) => {
    // utwardzanie "c"
    word = word.replace("c" + voiced, "ʒ" + voiced);
    word = word.replace("ć" + voiced, "ʒ́" + voiced);
    if (voiced !== "ń") word = word.replace("č" + voiced, "ǯ" + voiced);

    // ujednolicenie zapisu
    word = word.replace(voiced + "ia", voiced + "i̯a");
    word = word.replace(voiced + "r̦z", voiced + "ž");
    word = word.replace(voiced + "r̦s", voiced + "ž");

    word = word.replace("až" + voiced, "arz" + voiced);
    word = word.replace("ẽũ̯" + voiced, "en" + voiced);
  });

  word = word.replace("dž", "ḍž");

  voicelessArray.some((voiceless) => {
    // ubezdźwięcznienie "dz"
    word = word.replace("ʒ" + voiceless, "c" + voiceless);

    if (voiceless !== "s") {
      word = word.replace("ẽũ̯" + voiceless, "en" + voiceless);
    }
    word = word.replace("b" + voiceless, "p" + voiceless);
    word = word.replace("d" + voiceless, "t" + voiceless);

    // "sz"/"rz"
    word = word.replace("ž" + voiceless, "š" + voiceless);
    word = word.replace(voiceless + "r̦z", voiceless + "š");
    word = word.replace(voiceless + "r̦s", voiceless + "š");

    // "w"/"f"
    word = word.replace(voiceless + "v", voiceless + "f");
    word = word.replace("v" + voiceless, "f" + voiceless);

    // końcówki
    word = word.replace(voiceless + "õṇ", voiceless + "õn");
  });

  voicedArray.some((voiced) => {
    word = word.replace("ą" + voiced, "om" + voiced);
    word = word.replace("en" + voiced, "em" + voiced);
    word = word.replace("f" + voiced, "v" + voiced);
  });

  word = word.replace("ãns", "ãũ̯s");
  word = word.replace("śõũ̯c", "śõnc");
  word = word.replace("l̦v", "l̦f");
  word = word.replace("tš", "ṭš");

  word = word.replace(/b$/, "p");
  word = word.replace(/g$/, "k");

  // zmiękczenie końcówek wyrazów
  vowelsArray.some((vowel) => {
    if (word.endsWith(vowel + "d")) word = word.replace(/d$/, "t");
    if (word.endsWith(vowel + "ž")) word = word.replace(/ž$/, "š");

    if (vowel !== "i̯") {
      if (word.endsWith(vowel + "i")) word = word.replace(/i$/, "i̯i");
    }

    if (vowel !== "i" && vowel !== "i̯") {
      word = word.replace("dʹ" + vowel, "di̯" + vowel);
      word = word.replace("b́" + vowel, "bi̯" + vowel);
      word = word.replace("ǵ" + vowel, "ǵi̯" + vowel);
    }
  });

  // anglicyzmy
  if (word.startsWith("vee")) word = word.replace("v", "u̯");
  word = word.replace("oo", "u");
  word = word.replace("ee", "i");
  word = word.replace("auto", "au̯to");

  // specjalne końcówki
  word = word.replace(/zn̦$/, "sn̦");
  word = word.replace(/ḿa$/, "mja");
  word = word.replace(/nd$/, "nt");

  // wyjątki
  word = word.replace("ib́", "ibʹi");
  word = word.replace("ońt", "ońit");
  word = word.replace("x́jer", "x́er");

  // korekty
  word = word.replace("ũ̯u̯", "u̯");
  word = word.replace("ri̯", "rʹi̯");

  word = word.replace("iĩ", "i");
  word = word.replace("iį", "iu̯");
  word = word.replace("ii", "i");

  return word; // zwracanie wartości
}
