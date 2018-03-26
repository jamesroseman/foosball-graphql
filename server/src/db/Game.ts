import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import * as util from "util";

// local
import {
  modelsToEdges,
  readDocsAfterCursor,
  readDocsBeforeCursor,
} from "./connection";
import { readTeamById, updateTeamWithGame } from "./Team";

// models
import { GameModel, IGameModel, TeamModel } from "../models";
import {
  ConnectionArgs,
  Game,
  GameConnection,
  GameEdge,
  Team,
  User,
} from "../schema/types";

// Custom error for Game database transactions
function DbGameError(message: string = "Error in Game Db transaction") {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}
util.inherits(DbGameError, Error);

/* Converters */

function modelToType(game: IGameModel): Promise<Game> {
  if (!game) {
    throw new DbGameError();
  }
  return Promise.all([
    readTeamById(game.losingTeamScore.teamId),
    readTeamById(game.winningTeamScore.teamId),
  ]).then((values: Team[]) => {
    const losingTeam: Team = values[0];
    const winningTeam: Team = values[1];
    return {
      endDate: game.endDate,
      id: game._id.toString(),
      losingTeamScore: {
        team: losingTeam,
        value: game.losingTeamScore.value,
      },
      startDate: game.startDate,
      winningTeamScore: {
        team: winningTeam,
        value: game.winningTeamScore.value,
      },
    } as Game;
  });
}

function typeToModel(game: Game): IGameModel {
  if (!game) {
    throw new DbGameError();
  }
  return {
    endDate: game.endDate,
    losingTeamScore: {
      teamId: game.losingTeamScore.team.id,
      value: game.losingTeamScore.value,
    },
    startDate: game.startDate,
    winningTeamScore: {
      teamId: game.winningTeamScore.team.id,
      value: game.winningTeamScore.value,
    },
  } as IGameModel;
}

/* Operations */

export async function createGame(game: Game): Promise<Game> {
  // We update the team stats for the teams in the game
  await Promise.all([
    readTeamById(game.losingTeamScore.team.id),
    readTeamById(game.winningTeamScore.team.id),
  ]).then(async (teams) => {
    const losingTeam: Team = teams[0];
    const winningTeam: Team = teams[1];
    await updateTeamWithGame(losingTeam.id, game);
    await updateTeamWithGame(winningTeam.id, game);
  });
  return GameModel
    .create(typeToModel(game))
    // We return the GraphQL representation to the client
    .then(modelToType)
    .catch((err: Error) => {
      if (err instanceof DbGameError) {
        throw new DbGameError("Unable to create Game");
      }
      throw err;
    });
}

export function readGameById(id: string): Promise<Game> {
  return GameModel
    .findById(id)
    .exec()
    .then(modelToType)
    .catch((err: Error) => {
      if (err instanceof DbGameError) {
        throw new DbGameError(`Game: ${id} not found`);
      }
      throw err;
    });
}

export function readAllGames(sort: any = {}): Promise<GameConnection> {
  return GameModel
    .find({}, [], { sort })
    .exec()
    .then((dbGames: IGameModel[]) => {
      const edges: GameEdge[] = modelsToEdges<Game>(dbGames, modelToType);
      return { edges } as GameConnection;
    })
    .catch((err: Error) => {
      if (err instanceof DbGameError) {
        throw new DbGameError("Games not found");
      }
      throw err;
    });
}

/* Pagination */

async function indexOfGame(id: string): Promise<number> {
  if (!id) {
    return Promise.resolve(-1);
  }
  return GameModel
    .find({}, [], { sort: { _id: -1 }})
    .then((games: IGameModel[]) => {
      return games.map((game) => game.id);
    })
    .then((gameIds: string[]) => gameIds.indexOf(id));
}

export async function readGames(args: ConnectionArgs): Promise<GameConnection> {
  const sort = { _id: -1 };
  // If there are no arguments, return all Teams
  if (!args.after && !args.before && !args.first && !args.last) {
    return readAllGames(sort);
  }
  // Check that any IDs passed in are valid
  if ((args.before && await indexOfGame(args.before) === -1) ||
      (args.after && await indexOfGame(args.after) === -1)
  ) {
    throw new DbGameError("Game ID is invalid");
  }
  if ((args.first || args.after) && !args.last && !args.before) {
    const gameIndex: number = await indexOfGame(args.after);
    return readDocsAfterCursor<Game>(GameModel, modelToType, sort, args.first, gameIndex);
  }
  if ((args.last || args.before) && !args.first && !args.after) {
    const gameIndex: number = await indexOfGame(args.before);
    return readDocsBeforeCursor<Game>(GameModel, modelToType, sort, args.last, gameIndex);
  }
  throw new DbGameError("Arguments are invalid");
}
