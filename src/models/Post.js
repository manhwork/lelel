const database = require("../config/database");

class Post {
    static async getAll() {
        return new Promise((resolve, reject) => {
            database
                .getDb()
                .all("SELECT id, title FROM posts", [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
        });
    }

    static async search(searchTerm) {
        return new Promise((resolve, reject) => {
            // KHÔNG AN TOÀN - Sử dụng trực tiếp input vào query (cố tình để demo SQL Injection)
            const query = `SELECT id, title FROM posts WHERE title LIKE '%${searchTerm}%'`;

            database.getDb().all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve({ results: rows, query: query });
            });
        });
    }

    static async getById(id) {
        return new Promise((resolve, reject) => {
            database
                .getDb()
                .get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
        });
    }
}

module.exports = Post;
