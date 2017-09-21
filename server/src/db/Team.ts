import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import * as util from "util";

// local
import {
  modelsToEdges,
  readDocsAfterCursor,
  readDocsBeforeCursor,
} from "./connection";
import { readUserById } from "./User";

// models
import { ITeamModel, TeamModel } from "../models";
import {
  ConnectionArgs,
  Game,
  PageInfo,
  PlayerStats,
  Team,
  TeamConnection,
  TeamEdge,
  User,
} from "../schema/types";

// Custom error for Team database transactions
function DbTeamError(message: string = "Error in Team Db transaction") {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}
util.inherits(DbTeamError, Error);

/* Converters */

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

/* Operations */

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

export function readAllTeams(): Promise<TeamConnection> {
  return TeamModel
    .find()
    .exec()
    .then((dbTeams: ITeamModel[]) => {
      const edges: TeamEdge[] = modelsToEdges<Team>(dbTeams, modelToType);
      return { edges } as TeamConnection;
    })
    .catch((err: Error) => {
      if (err instanceof DbTeamError) {
        throw new DbTeamError("Teams not found");
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

/* Pagination */

async function indexOfTeam(id: string): Promise<number> {
  if (!id) {
    return Promise.resolve(-1);
  }
  return TeamModel
    .find({}, [], { sort: { _id: -1 }})
    .then((teams: ITeamModel[]) => {
      return teams.map((team) => team.id);
    })
    .then((teamIds: string[]) => teamIds.indexOf(id));
}

export async function readTeams(args: ConnectionArgs): Promise<TeamConnection> {
  const sort = { _id: -1 };
  // If there are no arguments, return all Teams
  if (!args.after && !args.before && !args.first && !args.last) {
    return readAllTeams();
  }
  // Check that any IDs passed in are valid
  if ((args.before && await indexOfTeam(args.before) === -1) ||
      (args.after && await indexOfTeam(args.after) === -1)
  ) {
    throw new DbTeamError("Team ID is invalid");
  }
  if ((args.first || args.after) && !args.last && !args.before) {
    const teamIndex: number = await indexOfTeam(args.after);
    return readDocsAfterCursor<Team>(TeamModel, modelToType, sort, args.first, teamIndex);
  }
  if ((args.last || args.before) && !args.first && !args.after) {
    const teamIndex: number = await indexOfTeam(args.before);
    return readDocsBeforeCursor<Team>(TeamModel, modelToType, sort, args.last, teamIndex);
  }
  throw new DbTeamError("Arguments are invalid");
}
