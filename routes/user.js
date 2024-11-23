const express = require("express");
const { checkForAuthenticationCookie } = require("../middleware/authentication");
const { signup, login } = require("../controllers/user");

const router = express.Router();

 
router.get("/", (req, res) => {
    res.send("User route is working!");
  });
router.post("/signup", signup);
router.post("/login", login);


module.exports = router;
