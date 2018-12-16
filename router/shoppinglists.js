const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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
  Skicka alla alla inköpslistor (Namnet på receptet) från databasen till klient
  
*/

/*
  GET request (singel)
  Skicka den inköpslista med det id´t som skickas från klienten
*/

module.exports = router;
