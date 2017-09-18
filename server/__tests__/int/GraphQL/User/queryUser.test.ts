import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
const server = http.createServer(App);

// models
import { UserModel } from "../../../../src/models";
import { User } from "../../../../src/schema/types";

let testUser: any = {};

describe("Query User by ID", () => {

  beforeEach((done) => {
    testUser = {
      firstName: "testFirstName",
      lastName: "testLastName",
    };
    // UserModel.remove({}, (err) => {
    //   done();
    // });
    done();
  });

  it("should get back newly created User by ID", (done) => {
    // Create user
    UserModel.create(testUser, (dbErr: any, user: any) => {
      if (dbErr) {
        throw new Error(dbErr);
      }
      console.log("queryUser:user", user);
      const testUserId: string = user._id;
      console.log("queryUser:user:id", testUserId);
      const query: string = `
        query {
          user(id: "${testUserId}") {
            firstName,
            lastName
          }
        }`;
      const expectedResponse: object = {
        data: {
          user: {
            firstName: testUser.firstName,
            lastName: testUser.lastName,
          },
        },
      };
      request(server)
        .post("/api/graphql")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ query })
        .end((err: any, res: any) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual(expectedResponse);
          done();
        });
    });
  });
});
