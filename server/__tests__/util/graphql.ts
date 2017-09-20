import { Server } from "http";
import * as request from "supertest";

// local
import * as Db from "../../src/db";
import { basePlayerStats } from "../../src/resolvers/defaults";

// models
import { GameModel, TeamModel, UserModel } from "../../src/models";
import { Game, Team, TeamScore, User } from "../../src/schema/types";

// Different data interfaces depending on request
interface IDataResponse {
  body: {
    errors: any;
    data: object;
  };
}
interface IUserDataResponse {
  user: User;
}
interface ITeamDataResponse {
  team: Team;
}
interface IGameDataResponse {
  game: Game;
}

export function queryQL<T>(
  server: Server,
  query: string,
  transformRes: (res: any) => T,
  variables?: object,
): Promise<T> {
  let body: object = { query };
  if (variables) {
    body = { query, variables };
  }
  return request(server)
    .post("/api/graphql")
    .set("content-type", "application/json")
    .send(body)
    .expect(200)
    .then((res: IDataResponse) => {
      return res.body.data;
    })
    .then(transformRes);
}

// Helper functions to hit GraphQL server with queries (and then
// format the response automatically)
export function queryUser(server: Server, query: string): Promise<User> {
  function transformResToUser(res: IUserDataResponse) {
    return res.user as User;
  }
  return queryQL<User>(server, query, transformResToUser);
}
export function queryTeam(server: Server, query: string): Promise<Team> {
  function transformResToTeam(res: ITeamDataResponse) {
    return res.team as Team;
  }
  return queryQL<Team>(server, query, transformResToTeam);
}
export function queryGame(server: Server, query: string): Promise<Game> {
  function transformResToGame(res: IGameDataResponse) {
    return res.game as Game;
  }
  return queryQL<Game>(server, query, transformResToGame);
}

// Helper function to clean database between each test
export async function clearDatabase(callback?: any): Promise<void> {
  await GameModel.remove({}).exec();
  await UserModel.remove({}).exec();
  await TeamModel.remove({}).exec();
  return await callback();
}

// Helper static object factories to quickly add a User or Team or Game
// We return the model interfaces here because they don't have IDs
const fakeIdToOverwrite: string = "123";
export function testUserFactory(firstName?: string, lastName?: string): User {
  return {
    firstName: firstName || "testFirstName",
    id: fakeIdToOverwrite,
    lastName: lastName || "testLastName",
  } as User;
}
export async function createTestUser(user?: User): Promise<User> {
  if (!user) {
    user = testUserFactory();
  }
  return Db.createUser(user);
}
export function testTeamFactory(offense?: User, defense?: User): Team {
  if (!offense) {
    offense = testUserFactory("testOffenseFirst", "testOffenseLast");
  }
  if (!defense) {
    defense = testUserFactory("testDefenseFirst", "testDefenseLast");
  }
  return {
    defense,
    id: fakeIdToOverwrite,
    offense,
    stats: basePlayerStats,
  } as Team;
}
export async function createTestTeam(team?: Team): Promise<Team> {
  if (!team) {
    team = testTeamFactory();
  }
  // Set offense and defense IDs to valid IDs
  team.defense = await createTestUser(team.defense);
  team.offense = await createTestUser(team.offense);
  return Db.createTeam(team);
}
export function testGameFactory(losingTeamScore?: TeamScore, winningTeamScore?: TeamScore): Game {
  if (!losingTeamScore || !winningTeamScore) {
    // Create teams
    const losingTeam: Team = testTeamFactory();
    const winningTeam: Team = testTeamFactory();
    // Create team scores
    losingTeamScore = {
      team: losingTeam,
      value: 8,
    } as TeamScore;
    winningTeamScore = {
      team: winningTeam,
      value: 10,
    } as TeamScore;
  }
  return {
    id: fakeIdToOverwrite,
    losingTeamScore,
    winningTeamScore,
  } as Game;
}
export async function createTestGame(game?: Game): Promise<Game> {
  if (!game) {
    game = testGameFactory();
  }
  // Set teams to valid teams with existing Users
  game.losingTeamScore.team = await createTestTeam(game.losingTeamScore.team);
  game.winningTeamScore.team = await createTestTeam(game.winningTeamScore.team);
  return Db.createGame(game);
}
