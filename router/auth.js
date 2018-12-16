const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// ---AUTHENTICATION--- //
router.post(
	"/register",
	userController.validateRegister,
	authController.register,
	authController.login
);
/* POST REGISTER */
// router.post("/register", userController.validateRegister, (req, res, next) => {
// 	authController.register(req, res, next);
// });

/* POST LOGIN */
router.post("/login", (req, res, next) => {
	authController.login(req, res, next);
});

/* GET LOGOUT */
router.get("/logout", authController.logout);

module.exports = router;
