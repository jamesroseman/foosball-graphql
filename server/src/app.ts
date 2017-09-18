import * as bodyParser from "body-parser";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import * as logger from "morgan";
import * as path from "path";

// controllers
import { GraphQLControllerFactory } from "./controllers";

// schema
import { Root, Schema as GraphQLSchema } from "./schema";

// Check environment variables and throw errors if expected ones aren't set
let isDevEnv: boolean = false;
const nodeEnv: string | null = process.env.NODE_ENV;
if (!nodeEnv) {
  isDevEnv = false;
} else {
  isDevEnv = nodeEnv.toUpperCase() === "DEV";
}

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
    // GraphQL API endpoints
    this.express.use("/api/graphql", GraphQLControllerFactory(isDevEnv, Root, GraphQLSchema));

    // Direct traffic to front-end app
    // Note: This must come last
    this.express.use(express.static(path.join(__dirname, "./../../app/public")));
  }

}

export default new App().express;
