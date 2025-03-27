const express = require("express");
const { registerUser, loginUser, getUsers, verifyToken } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-token", verifyToken)
router.post("/login", loginUser);
router.get("/", getUsers);

module.exports = router;
