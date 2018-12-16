const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const InredientsSchema = new Schema({
	input: {
		type: String,
		required: "Du måste ange namnet på ingrediensen!",
		trim: true
	},
	numberOfUnits: {
		type: Number,
		required: "Du måste ange hur mycket av varje ingrediens!",
		min: 0.5,
		max: 999
	},
	units: {
		type: String,
		required: "Du måste ange en enhet!"
	}
});

const RecipeSchema = new Schema(
	{
		title: {
			type: String,
			required: "Du måste ange en titel",
			trim: true
		},
		timeRequired: {
			type: Number,
			required: "Försök ge ett ungefär hur lång tid det tar",
			min: 5, // 5 minuter
			max: 180 // 3 timmar
		},
		tags: {
			type: [String]
		},
		ingredients: {
			type: [InredientsSchema],
			required: "Du måste ange ingredienser",
			trim: true
		},
		description: {
			type: [String], // tror jag? Tänker mig en bulletlist steg för steg som man loopar över
			trim: true
		},
		servings: {
			type: Number,
			required: true,
			min: 2,
			max: 8
		},
		created: {
			type: Date,
			default: Date.now
		},
		photo: String,
		author: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: "You must supply an author"
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

RecipeSchema.index({
	name: "text",
	ingredients: "text"
});

// hitta reviews där receptets _id prop === reviews recept prop
RecipeSchema.virtual("reviews", {
	ref: "Review", // Vilken model som ska länkas
	localField: "_id", // Vilket fält på Receptet
	foreignField: "recept" // Vilket fält på reviewen
});

function autopopulate(next) {
	this.populate("reviews");
	next();
}

RecipeSchema.pre("find", autopopulate);
RecipeSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Recipe", RecipeSchema);
