import * as Db from "../db";
import { User } from "../schema/types";

/* Root */

export default {
  user: (args: any) => getUserById(args.id),
};

/* Query */

const getUserById: (id: string) => User =
  (id: string) =>
    Db.getUserById(id, (err: any, user: User) => {
      if (err) {
        throw new Error(err);
      }
      return user;
    });
