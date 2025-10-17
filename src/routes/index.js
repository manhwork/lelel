const express = require("express");
const router = express.Router();

// Import controllers
const HomeController = require("../controllers/HomeController");
const SQLIController = require("../controllers/SQLIController");
const AuthController = require("../controllers/AuthController");
const CMDIController = require("../controllers/CMDIController");
const ExploitController = require("../controllers/ExploitController");
const CommentController = require("../controllers/CommentController");

// Initialize comment controller
const commentController = new CommentController();

// Home routes
router.get("/", HomeController.index);

// Lab routes
router.get("/lab/sqli", SQLIController.lab);
router.get("/lab/auth", AuthController.lab);
router.get("/lab/cmdi", CMDIController.lab);

// API routes
router.get("/api/search", SQLIController.search);
router.post("/api/login", AuthController.login);
router.post("/api/logout", AuthController.logout);
router.post("/api/comment", commentController.create.bind(commentController));
router.post("/api/ping", CMDIController.ping);
router.get("/api/steal", ExploitController.stealCookie);

module.exports = router;
