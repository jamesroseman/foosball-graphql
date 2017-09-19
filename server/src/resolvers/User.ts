import * as Db from "../db";
import { User } from "../schema/types";

/* Root */

export default {
  user: (args: any) => getUserById(args.id),
};

/* Query */

function getUserById(id: string): Promise<User> {
  return Db.readUserById(id);
}
