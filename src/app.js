const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const { PORT } = require("./config/constants");
const routes = require("./routes");
const {
    logSuspiciousActivity,
    setSecurityHeaders,
} = require("./middleware/security");
const BrowserAutomationService = require("./services/BrowserAutomationService");

class App {
    constructor() {
        this.app = express();
        this.port = PORT;
        this.browserService = new BrowserAutomationService();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Basic middleware
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(express.static("public"));
        this.app.use(cookieParser());
        this.app.set("view engine", "ejs");

        // Security middleware
        this.app.use(logSuspiciousActivity);
        this.app.use(setSecurityHeaders);
    }

    setupRoutes() {
        this.app.use("/", routes);
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).send("404 - Page Not Found");
        });

        // Error handler
        this.app.use((err, req, res, next) => {
            console.error("Error:", err);
            res.status(500).send("500 - Internal Server Error");
        });
    }

    async start() {
        try {
            // Initialize database
            await database.connect();
            await database.initDatabase();

            // Start server
            this.server = this.app.listen(this.port, () => {
                console.log(
                    `Server đang chạy tại http://localhost:${this.port}`
                );
                console.log("🚀 Chrome Auto-Login feature đã sẵn sàng!");
            });

            // Setup graceful shutdown
            this.setupGracefulShutdown();
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    }

    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            console.log(`\n🛑 [CHROME-AUTO] Đang dừng server... (${signal})`);

            try {
                await this.browserService.close();
                console.log("✅ [CHROME-AUTO] Browser đã đóng");
            } catch (error) {
                console.error(
                    "❌ [CHROME-AUTO] Lỗi đóng browser:",
                    error.message
                );
            }

            this.server.close(() => {
                console.log("🔒 Server đã dừng");
                database.close();
                process.exit(0);
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    }
}

module.exports = App;
