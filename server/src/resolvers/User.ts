import * as Db from "../db";
import { User, UserQueryArgs } from "../schema/types";

/* Root */

export default {
  user: (args: UserQueryArgs) => getUserById(args.id),
};

/* Query */

function getUserById(id: string): Promise<User> {
  return Db.readUserById(id);
}
