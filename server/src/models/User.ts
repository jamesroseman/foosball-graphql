import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export const UserSchema: Schema = new Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
});

// Export model
mongoose.model("User", UserSchema);
export const UserModel = mongoose.model("User");
