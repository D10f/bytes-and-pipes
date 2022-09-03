/**
 * Inspired by this blog post. Added support to optionally specify kilo- and kibi- magnitudes.
 * @credit https://www.bennadel.com/blog/2837-parsing-various-units-of-measurement-as-bytes-in-node-js.htm
 */

/**
 * Parses a storage capacity string into its byte value
 * @param   {string} input string representing an amount of storage capacity eg., 10GB, 2Megabytes
 * @returns {number}       value in bytes of the parsed string
 */
export function parse(input = '1mb') {
  const match = input.match(_re);

  if (match === null) {
    throw new Error(
      'Malformed expression: invalid value or unit of measurement provided.'
    );
  }

  const [value, unit] = _parseRegExpMatchResult(match);
  const magnitude = _getOrderOfMagnitude(unit);
  const exponent = _getDataExponent(unit);

  return value * magnitude ** exponent;
}

/**
 * parses the result of the regexp into a float and string
 * @param   {array} input a RegExpMatchArray
 * @returns {array} tuple of float and string, parsed into valid values representing a size of media storage
 */
function _parseRegExpMatchResult(input) {
  const value = parseFloat(input[1]);
  let unit = input[3].toLowerCase();

  unit =
    unit === 'byte' || unit === 'bytes' ? unit : unit.replace(/bytes?/, '');

  return [value, unit];
}

/**
 * returns the data order of magnitude given the used unit of measurement
 * @param  {string} unit string representing the unit of measurement
 * @return {number} one of 1000 or 1024
 */
function _getOrderOfMagnitude(unit) {
  const unitIndex = _multipleByteUnits.findIndex((u) => u === unit);
  const isDecimal = unitIndex < _decimalUnits.length;
  return isDecimal ? 1000 : 1024;
}

/**
 * returns the data exponent given the used unit of measurement
 * @param  {string} unit string representing the unit of measurement
 * @return {number} the exponent of the operation based on the unit of measurement used
 */
function _getDataExponent(unit) {
  const unitIndex = _multipleByteUnits.findIndex((u) => u === unit);
  // the unit arrays include both the long and short form to express units. Only
  // increase the exponent count up to half the size of the array due to this.
  return unitIndex % (_decimalUnits.length / 2);
}

const _decimalUnits = [
  'byte',
  'kilo',
  'mega',
  'giga',
  'tera',
  'peta',
  'exa',
  'zetta',
  'yotta',
  'b',
  'kb',
  'mb',
  'gb',
  'tb',
  'pb',
  'eb',
  'zb',
  'yt',
];

const _binaryUnits = [
  'byte',
  'kibi',
  'mebi',
  'gibi',
  'tebi',
  'pebi',
  'exbi',
  'zebi',
  'yobi',
  'b',
  'kib',
  'mib',
  'gib',
  'tib',
  'pib',
  'eib',
  'zib',
  'yit',
];

const _multipleByteUnits = [..._decimalUnits, ..._binaryUnits];

const _re = new RegExp(
  `^(\\d+(\\.\\d+)?)\\s?(${_multipleByteUnits.join('|')})(s|bytes?)?$`,
  'i'
);
