import { ObjectSchema } from "realm";

export interface IFormatter {
  (objects: IterableIterator<object>): Promise<IterableIterator<string>>;
}

export interface IObjectMapper {
  (object: object, schema: ObjectSchema): object;
}
