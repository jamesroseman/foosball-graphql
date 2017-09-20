import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";
import * as util from "util";

// models
import { IUserModel, UserModel } from "../models";
import { ConnectionArgs, User, UserConnection, UserEdge } from "../schema/types";

// Custom error for User database transactions
function DbUserError(message: string = "Error in User Db transaction") {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}
util.inherits(DbUserError, Error);

// Conversion method between DB model and GraphQL type
function modelToType(user: IUserModel): User {
  if (!user) {
    throw new DbUserError();
  }
  return {
    firstName: user.firstName,
    id: user._id.toString(),
    lastName: user.lastName,
  } as User;
}
function typeToModel(user: User): IUserModel {
  if (!user) {
    throw new DbUserError();
  }
  return {
    firstName: user.firstName,
    lastName: user.lastName,
  } as IUserModel;
}

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

export async function readUsers(args: ConnectionArgs): Promise<UserConnection> {
  return UserModel
    .find()
    .exec()
    .then((users: IUserModel[]) => {
      return users
        .map(modelToType)
        .map((user: User) => {
          return {
            cursor: user.id,
            node: user,
          } as UserEdge;
        });
    })
    .then((edges: UserEdge[]) => {
      return {
        edges,
      } as UserConnection;
    })
    .catch((err: Error) => {
      if (err instanceof DbUserError) {
        throw new DbUserError(`Users not found`);
      }
      throw err;
    });
}
