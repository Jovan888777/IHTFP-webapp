const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  user_id: String,
  name: String,
  group: String,
  location: String,
  start: Date,
  end: Date,
  description: String,
  keywords: [String],
  guestlistNeeded: Boolean,
  guests: [String],
});

// compile model from schema
module.exports = mongoose.model("event", EventSchema);
