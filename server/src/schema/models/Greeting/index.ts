import * as path from 'path';
import { readSchema } from '../../../util/graphql';

// Schema String
const localSchemaPath = path.join(__dirname, 'Greeting.graphql');
export const GreetingSchemaStr: string = readSchema(localSchemaPath);

// Schema Root
export const GreetingResolvers: object = {
    Greeting: () => {
        return 'Hello world!';
    }
}
