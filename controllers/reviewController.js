const mongoose = require("mongoose");
// const Review = mongoose.model("Review");
const Review = require("../models/Review");
const passport = require("passport");

exports.addReview = async (req, res, next) => {
	passport.authenticate(
		"jwt",
		{ session: false },
		async (error, user, info) => {
			if (!user) {
				console.log("No user <------");
				res
					.status(500)
					.send({ error: "Du måste logga in för att lämna ett betyg" });
			}
			if (error) {
				console.log(error);
			}
			req.body.author = user._id;
			req.body.recept = req.params.id;
			const newReview = new Review(req.body);
			await newReview.save();
			// res.redirect("back");
			res.json({ message: "Tack!", loading: false, saved: true });
		}
	)(req, res, next);
};
