const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  url: String,
  available: { type: Boolean, default: false },
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model("Cake", cakeSchema);
