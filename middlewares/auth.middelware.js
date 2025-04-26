const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // lấy token từ phía client gửi lên thông qua authoriazation
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // kiển tra xem có token trong request
    if (!token) {
      return res.status(401).json({
        msg: "Không có quyền truy cập!",
      });
    }
    //decode kiểm tra thông tin trong token gửi lên server
    const decode = jwt.decode(token, process.env.SECRET_KEY);

    // kiểm tra thời hạn token
    if (decode.exp < Date.now() / 1000) {
      return res.status(401).json({
        msg: "Token đã hết hạn!",
      });
    }
    //kiểm tra sự tồn tại của user trong database;
    const user = await User.findById(decode.userId);

    // Nếu không có user trong database thì sẽ huỷ request
    if (!user) {
      return res.status(401).json({
        msg: "User không tồn tại!",
      });
    }
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      error,
    });
  }
};

module.exports = {
  authMiddleware,
};
