const mongoose = require("mongoose");
const cakeSchema = require("mongoose").model("Cake").schema;

cakeSchema.add({ quantity: Number });

const orderSchema = new mongoose.Schema({
  name: String,
  tel: String,
  cake: [cakeSchema],
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
