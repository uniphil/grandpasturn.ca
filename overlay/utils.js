
export function ellipsize(input, charLimit, stretch=0.15) {
  if (input.length < charLimit * stretch) {
    return [input, false];
  }
  const ellipsized = [];
  let count = 0;
  for (let word of input.split(' ')) {
    count += word.length + 1;
    if (count > charLimit + 1) break;
    ellipsized.push(word);
  }
  return [ellipsized.join(' '), true];
}
