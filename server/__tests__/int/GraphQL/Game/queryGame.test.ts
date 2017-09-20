import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import { graphQL } from "../../../util";

// models
import { GameModel, IGameModel } from "../../../../src/models";
import { Game, User } from "../../../../src/schema/types";

const server: Server = http.createServer(App);
let testGame: Game | null = null;

describe("Query Game", () => {
  beforeEach(() => {
    testGame = graphQL.testGameFactory();
  });

  afterEach((done) => {
    // Clean up the test database
    graphQL.clearDatabase(done);
  });

  it("should get newly created Game by ID", async () => {
    function checkGameById(game: Game): Promise<Game> {
      const query: string = `
        query {
          game(id: "${game.id}") {
            losingTeamScore {
              team {
                defense {
                  firstName
                  id
                  lastName
                }
                id
                offense {
                  firstName
                  id
                  lastName
                }
              }
              value
            }
            id
            winningTeamScore {
              team {
                defense {
                  firstName
                  id
                  lastName
                }
                id
                offense {
                  firstName
                  id
                  lastName
                }
              }
              value
            }
          }
        }`;
      return graphQL.queryGame(server, query);
    }
    // Create a game, then query based on its ID
    const createdGame: Game = await graphQL.createTestGame(testGame);
    testGame.id = createdGame.id;
    await expect(checkGameById(createdGame)).resolves.toEqual(testGame);
  });
});
