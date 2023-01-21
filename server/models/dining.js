//const { isInteger } = require("core-js/core/number");
const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  dishName: String,
  restrictions: [String],
});
const DiningSchema = new mongoose.Schema({
  name: String,
  breakfast: [MenuSchema],
  lunch: [MenuSchema],
  dinner: [MenuSchema],
});

// compile model from schema
module.exports = mongoose.model("dining", DiningSchema);
