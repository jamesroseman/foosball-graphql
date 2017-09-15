import * as bodyParser from "body-parser";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import * as logger from "morgan";
import * as path from "path";

// schema
import { Root, Schema as GraphQLSchema } from "./schema";

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    const router = express.Router();

    // /api/graphql
    router.post("/api/graphql", graphqlHTTP({
      graphiql: false,
      rootValue: Root,
      schema: GraphQLSchema,
    }));

    router.get("/api/graphql", graphqlHTTP({
      graphiql: true,
      rootValue: Root,
      schema: GraphQLSchema,
    }));

    // Direct traffic to front-end app
    // Note: This must come last
    this.express.use("/", router);
    this.express.use(express.static(path.join(__dirname, "./../../app/public")));
  }

}

export default new App().express;
