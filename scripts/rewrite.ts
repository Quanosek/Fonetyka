import format_AS from "@formats/AS";
import format_IPA from "@formats/IPA";
import syllables from "@formats/syllables";

export default (input: string) => {
  // create Array with splitted words
  input = input.toLowerCase();
  const array = input.split(/[" "|"\n"]/g);

  let result = "";

  array.forEach((word) => {
    // result.push(format_AS(word));
    // result.push(format_IPA(word));
    result += `${syllables(word)} `;
  });

  // return formatted text
  return result.toString();
};
