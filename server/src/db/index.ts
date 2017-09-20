import * as mongoose from "mongoose";

export * from "./Game";
export * from "./Team";
export * from "./User";

export const initialize = (dbAddr: string) => {
  mongoose.connect(dbAddr);
};
