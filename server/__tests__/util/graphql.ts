import { Server } from "http";
import * as request from "supertest";

// models
import { ITeamModel } from "../../src/models";
import { Team, User } from "../../src/schema/types";

// Different data interfaces depending on request
interface IDataResponse {
  body: {
    data: object;
  };
}
interface ITeamDataResponse {
  team: Team;
}
interface IUserDataResponse {
  user: User;
}

function queryQL(server: Server, query: string, transformRes: any): Promise<any> {
  return request(server)
    .post("/api/graphql")
    .set("content-type", "application/x-www-form-urlencoded")
    .send({ query })
    .expect(200)
    .then((res: IDataResponse) => {
      return res.body.data;
    })
    .then(transformRes);
}

// Helper functions to query GraphQL server with queries (and then
// format the response automatically)
export function queryUser(server: Server, query: string): Promise<User> {
  function transformResToUser(res: IUserDataResponse) {
    return res.user as User;
  }
  return queryQL(server, query, transformResToUser);
}
export function queryTeam(server: Server, query: string): Promise<Team> {
  function transformResToTeam(res: ITeamDataResponse) {
    return res.team as Team;
  }
  return queryQL(server, query, transformResToTeam);
}
