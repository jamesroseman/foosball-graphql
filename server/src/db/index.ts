import * as mongoose from "mongoose";

interface IDb {
  initialize(dbAddr: string): void;
}

export default class Db implements IDb {
  // Initialize the database
  public initialize(dbAddr: string): void {
    mongoose.connect(dbAddr);
  }
}
