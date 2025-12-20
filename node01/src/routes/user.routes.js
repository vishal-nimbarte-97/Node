const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create user
router.post("/users", authMiddleware,userController.createUser);
router.get("/get-users", authMiddleware,userController.getAllUsers);

module.exports = router;
