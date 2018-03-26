import * as mongoose from "mongoose";
import { Document, Model, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

// Overwrite mpromises
(mongoose as any).Promise = global.Promise;

// models
import { PlayerStats } from "../schema/types";
import { PlayerStatsSchema } from "./Analytics";

export interface ITeamModel extends Document {
  defenseId: string;
  offenseId: string;
  stats: PlayerStats;
}

export const TeamSchema: Schema = new Schema({
  defenseId: {
    required: true,
    type: String,
  },
  offenseId: {
    required: true,
    type: String,
  },
  stats: {
    required: true,
    type: PlayerStatsSchema,
  },
});

// Enable pagination
TeamSchema.plugin(mongoosePaginate);

// Export model
mongoose.model("Team", TeamSchema);
export const TeamModel: Model<ITeamModel> = mongoose.model("Team");
