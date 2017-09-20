import { buildSchema, graphql, GraphQLSchema } from "graphql";
import * as path from "path";

// local
import Resolvers from "../resolvers";
import { readSchema } from "../util/graphql";

// List of all model schemas included in schema
const schemaStrings = [
  "Analytics",
  "Common",
  "Game",
  "Team",
  "User",
].map((schemaName) => {
  const schemaPath = path.join(__dirname, `${schemaName}.graphql`);
  return readSchema(schemaPath);
}).join("\n");

// Construct a schema, using GraphQL schema language
const Schema: GraphQLSchema = buildSchema(schemaStrings);

// The root provides a resolver function for each API endpoint
const Root: object = Resolvers;

export { Root, Schema };
