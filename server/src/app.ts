import * as bodyParser from "body-parser";
import * as express from "express";
import { Router } from "express";
import * as graphqlHTTP from "express-graphql";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as path from "path";

// local
import * as Db from "./db";

// controllers
import { GraphQLControllerFactory } from "./controllers";

// schema
import { Root, Schema as GraphQLSchema } from "./schema";

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  // ref to Db address
  private dbAddr: string;

  // environment variables as flags
  private isEnv: any = {
    dev: false,
    prod: false,
    test: false,
  };

  // Run configuration methods on the Express instance.
  constructor() {
    // Overwrite mpromises
    (mongoose as any).Promise = global.Promise;
    // Prepare express server
    this.express = express();
    this.environment();
    this.middleware();
    this.routes();
    // Initialize new database
    Db.initialize(this.dbAddr);
  }

  // Read environment variables and throw errors accordingly.
  private environment(): void {
    // Read enviornment setting (dev|prod|test)
    const nodeEnv: string | null = process.env.NODE_ENV;
    if (nodeEnv) {
      this.isEnv.dev = nodeEnv.toUpperCase() === "DEV";
      this.isEnv.prod = nodeEnv.toUpperCase() === "PROD";
      this.isEnv.test = nodeEnv.toUpperCase() === "TEST";
    }
    // Read database address
    const dbAddr: string | null = process.env.DB_ADDR;
    if (!dbAddr) {
      throw new Error("Application cannot be run without DB_ADDR set.");
    } else {
      this.dbAddr = dbAddr;
    }
  }

  // Configure global Express middleware.
  private middleware(): void {
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    // GraphQL API endpoints
    this.express.use(
      "/api/graphql",
      GraphQLControllerFactory(this.isEnv.dev, Root, GraphQLSchema),
    );

    // Direct traffic to front-end app
    // Note: This must come last
    this.express.use(express.static(path.join(__dirname, "../../../app/public")));
  }

}

export default new App().express;
