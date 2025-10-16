const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { exec } = require("child_process");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

// Khởi tạo database
const db = new sqlite3.Database("./lab.db", (err) => {
    if (err) {
        console.error("Lỗi kết nối database:", err);
    } else {
        console.log("Đã kết nối với SQLite database");
        initDatabase();
    }
});

// Khởi tạo cấu trúc database
function initDatabase() {
    db.serialize(() => {
        // Bảng posts
        db.run(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    )`);

        // Bảng users
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT
    )`);

        // Bảng secret
        db.run(`CREATE TABLE IF NOT EXISTS secret (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flag TEXT NOT NULL,
      description TEXT
    )`);

        // Thêm dữ liệu mẫu
        db.get("SELECT COUNT(*) as count FROM posts", (err, row) => {
            if (row.count === 0) {
                const posts = [
                    {
                        title: "Chào mừng đến với Security Lab",
                        content: "Đây là bài viết đầu tiên",
                    },
                    {
                        title: "SQL Injection là gì?",
                        content: "SQL Injection là một kỹ thuật tấn công...",
                    },
                    {
                        title: "Bảo mật web căn bản",
                        content: "Các nguyên tắc bảo mật cơ bản",
                    },
                    {
                        title: "OWASP Top 10",
                        content: "Danh sách 10 lỗ hổng phổ biến nhất",
                    },
                    {
                        title: "Cross-Site Scripting (XSS)",
                        content: "Tấn công XSS hoạt động như thế nào",
                    },
                ];

                const stmt = db.prepare(
                    "INSERT INTO posts (title, content) VALUES (?, ?)"
                );
                posts.forEach((post) => stmt.run(post.title, post.content));
                stmt.finalize();
            }
        });

        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (row.count === 0) {
                const users = [
                    {
                        username: "admin",
                        password: "admin123",
                        email: "admin@lab.local",
                    },
                    {
                        username: "user1",
                        password: "password1",
                        email: "user1@lab.local",
                    },
                    {
                        username: "user2",
                        password: "password2",
                        email: "user2@lab.local",
                    },
                ];

                const stmt = db.prepare(
                    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)"
                );
                users.forEach((user) =>
                    stmt.run(user.username, user.password, user.email)
                );
                stmt.finalize();
            }
        });

        db.get("SELECT COUNT(*) as count FROM secret", (err, row) => {
            if (row.count === 0) {
                db.run("INSERT INTO secret (flag, description) VALUES (?, ?)", [
                    "FLAG{SQL_1nj3ct10n_M4st3r}",
                    "Bí mật của hệ thống",
                ]);
            }
        });

        // Bảng comments
        db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        db.get("SELECT COUNT(*) as count FROM comments", (err, row) => {
            if (row.count === 0) {
                const comments = [
                    {
                        username: "admin",
                        comment: "Chào mừng đến với hệ thống!",
                    },
                    {
                        username: "admin",
                        comment:
                            "🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} - Chỉ admin mới thấy được!",
                    },
                    { username: "user1", comment: "Tính năng rất hay!" },
                    {
                        username: "user2",
                        comment: "Mình đã đăng nhập thành công!",
                    },
                ];

                const stmt = db.prepare(
                    "INSERT INTO comments (username, comment) VALUES (?, ?)"
                );
                comments.forEach((c) => stmt.run(c.username, c.comment));
                stmt.finalize();
            }
        });
    });
}

// Routes
app.get("/", (req, res) => {
    // AUTO-RESET: Xóa tất cả comments có XSS payload khi về trang chính
    console.log("🔄 [AUTO-RESET] Đang kiểm tra và reset comments...");

    db.all(
        "SELECT * FROM comments WHERE comment LIKE '%<script%' OR comment LIKE '%<img%' OR comment LIKE '%<svg%' OR comment LIKE '%onerror%'",
        [],
        (err, xssComments) => {
            if (!err && xssComments && xssComments.length > 0) {
                console.log(
                    `🧹 [AUTO-RESET] Tìm thấy ${xssComments.length} XSS comments, đang xóa...`
                );

                // Xóa tất cả comments
                db.run("DELETE FROM comments", (err) => {
                    if (err) {
                        console.error("❌ [AUTO-RESET] Error:", err);
                    } else {
                        console.log("✅ [AUTO-RESET] Đã xóa tất cả comments");

                        // Tạo lại comments mặc định
                        const defaultComments = [
                            {
                                username: "admin",
                                comment: "Chào mừng đến với hệ thống!",
                            },
                            {
                                username: "admin",
                                comment:
                                    "🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} - Chỉ admin mới thấy được!",
                            },
                            {
                                username: "user1",
                                comment: "Tính năng rất hay!",
                            },
                            {
                                username: "user2",
                                comment: "Mình đã đăng nhập thành công!",
                            },
                        ];

                        const stmt = db.prepare(
                            "INSERT INTO comments (username, comment) VALUES (?, ?)"
                        );
                        defaultComments.forEach((c) =>
                            stmt.run(c.username, c.comment)
                        );
                        stmt.finalize(() => {
                            console.log(
                                "✅ [AUTO-RESET] Đã khôi phục comments mặc định"
                            );
                        });
                    }
                });
            } else {
                console.log("✅ [AUTO-RESET] Comments sạch, không cần reset");
            }
        }
    );

    res.render("index");
});

