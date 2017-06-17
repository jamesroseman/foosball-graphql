import * as path from 'path';
import { readSchema } from '../../util/graphql';

// Schema String
const localSchemaPath = path.join(__dirname, 'Hello.graphql');
export const HelloSchemaStr: string = readSchema(localSchemaPath);

// Schema Root
export const HelloResolvers: object = {
  hello: () => {
    return 'Hello world!';
  }
}
