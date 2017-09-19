import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import * as Db from "../../../../src/db";
import { graphQL } from "../../../util";

// models
import { ITeamModel, IUserModel, TeamModel, UserModel } from "../../../../src/models";
import { Team, User } from "../../../../src/schema/types";

const server: Server = http.createServer(App);
let testOffenseModel: IUserModel | null = null;
let testDefenseModel: IUserModel | null = null;
let testOffense: User | null = null;
let testDefense: User | null = null;
let testTeamModel: ITeamModel | null = null;
let testTeam: Team | null = null;

describe("Query Team", () => {
  beforeEach(async () => {
    // Create test user models
    testOffenseModel = {
      firstName: "offenseFirstName",
      lastName: "offenseLastName",
    } as IUserModel;
    testDefenseModel = {
      firstName: "defenseFirstName",
      lastName: "defenseLastName",
    } as IUserModel;
    // Create test users
    testOffense = await Db.createUser(testOffenseModel);
    testDefense = await Db.createUser(testDefenseModel);
    // Create test team model
    testTeamModel = {
      defenseId: testDefense.id,
      offenseId: testOffense.id,
    } as ITeamModel;
    // Create test team
    testTeam = {
      defense: testDefense,
      offense: testOffense,
    } as Team;
  });

  afterEach((done) => {
    // Clean up the test database
    UserModel.remove({}, () => { return; });
    TeamModel.remove({}, done);
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
            }
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
    const createdTeam: Team = await Db.createTeam(testTeamModel);
    await expect(checkTeamById(createdTeam)).resolves.toEqual(testTeam);
  });
});
