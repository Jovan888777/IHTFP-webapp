const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  kerb: String,
  pronouns: String,
  year: Number,
  pic: String,
  primaryMajor: Number,
  secondaryMajor: Number,
  minorOne: Number,
  minorTwo: Number,
  concentration: String,
  friends: [Number],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
