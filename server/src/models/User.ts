import * as mongoose from "mongoose";
import { Document, Model, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

// Overwrite mpromises
(mongoose as any).Promise = global.Promise;

// models
import { PlayerStats } from "../schema/types";
import { PlayerStatsSchema } from "./Analytics";

export interface IUserModel extends Document {
  firstName: string;
  lastName: string;
  stats: PlayerStats;
}

export const UserSchema: Schema = new Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  stats: {
    required: true,
    type: PlayerStatsSchema,
  },
});

// Enable pagination
UserSchema.plugin(mongoosePaginate);

// Export model
mongoose.model("User", UserSchema);
export const UserModel: Model<IUserModel> = mongoose.model("User");
