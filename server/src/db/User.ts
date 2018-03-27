import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import * as connectionFromMongoCursor from "relay-mongodb-connection";
import { quality, rate, Rating } from "ts-trueskill";
import * as util from "util";

// local
import {
  modelsToEdges,
  readDocsAfterCursor,
  readDocsBeforeCursor,
} from "./connection";

// models
import { IUserModel, UserModel } from "../models";
import {
  ConnectionArgs,
  Game,
  PageInfo,
  PlayerStats,
  User,
  UserConnection,
  UserEdge,
} from "../schema/types";

// Custom error for User database transactions
function DbUserError(message: string = "Error in User Db transaction") {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}
util.inherits(DbUserError, Error);

/* Converters */

function modelToType(user: IUserModel): Promise<User> {
  if (!user) {
    throw new DbUserError();
  }
  return Promise.resolve({
    firstName: user.firstName,
    id: user._id.toString(),
    lastName: user.lastName,
    stats: user.stats,
  } as User);
}

function typeToModel(user: User): IUserModel {
  if (!user) {
    throw new DbUserError();
  }
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    stats: user.stats,
  } as IUserModel;
}

/* Operations */

export async function createUser(user: User): Promise<User> {
  return UserModel
    .create(typeToModel(user))
    // We return the GraphQL representation to the client
    .then(modelToType)
    .catch((err: Error) => {
      if (err instanceof DbUserError) {
        throw new DbUserError("Unable to create User");
      }
      throw err;
    });
}

export async function readUserById(id: string): Promise<User> {
  return UserModel
    .findById(id)
    .exec()
    .then(modelToType)
    .catch((err: Error) => {
      if (err instanceof DbUserError) {
        throw new DbUserError(`User: ${id} not found`);
      }
      throw err;
    });
}

export async function readAllUsers(sort: any = {}): Promise<UserConnection> {
  return UserModel
    .find({}, [], { sort })
    .exec()
    .then((dbUsers: IUserModel[]) => {
      const edges: UserEdge[] = modelsToEdges<User>(dbUsers, modelToType);
      return { edges } as UserConnection;
    })
    .catch((err: Error) => {
      if (err instanceof DbUserError) {
        throw new DbUserError("Users not found");
      }
      throw err;
    });
}

