import {
  ConnectionArgs,
  Game,
  GameConnection,
  GameEdge,
  PlayerStats,
  Team,
  TeamScore,
  TeamStats,
  User,
  UserConnection,
} from "../schema/types";
import { seedData } from "./seedData";

import { createGame, readGames } from "./Game";
import { close, initialize } from "./index";
import { createTeam, readTeams } from "./Team";
import { createUser, readUsers } from "./User";

// Constants
const AMOUNT_OF_USERS = 16;
const AMOUNT_OF_TEAMS = 8;
const AMOUNT_OF_GAMES = 200;
const WILL_WRITE_USERS: boolean = false;
const WILL_WRITE_TEAMS: boolean = false;
const WILL_WRITE_GAMES: boolean = false;

// Get the DB address
const dbAddr: string | null = process.env.DB_ADDR;
if (!dbAddr) {
  throw new Error("Application cannot be run without DB_ADDR set.");
} else {
  this.dbAddr = dbAddr;
}

console.log("Seeding DB data to: " + dbAddr);

const getRandomIndex = (len: number) => {
  return Math.floor(Math.random() * len);
};

async function readUsersFromDatabase() {
  return (await (await readUsers({})).edges).map((e) => e.node);
}

// Instantiate new users
const camelize = (toCamelize: string) => {
  return toCamelize.charAt(0) + toCamelize.slice(1).toLowerCase();
};

const defaultAggStats = {
  lost: 0,
  played: 0,
  won: 0,
};

const defaultPlayerStats: PlayerStats = {
  alltime: {
    defense: defaultAggStats,
    offense: defaultAggStats,
    total: defaultAggStats,
  },
} as PlayerStats;

const { firstNames, lastNames } = seedData;
const usersToWrite: User[] = new Array(AMOUNT_OF_USERS)
  .fill(0)
  .map((e) => ({
    firstName: camelize(firstNames[getRandomIndex(firstNames.length)]),
    id: "NA",
    lastName: camelize(lastNames[getRandomIndex(lastNames.length)]),
    stats: defaultPlayerStats,
  } as User));

const defaultTeamStats: TeamStats = {
  alltime: defaultAggStats,
} as TeamStats;

const generateRandomGame = (winningTeam: Team, losingTeam: Team) => {
  const today: Date = new Date();
  const startDate: Date = new Date(Math.random() * today.getTime());
  const endDate: Date = new Date(startDate.setMinutes(startDate.getMinutes() + 10));
  const winningTeamScore: TeamScore = {
    team: winningTeam,
    value: 10,
  } as TeamScore;
  const losingTeamScore: TeamScore = {
    team: losingTeam,
    value: Math.floor(Math.random() * 8),
  } as TeamScore;
  return {
    endDate: endDate.toUTCString(),
    id: "NA",
    losingTeamScore,
    startDate: startDate.toUTCString(),
    winningTeamScore,
  } as Game;
};

// Perform operations on database

async function readFromDatabase(readFn: any) {
  return (await (await readFn({})).edges).map((e: any) => e.node);
}

async function writeToDatabase(writeFn: any, toWrites: any[], shouldWrite: boolean) {
  if (shouldWrite) {
    return toWrites
      .reduce((p, x) => p.then(async (i: any) => await writeFn(x)), Promise.resolve())
      .catch((e: any) => console.error("Failed to write: " + e));
  } else {
    return;
  }
}

async function writeModelsToDb() {
  await initialize(dbAddr);
  // Users
  await writeToDatabase(createUser, usersToWrite, WILL_WRITE_USERS);
  const users: User[] = await readFromDatabase(readUsers);
  console.log(users.length + " users written to DB.");
  // Teams
  const teamsToWrite: Team[] = new Array(AMOUNT_OF_TEAMS)
    .fill(0)
    .map((e) => ({
      defense: users[getRandomIndex(users.length)],
      id: "NA",
      offense: users[getRandomIndex(users.length)],
      stats: defaultTeamStats,
    } as Team));
  await writeToDatabase(createTeam, teamsToWrite, WILL_WRITE_TEAMS);
  const teams: Team[] = await readFromDatabase(readTeams);
  console.log(teams.length + " teams written to DB.");
  // Games
  const gamesToWrite: Game[] = new Array(AMOUNT_OF_GAMES)
    .fill(0)
    .map((e) => generateRandomGame(teams[getRandomIndex(teams.length)], teams[getRandomIndex(teams.length)]));
  await writeToDatabase(createGame, gamesToWrite, WILL_WRITE_GAMES);
  const games: Game[] = await readFromDatabase(readGames);
  console.log(games.length + " games written to DB.");
  close();
}

writeModelsToDb();