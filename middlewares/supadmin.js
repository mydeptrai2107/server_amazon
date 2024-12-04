
const jwt = require("jsonwebtoken");

const supadmin = async (req, res, next) => {
    try {
        // Lấy token từ header "x-auth-token"
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({ msg: 'No auth token, access denied!' });

        // Kiểm tra và giải mã token
        const isVerified = jwt.verify(token, "passwordKey");

        if (!isVerified)
            return res.status(401).json({ msg: "Token verification failed, access denied!" });

        // Kiểm tra xem token có đúng là của admin không
        if (isVerified.type !== 'supadmin') {
            return res.status(403).json({ msg: "Access denied, admin privileges required!" });
        }

        // Tiếp tục xử lý
        next();
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = supadmin;

