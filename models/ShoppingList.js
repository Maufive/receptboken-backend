const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
	list: {
		type: Array,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		required: true
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: "Du måste ange en author"
	}
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
