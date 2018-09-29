import { IFormatter } from "./types";

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
