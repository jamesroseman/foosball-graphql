import * as mongoose from "mongoose";
import { Document, Model, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

export interface ITeamModel extends Document {
  defenseId: string;
  offenseId: string;
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
});

// Enable pagination
TeamSchema.plugin(mongoosePaginate);

// Export model
mongoose.model("Team", TeamSchema);
export const TeamModel: Model<ITeamModel> = mongoose.model("Team");
