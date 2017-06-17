import * as path from 'path';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

// schema
import { Schema as GraphQLSchema, Root } from './schema';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    // /api/graphql
    router.post('/api/graphql', graphqlHTTP({
      graphiql: false,
      schema: GraphQLSchema,
      rootValue: Root
    }));
    
    router.get('/api/graphql', graphqlHTTP({
      graphiql: true,
      schema: GraphQLSchema,
      rootValue: Root
    }));

    // Direct traffic to front-end app
    // Note: This must come last
    this.express.use('/', router);
    this.express.use(express.static(path.join(__dirname, './../../app/public')));
  }

}

export default new App().express;
