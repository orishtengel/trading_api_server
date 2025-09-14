/**
 * Options for parsing timestrings
 */
export interface ParseTimestringOptions {
  hoursPerDay?: number;
  daysPerWeek?: number;
  weeksPerMonth?: number;
  monthsPerYear?: number;
  daysPerYear?: number;
}

/**
 * Unit values mapping
 */
interface UnitValues {
  ms: number;
  s: number;
  m: number;
  h: number;
  d: number;
  w: number;
  mth: number;
  y: number;
}

/**
 * Time unit keys
 */
type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mth' | 'y';

/**
 * Default options to use when parsing a timestring
 */
const DEFAULT_OPTS: Required<ParseTimestringOptions> = {
  hoursPerDay: 24,
  daysPerWeek: 7,
  weeksPerMonth: 4,
  monthsPerYear: 12,
  daysPerYear: 365.25,
};

/**
 * Map of accepted strings to unit
 */
const UNIT_MAP: Record<TimeUnit, string[]> = {
  ms: ['ms', 'milli', 'millisecond', 'milliseconds'],
  s: ['s', 'sec', 'secs', 'second', 'seconds'],
  m: ['m', 'min', 'mins', 'minute', 'minutes'],
  h: ['h', 'hr', 'hrs', 'hour', 'hours'],
  d: ['d', 'day', 'days'],
  w: ['w', 'week', 'weeks'],
  mth: ['mon', 'mth', 'mths', 'month', 'months'],
  y: ['y', 'yr', 'yrs', 'year', 'years'],
};

/**
 * Parse a timestring
 *
 * @param   value - The timestring to parse (e.g., "1h 30m") or a number
 * @param   returnUnit - Optional unit to convert the result to
 * @param   opts - Optional parsing options
 * @returns The parsed time value in seconds (or in the specified returnUnit)
 */
export function parseTimestring(
  value: string | number,
  returnUnit?: string,
  opts?: ParseTimestringOptions,
): number {
  const mergedOpts = Object.assign(
    {},
    DEFAULT_OPTS,
    opts || {},
  ) as Required<ParseTimestringOptions>;

  if (typeof value === 'number' || value.toString().match(/^[-+]?[0-9.]+$/g)) {
    value = parseInt(value.toString()) + 'ms';
  }

  let totalSeconds = 0;
  const unitValues = getUnitValues(mergedOpts);
  const stringValue = value.toString();
  const groups = stringValue
    .toLowerCase()
    .replace(/[^.\w+-]+/g, '')
    .match(/[-+]?[0-9.]+[a-z]+/g);

  if (groups === null) {
    throw new Error(`The value [${value}] could not be parsed by timestring`);
  }

  groups.forEach((group) => {
    const matchedValue = group.match(/[0-9.]+/g)?.[0];
    const matchedUnit = group.match(/[a-z]+/g)?.[0];

    if (!matchedValue || !matchedUnit) {
      throw new Error(`Invalid group format: ${group}`);
    }

    totalSeconds += getSeconds(matchedValue, matchedUnit, unitValues);
  });

  if (returnUnit) {
    return convert(totalSeconds, returnUnit, unitValues);
  }

  return totalSeconds;
}

/**
 * Get unit values based on the passed options
 *
 * @param   opts - The parsing options
 * @returns Unit values mapping
 */
function getUnitValues(opts: Required<ParseTimestringOptions>): UnitValues {
  const unitValues: UnitValues = {
    ms: 0.001,
    s: 1,
    m: 60,
    h: 3600,
    d: 0,
    w: 0,
    mth: 0,
    y: 0,
  };

  unitValues.d = opts.hoursPerDay * unitValues.h;
  unitValues.w = opts.daysPerWeek * unitValues.d;
  unitValues.mth = (opts.daysPerYear / opts.monthsPerYear) * unitValues.d;
  unitValues.y = opts.daysPerYear * unitValues.d;

  return unitValues;
}

/**
 * Get the key for a unit
 *
 * @param   unit - The unit string to find the key for
 * @returns The unit key
 */
function getUnitKey(unit: string): TimeUnit {
  for (const key of Object.keys(UNIT_MAP) as TimeUnit[]) {
    if (UNIT_MAP[key].indexOf(unit) > -1) {
      return key;
    }
  }

  throw new Error(`The unit [${unit}] is not supported by timestring`);
}

/**
 *  Get the number of seconds for a value, based on the unit
 *
 * @param   value - The numeric value
 * @param   unit - The time unit
 * @param   unitValues - The unit values mapping
 * @returns The value converted to seconds
 */
function getSeconds(value: string, unit: string, unitValues: UnitValues): number {
  return parseFloat(value) * unitValues[getUnitKey(unit)];
}

/**
 * Convert a value from its existing unit to a new unit
 *
 * @param   value - The value in seconds
 * @param   unit - The target unit to convert to
 * @param   unitValues - The unit values mapping
 * @returns The converted value
 */
function convert(value: number, unit: string, unitValues: UnitValues): number {
  return value / unitValues[getUnitKey(unit)];
}

// Default export for compatibility
export default parseTimestring;
