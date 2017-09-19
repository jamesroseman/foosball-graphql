import { Server } from "http";
import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
import * as Db from "../../../../src/db";
import { graphQL } from "../../../util";

// models
import { IUserModel, UserModel } from "../../../../src/models";
import { User } from "../../../../src/schema/types";

const server: Server = http.createServer(App);
let testUser: IUserModel | null = null;

describe("Query User", () => {
  beforeEach(() => {
    testUser = {
      firstName: "testFirstName",
      lastName: "testLastName",
    } as IUserModel;
  });

  afterEach((done) => {
    // Clean up the test database
    UserModel.remove({}, done);
  });

  it("should get newly created User by ID", async () => {
    function checkUserById(user: User): Promise<User> {
      const query: string = `
        query {
          user(id: "${user.id}") {
            firstName,
            lastName
          }
        }`;
      return graphQL.queryUser(server, query);
    }
    // Create a user, then query based on its ID
    const createdUser: User = await Db.createUser(testUser);
    await expect(checkUserById(createdUser)).resolves.toEqual(testUser);
  });
});
