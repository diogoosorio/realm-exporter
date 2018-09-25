const Realm = require("realm");
const endOfLine = require("os").EOL;

class InvalidObjectTypeError extends Error {}

const errors = { InvalidObjectTypeError };

const translators = Object.freeze({
  CSV: (objects) => objects
    .map((obj) => Object.values(obj))
    .map((values) => values.map((value) => `"${value}"`))
    .map((values) => values.join(','))
    .reduce((acc, line) => acc + line + endOfLine, '')
    .slice(0, -1)
});

const load = path =>
  new Promise((resolve, reject) => {
    let result;

    try {
      result = resolve(Realm.open({ readOnly: true, path: path }));
    } catch (error) {
      result = reject(error);
    }

    return result;
  });

const select = objectType => db =>
  new Promise((resolve, reject) => {
    const schema = db.schema.find(schema => schema.name === objectType);

    if (!schema) {
      return reject(
        new InvalidObjectTypeError(
          `Could not find the schema for ${objectType} object type`
        )
      );
    }

    const objectProperties = Object.keys(schema.properties);
    const objects = db.objects(objectType).map(object => {
      return objectProperties.reduce((acc, key) => {
        acc[key] = object[key];
        return acc;
      }, {});
    });

    return resolve(objects);
  });

module.exports = { load, select, errors, translators };
