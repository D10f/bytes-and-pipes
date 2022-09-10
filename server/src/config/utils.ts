import fs from 'fs';

export function readDockerSecrets() {
  const config: { [k: string]: string } = {};

  for (const key in process.env) {
    if (key.endsWith('_FILE')) {
      fs.readFile(
        process.env[key] as string,
        (err: Error | null, val: Buffer) => {
          if (err) {
            throw new Error(err.message);
          }

          config[key] = val.toString().replace('\n', '');
        },
      );
    } else {
      config[key] = process.env[key] as string;
    }
  }

  return config;
}

/**
 *  Custom validation function to be used alongside Joi validators.
 *  Parses a string into a number. Allows for strings like: '12Mb', '1GiB', etc
 */
export function parseStorage(value: string): number {
  // If it can be parsed into a number return the value as is
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  // If it cannot parse the string using the parse function below
  return parse(value);
}

/**
 * Parses a storage capacity string into its byte value
 * @param   {string} input string representing an amount of storage capacity eg., 10GB, 2Megabytes
 * @returns {number}       value in bytes of the parsed string
 */
function parse(input: string): number {
  const match = input.match(_re);

  if (match === null) {
    throw new Error(
      'Malformed expression: invalid value or unit of measurement provided.',
    );
  }
  const [value, unit] = _parseRegExpMatchResult(match);
  const magnitude = _getOrderOfMagnitude(unit as string);
  const exponent = _getDataExponent(unit as string);

  return (value as number) * magnitude ** exponent;
}

/**
 * parses the result of the regexp into a float and string
 * @param   {array} input a RegExpMatchArray
 * @returns {array} tuple of float and string, parsed into valid values representing a size of media storage
 */
function _parseRegExpMatchResult(input: RegExpMatchArray) {
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
function _getOrderOfMagnitude(unit: string) {
  const unitIndex = _multipleByteUnits.findIndex((u) => u === unit);
  const isDecimal = unitIndex < _metricUnits.length;
  return isDecimal ? 1000 : 1024;
}

/**
 * returns the data exponent given the used unit of measurement
 * @param  {string} unit string representing the unit of measurement
 * @return {number} the exponent of the operation based on the unit of measurement used
 */
function _getDataExponent(unit: string) {
  const unitIndex = _multipleByteUnits.findIndex((u) => u === unit);
  // the unit arrays include both the long and short form to express units. Only
  // increase the exponent count up to half the size of the array due to this.
  return unitIndex % (_metricUnits.length / 2);
}

const _metricUnits = [
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

const _multipleByteUnits = [..._metricUnits, ..._binaryUnits];

const _re = new RegExp(
  `^(\\d+(\\.\\d+)?)\\s?(${_multipleByteUnits.join('|')})(s|bytes?)?$`,
  'i',
);
