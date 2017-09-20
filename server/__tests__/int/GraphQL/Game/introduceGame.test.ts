import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import { graphQL } from "../../../util";

// models
import { UserModel } from "../../../../src/models";
import { Game, IntroduceGamePayload, Team } from "../../../../src/schema/types";

const server: Server = http.createServer(App);
let testGame: Game | null = null;

describe("Query Game", () => {
  beforeEach(() => {
    testGame = graphQL.testGameFactory();
  });

  afterEach((done) => {
    // Clean up the test database
    // graphQL.clearDatabase(done);
    done();
  });

  it("should introduce new Game with Team IDs", async () => {
    const clientMutationId = "1";
    function transformResToPayload(res: any) {
      return res.introduceGame as IntroduceGamePayload;
    }
    function introduceNewGame(game: Game): Promise<IntroduceGamePayload> {
      const mutation: string = `
        mutation ($input: IntroduceGameInput) {
          introduceGame(input: $input) {
            game {
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
                value
              }
            }
            clientMutationId
          }
        }`;
      const vars: object = {
        input: {
          clientMutationId,
          gameInput: {
            losingTeamId: game.losingTeamScore.team.id,
            losingTeamPoints: game.losingTeamScore.value,
            winningTeamId: game.winningTeamScore.team.id,
            winningTeamPoints: game.winningTeamScore.value,
          },
        },
      };
      return graphQL.queryQL<IntroduceGamePayload>(server, mutation, transformResToPayload, vars);
    }
    const expectedPayload = {
      payload: {
        clientMutationId,
        game: {
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
            value: testGame.winningTeamScore.value,
          },
        },
      },
    };
    const losingTeam: Team = await graphQL.createTestTeam();
    const winningTeam: Team = await graphQL.createTestTeam();
    testGame.losingTeamScore.team = losingTeam;
    testGame.winningTeamScore.team = winningTeam;
    expect(introduceNewGame(testGame)).resolves.toEqual(expectedPayload);
  });
});
