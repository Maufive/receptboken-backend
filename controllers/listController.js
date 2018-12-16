const passport = require("passport");
const Recept = require("../models/Recept");

exports.addList = async (req, res) => {
	passport.authenticate("jwt", { session: false }, async (error, user) => {
		if (!user) res.redirect("/login");
		// Hitta receptet med IDt
		const id = req.params.id;
		const recept = await Recept.findOne({ _id: id });
		// Plocka ut Ingredienserna från receptet
		const ingredients = recept.ingredients;
		// Spara en ny inköpslista med ingredienserna
		res.json(recept);
	})(req, res);
};
