import { TeamModel } from "../models";
import { Team } from "../schema/types";

export const getTeamById: (id: string, callback: any) => any =
  (id: string, callback: any) =>
    TeamModel.findById(id, (err: any, dbTeam: TeamModel) => {
      if (dbTeam) {
        const team: Team = {
          defense: dbTeam.defense,
          // Mongoose and GraphQL manage ID fields differently
          id: dbTeam._id,
          offense: dbTeam.offense,
        };
        return callback(err, team);
      }
      return callback(err, null);
    });
