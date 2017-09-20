import * as mongoose from "mongoose";
import { Document, Model } from "mongoose";

// local
import { readUserById } from "./User";

// models
import { ITeamModel, TeamModel } from "../models";
import { Team, User } from "../schema/types";

// Conversion method between DB model (where IDs are stored) and
// GraphQL type (where objects are returned)
function modelToType(team: ITeamModel): Promise<Team> {
  return Promise.all([
    readUserById(team.defenseId),
    readUserById(team.offenseId),
  ]).then((values: User[]) => {
    const defense: User = values[0];
    const offense: User = values[1];
    return {
      defense,
      id: team._id.toString(),
      offense,
    } as Team;
  });
}
function typeToModel(team: Team): ITeamModel {
  return {
    defenseId: team.defense.id,
    offenseId: team.offense.id,
  } as ITeamModel;
}

export function createTeam(team: Team): Promise<Team> {
  return TeamModel
    .create(typeToModel(team))
    // We return the GraphQL representation to the client
    .then(modelToType);
}

export function readTeamById(id: string): Promise<Team> {
  return TeamModel
    .findById(id)
    .exec()
    .then(modelToType);
}
