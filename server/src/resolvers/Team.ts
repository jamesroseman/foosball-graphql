import * as Db from "../db";
import { basePlayerStats } from "./defaults";

// models
import {
  IntroduceTeamInput,
  IntroduceTeamMutationArgs,
  IntroduceTeamPayload,
  Team,
  TeamQueryArgs,
  User,
} from "../schema/types";

/* Root */

export default {
  introduceTeam: (args: IntroduceTeamMutationArgs) => introduceTeam(args.input),
  team: (args: TeamQueryArgs) => getTeamById(args.id),
};

/* Query */

function getTeamById(id: string): Promise<Team> {
  return Db.readTeamById(id);
}

/* Mutation */

function introduceTeam(input: IntroduceTeamInput): Promise<IntroduceTeamPayload> {
  return Promise.all([
    Db.readUserById(input.teamInput.offenseUserId),
    Db.readUserById(input.teamInput.defenseUserId),
  ]).then(async (users) => {
    const offenseUser: User = users[0];
    const defenseUser: User = users[1];
    const team: Team = {
      defense: defenseUser,
      offense: offenseUser,
      stats: basePlayerStats,
    } as Team;
    const createdTeam: Team = await Db.createTeam(team);
    return {
      clientMutationId: input.clientMutationId,
      team: createdTeam,
    } as IntroduceTeamPayload;
  });
}
