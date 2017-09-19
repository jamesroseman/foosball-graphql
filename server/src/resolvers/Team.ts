import * as Db from "../db";
import { Team } from "../schema/types";

/* Root */

export default {
  team: (args: any) => getTeamById(args.id),
};

/* Query */

function getTeamById(id: string): Promise<Team> {
  return Db.readTeamById(id);
}
