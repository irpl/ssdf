const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());

// Connect to database
mongoose
  .connect(process.env.SSDF_MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

app.use(express.json({ extented: false }));

// Define Routes
app.use("/cake", require("./routes/cake"));
app.use("/order", require("./routes/order"));
app.use("/login", require("./routes/login"));

// export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
