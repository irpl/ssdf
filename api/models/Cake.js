const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema({
  name: String,
  price: Number,
  url: String,
  color: {
    hex: String,
    hexa: String,
    isDark: Boolean,
    isLight: Boolean,
    rgb: String,
    rgba: String,
    value: Array
  },
  description: String,
  variants: [
    {
      name: String,
      price: Number,
      url: String,
      color: {
        hex: String,
        hexa: String,
        isDark: Boolean,
        isLight: Boolean,
        rgb: String,
        rgba: String,
        value: Array
      },
      description: String,
      available: { type: Boolean, default: false }
    }
  ],
  available: { type: Boolean, default: false },
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model("Cake", cakeSchema);
