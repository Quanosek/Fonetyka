import format_AS from "@formats/AS";
import format_IPA from "@formats/IPA";
import syllables from "@formats/syllables";

export default (input: string) => {
  // create Array with splitted words
  input = input.toLowerCase();
  const array = input.split(/[" "|"\n"]/g);

  let result: string[] = [];
  array.forEach((word) => {
    result.push(format_AS(word));
  });

  // return formatted text
  return result.toString();
};
