import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";

// models
import { IUserModel, UserModel } from "../models";
import { User } from "../schema/types";

// Conversion method between DB model and GraphQL type
function modelToType(user: IUserModel): User {
  return {
    firstName: user.firstName,
    id: user._id.toString(),
    lastName: user.lastName,
  } as User;
}
function typeToModel(user: User): IUserModel {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
  } as IUserModel;
}

export function createUser(user: User): Promise<User> {
  return UserModel
    .create(typeToModel(user))
    // We return the GraphQL representation to the client
    .then(modelToType);
}

export function readUserById(id: string): Promise<User> {
  return UserModel
    .findById(id)
    .exec()
    .then(modelToType);
}
