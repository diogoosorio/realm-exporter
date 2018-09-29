import Realm from "realm";
import { ObjectSchema } from "realm";
import { InvalidObjectTypeError } from "./errors";

/**
 * Mapper interface that maps a Realm database object
 *
 * Provides an extensibility point do transform/append data to a database retrieved object.
 *
 * @see simpleObjectMapper
 */
export type IObjectMapper = (object: object, schema: ObjectSchema) => object;

/**
 * Establishes the connection to the realm database
 *
 * @param path The database .realm file location
 */
export const load = (path: string): Promise<Realm> =>
  new Promise((resolve, reject) => {
    return Realm.open({ readOnly: true, path }).then(resolve, reject);
  });

/**
 * Simple implementation of a object mapping
 *
 * Converts the Realm.Object instance into a plain javascript object.
 *
 * @param object An object extracted from the Realm database
 * @param schema The realm object schema that corresponds to the object
 */
const simpleObjectMapper: IObjectMapper = (
  object: object,
  schema: ObjectSchema
): object => {
  return Object.keys(schema.properties).reduce((acc, prop) => {
    acc[prop] = object[prop];
    return acc;
  }, {});
};

/**
 * Selects all objects of a given type from the database
 *
 * The function returns a generator which yields one (already mapped through the provided mapping function) object
 * at a time.
 *
 * @param objectType The to be extracted realm object type name within the database
 * @param objectMapper The function responsible for mapping each retrieved object
 */
export const select = (
  objectType: string,
  objectMapper: IObjectMapper = simpleObjectMapper
) => (realm: Realm): Promise<IterableIterator<object>> =>
  new Promise((resolve, reject) => {
    const schema = realm.schema.find(
      definition => definition.name === objectType
    );

    if (!schema) {
      return reject(
        new InvalidObjectTypeError(
          `Could not find the schema for ${objectType} object type`
        )
      );
    }

    const objects = realm.objects(objectType).entries();
    const decoratedObjects = function*(): IterableIterator<object> {
      for (const [, object] of objects) {
        yield objectMapper(object, schema);
      }
    };

    return resolve(decoratedObjects());
  });

export const getObjectNames = (realm: Realm) =>
  Promise.resolve(realm.schema.map(schemaObj => schemaObj.name));
