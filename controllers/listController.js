const passport = require("passport");
const Recept = require("../models/Recept");
const ShoppingList = require("../models/ShoppingList");

exports.getList = async (req, res) => {
	passport.authenticate("jwt", { session: false }, async (error, user) => {
		if (!user) res.redirect("/login");
		if (error) console.log(error);
		// Ta idt från params
		const id = req.params.id;
		// Hitta inköpslistan i databasen
		const shoppinglist = await ShoppingList.findOne({ _id: id });
		// Skicka tillbaka inköpslistan
		return res.json(shoppinglist);
	})(req, res);
};

exports.getUserList = async (req, res) => {
	passport.authenticate("jwt", { session: false }, async (error, user) => {
		if (!user) res.redirect("/login");
		// Ta användarens ID från params
		const userId = req.params.id;
		// Hitta alla inköpslistor som användaren gjort
		const shoppinglists = await ShoppingList.find({ author: userId }).sort({
			created: "desc"
		});
		// skicka tillbaka en array med inköpslistor
		return res.json(shoppinglists);
	})(req, res);
};

/* 
  --> När man sparar en inköpslista gör den mer lik ICAs
  Användaren klickar på "Lägg till i inköpslista" på ett recept, då visas en Modal för användaren
  där den får välja vilken inköpslista denne vill spara till eller eventuellt skapa en ny 
  inköpslista. När Modalen visas måste jag då hämta alla inköpslistor som användaren skapat samt
  ha en knapp för att skapa en ny inköpslista samt lägga till befintlig inköpslista
*/

exports.addList = async (req, res) => {
	passport.authenticate("jwt", { session: false }, async (error, user) => {
		if (!user) return res.redirect("/login");
		// Plocka ut titeln från requesten
		const title = req.body.title;
		// Plocka ut ID't på det receptet och hitta det i databasen
		const receptId = req.params.id;
		const recept = await Recept.findOne({ _id: receptId });
		// Plocka ut ingredienserna från receptet
		const ingredientsArray = recept.ingredients;
		// Hitta användarens ID som inköpslistan ska sparas till
		const userId = user._id;
		// Sammanställ ett obj med de olika delarna
		const Shoppinglist = {};
		Shoppinglist.list = ingredientsArray;
		Shoppinglist.title = title;
		Shoppinglist.author = userId;
		// Spara en ny inköpslista med ingredienser, titel och användare
		const shoppinglist = new ShoppingList(Shoppinglist);
		await shoppinglist.save();
		// När inköpslistan är sparad, skicka tillbaka IDt
		return res.json({
			id: shoppinglist._id,
			title: shoppinglist.title,
			message: `Ny inköpslista: ${title}.`
		});
	})(req, res);
};

/*
  Updatera en inköpslista ifall användaren vill lägga till ingredienserna i en redan befintlig
  inköpslista. Tillexempel om man ska handla till flera recept så man inte måste ha flera listor.
*/
exports.updateList = async (req, res) => {
	passport.authenticate("jwt", { session: false }, async (error, user) => {
		// Plocka ut de olika arraysen i req.body
		const oldItems = req.body.oldItems;
		const newItems = req.body.newItems;
		// Slå ihop dem till en array
		// const newList = [...oldItems, newItems];
		const list = newItems.concat(oldItems);
		// Updatera inköpslistan i databasen
		const shoppinglist = await ShoppingList.findOneAndUpdate(
			{ _id: req.params.id }, // Query
			{ list: list }, // Data
			{
				// Options
				new: true, // Säger åt MongoDB att spara den nya listan istället för den gamla
				runValidators: true // Ser till att required-fields finns kvar
			}
		).exec(); // Runs the query
		// Försäkra om att den som ska updatera listan är author till inköpslistan
		res.json({
			message: `Ingredienserna sparades i ${shoppinglist.title}`,
			list
		});
	})(req, res);
};
