const mongoose = require("mongoose");

const EventSettingsSchema = new mongoose.Schema({
  user_id: String,
  allowEmails: Boolean,
  keywords: [String],
});

// compile model from schema
module.exports = mongoose.model("event settings", EventSettingsSchema);
