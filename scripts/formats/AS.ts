export default function (word: string) {
  const letters = word.split("");

  // loanwords
  if (word.includes("chip")) word = word.replace("chip", "čip");
  if (word.slice(0, 3) !== "cit" && word.slice(-2) !== "ci")
    word = word.replaceAll("ci", "ć");

  // one letter
  if (letters[1] === "ę") word = word.replace("ę", "e");
  if (letters[0] === "i") word = word.replace("i", "į");

  // first two letters
  if (word.slice(0, 2) !== "li") word = word.replace("li", "l̦i");
  if (word.slice(0, 2) === "pi") word = word.replace("pi", "ṕi");
  else word = word.replace("pi", "ṕ");
  if (word.slice(0, 4) === "ṕio") word = word.replace("ṕio", "ṕo");
  else word = word.replace("ṕie", "ṕe");

  if (word.slice(0, 2) === "si") word = word.replace("si", "śi");
  if (word.slice(0, 2) !== "wi") word = word.replace("w", "v");
  if (word.slice(0, 2) === "ve") word = word.replace("ve", "veŋ́");

  if (word.slice(0, 2) === "hi") word = word.replace("hi", "χ́i");
  else word = word.replaceAll("h", "h̦");

  if (word.slice(0, 2) === "łą") word = word.replace("łą", "łoŋ");
  else word = word.replaceAll("ł", "u̯̦");

  // "dzi" problem
  if (word.includes("dzi")) word = word.replace("dzi", "ʒ́i");
  if (word.includes("ʒ́ie")) word = word.replace("ʒ́ie", "ʒ́ė");
  if (word.slice(0, 3) !== "ʒ́ė") word = word.replace("ʒ́ė", "ʒ́e");

  // two last letters
  if (word.slice(-2) !== "ek") word = word.replace("ek", "enk");
  if (word.slice(-2) === "ki") word = word.replace("ki", "ḱi");
  if (word.slice(-2) === "ąć") word = word.replace("ąć", "ońć");
  if (word.slice(-3) !== "śl") word = word.replace("śl", "śl̦");
  if (word.slice(-2) === "tr") word = word.replace("tr", "tr̦");
  if (word.slice(-2) === "sm") word = word.replace("sm", "sm̦");

  word = word
    // a
    // ą
    // b
    .replaceAll("bić", "b́ić")
    .replaceAll("bi", "b́")
    // c
    .replaceAll("icz", "iǯ")
    .replaceAll("cz", "č")
    // ć
    .replaceAll("ćdź", "nʒ́")
    // d
    // e
    .replaceAll("en", "eŋ")
    .replaceAll("es", "ęs")
    .replaceAll("ew", "ev")
    // ę
    // f
    .replaceAll("fić", "f́ić")
    .replaceAll("fi", "f́")
    // g
    .replaceAll("gi", "ǵ")
    // h
    .replaceAll("hi", "χ́")
    .replaceAll("ha", "cha")
    .replaceAll("cha", "χa")
    // i
    .replaceAll("įn", "į")
    // j
    .replaceAll("j", "i̯")
    // k
    .replaceAll("ki", "ḱ")
    .replaceAll("kunsz", "kųš")
    // l
    // ł
    // m
    .replaceAll("miś", "ḿiś")
    .replaceAll("misi", "ḿiś")
    .replaceAll("mi", "ḿ")
    .replaceAll("ḿę", "ḿe")
    // n
    .replaceAll("nia", "ŋa")
    .replaceAll("nk", "ŋk")
    .replaceAll("ng", "ŋɡ")
    // ń
    // o
    // ó
    // p
    .replaceAll("pić", "ṕić")
    .replaceAll("ṕę", "ṕe")
    // r
    .replaceAll("rynsz", "ryš")
    .replaceAll("sz", "š")
    // s
    .replaceAll("siąt", "ś")
    .replaceAll("ski", "sḱi")
    .replaceAll("si", "ś")
    .replaceAll("są", "soṇ")
    .replaceAll("šans", "šąs")
    // ś
    // t
    // u
    .replaceAll("uch", "uχ")
    .replaceAll("ul̦", "ul")
    // w
    .replaceAll("vąs", "vǫs")
    .replaceAll("wić", "v́ić")
    .replaceAll("wi", "v́")
    .replaceAll("w", "u̯")
    // x
    .replaceAll("x", "ks")
    // y
    // ź
    .replaceAll("dzi", "ʒ́")
    .replaceAll("dź", "ʒ́")
    // ż
    .replaceAll("dż", "ǯ")
    .replaceAll("drz", "ḍž")
    .replaceAll("ż", "ž")
    // z
    .replaceAll("dz", "ʒ")
    .replaceAll("zi", "ź");

  //
  // every special character takes 2 places!
  //

  if (word.includes("ąc") || word.includes("ąč")) {
    word = word.replace("ąc", "oṇc");
    word = word.replace("ąč", "oṇč");
  }

  if (word.includes("vǫs")) word = word.replace("vǫs", "voų̯s");
  if (word.includes("i̯ó")) word = word.replace("i̯ó", "jü");
  if (word.includes("i̯ai̯")) word = word.replace("i̯ai̯", "i̯äi̯");
  if (word.includes("ćoć")) word = word.replace("ćoć", "ćȯć");
  if (word.includes("sŋk")) word = word.replace("sŋk", "sn̦k");
  if (word.includes("trzy")) word = word.replace("trzy", "ṭšy");
  if (word.includes("pańs")) word = word.replace("pańs", "paį̯s");

  if (word.slice(-2) === "śń") word = word.replace("ń", "ń̦");
  if (word.slice(0, 4) === "ṕię") word = word.replace("ṕię", "ṕe");

  // loanwords
  if (word.slice(0, 4) === "śinu") word = word.replace("śinu", "sinu");
  if (word.slice(0, 3) === "źn") word = word.replace("źn", "zin");

  return word;
}
