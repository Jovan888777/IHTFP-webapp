const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  dishName: String,
  dishDesc: String,
  restrictions: [String],
});

const DiningHallSchema = new mongoose.Schema({
  breakfast: [DishSchema],
  lunch: [DishSchema],
  dinner: [DishSchema],
  lateNight: [DishSchema],
});
const MenuSchema = new mongoose.Schema({
  Next: DiningHallSchema,
  Maseeh: DiningHallSchema,
  Simmons: DiningHallSchema,
  McCormmick: DiningHallSchema,
  NewVassar: DiningHallSchema,
  Baker: DiningHallSchema,
});

// compile model from schema
module.exports = mongoose.model("dining", MenuSchema);
