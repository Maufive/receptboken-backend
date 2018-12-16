const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
	list: {
		type: Array,
		required
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required
	}
});

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
