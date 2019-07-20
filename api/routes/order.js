const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.get("/", async (req, res) => {
  let orderDem = await Order.find({});
  res.json(orderDem);
});

router.post("/new", async (req, res) => {
  try {
    let newOrder = new Order({
      name: req.body.name,
      tel: req.body.tel,
      cake: req.body.cake
    });

    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
