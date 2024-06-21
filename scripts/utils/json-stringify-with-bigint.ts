export const jsonStringifyWithBigint: typeof JSON.stringify = (
  obj: unknown,
  replacer,
  space,
) => {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    space,
  );
};
