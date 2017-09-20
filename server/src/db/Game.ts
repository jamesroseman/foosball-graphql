import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";

// local
import { readTeamById } from "./Team";

// models
import { GameModel, IGameModel } from "../models";
import { Game, Team, User } from "../schema/types";

// Conversion method between DB model and GraphQL type
function modelToType(game: IGameModel): Promise<Game> {
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
    .then(modelToType);
}

export function readGameById(id: string): Promise<Game> {
  return GameModel
    .findById(id)
    .exec()
    .then(modelToType);
}
