/* tslint:disable */
import { mockServer } from "graphql-tools";
import schema from "../../../../../dist/schema/schema.graphql";

const myMockServer = mockServer(schema);
/* tslint:enable */

describe("User model", () => {
  it("should add 1 + 1", () => {
    expect(1 + 1).toBe(2);
  });
});
