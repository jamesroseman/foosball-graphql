import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import { graphQL } from "../../../util";

// models
import { IUserModel, UserModel } from "../../../../src/models";
import { User } from "../../../../src/schema/types";

const server: Server = http.createServer(App);
let testUser: User | null = null;

describe("Query User", () => {
  beforeEach(() => {
    testUser = graphQL.testUserFactory();
  });

  // afterEach((done) => {
  //   // Clean up the test database
  //   graphQL.clearDatabase(done);
  // });

  it("should get newly created User by ID", async () => {
    function checkUserById(user: User): Promise<User> {
      const query: string = `
        query {
          user(id: "${user.id}") {
            firstName,
            id,
            lastName
          }
        }`;
      return graphQL.queryUser(server, query);
    }
    // Create a user, then query based on its ID
    const createdUser: User = await graphQL.createTestUser(testUser);
    testUser.id = createdUser.id;
    await expect(checkUserById(createdUser)).resolves.toEqual(testUser);
  });
});
