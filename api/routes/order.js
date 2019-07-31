const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.get("/", async (req, res) => {
  const mon = req.query.mon;
  const fri = req.query.fri;
  try {
    let orderDem = await Order.find({ date: { $gte: mon, $lte: fri } });
    res.json(orderDem);
  } catch (err) {
    console.log(err.message);
  }
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
