const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: "Du måste ange en author"
	},
	recept: {
		type: mongoose.Schema.ObjectId,
		ref: "Recept",
		required: "Du måste ange ett recept!"
	},
	rating: {
		type: Number,
		min: 1,
		max: 5
	}
});

function autopopulate(next) {
	this.populate("author");
	next();
}

reviewSchema.pre("find", autopopulate);
reviewSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Review", reviewSchema);
