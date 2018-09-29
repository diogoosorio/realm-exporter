import { IFormatter } from "./types";

export const csvFormatter: IFormatter = function(objects) {
  return Promise.resolve(function* () {
      for (let obj of objects) {
        yield Object.keys(obj).map(key => `"${obj[key]}"`).join(',')
      }
  }());
};
