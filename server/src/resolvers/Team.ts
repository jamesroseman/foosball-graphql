import * as Db from "../db";
import { Team } from "../schema/types";

/* Root */

export default {
  user: (args: any) => getTeamById(args.id),
};

/* Query */

const getTeamById: (id: string) => Team =
  (id: string) =>
    Db.getTeamById(id, (err: any, user: Team) => {
      if (err) {
        throw new Error(err);
      }
      return user;
    });
