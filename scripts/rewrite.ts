import format_AS from "@formats/AS";
import format_IPA from "@formats/IPA";

import letters from "@formats/alphabet.json";
const alphabet = letters.all;

const vowelsArray = letters.vowels;
const consonantsArray = alphabet.filter(
  (letter) => !vowelsArray.includes(letter)
);

// główna funkcja
export default (input: string) => {
  input = input.toLowerCase();
  const array = input.split(/[" "|"\n"]/g);

  let result = "";
  array.forEach((word) => {
    console.log(counters(word));

    result += `/${format_AS(word)}/ /${format_IPA(word)}/`;
    result += "<br />";
  });

  return result.toString();
};

// zliczanie elementów wyrazu
export function counters(word: string) {
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

// wyjątki z dźwięcznością głosek przy spółgłoskach
export function sonority(word: string, a: string, b: string) {
  consonantsArray.some((con1) => {
    consonantsArray.some((con2) => {
      if (word.includes(con1 + a + con2))
        word = word.replace(con1 + a + con2, con1 + b + con2);
    });
    if (word.endsWith(con1 + a)) word = word.replace(con1 + a, con1 + b);
  });

  return word;
}
