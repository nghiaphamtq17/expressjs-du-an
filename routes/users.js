var express = require("express");
var router = express.Router();
const {
  registerUser,
  loginUser,
  updateInfoUser,
} = require("../services/user.service");
const { authMiddleware } = require("../middlewares/auth.middelware");

// /user/

router.post("/register", async (req, res, next) => registerUser(req, res));

router.post("/login", async (req, res, next) => loginUser(req, res));

router.put("/update/:id", authMiddleware, updateInfoUser);

module.exports = router;
