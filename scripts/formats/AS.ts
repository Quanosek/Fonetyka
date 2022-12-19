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
  console.log("AS: " + changed);

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

    // wyjątki z dźwięcznością głosek przy spółgłoskach
    word = sonority(word, consonant, "l", "ḽ");
    word = sonority(word, consonant, "m", "m̦");
    word = sonority(word, consonant, "n", "n̦");
    word = sonority(word, consonant, "ń", "ń̦");
    word = sonority(word, consonant, "r", "r̭");
  });

  // poprawa gramatyczna
  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });

  // wyjątek z "rzi"
  if (word.includes("żi")) word = word.replace("żi", "rź");

  consonantsArray.some((consonant) => {
    // wyjątki z "rz"
    if (word.includes("ż" + consonant))
      word = word.replace("ż" + consonant, "rs" + consonant);
  });

  // zmiana wymowy spółgłosek, jeśli występują po samogłoskach
  vowelsArray.some((vowel) => {
    if (word.includes(vowel + "h"))
      word = word.replace(vowel + "h", vowel + "χ");

    if (word.includes(vowel + "j"))
      word = word.replace(vowel + "j", vowel + "i̯");

    if (word.includes(vowel + "č"))
      word = word.replace(vowel + "č", vowel + "ǯ");
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
