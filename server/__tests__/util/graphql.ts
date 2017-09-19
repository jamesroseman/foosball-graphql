import { Server } from "http";
import * as request from "supertest";

// models
import { User } from "../../src/schema/types";

// Different data interfaces depending on request
interface IDataResponse {
  body: {
    data: object;
  };
}
interface IUserDataResponse {
  user: User;
}

function queryQL(server: Server, query: string, transformRes: any): Promise<object> {
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

// Helper function to query GraphQL server with a User query (and then
// format the response automatically)
export function queryUser(server: Server, query: string): Promise<User> {
  function transformResToUser(res: IUserDataResponse) {
    return res.user as User;
  }
  return queryQL(server, query, transformResToUser);
}
