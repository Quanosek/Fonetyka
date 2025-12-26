import letters from './formats/alphabet.json'
import format_AS from './formats/AS'
import format_IPA from './formats/IPA'

const alphabet = letters.all
const voicelessArray = letters.voiceless
const vowelsArray = letters.vowels
const consonantsArray = alphabet.filter((letter) => !vowelsArray.includes(letter))

// wyjątki z dźwięcznością głosek przy spółgłoskach
export function sonority(word: string, a: string, b: string) {
  consonantsArray.some((con1) => {
    consonantsArray.some((con2) => {
      if (word.includes(con1 + a + con2)) word = word.replace(con1 + a + con2, con1 + b + con2)
    })
    if (word.endsWith(con1 + a)) word = word.replace(con1 + a, con1 + b)
  })

  return word
}

// zmiana alfabetu dla danego systemu zapisu
export function updateAlphabet(array: string[], key: string, value: string) {
  if (array.includes(key) && !array.includes(value)) array.push(value)
}

// zamiana głoski na miększą zgodnie z zasadą gramatyki
export function makeSofter(
  word: string,
  array: string[],
  softer: {
    [x: string]: string | undefined
    a?: string
    e?: string
    ɛ?: string
    o?: string
    ɔ?: string
    u?: string
  }
) {
  type softerType = keyof typeof softer

  let position = 0
  const x = word.split('')
  for (let i = 0; i < x.length; i++) {
    if (Object.keys(softer).includes(x[i])) {
      position = i
      break
    }
  }

  const forDeletion = ['g', 'h', 'k']
  const newSofts = array.filter((x) => !forDeletion.includes(x))

  newSofts.some((soft1) => {
    newSofts.some((soft2) => {
      if (
        (x[position - 2] + x[position - 1] === soft1 || x[position - 1] === soft1) &&
        (x[position + 1] === soft2 || x[position + 1] + x[position + 2] === soft2)
      ) {
        Object.keys(softer).forEach((key) => {
          word = word.replace(soft1 + key + soft2, soft1 + softer[key as softerType] + soft2)
        })
      }
    })
  })

  return word
}

// dodawanie zapisu akcentów w szczególnych przypadkach
export function vowelsAccent(word: string, a: string, b: string) {
  word = word.replace(a + 'm', b + 'm')
  word = word.replace(a + 'n', b + 'n')
  word = word.replace(a + 'ŋ', b + 'ŋ')
  word = word.replace(a + 'ń', b + 'ń')
  word = word.replace(a + 'ɲ', b + 'ɲ')
  word = word.replace(a + 'j̃', b + 'j̃')
  word = word.replace(a + 'ĩ ̯', b + 'ĩ ̯')

  return word
}

// zmiękczanie wyjątków
export function specialSofter(word: string, a: string, b: string) {
  voicelessArray.some((voiceless) => {
    word = word.replace(a + voiceless, b + voiceless)
  })

  if (word.endsWith(a)) word = word.replace(a, b)

  return word
}

// redukcja powtórzeń liter
export function reduceRepeat(word: string) {
  const splitted = word.split('')

  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === splitted[i - 1]) splitted[i] = '•'
  }

  word = splitted.join('')
  return word
}

// zwracanie obiektu z danymi
export default function rewrite(input: string) {
  const words = input.toLowerCase().split(/[" "|"\n"]/g)

  const results: string[] = []
  words.forEach((word) => {
    const AS = format_AS(word)
    const IPA = format_IPA(word)
    results.push(`[${AS}] [${IPA}]`)
  })

  return results
}
