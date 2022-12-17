import format_AS from "./formats/AS.js";

export default (input) => {
  // create Array with splitted words
  input = input.toLowerCase();
  const array = input.split(/[" "|"\n"]/g);

  let result = "";
  array.forEach((word) => {
    result += `${format_AS(word)} `;
  });

  // return formatted text
  return result;
};
