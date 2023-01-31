const mongoose = require("mongoose");

const ClassSettingsSchema = new mongoose.Schema({
  user_id: String,
  max_finals: Number,
  max_units: Number,
  electiveClasses: [String],
  concClasses: [String],
  HASSClasses: [String],
  CIClasses: [String],
  otherClasses: [String],
  completedClasses: [String],
  currentClasses: [String],
});

// compile model from schema
module.exports = mongoose.model("class settings", ClassSettingsSchema);
