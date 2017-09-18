import * as http from "http";
import * as mongoose from "mongoose";
import * as request from "supertest";

// local
import App from "../../../../src/app";
const server = http.createServer(App);

describe("Query Greeting", () => {
  describe("POST /api/graphql greeting", () => {
    it("should get back fake Greeting for id 123", (done) => {
      const query: string = `
        query {
          greeting(id:"123") {
            description,
            id,
            name
          }
        }
      `;

      const reqBody: object = {
        query,
      };

      const expectedRespose: object = {
        data: {
          greeting: {
            description: null,
            id: "123",
            name: "Hello, world!",
          },
        },
      };

      request(server)
        .post("/api/graphql")
        .set("content-type", "application/x-www-form-urlencoded")
        .send(reqBody)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual(expectedRespose);
          done();
        });
    });
  });
});
