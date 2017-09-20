import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import * as Db from "../../../../src/db";
import { graphQL } from "../../../util";

// models
import { Team } from "../../../../src/schema/types";

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

  it("should get newly created Team by ID", async () => {
    function checkTeamById(team: Team): Promise<Team> {
      const query: string = `
        query {
          team(id: "${team.id}") {
            defense {
              firstName,
              id,
              lastName
            },
            id,
            offense {
              firstName,
              id,
              lastName
            }
          }
        }`;
      return graphQL.queryTeam(server, query);
    }
    // Create team, then query based on its ID
    const createdTeam: Team = await graphQL.createTestTeam(testTeam);
    testTeam.id = createdTeam.id;
    testTeam.defense.id = createdTeam.defense.id;
    testTeam.offense.id = createdTeam.offense.id;
    await expect(checkTeamById(createdTeam)).resolves.toEqual(testTeam);
  });
});
