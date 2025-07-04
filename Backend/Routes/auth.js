const express = require("express");
const {
  signup,
  login,
  logout,
  verifyUser,
  forgotPassword,
  resetPassword,
  checkAuth
} = require("../Controllers/auth.controllers");

const{verifyToken} = require("../Middleware/verifyToken")
const router = express.Router();

router.get("/check-auth",verifyToken , checkAuth);

router.post("/signup", signup);

router.post("/verifyUser", verifyUser);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password" , forgotPassword)
router.post("/reset-password/:token",resetPassword )

module.exports = router;
