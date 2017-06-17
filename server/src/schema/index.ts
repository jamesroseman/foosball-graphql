import { graphql, buildSchema, GraphQLSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
const Schema: GraphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const Root = {
  hello: () => {
    return 'Hello world!';
  }
};

export { Schema, Root };
