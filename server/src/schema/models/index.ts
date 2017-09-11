import { GreetingSchemaStr, GreetingResolvers } from './Greeting';
import { TripSchemaStr, TripResolvers } from './Trip';

// Model GraphQL Schema Strings
const schemaStrings: [string] = [
    GreetingSchemaStr,
    TripSchemaStr
];
export const ModelSchemaStrings: string = schemaStrings.join('\n');

// Model Resolvers
const resolvers: [object] = [
  GreetingResolvers,
  TripResolvers
];

export const ModelResolvers: object = resolvers.reduce((reduced, obj) => {
  return Object.assign({}, reduced, obj);
}, {});
