import { GreetingSchemaStr, GreetingResolvers } from './Greeting';

// Model GraphQL Schema Strings
const schemaStrings: [string] = [
    GreetingSchemaStr
];
export const ModelSchemaStrings: string = schemaStrings.join('\n');

// Model Resolvers
const resolvers: [object] = [
    GreetingResolvers
];
export const ModelResolvers: object = Object.assign({}, ...resolvers);
