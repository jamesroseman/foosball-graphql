import * as path from 'path';
import { readSchema } from '../../../util/graphql';

// Model Resolvers
import {
  getGreetingById,
  getGreetingConnection,
  introduceGreeting
} from './resolvers';

// Model Schema String
const localSchemaPath = path.join(__dirname, 'Greeting.graphql');
export const GreetingSchemaStr: string = readSchema(localSchemaPath);

// Schema Root
export const GreetingResolvers: object = {
  greeting: (args: any) => getGreetingById(args.id),
  greetings: (args: any) => getGreetingConnection(args),
  introduceGreeting: (args: any) => introduceGreeting(args.input)
}
