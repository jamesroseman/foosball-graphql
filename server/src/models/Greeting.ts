import * as mongoose from "mongoose";
import { Schema } from "mongoose";

const GreetingSchema: Schema = new Schema({
  description: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
});

// Export model
mongoose.model("Greeting", GreetingSchema);
export const GreetingModel = mongoose.model("Greeting");
