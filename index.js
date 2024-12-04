const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, '..', 'config.env') });

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const offersRouter = require('./routes/offers');
const voucherRoute = require('./routes/voucher');
const shopRoute = require('./routes/shop');

const app = express();
const PORT = 3000;
const DB = `mongodb://localhost:27017/ecommer`;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Kích hoạt CORS với cấu hình cụ thể
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(offersRouter);
app.use(voucherRoute);
app.use(shopRoute);

mongoose.connect(DB).then(() => {
    console.log('Mongoose Connected!');
}).catch((e) => {
    console.log(e);
});

app.get("/flutterzon", (req, res) => {
    res.send("Welcome to Flutterzon!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected at PORT : ${PORT}`);
});

module.exports = app;
