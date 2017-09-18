import { buildSchema, graphql, GraphQLSchema } from "graphql";
import * as path from "path";

// local
import ModelResolvers from "../resolvers";
import { readSchema } from "../util/graphql";

// Greeting Schema String
const greetingSchemaPath = path.join(__dirname, "Greeting.graphql");
export const GreetingSchemaStr: string = readSchema(greetingSchemaPath);

// List of all model schemas included in schema
const schemaStrings = [
  "Common",
  "Game",
  "Greeting",
  "User",
].map((schemaName) => {
  const schemaPath = path.join(__dirname, `${schemaName}.graphql`);
  return readSchema(schemaPath);
}).join("\n");

// Construct a schema, using GraphQL schema language
const Schema: GraphQLSchema = buildSchema(schemaStrings);

// The root provides a resolver function for each API endpoint
const Root: object = ModelResolvers;

export { Root, Schema };
