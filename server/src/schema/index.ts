import { graphql, buildSchema, GraphQLSchema } from 'graphql';

// Model Schemas
import { HelloSchemaStr, HelloResolvers } from './Hello';

// List of all model schemas included in schema
const schemaStrings: string = [
  HelloSchemaStr
].join('\n');

// Construct a schema, using GraphQL schema language
const Schema: GraphQLSchema = buildSchema(schemaStrings);

// The root provides a resolver function for each API endpoint
const Root = {
  hello: () => {
    return 'Hello world!';
  }
};

export { Schema, Root };
