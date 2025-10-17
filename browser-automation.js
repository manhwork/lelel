const puppeteer = require("puppeteer");

class BrowserAutomation {
    constructor() {
        this.browser = null;
        this.page = null;
        this.isInitialized = false;
    }

    /**
     * Khởi tạo browser và page
     */
    async init() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log("🚀 [CHROME-AUTO] Đang khởi động Chrome browser...");

            this.browser = await puppeteer.launch({
                headless: false, // Hiển thị browser để user có thể thấy
                defaultViewport: { width: 1280, height: 720 },
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                ],
            });

            this.page = await this.browser.newPage();

            // Set user agent để giống browser thật
            await this.page.setUserAgent(
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            );

            this.isInitialized = true;
            console.log("✅ [CHROME-AUTO] Chrome browser đã sẵn sàng");
        } catch (error) {
            console.error(
                "❌ [CHROME-AUTO] Lỗi khởi tạo browser:",
                error.message
            );
            throw error;
        }
    }

    /**
     * Tự động đăng nhập admin và xem comment để trigger XSS
     * @param {string} baseUrl - URL của server (mặc định localhost:3000)
     */
    async autoLoginAdminAndViewComments(baseUrl = "http://localhost:3000") {
        try {
            if (!this.isInitialized) {
                await this.init();
            }

            console.log("🔐 [CHROME-AUTO] Đang đăng nhập admin...");

            // Navigate đến trang login
            await this.page.goto(`${baseUrl}/lab/auth`, {
                waitUntil: "networkidle2",
                timeout: 10000,
            });

            // Đợi form login xuất hiện
            await this.page.waitForSelector("#loginForm", { timeout: 5000 });

            // Điền thông tin đăng nhập admin
            await this.page.type("#username", "admin");
            await this.page.type("#password", "admin123");

            // Click nút đăng nhập
            await this.page.click('button[type="submit"]');

            // Đợi trang load sau khi đăng nhập
            await this.page.waitForNavigation({
                waitUntil: "networkidle2",
                timeout: 5000,
            });

            console.log("✅ [CHROME-AUTO] Admin đã đăng nhập thành công");

            // Đợi comments section load
            await this.page.waitForSelector("#commentsList", { timeout: 5000 });

            console.log("👀 [CHROME-AUTO] Admin đang xem comments...");

            // Scroll để đảm bảo tất cả comments được hiển thị
            await this.page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            // Đợi 2 giây để JavaScript execute
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log(
                "🎯 [CHROME-AUTO] XSS payload đã được trigger (nếu có)"
            );

            return true;
        } catch (error) {
            console.error(
                "❌ [CHROME-AUTO] Lỗi trong quá trình auto login:",
                error.message
            );
            return false;
        }
    }

    /**
     * Chụp screenshot để debug
     * @param {string} filename - Tên file screenshot
     */
    async takeScreenshot(filename = "xss-attack.png") {
        try {
            if (this.page) {
                await this.page.screenshot({
                    path: filename,
                    fullPage: true,
                });
                console.log(`📸 [CHROME-AUTO] Screenshot saved: ${filename}`);
            }
        } catch (error) {
            console.error(
                "❌ [CHROME-AUTO] Lỗi chụp screenshot:",
                error.message
            );
        }
    }

    /**
     * Lấy console logs từ browser
     */
    async getConsoleLogs() {
        if (this.page) {
            const logs = await this.page.evaluate(() => {
                return window.consoleLogs || [];
            });
            return logs;
        }
        return [];
    }

    /**
     * Đóng browser
     */
    async close() {
        try {
            if (this.browser) {
                await this.browser.close();
                console.log("🔒 [CHROME-AUTO] Browser đã đóng");
            }
            this.isInitialized = false;
        } catch (error) {
            console.error("❌ [CHROME-AUTO] Lỗi đóng browser:", error.message);
        }
    }

    /**
     * Kiểm tra xem browser có đang chạy không
     */
    isRunning() {
        return this.isInitialized && this.browser && this.page;
    }
}

module.exports = BrowserAutomation;
