export function getFileDetails(file) {
  const truncatedFilename = shortener(file.name, {
    headLength: 20,
    tailLength: 10,
  });
  const readableSize = convertBytes(file.size);
  return `${truncatedFilename} (${readableSize})`;
}

/**
 * Limits the amount of characters on a given string leaving only the beginning and end
 * @param   {string} str     Original string to be shortened
 * @param   {object} options Configuration parameters for amount of characters, separation, etc.
 * @return  {string}         The shortened version of the string (original is not modified)
 *
 * @example
 * > shortener('screenshot_20210808_154621.png', { tailLength: 8, sep: '*', sepAmount: 5 })
 * > scree*****4621.png
 */
export function shortener(
  str,
  { headLength = 5, tailLength = 5, sepAmount = 3, sep = '.' } = {}
) {
  if (str.length <= headLength + tailLength + sepAmount) {
    return str;
  }

  const head = str.slice(0, headLength).padEnd(headLength + sepAmount, sep);
  const tail = str.slice(str.length - tailLength);

  return head + tail;
}

export function convertBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes == 0) {
    return 'n/a';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  if (i == 0) {
    return bytes + ' ' + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}
