import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";

// models
import { IUserModel, UserModel } from "../models";
import { User } from "../schema/types";

// Conversion method between DB model and GraphQL type
function modelToType(team: IUserModel): User {
  return {
    firstName: team.firstName,
    id: team.id,
    lastName: team.lastName,
  } as User;
}

export function createUser(user: IUserModel): Promise<User> {
  return UserModel
    .create(user)
    .then(modelToType);
}

export function readUserById(id: string): Promise<User> {
  return UserModel
    .findById(id)
    .exec()
    .then(modelToType);
}
