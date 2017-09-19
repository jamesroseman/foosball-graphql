import * as mongoose from "mongoose";
import { Document, Schema } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate";

// models
import { UserSchema } from "./User";

export const TeamSchema: Schema = new Schema({
  defense: {
    required: true,
    type: UserSchema,
  },
  offense: {
    required: true,
    type: UserSchema,
  },
});

// Enable pagination
TeamSchema.plugin(mongoosePaginate);

// Export model
mongoose.model("Team", TeamSchema);
export const TeamModel = mongoose.model("Team");
