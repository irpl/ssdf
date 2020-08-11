const express = require("express");
const multer = require("multer");
const path = require('path');
const router = express.Router();
const Cake = require("../models/Cake");

const storage = multer.diskStorage({
  destination: './static/img/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file type");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }
  cb(null, true);
}
var upload = multer({ storage, fileFilter }).single('image')

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
    cake.color = await req.body.color;
    cake.description = await req.body.description
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
      upload(req, res, async err => {
        if (err instanceof multer.MulterError) {
          console.log(err)
        } else if (err) {
          console.log(err)
        }
        console.log(req.body)
        let newCake = new Cake({
          name: req.body.name,
          price: req.body.price,
          url: req.file.filename,
          color: JSON.parse(req.body.color),
          description: req.body.description,
          variants: req.body.variants
        });
  
        await newCake.save();
        res.json(newCake);
      })     
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
