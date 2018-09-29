/**
 * Formatter interface
 *
 * Represents a function that knows how to turn a list of retrieved objects into a known format (e.g. a CSV
 * line).
 */
export type IFormatter = (
  objects: IterableIterator<object>
) => Promise<IterableIterator<string>>;

/**
 * A very naive CSV formatter implementation
 *
 * The formatter wraps all values in a pair of " characters and splits them with a comma. As the rest of the
 * application, the promise resolves to a generator that yields 1 line at a time as to reduce the amount of
 * data held in memory.
 *
 * @param objects An iterable list of objects to be transformed into CSV
 */
export const csvFormatter: IFormatter = objects => {
  return Promise.resolve(
    (function*() {
      for (const obj of objects) {
        yield Object.keys(obj)
          .map(key => `"${obj[key]}"`)
          .join(",");
      }
    })()
  );
};
