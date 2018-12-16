const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const validator = require("validator");
const md5 = require("md5");
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
	fname: {
		type: String,
		// required: "Please supply a name",
		trim: true
	},
	lname: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		unique: "Det finns redan en användare med denna email",
		lowercase: true,
		trim: true,
		validator: [validator.isEmail, "Ogiltig Epost Adress"]
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	hearts: [{ type: mongoose.Schema.ObjectId, ref: "Recept" }]
});

UserSchema.virtual("gravatar").get(function() {
	const hash = md5(this.email);
	return `https://gravatar.com/avatar/${hash}?s=200`;
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
