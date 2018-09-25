const Realm = require("realm");

class InvalidObjectTypeError extends Error {}

const errors = { InvalidObjectTypeError };

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

module.exports = { load, select, errors };
