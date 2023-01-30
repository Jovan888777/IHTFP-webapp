const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  kerb: String,
  pronouns: String,
  year: Number,
  pic: String,
  primaryMajor: String,
  secondaryMajor: String,
  minorOne: String,
  minorTwo: String,
  concentration: String,
  friends: [String],
  requests: [String],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
