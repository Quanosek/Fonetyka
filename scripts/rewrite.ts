import format_AS from "@formats/AS";
import format_IPA from "@formats/IPA";

import letters from "@formats/alphabet.json";
const vowelsArray = letters.vowels;

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
export function sonority(
  word: string,
  consonant: string,
  a: string,
  b: string
) {
  if (word.includes(a + consonant))
    word = word.replace(a + consonant, b + consonant);
  if (word.endsWith(consonant + a))
    word = word.replace(consonant + a, consonant + b);

  return word;
}
