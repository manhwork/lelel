const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = 900000; // 15 phút
const CHROME_AUTO_DELAY = 3000; // 3 giây
const BROWSER_CLOSE_DELAY = 5000; // 5 giây

const XSS_PATTERNS = ["<script", "<img", "<svg", "onerror", "javascript:"];

const DEFAULT_COMMENTS = [
    { username: "admin", comment: "Chào mừng đến với hệ thống!" },
    {
        username: "admin",
        comment:
            "🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} - Chỉ admin mới thấy được!",
    },
    { username: "user1", comment: "Tính năng rất hay!" },
    { username: "user2", comment: "Mình đã đăng nhập thành công!" },
];

module.exports = {
    PORT,
    COOKIE_MAX_AGE,
    CHROME_AUTO_DELAY,
    BROWSER_CLOSE_DELAY,
    XSS_PATTERNS,
    DEFAULT_COMMENTS,
};
