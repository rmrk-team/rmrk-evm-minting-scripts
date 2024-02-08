export const jsonStringifyWithBigint = (obj: unknown) => {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );
};
