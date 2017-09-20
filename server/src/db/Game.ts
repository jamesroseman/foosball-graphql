import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import * as util from "util";

// local
import { readTeamById } from "./Team";

// models
import { GameModel, IGameModel } from "../models";
import { Game, Team, User } from "../schema/types";

// Custom error for Game database transactions
function DbGameError(message: string = "Error in Game Db transaction") {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}
util.inherits(DbGameError, Error);

// Conversion method between DB model and GraphQL type
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
      id: game._id.toString(),
      losingTeamScore: {
        team: losingTeam,
        value: game.losingTeamScore.value,
      },
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
    losingTeamScore: {
      teamId: game.losingTeamScore.team.id,
      value: game.losingTeamScore.value,
    },
    winningTeamScore: {
      teamId: game.winningTeamScore.team.id,
      value: game.winningTeamScore.value,
    },
  } as IGameModel;
}

export function createGame(game: Game): Promise<Game> {
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
