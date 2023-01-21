const { isInteger } = require("core-js/core/number");
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  user_id: Number,
  name: String,
  group: String,
  location: String,
  start: Date,
  end: Date,
  description: String,
  keywords: [String],
  guestlistNeeded: Boolean,
  guests: [Number],
});

// compile model from schema
module.exports = mongoose.model("event", EventSchema);
