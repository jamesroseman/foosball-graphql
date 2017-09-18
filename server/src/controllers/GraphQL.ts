import * as bodyParser from "body-parser";
import { Router } from "express";
import * as graphqlHTTP from "express-graphql";
import { GraphQLSchema } from "graphql";

export const GraphQLControllerFactory = (
  isDevEnv: boolean,
  rootValue: object,
  schema: GraphQLSchema,
): Router => {
  const router: Router = Router();

  // GET /api/graphql
  router.get("/", (req, res) =>
    graphqlHTTP({
      // If this is a dev environment, we should display iQL for ease-of-use
      graphiql: isDevEnv,
      rootValue,
      schema,
    })(req, res));

  // POST /api/graphql
  router.post("/", (req, res) =>
    graphqlHTTP({
      rootValue,
      schema,
    })(req, res));

  return router;
};
