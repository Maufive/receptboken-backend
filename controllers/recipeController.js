const Recept = require("../models/Recept");
const passport = require("passport");

exports.getHeartedRecipes = async (req, res, next) => {
	passport.authenticate("jwt", { session: false }, async (error, user) => {
		if (!user) res.redirect("/login");

		const recept = await Recept.find({
			_id: { $in: user.hearts }
		});
		res.json(recept);
	})(req, res);
};

exports.getHearts = async (req, res) => {
	const stores = await Store.find({
		_id: { $in: req.user.hearts }
	});
	res.render("stores", { title: "Hearted Stores", stores });
};
