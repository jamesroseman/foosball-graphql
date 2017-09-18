import * as mongoose from "mongoose";
export * from "./User";

export const initialize = (dbAddr: string) => {
  mongoose.connect(dbAddr);
};
