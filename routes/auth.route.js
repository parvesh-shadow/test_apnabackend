const express = require("express");
const { login, checkAuth } = require("../controllers/authController");
const verifyAdminToken = require("../middleware/protected");
const router = express.Router();

router.post("/login", login)
router.get("/isAuthenticated",verifyAdminToken, checkAuth)
module.exports = router;
