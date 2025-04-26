var mongoose = require("mongoose");
var User = require("../models/user.model");
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { p_username, p_fullName, p_email, p_phoneNumber, p_password } =
      req.body;
    if (!p_username || !p_email || !p_fullName || !p_password) {
      return res.status(400).json({
        msg: "Chưa đúng định dạng!",
      });
    }

    const checkExistUser = await User.findOne({
      $or: [
        { username: p_username },
        { phoneNumber: p_phoneNumber },
        { email: p_email },
      ],
    });

    if (checkExistUser) {
      return res.status(400).json({
        msg: "Thông tin của bạn đã được đăng kí!",
      });
    }

    const hashedPassword = await bcryptjs.hash(p_password, 10);

    const newUser = new User({
      fullName: p_fullName,
      username: p_username,
      email: p_email,
      phoneNumber: p_phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      msg: "Đăng kí thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { p_username, p_password } = req.body;

    const user = await User.findOne({
      username: p_username,
    });

    if (!user) {
      return res.status(400).json({
        msg: "Tài khoản không tồn tại!",
      });
    }

    const verifyPassword = await bcryptjs.compare(p_password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        msg: "Tài khoản hoặc mật khẩu sai!",
      });
    }

    // tạo token thôgn qua việc mã hoá 1 vài thông tin của user
    const token = jwt.sign(
      {
        userId: user.id,
        fullname: user.fullName,
      },
      //lưu trong file .env , bảo mật tránh lộ thông tin ng dùng
      process.env.SECRET_KEY,
      {
        //hạn token tồn tại trong 1 tháng
        expiresIn: "1y",
      }
    );

    // result = tất cả thông tin - password
    const { password, ...result } = user?._doc;

    return res.status(200).json({
      msg: "Login sucess",
      token,
      user: result,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const updateInfoUser = async (req, res) => {
  try {
    // lấy id từ param "/update/:id"
    const id = req.params.id;
    //Nếu không có id thì sẽ trả về
    if (!id) {
      return res.status(403).json({
        msg: "Không đúng định dạng !",
      });
    }
    //kiểm tra id từ database có bằng id truyền lên hay k
    if (req.body.user._id.toString() !== id) {
      return res.status(403).json({
        msg: "Bạn không có quyền chỉnh sửa!",
      });
    }
    //lấy thông tin mà user muốn sửa
    const { p_fullName, p_emai } = req.body;
    //kiểm tra user
    const user = await User.findById(id);
    if (p_fullName) {
      user.fullName = p_fullName;
    }
    if (p_emai) {
      user.email = p_emai;
    }
    //lưu thông tin vào database
    await user.save();
    return res.status(200).json({
      msg: "Đã cập nhật thông tin!",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      error,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateInfoUser,
};
