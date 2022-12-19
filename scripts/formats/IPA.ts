// wszystkie litery alfabetu
const alphabet = [
  "a",
  "ą",
  "b",
  "c",
  "ć",
  "d",
  "e",
  "ę",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "ł",
  "m",
  "n",
  "ń",
  "o",
  "ó",
  "p",
  "q",
  "r",
  "s",
  "ś",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "ź",
  "ż",
];
// samogłoski
const vowelsArray = ["a", "ą", "e", "ę", "i", "o", "ó", "u", "y"];
// spółgłoski
const consonantsArray = alphabet.filter(
  (letter) => !vowelsArray.includes(letter)
);

export default function (word: string) {
  const counter = counters(word);
  console.log(counter);

  const changed = changeGrammar(word);
  console.log("IPA: " + changed);

  return changed;
}

// zliczanie elementów wyrazu
function counters(word: string) {
  const counters = {
    word: word,
    letters: word.length,
    vowels: 0,
    consonants: 0,
  };

  word.split("").forEach((letter) => {
    vowelsArray.some((vowel) => {
      if (letter === vowel) counters.vowels++;
    });
  });

  counters.consonants = word.length - counters.vowels;
  return counters;
}

// zmiana gramatyki
function changeGrammar(word: string) {
  // specjalne przypadki
  const grammar = {
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
    ki: "c",
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

// wyjątki z dźwięcznością głosek przy spółgłoskach
function sonority(word: string, consonant: string, a: string, b: string) {
  if (word.includes(a + consonant))
    word = word.replace(a + consonant, b + consonant);
  if (word.endsWith(consonant + a))
    word = word.replace(consonant + a, consonant + b);

  return word;
}
