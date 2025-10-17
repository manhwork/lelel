const Post = require("../models/Post");

class SQLIController {
    static async lab(req, res) {
        try {
            const posts = await Post.getAll();
            res.render("sqli-lab", { posts: posts });
        } catch (error) {
            console.error("SQLI Lab Error:", error);
            res.render("sqli-lab", { posts: [] });
        }
    }

    static async search(req, res) {
        try {
            const searchTerm = req.query.q || "";
            const result = await Post.search(searchTerm);

            console.log("Query thực thi:", result.query);

            res.json({
                results: result.results,
                query: result.query,
            });
        } catch (error) {
            res.json({
                error: error.message,
                query: `SELECT id, title FROM posts WHERE title LIKE '%${
                    req.query.q || ""
                }%'`,
            });
        }
    }
}

module.exports = SQLIController;
