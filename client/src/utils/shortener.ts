// https://github.com/herokunt/javascript_ramblings/blob/main/shortener.js

/**
 * Limits the amount of characters on a given string leaving only the beginning and end
 *
 * @example
 * > shortener('screenshot_20210808_154621.png', { tailLength: 8, sep: '*', sepAmount: 5 })
 * > scree*****4621.png
 */

const shortener = (str: string, {
  headLength = 30,
  tailLength = 0,
  sepAmount = 3,
  separator = '.'
} = {}): string => {

  if (str.length <= headLength + tailLength + sepAmount) {
    return str;
  }

  const head = str.slice(0, headLength).padEnd(headLength + sepAmount, separator);
  const tail = str.slice(str.length - tailLength);

  return head + tail;
}

export default shortener;
