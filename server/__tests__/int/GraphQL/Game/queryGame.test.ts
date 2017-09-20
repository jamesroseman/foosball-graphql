import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import { graphQL } from "../../../util";

// models
import { Game } from "../../../../src/schema/types";

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
                }
              }
              value
            }
            winningTeamScore {
              team {
                offense {
                  lastName
                }
              }
            }
          }
        }`;
      return graphQL.queryGame(server, query);
    }
    const expectedResponse = {
      losingTeamScore: {
        team: {
          defense: {
            firstName: testGame.losingTeamScore.team.defense.firstName,
          },
        },
        value: testGame.losingTeamScore.value,
      },
      winningTeamScore: {
        team: {
          offense: {
            lastName: testGame.winningTeamScore.team.offense.lastName,
          },
        },
      },
    };
    // Create a game, then query based on its ID
    const createdGame: Game = await graphQL.createTestGame(testGame);
    await expect(checkGameById(createdGame)).resolves.toEqual(expectedResponse);
  });
});
