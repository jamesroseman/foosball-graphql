import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";

// models
import { IUserModel, UserModel } from "../models";
import { User } from "../schema/types";

export function createUser(user: IUserModel): Promise<User> {
  return UserModel
    .create(user)
    .then((dbUser: IUserModel) => {
      return {
        firstName: dbUser.firstName,
        id: dbUser.id,
        lastName: dbUser.lastName,
      } as User;
    });
}

export function readUserById(id: string): Promise<User> {
  return UserModel
    .findById(id)
    .exec()
    .then((dbUser: IUserModel) => {
      return {
        firstName: dbUser.firstName,
        id: dbUser.id,
        lastName: dbUser.lastName,
      } as User;
    });
}
