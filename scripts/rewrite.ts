import format_AS from "@formats/AS";
import format_IPA from "@formats/IPA";

import letters from "@formats/alphabet.json";
const alphabet = letters.all;

const vowelsArray = letters.vowels;
const consonantsArray = alphabet.filter(
  (letter) => !vowelsArray.includes(letter)
);

const voicelessArray = letters.voiceless;

// główna funkcja
export default (input: string) => {
  input = input.toLowerCase();
  const array = input.split(/[" "|"\n"]/g);

  let result = "";
  array.forEach((word) => {
    console.log(counters(word));

    result += `[${format_AS(word)}]&nbsp;[${format_IPA(word)}]`;
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

export function updateAlphabet(array: any[], key: string, value: string) {
  if (array.includes(key) && !array.includes(value)) array.push(value);
}

export function makeSofter(
  word: string,
  array: any[],
  softer: {
    [x: string]: any;
    a?: string;
    e?: string;
    ɛ?: string;
    o?: string;
    ɔ?: string;
    u?: string;
  }
) {
  type softerType = keyof typeof softer;

  let position = 0;
  const x = word.split("");
  for (let i = 0; i < x.length; i++) {
    if (Object.keys(softer).includes(x[i])) {
      position = i;
      break;
    }
  }

  const forDeletion = ["g", "h", "k"];
  const newSofts = array.filter((x) => !forDeletion.includes(x));

  newSofts.some((soft1) => {
    newSofts.some((soft2) => {
      if (
        (x[position - 2] + x[position - 1] === soft1 ||
          x[position - 1] === soft1) &&
        (x[position + 1] === soft2 ||
          x[position + 1] + x[position + 2] === soft2)
      ) {
        Object.keys(softer).forEach((key) => {
          word = word.replace(
            soft1 + key + soft2,
            soft1 + softer[key as softerType] + soft2
          );
        });
      }
    });
  });

  return word;
}

export function vowelsAccent(word: string, a: string, b: string) {
  word = word.replace(a + "m", b + "m");
  word = word.replace(a + "n", b + "n");
  word = word.replace(a + "ŋ", b + "ŋ");
  word = word.replace(a + "ń", b + "ń");
  word = word.replace(a + "ɲ", b + "ɲ");
  word = word.replace(a + "j̃", b + "j̃");
  word = word.replace(a + "ĩ ̯", b + "ĩ ̯");

  return word;
}

export function specialSofter(word: string, a: string, b: string) {
  voicelessArray.some((voiceless) => {
    word = word.replace(a + voiceless, b + voiceless);
  });

  if (word.endsWith(a)) word = word.replace(a, b);

  return word;
}

export function reduceRepeat(word: string) {
  const splitted = word.split("");

  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === splitted[i - 1]) splitted[i] = "•";
  }

  word = splitted.join("");
  return word;
}
