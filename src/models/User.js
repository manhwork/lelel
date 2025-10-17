const database = require("../config/database");

class User {
    static async findByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            database
                .getDb()
                .get(
                    "SELECT * FROM users WHERE username = ? AND password = ?",
                    [username, password],
                    (err, user) => {
                        if (err) reject(err);
                        else resolve(user);
                    }
                );
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            database
                .getDb()
                .get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
                    if (err) reject(err);
                    else resolve(user);
                });
        });
    }

    static async create(userData) {
        return new Promise((resolve, reject) => {
            const { username, password, email } = userData;
            database
                .getDb()
                .run(
                    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
                    [username, password, email],
                    function (err) {
                        if (err) reject(err);
                        else resolve({ id: this.lastID, username, email });
                    }
                );
        });
    }
}

module.exports = User;
