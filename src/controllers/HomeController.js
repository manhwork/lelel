const Comment = require("../models/Comment");

class HomeController {
    static async index(req, res) {
        try {
            // AUTO-RESET: Xóa tất cả comments có XSS payload khi về trang chính
            console.log("🔄 [AUTO-RESET] Đang kiểm tra và reset comments...");

            const xssComments = await Comment.findXSSComments();

            if (xssComments && xssComments.length > 0) {
                console.log(
                    `🧹 [AUTO-RESET] Tìm thấy ${xssComments.length} XSS comments, đang xóa...`
                );

                await Comment.resetToDefault();
                console.log("✅ [AUTO-RESET] Đã khôi phục comments mặc định");
            } else {
                console.log("✅ [AUTO-RESET] Comments sạch, không cần reset");
            }

            res.render("index");
        } catch (error) {
            console.error("❌ [AUTO-RESET] Lỗi:", error.message);
            res.render("index");
        }
    }
}

module.exports = HomeController;
