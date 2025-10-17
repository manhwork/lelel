const Comment = require("../models/Comment");
const BrowserAutomationService = require("../services/BrowserAutomationService");

class CommentController {
    constructor() {
        this.browserService = new BrowserAutomationService();
    }

    async create(req, res) {
        try {
            const authCookie = req.cookies.auth;
            const { comment } = req.body;

            if (!authCookie) {
                return res.json({ success: false, error: "Chưa đăng nhập" });
            }

            const [username] = authCookie.split(":");
            const result = await Comment.create(username, comment);

            res.json({ success: true, commentId: result.id });

            // CHROME-AUTO: Tự động mở Chrome để đăng nhập admin và trigger XSS
            await this.browserService.handleXSSComment(
                comment,
                process.env.PORT || 3000
            );
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }
}

module.exports = CommentController;
