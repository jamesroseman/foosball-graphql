import { UserModel } from "../models";
import { User } from "../schema/types";

export const getUserById: (id: string, callback: any) => any =
  (id: string, callback: any) => {
    return UserModel.findById(id, (err: any, dbUser: UserModel) => {
      if (dbUser) {
        const user: User = {
          firstName: dbUser.firstName,
          // Mongoose and GraphQL manage ID fields differently
          id: dbUser._id,
          lastName: dbUser.lastName,
        };
        return callback(err, user);
      }
      return callback(err, null);
    });
  };
