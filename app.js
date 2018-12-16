const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./router/auth");
const user = require("./router/user");
const shoppinglists = require("./router/shoppinglists");
const recipe = require("./router/recipe");
require("./models/User");
require("dotenv").config({ path: "./variables.env" });
require("./passport");

const app = express();

mongoose.connect(
	process.env.DATABASE,
	{ useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.once("open", function() {
	console.log("Ansluten till databasen! 🎉 🎉 🎉 ");
});

app.use(cors());

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Får tillgång till flera methods för att validera data. Används mycket då jag skapar användare.
app.use(expressValidator());
app.use(passport.initialize());

app.use("/auth", auth);
app.use("/user", user);
app.use("/recipe", recipe);
app.use("/lists", shoppinglists);

app.listen(process.env.PORT, err => {
	if (err) throw err;
	console.log(`>>> Now running on port: ${process.env.PORT} <<<`);
});
