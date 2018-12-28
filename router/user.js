const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Recept = require("../models/Recept");
const User = mongoose.model("User");
const { catchErrors } = require("../helpers/errorHandler");
const recipeController = require("../controllers/recipeController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// --- GET USERS LISTENING  ---//
router.get("/", function(req, res, next) {
	// res.send('reponde with a resource');
});

// --- PROTECTED ROUTES ---//
router.get(
	"/profile",
	catchErrors(async (req, res, next) => {
		passport.authenticate(
			"jwt",
			{ session: false },
			async (error, user, info) => {
				if (!user) return next();
				res.json({ user });
			}
		)(req, res, next);
	})
);

/* Hämta alla recept som användaren har skapat. */
router.get(
	"/created/:id",
	catchErrors(async (req, res) => {
		const recept = await Recept.find({ author: req.params.id }).populate(
			"reviews"
		);
		return res.json(recept);
	})
);

/* Spara ett recept till användarens lista "Heart" */
router.post(
	"/hearts/:id",
	catchErrors(async (req, res) => {
		passport.authenticate("jwt", { session: false }, async (error, user) => {
			if (!user) {
				res.redirect("/");
			}
			// Receptets ID finns i params, och användarens ID finns i JWTtoken.
			// Ta båda dem och spara receptets id till användarens "hearts"-array.
			// 1. Om användaren har sparat recept tidigare, gör dem till strings
			const hearts = user.hearts.map(obj => obj.toString());
			// 2. Kolla om IDt i params matchar något av ID som redan finns i hearts arrayen
			const operator = hearts.includes(req.params.id) ? "$pull" : "$addToSet";
			// 3. Hitta receptet och antingen spara ett heart eller ta bort ett heart
			const updatedUser = await User.findByIdAndUpdate(
				user._id,
				{ [operator]: { hearts: req.params.id } },
				{ new: true }
			);
			res.json(updatedUser);
		})(req, res);
	})
);

/* Hämta alla recept som användaren sparat till sina "Hearts" */
router.get("/hearts/:id", recipeController.getHeartedRecipes);

/* Hämta en specifik användare */
router.get("/profile/author/:id", userController.getUser);

/* Redigera en profil */
router.post("/edit/:id", userController.editUser);

module.exports = router;
