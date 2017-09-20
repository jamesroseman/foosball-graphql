import { Server } from "http";
import * as request from "supertest";

// local
import * as Db from "../../src/db";

// models
import { GameModel, TeamModel, UserModel } from "../../src/models";
import { Game, Team, TeamScore, User } from "../../src/schema/types";

// Different data interfaces depending on request
interface IDataResponse {
  body: {
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

function queryQL(server: Server, query: string, transformRes: any): Promise<any> {
  return request(server)
    .post("/api/graphql")
    .set("content-type", "application/x-www-form-urlencoded")
    .send({ query })
    .expect(200)
    .then((res: IDataResponse) => {
      return res.body.data;
    })
    .then(transformRes);
}

// Helper functions to query GraphQL server with queries (and then
// format the response automatically)
export function queryUser(server: Server, query: string): Promise<User> {
  function transformResToUser(res: IUserDataResponse) {
    return res.user as User;
  }
  return queryQL(server, query, transformResToUser);
}
export function queryTeam(server: Server, query: string): Promise<Team> {
  function transformResToTeam(res: ITeamDataResponse) {
    return res.team as Team;
  }
  return queryQL(server, query, transformResToTeam);
}
export function queryGame(server: Server, query: string): Promise<Game> {
  function transformResToGame(res: IGameDataResponse) {
    return res.game as Game;
  }
  return queryQL(server, query, transformResToGame);
}

// Helper function to clean database between each test
export async function clearDatabase(callback?: any): void {
  await GameModel.remove({}).exec();
  await UserModel.remove({}).exec();
  await TeamModel.remove({}).exec();
  return callback();
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
  } as Team;
}
export async function createTestTeam(team?: Team): Promise<Team> {
  if (!team) {
    team = testTeamFactory();
  }
  // Create users, then the team itself
  const defense = await Db.createUser(team.defense);
  const offense = await Db.createUser(team.offense);
  // Set offense and defense IDs to valid IDs
  team.defense.id = defense.id;
  team.offense.id = offense.id;
  return Db.createTeam(team);
}
export function testGameFactory(losingTeamScore?: TeamScore, winningTeamScore?: TeamScore): Game {
  if (!losingTeamScore || !winningTeamScore) {
    // Create users
    const losingOffenseUser: User = testUserFactory("testLosingOffenseFirst", "testLosingOffenseLast");
    const losingDefenseUser: User = testUserFactory("testLosingDefenseFirst", "testLosingDefenseLast");
    const winningOffenseUser: User = testUserFactory("testWinningOffenseFirst", "testWinningOffenseLast");
    const winningDefenseUser: User = testUserFactory("testWinningDefenseFirst", "testWinningDefenseLast");
    // Create teams
    const losingTeam: Team = testTeamFactory(losingOffenseUser, losingDefenseUser);
    const winningTeam: Team = testTeamFactory(winningOffenseUser, winningDefenseUser);
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
  // Create teams, then the game itself
  const losingTeam: Team = await createTestTeam(game.losingTeamScore.team);
  const winningTeam: Team = await createTestTeam(game.winningTeamScore.team);
  // Set teams to valid teams with existing Users
  game.losingTeamScore.team = losingTeam;
  game.winningTeamScore.team = winningTeam;
  return Db.createGame(game);
}
