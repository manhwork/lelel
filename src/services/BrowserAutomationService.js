const BrowserAutomation = require("../../browser-automation");
const {
    CHROME_AUTO_DELAY,
    BROWSER_CLOSE_DELAY,
} = require("../config/constants");

class BrowserAutomationService {
    constructor() {
        this.browserAutomation = new BrowserAutomation();
    }

    async handleXSSComment(comment, port) {
        console.log(
            "🚀 [CHROME-AUTO] Phát hiện comment mới, chuẩn bị mở Chrome..."
        );

        const hasXSSPayload = this.hasXSSPayload(comment);

        if (hasXSSPayload) {
            console.log(
                "🎯 [CHROME-AUTO] XSS payload detected! Sẽ mở Chrome sau 3 giây..."
            );

            setTimeout(async () => {
                try {
                    console.log("🌐 [CHROME-AUTO] Đang mở Chrome browser...");

                    const success =
                        await this.browserAutomation.autoLoginAdminAndViewComments(
                            `http://localhost:${port}`
                        );

                    if (success) {
                        console.log(
                            "✅ [CHROME-AUTO] Chrome automation hoàn thành!"
                        );

                        // Chụp screenshot để debug
                        await this.browserAutomation.takeScreenshot(
                            `xss-attack-${Date.now()}.png`
                        );

                        // Đợi 5 giây rồi đóng browser
                        setTimeout(async () => {
                            await this.browserAutomation.close();
                            console.log("🔒 [CHROME-AUTO] Browser đã đóng");
                        }, BROWSER_CLOSE_DELAY);
                    } else {
                        console.log(
                            "❌ [CHROME-AUTO] Chrome automation thất bại"
                        );
                    }
                } catch (error) {
                    console.error("❌ [CHROME-AUTO] Lỗi:", error.message);

                    // Đóng browser nếu có lỗi
                    try {
                        await this.browserAutomation.close();
                    } catch (closeError) {
                        console.error(
                            "❌ [CHROME-AUTO] Lỗi đóng browser:",
                            closeError.message
                        );
                    }
                }
            }, CHROME_AUTO_DELAY);
        } else {
            console.log(
                "ℹ️ [CHROME-AUTO] Comment không chứa XSS payload, bỏ qua Chrome automation"
            );
        }
    }

    hasXSSPayload(comment) {
        const patterns = ["<script", "<img", "<svg", "onerror", "javascript:"];
        return patterns.some((pattern) => comment.includes(pattern));
    }

    async close() {
        try {
            await this.browserAutomation.close();
            console.log("✅ [CHROME-AUTO] Browser đã đóng");
        } catch (error) {
            console.error("❌ [CHROME-AUTO] Lỗi đóng browser:", error.message);
        }
    }
}

module.exports = BrowserAutomationService;
