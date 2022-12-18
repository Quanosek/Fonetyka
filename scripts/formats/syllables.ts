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
  console.log(changed);

  // const syllables = syllable(word, changed);
  // console.log(syllables);

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

  // jeśli "i" jest ostatnią głoską, to "i" musi zostać!
  if (word.endsWith("i") && !word.endsWith("ii")) word = word + "i";

  // jeśli po "i" występuje spółgłoska, to "i" musi zostać!
  consonantsArray.some((consonant) => {
    if (word.endsWith("i"))
      word = word.replaceAll("i" + consonant, "ii" + consonant);

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
  });

  type keyType = keyof typeof grammar;
  Object.keys(grammar).forEach((key) => {
    word = word.replaceAll(key, grammar[key as keyType]);
  });

  return word;
}

function syllable(word: string, changed: string) {
  let syllables = "";

  word.split("").forEach((letter) => {
    vowelsArray.forEach((vowel) => {
      // if (letter === vowel) console.log("sylaba");
    });
  });

  return syllables;
}
