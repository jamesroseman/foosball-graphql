import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import * as Db from "../../../../src/db";
import { graphQL } from "../../../util";

// models
import { IntroduceTeamPayload, Team, User } from "../../../../src/schema/types";

const server: Server = http.createServer(App);
let testTeam: Team | null = null;

describe("Query Team", () => {
  beforeEach(async () => {
    testTeam = graphQL.testTeamFactory();
  });

  afterEach((done) => {
    // Clean up the test database
    graphQL.clearDatabase(done);
  });

  it("should introduce new Team with User IDs", async () => {
    const clientMutationId = "1";
    function transformResToPayload(res: any) {
      return res.introduceTeam as IntroduceTeamPayload;
    }
    function introduceNewTeam(team: Team): Promise<IntroduceTeamPayload> {
      const mutation: string = `
        mutation ($input: IntroduceTeamInput) {
          introduceTeam(input: $input) {
            team {
              defense {
                firstName
              }
              offense {
                firstName
              }
            }
            clientMutationId
          }
        }`;
      const vars: object = {
        input: {
          clientMutationId,
          teamInput: {
            defenseUserId: team.defense.id,
            offenseUserId: team.offense.id,
          },
        },
      };
      return graphQL.queryQL<IntroduceTeamPayload>(server, mutation, transformResToPayload, vars);
    }
    const expectedPayload = {
      payload: {
        clientMutationId,
        team: {
          defense: {
            firstName: testTeam.defense.firstName,
          },
          offense: {
            firstName: testTeam.offense.firstName,
          },
        },
      },
    };
    const offense: User = await graphQL.createTestUser();
    const defense: User = await graphQL.createTestUser();
    testTeam.offense = offense;
    testTeam.defense = defense;
    expect(introduceNewTeam(testTeam)).resolves.toEqual(expectedPayload);
  });
});
