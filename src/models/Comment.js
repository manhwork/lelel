const database = require("../config/database");
const { XSS_PATTERNS, DEFAULT_COMMENTS } = require("../config/constants");

class Comment {
    static async getAll() {
        return new Promise((resolve, reject) => {
            database
                .getDb()
                .all(
                    "SELECT * FROM comments ORDER BY created_at DESC",
                    [],
                    (err, comments) => {
                        if (err) reject(err);
                        else resolve(comments);
                    }
                );
        });
    }

    static async create(username, comment) {
        return new Promise((resolve, reject) => {
            database
                .getDb()
                .run(
                    "INSERT INTO comments (username, comment) VALUES (?, ?)",
                    [username, comment],
                    function (err) {
                        if (err) reject(err);
                        else resolve({ id: this.lastID, username, comment });
                    }
                );
        });
    }

    static async findXSSComments() {
        return new Promise((resolve, reject) => {
            const patterns = XSS_PATTERNS.map(
                (pattern) => `comment LIKE '%${pattern}%'`
            ).join(" OR ");
            const query = `SELECT * FROM comments WHERE ${patterns}`;

            database.getDb().all(query, [], (err, comments) => {
                if (err) reject(err);
                else resolve(comments);
            });
        });
    }

    static async deleteAll() {
        return new Promise((resolve, reject) => {
            database.getDb().run("DELETE FROM comments", (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async resetToDefault() {
        return new Promise((resolve, reject) => {
            this.deleteAll()
                .then(() => {
                    const stmt = database
                        .getDb()
                        .prepare(
                            "INSERT INTO comments (username, comment) VALUES (?, ?)"
                        );
                    DEFAULT_COMMENTS.forEach((c) =>
                        stmt.run(c.username, c.comment)
                    );
                    stmt.finalize((err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                })
                .catch(reject);
        });
    }

    static hasXSSPayload(comment) {
        return XSS_PATTERNS.some((pattern) => comment.includes(pattern));
    }
}

module.exports = Comment;
