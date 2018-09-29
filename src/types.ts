import { ObjectSchema } from "realm";

export type IFormatter = (
  objects: IterableIterator<object>
) => Promise<IterableIterator<string>>;

export type IObjectMapper = (object: object, schema: ObjectSchema) => object;
