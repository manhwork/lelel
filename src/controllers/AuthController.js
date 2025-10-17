const User = require("../models/User");
const Comment = require("../models/Comment");
const { COOKIE_MAX_AGE } = require("../config/constants");

class AuthController {
    static async lab(req, res) {
        try {
            const authCookie = req.cookies.auth;

            if (authCookie) {
                const [username] = authCookie.split(":");
                const comments = await Comment.getAll();

                res.render("auth-lab", {
                    authenticated: true,
                    username: username,
                    comments: comments,
                });
            } else {
                res.render("auth-lab", {
                    authenticated: false,
                    username: null,
                    comments: [],
                });
            }
        } catch (error) {
            console.error("Auth Lab Error:", error);
            res.render("auth-lab", {
                authenticated: false,
                username: null,
                comments: [],
            });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findByCredentials(username, password);

            if (user) {
                // KHÔNG AN TOÀN - Lưu username:password vào cookie (cố tình để demo)
                const authCookie = `${username}:${password}`;
                res.cookie("auth", authCookie, {
                    maxAge: COOKIE_MAX_AGE,
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
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    }

    static async logout(req, res) {
        res.clearCookie("auth");
        res.json({ success: true });
    }
}

module.exports = AuthController;
