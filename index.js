const Realm = require("realm");
const endOfLine = require("os").EOL;

class InvalidObjectTypeError extends Error {}

const errors = { InvalidObjectTypeError };

const translators = Object.freeze({
  CSV: objectsGenerator =>
    Promise.resolve(function*() {
      for (let object of objectsGenerator()) {
        yield Object.values(object)
          .map(value => `"${value}"`)
          .join(",");
      }
    })
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

const defaultObjectMapper = (schema, object) =>
  Object.keys(schema.properties).reduce((acc, key) => {
    acc[key] = object[key];
    return acc;
  }, {});

const select = (
  objectType,
  objectMapper = defaultObjectMapper
) => realmInstance =>
  new Promise((resolve, reject) => {
    const schema = realmInstance.schema.find(
      schema => schema.name === objectType
    );

    if (!schema) {
      return reject(
        new InvalidObjectTypeError(
          `Could not find the schema for ${objectType} object type`
        )
      );
    }

    const objects = realmInstance.objects(objectType).entries();
    const decoratedObjects = function*() {
      for (let [, object] of objects) {
        yield objectMapper(schema, object);
      }
    };

    return resolve(decoratedObjects);
  });

module.exports = { load, select, errors, translators };
