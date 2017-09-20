import * as Db from "../db";
import { ConnectionArgs, User, UserConnection, UserQueryArgs } from "../schema/types";

/* Root */

export default {
  user: (args: UserQueryArgs) => getUserById(args.id),
  users: (args: ConnectionArgs) => getUsers(args),
};

/* Query */

function getUserById(id: string): Promise<User> {
  return Db.readUserById(id);
}

function getUsers(args: ConnectionArgs): Promise<UserConnection> {
  return Db.readUsers(args);
}