// Lab SQL Injection
app.get("/lab/sqli", (req, res) => {
    // Lấy tất cả posts để hiển thị ban đầu
    db.all("SELECT id, title FROM posts", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.render("sqli-lab", { posts: [] });
        }
        res.render("sqli-lab", { posts: rows });
    });
});

// API search - CÓ LỖ HỔNG SQL INJECTION CỐ TÌNH
app.get("/api/search", (req, res) => {
    const searchTerm = req.query.q || "";

    // KHÔNG AN TOÀN - Sử dụng trực tiếp input vào query
    const query = `SELECT id, title FROM posts WHERE title LIKE '%${searchTerm}%'`;

    console.log("Query thực thi:", query);

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.json({
                error: err.message,
                query: query,
            });
        }
        res.json({
            results: rows,
            query: query,
        });
    });
});

// Lab Command Injection
app.get("/lab/cmdi", (req, res) => {
    res.render("cmdi-lab");
});

// Lab Authentication Bypass
app.get("/lab/auth", (req, res) => {
    const authCookie = req.cookies.auth;

    if (authCookie) {
        // Parse cookie username:password
        const [username] = authCookie.split(":");

        // Lấy comments
        db.all(
            "SELECT * FROM comments ORDER BY created_at DESC",
            [],
            (err, comments) => {
                if (err) {
                    return res.render("auth-lab", {
                        authenticated: false,
                        username: null,
                        comments: [],
                    });
                }
                res.render("auth-lab", {
                    authenticated: true,
                    username: username,
                    comments: comments,
                });
            }
        );
    } else {
        res.render("auth-lab", {
            authenticated: false,
            username: null,
            comments: [],
        });
    }
});

// API Login - CÓ LỖ HỔNG AUTHENTICATION BYPASS CỐ TÌNH
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, user) => {
            if (err) {
                return res.json({ success: false, error: err.message });
            }

            if (user) {
                // KHÔNG AN TOÀN - Lưu username:password vào cookie
                const authCookie = `${username}:${password}`;
                res.cookie("auth", authCookie, {
                    maxAge: 900000,
                    httpOnly: false,
                });

                console.log(
                    "Login thành công:",
                    username,
                    "- Cookie:",
                    authCookie
                );

                return res.json({ success: true, username: username });
            } else {
                return res.json({
                    success: false,
                    error: "Sai tên đăng nhập hoặc mật khẩu",
                });
            }
        }
    );
});

// API Post Comment
app.post("/api/comment", (req, res) => {
    const authCookie = req.cookies.auth;
    const { comment } = req.body;

    if (!authCookie) {
        return res.json({ success: false, error: "Chưa đăng nhập" });
    }

    const [username] = authCookie.split(":");

    db.run(
        "INSERT INTO comments (username, comment) VALUES (?, ?)",
        [username, comment],
        function (err) {
            if (err) {
                return res.json({ success: false, error: err.message });
            }

            const commentId = this.lastID;
            res.json({ success: true, commentId: commentId });
        }
    );
});

// API Logout
app.post("/api/logout", (req, res) => {
    res.clearCookie("auth");
    res.json({ success: true });
});

// API Steal Cookie - Endpoint để nhận cookie bị đánh cắp (giả lập exploit server)
app.get("/api/steal", (req, res) => {
    const stolenCookie = req.query.cookie;
    const timestamp = new Date().toISOString();

    console.log("🚨 STOLEN COOKIE RECEIVED:");
    console.log("Timestamp:", timestamp);
    console.log("Cookie:", stolenCookie);
    console.log("IP:", req.ip);
    console.log("User-Agent:", req.get("User-Agent"));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Lưu vào database để xem log
    db.run(
        "INSERT INTO comments (username, comment) VALUES (?, ?)",
        ["[HACKER-LOG]", `Stolen Cookie: ${stolenCookie} at ${timestamp}`],
        (err) => {
            if (err) console.error(err);
        }
    );

    res.send("Cookie logged successfully");
});

// API ping - CÓ LỖ HỔNG COMMAND INJECTION CỐ TÌNH
app.post("/api/ping", (req, res) => {
    const ip = req.body.ip || "";

    // KHÔNG AN TOÀN - Sử dụng trực tiếp input vào command
    const cmd = `ping -c 4 ${ip}`;

    console.log("Command thực thi:", cmd);

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            return res.json({
                error: error.message,
                command: cmd,
                output: stderr,
            });
        }
        res.json({
            command: cmd,
            output: stdout,
        });
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
