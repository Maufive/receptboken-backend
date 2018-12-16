const express = require("express");
const router = express.Router();
const passport = require("passport");
const Recept = require("../models/Recept");
const reviewController = require("../controllers/reviewController");
const { catchErrors } = require("../helpers/errorHandler");

/* GET RECIPES */
router.get(
	"/",
	catchErrors(async (req, res, next) => {
		const recept = await Recept.find().sort({ created: "desc" });
		res.json(recept);
	})
);

router.get(
	"/:id",
	catchErrors(async (req, res) => {
		const recept = await Recept.findOne({ _id: req.params.id }).populate(
			"reviews"
		);
		res.json(recept);
	})
);

// --- PROTECTED ROUTES ---//
/* POST RECIPE */
router.post(
	"/add",
	catchErrors(async (req, res, next) => {
		// Se till att användaren är inloggad
		passport.authenticate(
			"jwt",
			{ session: false },
			async (error, user, info) => {
				if (!user) {
					res.redirect("/login");
				}
				// Plocka idt från user i JWT och stoppa in det som author på req.body
				req.body.author = user._id;
				const recept = await new Recept(req.body).save();
				// När receptet är sparat så omdirigeras användaren (clientside) till receptet som just sparats med idt som skickas här
				return res.json({
					id: recept._id,
					message: "Snyggt! Ditt recept är nu sparat i databasen"
				});
			}
		)(req, res, next);
	})
);

const confirmOwner = (recept, user) => {
	if (!recept.author.equals(user._id)) {
		console.log("Ajabaja! du äger inte receptet");
		throw Error("Endast den som skapat receptet kan ta bort det!");
	}
};

/* DELETE RECIPE */
// Se till att den skickar requesten är den som skapat receptet
router.post(
	"/delete/:id",
	catchErrors(async (req, res, next) => {
		passport.authenticate(
			"jwt",
			{ session: false },
			async (error, user, info) => {
				if (!user) return res.redirect("/login");
				// 1. Hitta receptet i databasen
				const recept = await Recept.findOne({ _id: req.params.id });
				// 2. Bekräfta ägaren av receptet
				confirmOwner(recept, user);
				// 3. Ta bort receptet från databasen
				const remove = await Recept.findByIdAndDelete({ _id: recept.id });
				return res.json(remove);
			}
		)(req, res, next);
	})
);

/* REVIEW RECIPE */
// Form skickas med ett betyg på receptet som sparas till databasen
router.post("/review/:id", catchErrors(reviewController.addReview));

module.exports = router;
