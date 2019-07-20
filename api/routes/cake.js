const express = require('express');
const router = express.Router();

const Cake = require('../models/Cake');

router.get('/', async (req, res) => {
  let cakeDem = await Cake.find({});
  res.json(cakeDem);
})

router.post('/new', async (req, res) => {
  let cake = await Cake.findOne({ name: req.body.name })
  
  if ( cake )
    res.json(cake)
  else {
    try {
      let newCake = new Cake({
        name: req.body.name,
        price: req.body.price,
        url: req.body.url
      });
    
      await newCake.save();
      res.json(newCake)
    }
    catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  }
})

module.exports = router;