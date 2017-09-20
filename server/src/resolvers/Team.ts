import * as Db from "../db";
import { Team, TeamQueryArgs } from "../schema/types";

/* Root */

export default {
  team: (args: TeamQueryArgs) => getTeamById(args.id),
};

/* Query */

function getTeamById(id: string): Promise<Team> {
  return Db.readTeamById(id);
}
