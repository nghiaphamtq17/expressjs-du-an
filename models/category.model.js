var mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      max: 50,
      require: true,
    },
    image: {
      type: String,
      require: false,
    },
    description: {
      type: String,
      max: 1000,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", CategorySchema);

// làm api bao gồm: 
// danh sách toàn bộ các mục category
// update date
// delete
// tìm kiếm category theo id
// thêm 1 category mới
