const express = require("express");
const router = express.Router();
const { catchErrors } = require("../helpers/errorHandler");
const listController = require("../controllers/listController");

/*
  POST request
  1. Klienten skickar ett id på ett recept
  2. Hitta receptet i databasen
  3. Spara receptets ingredienser + namnet på receptet i en ny Model Ingredienser.js
*/
router.post("/add/:id", catchErrors(listController.addList));

/*
  GET request (flera)
  Ta användarens ID, hitta alla inköpslistor med det ID't på och skicka tillbaka ID och titel
*/

router.get("/user/:id", catchErrors(listController.getUserList));

/*
  GET request (singel)
  Skicka den inköpslista med det id´t som skickas från klienten
*/
router.get("/:id", catchErrors(listController.getList));

/*
  POST request
  Redigera en inköpslista. Dvs lägg till fler items till "ingrediens-arrayen"
*/
router.post("/update/:id", catchErrors(listController.updateList));

module.exports = router;
