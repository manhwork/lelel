const sqlite3 = require("sqlite3").verbose();
const path = require("path");

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database("./lab.db", (err) => {
                if (err) {
                    console.error("Lỗi kết nối database:", err);
                    reject(err);
                } else {
                    console.log("Đã kết nối với SQLite database");
                    resolve();
                }
            });
        });
    }

    initDatabase() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Bảng posts
                this.db.run(`CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL
                )`);

                // Bảng users
                this.db.run(`CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT
                )`);

                // Bảng secret
                this.db.run(`CREATE TABLE IF NOT EXISTS secret (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    flag TEXT NOT NULL,
                    description TEXT
                )`);

                // Bảng comments
                this.db.run(`CREATE TABLE IF NOT EXISTS comments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    comment TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);

                // Thêm dữ liệu mẫu
                this.seedData().then(resolve).catch(reject);
            });
        });
    }

    async seedData() {
        // Seed posts
        const postsCount = await this.getCount("posts");
        if (postsCount === 0) {
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

            const stmt = this.db.prepare(
                "INSERT INTO posts (title, content) VALUES (?, ?)"
            );
            posts.forEach((post) => stmt.run(post.title, post.content));
            stmt.finalize();
        }

        // Seed users
        const usersCount = await this.getCount("users");
        if (usersCount === 0) {
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

            const stmt = this.db.prepare(
                "INSERT INTO users (username, password, email) VALUES (?, ?, ?)"
            );
            users.forEach((user) =>
                stmt.run(user.username, user.password, user.email)
            );
            stmt.finalize();
        }

        // Seed secret
        const secretCount = await this.getCount("secret");
        if (secretCount === 0) {
            this.db.run(
                "INSERT INTO secret (flag, description) VALUES (?, ?)",
                ["FLAG{SQL_1nj3ct10n_M4st3r}", "Bí mật của hệ thống"]
            );
        }

        // Seed comments
        const commentsCount = await this.getCount("comments");
        if (commentsCount === 0) {
            const comments = [
                { username: "admin", comment: "Chào mừng đến với hệ thống!" },
                {
                    username: "admin",
                    comment:
                        "🚩 FLAG: FLAG{4uth_Byp4ss_C00k13_H4ck} - Chỉ admin mới thấy được!",
                },
                { username: "user1", comment: "Tính năng rất hay!" },
                { username: "user2", comment: "Mình đã đăng nhập thành công!" },
            ];

            const stmt = this.db.prepare(
                "INSERT INTO comments (username, comment) VALUES (?, ?)"
            );
            comments.forEach((c) => stmt.run(c.username, c.comment));
            stmt.finalize();
        }
    }

    getCount(table) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT COUNT(*) as count FROM ${table}`,
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });
    }

    getDb() {
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = new Database();
