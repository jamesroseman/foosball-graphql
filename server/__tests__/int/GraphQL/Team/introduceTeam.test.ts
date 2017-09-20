import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import * as Db from "../../../../src/db";
import { graphQL } from "../../../util";

// models
import { IntroduceTeamPayload, Team } from "../../../../src/schema/types";

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
    function createNewTeam(team: Team): Promise<IntroduceTeamPayload> {
      const mutation: string = `
        mutation ($input: IntroduceTeamInput){
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
            defenseUserId: "59c1d1c116fe341c154ea35d",
            offenseUserId: "59c1d1c116fe341c154ea35d",
          },
        },
      };
      return graphQL.queryQL<IntroduceTeamPayload>(server, mutation, transformResToPayload, vars);
    }
    const expectedPayload = {
      payload: {
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
    expect(createNewTeam(testTeam)).resolves.toEqual(expectedPayload);
  });
});
