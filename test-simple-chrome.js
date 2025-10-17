const BrowserAutomation = require("./browser-automation");

async function testChromeAutomation() {
    console.log("🧪 Testing Chrome Automation...");

    const browserAuto = new BrowserAutomation();

    try {
        // Test khởi tạo browser
        await browserAuto.init();
        console.log("✅ Browser initialized successfully");

        // Test auto login
        const success = await browserAuto.autoLoginAdminAndViewComments(
            "http://localhost:3000"
        );

        if (success) {
            console.log("✅ Auto login successful");

            // Chụp screenshot
            await browserAuto.takeScreenshot("test-screenshot.png");
            console.log("✅ Screenshot taken");

            // Đợi 3 giây
            await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
            console.log("❌ Auto login failed");
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        // Đóng browser
        await browserAuto.close();
        console.log("✅ Browser closed");
    }
}

// Chạy test
testChromeAutomation();
