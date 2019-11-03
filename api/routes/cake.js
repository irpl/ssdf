const express = require("express");
const router = express.Router();

const Cake = require("../models/Cake");

router.get("/", async (req, res) => {
  let cakeDem = await Cake.find({});
  res.json(cakeDem);
});

router.get("/available", async (req, res) => {
  let cakeDem = await Cake.find({ available: true });
  res.json(cakeDem);
});

router.patch("/:id", async (req, res) => {
  let cake = await Cake.findById(req.params.id);
  try {
    cake.name = await req.body.name;
    cake.price = await req.body.price;
    cake.available = await req.body.available;
    cake.url = await req.body.url;
    await cake.save();
    res.json({
      data: cake,
      message: "success"
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

router.post("/", async (req, res) => {
  let cake = await Cake.findOne({ name: req.body.name });

  if (cake) res.json(cake);
  else {
    try {
      let newCake = new Cake({
        name: req.body.name,
        price: req.body.price,
        url: req.body.url
      });

      await newCake.save();
      res.json(newCake);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let cake = await Cake.findByIdAndDelete(req.params.id);
    if (cake) {
      res.json(cake);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

module.exports = router;
