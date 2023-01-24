const mongoose = require("mongoose");

const ClassSettingsSchema = new mongoose.Schema({
  user_id: String,
  max_finals: Number,
  max_units: Number,
  electiveClasses: [Number],
  concClasses: [Number],
  HASSClasses: [Number],
  CIClasses: [Number],
  otherClasses: [Number],
  completedClasses: [Number],
  currentClasses: [Number],
});

// compile model from schema
module.exports = mongoose.model("class settings", ClassSettingsSchema);
