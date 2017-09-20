import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import * as util from "util";

// local
import { readUserById } from "./User";

// models
import { ITeamModel, TeamModel } from "../models";
import { Game, PlayerStats, Team, User } from "../schema/types";

// Custom error for Team database transactions
function DbTeamError(message: string = "Error in Team Db transaction") {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}
util.inherits(DbTeamError, Error);

// Conversion method between DB model (where IDs are stored) and
// GraphQL type (where objects are returned)
function modelToType(team: ITeamModel): Promise<Team> {
  if (!team) {
    throw new DbTeamError();
  }
  return Promise.all([
    readUserById(team.defenseId),
    readUserById(team.offenseId),
  ]).then((values: User[]) => {
    const defense: User = values[0];
    const offense: User = values[1];
    return {
      defense,
      id: team._id.toString(),
      offense,
      stats: team.stats,
    } as Team;
  });
}
function typeToModel(team: Team): ITeamModel {
  if (!team) {
    throw new DbTeamError();
  }
  return {
    defenseId: team.defense.id,
    offenseId: team.offense.id,
    stats: team.stats,
  } as ITeamModel;
}

export async function createTeam(team: Team): Promise<Team> {
  // If a team already exists with that defense/offense configuration, return it
  const existingTeams: ITeamModel[] =
    await TeamModel.find({ defenseId: team.defense.id, offenseId: team.offense.id });
  if (existingTeams.length > 0) {
    return Promise.resolve(modelToType(existingTeams[0]));
  }
  return TeamModel
    .create(typeToModel(team))
    // We return the GraphQL representation to the client
    .then(modelToType)
    .catch((err: Error) => {
      if (err instanceof DbTeamError) {
        throw new DbTeamError("Unable to create Team");
      }
      throw err;
    });
}

export function readTeamById(id: string): Promise<Team> {
  return TeamModel
    .findById(id)
    .exec()
    .then(modelToType)
    .catch((err: Error) => {
      if (err instanceof DbTeamError) {
        throw new DbTeamError(`Team: ${id} not found`);
      }
      throw err;
    });
}

export async function updateTeamWithGame(id: string, game: Game): Promise<Team> {
  if (game.losingTeamScore.team.id !== id && game.winningTeamScore.team.id !== id) {
    throw new DbTeamError(`Cannot update Team ${id} with unearned Game`);
  }
  const didWin: boolean = game.winningTeamScore.team.id === id;
  const updatedTeam: Team = await readTeamById(id);
  const stats: PlayerStats = updatedTeam.stats;
  stats.alltime.defense.played++;
  stats.alltime.offense.played++;
  stats.alltime.total.played++;
  if (didWin) {
    stats.alltime.defense.won++;
    stats.alltime.offense.won++;
    stats.alltime.total.won++;
  } else {
    stats.alltime.defense.lost++;
    stats.alltime.offense.lost++;
    stats.alltime.total.lost++;
  }
  updatedTeam.stats = stats;
  return await TeamModel
    .findByIdAndUpdate(id, typeToModel(updatedTeam), { new: true })
    .then(modelToType);
}
