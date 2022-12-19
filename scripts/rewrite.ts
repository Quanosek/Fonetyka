import format_AS from "@formats/AS";
import format_IPA from "@formats/IPA";

export default (input: string) => {
  // create Array with splitted words
  input = input.toLowerCase();
  const array = input.split(/[" "|"\n"]/g);

  let result = "";

  array.forEach((word) => {
    result += `/${format_AS(word)}/ /${format_IPA(word)}/`;
    result += "<br />";
  });

  // return formatted text
  return result.toString();
};
