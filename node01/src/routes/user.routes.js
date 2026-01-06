const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Create user
router.post("/users", userController.createUser);
router.get("/get-users", userController.getAllUsers);

module.exports = router;
