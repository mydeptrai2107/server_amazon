const mongoose = require("mongoose");
const Shop = require("../model/shop"); // Đảm bảo đường dẫn đúng với nơi bạn lưu model Shop

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost:27017/ecommer", { // Đổi `your_database_name` thành tên database của bạn
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Dữ liệu shop cần nhập vào
const shops = [
  {
    name: "Shop 1",
    email: "shop1@example.com",
    password: "password1",
    description: "Shop 1 Description",
    type: "admin",
    address: "Address 1",
    phone: "1234567890",
    logo: "logo1.jpg",
  },
  {
    name: "Shop 2",
    email: "shop2@example.com",
    password: "password2",
    description: "Shop 2 Description",
    type: "admin",
    address: "Address 2",
    phone: "1234567891",
    logo: "logo2.jpg",
  },
  {
    name: "Shop 3",
    email: "shop3@example.com",
    password: "password3",
    description: "Shop 3 Description",
    type: "user",
    address: "Address 3",
    phone: "1234567892",
    logo: "logo3.jpg",
  },
  {
    name: "Shop 4",
    email: "shop4@example.com",
    password: "password4",
    description: "Shop 4 Description",
    type: "user",
    address: "Address 4",
    phone: "1234567893",
    logo: "logo4.jpg",
  },
  {
    name: "Shop 5",
    email: "shop5@example.com",
    password: "password5",
    description: "Shop 5 Description",
    type: "user",
    address: "Address 5",
    phone: "1234567894",
    logo: "logo5.jpg",
  },
  {
    name: "Shop 6",
    email: "shop6@example.com",
    password: "password6",
    description: "Shop 6 Description",
    type: "admin",
    address: "Address 6",
    phone: "1234567895",
    logo: "logo6.jpg",
  },
  {
    name: "Shop 7",
    email: "shop7@example.com",
    password: "password7",
    description: "Shop 7 Description",
    type: "admin",
    address: "Address 7",
    phone: "1234567896",
    logo: "logo7.jpg",
  },
  {
    name: "Shop 8",
    email: "shop8@example.com",
    password: "password8",
    description: "Shop 8 Description",
    type: "user",
    address: "Address 8",
    phone: "1234567897",
    logo: "logo8.jpg",
  },
  {
    name: "Shop 9",
    email: "shop9@example.com",
    password: "password9",
    description: "Shop 9 Description",
    type: "user",
    address: "Address 9",
    phone: "1234567898",
    logo: "logo9.jpg",
  },
  {
    name: "Shop 10",
    email: "shop10@example.com",
    password: "password10",
    description: "Shop 10 Description",
    type: "admin",
    address: "Address 10",
    phone: "1234567899",
    logo: "logo10.jpg",
  },
];

// Hàm để thêm 10 shop vào database
const importShops = async () => {
  try {
    await Shop.insertMany(shops);
    console.log("Shops imported successfully!");
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
  } catch (error) {
    console.error("Error importing shops:", error);
  }
};

// Chạy hàm import
importShops();
