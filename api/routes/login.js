const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// router.post("/", (req, res) => {
//   let { user, pass } = req.body;

//   if (user === process.env.USER && pass === process.env.PASS) {
//     res.status(200).send("logged in");
//   }
// });

router.post("/", (req, res) => {
  let { user, pass } = req.body;

  if (user === process.env.USER && pass === process.env.PASS)
    jwt.sign({ user, pass }, "secretkey", { expiresIn: "1h" }, (err, token) => {
      res.json({
        token
      });
    });
  else res.status(401).send("Unauthorized");
});

router.post("/access", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Logged in",
        authData
      });
    }
  });
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = router;
