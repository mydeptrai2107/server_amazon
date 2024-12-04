const express = require("express");
const Shop = require("../model/shop");
const bcrypt = require("bcryptjs");
const admin = require("../middlewares/admin");
const supadmin  = require("../middlewares/supadmin");
const shopRouter = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");

// Đăng ký shop (chỉ tên, email, password)
shopRouter.post("/shop/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra xem email đã được sử dụng chưa
        const existingShop = await Shop.findOne({ email });
        if (existingShop) {
            return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo shop mới
        const shop = new Shop({
            name,
            email,
            password: hashedPassword,
        });

        await shop.save();

        res.status(201).json({
            message: "Đăng ký shop thành công!",
            shop: {
                id: shop._id,
                name: shop.name,
                email: shop.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
});

shopRouter.patch("/shop/update", admin, async (req, res) => {
    try {
        const { description, address, phone, logo } = req.body;
        const shopId = req.shopId; // Lấy shopId từ middleware auth
        console.log(shopId)
        // Kiểm tra nếu shop tồn tại
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: "Shop không tồn tại!" });
        }

        // Cập nhật thông tin
        if (description) shop.description = description;
        if (address) shop.address = address;
        if (phone) shop.phone = phone;
        if (logo) shop.logo = logo;

        await shop.save();

        res.status(200).json({
            message: "Cập nhật thông tin shop thành công!",
            shop,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
});

shopRouter.get("/api/shop/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm shop theo ID
        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json({ error: "Shop not found!" });
        }

        // Trả về thông tin shop
        res.json(shop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

shopRouter.get("/api/shop", admin, async (req, res) => {
    try {
        // Lấy shopId từ middleware auth
        const shopId = req.shopId;
        console.log(shopId)

        if (!shopId) {
            return res.status(400).json({ error: "Shop ID not found in token" });
        }

        // Tìm shop theo shopId
        const shop = await Shop.findById(shopId).select("-password"); // Loại bỏ trường password khi trả về

        if (!shop) {
            return res.status(404).json({ error: "Shop not found" });
        }

        // Trả về thông tin shop
        res.json(shop);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Sign in Route
shopRouter.post('/supadmin/signin', async (req, res ) => {
    try {
        let {email, password} = req.body;

        email = email.toLowerCase();

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg : "User does not exist!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg : "Incorrect password!"})
        }
        
        const token = jwt.sign({id: user._id, type : "supadmin"}, "passwordKey");
        res.json({token, ...user._doc});



    } catch (e) {
        res.status(500).json({msg: e.message});
    }
})

// Lấy danh sách tất cả các shop (chỉ dành cho supadmin)
shopRouter.get("/supadmin/shop/all", supadmin, async (req, res) => {
    try {
        // Lấy danh sách tất cả các shop
        const shops = await Shop.find().select("-password"); // Loại bỏ trường password

        if (!shops || shops.length === 0) {
            return res.status(404).json({ message: "No shops found!" });
        }

        // Trả về danh sách các shop
        res.status(200).json({
            message: "Danh sách tất cả các shop!",
            shops,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
});

// Xóa shop theo ID (chỉ dành cho supadmin)
shopRouter.delete("/supadmin/shop/:id", supadmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm shop theo ID
        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json({ message: "Shop không tồn tại!" });
        }

        // Xóa shop
        await shop.remove();

        res.status(200).json({
            message: "Xóa shop thành công!",
            shopId: id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
});

// Lấy danh sách tất cả người dùng (chỉ dành cho supadmin)
shopRouter.get("/supadmin/users", supadmin, async (req, res) => {
    try {
        // Lấy danh sách tất cả người dùng
        const users = await User.find().select("-password"); // Loại bỏ trường password khỏi kết quả trả về

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng nào!" });
        }

        // Trả về danh sách người dùng
        res.status(200).json({
            message: "Danh sách tất cả người dùng!",
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
});

userRouter.delete("/user/:id", supadmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        // Xóa người dùng
        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "Xóa người dùng thành công!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã xảy ra lỗi!", error: error.message });
    }
});

module.exports = shopRouter;
