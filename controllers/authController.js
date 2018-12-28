const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config({ path: "./variables.env" });

// ---AUTHENTICATION--- //

/* POST REGISTER */
exports.register = async (req, res, next) => {
	try {
		User.register(
			new User({
				username: req.body.email,
				fname: req.body.fname,
				lname: req.body.lname
			}),
			req.body.password, // Lösenordet tas hand om av PassportJS
			function(err, account) {
				if (err) {
					return res.status(500).send(err.message);
				}

				passport.authenticate("local", { session: false })(req, res, () => {
					res.status(200).json({
						message: "Härligt! Ditt konto är nu redo att användas.",
						user: account
					});
				});
			}
		);
	} catch (err) {
		return res.status(500).json({ err });
	}
};

/* POST LOGIN */
exports.login = async (req, res, next) => {
	try {
		if (!req.body.email || !req.body.password) {
			return res.status(500).send({
				error: "Har du fyllt i alla fält?"
			});
		}
		passport.authenticate("local", { session: false }, (err, user, info) => {
			if (err || !user) {
				let message = null;
				if (info.name === "IncorrectPasswordError") {
					message = "Oops! Fel lösenord...";
				} else {
					message = "Det finns ingen användare registrerad med den mailen.";
				}
				return res.status(404).send({ message });
			}
			req.login(user, { session: false }, err => {
				if (err) {
					res.send({ err });
				}
				// generera en påskriven JWT token med tillhörande information på objektet och returnera det i responset
				// just nu är det bara användarnamnet (email) och JWT-token o namn.
				const token = jwt.sign(
					{ id: user.id, email: user.username },
					process.env.SECRET
				);
				return res.json({ user, token });
			});
		})(req, res);
	} catch (err) {
		console.log(err);
	}
};

/* POST VERIFY USER */
// Authentisera användaren och plocka ut IDt från req.body och jåmför de  så de stämmer överens
exports.verifyUser = async (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (error, user) => {
		const userId = req.params.id;
		const verified = user._id.equals(userId);
		res.send(verified);
	})(req, res, next);
};

/* GET LOGOUT */
// För att göra en logout med JWT så måste jag lägga in en funktion i klienten som tar bort JWT från localStorage
// och användaren "loggas" ut.
exports.logout = (req, res) => {
	req.logout();
	res.json({ message: "Du är nu utloggad! På återseende." });
};
