const mongoose = require("mongoose");

const DiningSettingsSchema = new mongoose.Schema({
  user_id: String,
  restrictions: [String],
  chosen: [String],
  rankings: [String],
});

// compile model from schema
module.exports = mongoose.model("dining settings", DiningSettingsSchema);
