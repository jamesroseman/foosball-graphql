import * as path from 'path';
import { graphql, buildSchema, GraphQLSchema } from 'graphql';
import { readSchema } from '../util/graphql';

// Model Schemas
import { ModelSchemaStrings, ModelResolvers } from './models';

// List of all model schemas included in schema
const commonSchemaStr: string =
  readSchema(path.join(__dirname, 'common.graphql'));
const schemaStrings: string = [
  commonSchemaStr,
  ModelSchemaStrings
].join('\n');

// Construct a schema, using GraphQL schema language
const Schema: GraphQLSchema = buildSchema(schemaStrings);

// The root provides a resolver function for each API endpoint
const Root = ModelResolvers;

export { Schema, Root };
