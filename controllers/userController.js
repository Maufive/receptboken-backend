const User = require("../models/User");

exports.validateRegister = (req, res, next) => {
	// req.sanitizeBody("name");
	// req.checkBody("name", "Du måste ange ett namn!").notEmpty();
	req.checkBody("email", "Den Email-adressen är inte giltig").isEmail();
	req.sanitizeBody("email").normalizeEmail({
		// det finns flera olika inställningar för olika email-affixer som man kan använda. Se docs för mer info
		gmail_remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});
	req.checkBody("password", "Lösenord kan inte vara tomt").notEmpty();

	const errors = req.validationErrors(); // Om något går snett så lägger jag dem i en variabel som jag kan använda med req.flash för att visa användaren
	if (errors) {
		console.log(errors);
		return;
	}
	next(); // om det inte var några errors, skicka vidare till nästa middleware!
};
