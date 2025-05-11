var express = require("express");
var router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   updateInfoUser,
//   deleteUser,
//   getAllUser
// } = require("../services/user.service");
const { authMiddleware } = require("../middlewares/auth.middelware");

// router.post("/create", async (req, res, next) => registerUser(req, res));

// router.post("/login", async (req, res, next) => loginUser(req, res));

// router.put("/update/:id", authMiddleware, updateInfoUser);

// router.delete("/delete/:id", authMiddleware, deleteUser);

// router.get('/' , getAllUser)

module.exports = router;
