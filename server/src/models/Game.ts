import * as mongoose from "mongoose";
import { Document, Model, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

// Overwrite mpromises
(mongoose as any).Promise = global.Promise;

// models
import { Date, Team } from "../schema/types";
import { ITeamModel } from "./Team";

interface ITeamScoreModel {
  teamId: string;
  value: number;
}

export interface IGameModel extends Document {
  losingTeamScore: ITeamScoreModel;
  winningTeamScore: ITeamScoreModel;
  // All dates are recorded in Timestamp
  startDate: string;
  endDate: string;
}

const TeamScoreSchema: Schema = new Schema({
  teamId: {
    required: true,
    type: String,
  },
  value: {
    required: true,
    type: Number,
  },
});

export const GameSchema: Schema = new Schema({
  endDate: {
    required: true,
    type: String,
  },
  losingTeamScore: {
    required: true,
    type: TeamScoreSchema,
  },
  startDate: {
    required: false,
    type: String,
  },
  winningTeamScore: {
    required: true,
    type: TeamScoreSchema,
  },
});

// Enable pagination
GameSchema.plugin(mongoosePaginate);

// Export model
mongoose.model("Game", GameSchema);
export const GameModel: Model<IGameModel> = mongoose.model("Game");
