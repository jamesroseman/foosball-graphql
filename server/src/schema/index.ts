import { buildSchema, graphql, GraphQLSchema } from "graphql";
import * as path from "path";
import { readSchema } from "../util/graphql";

// Model Schemas
import { ModelResolvers, ModelSchemaStrings } from "./models";

// List of all model schemas included in schema
const commonSchemaStr: string =
  readSchema(path.join(__dirname, "common/common.graphql"));
const schemaStrings: string = [
  commonSchemaStr,
  ModelSchemaStrings,
].join("\n");

// Construct a schema, using GraphQL schema language
const Schema: GraphQLSchema = buildSchema(schemaStrings);

// The root provides a resolver function for each API endpoint
const Root = ModelResolvers;

export { Schema, Root };
