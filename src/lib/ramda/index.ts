export function pickOr<O, K extends keyof O>(
  defaultV: O[K],
  key: K,
  obj: O
): O[K] {
  let value = obj[key];
  if (!value) {
    return defaultV;
  }
  return value;
}

export function isNil<R>(x: R): x is R {
  return x == null;
}

export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}