export async function updateUserWithGame(id: string, game: Game): Promise<User> {
  if (
    game.losingTeamScore.team.offense.id !== id &&
    game.losingTeamScore.team.defense.id !== id &&
    game.winningTeamScore.team.offense.id !== id &&
    game.winningTeamScore.team.defense.id !== id
  ) {
    throw new DbUserError(`Cannot update User ${id} with unearned Game`);
  }
  const isOffense: boolean =
    game.winningTeamScore.team.offense.id === id ||
    game.losingTeamScore.team.defense.id === id;
  const didWin: boolean =
    game.winningTeamScore.team.offense.id === id ||
    game.winningTeamScore.team.defense.id === id;
  const updatedUser: User = await readUserById(id);
  const stats: PlayerStats = updatedUser.stats;
  // Update count stats
  stats.alltime.total.played++;
  if (isOffense) {
    stats.alltime.offense.played++;
  } else {
    stats.alltime.defense.played++;
  }
  if (didWin) {
    stats.alltime.total.wins++;
    if (isOffense) {
      stats.alltime.offense.wins++;
    } else {
      stats.alltime.defense.wins++;
    }
  } else {
    stats.alltime.total.losses++;
    if (isOffense) {
      stats.alltime.offense.losses++;
    } else {
      stats.alltime.defense.losses++;
    }
  }
  // Update computed stats
  const defStats = stats.alltime.defense;
  stats.alltime.defense.winPercentage = defStats.wins / defStats.played;
  stats.alltime.defense.lossPercentage = defStats.losses / defStats.played;
  const offStats = stats.alltime.offense;
  stats.alltime.offense.winPercentage = offStats.wins / offStats.played;
  stats.alltime.offense.lossPercentage = offStats.losses / offStats.played;
  const totStats = stats.alltime.total;
  stats.alltime.total.winPercentage = totStats.wins / totStats.played;
  stats.alltime.total.lossPercentage = totStats.losses / totStats.played;
  // TrueSkill computations
  const ratingToTsRating = (rating: any) => {
    return new Rating(rating.mu, rating.sigma);
  };
  // Compute new positional rankings
  const offWinOffRating = ratingToTsRating(
    game.winningTeamScore.team.offense.stats.alltime.offense.rating,
  );
  const offLosOffRating = ratingToTsRating(
    game.losingTeamScore.team.offense.stats.alltime.offense.rating,
  );
  const defWinDefRating = ratingToTsRating(
    game.winningTeamScore.team.defense.stats.alltime.defense.rating,
  );
  const defLosDefRating = ratingToTsRating(
    game.losingTeamScore.team.defense.stats.alltime.defense.rating,
  );
  const winningTeamPosRating = [offWinOffRating, defWinDefRating];
  const losingTeamPosRating = [offLosOffRating, defLosDefRating];
  const [
    [updatedOffWinOffRating, updatedDefWinDefRating],
    [updatedOffLosOffRating, updatedDefLosDefRating],
  ] = rate([winningTeamPosRating, losingTeamPosRating]);
  // Compute new absolute rankings
  const offWinTotRating = ratingToTsRating(
    game.winningTeamScore.team.offense.stats.alltime.total.rating,
  );
  const offLosTotRating = ratingToTsRating(
    game.losingTeamScore.team.offense.stats.alltime.total.rating,
  );
  const defWinTotRating = ratingToTsRating(
    game.winningTeamScore.team.defense.stats.alltime.total.rating,
  );
  const defLosTotRating = ratingToTsRating(
    game.losingTeamScore.team.defense.stats.alltime.total.rating,
  );
  const winningTeamRating = [offWinOffRating, defWinDefRating];
  const losingTeamRating = [offLosOffRating, defLosDefRating];
  const [
    [updatedOffWinTotRating, updatedDefWinTotRating],
    [updatedOffLosTotRating, updatedDefLosTotRating],
  ] = rate([winningTeamRating, losingTeamRating]);
  // Update stats object
  if (isOffense && didWin) {
    stats.alltime.offense.rating = {
      mu: updatedOffWinOffRating.mu,
      sigma: updatedOffWinOffRating.sigma,
    };
    stats.alltime.total.rating = {
      mu: updatedOffWinTotRating.mu,
      sigma: updatedOffWinTotRating.sigma,
    };
  } else if (isOffense) {
    stats.alltime.offense.rating = {
      mu: updatedOffLosOffRating.mu,
      sigma: updatedOffLosOffRating.sigma,
    };
    stats.alltime.total.rating = {
      mu: updatedOffLosTotRating.mu,
      sigma: updatedOffLosTotRating.sigma,
    };
  } else if (didWin) {
    stats.alltime.defense.rating = {
      mu: updatedDefWinDefRating.mu,
      sigma: updatedDefWinDefRating.sigma,
    };
    stats.alltime.total.rating = {
      mu: updatedDefWinTotRating.mu,
      sigma: updatedDefWinTotRating.sigma,
    };
  } else {
    stats.alltime.defense.rating = {
      mu: updatedDefLosDefRating.mu,
      sigma: updatedDefLosDefRating.sigma,
    };
    stats.alltime.total.rating = {
      mu: updatedDefLosTotRating.mu,
      sigma: updatedDefLosTotRating.sigma,
    };
  }
  updatedUser.stats = stats;
  return await UserModel
    .findByIdAndUpdate(id, typeToModel(updatedUser), { new: true })
    .then(modelToType);
}

/* Pagination */

async function indexOfUser(id: string): Promise<number> {
  if (!id) {
    return Promise.resolve(-1);
  }
  return UserModel
    .find({}, [], { sort: { _id: -1 }})
    .then((users: IUserModel[]) => {
      return users.map((user) => user.id);
    })
    .then((userIds: string[]) => userIds.indexOf(id));
}

export async function readUsers(args: ConnectionArgs): Promise<UserConnection> {
  const sort = { _id: -1 };
  // If there are no arguments, return all Users
  if (!args.after && !args.before && !args.first && !args.last) {
    return readAllUsers(sort);
  }
  // Check that any IDs passed in are valid
  if ((args.before && await indexOfUser(args.before) === -1) ||
      (args.after && await indexOfUser(args.after) === -1)
  ) {
    throw new DbUserError("User ID is invalid");
  }
  if ((args.first || args.after) && !args.last && !args.before) {
    const userIndex: number = await indexOfUser(args.after);
    return readDocsAfterCursor<User>(UserModel, modelToType, sort, args.first, userIndex);
  }
  if ((args.last || args.before) && !args.first && !args.after) {
    const userIndex: number = await indexOfUser(args.before);
    return readDocsBeforeCursor<User>(UserModel, modelToType, sort, args.last, userIndex);
  }
  throw new DbUserError("Arguments are invalid");
}
