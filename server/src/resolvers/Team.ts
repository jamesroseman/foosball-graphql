import { generateBaseTeam } from "../constants";
import * as Db from "../db";

// models
import {
  ConnectionArgs,
  IntroduceTeamInput,
  IntroduceTeamMutationArgs,
  IntroduceTeamPayload,
  Team,
  TeamConnection,
  TeamQueryArgs,
  User,
} from "../schema/types";

/* Root */

export default {
  introduceTeam: (args: IntroduceTeamMutationArgs) => introduceTeam(args.input),
  team: (args: TeamQueryArgs) => getTeamById(args.id),
  teams: (args: ConnectionArgs) => getTeams(args),
};

/* Query */

function getTeamById(id: string): Promise<Team> {
  return Db.readTeamById(id);
}

function getTeams(args: ConnectionArgs): Promise<TeamConnection> {
  return Db.readTeams(args);
}

/* Mutation */

function introduceTeam(
  input: IntroduceTeamInput,
): Promise<IntroduceTeamPayload> {
  return Promise.all([
    Db.readUserById(input.teamInput.offenseUserId),
    Db.readUserById(input.teamInput.defenseUserId),
  ]).then(async (users) => {
    const offense: User = users[0];
    const defense: User = users[1];
    const team: Team = generateBaseTeam(defense, offense);
    const createdTeam: Team = await Db.createTeam(team);
    return {
      clientMutationId: input.clientMutationId,
      team: createdTeam,
    } as IntroduceTeamPayload;
  });
}
